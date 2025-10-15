'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for highlighting
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Constellation Editor!',
    description: 'This is your visual editor for creating learning paths. Let\'s walk through the basics.',
    position: 'center',
  },
  {
    id: 'create-node',
    title: 'Creating Nodes',
    description: 'Double-click anywhere on the empty graph to create a new learning node. Each node represents a skill or concept.',
    target: '#skill-sky-flow',
    position: 'bottom',
  },
  {
    id: 'node-slug',
    title: 'Node Slugs & URLs',
    description: 'Each node gets a unique slug that appears in the URL. This makes your constellation shareable and bookmarkable.',
    position: 'center',
  },
  {
    id: 'edit-node',
    title: 'Editing Nodes',
    description: 'Click on any node to select it, then use the panel on the right to edit its title, slug, and dependencies.',
    target: '.react-flow__panel',
    position: 'left',
  },
  {
    id: 'connect-nodes',
    title: 'Connecting Dependencies',
    description: 'Drag from one node to another to create learning dependencies. Students must complete prerequisites first.',
    target: '#skill-sky-flow',
    position: 'top',
  },
  {
    id: 'visibility',
    title: 'Public/Private',
    description: 'Toggle your constellation between private (for editing) and public (visible to learners) using the switch.',
    target: '[data-testid="visibility-toggle"]',
    position: 'top',
  },
  {
    id: 'content-editing',
    title: 'Adding Content',
    description: 'Click "Edit content" on any node to add rich text, videos, quizzes, and other learning materials.',
    target: '.react-flow__panel button',
    position: 'left',
  },
];

interface ConstellationTutorialProps {
  isVisible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function ConstellationTutorial({
  isVisible,
  onClose,
  onComplete,
}: ConstellationTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0);
      setIsCompleted(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      setIsCompleted(true);
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleSkip = () => {
    setIsCompleted(true);
    onComplete();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />

      {/* Tutorial Card */}
      <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2">
        <Card className="shadow-2xl">
          <CardContent className="p-6">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lightbulb className="size-5 text-yellow-500" />
                <Badge variant="secondary">
                  {currentStep + 1} of {TUTORIAL_STEPS.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex gap-1">
                {TUTORIAL_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                      index <= currentStep
                        ? 'bg-primary'
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="size-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Skip Tutorial
                </Button>

                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  {isLastStep ? 'Get Started!' : 'Next'}
                  {!isLastStep && <ChevronRight className="size-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Highlight overlay for target elements */}
      {step.target && (
        <div className="fixed inset-0 z-40 pointer-events-none">
          <div className="absolute inset-0 bg-black/20" />
          {/* This would need more complex logic to highlight specific elements */}
        </div>
      )}
    </>
  );
}
