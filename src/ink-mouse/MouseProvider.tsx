import React from 'react';
import type { PropsWithChildren } from 'react';

import { useXtermMouse } from './useXtermMouse';
import { MouseContext } from './MouseContext';

function MouseProvider({ children }: PropsWithChildren) {
  const mouse = useXtermMouse();

  return (
    <MouseContext.Provider
      value={{
        events: mouse.events,
        click: mouse.click,
        drag: mouse.drag,
        position: mouse.position,
        scroll: mouse.scroll,
      }}
    >
      {children}
    </MouseContext.Provider>
  );
}

export { MouseProvider };
