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
import { MoreHorizontal, PlusCircle, Trash2, Star, Loader2 } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { bookService, authorService } from '@/lib/services';
import type { Book, Author } from '@/lib/types';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookForm } from '@/components/admin/BookForm';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function BooksDashboardPage() {
    const [data, setData] = React.useState<Book[]>([]);
    const [authors, setAuthors] = React.useState<Author[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [isAddBookOpen, setAddBookOpen] = React.useState(false);
    const [editingBook, setEditingBook] = React.useState<Book | null>(null);
    const [deletingBook, setDeletingBook] = React.useState<Book | null>(null);
    const { toast } = useToast();

    const fetchData = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const [booksData, authorsData] = await Promise.all([
                bookService.getAll(),
                authorService.getAll()
            ]);
            setData(booksData);
            setAuthors(authorsData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch books and authors.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const deleteBook = async (bookId: number) => {
        try {
            await bookService.delete(bookId);
            setData(data.filter(book => book.id !== bookId));
            toast({
                title: 'Book deleted',
                description: 'The book has been successfully removed.',
            });
        } catch (error) {
            console.error('Error deleting book:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete the book.',
                variant: 'destructive',
            });
        }
    };

    const handleAuthorProcessing = async (authorNames: string[]): Promise<number[]> => {
        const processedIds: number[] = [];
        let currentAuthors = [...authors];

        for (const name of authorNames) {
            const trimmedName = name.trim();
            if (!trimmedName) continue;

            let existingAuthor = currentAuthors.find(a => a.name.toLowerCase() === trimmedName.toLowerCase());

            if (existingAuthor) {
                processedIds.push(existingAuthor.id);
            } else {
                try {
                    const newAuthor = await authorService.create({
                        name: trimmedName,
                        bio: `An up and coming author, ${trimmedName} is making waves in the literary world.`,
                        image: `https://picsum.photos/400/400?random=${Math.floor(Math.random() * 1000)}`
                    });
                    currentAuthors.push(newAuthor);
                    processedIds.push(newAuthor.id);
                    setAuthors([...currentAuthors]);
                } catch (error) {
                    console.error('Error creating author:', error);
                }
            }
        }

        return processedIds;
    };

    const addBook = async (book: any) => {
        try {
            const authorNames = book.authors.split(',').map((s: string) => s.trim()).filter(Boolean);
            const authorIds = await handleAuthorProcessing(authorNames);

            await bookService.create({
                ...book,
                authorIds,
                authors: authorNames
            });

            await fetchData();
            setAddBookOpen(false);
        } catch (error) {
            console.error('Error adding book:', error);
            toast({
                title: 'Error',
                description: 'Failed to add the book.',
                variant: 'destructive',
            });
        }
    };

    const updateBook = async (updatedBook: any) => {
        try {
            const authorNames = updatedBook.authors.split(',').map((s: string) => s.trim()).filter(Boolean);
            const authorIds = await handleAuthorProcessing(authorNames);

            await bookService.update(updatedBook.id, {
                ...updatedBook,
                authorIds,
                authors: authorNames
            });

            await fetchData();
            setEditingBook(null);
        } catch (error) {
            console.error('Error updating book:', error);
            toast({
                title: 'Error',
                description: 'Failed to update the book.',
                variant: 'destructive',
            });
        }
    };

    const toggleFeatured = async (bookId: number, currentFeatured: boolean) => {
        try {
            await bookService.update(bookId, { featured: !currentFeatured });
            const newFeaturedState = !currentFeatured;

            setData(data.map(book =>
                book.id === bookId ? { ...book, featured: newFeaturedState } : book
            ));

            toast({
                title: `Book ${newFeaturedState ? 'Featured' : 'Unfeatured'}`,
                description: `The book status has been updated.`,
            });
        } catch (error) {
            console.error('Error toggling featured status:', error);
            toast({
                title: 'Error',
                description: 'Failed to update featured status.',
                variant: 'destructive',
            });
        }
    }

    const columns: ColumnDef<Book>[] = [
        {
            accessorKey: 'featured',
            header: () => <Star className="h-4 w-4" />,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    {row.getValue('featured') ? <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> : <Star className="h-4 w-4 text-muted-foreground/30" />}
                </div>
            )
        },
        {
            accessorKey: 'coverImage',
            header: 'Cover',
            cell: ({ row }) => (
                <div className="relative h-16 w-12">
                    <Image
                        src={row.getValue('coverImage')}
                        alt={row.original.title}
                        fill
                        className="object-cover rounded-sm"
                        sizes="48px"
                    />
                </div>
            )
        },
        {
            accessorKey: 'title',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Title
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="font-medium pl-4">{row.getValue('title')}</div>
            ),
        },
        {
            accessorKey: 'authors',
            header: 'Author(s)',
            cell: ({ row }) => {
                const authors = row.getValue('authors') as string[] || [];
                return <p className="max-w-xs">{authors.join(', ')}</p>
            }
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }) => <Badge variant="outline">{row.getValue('category')}</Badge>,
        },
        {
            accessorKey: 'tags',
            header: 'Tags',
            cell: ({ row }) => {
                const tags = row.getValue('tags') as string[] || [];
                return (
                    <div className="flex flex-wrap gap-1 max-w-xs">
                        {tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
                    </div>
                )
            }
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const book = row.original;
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
                            <DropdownMenuItem onClick={() => setEditingBook(book)}>
                                Edit Book
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleFeatured(book.id, !!book.featured)}>
                                <Star className={cn("mr-2 h-4 w-4", book.featured && "text-yellow-400 fill-yellow-400")} />
                                {book.featured ? 'Unfeature' : 'Feature'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onSelect={() => setDeletingBook(book)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Book
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
                <p className="mt-4 text-muted-foreground">Loading books...</p>
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
                <Dialog open={isAddBookOpen} onOpenChange={setAddBookOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setAddBookOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Book
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Add a New Book</DialogTitle>
                            <DialogDescription>
                                Fill out the form below to add a new book to the library.
                            </DialogDescription>
                        </DialogHeader>
                        <BookForm
                            key="add-book-form"
                            onSubmit={addBook}
                            onSuccess={() => { }}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <Dialog open={!!editingBook} onOpenChange={(isOpen) => !isOpen && setEditingBook(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit Book</DialogTitle>
                        <DialogDescription>
                            Update the details for "{editingBook?.title}".
                        </DialogDescription>
                    </DialogHeader>
                    {editingBook && (
                        <BookForm
                            key={editingBook.id}
                            initialData={editingBook}
                            onSubmit={(bookData) => {
                                updateBook({ ...bookData, id: editingBook.id });
                            }}
                            onSuccess={() => { }}
                        />
                    )}
                </DialogContent>
            </Dialog>
            <AlertDialog open={!!deletingBook} onOpenChange={(isOpen) => !isOpen && setDeletingBook(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the book
                            "{deletingBook?.title}" from the database.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingBook(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            if (deletingBook) {
                                deleteBook(deletingBook.id)
                                setDeletingBook(null)
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