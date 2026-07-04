/**
 * Custom Doubly Linked List implementation
 * Used for the notice board where notices are shown in reverse chronological order (newest first).
 * Allows traversing forward and backward.
 */

export class DLLNode<T> {
  data: T;
  next: DLLNode<T> | null = null;
  prev: DLLNode<T> | null = null;

  constructor(data: T) {
    this.data = data;
  }
}

export class CustomDoublyLinkedList<T> {
  private head: DLLNode<T> | null = null;
  private tail: DLLNode<T> | null = null;
  private sizeCount = 0;

  constructor() {}

  /**
   * Insert at the head of the list (O(1) complexity)
   * Perfect for displaying notices where the newest is displayed first.
   */
  public insertHead(data: T): void {
    const newNode = new DLLNode(data);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this.sizeCount++;
  }

  /**
   * Insert at the tail of the list (O(1) complexity)
   */
  public insertTail(data: T): void {
    const newNode = new DLLNode(data);
    if (this.tail === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.sizeCount++;
  }

  /**
   * Delete a node by value criteria (O(n) search, O(1) removal once found)
   */
  public deleteByFilter(predicate: (data: T) => boolean): T | null {
    let current = this.head;
    while (current !== null) {
      if (predicate(current.data)) {
        if (current === this.head) {
          this.head = current.next;
          if (this.head) this.head.prev = null;
          else this.tail = null;
        } else if (current === this.tail) {
          this.tail = current.prev;
          if (this.tail) this.tail.next = null;
          else this.head = null;
        } else {
          if (current.prev) current.prev.next = current.next;
          if (current.next) current.next.prev = current.prev;
        }
        this.sizeCount--;
        return current.data;
      }
      current = current.next;
    }
    return null;
  }

  public size(): number {
    return this.sizeCount;
  }

  public isEmpty(): boolean {
    return this.sizeCount === 0;
  }

  public getHead(): DLLNode<T> | null {
    return this.head;
  }

  public getTail(): DLLNode<T> | null {
    return this.tail;
  }

  /**
   * Converts the list to an array from Head to Tail (O(n))
   */
  public toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current !== null) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  /**
   * Converts the list to an array from Tail to Head (O(n))
   */
  public toArrayReverse(): T[] {
    const result: T[] = [];
    let current = this.tail;
    while (current !== null) {
      result.push(current.data);
      current = current.prev;
    }
    return result;
  }

  public clear(): void {
    this.head = null;
    this.tail = null;
    this.sizeCount = 0;
  }
}
