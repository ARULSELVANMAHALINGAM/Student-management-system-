import React, { useState, useEffect } from 'react';
import { Graph } from '../datastructures/Graph';
import { Navigation, CalendarRange, ArrowRightLeft, RefreshCw, Layers, CheckCircle, AlertTriangle } from 'lucide-react';

interface GraphVisualizerProps {}

// Campus Map Nodes with absolute X,Y coords (inside 600x400 container)
const campusNodes = [
  { id: 'Gate', name: 'Main Gate', x: 50, y: 350 },
  { id: 'Admin', name: 'Admin Block', x: 180, y: 220 },
  { id: 'CS', name: 'CS Department', x: 350, y: 120 },
  { id: 'ECE', name: 'ECE Department', x: 480, y: 220 },
  { id: 'Library', name: 'Central Library', x: 350, y: 350 },
  { id: 'HostelB', name: 'Boys Hostel', x: 550, y: 350 },
  { id: 'HostelG', name: 'Girls Hostel', x: 550, y: 80 },
  { id: 'Cafeteria', name: 'Campus Cafeteria', x: 150, y: 80 },
  { id: 'Sports', name: 'Sports Complex', x: 50, y: 180 },
];

// Campus Weighted Edges
const campusEdges = [
  { from: 'Gate', to: 'Admin', weight: 150 },
  { from: 'Gate', to: 'Sports', weight: 100 },
  { from: 'Sports', to: 'Cafeteria', weight: 200 },
  { from: 'Admin', to: 'Cafeteria', weight: 120 },
  { from: 'Admin', to: 'CS', weight: 180 },
  { from: 'Admin', to: 'Library', weight: 160 },
  { from: 'CS', to: 'Cafeteria', weight: 190 },
  { from: 'CS', to: 'ECE', weight: 110 },
  { from: 'CS', to: 'HostelG', weight: 150 },
  { from: 'ECE', to: 'HostelG', weight: 100 },
  { from: 'ECE', to: 'HostelB', weight: 140 },
  { from: 'ECE', to: 'Library', weight: 130 },
  { from: 'Library', to: 'Gate', weight: 250 },
  { from: 'Library', to: 'HostelB', weight: 180 },
];

// Course list for Topo Sort
const defaultCourses = [
  { id: 'CS101', name: 'Programming Concepts' },
  { id: 'CS102', name: 'Data Structures' },
  { id: 'CS201', name: 'Algorithms Lab' },
  { id: 'CS202', name: 'Database Systems' },
  { id: 'CS301', name: 'Artificial Intelligence' },
  { id: 'CS302', name: 'Compiler Construction' },
];

// Default Course Prerequisite Edges (from -> to means "from is prerequisite for to")
const initialPrereqs = [
  { from: 'CS101', to: 'CS102' },
  { from: 'CS102', to: 'CS201' },
  { from: 'CS102', to: 'CS202' },
  { from: 'CS201', to: 'CS301' },
  { from: 'CS201', to: 'CS302' },
  { from: 'CS202', to: 'CS302' },
];

// Exam conflict graph courses
const examCourses = ['CS101', 'CS102', 'CS201', 'CS202', 'MATH101', 'PHY101', 'CHEM101', 'EVS101'];
const initialConflicts = [
  { u: 'CS101', v: 'MATH101' },
  { u: 'CS101', v: 'PHY101' },
  { u: 'CS102', v: 'PHY101' },
  { u: 'CS102', v: 'CS201' },
  { u: 'CS201', v: 'CS202' },
  { u: 'CS202', v: 'MATH101' },
  { u: 'MATH101', v: 'PHY101' },
  { u: 'PHY101', v: 'CHEM101' },
  { u: 'CHEM101', v: 'EVS101' },
  { u: 'CS201', v: 'CHEM101' },
];

const slotColors = [
  { name: 'Slot A (9:00 AM)', hex: '#EF4444', border: 'border-red-500', text: 'text-red-500' }, // Red
  { name: 'Slot B (11:30 AM)', hex: '#3B82F6', border: 'border-blue-500', text: 'text-blue-500' }, // Blue
  { name: 'Slot C (2:00 PM)', hex: '#10B981', border: 'border-emerald-500', text: 'text-emerald-500' }, // Emerald
  { name: 'Slot D (4:30 PM)', hex: '#F59E0B', border: 'border-amber-500', text: 'text-amber-500' }, // Amber
  { name: 'Slot E (Next Day)', hex: '#8B5CF6', border: 'border-violet-500', text: 'text-violet-500' }, // Violet
  { name: 'Slot F (Reserve)', hex: '#EC4899', border: 'border-pink-500', text: 'text-pink-500' }, // Pink
];

export const GraphVisualizer: React.FC<GraphVisualizerProps> = () => {
  const [activeTab, setActiveTab] = useState<'dijkstra' | 'toposort' | 'coloring'>('dijkstra');

  // Dijkstra State
  const [startBuilding, setStartBuilding] = useState('Gate');
  const [endBuilding, setEndBuilding] = useState('CS');
  const [shortestPath, setShortestPath] = useState<string[]>([]);
  const [pathDistance, setPathDistance] = useState<number>(-1);
  const [dijkstraVisited, setDijkstraVisited] = useState<string[]>([]);

  // Topological Sort State
  const [prereqEdges, setPrereqEdges] = useState(initialPrereqs);
  const [topoOrder, setTopoOrder] = useState<string[]>([]);
  const [topoCycleDetected, setTopoCycleDetected] = useState(false);
  const [newPrereqFrom, setNewPrereqFrom] = useState('CS101');
  const [newPrereqTo, setNewPrereqTo] = useState('CS302');
  const [topoError, setTopoError] = useState('');

  // Graph Coloring State
  const [coloringResult, setColoringResult] = useState<Map<string, number>>(new Map());
  const [totalColorsUsed, setTotalColorsUsed] = useState(0);

  // Initialize Dijkstra Path automatically
  useEffect(() => {
    runDijkstraNav();
  }, [startBuilding, endBuilding]);

  // Run Dijkstra Navigation
  const runDijkstraNav = () => {
    const campusGraph = new Graph();
    campusNodes.forEach(node => campusGraph.addNode(node.id));
    campusEdges.forEach(edge => campusGraph.addWeightedEdge(edge.from, edge.to, edge.weight));

    const result = campusGraph.dijkstra(startBuilding, endBuilding);
    setShortestPath(result.path);
    setPathDistance(result.distance);
    setDijkstraVisited(result.visitedOrder);
  };

  // Run Topological Sort
  const runTopologicalSort = () => {
    setTopoError('');
    const courseGraph = new Graph();
    defaultCourses.forEach(c => courseGraph.addNode(c.id));
    prereqEdges.forEach(edge => courseGraph.addDirectedEdge(edge.from, edge.to));

    const result = courseGraph.topologicalSort();
    setTopoOrder(result.order);
    setTopoCycleDetected(result.hasCycle);
  };

  const addPrereqLink = () => {
    setTopoError('');
    if (newPrereqFrom === newPrereqTo) {
      setTopoError('A course cannot be a prerequisite of itself.');
      return;
    }
    const alreadyExists = prereqEdges.some(e => e.from === newPrereqFrom && e.to === newPrereqTo);
    if (alreadyExists) {
      setTopoError('This prerequisite relation already exists.');
      return;
    }

    const updated = [...prereqEdges, { from: newPrereqFrom, to: newPrereqTo }];
    setPrereqEdges(updated);
  };

  const resetPrereqs = () => {
    setPrereqEdges(initialPrereqs);
    setTopoOrder([]);
    setTopoCycleDetected(false);
    setTopoError('');
  };

  // Run Timetable Coloring Scheduling
  const runGraphColoring = () => {
    const conflictGraph = new Graph();
    examCourses.forEach(course => conflictGraph.addNode(course));
    initialConflicts.forEach(edge => conflictGraph.addUndirectedEdge(edge.u, edge.v));

    const colorMap = conflictGraph.greedyColoring();
    setColoringResult(colorMap);

    // Compute unique count
    const uniqueColors = new Set(colorMap.values());
    setTotalColorsUsed(uniqueColors.size);
  };

  // Helper to check if edge is part of shortest path
  const isEdgeInPath = (u: string, v: string) => {
    if (shortestPath.length < 2) return false;
    for (let i = 0; i < shortestPath.length - 1; i++) {
      if ((shortestPath[i] === u && shortestPath[i+1] === v) || (shortestPath[i] === v && shortestPath[i+1] === u)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="space-y-6" id="graph-playground-container">
      {/* Sub tabs switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('dijkstra')}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'dijkstra'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Navigation size={15} /> Campus Nav (Dijkstra)
        </button>
        <button
          onClick={() => {
            setActiveTab('toposort');
            runTopologicalSort();
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'toposort'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers size={15} /> Course Prerequisites (Topo Sort)
        </button>
        <button
          onClick={() => {
            setActiveTab('coloring');
            runGraphColoring();
          }}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
            activeTab === 'coloring'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CalendarRange size={15} /> Exam Slots (Graph Coloring)
        </button>
      </div>

      {/* 1. DIJKSTRA TAB */}
      {activeTab === 'dijkstra' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Dijkstra Control bar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs">
              <h4 className="font-semibold text-slate-800 text-sm mb-3 uppercase tracking-wider">Campus Dijkstra Guide</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Campus Navigation solves the single-source shortest path problem. Dijkstra's Algorithm explores adjacent paths using a priority queue structure, ensuring the mathematically minimum distance route is picked in <strong>O(E + V log V)</strong>.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs">
              <h4 className="font-semibold text-slate-800 text-sm mb-4 uppercase tracking-wider">Pathfinder Selection</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Starting Building</label>
                  <select
                    value={startBuilding}
                    onChange={(e) => setStartBuilding(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 mt-1 focus:border-indigo-500 focus:bg-white cursor-pointer"
                  >
                    {campusNodes.map(node => (
                      <option key={node.id} value={node.id}>{node.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Destination Building</label>
                  <select
                    value={endBuilding}
                    onChange={(e) => setEndBuilding(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 mt-1 focus:border-indigo-500 focus:bg-white cursor-pointer"
                  >
                    {campusNodes.map(node => (
                      <option key={node.id} value={node.id} disabled={node.id === startBuilding}>{node.name}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-lg font-mono">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wide font-sans font-bold">Shortest Route Analysis</div>
                  {pathDistance !== -1 ? (
                    <div className="mt-2 space-y-1">
                      <div className="text-xs font-semibold text-slate-700">Distance: <span className="text-indigo-600 font-bold">{pathDistance} meters</span></div>
                      <div className="text-[10px] text-slate-500 whitespace-pre-wrap leading-normal mt-1">
                        <strong>Path:</strong> {shortestPath.map(nodeId => campusNodes.find(n => n.id === nodeId)?.name).join(' → ')}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-rose-500 mt-2 font-semibold">No path detected between these segments.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Dijkstra SVG Canvas Map */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-150 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-slate-800 text-base">Campus Vector Path Mapping</h3>
              <p className="text-xs text-slate-500 mb-4">SVG blueprint. Selected routes and pathfinding sequences are highlighted in real-time.</p>
            </div>

            <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 overflow-x-auto shadow-inner flex justify-center">
              <svg width="600" height="400" className="max-w-full select-none">
                {/* Draw Edges */}
                {campusEdges.map((edge, idx) => {
                  const fromNode = campusNodes.find(n => n.id === edge.from)!;
                  const toNode = campusNodes.find(n => n.id === edge.to)!;
                  const inPath = isEdgeInPath(edge.from, edge.to);

                  return (
                    <g key={`edge-${idx}`}>
                      <line
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={inPath ? '#10B981' : '#1E293B'}
                        strokeWidth={inPath ? '4.5' : '1.5'}
                        strokeDasharray={inPath ? 'none' : '3 3'}
                        className="transition-all duration-300"
                      />
                      {/* Weight badge position */}
                      <rect
                        x={(fromNode.x + toNode.x) / 2 - 14}
                        y={(fromNode.y + toNode.y) / 2 - 8}
                        width="28"
                        height="16"
                        rx="4"
                        fill="#020617"
                        stroke={inPath ? '#10B981' : '#334155'}
                        strokeWidth="1"
                      />
                      <text
                        x={(fromNode.x + toNode.x) / 2}
                        y={(fromNode.y + toNode.y) / 2 + 4}
                        fill={inPath ? '#10B981' : '#64748B'}
                        fontSize="9"
                        fontFamily="monospace"
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}

                {/* Draw Nodes */}
                {campusNodes.map((node) => {
                  const isStart = node.id === startBuilding;
                  const isEnd = node.id === endBuilding;
                  const isInPath = shortestPath.includes(node.id);
                  const isVisited = dijkstraVisited.includes(node.id);

                  let circleColor = '#1e293b'; // Default gray-800
                  let strokeColor = '#334155';
                  let textColor = '#94a3b8';

                  if (isStart) {
                    circleColor = '#6366F1'; // Indigo-500
                    strokeColor = '#818CF8';
                    textColor = '#ffffff';
                  } else if (isEnd) {
                    circleColor = '#EF4444'; // Red-500
                    strokeColor = '#F87171';
                    textColor = '#ffffff';
                  } else if (isInPath) {
                    circleColor = '#10B981'; // Emerald-500
                    strokeColor = '#34D399';
                    textColor = '#ffffff';
                  } else if (isVisited) {
                    circleColor = '#0F172A'; // Slate-900
                    strokeColor = '#475569';
                    textColor = '#64748B';
                  }

                  return (
                    <g key={node.id} className="transition-all duration-300">
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="18"
                        fill={circleColor}
                        stroke={strokeColor}
                        strokeWidth={isStart || isEnd || isInPath ? '3' : '1.5'}
                      />
                      <text
                        x={node.x}
                        y={node.y - 24}
                        fill={isInPath || isStart || isEnd ? '#E2E8F0' : '#475569'}
                        fontSize="10.5"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {node.name}
                      </text>
                      <text
                        x={node.x}
                        y={node.y + 4}
                        fill={textColor}
                        fontSize="9"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {node.id.substring(0, 3)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="mt-4 flex gap-4 text-xs justify-center flex-wrap">
              <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-indigo-500 border border-indigo-400"></span><span className="text-slate-600 font-medium">Source</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-rose-400"></span><span className="text-slate-600 font-medium">Destination</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-400"></span><span className="text-slate-600 font-medium">Shortest Path Match</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-700"></span><span className="text-slate-600 font-medium">Explored Nodes</span></div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TOPOLOGICAL SORT TAB */}
      {activeTab === 'toposort' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Controls & Add Edge Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs">
              <h4 className="font-semibold text-slate-800 text-sm mb-3 uppercase tracking-wider">Topological Sorting (Kahn's)</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Topological sorting arranges a Directed Acyclic Graph (DAG) linearly such that for every directed edge <code className="font-mono bg-slate-100 px-1 rounded">U → V</code>, course U appears before course V. Cycle detections are evaluated in <strong>O(V + E)</strong> time.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs">
              <h4 className="font-semibold text-slate-800 text-sm mb-4 uppercase tracking-wider">Add Prerequisite Link</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Prerequisite Course</label>
                  <select
                    value={newPrereqFrom}
                    onChange={(e) => setNewPrereqFrom(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 mt-1 focus:border-indigo-500 focus:bg-white cursor-pointer font-mono"
                  >
                    {defaultCourses.map(c => (
                      <option key={c.id} value={c.id}>{c.id} - {c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Target Course</label>
                  <select
                    value={newPrereqTo}
                    onChange={(e) => setNewPrereqTo(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 mt-1 focus:border-indigo-500 focus:bg-white cursor-pointer font-mono"
                  >
                    {defaultCourses.map(c => (
                      <option key={c.id} value={c.id} disabled={c.id === newPrereqFrom}>{c.id} - {c.name}</option>
                    ))}
                  </select>
                </div>

                {topoError && (
                  <p className="text-[11px] text-rose-600 font-medium">{topoError}</p>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => { addPrereqLink(); runTopologicalSort(); }}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Add Edge
                  </button>
                  <button
                    onClick={resetPrereqs}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg p-2 transition-colors cursor-pointer"
                    title="Reset to Default"
                  >
                    <RefreshCw size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* In-Degree analysis */}
            <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs font-mono">
              <h4 className="font-semibold text-slate-800 text-xs mb-3 uppercase tracking-wider font-sans">Active In-Degree Count</h4>
              <div className="space-y-1.5">
                {defaultCourses.map(course => {
                  const incomingCount = prereqEdges.filter(e => e.to === course.id).length;
                  return (
                    <div key={course.id} className="flex justify-between text-xs py-1 border-b border-slate-50">
                      <span className="text-slate-600 font-semibold">{course.id} ({course.name.split(' ')[0]})</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${incomingCount === 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
                        In-Degree: {incomingCount}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Topo Sort Interactive Layout Map */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-150 shadow-xs flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-slate-800 text-base">Course Prerequisite DAG Blueprint</h3>
              <p className="text-xs text-slate-500 mb-4">Direct acyclic graph nodes represent courses. Arrows represent mandatory enrollment orders.</p>
            </div>

            <div className="bg-slate-900 border border-slate-950 p-4 rounded-xl min-h-[250px] overflow-y-auto shadow-inner grid grid-cols-2 md:grid-cols-3 gap-4 items-center">
              {defaultCourses.map(course => {
                const prereqsList = prereqEdges.filter(e => e.to === course.id).map(e => e.from);
                const isReady = prereqsList.length === 0;

                return (
                  <div
                    key={course.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isReady
                        ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-100 shadow-emerald-950/20 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono font-bold text-slate-300">{course.id}</span>
                      {isReady && (
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">
                          No Prereqs
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-white mt-1.5">{course.name}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-2">
                      Requires: {prereqsList.length > 0 ? prereqsList.join(', ') : 'None'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Results Panel */}
            <div className="mt-5 border-t border-slate-100 pt-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-slate-700">Topological Sort Output Sequence:</span>
                <button
                  onClick={runTopologicalSort}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3.5 py-1.5 text-xs transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <RefreshCw size={12} /> Compute Sort
                </button>
              </div>

              {topoCycleDetected ? (
                <div className="bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-xl flex gap-2 text-xs">
                  <AlertTriangle className="text-rose-600 shrink-0 mt-0.5" size={16} />
                  <div>
                    <strong>Circular Dependency Cycle Detected!</strong>
                    <p className="mt-1 text-rose-700 leading-normal">
                      The current custom course links contain a circular prerequisite loop (e.g., A needs B, and B needs A). A directed graph with cycles cannot be sorted topologically! This error confirms our cycle-checking safety boundaries.
                    </p>
                  </div>
                </div>
              ) : topoOrder.length > 0 ? (
                <div className="flex items-center gap-2 overflow-x-auto py-2">
                  {topoOrder.map((courseId, idx) => (
                    <React.Fragment key={courseId}>
                      {idx > 0 && <span className="text-slate-400 font-bold font-mono">→</span>}
                      <div className="bg-indigo-50 border border-indigo-100 px-3.5 py-2 rounded-lg text-xs text-center font-mono shrink-0">
                        <span className="font-bold text-indigo-900 block">{courseId}</span>
                        <span className="text-[10px] text-indigo-700 mt-0.5 block">{defaultCourses.find(c => c.id === courseId)?.name.split(' ')[0]}</span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">Click "Compute Sort" to display ordering sequence</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. GRAPH COLORING TAB */}
      {activeTab === 'coloring' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs">
              <h4 className="font-semibold text-slate-800 text-sm mb-3 uppercase tracking-wider">Exam Clash Coloring Algorithm</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                To schedule exams without session conflicts, we build a conflict graph where each node is a course. An edge exists if there are common students registered in both.
              </p>
              <div className="mt-3 text-[11px] text-amber-800 bg-amber-50 p-3 rounded-lg border border-amber-100 font-mono">
                Adjacent nodes MUST not receive the same timeslot (color). The <strong>Greedy Coloring Algorithm</strong> schedules all exams in a mathematically minimal number of timeslots.
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs">
              <h4 className="font-semibold text-slate-800 text-sm mb-4 uppercase tracking-wider">Timeslot Legend (Colors)</h4>
              <div className="space-y-2">
                {slotColors.slice(0, Math.max(totalColorsUsed, 3)).map((color, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color.hex }}></span>
                    <span className="font-semibold text-slate-700">{color.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance analysis */}
            <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs">
              <h4 className="font-semibold text-slate-800 text-sm mb-3 uppercase tracking-wider">Scheduling Performance</h4>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/50">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Total Exams</span>
                  <span className="text-xl font-mono font-bold text-slate-800">{examCourses.length}</span>
                </div>
                <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100/50">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase">Slots Required</span>
                  <span className="text-xl font-mono font-bold text-emerald-800">{totalColorsUsed || 3}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Exam Coloring Map */}
          <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-150 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-slate-800 text-base">Clashing Conflict Graph Grid</h3>
                <p className="text-xs text-slate-500">Linked lines represent common students. Colored slots prevent concurrent exam sessions.</p>
              </div>
              <button
                onClick={runGraphColoring}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <RefreshCw size={12} /> Re-schedule Slots
              </button>
            </div>

            {/* SVG Visual conflict rendering */}
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-4 overflow-x-auto shadow-inner flex justify-center">
              <svg width="600" height="300" className="max-w-full select-none">
                {/* Math layout for circles */}
                {/* 8 items in circle coordinates */}
                {(() => {
                  const radius = 95;
                  const centerX = 300;
                  const centerY = 150;
                  const getCoords = (index: number) => {
                    const angle = (index * 2 * Math.PI) / examCourses.length;
                    return {
                      x: centerX + radius * Math.cos(angle),
                      y: centerY + radius * Math.sin(angle)
                    };
                  };

                  return (
                    <>
                      {/* Edges */}
                      {initialConflicts.map((edge, idx) => {
                        const uIdx = examCourses.indexOf(edge.u);
                        const vIdx = examCourses.indexOf(edge.v);
                        if (uIdx === -1 || vIdx === -1) return null;
                        const fromCoords = getCoords(uIdx);
                        const toCoords = getCoords(vIdx);

                        return (
                          <line
                            key={`conflict-${idx}`}
                            x1={fromCoords.x}
                            y1={fromCoords.y}
                            x2={toCoords.x}
                            y2={toCoords.y}
                            stroke="#1e293b"
                            strokeWidth="2"
                          />
                        );
                      })}

                      {/* Nodes */}
                      {examCourses.map((course, idx) => {
                        const coords = getCoords(idx);
                        const colorIdx = coloringResult.get(course) ?? 0;
                        const activeColor = slotColors[colorIdx % slotColors.length];

                        return (
                          <g key={course}>
                            <circle
                              cx={coords.x}
                              cy={coords.y}
                              r="20"
                              fill={activeColor.hex}
                              stroke="#ffffff"
                              strokeWidth="2.5"
                              className="transition-all duration-300"
                            />
                            <text
                              x={coords.x}
                              y={coords.y - 26}
                              fill="#94a3b8"
                              fontSize="10"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {course}
                            </text>
                            <text
                              x={coords.x}
                              y={coords.y + 4}
                              fill="#ffffff"
                              fontSize="11"
                              fontFamily="monospace"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              {String.fromCharCode(65 + colorIdx)}
                            </text>
                          </g>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* List Table Grid of Slots */}
            <div className="mt-5 border-t border-slate-100 pt-4">
              <h4 className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1">
                <CheckCircle size={14} className="text-emerald-500" /> Clash-Free Registered Timetable slots
              </h4>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {examCourses.map(course => {
                  const colorIdx = coloringResult.get(course) ?? 0;
                  const color = slotColors[colorIdx % slotColors.length];
                  return (
                    <div key={course} className={`p-3 rounded-lg border ${color.border} bg-slate-50/55 font-mono text-center`}>
                      <span className="block font-bold text-slate-800 text-sm leading-none">{course}</span>
                      <span className={`text-[10px] font-bold ${color.text} mt-1.5 block`}>
                        {color.name.split(' ')[0]} {color.name.split(' ')[1]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
