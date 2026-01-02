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
import { MoreHorizontal, PlusCircle, Trash2, CheckCircle, XCircle } from 'lucide-react';
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
import type { PopupAd } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PopupAdForm, PopupAdFormValues } from '@/components/admin/PopupAdForm';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { addPopup, updatePopup, deletePopup, togglePopupActive } from './actions';

interface PopupsClientProps {
  popups: PopupAd[];
  totalPages: number;
}

export function PopupsClient({ popups: initialPopups, totalPages }: PopupsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;
    const [data, setData] = React.useState<PopupAd[]>(initialPopups);
    const [isAddPopupOpen, setAddPopupOpen] = React.useState(false);
    const [editingPopup, setEditingPopup] = React.useState<PopupAd | null>(null);
    const [deletingPopup, setDeletingPopup] = React.useState<PopupAd | null>(null);
    const { toast } = useToast();

    React.useEffect(() => {
        setData(initialPopups);
    }, [initialPopups]);

    const handleAddPopup = React.useCallback(async (popupData: PopupAdFormValues) => {
        const result = await addPopup(popupData);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setAddPopupOpen(false);
            // Delay refresh until after dialog is fully closed
            setTimeout(() => router.refresh(), 0);
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    }, [router, toast]);

    const handleUpdatePopup = React.useCallback(async (popupData: PopupAdFormValues) => {
        if (!editingPopup) return;
        const result = await updatePopup({ ...editingPopup, ...popupData });
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setEditingPopup(null);
            // Delay refresh until after dialog is fully closed
            setTimeout(() => router.refresh(), 0);
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    }, [editingPopup, router, toast]);

    const handleDeletePopup = React.useCallback(async (popupId: number) => {
        const result = await deletePopup(popupId);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setDeletingPopup(null);
            setTimeout(() => router.refresh(), 0); // Delay refresh
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    }, [router, toast]);

    const handleToggleActive = React.useCallback(async (popupId: number, currentState: boolean) => {
        const result = await togglePopupActive(popupId, currentState);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setTimeout(() => router.refresh(), 0); // Delay refresh
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    }, [router, toast]);

    const columns: ColumnDef<PopupAd>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('name')}</div>
            ),
        },
        {
            accessorKey: 'is_active', // Corrected from isActive
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.getValue('is_active'); // Corrected from isActive
                return (
                     <Badge variant={isActive ? 'default' : 'secondary'}>
                        {isActive ? <CheckCircle className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                        {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                )
            }
        },
        {
            accessorKey: 'display_delay', // Corrected from displayDelay
            header: 'Delay (s)',
             cell: ({ row }) => `${row.getValue('display_delay')}s`, // Corrected from displayDelay
        },
        {
            accessorKey: 'display_duration', // Corrected from displayDuration
            header: 'Duration (s)',
            cell: ({ row }) => `${row.getValue('display_duration')}s`, // Corrected from displayDuration
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const popup = row.original;
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
                            <DropdownMenuItem onClick={() => handleToggleActive(popup.id, popup.is_active ?? false)}> {/* Ensure boolean is passed */}
                            {popup.is_active ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingPopup(popup)}>
                            Edit Popup
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onSelect={() => setDeletingPopup(popup)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Popup
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
            <div className="flex items-center justify-end py-4">
                 <Dialog open={isAddPopupOpen} onOpenChange={setAddPopupOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setAddPopupOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Popup
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl">
                        <DialogHeader>
                        <DialogTitle>Add a New Popup Ad</DialogTitle>
                        <DialogDescription>
                           Fill out the form below to create a new popup.
                        </DialogDescription>
                        </DialogHeader>
                        <PopupAdForm
                          key="add-popup-form"
                          onSubmit={handleAddPopup}
                          onSuccess={() => setTimeout(() => setAddPopupOpen(false), 0)} // Delay state update
                        />
                    </DialogContent>
                </Dialog>
            </div>
             <Dialog open={!!editingPopup} onOpenChange={(isOpen) => !isOpen && setEditingPopup(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                    <DialogTitle>Edit Popup Ad</DialogTitle>
                    <DialogDescription>
                        Update the details for "{editingPopup?.name}".
                    </DialogDescription>
                    </DialogHeader>
                    {editingPopup && (
                        <PopupAdForm
                            key={editingPopup.id}
                            initialData={editingPopup}
                            onSubmit={handleUpdatePopup}
                            onSuccess={() => setTimeout(() => setEditingPopup(null), 0)} // Delay state update
                        />
                    )}
                </DialogContent>
             </Dialog>
            <AlertDialog open={!!deletingPopup} onOpenChange={(isOpen) => !isOpen && setDeletingPopup(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the popup
                        "{deletingPopup?.name}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            if(deletingPopup) {
                                handleDeletePopup(deletingPopup.id);
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
                                    No popups found.
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
