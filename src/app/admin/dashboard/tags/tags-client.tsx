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
import type { Tag, Category } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { addTag, updateTag, deleteTag } from './actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TagsClientProps {
  tags: Tag[];
  categories: Category[];
  totalPages: number;
}

export function TagsClient({ tags: initialTags, categories, totalPages }: TagsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1;
    const [data, setData] = React.useState(initialTags);
    const [newTagName, setNewTagName] = React.useState('');
    const [newTagCategory, setNewTagCategory] = React.useState<string>('');
    const [editingTag, setEditingTag] = React.useState<Tag | null>(null);
    const [updatedName, setUpdatedName] = React.useState('');
    const [updatedCategory, setUpdatedCategory] = React.useState<string>('');
    const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
    const { toast } = useToast();

    React.useEffect(() => {
        setData(initialTags);
    }, [initialTags]);

    const handleAddTag = React.useCallback(async () => {
        if (!newTagName.trim()) {
            toast({ title: 'Error', description: 'Tag name cannot be empty.', variant: 'destructive' });
            return;
        }
        if (!newTagCategory) {
            toast({ title: 'Error', description: 'Please select a category.', variant: 'destructive' });
            return;
        }
        const result = await addTag({ name: newTagName, category_id: parseInt(newTagCategory) });
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            setNewTagName('');
            setNewTagCategory('');
            router.refresh();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    }, [newTagName, newTagCategory, router, toast]);

    const handleDeleteTag = React.useCallback(async (tagId: number) => {
        const result = await deleteTag(tagId);
        if (result.success) {
            toast({ title: 'Success', description: result.message });
            router.refresh();
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    }, [router, toast]);

    const handleUpdate = React.useCallback(async () => {
        if (editingTag) {
            const result = await updateTag({ ...editingTag, name: updatedName, category_id: parseInt(updatedCategory) });
            if (result.success) {
                toast({ title: 'Success', description: result.message });
                setEditDialogOpen(false);
                router.refresh();
            } else {
                toast({ title: 'Error', description: result.message, variant: 'destructive' });
            }
        }
    }, [editingTag, updatedName, updatedCategory, router, toast]);

    const startEditing = (tag: Tag) => {
        setEditingTag(tag);
        setUpdatedName(tag.name);
        setUpdatedCategory(tag.category_id?.toString() || '');
        setEditDialogOpen(true);
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
            accessorKey: 'category',
            header: 'Category',
            cell: ({ row }) => {
                const category = categories.find(c => c.id === row.original.category_id);
                return <div>{category?.name || 'N/A'}</div>
            },
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
                            <AlertDialogAction onClick={() => handleDeleteTag(tag.id)}>
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
            <div className="flex items-center justify-end py-4 gap-2">
                <Input
                  placeholder="New tag name..."
                  value={newTagName}
                  onChange={(event) => setNewTagName(event.target.value)}
                  className="max-w-sm"
                />
                <Select onValueChange={setNewTagCategory} value={newTagCategory}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map(category => (
                            <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button onClick={handleAddTag}>
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
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">
                        Category
                        </Label>
                        <Select onValueChange={setUpdatedCategory} value={updatedCategory}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map(category => (
                                    <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
