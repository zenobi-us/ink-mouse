import type { MouseClickButton, MouseDragButton } from './constants';
import { ANSI_RESPONSE_PATTERNS, MOUSE_BUTTONS } from './constants';
import type { MouseButton } from './MouseContext';

const parseXYCoordinates = (input: string, pattern: RegExp) => {
  if (!pattern.test(input)) {
    return;
  }
  const match = input.match(pattern);
  if (!match) {
    return;
  }
  const x = Number(match[1]);
  const y = Number(match[2]);
  return { x, y };
};

const parseXYScroll = (
  input: string,
  pattern: RegExp,
): null | {
  x: number;
  y: number;
  direction: 'scrollup' | 'scrolldown';
} => {
  if (!pattern.test(input)) {
    return null;
  }
  const match = input.match(pattern);
  if (!match) {
    return null;
  }
  const direction = match[1] === '64' ? 'scrollup' : 'scrolldown';
  const x = Number(match[2]);
  const y = Number(match[3]);
  return { x, y, direction };
};

const parseMouseButton = (
  button: MouseClickButton | MouseDragButton,
): NonNullable<MouseButton> => MOUSE_BUTTONS[button] || 'left';

const parseXYClick = (
  input: string,
  pattern: RegExp,
): {
  x: number;
  y: number;
  action: 'press' | 'release';
  button: 'left' | 'middle' | 'right' | 'back' | 'forward';
} | null => {
  if (!pattern.test(input)) {
    return null;
  }
  const match = input.match(pattern);
  if (!match) {
    return null;
  }
  const button: MouseButton = parseMouseButton(
    Number(match[1]) as MouseClickButton | MouseDragButton,
  );
  const x = Number(match[2]);
  const y = Number(match[3]);
  const action = match[4] === 'M' ? 'press' : 'release';
  return { x, y, action, button };
};

const AnsiSgrParser = {
  isDrag: (input: string) => ANSI_RESPONSE_PATTERNS.drag.test(input),
  isMove: (input: string) => ANSI_RESPONSE_PATTERNS.move.test(input),
  isClick: (input: string) => ANSI_RESPONSE_PATTERNS.click.test(input),
  isScroll: (input: string) => ANSI_RESPONSE_PATTERNS.scroll.test(input),
  getScroll: (input: string) =>
    parseXYScroll(input, ANSI_RESPONSE_PATTERNS.scroll),
  getDrag: (input: string) => parseXYClick(input, ANSI_RESPONSE_PATTERNS.drag),
  getMove: (input: string) =>
    parseXYCoordinates(input, ANSI_RESPONSE_PATTERNS.move),
  getClick: (input: string) =>
    parseXYClick(input, ANSI_RESPONSE_PATTERNS.click),
};

export { AnsiSgrParser };
