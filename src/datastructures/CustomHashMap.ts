/**
 * Custom Separate Chaining Hash Map implementation
 * Handles collisions using linked lists inside buckets.
 * Supports load-factor-based automatic rehashing and dynamic resizing.
 */

export class HashNode<K, V> {
  key: K;
  value: V;
  next: HashNode<K, V> | null = null;

  constructor(key: K, value: V) {
    key = key;
    this.key = key;
    this.value = value;
  }
}

export class CustomHashMap<K, V> {
  private buckets: (HashNode<K, V> | null)[];
  private capacity: number;
  private sizeCount: number;
  private readonly loadFactorThreshold = 0.75;

  constructor(initialCapacity = 16) {
    this.capacity = initialCapacity;
    this.buckets = new Array(initialCapacity).fill(null);
    this.sizeCount = 0;
  }

  /**
   * Custom hash function for string and number keys
   * Polynomial rolling hash for strings.
   */
  private hash(key: K): number {
    const keyStr = String(key);
    let hashVal = 0;
    const prime = 31;
    for (let i = 0; i < keyStr.length; i++) {
      hashVal = (hashVal * prime + keyStr.charCodeAt(i)) % this.capacity;
    }
    return Math.abs(hashVal);
  }

  public put(key: K, value: V): void {
    const index = this.hash(key);
    let head = this.buckets[index];

    // Check if key already exists, if so update its value
    while (head !== null) {
      if (head.key === key) {
        head.value = value;
        return;
      }
      head = head.next;
    }

    // Insert new node at the head of the chain (O(1) insertion)
    const newNode = new HashNode(key, value);
    newNode.next = this.buckets[index];
    this.buckets[index] = newNode;
    this.sizeCount++;

    // Check load factor and resize if necessary
    if (this.sizeCount / this.capacity >= this.loadFactorThreshold) {
      this.resize();
    }
  }

  public get(key: K): V | null {
    const index = this.hash(key);
    let head = this.buckets[index];

    while (head !== null) {
      if (head.key === key) {
        return head.value;
      }
      head = head.next;
    }
    return null;
  }

  public remove(key: K): V | null {
    const index = this.hash(key);
    let head = this.buckets[index];
    let prev: HashNode<K, V> | null = null;

    while (head !== null) {
      if (head.key === key) {
        if (prev === null) {
          this.buckets[index] = head.next;
        } else {
          prev.next = head.next;
        }
        this.sizeCount--;
        return head.value;
      }
      prev = head;
      head = head.next;
    }
    return null;
  }

  public containsKey(key: K): boolean {
    return this.get(key) !== null;
  }

  public size(): number {
    return this.sizeCount;
  }

  public getCapacity(): number {
    return this.capacity;
  }

  public isEmpty(): boolean {
    return this.sizeCount === 0;
  }

  public clear(): void {
    this.buckets = new Array(this.capacity).fill(null);
    this.sizeCount = 0;
  }

  /**
   * Resizes the Hash Map capacity and rehashes all elements
   * to maintain O(1) average lookup.
   */
  private resize(): void {
    const oldBuckets = this.buckets;
    this.capacity = this.capacity * 2;
    this.buckets = new Array(this.capacity).fill(null);
    this.sizeCount = 0;

    for (const headNode of oldBuckets) {
      let current = headNode;
      while (current !== null) {
        this.put(current.key, current.value);
        current = current.next;
      }
    }
  }

  /**
   * Returns a copy of the key-value pairs
   */
  public entryList(): { key: K; value: V }[] {
    const list: { key: K; value: V }[] = [];
    for (const headNode of this.buckets) {
      let current = headNode;
      while (current !== null) {
        list.push({ key: current.key, value: current.value });
        current = current.next;
      }
    }
    return list;
  }

  public keys(): K[] {
    return this.entryList().map(e => e.key);
  }

  public values(): V[] {
    return this.entryList().map(e => e.value);
  }

  /**
   * Returns bucket details for visualization
   */
  public getBucketsInfo() {
    return this.buckets.map((head, index) => {
      const nodes: K[] = [];
      let current = head;
      while (current !== null) {
        nodes.push(current.key);
        current = current.next;
      }
      return { index, nodes };
    });
  }
}
