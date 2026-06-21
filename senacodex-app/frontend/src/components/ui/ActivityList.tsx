import { Activity } from '@types/index';
import './ActivityList.css';

interface ActivityListProps {
  activities: Activity[];
}

export default function ActivityList({ activities }: ActivityListProps) {
  if (!activities || activities.length === 0) {
    return <div className="activity-empty">Nenhuma atividade recente</div>;
  }

  return (
    <div className="activities-list">
      {activities.map((activity) => (
        <div key={activity.id} className="activity-item">
          <div className="activity-left">
            <div className="activity-icon">
              <i className={activity.icon}></i>
            </div>
            <div className="activity-text">{activity.text}</div>
          </div>
          <div className="activity-time">{activity.time}</div>
        </div>
      ))}
    </div>
  );
}
