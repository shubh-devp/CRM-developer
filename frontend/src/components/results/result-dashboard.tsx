"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Target,
  Clock,
  RotateCcw,
} from "lucide-react";
import { type ImportResult } from "@/types/csv";
import { StatCard } from "./stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";

interface ResultDashboardProps {
  result: ImportResult;
  onReset: () => void;
}

export function ResultDashboard({ result, onReset }: ResultDashboardProps) {
  const { success, skipped, stats } = result;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Import Complete</h2>
          <p className="text-muted-foreground">
            Your CSV has been processed successfully
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Import Another
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Imported"
          value={stats.imported.toLocaleString()}
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-500" />}
          description={`Out of ${stats.total.toLocaleString()} total records`}
        />
        <StatCard
          title="Skipped"
          value={stats.skipped.toLocaleString()}
          icon={<XCircle className="h-5 w-5 text-destructive" />}
          description="Records that failed validation"
        />
        <StatCard
          title="Accuracy"
          value={`${stats.accuracy}%`}
          icon={<Target className="h-5 w-5 text-primary" />}
          description="Successfully mapped records"
        />
        <StatCard
          title="Processing Time"
          value={formatDuration(stats.processingTimeMs)}
          icon={<Clock className="h-5 w-5 text-amber-500" />}
          description="Total import duration"
        />
      </div>

      {success.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Imported Records ({success.length.toLocaleString()})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Phone</th>
                    <th className="px-4 py-3 text-left font-medium">Company</th>
                    <th className="px-4 py-3 text-left font-medium">City</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {success.slice(0, 50).map((record, i) => (
                    <tr
                      key={i}
                      className="border-b border-border/50 transition-colors hover:bg-muted/50"
                    >
                      <td className="px-4 py-3 font-medium">{record.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {record.email}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {record.country_code}
                        {record.mobile_without_country_code}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {record.company}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {record.city}
                      </td>
                      <td className="px-4 py-3">
                        {record.crm_status ? (
                          <Badge
                            variant={
                              record.crm_status === "SALE_DONE"
                                ? "success"
                                : record.crm_status === "BAD_LEAD"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {record.crm_status}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {success.length > 50 && (
                <div className="border-t px-4 py-3 text-center text-sm text-muted-foreground">
                  Showing 50 of {success.length.toLocaleString()} records
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {skipped.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <XCircle className="h-5 w-5 text-destructive" />
              Skipped Records ({skipped.length.toLocaleString()})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {skipped.map((record, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm"
                >
                  <span className="font-medium text-destructive">
                    Row {record.index}:
                  </span>{" "}
                  <span className="text-muted-foreground">{record.reason}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
