
'use client'

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
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
import popupAdsData from '@/lib/popupAds.json';
import type { PopupAd } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PopupAdForm } from '@/components/admin/PopupAdForm';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// NOTE: In a real app, you would fetch this data from a server and have write operations.
// For this prototype, we'll manipulate the imported data in memory.
const popups = popupAdsData.map(popup => ({...popup}));

export default function PopupsDashboardPage() {
    const [data, setData] = React.useState<PopupAd[]>(popups);
    const [isAddPopupOpen, setAddPopupOpen] = React.useState(false);
    const [editingPopup, setEditingPopup] = React.useState<PopupAd | null>(null);
    const [deletingPopup, setDeletingPopup] = React.useState<PopupAd | null>(null);
    const { toast } = useToast();

    const deletePopup = (popupId: number) => {
        setData(data.filter(popup => popup.id !== popupId));
    };

    const addPopup = (popup: Omit<PopupAd, 'id'>) => {
        const newPopup = { ...popup, id: Math.max(...data.map(p => p.id), 0) + 1 };
        if (newPopup.isActive) {
            setData([newPopup, ...data.map(p => ({...p, isActive: false}))]);
        } else {
            setData([newPopup, ...data]);
        }
    };

    const updatePopup = (updatedPopup: PopupAd) => {
        if (updatedPopup.isActive) {
            setData(data.map(popup => (popup.id === updatedPopup.id ? updatedPopup : {...popup, isActive: false})));
        } else {
             setData(data.map(popup => (popup.id === updatedPopup.id ? updatedPopup : popup)));
        }
    };

    const toggleActive = (popupId: number) => {
        const popupToActivate = data.find(p => p.id === popupId);
        if (!popupToActivate) return;

        const isActivating = !popupToActivate.isActive;
        if (isActivating) {
            setData(data.map(p => p.id === popupId ? {...p, isActive: true} : {...p, isActive: false}));
             toast({
                title: "Popup Activated",
                description: `"${popupToActivate.name}" is now the active popup.`,
            });
        } else {
            // Deactivating
             setData(data.map(p => p.id === popupId ? {...p, isActive: false} : p));
             toast({
                title: "Popup Deactivated",
                description: `"${popupToActivate.name}" is no longer active.`,
            });
        }
    };


    const columns: ColumnDef<PopupAd>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('name')}</div>
            ),
        },
        {
            accessorKey: 'isActive',
            header: 'Status',
            cell: ({ row }) => {
                const isActive = row.getValue('isActive');
                return (
                     <Badge variant={isActive ? 'default' : 'secondary'}>
                        {isActive ? <CheckCircle className="mr-2 h-4 w-4" /> : <XCircle className="mr-2 h-4 w-4" />}
                        {isActive ? 'Active' : 'Inactive'}
                    </Badge>
                )
            }
        },
        {
            accessorKey: 'displayDelay',
            header: 'Delay (s)',
             cell: ({ row }) => `${row.getValue('displayDelay')}s`,
        },
        {
            accessorKey: 'displayDuration',
            header: 'Duration (s)',
            cell: ({ row }) => `${row.getValue('displayDuration')}s`,
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
                            <DropdownMenuItem onClick={() => toggleActive(popup.id)}>
                            {popup.isActive ? 'Deactivate' : 'Activate'}
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
                          onSubmit={addPopup}
                          onSuccess={() => setAddPopupOpen(false)}
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
                            onSubmit={(popupData) => {
                                updatePopup({ ...popupData, id: editingPopup.id });
                            }}
                            onSuccess={() => setEditingPopup(null)}
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
                                deletePopup(deletingPopup.id);
                                setDeletingPopup(null);
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
        </div>
    );
}
