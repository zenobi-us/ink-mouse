import type {
  MouseClickAction,
  MouseDragAction,
  MousePosition,
  MouseScrollAction,
} from './MouseContext';
import { TypedEventEmitter } from './createEventEmitter';

const createXtermMouseEvents = () => {
  return new TypedEventEmitter<{
    position: (position: MousePosition) => void;
    click: (position: MousePosition, action: MouseClickAction) => void;
    scroll: (position: MousePosition, direction: MouseScrollAction) => void;
    drag: (position: MousePosition, action: MouseDragAction) => void;
    listen: (yesno: boolean) => void;
  }>();
};
type XtermMouseEvents = ReturnType<typeof createXtermMouseEvents>;

export { createXtermMouseEvents };
export type { XtermMouseEvents };
