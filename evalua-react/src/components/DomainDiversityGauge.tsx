import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

/**
 * @param diversity
 * @param uniqueDomains
 * @param totalStudents
 */
interface DomainDiversityGaugeProps {
  diversity: string;
  uniqueDomains: number;
  totalStudents: number;
}

export function DomainDiversityGauge({ diversity, uniqueDomains, totalStudents }: DomainDiversityGaugeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const diversityValue = Math.min(100, Math.max(0, parseFloat(diversity.replace('%', '')) || 0));
  
  const gaugeData = [
    { name: 'filled', value: diversityValue },
    { name: 'empty', value: 100 - diversityValue }
  ];

  const GAUGE_COLORS = ['#4A90E2', '#E8E8E8'];

  const waffleSize = 10;
  const totalCells = waffleSize * waffleSize;
  const ratio = totalStudents > 0 ? uniqueDomains / totalStudents : 0;
  const domainCells = Math.min(totalCells, Math.max(0, Math.round(ratio * totalCells)));
  
  const waffleData = Array.from({ length: totalCells }, (_, i) => ({
    id: i,
    filled: i < domainCells
  }));

  return (
    <div 
      className="relative inline-block cursor-pointer"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="w-24 h-12 relative transition-transform hover:scale-105">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius="70%"
              outerRadius="100%"
              paddingAngle={0}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {gaugeData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={GAUGE_COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex items-end justify-center pb-1">
          <span className="text-sm font-bold text-white">{diversity}</span>
        </div>
      </div>

      {showTooltip && (
        <div className="absolute z-50 bg-gofuniro shadow-xl border-2 border-aisumicha p-4 rounded-lg -top-2 left-28 w-64 animate-in fade-in slide-in-from-left-2 duration-200">
          <h4 className="text-sm font-semibold mb-3 text-kokushoku border-b border-aisumicha pb-2">
            Diversidad de dominios
          </h4>
          
          <div className="mb-4">
            <div 
              className="grid gap-1 mx-auto"
              style={{
                gridTemplateColumns: `repeat(${waffleSize}, 1fr)`,
                width: 'fit-content'
              }}
            >
              {waffleData.map((cell) => (
                <div
                  key={cell.id}
                  className="w-4 h-4 rounded-sm transition-all hover:scale-110"
                  style={{
                    backgroundColor: cell.filled ? '#4A90E2' : '#E8E8E8'
                  }}
                  title={cell.filled ? 'Dominio único' : 'Estudiante'}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2 text-xs bg-hakuji p-2 rounded">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm shadow-sm" style={{ backgroundColor: '#4A90E2' }}></div>
                <span className="text-kokushoku">Dominios únicos</span>
              </div>
              <span className="font-bold text-kokushoku">{uniqueDomains}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm shadow-sm" style={{ backgroundColor: '#E8E8E8' }}></div>
                <span className="text-kokushoku">Total estudiantes</span>
              </div>
              <span className="font-bold text-kokushoku">{totalStudents}</span>
            </div>
          </div>

          <div 
            className="absolute w-3 h-3 bg-gofuniro border-l-2 border-b-2 border-aisumicha transform rotate-45 -left-1.5 top-8"
          />
        </div>
      )}
    </div>
  );
}
