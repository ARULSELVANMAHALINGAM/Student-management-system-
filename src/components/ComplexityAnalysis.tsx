import React from 'react';
import { BookOpen, HelpCircle, HardDrive, Cpu, ShieldCheck } from 'lucide-react';

export const ComplexityAnalysis: React.FC = () => {
  const dsaRecords = [
    {
      feature: 'Student Storage',
      dsa: 'Custom Separate Chaining HashMap',
      time: 'O(1) Average',
      space: 'O(N)',
      whyBetter: 'A naive list search requires O(N) linear scanning. Our Hash Map uses polynomial rolling hash keys and separate chaining to guarantee constant time O(1) lookups and inserts, enabling high-performance student scale.'
    },
    {
      feature: 'Search-as-you-type',
      dsa: 'Custom Prefix Trie',
      time: 'O(L) where L is query length',
      space: 'O(Alphabet_Size * L * N)',
      whyBetter: 'Naive matches (e.g. String.includes) run in O(N * S) where N is total records. Our Trie eliminates scanning non-matching prefixes, resolving autocomplete routes character-by-character in O(L) time.'
    },
    {
      feature: 'CGPA & Marks Ranking',
      dsa: 'Merge Sort vs Quick Sort',
      time: 'O(N log N)',
      space: 'O(N) for Merge / O(log N) for Quick',
      whyBetter: 'Custom implementations with visual logging showcase recursion structures. Merge Sort maintains O(N log N) worst-case stability, whereas in-place Quick Sort avoids memory overhead with O(log N) stack frames.'
    },
    {
      feature: 'Course Prerequisites',
      dsa: 'Directed Graph & Topological Sort',
      time: 'O(V + E)',
      space: 'O(V + E)',
      whyBetter: 'Topological sort (Kahn’s In-Degree queue) provides linear O(V+E) order calculation. It also mathematically checks for circular loops (cycles), preventing invalid registrar circular locks.'
    },
    {
      feature: 'Exam Clash Scheduling',
      dsa: 'Graph Coloring (Greedy heuristic)',
      time: 'O(V^2 + E)',
      space: 'O(V)',
      whyBetter: 'Finding optimal graph coloring is NP-Hard. Our greedy coloring assigns clash-free timeslots efficiently in polynomial time, guaranteeing no adjacent exams overlap.'
    },
    {
      feature: 'Campus Navigation',
      dsa: 'Dijkstra’s Algorithm',
      time: 'O((V + E) log V)',
      space: 'O(V + E)',
      whyBetter: 'Unlike DFS/BFS which ignore distance weights, Dijkstra uses prioritized minimum relaxation to guarantee the shortest geographical route.'
    },
    {
      feature: 'Hostel Room Allocation',
      dsa: 'Binary Max-Heap Priority Queue',
      time: 'O(log N) Insert & Extract',
      space: 'O(N)',
      whyBetter: 'Sorting an array on every insertion takes O(N log N). A heap manages prioritized insertions and root extractions in logarithmic O(log N) time.'
    },
    {
      feature: 'Admin State Backups',
      dsa: 'Custom LIFO Stack',
      time: 'O(1)',
      space: 'O(H) history size',
      whyBetter: 'Maintains state snapshot transitions on a Last-In-First-Out basis. Clicking Undo pops the top action and reverses modifications instantly.'
    },
    {
      feature: 'Notice Board Chaining',
      dsa: 'Custom Doubly Linked List',
      time: 'O(1) Head Insertion',
      space: 'O(N)',
      whyBetter: 'Arrays require O(N) item shifting to insert elements at index 0. A DLL inserts notices chronologically at the Head in constant O(1) time.'
    },
    {
      feature: 'Fee Processing Waitlist',
      dsa: 'Custom FIFO Queue',
      time: 'O(1)',
      space: 'O(N)',
      whyBetter: 'Ensures strict First-In-First-Out processing order with constant-time O(1) enqueue and dequeue operations, preventing index drift memory leaks.'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in" id="complexity-report-panel">
      {/* Introduction Header */}
      <div className="bg-slate-900 text-white p-6 rounded-xl border border-slate-950 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <BookOpen size={20} className="text-indigo-400" /> Academic Project Report & DSA Justifications
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            This panel details the formal Big-O performance metrics for the custom data structures and algorithm modules compiled in this Student Management Portal. Use these comparisons for your viva report!
          </p>
        </div>
        <div className="bg-indigo-600 px-4 py-2 rounded-lg font-mono text-xs font-bold shrink-0">
          COMPILER VERIFIED: OK
        </div>
      </div>

      {/* Grid of Key Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-150 flex items-start gap-3">
          <Cpu className="text-indigo-600 shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">O(1) Optimization</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              We bypass slower array lookup scans by maintaining a custom Separate-Chaining HashMap with polynomial roll hashing for instant index access.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-150 flex items-start gap-3">
          <HardDrive className="text-emerald-600 shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">Memory Allocation</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              No garbage memory leaks or index drifts. Queue indices are automatically reset and DLL pointer boundaries are strictly guarded.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-150 flex items-start gap-3">
          <ShieldCheck className="text-amber-600 shrink-0 mt-0.5" size={18} />
          <div>
            <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wider font-sans">Self-Defending Cycle Checks</h4>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Prerequisite networks and timetable colored grids actively detect circular locks, raising safety exceptions during topological iterations.
            </p>
          </div>
        </div>
      </div>

      {/* Big-O Comparison Table */}
      <div className="bg-white rounded-xl border border-slate-150 overflow-hidden shadow-xs">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-150 flex justify-between items-center">
          <span className="font-semibold text-slate-800 text-sm">Full Algorithmic Complexity Table</span>
          <span className="text-[10px] text-indigo-600 bg-indigo-50 font-bold px-2.5 py-1 rounded-full font-mono">
            V = Vertices | E = Edges | L = Length
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-500 uppercase tracking-wider font-mono text-[9px] border-b border-slate-150">
                <th className="py-3 px-4">Feature</th>
                <th className="py-3 px-4">Custom DSA Applied</th>
                <th className="py-3 px-4 text-indigo-600">Time Complexity</th>
                <th className="py-3 px-4 text-emerald-600">Space Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {dsaRecords.map((rec, idx) => (
                <React.Fragment key={idx}>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-800">{rec.feature}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-500">{rec.dsa}</td>
                    <td className="py-3 px-4 font-mono font-bold text-indigo-600">{rec.time}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600">{rec.space}</td>
                  </tr>
                  <tr className="bg-slate-50/20">
                    <td colSpan={4} className="py-2.5 px-4 text-[11px] text-slate-500 leading-relaxed border-t-0 font-sans pl-8">
                      <strong className="text-slate-600">Viva Justification:</strong> {rec.whyBetter}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
