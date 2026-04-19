import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { generateDemoEntries, defaultSubjects } from "@/lib/store";
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import heroImage from "@/assets/hero-exam.jpg";
import markingImage from "@/assets/marking-paper.jpg";

const entries = generateDemoEntries();
const totalErrors = entries.reduce((sum, e) => sum + e.errors.length, 0);
const verified = entries.filter((e) => e.status === "verified").length;
const flagged = entries.filter((e) => e.errors.length > 0).length;

const stats = [
  {
    label: "Scripts Entered",
    value: entries.length,
    icon: ClipboardList,
    color: "text-secondary",
  },
  {
    label: "Verified",
    value: verified,
    icon: CheckCircle2,
    color: "text-success",
  },
  {
    label: "Errors Detected",
    value: totalErrors,
    icon: AlertTriangle,
    color: "text-warning",
  },
  {
    label: "Flagged Scripts",
    value: flagged,
    icon: FileCheck2,
    color: "text-destructive",
  },
];

export default function Index() {
  return (
    <DashboardLayout>
      {/* Hero Banner */}
      <div className="relative rounded-xl overflow-hidden mb-6">
        <img
          src={heroImage}
          alt="SA matric students writing exams"
          className="w-full h-48 md:h-56 object-cover"
          width={1920}
          height={640}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/40 flex items-center">
          <div className="px-6 md:px-10">
            <h1 className="font-heading text-2xl md:text-3xl text-primary-foreground mb-2">
              Matric Exam Verification
            </h1>
            <p className="text-primary-foreground/80 text-sm md:text-base max-w-lg font-body">
              Ensuring accuracy and fairness in every marked script. Detect errors,
              verify totals, and improve marking quality.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-heading">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Entries */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-secondary" />
                Recent Entries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {entries.map((entry) => {
                  const subject = defaultSubjects.find(
                    (s) => s.id === entry.subjectId
                  );
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {entry.studentName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {entry.examNumber} · {subject?.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-heading">
                            {entry.calculatedTotal}/{subject?.totalMarks}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {entry.percentage}%
                          </p>
                        </div>
                        {entry.errors.length > 0 ? (
                          <Badge variant="destructive" className="text-xs">
                            {entry.errors.length} error{entry.errors.length > 1 ? "s" : ""}
                          </Badge>
                        ) : (
                          <Badge className="bg-success text-success-foreground text-xs">
                            Clean
                          </Badge>
                        )}
                        <Badge
                          variant={
                            entry.status === "verified" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {entry.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Accuracy */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-heading flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-success" />
                Accuracy Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-5xl font-heading text-success">
                  {Math.round(
                    ((entries.length - flagged) / entries.length) * 100
                  )}
                  %
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {entries.length - flagged} of {entries.length} scripts error-free
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="overflow-hidden">
            <img
              src={markingImage}
              alt="Teacher marking exam papers"
              className="w-full h-36 object-cover"
              loading="lazy"
              width={800}
              height={600}
            />
            <CardContent className="pt-4">
              <h3 className="font-heading text-sm mb-1">Subjects Active</h3>
              <div className="flex flex-wrap gap-2">
                {defaultSubjects.map((s) => (
                  <Badge key={s.id} variant="outline" className="text-xs">
                    {s.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
