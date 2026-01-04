
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
import authorsData from '@/lib/authors.json';
import type { Author } from '@/lib/types';
import Image from 'next/image';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AuthorForm } from '@/components/admin/AuthorForm';

// NOTE: In a real app, you would fetch this data from a server and have write operations.
// For this prototype, we'll manipulate the imported data in memory.
const authors = authorsData.map(author => ({...author}));

export default function AuthorsDashboardPage() {
    const [data, setData] = React.useState(authors);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [isAddAuthorOpen, setAddAuthorOpen] = React.useState(false);
    const [editingAuthor, setEditingAuthor] = React.useState<Author | null>(null);
    const [deletingAuthor, setDeletingAuthor] = React.useState<Author | null>(null);

    const deleteAuthor = (authorId: number) => {
        setData(data.filter(author => author.id !== authorId));
    };

    const addAuthor = (author: Omit<Author, 'id'>) => {
      const newAuthor = { ...author, id: Math.max(...data.map(a => a.id), 0) + 1 };
      setData([newAuthor, ...data]);
    };

    const updateAuthor = (updatedAuthor: Author) => {
        setData(data.map(author => (author.id === updatedAuthor.id ? updatedAuthor : author)));
    };

    const columns: ColumnDef<Author>[] = [
        {
            accessorKey: 'image',
            header: 'Avatar',
            cell: ({ row }) => (
                <div className="relative h-12 w-12">
                     <Image
                        src={row.getValue('image')}
                        alt={row.original.name}
                        fill
                        className="object-cover rounded-full"
                        sizes="48px"
                    />
                </div>
            )
        },
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('name')}</div>
            ),
        },
        {
            accessorKey: 'bio',
            header: 'Bio',
            cell: ({ row }) => <p className="line-clamp-2 max-w-sm text-muted-foreground">{row.getValue('bio')}</p>
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const author = row.original;
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
                            <DropdownMenuItem onClick={() => setEditingAuthor(author)}>
                                Edit Author
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onSelect={() => setDeletingAuthor(author)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Author
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

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input
                  placeholder="Filter by name..."
                  value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                  onChange={(event) =>
                    table.getColumn('name')?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
                <Dialog open={isAddAuthorOpen} onOpenChange={setAddAuthorOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setAddAuthorOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Author
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                        <DialogTitle>Add a New Author</DialogTitle>
                        <DialogDescription>
                            Fill out the form below to add a new author.
                        </DialogDescription>
                        </DialogHeader>
                        <AuthorForm 
                          key="add-author-form"
                          onSubmit={addAuthor} 
                          onSuccess={() => setAddAuthorOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
             <Dialog open={!!editingAuthor} onOpenChange={(isOpen) => !isOpen && setEditingAuthor(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                    <DialogTitle>Edit Author</DialogTitle>
                    <DialogDescription>
                        Update the details for "{editingAuthor?.name}".
                    </DialogDescription>
                    </DialogHeader>
                    {editingAuthor && (
                        <AuthorForm
                            key={editingAuthor.id}
                            initialData={editingAuthor}
                            onSubmit={(authorData) => {
                                updateAuthor({ ...authorData, id: editingAuthor.id });
                            }}
                            onSuccess={() => setEditingAuthor(null)}
                        />
                    )}
                </DialogContent>
             </Dialog>
             <AlertDialog open={!!deletingAuthor} onOpenChange={(isOpen) => !isOpen && setDeletingAuthor(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the author
                        "{deletingAuthor?.name}" and their associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            if (deletingAuthor) {
                                deleteAuthor(deletingAuthor.id)
                                setDeletingAuthor(null)
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
