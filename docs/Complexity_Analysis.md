# Complexity Analysis & DSA Justifications Report
**Project Name**: DSA-based Student Management Portal  
**Academic Session**: 2026-2027  

This document outlines the detailed Big-O Time and Space Complexity profiles for all custom Data Structures and Algorithms implemented within this application. It provides concrete justifications contrasting each custom structure against its naive built-in alternatives.

---

## 1. Summary Matrix Table

| Feature Block | Applied Custom Data Structure / Algorithm | Time Complexity (Average) | Space Complexity |
| :--- | :--- | :--- | :--- |
| **Student Record CRUD** | Chaining Hash Map (Polynomial Roll Hash) | $O(1)$ | $O(N)$ |
| **Search-as-you-type Lookup** | Prefix Trie (Prefix Node Indices) | $O(L)$ (L = prefix length) | $O(\Sigma \cdot L \cdot N)$ |
| **CGPA & Marks Sort** | Traceable Quick Sort / Merge Sort | $O(N \log N)$ | $O(N)$ (Merge), $O(\log N)$ (Quick) |
| **Course Prerequisites Map** | Adjacency List Graph + Topological Sort | $O(V + E)$ | $O(V + E)$ |
| **Exam Slots Scheduler** | Greedy Graph Coloring (NP-Hard Heuristic) | $O(V^2 + E)$ | $O(V)$ |
| **Campus Geographical Nav** | Dijkstra's Single-Source Shortest Path | $O((V + E) \log V)$ | $O(V + E)$ |
| **Hostel Allocation** | Binary Max-Heap Priority Queue | $O(\log N)$ | $O(N)$ |
| **Notice Board Feed** | Chronological Doubly Linked List (DLL) | $O(1)$ (Head Insertion) | $O(N)$ |
| **Fee Processing Queue** | FIFO Queue with anti-index drift resets | $O(1)$ Enqueue/Dequeue | $O(N)$ |
| **Admin State Backups** | Undo History Stack (LIFO) | $O(1)$ Push/Pop | $O(H)$ (H = History size) |

---

## 2. In-Depth Algorithmic Justifications

### A. Student Record Storage: Custom HashMap vs. Naive Array List
* **Naive Alternative**: Appending students to a standard list and searching sequentially.
* **Naive Complexity**: $O(N)$ linear scanning lookup.
* ** HashMap Justification**: By creating a custom Hash Table with **Separate Chaining (using linked-list nodes)** and a **Polynomial Rolling Hashing function**, we distribute student roll numbers evenly across buckets. This guarantees $O(1)$ constant time lookup, update, and deletion on average. When the load factor exceeds 0.75, capacity doubles automatically and keys rehash dynamically.

### B. Autocomplete Name Lookup: Prefix Trie vs. String Filtering
* **Naive Alternative**: Iterating through all student objects and executing `.filter(student => student.name.startsWith(prefix))`.
* **Naive Complexity**: $O(N \cdot M)$ where N is total records and M is comparison length.
* **Trie Justification**: Our Trie maps name prefixes letter-by-letter. In addition, we optimize by storing matching student roll numbers directly at each prefix node. This reduces search-as-you-type suggestions to a strict $O(L)$ constant (where L is prefix length), completely independent of the dataset size $N$.

### C. Priority Hostel Allocation: Max-Heap vs. Continuously Sorting List
* **Naive Alternative**: Inserting requests into a linear array and calling `sort()` after every single new request.
* **Naive Complexity**: $O(N \log N)$ per insertion.
* **Heap Justification**: A binary Max-Heap structures nodes in a balanced tree format where the maximum priority element is always stored at index `i=0`. Adding a new request (`heapify-up`) or allocating a room to the highest priority student (`heapify-down`) takes strict $O(\log N)$ time, making it highly efficient for continuous queue streams.

### D. Course Enrollment: Topological Sort vs. DFS Check
* **Naive Alternative**: Brute-force checking of prerequisite arrays.
* **Topological Justification**: We construct a Directed Acyclic Graph (DAG) representing course hierarchies. Using **Kahn's Algorithm (In-Degree BFS Queue)**, we determine the correct academic path order in $O(V + E)$ time. Crucially, Kahn's algorithm detects circular cycles (e.g., Course A requiring Course B, and Course B requiring Course A) which are invalid prerequisite structures.

### E. Campus Route Navigation: Dijkstra's Algorithm vs. DFS
* **Naive Alternative**: Depth-First Search (DFS) pathfinding.
* **Dijkstra's Justification**: DFS finds *a* path but makes no guarantees about distance weight optimization. Dijkstra's Algorithm explores weighted undirected nodes by expanding the path with the minimum tentative distance. It ensures the mathematically shortest path is found between departments in $O((V + E) \log V)$ time.

---

## 3. Real-world Benchmarking Notice
In the interactive visual sandbox, you can trigger live comparative runs of **Quick Sort vs. Merge Sort** on the student database. This allows empirical tracing of computational operations (comparisons and swaps) showing how divide-and-conquer partitions behave in memory.
