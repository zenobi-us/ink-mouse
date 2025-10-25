import type { MouseButton } from './MouseContext';

const ANSI_CODES = {
  // SET_X10_MOUSE
  mouseX10: { on: '\x1b[?9h', off: '\x1b[?9l' },

  // Terminal will send event on button pressed with mouse position
  // SET_VT200_MOUSE
  mouseButton: { on: '\x1b[?1000h', off: '\x1b[?1000l' },

  // Terminal will send position of the column highlighted
  // SET_VT200_HIGHLIGHT_MOUSE
  mouseHighlight: { on: '\x1b[?1001h', off: '\x1b[?1001l' },

  // Terminal will send event on button pressed and mouse motion as long as a button is down, with mouse position
  // SET_BTN_EVENT_MOUSE
  mouseDrag: { on: '\x1b[?1002h', off: '\x1b[?1002l' },

  // Terminal will send event on button pressed and motion
  // SET_ANY_EVENT_MOUSE
  mouseMotion: { on: '\x1b[?1003h', off: '\x1b[?1003l' },

  // SET_FOCUS_EVENT_MOUSE
  mouseFocus: { on: '\x1b[?1004h', off: '\x1b[?1004l' },

  // SET_EXT_MODE_MOUSE
  mouseUtf8: { on: '\x1b[?1005h', off: '\x1b[?1005l' },

  // Another mouse protocol that extend coordinate mapping (without it, it supports only 223 rows and columns)
  // SET_SGR_EXT_MODE_MOUSE
  mouseSGR: { on: '\x1b[?1006h', off: '\x1b[?1006l' },

  // SET_ALTERNATE_SCROLL
  alternateScroll: { on: '\x1b[?1007h', off: '\x1b[?1007l' },

  // SET_URXVT_EXT_MODE_MOUSE
  mouseMotionOthers: { on: '\x1b[?1015h', off: '\x1b[?1015l' },

  // SET_PIXEL_POSITION_MOUSE
  mousePixelMode: { on: '\x1b[?1016h', off: '\x1b[?1016l' },
};

const ANSI_RESPONSE_PATTERNS = {
  scroll: /\[<(64|65);(\d+);(\d+)M$/,
  drag: /\[<(32|33|34|160|161);(\d+);(\d+)([Mm])$/,
  move: /\[<35;(\d+);(\d+)M$/,
  click: /\[<(0|1|2|128|129);(\d+);(\d+)([Mm])$/,
};

type MouseClickButton = 0 | 1 | 2 | 128 | 129;
type MouseDragButton = 32 | 33 | 34 | 160 | 161;

const MOUSE_CLICK_BUTTONS: Record<MouseClickButton, MouseButton> = {
  0: 'left',
  1: 'middle',
  2: 'right',
  128: 'back',
  129: 'forward',
};

const MOUSE_DRAG_BUTTONS: Record<MouseDragButton, MouseButton> = {
  32: 'left',
  33: 'middle',
  34: 'right',
  160: 'back',
  161: 'forward',
};

const MOUSE_BUTTONS = {
  ...MOUSE_CLICK_BUTTONS,
  ...MOUSE_DRAG_BUTTONS,
};

export { ANSI_CODES, ANSI_RESPONSE_PATTERNS, MOUSE_BUTTONS };
export type { MouseClickButton, MouseDragButton };
