"use client"

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
import { MoreHorizontal, PlusCircle, Trash2, Star } from 'lucide-react';
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
import type { Book, Category, Tag, Author } from '@/lib/types'; // Import Author type
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookForm } from '@/components/admin/BookForm';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { deleteBook as deleteBookAction, addBook as addBookAction, updateBook as updateBookAction } from './actions';
import { useRouter, useSearchParams } from 'next/navigation';

interface BooksClientProps {
  books: Book[];
  totalPages: number;
  categories: Category[];
  tags: Tag[];
  authors: Author[]; // Expecting Author objects with slug
}

export function BooksClient({ books: initialBooks, totalPages, categories, tags, authors }: BooksClientProps) {
    const searchParams = useSearchParams();
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;
    const [data, setData] = React.useState(initialBooks);
    React.useEffect(() => {
        setData(initialBooks);
    }, [initialBooks]);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [isAddBookOpen, setAddBookOpen] = React.useState(false);
    const [editingBook, setEditingBook] = React.useState<Book | null>(null);
    const [deletingBook, setDeletingBook] = React.useState<Book | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const handleOptimisticUpdate = (updatedBook: Book) => {
        setData(currentData => currentData.map(book => book.id === updatedBook.id ? updatedBook : book));
    };

    const deleteBook = async (bookId: number) => {
        const result = await deleteBookAction(bookId);
        if (result.success) {
            toast({
                title: 'Success',
                description: result.message,
            });
            router.refresh();
        } else {
            toast({
                title: 'Error',
                description: result.message,
                variant: 'destructive',
            });
        }
    };

    const addBook = async (bookData: any) => {
        const result = await addBookAction(bookData);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setAddBookOpen(false);
            router.refresh();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    const updateBook = async (bookData: any) => {
        const result = await updateBookAction(bookData);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setEditingBook(null);
            router.refresh();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    const toggleFeatured = async (book: Book) => {
        const updatedBook = { ...book, featured: !book.featured };
        handleOptimisticUpdate(updatedBook);
        const result = await updateBookAction(updatedBook); // We can reuse updateBook
        if (result.success) {
            toast({
                title: `Book ${updatedBook.featured ? 'Featured' : 'Unfeatured'}`,
                description: `"${book.title}" has been updated.`,
            });
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
            setData(initialBooks); // Revert on error
        }
    };

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
                        src={row.getValue('coverImage') || '/placeholder.png'}
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
                // Ensure authors is an array of Author objects before accessing name
                const authors = row.original.authors || [];
                return <p className="max-w-xs">{authors.map(author => author.name).join(', ')}</p>
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
                          <DropdownMenuItem onClick={() => toggleFeatured(book)}>
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
                          categories={categories}
                          tags={tags}
                          authors={authors}
                          onSubmit={addBook}
                          onSuccess={() => {
                            setAddBookOpen(false);
                          }}
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
                            categories={categories}
                            tags={tags}
                            authors={authors}
                            onSubmit={(bookData) => {
                                updateBook({ ...bookData, id: editingBook.id });
                            }}
                            onSuccess={() => setEditingBook(null)}
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
