import { z } from 'zod';

export type TriageUrgency = 'red' | 'yellow' | 'green';

export interface TriageResultData {
  urgencyLevel: TriageUrgency;
  reasoning: string;
  symptomDescription: string;
}

export const formSchema = z.object({
  symptomDescription: z.string().min(20, {
    message: 'Please provide a detailed description of at least 20 characters.',
  }),
  painLevel: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0 && parseInt(val) <= 10, {
    message: 'Please select a pain level.',
  }),
  painType: z.string().min(1, { message: 'Please select a pain type.' }),
});
