"use client";

import { useState } from "react";
import { UploadCloud, AlertCircle } from "lucide-react";
import { differenceInDays, isValid } from "date-fns";
import type { ServiceRequest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onDataUploaded: (data: ServiceRequest[], error: string | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string | null;
}

export default function FileUploader({ onDataUploaded, isLoading, setIsLoading, error }: FileUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const parseCSV = (csvText: string): { data: ServiceRequest[], error: string | null } => {
    const lines = csvText.split(/\r\n|\n/).filter(line => line.trim() !== "");
    if (lines.length < 2) {
      return { data: [], error: "CSV file must have a header and at least one data row." };
    }

    const header = lines[0].split(',').map(h => h.trim());
    const requiredColumns = ['request_type', 'date_submitted', 'date_completed'];
    const missingColumns = requiredColumns.filter(col => !header.includes(col));

    if (missingColumns.length > 0) {
      return { data: [], error: `CSV is missing required columns: ${missingColumns.join(', ')}.` };
    }

    const requestTypeIndex = header.indexOf('request_type');
    const dateSubmittedIndex = header.indexOf('date_submitted');
    const dateCompletedIndex = header.indexOf('date_completed');
    
    const data: ServiceRequest[] = [];
    const rows = lines.slice(1);
    
    rows.forEach((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const dateSubmitted = new Date(values[dateSubmittedIndex]);
      const dateCompleted = new Date(values[dateCompletedIndex]);

      if (
        values.length === header.length &&
        values[requestTypeIndex] &&
        isValid(dateSubmitted) &&
        isValid(dateCompleted) &&
        dateCompleted >= dateSubmitted
      ) {
        data.push({
          id: `req-${index}`,
          request_type: values[requestTypeIndex],
          date_submitted: values[dateSubmittedIndex],
          date_completed: values[dateCompletedIndex],
          response_time_in_days: differenceInDays(dateCompleted, dateSubmitted),
        });
      }
      // Silently ignore invalid rows as per requirement
    });

    if(data.length === 0) {
        return { data: [], error: "No valid data rows could be parsed. Please check file format and content." };
    }

    return { data, error: null };
  };

  const handleFile = (file: File) => {
    if (file) {
      if (file.type !== 'text/csv') {
        onDataUploaded([], 'Incorrect file type. Please upload a CSV file.');
        return;
      }
      setIsLoading(true);
      setFileName(file.name);
      setProgress(0);

      const reader = new FileReader();
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentage = Math.round((event.loaded * 100) / event.total);
          setProgress(percentage);
        }
      };
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const { data, error: parseError } = parseCSV(text);
        onDataUploaded(data, parseError);
        setProgress(100);
      };
      reader.onerror = () => {
        onDataUploaded([], "Failed to read the file.");
        setIsLoading(false);
      }
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-16">
        <Card className="w-full max-w-lg text-center shadow-lg">
            <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full mb-4">
                  <UploadCloud className="w-10 h-10" />
                </div>
                <CardTitle className="font-headline">Upload Your Service Request Data</CardTitle>
                <CardDescription>
                    Select a CSV file with columns: `request_type`, `date_submitted`, and `date_completed`.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Upload Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {isLoading ? (
                    <div className="space-y-2 px-6">
                      <p className="text-sm text-muted-foreground">Processing {fileName}...</p>
                      <Progress value={progress} className="w-full" />
                    </div>
                ) : (
                    <div className="flex justify-center">
                      <Button asChild size="lg">
                          <label htmlFor="csv-upload" className="cursor-pointer">
                              Select CSV File
                              <input
                                  id="csv-upload"
                                  type="file"
                                  className="hidden"
                                  accept=".csv"
                                  onChange={(e) => e.target.files && handleFile(e.target.files[0])}
                              />
                          </label>
                      </Button>
                    </div>
                )}
                <p className="text-xs text-muted-foreground pt-4">All data is processed locally in your browser and is never uploaded to a server.</p>
            </CardContent>
        </Card>
    </div>
  );
}
