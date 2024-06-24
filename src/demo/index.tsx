import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentProps, PropsWithChildren } from 'react';
import { render, Box, Text, useStdout } from 'ink';
import type { DOMElement } from 'ink';

import {
  MouseProvider,
  useElementPosition,
  useMousePosition,
  useMouseAction,
  useOnMouseHover,
  useOnMouseClick,
} from '../../dist/ink-mouse.cjs';

function App() {
  return (
    <MouseProvider>
      <View />
    </MouseProvider>
  );
}
function useTerminalSize() {
  const out = useStdout();
  const [size, setSize] = useState(() => {
    return {
      width: out.stdout.columns,
      height: out.stdout.rows,
    };
  });

  useEffect(() => {
    const handleTerminalResize = () => {
      setSize(() => ({
        width: out.stdout.columns,
        height: out.stdout.rows,
      }));
    };

    process.stdout.on('resize', handleTerminalResize);
    process.stdout.on('SIGWINCH', handleTerminalResize);
    return () => {
      process.stdout.off('SIGWINCH', handleTerminalResize);
      process.stdout.off('resize', handleTerminalResize);
    };
  }, []);

  return size;
}

function View() {
  const [count, setCount] = useState(0);
  const size = useTerminalSize();
  const mouse = useMousePosition();
  const action = useMouseAction();

  const ref = useRef<DOMElement>(null);
  const position = useElementPosition(ref);
  const label = useMemo(() => {
    // is the mouse getting close to the button?
    if (!position || !mouse) {
      return ' 🤔 ';
    }

    const h = Math.pow(position.left - mouse.x, 2);
    const v = Math.pow(position.top - mouse.y, 2);

    const distance = Math.sqrt(h + v);

    if (distance < 10) {
      return ' 💀 ';
    }

    if (distance < 20) {
      return ' 🤯 ';
    }

    return ' 🤭 ';
  }, [count, position, mouse]);

  return (
    <Box
      flexDirection="column"
      paddingY={1}
      paddingX={1}
      width={size.width - 2}
      height={size.height}
      marginX={1}
      flexShrink={0}
      flexGrow={1}
      alignItems="flex-start"
      justifyContent="center"
    >
      <Box ref={ref}>
        <Button
          label={label}
          onClick={() => {
            setCount((prev) => prev + 1);
          }}
        />
      </Box>

      <Box>
        <Text>Log:</Text>
        <Box flexDirection="column">
          <Text>Count: {count}</Text>
          <Text>
            Mouse: {mouse.x},{mouse.y}
          </Text>
          <Text>Action: {action}</Text>
        </Box>
      </Box>
    </Box>
  );
}

function Button({
  label,
  children,
  onClick,
}: PropsWithChildren<{
  label?: string;
  onClick?: () => void;
}>) {
  const ref = useRef<DOMElement>(null);

  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useOnMouseClick(ref, (event) => {
    setClicking(event);
    if (event && typeof onClick === 'function') {
      onClick();
    }
  });
  useOnMouseHover(ref, setHovering);

  const border = useMemo((): ComponentProps<typeof Box>['borderStyle'] => {
    if (clicking) {
      return 'double';
    }

    if (hovering) {
      return 'singleDouble';
    }

    return 'single';
  }, [clicking, hovering]);

  return (
    <Box
      gap={1}
      paddingX={1}
      ref={ref}
      borderStyle={border}
    >
      {!!label && <Text>{label}</Text>}
      {children}
    </Box>
  );
}

render(<App />, {
  stdin: process.stdin,
  stdout: process.stdout,
});
