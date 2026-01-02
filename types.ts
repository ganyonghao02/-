
export interface WeeklyReportState {
  inputText: string;
  resultMarkdown: string;
  isLoading: boolean;
  error: string | null;
}

export interface ReportHistoryItem {
  id: string;
  timestamp: number;
  input: string;
  output: string;
}
