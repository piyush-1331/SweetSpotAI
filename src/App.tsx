/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ProjectReport } from './components/ProjectReport';
import { SystemArchitecture } from './components/SystemArchitecture';
import { LayoutDashboard, FileText, Network, Play, Pause, Candy } from 'lucide-react';
import { cn } from '@/lib/utils';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'architecture' | 'report'>('dashboard');
  const [isSimulating, setIsSimulating] = useState(true);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-600 p-2 rounded-lg">
              <Candy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">SweetSpot AI</h1>
              <p className="text-xs text-zinc-500 font-mono">SUGARCANE ANALYTICS PROTOTYPE</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors",
                isSimulating 
                  ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300" 
                  : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300"
              )}
            >
              {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isSimulating ? "Stop Simulation" : "Start Simulation"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl mb-8 w-fit">
          <TabButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<LayoutDashboard className="w-4 h-4" />}
            label="Live Dashboard"
          />
          <TabButton 
            active={activeTab === 'architecture'} 
            onClick={() => setActiveTab('architecture')} 
            icon={<Network className="w-4 h-4" />}
            label="System Architecture"
          />
          <TabButton 
            active={activeTab === 'report'} 
            onClick={() => setActiveTab('report')} 
            icon={<FileText className="w-4 h-4" />}
            label="Project Report"
          />
        </div>

        {/* View Content */}
        <div className="min-h-[600px]">
          {activeTab === 'dashboard' && <Dashboard isSimulating={isSimulating} />}
          {activeTab === 'architecture' && <SystemArchitecture />}
          {activeTab === 'report' && <ProjectReport />}
        </div>
      </main>
    </div>
  );
}

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
      active 
        ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm" 
        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
    )}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;
