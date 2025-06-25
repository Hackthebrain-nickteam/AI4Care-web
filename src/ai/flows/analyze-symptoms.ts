// SymptomAnalysis Story: As a patient, I want to input my symptoms in a clear and guided manner so that the AI can analyze them and assess the urgency of my condition.
'use server';
/**
 * @fileOverview This file defines a Genkit flow for analyzing patient-provided symptom descriptions to assess the urgency of the case.
 *
 * - analyzeSymptoms - A function that takes symptom descriptions as input and returns an assessment of the urgency level.
 * - AnalyzeSymptomsInput - The input type for the analyzeSymptoms function.
 * - AnalyzeSymptomsOutput - The return type for the analyzeSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSymptomsInputSchema = z.object({
  symptoms: z
    .string()
    .describe(
      'A detailed description of the patient symptoms, including the level and type of pain.'
    ),
});
export type AnalyzeSymptomsInput = z.infer<typeof AnalyzeSymptomsInputSchema>;

const AnalyzeSymptomsOutputSchema = z.object({
  urgencyLevel: z
    .enum(['red', 'yellow', 'green'])
    .describe(
      'The urgency level of the case, can be red, yellow, or green. Red indicates immediate attention is required, yellow indicates attention is needed soon, and green indicates the condition is not urgent.'
    ),
  reasoning: z
    .string()
    .describe(
      'A detailed explanation of the AI reasoning for the assigned urgency level.'
    ),
});
export type AnalyzeSymptomsOutput = z.infer<typeof AnalyzeSymptomsOutputSchema>;

export async function analyzeSymptoms(
  input: AnalyzeSymptomsInput
): Promise<AnalyzeSymptomsOutput> {
  return analyzeSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSymptomsPrompt',
  input: {schema: AnalyzeSymptomsInputSchema},
  output: {schema: AnalyzeSymptomsOutputSchema},
  prompt: `You are an AI assistant that analyzes patient symptoms and determines the urgency level of the case.
  Based on the symptoms provided, you will assess the urgency level and provide a detailed explanation of your reasoning.

  Symptoms: {{{symptoms}}}
  `,
});

const analyzeSymptomsFlow = ai.defineFlow(
  {
    name: 'analyzeSymptomsFlow',
    inputSchema: AnalyzeSymptomsInputSchema,
    outputSchema: AnalyzeSymptomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
