'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ScoreData {
  range: string;
  count: number;
}

interface ScoreBarChartProps {
  data: ScoreData[];
}

// Colores por rango de score (de menor a mayor calidad)
const SCORE_COLORS = [
  '#ef4444', // red - 0-25
  '#f59e0b', // amber - 26-50
  '#10b981', // emerald - 51-75
  '#22c55e'  // green - 76-100
];

export default function ScoreBarChart({ data }: ScoreBarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Sin datos de score
      </div>
    );
  }

  // Ordenar por rango
  const sortedData = [...data].sort((a, b) => {
    const order = ['0-25', '26-50', '51-75', '76-100'];
    return order.indexOf(a.range) - order.indexOf(b.range);
  });

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="range"
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            tickLine={{ stroke: '#4b5563' }}
            axisLine={{ stroke: '#4b5563' }}
          />
          <YAxis
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            tickLine={{ stroke: '#4b5563' }}
            axisLine={{ stroke: '#4b5563' }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#f9fafb'
            }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [value ?? 0, 'Leads']}
            labelFormatter={(label) => `Score: ${label}`}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={SCORE_COLORS[index] || '#6b7280'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
