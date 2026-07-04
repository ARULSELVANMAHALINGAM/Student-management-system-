/**
 * Custom Trie (Prefix Tree) implementation
 * Used for fast autocomplete / search-as-you-type student directory lookups.
 * Insert: O(L) where L is the length of the string.
 * Search Prefix: O(L) where L is the length of the query.
 */

export class TrieNode {
  public children: { [char: string]: TrieNode };
  public isEndOfWord: boolean;
  // Store student roll numbers matching this name path
  public rollNumbers: string[]; 

  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.rollNumbers = [];
  }
}

export class Trie {
  private root: TrieNode;

  constructor() {
    this.root = new TrieNode();
  }

  /**
   * Insert a student name and roll number into the Trie.
   * Converted to lowercase to handle case-insensitive prefix searches.
   */
  public insert(name: string, rollNumber: string): void {
    const formattedName = name.trim().toLowerCase();
    let current = this.root;

    for (let i = 0; i < formattedName.length; i++) {
      const char = formattedName[i];
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
      
      // OPTIMIZATION: Keep rollNumbers list at each prefix node
      // to avoid traversing the entire subtree during live autocomplete searches.
      // This means autocomplete becomes O(L) instead of O(L + NodeCount of subtree)!
      if (!current.rollNumbers.includes(rollNumber)) {
        current.rollNumbers.push(rollNumber);
      }
    }
    current.isEndOfWord = true;
  }

  /**
   * Removes a roll number mapping from a specific name in the Trie
   */
  public remove(name: string, rollNumber: string): void {
    const formattedName = name.trim().toLowerCase();
    this.removeFromNode(this.root, formattedName, rollNumber, 0);
  }

  private removeFromNode(current: TrieNode, name: string, rollNumber: string, depth: number): boolean {
    if (!current) return false;

    // Remove the rollNumber from the current node prefix list
    current.rollNumbers = current.rollNumbers.filter(rn => rn !== rollNumber);

    if (depth === name.length) {
      if (current.isEndOfWord) {
        current.isEndOfWord = current.rollNumbers.length > 0;
      }
      return Object.keys(current.children).length === 0 && current.rollNumbers.length === 0;
    }

    const char = name[depth];
    const shouldDeleteChild = this.removeFromNode(current.children[char], name, rollNumber, depth + 1);

    if (shouldDeleteChild) {
      delete current.children[char];
    }

    return Object.keys(current.children).length === 0 && !current.isEndOfWord && current.rollNumbers.length === 0;
  }

  /**
   * Search for all roll numbers with names matching the prefix (Case-Insensitive)
   * Time complexity: O(L) where L is the prefix length. Very efficient!
   */
  public searchPrefix(prefix: string): string[] {
    const formattedPrefix = prefix.trim().toLowerCase();
    if (!formattedPrefix) return [];

    let current = this.root;
    for (let i = 0; i < formattedPrefix.length; i++) {
      const char = formattedPrefix[i];
      if (!current.children[char]) {
        return []; // No match found
      }
      current = current.children[char];
    }
    
    return current.rollNumbers;
  }

  /**
   * Helper to retrieve the internal Trie root node structure
   * for beautiful recursive/interactive React visualization.
   */
  public getRoot(): TrieNode {
    return this.root;
  }

  /**
   * Generates a flat tree structure representing a portion of the Trie for visualization
   */
  public getVisualizationData(maxDepth = 3): any {
    const buildNode = (char: string, node: TrieNode, depth: number): any => {
      if (depth > maxDepth) {
        return { name: char + '...', children: [] };
      }
      
      const childrenKeys = Object.keys(node.children);
      const childData = childrenKeys.map(k => buildNode(k, node.children[k], depth + 1));
      
      return {
        name: char,
        isEndOfWord: node.isEndOfWord,
        studentsCount: node.rollNumbers.length,
        children: childData
      };
    };

    return buildNode('Root', this.root, 0);
  }
}
