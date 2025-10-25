import { createContext } from 'react';

import type { XtermMouseState } from './useXtermMouse';
import type { XtermMouseEvents } from './createXtermMouseEvents';
type MousePosition = {
  x: number;
  y: number;
};

type MouseClickAction = 'press' | 'release' | null;
type MouseScrollAction = 'scrollup' | 'scrolldown' | null;
type MouseDragAction = 'dragging' | null;
type MouseButton = 'left' | 'middle' | 'right' | 'back' | 'forward' | null;

type MouseAction = MouseClickAction | MouseScrollAction;

type MouseContextShape = XtermMouseState;

const MouseContext = createContext<MouseContextShape>({
  events: {} as unknown as XtermMouseEvents,
  status: 'disabled',
  click: null,
  drag: null,
  position: { x: 0, y: 0 },
  scroll: null,
  button: null,
  disable: () => {},
  enable: () => {},
  toggle: () => {},
});

export { MouseContext };
export type {
  MouseContextShape,
  MousePosition,
  MouseClickAction,
  MouseScrollAction,
  MouseDragAction,
  MouseButton,
  MouseAction,
};
