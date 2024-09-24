import isEqual from 'lodash/isEqual';
import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { shallowEqual } from '../../utils';
const EVENT_DEFAULT_COLOR = '#FFFFFF';
const EventBlock = ({
  event,
  dayIndex,
  columnWidth,
  onPressEvent,
  onLongPressEvent,
  renderEventContent,
  theme,
  selectedEventId,
  eventAnimatedDuration,
  isPinchActive,
  timeIntervalHeight,
  heightByTimeInterval
}) => {
  const _onLongPress = () => {
    const eventParams = {
      ...event,
      top: event.startHour * heightByTimeInterval.value,
      height: event.duration * heightByTimeInterval.value,
      leftByIndex: columnWidth * dayIndex
    };
    onLongPressEvent === null || onLongPressEvent === void 0 ? void 0 : onLongPressEvent(eventParams);
  };
  const _onPress = () => {
    const eventParams = {
      ...event,
      top: event.startHour * heightByTimeInterval.value,
      height: event.duration * heightByTimeInterval.value,
      leftByIndex: columnWidth * dayIndex
    };
    onPressEvent === null || onPressEvent === void 0 ? void 0 : onPressEvent(eventParams);
  };
  const eventStyle = useAnimatedStyle(() => {
    let eventHeight = event.duration * heightByTimeInterval.value;
    if (theme.minimumEventHeight) {
      eventHeight = Math.max(theme.minimumEventHeight, eventHeight);
    }
    if (isPinchActive.value) {
      return {
        top: event.startHour * heightByTimeInterval.value,
        height: eventHeight,
        left: event.left + columnWidth * dayIndex,
        width: event.width
      };
    }
    return {
      top: withTiming(event.startHour * heightByTimeInterval.value, {
        duration: eventAnimatedDuration
      }),
      height: withTiming(eventHeight, {
        duration: eventAnimatedDuration
      }),
      left: withTiming(event.left + columnWidth * dayIndex, {
        duration: eventAnimatedDuration
      }),
      width: withTiming(event.width, {
        duration: eventAnimatedDuration
      })
    };
  }, [event]);
  const _renderEventContent = () => {
    var _event$description, _event$description2, _event$description3, _event$description4, _event$description5;
    return /*#__PURE__*/React.createElement(View, null, /*#__PURE__*/React.createElement(Text, {
      allowFontScaling: theme.allowFontScaling,
      ellipsizeMode: "tail",
      numberOfLines: 1,
      style: [styles.title, {
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
  const eventOpacity = selectedEventId ? 0.5 : 1;
  return /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.eventBlock, {
      opacity: eventOpacity
    }, event.containerStyle, eventStyle]
  }, /*#__PURE__*/React.createElement(TouchableOpacity, {
    disabled: !!selectedEventId,
    delayLongPress: 300,
    onPress: _onPress,
    onLongPress: _onLongPress,
    style: [StyleSheet.absoluteFill, {
      backgroundColor: event.color || EVENT_DEFAULT_COLOR
    }],
    activeOpacity: 0.6
  }, renderEventContent ? renderEventContent(event, timeIntervalHeight) : _renderEventContent()));
};
const areEqual = (prev, next) => {
  const {
    event: prevEvent,
    theme: prevTheme,
    ...prevOther
  } = prev;
  const {
    event: nextEvent,
    theme: nextTheme,
    ...nextOther
  } = next;
  const isSameEvent = isEqual(prevEvent, nextEvent);
  const isSameTheme = isEqual(prevTheme, nextTheme);
  const isSameOther = shallowEqual(prevOther, nextOther);
  return isSameEvent && isSameTheme && isSameOther;
};
export default /*#__PURE__*/memo(EventBlock, areEqual);
const styles = StyleSheet.create({
  eventBlock: {
    position: 'absolute',
    borderRadius: 4,
    overflow: 'hidden'
  },
  title: {
    paddingVertical: 4,
    paddingHorizontal: 2,
    fontSize: 14,
    fontWeight: 'bold'
  },
  description: {
    fontSize: 12
  }
});
//# sourceMappingURL=EventBlock.js.map