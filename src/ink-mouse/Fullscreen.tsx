import React from "react";
import { Box } from "ink";
import type { PropsWithChildren } from "react";
import { useTerminalSize } from "./useTerminalSize";

function Fullscreen(props: PropsWithChildren<{}>) {
    const terminal = useTerminalSize();
    return (
        <Box flexGrow={1} width={terminal.width} height={terminal.height}>
            {props.children}
        </Box>
    )
}

export { Fullscreen };