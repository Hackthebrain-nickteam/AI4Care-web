'use server';

import { z } from 'zod';
import { analyzeSymptoms } from '@/ai/flows/analyze-symptoms';
import { explainTriageOutcome } from '@/ai/flows/explain-outcome';
import { formSchema } from './definitions';
import type { TriageResultData } from './definitions';

export async function getTriageResult(
  data: z.infer<typeof formSchema>
): Promise<TriageResultData> {
  const fullSymptomDescription = `
    Symptom Description: ${data.symptomDescription}
    Pain Level: ${data.painLevel}/10
    Pain Type: ${data.painType}
    `;

  try {
    const analysis = await analyzeSymptoms({ symptoms: fullSymptomDescription });
    return { ...analysis, symptomDescription: fullSymptomDescription };
  } catch (error) {
    console.error('Error in getTriageResult:', error);
    throw new Error('Failed to get triage result from AI.');
  }
}

export async function getExplainedOutcome(
  result: TriageResultData
): Promise<string> {
  try {
    const explanation = await explainTriageOutcome({
      symptomDescription: result.symptomDescription,
      triageOutcome: result.urgencyLevel,
      reasoning: result.reasoning,
    });
    return explanation.explanation;
  } catch (error) {
    console.error('Error in getExplainedOutcome:', error);
    return 'Sorry, we could not generate a more detailed explanation at this time.';
  }
}
