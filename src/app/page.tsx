'use client';

import { useState } from 'react';
import { HeartPulse, Loader2, LogOut } from 'lucide-react';

import SymptomForm from '@/components/symptom-form';
import TriageResult from '@/components/triage-result';
import type { TriageResultData } from '@/lib/definitions';
import { logInteraction } from '@/lib/logging';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Home() {
  const { user, signOutUser, loading } = useAuth();
  const [result, setResult] = useState<TriageResultData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSetResult = (data: TriageResultData) => {
    logInteraction({
      ...data,
      timestamp: new Date().toISOString(),
    });
    setResult(data);
  };

  const handleNewAssessment = () => {
    setResult(null);
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-secondary p-4 sm:p-8 md:p-12">
      <div className="w-full max-w-2xl">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <HeartPulse className="h-10 w-10 text-primary" />
            <h1 className="font-headline text-4xl font-bold text-primary">
              AI4Care
            </h1>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={user.photoURL ?? ''}
                    alt={user.displayName ?? 'User'}
                  />
                  <AvatarFallback>
                    {user.displayName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.displayName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOutUser}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="relative">
          {!result ? (
            <div>
              <p className="mb-8 text-center text-lg text-muted-foreground">
                Welcome back, {user.displayName?.split(' ')[0]}! How are you
                feeling today?
              </p>
              <SymptomForm
                setResult={handleSetResult}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
              />
            </div>
          ) : (
            <TriageResult
              result={result}
              onNewAssessment={handleNewAssessment}
            />
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
