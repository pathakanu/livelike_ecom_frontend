"use client";

import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { ReactNode } from "react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  fonts: {
    heading: "var(--font-geist-sans)",
    body: "var(--font-geist-sans)",
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
}
