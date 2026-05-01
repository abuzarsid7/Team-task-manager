import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";
import { AuthContext } from "../context/AuthContext";
import MemberManager from "../components/MemberManager";

export default function ProjectDetail() {
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [project, setProject] = useState(null);
  const [memberEmail, setMemberEmail] = useState("");
  const { getUserId } = useContext(AuthContext);

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/project/${id}`);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProject = async () => {
    try {
      const res = await API.get("/projects");
      const found = (res.data.projects || []).find((p) => p._id === id);
      setProject(found || null);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const updateStatus = async (taskId, status) => {
    try {
      await API.put("/tasks/update-status", { taskId, status });
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const columns = ["To Do", "In Progress", "Done"];

  return (
    <div>
      <Navbar />

      <div className="app-container">
        {project && (
          <>
            <div className="page-header">
              <div className="page-header-content">
                <h1>{project.name}</h1>
                <p className="project-subtitle">
                  Led by {project.admin?.name} • {project.members?.length || 0} member{project.members?.length !== 1 ? "s" : ""}
                </p>
              </div>
              {project?.admin && project.admin._id === getUserId() && (
                <button className="btn page-btn" onClick={() => setShowModal(true)}>
                  + New Task
                </button>
              )}
            </div>

            <div className="project-info-grid">
              <div className="project-info-card card">
                <h3 className="info-section-title">Project Details</h3>
                <div className="info-item">
                  <span className="info-label">Admin</span>
                  <span className="info-value">{project.admin?.name}</span>
                  <span className="info-meta">{project.admin?.email}</span>
                </div>
              </div>

              {project.admin && project.admin._id === getUserId() && (
                <div className="project-members-card card">
                  <MemberManager projectId={id} project={project} onUpdated={fetchProject} />
                </div>
              )}
            </div>

            <h2 className="kanban-title">Task Board</h2>
            <div className="kanban">
              {columns.map((col) => {
                const columnTasks = tasks.filter((t) => t.status === col);
                return (
                  <div className="kanban-column" key={col}>
                    <div className="kanban-header">
                      <h4>{col}</h4>
                      <span className="kanban-count">{columnTasks.length}</span>
                    </div>
                    <div className="kanban-tasks">
                      {columnTasks.length > 0 ? (
                        columnTasks.map((t) => {
                          const isAdmin = project?.admin && project.admin._id === getUserId();
                          const assignedIsAdmin = t.assignedTo && t.assignedTo._id === project?.admin?._id;
                          const disableStatus = !isAdmin && assignedIsAdmin;
                          return (
                            <TaskCard
                              key={t._id}
                              task={t}
                              onChangeStatus={updateStatus}
                              disableStatus={disableStatus}
                              disabledMessage={disableStatus ? "Only the project admin can update tasks assigned to the admin." : undefined}
                            />
                          );
                        })
                      ) : (
                        <div className="kanban-empty">No tasks yet</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!project && <div className="loading">Loading project...</div>}
      </div>

      {showModal && project?.admin && project.admin._id === getUserId() && (
        <CreateTaskModal
          projectId={id}
          project={project}
          onClose={() => setShowModal(false)}
          onCreated={fetchTasks}
        />
      )}
    </div>
  );
}