"use client";

import React from "react";

export type Role = "client" | "server";

export type PhaseScreens = {
  client: React.ComponentType<any>;
  server: React.ComponentType<any>;
};

export const phaseMap: Record<number, PhaseScreens> = {
  1: {
    client: () => <div>Client Home – phase 1</div>,
    server: () => <div>Server Home – phase 1</div>,
  },

  2: {
    client: () => <div>Client Voting1 – phase 2</div>,
    server: () => <div>Server Voting1 – phase 2</div>,
  },

  3: {
    client: () => <div>Client Blank1 – phase 3</div>,
    server: () => <div>Server Blank1 – phase 3</div>,
  },

};
