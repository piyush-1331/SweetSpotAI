import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, AlertTriangle, CheckCircle, Droplets, Gauge, Settings, Wind, Zap, Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface SensorData {
  timestamp: string;
  pol: number; // Sugar percentage
  brix: number; // Total soluble solids
  fiber: number;
  purity: number;
  confidence: number;
  status: 'Normal' | 'Warning' | 'Critical';
}

interface DashboardProps {
  isSimulating: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ isSimulating }) => {
  const [data, setData] = useState<SensorData[]>([]);
  const [currentReading, setCurrentReading] = useState<SensorData | null>(null);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [spectralData, setSpectralData] = useState<{nm: number, value: number}[]>([]);
  const [conveyorSpeed, setConveyorSpeed] = useState(1.5); // m/s
  const [caneVariety, setCaneVariety] = useState('Co 0238'); // Common variety
  
  // Simulation Logic
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      // Simulate realistic fluctuations based on variety
      let basePol = 13.5;
      if (caneVariety === 'Co 86032') basePol = 14.2;
      if (caneVariety === 'CoM 0265') basePol = 12.8;

      const noise = (Math.random() - 0.5) * 1.5;
      const pol = Number((basePol + noise).toFixed(2));
      
      // Brix is usually Pol / Purity. Let's say Purity is ~85%
      const purity = 85 + (Math.random() - 0.5) * 5;
      const brix = Number((pol / (purity / 100)).toFixed(2));
      
      const fiber = Number((12 + (Math.random() - 0.5) * 2).toFixed(2));
      const confidence = Number((95 + (Math.random() - 0.5) * 5).toFixed(1));

      const status = pol < 11 ? 'Critical' : pol < 12.5 ? 'Warning' : 'Normal';

      const newReading: SensorData = {
        timestamp: timeStr,
        pol,
        brix,
        fiber,
        purity: Number(purity.toFixed(1)),
        confidence,
        status
      };

      setCurrentReading(newReading);
      
      setData(prev => {
        const newData = [...prev, newReading];
        if (newData.length > 30) newData.shift(); // Keep last 30 readings
        return newData;
      });

      if (status === 'Critical') {
        setAlerts(prev => [`[${timeStr}] Low Pol Detected: ${pol}%`, ...prev].slice(0, 5));
      }

      // Generate Spectral Data (900nm - 1700nm)
      const spectrum = [];
      for (let nm = 900; nm <= 1700; nm += 10) {
        // Create a fake absorption curve with peaks at sugar wavelengths
        let val = 0.5 + Math.random() * 0.05;
        // Sugar absorption peaks approx at 980nm, 1200nm, 1450nm, 1580nm
        if (Math.abs(nm - 980) < 50) val += 0.3 * Math.exp(-Math.pow(nm - 980, 2) / 1000);
        if (Math.abs(nm - 1200) < 60) val += 0.4 * Math.exp(-Math.pow(nm - 1200, 2) / 1500);
        if (Math.abs(nm - 1450) < 40) val += 0.6 * Math.exp(-Math.pow(nm - 1450, 2) / 800); // Water peak
        
        // Modulate by Pol content
        val *= (1 + (pol - 13.5) * 0.05);

        spectrum.push({ nm, value: val });
      }
      setSpectralData(spectrum);

    }, 1000 / conveyorSpeed); // Speed affects update rate

    return () => clearInterval(interval);
  }, [isSimulating, conveyorSpeed, caneVariety]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Pol % (Sugar)" 
          value={currentReading?.pol.toString() || "--"} 
          unit="%" 
          icon={<Zap className="w-5 h-5 text-yellow-500" />}
          trend={currentReading ? (currentReading.pol > 13 ? 'up' : 'down') : 'neutral'}
          status={currentReading?.status || 'Normal'}
        />
        <StatCard 
          title="Brix" 
          value={currentReading?.brix.toString() || "--"} 
          unit="°Bx" 
          icon={<Droplets className="w-5 h-5 text-blue-500" />}
          trend="neutral"
        />
        <StatCard 
          title="Purity" 
          value={currentReading?.purity.toString() || "--"} 
          unit="%" 
          icon={<Activity className="w-5 h-5 text-green-500" />}
          trend="up"
        />
        <StatCard 
          title="System Confidence" 
          value={currentReading?.confidence.toString() || "--"} 
          unit="%" 
          icon={<Gauge className="w-5 h-5 text-purple-500" />}
          trend="neutral"
          inverse
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Charts Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Pol Chart */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Real-time Pol Analysis</h3>
                <p className="text-sm text-zinc-500">Live NIR Spectroscopy Stream</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="flex h-3 w-3 relative">
                  <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isSimulating ? "bg-green-400" : "bg-zinc-400")}></span>
                  <span className={cn("relative inline-flex rounded-full h-3 w-3", isSimulating ? "bg-green-500" : "bg-zinc-500")}></span>
                </span>
                <span className="text-xs font-medium text-zinc-500">{isSimulating ? 'LIVE' : 'PAUSED'}</span>
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorPol" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EAB308" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#EAB308" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.1} />
                  <XAxis dataKey="timestamp" stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis domain={[10, 16]} stroke="#888" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="pol" stroke="#EAB308" strokeWidth={2} fillOpacity={1} fill="url(#colorPol)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Spectral Analysis Chart */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Raw Spectral Data</h3>
              <span className="text-xs font-mono text-zinc-500">900nm - 1700nm</span>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={spectralData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.1} />
                  <XAxis dataKey="nm" stroke="#888" fontSize={10} tickLine={false} axisLine={false} interval={10} />
                  <YAxis hide domain={[0, 1.5]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                    labelFormatter={(label) => `${label}nm`}
                  />
                  <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Health */}
        <div className="space-y-6">
          
          {/* Control Panel */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-2 mb-6">
              <Settings className="w-5 h-5 text-zinc-500" />
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Simulation Controls</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Conveyor Speed</label>
                  <span className="text-xs font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">{conveyorSpeed} m/s</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" 
                  max="3.0" 
                  step="0.1" 
                  value={conveyorSpeed}
                  onChange={(e) => setConveyorSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">Cane Variety</label>
                <select 
                  value={caneVariety}
                  onChange={(e) => setCaneVariety(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Co 0238">Co 0238 (Standard)</option>
                  <option value="Co 86032">Co 86032 (High Sugar)</option>
                  <option value="CoM 0265">CoM 0265 (Low Sugar)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Health Status */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Sensor Health</h3>
            <div className="space-y-4">
              <HealthItem label="NIR Spectrometer" status="active" />
              <HealthItem label="RGB Camera" status="active" />
              <HealthItem label="Air Purge System" status="active" />
              <HealthItem label="Edge Processor" status="warning" message="High Temp (65°C)" />
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm h-[200px] overflow-hidden flex flex-col">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-orange-500" />
              Recent Alerts
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {alerts.length === 0 ? (
                <p className="text-sm text-zinc-500 italic">No active alerts.</p>
              ) : (
                alerts.map((alert, i) => (
                  <div key={i} className="text-xs p-2 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded">
                    {alert}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const StatCard = ({ title, value, unit, icon, trend, status, inverse }: any) => {
  const isCritical = status === 'Critical';
  const isWarning = status === 'Warning';
  
  return (
    <div className={cn(
      "p-6 rounded-xl border shadow-sm transition-all duration-300",
      isCritical ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" : 
      isWarning ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" :
      "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
    )}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{title}</span>
        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="flex items-baseline space-x-1">
        <span className={cn("text-3xl font-bold tracking-tight", isCritical ? "text-red-600 dark:text-red-400" : "text-zinc-900 dark:text-zinc-100")}>
          {value}
        </span>
        <span className="text-sm text-zinc-500">{unit}</span>
      </div>
    </div>
  );
};

const HealthItem = ({ label, status, message }: { label: string, status: 'active' | 'warning' | 'error', message?: string }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className={cn(
        "w-2 h-2 rounded-full",
        status === 'active' ? "bg-green-500" : status === 'warning' ? "bg-yellow-500" : "bg-red-500"
      )} />
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
    </div>
    {message ? (
      <span className="text-xs text-yellow-600 dark:text-yellow-500">{message}</span>
    ) : (
      <span className="text-xs text-green-600 dark:text-green-500">OK</span>
    )}
  </div>
);
