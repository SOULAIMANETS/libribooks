'use client';

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
import { Loader2, ExternalLink, Download, ArrowUpDown, MoreHorizontal } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { bookService, authorService, categoryService } from '@/lib/services';
import type { Book, Author, Category } from '@/lib/types';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function PublishedBooksList() {
    const [data, setData] = React.useState<Book[]>([]);
    const [authors, setAuthors] = React.useState<Author[]>([]);
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const { toast } = useToast();

    // Fetch initial data
    const fetchData = React.useCallback(async () => {
        try {
            const [booksData, authorsData, categoriesData] = await Promise.all([
                bookService.getAll(),
                authorService.getAll(),
                categoryService.getAll()
            ]);
            setData(booksData);
            setAuthors(authorsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch messages.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchData();

        // Realtime subscription for books updates
        const channel = supabase
            .channel('public:books')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'books' },
                (payload) => {
                    console.log('Realtime update received:', payload);
                    fetchData(); // Refetch data on any change
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchData]);

    // Download CSV
    const downloadCSV = () => {
        const headers = ['ID', 'Title', 'Book URL', 'Author(s)', 'Author URL(s)', 'Category'];
        
        // Filter data based on current table state if needed, or just all data
        // Using `table.getFilteredRowModel().rows` would export what the user sees
        const rowsToExport = table.getFilteredRowModel().rows.map(row => row.original);

        const csvContent = [
            headers.join(','),
            ...rowsToExport.map(book => {
                const authorNames = book.authors.join('; ');
                
                // Find author objects to get slugs
                const bookAuthors = authors.filter(a => book.authorIds?.includes(a.id));
                const authorUrls = bookAuthors.map(a => `https://libribooks.com/author/${a.slug}`).join('; ');
                
                return [
                    book.id,
                    `"${book.title.replace(/"/g, '""')}"`, // Escape quotes
                    `https://libribooks.com/book/${book.slug}`,
                    `"${authorNames.replace(/"/g, '""')}"`,
                    `"${authorUrls}"`,
                    `"${book.category || ''}"`
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'published_books_export.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns: ColumnDef<Book>[] = [
        {
            accessorKey: 'title',
            header: ({ column }) => {
                return (
                    <Button
                        variant="ghost"
                        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    >
                        Book Title
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                )
            },
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Link 
                        href={`/book/${row.original.slug}`} 
                        className="font-medium text-primary hover:underline flex items-center gap-1"
                        target="_blank"
                    >
                        {row.getValue('title')}
                        <ExternalLink className="h-3 w-3" />
                    </Link>
                </div>
            ),
        },
        {
            accessorKey: 'authors',
            header: 'Author(s)',
            cell: ({ row }) => {
                const book = row.original;
                return (
                    <div className="flex flex-col gap-1">
                        {book.authorIds?.map(authorId => {
                            const author = authors.find(a => a.id === authorId);
                            if (!author) return null;
                            return (
                                <Link 
                                    key={author.id}
                                    href={`/author/${author.slug}`}
                                    className="text-sm hover:underline text-muted-foreground hover:text-foreground flex items-center gap-1"
                                    target="_blank"
                                >
                                    {author.name}
                                    <ExternalLink className="h-3 w-3" />
                                </Link>
                            )
                        })}
                    </div>
                )
            }
        },
        {
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }) => <Badge variant="secondary">{row.getValue('category')}</Badge>,
            filterFn: (row, id, value) => {
                return value === 'all' ? true : row.getValue(id) === value;
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
        <div className="w-full space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                    <Input
                        placeholder="Filter by title..."
                        value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
                        onChange={(event) =>
                            table.getColumn('title')?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <Select
                        value={(table.getColumn('category')?.getFilterValue() as string) ?? 'all'}
                        onValueChange={(value) => table.getColumn('category')?.setFilterValue(value === 'all' ? '' : value)}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map(cat => (
                                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <Button onClick={downloadCSV} variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download CSV
                </Button>
            </div>

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
                                    No published books found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Total: {table.getFilteredRowModel().rows.length} books
                </div>
                <div className="space-x-2">
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
        </div>
    );
}
