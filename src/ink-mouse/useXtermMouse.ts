import { useEffect, useRef, useState } from 'react';

import type {
  MouseButton,
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

type MouseStatus = 'enabled' | 'disabled';

function useXtermMouse() {
  const [status, setStatus] = useState<MouseStatus>('enabled');
  const events = useRef<XtermMouseEvents>(createXtermMouseEvents());
  const position = useRef<MousePosition>({
    x: 0,
    y: 0,
  });
  const click = useRef<MouseClickAction>(null);
  const scroll = useRef<MouseScrollAction>(null);
  const drag = useRef<MouseDragAction>(null);
  const button = useRef<MouseButton>(null);

  const mouse = useRef(
    xtermMouse({
      onPosition: (newPosition) => {
        if (status === 'disabled') {
          return;
        }
        position.current = newPosition;
        events.current.emit('position', newPosition);
      },
      onClick: (newClick, newButton) => {
        if (status === 'disabled') {
          return;
        }
        click.current = newClick;
        button.current = newButton;
        events.current.emit('click', position.current, newClick, newButton);
      },
      onScroll: (newScroll) => {
        if (status === 'disabled') {
          return;
        }
        scroll.current = newScroll;
        events.current.emit('scroll', position.current, newScroll);
      },
      onDrag: (newDrag, newButton) => {
        if (status === 'disabled') {
          return;
        }
        drag.current = newDrag;
        button.current = newButton;
        events.current.emit('drag', position.current, newDrag, newButton);
      },
    }),
  );

  const disable = () => {
    mouse.current.disable();
    setStatus('disabled');
  };
  const enable = () => {
    mouse.current.enable();
    setStatus('enabled');
  };
  const toggle = () => {
    if (status === 'enabled') {
      disable();
    } else {
      enable();
    }
  };

  useEffect(() => {
    enable();
    return () => {
      disable();
    };
  }, []);

  return {
    enable,
    disable,
    toggle,
    status,
    position: position.current,
    click: click.current,
    drag: drag.current,
    scroll: scroll.current,
    button: button.current,
    events: events.current,
  };
}
type XtermMouseState = ReturnType<typeof useXtermMouse>;

export { useXtermMouse };
export type { XtermMouseState };
