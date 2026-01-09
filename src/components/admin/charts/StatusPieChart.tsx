'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface StatusData {
  name: string;
  value: number;
  status: string;
  [key: string]: string | number; // Index signature for Recharts compatibility
}

interface StatusPieChartProps {
  data: StatusData[];
}

// Colores por status
const STATUS_COLORS: Record<string, string> = {
  'NEW': '#3b82f6',       // blue
  'CONTACTED': '#8b5cf6', // purple
  'QUALIFIED': '#f59e0b', // amber
  'PROPOSAL': '#10b981',  // emerald
  'WON': '#22c55e',       // green
  'LOST': '#ef4444'       // red
};

export default function StatusPieChart({ data }: StatusPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Sin datos disponibles
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, value }) => `${name}: ${value}`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={STATUS_COLORS[entry.status] || '#6b7280'}
              />
            ))}
          </Pie>
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) => [value ?? 0, 'Leads']}
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#f9fafb'
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => <span style={{ color: '#6b7280' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
