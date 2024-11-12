import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Graph from "./components/Graph";
import Spinner from "./components/Spinner";
import "./App.css";

const App = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [loadingNodes, setLoadingNodes] = useState(false);
  const [loadingRelationships, setLoadingRelationships] = useState(false);
  const sceneBackgroundColor = "#303030"; 

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", position: 'relative' }}>
      {loadingNodes && <Spinner size={120} backgroundColor={sceneBackgroundColor} />}

      <Canvas camera={{ position: [0, 0, 100], fov: 75 }}>
        <color attach="background" args={[sceneBackgroundColor]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Graph 
          onNodeSelect={setSelectedNode} 
          setLoadingNodes={setLoadingNodes}
          setLoadingRelationships={setLoadingRelationships}
        />
        <OrbitControls />
      </Canvas>

      {selectedNode && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(26, 26, 26, 0.95)",
            color: "white",
            padding: "15px",
            borderRadius: "8px",
            maxWidth: "350px",
            zIndex: 1000,
            overflowY: "auto",
            maxHeight: "90vh",
          }}
        >
          {loadingRelationships ? (
            <Spinner size={60} backgroundColor={sceneBackgroundColor} overlay={false} />
          ) : (
            <>
              <h3>Информация о Узле</h3>
              <p>
                <strong>ID:</strong> {selectedNode.id}
              </p>
              <p>
                <strong>Label:</strong> {selectedNode.label}
              </p>
              {selectedNode.name && (
                <p>
                  <strong>Имя:</strong> {selectedNode.name}
                </p>
              )}
              {selectedNode.screen_name && (
                <p>
                  <strong>Screen Name:</strong> {selectedNode.screen_name}
                </p>
              )}
              {selectedNode.sex !== undefined && (
                <p>
                  <strong>Пол:</strong> {selectedNode.sex === 1 ? "Женский" : "Мужской"}
                </p>
              )}
              {selectedNode.home_town && (
                <p>
                  <strong>Родной город:</strong> {selectedNode.home_town}
                </p>
              )}

              <h4>Связи:</h4>
              {selectedNode.relationships && selectedNode.relationships.length > 0 ? (
                <ul>
                  {selectedNode.relationships.map((rel, index) => (
                    <li key={index} style={{ marginBottom: "10px" }}>
                      <strong>Тип:</strong> {rel.relationship} <br />
                      <strong>Направление:</strong> {rel.direction} <br />
                      <strong>Связанный узел ID:</strong> {rel.related_node?.id || "N/A"} <br />
                      {rel.related_node?.name && (
                        <span>
                          <strong>Имя:</strong> {rel.related_node.name} <br />
                        </span>
                      )}
                      {rel.related_node?.screen_name && (
                        <span>
                          <strong>Screen Name:</strong> {rel.related_node.screen_name} <br />
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Связи не найдены</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
