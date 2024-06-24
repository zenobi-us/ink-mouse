import { useContext } from 'react';

import { MouseContext } from './MouseContext';

export function useMouse() {
  const context = useContext(MouseContext);
  if (!context) {
    throw new Error(
      'useMouse must only be used within children of <MouseProvider/>',
    );
  }

  return context;
}
