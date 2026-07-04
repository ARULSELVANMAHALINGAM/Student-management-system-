/**
 * Custom Adjacency List Graph Implementation.
 * Supports multiple graph-specific operations:
 * 1. Topological Sort (Kahn's Algorithm / DFS) for Course Prerequisites.
 * 2. Dijkstra's Algorithm for Campus Shortest Path Navigation.
 * 3. Greedy Graph Coloring for Exam/Timetable clash scheduling.
 */

// Simple Priority Queue Helper for Dijkstra's
interface PathNode {
  nodeId: string;
  distance: number;
}

export class Graph {
  // Adjacency lists
  private adjacencyList: Map<string, string[]>;
  // For weighted campus graph: nodeId -> list of { node, weight }
  private weightedAdjacencyList: Map<string, { to: string; weight: number }[]>;

  constructor() {
    this.adjacencyList = new Map();
    this.weightedAdjacencyList = new Map();
  }

  public addNode(node: string): void {
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, []);
    }
    if (!this.weightedAdjacencyList.has(node)) {
      this.weightedAdjacencyList.set(node, []);
    }
  }

  /**
   * Adds a directed edge between from and to (directed relationship, e.g., course prereqs)
   */
  public addDirectedEdge(from: string, to: string): void {
    this.addNode(from);
    this.addNode(to);
    const list = this.adjacencyList.get(from);
    if (list && !list.includes(to)) {
      list.push(to);
    }
  }

  /**
   * Adds an undirected edge between from and to (bidirectional, e.g., exam clashes)
   */
  public addUndirectedEdge(u: string, v: string): void {
    this.addNode(u);
    this.addNode(v);
    const listU = this.adjacencyList.get(u);
    if (listU && !listU.includes(v)) listU.push(v);
    
    const listV = this.adjacencyList.get(v);
    if (listV && !listV.includes(u)) listV.push(u);
  }

  /**
   * Adds an undirected weighted edge (for campus navigation map)
   */
  public addWeightedEdge(u: string, v: string, weight: number): void {
    this.addNode(u);
    this.addNode(v);
    
    const listU = this.weightedAdjacencyList.get(u);
    if (listU && !listU.some(edge => edge.to === v)) {
      listU.push({ to: v, weight });
    }

    const listV = this.weightedAdjacencyList.get(v);
    if (listV && !listV.some(edge => edge.to === u)) {
      listV.push({ to: u, weight });
    }
  }

  public getAdjacencyList() {
    return this.adjacencyList;
  }

  public getWeightedAdjacencyList() {
    return this.weightedAdjacencyList;
  }

  /**
   * 1. Topological Sort using Kahn's Algorithm (In-degree queue)
   * Solves course registration orders and detects cyclic dependencies.
   * Time complexity: O(V + E)
   */
  public topologicalSort(): { order: string[]; hasCycle: boolean } {
    const inDegree: Map<string, number> = new Map();
    const order: string[] = [];

    // Initialize all degrees to 0
    for (const node of this.adjacencyList.keys()) {
      inDegree.set(node, 0);
    }

    // Compute in-degrees
    for (const [node, neighbors] of this.adjacencyList.entries()) {
      for (const neighbor of neighbors) {
        inDegree.set(neighbor, (inDegree.get(neighbor) || 0) + 1);
      }
    }

    // Queue of nodes with in-degree 0 (no prerequisites)
    const queue: string[] = [];
    for (const [node, deg] of inDegree.entries()) {
      if (deg === 0) {
        queue.push(node);
      }
    }

    while (queue.length > 0) {
      const u = queue.shift()!;
      order.push(u);

      const neighbors = this.adjacencyList.get(u) || [];
      for (const neighbor of neighbors) {
        const updatedDeg = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, updatedDeg);
        if (updatedDeg === 0) {
          queue.push(neighbor);
        }
      }
    }

    // If order size is less than vertices, there is a circular dependency (cycle)
    const hasCycle = order.length < this.adjacencyList.size;
    return { order, hasCycle };
  }

  /**
   * 2. Dijkstra's Shortest Path Algorithm
   * Finds the path with the minimum total distance weight between startNode and endNode.
   * Time complexity: O((V + E) log V)
   */
  public dijkstra(startNode: string, endNode: string): { path: string[]; distance: number; visitedOrder: string[] } {
    const distances: Map<string, number> = new Map();
    const previous: Map<string, string | null> = new Map();
    const visitedOrder: string[] = [];
    
    // Priority queue of nodes to explore
    const pq: PathNode[] = [];

    // Initialize distances
    for (const node of this.weightedAdjacencyList.keys()) {
      distances.set(node, Infinity);
      previous.set(node, null);
    }

    distances.set(startNode, 0);
    pq.push({ nodeId: startNode, distance: 0 });

    while (pq.length > 0) {
      // Sort PQ to fetch node with minimal distance (Simulating Heap extract-min)
      pq.sort((a, b) => a.distance - b.distance);
      const { nodeId: current, distance: currDist } = pq.shift()!;

      if (visitedOrder.includes(current)) continue;
      visitedOrder.push(current);

      if (current === endNode) break;

      const neighbors = this.weightedAdjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        const altDist = currDist + neighbor.weight;
        if (altDist < (distances.get(neighbor.to) || Infinity)) {
          distances.set(neighbor.to, altDist);
          previous.set(neighbor.to, current);
          pq.push({ nodeId: neighbor.to, distance: altDist });
        }
      }
    }

    // Reconstruct the path from startNode to endNode
    const path: string[] = [];
    let curr: string | null = endNode;
    while (curr !== null) {
      path.unshift(curr);
      curr = previous.get(curr) || null;
    }

    const finalDistance = distances.get(endNode) || Infinity;
    
    return {
      path: path[0] === startNode ? path : [], // Return empty path if unreachable
      distance: finalDistance === Infinity ? -1 : finalDistance,
      visitedOrder
    };
  }

  /**
   * 3. Greedy Graph Coloring Algorithm
   * Used for exam timetable scheduling. No adjacent courses (which share common students)
   * can be scheduled in the same exam slot (color).
   * Time complexity: O(V^2 + E)
   */
  public greedyColoring(): Map<string, number> {
    const result: Map<string, number> = new Map();
    const nodes = Array.from(this.adjacencyList.keys());

    if (nodes.length === 0) return result;

    // Assign the first color (color 0) to the first vertex
    result.set(nodes[0], 0);

    // A temporary array to store available colors.
    // False value of available[cr] would mean that the color 'cr' is
    // assigned to one of its adjacent vertices.
    const available = new Array(nodes.length).fill(true);

    // Assign colors to remaining V-1 vertices
    for (let i = 1; i < nodes.length; i++) {
      const u = nodes[i];
      const neighbors = this.adjacencyList.get(u) || [];

      // Flag all colors of neighbors as unavailable
      for (const neighbor of neighbors) {
        if (result.has(neighbor)) {
          const colorOfNeighbor = result.get(neighbor)!;
          available[colorOfNeighbor] = false;
        }
      }

      // Find the first available color
      let firstAvailableColor = 0;
      for (let c = 0; c < available.length; c++) {
        if (available[c]) {
          firstAvailableColor = c;
          break;
        }
      }

      // Assign the found color to vertex u
      result.set(u, firstAvailableColor);

      // Reset the values to true for the next iteration
      available.fill(true);
    }

    return result;
  }
}
