import * as React from "react"
import {
  ChakraProvider,
} from "@chakra-ui/react"
import { Routes, Route } from "react-router-dom";
import theme from './utils/theme'
import MainLayout from "./layouts/MainLayout"


export const App = () => (
  <ChakraProvider theme={theme}>
    <Routes>
      <Route>
        <Route path="/" element={<MainLayout><p>hi</p></MainLayout>} />
      </Route>
    </Routes>
    {/* <Box textAlign="center" fontSize="xl">
      <Grid minH="100vh" p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={8}>
          <Text>
            Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
          </Text>
          <Link
            color="teal.500"
            href="https://chakra-ui.com"
            fontSize="2xl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Chakra
          </Link>
        </VStack>
      </Grid>
    </Box> */}
  </ChakraProvider>
)
