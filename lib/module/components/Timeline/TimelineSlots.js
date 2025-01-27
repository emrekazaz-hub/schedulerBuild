function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { AnimatedFlashList } from '@shopify/flash-list';
import React, { useEffect, useMemo, useRef } from 'react';
import { Animated as RNAnimated, Platform, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useTimelineCalendarContext } from '../../context/TimelineProvider';
import DragEditItem from './DragEditItem';
import TimelineHours from './TimelineHours';
import TimelinePage from './TimelinePage';
const TimelineSlots = ({
  onDateChanged,
  isDragging,
  isLoading,
  holidays,
  events,
  selectedEvent,
  onEndDragSelectedEvent,
  editEventGestureEnabled = true,
  renderEventContent,
  renderSelectedEventContent,
  EditIndicatorComponent,
  ...other
}) => {
  const {
    timelineVerticalListRef,
    spaceFromBottom,
    spaceFromTop,
    timeIntervalHeight,
    totalHours,
    timelineWidth,
    viewMode,
    timelineHorizontalListRef,
    maxTimeIntervalHeight,
    pages,
    syncedLists,
    dayBarListRef,
    currentIndex,
    rightSideWidth,
    offsetY,
    isScrolling,
    allowDragToCreate,
    pinchRef,
    currentDate
  } = useTimelineCalendarContext();
  const contentContainerStyle = useAnimatedStyle(() => {
    const containerHeight = totalHours * timeIntervalHeight.value + spaceFromTop + spaceFromBottom;
    return {
      height: containerHeight
    };
  });
  const scrollX = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    if (!syncedLists) {
      scrollX.removeAllListeners();
      return;
    }
    scrollX.addListener(ev => {
      var _dayBarListRef$curren;
      (_dayBarListRef$curren = dayBarListRef.current) === null || _dayBarListRef$curren === void 0 ? void 0 : _dayBarListRef$curren.scrollToOffset({
        offset: ev.value,
        animated: false
      });
    });
  });
  const _onHorizontalScroll = RNAnimated.event([{
    nativeEvent: {
      contentOffset: {
        x: scrollX
      }
    }
  }], {
    useNativeDriver: true,
    listener: e => {
      const x = e.nativeEvent.contentOffset.x;
      const width = e.nativeEvent.layoutMeasurement.width;
      const pageIndex = Math.round(x / width);
      if (currentIndex.value !== pageIndex) {
        currentIndex.value = pageIndex;
      }
    }
  });
  const extraValues = useMemo(() => ({
    allowDragToCreate,
    isLoading,
    holidays,
    events,
    selectedEventId: selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.id,
    currentDate
  }), [allowDragToCreate, isLoading, holidays, events, selectedEvent === null || selectedEvent === void 0 ? void 0 : selectedEvent.id, currentDate]);
  const _renderPage = ({
    item,
    extraData
  }) => {
    return /*#__PURE__*/React.createElement(TimelinePage, _extends({
      startDate: item,
      isLoading: extraData === null || extraData === void 0 ? void 0 : extraData.isLoading,
      holidays: extraData === null || extraData === void 0 ? void 0 : extraData.holidays,
      events: extraData === null || extraData === void 0 ? void 0 : extraData.events,
      selectedEventId: extraData === null || extraData === void 0 ? void 0 : extraData.selectedEventId,
      renderEventContent: renderEventContent,
      currentDate: extraData.currentDate
    }, other));
  };
  const _viewabilityConfig = useRef({
    waitForInteraction: true,
    itemVisiblePercentThreshold: 99
  }).current;
  const prevIndex = useRef(-1);
  const _onViewableItemsChanged = useRef(info => {
    if (info.viewableItems.length === 0) {
      var _info$changed$;
      prevIndex.current = ((_info$changed$ = info.changed[0]) === null || _info$changed$ === void 0 ? void 0 : _info$changed$.index) ?? -1;
    } else {
      var _info$viewableItems$;
      const isPressNavigator = info.changed.length === 2;
      const isDragList = prevIndex.current !== -1 && prevIndex.current !== ((_info$viewableItems$ = info.viewableItems[0]) === null || _info$viewableItems$ === void 0 ? void 0 : _info$viewableItems$.index);
      if (isPressNavigator || isDragList) {
        var _info$viewableItems$2;
        onDateChanged === null || onDateChanged === void 0 ? void 0 : onDateChanged((_info$viewableItems$2 = info.viewableItems[0]) === null || _info$viewableItems$2 === void 0 ? void 0 : _info$viewableItems$2.item);
        prevIndex.current = -1;
      }
      setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
    }
  }).current;
  const _onVerticalScroll = ({
    nativeEvent: {
      contentOffset
    }
  }) => {
    offsetY.value = contentOffset.y;
  };
  const _renderSlots = () => {
    const listProps = {
      ref: timelineHorizontalListRef,
      horizontal: true,
      showsHorizontalScrollIndicator: false,
      data: pages[viewMode].data,
      initialScrollIndex: pages[viewMode].index,
      pagingEnabled: true,
      scrollEventThrottle: 16,
      bounces: false,
      disableHorizontalListHeightMeasurement: true,
      extraData: extraValues,
      scrollEnabled: !isDragging && !(selectedEvent !== null && selectedEvent !== void 0 && selectedEvent.id),
      viewabilityConfig: _viewabilityConfig,
      onViewableItemsChanged: _onViewableItemsChanged,
      renderItem: _renderPage,
      keyExtractor: item => item,
      onScroll: _onHorizontalScroll
    };
    const listSize = {
      height: totalHours * maxTimeIntervalHeight + spaceFromTop + spaceFromBottom,
      width: viewMode === 'day' ? timelineWidth : rightSideWidth
    };
    if (viewMode === 'day') {
      return /*#__PURE__*/React.createElement(View, {
        style: listSize
      }, /*#__PURE__*/React.createElement(AnimatedFlashList, _extends({
        estimatedItemSize: timelineWidth,
        estimatedListSize: listSize
      }, listProps)));
    }
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TimelineHours, null), /*#__PURE__*/React.createElement(Animated.View, {
      style: listSize
    }, /*#__PURE__*/React.createElement(AnimatedFlashList, _extends({
      estimatedItemSize: rightSideWidth,
      estimatedListSize: listSize
    }, listProps))));
  };
  return /*#__PURE__*/React.createElement(ScrollView, {
    ref: timelineVerticalListRef,
    waitFor: Platform.OS === 'android' ? pinchRef : undefined,
    showsVerticalScrollIndicator: false,
    scrollEventThrottle: 16,
    style: styles.container,
    onScroll: _onVerticalScroll,
    scrollEnabled: !isDragging
  }, /*#__PURE__*/React.createElement(Animated.View, {
    style: [styles.contentContainer, {
      width: timelineWidth
    }, contentContainerStyle]
  }, _renderSlots()), !!(selectedEvent !== null && selectedEvent !== void 0 && selectedEvent.id) && /*#__PURE__*/React.createElement(DragEditItem, {
    selectedEvent: selectedEvent,
    onEndDragSelectedEvent: onEndDragSelectedEvent,
    isEnabled: editEventGestureEnabled,
    EditIndicatorComponent: EditIndicatorComponent,
    renderEventContent: renderSelectedEventContent || renderEventContent
  }));
};
export default TimelineSlots;
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    flexDirection: 'row'
  }
});
//# sourceMappingURL=TimelineSlots.js.map