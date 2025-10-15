'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Lightbulb, MousePointer, Link, Trash2 } from 'lucide-react';

interface FirstTimeHintProps {
  isVisible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function FirstTimeHint({ isVisible, onClose, onComplete }: FirstTimeHintProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Welcome to Constellation Editor!',
      content: 'This is your skill tree editor. Here you can create and manage your learning paths.',
      icon: Lightbulb,
    },
    {
      title: 'Create Nodes',
      content: 'Double-click on empty space to create new skill nodes. Each node represents a learning topic.',
      icon: MousePointer,
    },
    {
      title: 'Connect Skills',
      content: 'Drag from one node to another to create dependencies. This shows the learning progression.',
      icon: Link,
    },
    {
      title: 'Edit & Delete',
      content: 'Right-click on any node to access edit and delete options from the context menu.',
      icon: Trash2,
    },
    {
      title: 'Remove Connections',
      content: 'Hover over any connection line and click the X icon that appears to remove dependencies.',
      icon: X,
    },
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <currentStepData.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{currentStepData.title}</h3>
                <div className="flex gap-1 mt-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentStep
                          ? 'bg-primary'
                          : index < currentStep
                          ? 'bg-primary/50'
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-muted-foreground mb-6 leading-relaxed">
            {currentStepData.content}
          </p>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSkip} className="flex-1">
              Skip Tutorial
            </Button>
            <Button onClick={handleNext} className="flex-1">
              {isLastStep ? 'Get Started' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
