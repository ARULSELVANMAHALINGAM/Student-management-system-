import React, { useState } from 'react';
import { CustomHashMap } from '../datastructures/CustomHashMap';
import { Student } from '../types';
import { Search, Plus, Trash2, HelpCircle, Code } from 'lucide-react';

interface HashMapVisualizerProps {
  studentMap: CustomHashMap<string, Student>;
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (rollNumber: string) => void;
}

export const HashMapVisualizer: React.FC<HashMapVisualizerProps> = ({
  studentMap,
  onAddStudent,
  onDeleteStudent,
}) => {
  const [searchRoll, setSearchRoll] = useState('');
  const [searchResult, setSearchResult] = useState<Student | null>(null);
  const [searched, setSearched] = useState(false);
  const [hashCalculationText, setHashCalculationText] = useState('');
  const [activeBucket, setActiveBucket] = useState<number | null>(null);

  // New Student Form State
  const [newRoll, setNewRoll] = useState('');
  const [newName, setNewName] = useState('');
  const [newCgpa, setNewCgpa] = useState('8.5');
  const [newMarks, setNewMarks] = useState('85');
  const [newDept, setNewDept] = useState('CS');
  const [newNeed, setNewNeed] = useState('5');
  const [newEmail, setNewEmail] = useState('');

  const [formError, setFormError] = useState('');

  const buckets = studentMap.getBucketsInfo();
  const capacity = studentMap.getCapacity();
  const size = studentMap.size();
  const loadFactor = (size / capacity).toFixed(2);

  const calculateHashTrace = (key: string) => {
    let hashVal = 0;
    const prime = 31;
    let trace = `Polynomial Rolling Hash Trace for "${key}":\n`;
    for (let i = 0; i < key.length; i++) {
      const prev = hashVal;
      hashVal = (hashVal * prime + key.charCodeAt(i)) % capacity;
      trace += `  Char '${key[i]}' (ASCII ${key.charCodeAt(i)}): (${prev} * ${prime} + ${key.charCodeAt(i)}) % ${capacity} = ${hashVal}\n`;
    }
    const finalIndex = Math.abs(hashVal);
    trace += `Final Bucket Index: ${finalIndex}`;
    setHashCalculationText(trace);
    return finalIndex;
  };

  const handleSearch = () => {
    if (!searchRoll.trim()) return;
    const student = studentMap.get(searchRoll.trim());
    setSearchResult(student);
    setSearched(true);
    const index = calculateHashTrace(searchRoll.trim());
    setActiveBucket(index);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newRoll.trim() || !newName.trim()) {
      setFormError('Roll Number and Name are required.');
      return;
    }

    if (studentMap.containsKey(newRoll.trim())) {
      setFormError(`Student with Roll Number ${newRoll.trim()} already exists!`);
      return;
    }

    const student: Student = {
      rollNumber: newRoll.trim(),
      name: newName.trim(),
      cgpa: parseFloat(newCgpa) || 0.0,
      marks: parseFloat(newMarks) || 0,
      financialNeed: parseInt(newNeed) || 5,
      department: newDept,
      email: newEmail.trim() || `${newName.toLowerCase().replace(/\s+/g, '')}@edu.org`,
      enrolledCourses: [],
    };

    onAddStudent(student);
    calculateHashTrace(student.rollNumber);
    
    // Reset Form
    setNewRoll('');
    setNewName('');
    setNewEmail('');
    setFormError('');
  };

  const handleDelete = (roll: string) => {
    onDeleteStudent(roll);
    if (searchRoll === roll) {
      setSearchResult(null);
      setSearched(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="hashmap-container">
      {/* Control Panel */}
      <div className="lg:col-span-4 space-y-6">
        {/* Statistics Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs" id="hashmap-stats">
          <h3 className="font-semibold text-slate-800 text-sm mb-4 uppercase tracking-wider">HashMap Overview</h3>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="block text-xs text-slate-400 font-medium">Size (N)</span>
              <span className="text-lg font-mono font-bold text-slate-700">{size}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="block text-xs text-slate-400 font-medium">Buckets (M)</span>
              <span className="text-lg font-mono font-bold text-slate-700">{capacity}</span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="block text-xs text-slate-400 font-medium">Load Factor</span>
              <span className={`text-lg font-mono font-bold ${parseFloat(loadFactor) >= 0.75 ? 'text-amber-600' : 'text-slate-700'}`}>{loadFactor}</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 leading-relaxed bg-amber-50 p-3 rounded-lg border border-amber-100/50">
            <strong>Rehash threshold:</strong> 0.75. When <code className="font-mono bg-amber-100 px-1 rounded">Size / Buckets &gt;= 0.75</code>, capacity doubles and all keys rehash to maintain average <strong>O(1)</strong> complexity.
          </div>
        </div>

        {/* Search & O(1) Lookup */}
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs" id="hashmap-search">
          <h3 className="font-semibold text-slate-800 text-sm mb-4 uppercase tracking-wider">O(1) Record Lookup</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Student Roll No (e.g. S101)"
              value={searchRoll}
              onChange={(e) => setSearchRoll(e.target.value)}
              className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 focus:bg-white font-mono"
            />
            <button
              onClick={handleSearch}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-2 text-sm transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Search size={16} /> Lookup
            </button>
          </div>

          {searched && (
            <div className="mt-4 border-t border-slate-100 pt-4">
              {searchResult ? (
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-semibold text-emerald-900">{searchResult.name}</h4>
                      <p className="text-xs text-emerald-700 font-mono">Roll: {searchResult.rollNumber} | CGPA: {searchResult.cgpa}</p>
                      <p className="text-[11px] text-emerald-600 mt-1">{searchResult.department} Dept | {searchResult.email}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(searchResult.rollNumber)}
                      className="text-rose-500 hover:bg-rose-100 p-1.5 rounded-md transition-colors"
                      title="Delete student"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-rose-50 border border-rose-100 text-rose-800 p-3 rounded-lg text-sm text-center">
                  Student Record Not Found. (Hash search complete).
                </div>
              )}
            </div>
          )}

          {hashCalculationText && (
            <div className="mt-4 bg-slate-900 p-3 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-850">
              <div className="flex items-center gap-1 text-indigo-400 font-semibold mb-1.5">
                <Code size={12} /> Hash Calculation Trace
              </div>
              <pre className="whitespace-pre-wrap leading-tight">{hashCalculationText}</pre>
            </div>
          )}
        </div>

        {/* Add Student Record Form */}
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs" id="hashmap-add">
          <h3 className="font-semibold text-slate-800 text-sm mb-4 uppercase tracking-wider">Add Student (O(1) Insert)</h3>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase">Roll Number</label>
                <input
                  type="text"
                  required
                  placeholder="S121"
                  value={newRoll}
                  onChange={(e) => setNewRoll(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 mt-0.5 focus:border-indigo-500 focus:bg-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 mt-0.5 focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase">CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={newCgpa}
                  onChange={(e) => setNewCgpa(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1.5 mt-0.5 focus:border-indigo-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase">Marks (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newMarks}
                  onChange={(e) => setNewMarks(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1.5 mt-0.5 focus:border-indigo-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase">Need (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newNeed}
                  onChange={(e) => setNewNeed(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1.5 mt-0.5 focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase">Department</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1.5 mt-0.5 focus:border-indigo-500 focus:bg-white"
                >
                  <option value="CS">Computer Science</option>
                  <option value="ECE">Electronics</option>
                  <option value="EE">Electrical</option>
                  <option value="ME">Mechanical</option>
                  <option value="CIV">Civil</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 uppercase">Email (Optional)</label>
                <input
                  type="email"
                  placeholder="custom@edu.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1.5 mt-0.5 focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            {formError && (
              <p className="text-[11px] text-rose-600 font-medium">{formError}</p>
            )}

            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg text-xs py-2 transition-colors flex items-center justify-center gap-1 cursor-pointer mt-2"
            >
              <Plus size={14} /> Insert to Hash Map
            </button>
          </form>
        </div>
      </div>

      {/* Hash Map Memory Layout Visualizer */}
      <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-150 shadow-xs">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-semibold text-slate-800 text-base">Separate Chaining Memory Visualization</h3>
            <p className="text-xs text-slate-500">Live RAM view showing key hashing buckets, collision chains, and next pointers</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full font-medium">
            <HelpCircle size={13} /> Click bucket to inspect details
          </div>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[550px] pr-2">
          {buckets.map((bucket) => {
            const isActive = activeBucket === bucket.index;
            const hasCollision = bucket.nodes.length > 1;

            return (
              <div
                key={bucket.index}
                onClick={() => setActiveBucket(isActive ? null : bucket.index)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50/55 border-indigo-400 ring-1 ring-indigo-400'
                    : hasCollision
                    ? 'bg-amber-50/20 border-amber-200 hover:bg-slate-50'
                    : 'bg-white border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Bucket Header */}
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 flex items-center justify-center text-xs font-mono font-bold rounded-md bg-slate-100 border border-slate-200 text-slate-600">
                      [{bucket.index}]
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      (Head: {bucket.nodes[0] ? `Node(${bucket.nodes[0]})` : 'null'})
                    </span>
                  </div>

                  {/* Chaining Chain Rendering */}
                  <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 whitespace-nowrap">
                    {bucket.nodes.length === 0 ? (
                      <span className="text-xs font-mono text-slate-300">null</span>
                    ) : (
                      bucket.nodes.map((key, nodeIdx) => {
                        const student = studentMap.get(key);
                        return (
                          <React.Fragment key={key}>
                            {nodeIdx > 0 && (
                              <span className="text-indigo-500 font-bold font-mono px-0.5">
                                →
                              </span>
                            )}
                            <div className="bg-slate-800 text-white border border-slate-750 rounded-md px-2.5 py-1 text-xs font-mono flex items-center gap-1.5 shadow-xs">
                              <span className="font-semibold text-indigo-300">{key}</span>
                              <span className="text-slate-400">|</span>
                              <span className="text-slate-300">{student?.name.split(' ')[0]}</span>
                              <span className="text-[10px] text-emerald-400">({student?.department})</span>
                            </div>
                          </React.Fragment>
                        );
                      })
                    )}
                    {bucket.nodes.length > 0 && (
                      <>
                        <span className="text-indigo-500 font-bold font-mono">→</span>
                        <span className="text-xs font-mono text-slate-300">null</span>
                      </>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1">
                    {hasCollision && (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Collision Resolved
                      </span>
                    )}
                    <span className="text-xs font-mono text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                      Nodes: {bucket.nodes.length}
                    </span>
                  </div>
                </div>

                {/* Expanded node details */}
                {isActive && bucket.nodes.length > 0 && (
                  <div className="mt-3 border-t border-indigo-100 pt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {bucket.nodes.map((key, nodeIdx) => {
                      const stud = studentMap.get(key);
                      if (!stud) return null;
                      return (
                        <div key={key} className="bg-white p-3 rounded-md border border-indigo-100 shadow-2xs relative">
                          <span className="absolute top-2 right-2 text-[9px] font-mono font-bold text-indigo-400">
                            Node {nodeIdx + 1}
                          </span>
                          <div className="text-xs font-semibold text-slate-800">{stud.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono mt-1">Roll: {stud.rollNumber}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">CGPA: {stud.cgpa} | Dept: {stud.department}</div>
                          <div className="text-[10px] text-indigo-500 font-mono mt-2 truncate">
                            Next → {bucket.nodes[nodeIdx + 1] ? `Node(${bucket.nodes[nodeIdx + 1]})` : 'null'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
