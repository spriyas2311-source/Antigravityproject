import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

interface SoilHealthRadarProps {
  nitrogen?: number;
  phosphorus?: number;
  potassium?: number;
  ph?: number;
  organicCarbon?: number;
}

export const SoilHealthRadarChart: React.FC<SoilHealthRadarProps> = ({
  nitrogen = 280,
  phosphorus = 15,
  potassium = 200,
  ph = 7.0,
  organicCarbon = 0.6
}) => {
  // Normalize each parameter to a 0 - 100 percentage relative to ICAR optimal benchmarks
  // Benchmarks:
  // N: 280-560 kg/ha -> 100% = 420 kg/ha
  // P: 10-25 kg/ha -> 100% = 18 kg/ha
  // K: 110-280 kg/ha -> 100% = 200 kg/ha
  // pH: optimal 6.5-7.5 -> 100% = 7.0
  // OC: optimal 0.5-0.75% -> 100% = 0.65%

  const calcScore = (val: number, optimal: number, maxCap: number) => {
    if (!val) return 30; // base score if unmeasured
    const ratio = (val / optimal) * 100;
    return Math.min(Math.round(ratio), maxCap);
  };

  const chartData = [
    {
      parameter: 'Nitrogen (N)',
      'Your Soil Score': calcScore(nitrogen, 400, 150),
      'ICAR Benchmark': 100,
      actual: `${nitrogen} kg/ha`
    },
    {
      parameter: 'Phosphorus (P)',
      'Your Soil Score': calcScore(phosphorus, 18, 150),
      'ICAR Benchmark': 100,
      actual: `${phosphorus} kg/ha`
    },
    {
      parameter: 'Potassium (K)',
      'Your Soil Score': calcScore(potassium, 200, 150),
      'ICAR Benchmark': 100,
      actual: `${potassium} kg/ha`
    },
    {
      parameter: 'Organic Carbon',
      'Your Soil Score': calcScore(organicCarbon, 0.65, 150),
      'ICAR Benchmark': 100,
      actual: `${organicCarbon}%`
    },
    {
      parameter: 'Soil pH Balance',
      'Your Soil Score': Math.max(20, Math.round(100 - Math.abs(ph - 7.0) * 20)),
      'ICAR Benchmark': 100,
      actual: `pH ${ph}`
    }
  ];

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
      <div className="text-center mb-2">
        <h4 className="text-sm font-bold text-slate-800">Soil Fertility Index (ICAR Benchmark Comparison)</h4>
        <p className="text-xs text-slate-500">100 represents balanced agricultural fertility</p>
      </div>

      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="parameter" tick={{ fill: '#475569', fontSize: 11, fontWeight: 500 }} />
            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={{ fontSize: 10 }} />
            <Tooltip
              formatter={(value: any, name: string, props: any) => [
                `${value} score (${props.payload.actual})`,
                name
              ]}
              contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#CBD5E1', borderRadius: '8px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Radar
              name="Your Soil Score"
              dataKey="Your Soil Score"
              stroke="#15803D"
              fill="#22C55E"
              fillOpacity={0.4}
            />
            <Radar
              name="ICAR Benchmark"
              dataKey="ICAR Benchmark"
              stroke="#D97706"
              fill="#F59E0B"
              fillOpacity={0.15}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

