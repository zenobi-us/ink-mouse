import { useEffect, useRef } from 'react';

import type {
  MouseClickAction,
  MouseDragAction,
  MousePosition,
  MouseScrollAction,
} from './MouseContext';
import {
  createXtermMouseEvents,
  type XtermMouseEvents,
} from './createXtermMouseEvents';
import { xtermMouse } from './xtermMouse';

function useXtermMouse() {
  const events = useRef<XtermMouseEvents>(createXtermMouseEvents());
  const position = useRef<MousePosition>({
    x: 0,
    y: 0,
  });
  const click = useRef<MouseClickAction>();
  const scroll = useRef<MouseScrollAction>();
  const drag = useRef<MouseDragAction>();

  const mouse = useRef(
    xtermMouse({
      onPosition: (newPosition) => {
        position.current = newPosition;
        events.current.emit('position', newPosition);
      },
      onClick: (newClick) => {
        click.current = newClick;
        events.current.emit('click', position.current, newClick);
      },
      onScroll: (newScroll) => {
        scroll.current = newScroll;
        events.current.emit('scroll', position.current, newScroll);
      },
      onDrag: (newDrag) => {
        drag.current = newDrag;
        events.current.emit('drag', position.current, newDrag);
      },
    }),
  );

  useEffect(() => {
    return mouse.current;
  }, []);

  return {
    position: position.current,
    click: click.current,
    drag: drag.current,
    scroll: scroll.current,
    events: events.current,
  };
}
type XtermMouseState = ReturnType<typeof useXtermMouse>;

export { useXtermMouse };
export type { XtermMouseState };
