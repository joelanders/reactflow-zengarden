import React, { useCallback } from "react";
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  useEdges,
} from "reactflow";

import CustomNode from "./CustomNode";

import "reactflow/dist/style.css";
import "./overview.css";

const nodeTypes = {
  custom: CustomNode,
};

const minimapStyle = {
  height: 120,
};

const onInit = (reactFlowInstance) =>
  console.log("flow loaded:", reactFlowInstance);

const DataflowUI = ({
  initialNodes,
  initialEdges,
  onEdgeAdd,
  onEdgeRemove,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // called on edge removal with something like
  // { id: "osc-dac-right", type: "remove" }
  const loggedOnEdgesChange = (changes) => {
    // console.log("XXX onEdgesChange()")
    // console.log(changes)
    onEdgeRemove(changes);
    return onEdgesChange(changes);
  };

  // called on edge addition with something like
  // { source: "osc1", sourceHandle: "outlet-0", target: "dac", targetHandle: "inlet-1" }
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => {
        // console.log("XXX onConnect")
        // console.log(params)
        // console.log(eds)
        onEdgeAdd(params);
        return addEdge(params, eds);
      }),
    [setEdges],
  );

  return (
    <div style={{ width: "80vw", height: "80vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={loggedOnEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        fitView
        attributionPosition="top-right"
        nodeTypes={nodeTypes}
      >
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default DataflowUI;
