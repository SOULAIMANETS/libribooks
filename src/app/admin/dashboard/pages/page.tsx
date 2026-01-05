'use client'

import * as React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal, Loader2 } from 'lucide-react';
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
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { pageService } from '@/lib/services';
import type { Page } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageForm } from '@/components/admin/PageForm';
import { useToast } from '@/hooks/use-toast';

export default function PagesDashboardPage() {
    const [data, setData] = React.useState<Page[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [editingPage, setEditingPage] = React.useState<Page | null>(null);
    const { toast } = useToast();

    const fetchPages = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const pages = await pageService.getAll();
            setData(pages);
        } catch (error) {
            console.error('Error fetching pages:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    const updatePage = async (updatedPage: Page) => {
        try {
            await pageService.update(updatedPage.slug, updatedPage);
            await fetchPages();
            setEditingPage(null);
            toast({
                title: "Page Updated",
                description: "The page content has been successfully updated.",
            });
        } catch (error) {
            console.error('Error updating page:', error);
            toast({
                title: "Error",
                description: "Failed to update page.",
                variant: "destructive",
            });
        }
    };

    const columns: ColumnDef<Page>[] = [
        {
            accessorKey: 'title',
            header: 'Title',
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('title')}</div>
            ),
        },
        {
            accessorKey: 'slug',
            header: 'Path',
            cell: ({ row }) => (
                <div className="font-mono text-sm text-muted-foreground">/{row.getValue('slug')}</div>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const page = row.original;
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
                            <DropdownMenuItem onClick={() => setEditingPage(page)}>
                                Edit Page Content
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
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-24">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading pages...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Dialog open={!!editingPage} onOpenChange={(isOpen) => !isOpen && setEditingPage(null)}>
                <DialogContent className="sm:max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>Edit Page</DialogTitle>
                        <DialogDescription>
                            Update the content for the "{editingPage?.title}" page.
                        </DialogDescription>
                    </DialogHeader>
                    {editingPage && (
                        <PageForm
                            key={editingPage.slug}
                            initialData={editingPage}
                            onSubmit={(pageData) => {
                                updatePage({ ...pageData, slug: editingPage.slug });
                            }}
                            onSuccess={() => { }}
                        />
                    )}
                </DialogContent>
            </Dialog>
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
                                    No pages found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
