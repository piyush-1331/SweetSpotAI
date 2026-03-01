import React from 'react';
import ReactMarkdown from 'react-markdown';
import { projectDocs } from '@/data/projectDocs';
import { Download, FileText } from 'lucide-react';

export const ProjectReport = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Project Documentation</h2>
            <p className="text-xs text-zinc-500">Hackathon Submission Report</p>
          </div>
        </div>
        <button 
          onClick={() => alert("This would generate a PDF of the report in a real deployment.")}
          className="flex items-center space-x-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-8 prose dark:prose-invert max-w-none prose-headings:text-zinc-900 dark:prose-headings:text-zinc-100 prose-a:text-blue-600 dark:prose-a:text-blue-400">
          <ReactMarkdown>{projectDocs}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
