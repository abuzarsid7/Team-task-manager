import React from "react";

const priorityTone = (priority) => {
  if (priority === "High") return "high";
  if (priority === "Medium") return "medium";
  return "low";
};

export default function TaskCard({ task, onChangeStatus, disableStatus = false, disabledMessage }) {
  const statuses = ["To Do", "In Progress", "Done"];
  const tone = priorityTone(task.priority);

  return (
    <div className="task-card card">
      <div className="task-card-top">
        <div className="task-card-main">
          <div className="task-card-title-row">
            <h3 className="task-card-title">{task.title}</h3>
            <span className={`task-priority task-priority-${tone}`}>{task.priority}</span>
          </div>
          <p className="task-card-description">
            {task.description || "No description provided."}
          </p>
        </div>

        <div className="task-card-assignee">
          <span className="task-card-label">Assigned to</span>
          <strong>{task.assignedTo?.name || "Unassigned"}</strong>
          <span>{task.assignedTo?.email || "No assignee selected"}</span>
        </div>
      </div>

      <div className="task-card-footer">
        <div className="task-card-meta">
          <span className="task-card-status-pill">{task.status}</span>
          <span className="task-card-id">
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "No due date"}
          </span>
        </div>

        <div className="task-card-status-control">
          <label className="task-card-label">Status</label>
          <select
            className="task-status-select"
            value={task.status}
            onChange={(e) => !disableStatus && onChangeStatus(task._id, e.target.value)}
            disabled={disableStatus}
            title={disableStatus ? (disabledMessage || "Action disabled") : undefined}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {disableStatus && (
            <div className="muted" style={{marginTop:8, fontSize:13}}>{disabledMessage || 'Update disabled'}</div>
          )}
        </div>
      </div>
    </div>
  );
}
