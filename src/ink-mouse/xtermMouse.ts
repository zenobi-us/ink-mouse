import type {
  MouseButton,
  MouseClickAction,
  MouseDragAction,
  MousePosition,
  MouseScrollAction,
} from './MouseContext';
import { ANSI_CODES } from './constants';
import { AnsiSgrParser } from './ansiParser';

export function xtermMouse({
  onPosition,
  onClick,
  onScroll,
  onDrag,
}: {
  onPosition: (position: MousePosition) => void;
  onClick: (action: MouseClickAction, button: MouseButton) => void;
  onDrag: (direction: MouseDragAction, button: MouseButton) => void;
  onScroll: (direction: MouseScrollAction) => void;
}) {
  const handleEvent = (input: string) => {
    if (AnsiSgrParser.isDrag(input)) {
      const position = AnsiSgrParser.getDrag(input);
      if (!position) {
        return;
      }
      onPosition(position);
      onDrag(position.action === 'press' ? 'dragging' : null, position.button);
      return;
    }

    if (AnsiSgrParser.isMove(input)) {
      const position = AnsiSgrParser.getMove(input);
      if (!position) {
        return;
      }
      onPosition(position);
      return;
    }

    if (AnsiSgrParser.isClick(input)) {
      const position = AnsiSgrParser.getClick(input);
      if (!position) {
        return;
      }
      onPosition(position);
      onClick(position.action, position.button);
      setTimeout(() => {
        onClick(null, null);
      }, 100);
      return;
    }

    if (AnsiSgrParser.isScroll(input)) {
      const position = AnsiSgrParser.getScroll(input);
      if (!position) {
        return;
      }
      onPosition(position);
      onScroll(position.direction);
      setTimeout(() => {
        onScroll(null);
      }, 100);
      return;
    }
  };

  const disable = () => {
    process.stdin.off('data', handleEvent);
    process.stdout.write(
      ANSI_CODES.mouseMotion.off +
        ANSI_CODES.mouseSGR.off +
        ANSI_CODES.mouseMotionOthers.off +
        ANSI_CODES.mouseButton.off,
    );
  };

  const enable = () => {
    process.stdout.write(
      ANSI_CODES.mouseButton.on +
        ANSI_CODES.mouseMotion.on +
        ANSI_CODES.mouseMotionOthers.on +
        ANSI_CODES.mouseSGR.on,
    );
    process.stdin.on('data', handleEvent);
  };

  return { disable, enable };
}
