'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// Sample data structure for a dependency tree
const sampleData = {
  tokens: [
    { id: 1, form: "കുട്ടികൾ", pos: "NOUN" },
    { id: 2, form: "പന്ത്", pos: "NOUN" },
    { id: 3, form: "കളിക്കുന്നു", pos: "VERB" }
  ],
  arcs: [
    { source: 3, target: 1, relation: "nsubj" },
    { source: 3, target: 2, relation: "obj" },
    { source: 0, target: 3, relation: "root" } // 0 represents the root node
  ]
};

export default function DependencyGraph() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous renders

    const width = 500;
    const height = 300;
    const margin = { top: 60, right: 20, bottom: 40, left: 20 };
    const tokenSpacing = width / (sampleData.tokens.length + 1);
    const baselineY = height - margin.bottom;

    // 1. Draw Tokens
    const nodes = svg.append("g")
      .selectAll("g")
      .data(sampleData.tokens)
      .join("g")
      .attr("transform", d => `translate(${d.id * tokenSpacing}, ${baselineY})`);

    nodes.append("text")
      .text(d => d.form)
      .attr("text-anchor", "middle")
      .attr("class", "text-indigo-200 font-medium text-lg")
      .style("opacity", 0)
      .transition().duration(800).delay((_, i) => i * 200)
      .style("opacity", 1);

    nodes.append("text")
      .text(d => d.pos)
      .attr("text-anchor", "middle")
      .attr("y", 20)
      .attr("class", "text-amber font-mono text-xs uppercase tracking-widest")
      .style("opacity", 0)
      .transition().duration(800).delay((_, i) => i * 200 + 400)
      .style("opacity", 1);

    // 2. Draw Arcs (Bezier curves)
    const linkGenerator = d3.linkHorizontal()
      .x((d: any) => d.x)
      .y((d: any) => d.y);

    const arcsGroup = svg.append("g");

    sampleData.arcs.forEach((arc, i) => {
      const isRoot = arc.source === 0;
      const sourceX = isRoot ? arc.target * tokenSpacing : arc.source * tokenSpacing;
      const targetX = arc.target * tokenSpacing;
      
      // Calculate arc height based on distance between tokens
      const distance = Math.abs(targetX - sourceX);
      const controlY = baselineY - (distance * 0.4) - 40; 
      const startY = isRoot ? margin.top : baselineY - 20;

      const pathData = `M ${sourceX} ${startY} Q ${sourceX + (targetX - sourceX)/2} ${controlY} ${targetX} ${baselineY - 20}`;

      // Draw Path
      const path = arcsGroup.append("path")
        .attr("d", pathData)
        .attr("fill", "none")
        .attr("stroke", isRoot ? "#10B981" : "#6366F1") // Emerald for root, Indigo for normal
        .attr("stroke-width", 2)
        .attr("marker-end", "url(#arrowhead)");

      // Animate Path Drawing
      const totalLength = path.node()?.getTotalLength() || 0;
      path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .delay(1000 + (i * 300))
        .attr("stroke-dashoffset", 0);

      // Draw Labels
      arcsGroup.append("text")
        .text(arc.relation)
        .attr("x", sourceX + (targetX - sourceX) / 2)
        .attr("y", controlY + (isRoot ? 40 : 15))
        .attr("text-anchor", "middle")
        .attr("class", "text-white text-xs fill-current")
        .style("opacity", 0)
        .transition()
        .duration(500)
        .delay(1500 + (i * 300))
        .style("opacity", 1);
    });

    // Define Arrowhead Marker
    svg.append("defs").append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#6366F1")
      .style("stroke", "none");

  }, []);

  return (
    <div className="w-full overflow-x-auto overflow-y-hidden">
      <svg 
        ref={svgRef} 
        viewBox="0 0 500 300" 
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full min-w-[500px]"
      />
    </div>
  );
}