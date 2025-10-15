'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import moment from 'moment';
import React, { useCallback, useMemo, useState } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import withDragAndDrop, {
  DragFromOutsideItemArgs,
} from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './big-calendar.css';

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Create drag-and-drop enabled calendar
const DragAndDropCalendar = withDragAndDrop(Calendar);

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  duration?: number; // in hours
  type: 'session';
  sectionId: string;
  sectionTitle: string;
  isHighlighted?: boolean;
}

interface CalendarProps {
  events: CalendarEvent[];
  selectedSectionId?: string;
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  onEventDrop?: (event: CalendarEvent, start: Date, end: Date) => void;
  onDropFromOutside?: (dropInfo: DragFromOutsideItemArgs) => void;
  dragFromOutsideItem?: () => any;
  onEventDragEnd?: () => void;
  onEventRightClick?: (
    event: CalendarEvent,
    mouseEvent: React.MouseEvent
  ) => void;
}

// Convert our CalendarEvent to react-big-calendar Event format
interface BigCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: CalendarEvent;
  originalEvent: CalendarEvent;
}

// Color palette for sections
const SECTION_COLORS = [
  { bg: 'rgba(59, 130, 246, 0.1)', border: '#3b82f6', name: 'Blue' }, // blue
  { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', name: 'Green' }, // emerald
  { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', name: 'Orange' }, // amber
  { bg: 'rgba(139, 92, 246, 0.1)', border: '#8b5cf6', name: 'Purple' }, // violet
  { bg: 'rgba(236, 72, 153, 0.1)', border: '#ec4899', name: 'Pink' }, // pink
  { bg: 'rgba(14, 165, 233, 0.1)', border: '#0ea5e9', name: 'Sky' }, // sky
  { bg: 'rgba(34, 197, 94, 0.1)', border: '#22c55e', name: 'Lime' }, // green
  { bg: 'rgba(251, 146, 60, 0.1)', border: '#fb923c', name: 'Orange' }, // orange
];

// Function to get color for a section
const getSectionColor = (sectionId: string) => {
  const hash = sectionId.split('').reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(hash) % SECTION_COLORS.length;
  return SECTION_COLORS[index];
};

const BigCalendar: React.FC<CalendarProps> = ({
  events,
  selectedSectionId,
  onEventClick,
  onDateClick,
  onEventDrop,
  onDropFromOutside,
  dragFromOutsideItem,
  onEventDragEnd,
  onEventRightClick,
}) => {
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>('month');
  // Force remount to clear any lingering drag preview from react-big-calendar DnD addon
  const [refreshKey, setRefreshKey] = useState(0);

  // Convert our events to react-big-calendar format
  const calendarEvents: BigCalendarEvent[] = useMemo(() => {
    const convertedEvents = events.map(event => {
      // Parse start and end times
      const start = new Date(event.date);
      let end = new Date(event.date);

      if (event.startTime) {
        const [hours, minutes] = event.startTime.split(':').map(Number);
        start.setHours(hours, minutes, 0, 0);

        if (event.endTime) {
          const [endHours, endMinutes] = event.endTime.split(':').map(Number);
          end.setHours(endHours, endMinutes, 0, 0);
        } else if (event.duration) {
          end = new Date(start.getTime() + event.duration * 60 * 60 * 1000);
        } else {
          // Default to 1 hour if no end time or duration
          end = new Date(start.getTime() + 60 * 60 * 1000);
        }
      } else {
        // For events without time, make them 1-hour events starting at 9 AM
        start.setHours(9, 0, 0, 0);
        end.setHours(10, 0, 0, 0);
      }

      const calendarEvent = {
        id: event.id,
        title: event.title,
        start,
        end,
        resource: event,
        originalEvent: event,
      };

      return calendarEvent;
    });

    return convertedEvents;
  }, [events]);

  // Handle event selection
  const handleSelectEvent = useCallback(
    (event: object) => {
      const bigCalendarEvent = event as BigCalendarEvent;
      onEventClick?.(bigCalendarEvent.originalEvent);
    },
    [onEventClick]
  );

  // Custom Event Component with section-based colors
  const CustomEvent = useCallback(
    ({ event }: { event: object }) => {
      const bigCalendarEvent = event as BigCalendarEvent;
      const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onEventRightClick?.(bigCalendarEvent.originalEvent, e);
      };
      if (!bigCalendarEvent.originalEvent) {
        return (
          <div
            onContextMenu={handleRightClick}
            className="size-full cursor-pointer"
            style={{
              backgroundColor: 'rgba(107, 114, 128, 0.08)',
              color: '#374151',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '11px',
              fontWeight: '400',
              transition: 'all 0.15s ease',
            }}
            title={undefined}
          >
            <div className="truncate">{bigCalendarEvent.title}</div>
          </div>
        );
      }

      const originalEvent = bigCalendarEvent.originalEvent;
      const sectionColor = getSectionColor(originalEvent?.sectionId);

      // Determine if this section should be highlighted
      const isHighlighted =
        !selectedSectionId || originalEvent?.sectionId === selectedSectionId;

      // Use section color if highlighted, gray if not
      const backgroundColor = isHighlighted
        ? sectionColor.bg
        : 'rgba(107, 114, 128, 0.08)';

      return (
        <div
          onContextMenu={handleRightClick}
          className="size-full cursor-pointer"
          style={{
            backgroundColor,
            color: '#374151',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '11px',
            fontWeight: '400',
            transition: 'all 0.15s ease',
            opacity: isHighlighted ? 1 : 0.6,
          }}
          title={originalEvent?.description}
          onMouseEnter={e => {
            if (isHighlighted) {
              e.currentTarget.style.backgroundColor = sectionColor.bg.replace(
                '0.1',
                '0.15'
              );
            } else {
              e.currentTarget.style.backgroundColor =
                'rgba(107, 114, 128, 0.12)';
            }
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = backgroundColor;
          }}
        >
          <div className="truncate">{bigCalendarEvent.title}</div>
        </div>
      );
    },
    [onEventRightClick, selectedSectionId]
  );

  // Handle slot selection (clicking on empty calendar slot)
  const handleSelectSlot = useCallback(
    ({ start }: { start: Date; end: Date }) => {
      onDateClick?.(start);
    },
    [onDateClick]
  );

  // Handle event drag and drop
  const handleEventDrop = useCallback(
    (args: any) => {
      const { event, start, end } = args;
      const bigCalendarEvent = event as BigCalendarEvent;
      onEventDrop?.(bigCalendarEvent.originalEvent, start, end);
      // Call drag end when drop completes
      onEventDragEnd?.();
      // Force remount to clear any stuck preview
      setRefreshKey(k => k + 1);
    },
    [onEventDrop, onEventDragEnd]
  );

  // Handle drops from outside
  const handleDropFromOutside = useCallback(
    (dropInfo: DragFromOutsideItemArgs) => {
      onDropFromOutside?.(dropInfo);
      // Call drag end to clean up any drag state
      onEventDragEnd?.();
      // Force remount to clear external preview ghost if the source doesn't clear it
      setRefreshKey(k => k + 1);
    },
    [onDropFromOutside, onEventDragEnd]
  );

  // Custom event styling with section-based colors
  const eventStyleGetter = useCallback(
    (event: object) => {
      const bigCalendarEvent = event as BigCalendarEvent;
      const originalEvent = bigCalendarEvent.originalEvent;
      if (!originalEvent?.sectionId) {
        return {
          style: {
            backgroundColor: 'rgba(107, 114, 128, 0.08)',
            borderLeft: '3px solid #6b7280',
            color: '#374151',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: '400',
            transition: 'all 0.15s ease',
          },
        };
      }
      const sectionColor = getSectionColor(originalEvent?.sectionId);

      // Determine if this section should be highlighted
      const isHighlighted =
        !selectedSectionId || originalEvent?.sectionId === selectedSectionId;

      // Use section color if highlighted, gray if not
      const backgroundColor = isHighlighted
        ? sectionColor.bg
        : 'rgba(107, 114, 128, 0.08)';
      const borderLeft = `3px solid ${isHighlighted ? sectionColor.border : '#6b7280'}`;

      return {
        style: {
          backgroundColor,
          borderLeft,
          color: '#374151',
          borderRadius: '4px',
          fontSize: '11px',
          fontWeight: '400',
          transition: 'all 0.15s ease',
          opacity: isHighlighted ? 1 : 0.6,
        },
      };
    },
    [selectedSectionId]
  );

  // Custom toolbar with Notion Calendar design
  const CustomToolbar = ({ date, view, onNavigate, onView }: any) => {
    const goBack = () => onNavigate('PREV');
    const goNext = () => onNavigate('NEXT');
    const goToday = () => onNavigate('TODAY');

    const getDateLabel = () => {
      if (view === 'month') {
        return moment(date).format('MMMM YYYY');
      } else if (view === 'week') {
        const start = moment(date).startOf('week');
        const end = moment(date).endOf('week');
        if (start.month() === end.month()) {
          return `${start.format('MMM D')} - ${end.format('D, YYYY')}`;
        }
        return `${start.format('MMM D')} - ${end.format('MMM D, YYYY')}`;
      } else if (view === 'day') {
        return moment(date).format('dddd, MMMM D, YYYY');
      }
      return moment(date).format('MMMM YYYY');
    };

    return (
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            {getDateLabel()}
          </h1>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="size-8 rounded-md p-0 hover:bg-gray-100"
            >
              <ChevronLeft className="size-4 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goNext}
              className="size-8 rounded-md p-0 hover:bg-gray-100"
            >
              <ChevronRight className="size-4 text-gray-600" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={goToday}
            className="rounded-md px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50"
          >
            Today
          </Button>
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
          {['month', 'week', 'day'].map(viewType => (
            <Button
              key={viewType}
              variant="ghost"
              size="sm"
              onClick={() => onView(viewType)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-all',
                view === viewType
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              )}
            >
              {viewType.charAt(0).toUpperCase() + viewType.slice(1)}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-white">
      {/* Calendar container */}
      <div className="h-[700px] overflow-hidden rounded-xl border border-gray-200 bg-white px-8 py-6">
        <DragAndDropCalendar
          key={refreshKey}
          localizer={localizer}
          events={calendarEvents}
          startAccessor={(event: object) => (event as BigCalendarEvent).start}
          endAccessor={(event: object) => (event as BigCalendarEvent).end}
          titleAccessor={(event: object) => (event as BigCalendarEvent).title}
          allDayAccessor={() => false}
          style={{ height: '100%' }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          onSelecting={() => false}
          selectable={true}
          draggableAccessor={() => true}
          onEventDrop={handleEventDrop}
          onDropFromOutside={handleDropFromOutside}
          dragFromOutsideItem={dragFromOutsideItem}
          resizable={false}
          components={{
            event: CustomEvent,
            toolbar: CustomToolbar,
          }}
          eventPropGetter={eventStyleGetter}
          formats={{
            timeGutterFormat: (date: Date) => moment(date).format('H:mm'),
            eventTimeRangeFormat: ({
              start,
              end,
            }: {
              start: Date;
              end: Date;
            }) =>
              `${moment(start).format('H:mm')} - ${moment(end).format('H:mm')}`,
            dayFormat: (date: Date) => moment(date).format('ddd D'),
            dateFormat: (date: Date) => moment(date).format('D'),
            monthHeaderFormat: (date: Date) => moment(date).format('MMMM YYYY'),
          }}
          step={30}
          timeslots={2}
          popup
          popupOffset={30}
          showMultiDayTimes
        />
      </div>
    </div>
  );
};

export default BigCalendar;
export type { CalendarEvent };
