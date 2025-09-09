# **App Name**: City Insights Analyzer

## Core Features:

- CSV Data Upload: Enable users to upload a CSV file containing 311 service request data. Input limited to CSV files, with helpful error messages shown on incorrect file upload.
- Data Parsing & Calculation: Parse uploaded data, calculate 'response_time_in_days' from 'date_submitted' and 'date_completed', and flag incorrectly formatted rows to be ignored in subsequent computations.
- Average Response Time Chart: Generate a bar chart showing average response time for each service request type. Sort chart in terms of fastest to slowest for easy at-a-glance interpretation.
- Response Time Distribution Histogram: Display a histogram illustrating the distribution of response times across all service requests. The system uses an AI tool to determine the most appropriate bucketing for the data.
- Key Performance Indicator (KPI) Cards: Show cards displaying overall average response time and total requests analyzed.
- Sortable/Filterable Data Table: Present the raw data (including calculated response times) in an interactive table that can be sorted and filtered.
- Client-Side Operation: Operate entirely on the client side, discarding all information when the browser session ends.

## Style Guidelines:

- Primary color: Muted blue (#5D9CEC) for a professional and trustworthy feel, echoing the responsibility of public service.
- Background color: Light gray (#F0F4F8) to ensure readability and reduce eye strain during prolonged data analysis.
- Accent color: Soft orange (#FFA07A) for interactive elements and key performance indicators, providing visual interest without overwhelming the user.
- Body and headline font: 'Inter' sans-serif for clear data presentation.
- Use clear, universal icons for file upload and data sorting.
- Employ a responsive layout, optimized for desktop screens.
- Use subtle transitions when data is loaded/updated.