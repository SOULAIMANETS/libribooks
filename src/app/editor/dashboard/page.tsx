'use client';

import {
    BookOpen,
    FileText,
    Users,
    Library,
    Tags
} from 'lucide-react';
import Link from 'next/link';

export default function EditorDashboardPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Editor Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Manage your content and contributions.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <OverviewCard
                    title="Books"
                    description="Manage book catalog"
                    icon={BookOpen}
                    href="/editor/dashboard/books"
                    color="text-blue-500"
                    bgColor="bg-blue-50"
                />
                <OverviewCard
                    title="Articles"
                    description="Write and edit articles"
                    icon={FileText}
                    href="/editor/dashboard/articles"
                    color="text-purple-500"
                    bgColor="bg-purple-50"
                />
                <OverviewCard
                    title="Authors"
                    description="Manage author profiles"
                    icon={Users}
                    href="/editor/dashboard/authors"
                    color="text-orange-500"
                    bgColor="bg-orange-50"
                />
                <OverviewCard
                    title="Categories"
                    description="Organize content"
                    icon={Library}
                    href="/editor/dashboard/categories"
                    color="text-green-500"
                    bgColor="bg-green-50"
                />
                <OverviewCard
                    title="Tags"
                    description="Manage content tags"
                    icon={Tags}
                    href="/editor/dashboard/tags"
                    color="text-pink-500"
                    bgColor="bg-pink-50"
                />
            </div>
        </div>
    );
}

function OverviewCard({
    title,
    description,
    icon: Icon,
    href,
    color,
    bgColor
}: {
    title: string;
    description: string;
    icon: React.ElementType;
    href: string;
    color: string;
    bgColor: string;
}) {
    return (
        <Link
            href={href}
            className="block p-6 bg-white rounded-lg border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
        >
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${bgColor} ${color} group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6" />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                    <p className="text-sm text-slate-500">{description}</p>
                </div>
            </div>
        </Link>
    );
}
