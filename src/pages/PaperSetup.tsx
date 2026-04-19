import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { defaultSubjects, type Subject, type Question } from "@/lib/store";
import { Plus, Trash2, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

export default function PaperSetup() {
  const [subjects, setSubjects] = useState<Subject[]>(defaultSubjects);
  const [newName, setNewName] = useState("");

  const addSubject = () => {
    if (!newName.trim()) return;
    const id = newName.toLowerCase().replace(/\s+/g, "-");
    setSubjects((prev) => [
      ...prev,
      { id, name: newName.trim(), questions: [], totalMarks: 0 },
    ]);
    setNewName("");
    toast.success(`Subject "${newName.trim()}" added`);
  };

  const addQuestion = (subjectId: string) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== subjectId) return s;
        const qNum = s.questions.length + 1;
        const newQ: Question = {
          id: `${subjectId}-q${qNum}`,
          number: String(qNum),
          maxMarks: 10,
        };
        const questions = [...s.questions, newQ];
        return {
          ...s,
          questions,
          totalMarks: questions.reduce((sum, q) => sum + q.maxMarks, 0),
        };
      })
    );
  };

  const updateMaxMarks = (subjectId: string, questionId: string, value: number) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== subjectId) return s;
        const questions = s.questions.map((q) =>
          q.id === questionId ? { ...q, maxMarks: value } : q
        );
        return {
          ...s,
          questions,
          totalMarks: questions.reduce((sum, q) => sum + q.maxMarks, 0),
        };
      })
    );
  };

  const removeQuestion = (subjectId: string, questionId: string) => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id !== subjectId) return s;
        const questions = s.questions.filter((q) => q.id !== questionId);
        return {
          ...s,
          questions,
          totalMarks: questions.reduce((sum, q) => sum + q.maxMarks, 0),
        };
      })
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-heading">Paper Setup</h1>
        <p className="text-sm text-muted-foreground">
          Define subjects, questions, and maximum marks per question
        </p>
      </div>

      {/* Add Subject */}
      <Card className="mb-6">
        <CardContent className="pt-6 flex gap-3">
          <Input
            placeholder="New subject name (e.g. Geography)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={addSubject} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Plus className="h-4 w-4 mr-1" /> Add Subject
          </Button>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id}>
            <CardHeader>
              <CardTitle className="text-base font-heading flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-secondary" />
                  {subject.name}
                </span>
                <Badge variant="outline">
                  Total: {subject.totalMarks}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                {subject.questions.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center gap-3 p-2 rounded bg-muted/50"
                  >
                    <span className="text-sm w-16">Q{q.number}</span>
                    <div className="flex items-center gap-2 flex-1">
                      <Label className="text-xs text-muted-foreground">
                        Max:
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        value={q.maxMarks}
                        onChange={(e) =>
                          updateMaxMarks(
                            subject.id,
                            q.id,
                            Number(e.target.value)
                          )
                        }
                        className="w-20 h-8"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeQuestion(subject.id, q.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addQuestion(subject.id)}
              >
                <Plus className="h-3 w-3 mr-1" /> Add Question
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
