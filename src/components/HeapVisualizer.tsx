import React, { useState, useEffect } from 'react';
import { MaxHeap, HeapItem } from '../datastructures/Heap';
import { Student } from '../types';
import { Award, ArrowDownCircle, ArrowUpCircle, Plus, Info, Home } from 'lucide-react';

interface HeapVisualizerProps {
  studentsList: Student[];
}

export const HeapVisualizer: React.FC<HeapVisualizerProps> = ({ studentsList }) => {
  const [heap, setHeap] = useState<MaxHeap<Student>>(new MaxHeap());
  const [heapArray, setHeapArray] = useState<HeapItem<Student>[]>([]);
  const [newStudentRoll, setNewStudentRoll] = useState('');
  const [customName, setCustomName] = useState('');
  const [customCgpa, setCustomCgpa] = useState('9.0');
  const [customNeed, setCustomNeed] = useState('8');
  const [allocTrace, setAllocTrace] = useState<string[]>([]);
  const [allocatedStudents, setAllocatedStudents] = useState<Student[]>([]);

  // Initialize heap with 6 sample students on load
  useEffect(() => {
    const initialHeap = new MaxHeap<Student>();
    const samples = studentsList.slice(0, 7);
    
    samples.forEach(student => {
      // Priority Score = CGPA * 10 + FinancialNeed * 5
      const priority = Math.round(student.cgpa * 10 + student.financialNeed * 5);
      initialHeap.insert(student, priority);
    });

    setHeap(initialHeap);
    setHeapArray(initialHeap.getHeapArray());
  }, [studentsList]);

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    let targetStudent: Student;

    if (newStudentRoll === 'CUSTOM') {
      if (!customName.trim()) return;
      targetStudent = {
        rollNumber: 'CST' + Math.floor(Math.random() * 1000),
        name: customName.trim(),
        cgpa: parseFloat(customCgpa) || 8.0,
        financialNeed: parseInt(customNeed) || 5,
        marks: 85,
        department: 'CS',
        email: 'custom@edu.org',
        enrolledCourses: []
      };
    } else {
      const match = studentsList.find(s => s.rollNumber === newStudentRoll);
      if (!match) return;
      
      // Check if already in heap
      const exists = heapArray.some(item => item.element.rollNumber === match.rollNumber);
      if (exists) {
        alert('This student is already queued in the hostel allocation list!');
        return;
      }
      targetStudent = match;
    }

    const priority = Math.round(targetStudent.cgpa * 10 + targetStudent.financialNeed * 5);
    
    heap.insert(targetStudent, priority);
    setHeapArray(heap.getHeapArray());
    setAllocTrace(prev => [
      `[INSERT] Queued ${targetStudent.name} (Roll: ${targetStudent.rollNumber}) with Priority ${priority}`,
      ...prev
    ]);

    // Reset Form
    setCustomName('');
  };

  const handleExtractMax = () => {
    if (heap.isEmpty()) return;

    const maxStudent = heap.peekMax();
    const extracted = heap.extractMax();
    setHeapArray(heap.getHeapArray());

    if (extracted) {
      setAllocatedStudents(prev => [extracted, ...prev]);
      const score = Math.round(extracted.cgpa * 10 + extracted.financialNeed * 5);
      setAllocTrace(prev => [
        `[ALLOCATE SUCCESS] Allocated Hostel Room to: ${extracted.name} (Roll: ${extracted.rollNumber}) | Priority Score: ${score}`,
        ...prev
      ]);
    }
  };

  const clearQueue = () => {
    heap.clear();
    setHeapArray([]);
    setAllocatedStudents([]);
    setAllocTrace(['Queue cleared.']);
  };

  // Helper to render tree nodes by layers
  const renderTreeLayout = () => {
    if (heapArray.length === 0) {
      return (
        <div className="text-slate-400 font-mono text-center py-16">
          Heap is currently empty. Queue some student requests.
        </div>
      );
    }

    // Helper to partition array indexes into tree rows:
    // Row 0: index 0 (1 node)
    // Row 1: indexes 1, 2 (2 nodes)
    // Row 2: indexes 3, 4, 5, 6 (4 nodes)
    // Row 3: indexes 7, 8, 9, 10, 11, 12, 13, 14 (8 nodes)
    const rows: number[][] = [[0], [1, 2], [3, 4, 5, 6], [7, 8, 9, 10, 11, 12, 13, 14]];

    return (
      <div className="space-y-6 flex flex-col items-center">
        {rows.map((rowIdxs, rowIndex) => {
          // Check if row has any elements inside the heap
          const activeNodes = rowIdxs.filter(idx => idx < heapArray.length);
          if (activeNodes.length === 0) return null;

          return (
            <div key={rowIndex} className="flex flex-col items-center w-full">
              {/* Row Grid */}
              <div className="flex justify-around items-center w-full max-w-2xl px-4 gap-2">
                {rowIdxs.map((idx) => {
                  if (idx >= heapArray.length) {
                    return (
                      <div key={`empty-${idx}`} className="w-16 md:w-20 h-16 opacity-0" />
                    );
                  }

                  const item = heapArray[idx];
                  const isRoot = idx === 0;

                  return (
                    <div
                      key={`node-${idx}`}
                      className={`w-20 md:w-24 p-2 rounded-xl border text-center relative transition-all duration-300 shadow-xs ${
                        isRoot
                          ? 'bg-amber-500 border-amber-400 text-white font-bold ring-2 ring-amber-300 ring-offset-2 ring-offset-slate-900'
                          : 'bg-slate-800 border-slate-700 text-white'
                      }`}
                    >
                      {/* Array Index Badge */}
                      <span className="absolute -top-2 -left-1 bg-slate-950 border border-slate-700 text-slate-400 text-[8px] px-1.5 py-0.5 rounded-full font-mono">
                        i={idx}
                      </span>

                      {/* Priority Score badge */}
                      <span className="absolute -top-2 -right-1 bg-indigo-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                        P:{item.priority}
                      </span>

                      <div className="text-[10px] font-semibold truncate mt-1">
                        {item.element.name.split(' ')[0]}
                      </div>
                      <div className="text-[8px] text-slate-400 font-mono mt-0.5">
                        CGPA: {item.element.cgpa}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Connector lines spacer */}
              {rowIndex < 3 && rowIdxs.some(idx => 2 * idx + 1 < heapArray.length) && (
                <div className="h-4 w-full flex justify-center">
                  <div className="w-px bg-slate-700 h-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="heap-playground-container">
      {/* Heap Controls & Allocation Queue */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs">
          <h4 className="font-semibold text-slate-800 text-sm mb-3 uppercase tracking-wider">Priority-based Room Allocation</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Hostel rooms are limited. We compute allocation priority based on a composite score representing academic merit and economic need:
          </p>
          <div className="mt-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100 text-[11px] font-mono text-indigo-800 leading-normal">
            <strong>Formula:</strong> <br />
            <code>Priority = (CGPA * 10) + (NeedScore * 5)</code>
            <p className="mt-1.5 text-[10px] text-slate-500">
              Allocating room extracts the Max-Heap root in <strong>O(log N)</strong> time, bubbling children up automatically.
            </p>
          </div>
        </div>

        {/* Trigger Allocation & Form */}
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs">
          <h4 className="font-semibold text-slate-800 text-sm mb-4 uppercase tracking-wider">Hostel Allocation Manager</h4>
          <div className="space-y-3">
            <button
              onClick={handleExtractMax}
              disabled={heapArray.length === 0}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold rounded-lg text-xs py-2.5 transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Home size={14} /> Allocate Next Room (Extract Max)
            </button>

            <form onSubmit={handleInsert} className="border-t border-slate-100 pt-4 space-y-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Queue Student for Room</label>
              
              <select
                value={newStudentRoll}
                onChange={(e) => setNewStudentRoll(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 focus:border-indigo-500 focus:bg-white cursor-pointer"
              >
                <option value="">-- Choose Registered Student --</option>
                <option value="CUSTOM">-- Create Custom Request --</option>
                {studentsList.map(s => (
                  <option key={s.rollNumber} value={s.rollNumber}>{s.name} ({s.rollNumber})</option>
                ))}
              </select>

              {newStudentRoll === 'CUSTOM' && (
                <div className="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-100 animate-fade-in">
                  <input
                    type="text"
                    required
                    placeholder="Enter Student Name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded px-2.5 py-1.5 focus:border-indigo-500"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500">CGPA</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={customCgpa}
                        onChange={(e) => setCustomCgpa(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-200 rounded px-2 py-1 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-slate-500">Need Score (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={customNeed}
                        onChange={(e) => setCustomNeed(e.target.value)}
                        className="w-full text-xs bg-white border border-slate-200 rounded px-2 py-1 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!newStudentRoll}
                className="w-full bg-slate-800 hover:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 text-white font-medium rounded-lg text-xs py-2 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add to Priority Queue
              </button>
            </form>

            <button
              onClick={clearQueue}
              className="w-full border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs py-1.5 transition-colors cursor-pointer"
            >
              Clear Heap Queue
            </button>
          </div>
        </div>

        {/* Trace logs */}
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs font-mono">
          <h4 className="font-semibold text-slate-800 text-xs mb-3 uppercase tracking-wider font-sans">Operation Log</h4>
          <div className="max-h-[140px] overflow-y-auto space-y-1 pr-1 text-[10px] leading-relaxed">
            {allocTrace.length === 0 ? (
              <p className="text-slate-400 text-center py-2">No operations logged yet.</p>
            ) : (
              allocTrace.map((log, idx) => (
                <div key={idx} className="border-b border-slate-50 py-1 text-slate-600 truncate" title={log}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Heap Visualization Tree Map */}
      <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-150 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-slate-800 text-base">Max-Heap Binary Tree Allocation Structure</h3>
          <p className="text-xs text-slate-500 mb-6">Visual tree representation of elements. Element at i=0 holds the maximum priority in RAM.</p>
        </div>

        {/* Tree Container (Slate-950 Cosmic Board) */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-6 min-h-[350px] shadow-inner flex items-center justify-center">
          {renderTreeLayout()}
        </div>

        {/* Flattened Array View */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wider font-mono">
            Flattened Memory Array Representation (Indices in RAM)
          </h4>
          {heapArray.length > 0 ? (
            <div className="flex gap-1.5 overflow-x-auto pb-2 pr-2">
              {heapArray.map((item, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-150 rounded-lg p-2 text-center font-mono shrink-0 min-w-[70px]">
                  <span className="block text-[8px] font-bold text-indigo-600 leading-none">i={idx}</span>
                  <span className="block text-[11px] font-bold text-slate-800 mt-1">{item.element.rollNumber}</span>
                  <span className="block text-[9px] text-slate-500 font-semibold mt-0.5">P:{item.priority}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 text-center py-2">Memory empty</p>
          )}
        </div>

        {/* Allocated Students history */}
        <div className="mt-5 border-t border-slate-100 pt-4">
          <h4 className="text-xs font-semibold text-emerald-800 mb-2.5 flex items-center gap-1">
            <Award size={14} className="text-emerald-500 animate-pulse" /> Successful Hostel Room Allocations ({allocatedStudents.length})
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-2 pr-2">
            {allocatedStudents.length === 0 ? (
              <p className="text-xs text-slate-400 py-1">No rooms allocated yet.</p>
            ) : (
              allocatedStudents.map((stud, idx) => (
                <div key={idx} className="bg-emerald-50 border border-emerald-100/50 rounded-lg px-3 py-1.5 text-xs font-medium text-emerald-950 font-sans shrink-0">
                  <span className="block font-bold">{stud.name}</span>
                  <span className="block text-[10px] text-emerald-600 font-mono mt-0.5">Roll: {stud.rollNumber} | CGPA: {stud.cgpa}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
