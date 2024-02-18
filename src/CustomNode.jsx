import React, { memo } from "react";
import {
  Handle,
  useReactFlow,
  useStoreApi,
  Position,
  useEdges,
} from "reactflow";

function CustomNode({ id, data }) {
  const edges = useEdges();
  return (
    <>
      <div className="custom-node__body">
        <div className="center-flex">{data["name"]}</div>
        <div className="custom-node__body-columns">
          <div className="custom-node-inlet-column">
            {data["inlets"].map((index) => (
              <>
                <div>
                  inlet {index}
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={"inlet-" + index}
                    style={{ position: "relative", background: "#555" }}
                  />
                </div>
              </>
            ))}
          </div>

          <div className="custom-node-outlet-column">
            {data["outlets"].map((index) => (
              <>
                <div>
                  outlet {index}
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={"outlet-" + index}
                    style={{ position: "relative", background: "#555" }}
                  />
                </div>
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(CustomNode);
