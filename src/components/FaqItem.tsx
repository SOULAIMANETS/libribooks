'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FaqItemProps {
  question: string;
  answer: string;
  index: number;
}

export function FaqItem({ question, answer, index }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Automatically add question mark if not present
  const displayQuestion = question.endsWith('?') ? question : `${question}?`;

  return (
    <Card className="shadow-sm border border-border/50 hover:border-primary/20 transition-colors">
      <CardContent className="p-0">
        <Button
          variant="ghost"
          className="w-full justify-between p-6 text-left h-auto hover:bg-muted/30"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-3">
            <span className="bg-primary/10 rounded-full p-1.5">
              <HelpCircle className="h-4 w-4 text-primary" />
            </span>
            <span className="font-semibold text-lg">{displayQuestion}</span>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-6 pb-6 pl-14">
            <p className="text-muted-foreground leading-relaxed">{answer}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
