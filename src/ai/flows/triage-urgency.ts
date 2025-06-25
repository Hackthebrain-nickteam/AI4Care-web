// triage-urgency.ts
'use server';

/**
 * @fileOverview Determines the urgency level of a patient's condition based on analyzed symptoms.
 *
 * - triageUrgency - A function that triages the urgency level based on symptom analysis.
 * - TriageUrgencyInput - The input type for the triageUrgency function, including symptom analysis.
 * - TriageUrgencyOutput - The return type for the triageUrgency function, indicating the urgency level and reasoning.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the triage flow
const TriageUrgencyInputSchema = z.object({
  symptomAnalysis: z
    .string()
    .describe(
      'A detailed analysis of the patient provided symptoms, including identified conditions and severity.'
    ),
});
export type TriageUrgencyInput = z.infer<typeof TriageUrgencyInputSchema>;

// Define the output schema for the triage flow
const TriageUrgencyOutputSchema = z.object({
  urgencyLevel: z
    .enum(['red', 'yellow', 'green'])
    .describe(
      'The urgency level of the condition: red (immediate attention needed), yellow (urgent but not life-threatening), or green (non-urgent).'
    ),
  reasoning: z
    .string()
    .describe(
      'A brief explanation of why the AI assigned the given urgency level.'
    ),
});
export type TriageUrgencyOutput = z.infer<typeof TriageUrgencyOutputSchema>;

// Exported function to triage urgency
export async function triageUrgency(input: TriageUrgencyInput): Promise<TriageUrgencyOutput> {
  return triageUrgencyFlow(input);
}

// Define the prompt for the triage flow
const triagePrompt = ai.definePrompt({
  name: 'triagePrompt',
  input: {schema: TriageUrgencyInputSchema},
  output: {schema: TriageUrgencyOutputSchema},
  prompt: `Based on the following symptom analysis, determine the urgency level (red, yellow, or green) and provide a brief explanation for your decision.

Symptom Analysis: {{{symptomAnalysis}}}

Please provide the urgency level and reasoning in the format specified in the output schema.`,
});

// Define the Genkit flow for triaging urgency
const triageUrgencyFlow = ai.defineFlow(
  {name: 'triageUrgencyFlow', inputSchema: TriageUrgencyInputSchema, outputSchema: TriageUrgencyOutputSchema},
  async input => {
    const {output} = await triagePrompt(input);
    return output!;
  }
);
