
'use server';
/**
 * @fileOverview A flow that generates a concise summary of a book review for SEO purposes.
 *
 * - generateConciseReviewSummary - A function that generates a concise summary of a book review.
 * - GenerateConciseReviewSummaryInput - The input type for the generateConciseReviewSummary function.
 * - GenerateConciseReviewSummaryOutput - The return type for the generateConciseReviewSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateConciseReviewSummaryInputSchema = z.object({
  reviewTitle: z.string().describe('The title of the book review.'),
  reviewContent: z.string().describe('The full content of the book review.'),
});
export type GenerateConciseReviewSummaryInput = z.infer<typeof GenerateConciseReviewSummaryInputSchema>;

const GenerateConciseReviewSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the book review.'),
  shouldSummarize: z.boolean().describe('Whether the review is worth summarizing.'),
});
export type GenerateConciseReviewSummaryOutput = z.infer<typeof GenerateConciseReviewSummaryOutputSchema>;

export async function generateConciseReviewSummary(input: GenerateConciseReviewSummaryInput): Promise<GenerateConciseReviewSummaryOutput> {
  return generateConciseReviewSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateConciseReviewSummaryPrompt',
  input: {schema: GenerateConciseReviewSummaryInputSchema},
  output: {schema: GenerateConciseReviewSummaryOutputSchema},
  prompt: `You are an SEO expert tasked with generating concise summaries of book reviews.

  Your goal is to create a compelling, one-paragraph summary (no more than 3-4 sentences) that captures the essence of the review and entices readers. The summary should be suitable for use as a meta description.

  First, evaluate the provided review content. If the review is too short (less than 50 words) or lacks substance, it is not worth summarizing. In this case, you MUST set the 'shouldSummarize' field to false and return an empty string for the 'summary' field.

  If the review is substantial enough, set 'shouldSummarize' to true and generate a summary based on the following criteria:
  - It must be concise and engaging.
  - It must accurately reflect the tone and key points of the original review.
  - It should not introduce any new information.

  Here is the review information:
  Review Title: {{{reviewTitle}}}
  Review Content: {{{reviewContent}}}
  `,
});

const generateConciseReviewSummaryFlow = ai.defineFlow(
  {
    name: 'generateConciseReviewSummaryFlow',
    inputSchema: GenerateConciseReviewSummaryInputSchema,
    outputSchema: GenerateConciseReviewSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
