// Application state management with React context-free approach using simple stores

export interface Question {
  id: string;
  number: string;
  maxMarks: number;
}

export interface Subject {
  id: string;
  name: string;
  questions: Question[];
  totalMarks: number;
}

export interface StudentEntry {
  id: string;
  studentName: string;
  examNumber: string;
  subjectId: string;
  marks: Record<string, number | null>; // questionId -> mark
  markerTotal: number | null; // what the marker wrote as total
  calculatedTotal: number;
  percentage: number;
  errors: MarkingError[];
  status: "pending" | "verified" | "flagged";
  markedBy: string;
  verifiedBy?: string;
}

export interface MarkingError {
  type: "missing_mark" | "total_mismatch" | "exceeds_max" | "addition_error";
  questionId?: string;
  message: string;
}

// Default subjects
export const defaultSubjects: Subject[] = [
  {
    id: "maths",
    name: "Mathematics",
    totalMarks: 150,
    questions: [
      { id: "m1", number: "1", maxMarks: 15 },
      { id: "m2", number: "2", maxMarks: 20 },
      { id: "m3", number: "3", maxMarks: 25 },
      { id: "m4", number: "4", maxMarks: 20 },
      { id: "m5", number: "5", maxMarks: 15 },
      { id: "m6", number: "6", maxMarks: 25 },
      { id: "m7", number: "7", maxMarks: 30 },
    ],
  },
  {
    id: "life-sci",
    name: "Life Sciences",
    totalMarks: 150,
    questions: [
      { id: "l1", number: "1", maxMarks: 40 },
      { id: "l2", number: "2", maxMarks: 40 },
      { id: "l3", number: "3", maxMarks: 35 },
      { id: "l4", number: "4", maxMarks: 35 },
    ],
  },
  {
    id: "english",
    name: "English Home Language",
    totalMarks: 100,
    questions: [
      { id: "e1", number: "1", maxMarks: 20 },
      { id: "e2", number: "2", maxMarks: 20 },
      { id: "e3", number: "3", maxMarks: 30 },
      { id: "e4", number: "4", maxMarks: 30 },
    ],
  },
  {
    id: "phys-sci",
    name: "Physical Sciences",
    totalMarks: 150,
    questions: [
      { id: "p1", number: "1", maxMarks: 20 },
      { id: "p2", number: "2", maxMarks: 25 },
      { id: "p3", number: "3", maxMarks: 25 },
      { id: "p4", number: "4", maxMarks: 20 },
      { id: "p5", number: "5", maxMarks: 30 },
      { id: "p6", number: "6", maxMarks: 30 },
    ],
  },
];

export function detectErrors(
  entry: Omit<StudentEntry, "errors" | "calculatedTotal" | "percentage">,
  subject: Subject
): { errors: MarkingError[]; calculatedTotal: number; percentage: number } {
  const errors: MarkingError[] = [];
  let calculatedTotal = 0;

  for (const q of subject.questions) {
    const mark = entry.marks[q.id];

    if (mark === null || mark === undefined) {
      errors.push({
        type: "missing_mark",
        questionId: q.id,
        message: `Question ${q.number} has not been marked`,
      });
    } else {
      if (mark > q.maxMarks) {
        errors.push({
          type: "exceeds_max",
          questionId: q.id,
          message: `Question ${q.number}: mark ${mark} exceeds maximum ${q.maxMarks}`,
        });
      }
      if (mark < 0) {
        errors.push({
          type: "exceeds_max",
          questionId: q.id,
          message: `Question ${q.number}: negative mark not allowed`,
        });
      }
      calculatedTotal += mark;
    }
  }

  if (entry.markerTotal !== null && entry.markerTotal !== calculatedTotal) {
    errors.push({
      type: "total_mismatch",
      message: `Marker total (${entry.markerTotal}) doesn't match calculated total (${calculatedTotal})`,
    });
  }

  const percentage = subject.totalMarks > 0 ? Math.round((calculatedTotal / subject.totalMarks) * 100) : 0;

  return { errors, calculatedTotal, percentage };
}

// Demo data
export function generateDemoEntries(): StudentEntry[] {
  const subject = defaultSubjects[0]; // Maths
  const entries: StudentEntry[] = [
    {
      id: "1",
      studentName: "Thabo Mokoena",
      examNumber: "2026-MAT-0012",
      subjectId: "maths",
      marks: { m1: 12, m2: 18, m3: 20, m4: 15, m5: 13, m6: 22, m7: 25 },
      markerTotal: 125,
      calculatedTotal: 0,
      percentage: 0,
      errors: [],
      status: "verified",
      markedBy: "Mrs. Van der Merwe",
      verifiedBy: "Mr. Nkosi",
    },
    {
      id: "2",
      studentName: "Naledi Dlamini",
      examNumber: "2026-MAT-0045",
      subjectId: "maths",
      marks: { m1: 14, m2: 19, m3: 22, m4: 18, m5: 14, m6: 20, m7: 28 },
      markerTotal: 140, // Wrong total — should be 135
      calculatedTotal: 0,
      percentage: 0,
      errors: [],
      status: "pending",
      markedBy: "Mrs. Van der Merwe",
    },
    {
      id: "3",
      studentName: "Sipho Ndlovu",
      examNumber: "2026-MAT-0078",
      subjectId: "maths",
      marks: { m1: 10, m2: 16, m3: null, m4: 12, m5: 8, m6: 18, m7: 22 },
      markerTotal: 86,
      calculatedTotal: 0,
      percentage: 0,
      errors: [],
      status: "pending",
      markedBy: "Mr. Botha",
    },
    {
      id: "4",
      studentName: "Amahle Zulu",
      examNumber: "2026-MAT-0091",
      subjectId: "maths",
      marks: { m1: 15, m2: 20, m3: 25, m4: 20, m5: 15, m6: 25, m7: 30 },
      markerTotal: 150,
      calculatedTotal: 0,
      percentage: 0,
      errors: [],
      status: "verified",
      markedBy: "Mr. Botha",
      verifiedBy: "Mr. Nkosi",
    },
    {
      id: "5",
      studentName: "Kagiso Molefe",
      examNumber: "2026-MAT-0103",
      subjectId: "maths",
      marks: { m1: 8, m2: 12, m3: 15, m4: 35, m5: 10, m6: 14, m7: 18 },
      markerTotal: 112,
      calculatedTotal: 0,
      percentage: 0,
      errors: [],
      status: "pending",
      markedBy: "Mrs. Van der Merwe",
    },
  ];

  return entries.map((e) => {
    const result = detectErrors(e, subject);
    return { ...e, ...result };
  });
}
