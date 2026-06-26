"use client";

import React, { useEffect, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  Node,
  Edge
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { mockEntities, mockEdges, NetworkEntity } from "./networkData";

// Custom Node Component to style based on entity type and active states
const CustomGraphNode = ({ data }: any) => {
  const typeColors = {
    "Bank Account": "border-emerald-500/60 bg-emerald-950/20 text-emerald-450",
    "Phone Number": "border-amber-500/60 bg-amber-955/20 text-amber-450",
    "UPI ID": "border-violet-500/60 bg-violet-955/20 text-violet-405",
    "Device": "border-red-505/60 bg-red-955/20 text-red-405",
    "Victim": "border-zinc-700/80 bg-zinc-900/40 text-zinc-300"
  };

  const isHighlighted = data.isHighlighted;
  const isDimmed = data.isDimmed;

  return (
    <div
      className={`p-3.5 rounded-xl border text-xs font-sans min-w-[140px] transition-all duration-300 ${
        typeColors[data.type as keyof typeof typeColors]
      } ${
        isHighlighted 
          ? "ring-2 ring-violet-500 border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.25)] scale-105" 
          : ""
      } ${
        isDimmed ? "opacity-35" : "opacity-100"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-zinc-800 !border-zinc-700" />
      <div className="text-[10px] font-mono font-bold opacity-60 uppercase tracking-wider">{data.type}</div>
      <div className="text-sm font-extrabold truncate mt-1 text-zinc-100 leading-tight">{data.label}</div>
      <div className="flex justify-between items-center mt-2.5 border-t border-zinc-800/80 pt-1.5 text-[10px]">
        <span className="text-zinc-550 font-bold uppercase">Risk Index</span>
        <span className={`font-extrabold ${data.risk > 75 ? "text-red-400" : data.risk > 40 ? "text-amber-405" : "text-emerald-405"}`}>
          {data.risk}%
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-800 !border-zinc-700" />
    </div>
  );
};

const nodeTypes = {
  customNode: CustomGraphNode,
};

interface NetworkCanvasProps {
  searchQuery: string;
  selectedCluster: string;
  selectedEntity: NetworkEntity | null;
  onSelectEntity: (entity: NetworkEntity) => void;
}

export default function NetworkCanvas({
  searchQuery,
  selectedCluster,
  selectedEntity,
  onSelectEntity,
}: NetworkCanvasProps) {

  // Calculate coordinates for nodes dynamically to form 3 clean spatial clusters
  const initialNodes: Node[] = useMemo(() => {
    const nodes: Node[] = [];

    // Filter lists
    const jamtaraList = mockEntities.filter((e) => e.clusterId.includes("Jamtara"));
    const mewatList = mockEntities.filter((e) => e.clusterId.includes("Mewat"));
    const delhiList = mockEntities.filter((e) => e.clusterId.includes("Delhi"));

    const clusters = [
      { list: jamtaraList, cx: 200, cy: 220, label: "Jamtara Phishing Network" },
      { list: mewatList, cx: 650, cy: 220, label: "Mewat VoIP Syndicate" },
      { list: delhiList, cx: 1100, cy: 220, label: "Delhi Mule Offramps" }
    ];

    clusters.forEach(({ list, cx, cy }) => {
      // Find the primary master node in the list
      const masterNode = list.find((e) => e.id.includes("master") || e.id.includes("root") || e.id === "node-j-1" || e.id === "node-m-1" || e.id === "node-d-1");
      const subNodes = list.filter((e) => e.id !== masterNode?.id);

      // Place master in center
      if (masterNode) {
        nodes.push({
          id: masterNode.id,
          type: "customNode",
          position: { x: cx, y: cy },
          data: {
            label: masterNode.label,
            type: masterNode.type,
            risk: masterNode.risk,
            isHighlighted: false,
            isDimmed: false
          }
        });
      }

      // Arrange subNodes in circle around master
      const count = subNodes.length;
      const radius = 170;

      subNodes.forEach((node, i) => {
        const angle = (i * 2 * Math.PI) / count;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);

        nodes.push({
          id: node.id,
          type: "customNode",
          position: { x, y },
          data: {
            label: node.label,
            type: node.type,
            risk: node.risk,
            isHighlighted: false,
            isDimmed: false
          }
        });
      });
    });

    return nodes;
  }, []);

  const initialEdges: Edge[] = useMemo(() => {
    return mockEdges.map(([from, to], idx) => ({
      id: `edge-${idx}`,
      source: from,
      target: to,
      style: { stroke: "rgba(113, 113, 122, 0.2)", strokeWidth: 1.5 },
      animated: Math.random() > 0.7, // Add ambient data flow pulses
    }));
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state highlights and dims based on search query, selected cluster, and active selection
  useEffect(() => {
    setNodes((prevNodes) =>
      prevNodes.map((n) => {
        const entity = mockEntities.find((e) => e.id === n.id);
        if (!entity) return n;

        // Check search query matches
        const matchesSearch = searchQuery 
          ? entity.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
            entity.type.toLowerCase().includes(searchQuery.toLowerCase())
          : false;

        // Check cluster matches
        const matchesCluster = selectedCluster === "ALL" || entity.clusterId === selectedCluster;

        // Dim logic
        let isDimmed = false;
        if (selectedCluster !== "ALL" && !matchesCluster) {
          isDimmed = true;
        } else if (searchQuery && !matchesSearch) {
          isDimmed = true;
        }

        // Highlight logic
        const isHighlighted = selectedEntity?.id === n.id || (searchQuery && matchesSearch);

        return {
          ...n,
          data: {
            ...n.data,
            isHighlighted,
            isDimmed
          }
        };
      })
    );

    // Dynamic edge highlighting
    setEdges((prevEdges) =>
      prevEdges.map((e) => {
        const isLinkedToSelected = selectedEntity && (e.source === selectedEntity.id || e.target === selectedEntity.id);
        return {
          ...e,
          style: {
            stroke: isLinkedToSelected 
              ? "#8b5cf6" 
              : "rgba(113, 113, 122, 0.2)",
            strokeWidth: isLinkedToSelected ? 2.5 : 1.5
          },
          animated: isLinkedToSelected ? true : e.animated
        };
      })
    );
  }, [searchQuery, selectedCluster, selectedEntity, setNodes, setEdges]);

  const handleNodeClick = (_: any, node: Node) => {
    const entity = mockEntities.find((e) => e.id === node.id);
    if (entity) {
      onSelectEntity(entity);
    }
  };

  return (
    <div className="w-full h-full bg-zinc-950/40 rounded-xl border border-zinc-900 overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={handleNodeClick}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
        maxZoom={1.8}
        className="w-full h-full"
      >
        <Background color="#52525b" gap={24} size={1} style={{ opacity: 0.1 }} />
        <Controls className="!bg-zinc-900 !border-zinc-800 !text-zinc-300 !fill-zinc-300" />
      </ReactFlow>
    </div>
  );
}
