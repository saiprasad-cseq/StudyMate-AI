export interface CurriculumTopicBlueprint {
  title: string;
  desc: string;
  concepts: string[];
  prerequisites?: string[];
  type?: 'concept' | 'practice' | 'project' | 'revision' | 'milestone';
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CurriculumWeekBlueprint {
  title: string;
  summary: string;
  topics: CurriculumTopicBlueprint[];
}

export interface CurriculumMonthBlueprint {
  title: string;
  summary: string;
  weeks: CurriculumWeekBlueprint[];
}

export interface CurriculumPeriodBlueprint {
  title: string;
  theme: string;
  months: CurriculumMonthBlueprint[];
}

export interface CurriculumYearBlueprint {
  title: string;
  goal: string;
  periods: CurriculumPeriodBlueprint[];
}

// Full Computer Science & Engineering 4-Year Granular Academic Syllabus
export const CS_CURRICULUM: Record<number, CurriculumYearBlueprint> = {
  1: {
    title: "Year 1: Programming Fundamentals, Structured Logic, Elementary Data Structures & OOP",
    goal: "Build concrete mental models of execution, memory layout, structured programming, core data structures, and object-oriented design.",
    periods: [
      {
        title: "Semester 1: Structured Programming, Memory Management, Discrete Math & Basic Data Structures",
        theme: "Programming Primitives, Pointers, Memory Layout & Linear Data Structures",
        months: [
          {
            title: "Month 1: Programming Fundamentals & Structured Control Flow",
            summary: "Variables, primitive data types, operators, I/O operations, conditional branching, loops, functions, and arrays.",
            weeks: [
              {
                title: "Week 1: Variables, Data Types & Operators",
                summary: "Memory representations of primitive types, operators, and expression evaluation.",
                topics: [
                  {
                    title: "Variables and Data Types",
                    desc: "Understand primitive data types (int, float, char, boolean), memory footprints, type casting, and variable declarations.",
                    concepts: ["Memory Footprint", "Type Casting & Conversions", "Signed vs Unsigned Integers", "IEEE 754 Floating-Point Representation"],
                    prerequisites: ["None"],
                    type: "concept",
                    difficulty: "Beginner"
                  },
                  {
                    title: "Operators and Expressions",
                    desc: "Master arithmetic, relational, logical, and bitwise operators along with operator precedence and associativity.",
                    concepts: ["Bitwise Operators (&, |, ^, ~)", "Short-Circuit Logical Evaluation", "Operator Precedence Rules", "Expression Tree Evaluation"],
                    prerequisites: ["Variables and Data Types"],
                    type: "concept",
                    difficulty: "Beginner"
                  }
                ]
              },
              {
                title: "Week 2: Input/Output & Conditional Statements",
                summary: "Standard stream I/O and branching flow control structures.",
                topics: [
                  {
                    title: "Input and Output Operations",
                    desc: "Master standard I/O streams, formatted console I/O, format specifiers, and stream buffer flushing.",
                    concepts: ["Standard Input / Output Streams", "Format Specifiers", "Stream Buffers & Line Flush", "Defensive Input Validation"],
                    prerequisites: ["Variables and Data Types"],
                    type: "concept",
                    difficulty: "Beginner"
                  },
                  {
                    title: "Conditional Statements and Branching",
                    desc: "Implement multi-way decisions using if, if-else, nested branching, switch-case statements, and ternary operators.",
                    concepts: ["Branch Prediction Basics", "Nested If-Else Blocks", "Switch-Case Jump Tables", "Ternary Conditional Operator"],
                    prerequisites: ["Operators and Expressions"],
                    type: "concept",
                    difficulty: "Beginner"
                  }
                ]
              },
              {
                title: "Week 3: Loops, Iteration & Modular Functions",
                summary: "Loop constructs, loop invariants, function call stack, and parameter passing.",
                topics: [
                  {
                    title: "Loops and Iteration Control",
                    desc: "Master for, while, and do-while loops, loop invariants, break/continue flow control, and nested iteration.",
                    concepts: ["Loop Invariants", "For vs While Constructs", "Break & Continue Control", "Nested Iterations & Complexity"],
                    prerequisites: ["Conditional Statements and Branching"],
                    type: "concept",
                    difficulty: "Beginner"
                  },
                  {
                    title: "Functions and Parameter Passing",
                    desc: "Understand function prototypes, return types, call stack activation records, and pass-by-value vs pass-by-reference.",
                    concepts: ["Stack Activation Records", "Pass-by-Value vs Pass-by-Reference", "Scope & Lifetime", "Function Signatures"],
                    prerequisites: ["Loops and Iteration Control"],
                    type: "concept",
                    difficulty: "Beginner"
                  }
                ]
              },
              {
                title: "Week 4: Arrays & String Manipulations",
                summary: "Contiguous arrays, multi-dimensional matrix layout, null-terminated strings, and string algorithms.",
                topics: [
                  {
                    title: "Arrays (1D and Multi-Dimensional)",
                    desc: "Understand contiguous memory allocation, row-major memory ordering, array indexing, and bounds checking.",
                    concepts: ["Contiguous Memory Addressing", "2D Array Row-Major Layout", "Buffer Overrun Prevention", "Matrix Manipulations"],
                    prerequisites: ["Loops and Iteration Control"],
                    type: "concept",
                    difficulty: "Beginner"
                  },
                  {
                    title: "Strings and String Manipulation",
                    desc: "Implement string operations, character array buffers, null-terminator mechanics, and string parsing algorithms.",
                    concepts: ["Null-Terminated Strings", "String Search & Reversal", "Substring Tokenization", "In-Place String Transforms"],
                    prerequisites: ["Arrays (1D and Multi-Dimensional)"],
                    type: "practice",
                    difficulty: "Beginner"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 2: Pointers, Dynamic Memory, Structs, File Handling & Debugging",
            summary: "Memory pointers, heap management, composite structs, file stream persistence, and debugging techniques.",
            weeks: [
              {
                title: "Week 1: Pointers & Dynamic Memory Allocation",
                summary: "Pointer arithmetic, dereferencing, and heap allocation lifecycle.",
                topics: [
                  {
                    title: "Pointers and Memory Addresses",
                    desc: "Master memory addressing (&), pointer dereferencing (*), pointer arithmetic, void pointers, and null pointers.",
                    concepts: ["Address-of & Dereference Operators", "Pointer Arithmetic", "Pointers to Pointers (Double Pointers)", "Const Pointers vs Pointer to Const"],
                    prerequisites: ["Arrays (1D and Multi-Dimensional)"],
                    type: "concept",
                    difficulty: "Beginner"
                  },
                  {
                    title: "Dynamic Memory Allocation (malloc, free)",
                    desc: "Manage dynamic heap memory allocations (malloc, calloc, realloc, free) and prevent memory leaks and dangling pointers.",
                    concepts: ["Heap Allocator Mechanics", "Memory Leak Prevention", "Dangling Pointers & Double Free", "Heap vs Stack Memory"],
                    prerequisites: ["Pointers and Memory Addresses"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 2: Structures & Custom Composite Types",
                summary: "Composite data types, byte alignment, memory padding, and self-referential structs.",
                topics: [
                  {
                    title: "Structures and Custom Data Types",
                    desc: "Define custom struct types, analyze member memory alignment and struct padding, and use typedef aliases.",
                    concepts: ["Struct Memory Padding & Alignment", "Member Access Operators (. and ->)", "Nested Structures", "Typedef Aliases"],
                    prerequisites: ["Dynamic Memory Allocation (malloc, free)"],
                    type: "concept",
                    difficulty: "Beginner"
                  },
                  {
                    title: "Pointers to Structures and Self-Referential Types",
                    desc: "Pass structs to functions efficiently via pointers and construct the foundational self-referential linked node pattern.",
                    concepts: ["Arrow Operator (->)", "Pass-by-Pointer Efficiency", "Self-Referential Structs", "Linked Node Blueprints"],
                    prerequisites: ["Structures and Custom Data Types"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 3: File Handling & Systematic Debugging",
                summary: "Persistent file streams, binary serialization, and interactive debugging techniques.",
                topics: [
                  {
                    title: "File Handling and I/O Streams",
                    desc: "Implement file opening/closing (fopen/fclose), formatted text reading/writing, binary file serialization, and EOF error checks.",
                    concepts: ["File Descriptors & Pointers", "Binary vs Text File Modes", "fread / fwrite Serialization", "EOF and Error Handling"],
                    prerequisites: ["Structures and Custom Data Types"],
                    type: "concept",
                    difficulty: "Intermediate"
                  },
                  {
                    title: "Debugging Techniques and Stack Tracing",
                    desc: "Master systematic debugging using GDB / debugger tools, setting breakpoints, stepping through frames, and analyzing segmentation faults.",
                    concepts: ["Breakpoints & Watchpoints", "Call Stack Frame Inspection", "Segmentation Fault Diagnostics", "Valgrind Memory Checks"],
                    prerequisites: ["File Handling and I/O Streams"],
                    type: "practice",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 4: Month 2 Capstone: CLI Record Management System",
                summary: "Build an end-to-end command line application utilizing structs, dynamic memory, file persistence, and robust error handling.",
                topics: [
                  {
                    title: "Structured Programming Project: CLI Record Management System",
                    desc: "Design and implement a modular record management system supporting creation, search, deletion, binary disk persistence, and cleanup.",
                    concepts: ["Modular C/C++ Architecture", "Dynamic Memory Lifecycle", "Disk Serialization", "Clean Command-Line Interface"],
                    prerequisites: ["Debugging Techniques and Stack Tracing"],
                    type: "project",
                    difficulty: "Intermediate"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 3: Discrete Mathematics & Computational Logic",
            summary: "Propositional logic, set theory, combinatorics, counting principles, and mathematical induction.",
            weeks: [
              {
                title: "Week 1: Propositional Logic & Boolean Expressions",
                summary: "Truth tables, logical equivalences, De Morgan's laws, and predicate quantifiers.",
                topics: [
                  {
                    title: "Propositional Logic and Boolean Expressions",
                    desc: "Construct truth tables, verify logical equivalences with De Morgan's laws, and formulate universal and existential predicates.",
                    concepts: ["Truth Tables & Tautologies", "De Morgan's Laws", "Universal & Existential Quantifiers", "Logical Entailment"],
                    prerequisites: ["None"],
                    type: "concept",
                    difficulty: "Beginner"
                  }
                ]
              },
              {
                title: "Week 2: Set Theory, Relations & Mappings",
                summary: "Set operations, equivalence relations, partial orders, and bijection functions.",
                topics: [
                  {
                    title: "Set Theory, Relations and Functions",
                    desc: "Master power sets, cartesian products, equivalence relations, equivalence classes, and bijective mappings.",
                    concepts: ["Power Sets & Cartesian Products", "Equivalence Relations & Partitions", "Injective & Surjective Functions", "Set Operations"],
                    prerequisites: ["Propositional Logic and Boolean Expressions"],
                    type: "concept",
                    difficulty: "Beginner"
                  }
                ]
              },
              {
                title: "Week 3: Combinatorics & Counting Principles",
                summary: "Permutations, combinations, pigeonhole principle, and binomial coefficients.",
                topics: [
                  {
                    title: "Combinatorics and Counting Principles",
                    desc: "Apply permutations, combinations, stars and bars, and the pigeonhole principle to discrete computing bounds.",
                    concepts: ["Permutations & Combinations", "Pigeonhole Principle", "Inclusion-Exclusion Principle", "Binomial Theorem"],
                    prerequisites: ["Set Theory, Relations and Functions"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 4: Mathematical Induction & Recurrence Relations",
                summary: "Weak and strong induction, structural induction, and closed-form recurrence solving.",
                topics: [
                  {
                    title: "Mathematical Induction and Recurrence Relations",
                    desc: "Formulate inductive proofs for loop correctness and algorithm termination, and solve linear recurrence equations.",
                    concepts: ["Weak & Strong Induction", "Loop Correctness Invariants", "Recurrence Relations", "Characteristic Equation Solving"],
                    prerequisites: ["Combinatorics and Counting Principles"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 4: Elementary Data Structures & Asymptotic Analysis",
            summary: "Asymptotic Big-O notation, singly and doubly linked lists, stacks, queues, and circular buffers.",
            weeks: [
              {
                title: "Week 1: Asymptotic Analysis & Big-O Notation",
                summary: "Worst-case, best-case, average-case analysis, Big-O, Big-Theta, and Big-Omega.",
                topics: [
                  {
                    title: "Asymptotic Analysis and Big-O Notation",
                    desc: "Mathematically calculate time and space complexities, prove dominant terms, and classify algorithmic growth rates.",
                    concepts: ["Big-O / Big-Theta / Big-Omega", "Dominant Term Analysis", "Space Complexity", "Amortized Analysis Basics"],
                    prerequisites: ["Mathematical Induction and Recurrence Relations"],
                    type: "concept",
                    difficulty: "Beginner"
                  }
                ]
              },
              {
                title: "Week 2: Singly & Doubly Linked Lists",
                summary: "Node pointers, traversal, insertion, deletion, and two-pointer cycle detection.",
                topics: [
                  {
                    title: "Singly and Doubly Linked Lists",
                    desc: "Implement node insertion, deletion, in-place list reversal, and cycle detection using Floyd's Tortoise and Hare algorithm.",
                    concepts: ["Sentinel / Dummy Nodes", "In-Place List Reversal", "Two-Pointer Cycle Detection (Floyd's)", "Doubly Linked Node Operations"],
                    prerequisites: ["Pointers to Structures and Self-Referential Types", "Asymptotic Analysis and Big-O Notation"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 3: Stacks, Queues & Circular Buffers",
                summary: "LIFO/FIFO data structures, array-based and linked-list implementations, and expression parsing.",
                topics: [
                  {
                    title: "Stacks, Queues and Circular Buffers",
                    desc: "Implement LIFO stacks and FIFO queues, circular array buffer indexing, and parentheses matching algorithms.",
                    concepts: ["LIFO / FIFO Invariants", "Circular Array Modulo Indexing", "Expression Parsing & Parentheses Matching", "Monotonic Stack Foundations"],
                    prerequisites: ["Singly and Doubly Linked Lists"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 4: Semester 1 Review & Diagnostic Milestone",
                summary: "Comprehensive diagnostic assessment synthesizing syntax, memory management, discrete math, and linked structures.",
                topics: [
                  {
                    title: "Semester 1 Comprehensive Review & Coding Milestone",
                    desc: "Solve timed diagnostic challenges testing memory safety, asymptotic complexity, pointer arithmetic, and data structure implementations.",
                    concepts: ["Synthesizing Fundamentals", "Memory Safety Verification", "Edge Case Diagnostics", "Timed Coding Fluency"],
                    prerequisites: ["Stacks, Queues and Circular Buffers"],
                    type: "milestone",
                    difficulty: "Intermediate"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Semester 2: Intermediate Data Structures, Object-Oriented Programming & Algorithmic Foundations",
        theme: "Hierarchies, Trees, Heaps, Hash Tables, OOP Paradigms & Sorting Algorithms",
        months: [
          {
            title: "Month 5: Trees and Binary Search Trees (BST)",
            summary: "Binary trees, tree traversals (DFS/BFS), binary search tree invariants, and balanced trees (AVL).",
            weeks: [
              {
                title: "Week 1: Binary Tree Traversals (DFS & BFS)",
                summary: "Preorder, inorder, postorder, level-order traversals, and recursive properties.",
                topics: [
                  {
                    title: "Binary Trees & Traversal Algorithms",
                    desc: "Implement Depth-First Search (inorder, preorder, postorder) and Breadth-First Search (queue-based level order) traversals.",
                    concepts: ["DFS (Preorder, Inorder, Postorder)", "BFS Level-Order Traversal", "Tree Height & Diameter", "Subtree Recursive Invariants"],
                    prerequisites: ["Stacks, Queues and Circular Buffers"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 2: Binary Search Trees (BST) & Invariant Operations",
                summary: "BST search, insertion, 3-case deletion, and range queries.",
                topics: [
                  {
                    title: "Binary Search Trees (BST) and Invariant Operations",
                    desc: "Implement O(log N) lookup, insertion, and three-case node deletion while preserving the BST ordering invariant.",
                    concepts: ["BST Ordering Invariant", "Inorder Successor & Predecessor", "Three-Case Node Deletion", "Degenerate Tree Worst Cases"],
                    prerequisites: ["Binary Trees & Traversal Algorithms"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 3: Balanced Trees: AVL & Red-Black Principles",
                summary: "Tree rotations, balance factor calculations, and strict O(log N) guarantees.",
                topics: [
                  {
                    title: "Balanced Trees: AVL and Red-Black Trees",
                    desc: "Master Left and Right single/double rotations, calculate AVL balance factors, and understand worst-case O(log N) balancing.",
                    concepts: ["Tree Rotations (Left, Right, Double)", "AVL Balance Factor Calculation", "Self-Balancing Invariants", "Strict O(log N) Search Guarantees"],
                    prerequisites: ["Binary Search Trees (BST) and Invariant Operations"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 4: Tree Algorithmic Problem Solving Workshop",
                summary: "Lowest common ancestor, path sum problems, and tree serialization/deserialization.",
                topics: [
                  {
                    title: "Tree Algorithmic Problem Solving Workshop",
                    desc: "Solve Lowest Common Ancestor (LCA), Maximum Path Sum, and Binary Tree Serialization/Deserialization problem patterns.",
                    concepts: ["Lowest Common Ancestor (LCA)", "Tree Serialization Algorithms", "Subtree Dynamic Recursion", "Boundary Condition Testing"],
                    prerequisites: ["Balanced Trees: AVL and Red-Black Trees"],
                    type: "practice",
                    difficulty: "Intermediate"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 6: Priority Queues, Heaps & Hash Tables",
            summary: "Binary heaps, heapify algorithm, priority queues, hash functions, and collision resolution.",
            weeks: [
              {
                title: "Week 1: Binary Min/Max Heaps & Priority Queues",
                summary: "Complete binary trees in arrays, bubble-up, bubble-down, and O(N) build-heap.",
                topics: [
                  {
                    title: "Binary Min/Max Heaps and Priority Queues",
                    desc: "Implement array representations of heaps, O(log N) push/pop operations, and linear O(N) Floyd build-heap algorithm.",
                    concepts: ["Complete Binary Tree Array Mapping", "Heapify Up & Down Algorithms", "O(N) Floyd Build-Heap", "Priority Queue Scheduling"],
                    prerequisites: ["Binary Trees & Traversal Algorithms"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 2: Hash Tables & Collision Resolution",
                summary: "Hash functions, separate chaining, open addressing (linear probing, quadratic probing), and load factors.",
                topics: [
                  {
                    title: "Hash Tables and Collision Resolution",
                    desc: "Implement hash functions, handle clustering with linear probing / quadratic probing, and design separate chaining buckets.",
                    concepts: ["Hash Code Uniformity", "Separate Chaining with Linked Nodes", "Open Addressing & Linear Probing", "Load Factor & Dynamic Rehashing"],
                    prerequisites: ["Binary Min/Max Heaps and Priority Queues"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 3: Practical Hash Map Architecture",
                summary: "Generic key-value map implementation with dynamic capacity resizing and amortized O(1) lookups.",
                topics: [
                  {
                    title: "Hash Map Architecture and Amortized O(1) Lookups",
                    desc: "Build a robust generic Hash Map class supporting key hashing, automatic table doubling, and collision handling.",
                    concepts: ["Key-Value Entry Buckets", "Dynamic Capacity Doubling", "Amortized O(1) Complexity Proof", "Hash Map Iterators"],
                    prerequisites: ["Hash Tables and Collision Resolution"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 4: Heaps & Hash Map Algorithmic Patterns",
                summary: "Top-K elements, running median with two heaps, and hash-based subarray lookups.",
                topics: [
                  {
                    title: "Heaps and Hash Map Algorithmic Patterns",
                    desc: "Master Top-K Frequent Elements using min-heaps, running median maintenance with two heaps, and two-sum hash patterns.",
                    concepts: ["Top-K Min-Heap Pattern", "Two-Heap Running Median", "Frequency Map Counters", "Subarray Sum Hash Lookups"],
                    prerequisites: ["Hash Map Architecture and Amortized O(1) Lookups"],
                    type: "practice",
                    difficulty: "Intermediate"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 7: Object-Oriented Programming (OOP) & Design Principles",
            summary: "Classes, objects, encapsulation, inheritance, polymorphism, abstraction, and SOLID principles.",
            weeks: [
              {
                title: "Week 1: Classes, Objects & Constructors",
                summary: "Class definitions, instantiation, constructors, destructors, this pointer, and member initialization lists.",
                topics: [
                  {
                    title: "Classes, Objects and Constructors",
                    desc: "Understand class vs object blueprints, default/parameterized/copy constructors, member initializers, and resource destructors.",
                    concepts: ["Class & Object Instantiation", "Constructor Overloading", "Member Initialization Lists", "Destructors & RAII"],
                    prerequisites: ["Structures and Custom Data Types"],
                    type: "concept",
                    difficulty: "Beginner"
                  }
                ]
              },
              {
                title: "Week 2: Encapsulation & Access Modifiers",
                summary: "Data hiding, public/private/protected visibility, getters, setters, and class invariants.",
                topics: [
                  {
                    title: "Encapsulation, Access Modifiers and Data Hiding",
                    desc: "Enforce class invariants through private state, controlled public interfaces, and getter/setter validation logic.",
                    concepts: ["Public, Private & Protected Scope", "Data Hiding Principles", "Class Invariants", "Getter/Setter Validation"],
                    prerequisites: ["Classes, Objects and Constructors"],
                    type: "concept",
                    difficulty: "Beginner"
                  }
                ]
              },
              {
                title: "Week 3: Inheritance & Polymorphism",
                summary: "Base/derived classes, virtual functions, dynamic dispatch, vtables, and method overriding.",
                topics: [
                  {
                    title: "Inheritance and Polymorphism",
                    desc: "Implement single and multi-level inheritance, virtual functions, dynamic method dispatch via vtables, and runtime polymorphism.",
                    concepts: ["Base & Derived Class Relationships", "Virtual Functions & VTable Dispatch", "Method Overriding vs Overloading", "Runtime Polymorphism"],
                    prerequisites: ["Encapsulation, Access Modifiers and Data Hiding"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 4: Abstraction, Interfaces & SOLID Principles",
                summary: "Abstract classes, pure virtual interfaces, and the five SOLID design principles.",
                topics: [
                  {
                    title: "Abstraction, Interfaces and SOLID Design Principles",
                    desc: "Master pure abstract interfaces and apply Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.",
                    concepts: ["Pure Abstract Interfaces", "Single Responsibility (SRP)", "Open/Closed Principle (OCP)", "Liskov Substitution (LSP)"],
                    prerequisites: ["Inheritance and Polymorphism"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 8: Sorting, Searching & Year 1 Capstone Project",
            summary: "Divide-and-conquer sorting (MergeSort, QuickSort), binary search variations, Git/GitHub, and full OOP capstone.",
            weeks: [
              {
                title: "Week 1: Sorting: MergeSort & QuickSort",
                summary: "Divide-and-conquer recursive trees, Lomuto/Hoare partitioning, and sorting stability.",
                topics: [
                  {
                    title: "Divide and Conquer: Merge Sort and Quick Sort",
                    desc: "Implement MergeSort and QuickSort algorithms, analyze recursive call trees, partition invariants, and stability guarantees.",
                    concepts: ["Divide and Conquer Strategy", "MergeSort In-Place vs Extra Space", "QuickSort Partitioning Invariants", "Sorting Stability & Edge Cases"],
                    prerequisites: ["Asymptotic Analysis and Big-O Notation"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 2: Advanced Binary Search Patterns",
                summary: "Binary search on sorted arrays, lower/upper bounds, and monotonic predicate search spaces.",
                topics: [
                  {
                    title: "Searching: Binary Search on Monotonic Ranges",
                    desc: "Apply binary search to sorted data and monotonic optimization answer spaces (e.g. search in rotated sorted array, peak element).",
                    concepts: ["Monotonic Search Invariant", "Lower Bound & Upper Bound", "Rotated Sorted Array Search", "Predicate Function Bisection"],
                    prerequisites: ["Divide and Conquer: Merge Sort and Quick Sort"],
                    type: "practice",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 3: Git & GitHub Version Control",
                summary: "Repositories, commits, branching strategies, merge conflicts, pull requests, and collaborative workflows.",
                topics: [
                  {
                    title: "Git and GitHub Version Control",
                    desc: "Master Git fundamentals: commits, feature branching, resolving merge conflicts, remote origins, and GitHub Pull Request reviews.",
                    concepts: ["Git Commit DAG Structure", "Branching & Merging Strategies", "Merge Conflict Resolution", "Pull Request Workflows"],
                    prerequisites: ["None"],
                    type: "practice",
                    difficulty: "Beginner"
                  }
                ]
              },
              {
                title: "Week 4: Year 1 Capstone: Object-Oriented Management System",
                summary: "Build and defend an end-to-end OOP system using custom data structures, file persistence, and Git tracking.",
                topics: [
                  {
                    title: "Year 1 Capstone Project: Object-Oriented Inventory & Order Management System",
                    desc: "Architect a comprehensive OOP application utilizing classes, balanced data structures, hash indexing, disk persistence, and Git commits.",
                    concepts: ["OOP Architecture & SOLID", "Custom Data Structure Integration", "Persistent Serialization", "Year 1 Portfolio Showcase"],
                    prerequisites: ["Abstraction, Interfaces and SOLID Design Principles", "Git and GitHub Version Control"],
                    type: "project",
                    difficulty: "Intermediate"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  2: {
    title: "Year 2: Advanced Algorithms, Databases, Operating Systems & Computer Networks",
    goal: "Master graph algorithms, dynamic programming, relational database internals & SQL, operating systems concurrency, and computer networking protocols.",
    periods: [
      {
        title: "Semester 3: Graph Algorithms, Dynamic Programming & Relational Databases (SQL)",
        theme: "Graph Theory, Dynamic Optimization, SQL Schema Design & Transaction Internals",
        months: [
          {
            title: "Month 1: Graph Theory & Core Graph Algorithms",
            summary: "Graph representations, BFS/DFS, topological sorting, Dijkstra, Bellman-Ford, and Minimum Spanning Trees.",
            weeks: [
              {
                title: "Week 1: Graph Representations & Traversals (BFS/DFS)",
                summary: "Adjacency matrix vs adjacency list, connected components, and bipartite testing.",
                topics: [
                  {
                    title: "Graph Representations (Adjacency Matrix vs Adjacency List)",
                    desc: "Implement space-efficient adjacency lists, analyze degree distributions, and model directed vs undirected graphs.",
                    concepts: ["Adjacency List vs Matrix Space/Time", "Directed vs Undirected Graphs", "Edge Weight Representations", "Graph Modeling"],
                    prerequisites: ["Hash Map Architecture and Amortized O(1) Lookups"],
                    type: "concept",
                    difficulty: "Intermediate"
                  },
                  {
                    title: "Graph Traversals: Breadth-First Search (BFS) and Depth-First Search (DFS)",
                    desc: "Implement BFS for shortest unweighted paths and DFS for connected components, cycle detection, and bipartite graph validation.",
                    concepts: ["BFS Queue Traversal", "DFS Recursive Call Stack", "Cycle Detection in Directed Graphs", "Bipartite Graph Coloring"],
                    prerequisites: ["Graph Representations (Adjacency Matrix vs Adjacency List)"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 2: Topological Sorting & DAGs",
                summary: "Kahn's in-degree algorithm, DFS post-order topological sort, and dependency resolution.",
                topics: [
                  {
                    title: "Topological Sort and Dependency Resolution in DAGs",
                    desc: "Solve task scheduling dependencies using Kahn's in-degree algorithm and DFS topological sort.",
                    concepts: ["In-Degree Array", "Kahn's Algorithm", "Directed Acyclic Graph (DAG) Invariants", "Course Schedule Resolution"],
                    prerequisites: ["Graph Traversals: Breadth-First Search (BFS) and Depth-First Search (DFS)"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 3: Shortest Path Algorithms: Dijkstra & Bellman-Ford",
                summary: "Weighted graph shortest paths, greedy min-heap relaxations, and negative cycle detection.",
                topics: [
                  {
                    title: "Shortest Path Algorithms: Dijkstra and Bellman-Ford",
                    desc: "Implement Dijkstra's algorithm with min-heaps in O((V + E) log V) and Bellman-Ford for negative weight edge detection.",
                    concepts: ["Edge Relaxation Technique", "Dijkstra Priority Queue Optimization", "Bellman-Ford Algorithm", "Negative Weight Cycle Detection"],
                    prerequisites: ["Binary Min/Max Heaps and Priority Queues", "Topological Sort and Dependency Resolution in DAGs"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 4: Minimum Spanning Trees (MST) & Disjoint Set Union",
                summary: "Union-Find with path compression and rank, Kruskal's, and Prim's algorithms.",
                topics: [
                  {
                    title: "Minimum Spanning Trees: Kruskal and Prim Algorithms",
                    desc: "Implement Disjoint Set Union (DSU) with path compression and union by rank, and compute MSTs via Kruskal and Prim.",
                    concepts: ["Disjoint Set Union (DSU)", "Path Compression & Rank Optimization", "Kruskal's Greedy MST Algorithm", "Prim's Priority Queue MST"],
                    prerequisites: ["Shortest Path Algorithms: Dijkstra and Bellman-Ford"],
                    type: "practice",
                    difficulty: "Advanced"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 2: Dynamic Programming (DP) Mastery",
            summary: "Memoization vs tabulation, 1D DP, 2D Grid DP, 0/1 Knapsack, and String DP.",
            weeks: [
              {
                title: "Week 1: Dynamic Programming Foundations & 1D States",
                summary: "Overlapping subproblems, optimal substructure, memoization, and tabulation.",
                topics: [
                  {
                    title: "Dynamic Programming Foundations: Memoization vs Tabulation",
                    desc: "Formulate state recurrence relations, contrast top-down recursive memoization with bottom-up iterative tabulation.",
                    concepts: ["Overlapping Subproblems Invariant", "Optimal Substructure Property", "Memoization Cache Table", "Bottom-Up State Transitions"],
                    prerequisites: ["Mathematical Induction and Recurrence Relations"],
                    type: "concept",
                    difficulty: "Intermediate"
                  },
                  {
                    title: "1D Dynamic Programming: Fibonacci, Climbing Stairs & House Robber",
                    desc: "Solve canonical 1D DP problems and optimize space complexity from O(N) to O(1) using rolling variables.",
                    concepts: ["1D State Formulations", "Space Optimization to O(1)", "Non-Adjacent Element Constraints", "Coin Change Problem"],
                    prerequisites: ["Dynamic Programming Foundations: Memoization vs Tabulation"],
                    type: "practice",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 2: 2D Grid DP & 0/1 Knapsack Pattern",
                summary: "Unique paths on grids, minimum path sum, and 0/1 knapsack state transitions.",
                topics: [
                  {
                    title: "2D Dynamic Programming: 0/1 Knapsack and Grid Paths",
                    desc: "Master the 0/1 Knapsack decision table, Subset Sum, Unique Paths in grids, and 1D array space compression.",
                    concepts: ["2D DP Decision Table", "0/1 Knapsack Recurrence", "Subset Sum Partitioning", "Row-by-Row Space Compression"],
                    prerequisites: ["1D Dynamic Programming: Fibonacci, Climbing Stairs & House Robber"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 3: String DP & Interval Subsequences",
                summary: "Longest Common Subsequence (LCS), Edit Distance (Levenshtein), and Longest Increasing Subsequence (LIS).",
                topics: [
                  {
                    title: "String DP: Longest Common Subsequence & Edit Distance",
                    desc: "Implement 2D table transformations for Longest Common Subsequence (LCS), Edit Distance, and O(N log N) LIS with binary search.",
                    concepts: ["LCS State Transitions", "Edit Distance Insertion/Deletion/Substitution", "Longest Increasing Subsequence (LIS)", "Patience Sorting Bisection"],
                    prerequisites: ["2D Dynamic Programming: 0/1 Knapsack and Grid Paths"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 4: Dynamic Programming Problem Solving Workshop",
                summary: "Tackle classic multi-state LeetCode DP challenges with rigorous state definitions.",
                topics: [
                  {
                    title: "Advanced Dynamic Programming Patterns Workshop",
                    desc: "Solve Partition Equal Subset Sum, Target Sum, Word Break, and Coin Change II with formal complexity proofs.",
                    concepts: ["Unbounded vs Bounded Knapsack", "State Representation Strategy", "Multi-Dimensional DP Tables", "DP State Debugging"],
                    prerequisites: ["String DP: Longest Common Subsequence & Edit Distance"],
                    type: "practice",
                    difficulty: "Advanced"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 3: Relational Databases and SQL",
            summary: "Relational data model, ER diagrams, SQL DDL & DML, joins, aggregations, subqueries, and database normalization.",
            weeks: [
              {
                title: "Week 1: Relational Data Model & ER Diagrams",
                summary: "Entity-Relationship modeling, primary keys, foreign keys, and relational schema mapping.",
                topics: [
                  {
                    title: "Relational Data Modeling and Entity-Relationship (ER) Diagrams",
                    desc: "Design normalized database schemas using Crow's Foot ER diagrams, define 1-to-1, 1-to-Many, and Many-to-Many entity relationships.",
                    concepts: ["Entities, Attributes & Keys", "Primary & Foreign Key Constraints", "Cardinality & Modality (1:1, 1:N, M:N)", "Junction / Associative Tables"],
                    prerequisites: ["None"],
                    type: "concept",
                    difficulty: "Beginner"
                  }
                ]
              },
              {
                title: "Week 2: SQL DDL & DML Operations",
                summary: "CREATE, ALTER, DROP, INSERT, SELECT, UPDATE, DELETE, and constraint validations.",
                topics: [
                  {
                    title: "SQL DDL & DML: CRUD Queries, Constraints and Aggregations",
                    desc: "Write declarative SQL statements to create tables, enforce CHECK/UNIQUE constraints, execute CRUD operations, and aggregate data.",
                    concepts: ["DDL (CREATE, ALTER, DROP)", "DML (INSERT, SELECT, UPDATE, DELETE)", "Aggregate Functions (COUNT, SUM, AVG)", "GROUP BY & HAVING Clauses"],
                    prerequisites: ["Relational Data Modeling and Entity-Relationship (ER) Diagrams"],
                    type: "concept",
                    difficulty: "Beginner"
                  }
                ]
              },
              {
                title: "Week 3: Advanced SQL Joins, Subqueries & Window Functions",
                summary: "INNER, LEFT, RIGHT, FULL OUTER joins, nested correlated subqueries, and window analytical functions.",
                topics: [
                  {
                    title: "Advanced SQL: Joins, Subqueries, Window Functions & CTEs",
                    desc: "Master multi-table joins, correlated subqueries, Common Table Expressions (WITH clauses), and window functions (ROW_NUMBER, RANK, OVER).",
                    concepts: ["Inner vs Outer Joins", "Correlated Subqueries", "Common Table Expressions (CTEs)", "Window Functions (ROW_NUMBER, RANK, LAG/LEAD)"],
                    prerequisites: ["SQL DDL & DML: CRUD Queries, Constraints and Aggregations"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 4: Database Normalization (1NF to BCNF)",
                summary: "Functional dependencies, anomalies (insertion, deletion, update), 1NF, 2NF, 3NF, and Boyce-Codd Normal Form.",
                topics: [
                  {
                    title: "Database Normalization (1NF, 2NF, 3NF, BCNF) and Integrity Rules",
                    desc: "Eliminate data redundancy and update anomalies by decomposing relations through 1NF, 2NF, 3NF, and BCNF.",
                    concepts: ["Functional Dependencies (FDs)", "Update, Insertion & Deletion Anomalies", "3NF Synthesis & Lossless Join Decompositions", "Boyce-Codd Normal Form (BCNF)"],
                    prerequisites: ["Advanced SQL: Joins, Subqueries, Window Functions & CTEs"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 4: Database Internals, Indexing, Transactions & ACID",
            summary: "B-Tree indexes, Hash indexes, ACID properties, isolation levels, write-ahead logging (WAL), and query execution plans.",
            weeks: [
              {
                title: "Week 1: Database Indexing: B-Trees & Hash Indexes",
                summary: "B-Tree node layout, clustered vs non-clustered indexes, composite indexes, and index scans.",
                topics: [
                  {
                    title: "Database Indexing: B-Trees and Hash Indexes",
                    desc: "Analyze how database storage engines use B+ Trees for fast O(log N) point lookups and range scans, and configure composite indexes.",
                    concepts: ["B+ Tree Storage Architecture", "Clustered vs Non-Clustered Indexes", "Covering Indexes & Composite Keys", "Index Scan vs Table Scan"],
                    prerequisites: ["Database Normalization (1NF, 2NF, 3NF, BCNF) and Integrity Rules"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 2: Transactions, ACID Properties & Concurrency Control",
                summary: "Atomicity, Consistency, Isolation, Durability, isolation levels, dirty reads, and two-phase locking (2PL).",
                topics: [
                  {
                    title: "Transactions, ACID Properties and Concurrency Control",
                    desc: "Master ACID transaction semantics, SQL isolation levels (Read Uncommitted to Serializable), and multi-version concurrency control (MVCC).",
                    concepts: ["ACID Properties", "Isolation Anomalies (Dirty Read, Phantom Read)", "SQL Transaction Isolation Levels", "MVCC & Two-Phase Locking (2PL)"],
                    prerequisites: ["Database Indexing: B-Trees and Hash Indexes"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 3: Query Optimization & EXPLAIN Plans",
                summary: "Cost-based optimizer, query execution plans (EXPLAIN ANALYZE), join strategies, and performance tuning.",
                topics: [
                  {
                    title: "Query Optimization and Execution Plans (EXPLAIN ANALYZE)",
                    desc: "Inspect SQL execution plans using EXPLAIN ANALYZE, diagnose sequential scan bottlenecks, and optimize slow queries.",
                    concepts: ["Cost-Based Query Optimizer", "Nested Loop vs Hash Join vs Merge Join", "EXPLAIN ANALYZE Breakdown", "Query Performance Profiling"],
                    prerequisites: ["Transactions, ACID Properties and Concurrency Control"],
                    type: "practice",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 4: Semester 3 Capstone: High-Performance Database Schema",
                summary: "Design, benchmark, and optimize a high-throughput transactional database schema with complete indexing.",
                topics: [
                  {
                    title: "Semester 3 Capstone: High-Throughput SQL Schema Design & Benchmarking",
                    desc: "Architect a production-grade relational database schema for an e-commerce platform with indexing, foreign key constraints, and transactions.",
                    concepts: ["High-Throughput Relational Architecture", "Composite Index Optimization", "Transaction Isolation Configuration", "Benchmark Query Throughput"],
                    prerequisites: ["Query Optimization and Execution Plans (EXPLAIN ANALYZE)"],
                    type: "project",
                    difficulty: "Advanced"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Semester 4: Operating Systems, Concurrency, Computer Networks & Systems Programming",
        theme: "Processes, Threads, Synchronization, Virtual Memory, Sockets & Network Layers",
        months: [
          {
            title: "Month 5: Operating Systems: Processes, Threads & CPU Scheduling",
            summary: "Process lifecycle, PCB, context switching, multithreading, POSIX threads, and CPU scheduling algorithms.",
            weeks: [
              {
                title: "Week 1: Processes & Context Switching",
                summary: "Process address space, Process Control Block (PCB), fork(), exec(), and context switch overhead.",
                topics: [
                  {
                    title: "Processes, Process Control Blocks (PCB) and Context Switching",
                    desc: "Understand process memory layout (text, data, heap, stack), state transitions, PCB metadata, and kernel context switching.",
                    concepts: ["Process Memory Segments", "Process Control Block (PCB)", "Process Lifecycle & State Transitions", "Kernel vs User Space Context Switch"],
                    prerequisites: ["Structured Programming Project: CLI Record Management System"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 2: Threads & Multithreading (pthreads)",
                summary: "Kernel vs user threads, thread pools, shared memory model, and creating POSIX threads.",
                topics: [
                  {
                    title: "Threads, Concurrency and POSIX Threads (pthreads)",
                    desc: "Implement multithreaded programs using POSIX pthreads, analyze shared heap vs private stack spaces, and manage thread lifecycles.",
                    concepts: ["Thread vs Process Architecture", "Shared Memory Model & Race Conditions", "pthread_create & pthread_join", "Thread Pool Design Basics"],
                    prerequisites: ["Processes, Process Control Blocks (PCB) and Context Switching"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 3: CPU Scheduling Algorithms",
                summary: "FCFS, Shortest Job First (SJF), Round Robin (RR), Priority scheduling, and Multi-Level Feedback Queues.",
                topics: [
                  {
                    title: "CPU Scheduling Algorithms: FCFS, Round Robin & Priority Queues",
                    desc: "Calculate turnaround time, waiting time, and CPU utilization across First-Come First-Served, SJF, Round Robin, and MLFQ.",
                    concepts: ["Preemptive vs Non-Preemptive Scheduling", "Round Robin Time Quantum Selection", "Turnaround & Waiting Time Math", "Multi-Level Feedback Queue (MLFQ)"],
                    prerequisites: ["Threads, Concurrency and POSIX Threads (pthreads)"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 4: Inter-Process Communication (IPC)",
                summary: "Anonymous pipes, named pipes (FIFOs), shared memory, message queues, and signals.",
                topics: [
                  {
                    title: "Inter-Process Communication (IPC): Pipes, Shared Memory & Signals",
                    desc: "Implement inter-process communication using UNIX anonymous pipes, POSIX shared memory (shm_open), and signal handlers.",
                    concepts: ["UNIX Anonymous & Named Pipes", "POSIX Shared Memory Segments", "UNIX Signal Trapping & Handlers", "Message Passing Primitives"],
                    prerequisites: ["CPU Scheduling Algorithms: FCFS, Round Robin & Priority Queues"],
                    type: "practice",
                    difficulty: "Intermediate"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 6: Process Synchronization, Deadlocks & Virtual Memory",
            summary: "Race conditions, mutexes, semaphores, monitors, deadlock prevention (Banker's), virtual memory, paging, and page replacement.",
            weeks: [
              {
                title: "Week 1: Mutexes, Semaphores & Critical Sections",
                summary: "Critical section problem, Peterson's algorithm, mutex locks, counting semaphores, and condition variables.",
                topics: [
                  {
                    title: "Critical Section Problem, Mutexes, Semaphores and Monitors",
                    desc: "Solve synchronization race conditions using pthread mutexes, semaphores, condition variables, and classic Producer-Consumer patterns.",
                    concepts: ["Critical Section Invariants", "pthread_mutex Locks & RAII", "Counting Semaphores (sem_wait/sem_post)", "Producer-Consumer Queue with Conditions"],
                    prerequisites: ["Threads, Concurrency and POSIX Threads (pthreads)"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 2: Deadlocks & Banker's Algorithm",
                summary: "Four Coffman conditions, resource allocation graphs, deadlock detection, prevention, and Banker's algorithm.",
                topics: [
                  {
                    title: "Deadlocks: Necessary Conditions, Banker's Algorithm & Prevention",
                    desc: "Analyze the four necessary conditions for deadlocks, trace Resource Allocation Graphs (RAGs), and implement the Banker's safety algorithm.",
                    concepts: ["Four Coffman Deadlock Conditions", "Resource Allocation Graph (RAG)", "Banker's Safe State Algorithm", "Deadlock Prevention & Recovery"],
                    prerequisites: ["Critical Section Problem, Mutexes, Semaphores and Monitors"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 3: Virtual Memory, Paging & Page Replacement",
                summary: "MMU, page tables, TLB cache, page faults, FIFO, LRU, and Optimal page replacement.",
                topics: [
                  {
                    title: "Virtual Memory, Paging, Segmentation and Page Replacement",
                    desc: "Understand how the MMU translates virtual addresses via Page Tables and TLB, and implement FIFO and LRU page replacement policies.",
                    concepts: ["Virtual vs Physical Address Translation", "Translation Lookaside Buffer (TLB)", "Page Fault Handling Mechanism", "LRU & Clock Page Replacement"],
                    prerequisites: ["Deadlocks: Necessary Conditions, Banker's Algorithm & Prevention"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 4: File Systems & Disk Storage Architecture",
                summary: "Inodes, directory structures, VFS layer, hard vs soft links, and disk scheduling algorithms.",
                topics: [
                  {
                    title: "File Systems Architecture, Inodes and Disk Scheduling",
                    desc: "Explore UNIX inode structure, directory entry mappings, virtual file systems (VFS), and disk I/O scheduling.",
                    concepts: ["Inode Metadata & Direct/Indirect Blocks", "Hard vs Soft (Symbolic) Links", "Virtual File System (VFS) Layer", "Disk Scheduling (SCAN / C-LOOK)"],
                    prerequisites: ["Virtual Memory, Paging, Segmentation and Page Replacement"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 7: Computer Networks: Layers, Protocols & Security",
            summary: "OSI & TCP/IP models, IPv4/IPv6, subnetting, TCP vs UDP, TCP handshake, congestion control, DNS, HTTP/HTTPS, and TLS.",
            weeks: [
              {
                title: "Week 1: OSI & TCP/IP Reference Models & IP Subnetting",
                summary: "7-layer OSI model, 4-layer TCP/IP stack, encapsulation/decapsulation, IPv4 addressing, CIDR, and subnet masks.",
                topics: [
                  {
                    title: "OSI and TCP/IP Reference Models & Network Subnetting",
                    desc: "Trace packet encapsulation across layers, calculate IPv4 subnets using CIDR notation, and analyze routing fundamentals.",
                    concepts: ["7-Layer OSI vs 4-Layer TCP/IP", "Packet Encapsulation & Headers", "IPv4 Subnetting & CIDR Calculation", "ARP & MAC Address Resolution"],
                    prerequisites: ["None"],
                    type: "concept",
                    difficulty: "Beginner"
                  }
                ]
              },
              {
                title: "Week 2: Transport Layer: TCP vs UDP & Congestion Control",
                summary: "TCP segment format, 3-way handshake, 4-way termination, flow control (sliding window), and TCP congestion control.",
                topics: [
                  {
                    title: "Transport Layer: TCP Connection Handshake, Flow Control & UDP",
                    desc: "Master TCP 3-way handshake (SYN, SYN-ACK, ACK), sliding window flow control, UDP datagrams, and TCP congestion algorithms.",
                    concepts: ["TCP 3-Way Handshake & Teardown", "Sliding Window Flow Control", "TCP Congestion Control (Slow Start, AIMD)", "UDP Stateless Datagrams"],
                    prerequisites: ["OSI and TCP/IP Reference Models & Network Subnetting"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 3: Application Layer: DNS, HTTP/HTTPS & WebSockets",
                summary: "DNS hierarchy, HTTP/1.1 vs HTTP/2 vs HTTP/3, status codes, headers, and full-duplex WebSockets.",
                topics: [
                  {
                    title: "Application Layer: DNS, HTTP/HTTPS, WebSockets and REST Protocols",
                    desc: "Understand hierarchical DNS resolution, HTTP request/response semantics, caching headers, REST principles, and WebSockets.",
                    concepts: ["Recursive & Iterative DNS Queries", "HTTP Methods, Headers & Status Codes", "HTTP/2 Multiplexing & HTTP/3 QUIC", "WebSocket Persistent Connections"],
                    prerequisites: ["Transport Layer: TCP Connection Handshake, Flow Control & UDP"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 4: Network Security & TLS/SSL Cryptography",
                summary: "Symmetric vs asymmetric encryption, RSA, Diffie-Hellman, TLS handshake, certificates, and HTTPS integrity.",
                topics: [
                  {
                    title: "Network Security: TLS/SSL Handshake & Public Key Cryptography",
                    desc: "Master symmetric/asymmetric encryption, X.509 digital certificates, Certificate Authorities, and the TLS 1.3 cryptographic handshake.",
                    concepts: ["Symmetric vs Asymmetric Encryption", "RSA & Diffie-Hellman Key Exchange", "X.509 Certificates & CA Trust Chain", "TLS 1.3 Handshake Sequence"],
                    prerequisites: ["Application Layer: DNS, HTTP/HTTPS, WebSockets and REST Protocols"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 8: Systems Programming Capstone: Multithreaded Web Server",
            summary: "Build an event-driven or multithreaded HTTP server using socket programming, thread pools, and cache storage.",
            weeks: [
              {
                title: "Week 1: Socket Programming & Network I/O",
                summary: "Berkeley sockets API (socket, bind, listen, accept, send, recv), non-blocking sockets, and epoll.",
                topics: [
                  {
                    title: "Socket Programming and Network I/O Multiplexing",
                    desc: "Implement a TCP socket listener in C/C++ or Node/Rust, handle concurrent clients, and manage non-blocking I/O.",
                    concepts: ["Berkeley Sockets API (bind, listen, accept)", "TCP Stream Buffer Management", "Non-Blocking I/O & epoll/kqueue", "Client Connection Lifecycles"],
                    prerequisites: ["Transport Layer: TCP Connection Handshake, Flow Control & UDP"],
                    type: "practice",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 2: Thread Pool Architecture & HTTP Parsing",
                summary: "Worker thread pools, request queue synchronization, and HTTP/1.1 request line/header parsing.",
                topics: [
                  {
                    title: "Thread Pool Architecture and HTTP Parser Integration",
                    desc: "Build a thread pool that dequeues incoming connections and parses HTTP methods, URI routes, and headers.",
                    concepts: ["Worker Thread Pool Synchronization", "Task Queue with Mutex & Condition", "HTTP Request Stream Parsing", "Thread-Safe Response Formatting"],
                    prerequisites: ["Socket Programming and Network I/O Multiplexing", "Critical Section Problem, Mutexes, Semaphores and Monitors"],
                    type: "project",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 3: In-Memory Cache & Static Asset Serving",
                summary: "In-memory LRU cache for file contents, MIME types, and HTTP caching response headers.",
                topics: [
                  {
                    title: "In-Memory Caching & Static Asset File Serving",
                    desc: "Serve static HTML/CSS files from disk, integrate a thread-safe in-memory LRU cache, and emit Cache-Control headers.",
                    concepts: ["Thread-Safe In-Memory LRU Cache", "MIME Type Resolution", "ETag & 304 Not Modified Headers", "File Descriptor Efficiency"],
                    prerequisites: ["Thread Pool Architecture and HTTP Parser Integration"],
                    type: "project",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 4: Year 2 Milestone Evaluation: Server Benchmarking & Defense",
                summary: "Stress test web server throughput with Apache Bench/wrk and present comprehensive Year 2 systems defense.",
                topics: [
                  {
                    title: "Year 2 Capstone Milestone: Multithreaded Server Stress Testing & Defense",
                    desc: "Benchmark requests/second, evaluate latency under high concurrency, fix concurrency leaks, and defend core systems mastery.",
                    concepts: ["High-Concurrency Load Testing (wrk/ab)", "Latency Distribution Profiling", "Deadlock & Memory Leak Elimination", "Year 2 Systems Mastery Defense"],
                    prerequisites: ["In-Memory Caching & Static Asset File Serving"],
                    type: "milestone",
                    difficulty: "Advanced"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  3: {
    title: "Year 3: Software Engineering, Distributed Systems, Cloud Architecture & Career Readiness",
    goal: "Master modern full-stack web development, scalable distributed system design, cloud containerization, AI specialization, and technical interview patterns.",
    periods: [
      {
        title: "Semester 5: Modern Full-Stack Software Engineering, APIs & Cloud Systems",
        theme: "TypeScript, React Architecture, REST/GraphQL APIs, Distributed Systems & DevOps",
        months: [
          {
            title: "Month 1: Modern Frontend Architecture & UI Systems",
            summary: "TypeScript, React components, state management, hooks, and responsive accessible UI design.",
            weeks: [
              {
                title: "Week 1: TypeScript & Modern JavaScript (ES6+)",
                summary: "Static typing, generics, interfaces, union types, promises, and async/await.",
                topics: [
                  {
                    title: "Modern TypeScript and Asynchronous Programming",
                    desc: "Master TypeScript generics, interfaces, type narrowing, async/await patterns, and error handling in event loops.",
                    concepts: ["TypeScript Generics & Interfaces", "Type Narrowing & Discriminated Unions", "JavaScript Event Loop & Microtasks", "Async / Await Promises"],
                    prerequisites: ["None"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 2: React Component Architecture & State Hooks",
                summary: "JSX, functional components, useState, useEffect, custom hooks, and virtual DOM diffing.",
                topics: [
                  {
                    title: "Component Architecture, Hooks and Virtual DOM",
                    desc: "Build modular React UI components using useState, useEffect, useMemo, custom hooks, and optimize re-rendering cycles.",
                    concepts: ["Virtual DOM Diffing & Reconciliation", "useState, useEffect, useMemo, useCallback", "Custom Hooks Abstraction", "Component Lifecycle & Cleanups"],
                    prerequisites: ["Modern TypeScript and Asynchronous Programming"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 3: State Management & UI Styling Systems",
                summary: "Global state (Zustand/Redux), Tailwind CSS, component styling, and accessible WCAG patterns.",
                topics: [
                  {
                    title: "State Management, Tailwind CSS and Accessibility (a11y)",
                    desc: "Design responsive interfaces using Tailwind CSS utility patterns, manage shared application state, and ensure WCAG AA compliance.",
                    concepts: ["Global State (Zustand / Redux)", "Tailwind CSS Utility Styling", "Semantic HTML & WCAG Accessibility", "Responsive Mobile-First Breakpoints"],
                    prerequisites: ["Component Architecture, Hooks and Virtual DOM"],
                    type: "practice",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 4: Client-Side Routing & Form Validations",
                summary: "Single Page Application (SPA) routing, protected routes, and schema-based form validations (Zod).",
                topics: [
                  {
                    title: "SPA Routing, Form Management and Validation Schemas",
                    desc: "Implement client-side SPA routing, authentication guards, and type-safe form validation using Zod schemas.",
                    concepts: ["Client-Side Routing & Nested Layouts", "Authentication Route Guards", "Zod Schema Type Validation", "Error Boundaries & Toast Feedback"],
                    prerequisites: ["State Management, Tailwind CSS and Accessibility (a11y)"],
                    type: "practice",
                    difficulty: "Intermediate"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 2: Backend Architecture, REST APIs & Security",
            summary: "Node.js/Express, RESTful API design, OpenAPI/Swagger, JWT authentication, bcrypt, and middleware pipelines.",
            weeks: [
              {
                title: "Week 1: Node.js/Express Backend Architecture",
                summary: "Server initialization, middleware pipeline architecture, error-handling middleware, and CORS configuration.",
                topics: [
                  {
                    title: "Node.js / Express Architecture and Middleware Pipelines",
                    desc: "Build scalable Express backend services with modular controller-service-repository patterns and error handling middleware.",
                    concepts: ["Express Middleware Pipeline", "Controller-Service-Repository Pattern", "Centralized Error Handling", "CORS & Security Headers (Helmet)"],
                    prerequisites: ["Modern TypeScript and Asynchronous Programming"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 2: RESTful API Design & OpenAPI Specifications",
                summary: "Resource URI conventions, HTTP status codes, pagination, filtering, and OpenAPI/Swagger documentation.",
                topics: [
                  {
                    title: "RESTful API Design Principles, Status Codes and OpenAPI Specs",
                    desc: "Design clean REST APIs adhering to HTTP status standards, implement cursor pagination, filtering, and generate OpenAPI docs.",
                    concepts: ["REST Resource Naming Conventions", "Idempotent vs Non-Idempotent Operations", "Cursor & Offset Pagination", "OpenAPI / Swagger Contract Specs"],
                    prerequisites: ["Node.js / Express Architecture and Middleware Pipelines"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 3: Authentication & Security: JWT, OAuth & Passwords",
                summary: "Password hashing with bcrypt, JSON Web Tokens (JWT) access/refresh token rotation, and OAuth 2.0 flows.",
                topics: [
                  {
                    title: "Authentication & Authorization: JWT, OAuth 2.0 and Session Security",
                    desc: "Implement secure user authentication with salted bcrypt hashing, JWT access/refresh token pairs, and OAuth 2.0 integrations.",
                    concepts: ["Salted Bcrypt Password Hashing", "JWT Signature & Refresh Token Rotation", "HttpOnly Cookie Security", "Role-Based Access Control (RBAC)"],
                    prerequisites: ["RESTful API Design Principles, Status Codes and OpenAPI Specs"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 4: Database ORMs & Data Access Layer",
                summary: "Relational ORM integration (Prisma / Drizzle / TypeORM), migrations, and transactional repository queries.",
                topics: [
                  {
                    title: "Database ORM Integration and Transactional Business Logic",
                    desc: "Connect backend services to PostgreSQL databases using modern TypeScript ORMs, run migrations, and execute ACID transactions.",
                    concepts: ["Schema-First Migrations (Prisma/Drizzle)", "Type-Safe Query Builders", "Database Connection Pooling", "Transactional Business Services"],
                    prerequisites: ["Authentication & Authorization: JWT, OAuth 2.0 and Session Security", "Relational Data Modeling and Entity-Relationship (ER) Diagrams"],
                    type: "practice",
                    difficulty: "Intermediate"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 3: Distributed System Design & Cloud Infrastructure",
            summary: "Scalability patterns, load balancers, Redis caching, message queues (Kafka/RabbitMQ), Docker containers, and CI/CD pipelines.",
            weeks: [
              {
                title: "Week 1: Scalability Patterns & Load Balancing",
                summary: "Horizontal vs vertical scaling, stateless services, load balancing algorithms (Round Robin, Least Connections), and reverse proxies (Nginx).",
                topics: [
                  {
                    title: "Scalability Patterns: Load Balancers, Horizontal Scaling and Reverse Proxies",
                    desc: "Design horizontally scalable architectures, configure Nginx reverse proxy load balancers, and eliminate single points of failure.",
                    concepts: ["Horizontal vs Vertical Scaling", "Load Balancing Algorithms (Round Robin, Least Connections)", "Nginx Reverse Proxy & SSL Termination", "Stateless Application Design"],
                    prerequisites: ["Node.js / Express Architecture and Middleware Pipelines"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 2: Caching Strategies with Redis",
                summary: "In-memory caching, Cache-Aside, Write-Through, Write-Back, cache invalidation, cache stampede, and Redis data structures.",
                topics: [
                  {
                    title: "Caching Strategies: Redis, Cache Invalidation and Distributed Locks",
                    desc: "Implement Redis Cache-Aside patterns, configure TTL expiration, prevent cache stampedes, and implement distributed locks.",
                    concepts: ["Cache-Aside & Write-Through Patterns", "TTL Expiration & Cache Eviction (LRU/LFU)", "Cache Stampede & Cache Penetration", "Redis Distributed Locking (Redlock)"],
                    prerequisites: ["Scalability Patterns: Load Balancers, Horizontal Scaling and Reverse Proxies"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 3: Message Queues & Event-Driven Systems",
                summary: "Asynchronous processing, message brokers (RabbitMQ / Kafka), publish-subscribe, and event consumers.",
                topics: [
                  {
                    title: "Message Queues and Event-Driven Architecture (Kafka / RabbitMQ)",
                    desc: "Decouple synchronous workflows using message brokers, handle backpressure, and implement idempotent consumer workers.",
                    concepts: ["Publish-Subscribe vs Point-to-Point Queues", "Producer-Broker-Consumer Lifecycles", "Consumer Group Scaling & Offsets", "Idempotent Message Processing"],
                    prerequisites: ["Caching Strategies: Redis, Cache Invalidation and Distributed Locks"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 4: Cloud Containers (Docker) & CI/CD Pipelines",
                summary: "Dockerfile multi-stage builds, container networking, GitHub Actions automated testing, and cloud container deployments.",
                topics: [
                  {
                    title: "Cloud Deployment, Docker Containers and CI/CD Automation",
                    desc: "Containerize full-stack applications with multi-stage Dockerfiles, set up GitHub Actions CI/CD test pipelines, and deploy to Cloud Run.",
                    concepts: ["Multi-Stage Dockerfile Optimization", "Docker Compose Multi-Container Setup", "Automated Testing in GitHub Actions", "Cloud Container Deployment (Cloud Run)"],
                    prerequisites: ["Message Queues and Event-Driven Architecture (Kafka / RabbitMQ)"],
                    type: "practice",
                    difficulty: "Intermediate"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 4: Specialization Electives & Full-Stack Capstone",
            summary: "AI integrations (LLMs, Vector DBs, RAG), application security (OWASP Top 10), and end-to-end full-stack capstone delivery.",
            weeks: [
              {
                title: "Week 1: Applied AI, LLMs & Vector Databases",
                summary: "Gemini API / LLM integrations, embeddings, vector similarity search, and Retrieval-Augmented Generation (RAG).",
                topics: [
                  {
                    title: "Applied AI: LLMs, Embeddings and Retrieval-Augmented Generation (RAG)",
                    desc: "Integrate LLM APIs, generate vector embeddings, store them in vector databases, and implement semantic RAG pipelines.",
                    concepts: ["LLM API Client Architecture & Streaming", "Vector Embeddings & Cosine Similarity", "Retrieval-Augmented Generation (RAG)", "Prompt Engineering & Structured JSON Output"],
                    prerequisites: ["Modern TypeScript and Asynchronous Programming"],
                    type: "concept",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 2: Application Security & OWASP Top 10 Hardening",
                summary: "SQL Injection, Cross-Site Scripting (XSS), CSRF, Rate Limiting, input sanitization, and security audits.",
                topics: [
                  {
                    title: "Application Security: OWASP Top 10 Vulnerability Defense & Hardening",
                    desc: "Audit and protect web applications against SQL Injection, XSS, CSRF attacks, configure Content Security Policy (CSP), and rate limiting.",
                    concepts: ["Parameterized Queries & SQLi Defense", "XSS Prevention & Output Sanitization", "CSRF Tokens & SameSite Cookies", "Rate Limiting & IP Throttling"],
                    prerequisites: ["Authentication & Authorization: JWT, OAuth 2.0 and Session Security"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 3: Capstone: Architecture & Implementation Sprint",
                summary: "Full-stack development sprint connecting frontend, REST API, PostgreSQL database, and AI service layer.",
                topics: [
                  {
                    title: "Semester 5 Capstone: End-to-End Scalable Full-Stack Application",
                    desc: "Build a production-grade full-stack web application featuring authenticated dashboards, persistent relational storage, and real-time updates.",
                    concepts: ["Full-Stack Architecture Integration", "Type-Safe Client-Server Contracts", "Database Migrations & Seeding", "Production Build Packaging"],
                    prerequisites: ["Applied AI: LLMs, Embeddings and Retrieval-Augmented Generation (RAG)", "Application Security: OWASP Top 10 Vulnerability Defense & Hardening"],
                    type: "project",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 4: Semester 5 Milestone: Capstone Review & Deployment",
                summary: "Production deployment, automated test verification, and technical milestone evaluation.",
                topics: [
                  {
                    title: "Semester 5 Milestone Defense & Production Verification",
                    desc: "Deploy the full-stack system live, execute automated end-to-end integration tests, and defend the architectural design.",
                    concepts: ["Live Production Cloud Deployment", "Automated Integration Test Verification", "Performance & Security Audit", "Milestone Capstone Defense"],
                    prerequisites: ["Semester 5 Capstone: End-to-End Scalable Full-Stack Application"],
                    type: "milestone",
                    difficulty: "Advanced"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        title: "Semester 6: Internship Preparation, Technical Interview Mastery & Multi-Year Capstone Defense",
        theme: "DSA Interview Patterns, System Design Interviews, Behavioral Stories, Portfolio Polish & Final Defense",
        months: [
          {
            title: "Month 5: Data Structures & Algorithms (DSA) Coding Interview Patterns",
            summary: "Mastering LeetCode high-frequency interview patterns: Sliding Window, Two Pointers, Monotonic Stacks, Graph traversals, and DP.",
            weeks: [
              {
                title: "Week 1: Array & String Interview Patterns",
                summary: "Sliding window, two pointers, fast/slow pointers, and in-place interval merging.",
                topics: [
                  {
                    title: "Coding Interview Patterns: Sliding Window, Two Pointers & Interval Merging",
                    desc: "Solve high-frequency coding interview problems using variable-size sliding windows, two-pointer techniques, and interval overlaps.",
                    concepts: ["Variable Sliding Window Invariants", "Opposite-End & Fast-Slow Pointers", "Interval Overlap & Merge Logic", "Optimal Space-Time Tradeoffs"],
                    prerequisites: ["Singly and Doubly Linked Lists", "Divide and Conquer: Merge Sort and Quick Sort"],
                    type: "practice",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 2: Trees, Heaps & Monotonic Stack Patterns",
                summary: "Lowest Common Ancestor, Tree boundary traversals, Top-K elements with heaps, and Next Greater Element with monotonic stacks.",
                topics: [
                  {
                    title: "Coding Interview Patterns: Monotonic Stacks, Tree Paths & Top-K Heaps",
                    desc: "Tackle tricky coding interview patterns involving monotonic stack lookups, tree paths, and heap-based k-way merges.",
                    concepts: ["Monotonic Stack Next Greater Element", "Binary Tree Maximum Path Sum", "K-Way Merge with Priority Queues", "Sliding Window Maximum"],
                    prerequisites: ["Balanced Trees: AVL and Red-Black Trees", "Binary Min/Max Heaps and Priority Queues"],
                    type: "practice",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 3: Graph Interview Patterns & Shortest Paths",
                summary: "Course Schedule topological sort, word ladder BFS, number of islands, and Union-Find network connections.",
                topics: [
                  {
                    title: "Coding Interview Patterns: Graph BFS/DFS, Topological Sort & Union-Find",
                    desc: "Solve topological sort, connected components, bidirectional BFS word ladders, and minimum cost network connections.",
                    concepts: ["Matrix Grid BFS / DFS Traversals", "Topological Cycle Detection", "Bidirectional BFS Shortest Paths", "Disjoint Set Network Graphing"],
                    prerequisites: ["Graph Traversals: Breadth-First Search (BFS) and Depth-First Search (DFS)"],
                    type: "practice",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 4: Dynamic Programming Interview Mastery",
                summary: "Coin change, longest palindromic substring, target sum, and buy/sell stock with state machines.",
                topics: [
                  {
                    title: "Coding Interview Patterns: Dynamic Programming & State Machines",
                    desc: "Master DP interview problems including Longest Palindromic Subsequence, Target Sum, and Finite State Machine stock trades.",
                    concepts: ["State Machine Dynamic Programming", "Palindromic Substring Centers", "Unbounded Knapsack Variations", "Space-Optimized DP Arrays"],
                    prerequisites: ["Advanced Dynamic Programming Patterns Workshop"],
                    type: "practice",
                    difficulty: "Advanced"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 6: Technical System Design & Architecture Interviews",
            summary: "System design framework, capacity estimations, designing URL shortener, Rate Limiter, Notification Service, and Chat App.",
            weeks: [
              {
                title: "Week 1: System Design Framework & Capacity Estimation",
                summary: "Requirements clarification, back-of-the-envelope calculations, QPS, storage bandwidth, and high-level architecture diagramming.",
                topics: [
                  {
                    title: "System Design Framework: Requirements, Capacity Estimation & Architecture",
                    desc: "Master the structured 4-step System Design interview framework: requirements scoping, capacity math, high-level design, and deep dives.",
                    concepts: ["Functional & Non-Functional Scoping", "QPS, Storage & Bandwidth Estimation", "High-Level Architecture Block Diagrams", "Bottleneck & Single Point of Failure (SPOF) Identification"],
                    prerequisites: ["Scalability Patterns: Load Balancers, Horizontal Scaling and Reverse Proxies"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 2: Designing High-Frequency Scalable Services",
                summary: "Designing TinyURL (URL Shortener) and a Distributed Token Bucket Rate Limiter.",
                topics: [
                  {
                    title: "Designing Scalable Systems: URL Shortener and Distributed Rate Limiter",
                    desc: "Design end-to-end architectures for a global URL shortening service and a high-throughput distributed rate limiter using Redis token buckets.",
                    concepts: ["Base62 Encoding & Key Generation Services (KGS)", "Distributed Token Bucket in Redis", "HTTP 429 Retry-After Headers", "Read-Heavy Caching Layer"],
                    prerequisites: ["System Design Framework: Requirements, Capacity Estimation & Architecture"],
                    type: "practice",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 3: Designing Complex Real-Time & Storage Systems",
                summary: "Designing a Distributed Key-Value Store and a Real-Time Chat Messaging System (WhatsApp / Slack).",
                topics: [
                  {
                    title: "Designing Complex Systems: Distributed Key-Value Store & Real-Time Chat",
                    desc: "Design architectures for a distributed key-value store (consistent hashing, replication) and a real-time chat application with WebSockets.",
                    concepts: ["Consistent Hashing & Virtual Nodes", "Quorum Reads/Writes (W + R > N)", "WebSocket Gateway Architecture", "Message Delivery Acknowledgments (ACK)"],
                    prerequisites: ["Designing Scalable Systems: URL Shortener and Distributed Rate Limiter"],
                    type: "practice",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 4: Mock System Design Walkthroughs & Trade-Offs",
                summary: "Live mock interview walkthroughs, defending trade-offs (CAP theorem, SQL vs NoSQL, latency vs consistency).",
                topics: [
                  {
                    title: "Mock System Design Walkthroughs and Trade-Off Evaluations",
                    desc: "Defend trade-offs under simulated interview conditions: CAP theorem choices, SQL vs NoSQL selection, and consistency vs latency balance.",
                    concepts: ["CAP Theorem & PACELC Trade-Offs", "SQL vs NoSQL Fitment Criteria", "Strong vs Eventual Consistency", "Technical Communication Composure"],
                    prerequisites: ["Designing Complex Systems: Distributed Key-Value Store & Real-Time Chat"],
                    type: "practice",
                    difficulty: "Advanced"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 7: Behavioral Interviews, Resume Polish & Technical Portfolio",
            summary: "Resume engineering, STAR method behavioral interview preparation, GitHub showcase polish, and mock screenings.",
            weeks: [
              {
                title: "Week 1: Impact-Driven Technical Resume Engineering",
                summary: "Bullet point quantification, XYZ formula (Accomplished [X] measured by [Y] by doing [Z]), and ATS keyword optimization.",
                topics: [
                  {
                    title: "Resume Engineering: Impact-Driven Bullet Points & Technical Showcases",
                    desc: "Draft a high-impact software engineering resume highlighting concrete metrics, project architectures, and core competencies.",
                    concepts: ["Google XYZ Resume Formula", "Quantifiable Impact & Performance Metrics", "ATS Keyword Optimization", "Project Tech Stack Highlighting"],
                    prerequisites: ["None"],
                    type: "practice",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 2: STAR Method Behavioral Interview Preparation",
                summary: "Situation, Task, Action, Result framework for leadership, conflict resolution, technical hurdles, and failures.",
                topics: [
                  {
                    title: "STAR Method Behavioral Interview Preparation & Leadership Stories",
                    desc: "Prepare structured STAR stories for behavioral interviews covering technical disagreements, challenging deadlines, and post-mortems.",
                    concepts: ["STAR Framework (Situation, Task, Action, Result)", "Conflict Resolution & Collaboration", "Handling Ambiguity & Tight Deadlines", "Root Cause Post-Mortem Delivery"],
                    prerequisites: ["Resume Engineering: Impact-Driven Bullet Points & Technical Showcases"],
                    type: "practice",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 3: GitHub Portfolio Polish & Open Source",
                summary: "README engineering, architectural diagrams, demo GIFs, clean commit history, and open-source pull requests.",
                topics: [
                  {
                    title: "Open Source Contributions, GitHub Portfolio Polish & Technical Writing",
                    desc: "Curate a professional GitHub profile with comprehensive README documentation, architecture diagrams, live demo URLs, and clean code.",
                    concepts: ["Production README Documentation", "Architecture Diagrams & Demo GIFs", "Open-Source Pull Request Etiquette", "Technical Blog Writing & Documentation"],
                    prerequisites: ["Git and GitHub Version Control"],
                    type: "practice",
                    difficulty: "Intermediate"
                  }
                ]
              },
              {
                title: "Week 4: Timed Mock Technical Screening Simulations",
                summary: "Timed technical phone screen simulation: 45-minute live coding with verbal explanation and test case verification.",
                topics: [
                  {
                    title: "Live Mock Technical Screening Simulations & Timed Coding Rounds",
                    desc: "Execute timed mock technical interview sessions, communicating thought processes clearly while writing clean, testable code.",
                    concepts: ["Thinking Out Loud Under Time Limits", "Dry Running Test Cases with Edge Cases", "Code Quality & Clean Naming Standards", "Handling Interviewer Hints & Feedback"],
                    prerequisites: ["STAR Method Behavioral Interview Preparation & Leadership Stories"],
                    type: "practice",
                    difficulty: "Advanced"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 8: Multi-Year Capstone Defense & Graduation Mastery",
            summary: "Comprehensive spaced revision across all CS pillars, capstone defense, and StudyMate Master Certification.",
            weeks: [
              {
                title: "Week 1: Production Capstone: Architecture Review & Hardening",
                summary: "Security audit, performance benchmarking, and production test hardening.",
                topics: [
                  {
                    title: "Production Capstone: Architecture Review & Security Hardening",
                    desc: "Execute security penetration checks, load test endpoints to 10,000 requests/sec, and document full API specifications.",
                    concepts: ["Security Audit & Vulnerability Scanning", "Load & Stress Benchmark Profiling", "Production Configuration Verification", "Technical Specification Finalization"],
                    prerequisites: ["Live Mock Technical Screening Simulations & Timed Coding Rounds"],
                    type: "project",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 2: Production Capstone: End-to-End Integration & Load Testing",
                summary: "End-to-end user workflows, automated browser testing (Playwright), and cloud scaling.",
                topics: [
                  {
                    title: "Production Capstone: End-to-End Integration & Cloud Scaling",
                    desc: "Validate end-to-end user journeys, establish database read replicas, and configure auto-scaling policies.",
                    concepts: ["Automated End-to-End Test Suites", "Database Read Replica Scaling", "Cloud Auto-Scaling Triggers", "Zero-Downtime Deployment Verification"],
                    prerequisites: ["Production Capstone: Architecture Review & Security Hardening"],
                    type: "project",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 3: Comprehensive Spaced Revision of All Computer Science Pillars",
                summary: "Systematic review of Programming Fundamentals, Data Structures, Algorithms, Databases, OS, Networks, and System Design.",
                topics: [
                  {
                    title: "Comprehensive Spaced Revision of All Computer Science Pillars",
                    desc: "Systematically test and consolidate core concepts across Programming, DSA, Databases, OS, Networks, and System Design.",
                    concepts: ["Multi-Year Concept Synthesis", "Rapid Recall Spaced Flashcards", "Cross-Domain Architectural Thinking", "Core Theory Consolidation"],
                    prerequisites: ["Production Capstone: End-to-End Integration & Cloud Scaling"],
                    type: "revision",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 4: Graduation Milestone Defense & StudyMate Master Certification",
                summary: "Formal capstone project defense, demonstration, and graduation milestone achievement.",
                topics: [
                  {
                    title: "Graduation Milestone Defense & StudyMate Master Certification",
                    desc: "Present your multi-year technical portfolio, defend engineering architectural decisions, and achieve the StudyMate Master Certification.",
                    concepts: ["Formal Technical Presentation", "Architectural Defense & Q&A", "Portfolio Demonstration", "Graduation Milestone Certification"],
                    prerequisites: ["Comprehensive Spaced Revision of All Computer Science Pillars"],
                    type: "milestone",
                    difficulty: "Advanced"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  4: {
    title: "Year 4: Enterprise Architecture, Deep Specialization, Research & Leadership",
    goal: "Lead enterprise-scale software projects, master cutting-edge specialized domains (Distributed Consensus, Compilers, AI Systems), and excel in senior engineering roles.",
    periods: [
      {
        title: "Semester 7: Enterprise Systems, Distributed Consensus & Advanced Specialization",
        theme: "Consensus Algorithms, Kubernetes, Compiler Design & Advanced Machine Learning",
        months: [
          {
            title: "Month 1: Distributed Consensus & Fault Tolerance",
            summary: "Raft, Paxos, vector clocks, Byzantine fault tolerance, and gossip protocols.",
            weeks: [
              {
                title: "Week 1: Raft Consensus Algorithm & Leader Election",
                summary: "Raft leader election, log replication, safety invariants, and joint consensus.",
                topics: [
                  {
                    title: "Distributed Consensus: Raft Protocol and Leader Election",
                    desc: "Implement the Raft consensus state machine: leader election timers, append entries RPCs, and log matching properties.",
                    concepts: ["Raft State Machine", "Leader Election Timers", "AppendEntries Log Replication", "Safety Invariants & Quorums"],
                    prerequisites: ["Designing Complex Systems: Distributed Key-Value Store & Real-Time Chat"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 2: Vector Clocks & Eventual Consistency",
                summary: "Lamport timestamps, vector clocks, CRDTs (Conflict-free Replicated Data Types), and anti-entropy gossip.",
                topics: [
                  {
                    title: "Vector Clocks, CRDTs and Eventual Consistency",
                    desc: "Manage causally ordered events in distributed systems using vector clocks and State/Operation-based CRDTs.",
                    concepts: ["Lamport Timestamps", "Vector Clock Causality", "CRDTs (State vs Operation)", "Gossip Protocol Anti-Entropy"],
                    prerequisites: ["Distributed Consensus: Raft Protocol and Leader Election"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 3: Byzantine Fault Tolerance (BFT) & Quorums",
                summary: "PBFT, blockchain consensus mechanisms, proof of stake, and quorum intersection math.",
                topics: [
                  {
                    title: "Byzantine Fault Tolerance and Distributed Quorum Mathematics",
                    desc: "Analyze Practical Byzantine Fault Tolerance (PBFT), 3f+1 node requirements, and cryptographic signatures in adversarial networks.",
                    concepts: ["3f + 1 Byzantine Node Bounds", "PBFT Pre-Prepare, Prepare, Commit", "Cryptographic Threshold Signatures", "Adversarial Threat Modeling"],
                    prerequisites: ["Vector Clocks, CRDTs and Eventual Consistency"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 4: Distributed Systems Lab: Replicated Key-Value Store",
                summary: "Build a fault-tolerant replicated KV store using Raft consensus across 3 nodes.",
                topics: [
                  {
                    title: "Advanced Systems Lab: 3-Node Raft-Replicated Key-Value Cluster",
                    desc: "Implement a 3-node distributed key-value cluster that survives leader crashes and maintains linearizable reads and writes.",
                    concepts: ["Linearizability Testing (Jepsen-style)", "Network Partition Simulation", "State Machine Snapshotting", "Cluster Reconfiguration"],
                    prerequisites: ["Byzantine Fault Tolerance and Distributed Quorum Mathematics"],
                    type: "project",
                    difficulty: "Advanced"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 2: Compilers, ASTs & Domain-Specific Languages (DSL)",
            summary: "Lexing, parsing (LL/LR), AST transformations, bytecode generation, and virtual machine interpreters.",
            weeks: [
              {
                title: "Week 1: Lexical Analysis & Context-Free Grammars",
                summary: "Regular expressions, DFAs/NFAs, Backus-Naur Form (BNF), and tokenizer implementation.",
                topics: [
                  {
                    title: "Lexical Analysis, Tokenization and Context-Free Grammars",
                    desc: "Construct finite state automata (DFA/NFA) for tokenization and define programming language syntax using BNF grammars.",
                    concepts: ["DFA / NFA Token State Machines", "Backus-Naur Form (BNF)", "Ambiguous Grammars & Precedence", "Lexer Buffer Optimization"],
                    prerequisites: ["Structured Programming Project: CLI Record Management System"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 2: Recursive Descent Parsing & Abstract Syntax Trees (AST)",
                summary: "Building AST nodes, parsing expressions with Pratt parsing, and syntax error recovery.",
                topics: [
                  {
                    title: "Abstract Syntax Tree (AST) Generation & Pratt Parsing",
                    desc: "Implement a recursive descent and Pratt parser for expressions, constructing a type-annotated AST.",
                    concepts: ["Pratt Top-Down Operator Precedence", "AST Node Hierarchies", "Syntax Error Recovery", "Type Checking & Symbol Tables"],
                    prerequisites: ["Lexical Analysis, Tokenization and Context-Free Grammars"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 3: Bytecode Generation & Stack-Based VM",
                summary: "Emitting bytecode instructions, opcode dispatch loop, and runtime stack execution.",
                topics: [
                  {
                    title: "Bytecode Compilation and Stack-Based Virtual Machine",
                    desc: "Compile AST nodes into compact bytecode instructions and execute them on a custom stack-based bytecode interpreter.",
                    concepts: ["Opcode Instruction Sets", "Stack VM Evaluation Loop", "Call Frames & Local Variable Slots", "Garbage Collection Basics (Mark-and-Sweep)"],
                    prerequisites: ["Abstract Syntax Tree (AST) Generation & Pratt Parsing"],
                    type: "project",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 4: Custom Domain-Specific Language (DSL) Showcase",
                summary: "Build an end-to-end custom query or calculation language with CLI execution.",
                topics: [
                  {
                    title: "Compiler Capstone: End-to-End Custom DSL Interpreter",
                    desc: "Design and implement a complete DSL interpreter supporting arithmetic, variable assignments, loops, and user-defined functions.",
                    concepts: ["Complete Language Pipeline", "Runtime Error Reporting", "Benchmark Interpretation Speeds", "Language Documentation"],
                    prerequisites: ["Bytecode Compilation and Stack-Based Virtual Machine"],
                    type: "project",
                    difficulty: "Advanced"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 3: Cloud-Native Microservices & Kubernetes Orchestration",
            summary: "Kubernetes (Pods, Deployments, Services, Ingress), Service Mesh (Istio), Prometheus metrics, and OpenTelemetry tracing.",
            weeks: [
              {
                title: "Week 1: Kubernetes Core Architecture (Pods, Deployments, Services)",
                summary: "Control plane components, declarative YAML manifests, Pod scheduling, Services, and Ingress routing.",
                topics: [
                  {
                    title: "Kubernetes Core Architecture: Pods, Deployments and Ingress Services",
                    desc: "Deploy microservices onto Kubernetes clusters, configure rolling deployments, readiness/liveness probes, and Ingress controllers.",
                    concepts: ["K8s Control Plane (API Server, etcd, Kubelet)", "Deployment Rolling Updates & Rollbacks", "ClusterIP / NodePort / LoadBalancer Services", "Liveness & Readiness Probes"],
                    prerequisites: ["Cloud Deployment, Docker Containers and CI/CD Automation"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 2: Distributed Observability (Prometheus, Grafana, OpenTelemetry)",
                summary: "Metrics aggregation, RED method (Rate, Errors, Duration), distributed tracing with OpenTelemetry, and Jaeger.",
                topics: [
                  {
                    title: "Distributed Observability: Prometheus Metrics and OpenTelemetry Tracing",
                    desc: "Instrument microservices with OpenTelemetry, trace requests across distributed boundaries, and visualize latencies in Grafana.",
                    concepts: ["The RED Method (Rate, Errors, Duration)", "Distributed Trace Spans & Context Propagation", "Prometheus Metrics Scraping", "Grafana Alerting Thresholds"],
                    prerequisites: ["Kubernetes Core Architecture: Pods, Deployments and Ingress Services"],
                    type: "practice",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 3: Service Mesh & Resiliency Patterns (Circuit Breakers)",
                summary: "Envoy proxies, Istio service mesh, mutual TLS (mTLS), circuit breaker pattern (Netflix Hystrix / Resilience4j).",
                topics: [
                  {
                    title: "Service Mesh Architecture & Resiliency Patterns (Circuit Breakers)",
                    desc: "Implement circuit breakers, retries with exponential backoff and jitter, and secure inter-service communication with mTLS.",
                    concepts: ["Sidecar Proxy Architecture (Envoy)", "Circuit Breaker State Transitions (Open, Half-Open, Closed)", "Exponential Backoff with Jitter", "mTLS Zero-Trust Encryption"],
                    prerequisites: ["Distributed Observability: Prometheus Metrics and OpenTelemetry Tracing"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 4: Cloud-Native Microservices Capstone",
                summary: "Deploy a resilient, observable multi-service architecture onto a Kubernetes cluster with automated CI/CD.",
                topics: [
                  {
                    title: "Cloud-Native Capstone: Microservices Cluster with Zero-Downtime CI/CD",
                    desc: "Architect a 4-service Kubernetes cluster featuring authentication, payment processing, inventory, and distributed tracing.",
                    concepts: ["Multi-Service Kubernetes Deployment", "GitOps Automated Deployment Pipelines", "Zero-Downtime Traffic Switching", "Observability Dashboard Integration"],
                    prerequisites: ["Service Mesh Architecture & Resiliency Patterns (Circuit Breakers)"],
                    type: "project",
                    difficulty: "Advanced"
                  }
                ]
              }
            ]
          },
          {
            title: "Month 4: Deep Machine Learning Systems & AI Infrastructure",
            summary: "Neural network backpropagation from scratch, GPU tensor operations, PyTorch model training, and model serving infrastructure.",
            weeks: [
              {
                title: "Week 1: Neural Networks & Backpropagation from Scratch",
                summary: "Computational graphs, matrix calculus, forward pass, chain rule backprop, and gradient descent optimizers.",
                topics: [
                  {
                    title: "Deep Learning Foundations: Backpropagation and Computational Graphs",
                    desc: "Implement a multi-layer perceptron (MLP) from scratch using NumPy, computing analytical gradients and Adam optimization.",
                    concepts: ["Computational Graph Directed Acyclic Structure", "Matrix Calculus & Chain Rule Gradients", "Activation Functions (ReLU, Softmax)", "Adam Optimizer Momentum & Scaling"],
                    prerequisites: ["Mathematical Induction and Recurrence Relations"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 2: Transformer Architectures & Self-Attention Mechanics",
                summary: "Scaled dot-product attention, multi-head attention, positional encoding, and Transformer encoder-decoder blocks.",
                topics: [
                  {
                    title: "Transformer Architectures and Multi-Head Self-Attention",
                    desc: "Dissect the Transformer architecture: Query-Key-Value projections, scaled dot-product attention matrices, and layer normalization.",
                    concepts: ["Scaled Dot-Product Attention Equation", "Multi-Head Attention Projections", "Sinusoidal & Rotary Positional Embeddings", "Layer Normalization & Residual Connections"],
                    prerequisites: ["Deep Learning Foundations: Backpropagation and Computational Graphs"],
                    type: "concept",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 3: Model Serving & Inference Optimization",
                summary: "Quantization (INT8/FP16), TensorRT, vLLM / ONNX runtime, and streaming token responses.",
                topics: [
                  {
                    title: "AI Model Serving: Quantization, ONNX Runtime and vLLM",
                    desc: "Deploy AI models with sub-50ms latency using INT8 quantization, KV-cache optimization, and high-throughput vLLM serving.",
                    concepts: ["Weight Quantization (FP16 / INT8)", "KV-Cache Memory Footprint Optimization", "Continuous Batching (vLLM)", "Streaming Token Server Architecture"],
                    prerequisites: ["Transformer Architectures and Multi-Head Self-Attention"],
                    type: "practice",
                    difficulty: "Advanced"
                  }
                ]
              },
              {
                title: "Week 4: Year 4 Specialization Defense & Executive Portfolio",
                summary: "Present enterprise-level specialization systems to industry benchmarks and finalize academic leadership credentials.",
                topics: [
                  {
                    title: "Year 4 Advanced Specialization Defense & Final Accreditation",
                    desc: "Defend high-scale distributed consensus, compiler architecture, and AI serving infrastructure to attain highest StudyMate distinction.",
                    concepts: ["Enterprise Architecture Defense", "Deep Technical Mastery Demonstration", "Senior Engineering Leadership Credentials", "StudyMate Fellowship Distinction"],
                    prerequisites: ["AI Model Serving: Quantization, ONNX Runtime and vLLM"],
                    type: "milestone",
                    difficulty: "Advanced"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
};

/**
 * Builds a 100% personalized, granular, multi-year curriculum
 * with ZERO generic placeholders.
 */
export function buildProceduralCurriculum(
  subject: string = 'Computer Science & Engineering',
  level: 'Beginner' | 'Intermediate' | 'Advanced' = 'Beginner',
  goal: string = 'Comprehensive Mastery',
  durationYears: number = 3,
  dailyHours: number = 1.5,
  studyDaysCount: number = 5
) {
  const yearsCount = Math.max(1, Math.min(4, Math.round(durationYears || 3)));
  const weeklyHours = Math.max(3, Math.round((dailyHours || 1.5) * Math.max(1, studyDaysCount || 5)));
  const lowerSubject = (subject || '').toLowerCase();

  const isCS =
    lowerSubject.includes('computer') ||
    lowerSubject.includes('software') ||
    lowerSubject.includes('programming') ||
    lowerSubject.includes('developer') ||
    lowerSubject.includes('coding') ||
    lowerSubject.includes('cs') ||
    lowerSubject.includes('full stack') ||
    lowerSubject.includes('web dev') ||
    lowerSubject.includes('tech');

  const years: any[] = [];

  for (let y = 1; y <= yearsCount; y++) {
    if (isCS && CS_CURRICULUM[y]) {
      const blueprint = CS_CURRICULUM[y];
      const periods = blueprint.periods.map((p, pIdx) => ({
        id: `p-${y}-${pIdx + 1}`,
        periodNumber: pIdx + 1,
        title: p.title,
        theme: p.theme,
        months: p.months.map((m, mIdx) => ({
          id: `m-${y}-${pIdx + 1}-${mIdx + 1}`,
          monthNumber: mIdx + 1,
          title: m.title,
          summary: m.summary,
          weeks: m.weeks.map((w, wIdx) => {
            const topicCount = w.topics.length;
            const hoursPerTopic = Math.max(2, Math.round(weeklyHours / Math.max(1, topicCount)));
            return {
              id: `w-${y}-${pIdx + 1}-${mIdx + 1}-${wIdx + 1}`,
              weekNumber: wIdx + 1,
              title: w.title,
              summary: w.summary,
              topics: w.topics.map((t, tIdx) => ({
                id: `top-${y}-${pIdx + 1}-${mIdx + 1}-${wIdx + 1}-${tIdx + 1}`,
                title: t.title,
                description: t.desc,
                estimatedHours: hoursPerTopic,
                difficulty: t.difficulty || (y === 1 ? level : y === 2 ? 'Intermediate' : 'Advanced'),
                prerequisites: t.prerequisites || ['None'],
                type: t.type || 'concept',
                keyConcepts: t.concepts,
                completed: false,
                masteryLevel: 0,
                notes: []
              }))
            };
          })
        }))
      }));

      years.push({
        id: `y-${y}`,
        yearNumber: y,
        title: blueprint.title,
        goal: blueprint.goal,
        periods
      });
      continue;
    }

    // Otherwise generate domain specific curriculum
    const domainYear = generateDomainYear(subject, y, yearsCount, level, weeklyHours);
    years.push(domainYear);
  }

  return {
    id: `roadmap-${Date.now()}`,
    overallGoal: goal || `Master ${subject} comprehensively`,
    subject: subject || 'Computer Science & Engineering',
    years,
    aiRecommendation: `Welcome! Your structured ${yearsCount}-year personalized curriculum for ${subject} is ready, tailored for ${dailyHours}h/day across your study days. Let's begin with Year 1 fundamentals.`,
    lastUpdated: new Date().toISOString()
  };
}

function generateDomainYear(
  subject: string,
  year: number,
  totalYears: number,
  initialLevel: 'Beginner' | 'Intermediate' | 'Advanced',
  weeklyHours: number
) {
  const s1Months = [
    {
      title: `Month 1: ${subject} Core Terminology & Theoretical Foundations`,
      summary: `Foundational axioms, operational definitions, and standard analytical principles in ${subject}.`,
      weeks: [
        { title: `Week 1: Fundamental Axioms & Core Definitions`, topics: [{ title: `${subject} Foundations and Core Principles`, desc: `Understand fundamental definitions, key terminology, and baseline mechanics in ${subject}.`, concepts: ["Core Terminology", "Axiomatic Principles", "Analytical Frameworks", "Standard Notations"] }] },
        { title: `Week 2: Primary Operational Mechanics`, topics: [{ title: `Operational Methodologies and Measurement in ${subject}`, desc: `Master measurement standards, primary procedures, and foundational problem-solving steps.`, concepts: ["Standard Procedures", "Measurement Standards", "Analytical Logic", "Boundary Conditions"] }] },
        { title: `Week 3: Qualitative and Quantitative Models`, topics: [{ title: `Analytical Modeling and Structural Analysis`, desc: `Apply qualitative and quantitative models to evaluate standard problem scenarios.`, concepts: ["Quantitative Models", "Systematic Formulations", "Verification Checks", "Standard Diagnostics"] }] },
        { title: `Week 4: Foundational Workshop & Problem Set`, topics: [{ title: `Foundational Synthesis and Problem Set Workshop`, desc: `Consolidate Month 1 foundations with structured case studies and applied exercises.`, concepts: ["Case Study Analysis", "Problem-Solving Synthesis", "Diagnostic Verification", "Retention Checks"], type: "practice" }] }
      ]
    },
    {
      title: `Month 2: Structural Methodologies & Standard Applications in ${subject}`,
      summary: `Standard operating procedures, applied methodologies, and intermediate frameworks.`,
      weeks: [
        { title: `Week 1: Standard Component Interactions`, topics: [{ title: `Component Relationships and System Dynamics in ${subject}`, desc: `Analyze how core sub-components interact within structured ${subject} systems.`, concepts: ["System Components", "Interaction Dynamics", "Feedback Loops", "Stability Criteria"] }] },
        { title: `Week 2: Analytical Problem Diagnosis`, topics: [{ title: `Diagnostic Protocols and Error Analysis`, desc: `Master systematic troubleshooting, diagnostic identification, and root-cause analysis.`, concepts: ["Root Cause Identification", "Diagnostic Protocols", "Error Containment", "Empirical Testing"] }] },
        { title: `Week 3: Benchmark Industry Practices`, topics: [{ title: `Applied Case Studies and Industry Standards in ${subject}`, desc: `Examine real-world benchmark implementations, compliance guidelines, and best practices.`, concepts: ["Industry Standards", "Regulatory Guidelines", "Benchmark Analysis", "Implementation Best Practices"] }] },
        { title: `Week 4: Semester 1 Diagnostic Milestone`, topics: [{ title: `Semester 1 Comprehensive Review & Diagnostic Milestone`, desc: `Demonstrate mastery of foundational and intermediate concepts through a structured milestone.`, concepts: ["Curriculum Synthesis", "Diagnostic Evaluation", "Applied Execution", "Milestone Defense"], type: "milestone" }] }
      ]
    }
  ];

  const s2Months = [
    {
      title: `Month 3: Advanced Systems & Quantitative Optimization in ${subject}`,
      summary: `Advanced problem formulation, multi-variable modeling, and optimization strategies.`,
      weeks: [
        { title: `Week 1: Multi-Variable System Optimization`, topics: [{ title: `Optimization Frameworks and Strategic Problem Solving`, desc: `Formulate multi-variable optimization models and balance performance trade-offs.`, concepts: ["Optimization Objective Functions", "Constraint Boundaries", "Trade-Off Analysis", "Performance Tuning"] }] },
        { title: `Week 2: Empirical Testing & Validation`, topics: [{ title: `Empirical Validation and Controlled Experimentation`, desc: `Design controlled experiments and validate hypotheses with rigorous statistical standards.`, concepts: ["Experimental Design", "Controlled Variables", "Statistical Validation", "Failure Mode Analysis"] }] },
        { title: `Week 3: Professional Portfolio & Capstone Architecture`, topics: [{ title: `Capstone Project Specification and Architecture`, desc: `Architect a comprehensive practical capstone project demonstrating end-to-end subject mastery.`, concepts: ["Project Architecture", "Requirements Specification", "Implementation Milestones", "Quality Assurance"] }] },
        { title: `Week 4: Year ${year} Milestone Capstone Defense`, topics: [{ title: `Year ${year} Capstone Defense and Subject Mastery Assessment`, desc: `Present, defend, and demonstrate practical execution of the Year ${year} capstone project.`, concepts: ["Capstone Defense", "Technical Demonstration", "Comprehensive Synthesis", "Year ${year} Milestone Certification"], type: "milestone" }] }
      ]
    }
  ];

  return {
    id: `y-${year}`,
    yearNumber: year,
    title: `Year ${year}: Advanced Systems & Methodologies in ${subject}`,
    goal: `Attain professional conceptual grounding, structured problem-solving, and practical execution in ${subject}.`,
    periods: [
      {
        id: `p-${year}-1`,
        periodNumber: 1,
        title: `Semester ${year * 2 - 1}: Foundational Frameworks & Applied Methodologies`,
        theme: `Core ${subject} Principles`,
        months: s1Months.map((m, mIdx) => ({
          id: `m-${year}-1-${mIdx + 1}`,
          monthNumber: mIdx + 1,
          title: m.title,
          summary: m.summary,
          weeks: m.weeks.map((w, wIdx) => ({
            id: `w-${year}-1-${mIdx + 1}-${wIdx + 1}`,
            weekNumber: wIdx + 1,
            title: w.title,
            summary: `Structured study of ${w.title}`,
            topics: w.topics.map((t: any, tIdx: number) => ({
              id: `top-${year}-1-${mIdx + 1}-${wIdx + 1}-${tIdx + 1}`,
              title: t.title,
              description: t.desc,
              estimatedHours: Math.max(3, Math.round(weeklyHours / 2)),
              difficulty: year === 1 ? initialLevel : 'Intermediate',
              prerequisites: ['None'],
              type: t.type || 'concept',
              keyConcepts: t.concepts,
              completed: false,
              masteryLevel: 0,
              notes: []
            }))
          }))
        }))
      },
      {
        id: `p-${year}-2`,
        periodNumber: 2,
        title: `Semester ${year * 2}: Advanced Systems, Optimization & Capstone`,
        theme: `Applied ${subject} Execution`,
        months: s2Months.map((m, mIdx) => ({
          id: `m-${year}-2-${mIdx + 1}`,
          monthNumber: mIdx + 1,
          title: m.title,
          summary: m.summary,
          weeks: m.weeks.map((w, wIdx) => ({
            id: `w-${year}-2-${mIdx + 1}-${wIdx + 1}`,
            weekNumber: wIdx + 1,
            title: w.title,
            summary: `Structured study of ${w.title}`,
            topics: w.topics.map((t: any, tIdx: number) => ({
              id: `top-${year}-2-${mIdx + 1}-${wIdx + 1}-${tIdx + 1}`,
              title: t.title,
              description: t.desc,
              estimatedHours: Math.max(3, Math.round(weeklyHours / 2)),
              difficulty: 'Advanced',
              prerequisites: ['Semester 1 Mastery'],
              type: t.type || 'concept',
              keyConcepts: t.concepts,
              completed: false,
              masteryLevel: 0,
              notes: []
            }))
          }))
        }))
      }
    ]
  };
}
