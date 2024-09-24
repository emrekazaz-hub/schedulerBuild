import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTimelineCalendarContext } from '../../../context/TimelineProvider';
const UnavailableMultipleDays = ({
  diffDays,
  left,
  right,
  renderCustomUnavailableItem
}) => {
  const {
    columnWidth,
    theme,
    timeIntervalHeight,
    totalHours
  } = useTimelineCalendarContext();
  return /*#__PURE__*/React.createElement(View, {
    pointerEvents: "box-none",
    style: [styles.unavailableDay, {
      left,
      right,
      backgroundColor: theme.unavailableBackgroundColor,
      width: diffDays * columnWidth
    }]
  }, renderCustomUnavailableItem && renderCustomUnavailableItem({
    timeIntervalHeight: timeIntervalHeight,
    hour: totalHours,
    width: diffDays * columnWidth
  }));
};
export default /*#__PURE__*/memo(UnavailableMultipleDays);
const styles = StyleSheet.create({
  unavailableDay: {
    height: '100%',
    position: 'absolute',
    overflow: 'hidden'
  }
});
//# sourceMappingURL=UnavailableMultipleDays.js.map