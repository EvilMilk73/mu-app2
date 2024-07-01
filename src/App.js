import logo from "./logo.svg";
import "./App.css";

import React, { useState, useEffect } from "react";
import ChatComponent from "./components/Chat/ChatComponent";
import { HubConnectionBuilder } from "@microsoft/signalr";
import MapRouteMenu from "./components/MapRouteMenu";
import { Home } from "./components/Home";
import { Layout } from "./components/Layout/Layout";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
const queryClient = new QueryClient()
function App() {
  return (
    <div className="App">
      <Layout>
        <QueryClientProvider client={queryClient}>
          <Home />
        </QueryClientProvider>
      </Layout>
    </div>
  );
}

export default App;
