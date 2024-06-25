import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentProps, PropsWithChildren } from 'react';
import { render, Box, Text, useStdout } from 'ink';
import type { DOMElement } from 'ink';
import { useMap } from '@react-hookz/web';

import {
  MouseProvider,
  useMousePosition,
  useMouseAction,
  useOnMouseHover,
  useOnMouseClick,
} from '../../src/ink-mouse.ts';

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
  const map = useMap<'button1' | 'button2' | 'listitem1' | 'listitem2', number>()
  const size = useTerminalSize();
  const mouse = useMousePosition();
  const action = useMouseAction();


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
      <Box gap={1} flexDirection='column' width="20">
      <Box gap={1}>
        <Button
          label='button 1'
          onClick={() => {
            map.set('button1', (map.get('button1') ||0) + 1)
          }}
        />
        <Button
          label='button 2'
          onClick={() => {
            map.set('button2', (map.get('button2') ||0) + 1)
          }}
          />
          </Box>
        <Button onClick={() => {
          map.set('listitem1', (map.get('listitem1') ||0) + 1)

        }}>
          <Box flexDirection='row' flexGrow={1}>
            <Box flexDirection='column'>
              <Text color="yellowBright" bold>listitem 1</Text>
              <Box flexDirection='row' gap={1}>
                <Text color="gray">subtitle</Text>
                <Text color="gray">things: 1</Text>
              </Box>
            </Box>
            <Box justifyContent='flex-end' flexGrow={1}>
              <Text color="brown">clicks: {map.get('listitem1') || 0}</Text>
            </Box>
          </Box>
        </Button>
        <Button onClick={() => {
          map.set('listitem2', (map.get('listitem2') ||0) + 1)

        }}>
          <Box flexDirection='row' flexGrow={1}>
            <Box flexDirection='column'>
              <Text color="yellowBright" bold>listitem 2</Text>
              <Box flexDirection='row' gap={1}>
                <Text color="gray">subtitle</Text>
                <Text color="gray">things: 1</Text>
              </Box>
            </Box>
            <Box justifyContent='flex-end' flexGrow={1}>
              <Text color="brown">clicks: {map.get('listitem2') || 0}</Text>
            </Box>
          </Box>
        </Button>
      </Box>

      <Box>
        <Text>Log:</Text>
        <Box flexDirection="column">
          <Text>Button 1 Count: {map.get('button1')}</Text>
          <Text>Button 2 Count: {map.get('button2')}</Text>
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
        paddingX={1}
        gap={1}
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
