import { useState, type RefObject } from 'react';
import { type DOMElement } from 'ink';

import type { MouseButton } from './MouseContext';
import { useOnMouseClick } from './useOnMouseClick';
import { useOnMouseHover } from './useOnMouseHover';

function useOnMouseState(ref: RefObject<DOMElement>, button: MouseButton = 'left') {
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useOnMouseClick(ref, setClicking, button);
  useOnMouseHover(ref, setHovering);

  return { hovering, clicking };
}
export { useOnMouseState };
