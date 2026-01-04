

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Metadata } from 'next';
import { FAQPage as FAQPageSchema, Question } from 'schema-dts';
import { JsonLd } from 'react-schemaorg';
import pagesData from '@/lib/pages.json';
import { notFound } from 'next/navigation';


export async function generateMetadata(): Promise<Metadata> {
    const pageData = pagesData.find(p => p.slug === 'faq');
    return {
        title: pageData?.title || 'Frequently Asked Questions',
        description: 'Find answers to common questions about libribooks.com, our review process, and how our site works.',
    };
};

export default function FAQPage() {
  const pageData = pagesData.find(p => p.slug === 'faq');

  if (!pageData || !pageData.structuredContent) {
    notFound();
  }

  const faqItems = pageData.structuredContent;

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd<FAQPageSchema>
        item={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          } as Question)),
        }}
      />
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground"
            dangerouslySetInnerHTML={{ __html: pageData.title }}
          />
           <div 
             className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
             dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
             <AccordionItem key={index} value={`item-${index + 1}`}>
                <AccordionTrigger className="text-lg text-left">{item.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
          ))}
        </Accordion>
      </main>
      <Footer />
    </div>
  );
}
