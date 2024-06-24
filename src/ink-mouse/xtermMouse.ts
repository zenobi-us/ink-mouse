import type {
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
  onClick: (action: MouseClickAction) => void;
  onDrag: (direction: MouseDragAction) => void;
  onScroll: (direction: MouseScrollAction) => void;
}) {
  const handleEvent = (input: string) => {
    if (AnsiSgrParser.isDrag(input)) {
      const position = AnsiSgrParser.getDrag(input);
      if (!position) {
        return;
      }
      onPosition(position);
      onDrag(position.action === 'press' ? 'dragging' : null);
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
      onClick(position.action);
      setTimeout(() => {
        onClick(null);
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
  const cleanup = () => {
    process.stdin.off('data', handleEvent);
    process.stdout.write(
      ANSI_CODES.mouseMotion.off +
        ANSI_CODES.mouseSGR.off +
        ANSI_CODES.mouseMotionOthers.off +
        ANSI_CODES.mouseButton.off,
    );
    process.stdin.setRawMode(false);
  };

  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  process.stdin.resume();

  process.stdout.write(
    ANSI_CODES.mouseButton.on +
      ANSI_CODES.mouseMotion.on +
      ANSI_CODES.mouseMotionOthers.on +
      ANSI_CODES.mouseSGR.on,
  );

  process.stdin.on('data', handleEvent);

  return cleanup;
}
