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

      <div className="app-container mt-12">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Project Tasks</h2>
          <div>
            <button className="btn" onClick={() => setShowModal(true)}>New Task</button>
          </div>
        </div>

        {project && (
          <div className="card mt-12">
            <h3>{project.name}</h3>
            <div className="muted">Admin: {project.admin?.name} ({project.admin?.email})</div>

            <div className="mt-12">
              <strong>Members</strong>
              <div>
                {project.members?.map((m) => (
                  <div key={m._id} className="muted">{m.name} — {m.email}</div>
                ))}
              </div>
            </div>

            {project.admin && project.admin._id === getUserId() && (
              <MemberManager projectId={id} onUpdated={fetchProject} />
            )}
          </div>
        )}

        <div className="kanban">
          {columns.map((col) => (
            <div className="kanban-column" key={col}>
              <h4>{col}</h4>
              {tasks.filter((t) => t.status === col).map((t) => (
                <TaskCard key={t._id} task={t} onChangeStatus={updateStatus} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {showModal && <CreateTaskModal projectId={id} onClose={() => setShowModal(false)} onCreated={fetchTasks} />}
    </div>
  );
}