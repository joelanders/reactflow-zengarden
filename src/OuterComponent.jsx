import { useState, useEffect, useRef } from "react";
import DataflowUI from "./App.jsx";
import { Helmet } from "react-helmet";
import { initialEdges, initialNodes } from "./initial-elements";

export default function OuterComponent() {
  const [playing, setPlaying] = useState(false);
  const [connected, setConnected] = useState(false);
  const audioContext = useRef();
  const scriptProcessor = useRef();
  const zg = useRef();
  const zgContext = useRef();
  const zgGraph = useRef();
  const zgObjects = useRef();
  const edges = useRef();

  function initializeZg() {
    zg.current = {
      context_new: Module.cwrap("zg_context_new", "number", [
        "number",
        "number",
        "number",
        "number",
        "number",
      ]),
      context_new_graph_from_file: Module.cwrap(
        "zg_context_new_graph_from_file",
        "number",
        ["number", "string", "string"],
      ),
      graph_attach: Module.cwrap("zg_graph_attach", null, ["number"]),
      context_process: Module.cwrap("zg_context_process", null, [
        "number",
        "number",
        "number",
      ]),
      context_delete: Module.cwrap("zg_context_delete", null, ["number"]),
      context_send_messageV0: Module.cwrap("zg_context_send_messageV", null, [
        "number",
        "string",
        "number",
        "string",
      ]),
      context_send_messageV1: Module.cwrap("zg_context_send_messageV", null, [
        "number",
        "string",
        "number",
        "string",
        "number",
      ]),

      //  ZGGraph *zg_context_new_empty_graph(ZGContext *context);
      context_new_empty_graph: Module.cwrap(
        "zg_context_new_empty_graph",
        "number",
        ["number"],
      ),

      // ZGObject *zg_graph_add_new_object(ZGGraph *graph, const char *objectString, float canvasX, float canvasY);
      graph_add_new_object: Module.cwrap("zg_graph_add_new_object", "number", [
        "number",
        "string",
        "number",
        "number",
      ]),

      // void zg_graph_add_connection(ZGGraph *graph, ZGObject *fromObject, int outletIndex, ZGObject *toObject, int inletIndex);
      graph_add_connection: Module.cwrap("zg_graph_add_connection", null, [
        "number",
        "number",
        "number",
        "number",
      ]),

      // void zg_graph_remove_connection(ZGGraph *graph, ZGObject *fromObject, int outletIndex, ZGObject *toObject, int inletIndex);
      graph_remove_connection: Module.cwrap(
        "zg_graph_remove_connection",
        null,
        ["number", "number", "number", "number"],
      ),
    };
    console.log(zg.current);
  }

  function initializeAudioContext() {
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext == null) {
      console.error("Web Audio not supported.");
    }
    audioContext.current = new AudioContext();
    audioContext.current.suspend();
  }

  function tieContextsTogether() {
    scriptProcessor.current = audioContext.current.createScriptProcessor(
      null,
      0,
      2,
    );
    var blockSize = scriptProcessor.current.bufferSize;

    var bufferSize = blockSize * 2 * 4;
    var scriptOutputPtr = Module._malloc(bufferSize);
    var scriptOutputBuffer = Module.HEAPU8.subarray(
      scriptOutputPtr,
      scriptOutputPtr + bufferSize,
    );
    var outputBufferChannel1 = new Float32Array(
      scriptOutputBuffer.buffer,
      scriptOutputBuffer.byteOffset,
      blockSize,
    );
    var outputBufferChannel2 = new Float32Array(
      scriptOutputBuffer.buffer,
      scriptOutputBuffer.byteOffset + blockSize * 4,
      blockSize,
    );

    zgContext.current = zg.current.context_new(
      0,
      2,
      blockSize,
      audioContext.current.sampleRate,
      null,
      null,
    );

    scriptProcessor.current.onaudioprocess = function (audioProcessingEvent) {
      zg.current.context_process(zgContext.current, 0, scriptOutputPtr);

      var outputBuffer = audioProcessingEvent.outputBuffer;

      outputBuffer.copyToChannel(outputBufferChannel1, 0);
      outputBuffer.copyToChannel(outputBufferChannel2, 1);
    };

    scriptProcessor.current.connect(audioContext.current.destination);
  }

  function addEdge(edge) {
    console.log("XXX adding edge:");
    console.log(edge);

    const sourceObject = zgObjects.current[edge["source"]];
    const targetObject = zgObjects.current[edge["target"]];

    zg.current.graph_add_connection(
      zgGraph.current,
      sourceObject,
      edge["outletIndex"],
      targetObject,
      edge["inletIndex"],
    );
  }

  function removeEdge(edge) {
    console.log("XXX removing edge:");
    console.log(edge);
  }

  function addNode(node) {
    console.log("XXX adding node: ");
    console.log(node);

    zgObjects.current[node["id"]] = zg.current.graph_add_new_object(
      zgGraph.current,
      node["data"]["name"],
      node["x"],
      node["y"],
    );
  }

  function buildAndAttachGraph() {
    console.log("XXX buildAndAttachGraph()");
    zgGraph.current = zg.current.context_new_empty_graph(zgContext.current);

    zgObjects.current = {};
    initialNodes.forEach(function (node) {
      addNode(node);
    });

    edges.current = {};
    initialEdges.forEach(function (edge) {
      addEdge(edge);
    });

    zg.current.graph_attach(zgGraph.current);
  }

  function initialize() {
    initializeZg();
    initializeAudioContext();

    setPlaying(false);
    tieContextsTogether();
    buildAndAttachGraph();
  }

  function playButtonClick() {
    if (playing) {
      console.log("suspending");
      scriptProcessor.current.disconnect(audioContext.current.destination);
      audioContext.current.suspend();
    } else {
      console.log("resuming");
      scriptProcessor.current.connect(audioContext.current.destination);
      audioContext.current.resume();
    }
    setPlaying((playing) => !playing);
  }

  return (
    <>
      <Helmet>
        <script src="module.js"></script>
      </Helmet>
      <button id="initialize-button" onClick={initialize}>
        Initialize
      </button>
      <button id="play-button" onClick={playButtonClick}>
        Play / Pause
      </button>

      <div className="status">{status}</div>
      <DataflowUI
        initialNodes={initialNodes}
        initialEdges={initialEdges}
        onEdgeAdd={addEdge}
        onEdgeRemove={removeEdge}
      />
    </>
  );
}
