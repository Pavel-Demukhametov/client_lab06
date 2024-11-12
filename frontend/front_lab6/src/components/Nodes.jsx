
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { Object3D, Color } from "three";

const Nodes = ({ nodes, onNodeClick }) => {
  const meshRef = useRef();
  const tempObject = new Object3D();
  const color = new Color();

  useEffect(() => {
    nodes.forEach((node, index) => {
      tempObject.position.set(...node.position);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(index, tempObject.matrix);

      color.set(node.color);
      meshRef.current.setColorAt(index, color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [nodes]);

  const handleClick = (event) => {
    const instanceId = event.instanceId;
    if (instanceId !== undefined && nodes[instanceId]) {
      onNodeClick(nodes[instanceId]);
    }
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, nodes.length]}
      onClick={handleClick}
      castShadow
      receiveShadow
    >
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshStandardMaterial vertexColors={THREE.VertexColors} />
    </instancedMesh>
  );
};

export default Nodes;