'use client';

import { useState, useEffect } from 'react';
import { HeartPulse } from 'lucide-react';

import SymptomForm from '@/components/symptom-form';
import TriageResult from '@/components/triage-result';
import type { TriageResultData } from '@/lib/definitions';
import { logInteraction } from '@/lib/logging';

export default function Home() {
  const [result, setResult] = useState<TriageResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(true);

  useEffect(() => {
    if (result) {
      logInteraction({
        ...result,
        timestamp: new Date().toISOString(),
      });
      setFormVisible(false);
    }
  }, [result]);

  const handleNewAssessment = () => {
    setResult(null);
    setFormVisible(true);
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl">
        <header className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-3">
            <HeartPulse className="h-10 w-10 text-primary" />
            <h1 className="font-headline text-4xl font-bold text-primary">
              AI4Care
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Your AI-powered health assistant for symptom analysis and triage.
          </p>
        </header>

        <div className="relative">
          <div
            className={`transition-opacity duration-500 ${
              formVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <SymptomForm
              setResult={setResult}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
            />
          </div>

          {result && (
            <div
              className={`transition-opacity duration-700 delay-300 ${
                !formVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <TriageResult
                result={result}
                onNewAssessment={handleNewAssessment}
              />
            </div>
          )}
        </div>
      </div>
      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          Disclaimer: AI4Care is for informational purposes only and does not
          constitute medical advice.
        </p>
        <p>In case of a medical emergency, please call 911.</p>
      </footer>
    </main>
  );
}
