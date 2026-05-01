import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks/my-tasks").then((res) => setTasks(res.data.tasks));
  }, []);

  return (
    <div>
      <Navbar />
      <h2>My Tasks</h2>
      {tasks.map((t) => (
        <div key={t._id}>
          <p>{t.title} - {t.status}</p>
        </div>
      ))}
    </div>
  );
}