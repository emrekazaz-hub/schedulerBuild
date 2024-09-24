"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SECONDS_IN_DAY = exports.SCREEN_WIDTH = exports.SCREEN_HEIGHT = exports.DEFAULT_PROPS = exports.COLUMNS = void 0;
var _momentTimezone = _interopRequireDefault(require("moment-timezone"));
var _reactNative = require("react-native");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const SCREEN_WIDTH = exports.SCREEN_WIDTH = _reactNative.Dimensions.get('window').width;
const SCREEN_HEIGHT = exports.SCREEN_HEIGHT = _reactNative.Dimensions.get('window').height;
const DEFAULT_PROPS = exports.DEFAULT_PROPS = {
  VIEW_MODE: 'week',
  FIRST_DAY: 1,
  MIN_DATE: (0, _momentTimezone.default)().subtract(1, 'y').format('YYYY-MM-DD'),
  MAX_DATE: (0, _momentTimezone.default)().add(1, 'y').format('YYYY-MM-DD'),
  INITIAL_DATE: (0, _momentTimezone.default)().format('YYYY-MM-DD'),
  START: 0,
  END: 24,
  TIME_INTERVAL: 60,
  INIT_TIME_INTERVAL_HEIGHT: 60,
  MIN_TIME_INTERVAL_HEIGHT: 29,
  MAX_TIME_INTERVAL_HEIGHT: 116,
  CELL_BORDER_COLOR: '#E8E9ED',
  PRIMARY_COLOR: '#1973E7',
  CREATE_ITEM_BACKGROUND_COLOR: 'rgba(25, 115, 231, 0.1)',
  SECONDARY_COLOR: '#5F6369',
  WHITE_COLOR: '#FFFFFF',
  HOUR_WIDTH: 53,
  DAY_BAR_HEIGHT: 95,
  SPACE_CONTENT: 16,
  DRAG_CREATE_INTERVAL: 60,
  DRAG_STEP: 10,
  UNAVAILABLE_BACKGROUND_COLOR: '#F5F5F5',
  RIGHT_EDGE_SPACING: 1,
  OVERLAP_EVENTS_SPACING: 1,
  BLACK_COLOR: '#000000',
  EVENT_ANIMATED_DURATION: 150,
  NOW_INDICATOR_INTERVAL: 1000,
  NAVIGATION_DELAY: 1000,
  EDIT_SAVE_MODE: 'manual'
};
const COLUMNS = exports.COLUMNS = {
  week: 7,
  threeDays: 3,
  fiveDays: 5,
  workWeek: 5,
  day: 1
};
const SECONDS_IN_DAY = exports.SECONDS_IN_DAY = 86400;
//# sourceMappingURL=constants.js.map