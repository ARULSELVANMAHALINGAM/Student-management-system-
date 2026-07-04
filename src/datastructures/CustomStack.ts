/**
 * Custom Stack implementation
 * Follows the Last-In-First-Out (LIFO) order.
 * Used for administrative action backup/undo history.
 */

export class CustomStack<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  /**
   * Push an item onto the stack (O(1) amortized complexity)
   */
  public push(element: T): void {
    this.items.push(element);
  }

  /**
   * Pop an item from the stack (O(1) complexity)
   */
  public pop(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.items.pop() || null;
  }

  /**
   * Peek at the top item without removing it (O(1) complexity)
   */
  public peek(): T | null {
    if (this.isEmpty()) {
      return null;
    }
    return this.items[this.items.length - 1];
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public size(): number {
    return this.items.length;
  }

  public clear(): void {
    this.items = [];
  }

  /**
   * Returns copy of the items in the stack from top to bottom
   */
  public toArray(): T[] {
    return [...this.items].reverse();
  }
}
