import { useEffect, useRef, useState } from 'react';

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


type MouseStatus = 'enabled' | 'disabled';

function useXtermMouse() {
  const [status,setStatus] = useState<MouseStatus>('enabled')
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
        if (status === 'disabled') {
          return
        }
        position.current = newPosition;
        events.current.emit('position', newPosition);
      },
      onClick: (newClick) => {
        if (status === 'disabled') {
          return
        }
        click.current = newClick;
        events.current.emit('click', position.current, newClick);
      },
      onScroll: (newScroll) => {
        if (status === 'disabled') {
          return
        }
        scroll.current = newScroll;
        events.current.emit('scroll', position.current, newScroll);
      },
      onDrag: (newDrag) => {
        if (status === 'disabled') {
          return
        }
        drag.current = newDrag;
        events.current.emit('drag', position.current, newDrag);
      },
    }),
  );

  const disable = () => {
    mouse.current.disable();
    setStatus('disabled')
  }
  const enable =  () => {
    mouse.current.enable();
    setStatus('enabled')
  }
  const toggle = () => {
    if (status === 'enabled') {
      disable();
    } else {
      enable();
    }
  }

  useEffect(() => {
    enable()
    return () => {
      disable()
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
    events: events.current,
  };
}
type XtermMouseState = ReturnType<typeof useXtermMouse>;

export { useXtermMouse };
export type { XtermMouseState };
