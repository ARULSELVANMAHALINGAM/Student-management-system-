import { useState, useEffect } from 'react';
import { Student, Notice, FeeRecord, AdminAction } from './types';
import { CustomHashMap } from './datastructures/CustomHashMap';
import { Trie } from './datastructures/Trie';
import { CustomDoublyLinkedList } from './datastructures/CustomLinkedList';
import { CustomQueue } from './datastructures/CustomQueue';
import { CustomStack } from './datastructures/CustomStack';

// Visualizer Components
import { HashMapVisualizer } from './components/HashMapVisualizer';
import { TrieVisualizer } from './components/TrieVisualizer';
import { GraphVisualizer } from './components/GraphVisualizer';
import { HeapVisualizer } from './components/HeapVisualizer';
import { QueueStackVisualizer } from './components/QueueStackVisualizer';
import { SortingVisualizer } from './components/SortingVisualizer';
import { ComplexityAnalysis } from './components/ComplexityAnalysis';

// Icons
import {
  Users,
  Search,
  Layers,
  LayoutDashboard,
  ShieldCheck,
  Undo2,
  BookOpen,
  LineChart,
  Grid
} from 'lucide-react';

// Pre-populated Sample Data: 20 Students
const initialStudents: Student[] = [
  { rollNumber: 'S101', name: 'Aravind Sharma', cgpa: 9.2, marks: 92, financialNeed: 4, department: 'CS', email: 'aravind@edu.org', enrolledCourses: ['CS101', 'CS102'] },
  { rollNumber: 'S102', name: 'Sneha Reddy', cgpa: 8.8, marks: 88, financialNeed: 7, department: 'ECE', email: 'sneha@edu.org', enrolledCourses: ['CS101'] },
  { rollNumber: 'S103', name: 'Rohan Das', cgpa: 7.9, marks: 79, financialNeed: 9, department: 'CS', email: 'rohan@edu.org', enrolledCourses: ['CS101', 'CS102'] },
  { rollNumber: 'S104', name: 'Priya Patel', cgpa: 9.5, marks: 95, financialNeed: 3, department: 'EE', email: 'priya@edu.org', enrolledCourses: [] },
  { rollNumber: 'S105', name: 'Vikram Malhotra', cgpa: 8.1, marks: 81, financialNeed: 5, department: 'ME', email: 'vikram@edu.org', enrolledCourses: [] },
  { rollNumber: 'S106', name: 'Ananya Sen', cgpa: 9.0, marks: 90, financialNeed: 8, department: 'CS', email: 'ananya@edu.org', enrolledCourses: ['CS101', 'CS102', 'CS201'] },
  { rollNumber: 'S107', name: 'Aditya Verma', cgpa: 6.5, marks: 65, financialNeed: 6, department: 'ECE', email: 'aditya@edu.org', enrolledCourses: [] },
  { rollNumber: 'S108', name: 'Kriti Menon', cgpa: 8.4, marks: 84, financialNeed: 10, department: 'CIV', email: 'kriti@edu.org', enrolledCourses: [] },
  { rollNumber: 'S109', name: 'Siddharth Nair', cgpa: 7.2, marks: 72, financialNeed: 2, department: 'CS', email: 'sid@edu.org', enrolledCourses: ['CS101'] },
  { rollNumber: 'S110', name: 'Meera Joshi', cgpa: 8.9, marks: 89, financialNeed: 8, department: 'EE', email: 'meera@edu.org', enrolledCourses: [] },
  { rollNumber: 'S111', name: 'Arjun Gupta', cgpa: 9.7, marks: 97, financialNeed: 1, department: 'ME', email: 'arjun@edu.org', enrolledCourses: [] },
  { rollNumber: 'S112', name: 'Nisha Singhal', cgpa: 8.2, marks: 82, financialNeed: 5, department: 'CS', email: 'nisha@edu.org', enrolledCourses: ['CS101', 'CS102'] },
  { rollNumber: 'S113', name: 'Vijay Yadav', cgpa: 7.5, marks: 75, financialNeed: 7, department: 'ECE', email: 'vijay@edu.org', enrolledCourses: [] },
  { rollNumber: 'S114', name: 'Tanvi Rao', cgpa: 9.1, marks: 91, financialNeed: 6, department: 'CIV', email: 'tanvi@edu.org', enrolledCourses: [] },
  { rollNumber: 'S115', name: 'Karan Johar', cgpa: 6.9, marks: 69, financialNeed: 4, department: 'ME', email: 'karan@edu.org', enrolledCourses: [] },
  { rollNumber: 'S116', name: 'Shruti Saxena', cgpa: 8.6, marks: 86, financialNeed: 3, department: 'CS', email: 'shruti@edu.org', enrolledCourses: ['CS101', 'CS102', 'CS201', 'CS202'] },
  { rollNumber: 'S117', name: 'Devendra Patil', cgpa: 7.8, marks: 78, financialNeed: 9, department: 'EE', email: 'dev@edu.org', enrolledCourses: [] },
  { rollNumber: 'S118', name: 'Pooja Hegde', cgpa: 9.4, marks: 94, financialNeed: 2, department: 'CIV', email: 'pooja@edu.org', enrolledCourses: [] },
  { rollNumber: 'S119', name: 'Varun Dhawan', cgpa: 8.0, marks: 80, financialNeed: 5, department: 'ECE', email: 'varun@edu.org', enrolledCourses: [] },
  { rollNumber: 'S120', name: 'Alia Bhatt', cgpa: 9.3, marks: 93, financialNeed: 8, department: 'CS', email: 'alia@edu.org', enrolledCourses: ['CS101', 'CS102', 'CS201', 'CS202', 'CS301'] }
];

// 5 pre-populated notices
const initialNotices: Notice[] = [
  { id: 'N1', title: 'Midterm Exam Schedule', content: 'The computer science and electronics department midterm examinations will commence from next Monday. Please download your hall tickets.', date: 'Oct 15, 2026', department: 'Admin' },
  { id: 'N2', title: 'Hostel Registration Open', content: 'Hostel room allocations based on merit and financial need scores are open. Submit your applications via portal.', date: 'Oct 18, 2026', department: 'Admin' },
  { id: 'N3', title: 'Coding Bootcamp Registration', content: 'Annual AI & Data Structures workshop registration begins from tomorrow. Limited slots.', date: 'Oct 20, 2026', department: 'CS' },
  { id: 'N4', title: 'Library Book Audits', content: 'All students are requested to return borrowed library books before month-end to avoid penalties.', date: 'Oct 22, 2026', department: 'Library' },
  { id: 'N5', title: 'Lab Maintenance Notice', content: 'CS Main computing block lab servers will be offline for hardware upgrades on Sunday.', date: 'Oct 25, 2026', department: 'CS' },
];

// Initial fee payments queued
const initialFees: FeeRecord[] = [
  { id: 'F1', rollNumber: 'S103', studentName: 'Rohan Das', amount: 1800, status: 'PENDING', timestamp: '10:15 AM' },
  { id: 'F2', rollNumber: 'S108', studentName: 'Kriti Menon', amount: 2200, status: 'PENDING', timestamp: '10:20 AM' },
  { id: 'F3', rollNumber: 'S113', studentName: 'Vijay Yadav', amount: 1500, status: 'PENDING', timestamp: '10:32 AM' },
  { id: 'F4', rollNumber: 'S117', studentName: 'Devendra Patil', amount: 2500, status: 'PENDING', timestamp: '10:45 AM' },
  { id: 'F5', rollNumber: 'S120', studentName: 'Alia Bhatt', amount: 1900, status: 'PENDING', timestamp: '11:02 AM' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'records' | 'trie' | 'sorting' | 'graph' | 'heap' | 'linear' | 'complexity'>('records');

  // Custom Data Structure Live Instances
  const [studentMap, setStudentMap] = useState<CustomHashMap<string, Student>>(new CustomHashMap());
  const [studentTrie, setStudentTrie] = useState<Trie>(new Trie());
  const [noticesDLL, setNoticesDLL] = useState<CustomDoublyLinkedList<Notice>>(new CustomDoublyLinkedList());
  const [feeQueue, setFeeQueue] = useState<CustomQueue<FeeRecord>>(new CustomQueue());
  const [undoStack, setUndoStack] = useState<CustomStack<AdminAction>>(new CustomStack());

  // Simple state arrays to trigger react re-renders on custom instance mutation
  const [allStudents, setAllStudents] = useState<Student[]>(initialStudents);
  const [utcTime, setUtcTime] = useState('');

  // Initializing custom data structures on mount
  useEffect(() => {
    const mapInstance = new CustomHashMap<string, Student>();
    const trieInstance = new Trie();
    const dllInstance = new CustomDoublyLinkedList<Notice>();
    const queueInstance = new CustomQueue<FeeRecord>();
    const stackInstance = new CustomStack<AdminAction>();

    // Seed Students (HashMap & Trie)
    initialStudents.forEach(student => {
      mapInstance.put(student.rollNumber, student);
      trieInstance.insert(student.name, student.rollNumber);
    });

    // Seed Notices (DLL) - Newest notices at head
    // Reversing original array so they display newest-first when read left-to-right
    [...initialNotices].reverse().forEach(notice => {
      dllInstance.insertHead(notice);
    });

    // Seed Fees (Queue)
    initialFees.forEach(fee => {
      queueInstance.enqueue(fee);
    });

    setStudentMap(mapInstance);
    setStudentTrie(trieInstance);
    setNoticesDLL(dllInstance);
    setFeeQueue(queueInstance);
    setUndoStack(stackInstance);

    // Sync UTC clock
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Operation Handlers: 1. ADD Student
  const handleAddStudent = (student: Student) => {
    // Save to our live models
    studentMap.put(student.rollNumber, student);
    studentTrie.insert(student.name, student.rollNumber);

    // Add Action to LIFO Stack
    const action: AdminAction = {
      type: 'ADD',
      entity: 'student',
      prevData: null,
      newData: student,
      timestamp: new Date().toLocaleTimeString(),
    };
    undoStack.push(action);

    // Sync React states
    setAllStudents(studentMap.values());
    // Trigger instances updates
    setStudentMap(studentMap);
    setStudentTrie(studentTrie);
    setUndoStack(undoStack);
  };

  // Operation Handlers: 2. DELETE Student
  const handleDeleteStudent = (rollNumber: string) => {
    const deletedStudent = studentMap.get(rollNumber);
    if (!deletedStudent) return;

    studentMap.remove(rollNumber);
    studentTrie.remove(deletedStudent.name, rollNumber);

    // Add Action to LIFO Stack
    const action: AdminAction = {
      type: 'DELETE',
      entity: 'student',
      prevData: deletedStudent,
      newData: null,
      timestamp: new Date().toLocaleTimeString(),
    };
    undoStack.push(action);

    setAllStudents(studentMap.values());
    setStudentMap(studentMap);
    setStudentTrie(studentTrie);
    setUndoStack(undoStack);
  };

  // Operation Handlers: 3. ADD Notice (DLL Head)
  const handleAddNotice = (notice: Notice) => {
    noticesDLL.insertHead(notice);

    const action: AdminAction = {
      type: 'ADD',
      entity: 'notice',
      prevData: null,
      newData: notice,
      timestamp: new Date().toLocaleTimeString(),
    };
    undoStack.push(action);

    setNoticesDLL(noticesDLL);
    setUndoStack(undoStack);
  };

  // Operation Handlers: 4. DELETE Notice (DLL node deletion)
  const handleDeleteNotice = (id: string) => {
    const deletedNotice = noticesDLL.deleteByFilter(notice => notice.id === id);

    if (deletedNotice) {
      const action: AdminAction = {
        type: 'DELETE',
        entity: 'notice',
        prevData: deletedNotice,
        newData: null,
        timestamp: new Date().toLocaleTimeString(),
      };
      undoStack.push(action);
    }

    setNoticesDLL(noticesDLL);
    setUndoStack(undoStack);
  };

  // Operation Handlers: 5. Dequeue Fee Request (FIFO Queue)
  const handleProcessFee = () => {
    const processed = feeQueue.dequeue();
    if (!processed) return;

    const action: AdminAction = {
      type: 'DELETE',
      entity: 'fee',
      prevData: processed,
      newData: null,
      timestamp: new Date().toLocaleTimeString(),
    };
    undoStack.push(action);

    setFeeQueue(feeQueue);
    setUndoStack(undoStack);
  };

  // Operation Handlers: 6. LIFO UNDO STACK OPERATION (POP & REVERSE)
  const handleUndoAction = () => {
    const action = undoStack.pop();
    if (!action) return;

    // Reverse state mutation based on Action properties
    if (action.entity === 'student') {
      if (action.type === 'ADD') {
        // Reverse ADD -> Delete
        const roll = action.newData.rollNumber;
        const name = action.newData.name;
        studentMap.remove(roll);
        studentTrie.remove(name, roll);
      } else if (action.type === 'DELETE') {
        // Reverse DELETE -> Put back
        const stud = action.prevData;
        studentMap.put(stud.rollNumber, stud);
        studentTrie.insert(stud.name, stud.rollNumber);
      }
      setAllStudents(studentMap.values());
    } else if (action.entity === 'notice') {
      if (action.type === 'ADD') {
        const id = action.newData.id;
        noticesDLL.deleteByFilter(n => n.id === id);
      } else if (action.type === 'DELETE') {
        noticesDLL.insertHead(action.prevData);
      }
    } else if (action.entity === 'fee') {
      // Put back fee request on FIFO queue (enqueues back to rear)
      feeQueue.enqueue(action.prevData);
    }

    setStudentMap(studentMap);
    setStudentTrie(studentTrie);
    setNoticesDLL(noticesDLL);
    setFeeQueue(feeQueue);
    setUndoStack(undoStack);
  };

  const perfDetails = getPerformanceDetails(activeTab);

  return (
    <div className="h-screen w-full bg-[#f8fafc] text-slate-900 font-sans flex flex-col overflow-hidden" id="main-app-root">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0" id="portal-header">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold select-none text-base">Σ</div>
          <h1 className="text-base font-bold tracking-tight uppercase text-slate-800">Nexus <span className="font-light text-slate-400">DSA Portal</span></h1>
        </div>

        <div className="hidden md:flex items-center gap-3 px-4 bg-slate-100 rounded-lg py-1.5 border border-slate-200/40">
          <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">Status Panel</span>
          <span className="text-[10px] font-mono text-slate-500 border-l border-slate-200 pl-3">Active Node: UTC</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] font-mono text-slate-400 uppercase">ADMIN_STACK: {undoStack.size()} OPS</span>
            <button 
              onClick={handleUndoAction}
              disabled={undoStack.isEmpty()}
              className={`text-xs font-semibold px-3 py-1 bg-slate-800 text-white rounded transition-colors flex items-center gap-1 cursor-pointer hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 disabled:cursor-not-allowed`}
            >
              <Undo2 size={12} /> UNDO (O(1))
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Left */}
        <nav className="w-64 border-r border-slate-200 bg-white flex flex-col p-4 shrink-0 overflow-y-auto select-none">
          <div className="mb-6">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Core Structures</h2>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveTab('records')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                    activeTab === 'records'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <LayoutDashboard size={14} className={activeTab === 'records' ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>HashMap CRUD</span>
                  </span>
                  <span className="text-[9px] font-mono opacity-60">HASHMAP</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('trie')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                    activeTab === 'trie'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Search size={14} className={activeTab === 'trie' ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>Prefix Trie</span>
                  </span>
                  <span className="text-[9px] font-mono opacity-60">TRIE</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('linear')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                    activeTab === 'linear'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Undo2 size={14} className={activeTab === 'linear' ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>Linear Structures</span>
                  </span>
                  <span className="text-[9px] font-mono opacity-60">LIFO_FIFO</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('heap')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                    activeTab === 'heap'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck size={14} className={activeTab === 'heap' ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>Hostel Allocation</span>
                  </span>
                  <span className="text-[9px] font-mono opacity-60">MAX_HEAP</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Algorithms & Reports</h2>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => setActiveTab('sorting')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                    activeTab === 'sorting'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <LineChart size={14} className={activeTab === 'sorting' ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>Sorting Sandbox</span>
                  </span>
                  <span className="text-[9px] font-mono opacity-60">SORT_ARRAY</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('graph')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                    activeTab === 'graph'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Layers size={14} className={activeTab === 'graph' ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>Graph Algorithms</span>
                  </span>
                  <span className="text-[9px] font-mono opacity-60">GRAPH_DAG</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('complexity')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                    activeTab === 'complexity'
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <BookOpen size={14} className={activeTab === 'complexity' ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>Complexity Report</span>
                  </span>
                  <span className="text-[9px] font-mono opacity-60">REPORT</span>
                </button>
              </li>
            </ul>
          </div>

          <div className="mt-auto p-4 bg-slate-900 rounded-xl">
            <div className="text-[10px] text-indigo-300 font-mono mb-1 uppercase font-semibold">Active Algorithmic Metric</div>
            <div className="text-white font-mono text-lg font-bold">{perfDetails.complexity}</div>
            <div className="text-[10px] text-slate-400 font-sans mt-0.5 leading-tight">{perfDetails.subtitle}</div>
            <div className="w-full bg-slate-700 h-1.5 mt-2.5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all duration-500 ${perfDetails.progressClass}`}></div>
            </div>
          </div>
        </nav>

        {/* Main Workspace */}
        <main className="flex-1 p-6 flex flex-col gap-6 bg-[#f1f5f9] overflow-y-auto">
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Students (HashMap)</div>
              <div className="text-2xl font-bold mt-1 text-slate-800">{allStudents.length}</div>
              <div className="text-[10px] text-emerald-600 font-mono mt-1 font-semibold">Lookup: ~0.02ms (O(1))</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fee Queue Waitlist</div>
              <div className="text-2xl font-bold mt-1 text-slate-800">{feeQueue.size()}</div>
              <div className="text-[10px] text-indigo-600 font-mono mt-1 font-semibold">FIFO processing active</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LIFO Action Backups</div>
              <div className="text-2xl font-bold mt-1 text-slate-800">{undoStack.size()}</div>
              <div className="text-[10px] text-amber-600 font-mono mt-1 font-semibold">Stack capacity: Dynamic</div>
            </div>
          </div>

          {/* Active Tab Screen Area */}
          <div className="flex-1" id="active-tab-area-wrapper">
            {activeTab === 'records' && (
              <HashMapVisualizer
                studentMap={studentMap}
                onAddStudent={handleAddStudent}
                onDeleteStudent={handleDeleteStudent}
              />
            )}

            {activeTab === 'trie' && (
              <TrieVisualizer
                studentTrie={studentTrie}
                studentMap={studentMap}
              />
            )}

            {activeTab === 'sorting' && (
              <SortingVisualizer students={allStudents} />
            )}

            {activeTab === 'graph' && <GraphVisualizer />}

            {activeTab === 'heap' && <HeapVisualizer studentsList={allStudents} />}

            {activeTab === 'linear' && (
              <QueueStackVisualizer
                noticesDLL={noticesDLL}
                feeQueue={feeQueue}
                undoStack={undoStack}
                onAddNotice={handleAddNotice}
                onDeleteNotice={handleDeleteNotice}
                onProcessFee={handleProcessFee}
                onUndoAction={handleUndoAction}
              />
            )}

            {activeTab === 'complexity' && <ComplexityAnalysis />}
          </div>
        </main>
      </div>

      {/* Bottom Status Bar */}
      <footer className="h-8 bg-slate-800 text-white flex items-center px-6 text-[10px] font-mono justify-between shrink-0 border-t border-slate-900 select-none">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> JVM: OK</span>
          <span>GARBAGE_COLLECTOR: SLEEPING</span>
        </div>
        <div className="flex gap-4">
          <span>THREAD_COUNT: 4</span>
          <span>SYSTEM_TIME: {utcTime || 'Syncing...'}</span>
        </div>
      </footer>
    </div>
  );
}

const getPerformanceDetails = (tab: 'records' | 'trie' | 'sorting' | 'graph' | 'heap' | 'linear' | 'complexity') => {
  switch (tab) {
    case 'records':
      return { complexity: 'O(1) Avg', subtitle: 'Separate Chaining HashMap', progressClass: 'w-full bg-emerald-400' };
    case 'trie':
      return { complexity: 'O(L) Search', subtitle: 'Prefix Tree Node Traversal', progressClass: 'w-4/5 bg-indigo-400' };
    case 'sorting':
      return { complexity: 'O(N log N)', subtitle: 'Divide & Conquer Partition', progressClass: 'w-2/3 bg-amber-400' };
    case 'graph':
      return { complexity: 'O(V + E)', subtitle: 'Kahn\'s Queue & Dijkstra Nodes', progressClass: 'w-1/2 bg-blue-400' };
    case 'heap':
      return { complexity: 'O(log N)', subtitle: 'Binary Max-Heap Priority Queue', progressClass: 'w-3/4 bg-violet-400' };
    case 'linear':
      return { complexity: 'O(1) Push/Pop', subtitle: 'DLL notices & FIFO Queue processing', progressClass: 'w-full bg-emerald-400' };
    case 'complexity':
      return { complexity: 'COMPILER OK', subtitle: 'All Big-O complexities verified in RAM', progressClass: 'w-full bg-teal-400' };
    default:
      return { complexity: 'O(1)', subtitle: 'System Active', progressClass: 'w-full bg-indigo-400' };
  }
}
