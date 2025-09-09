"use client";

import { useState, useMemo } from 'react';
import type { ServiceRequest } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from './ui/scroll-area';

type SortKey = keyof ServiceRequest;

export default function DataTable({ data }: { data: ServiceRequest[] }) {
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'response_time_in_days', direction: 'descending' });
  const [filter, setFilter] = useState('');

  const handleSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredData = useMemo(() => {
    let sortableItems = [...data];

    if (filter) {
      sortableItems = sortableItems.filter((item) =>
        item.request_type.toLowerCase().includes(filter.toLowerCase())
      );
    }

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA < valB) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (valA > valB) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableItems;
  }, [data, sortConfig, filter]);

  const getSortIndicator = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
    }
    if (sortConfig.direction === 'ascending') {
        return <ArrowUp className="ml-2 h-4 w-4 text-primary" />;
    }
    return <ArrowDown className="ml-2 h-4 w-4 text-primary" />;
  };
  
  const columns: { key: SortKey; label: string; className?: string }[] = [
    { key: 'request_type', label: 'Request Type' },
    { key: 'date_submitted', label: 'Date Submitted' },
    { key: 'date_completed', label: 'Date Completed' },
    { key: 'response_time_in_days', label: 'Response Time (Days)', className: "text-right" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Service Request Details</CardTitle>
        <CardDescription>
          Browse, sort, and filter all uploaded service requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Filter by request type..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.key} className={column.className}>
                      <Button variant="ghost" onClick={() => handleSort(column.key)} className="px-2 py-1">
                        {column.label}
                        {getSortIndicator(column.key)}
                      </Button>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredData.length > 0 ? (
                  sortedAndFilteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.request_type}</TableCell>
                      <TableCell>{item.date_submitted}</TableCell>
                      <TableCell>{item.date_completed}</TableCell>
                      <TableCell className="text-right">{item.response_time_in_days}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
