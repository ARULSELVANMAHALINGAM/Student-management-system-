/**
 * Custom Queue implementation
 * Follows the First-In-First-Out (FIFO) order.
 * Used for fee payments processing and library book reservation queues.
 */

export class CustomQueue<T> {
  private items: T[];
  private headIndex: number;
  private tailIndex: number;

  constructor() {
    this.items = [];
    this.headIndex = 0;
    this.tailIndex = 0;
  }

  /**
   * Enqueue an element at the back of the queue (O(1) complexity)
   */
  public enqueue(element: T): void {
    this.items[this.tailIndex] = element;
    this.tailIndex++;
  }

  /**
   * Dequeue an element from the front of the queue (O(1) complexity)
   */
  public dequeue(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    const element = this.items[this.headIndex];
    delete this.items[this.headIndex]; // Remove reference
    this.headIndex++;

    // Prevent index drift memory leak when queue becomes empty
    if (this.headIndex === this.tailIndex) {
      this.clear();
    }
    return element;
  }

  /**
   * Peek at the front element without removing it (O(1) complexity)
   */
  public peek(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.headIndex];
  }

  public isEmpty(): boolean {
    return this.tailIndex - this.headIndex === 0;
  }

  public size(): number {
    return this.tailIndex - this.headIndex;
  }

  public clear(): void {
    this.items = [];
    this.headIndex = 0;
    this.tailIndex = 0;
  }

  /**
   * Converts queue elements to an array in FIFO order
   */
  public toArray(): T[] {
    const arr: T[] = [];
    for (let i = this.headIndex; i < this.tailIndex; i++) {
      arr.push(this.items[i]);
    }
    return arr;
  }
}
