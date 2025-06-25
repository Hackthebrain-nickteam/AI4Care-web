'use server';

/**
 * @fileOverview Explains the AI's reasoning for a given triage outcome.
 *
 * - explainTriageOutcome - A function that explains the triage outcome.
 * - ExplainTriageOutcomeInput - The input type for the explainTriageOutcome function.
 * - ExplainTriageOutcomeOutput - The return type for the explainTriageOutcome function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTriageOutcomeInputSchema = z.object({
  symptomDescription: z
    .string()
    .describe('The description of the symptoms provided by the patient.'),
  triageOutcome: z.string().describe('The triage outcome (red, yellow, or green).'),
  reasoning: z.string().describe('The AI reasoning that led to the triage outcome.'),
});
export type ExplainTriageOutcomeInput = z.infer<typeof ExplainTriageOutcomeInputSchema>;

const ExplainTriageOutcomeOutputSchema = z.object({
  explanation: z.string().describe('A detailed explanation of the AI triage outcome.'),
});
export type ExplainTriageOutcomeOutput = z.infer<typeof ExplainTriageOutcomeOutputSchema>;

export async function explainTriageOutcome(input: ExplainTriageOutcomeInput): Promise<ExplainTriageOutcomeOutput> {
  return explainTriageOutcomeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainTriageOutcomePrompt',
  input: {schema: ExplainTriageOutcomeInputSchema},
  output: {schema: ExplainTriageOutcomeOutputSchema},
  prompt: `You are an AI assistant explaining a triage outcome to a patient.

  The patient provided the following symptom description: {{{symptomDescription}}}
  The triage outcome is: {{{triageOutcome}}}
  The reasoning behind the triage outcome is: {{{reasoning}}}

  Provide a clear and concise explanation of the triage outcome, so the patient can understand the reasoning behind the assessment and trust the recommendation.
  The explanation should be easy to understand for a non-medical professional and not exceed 200 words.
  Focus on explaining the link between the symptoms, the reasoning, and the outcome.`,
});

const explainTriageOutcomeFlow = ai.defineFlow(
  {
    name: 'explainTriageOutcomeFlow',
    inputSchema: ExplainTriageOutcomeInputSchema,
    outputSchema: ExplainTriageOutcomeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
