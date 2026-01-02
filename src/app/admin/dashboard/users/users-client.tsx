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
import { useRouter, useSearchParams } from 'next/navigation';
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
import type { User } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserForm } from '@/components/admin/UserForm';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { addUser, updateUser, deleteUser } from './actions';

interface UsersClientProps {
  users: User[];
  totalPages: number;
}

export function UsersClient({ users: initialUsers, totalPages }: UsersClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;
    const [data, setData] = React.useState(initialUsers);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [isAddUserOpen, setAddUserOpen] = React.useState(false);
    const [editingUser, setEditingUser] = React.useState<User | null>(null);
    const [deletingUser, setDeletingUser] = React.useState<User | null>(null);
    const { toast } = useToast();

    const handleAddUser = async (user: Omit<User, 'id'> & { password: string }) => {
        const result = await addUser(user);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setAddUserOpen(false);
            router.refresh();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    const handleUpdateUser = async (updatedUser: User) => {
        const result = await updateUser(updatedUser);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setEditingUser(null);
            router.refresh();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    const handleDeleteUser = async (userId: number) => {
        const result = await deleteUser(userId);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setDeletingUser(null);
            router.refresh();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    };

    const columns: ColumnDef<User>[] = [
        {
            accessorKey: 'username',
            header: 'Username',
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('username')}</div>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
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
                  placeholder="Filter by username..."
                  value={(table.getColumn('username')?.getFilterValue() as string) ?? ''}
                  onChange={(event) =>
                    table.getColumn('username')?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
                <Dialog open={isAddUserOpen} onOpenChange={setAddUserOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setAddUserOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                        <DialogTitle>Add a New User</DialogTitle>
                        <DialogDescription>
                            Fill out the form below to add a new user.
                        </DialogDescription>
                        </DialogHeader>
                        <UserForm 
                          key="add-user-form"
                          onSubmit={handleAddUser} 
                          onSuccess={() => setAddUserOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>
             <Dialog open={!!editingUser} onOpenChange={(isOpen) => !isOpen && setEditingUser(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update the details for "{editingUser?.username}".
                    </DialogDescription>
                    </DialogHeader>
                    {editingUser && (
                        <UserForm
                            key={editingUser.id}
                            initialData={editingUser}
                            onSubmit={(userData) => {
                                handleUpdateUser({ ...userData, id: editingUser.id });
                            }}
                            onSuccess={() => setEditingUser(null)}
                        />
                    )}
                </DialogContent>
             </Dialog>
            <AlertDialog open={!!deletingUser} onOpenChange={(isOpen) => !isOpen && setDeletingUser(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the user
                        "{deletingUser?.username}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            if(deletingUser) {
                                handleDeleteUser(deletingUser.id);
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
