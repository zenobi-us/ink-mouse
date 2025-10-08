import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentProps, PropsWithChildren } from 'react';
import { render, Box, Text, useStdout, useInput } from 'ink';
import type { DOMElement } from 'ink';
import { useMap } from '@react-hookz/web';

import {
    MouseProvider,
    useMousePosition,
    useMouseAction,
    useOnMouseHover,
    useOnMouseClick,
    useElementPosition,
    useElementDimensions,
    useMouse,
    useTerminalSize
} from '../ink-mouse.ts';

function App() {
    return (
        <MouseProvider>
            <View />
        </MouseProvider>
    );
}


function View() {
    const map = useMap<'button1' | 'button2' | 'button3' | 'listitem1' | 'listitem2', number>()
    const size = useTerminalSize();
    const mouse = useMouse();
    const mousePosition = useMousePosition();
    const mouseAction = useMouseAction();

    useInput((input, key) => {
        if (key.return) {
            mouse.toggle()
        }
    });


    return (
        <>
            <Box
                flexDirection="row"
                paddingY={1}
                paddingX={1}
                gap={4}
                width={size.width - 2}
                height={size.height}
                marginX={1}
                flexShrink={0}
                flexGrow={1}
                alignItems="flex-start"
                justifyContent="center"
            >
                <Box gap={1} flexDirection='column' width="80%">
                    <Box gap={1}>
                        <Button
                            label='button 1'
                            onClick={() => {
                                map.set('button1', (map.get('button1') || 0) + 1)
                            }}
                        />
                        <Button
                            label='button 2'
                            onClick={() => {
                                map.set('button2', (map.get('button2') || 0) + 1)
                            }}
                        />
                    </Box>
                    <Button onClick={() => {
                        map.set('listitem1', (map.get('listitem1') || 0) + 1)

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
                        map.set('listitem2', (map.get('listitem2') || 0) + 1)
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

                    <AsyncElement />
                </Box>

                <Box
                    flexDirection="column"
                    width={30}
                    gap={1}
                >
                    <Text>Log:</Text>
                    <Box flexDirection="column" gap={1}>
                        <StatusItem label="Status" value={mouse.status} help="<Return>" />
                        <StatusItem label="Button 1 Count" value={map.get('button1')} />
                        <StatusItem label="Button 2 Count" value={map.get('button2')} />
                        <StatusItem label="Button 3 Count" value={map.get('button3')} />
                        <StatusItem label="Listitem 1 Count" value={map.get('listitem1')} />
                        <StatusItem label="Listitem 2 Count" value={map.get('listitem2')} />
                        <StatusItem label="Mouse Position" value={JSON.stringify(mousePosition)} />
                        <StatusItem label="Mouse Action" value={JSON.stringify(mouseAction)} />
                    </Box>
                </Box>
            </Box>


            <Button
                position="absolute"
                marginTop={1}
                marginLeft={43}
                onClick={() => {
                    map.set('button3', (map.get('button3') || 0) + 1)
                }}
            >
                <Text>Button 3</Text>
            </Button>

        </>

    );
}

function StatusItem({ label, value, help }: {
    label: string;
    value?: string | number | null;
    help?: string;
}) {
    return (
        <Box flexDirection='column' justifyContent='space-between'>
            <Box gap={1}>
                <Text color="cyan">{label}</Text>
                {help && <Text>{help}</Text>}
            </Box>
            <Text color="white">{value}</Text>
        </Box>
    )
}

function pause(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

function AsyncElement() {
    const ref = useRef<DOMElement>(null)
    const [loading, setLoading] = useState(true);
    const position = useElementPosition(ref, [loading]);
    const dimension = useElementDimensions(ref);

    useEffect(() => {
        pause(2000).then(() => {
            setLoading(false);
        })
    }, [])

    if (loading) {
        return (
            <Box>
                <Text>Loading</Text>
            </Box>
        )
    }

    return (
        <Box padding={4} ref={ref} flexDirection='column' gap={2} borderStyle='round' borderColor='gray'>
            <Text>
                {JSON.stringify(position)}
            </Text>
            <Text>
                {JSON.stringify(dimension)}
            </Text>
        </Box>
    )
}

function Button({
    label,
    children,
    onClick,
    ...props
}: PropsWithChildren<ComponentProps<typeof Box> & {
    label?: string;
    onClick?: () => void;
}>) {
    const ref = useRef<DOMElement>(null);

    const [hovering, setHovering] = useState(false);
    const [clicking, setClicking] = useState(false);

    useOnMouseHover(ref, setHovering);
    useOnMouseClick(ref, (event) => {
        setClicking(event);
        if (event && typeof onClick === 'function') {
            onClick();
        }
    });

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
            {...props}
            flexDirection="row"
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
