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
} from '@tanstack/react-table';
import { MoreHorizontal, Trash2, Loader2, Mail, MailOpen } from 'lucide-react';
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
import { messagesService } from '@/lib/services';
import type { Message } from '@/lib/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function InboxPage() {
    const [data, setData] = React.useState<Message[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [deletingMessage, setDeletingMessage] = React.useState<Message | null>(null);
    const { toast } = useToast();

    const fetchMessages = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const messages = await messagesService.getAll();
            setData(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
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
        fetchMessages();
    }, [fetchMessages]);

    const deleteMessage = async (messageId: number) => {
        try {
            await messagesService.delete(messageId);
            setData(data.filter(msg => msg.id !== messageId));
            toast({
                title: 'Message deleted',
                description: 'The message has been successfully removed.',
            });
        } catch (error) {
            console.error('Error deleting message:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete the message.',
                variant: 'destructive',
            });
        }
    };

    const toggleReadStatus = async (message: Message) => {
        try {
            if (!message.is_read) {
                await messagesService.markAsRead(message.id);
            }
            setData(data.map(msg =>
                msg.id === message.id
                    ? { ...msg, is_read: !msg.is_read }
                    : msg
            ));
        } catch (error) {
            console.error('Error updating message:', error);
            toast({
                title: 'Error',
                description: 'Failed to update message status.',
                variant: 'destructive',
            });
        }
    };

    const columns: ColumnDef<Message>[] = [
        {
            accessorKey: 'is_read',
            header: '',
            cell: ({ row }) => (
                <div className="flex items-center">
                    {row.original.is_read ? (
                        <MailOpen className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <Mail className="h-4 w-4 text-primary" />
                    )}
                </div>
            ),
        },
        {
            accessorKey: 'name',
            header: 'From',
            cell: ({ row }) => (
                <div className={row.original.is_read ? 'font-normal' : 'font-semibold'}>
                    {row.getValue('name')}
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Email',
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground">
                    {row.getValue('email')}
                </div>
            ),
        },
        {
            accessorKey: 'message',
            header: 'Message',
            cell: ({ row }) => (
                <p className="line-clamp-2 max-w-md text-sm text-muted-foreground">
                    {row.getValue('message')}
                </p>
            ),
        },
        {
            accessorKey: 'created_at',
            header: 'Received',
            cell: ({ row }) => {
                try {
                    return format(new Date(row.getValue('created_at')), 'MMM d, yyyy h:mm a');
                } catch (e) {
                    return row.getValue('created_at');
                }
            }
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const message = row.original;
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
                            <DropdownMenuItem onClick={() => toggleReadStatus(message)}>
                                {message.is_read ? 'Mark as Unread' : 'Mark as Read'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onSelect={() => setDeletingMessage(message)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Message
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
        state: {
            sorting,
        },
    });

    const unreadCount = data.filter(msg => !msg.is_read).length;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-24">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading messages...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">Inbox</h2>
                    {unreadCount > 0 && (
                        <Badge variant="default">{unreadCount} unread</Badge>
                    )}
                </div>
            </div>
            <AlertDialog open={!!deletingMessage} onOpenChange={(isOpen) => !isOpen && setDeletingMessage(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the message
                            from "{deletingMessage?.name}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            if (deletingMessage) {
                                deleteMessage(deletingMessage.id)
                                setDeletingMessage(null)
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
                                    className={!row.original.is_read ? 'bg-muted/30' : ''}
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
                                    No messages yet.
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
