'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing visitor data
 * and generating AI-driven insights about emerging trends.
 *
 * - analyzeVisitorTrends - A function to initiate the visitor trend analysis.
 * - AnalyzeVisitorTrendsInput - The input type for the analysis.
 * - AnalyzeVisitorTrendsOutput - The output type containing the identified trends and summary.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VisitorRecordSchema = z.object({
  timestamp: z.string().datetime().describe('The timestamp of the visit (ISO 8601 format).'),
  email: z.string().email().describe('The email of the visitor.'),
  department: z.string().describe('The college department of the visitor.'),
  reasonForVisit: z.string().describe('The free-text reason for the visit.'),
  facility: z.enum(['Library', "Dean's Office"]).describe('The facility visited (Library or Dean\'s Office).'),
  visitorName: z.string().optional().describe('The name of the visitor (optional).'),
  studentEmployeeId: z.string().optional().describe('Student or Employee ID (optional).'),
  purposeOfVisitCategory: z.enum(['Inquiry', 'Signature', 'Meeting', 'Others']).optional().describe('Categorized purpose of visit for Dean\'s Office (optional).'),
  timeIn: z.string().datetime().optional().describe('Time of check-in (ISO 8601 format, optional).'),
  timeOut: z.string().datetime().optional().describe('Time of check-out (ISO 8601 format, optional).'),
});

const AnalyzeVisitorTrendsInputSchema = z.object({
  visitorRecords: z.array(VisitorRecordSchema).describe('A list of raw visitor records for analysis.'),
});
export type AnalyzeVisitorTrendsInput = z.infer<typeof AnalyzeVisitorTrendsInputSchema>;

const TrendSchema = z.object({
  description: z.string().describe('A detailed description of the identified trend.'),
  category: z.enum(['Departmental Increase', 'Purpose Shift', 'Peak Hours', 'Facility Specific', 'Other']).describe('The category of the trend.'),
  impact: z.string().describe('The potential impact of this trend on resource allocation or operations.'),
  recommendation: z.string().describe('Actionable recommendations based on the trend.'),
});

const AnalyzeVisitorTrendsOutputSchema = z.object({
  summary: z.string().describe('A general summary of the visitor trends identified.'),
  trends: z.array(TrendSchema).describe('An array of identified visitor trends.'),
});
export type AnalyzeVisitorTrendsOutput = z.infer<typeof AnalyzeVisitorTrendsOutputSchema>;

export async function analyzeVisitorTrends(input: AnalyzeVisitorTrendsInput): Promise<AnalyzeVisitorTrendsOutput> {
  return analyzeVisitorTrendsFlow(input);
}

const analyzeVisitorTrendsPrompt = ai.definePrompt({
  name: 'analyzeVisitorTrendsPrompt',
  input: {
    schema: z.object({ visitorRecordsJson: z.string().describe('JSON string of visitor records.') })
  },
  output: { schema: AnalyzeVisitorTrendsOutputSchema },
  prompt: `You are an expert data analyst specializing in visitor management and resource allocation. Your task is to analyze the provided raw visitor data from various facilities and identify emerging trends. Focus on patterns related to:
- Increases or decreases in visits from specific college departments.
- Shifts in common reasons for visits.
- Peak visiting hours or days.
- Trends specific to the 'Library' or 'Dean's Office' facilities.

For each identified trend, provide:
1.  A clear \`description\` of the trend.
2.  A \`category\` that best describes the trend (e.g., 'Departmental Increase', 'Purpose Shift', 'Peak Hours', 'Facility Specific', 'Other').
3.  The potential \`impact\` of this trend on resource allocation or operational adjustments.
4.  Actionable \`recommendation\`s based on the trend.

Finally, provide an overall \`summary\` of the key insights.

Here is the raw visitor data in JSON format:
{{{visitorRecordsJson}}}`,
});

const analyzeVisitorTrendsFlow = ai.defineFlow(
  {
    name: 'analyzeVisitorTrendsFlow',
    inputSchema: AnalyzeVisitorTrendsInputSchema,
    outputSchema: AnalyzeVisitorTrendsOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeVisitorTrendsPrompt({
      visitorRecordsJson: JSON.stringify(input.visitorRecords),
    });
    return output!;
  }
);
