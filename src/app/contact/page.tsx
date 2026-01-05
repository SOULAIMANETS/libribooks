import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ContactForm } from '@/components/ContactForm';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Metadata } from 'next';
import { pageService } from '@/lib/services';
import { notFound } from 'next/navigation';

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await pageService.getBySlug('contact');

  return {
    title: pageData?.title || 'Contact Us',
    description: 'Get in touch with the libribooks.com team. We\'d love to hear from you!',
  };
}

export default async function ContactPage() {
  const pageData = await pageService.getBySlug('contact');

  if (!pageData) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground"
            dangerouslySetInnerHTML={{ __html: pageData.title }}
          />
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-headline font-bold mb-6">Contact Us</h2>
            <ContactForm />
          </div>
          <div className="space-y-8">
            <h2 className="text-2xl font-headline font-bold">Contact Information</h2>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <a href="mailto:hello@libribooks.com" className="text-muted-foreground hover:text-primary transition-colors">
                  hello@libribooks.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Office</h3>
                <p className="text-muted-foreground">123 Bookworm Lane, Readington, RS 45678</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
