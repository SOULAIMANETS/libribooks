
'use client'

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
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
import pagesData from '@/lib/pages.json';
import type { Page } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PageForm } from '@/components/admin/PageForm';

// NOTE: In a real app, you would fetch this data from a server and have write operations.
// For this prototype, we'll manipulate the imported data in memory.
const pages = pagesData.map(page => ({...page}));

export default function PagesDashboardPage() {
    const [data, setData] = React.useState(pages);
    const [editingPage, setEditingPage] = React.useState<Page | null>(null);

    const updatePage = (updatedPage: Page) => {
        setData(data.map(page => (page.slug === updatedPage.slug ? updatedPage : page)));
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
        </div>
    );
}
