import { config } from 'dotenv';
config();

import '@/ai/flows/explain-outcome.ts';
import '@/ai/flows/analyze-symptoms.ts';
import '@/ai/flows/triage-urgency.ts';