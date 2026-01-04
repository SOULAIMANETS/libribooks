
'use server';
/**
 * @fileOverview A flow that generates book data like a review, tags, and quotes.
 *
 * - generateBookData - A function that generates data for a book.
 * - GenerateBookDataInput - The input type for the generateBookData function.
 * - GenerateBookDataOutput - The return type for the generateBookData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookDataInputSchema = z.object({
  title: z.string().describe('The title of the book.'),
  author: z.string().describe('The author of the book.'),
});
export type GenerateBookDataInput = z.infer<typeof GenerateBookDataInputSchema>;

const GenerateBookDataOutputSchema = z.object({
    review: z.string().describe("A compelling, in-depth, and insightful review of the book. It should be at least 3-4 paragraphs long."),
    tags: z.array(z.string()).describe("An array of 3-5 relevant tags for the book. These should be one or two words each."),
    quotes: z.array(z.string()).describe("An array of 2-3 notable or famous quotes from the book."),
});
export type GenerateBookDataOutput = z.infer<typeof GenerateBookDataOutputSchema>;

export async function generateBookData(input: GenerateBookDataInput): Promise<GenerateBookDataOutput> {
  return generateBookDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBookDataPrompt',
  input: {schema: GenerateBookDataInputSchema},
  output: {schema: GenerateBookDataOutputSchema},
  prompt: `You are a literary expert and a book critic.
  
  Based on the book title and author provided, generate the following content:
  1. A compelling and well-written review of the book. It should be detailed, insightful, and span multiple paragraphs.
  2. A list of 3 to 5 relevant tags that categorize the book.
  3. A list of 2 to 3 notable quotes from the book.

  If the book is not widely known or is fictional, be creative and generate plausible data that fits the title and author's style.

  Book Title: {{{title}}}
  Author: {{{author}}}
  `,
});

const generateBookDataFlow = ai.defineFlow(
  {
    name: 'generateBookDataFlow',
    inputSchema: GenerateBookDataInputSchema,
    outputSchema: GenerateBookDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
