import React, { forwardRef } from 'react';
import { Timeline } from './components';
import TimelineProvider from './context/TimelineProvider';
import type { TimelineCalendarHandle, TimelineCalendarProps } from './types';

const TimelineCalendar: React.ForwardRefRenderFunction<
  TimelineCalendarHandle,
  TimelineCalendarProps
> = (
  {
    renderDayBarItem,
    onPressDayNum,
    onDragCreateEnd,
    onLongPressBackground,
    onPressBackground,
    onPressOutBackground,
    onDateChanged,
    isLoading,
    holidays,
    events,
    onLongPressEvent,
    onPressEvent,
    renderEventContent,
    selectedEvent,
    onEndDragSelectedEvent,
    renderCustomUnavailableItem,
    highlightDates,
    onChange,
    editEventGestureEnabled,
    renderSelectedEventContent,
    EditIndicatorComponent,
    renderHalfLineCustom,
    halfLineContainerStyle,
    onTimeIntervalHeightChange,
    nightHours,
    dayMinutes,
    dayMinuteStyle,
    ...timelineProviderProps
  },
  ref
) => {
  const timelineProps = {
    renderDayBarItem,
    onPressDayNum,
    onDragCreateEnd,
    onLongPressBackground,
    onPressBackground,
    onPressOutBackground,
    onDateChanged,
    isLoading,
    holidays,
    events,
    onLongPressEvent,
    onPressEvent,
    renderEventContent,
    selectedEvent,
    onEndDragSelectedEvent,
    renderCustomUnavailableItem,
    highlightDates,
    onChange,
    editEventGestureEnabled,
    renderSelectedEventContent,
    EditIndicatorComponent,
    renderHalfLineCustom,
    halfLineContainerStyle,
    onTimeIntervalHeightChange,
    nightHours,
    dayMinutes,
    dayMinuteStyle,
  };

  return (
    <TimelineProvider
      {...timelineProviderProps}
      nightHours={nightHours}
      dayMinutes={dayMinutes}
      dayMinuteStyle={dayMinuteStyle}
    >
      <Timeline {...timelineProps} ref={ref} />
    </TimelineProvider>
  );
};

export default forwardRef(TimelineCalendar);
