"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _TimelineProvider = require("../../../context/TimelineProvider");
var _UnavailableHourItem = _interopRequireDefault(require("./UnavailableHourItem"));
var _constants = require("../../../constants");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const VerticalBlock = ({
  dayIndex,
  isOutsideLimit,
  unavailableHour,
  isDayDisabled,
  renderCustomUnavailableItem
}) => {
  const {
    columnWidth,
    start,
    end,
    theme
  } = (0, _TimelineProvider.useTimelineCalendarContext)();
  const _renderUnavailableHour = (hour, i) => {
    const startFixed = Math.max(hour.start, start);
    const endFixed = Math.min(hour.end, end);
    const color = hour.color || _constants.DEFAULT_PROPS.UNAVAILABLE_BACKGROUND_COLOR;
    return /*#__PURE__*/_react.default.createElement(_UnavailableHourItem.default, {
      key: `${dayIndex}_${i}`,
      top: startFixed - start,
      hour: endFixed - startFixed,
      renderCustomUnavailableItem: renderCustomUnavailableItem,
      color: color
    });
  };
  const _renderUnavailableHours = () => {
    if (!isOutsideLimit) {
      if (isDayDisabled) {
        const startFixed = Math.max(0, start);
        const endFixed = Math.min(24, end);
        return /*#__PURE__*/_react.default.createElement(_UnavailableHourItem.default, {
          top: startFixed - start,
          hour: endFixed - startFixed,
          renderCustomUnavailableItem: renderCustomUnavailableItem
        });
      }
      if (unavailableHour) {
        return unavailableHour.map(_renderUnavailableHour);
      }
    }
    return;
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    pointerEvents: "box-none",
    style: [styles.verticalBlock, {
      left: columnWidth * dayIndex,
      width: columnWidth
    }]
  }, _renderUnavailableHours(), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.verticalLine, {
      backgroundColor: theme.cellBorderColor
    }]
  }));
};
var _default = exports.default = /*#__PURE__*/(0, _react.memo)(VerticalBlock);
const styles = _reactNative.StyleSheet.create({
  verticalBlock: {
    position: 'absolute',
    height: '100%'
  },
  verticalLine: {
    width: 1,
    backgroundColor: '#E8E9ED',
    position: 'absolute',
    height: '100%',
    right: 0
  }
});
//# sourceMappingURL=VerticalBlock.js.map