import { useCallback, useEffect, useMemo, type RefObject } from 'react';
import { type DOMElement } from 'ink';

import { useMouse } from './useMouse';
import type { MouseClickAction, MousePosition } from './MouseContext';
import { isIntersecting } from './isIntersecting';
import { useElementDimensions, useElementPosition } from './useElementPosition';

function useOnMouseClick(
  ref: RefObject<DOMElement>,
  onChange: (event: boolean) => void,
) {
  const mouse = useMouse();
  const elementPosition = useElementPosition(ref);
  const elementDimensions = useElementDimensions(ref);
  const element = useMemo(() => {
    return {
      ...elementPosition,
      ...elementDimensions,
    }
  }, [
    elementPosition,
    elementDimensions
  ])

  const handler = useCallback(
    (position: MousePosition, action: MouseClickAction) => {
      onChange(
        isIntersecting({ element, mouse: position }) && action === 'press',
      );
    },
    [ref.current],
  );

  useEffect(
    function HandleIntersection() {
      const events = mouse.events;

      events.on('click', handler);
      return () => {
        events.off('click', handler);
      };
    },
    [ref.current],
  );
}

export { useOnMouseClick };
