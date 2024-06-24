import { useState, type RefObject } from 'react';
import { type DOMElement } from 'ink';

import { useOnMouseClick } from './useOnMouseClick';
import { useOnMouseHover } from './useOnMouseHover';

function useOnMouseState(ref: RefObject<DOMElement>) {
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useOnMouseClick(ref, setClicking);
  useOnMouseHover(ref, setHovering);

  return { hovering, clicking };
}
export { useOnMouseState };
