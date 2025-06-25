'use client';

import { useState } from 'react';
import {
  Siren,
  ShieldAlert,
  CheckCircle,
  Stethoscope,
  PhoneCall,
  Navigation,
  Loader2,
  FileText,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { TriageResultData, TriageUrgency } from '@/lib/definitions';
import { getExplainedOutcome } from '@/lib/actions';
import { cn } from '@/lib/utils';

interface TriageResultProps {
  result: TriageResultData;
  onNewAssessment: () => void;
}

const triageConfig: Record<
  TriageUrgency,
  {
    title: string;
    Icon: React.ElementType;
    badgeClass: string;
    cardClass: string;
    description: string;
    resources: {
      title: string;
      description: string;
      actionText: string;
      Icon: React.ElementType;
    }[];
  }
> = {
  red: {
    title: 'High Urgency',
    Icon: Siren,
    badgeClass: 'bg-destructive hover:bg-destructive text-destructive-foreground',
    cardClass: 'border-destructive',
    description: 'Your symptoms suggest a need for immediate medical attention.',
    resources: [
      {
        title: 'Call Emergency Services',
        description: 'If you are in a life-threatening situation, call 911 now.',
        actionText: 'Call 911',
        Icon: PhoneCall,
      },
      {
        title: 'Go to Nearest ER',
        description: 'Proceed to the nearest Emergency Room for immediate care.',
        actionText: 'Find Nearest ER',
        Icon: Navigation,
      },
    ],
  },
  yellow: {
    title: 'Medium Urgency',
    Icon: ShieldAlert,
    badgeClass: 'bg-warning hover:bg-warning text-warning-foreground',
    cardClass: 'border-warning',
    description: 'Your symptoms may require prompt medical attention. Please consult a healthcare provider soon.',
    resources: [
      {
        title: 'Find an Urgent Care',
        description: 'Visit an urgent care center for prompt, non-emergency issues. Wait times vary.',
        actionText: 'Find Urgent Care',
        Icon: Navigation,
      },
      {
        title: 'Connect via Telehealth',
        description: 'Speak with a doctor online to get advice and a possible diagnosis.',
        actionText: 'Start Video Call',
        Icon: PhoneCall,
      },
    ],
  },
  green: {
    title: 'Low Urgency',
    Icon: CheckCircle,
    badgeClass: 'bg-success hover:bg-success text-success-foreground',
    cardClass: 'border-success',
    description: 'Your symptoms do not appear to be urgent, but monitor your condition.',
    resources: [
      {
        title: 'Schedule a Doctor Visit',
        description: 'For non-urgent issues, schedule an appointment with your primary care physician.',
        actionText: 'Schedule Appointment',
        Icon: Stethoscope,
      },
      {
        title: 'Monitor at Home',
        description: 'Rest and keep an eye on your symptoms. Seek care if they worsen.',
        actionText: 'Learn More',
        Icon: FileText,
      },
    ],
  },
};

export default function TriageResult({ result, onNewAssessment }: TriageResultProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);
  const config = triageConfig[result.urgencyLevel];

  const handleExplain = async () => {
    setIsExplanationLoading(true);
    const explainedText = await getExplainedOutcome(result);
    setExplanation(explainedText);
    setIsExplanationLoading(false);
  };

  return (
    <Card className={cn('w-full shadow-lg border-2', config.cardClass)}>
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-4 mb-2">
            <config.Icon className="h-8 w-8" />
            <CardTitle className="text-2xl">{config.title}</CardTitle>
        </div>
        <Badge className={cn('mx-auto', config.badgeClass)}>{result.urgencyLevel.toUpperCase()}</Badge>
        <p className="text-muted-foreground pt-2">{config.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>AI Reasoning</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <p>{result.reasoning}</p>
              {!explanation && (
                <Button variant="outline" size="sm" onClick={handleExplain} disabled={isExplanationLoading}>
                  {isExplanationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Get Detailed Explanation
                </Button>
              )}
              {explanation && (
                <div className="p-4 bg-secondary rounded-lg border">
                  <h4 className="font-semibold mb-2">Detailed Explanation:</h4>
                  <p className="text-muted-foreground">{explanation}</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div>
          <h3 className="mb-4 text-lg font-semibold text-center">Recommended Next Steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.resources.map((resource) => (
              <Card key={resource.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-base font-medium">{resource.title}</CardTitle>
                  <resource.Icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                  <Button variant="outline" className="w-full">{resource.actionText}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </CardContent>
      <CardFooter>
        <Button onClick={onNewAssessment} className="w-full">
          Start New Assessment
        </Button>
      </CardFooter>
    </Card>
  );
}
