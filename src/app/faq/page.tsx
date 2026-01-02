

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Metadata } from 'next';
import { FAQPage as FAQPageSchema, Question } from 'schema-dts';
import { JsonLd } from 'react-schemaorg';
import { getPageBySlug } from '@/lib/pages';
import { notFound } from 'next/navigation';


export async function generateMetadata(): Promise<Metadata> {
    const pageData = await getPageBySlug('faq');
    return {
        title: pageData?.title || 'Frequently Asked Questions',
        description: 'Find answers to common questions about libribooks.com, our review process, and how our site works.',
    };
};

export default async function FAQPage() {
  const pageData = await getPageBySlug('faq');

  if (!pageData || !pageData.structured_content?.items) {
    notFound();
  }

  const faqItems = pageData.structured_content.items;

  return (
    <>
      <JsonLd<FAQPageSchema>
        item={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item: { question: string; answer: string }) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          } as Question)),
        }}
      />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground"
            dangerouslySetInnerHTML={{ __html: pageData.title }}
          />
           <div
             className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
             dangerouslySetInnerHTML={{ __html: pageData.content || '' }}
            />
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item: { question: string; answer: string }, index: number) => (
             <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
          ))}
        </Accordion>
      </main>
    </>
  );
}
