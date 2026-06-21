import './StatCard.css';

interface TrendInfo {
  value: number;
  direction: 'up' | 'down';
}

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color?: 'primary' | 'danger' | 'warning' | 'info' | 'success';
  trend?: TrendInfo;
}

const colorMap = {
  primary: '#0A3D91',
  danger: '#e74c3c',
  warning: '#F37021',
  info: '#3498db',
  success: '#2ecc71',
};

export default function StatCard({
  title,
  value,
  icon,
  color = 'primary',
  trend,
}: StatCardProps) {
  const bgColor = colorMap[color];

  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-icon" style={{ backgroundColor: `${bgColor}20` }}>
        <i className={icon} style={{ color: bgColor }}></i>
      </div>
      <div className="stat-info">
        <div className="stat-title">{title}</div>
        <div className="stat-number">{value}</div>
        {trend && (
          <div className={`stat-trend trend-${trend.direction}`}>
            <i className={`fas fa-arrow-${trend.direction === 'up' ? 'up' : 'down'}`}></i>
            <span>{trend.value}% vs mês anterior</span>
          </div>
        )}
      </div>
    </div>
  );
}
