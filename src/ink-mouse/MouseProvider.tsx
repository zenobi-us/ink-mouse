import React from 'react';
import type { PropsWithChildren } from 'react';

import { useXtermMouse } from './useXtermMouse';
import { MouseContext } from './MouseContext';

function MouseProvider({ children }: PropsWithChildren) {
  const mouse = useXtermMouse();

  return (
    <MouseContext.Provider
      value={mouse}
    >
      {children}
    </MouseContext.Provider>
  );
}

export { MouseProvider };
