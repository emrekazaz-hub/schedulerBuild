import times from 'lodash/times';
import moment from 'moment-timezone';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLUMNS, DEFAULT_PROPS } from '../../../constants';
import type { DayBarItemProps } from '../../../types';
import { getDayBarStyle } from '../../../utils';
import { useTimelineCalendarContext } from '../../../context/TimelineProvider';
import ToSvg from '../../../helpers/ToSvg';
import { FSicon, SOicon, TUicon } from '../../../helpers/SvgPaths';

const MultipleDayBar = ({
  width,
  columnWidth,
  viewMode,
  startDate,
  onPressDayNum,
  theme,
  locale,
  highlightDates,
  currentDate,
  tzOffset,
}: DayBarItemProps) => {
  const { dayMinutes, dayMinuteStyle } = useTimelineCalendarContext();
  const _renderDay = (dayIndex: number) => {
    const dateByIndex = moment.tz(startDate, tzOffset).add(dayIndex, 'd');
    const dateStr = dateByIndex.format('YYYY-MM-DD');
    const event = dayMinutes?.find((eventDate) => eventDate.date === dateStr);
    const fahrstunde = event ? `${event.FS} min.` : '0 min.';
    const theoriestunde = event ? `${event.TU} min.` : '0 min.';
    const sonstige = event ? `${event.SO} min.` : '0 min.';
    dayMinutes?.find((eventDate) => eventDate.date === dateStr);
    let containerStyle;
    let minuteStyle;
    const [dayNameText, dayNum] = dateByIndex
      .locale(locale)
      .format('ddd,DD.MM')
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
    if (dayMinuteStyle) {
      containerStyle = dayMinuteStyle[0]?.containerColor;
      minuteStyle = dayMinuteStyle[0]?.minuteStyle;
    }

    return (
      <View
        key={`${startDate}_${dayIndex}`}
        style={[styles.dayItem, { width: columnWidth }]}
      >
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
        <View style={[styles.containerMinutes, containerStyle]}>
          <View style={styles.headerMinutesIconContainer}>
            <ToSvg
              svgXml={FSicon}
              height={13}
              width={13}
              color={minuteStyle?.color}
            />
            <Text style={minuteStyle}>{dayFS}</Text>
          </View>
          <View style={styles.headerMinutesIconContainer}>
            <ToSvg
              svgXml={TUicon}
              height={13}
              width={13}
              color={minuteStyle?.color}
            />
            <Text style={minuteStyle}>{dayTU}</Text>
          </View>
          <View style={styles.headerMinutesIconContainer}>
            <ToSvg
              svgXml={SOicon}
              height={13}
              width={13}
              color={minuteStyle?.color}
            />
            <Text style={minuteStyle}>{daySO}</Text>
          </View>
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
      {times(COLUMNS[viewMode]).map(_renderDay)}
    </View>
  );
};

export default MultipleDayBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayItem: { alignItems: 'center' },
  dayNumBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    borderRadius: 14,
    width: 28,
    height: 28,
    backgroundColor: DEFAULT_PROPS.WHITE_COLOR,
  },
  dayName: { color: DEFAULT_PROPS.SECONDARY_COLOR, fontSize: 12 },
  dayNumber: { color: DEFAULT_PROPS.SECONDARY_COLOR, fontSize: 16 },
  containerMinutes: {
    alignItems: 'center',
    width: '100%',
  },
  headerMinutesIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
