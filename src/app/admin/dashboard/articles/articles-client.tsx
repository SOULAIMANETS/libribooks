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
import { useRouter, useSearchParams } from 'next/navigation';
import { MoreHorizontal, PlusCircle, Trash2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import type { Article, Author } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArticleForm, ArticleFormValues } from '@/components/admin/ArticleForm';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { addArticle, updateArticle, deleteArticle } from './actions';

interface ArticlesClientProps {
  articles: Article[];
  authors: Author[];
  totalPages: number;
}

export function ArticlesClient({ articles: initialArticles, authors, totalPages }: ArticlesClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;

    const [data, setData] = React.useState(initialArticles);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [isAddArticleOpen, setAddArticleOpen] = React.useState(false);
    const [editingArticle, setEditingArticle] = React.useState<Article | null>(null);
    const [deletingArticle, setDeletingArticle] = React.useState<Article | null>(null);
    const { toast } = useToast();

    const handleAddArticle = async (articleData: ArticleFormValues) => {
        const result = await addArticle(articleData);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setAddArticleOpen(false);
            router.refresh();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    const handleUpdateArticle = async (articleData: ArticleFormValues) => {
        if (!editingArticle) return;
        const result = await updateArticle({ ...editingArticle, ...articleData });
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setEditingArticle(null);
            router.refresh();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    const handleDeleteArticle = async (articleId: number) => {
        const result = await deleteArticle(articleId);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setDeletingArticle(null);
            router.refresh();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
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
        pageCount: totalPages,
        manualPagination: true,
        state: {
          sorting,
          columnFilters,
          pagination: {
            pageIndex: page - 1,
            pageSize: 10,
          }
        },
    });

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
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                        <DialogTitle>Add a New Article</DialogTitle>
                        <DialogDescription>
                            Fill out the form below to add a new article
                        </DialogDescription>
                        </DialogHeader>
                        <ArticleForm
                          key="add-article-form"
                          authors={authors}
                          onSubmit={handleAddArticle}
                          onSuccess={() => setAddArticleOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
             <Dialog open={!!editingArticle} onOpenChange={(isOpen) => !isOpen && setEditingArticle(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                    <DialogTitle>Edit Article</DialogTitle>
                    <DialogDescription>
                        Update the details for "{editingArticle?.title}".
                    </DialogDescription>
                    </DialogHeader>
                    {editingArticle && (
                        <ArticleForm
                            key={editingArticle.id}
                            initialData={editingArticle}
                            authors={authors}
                            onSubmit={handleUpdateArticle}
                            onSuccess={() => setEditingArticle(null)}
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
                                handleDeleteArticle(deletingArticle.id)
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
                    onClick={() => router.push(`?page=${page - 1}`)}
                    disabled={page <= 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`?page=${page + 1}`)}
                    disabled={page >= totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}
