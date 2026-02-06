'use client'

import * as React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    getFilteredRowModel,
} from '@tanstack/react-table';
import { MoreHorizontal, PlusCircle, Trash2, Loader2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { articleService } from '@/lib/services';
import type { Article } from '@/lib/types';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { useToast } from '@/hooks/use-toast';

export function ArticlesTable() {
    const [data, setData] = React.useState<Article[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [isAddArticleOpen, setAddArticleOpen] = React.useState(false);
    const [editingArticle, setEditingArticle] = React.useState<Article | null>(null);
    const [deletingArticle, setDeletingArticle] = React.useState<Article | null>(null);
    const { toast } = useToast();

    const fetchArticles = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const articles = await articleService.getAll({ includeScheduled: true });
            setData(articles);
        } catch (error) {
            console.error('Error fetching articles:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch articles.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchArticles();
    }, [fetchArticles]);

    const deleteArticle = async (articleSlug: string) => {
        try {
            await articleService.delete(articleSlug);
            setData(data.filter(article => article.slug !== articleSlug));
            toast({
                title: 'Article deleted',
                description: 'The article has been successfully removed.',
            });
        } catch (error) {
            console.error('Error deleting article:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete the article.',
                variant: 'destructive',
            });
        }
    };

    const addArticle = async (article: Omit<Article, 'slug'>) => {
        try {
            const slug = article.title.toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\p{L}\p{N}-]+/gu, '') // Keep Unicode letters and numbers
                || `article-${Date.now()}`; // Fallback if slug becomes empty
            await articleService.create({ ...article, slug });
            await fetchArticles();
            setAddArticleOpen(false);
            toast({
                title: 'Article added',
                description: 'The new article has been successfully saved.',
            });
        } catch (error) {
            console.error('Error adding article:', error);
            toast({
                title: 'Error',
                description: 'Failed to add the article.',
                variant: 'destructive',
            });
        }
    };

    const updateArticle = async (updatedArticle: Article) => {
        try {
            await articleService.update(updatedArticle.slug, updatedArticle);
            await fetchArticles();
            setEditingArticle(null);
            toast({
                title: 'Article updated',
                description: 'The article has been successfully updated.',
            });
        } catch (error) {
            console.error('Error updating article:', error);
            toast({
                title: 'Error',
                description: 'Failed to update the article.',
                variant: 'destructive',
            });
        }
    };


    const columns: ColumnDef<Article>[] = [
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('title')}</div>
            ),
        },
        {
            accessorKey: 'author',
            header: 'Author',
        },
        {
            accessorKey: 'date',
            header: 'Date Published',
            cell: ({ row }) => {
                try {
                    return format(new Date(row.getValue('date')), 'MMMM d, yyyy');
                } catch (e) {
                    return row.getValue('date');
                }
            }
        },
        {
            accessorKey: 'excerpt',
            header: 'Excerpt',
            cell: ({ row }) => <p className="line-clamp-2 max-w-sm text-muted-foreground">{row.getValue('excerpt')}</p>
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const article = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setEditingArticle(article)}>
                                Edit Article
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onSelect={() => setDeletingArticle(article)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Article
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-24">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading articles...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Filter by title..."
                    value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                        table.getColumn('title')?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Dialog open={isAddArticleOpen} onOpenChange={setAddArticleOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setAddArticleOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Article
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl">
                        <DialogHeader>
                            <DialogTitle>Add a New Article</DialogTitle>
                            <DialogDescription>
                                Fill out the form below to add a new article.
                            </DialogDescription>
                        </DialogHeader>
                        <ArticleForm
                            key="add-article-form"
                            onSubmit={addArticle}
                            onSuccess={() => { }}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <Dialog open={!!editingArticle} onOpenChange={(isOpen) => !isOpen && setEditingArticle(null)}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Edit Article</DialogTitle>
                        <DialogDescription>
                            Update the details for "{editingArticle?.title}".
                        </DialogDescription>
                    </DialogHeader>
                    {editingArticle && (
                        <ArticleForm
                            key={editingArticle.slug}
                            initialData={editingArticle}
                            onSubmit={(articleData) => {
                                updateArticle({ ...articleData, slug: editingArticle.slug });
                            }}
                            onSuccess={() => { }}
                        />
                    )}
                </DialogContent>
            </Dialog>
            <AlertDialog open={!!deletingArticle} onOpenChange={(isOpen) => !isOpen && setDeletingArticle(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the article
                            "{deletingArticle?.title}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            if (deletingArticle) {
                                deleteArticle(deletingArticle.slug)
                                setDeletingArticle(null)
                            }
                        }}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
