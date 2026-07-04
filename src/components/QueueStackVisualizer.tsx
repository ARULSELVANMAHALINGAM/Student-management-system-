import React, { useState } from 'react';
import { CustomDoublyLinkedList } from '../datastructures/CustomLinkedList';
import { CustomQueue } from '../datastructures/CustomQueue';
import { CustomStack } from '../datastructures/CustomStack';
import { Notice, FeeRecord, AdminAction } from '../types';
import { ArrowLeft, ArrowRight, CornerDownLeft, Plus, Play, Trash2, RotateCcw, ShieldAlert, Check } from 'lucide-react';

interface QueueStackVisualizerProps {
  noticesDLL: CustomDoublyLinkedList<Notice>;
  feeQueue: CustomQueue<FeeRecord>;
  undoStack: CustomStack<AdminAction>;
  onAddNotice: (notice: Notice) => void;
  onDeleteNotice: (id: string) => void;
  onProcessFee: () => void;
  onUndoAction: () => void;
}

export const QueueStackVisualizer: React.FC<QueueStackVisualizerProps> = ({
  noticesDLL,
  feeQueue,
  undoStack,
  onAddNotice,
  onDeleteNotice,
  onProcessFee,
  onUndoAction,
}) => {
  // Notice DLL Visual traversal state
  const [activeNoticeIdx, setActiveNoticeIdx] = useState(0);

  // New Notice form
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeDept, setNoticeDept] = useState('CS');

  // New Fee Record form
  const [feeRoll, setFeeRoll] = useState('S101');
  const [feeAmount, setFeeAmount] = useState('1500');

  const noticesArray = noticesDLL.toArray();
  const feeRecordsArray = feeQueue.toArray();
  const undoStackArray = undoStack.toArray();

  const handleAddNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    const notice: Notice = {
      id: 'N' + Math.floor(Math.random() * 10000),
      title: noticeTitle.trim(),
      content: noticeContent.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      department: noticeDept,
    };

    onAddNotice(notice);
    setNoticeTitle('');
    setNoticeContent('');
    setActiveNoticeIdx(0); // Reset visual selection to newly inserted head
  };

  const handleUndo = () => {
    if (undoStack.isEmpty()) return;
    onUndoAction();
  };

  return (
    <div className="space-y-6" id="linear-playground-master">
      {/* 1. DOUBLY LINKED LIST NOTICE BOARD */}
      <div className="bg-white p-6 rounded-xl border border-slate-150 shadow-xs" id="notice-dll-playground">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-semibold text-slate-800 text-base">Doubly Linked List Notice Board</h3>
            <p className="text-xs text-slate-500 mt-1">
              New notices insert at the Head in <strong>O(1)</strong>. Nodes link to both <code>.prev</code> and <code>.next</code> allowing full bidirectional traversal.
            </p>
          </div>
          <span className="bg-amber-150 border border-amber-200 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full font-mono">
            Size: {noticesDLL.size()} nodes
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Add Notice Panel */}
          <div className="lg:col-span-4 p-4 bg-slate-50 rounded-xl border border-slate-150">
            <h4 className="font-bold text-slate-700 text-xs mb-3 uppercase tracking-wider">Publish Notice (DLL Insert)</h4>
            <form onSubmit={handleAddNoticeSubmit} className="space-y-3">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Exam Schedule Update"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded p-2 mt-0.5 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase">Department</label>
                <select
                  value={noticeDept}
                  onChange={(e) => setNoticeDept(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded p-1.5 mt-0.5 focus:border-indigo-500 cursor-pointer"
                >
                  <option value="CS">Computer Science</option>
                  <option value="ECE">Electronics</option>
                  <option value="Admin">Administration</option>
                  <option value="Library">Central Library</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-500 uppercase">Announcement Content</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Please note all computer science semester exams..."
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  className="w-full text-xs bg-white border border-slate-200 rounded p-2 mt-0.5 focus:border-indigo-500 focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg text-xs py-2 transition-colors flex items-center justify-center gap-1 cursor-pointer mt-1"
              >
                <Plus size={14} /> Insert at List Head
              </button>
            </form>
          </div>

          {/* Interactive Traverser */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {noticesArray.length === 0 ? (
              <div className="bg-slate-50 rounded-xl border border-slate-150 p-12 text-center text-slate-400 font-mono text-xs">
                No active announcements on the notice board.
              </div>
            ) : (
              <div className="space-y-6">
                {/* Pointer Node Flow */}
                <div className="flex gap-4 items-center overflow-x-auto py-3 px-1">
                  {noticesArray.map((not, idx) => {
                    const isSelected = activeNoticeIdx === idx;
                    const isHead = idx === 0;
                    const isTail = idx === noticesArray.length - 1;

                    return (
                      <React.Fragment key={not.id}>
                        {idx > 0 && (
                          <div className="flex flex-col items-center shrink-0">
                            <span className="text-[10px] text-indigo-400 font-bold font-mono">.next ➔</span>
                            <span className="text-[10px] text-amber-500 font-bold font-mono">← .prev</span>
                          </div>
                        )}

                        <div
                          onClick={() => setActiveNoticeIdx(idx)}
                          className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer text-center shrink-0 min-w-[130px] ${
                            isSelected
                              ? 'bg-slate-900 border-indigo-500 text-white shadow-md'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex justify-between text-[8px] font-mono font-bold leading-none mb-1 text-slate-400">
                            <span>{isHead ? 'HEAD' : ''}</span>
                            <span>{isTail ? 'TAIL' : ''}</span>
                          </div>
                          <div className="text-xs font-bold truncate max-w-[110px]">{not.title}</div>
                          <span className="text-[9px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full mt-2 inline-block">
                            {not.department}
                          </span>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Node Pointer Inspector detail card */}
                {noticesArray[activeNoticeIdx] && (
                  <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                          Index {activeNoticeIdx}
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm">
                          {noticesArray[activeNoticeIdx].title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 max-w-xl">
                        {noticesArray[activeNoticeIdx].content}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        Date published: {noticesArray[activeNoticeIdx].date} | ID: {noticesArray[activeNoticeIdx].id}
                      </span>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setActiveNoticeIdx(prev => Math.max(0, prev - 1))}
                        disabled={activeNoticeIdx === 0}
                        className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700 disabled:opacity-30 hover:bg-slate-50 cursor-pointer"
                        title="Traverse Prev Pointer"
                      >
                        <ArrowLeft size={14} />
                      </button>
                      <button
                        onClick={() => setActiveNoticeIdx(prev => Math.min(noticesArray.length - 1, prev + 1))}
                        disabled={activeNoticeIdx === noticesArray.length - 1}
                        className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700 disabled:opacity-30 hover:bg-slate-50 cursor-pointer"
                        title="Traverse Next Pointer"
                      >
                        <ArrowRight size={14} />
                      </button>
                      <button
                        onClick={() => {
                          onDeleteNotice(noticesArray[activeNoticeIdx].id);
                          setActiveNoticeIdx(0);
                        }}
                        className="p-2 bg-white rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 cursor-pointer"
                        title="Delete announcement node"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. FIFO FEE PAYMENT QUEUE */}
      <div className="bg-white p-6 rounded-xl border border-slate-150 shadow-xs" id="fee-fifo-playground">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-slate-800 text-base">FIFO Fee Processing Queue</h3>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              First-In-First-Out (FIFO) queue for student fee requests. Operations execute in constant <strong>O(1)</strong> time complexity.
            </p>
          </div>
          <span className="bg-emerald-150 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full font-mono">
            Pending: {feeQueue.size()} students
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-4 p-4 bg-slate-50 rounded-xl border border-slate-150 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Process Request</h4>
              <button
                onClick={onProcessFee}
                disabled={feeRecordsArray.length === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold rounded-lg text-xs py-2.5 transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Play size={14} /> Process Payment (Dequeue Front)
              </button>

              <div className="text-[11px] text-slate-500 leading-normal bg-amber-50 p-3 rounded-lg border border-amber-100/50 mt-2 font-mono">
                When you click process, the node at the <strong>FRONT</strong> is deleted, and indices shift. Prevent index drift.
              </div>
            </div>
          </div>

          {/* Queue Visualization */}
          <div className="lg:col-span-8 flex flex-col justify-center">
            {feeRecordsArray.length === 0 ? (
              <div className="bg-slate-50 border border-slate-150 p-8 rounded-xl text-center text-slate-400 font-mono text-xs">
                Fee queue is currently empty. All student payments are reconciled!
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-2 items-center overflow-x-auto py-4">
                  {feeRecordsArray.map((record, idx) => {
                    const isFront = idx === 0;
                    const isRear = idx === feeRecordsArray.length - 1;

                    return (
                      <div
                        key={record.id}
                        className={`p-3.5 rounded-xl border text-center shrink-0 min-w-[130px] font-mono ${
                          isFront
                            ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-2 ring-emerald-300 ring-offset-2 ring-offset-white'
                            : isRear
                            ? 'bg-slate-800 text-white border-slate-700'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex justify-between text-[8px] font-bold leading-none mb-1 text-slate-400">
                          <span>{isFront ? 'FRONT' : ''}</span>
                          <span>{isRear ? 'REAR' : ''}</span>
                        </div>
                        <div className="text-xs font-bold truncate max-w-[110px]">{record.studentName}</div>
                        <div className="text-[10px] text-slate-300 font-semibold mt-1.5">
                          ${record.amount}
                        </div>
                        <span className="text-[8px] text-slate-400 block mt-1">Roll: {record.rollNumber}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center text-[10px] text-slate-400 font-bold tracking-wider uppercase font-mono">
                  Queue flow direction: REAR (Enqueue) ➔ ➔ FRONT (Dequeue)
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. LIFO ADMIN ACTION STACK */}
      <div className="bg-white p-6 rounded-xl border border-slate-150 shadow-xs" id="admin-undo-stack">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-semibold text-slate-800 text-base">LIFO Administrative Undo Stack</h3>
            <p className="text-xs text-slate-500 mt-1">
              Tracks actions (ADD student, DELETE notice, UPDATE data). Popping the stack triggers a database <strong>Undo</strong> reversion.
            </p>
          </div>
          <button
            onClick={handleUndo}
            disabled={undoStackArray.length === 0}
            className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold rounded-lg text-xs px-3.5 py-1.5 transition-all flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={12} /> Undo Last Action (Pop)
          </button>
        </div>

        {undoStackArray.length === 0 ? (
          <div className="bg-slate-50 border border-slate-150 p-8 rounded-xl text-center text-slate-400 font-mono text-xs">
            Admin history stack is currently empty. No actions to undo.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {undoStackArray.map((action, idx) => {
              const isTop = idx === 0;
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border relative font-mono transition-all ${
                    isTop
                      ? 'bg-slate-950 text-white border-indigo-500 shadow-md ring-1 ring-indigo-400'
                      : 'bg-slate-50 border-slate-150 text-slate-600'
                  }`}
                >
                  {isTop && (
                    <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full tracking-wider">
                      TOP (POP ROOT)
                    </span>
                  )}
                  <span className="text-[8px] font-bold block text-indigo-400 uppercase leading-none">
                    {action.type}
                  </span>
                  <div className="text-xs font-bold text-slate-300 mt-1.5 capitalize">
                    {action.entity} Record
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 truncate">
                    {action.newData?.name || action.newData?.title || action.rollNumber || 'Detail matches'}
                  </p>
                  <span className="text-[8px] text-slate-500 block mt-2">
                    {action.timestamp}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
