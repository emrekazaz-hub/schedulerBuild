function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { forwardRef } from 'react';
import { Timeline } from './components';
import TimelineProvider from './context/TimelineProvider';
const TimelineCalendar = ({
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
}, ref) => {
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
    dayMinuteStyle
  };
  return /*#__PURE__*/React.createElement(TimelineProvider, _extends({}, timelineProviderProps, {
    nightHours: nightHours,
    dayMinutes: dayMinutes,
    dayMinuteStyle: dayMinuteStyle
  }), /*#__PURE__*/React.createElement(Timeline, _extends({}, timelineProps, {
    ref: ref
  })));
};
export default /*#__PURE__*/forwardRef(TimelineCalendar);
//# sourceMappingURL=TimelineCalendar.js.map