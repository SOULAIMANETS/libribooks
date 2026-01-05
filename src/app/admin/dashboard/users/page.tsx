'use client'

import * as React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal, PlusCircle, Trash2, Loader2, User as UserIcon } from 'lucide-react';
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
import { userService } from '@/lib/services';
import type { User } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserForm } from '@/components/admin/UserForm';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function UsersDashboardPage() {
    const [data, setData] = React.useState<User[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isAddUserOpen, setAddUserOpen] = React.useState(false);
    const [editingUser, setEditingUser] = React.useState<User | null>(null);
    const [deletingUser, setDeletingUser] = React.useState<User | null>(null);
    const { toast } = useToast();

    const fetchUsers = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const users = await userService.getAll();
            setData(users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const deleteUser = async (userId: number) => {
        try {
            await userService.delete(userId);
            await fetchUsers();
            toast({
                title: "User Deleted",
                description: "The user has been successfully removed.",
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            toast({
                title: "Error",
                description: "Failed to delete user.",
                variant: "destructive",
            });
        }
    };

    const addUser = async (userData: any) => {
        try {
            await userService.create(userData);
            await fetchUsers();
            setAddUserOpen(false);
            toast({
                title: "User Added",
                description: "The new user has been successfully created.",
            });
        } catch (error) {
            console.error('Error adding user:', error);
            toast({
                title: "Error",
                description: "Failed to add user.",
                variant: "destructive",
            });
        }
    };

    const updateUser = async (updatedData: any) => {
        if (!editingUser) return;
        try {
            await userService.update(editingUser.id, updatedData);
            await fetchUsers();
            setEditingUser(null);
            toast({
                title: "User Updated",
                description: "The user details have been successfully updated.",
            });
        } catch (error) {
            console.error('Error updating user:', error);
            toast({
                title: "Error",
                description: "Failed to update user.",
                variant: "destructive",
            });
        }
    };

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UserIcon className="h-4 w-4" />
                    </div>
                    <div className="font-medium">{row.getValue('name')}</div>
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'role',
            header: 'Role',
            cell: ({ row }) => {
                const role = row.getValue('role') as string;
                return (
                    <Badge variant={role === 'Admin' ? 'default' : 'secondary'}>
                        {role}
                    </Badge>
                );
            }
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const user = row.original;
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
                            <DropdownMenuItem onClick={() => setEditingUser(user)}>
                                Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onSelect={() => setDeletingUser(user)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
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
                <p className="mt-4 text-muted-foreground">Loading users...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-end py-4">
                <Dialog open={isAddUserOpen} onOpenChange={setAddUserOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setAddUserOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add a New Admin User</DialogTitle>
                            <DialogDescription>
                                Create a new account for libribooks.com administration.
                            </DialogDescription>
                        </DialogHeader>
                        <UserForm
                            onSubmit={addUser}
                            onSuccess={() => { }}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <Dialog open={!!editingUser} onOpenChange={(isOpen) => !isOpen && setEditingUser(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update the details for "{editingUser?.name}".
                        </DialogDescription>
                    </DialogHeader>
                    {editingUser && (
                        <UserForm
                            initialData={editingUser}
                            onSubmit={updateUser}
                            onSuccess={() => { }}
                        />
                    )}
                </DialogContent>
            </Dialog>
            <AlertDialog open={!!deletingUser} onOpenChange={(isOpen) => !isOpen && setDeletingUser(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the user account for
                            "{deletingUser?.name}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeletingUser(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            if (deletingUser) {
                                deleteUser(deletingUser.id);
                                setDeletingUser(null);
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
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
