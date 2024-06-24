import type {
  MouseClickAction,
  MouseDragAction,
  MousePosition,
  MouseScrollAction,
} from './MouseContext.js';
import { TypedEventEmitter } from './createEventEmitter.js';

const createXtermMouseEvents = () => {
  return new TypedEventEmitter<{
    position: (position: MousePosition) => void;
    click: (position: MousePosition, action: MouseClickAction) => void;
    scroll: (position: MousePosition, direction: MouseScrollAction) => void;
    drag: (position: MousePosition, action: MouseDragAction) => void;
  }>();
};
type XtermMouseEvents = ReturnType<typeof createXtermMouseEvents>;

export { createXtermMouseEvents };
export type { XtermMouseEvents };
