"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, BarChart3, Loader2, TrendingUp, AlertCircle } from "lucide-react";
import { summarizeVisitorActivity } from "@/ai/flows/summarize-visitor-activity-flow";
import { analyzeVisitorTrends } from "@/ai/flows/analyze-visitor-trends-flow";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AIAnalytics({ visitorData }: { visitorData: any[] }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateSummary = async () => {
    if (visitorData.length === 0) return;
    setLoading(true);
    try {
      const result = await summarizeVisitorActivity({
        timeRange: "week",
        visitorData: visitorData.map(v => ({
          timestamp: v.timestamp,
          department: v.department,
          reasonForVisit: v.reason,
          facility: v.facility
        }))
      });
      setSummary(result.summary);
      
      const trendResult = await analyzeVisitorTrends({
        visitorRecords: visitorData.map(v => ({
          timestamp: v.timestamp,
          email: v.email,
          department: v.department,
          reasonForVisit: v.reason,
          facility: v.facility as "Library" | "Dean's Office",
        }))
      });
      setTrends(trendResult.trends);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-headline font-bold">AI Analytics Insights</h2>
          <p className="text-muted-foreground">Generative intelligence for operational decisions.</p>
        </div>
        <Button 
          onClick={handleGenerateSummary} 
          disabled={loading || visitorData.length === 0}
          className="bg-primary hover:bg-primary/90 gap-2 shadow-lg"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate Report
        </Button>
      </div>

      {!summary && !loading && (
        <Card className="border-dashed border-2 flex items-center justify-center p-12 text-center">
          <div className="space-y-4 max-w-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium">Ready for Analysis</h3>
            <p className="text-sm text-muted-foreground">Click the generate button to process current visitor records with AI.</p>
          </div>
        </Card>
      )}

      {loading && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="animate-pulse h-[300px]" />
          <Card className="animate-pulse h-[300px]" />
        </div>
      )}

      {summary && !loading && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Operational Summary
              </CardTitle>
              <CardDescription>AI-generated overview of recent activities</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  {summary.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 leading-relaxed">{line}</p>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h3 className="font-bold flex items-center gap-2 px-2">
              <AlertCircle className="w-4 h-4 text-accent" />
              Key Trends Identified
            </h3>
            {trends.map((trend, i) => (
              <Card key={i} className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-[10px] uppercase font-bold text-primary border-primary/20">
                      {trend.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold mt-1">{trend.description}</CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-2">
                  <p><span className="font-semibold text-foreground">Impact:</span> {trend.impact}</p>
                  <p className="bg-muted/30 p-2 rounded italic"><span className="font-semibold text-foreground">Rec:</span> {trend.recommendation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}