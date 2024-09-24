import moment from 'moment-timezone';
import React, { memo, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { Easing, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { COLUMNS, DEFAULT_PROPS } from '../../constants';
import { useTimelineCalendarContext } from '../../context/TimelineProvider';
import useTimelineScroll from '../../hooks/useTimelineScroll';
import { roundTo, triggerHaptic } from '../../utils';
const EVENT_DEFAULT_COLOR = '#FFFFFF';
const DragEditItem = ({
  selectedEvent,
  onEndDragSelectedEvent,
  renderEventContent,
  isEnabled = true,
  EditIndicatorComponent
}) => {
  const {
    columnWidth,
    hourWidth,
    offsetY,
    dragStep,
    pages,
    currentIndex,
    isScrolling,
    timelineWidth,
    rightEdgeSpacing,
    spaceFromTop,
    timeIntervalHeight,
    heightByTimeInterval,
    viewMode,
    spaceFromBottom,
    timelineLayoutRef,
    totalHours,
    theme,
    hourFormat,
    useHaptic,
    tzOffset,
    start,
    navigateDelay
  } = useTimelineCalendarContext();
  const {
    goToNextPage,
    goToPrevPage,
    goToOffsetY
  } = useTimelineScroll();
  const event = useRef(selectedEvent).current;
  const leftWithHourColumn = event.leftByIndex + hourWidth;
  const defaultTopPosition = event.top + spaceFromTop;
  const eventWidth = useSharedValue(event.width);
  const eventLeft = useSharedValue(leftWithHourColumn + event.left);
  const currentHour = useSharedValue(event.top / heightByTimeInterval.value + start);
  const startOffsetY = useSharedValue(0);
  const startXY = useSharedValue({
    x: 0,
    y: 0
  });
  const translateX = useSharedValue(0);
  const eventTop = useSharedValue(defaultTopPosition);
  const eventHeight = useSharedValue(event.height);
  useEffect(() => {
    if (useHaptic) {
      triggerHaptic();
    }
  }, [useHaptic]);
  useEffect(() => {
    requestAnimationFrame(() => {
      eventWidth.value = withTiming(columnWidth - rightEdgeSpacing, {
        duration: 100
      });
      eventLeft.value = withTiming(leftWithHourColumn, {
        duration: 100
      });
    });
  }, [columnWidth, eventLeft, eventWidth, leftWithHourColumn, rightEdgeSpacing]);
  const timeoutRef = useRef(null);
  const _handleScroll = ({
    x,
    y,
    type
  }) => {
    if (timeoutRef.current && x > hourWidth && x < timelineWidth - 25) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (x <= hourWidth) {
      if (isScrolling.current || timeoutRef.current) {
        return;
      }
      timeoutRef.current = setInterval(() => {
        goToPrevPage(true);
      }, navigateDelay);
    }
    if (x >= timelineWidth - 25) {
      if (isScrolling.current || timeoutRef.current) {
        return;
      }
      timeoutRef.current = setInterval(() => {
        goToNextPage(true);
      }, navigateDelay);
    }
    const scrollTargetDiff = Math.abs(startOffsetY.value - offsetY.value);
    const scrollInProgress = scrollTargetDiff > 3;
    if (scrollInProgress) {
      return;
    }
    const startY = y + timeIntervalHeight.value;
    if (startY < 3 && offsetY.value > 0 && type === 'swipe_up') {
      const targetOffset = Math.max(0, offsetY.value - timeIntervalHeight.value * 3);
      startOffsetY.value = targetOffset;
      goToOffsetY(targetOffset);
    }
    const pageSize = timelineLayoutRef.current.height;
    const scrollPosition = y + eventHeight.value - timeIntervalHeight.value;
    if (scrollPosition > pageSize - 3 && type === 'swipe_down') {
      const spacingInBottomAndTop = spaceFromTop + spaceFromBottom;
      const timelineHeight = totalHours * timeIntervalHeight.value;
      const maxOffsetY = timelineHeight + spacingInBottomAndTop - pageSize;
      const nextOffset = offsetY.value + timeIntervalHeight.value * 3;
      const targetOffset = Math.min(maxOffsetY, nextOffset);
      startOffsetY.value = targetOffset;
      goToOffsetY(targetOffset);
    }
  };
  const recalculateEvent = () => {
    const newLeftPosition = selectedEvent.leftByIndex + translateX.value;
    const dayIndex = Math.round(newLeftPosition / columnWidth);
    const startDate = pages[viewMode].data[currentIndex.value];
    const currentDateMoment = moment.tz(startDate, tzOffset).add(dayIndex, 'd').add(currentHour.value, 'h');
    const newEvent = {
      ...selectedEvent,
      left: newLeftPosition,
      top: eventTop.value,
      height: eventHeight.value,
      start: currentDateMoment.toISOString(),
      end: currentDateMoment.clone().add(eventHeight.value / heightByTimeInterval.value, 'h').toISOString()
    };
    if (onEndDragSelectedEvent) {
      onEndDragSelectedEvent(newEvent);
    }
  };
  const clearCurrentInterval = () => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  const dragPositionGesture = Gesture.Pan().enabled(isEnabled).runOnJS(true).maxPointers(1).onStart(() => {
    startOffsetY.value = offsetY.value;
    startXY.value = {
      x: translateX.value,
      y: eventTop.value - offsetY.value
    };
  }).onUpdate(({
    translationX,
    translationY,
    absoluteX
  }) => {
    const initIndex = event.leftByIndex / columnWidth;
    const maxIndex = COLUMNS[viewMode] - 1;
    const minRounded = -initIndex;
    const maxRounded = maxIndex - initIndex;
    const nextTranslateX = startXY.value.x + translationX;
    const xToIndex = Math.round(nextTranslateX / columnWidth);
    const clampIndex = Math.min(Math.max(minRounded, xToIndex), maxRounded);
    const roundedTranslateX = clampIndex * columnWidth;
    const nextTranslateY = startXY.value.y + translationY;
    const offset = offsetY.value - spaceFromTop;
    const originalY = startXY.value.y + offset + translationY;
    const originalTime = originalY / heightByTimeInterval.value;
    const roundedHour = roundTo(originalTime, dragStep, 'up');
    const newTopPosition = roundedHour * heightByTimeInterval.value + spaceFromTop;
    const isSameX = translateX.value === roundedTranslateX;
    const isSameY = eventTop.value === newTopPosition;
    if (!isSameX || !isSameY) {
      translateX.value = withTiming(roundedTranslateX, {
        duration: 100,
        easing: Easing.linear
      });
      eventTop.value = newTopPosition;
      currentHour.value = roundedHour + start;
      if (useHaptic) {
        runOnJS(triggerHaptic)();
      }
    }
    runOnJS(_handleScroll)({
      x: absoluteX,
      y: nextTranslateY,
      type: nextTranslateY > startXY.value.y ? 'swipe_down' : 'swipe_up'
    });
  }).onEnd(() => {
    runOnJS(recalculateEvent)();
  }).onTouchesUp(() => {
    runOnJS(clearCurrentInterval)();
  });
  const startHeight = useSharedValue(0);
  const dragDurationGesture = Gesture.Pan().enabled(isEnabled).runOnJS(true).maxPointers(1).onStart(() => {
    startOffsetY.value = offsetY.value;
    startHeight.value = eventHeight.value;
  }).onUpdate(e => {
    const heightOfTenMinutes = dragStep / 60 * heightByTimeInterval.value;
    const nextHeight = startHeight.value + e.translationY;
    const roundedHeight = Math.ceil(nextHeight / heightOfTenMinutes) * heightOfTenMinutes;
    const clampedHeight = Math.max(roundedHeight, heightOfTenMinutes);
    const isSameHeight = eventHeight.value === clampedHeight;
    if (!isSameHeight) {
      eventHeight.value = clampedHeight;
      if (useHaptic) {
        runOnJS(triggerHaptic)();
      }
    }
  }).onEnd(() => {
    runOnJS(recalculateEvent)();
  }).onTouchesUp(() => {
    runOnJS(clearCurrentInterval)();
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: eventHeight.value,
      width: eventWidth.value,
      left: eventLeft.value,
      top: eventTop.value,
      transform: [{
        translateX: translateX.value
      }]
    };
  }, []);
  const _renderEventContent = () => {
    var _event$description, _event$description2, _event$description3, _event$description4, _event$description5;
    return /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Text, {
      allowFontScaling: theme.allowFontScaling,
      ellipsizeMode: "tail",
      numberOfLines: 1,
      style: [styles.titleEvent, {
        color: (_event$description = event.description) === null || _event$description === void 0 ? void 0 : _event$description.titleColor
      }]
    }, event.title), /*#__PURE__*/React.createElement(Text, {
      allowFontScaling: theme.allowFontScaling,
      ellipsizeMode: "tail",
      numberOfLines: 1,
      style: [styles.description, {
        color: (_event$description2 = event.description) === null || _event$description2 === void 0 ? void 0 : _event$description2.titleColor
      }]
    }, event === null || event === void 0 ? void 0 : (_event$description3 = event.description) === null || _event$description3 === void 0 ? void 0 : _event$description3.hour), /*#__PURE__*/React.createElement(Text, {
      allowFontScaling: theme.allowFontScaling,
      ellipsizeMode: "tail",
      numberOfLines: 1,
      style: [styles.description, {
        color: (_event$description4 = event.description) === null || _event$description4 === void 0 ? void 0 : _event$description4.titleColor
      }]
    }, event === null || event === void 0 ? void 0 : (_event$description5 = event.description) === null || _event$description5 === void 0 ? void 0 : _event$description5.fullName));
  };
  return /*#__PURE__*/React.createElement(View, {
    style: StyleSheet.absoluteFill,
    pointerEvents: "box-none"
  }, /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: dragPositionGesture
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.eventContainer, {
      backgroundColor: event.color ? event.color : EVENT_DEFAULT_COLOR,
      top: defaultTopPosition
    }, event.containerStyle, animatedStyle]
  }, renderEventContent ? renderEventContent(event, heightByTimeInterval) : _renderEventContent(), /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: dragDurationGesture
  }, /*#__PURE__*/React.createElement(View, {
    style: styles.indicatorContainer
  }, EditIndicatorComponent ? EditIndicatorComponent : /*#__PURE__*/React.createElement(View, {
    style: styles.indicator
  }, /*#__PURE__*/React.createElement(View, {
    style: [styles.indicatorLine, theme.editIndicatorColor ? {
      backgroundColor: theme.editIndicatorColor
    } : undefined]
  }), /*#__PURE__*/React.createElement(View, {
    style: [styles.indicatorLine, theme.editIndicatorColor ? {
      backgroundColor: theme.editIndicatorColor
    } : undefined]
  })))))), /*#__PURE__*/React.createElement(AnimatedHour, {
    currentHour: currentHour,
    animatedTop: eventTop,
    top: defaultTopPosition,
    hourWidth: hourWidth,
    theme: theme,
    hourFormat: hourFormat
  }), /*#__PURE__*/React.createElement(AnimatedEndHour, {
    currentHour: currentHour,
    eventTop: eventTop,
    hourWidth: hourWidth,
    theme: theme,
    hourFormat: hourFormat,
    heightByTimeInterval: heightByTimeInterval,
    eventHeight: eventHeight
  }));
};
export default /*#__PURE__*/memo(DragEditItem);
const AnimatedHour = ({
  currentHour,
  animatedTop,
  top,
  hourWidth,
  theme,
  hourFormat
}) => {
  const [time, setTime] = useState('');
  const _onChangedTime = (hourStr, minutesStr) => {
    let newTime = `${hourStr}:${minutesStr}`;
    if (hourFormat) {
      newTime = moment(`1970/1/1 ${hourStr}:${minutesStr}`, 'YYYY/M/D HH:mm').format(hourFormat);
    }
    setTime(newTime);
  };
  useAnimatedReaction(() => currentHour.value, hour => {
    let extra = 0;
    if (hour < 0) {
      extra = 24;
    } else if (hour >= 24) {
      extra = -24;
    }
    const convertedTime = hour + extra;
    const rHours = Math.floor(convertedTime);
    const minutes = (convertedTime - rHours) * 60;
    const rMinutes = Math.round(minutes);
    const offset = rHours < 0 ? 24 : 0;
    const hourStr = rHours + offset < 10 ? '0' + rHours : rHours + offset;
    const minutesStr = rMinutes < 10 ? '0' + rMinutes : rMinutes;
    runOnJS(_onChangedTime)(hourStr, minutesStr);
  });
  const animatedTextStyles = useAnimatedStyle(() => {
    return {
      top: animatedTop.value - 6
    };
  });
  return /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.hourContainer, {
      width: hourWidth - 8,
      top: top - 6
    }, theme.dragHourContainer, animatedTextStyles]
  }, /*#__PURE__*/React.createElement(Text, {
    allowFontScaling: theme.allowFontScaling,
    style: [styles.hourText, theme.dragHourText]
  }, time));
};
const AnimatedEndHour = ({
  currentHour,
  eventTop,
  hourWidth,
  theme,
  hourFormat,
  eventHeight,
  heightByTimeInterval
}) => {
  const [endTime, setEndTime] = useState('');
  const _onChangedEndTime = (hourStr, minutesStr) => {
    let newEndTime = `${hourStr}:${minutesStr}`;
    if (hourFormat) {
      newEndTime = moment(`1970/1/1 ${hourStr}:${minutesStr}`, 'YYYY/M/D HH:mm').format(hourFormat);
    }
    setEndTime(newEndTime);
  };
  useAnimatedReaction(() => {
    const startHour = currentHour.value;
    const endHour = startHour + eventHeight.value / heightByTimeInterval.value;
    const rHours = Math.floor(endHour);
    const minutes = (endHour - rHours) * 60;
    const rMinutes = Math.round(minutes);
    let adjustedHours = rHours;
    if (adjustedHours < 0) {
      adjustedHours += 24;
    } else if (adjustedHours >= 24) {
      adjustedHours -= 24;
    }
    const hourStr = adjustedHours < 10 ? '0' + adjustedHours : adjustedHours;
    const minutesStr = rMinutes < 10 ? '0' + rMinutes : rMinutes;
    return {
      hourStr,
      minutesStr
    };
  }, ({
    hourStr,
    minutesStr
  }) => {
    runOnJS(_onChangedEndTime)(hourStr, minutesStr);
  });
  const animatedTextStyles = useAnimatedStyle(() => {
    const endHourTop = eventTop.value + eventHeight.value - 6;
    return {
      top: endHourTop
    };
  });
  return /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.hourContainer, {
      width: hourWidth - 8
    }, theme.dragHourContainer, animatedTextStyles]
  }, /*#__PURE__*/React.createElement(Text, {
    style: [styles.hourText, theme.dragHourText]
  }, endTime));
};
const styles = StyleSheet.create({
  eventContainer: {
    position: 'absolute',
    borderRadius: 4,
    overflow: 'hidden'
  },
  badgeContainer: {
    padding: 2,
    borderRadius: 2,
    alignSelf: 'flex-start',
    marginBottom: 2
  },
  hourContainer: {
    position: 'absolute',
    borderColor: DEFAULT_PROPS.PRIMARY_COLOR,
    backgroundColor: DEFAULT_PROPS.WHITE_COLOR,
    borderWidth: 1,
    borderRadius: 4,
    top: -6,
    alignItems: 'center',
    left: 4
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  indicator: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 24
  },
  title: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    fontSize: 10,
    color: DEFAULT_PROPS.BLACK_COLOR
  },
  hourText: {
    color: DEFAULT_PROPS.PRIMARY_COLOR,
    fontSize: 10
  },
  indicatorLine: {
    width: 12,
    height: 2,
    backgroundColor: '#000',
    marginBottom: 2
  },
  titleEvent: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    fontSize: 14,
    fontWeight: 'bold'
  },
  description: {
    fontSize: 12
  }
});
//# sourceMappingURL=DragEditItem.js.map