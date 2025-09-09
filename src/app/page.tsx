"use client";

import { useState } from "react";
import type { ServiceRequest } from "@/lib/types";
import FileUploader from "@/components/file-uploader";
import Dashboard from "@/components/dashboard";
import { AppLogo } from "@/components/icons";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [data, setData] = useState<ServiceRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDataUploaded = (
    uploadedData: ServiceRequest[],
    uploadError: string | null
  ) => {
    if (uploadError) {
      setError(uploadError);
      setData(null);
    } else {
      setData(uploadedData);
      setError(null);
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <AppLogo className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight font-headline">
              City Insights Analyzer
            </h1>
          </div>
          {data && (
            <Button onClick={handleReset} variant="outline">
              Analyze New File
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {data ? (
          <Dashboard data={data} />
        ) : (
          <FileUploader
            onDataUploaded={handleDataUploaded}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            error={error}
          />
        )}
      </main>
    </div>
  );
}
