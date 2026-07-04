import React, { useState, useEffect } from 'react';
import { Trie, TrieNode } from '../datastructures/Trie';
import { CustomHashMap } from '../datastructures/CustomHashMap';
import { Student } from '../types';
import { Search, Info, HelpCircle } from 'lucide-react';

interface TrieVisualizerProps {
  studentTrie: Trie;
  studentMap: CustomHashMap<string, Student>;
}

export const TrieVisualizer: React.FC<TrieVisualizerProps> = ({
  studentTrie,
  studentMap,
}) => {
  const [searchPrefix, setSearchPrefix] = useState('');
  const [matchingRolls, setMatchingRolls] = useState<string[]>([]);
  const [visualTrieData, setVisualTrieData] = useState<any>(null);

  useEffect(() => {
    if (searchPrefix.trim().length > 0) {
      setMatchingRolls(studentTrie.searchPrefix(searchPrefix));
    } else {
      setMatchingRolls([]);
    }
  }, [searchPrefix, studentTrie]);

  useEffect(() => {
    // Regenerate visualization data
    setVisualTrieData(studentTrie.getVisualizationData(4));
  }, [studentTrie]);

  // Recursively render the Trie node hierarchy visually as compact blocks
  const renderTrieNodeVisual = (char: string, node: TrieNode, activePrefix: string, currentPath = ''): React.ReactNode => {
    const isRoot = char === 'Root';
    const thisChar = isRoot ? '' : char;
    const fullPath = currentPath + thisChar;
    
    const isPartofActiveQuery = 
      activePrefix && 
      (activePrefix.toLowerCase().startsWith(fullPath.toLowerCase()) || 
       fullPath.toLowerCase().startsWith(activePrefix.toLowerCase()));

    const isMatchExact = activePrefix && fullPath.toLowerCase() === activePrefix.toLowerCase();

    const childrenKeys = Object.keys(node.children);

    return (
      <div key={fullPath || 'root'} className="flex flex-col items-center">
        {/* Node Bubble */}
        <div 
          className={`flex flex-col items-center justify-center p-2 rounded-full border transition-all ${
            isRoot
              ? 'bg-slate-800 text-white border-slate-700 w-12 h-12'
              : isMatchExact
              ? 'bg-emerald-500 text-white border-emerald-400 w-11 h-11 shadow-md scale-105'
              : isPartofActiveQuery
              ? 'bg-indigo-600 text-white border-indigo-500 w-10 h-10 shadow-xs'
              : node.isEndOfWord
              ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 w-10 h-10'
              : 'bg-slate-50 text-slate-700 border-slate-250 hover:bg-slate-100 w-9 h-9'
          }`}
          title={`Path: "${fullPath}"\nisEndOfWord: ${node.isEndOfWord}\nStudent Count: ${node.rollNumbers.length}`}
        >
          <span className="text-xs font-mono font-bold leading-none">{char}</span>
          {node.isEndOfWord && !isMatchExact && !isPartofActiveQuery && (
            <span className="text-[7px] text-amber-500 font-bold leading-none mt-0.5">•</span>
          )}
        </div>

        {/* Pointer Lines & Children */}
        {childrenKeys.length > 0 && (
          <div className="flex flex-col items-center mt-2 w-full">
            {/* Splitter Line */}
            <div className="h-4 w-px bg-slate-300"></div>
            
            {/* Grid of child nodes */}
            <div className="flex gap-4 justify-center border-t border-slate-200 pt-2 w-full">
              {childrenKeys.slice(0, 5).map((childChar) => (
                renderTrieNodeVisual(
                  childChar,
                  node.children[childChar],
                  activePrefix,
                  fullPath
                )
              ))}
              {childrenKeys.length > 5 && (
                <div className="flex flex-col items-center justify-center text-[10px] text-slate-400 font-mono w-9 h-9 border border-dashed border-slate-200 rounded-full bg-slate-50 leading-none">
                  +{childrenKeys.length - 5}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="trie-container">
      {/* Search Input and Information */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs" id="trie-info">
          <h3 className="font-semibold text-slate-800 text-sm mb-3 uppercase tracking-wider">Autocomplete (Trie)</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            The Trie is a tree structure optimized for text searches. As you type, the Trie traverses down paths character-by-character in <strong>O(L)</strong> lookup time (where L is the prefix length).
          </p>
          <div className="mt-4 bg-indigo-50 border border-indigo-100 p-3 rounded-lg flex items-start gap-2.5">
            <Info size={14} className="text-indigo-600 shrink-0 mt-0.5" />
            <span className="text-[11px] text-indigo-800 leading-normal">
              <strong>Custom Optimization:</strong> Each node maintains a direct list of matching student IDs. This eliminates expensive subtree traversals, resulting in ultra-responsive autocomplete suggestions!
            </span>
          </div>
        </div>

        {/* Dynamic Autocomplete Playground */}
        <div className="bg-white p-5 rounded-xl border border-slate-150 shadow-xs" id="trie-search">
          <h3 className="font-semibold text-slate-800 text-sm mb-4 uppercase tracking-wider">Search-as-you-type</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Start typing student name..."
              value={searchPrefix}
              onChange={(e) => setSearchPrefix(e.target.value)}
              className="w-full text-sm bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 outline-none focus:border-indigo-500 focus:bg-white"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Matching Students</span>
              <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[9px]">{matchingRolls.length} Results</span>
            </div>

            {searchPrefix.trim().length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-150">
                Type above to trigger Trie lookup
              </p>
            ) : matchingRolls.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 rounded-lg border border-dashed border-slate-150">
                No matching names found in the prefix tree
              </p>
            ) : (
              <div className="max-h-[220px] overflow-y-auto space-y-1.5 pr-1">
                {matchingRolls.map((roll) => {
                  const student = studentMap.get(roll);
                  if (!student) return null;
                  return (
                    <div
                      key={roll}
                      className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-indigo-50/30 transition-colors flex justify-between items-center text-xs"
                    >
                      <div>
                        <span className="font-medium text-slate-800">{student.name}</span>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">Roll: {student.rollNumber} | CGPA: {student.cgpa}</div>
                      </div>
                      <span className="font-mono bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                        {student.department}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trie Branch Visualizer */}
      <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-slate-150 shadow-xs">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-semibold text-slate-800 text-base">Prefix Trie Branch Representation</h3>
            <p className="text-xs text-slate-500">Live view of nodes. Interactive highlight changes based on your search queries.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <HelpCircle size={13} /> End-of-word nodes have sub-bullets
          </div>
        </div>

        <div className="p-4 bg-slate-900 border border-slate-950 rounded-xl overflow-x-auto min-h-[400px] flex items-start justify-center pt-8 shadow-inner">
          {studentTrie && renderTrieNodeVisual('Root', studentTrie.getRoot(), searchPrefix)}
        </div>

        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-center text-xs">
          <div className="flex items-center gap-1.5 justify-center bg-slate-50 border border-slate-150 px-2.5 py-1.5 rounded-lg">
            <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-700"></span>
            <span className="text-slate-600 text-[11px] font-semibold">Trie Root</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center bg-slate-50 border border-slate-150 px-2.5 py-1.5 rounded-lg">
            <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
            <span className="text-slate-600 text-[11px] font-semibold">Active Path</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center bg-slate-50 border border-slate-150 px-2.5 py-1.5 rounded-lg">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-slate-600 text-[11px] font-semibold">Exact Search Hit</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center bg-slate-50 border border-slate-150 px-2.5 py-1.5 rounded-lg">
            <span className="w-3 h-3 rounded-full bg-amber-100 border border-amber-300"></span>
            <span className="text-slate-600 text-[11px] font-semibold">Valid Name Terminal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
