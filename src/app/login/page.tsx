'use client';

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeartPulse, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
      <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 256S109.8 0 244 0c73.2 0 136 25.3 184.4 68.6l-67.2 65.7C334.6 112.3 293.4 96 244 96c-82.6 0-149.3 67.1-149.3 160s66.7 160 149.3 160c96.2 0 128.1-71.5 132.3-107.4H244V261.8h244z"></path>
    </svg>
  );

export default function LoginPage() {
  const { signInWithGoogle, loading, user, isFirebaseConfigured } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [loading, user, router]);

  const handleSignIn = () => {
    if (!isFirebaseConfigured) {
      toast({
        variant: 'destructive',
        title: 'Setup Required',
        description:
          'Firebase is not configured. Please add your API keys to the .env file.',
      });
      return;
    }
    signInWithGoogle();
  };

  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader className="text-center">
        <div className="mx-auto flex items-center gap-3 mb-4">
            <HeartPulse className="h-10 w-10 text-primary" />
            <h1 className="font-headline text-4xl font-bold text-primary">
              AI4Care
            </h1>
          </div>
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>Sign in to your AI Health Assistant</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSignIn} className="w-full">
            <GoogleIcon />
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
