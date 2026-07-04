/**
 * Custom Binary Max-Heap implementation for a Priority Queue.
 * Elements with higher priority values are extracted first.
 * Used for Hostel Room Allocation based on student CGPA and financial need.
 * Insert: O(log N)
 * Extract Max: O(log N)
 * Peek: O(1)
 */

export interface HeapItem<T> {
  element: T;
  priority: number;
}

export class MaxHeap<T> {
  private heap: HeapItem<T>[];

  constructor() {
    this.heap = [];
  }

  private getParentIndex(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private getLeftChildIndex(i: number): number {
    return 2 * i + 1;
  }

  private getRightChildIndex(i: number): number {
    return 2 * i + 2;
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  /**
   * Inserts an element with a given priority score.
   * Time complexity: O(log N) due to heapifyUp.
   */
  public insert(element: T, priority: number): void {
    const item: HeapItem<T> = { element, priority };
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  /**
   * Extracts and returns the element with the maximum priority.
   * Time complexity: O(log N) due to heapifyDown.
   */
  public extractMax(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    const maxElement = this.heap[0].element;
    const lastItem = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = lastItem;
      this.heapifyDown(0);
    }

    return maxElement;
  }

  /**
   * Peeks at the maximum priority item without removing it.
   * Time complexity: O(1)
   */
  public peekMax(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.heap[0].element;
  }

  /**
   * Heapify up: bubbles up the newly inserted element
   * to maintain the max-heap property.
   */
  private heapifyUp(index: number): void {
    let current = index;
    while (current > 0) {
      const parent = this.getParentIndex(current);
      if (this.heap[current].priority > this.heap[parent].priority) {
        this.swap(current, parent);
        current = parent;
      } else {
        break;
      }
    }
  }

  /**
   * Heapify down: bubbles down the replacement root element
   * to maintain the max-heap property.
   */
  private heapifyDown(index: number): void {
    let current = index;
    const length = this.heap.length;

    while (this.getLeftChildIndex(current) < length) {
      const leftChild = this.getLeftChildIndex(current);
      const rightChild = this.getRightChildIndex(current);
      let largerChild = leftChild;

      if (rightChild < length && this.heap[rightChild].priority > this.heap[leftChild].priority) {
        largerChild = rightChild;
      }

      if (this.heap[current].priority < this.heap[largerChild].priority) {
        this.swap(current, largerChild);
        current = largerChild;
      } else {
        break;
      }
    }
  }

  public size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public clear(): void {
    this.heap = [];
  }

  /**
   * Returns the internal array of the heap for visual rendering.
   */
  public getHeapArray(): HeapItem<T>[] {
    return [...this.heap];
  }
}
