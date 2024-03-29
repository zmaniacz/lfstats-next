import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ApolloProvider } from "@apollo/client";
import client from "../lib/apollo-client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import Shell from "../components/Shell";

const colors = {
  brand: {
    50: "#ecefff",
    100: "#cbceeb",
    200: "#a9aed6",
    300: "#888ec5",
    400: "#666db3",
    500: "#4d5499",
    600: "#3c4178",
    700: "#2a2f57",
    800: "#181c37",
    900: "#080819",
  },
};
const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({ colors, config });

function LFStats({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider
      // Provider options are not required but can be useful in situations where
      // you have a short session maxAge time. Shown here with default values.
      session={pageProps.session}
    >
      <ApolloProvider client={client}>
        <ChakraProvider theme={theme}>
          <Shell>
            <Component {...pageProps} />
          </Shell>
        </ChakraProvider>
      </ApolloProvider>
    </SessionProvider>
  );
}

export default LFStats;
