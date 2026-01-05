'use client'

import * as React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal, PlusCircle, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
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
import { popupAdService } from '@/lib/services';
import type { PopupAd } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PopupAdForm } from '@/components/admin/PopupAdForm';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function PopupsDashboardPage() {
    const [data, setData] = React.useState<PopupAd[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAddPopupOpen, setAddPopupOpen] = React.useState(false);
    const [editingPopup, setEditingPopup] = React.useState<PopupAd | null>(null);
    const [deletingPopup, setDeletingPopup] = React.useState<PopupAd | null>(null);
    const { toast } = useToast();

    const fetchPopups = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const popups = await popupAdService.getAll();
            setData(popups);
        } catch (error) {
            console.error('Error fetching popups:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchPopups();
    }, [fetchPopups]);

    const deletePopup = async (popupId: number) => {
        try {
            await popupAdService.delete(popupId);
            await fetchPopups();
            toast({
                title: "Popup Deleted",
                description: "The popup has been successfully removed.",
            });
        } catch (error) {
            console.error('Error deleting popup:', error);
            toast({
                title: "Error",
                description: "Failed to delete popup.",
                variant: "destructive",
            });
        }
    };

    const addPopup = async (popup: Omit<PopupAd, 'id'>) => {
        try {
            await popupAdService.create(popup);
            await fetchPopups();
            setAddPopupOpen(false);
            toast({
                title: "Popup Added",
                description: "The new popup has been successfully created.",
            });
        } catch (error) {
            console.error('Error adding popup:', error);
            toast({
                title: "Error",
                description: "Failed to add popup.",
                variant: "destructive",
            });
        }
    };

    const updatePopup = async (updatedPopup: PopupAd) => {
        try {
            await popupAdService.update(updatedPopup.id, updatedPopup);
            await fetchPopups();
            setEditingPopup(null);
            toast({
                title: "Popup Updated",
                description: "The popup details have been successfully updated.",
            });
        } catch (error) {
            console.error('Error updating popup:', error);
            toast({
                title: "Error",
                description: "Failed to update popup.",
                variant: "destructive",
            });
        }
    };

    const toggleActive = async (popupId: number) => {
        const popup = data.find(p => p.id === popupId);
        if (!popup) return;

        try {
            await popupAdService.update(popupId, { isActive: !popup.isActive });
            await fetchPopups();
            toast({
                title: `Popup ${!popup.isActive ? 'Activated' : 'Deactivated'}`,
                description: `"${popup.name}" status has been updated.`,
            });
        } catch (error) {
            console.error('Error toggling popup status:', error);
            toast({
                title: "Error",
                description: "Failed to toggle popup status.",
                variant: "destructive",
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

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-24">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading popups...</p>
            </div>
        );
    }

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
                            onSuccess={() => { }}
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
                            onSuccess={() => { }}
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
                        <AlertDialogCancel onClick={() => setDeletingPopup(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            if (deletingPopup) {
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
