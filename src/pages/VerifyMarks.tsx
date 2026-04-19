import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  generateDemoEntries,
  defaultSubjects,
  type StudentEntry,
} from "@/lib/store";
import {
  CheckCircle2,
  AlertTriangle,
  Eye,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function VerifyMarks() {
  const [entries, setEntries] = useState<StudentEntry[]>(generateDemoEntries());
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<StudentEntry | null>(null);

  const filtered = entries.filter((e) => {
    if (filter === "errors") return e.errors.length > 0;
    if (filter === "clean") return e.errors.length === 0;
    if (filter === "pending") return e.status === "pending";
    if (filter === "verified") return e.status === "verified";
    return true;
  });

  const handleVerify = (id: string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: "verified" as const, verifiedBy: "Current Moderator" } : e
      )
    );
    setSelected(null);
    toast.success("Script verified successfully");
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading">Verify Marks</h1>
          <p className="text-sm text-muted-foreground">
            Review and verify marked scripts as a moderator
          </p>
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scripts</SelectItem>
            <SelectItem value="errors">With Errors</SelectItem>
            <SelectItem value="clean">Clean</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        {filtered.map((entry) => {
          const subject = defaultSubjects.find(
            (s) => s.id === entry.subjectId
          );
          return (
            <Card
              key={entry.id}
              className={
                entry.errors.length > 0
                  ? "border-destructive/30"
                  : entry.status === "verified"
                  ? "border-success/30"
                  : ""
              }
            >
              <CardContent className="py-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{entry.studentName}</p>
                    <Badge variant="outline" className="text-[10px]">
                      {entry.examNumber}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {subject?.name} · Marked by {entry.markedBy}
                    {entry.verifiedBy && ` · Verified by ${entry.verifiedBy}`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-heading text-lg">
                      {entry.calculatedTotal}/{subject?.totalMarks}
                    </p>
                    {entry.markerTotal !== null &&
                      entry.markerTotal !== entry.calculatedTotal && (
                        <p className="text-xs text-destructive">
                          Marker wrote: {entry.markerTotal}
                        </p>
                      )}
                  </div>

                  {entry.errors.length > 0 ? (
                    <Badge variant="destructive">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {entry.errors.length}
                    </Badge>
                  ) : (
                    <Badge className="bg-success text-success-foreground">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Clean
                    </Badge>
                  )}

                  <Badge
                    variant={
                      entry.status === "verified" ? "default" : "secondary"
                    }
                  >
                    {entry.status}
                  </Badge>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelected(entry)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {selected?.studentName} — {selected?.examNumber}
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              {(() => {
                const subject = defaultSubjects.find(
                  (s) => s.id === selected.subjectId
                );
                return (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      {subject?.questions.map((q) => {
                        const mark = selected.marks[q.id];
                        const hasError = selected.errors.some(
                          (e) => e.questionId === q.id
                        );
                        return (
                          <div
                            key={q.id}
                            className={`p-2 rounded text-center text-sm border ${
                              hasError
                                ? "border-destructive bg-destructive/5"
                                : "border-border bg-muted/30"
                            }`}
                          >
                            <p className="text-xs text-muted-foreground">
                              Q{q.number}
                            </p>
                            <p className="font-heading text-lg">
                              {mark ?? (
                                <span className="text-destructive">—</span>
                              )}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              / {q.maxMarks}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted">
                      <span className="text-sm">Calculated Total</span>
                      <span className="font-heading text-xl">
                        {selected.calculatedTotal}/{subject?.totalMarks} (
                        {selected.percentage}%)
                      </span>
                    </div>

                    {selected.markerTotal !== null &&
                      selected.markerTotal !== selected.calculatedTotal && (
                        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Marker total ({selected.markerTotal}) differs from
                          calculated ({selected.calculatedTotal})
                        </div>
                      )}

                    {selected.errors.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Errors Found</h4>
                        {selected.errors.map((err, i) => (
                          <div
                            key={i}
                            className="text-xs p-2 rounded bg-destructive/5 border border-destructive/20 flex items-start gap-2"
                          >
                            <X className="h-3 w-3 text-destructive mt-0.5" />
                            <span>{err.message}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {selected.status === "pending" && (
                      <Button
                        className="w-full bg-success text-success-foreground hover:bg-success/90"
                        onClick={() => handleVerify(selected.id)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Verify Script
                      </Button>
                    )}
                  </>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
