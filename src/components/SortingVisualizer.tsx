import React, { useState, useEffect } from 'react';
import { StudentSortItem, traceQuickSort, traceMergeSort, SortStep } from '../algorithms/Sorting';
import { Student } from '../types';
import { Play, Pause, SkipForward, RotateCcw, AlertCircle, BarChart3 } from 'lucide-react';

interface SortingVisualizerProps {
  students: Student[];
}

export const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ students }) => {
  const [sortKey, setSortKey] = useState<'cgpa' | 'marks'>('cgpa');
  const [sortAlgorithm, setSortAlgorithm] = useState<'quick' | 'merge'>('quick');
  const [ascending, setAscending] = useState(false);

  // Animation player states
  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(300); // ms per step

  // Benchmark stats
  const [quickStepsCount, setQuickStepsCount] = useState(0);
  const [mergeStepsCount, setMergeStepsCount] = useState(0);

  // Parse students list to simple sort items
  const sortItems: StudentSortItem[] = students.map(s => ({
    rollNumber: s.rollNumber,
    name: s.name,
    cgpa: s.cgpa,
    marks: s.marks
  }));

  // Generate trace on key/order/algo change
  useEffect(() => {
    generateTrace();
  }, [sortKey, sortAlgorithm, ascending, students]);

  // Handle playing state timer
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps, speed]);

  const generateTrace = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
    
    // Benchmark both silently first
    const qTrace = traceQuickSort(sortItems, sortKey, ascending);
    const mTrace = traceMergeSort(sortItems, sortKey, ascending);
    setQuickStepsCount(qTrace.length);
    setMergeStepsCount(mTrace.length);

    // Load active trace
    if (sortAlgorithm === 'quick') {
      setSteps(qTrace);
    } else {
      setSteps(mTrace);
    }
  };

  const handlePlayToggle = () => {
    if (currentStepIdx >= steps.length - 1) {
      setCurrentStepIdx(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  const currentStep = steps[currentStepIdx] || {
    array: sortItems,
    comparingIndices: [],
    swappingIndices: [],
    pivotIndex: -1,
    phaseDescription: 'Loading sort data...'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="sorting-visualizer-container">
      {/* Control Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs">
          <h4 className="font-semibold text-slate-800 text-sm mb-3 uppercase tracking-wider">Custom Sorter Dashboard</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Professors evaluate custom sorting algorithms based on structural partitioning and auxiliary memory constraints. Play animated iterations of partition lines.
          </p>
        </div>

        {/* Algorithm Settings */}
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs">
          <h4 className="font-semibold text-slate-800 text-sm mb-4 uppercase tracking-wider">Algorithm Tuning</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Sort Metric</label>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setSortKey('cgpa')}
                  className={`flex-1 text-xs py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                    sortKey === 'cgpa'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  CGPA Metric
                </button>
                <button
                  onClick={() => setSortKey('marks')}
                  className={`flex-1 text-xs py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                    sortKey === 'marks'
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Marks (%) Metric
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Sorting Logic</label>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setSortAlgorithm('quick')}
                  className={`flex-1 text-xs py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                    sortAlgorithm === 'quick'
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Quick Sort
                </button>
                <button
                  onClick={() => setSortAlgorithm('merge')}
                  className={`flex-1 text-xs py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                    sortAlgorithm === 'merge'
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Merge Sort
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Direction</label>
              <select
                value={ascending ? 'asc' : 'desc'}
                onChange={(e) => setAscending(e.target.value === 'asc')}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 mt-1 focus:border-indigo-500 cursor-pointer"
              >
                <option value="desc">Descending (Highest First)</option>
                <option value="asc">Ascending (Lowest First)</option>
              </select>
            </div>

            {/* Speeds */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Speed (Interval)</label>
              <select
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 mt-1 focus:border-indigo-500 cursor-pointer"
              >
                <option value="500">Slow (500ms)</option>
                <option value="300">Medium (300ms)</option>
                <option value="100">Fast (100ms)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Real Empirical Benchmark */}
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs">
          <h4 className="font-semibold text-slate-800 text-sm mb-3 uppercase tracking-wide flex items-center gap-1.5">
            <BarChart3 size={15} className="text-indigo-600" /> Empirical Benchmark
          </h4>
          <p className="text-[11px] text-slate-400 mb-3 leading-normal">
            Total operation steps (comparisons, moves, swaps) taken to sort the current dataset:
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-indigo-50 border border-indigo-100/50">
              <span className="font-semibold text-slate-700 font-mono">Quick Sort Steps</span>
              <span className="font-mono font-bold text-indigo-700">{quickStepsCount}</span>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-amber-50 border border-amber-100/50">
              <span className="font-semibold text-slate-700 font-mono">Merge Sort Steps</span>
              <span className="font-mono font-bold text-amber-700">{mergeStepsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visual Playback Canvas */}
      <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-150 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 text-base">Linear Sorting Array Snapshots</h3>
            <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
              Step {currentStepIdx + 1} / {steps.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">Vertical bar rendering of values. Highlights show active computational variables in RAM.</p>
        </div>

        {/* Tracing Sub-Step Alert */}
        <div className="bg-slate-900 text-slate-200 p-3 rounded-lg flex items-center gap-2 border border-slate-950 font-mono text-[11px] mb-4">
          <AlertCircle size={14} className="text-indigo-400 shrink-0" />
          <span className="truncate leading-none">{currentStep.phaseDescription}</span>
        </div>

        {/* Main Canvas Grid */}
        <div className="bg-slate-950 border border-slate-900 rounded-xl p-6 min-h-[300px] flex items-end justify-center gap-1.5 md:gap-3.5 shadow-inner">
          {currentStep.array.map((student, idx) => {
            const val = sortKey === 'cgpa' ? student.cgpa : student.marks;
            const maxVal = sortKey === 'cgpa' ? 10 : 100;
            // Height proportional to percentage of max value
            const heightPercent = (val / maxVal) * 100;

            const isComparing = currentStep.comparingIndices.includes(idx);
            const isSwapping = currentStep.swappingIndices.includes(idx);
            const isPivot = currentStep.pivotIndex === idx;

            let barColor = 'bg-slate-700';
            let borderColor = 'border-slate-650';

            if (isPivot) {
              barColor = 'bg-red-500';
              borderColor = 'border-red-400';
            } else if (isSwapping) {
              barColor = 'bg-emerald-500';
              borderColor = 'border-emerald-400';
            } else if (isComparing) {
              barColor = 'bg-indigo-600 animate-pulse';
              borderColor = 'border-indigo-400';
            }

            return (
              <div key={student.rollNumber} className="flex-1 flex flex-col items-center">
                {/* Visual score text on top of bar */}
                <span className={`text-[9px] font-mono font-bold mb-1.5 ${isPivot ? 'text-red-400' : isSwapping ? 'text-emerald-400' : isComparing ? 'text-indigo-400' : 'text-slate-500'}`}>
                  {val}
                </span>

                {/* Vertical Bar */}
                <div
                  className={`w-full rounded-t-md border transition-all duration-300 ${barColor} ${borderColor}`}
                  style={{ height: `${Math.max(heightPercent * 1.8, 12)}px` }}
                  title={`${student.name}\nRoll: ${student.rollNumber}\n${sortKey.toUpperCase()}: ${val}`}
                />

                {/* Underneath labels */}
                <span className="text-[8px] font-mono mt-2 text-slate-600 rotate-45 origin-left whitespace-nowrap select-none">
                  {student.rollNumber}
                </span>
              </div>
            );
          })}
        </div>

        {/* Player controls */}
        <div className="mt-8 border-t border-slate-100 pt-4 flex gap-3 justify-center">
          <button
            onClick={handleReset}
            className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-colors cursor-pointer"
            title="Reset Sorting"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={handlePlayToggle}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            {isPlaying ? (
              <>
                <Pause size={14} /> Pause
              </>
            ) : (
              <>
                <Play size={14} /> Play Sorting
              </>
            )}
          </button>
          <button
            onClick={handleStepForward}
            disabled={isPlaying || currentStepIdx >= steps.length - 1}
            className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 disabled:opacity-30 rounded-lg text-slate-600 transition-colors cursor-pointer"
            title="Step Forward"
          >
            <SkipForward size={15} />
          </button>
        </div>

        {/* Legend */}
        <div className="mt-4 flex gap-4 text-xs justify-center flex-wrap border-t border-slate-50 pt-3">
          <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-slate-700"></span><span className="text-slate-500">Unsorted</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-indigo-600"></span><span className="text-slate-500 font-medium">Comparing</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-emerald-500"></span><span className="text-slate-500 font-medium">Swapping</span></div>
          <div className="flex items-center gap-1.5"><span className="w-3.5 h-3.5 rounded bg-red-500"></span><span className="text-slate-500 font-medium">Pivot Target</span></div>
        </div>
      </div>
    </div>
  );
};
