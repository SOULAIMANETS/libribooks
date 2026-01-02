'use client';

import dynamic from 'next/dynamic';

const BooksByCategoryChart = dynamic(
  () => import('./books-by-category-chart').then((mod) => mod.BooksByCategoryChart),
  { ssr: false }
);

export default function ChartContainer({ data }: { data: any }) {
  return <BooksByCategoryChart data={data} />;
}
