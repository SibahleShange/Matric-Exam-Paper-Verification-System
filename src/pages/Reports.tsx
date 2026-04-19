import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateDemoEntries, defaultSubjects } from "@/lib/store";
import {
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const entries = generateDemoEntries();
const totalErrors = entries.reduce((sum, e) => sum + e.errors.length, 0);
const verified = entries.filter((e) => e.status === "verified").length;
const flagged = entries.filter((e) => e.errors.length > 0).length;
const clean = entries.length - flagged;
const accuracyRate = Math.round((clean / entries.length) * 100);
const avgPercentage = Math.round(
  entries.reduce((sum, e) => sum + e.percentage, 0) / entries.length
);

const errorBreakdown = {
  missing_mark: entries.reduce(
    (sum, e) => sum + e.errors.filter((er) => er.type === "missing_mark").length,
    0
  ),
  total_mismatch: entries.reduce(
    (sum, e) =>
      sum + e.errors.filter((er) => er.type === "total_mismatch").length,
    0
  ),
  exceeds_max: entries.reduce(
    (sum, e) => sum + e.errors.filter((er) => er.type === "exceeds_max").length,
    0
  ),
};

export default function Reports() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-heading">Reports & Feedback</h1>
        <p className="text-sm text-muted-foreground">
          Marking quality insights and error analysis
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          { label: "Total Scripts", value: entries.length, icon: Users, color: "text-secondary" },
          { label: "Verified", value: verified, icon: CheckCircle2, color: "text-success" },
          { label: "Flagged", value: flagged, icon: AlertTriangle, color: "text-destructive" },
          { label: "Accuracy", value: `${accuracyRate}%`, icon: TrendingUp, color: "text-success" },
          { label: "Avg Score", value: `${avgPercentage}%`, icon: BarChart3, color: "text-accent" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6 text-center">
              <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
              <p className="text-2xl font-heading">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Error Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Error Type Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  label: "Missing Marks",
                  count: errorBreakdown.missing_mark,
                  desc: "Questions left unmarked",
                  color: "bg-warning",
                },
                {
                  label: "Total Mismatches",
                  count: errorBreakdown.total_mismatch,
                  desc: "Written total ≠ calculated total",
                  color: "bg-destructive",
                },
                {
                  label: "Exceeds Maximum",
                  count: errorBreakdown.exceeds_max,
                  desc: "Mark higher than allowed maximum",
                  color: "bg-accent",
                },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <Badge variant="outline" className="font-heading">
                      {item.count}
                    </Badge>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{
                        width: `${
                          totalErrors > 0
                            ? (item.count / totalErrors) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Student Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-heading flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-secondary" />
              Student Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {entries
                .sort((a, b) => b.percentage - a.percentage)
                .map((entry) => {
                  const subject = defaultSubjects.find(
                    (s) => s.id === entry.subjectId
                  );
                  return (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {entry.studentName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {subject?.name}
                        </p>
                      </div>
                      <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            entry.percentage >= 80
                              ? "bg-success"
                              : entry.percentage >= 50
                              ? "bg-warning"
                              : "bg-destructive"
                          }`}
                          style={{ width: `${entry.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-heading w-12 text-right">
                        {entry.percentage}%
                      </span>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
