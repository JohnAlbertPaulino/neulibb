'use server';
/**
 * @fileOverview A Genkit flow for generating an AI-powered summary of visitor activities.
 *
 * - summarizeVisitorActivity - A function that handles the visitor activity summarization process.
 * - VisitorActivitySummaryInput - The input type for the summarizeVisitorActivity function.
 * - VisitorActivitySummaryOutput - The return type for the summarizeVisitorActivity function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VisitorActivitySummaryInputSchema = z.object({
  timeRange: z
    .enum(['day', 'week', 'month'])
    .describe('The time range for the summary (day, week, or month).'),
  visitorData: z
    .array(
      z.object({
        timestamp: z
          .string()
          .datetime()
          .describe('Timestamp of the visit in ISO 8601 format.'),
        department: z.string().describe('Visitor\'s college department.'),
        reasonForVisit: z.string().describe('Reason for the visit.'),
        facility: z
          .string()
          .describe('The facility visited (e.g., Library, Dean\'s Office).'),
      })
    )
    .describe('An array of visitor activity records.'),
});
export type VisitorActivitySummaryInput = z.infer<
  typeof VisitorActivitySummaryInputSchema
>;

const VisitorActivitySummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise, AI-generated summary of visitor activities.'),
});
export type VisitorActivitySummaryOutput = z.infer<
  typeof VisitorActivitySummaryOutputSchema
>;

export async function summarizeVisitorActivity(
  input: VisitorActivitySummaryInput
): Promise<VisitorActivitySummaryOutput> {
  return summarizeVisitorActivityFlow(input);
}

const summarizeVisitorActivityPrompt = ai.definePrompt({
  name: 'summarizeVisitorActivityPrompt',
  input: { schema: VisitorActivitySummaryInputSchema },
  output: { schema: VisitorActivitySummaryOutputSchema },
  prompt: `You are an AI assistant tasked with summarizing visitor activity for an administrator.

Analyze the provided visitor data for the specified time range ({{{timeRange}}}) and generate a concise summary. The summary should be easy to read and understand, suitable for quick review by an administrator.

Highlight the following key metrics:
- Total number of visitors for the given time range.
- Identify the busiest hours/times of the day and/or week based on the data.
- List the most frequent reasons for visits across all facilities or per facility if significant differences exist.
- Point out any other notable trends or patterns observed in the visitor data.

Format the output as a clear and structured summary.

Visitor Data (Timestamp, Department, Reason for Visit, Facility):
{{#each visitorData}}
- {{this.timestamp}}, Department: {{this.department}}, Reason: {{this.reasonForVisit}}, Facility: {{this.facility}}
{{/each}}`,
});

const summarizeVisitorActivityFlow = ai.defineFlow(
  {
    name: 'summarizeVisitorActivityFlow',
    inputSchema: VisitorActivitySummaryInputSchema,
    outputSchema: VisitorActivitySummaryOutputSchema,
  },
  async (input) => {
    const { output } = await summarizeVisitorActivityPrompt(input);
    return output!;
  }
);
