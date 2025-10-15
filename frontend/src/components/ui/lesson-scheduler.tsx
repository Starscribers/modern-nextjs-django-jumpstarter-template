'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';
import {
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Video,
} from 'lucide-react';

interface Lesson {
  id?: string;
  title: string;
  description: string;
  content: string;
  type: 'video' | 'text' | 'interactive';
  duration: number;
  videoUrl: string;
  isRequired: boolean;
  status: 'draft' | 'published';
  order: number;
}

interface Section {
  id?: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface ScheduledLesson {
  lessonId: string;
  sectionId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
}

interface LessonSchedulerProps {
  sections: Section[];
  scheduledLessons: ScheduledLesson[];
  onScheduleLesson: (scheduled: ScheduledLesson) => void;
  onUnscheduleLesson: (lessonId: string) => void;
  onUpdateSchedule: (
    lessonId: string,
    updates: Partial<ScheduledLesson>
  ) => void;
}

const LessonScheduler: React.FC<LessonSchedulerProps> = ({
  sections,
  scheduledLessons,
  onScheduleLesson,
  onUnscheduleLesson,
  onUpdateSchedule,
}) => {
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{
    lesson: Lesson;
    sectionId: string;
    sectionTitle: string;
  } | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    date: '',
    startTime: '',
    endTime: '',
  });

  const getScheduleForLesson = (lessonId: string) => {
    return scheduledLessons.find(s => s.lessonId === lessonId);
  };

  const isLessonScheduled = (lessonId: string) => {
    return scheduledLessons.some(s => s.lessonId === lessonId);
  };

  const handleScheduleLesson = (
    lesson: Lesson,
    sectionId: string,
    sectionTitle: string
  ) => {
    setSelectedLesson({ lesson, sectionId, sectionTitle });

    // Calculate end time based on lesson duration
    if (scheduleForm.startTime) {
      const [hours, minutes] = scheduleForm.startTime.split(':').map(Number);
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + lesson.duration;
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      setScheduleForm(prev => ({
        ...prev,
        endTime: `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`,
      }));
    }

    setIsScheduleDialogOpen(true);
  };

  const handleScheduleSubmit = () => {
    if (
      selectedLesson &&
      scheduleForm.date &&
      scheduleForm.startTime &&
      scheduleForm.endTime
    ) {
      onScheduleLesson({
        lessonId: selectedLesson.lesson.id!,
        sectionId: selectedLesson.sectionId,
        date: scheduleForm.date,
        startTime: scheduleForm.startTime,
        endTime: scheduleForm.endTime,
      });

      setIsScheduleDialogOpen(false);
      setSelectedLesson(null);
      setScheduleForm({ date: '', startTime: '', endTime: '' });
    }
  };

  const handleStartTimeChange = (time: string) => {
    setScheduleForm(prev => ({ ...prev, startTime: time }));

    // Auto-calculate end time based on lesson duration
    if (selectedLesson && time) {
      const [hours, minutes] = time.split(':').map(Number);
      const startMinutes = hours * 60 + minutes;
      const endMinutes = startMinutes + selectedLesson.lesson.duration;
      const endHours = Math.floor(endMinutes / 60);
      const endMins = endMinutes % 60;
      setScheduleForm(prev => ({
        ...prev,
        endTime: `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`,
      }));
    }
  };

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return <Video className="size-4" />;
      case 'interactive':
        return <BookOpen className="size-4" />;
      default:
        return <BookOpen className="size-4" />;
    }
  };

  const getLessonTypeColor = (type: Lesson['type']) => {
    switch (type) {
      case 'video':
        return 'bg-purple-100 text-purple-800';
      case 'interactive':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {sections.map(section => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
              {section.description && (
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
              )}
            </CardHeader>
            <CardContent>
              {section.lessons.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No lessons in this section
                </p>
              ) : (
                <div className="space-y-3">
                  {section.lessons.map(lesson => {
                    const schedule = getScheduleForLesson(lesson.id!);
                    const isScheduled = isLessonScheduled(lesson.id!);

                    return (
                      <div
                        key={lesson.id}
                        className={cn(
                          'flex items-center justify-between p-3 border rounded-lg',
                          isScheduled && 'bg-muted/50'
                        )}
                      >
                        <div className="flex flex-1 items-center gap-3">
                          <div
                            className={cn(
                              'flex items-center justify-center w-8 h-8 rounded-full',
                              getLessonTypeColor(lesson.type)
                            )}
                          >
                            {getLessonIcon(lesson.type)}
                          </div>

                          <div className="flex-1">
                            <div className="font-medium">{lesson.title}</div>
                            <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="size-3" />
                                {lesson.duration} min
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {lesson.type}
                              </Badge>
                              <Badge
                                variant={
                                  lesson.status === 'published'
                                    ? 'default'
                                    : 'outline'
                                }
                                className="text-xs"
                              >
                                {lesson.status}
                              </Badge>
                            </div>

                            {schedule && (
                              <div className="mt-2 flex items-center gap-2 text-sm">
                                <CalendarIcon className="size-3 text-primary" />
                                <span className="text-primary">
                                  {new Date(schedule.date).toLocaleDateString()}{' '}
                                  at {schedule.startTime} - {schedule.endTime}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isScheduled ? (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (schedule) {
                                    setSelectedLesson({
                                      lesson,
                                      sectionId: section.id!,
                                      sectionTitle: section.title,
                                    });
                                    setScheduleForm({
                                      date: schedule.date,
                                      startTime: schedule.startTime,
                                      endTime: schedule.endTime,
                                    });
                                    setIsScheduleDialogOpen(true);
                                  }
                                }}
                              >
                                Edit Schedule
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onUnscheduleLesson(lesson.id!)}
                              >
                                Unschedule
                              </Button>
                            </>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleScheduleLesson(
                                  lesson,
                                  section.id!,
                                  section.title
                                )
                              }
                            >
                              <Plus className="mr-1 size-4" />
                              Schedule
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={isScheduleDialogOpen}
        onOpenChange={setIsScheduleDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Lesson</DialogTitle>
            <DialogDescription>
              {selectedLesson && (
                <>
                  Set the date and time for &quot;{selectedLesson.lesson.title}
                  &quot; from section &quot;{selectedLesson.sectionTitle}&quot;
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {selectedLesson && (
              <div className="rounded-lg bg-muted p-3">
                <div className="mb-2 flex items-center gap-2">
                  {getLessonIcon(selectedLesson.lesson.type)}
                  <span className="font-medium">
                    {selectedLesson.lesson.title}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Duration: {selectedLesson.lesson.duration} minutes
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="schedule-date">Date</Label>
              <Input
                id="schedule-date"
                type="date"
                value={scheduleForm.date}
                onChange={e =>
                  setScheduleForm(prev => ({ ...prev, date: e.target.value }))
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="schedule-start-time">Start Time</Label>
              <Input
                id="schedule-start-time"
                type="time"
                value={scheduleForm.startTime}
                onChange={e => handleStartTimeChange(e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="schedule-end-time">End Time</Label>
              <Input
                id="schedule-end-time"
                type="time"
                value={scheduleForm.endTime}
                onChange={e =>
                  setScheduleForm(prev => ({
                    ...prev,
                    endTime: e.target.value,
                  }))
                }
                className="mt-1"
                readOnly
              />
              <p className="mt-1 text-xs text-muted-foreground">
                End time is calculated automatically based on lesson duration
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsScheduleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleScheduleSubmit}>Schedule Lesson</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LessonScheduler;
export type { ScheduledLesson };
