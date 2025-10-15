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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';
import {
  BookOpen,
  CalendarIcon,
  Edit,
  FileText,
  Plus,
  Trash2,
  Video,
} from 'lucide-react';

export interface ScheduledSession {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  duration: number; // in hours
  sectionId: string;
  order: number;
}

export interface Section {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'lecture' | 'workshop' | 'discussion' | 'practice';
  duration: number;
  order: number;
}

interface SessionSchedulerProps {
  sections: Section[];
  scheduledSessions: ScheduledSession[];
  selectedSectionId?: string;
  onSectionSelect: (sectionId: string | undefined) => void;
  onScheduleSession: (session: ScheduledSession) => void;
  onUnscheduleSession: (sessionId: string) => void;
  onUpdateSession: (
    sessionId: string,
    updates: Partial<ScheduledSession>
  ) => void;
  onCreateSection?: (sectionData: {
    title: string;
    description: string;
  }) => Promise<Section>;
  allLessons?: Lesson[];
}

const SessionScheduler: React.FC<SessionSchedulerProps> = ({
  sections,
  scheduledSessions,
  selectedSectionId,
  onSectionSelect,
  onScheduleSession,
  onUnscheduleSession,
  onUpdateSession,
  onCreateSection,
  allLessons = [],
}) => {
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [createSectionDialogOpen, setCreateSectionDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<ScheduledSession | null>(
    null
  );
  const [newSession, setNewSession] = useState<Partial<ScheduledSession>>({
    title: '',
    description: '',
    date: '',
    startTime: '09:00',
    endTime: '11:00',
    duration: 2,
  });
  const [newSectionData, setNewSectionData] = useState({
    title: '',
    description: '',
    autoCreateSessions: true,
  });

  const selectedSection = sections.find(s => s.id === selectedSectionId);
  const sectionsWithSessions = sections.map(section => ({
    ...section,
    sessions: scheduledSessions.filter(
      session => session.sectionId === section.id
    ),
  }));

  const calculateDuration = (startTime: string, endTime: string): number => {
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return (endTotalMinutes - startTotalMinutes) / 60;
  };

  const handleScheduleSubmit = () => {
    if (
      !selectedSectionId ||
      !newSession.title ||
      !newSession.date ||
      !newSession.startTime ||
      !newSession.endTime
    ) {
      return;
    }

    const duration = calculateDuration(
      newSession.startTime,
      newSession.endTime
    );
    const sessionToSchedule: ScheduledSession = {
      id: editingSession?.id || `session-${Date.now()}`,
      title: newSession.title,
      description: newSession.description || '',
      date: newSession.date,
      startTime: newSession.startTime,
      endTime: newSession.endTime,
      duration,
      sectionId: selectedSectionId,
      order:
        editingSession?.order ||
        scheduledSessions.filter(s => s.sectionId === selectedSectionId)
          .length + 1,
    };

    if (editingSession) {
      onUpdateSession(editingSession.id, sessionToSchedule);
    } else {
      onScheduleSession(sessionToSchedule);
    }

    // Reset form
    setNewSession({
      title: '',
      description: '',
      date: '',
      startTime: '09:00',
      endTime: '11:00',
      duration: 2,
    });
    setEditingSession(null);
    setScheduleDialogOpen(false);
  };

  const handleCreateSection = async () => {
    if (!onCreateSection || !newSectionData.title.trim()) {
      return;
    }

    try {
      const createdSection = await onCreateSection({
        title: newSectionData.title,
        description: newSectionData.description,
      });

      // If auto-create sessions is enabled and we have lessons, generate sessions
      if (newSectionData.autoCreateSessions && allLessons.length > 0) {
        // Calculate total duration of all lessons in minutes
        const totalDurationMinutes = allLessons.reduce(
          (total, lesson) => total + lesson.duration,
          0
        );
        const sessionDurationHours = Math.max(
          1,
          Math.ceil(totalDurationMinutes / 60)
        ); // At least 1 hour sessions

        // Create initial session suggestions based on lessons
        const suggestedSession: ScheduledSession = {
          id: `session-${Date.now()}`,
          title: `${createdSection.title} - Session 1`,
          description: `Teaching session for ${createdSection.title} (${allLessons.length} lessons, ~${totalDurationMinutes} min)`,
          date: '', // User will set this
          startTime: '09:00',
          endTime: `${9 + sessionDurationHours}:00`.padStart(5, '0'),
          duration: sessionDurationHours,
          sectionId: createdSection.id,
          order: 1,
        };

        // Auto-schedule the session (user can modify later)
        onScheduleSession(suggestedSession);
      }

      // Reset form and close dialog
      setNewSectionData({
        title: '',
        description: '',
        autoCreateSessions: true,
      });
      setCreateSectionDialogOpen(false);

      // Select the new section
      onSectionSelect(createdSection.id);
    } catch (error) {
      console.error('Failed to create section:', error);
    }
  };

  const handleEditSession = (session: ScheduledSession) => {
    setEditingSession(session);
    setNewSession({
      title: session.title,
      description: session.description,
      date: session.date,
      startTime: session.startTime,
      endTime: session.endTime,
      duration: session.duration,
    });
    setScheduleDialogOpen(true);
  };

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'lecture':
        return <Video className="size-3" />;
      case 'workshop':
        return <BookOpen className="size-3" />;
      case 'practice':
        return <BookOpen className="size-3" />;
      default:
        return <FileText className="size-3" />;
    }
  };

  const getTotalLessonDuration = (lessons: Lesson[]): number => {
    return lessons.reduce((total, lesson) => total + lesson.duration, 0);
  };

  return (
    <div className="space-y-6">
      {/* Section Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="size-5" />
            Sections & Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="mb-4 flex items-center gap-2">
              <Button
                variant={selectedSectionId ? 'outline' : 'default'}
                size="sm"
                onClick={() => onSectionSelect(undefined)}
              >
                All Sections
              </Button>
              {onCreateSection && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCreateSectionDialogOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="size-4" />
                  Create New Section
                </Button>
              )}
              <span className="text-sm text-muted-foreground">
                Select a section to schedule its sessions
              </span>
            </div>

            <div className="grid gap-2">
              {sectionsWithSessions.map(section => (
                <div
                  key={section.id}
                  className={cn(
                    'p-3 border rounded-lg cursor-pointer transition-colors',
                    selectedSectionId === section.id
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-muted/50'
                  )}
                  onClick={() => onSectionSelect(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{section.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {section.lessons.length} lessons •{' '}
                        {getTotalLessonDuration(section.lessons)} min total
                      </div>
                      {section.description && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          {section.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {section.sessions.length} sessions
                      </Badge>
                      {selectedSectionId === section.id && (
                        <Badge variant="default">Selected</Badge>
                      )}
                    </div>
                  </div>

                  {/* Show lessons preview */}
                  {section.lessons.length > 0 && (
                    <div className="mt-3 border-t border-border/50 pt-3">
                      <div className="mb-2 text-xs text-muted-foreground">
                        Lessons in this section:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {section.lessons.slice(0, 3).map(lesson => (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-1 rounded bg-muted px-2 py-1 text-xs"
                          >
                            {getLessonIcon(lesson.type)}
                            <span>{lesson.title}</span>
                            <span className="text-muted-foreground">
                              ({lesson.duration}m)
                            </span>
                          </div>
                        ))}
                        {section.lessons.length > 3 && (
                          <div className="rounded bg-muted px-2 py-1 text-xs text-muted-foreground">
                            +{section.lessons.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Management for Selected Section */}
      {selectedSection && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="size-5" />
                  Sessions for &quot;{selectedSection.title}&quot;
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Schedule sessions to teach this section&apos;s content
                </p>
              </div>
              <Dialog
                open={scheduleDialogOpen}
                onOpenChange={setScheduleDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingSession(null);
                      setNewSession({
                        title: `${selectedSection.title} - Session ${scheduledSessions.filter(s => s.sectionId === selectedSectionId).length + 1}`,
                        description: '',
                        date: '',
                        startTime: '09:00',
                        endTime: '11:00',
                        duration: 2,
                      });
                    }}
                  >
                    <Plus className="mr-2 size-4" />
                    Schedule Session
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editingSession ? 'Edit Session' : 'Schedule New Session'}
                    </DialogTitle>
                    <DialogDescription>
                      Create a scheduled session for the section&quot;
                      {selectedSection.title}&quot;
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="session-title">Session Title</Label>
                      <Input
                        id="session-title"
                        value={newSession.title || ''}
                        onChange={e =>
                          setNewSession(prev => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="Enter session title"
                      />
                    </div>

                    <div>
                      <Label htmlFor="session-description">
                        Description (Optional)
                      </Label>
                      <Textarea
                        id="session-description"
                        value={newSession.description || ''}
                        onChange={e =>
                          setNewSession(prev => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Enter session description"
                        className="min-h-[80px]"
                      />
                    </div>

                    <div>
                      <Label htmlFor="session-date">Date</Label>
                      <Input
                        id="session-date"
                        type="date"
                        value={newSession.date || ''}
                        onChange={e =>
                          setNewSession(prev => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="session-start-time">Start Time</Label>
                        <Input
                          id="session-start-time"
                          type="time"
                          value={newSession.startTime || '09:00'}
                          onChange={e => {
                            const startTime = e.target.value;
                            setNewSession(prev => ({
                              ...prev,
                              startTime,
                              duration: calculateDuration(
                                startTime,
                                prev.endTime || '11:00'
                              ),
                            }));
                          }}
                        />
                      </div>

                      <div>
                        <Label htmlFor="session-end-time">End Time</Label>
                        <Input
                          id="session-end-time"
                          type="time"
                          value={newSession.endTime || '11:00'}
                          onChange={e => {
                            const endTime = e.target.value;
                            setNewSession(prev => ({
                              ...prev,
                              endTime,
                              duration: calculateDuration(
                                prev.startTime || '09:00',
                                endTime
                              ),
                            }));
                          }}
                        />
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      Duration:{' '}
                      {newSession.startTime && newSession.endTime
                        ? calculateDuration(
                            newSession.startTime,
                            newSession.endTime
                          ).toFixed(1)
                        : 0}{' '}
                      hours
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setScheduleDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleScheduleSubmit}>
                      {editingSession ? 'Update Session' : 'Schedule Session'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledSessions
                .filter(session => session.sectionId === selectedSectionId)
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map(session => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{session.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {new Date(session.date).toLocaleDateString()} •{' '}
                        {session.startTime} - {session.endTime}
                      </div>
                      {session.description && (
                        <div className="mt-1 text-sm text-muted-foreground">
                          {session.description}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{session.duration}h</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditSession(session)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUnscheduleSession(session.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}

              {scheduledSessions.filter(s => s.sectionId === selectedSectionId)
                .length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  <CalendarIcon className="mx-auto mb-4 size-12 opacity-50" />
                  <p>No sessions scheduled for this section</p>
                  <p className="text-sm">
                    Click &quot;Schedule Session&quot; to create the first one
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Sections Overview */}
      {!selectedSectionId && (
        <Card>
          <CardHeader>
            <CardTitle>All Sections Overview</CardTitle>
            <p className="text-sm text-muted-foreground">
              Select a section above to manage its sessions
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sectionsWithSessions.map(section => (
                <div key={section.id} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{section.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {section.lessons.length} lessons •{' '}
                        {section.sessions.length} sessions
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSectionSelect(section.id)}
                    >
                      Manage Sessions
                    </Button>
                  </div>

                  {section.sessions.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        Upcoming Sessions:
                      </div>
                      <div className="grid gap-2">
                        {section.sessions.slice(0, 3).map(session => (
                          <div
                            key={session.id}
                            className="flex items-center justify-between rounded bg-muted p-2 text-sm"
                          >
                            <span>{session.title}</span>
                            <span className="text-muted-foreground">
                              {new Date(session.date).toLocaleDateString()} •{' '}
                              {session.startTime}
                            </span>
                          </div>
                        ))}
                        {section.sessions.length > 3 && (
                          <div className="text-center text-xs text-muted-foreground">
                            +{section.sessions.length - 3} more sessions
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create New Section Dialog */}
      <Dialog
        open={createSectionDialogOpen}
        onOpenChange={setCreateSectionDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Section</DialogTitle>
            <DialogDescription>
              Create a new section for your course. You can optionally
              auto-generate initial sessions based on your existing lessons.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="section-title">Section Title</Label>
              <Input
                id="section-title"
                value={newSectionData.title}
                onChange={e =>
                  setNewSectionData(prev => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Enter section title..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="section-description">
                Description (Optional)
              </Label>
              <Textarea
                id="section-description"
                value={newSectionData.description}
                onChange={e =>
                  setNewSectionData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter section description..."
                className="mt-1"
                rows={3}
              />
            </div>

            {allLessons.length > 0 && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="auto-create-sessions"
                  checked={newSectionData.autoCreateSessions}
                  onCheckedChange={(checked: boolean) =>
                    setNewSectionData(prev => ({
                      ...prev,
                      autoCreateSessions: checked,
                    }))
                  }
                />
                <Label htmlFor="auto-create-sessions" className="text-sm">
                  Auto-generate initial session based on {allLessons.length}{' '}
                  existing lessons (
                  {allLessons.reduce(
                    (total, lesson) => total + lesson.duration,
                    0
                  )}{' '}
                  min total)
                </Label>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateSectionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateSection}
              disabled={!newSectionData.title.trim()}
            >
              <Plus className="mr-2 size-4" />
              Create Section
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionScheduler;
