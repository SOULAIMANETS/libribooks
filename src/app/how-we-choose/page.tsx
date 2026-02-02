import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, ShieldCheck, Star, Target, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How We Choose - Our Book Selection Methodology | Libribooks',
  description: 'Learn about our rigorous selection process for books. We prioritize quality, impact, and actionable insights to help you master life skills.',
};

export default function HowWeChoosePage() {
  const principles = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Actionable Insights",
      description: "We favor books that provide concrete tools and strategies rather than just abstract theories. If it doesn’t help you grow, it doesn’t make our list."
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Evidence-Based",
      description: "For psychology and behavior books, we look for scientific backing. We avoid sensationalism and 'quick-fix' promises that lack depth."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Universal Relevance",
      description: "We select books that address fundamental human challenges—from communication to discipline—ensuring our recommendations are timeless."
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
      title: "Curation, Not Aggregation",
      description: "We don't list every book. We list the *right* books. Our team spends hundreds of hours filtering through the noise so you don't have to."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full bg-background">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight mb-6">
              How We Choose Our Books
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              At Libribooks, we believe your time is your most valuable asset. 
              Our mission is to ensure you never waste it on a mediocre book.
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-headline font-bold mb-8">Our Philosophy</h2>
            <p>
              In an era of information overload, the bottleneck isn't finding information—it's filtering it. 
              Libribooks was born out of a simple observation: Most reading lists are too long, too generic, 
              or optimized for popularity rather than transformation.
            </p>
            <p>
              We view books as <strong>software for the mind</strong>. The right book can upgrade your 
              operating system, fixing bugs in your thinking and adding new capabilities to your life. 
              Therefore, our selection process is more like engineering than simple reviewing.
            </p>
          </div>

          <Separator className="my-16" />

          <h2 className="text-3xl font-headline font-bold mb-12 text-center text-foreground">The Selection Principles</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {principles.map((p, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-xl border bg-card hover:shadow-md transition-shadow">
                <div className="mt-1">{p.icon}</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{p.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{p.description}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-16" />

          <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center border">
            <h2 className="text-3xl font-headline font-bold mb-6">Our Promise</h2>
            <p className="text-xl text-muted-foreground italic mb-8">
              "Every book on this site has been vetted for its potential to change at least one person's life. 
              If we wouldn't gift it to our best friend, we won't recommend it to you."
            </p>
            <div className="flex justify-center gap-2">
              <Star className="text-yellow-500 fill-yellow-500 h-5 w-5" />
              <Star className="text-yellow-500 fill-yellow-500 h-5 w-5" />
              <Star className="text-yellow-500 fill-yellow-500 h-5 w-5" />
              <Star className="text-yellow-500 fill-yellow-500 h-5 w-5" />
              <Star className="text-yellow-500 fill-yellow-500 h-5 w-5" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
