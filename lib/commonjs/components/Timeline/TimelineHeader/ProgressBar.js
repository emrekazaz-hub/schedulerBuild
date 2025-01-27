"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const DEVICE_WIDTH = _reactNative.Dimensions.get('window').width;
const ProgressBar = ({
  barColor
}) => {
  const progress = (0, _react.useRef)(new _reactNative.Animated.Value(0)).current;
  (0, _react.useEffect)(() => {
    _reactNative.Animated.loop(_reactNative.Animated.timing(progress, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true
    })).start();
  }, [progress]);
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-DEVICE_WIDTH, DEVICE_WIDTH]
  });
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.progressBar
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.bgLoading, {
      backgroundColor: barColor
    }]
  }), /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, {
    style: [{
      transform: [{
        translateX
      }]
    }]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [styles.loadingBar, {
      backgroundColor: barColor
    }]
  })));
};
var _default = exports.default = ProgressBar;
const styles = _reactNative.StyleSheet.create({
  progressBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  loadingBar: {
    width: '100%',
    height: 2
  },
  bgLoading: {
    position: 'absolute',
    width: '100%',
    height: 2,
    opacity: 0.3
  }
});
//# sourceMappingURL=ProgressBar.js.map