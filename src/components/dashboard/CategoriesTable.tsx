'use client'

import * as React from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { MoreHorizontal, PlusCircle, Trash2, Edit, Loader2 } from 'lucide-react';
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
import { categoryService } from '@/lib/services';
import type { Category } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function CategoriesTable() {
    const [data, setData] = React.useState<Category[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [newCategoryName, setNewCategoryName] = React.useState('');
    const [editingCategory, setEditingCategory] = React.useState<Category | null>(null);
    const [updatedName, setUpdatedName] = React.useState('');
    const [isEditDialogOpen, setEditDialogOpen] = React.useState(false);
    const { toast } = useToast();

    const fetchCategories = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const categories = await categoryService.getAll();
            setData(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const addCategory = async () => {
        if (!newCategoryName.trim()) {
            toast({
                title: "Error",
                description: "Category name cannot be empty.",
                variant: "destructive",
            });
            return;
        }
        try {
            await categoryService.create({ name: newCategoryName });
            setNewCategoryName('');
            await fetchCategories();
            toast({
                title: "Category Added!",
                description: `"${newCategoryName}" has been successfully added.`,
            });
        } catch (error) {
            console.error('Error adding category:', error);
            toast({
                title: "Error",
                description: "Failed to add category.",
                variant: "destructive",
            });
        }
    };

    const deleteCategory = async (categoryId: number) => {
        try {
            await categoryService.delete(categoryId);
            await fetchCategories();
            toast({
                title: "Category Deleted!",
                description: "The category has been successfully deleted.",
            });
        } catch (error) {
            console.error('Error deleting category:', error);
            toast({
                title: "Error",
                description: "Failed to delete category.",
                variant: "destructive",
            });
        }
    };

    const startEditing = (category: Category) => {
        setEditingCategory(category);
        setUpdatedName(category.name);
        setEditDialogOpen(true);
    }

    const handleUpdate = async () => {
        if (!editingCategory || !updatedName.trim()) {
            toast({
                title: "Error",
                description: "Category name cannot be empty.",
                variant: "destructive",
            });
            return;
        }
        try {
            await categoryService.update(editingCategory.id, { name: updatedName });
            await fetchCategories();
            toast({
                title: "Category Updated!",
                description: `Category has been successfully renamed to "${updatedName}".`,
            });
            setEditDialogOpen(false);
            setEditingCategory(null);
            setUpdatedName('');
        } catch (error) {
            console.error('Error updating category:', error);
            toast({
                title: "Error",
                description: "Failed to update category.",
                variant: "destructive",
            });
        }
    }

    const columns: ColumnDef<Category>[] = [
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
                const category = row.original;
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
                                <DropdownMenuItem onSelect={() => startEditing(category)}>
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
                                    This action cannot be undone. This will permanently delete the category
                                    "{category.name}". Books in this category will need to be re-categorized.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteCategory(category.id)}>
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

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-24">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading categories...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-end py-4 gap-2">
                <Input
                    placeholder="New category name..."
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                    className="max-w-sm"
                    onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                />
                <Button onClick={addCategory}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>
            <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>
                            Make changes to the category name here. Click save when you're done.
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
                                    No categories found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
