import React from "react";
import { MarkerType, Position } from "reactflow";

export const initialNodes = [
  {
    id: "osc0",
    type: "custom",
    data: {
      zgType: "object",
      name: "osc~ 220",
      inlets: [0],
      outlets: [0],
    },
    position: {
      x: 100,
      y: 200,
    },
  },
  {
    id: "osc1",
    type: "custom",
    data: {
      zgType: "object",
      name: "osc~ 110",
      inlets: [0],
      outlets: [0],
    },
    position: {
      x: 100,
      y: 100,
    },
  },
  {
    id: "dac",
    type: "custom",
    data: {
      zgType: "object",
      name: "dac~",
      inlets: [0, 1],
      outlets: [],
    },
    position: {
      x: 300,
      y: 100,
    },
  },
];

export const initialEdges = [
  {
    id: "osc-dac-left",
    source: "osc0",
    target: "dac",
    outletIndex: 0,
    inletIndex: 0,
    sourceHandle: "outlet-0",
    targetHandle: "inlet-0",
  },
  {
    id: "osc-dac-right",
    source: "osc0",
    target: "dac",
    outletIndex: 0,
    inletIndex: 1,
    sourceHandle: "outlet-0",
    targetHandle: "inlet-1",
  },
];
