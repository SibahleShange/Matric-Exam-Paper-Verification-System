import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { defaultSubjects, detectErrors, type MarkingError } from "@/lib/store";
import { AlertTriangle, CheckCircle2, PenLine } from "lucide-react";
import { toast } from "sonner";

export default function EnterMarks() {
  const [subjectId, setSubjectId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [examNumber, setExamNumber] = useState("");
  const [markerTotal, setMarkerTotal] = useState("");
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<MarkingError[]>([]);
  const [calculatedTotal, setCalculatedTotal] = useState<number | null>(null);
  const [percentage, setPercentage] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const subject = defaultSubjects.find((s) => s.id === subjectId);

  const handleMarkChange = (questionId: string, value: string) => {
    setMarks((prev) => ({ ...prev, [questionId]: value }));
    setSubmitted(false);
  };

  const handleVerify = () => {
    if (!subject) return;

    const parsedMarks: Record<string, number | null> = {};
    for (const q of subject.questions) {
      const val = marks[q.id];
      parsedMarks[q.id] = val === "" || val === undefined ? null : Number(val);
    }

    const result = detectErrors(
      {
        id: "",
        studentName,
        examNumber,
        subjectId,
        marks: parsedMarks,
        markerTotal: markerTotal ? Number(markerTotal) : null,
        status: "pending",
        markedBy: "Current User",
      },
      subject
    );

    setErrors(result.errors);
    setCalculatedTotal(result.calculatedTotal);
    setPercentage(result.percentage);
    setSubmitted(true);

    if (result.errors.length === 0) {
      toast.success("No errors detected! Marks verified successfully.");
    } else {
      toast.error(`${result.errors.length} error(s) detected. Please review.`);
    }
  };

  const handleReset = () => {
    setStudentName("");
    setExamNumber("");
    setMarkerTotal("");
    setMarks({});
    setErrors([]);
    setCalculatedTotal(null);
    setPercentage(null);
    setSubmitted(false);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-heading">Enter Marks</h1>
        <p className="text-sm text-muted-foreground">
          Capture student marks and verify totals automatically
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Student Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-heading flex items-center gap-2">
                <PenLine className="h-4 w-4 text-secondary" />
                Student Details
              </CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-xs">Student Name</Label>
                <Input
                  placeholder="e.g. Thabo Mokoena"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Exam Number</Label>
                <Input
                  placeholder="e.g. 2026-MAT-0012"
                  value={examNumber}
                  onChange={(e) => setExamNumber(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Subject</Label>
                <Select value={subjectId} onValueChange={setSubjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultSubjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Marks Entry */}
          {subject && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-heading">
                  Marks per Question — {subject.name} ({subject.totalMarks} marks)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
                  {subject.questions.map((q) => {
                    const hasError =
                      submitted &&
                      errors.some((e) => e.questionId === q.id);
                    return (
                      <div key={q.id}>
                        <Label className="text-xs flex items-center justify-between">
                          <span>Q{q.number}</span>
                          <span className="text-muted-foreground">
                            / {q.maxMarks}
                          </span>
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          max={q.maxMarks}
                          placeholder="0"
                          value={marks[q.id] || ""}
                          onChange={(e) =>
                            handleMarkChange(q.id, e.target.value)
                          }
                          className={
                            hasError
                              ? "border-destructive ring-destructive/30 ring-2"
                              : ""
                          }
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-end gap-4 border-t border-border pt-4">
                  <div className="w-48">
                    <Label className="text-xs">Marker's Written Total</Label>
                    <Input
                      type="number"
                      placeholder="e.g. 125"
                      value={markerTotal}
                      onChange={(e) => setMarkerTotal(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleVerify} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    Verify & Calculate
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {submitted && calculatedTotal !== null && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-heading">
                    Calculated Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-4xl font-heading">
                    {calculatedTotal}
                    <span className="text-lg text-muted-foreground">
                      /{subject?.totalMarks}
                    </span>
                  </p>
                  <p className="text-2xl font-heading text-secondary mt-1">
                    {percentage}%
                  </p>
                  {markerTotal && Number(markerTotal) !== calculatedTotal && (
                    <div className="mt-3 p-2 rounded bg-destructive/10 text-destructive text-sm">
                      Marker wrote: {markerTotal} — Difference:{" "}
                      {Math.abs(Number(markerTotal) - calculatedTotal)}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-heading flex items-center gap-2">
                    {errors.length > 0 ? (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    )}
                    Error Detection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {errors.length === 0 ? (
                    <p className="text-sm text-success font-medium">
                      ✓ No errors detected
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {errors.map((err, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 p-2 rounded bg-destructive/5 border border-destructive/20"
                        >
                          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                          <div>
                            <Badge
                              variant="destructive"
                              className="text-[10px] mb-1"
                            >
                              {err.type.replace(/_/g, " ")}
                            </Badge>
                            <p className="text-xs">{err.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
