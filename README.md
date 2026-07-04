# Nexus DSA Student Management Portal

### 🔗 Live Demo: [https://dsa-student-management-portal.vercel.app](https://dsa-student-management-portal.vercel.app)

Welcome to the **Nexus DSA Student Management Portal**—a full-stack academic sandbox designed to demonstrate real-world applications of fundamental Data Structures and Algorithms (DSA) inside a modern high-performance Student Portal. 

Unlike conventional portals that rely on standard built-in arrays, this portal is engineered from the ground up using **custom memory-efficient, mathematically sound data structures implemented in TypeScript**. It provides fully interactive, real-time visualizers to observe theoretical Big-O behaviors directly in the browser.

---

## 🚀 Theoretical Architecture & Custom DSA Implementations

The portal manages records and workflows through the following custom components:

### 1. Student Record Ledger — **Separate Chaining Custom HashMap**
* **Applied DSA**: Direct Chaining Hash Table using linked-list nodes for bucket collision handling, backed by a dynamic polynomial rolling hash function.
* **Complexities**: 
  * **Time**: $\mathcal{O}(1)$ Average-case Lookup, Insert, and Delete.
  * **Space**: $\mathcal{O}(N)$.
* **Viva Justification**: Avoids $\mathcal{O}(N)$ linear scanning scans of traditional arrays. Upon reaching a load factor $\ge 0.75$, the capacity dynamically doubles and all keys are automatically re-hashed to preserve true constant-time $\mathcal{O}(1)$ complexity.

### 2. Search-as-you-type Autocomplete — **Prefix Trie**
* **Applied DSA**: Character-by-character Prefix Tree where each node maps letter links. In addition, each node maintains cached references of matching student IDs to avoid deep branch traversal.
* **Complexities**:
  * **Time**: $\mathcal{O}(L)$ lookup where $L$ is the prefix query length.
  * **Space**: $\mathcal{O}(\Sigma \cdot L \cdot N)$ where $\Sigma$ is the alphabet size.
* **Viva Justification**: Traditional filters (`Array.filter` + `.startsWith()`) scale linearly with the database size $N$, yielding an $\mathcal{O}(N \cdot S)$ search. By isolating paths letter-by-letter, the Trie executes autocomplete routes instantaneously, completely decoupled from the scale of the dataset.

### 3. Hostel Priority Allocation — **Binary Max-Heap**
* **Applied DSA**: Balanced Binary Tree backed by an array index map representing student priority scores computed based on academic performance and financial need.
* **Complexities**:
  * **Time**: $\mathcal{O}(\log N)$ Insertion (`heapify-up`) and Extraction (`heapify-down`).
  * **Space**: $\mathcal{O}(N)$.
* **Viva Justification**: Sorting a standard list on every modification incurs a costly $\mathcal{O}(N \log N)$ operation. A binary Max-Heap maintains priority order dynamically with minimal logarithmic structural swaps.

### 4. Course Enrollment & Prerequisite Trees — **Topological Sort & Kahn’s Algorithm**
* **Applied DSA**: Directed Acyclic Graph (DAG) represented using an Adjacency List. Dependencies are resolved using **Kahn's Queue-based BFS Topological Sort**, coupled with cycle-detection heuristics.
* **Complexities**:
  * **Time**: $\mathcal{O}(V + E)$ linear time resolution.
  * **Space**: $\mathcal{O}(V + E)$.
* **Viva Justification**: Kahn’s In-Degree method mathematically ensures that a student cannot take a course unless all prerequisites are met. It automatically throws validation exceptions if a circular lock (e.g., Course A $\leftrightarrow$ Course B) is present.

### 5. Exam Timetable Conflicts — **Greedy Graph Coloring**
* **Applied DSA**: Adjacency Matrix representing exam conflicts (overlapping course enrollments). The portal runs a greedy heuristic algorithm to color conflict nodes.
* **Complexities**:
  * **Time**: $\mathcal{O}(V^2 + E)$.
  * **Space**: $\mathcal{O}(V)$.
* **Viva Justification**: Finding the absolute minimum chromatic index is NP-Hard. Our polynomial-time greedy scheduler allocates conflict-free exam timeslots rapidly, guaranteeing no student is booked for two overlapping exams.

### 6. Campus Geographical Navigation — **Dijkstra’s Algorithm**
* **Applied DSA**: Weighted Undirected Graph representing departments and campus nodes. A priority queue relaxer tracks shortest cumulative distances.
* **Complexities**:
  * **Time**: $\mathcal{O}((V + E) \log V)$.
  * **Space**: $\mathcal{O}(V + E)$.
* **Viva Justification**: Unlike standard DFS or BFS which treat all connections with equal weights, Dijkstra's algorithm guarantees the mathematically shortest geographical walking path between campus locations.

### 7. Core Workflows (Notices, Fee Queues, Action Backups)
* **Notice Feed (DLL)**: Doubly Linked List allowing instant $\mathcal{O}(1)$ chronological prepend operations at the Head.
* **Fee Billing Waitlist (FIFO Queue)**: Custom FIFO Queue optimized with index resets to avoid memory-leaks and structural array-shifting overhead.
* **Admin Backups (LIFO Stack)**: Last-In-First-Out Undo Stack tracking CRUD operations. Pressing **UNDO (O(1))** pops the action and reverses state mutations instantaneously.

---

## 🎨 Design Theme: "Technical Dashboard / Data Grid"
The application is wrapped in a highly responsive, professional dark/light high-contrast developer theme incorporating:
* **The 'Σ' Nexus Branding Header**: Highlighting live transactional counters.
* **Sidebar Telemetry Navigation**: Directly showing the mathematical performance metrics ($\mathcal{O}(1)$, $\mathcal{O}(\log N)$) associated with each active screen tab.
* **Live System Metrics Footer**: Visualizing active thread counts, active UTC times, and garbage collector statuses to mimic an academic compiler container.

---

## 🛠️ How to Compile & Run the Portal Locally

Make sure you have Node.js and npm installed on your system.

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
The server will boot and serve the application locally.

### 3. Build for Production
```bash
npm run build
```
This builds the production bundle optimized for high-speed client-side performance.

### 4. Check for Linters and Errors
```bash
npm run lint
```
Ensures all strict TypeScript typings, module configurations, and imports comply with standards.
