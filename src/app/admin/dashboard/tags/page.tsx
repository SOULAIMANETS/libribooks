
'use client'

import * as React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal, PlusCircle, Trash2, Edit } from 'lucide-react';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label";
import tagsData from '@/lib/tags.json';
import type { Tag } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const tags = tagsData.map(tag => ({...tag}));

export default function TagsDashboardPage() {
    const [data, setData] = React.useState(tags);
    const [newTagName, setNewTagName] = React.useState('');
    const [editingTag, setEditingTag] = React.useState<Tag | null>(null);
    const [updatedName, setUpdatedName] = React.useState('');
    const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
    const { toast } = useToast();

    const addTag = () => {
        if (!newTagName.trim()) {
             toast({
                title: "Error",
                description: "Tag name cannot be empty.",
                variant: "destructive",
            });
            return;
        }
        const newTag = { id: Math.max(...data.map(c => c.id), 0) + 1, name: newTagName };
        setData([newTag, ...data]);
        setNewTagName('');
        toast({
            title: "Tag Added!",
            description: `"${newTagName}" has been successfully added.`,
        });
    };

    const deleteTag = (tagId: number) => {
        const tagToDelete = data.find(c => c.id === tagId);
        setData(data.filter(tag => tag.id !== tagId));
         toast({
            title: "Tag Deleted!",
            description: `"${tagToDelete?.name}" has been successfully deleted.`,
        });
    };
    
    const startEditing = (tag: Tag) => {
        setEditingTag(tag);
        setUpdatedName(tag.name);
        setEditDialogOpen(true);
    }

    const handleUpdate = () => {
        if (!editingTag || !updatedName.trim()) {
            toast({
                title: "Error",
                description: "Tag name cannot be empty.",
                variant: "destructive",
            });
            return;
        }
        setData(data.map(cat => cat.id === editingTag.id ? {...cat, name: updatedName} : cat));
        toast({
            title: "Tag Updated!",
            description: `Tag has been successfully renamed to "${updatedName}".`,
        });
        setEditDialogOpen(false);
        setEditingTag(null);
        setUpdatedName('');
    }

    const columns: ColumnDef<Tag>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <div className="font-medium">{row.getValue('name')}</div>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const tag = row.original;
                return (
                    <AlertDialog>
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => startEditing(tag)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                            </AlertDialogTrigger>
                        </DropdownMenuContent>
                        </DropdownMenu>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the tag
                            "{tag.name}". Books with this tag will need to be re-tagged.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteTag(tag.id)}>
                            Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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
            <div className="flex items-center justify-end py-4 gap-2">
                <Input
                  placeholder="New tag name..."
                  value={newTagName}
                  onChange={(event) => setNewTagName(event.target.value)}
                  className="max-w-sm"
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Tag
                </Button>
            </div>
             <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Edit Tag</DialogTitle>
                    <DialogDescription>
                        Make changes to the tag name here. Click save when you're done.
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                        Name
                        </Label>
                        <Input
                            id="name"
                            value={updatedName}
                            onChange={(e) => setUpdatedName(e.target.value)}
                            className="col-span-3"
                             onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
                        />
                    </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                      <Button type="submit" onClick={handleUpdate}>Save changes</Button>
                    </DialogFooter>
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
                                    No tags found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
