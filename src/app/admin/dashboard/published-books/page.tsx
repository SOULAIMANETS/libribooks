'use client';

import { PublishedBooksList } from '@/components/dashboard/PublishedBooksList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PublishedBooksPage() {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Published Books</CardTitle>
                    <CardDescription>
                        A comprehensive list of all published books with author details and download options.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <PublishedBooksList />
                </CardContent>
            </Card>
        </div>
    );
}
