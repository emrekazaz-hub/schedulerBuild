import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';

import { DEFAULT_PROPS } from '../../constants';
import { useTimelineCalendarContext } from '../../context/TimelineProvider';
import type { ThemeProperties } from '../../types';

import { moonIcon } from '../../helpers/SvgPaths';
import ToSvg from '../../helpers/ToSvg';

export type HourItem = { text: string; hourNumber: number };

const TimelineHours = () => {
  const {
    hours,
    hourWidth,
    timeIntervalHeight,
    spaceFromTop,
    theme,
    nightHours,
  } = useTimelineCalendarContext();

  const _renderHour = (hour: HourItem, index: number) => {
    return (
      <HourItem
        key={index}
        hour={hour}
        index={index}
        timeIntervalHeight={timeIntervalHeight}
        spaceContent={spaceFromTop}
        theme={theme}
        nightIconHours={nightHours}
      />
    );
  };

  return (
    <View
      style={[
        styles.hours,
        {
          width: hourWidth,
          backgroundColor: theme.backgroundColor,
          marginBottom: spaceFromTop,
        },
      ]}
    >
      {hours.map(_renderHour)}
      <View
        style={[
          styles.verticalLine,
          { top: spaceFromTop, backgroundColor: theme.cellBorderColor },
        ]}
      />
    </View>
  );
};

export default memo(TimelineHours);

const HourItem = ({
  hour,
  index,
  timeIntervalHeight,
  spaceContent,
  theme,
  nightIconHours,
}: {
  hour: HourItem;
  index: number;
  timeIntervalHeight: SharedValue<number>;
  spaceContent: number;
  theme: ThemeProperties;
  nightIconHours?: string[];
}) => {
  const hourLabelStyle = useAnimatedStyle(() => {
    return { top: timeIntervalHeight.value * index - 6 + spaceContent };
  });

  const isNightHour = nightIconHours?.includes(hour.text);

  return (
    <Animated.View style={[styles.hourContainer, hourLabelStyle]}>
      <Animated.Text
        allowFontScaling={theme.allowFontScaling}
        key={`hourLabel_${hour.text}`}
        style={[styles.hourText, theme.hourText]}
      >
        {hour.text}
      </Animated.Text>
      {isNightHour && <ToSvg svgXml={moonIcon} height={10} width={10} />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  hours: {
    alignItems: 'center',
    overflow: 'hidden',
  },
  hourContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
  },
  hourText: {
    fontSize: 10,
    color: DEFAULT_PROPS.BLACK_COLOR,
  },
  verticalLine: {
    width: 1,
    backgroundColor: DEFAULT_PROPS.CELL_BORDER_COLOR,
    position: 'absolute',
    right: 0,
    height: '100%',
  },
});
