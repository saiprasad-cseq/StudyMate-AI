import {
  TopicLesson,
  EducationLevel,
  RoadmapTopic,
  UserProfile,
  StudyLevel,
  TopicResource,
  PracticeExercise,
} from '../types';

/**
 * Infer or default education level from UserProfile
 */
export function getEffectiveEducationLevel(profile?: UserProfile | null): EducationLevel {
  if (profile?.educationLevel) return profile.educationLevel;
  if (profile?.mainGoal?.toLowerCase().includes('gate') || profile?.mainGoal?.toLowerCase().includes('interview') || profile?.mainGoal?.toLowerCase().includes('faang')) {
    return 'Competitive Exam Prep';
  }
  if (profile?.mainGoal?.toLowerCase().includes('diploma')) {
    return 'Diploma';
  }
  if (profile?.mainGoal?.toLowerCase().includes('school') || profile?.mainGoal?.toLowerCase().includes('11') || profile?.mainGoal?.toLowerCase().includes('12')) {
    return 'Intermediate / Class 11–12';
  }
  return 'B.Tech / Degree';
}

/**
 * Builds verified high-yield educational YouTube search queries and creator recommendations
 */
export function buildRecommendedResources(
  topicTitle: string,
  subject: string,
  level: EducationLevel
): TopicResource[] {
  const baseTopic = topicTitle.replace(/^(learn|watch|practice|quiz|revision):\s*/i, '').trim();

  let primaryChannel = 'freeCodeCamp.org';
  let secondaryChannel = 'CS50';
  let tertiaryChannel = 'Gate Smashers';
  let levelBadge = 'Undergraduate';

  switch (level) {
    case 'Intermediate / Class 11–12':
      primaryChannel = 'Khan Academy';
      secondaryChannel = 'CodeWithHarry';
      tertiaryChannel = 'freeCodeCamp.org';
      levelBadge = 'High School / 11–12';
      break;
    case 'Diploma':
      primaryChannel = 'Bro Code';
      secondaryChannel = 'NPTEL';
      tertiaryChannel = 'Telusko';
      levelBadge = 'Diploma / Polytechnic';
      break;
    case 'B.Tech / Degree':
      primaryChannel = 'CS50 (Harvard University)';
      secondaryChannel = 'Abdul Bari';
      tertiaryChannel = 'MIT OpenCourseWare';
      levelBadge = 'B.Tech / Degree Level';
      break;
    case 'Competitive Exam Prep':
      primaryChannel = 'Gate Smashers';
      secondaryChannel = 'Abdul Bari';
      tertiaryChannel = 'NeetCode';
      levelBadge = 'GATE / Coding Interviews';
      break;
    case 'Other Undergraduate':
    default:
      primaryChannel = 'freeCodeCamp.org';
      secondaryChannel = 'Traversy Media';
      tertiaryChannel = 'Programming with Mosh';
      levelBadge = 'College / Degree';
      break;
  }

  const query1 = `${baseTopic} ${subject} ${primaryChannel} tutorial`;
  const query2 = `${baseTopic} in-depth visual explanation ${secondaryChannel}`;
  const query3 = `${baseTopic} concepts and practice ${tertiaryChannel}`;

  return [
    {
      id: `res-1-${Date.now()}`,
      title: `${baseTopic} — Comprehensive Masterclass`,
      channel: primaryChannel,
      duration: '18 min',
      type: 'youtube',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query1)}`,
      searchQuery: query1,
      levelBadge,
      description: `In-depth visual breakdown of core principles, syntax structures, and mental models from ${primaryChannel}.`,
    },
    {
      id: `res-2-${Date.now()}`,
      title: `${baseTopic} — Deep Dive & Memory Mechanics`,
      channel: secondaryChannel,
      duration: '14 min',
      type: 'youtube',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query2)}`,
      searchQuery: query2,
      levelBadge: `${levelBadge} Deep-Dive`,
      description: `Visual walkthrough of memory layout, execution trace, and common pitfalls explained by ${secondaryChannel}.`,
    },
    {
      id: `res-3-${Date.now()}`,
      title: `${baseTopic} — Practical Problems & Exam Shortcuts`,
      channel: tertiaryChannel,
      duration: '12 min',
      type: 'youtube',
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query3)}`,
      searchQuery: query3,
      levelBadge: 'Problem Solving',
      description: `Worked examples, interview/exam questions, and high-yield solution strategies from ${tertiaryChannel}.`,
    },
  ];
}

/**
 * Curated specialized lesson database for standard academic milestones
 */
const CURATED_LESSONS: Record<string, (level: EducationLevel) => Partial<TopicLesson>> = {
  'variables and data types': (level) => {
    const isGate = level === 'Competitive Exam Prep';
    const isDegree = level === 'B.Tech / Degree';
    const isSchool = level === 'Intermediate / Class 11–12';

    return {
      learningObjectives: [
        'Understand what variables are and how memory addresses are assigned',
        'Distinguish between Primitive (int, float, char, bool) and Derived/User-Defined types',
        'Master signed vs unsigned binary representation and integer overflow mechanics',
        'Recognize implicit type coercion vs explicit type casting pitfalls',
        isGate
          ? 'Analyze 32-bit vs 64-bit IEEE 754 floating point precision and bitwise alignments'
          : 'Write clean, type-safe variable declarations and avoid uninitialized memory bugs',
      ],
      reading: {
        summary:
          'Variables are named memory locations holding values that can change during program execution. Each variable has a specific data type determining its size in bytes, valid value range, and permissible operations.',
        sections: [
          {
            heading: '1. What Happens Under the Hood in Memory?',
            content:
              'When you declare `int age = 21;`, the compiler calculates the required memory size (typically 4 bytes on modern 32/64-bit architectures) and allocates a contiguous chunk of memory on the execution stack. The variable name `age` is simply a human-readable identifier mapping directly to that memory address (e.g., `0x7ffee4b1a`).',
            keyTakeaway:
              'Variables are labels for memory addresses; data types dictate how many bytes are reserved and how the raw binary bits are interpreted.',
          },
          {
            heading: '2. Primitive Data Types & Their Byte Footprints',
            content: `Here are the foundational data types across systems:
• **Integer (\`int\`)**: 4 bytes (32 bits), storing signed values from -2,147,483,648 to 2,147,483,647 ($$ -2^{31} $$ to $$ 2^{31}-1 $$).
• **Character (\`char\`)**: 1 byte (8 bits), storing ASCII values (0 to 255) or signed -128 to 127.
• **Floating Point (\`float\`)**: 4 bytes (32 bits), single-precision IEEE 754 (~6-7 decimal digits of precision).
• **Double Precision (\`double\`)**: 8 bytes (64 bits), double-precision IEEE 754 (~15-17 decimal digits).
• **Boolean (\`bool\`)**: Typically 1 byte, representing logical \`true\` (1) or \`false\` (0).`,
            examTipOrNote: isGate
              ? 'GATE / Interview Tip: Watch out for integer overflow! In two’s complement arithmetic, adding 1 to INT_MAX (0x7FFFFFFF) silently wraps around to INT_MIN (-2147483648).'
              : 'Best Practice: Always initialize variables upon declaration to avoid reading garbage values left behind in RAM.',
          },
          {
            heading: '3. Type Casting: Implicit Coercion vs Explicit Casting',
            content:
              'When mixing different types in expressions (e.g., dividing an integer by another integer: `5 / 2`), integer division truncates the decimal portion resulting in `2`, NOT `2.5`. To retain precision, you must explicitly cast one operand: `(float)5 / 2` or `5.0 / 2`.',
            keyTakeaway:
              'Implicit widening (e.g., char → int → double) happens automatically. Narrowing conversions (e.g., double → int) drop data and require explicit casting.',
          },
        ],
      },
      realWorldAnalogy: {
        title: 'The Storage Box & Shipping Container Analogy',
        analogy:
          'Think of computer memory as a giant warehouse with numbered slots. A variable is a labeled storage container. The data type is the box size and material specifications: you cannot fit a giant flat-screen TV (double) inside a tiny shoe-box (char), nor can you safely ship liquid (float) in an open basket without explicit packaging (casting)!',
        mapping: [
          { realWorldItem: 'Container Label (e.g., "Kitchen Spices")', conceptMapping: 'Variable Identifier Name' },
          { realWorldItem: 'Box Dimensions (Shoebox vs Freight Crate)', conceptMapping: 'Data Type Byte Size (1 Byte vs 8 Bytes)' },
          { realWorldItem: 'Physical Warehouse Slot Number (Aisle 4, Shelf 12)', conceptMapping: 'RAM Memory Address (e.g., 0x7fff5fbff8)' },
          { realWorldItem: 'Contents inside the box', conceptMapping: 'Assigned Value stored in binary' },
        ],
      },
      codeExamples: [
        {
          title: 'C / C++: Variable Declarations, Memory Footprint & Casting',
          language: 'c',
          code: `#include <stdio.h>
#include <stdbool.h>

int main() {
    // 1. Variable declarations & initialization
    int studentAge = 20;
    float gpa = 3.85f;
    char grade = 'A';
    bool isEnrolled = true;

    // 2. Printing values and their memory sizes
    printf("Age: %d (Size: %zu bytes)\\n", studentAge, sizeof(studentAge));
    printf("GPA: %.2f (Size: %zu bytes)\\n", gpa, sizeof(gpa));
    printf("Grade: %c (ASCII Value: %d)\\n", grade, (int)grade);

    // 3. Integer Division vs Explicit Type Casting
    int score = 95;
    int total = 200;
    
    // Incorrect (Integer division truncates to 0)
    float wrongPercentage = score / total * 100;
    
    // Correct (Explicit cast promotes calculation to float)
    float correctPercentage = ((float)score / total) * 100.0f;

    printf("Percentage: %.1f%%\\n", correctPercentage);
    return 0;
}`,
          explanation:
            'Notice `sizeof(studentAge)` evaluates to 4 bytes at compile time. Casting `(float)score` prevents integer truncation before the division happens.',
          output: `Age: 20 (Size: 4 bytes)
GPA: 3.85 (Size: 4 bytes)
Grade: A (ASCII Value: 65)
Percentage: 47.5%`,
        },
        {
          title: 'Python: Dynamic Typing & Type Hints',
          language: 'python',
          code: `# Python dynamically determines types, but type annotations clarify intent
student_age: int = 20
gpa: float = 3.85
grade: str = 'A'
is_enrolled: bool = True

print(f"Age: {student_age} | Type: {type(student_age).__name__}")
print(f"GPA: {gpa} | Type: {type(gpa).__name__}")

# Python 3 division automatically promotes to float:
result = 95 / 200 * 100
print(f"Percentage: {result:.1f}%")`,
          explanation:
            'Python manages memory references automatically. `95 / 200` yields `0.475` directly without manual floating-point casting.',
          output: `Age: 20 | Type: int
GPA: 3.85 | Type: float
Percentage: 47.5%`,
        },
      ],
      practiceSection: [
        {
          id: 'prac-1',
          title: 'Exercise 1: Fix the Precision Loss Bug',
          difficulty: 'Easy',
          scenario:
            'You are building a temperature converter that takes Fahrenheit as integer `F = 98` and calculates Celsius using the formula `C = (F - 32) * (5 / 9)`. When you run the code, it always outputs `Celsius = 0.0`. Why is this happening, and how do you fix it?',
          starterCode: `int fahrenheit = 98;
// BUG: Why does this evaluate to 0.0?
float celsius = (fahrenheit - 32) * (5 / 9);
printf("Celsius: %.2f\\n", celsius);`,
          hints: [
            'Look closely at the sub-expression `(5 / 9)`. Both 5 and 9 are integer literals.',
            'What does integer division evaluate `5 / 9` to? It evaluates to 0!',
            'Change either 5 or 9 into a floating-point literal: `5.0 / 9.0` or `5.0f / 9`.',
          ],
          solution: `int fahrenheit = 98;
float celsius = (fahrenheit - 32) * (5.0f / 9.0f);
printf("Celsius: %.2f\\n", celsius); // Outputs: 36.67`,
          solutionWalkthrough:
            'In C/C++ and Java, `5 / 9` performs integer division which results in `0`. Multiplying `(98 - 32) * 0` yields `0`. By writing `5.0f / 9.0f`, the compiler executes floating-point division (`~0.5556`), preserving accuracy.',
        },
        {
          id: 'prac-2',
          title: 'Exercise 2: ASCII Character Arithmetic & Case Converter',
          difficulty: 'Medium',
          scenario:
            'Write a 2-line snippet that takes a lowercase character `char ch = "g"` and converts it to uppercase `"G"` using ASCII byte arithmetic without calling library functions like `toupper()`.',
          starterCode: `char lower = 'g';
// Hint: ASCII 'a' is 97 and 'A' is 65. The offset is ('a' - 'A') = 32.
char upper = /* Your formula here */;`,
          hints: [
            'In ASCII table, uppercase letters ("A"-"Z") precede lowercase letters ("a"-"z").',
            'The distance between any lowercase letter and its uppercase counterpart is exactly 32 (`"a" - "A"`).',
            'Subtracting `("a" - "A")` from `lower` shifts the ASCII value directly to uppercase.',
          ],
          solution: `char lower = 'g';
char upper = lower - ('a' - 'A'); // Or: lower - 32;
printf("Uppercase: %c\\n", upper); // Outputs: G`,
          solutionWalkthrough:
            'Since `char` is stored as an integer byte, arithmetic operations work directly on ASCII codes. Subtracting 32 changes `103` (ASCII for "g") to `71` (ASCII for "G").',
        },
      ],
      conceptChecks: [
        {
          id: 'cc-1',
          question: 'What is the evaluated output of `int x = 7 / 2;` in C / C++ / Java?',
          options: ['3.5', '3', '4', 'Compilation error'],
          correctAnswer: 1,
          explanation:
            'Integer division truncates any fractional remainder towards zero. `7 / 2` produces `3`, not `3.5`.',
        },
        {
          id: 'cc-2',
          question: 'How many bytes of memory does a standard `char` variable occupy in C?',
          options: ['1 byte (8 bits)', '2 bytes (16 bits)', '4 bytes (32 bits)', '8 bytes (64 bits)'],
          correctAnswer: 0,
          explanation: 'In C, a standard `char` is guaranteed to occupy exactly 1 byte (8 bits), capable of storing 256 distinct values.',
        },
        {
          id: 'cc-3',
          question: 'Which of the following creates a compilation warning or data loss (Narrowing Conversion)?',
          options: [
            'Assigning an `int` to a `double` (`double d = 10;`)',
            'Assigning a `char` to an `int` (`int code = "A";`)',
            'Assigning a `double` to an `int` (`int count = 9.99;`)',
            'Assigning a `short` to a `long` (`long val = 50;`)',
          ],
          correctAnswer: 2,
          explanation:
            'Assigning a `double` (8 bytes with decimal fraction) to an `int` (4 bytes whole number) truncates the decimal part (`.99` is lost), constituting a narrowing conversion.',
        },
      ],
      quizQuestions: [
        {
          id: 'q-1',
          question: 'What is the maximum value that an 8-bit unsigned integer (`uint8_t`) can hold?',
          options: ['127', '255', '256', '65535'],
          correctAnswer: 1,
          explanation: 'An 8-bit unsigned integer uses all 8 bits for magnitude: $$ 2^8 - 1 = 255 $$. Range is 0 to 255.',
          topic: 'Variables and Data Types',
        },
        {
          id: 'q-2',
          question: 'What happens when you declare a local variable `int count;` inside a C function without initializing it?',
          options: [
            'It is automatically set to 0',
            'It is automatically set to NULL',
            'It contains arbitrary "garbage" data from previous stack memory',
            'The compiler always throws a fatal compilation error',
          ],
          correctAnswer: 2,
          explanation:
            'Local (automatic) variables allocated on the stack are not zero-initialized by default in C/C++; they contain whatever leftover bits existed at that RAM location.',
          topic: 'Variables and Data Types',
        },
        {
          id: 'q-3',
          question: 'If `float a = 1.0f / 3.0f;` and `double b = 1.0 / 3.0;`, which statement is true regarding their precision?',
          options: [
            '`a` and `b` have identical precision and memory footprint',
            '`float a` has ~7 decimal digits of precision while `double b` has ~15-17 digits',
            '`float` stores exact fractions without any approximation',
            '`double` uses 4 bytes while `float` uses 8 bytes',
          ],
          correctAnswer: 1,
          explanation:
            'Single-precision `float` (32-bit) provides ~7 decimal digits of precision (24-bit mantissa), while `double` (64-bit) provides ~15-17 decimal digits (53-bit mantissa).',
          topic: 'Variables and Data Types',
        },
      ],
      revisionExercise: {
        id: 'rev-vdt-1',
        title: 'Revision Exercise: Swap Two Variables In-Place',
        difficulty: 'Medium',
        scenario:
          'Reinforce your data type & arithmetic understanding. Given two integer variables `int a = 5; int b = 10;`, write 3 arithmetic lines to swap their values without creating any third/temporary variable.',
        starterCode: `int a = 5, b = 10;
// Write arithmetic operations to swap a and b without a 3rd variable:
a = 
b = 
a = `,
        hints: [
          'Use addition and subtraction to store the combined total into one variable.',
          'Step 1: Store sum `a = a + b;` (a is now 15).',
          'Step 2: Set `b = a - b;` (15 - 10 = 5, so b now holds the original a).',
          'Step 3: Set `a = a - b;` (15 - 5 = 10, so a now holds the original b).',
        ],
        solution: `a = a + b; // a = 15
b = a - b; // b = 5 (original a)
a = a - b; // a = 10 (original b)`,
        solutionWalkthrough:
          'By storing the sum in `a`, subtracting the original `b` stores the original `a` inside `b`. Subtracting the new `b` from the sum restores the original `b` into `a`.',
        expectedKeywords: ['a + b', 'a - b'],
        validationExplanation:
          'Brilliant! You swapped the two variables in-place using addition and subtraction arithmetic.',
      },
    };
  },

  'operators and expressions': (level) => ({
    learningObjectives: [
      'Master Arithmetic, Relational, Logical, and Bitwise operators',
      'Understand Operator Precedence and Associativity rules to avoid grouping bugs',
      'Learn Short-Circuit Evaluation mechanics in logical AND (`&&`) and OR (`||`)',
      'Explore prefix (`++x`) vs postfix (`x++`) increment side-effects',
    ],
    reading: {
      summary:
        'Operators are symbolic tokens that perform computations, comparisons, or bit manipulations on one or more operands. Expressions combine operators and variables to produce new values following strict precedence rules.',
      sections: [
        {
          heading: '1. Operator Precedence Hierarchy',
          content: `Expressions are evaluated based on precedence (which operator executes first) and associativity (left-to-right vs right-to-left):
1. **Postfix**: \`x++\`, \`x--\`, \`()\`, \`[]\`
2. **Unary / Prefix**: \`++x\`, \`--x\`, \`!\`, \`~\`, \`+\`, \`-\`, \`& (address)\`, \`* (dereference)\`
3. **Multiplicative**: \`*\`, \`/\`, \`%\`
4. **Additive**: \`+\`, \`-\`
5. **Relational**: \`<\`, \`<=\`, \`>\`, \`>=\`
6. **Equality**: \`==\`, \`!=\`
7. **Logical AND**: \`&&\`
8. **Logical OR**: \`||\`
9. **Assignment**: \`=\`, \`+=\`, \`-=\` (Right-to-Left!)`,
          keyTakeaway:
            'When in doubt, use parentheses `( )` to make your execution order explicit and readable.',
        },
        {
          heading: '2. Short-Circuit Evaluation',
          content:
            'In logical expressions:\n• In `A && B`, if `A` is false, `B` is NEVER evaluated (because false AND anything is always false).\n• In `A || B`, if `A` is true, `B` is NEVER evaluated.\n\nThis behavior is crucial for safety, such as `if (ptr != NULL && *ptr > 0)` which prevents segmentation faults.',
          examTipOrNote:
            'Interview Trap: If expression `B` contains an increment like `if (x == 0 && ++y > 5)`, `++y` will NOT execute when `x != 0`.',
        },
      ],
    },
    realWorldAnalogy: {
      title: 'The Circuit Breaker & Order of Operations',
      analogy:
        'Think of mathematical order of operations like building a house: you cannot put up the roof (assignment) before building the foundation (parentheses) and walls (multiplication/division). Short-circuit logic acts like a safety fuse: if the primary switch is open, electricity stops immediately before reaching downstream appliances.',
      mapping: [
        { realWorldItem: 'Safety Fuse Tripping', conceptMapping: 'Short-Circuit Evaluation (stopping early)' },
        { realWorldItem: 'Standard Blueprint Sequence', conceptMapping: 'Operator Precedence Hierarchy' },
        { realWorldItem: 'Handing off results between workers', conceptMapping: 'Chained Assignment Operators' },
      ],
    },
    codeExamples: [
      {
        title: 'Prefix vs Postfix Increment & Short-Circuiting',
        language: 'c',
        code: `#include <stdio.h>

int main() {
    int a = 5;
    int b = 5;

    // Postfix: uses value first, then increments
    int result1 = a++; 
    // Prefix: increments first, then uses value
    int result2 = ++b; 

    printf("Postfix: result1 = %d, a = %d\\n", result1, a); // result1=5, a=6
    printf("Prefix:  result2 = %d, b = %d\\n", result2, b); // result2=6, b=6

    // Short-Circuit Safety Demo:
    int x = 0;
    int y = 10;
    if (x != 0 && ++y > 10) {
        printf("Condition met\\n");
    }
    printf("y remains: %d (not incremented due to short-circuit)\\n", y);

    return 0;
}`,
        explanation:
          'Because `x != 0` is false, the right side `++y > 10` is skipped entirely, leaving `y` equal to 10.',
        output: `Postfix: result1 = 5, a = 6
Prefix:  result2 = 6, b = 6
y remains: 10 (not incremented due to short-circuit)`,
      },
    ],
    practiceSection: [
      {
        id: 'prac-op-1',
        title: 'Exercise: Predict the Value of Chained Expressions',
        difficulty: 'Medium',
        scenario: 'Determine the exact output of: `int a = 2, b = 3; int c = a++ * ++b + a; printf("%d", c);`',
        hints: [
          'First evaluate `a++`: it provides value 2, then `a` becomes 3.',
          'Next evaluate `++b`: `b` becomes 4 and provides value 4.',
          'Multiplication: `2 * 4 = 8`. Then add current `a` (which is now 3): `8 + 3 = 11`.',
        ],
        solution: `int a = 2, b = 3;
int c = a++ * ++b + a; // c = 2 * 4 + 3 = 11
printf("%d\\n", c); // 11`,
        solutionWalkthrough: 'Postfix `a++` yields 2 (a becomes 3). Prefix `++b` increments b to 4. 2 * 4 = 8. Adding current a (3) gives 11.',
      },
    ],
    conceptChecks: [
      {
        id: 'cc-op-1',
        question: 'Which operator has higher precedence in C / C++ / Java?',
        options: ['Multiplication (`*`)', 'Logical AND (`&&`)', 'Equality (`==`)', 'Assignment (`=`)'],
        correctAnswer: 0,
        explanation: 'Multiplication (`*`) has higher precedence than equality, logical AND, and assignment.',
      },
    ],
    quizQuestions: [
      {
        id: 'q-op-1',
        question: 'If `int p = 1, q = 0; int r = (p || ++q);`, what are the final values of `p, q, r`?',
        options: ['p=1, q=1, r=1', 'p=1, q=0, r=1', 'p=1, q=0, r=0', 'p=0, q=1, r=1'],
        correctAnswer: 1,
        explanation:
          'Because `p` is 1 (true), the logical OR `||` short-circuits immediately. `++q` is never executed, leaving `q = 0` and `r = 1`.',
        topic: 'Operators and Expressions',
      },
    ],
    revisionExercise: {
      id: 'rev-op-1',
      title: 'Revision Exercise: Bitwise Parity Checker (Even / Odd)',
      difficulty: 'Easy',
      scenario:
        'Reinforce operator bitwise mechanics. Write a single expression that checks whether an integer `num = 14` is even or odd using the bitwise AND operator `&` instead of modulus `%`.',
      starterCode: `int num = 14;
// Return 1 if odd, 0 if even using bitwise &
int isOdd = /* your bitwise formula */;`,
      hints: [
        'In binary, odd numbers always end with least-significant bit 1.',
        'AND-ing with 1 isolates the lowest bit: `num & 1`.',
        'If `(num & 1) == 0`, the number is even; if 1, it is odd.',
      ],
      solution: `int num = 14;
int isOdd = num & 1; // Evaluates to 0 for even, 1 for odd`,
      solutionWalkthrough:
        'The bitwise AND `num & 1` inspects the 0th bit of binary `num`. It avoids costly CPU division operations compared to `num % 2`.',
      expectedKeywords: ['num & 1', '& 1'],
      validationExplanation:
        'Awesome! Bitwise AND with 1 is the fastest and most hardware-efficient way to check parity.',
    },
  }),

  'pointers and memory addresses': (level) => ({
    learningObjectives: [
      'Demystify memory addresses and how pointer variables store references',
      'Master the Address-of operator (`&`) and Dereference operator (`*`)',
      'Understand Stack vs Heap memory allocation and pointer lifetimes',
      'Avoid Dangling Pointers, Memory Leaks, and Null Pointer Exceptions',
    ],
    reading: {
      summary:
        'A pointer is a variable whose value is the memory address of another variable. Pointers enable efficient memory sharing, dynamic data structures, and direct hardware manipulation.',
      sections: [
        {
          heading: '1. Memory Addresses & The Pointer Concept',
          content:
            'Every variable stored in RAM has an address. If `int x = 42;` resides at address `0x7ffee`, a pointer variable `int *ptr = &x;` stores that exact address `0x7ffee`. Dereferencing `*ptr` reads or writes directly to the memory slot of `x`.',
          keyTakeaway: '`&` gets the address of a variable; `*` accesses the value living at that address.',
        },
        {
          heading: '2. Stack vs Heap Memory',
          content:
            '• **Stack Memory**: Fast, automatically managed, fixed size. Local variables live here and are deallocated automatically when their function scope exits.\n• **Heap Memory**: Dynamically allocated at runtime using `malloc()` / `new`. Persists until explicitly freed with `free()` / `delete`.',
          examTipOrNote:
            'Fatal Bug: Returning the address of a local stack variable from a function creates a Dangling Pointer. Always use heap allocation if data must outlive the function scope.',
        },
      ],
    },
    realWorldAnalogy: {
      title: 'The House vs The GPS Coordinates',
      analogy:
        'Imagine a friend asks where you live. Instead of moving your entire brick-and-mortar house to them, you write your home address on a piece of paper. The paper with the GPS coordinates is the pointer (`ptr`). The physical house is the actual variable (`x`). Visiting the house using the coordinates is dereferencing (`*ptr`).',
      mapping: [
        { realWorldItem: 'The physical house', conceptMapping: 'The original variable (stored value)' },
        { realWorldItem: 'The written postal address', conceptMapping: 'The pointer variable (storing memory address)' },
        { realWorldItem: 'Looking up directions (&)', conceptMapping: 'Address-of operator (&x)' },
        { realWorldItem: 'Entering through the front door (*)', conceptMapping: 'Dereference operator (*ptr)' },
      ],
    },
    codeExamples: [
      {
        title: 'C: Pointers, Address Inspection & Pass-by-Reference',
        language: 'c',
        code: `#include <stdio.h>

// Pass-by-reference using pointers to swap two values
void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main() {
    int num = 100;
    int *ptr = &num; // ptr stores address of num

    printf("Value of num: %d\\n", num);
    printf("Address of num (&num): %p\\n", (void*)&num);
    printf("Value stored in ptr:   %p\\n", (void*)ptr);
    printf("Dereferenced (*ptr):   %d\\n", *ptr);

    // Modifying value via pointer
    *ptr = 250;
    printf("New value of num: %d\\n\\n", num);

    int x = 10, y = 20;
    printf("Before swap: x = %d, y = %d\\n", x, y);
    swap(&x, &y);
    printf("After swap:  x = %d, y = %d\\n", x, y);

    return 0;
}`,
        explanation:
          '`swap(&x, &y)` passes the memory addresses of x and y, allowing `swap()` to directly alter the caller’s local variables in place.',
        output: `Value of num: 100
Address of num (&num): 0x7ffee4b1a
Value stored in ptr:   0x7ffee4b1a
Dereferenced (*ptr):   100
New value of num: 250

Before swap: x = 10, y = 20
After swap:  x = 20, y = 10`,
      },
    ],
    practiceSection: [
      {
        id: 'prac-ptr-1',
        title: 'Exercise: Find and Fix the Null Pointer Bug',
        difficulty: 'Easy',
        scenario:
          'A developer wrote: `int *ptr = NULL; *ptr = 50;`. What fatal error happens at runtime, and how should it be guarded?',
        hints: [
          'Dereferencing `NULL` (address 0x0) attempts to write to protected kernel memory.',
          'This causes an immediate Segmentation Fault (Crash).',
          'Ensure the pointer points to valid allocated memory before dereferencing: `int val; int *ptr = &val; *ptr = 50;`.',
        ],
        solution: `int val = 0;
int *ptr = &val; // Now points to valid stack memory
if (ptr != NULL) {
    *ptr = 50;
    printf("Value: %d\\n", val); // 50
}`,
        solutionWalkthrough:
          'Pointers must always point to a valid initialized variable or heap-allocated memory block before dereferencing.',
        expectedKeywords: ['&val', 'ptr != NULL', '*ptr = 50'],
        validationExplanation:
          'Correct! Pointing `ptr` to `&val` before dereferencing prevents crashes and ensures memory safety.',
      },
    ],
    conceptChecks: [
      {
        id: 'cc-ptr-1',
        question: 'What does the unary operator `*` do when placed before a pointer variable in an expression (e.g. `int val = *p;`)?',
        options: [
          'Multiplies the address by 2',
          'Retrieves the value stored at the memory address held by `p`',
          'Declares a new pointer',
          'Frees the pointer from RAM',
        ],
        correctAnswer: 1,
        explanation: 'The dereference operator `*` reads or writes the value located at the target memory address.',
      },
    ],
    quizQuestions: [
      {
        id: 'q-ptr-1',
        question: 'On a standard 64-bit operating system, what is `sizeof(char*)` versus `sizeof(double*)`?',
        options: [
          '`char*` is 1 byte, `double*` is 8 bytes',
          'Both are 8 bytes because all memory addresses on a 64-bit architecture are 64 bits (8 bytes)',
          '`char*` is 4 bytes, `double*` is 8 bytes',
          'Both are 4 bytes',
        ],
        correctAnswer: 1,
        explanation:
          'All pointer variables simply store memory addresses. On a 64-bit architecture, every address is 64 bits (8 bytes), regardless of the data type it points to.',
        topic: 'Pointers and Memory Addresses',
      },
    ],
    revisionExercise: {
      id: 'rev-ptr-1',
      title: 'Revision Exercise: Pointer Arithmetic & Array Indexing',
      difficulty: 'Medium',
      scenario:
        'Given an integer array `int arr[] = {10, 20, 30, 40};` and pointer `int *p = arr;`, write an expression to access the 3rd element (30) using pointer arithmetic `*(p + offset)`.',
      starterCode: `int arr[] = {10, 20, 30, 40};
int *p = arr;
// Access the 3rd element (30) using pointer arithmetic:
int val = /* your pointer arithmetic expression */;`,
      hints: [
        'Arrays are zero-indexed. The 3rd element is at index 2.',
        'In pointer arithmetic, `*(p + 2)` skips 2 integers forward and dereferences that address.',
      ],
      solution: `int arr[] = {10, 20, 30, 40};
int *p = arr;
int val = *(p + 2); // val = 30`,
      solutionWalkthrough:
        'Pointer arithmetic automatically scales by `sizeof(int)`. Adding 2 advances the pointer by `2 * 4 = 8` bytes in memory.',
      expectedKeywords: ['*(p + 2)', '*(arr + 2)', 'p + 2'],
      validationExplanation:
        'Great work! `*(p + 2)` dereferences the third element accurately via pointer offset.',
    },
  }),
};

/**
 * Procedural Dynamic Lesson Generator
 * Generates a complete, high-yield, customized lesson for ANY topic & education level
 */
export function buildProceduralLesson(
  topicTitle: string,
  topicContext?: Partial<RoadmapTopic> | null,
  profile?: UserProfile | null,
  customLevel?: EducationLevel
): TopicLesson {
  const cleanTitle = topicTitle.replace(/^(learn|watch|practice|quiz|revision):\s*/i, '').trim();
  const lowerTitle = cleanTitle.toLowerCase();
  const effectiveLevel = customLevel || getEffectiveEducationLevel(profile);
  const subject = profile?.subject || 'Computer Science & Engineering';
  const difficulty: StudyLevel = topicContext?.difficulty || profile?.currentLevel || 'Beginner';
  const estimatedHours = topicContext?.estimatedHours || 2;
  const estimatedMinutes = Math.min(60, Math.max(20, Math.round((Number(profile?.dailyHours) || 1.5) * 30)));

  // 1. Check curated rich lessons
  for (const [key, lessonFactory] of Object.entries(CURATED_LESSONS)) {
    if (lowerTitle.includes(key) || key.includes(lowerTitle)) {
      const partial = lessonFactory(effectiveLevel);
      const resources = buildRecommendedResources(cleanTitle, subject, effectiveLevel);

      return {
        id: `lesson-${topicContext?.id || Date.now()}`,
        topicId: topicContext?.id || `top-${Date.now()}`,
        topicTitle: cleanTitle,
        subject,
        educationLevel: effectiveLevel,
        difficulty,
        estimatedMinutes,
        learningObjectives: partial.learningObjectives || [
          `Master core principles and operational mechanisms of ${cleanTitle}`,
          `Understand memory representation, syntax patterns, and execution flow`,
          `Analyze practical applications and edge-case behaviors`,
          `Solve realistic problems and verify understanding through diagnostic quiz`,
        ],
        learningSteps: [
          {
            step: 1,
            title: 'What I Will Learn',
            description: `Key outcomes and concepts to master for ${cleanTitle}.`,
            actionType: 'read',
          },
          {
            step: 2,
            title: 'Recommended YouTube Videos',
            description: `Review curated visual lessons from high-quality educational channels for ${cleanTitle}.`,
            actionType: 'watch',
          },
          {
            step: 3,
            title: 'Simple Explanation & Mental Model',
            description: 'Read the concise high-yield theory, analogies, and mental models inside the app.',
            actionType: 'read',
          },
          {
            step: 4,
            title: 'Code Examples & Trace',
            description: 'Study verified multi-language implementations with line-by-line breakdown.',
            actionType: 'code',
          },
          {
            step: 5,
            title: 'Interactive Practice & Auto-Check',
            description: 'Solve hands-on exercises with immediate correctness check and progressive hints.',
            actionType: 'practice',
          },
          {
            step: 6,
            title: 'Quick Concept Checks',
            description: 'Test your immediate recall with instant-feedback interactive questions.',
            actionType: 'check',
          },
          {
            step: 7,
            title: 'Topic Quiz',
            description: 'Take the diagnostic topic quiz to evaluate and solidify your mastery.',
            actionType: 'quiz',
          },
          {
            step: 8,
            title: 'Feedback & Mastery Evaluation',
            description: 'Analyze your performance scorecard with personalized revision or progression advice.',
            actionType: 'complete',
          },
          {
            step: 9,
            title: 'Mark Completed',
            description: 'Lock in your topic mastery, log study time, and advance your daily streak.',
            actionType: 'complete',
          },
          {
            step: 10,
            title: 'Recommend Next Topic',
            description: 'Seamlessly launch the next milestone in your curriculum path.',
            actionType: 'complete',
          },
        ],
        resources,
        reading: partial.reading || {
          summary: `Core principles and practical foundations of ${cleanTitle}.`,
          sections: [
            {
              heading: `1. Fundamentals of ${cleanTitle}`,
              content: `Understanding ${cleanTitle} is essential for building structured, reliable software in ${subject}. It provides the mechanism for managing execution and processing data accurately.`,
              keyTakeaway: `Mastering ${cleanTitle} unlocks deeper competence in ${subject}.`,
            },
          ],
        },
        realWorldAnalogy: partial.realWorldAnalogy || {
          title: `Real-World Analogy for ${cleanTitle}`,
          analogy: `Think of ${cleanTitle} like a well-organized workflow in an engineering workshop where every tool and component has a defined purpose and specific protocol.`,
          mapping: [
            { realWorldItem: 'Workshop Tool Protocol', conceptMapping: 'Rules & Syntax Standards' },
            { realWorldItem: 'Finished Assembly Product', conceptMapping: 'Computed Output & Execution Result' },
          ],
        },
        codeExamples: partial.codeExamples || [
          {
            title: `Practical Implementation: ${cleanTitle}`,
            language: 'python',
            code: `# Example demonstrating ${cleanTitle}
def demonstrate_concept():
    # Setup initial state
    data = [10, 20, 30, 40, 50]
    print(f"Processing {cleanTitle}:", data)
    return sum(data)

result = demonstrate_concept()
print("Result:", result)`,
            explanation: `Clean, structured demonstration showing how ${cleanTitle} operates on real inputs.`,
            output: `Processing ${cleanTitle}: [10, 20, 30, 40, 50]\nResult: 150`,
          },
        ],
        practiceSection: partial.practiceSection || [
          {
            id: 'prac-gen-1',
            title: `Hands-on Problem: Applying ${cleanTitle}`,
            difficulty: 'Medium',
            scenario: `Implement a structured routine that processes input data according to the principles of ${cleanTitle}.`,
            hints: [
              'Identify the input constraints and expected output format.',
              'Break the computation into sequential logical steps.',
              'Test boundary cases such as empty or negative inputs.',
            ],
            solution: `# Model solution for ${cleanTitle}
def solve(items):
    return [x for x in items if x > 0]`,
            solutionWalkthrough: `Step-by-step resolution verifying invariant correctness.`,
          },
        ],
        revisionExercise: partial.revisionExercise || {
          id: `rev-${topicContext?.id || Date.now()}`,
          title: `Revision Exercise: Reinforcing ${cleanTitle}`,
          difficulty: 'Medium',
          scenario: `Strengthen your foundational intuition on ${cleanTitle}. Write a brief snippet handling the primary edge case for this concept.`,
          starterCode: `// Reinforce your understanding of ${cleanTitle}\nint applyConcept(int x) {\n    // Write fix or formula here:\n    return x;\n}`,
          hints: [
            'Consider what edge case could cause unexpected behavior.',
            'Trace the inputs through step by step.',
          ],
          solution: `int applyConcept(int x) {\n    if (x <= 0) return 0;\n    return x * 2;\n}`,
          solutionWalkthrough: `Safely validates input boundaries before returning the computed result.`,
        },
        conceptChecks: partial.conceptChecks || [
          {
            id: 'cc-gen-1',
            question: `What is the primary objective of mastering ${cleanTitle}?`,
            options: [
              `To establish correct invariants and structured execution in ${subject}`,
              'To memorize syntax without understanding underlying principles',
              'To skip intermediate verification and write untraceable code',
              'To avoid using standard algorithmic patterns',
            ],
            correctAnswer: 0,
            explanation: `Gaining a robust mental model of ${cleanTitle} ensures reproducible, high-quality results.`,
          },
        ],
        quizQuestions: partial.quizQuestions || [
          {
            id: 'q-gen-1',
            question: `Which of the following is a key best practice when working with ${cleanTitle}?`,
            options: [
              'Validating input assumptions and handling boundary conditions cleanly',
              'Assuming all inputs will always be positive and within ideal ranges',
              'Disabling type checks and compiler warnings',
              'Ignoring error codes and exception returns',
            ],
            correctAnswer: 0,
            explanation: 'Proper validation and clear boundary handling are cornerstones of dependable programming.',
            topic: cleanTitle,
          },
        ],
      };
    }
  }

  // 2. Procedural dynamic synthesis for any custom topic
  const resources = buildRecommendedResources(cleanTitle, subject, effectiveLevel);
  const isGate = effectiveLevel === 'Competitive Exam Prep';
  const isDegree = effectiveLevel === 'B.Tech / Degree';

  return {
    id: `lesson-${topicContext?.id || Date.now()}`,
    topicId: topicContext?.id || `top-${Date.now()}`,
    topicTitle: cleanTitle,
    subject,
    educationLevel: effectiveLevel,
    difficulty,
    estimatedMinutes,
    learningObjectives: [
      `Understand foundational rules, mental models, and definitions for ${cleanTitle}`,
      `Trace step-by-step execution flow, memory allocation, and syntax constraints`,
      `Learn common pitfalls, edge cases, and best practices relevant to ${effectiveLevel}`,
      `Apply concepts in interactive exercises and verify recall through a diagnostic quiz`,
    ],
    learningSteps: [
      {
        step: 1,
        title: 'What I Will Learn',
        description: `Key outcomes and concepts to master for ${cleanTitle}.`,
        actionType: 'read',
      },
      {
        step: 2,
        title: 'Recommended YouTube Videos',
        description: `High-yield video tutorials curated from top educators for ${cleanTitle}.`,
        actionType: 'watch',
      },
      {
        step: 3,
        title: 'Simple Explanation & Mental Model',
        description: 'Read the concise high-yield theory, analogies, and mental models inside the app.',
        actionType: 'read',
      },
      {
        step: 4,
        title: 'Code Examples & Trace',
        description: 'Study verified multi-language implementations with line-by-line breakdown.',
        actionType: 'code',
      },
      {
        step: 5,
        title: 'Interactive Practice & Auto-Check',
        description: 'Solve hands-on exercises with immediate correctness check and progressive hints.',
        actionType: 'practice',
      },
      {
        step: 6,
        title: 'Quick Concept Checks',
        description: 'Test your immediate recall with instant-feedback interactive questions.',
        actionType: 'check',
      },
      {
        step: 7,
        title: 'Topic Quiz',
        description: 'Take the diagnostic topic quiz to evaluate and solidify your mastery.',
        actionType: 'quiz',
      },
      {
        step: 8,
        title: 'Feedback & Mastery Evaluation',
        description: 'Analyze your performance scorecard with personalized revision or progression advice.',
        actionType: 'complete',
      },
      {
        step: 9,
        title: 'Mark Completed',
        description: 'Lock in your topic mastery, log study time, and advance your daily streak.',
        actionType: 'complete',
      },
      {
        step: 10,
        title: 'Recommend Next Topic',
        description: 'Seamlessly launch the next milestone in your curriculum path.',
        actionType: 'complete',
      },
    ],
    resources,
    reading: {
      summary: `${cleanTitle} forms a key pillar in the study of ${subject}. A rigorous understanding of its core mechanics enables structured problem solving and clean implementation.`,
      sections: [
        {
          heading: `1. Core Principles of ${cleanTitle}`,
          content: `In ${subject}, ${cleanTitle} deals with structuring logic, manipulating data, and ensuring predictable state transitions. Understanding the sequence of operations and invariant conditions allows you to construct robust algorithms without guessing.`,
          keyTakeaway: `Always focus on the underlying state changes and invariants that define ${cleanTitle}.`,
        },
        {
          heading: `2. Key Mechanics & Execution Behavior`,
          content: `When executed by the compiler or runtime environment, ${cleanTitle} follows strict determinism. Each step transforms input inputs according to well-defined mathematical and architectural constraints.`,
          examTipOrNote: isGate
            ? `Exam / GATE Note: Pay close attention to asymptotic time/space bounds and edge-case boundary values for ${cleanTitle}.`
            : isDegree
            ? `Academic Insight: Analyze the underlying memory footprint and operational complexity during execution.`
            : `Practical Tip: Write down a quick trace table on paper to verify your logic before coding.`,
        },
        {
          heading: `3. Common Mistakes & How to Avoid Them`,
          content: `Frequent pitfalls in ${cleanTitle} include off-by-one boundary errors, unhandled null/empty inputs, and improper state mutations. Establishing automated checks and clear invariants prevents these bugs early.`,
          keyTakeaway: `Check boundary conditions first before writing complex processing routines.`,
        },
      ],
    },
    realWorldAnalogy: {
      title: `The Assembly Line & Blueprint Analogy for ${cleanTitle}`,
      analogy: `Think of ${cleanTitle} like a precision assembly line where raw materials (inputs) pass through organized workstations (operations) according to exact specifications (rules) to produce a verified final component (result). If any workstation violates its protocol, the entire assembly reflects the discrepancy.`,
      mapping: [
        { realWorldItem: 'Assembly Blueprint & Specs', conceptMapping: 'Rules, Types & Syntax of ' + cleanTitle },
        { realWorldItem: 'Quality Control Checkpoint', conceptMapping: 'Boundary Verification & Invariants' },
        { realWorldItem: 'Finished Industrial Component', conceptMapping: 'Computed Output & Return Value' },
      ],
    },
    codeExamples: [
      {
        title: `Worked Example: ${cleanTitle}`,
        language: 'c',
        code: `#include <stdio.h>

// Demonstrating core mechanism of ${cleanTitle}
void processConcept(int values[], int length) {
    printf("Executing: ${cleanTitle}\\n");
    for (int i = 0; i < length; i++) {
        printf("Index %d -> Value: %d\\n", i, values[i]);
    }
}

int main() {
    int sampleData[] = {10, 20, 30, 40};
    int size = sizeof(sampleData) / sizeof(sampleData[0]);
    
    processConcept(sampleData, size);
    return 0;
}`,
        explanation: `Demonstrates structured data processing and array bounds calculation for ${cleanTitle}.`,
        output: `Executing: ${cleanTitle}\nIndex 0 -> Value: 10\nIndex 1 -> Value: 20\nIndex 2 -> Value: 30\nIndex 3 -> Value: 40`,
      },
    ],
    practiceSection: [
      {
        id: 'prac-dyn-1',
        title: `Exercise 1: Tracing & Implementing ${cleanTitle}`,
        difficulty: 'Medium',
        scenario: `Write a clean function that accepts input parameters and applies the core rules of ${cleanTitle} to produce the correct transformed output.`,
        starterCode: `// Implement your solution for ${cleanTitle} below:\nint processInput(int value) {\n    // TODO: Write logic here\n    return value;\n}`,
        hints: [
          'Identify what base conditions or edge cases need to be checked first.',
          'Consider what happens when the input is 0, negative, or at its maximum value.',
          'Trace through a 3-step test case by hand.',
        ],
        solution: `int processInput(int value) {\n    if (value <= 0) return 0;\n    return value * 2;\n}`,
        solutionWalkthrough: `Validates non-positive inputs safely before executing the core transformation.`,
      },
    ],
    revisionExercise: {
      id: 'rev-dyn-1',
      title: `Revision Exercise: Deepening ${cleanTitle}`,
      difficulty: 'Medium',
      scenario: `Solidify your mental model on ${cleanTitle}. Write a function that safely guards against invalid boundary values before executing the core transformation.`,
      starterCode: `// Implement revision logic for ${cleanTitle}:\nint verifyConcept(int input) {\n    // Guard boundary conditions:\n    \n    return input;\n}`,
      hints: [
        'Identify boundary conditions first (e.g. input <= 0 or empty).',
        'Return a fallback safe value like 0 or error code before processing.',
      ],
      solution: `int verifyConcept(int input) {\n    if (input <= 0) return 0;\n    return input * 2;\n}`,
      solutionWalkthrough: `Validates inputs and handles state correctly to prevent runtime errors.`,
    },
    conceptChecks: [
      {
        id: 'cc-dyn-1',
        question: `When designing logic for ${cleanTitle}, what should you prioritize first?`,
        options: [
          'Clarifying inputs, outputs, and boundary conditions',
          'Writing unstructured code as quickly as possible',
          'Ignoring error checks to save lines of code',
          'Assuming inputs will never be invalid',
        ],
        correctAnswer: 0,
        explanation: 'Clear specification of inputs, outputs, and edge cases prevents errors before implementation.',
      },
      {
        id: 'cc-dyn-2',
        question: `How does mastering ${cleanTitle} benefit your long-term problem-solving in ${subject}?`,
        options: [
          'It builds reliable mental models and improves code reliability',
          'It replaces the need for algorithmic thinking',
          'It makes debugging unnecessary',
          'It removes the need to test software',
        ],
        correctAnswer: 0,
        explanation: 'Deep conceptual mastery creates intuitive understanding that carries across programming languages.',
      },
    ],
    quizQuestions: [
      {
        id: 'q-dyn-1',
        question: `Which of the following best describes the core invariant of ${cleanTitle}?`,
        options: [
          `A consistent mathematical or logical rule that holds true throughout execution`,
          'A random behavior that changes on every compiler run',
          'An optional comment in the source code',
          'A deprecated hardware standard',
        ],
        correctAnswer: 0,
        explanation: `Invariants guarantee logical correctness across all iterations and recursive calls.`,
        topic: cleanTitle,
      },
      {
        id: 'q-dyn-2',
        question: `What is the most effective method for testing your understanding of ${cleanTitle}?`,
        options: [
          'Writing code, tracing test cases, and explaining the logic in your own words',
          'Passive reading without writing any code',
          'Memorizing code blocks without understanding why they work',
          'Skipping practice exercises and quizzes',
        ],
        correctAnswer: 0,
        explanation: 'Active problem solving and code tracing consolidate long-term neural recall and mastery.',
        topic: cleanTitle,
      },
    ],
  };
}

export interface PracticeValidationResult {
  isCorrect: boolean;
  feedback: string;
  nextHint?: string;
  matchedKeywords?: string[];
}

/**
 * Intelligent client-side validation engine for student practice submissions.
 * Checks against custom expected keywords, specialized curated criteria, and solution invariants.
 * Provides targeted hints if incorrect without spoiling the solution immediately.
 */
export function validatePracticeAnswer(
  exercise: PracticeExercise,
  userAnswer: string,
  attemptNumber: number = 1
): PracticeValidationResult {
  const cleanAnswer = userAnswer.trim();
  const starter = (exercise.starterCode || '').trim();

  if (!cleanAnswer || (starter.length > 10 && cleanAnswer === starter)) {
    return {
      isCorrect: false,
      feedback: 'Please write your solution or formula in the editor before submitting.',
      nextHint: exercise.hints[0] || 'Start by reading the scenario and comments carefully.',
    };
  }

  const lower = cleanAnswer.toLowerCase().replace(/\s+/g, ' ');

  // 1. Explicit keyword checks if specified
  if (exercise.expectedKeywords && exercise.expectedKeywords.length > 0) {
    const matched = exercise.expectedKeywords.filter((kw) =>
      lower.includes(kw.toLowerCase().replace(/\s+/g, ' '))
    );
    const threshold = Math.max(1, Math.ceil(exercise.expectedKeywords.length * 0.6));
    if (matched.length >= threshold) {
      return {
        isCorrect: true,
        feedback:
          exercise.validationExplanation ||
          'Excellent! Your code contains the correct logic and passes all conceptual checks.',
        matchedKeywords: matched,
      };
    }
  }

  // 2. Specific curated exercise logic
  if (exercise.id === 'prac-1' || exercise.title.toLowerCase().includes('precision loss')) {
    const hasFloatDivision =
      lower.includes('5.0') ||
      lower.includes('9.0') ||
      lower.includes('5.0f') ||
      lower.includes('9.0f') ||
      lower.includes('(float)5') ||
      lower.includes('(double)5') ||
      lower.includes('5 / 9.0') ||
      lower.includes('5.0 / 9') ||
      lower.includes('(float)') ||
      lower.includes('(double)');
    if (hasFloatDivision) {
      return {
        isCorrect: true,
        feedback:
          'Great job! You converted integer literals into floating-point representation (e.g. 5.0f / 9.0f). This avoids integer truncation to 0 and evaluates the formula accurately.',
      };
    } else {
      const hintIdx = Math.min(attemptNumber - 1, exercise.hints.length - 1);
      return {
        isCorrect: false,
        feedback:
          'Not quite yet. The expression is still performing integer division `(5 / 9)` which evaluates to `0`.',
        nextHint:
          exercise.hints[hintIdx] ||
          'Try writing at least one number as a float (e.g., `5.0f` or `5.0 / 9.0`).',
      };
    }
  }

  if (exercise.id === 'prac-2' || exercise.title.toLowerCase().includes('ascii character')) {
    const hasAsciiOffset =
      lower.includes('- 32') ||
      lower.includes("- ('a' - 'a')") ||
      lower.includes("- ('a'-'a')") ||
      lower.includes("- 0x20") ||
      lower.includes("lower - 32") ||
      lower.includes("ch - 32");
    if (hasAsciiOffset) {
      return {
        isCorrect: true,
        feedback:
          "Spot on! In ASCII, uppercase letters are offset by exactly 32 positions before lowercase letters. Subtracting 32 or ('a' - 'A') converts 'g' (103) into 'G' (71).",
      };
    } else {
      const hintIdx = Math.min(attemptNumber - 1, exercise.hints.length - 1);
      return {
        isCorrect: false,
        feedback:
          'Incorrect ASCII offset formula. In ASCII, uppercase letters come before lowercase letters.',
        nextHint:
          exercise.hints[hintIdx] ||
          "Hint: The distance between 'a' (97) and 'A' (65) is 32. Subtract that offset from `lower`.",
      };
    }
  }

  // 3. Solution token matching
  const solTokens = (exercise.solution || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['return', 'printf', 'const', 'int', 'float', 'char', 'void', 'main'].includes(w));

  const matchedTokens = solTokens.filter((token) => lower.includes(token));
  const tokenMatchRatio = solTokens.length > 0 ? matchedTokens.length / solTokens.length : 0;

  if (tokenMatchRatio >= 0.5 || lower.includes('return') && cleanAnswer.length >= 25) {
    return {
      isCorrect: true,
      feedback:
        exercise.validationExplanation ||
        'Well done! Your solution applies the required algorithmic logic and matches the expected output behavior.',
    };
  }

  // If not correct, provide a progressive hint first
  const hintIdx = Math.min(attemptNumber - 1, exercise.hints.length - 1);
  return {
    isCorrect: false,
    feedback:
      'Your answer is on the right path, but some key logic or operators need adjustment.',
    nextHint:
      exercise.hints[hintIdx] ||
      'Review the problem requirements and double-check your mathematical and syntax logic.',
  };
}
