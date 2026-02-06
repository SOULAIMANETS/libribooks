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
import { MoreHorizontal, PlusCircle, Trash2, Loader2, Edit } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { skillService } from '@/lib/services';
import type { Skill } from '@/lib/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SkillForm } from '@/components/admin/SkillForm';
import { useToast } from '@/hooks/use-toast';

export function SkillsTable() {
    const [data, setData] = React.useState<Skill[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [isAddSkillOpen, setAddSkillOpen] = React.useState(false);
    const [editingSkill, setEditingSkill] = React.useState<Skill | null>(null);
    const [deletingSkill, setDeletingSkill] = React.useState<Skill | null>(null);
    const { toast } = useToast();

    const fetchSkills = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const skills = await skillService.getAll();
            setData(skills);
        } catch (error) {
            console.error('Error fetching skills:', error);
            toast({
                title: 'Error',
                description: 'Failed to fetch skills.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        fetchSkills();
    }, [fetchSkills]);

    const deleteSkill = async (slug: string) => {
        try {
            await skillService.delete(slug);
            setData(data.filter(skill => skill.slug !== slug));
            toast({
                title: 'Skill deleted',
                description: 'The skill has been successfully removed.',
            });
        } catch (error) {
            console.error('Error deleting skill:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete the skill.',
                variant: 'destructive',
            });
        }
    };

    const addSkill = async (skillData: any) => {
        try {
            await skillService.create(skillData);
            await fetchSkills();
            setAddSkillOpen(false);
            toast({
                title: 'Skill added',
                description: 'The new skill has been successfully saved.',
            });
        } catch (error) {
            console.error('Error adding skill:', error);
            toast({
                title: 'Error',
                description: 'Failed to add the skill.',
                variant: 'destructive',
            });
        }
    };

    const updateSkill = async (slug: string, updatedSkill: any) => {
        try {
            await skillService.update(slug, updatedSkill);
            await fetchSkills();
            setEditingSkill(null);
            toast({
                title: 'Skill updated',
                description: 'The skill has been successfully updated.',
            });
        } catch (error) {
            console.error('Error updating skill:', error);
            toast({
                title: 'Error',
                description: 'Failed to update the skill.',
                variant: 'destructive',
            });
        }
    };

    const columns: ColumnDef<Skill>[] = [
        {
            accessorKey: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <div className="font-medium flex items-center gap-2">
                    {row.original.icon && <span className="text-lg">{row.original.icon}</span>}
                    {row.getValue('name')}
                </div>
            ),
        },
        {
            accessorKey: 'slug',
            header: 'Slug',
            cell: ({ row }) => <code className="text-sm bg-muted px-2 py-1 rounded">{row.getValue('slug') || '-'}</code>,
        },
        {
            accessorKey: 'description',
            header: 'Description',
            cell: ({ row }) => <p className="line-clamp-2 max-w-sm text-muted-foreground">{row.getValue('description') || '-'}</p>
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const skill = row.original;
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
                            <DropdownMenuItem onClick={() => setEditingSkill(skill)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit Skill
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onSelect={() => setDeletingSkill(skill)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Skill
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
        state: {
            sorting,
            columnFilters,
        },
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-24">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading skills (categories)...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Filter by name..."
                    value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                    onChange={(event) =>
                        table.getColumn('name')?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Dialog open={isAddSkillOpen} onOpenChange={setAddSkillOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => setAddSkillOpen(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Skill
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add a New Skill</DialogTitle>
                            <DialogDescription>
                                This will add a new Category/Skill to the system.
                            </DialogDescription>
                        </DialogHeader>
                        <SkillForm
                            key="add-skill-form"
                            onSubmit={addSkill}
                            onSuccess={() => { }}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <Dialog open={!!editingSkill} onOpenChange={(isOpen) => !isOpen && setEditingSkill(null)}>
                <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Skill</DialogTitle>
                        <DialogDescription>
                            Update the details for &quot;{editingSkill?.name}&quot;.
                        </DialogDescription>
                    </DialogHeader>
                    {editingSkill && (
                        <SkillForm
                            key={editingSkill.slug}
                            initialData={editingSkill}
                            onSubmit={(skillData: any) => {
                                updateSkill(editingSkill.slug, skillData);
                            }}
                            onSuccess={() => { }}
                        />
                    )}
                </DialogContent>
            </Dialog>
            <AlertDialog open={!!deletingSkill} onOpenChange={(isOpen) => !isOpen && setDeletingSkill(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the skill
                            &quot;{deletingSkill?.name}&quot;.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            if (deletingSkill) {
                                deleteSkill(deletingSkill.slug)
                                setDeletingSkill(null)
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
                                    No skills yet. Add your first skill to get started.
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
