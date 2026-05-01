import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/tasks/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <div className="app-container"><p>Loading dashboard...</p></div>;

  const statusColors = {
    "To Do": "#ef4444",
    "In Progress": "#f59e0b",
    "Done": "#10b981"
  };

  const getStatusColor = (status) => statusColors[status] || "#6b7280";

  return (
    <div>
      <Navbar />
      <div className="app-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <h1>Dashboard</h1>
            <p>Overview of all tasks and team activity</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="task-stats-grid">
          <div className="task-stat card">
            <span className="task-stat-label">Total Tasks</span>
            <strong>{stats.totalTasks}</strong>
          </div>
          <div className="task-stat card">
            <span className="task-stat-label">Overdue</span>
            <strong>{stats.overdueTasks}</strong>
          </div>
          {stats.statusStats && stats.statusStats.map((s) => (
            <div key={s._id} className="task-stat card">
              <span className="task-stat-label">{s._id}</span>
              <strong>{s.count}</strong>
            </div>
          ))}
        </div>

        {/* Status Breakdown */}
        {stats.statusStats && stats.statusStats.length > 0 && (
          <section className="dashboard-section card">
            <h2 className="section-title">Status Distribution</h2>
            <div className="status-breakdown">
              {stats.statusStats.map((s) => (
                <div key={s._id} className="status-item">
                  <div className="status-row">
                    <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                      <div style={{width: 16, height: 16, borderRadius: 4, backgroundColor: getStatusColor(s._id)}}></div>
                      <span style={{fontWeight: 600}}>{s._id}</span>
                    </div>
                    <span style={{color: '#64748b', fontSize: 14}}>{s.count} task{s.count !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="status-bar">
                    <div className="status-progress" style={{width: `${(s.count / stats.totalTasks) * 100}%`, backgroundColor: getStatusColor(s._id)}}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Tasks Per User */}
        {stats.tasksPerUser && stats.tasksPerUser.length > 0 && (
          <section className="dashboard-section card">
            <h2 className="section-title">Team Workload</h2>
            <div className="team-workload">
              {stats.tasksPerUser.map((user) => (
                <div key={user._id} className="user-item">
                  <div className="user-info">
                    <div className="user-avatar" style={{background: 'linear-gradient(135deg, #2563eb, #1d4ed8)'}}>
                      {user.userInfo?.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div style={{fontWeight: 600}}>{user.userInfo?.name || 'Unknown'}</div>
                      <div style={{fontSize: 13, color: '#64748b'}}>{user.userInfo?.email || 'No email'}</div>
                    </div>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <strong style={{fontSize: 18}}>{user.count}</strong>
                    <div style={{fontSize: 12, color: '#64748b'}}>task{user.count !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {(!stats.tasksPerUser || stats.tasksPerUser.length === 0) && (
          <section className="dashboard-section card" style={{textAlign: 'center', padding: '48px 28px'}}>
            <div style={{fontSize: 48, marginBottom: 16}}>🐺</div>
            <h3 style={{margin: '0 0 8px', color: '#0f172a'}}>You're the lone wolf here</h3>
            <p style={{margin: 0, color: '#64748b'}}>Haven't assigned any tasks to team members yet. Start delegating to see the workload distribution.</p>
          </section>
        )}
      </div>
    </div>
  );
}