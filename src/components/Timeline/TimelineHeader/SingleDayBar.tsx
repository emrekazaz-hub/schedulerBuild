import moment from 'moment-timezone';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DEFAULT_PROPS } from '../../../constants';
import type { DayBarItemProps } from '../../../types';
import { getDayBarStyle } from '../../../utils';
import { useTimelineCalendarContext } from '../../../context/TimelineProvider';
import { FSicon, SOicon, TUicon } from '../../../helpers/SvgPaths';
import ToSvg from '../../../helpers/ToSvg';

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
    const { dayMinutes, dayMinuteStyle } = useTimelineCalendarContext();
    const dateByIndex = moment.tz(startDate, tzOffset);
    const dateStr = dateByIndex.format('YYYY-MM-DD');
    const event = dayMinutes?.find((eventDate) => eventDate.date === dateStr);
    const fahrstunde = event ? `${event.FS} min.` : '0 min.';
    const theoriestunde = event ? `${event.TU} min.` : '0 min.';
    const sonstige = event ? `${event.SO} min.` : '0 min.';
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
    width: '100%',
  },
  headerMinutesIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
