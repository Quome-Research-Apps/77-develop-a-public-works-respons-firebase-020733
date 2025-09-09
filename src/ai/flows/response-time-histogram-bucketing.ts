'use server';
/**
 * @fileOverview Determines optimal bucketing for response time histogram using AI.
 *
 * - calculateHistogramBuckets - A function that calculates appropriate histogram buckets for response times.
 * - CalculateHistogramBucketsInput - The input type for the calculateHistogramBuckets function.
 * - CalculateHistogramBucketsOutput - The return type for the calculateHistogramBuckets function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CalculateHistogramBucketsInputSchema = z.object({
  responseTimes: z
    .array(z.number())
    .describe('An array of response times in days.'),
});
export type CalculateHistogramBucketsInput = z.infer<
  typeof CalculateHistogramBucketsInputSchema
>;

const CalculateHistogramBucketsOutputSchema = z.object({
  buckets: z
    .array(z.number())
    .describe(
      `An array of numbers representing the boundaries of the histogram buckets.
      The first number is the lower bound of the first bucket, and the last number is the upper bound of the last bucket.`
    ),
});
export type CalculateHistogramBucketsOutput = z.infer<
  typeof CalculateHistogramBucketsOutputSchema
>;

export async function calculateHistogramBuckets(
  input: CalculateHistogramBucketsInput
): Promise<CalculateHistogramBucketsOutput> {
  return calculateHistogramBucketsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'calculateHistogramBucketsPrompt',
  input: {schema: CalculateHistogramBucketsInputSchema},
  output: {schema: CalculateHistogramBucketsOutputSchema},
  prompt: `You are an expert data visualizer. Given a list of response times, you will determine
the best bucket boundaries for a histogram to visualize the distribution of the data.

Response Times: {{{responseTimes}}}

Consider the range of the data, the number of data points, and common-sense groupings to suggest
reasonable bucket boundaries.

Please provide only an array of numbers representing the bucket boundaries.
Do not include any additional explanation or context.`,
});

const calculateHistogramBucketsFlow = ai.defineFlow(
  {
    name: 'calculateHistogramBucketsFlow',
    inputSchema: CalculateHistogramBucketsInputSchema,
    outputSchema: CalculateHistogramBucketsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
