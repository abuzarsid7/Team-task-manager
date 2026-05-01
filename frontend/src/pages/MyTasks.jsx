import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks/my-tasks").then((res) => setTasks(res.data.tasks || []));
  }, []);

  const groupedTasks = {
    "To Do": tasks.filter((task) => task.status === "To Do"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    Done: tasks.filter((task) => task.status === "Done"),
  };

  const totalTasks = tasks.length;
  const doneTasks = groupedTasks.Done.length;
  const activeTasks = groupedTasks["In Progress"].length;
  const todoTasks = groupedTasks["To Do"].length;

  return (
    <div className="tasks-page">
      <Navbar />
      <div className="app-container">
        <div className="page-header">
          <div className="page-header-content">
            <h1>My Tasks</h1>
            <p>Track the work assigned to you and move tasks forward as you complete them.</p>
          </div>
        </div>

        <div className="task-stats-grid">
          <div className="task-stat card">
            <span className="task-stat-label">Total</span>
            <strong>{totalTasks}</strong>
          </div>
          <div className="task-stat card">
            <span className="task-stat-label">To Do</span>
            <strong>{todoTasks}</strong>
          </div>
          <div className="task-stat card">
            <span className="task-stat-label">In Progress</span>
            <strong>{activeTasks}</strong>
          </div>
          <div className="task-stat card">
            <span className="task-stat-label">Done</span>
            <strong>{doneTasks}</strong>
          </div>
        </div>

        {totalTasks > 0 ? (
          <div className="my-tasks-list">
            {Object.entries(groupedTasks).map(([status, items]) => (
              <section key={status} className="my-task-section card">
                <div className="my-task-section-header">
                  <h2>{status}</h2>
                  <span className="task-section-count">{items.length}</span>
                </div>

                <div className="my-task-section-body">
                  {items.length > 0 ? (
                    items.map((task) => (
                      <div key={task._id} className="task-list-item card">
                        <div className="task-list-row">
                          <div className="task-list-main">
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12}}>
                              <h3 style={{margin: 0, fontSize: 16}}>{task.title}</h3>
                              <span className={`task-priority task-priority-${(task.priority||'Low') === 'High' ? 'high' : (task.priority==='Medium' ? 'medium' : 'low')}`} style={{marginLeft: 8}}>{task.priority}</span>
                            </div>
                            <p className="muted" style={{margin: '8px 0 0'}}>{task.description || 'No description'}</p>
                          </div>

                          <div className="task-list-meta" style={{textAlign: 'right', minWidth: 140}}>
                            <div className="muted">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</div>
                            
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-inline">No tasks in this section.</div>
                  )}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="empty-state card">
            <div className="empty-state-icon">🗂️</div>
            <h3>No tasks assigned yet</h3>
            <p>Once tasks are assigned to you, they will appear here automatically.</p>
          </div>
        )}
      </div>
    </div>
  );
}