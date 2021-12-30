import * as React from "react"
import {
  ChakraProvider,
} from "@chakra-ui/react"
import { Routes, Route } from "react-router-dom";
import theme from './utils/theme'
import MainLayout from "./layouts/MainLayout"
import BridgePage from "./pages/BridgePage";
import ProfilePage from "./pages/ProfilePage"


export const App = () => (
  <ChakraProvider theme={theme}>
    <Routes>
      <Route>
        <Route path="/profile/:address" element={<MainLayout><ProfilePage /></MainLayout>} />
        <Route path="/" element={<MainLayout><BridgePage /></MainLayout>} />
      </Route>
    </Routes>
  </ChakraProvider>
)
