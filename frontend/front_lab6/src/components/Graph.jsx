import React, { useEffect, useState, useMemo } from "react";
import { fetchNodes, fetchNodeWithRelationships } from "../api";
import Nodes from "./Nodes";
import * as THREE from "three";

const Graph = ({ onNodeSelect, setLoadingNodes, setLoadingRelationships }) => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingNodes(true);
        const nodesData = await fetchNodes();

        const uniqueNodesMap = new Map();
        nodesData.forEach((node) => {
          if (node.id !== null && !uniqueNodesMap.has(node.id)) {
            uniqueNodesMap.set(node.id, node);
          }
        });
        const uniqueNodes = Array.from(uniqueNodesMap.values());

        const totalNodes = uniqueNodes.length;
        const radius = 100;
        const sphericalPositions = generateFibonacciSphere(totalNodes, radius);

        setNodes(
          uniqueNodes.map((node, index) => ({
            id: node.id,
            label: node.label,
            position: sphericalPositions[index],
            color: node.label[0] == "User" ? "#4a90e2" : "#50e3c2",
          }))
        );
      } catch (error) {
        console.error("Ошибка при загрузке узлов:", error);
      } finally {
        setLoadingNodes(false);
      }
    };
    loadData();
  }, [setLoadingNodes]);

  const generateFibonacciSphere = (samples, radius) => {
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < samples; i++) {
      const y = 1 - (i / (samples - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      points.push([x * radius, y * radius, z * radius]);
    }

    return points;
  };

  const handleNodeClick = async (node) => {
    try {
      setLoadingRelationships(true);
      const relationships = await fetchNodeWithRelationships(node.id);
      let nodeInfo = {
        id: node.id,
        label: node.label,
      };

      if (relationships.length > 0 && relationships[0].node) {
        nodeInfo = relationships[0].node;
      }

      onNodeSelect({
        ...nodeInfo,
        relationships,
      });

      const newLinks = relationships.map((rel) => ({
        source: node.id,
        target: rel.related_node?.id,
      }));
      setLinks(newLinks);
    } catch (error) {
      console.error("Ошибка при загрузке связей узла:", error);
    } finally {
      setLoadingRelationships(false);
    }
  };

  const linesGeometry = useMemo(() => {
    const positions = [];
    links.forEach((link) => {
      const sourceNode = nodes.find((n) => n.id === link.source);
      const targetNode = nodes.find((n) => n.id === link.target);
      if (sourceNode && targetNode) {
        positions.push(...sourceNode.position, ...targetNode.position);
      }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    return geometry;
  }, [links, nodes]);

  return (
    <>
      <Nodes nodes={nodes} onNodeClick={handleNodeClick} />

      {links.length > 0 && (
        <lineSegments geometry={linesGeometry}>
          <lineBasicMaterial attach="material" color="white" linewidth={1} />
        </lineSegments>
      )}
    </>
  );
};

export default Graph;