/**
 * Custom Sorting Algorithm Implementations (Merge Sort and Quick Sort).
 * Includes normal versions and "visualization-enabled" versions
 * that capture state snapshots to animate comparisons/swaps.
 */

export interface StudentSortItem {
  rollNumber: string;
  name: string;
  cgpa: number;
  marks: number;
}

export interface SortStep {
  array: StudentSortItem[];
  comparingIndices: number[]; // Indices of elements being compared
  swappingIndices: number[];  // Indices of elements being swapped
  pivotIndex: number;         // Pivot index (for Quick Sort)
  phaseDescription: string;    // Text explaining the current sub-step
}

/**
 * 1. Custom Quick Sort Implementation
 * Sorts students by CGPA (descending or ascending) or Marks.
 * Time Complexity: Best/Average O(N log N), Worst O(N^2)
 * Space Complexity: O(log N) stack frames
 */
export function customQuickSort(
  arr: StudentSortItem[],
  compareFn: (a: StudentSortItem, b: StudentSortItem) => number
): StudentSortItem[] {
  const result = [...arr];

  function quickSortHelper(low: number, high: number) {
    if (low < high) {
      const pIdx = partition(low, high);
      quickSortHelper(low, pIdx - 1);
      quickSortHelper(pIdx + 1, high);
    }
  }

  function partition(low: number, high: number): number {
    const pivot = result[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (compareFn(result[j], pivot) < 0) {
        i++;
        const temp = result[i];
        result[i] = result[j];
        result[j] = temp;
      }
    }
    const temp = result[i + 1];
    result[i + 1] = result[high];
    result[high] = temp;
    return i + 1;
  }

  quickSortHelper(0, result.length - 1);
  return result;
}

/**
 * 2. Custom Merge Sort Implementation
 * Time Complexity: Always O(N log N)
 * Space Complexity: O(N) auxiliary space
 */
export function customMergeSort(
  arr: StudentSortItem[],
  compareFn: (a: StudentSortItem, b: StudentSortItem) => number
): StudentSortItem[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = customMergeSort(arr.slice(0, mid), compareFn);
  const right = customMergeSort(arr.slice(mid), compareFn);

  return merge(left, right, compareFn);
}

function merge(
  left: StudentSortItem[],
  right: StudentSortItem[],
  compareFn: (a: StudentSortItem, b: StudentSortItem) => number
): StudentSortItem[] {
  const result: StudentSortItem[] = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (compareFn(left[i], right[j]) <= 0) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  while (i < left.length) result.push(left[i++]);
  while (j < right.length) result.push(right[j++]);

  return result;
}


/**
 * Capture-enabled Quick Sort to generate snapshots for visual animations
 */
export function traceQuickSort(
  arr: StudentSortItem[],
  key: 'cgpa' | 'marks',
  ascending = false
): SortStep[] {
  const steps: SortStep[] = [];
  const array = [...arr];

  // Helper comparison
  const compare = (a: StudentSortItem, b: StudentSortItem) => {
    if (key === 'cgpa') {
      return ascending ? a.cgpa - b.cgpa : b.cgpa - a.cgpa;
    } else {
      return ascending ? a.marks - b.marks : b.marks - a.marks;
    }
  };

  function captureStep(comp: number[], swap: number[], pivot: number, desc: string) {
    steps.push({
      array: [...array],
      comparingIndices: comp,
      swappingIndices: swap,
      pivotIndex: pivot,
      phaseDescription: desc
    });
  }

  function runSort(low: number, high: number) {
    if (low < high) {
      const pIdx = runPartition(low, high);
      runSort(low, pIdx - 1);
      runSort(pIdx + 1, high);
    }
  }

  function runPartition(low: number, high: number): number {
    const pivot = array[high];
    captureStep([], [], high, `Selected pivot ${pivot.name} (${key}: ${key === 'cgpa' ? pivot.cgpa : pivot.marks})`);
    let i = low - 1;

    for (let j = low; j < high; j++) {
      captureStep([j, high], [], high, `Comparing element ${array[j].name} with pivot ${pivot.name}`);
      if (compare(array[j], pivot) < 0) {
        i++;
        captureStep([j, high], [i, j], high, `Swapping elements ${array[i].name} and ${array[j].name}`);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
    
    const nextIdx = i + 1;
    captureStep([high], [nextIdx, high], high, `Placing pivot ${pivot.name} in its final sorted position`);
    const temp = array[nextIdx];
    array[nextIdx] = array[high];
    array[high] = temp;
    return nextIdx;
  }

  captureStep([], [], -1, 'Initial Array State');
  runSort(0, array.length - 1);
  captureStep([], [], -1, 'Sorting Complete!');
  return steps;
}


/**
 * Capture-enabled Merge Sort to generate snapshots for visual animations
 */
export function traceMergeSort(
  arr: StudentSortItem[],
  key: 'cgpa' | 'marks',
  ascending = false
): SortStep[] {
  const steps: SortStep[] = [];
  let array = [...arr];

  const compare = (a: StudentSortItem, b: StudentSortItem) => {
    if (key === 'cgpa') {
      return ascending ? a.cgpa - b.cgpa : b.cgpa - a.cgpa;
    } else {
      return ascending ? a.marks - b.marks : b.marks - a.marks;
    }
  };

  function captureStep(currArr: StudentSortItem[], comp: number[], swap: number[], desc: string) {
    steps.push({
      array: [...currArr],
      comparingIndices: comp,
      swappingIndices: swap,
      pivotIndex: -1,
      phaseDescription: desc
    });
  }

  function mergeSortHelper(start: number, end: number): StudentSortItem[] {
    if (start >= end) {
      return [array[start]];
    }

    const mid = Math.floor((start + end) / 2);
    
    captureStep(array, [], [], `Splitting subarray [${start} to ${end}] at index ${mid} (${array[mid].name})`);
    
    const left = mergeSortHelper(start, mid);
    const right = mergeSortHelper(mid + 1, end);

    // Merge in place within global array tracking
    const merged: StudentSortItem[] = [];
    let lIdx = 0;
    let rIdx = 0;

    while (lIdx < left.length && rIdx < right.length) {
      const globalLIdx = start + lIdx;
      const globalRIdx = mid + 1 + rIdx;
      
      captureStep(array, [globalLIdx, globalRIdx], [], `Comparing left side ${left[lIdx].name} with right side ${right[rIdx].name}`);
      
      if (compare(left[lIdx], right[rIdx]) <= 0) {
        merged.push(left[lIdx++]);
      } else {
        merged.push(right[rIdx++]);
      }
    }

    while (lIdx < left.length) merged.push(left[lIdx++]);
    while (rIdx < right.length) merged.push(right[rIdx++]);

    // Copy merged values back to the global array
    for (let k = 0; k < merged.length; k++) {
      const targetIdx = start + k;
      array[targetIdx] = merged[k];
      captureStep(array, [], [targetIdx], `Merging element ${merged[k].name} back to index ${targetIdx}`);
    }

    return merged;
  }

  captureStep(array, [], [], 'Initial Array State');
  mergeSortHelper(0, array.length - 1);
  captureStep(array, [], [], 'Sorting Complete!');
  return steps;
}
