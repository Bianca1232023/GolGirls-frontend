import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Point {
  mes: string
  pct: number
}

interface EngagementLineChartProps {
  data: Point[]
  filterKey: string
}

export function EngagementLineChart({ data, filterKey }: EngagementLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart key={`chart-${filterKey}`} data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#fce7f3" />
        <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#6b7280' }} />
        <YAxis domain={[60, 100]} tick={{ fontSize: 11, fill: '#6b7280' }} unit="%" />
        <Tooltip
          contentStyle={{
            borderRadius: '12px',
            border: '1px solid #ff1493',
            background: 'rgba(255,255,255,0.95)',
          }}
        />
        <Line
          type="monotone"
          dataKey="pct"
          name="Frequência"
          stroke="#ff1493"
          strokeWidth={3}
          dot={{ fill: '#a020f0', r: 4 }}
          activeDot={{ r: 6, fill: '#ff1493' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
