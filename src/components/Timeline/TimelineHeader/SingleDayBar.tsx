import moment from 'moment-timezone';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DEFAULT_PROPS } from '../../../constants';
import type { DayBarItemProps } from '../../../types';
import { getDayBarStyle } from '../../../utils';
import { useTimelineCalendarContext } from '../../../context/TimelineProvider';

const SingleDayBar = ({
  width,
  startDate,
  theme,
  locale,
  highlightDates,
  onPressDayNum,
  currentDate,
  tzOffset,
}: DayBarItemProps) => {
  const _renderDay = () => {
    const { dayMinutes } = useTimelineCalendarContext();
    const dateByIndex = moment.tz(startDate, tzOffset);
    const dateStr = dateByIndex.format('YYYY-MM-DD');
    const event = dayMinutes?.find((eventDate) => eventDate.date === dateStr);
    const fahrstunde = event ? `FS: ${event.FS} min.` : 'FS: 0 min.';
    const theoriestunde = event ? `TU: ${event.TU} min.` : 'TU: 0 min.';
    const sonstige = event ? `SO: ${event.SO} min.` : 'SO: 0 min.';
    const [dayNameText, dayNum] = dateByIndex
      .locale(locale)
      .format('ddd,DD')
      .split(',');
    const highlightDate = highlightDates?.[dateStr];

    const { dayName, dayNumber, dayNumberContainer, dayFS, daySO, dayTU } =
      getDayBarStyle(
        currentDate,
        dateByIndex,
        theme,
        highlightDate,
        fahrstunde,
        theoriestunde,
        sonstige
      );

    return (
      <View style={styles.dayItem}>
        <Text
          allowFontScaling={theme.allowFontScaling}
          style={[styles.dayName, dayName]}
        >
          {dayNameText}
        </Text>
        <TouchableOpacity
          activeOpacity={0.6}
          disabled={!onPressDayNum}
          onPress={() => onPressDayNum?.(dateStr)}
          style={[styles.dayNumBtn, dayNumberContainer]}
        >
          <Text
            allowFontScaling={theme.allowFontScaling}
            style={[styles.dayNumber, dayNumber]}
          >
            {dayNum}
          </Text>
        </TouchableOpacity>
        <View style={styles.containerMinutes}>
          <Text style={styles.textMinutes}>{dayFS}</Text>
          <Text style={styles.textMinutes}>{dayTU}</Text>
          <Text style={styles.textMinutes}>{daySO}</Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { width, height: DEFAULT_PROPS.DAY_BAR_HEIGHT },
      ]}
    >
      {_renderDay()}
    </View>
  );
};

export default SingleDayBar;

const styles = StyleSheet.create({
  container: { alignItems: 'center', flexDirection: 'row' },
  dayItem: { alignItems: 'center', flex: 1 },
  dayNumBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    marginTop: 2,
    width: 28,
    height: 28,
    backgroundColor: DEFAULT_PROPS.WHITE_COLOR,
  },
  dayName: { color: DEFAULT_PROPS.SECONDARY_COLOR, fontSize: 12 },
  dayNumber: { color: DEFAULT_PROPS.SECONDARY_COLOR, fontSize: 16 },
  dayMinutesContainer: {
    backgroundColor: '#bfbfbf',
  },
  containerMinutes: {
    alignItems: 'center',
    backgroundColor: '#F4F6F7',
    width: '100%',
  },
  textMinutes: {
    fontSize: 12,
    color: '#6E7375',
  },
});
