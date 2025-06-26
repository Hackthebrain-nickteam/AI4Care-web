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
import { Input } from '@/components/ui/input';
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
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [manualLocation, setManualLocation] = useState('');
  const [isFindingER, setIsFindingER] = useState(false);
  const [erResults, setErResults] = useState<{ name: string; address: string,distance:string }[]>([]);
  const config = triageConfig[result.urgencyLevel];

  const handleExplain = async () => {
    setIsExplanationLoading(true);
    const explainedText = await getExplainedOutcome(result);
    setExplanation(explainedText);
    setIsExplanationLoading(false);
  };

  const findNearestERs = async (location: { latitude: number; longitude: number } | string) => {
    setIsFindingER(true);
    setErResults([]);
    let latitude: number | undefined;
    let longitude: number | undefined;
    if (typeof location === 'string') {
      setIsFindingER(false);
      alert('Manual location search is not implemented. Please use location services.');
      return;
    } else {
      latitude = location.latitude;
      longitude = location.longitude;
    }
    const apiKey = 'GOOGLE_MAPS_API_KEY';
    
    
    try {
      const url = `/api/er?latitude=${latitude}&longitude=${longitude}`;
      const response = await fetch(url);
      console.log(response);
      const data = await response.json();
      console.log(data);
      if (data.length > 0) {
        setErResults(
          data.map((place: any) => ({
            name: place.name,
            address: place.vicinity,
            distance:place.distance
          }))
        );
      } else {
        setErResults([]);
      }
    } catch (error) {
      setErResults([]);
      alert('Failed to fetch ER locations.');
    }
    setIsFindingER(false);
  };

  const handleFindERClick = async (resourceTitle: string) => {
    if (resourceTitle === 'Go to Nearest ER' || resourceTitle === 'Find an Urgent Care') {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            findNearestERs({ latitude: position.coords.latitude, longitude: position.coords.longitude });
          },
          (error) => {
            console.error('Geolocation error:', error);
            setShowLocationInput(true);
          });
      } else {
        setShowLocationInput(true);
      }
    }
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
                  {(resource.actionText === 'Find Nearest ER' || resource.actionText === 'Find an Urgent Care') ? (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleFindERClick(resource.title)}
                      disabled={isFindingER === true}
                    >
                      {isFindingER ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {resource.actionText}
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full">{resource.actionText}</Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </CardContent>
      <CardFooter>
        {showLocationInput && (
          <div className="flex flex-col gap-2 w-full">
            <Input
              placeholder="Enter your location (e.g., city, zip code)"
              value={manualLocation}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setManualLocation(e.target.value)}
            />
            <Button
              onClick={() => findNearestERs(manualLocation)}
              disabled={!manualLocation || isFindingER === true}
            >
              {isFindingER ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Search with Manual Location
            </Button>
          </div>
        )}

        {erResults.length > 0 && (
          <div className="mt-4 w-full">
            <h4 className="font-semibold mb-2">Nearest Emergency Rooms:</h4>
            <ul>
              {erResults.map((er, idx) => (
                <li key={idx} className="mb-2 flex flex-row space-x-12">
                  <strong>{er.name}</strong><br />
                  <span className="text-muted-foreground">{er.address}</span>
                  {/* <span className="text-muted-foreground">{er.distance}</span> */}
                </li>
              ))}
            </ul>
          </div>
        )}

        <Button onClick={onNewAssessment} className="w-full">
          Start New Assessment
        </Button>
      </CardFooter>
    </Card>
  );
}
