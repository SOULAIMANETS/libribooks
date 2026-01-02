'use client'

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { useRouter, useSearchParams } from 'next/navigation';
import { MoreHorizontal } from 'lucide-react';
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
import type { Page } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageForm, PageFormValues } from '@/components/admin/PageForm';
import { useToast } from '@/hooks/use-toast';
import { updatePage as updatePageAction } from './actions';

interface PagesClientProps {
  pages: Page[];
  totalPages: number;
}

export function PagesClient({ pages: initialPages, totalPages }: PagesClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;
    const [data, setData] = React.useState(initialPages);
    const [editingPage, setEditingPage] = React.useState<Page | null>(null);
    const { toast } = useToast();

    React.useEffect(() => {
        setData(initialPages);
    }, [initialPages]);

    const handleUpdatePage = React.useCallback(async (pageData: PageFormValues) => {
        if (!editingPage) return;

        const result = await updatePageAction({ ...editingPage, ...pageData });
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setEditingPage(null);
            router.refresh();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    }, [editingPage, router, toast]);

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
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: totalPages,
        manualPagination: true,
        state: {
          pagination: {
            pageIndex: page - 1,
            pageSize: 10,
          }
        },
    });

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
                          onSubmit={handleUpdatePage}
                          onSuccess={() => setEditingPage(null)}
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
