import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("/tasks/dashboard").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <Navbar />
      <div className="app-container mt-12">
        <div className="card">
          <h2>Dashboard</h2>
          <p><strong>Total Tasks:</strong> {stats.totalTasks}</p>
          <p><strong>Overdue Tasks:</strong> {stats.overdueTasks}</p>
          {stats.statusStats && stats.statusStats.length > 0 && (
            <div className="mt-12">
              <h3>Status Breakdown</h3>
              <ul>
                {stats.statusStats.map((s) => (
                  <li key={s._id}>{s._id}: {s.count}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}