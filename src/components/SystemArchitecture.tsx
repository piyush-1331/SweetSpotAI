import React from 'react';
import { Camera, Cpu, Database, Globe, LayoutDashboard, Radio, Server, Zap } from 'lucide-react';

export const SystemArchitecture = () => {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm overflow-x-auto">
      <h2 className="text-2xl font-bold mb-8 text-center text-zinc-900 dark:text-zinc-100">System Architecture Diagram</h2>
      
      <div className="min-w-[800px] flex flex-col items-center space-y-12 relative">
        
        {/* Physical Layer */}
        <div className="flex space-x-8 items-stretch">
          <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-6 rounded-xl relative bg-zinc-50 dark:bg-zinc-900/50">
            <span className="absolute -top-3 left-4 bg-white dark:bg-zinc-900 px-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">Physical Layer</span>
            <div className="flex space-x-4">
              <Node 
                icon={<Zap className="w-6 h-6 text-blue-500" />}
                title="NIR Spectrometer" 
                desc="900-1700nm Range" 
                color="border-blue-500"
              />
              <Node 
                icon={<Camera className="w-6 h-6 text-purple-500" />}
                title="RGB Camera" 
                desc="Trash Detection" 
                color="border-purple-500"
              />
              <Node 
                icon={<Radio className="w-6 h-6 text-green-500" />}
                title="Distance Sensor" 
                desc="Cane Trigger" 
                color="border-green-500"
              />
            </div>
          </div>
        </div>

        {/* Arrow Down */}
        <div className="h-12 w-0.5 bg-zinc-300 dark:bg-zinc-700 relative">
          <div className="absolute top-1/2 left-2 text-xs text-zinc-400 whitespace-nowrap -translate-y-1/2">USB / GPIO</div>
        </div>

        {/* Edge Layer */}
        <div className="border-2 border-zinc-300 dark:border-zinc-700 p-6 rounded-xl relative bg-zinc-100 dark:bg-zinc-800">
           <span className="absolute -top-3 left-4 bg-white dark:bg-zinc-900 px-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">Edge Processing Unit</span>
           <div className="flex items-center space-x-8">
             <div className="text-center">
               <div className="w-24 h-24 bg-zinc-900 rounded-lg flex items-center justify-center text-white shadow-lg mx-auto mb-2">
                 <Cpu className="w-10 h-10" />
               </div>
               <p className="text-xs font-medium">Jetson Nano</p>
             </div>
             
             <div className="flex-1 space-y-2">
               <ProcessStep title="1. Preprocessing" desc="Dark Current, SNV" />
               <ProcessStep title="2. ML Inference" desc="1D-CNN Model" />
               <ProcessStep title="3. Data Formatting" desc="JSON Payload" />
             </div>
           </div>
        </div>

        {/* Arrow Down */}
        <div className="h-12 w-0.5 bg-zinc-300 dark:bg-zinc-700 relative">
          <div className="absolute top-1/2 left-2 text-xs text-zinc-400 whitespace-nowrap -translate-y-1/2">MQTT / WebSocket (WiFi/Ethernet)</div>
        </div>

        {/* Application Layer */}
        <div className="flex space-x-8 w-full justify-center">
          <div className="border border-zinc-200 dark:border-zinc-700 p-4 rounded-xl bg-white dark:bg-zinc-900 shadow-sm w-64 flex flex-col items-center">
            <Server className="w-8 h-8 text-zinc-400 mb-2" />
            <h4 className="font-bold text-center mb-2">Cloud / Server</h4>
            <div className="text-xs text-zinc-500 text-center space-y-1">
              <p>• Historical Database</p>
              <p>• Model Retraining</p>
              <p>• API Gateway</p>
            </div>
          </div>

          <div className="border-2 border-blue-500 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 shadow-sm w-64 flex flex-col items-center">
            <LayoutDashboard className="w-8 h-8 text-blue-500 mb-2" />
            <h4 className="font-bold text-center mb-2 text-blue-700 dark:text-blue-300">Operator Dashboard</h4>
            <div className="text-xs text-blue-600 dark:text-blue-400 text-center space-y-1">
              <p>• Real-time Visualization</p>
              <p>• Alerts & Alarms</p>
              <p>• System Control</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const Node = ({ icon, title, desc, color }: any) => (
  <div className={`flex flex-col items-center p-3 bg-white dark:bg-zinc-800 rounded-lg border-b-4 shadow-sm w-32 ${color}`}>
    <span className="mb-2">{icon}</span>
    <span className="text-xs font-bold text-center">{title}</span>
    <span className="text-[10px] text-zinc-500 text-center leading-tight mt-1">{desc}</span>
  </div>
);

const ProcessStep = ({ title, desc }: any) => (
  <div className="flex items-center space-x-2 bg-white dark:bg-zinc-900 p-2 rounded border border-zinc-200 dark:border-zinc-700 w-48">
    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
    <div>
      <div className="text-xs font-bold">{title}</div>
      <div className="text-[10px] text-zinc-500">{desc}</div>
    </div>
  </div>
);
