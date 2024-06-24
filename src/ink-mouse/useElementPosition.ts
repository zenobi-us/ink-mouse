import type { DOMElement } from 'ink';
import { useEffect, useState, type RefObject } from 'react';

function useElementPosition(ref: RefObject<DOMElement>) {
  const [position, setPosition] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  }>({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(function UpdatePosition() {
    const position = getElemenetPosition(ref.current);
    if (!position) {
      return;
    }
    setPosition(position);
  }, []);

  return position;
}

function getElemenetPosition(node: DOMElement | null) {
  if (!node) {
    return null;
  }

  if (!node.yogaNode) {
    return null;
  }
  const parent = node.yogaNode.getParent();

  if (!parent) {
    return null;
  }
  const parentLayout = parent.getComputedLayout();

  const width = node.yogaNode.getComputedWidth();
  const height = node.yogaNode.getComputedHeight();

  return {
    top: parentLayout.top,
    left: parentLayout.left,
    width,
    height,
  };
}

export { useElementPosition, getElemenetPosition };
