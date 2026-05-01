import React, { useState } from "react";
import API from "../api/axios";
import AddMemberModal from "./AddMemberModal";

export default function MemberManager({ projectId, project, onUpdated }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenRemove = (member) => {
    setError("");
    setSelectedMember(member);
    setShowConfirmModal(true);
  };

  const handleRemove = async () => {
    if (!selectedMember?.email) return;
    setLoading(true);
    setError("");
    try {
      await API.post("/projects/remove-member", {
        projectId,
        email: selectedMember.email.trim().toLowerCase(),
      });
      setShowConfirmModal(false);
      setSelectedMember(null);
      onUpdated && onUpdated();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="member-manager-section">
        <div className="member-manager-header">
          <div>
            <h4>Manage Members</h4>
            <p className="member-manager-subtitle">Add members or remove them with one click.</p>
          </div>
          <button
            className="btn btn-small"
            onClick={() => setShowAddModal(true)}
            type="button"
          >
            + Add Member
          </button>
        </div>

        <div className="members-list members-list-actions">
          {project?.members && project.members.length > 0 ? (
            project.members.map((member) => {
              const isAdmin = project?.admin?._id === member._id;
              return (
                <div key={member._id} className="member-item member-item-action">
                  <div className="member-avatar">{member.name.charAt(0).toUpperCase()}</div>
                  <div className="member-info">
                    <div className="member-name">
                      {member.name} {isAdmin && <span className="member-badge">Admin</span>}
                    </div>
                    <div className="member-email">{member.email}</div>
                  </div>
                  <button
                    className="btn btn-danger btn-small"
                    type="button"
                    onClick={() => handleOpenRemove(member)}
                    disabled={loading || isAdmin}
                    title={isAdmin ? "Admin cannot be removed" : "Remove member"}
                  >
                    Remove
                  </button>
                </div>
              );
            })
          ) : (
            <div className="muted">No members added yet</div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddMemberModal
          projectId={projectId}
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            setShowAddModal(false);
            onUpdated && onUpdated();
          }}
        />
      )}

      {showConfirmModal && selectedMember && (
        <div className="modal-backdrop">
          <div className="modal card modal-sm">
            <div className="modal-header">
              <h2>Remove member?</h2>
              <p>
                This will remove <strong>{selectedMember.name}</strong> from the project.
              </p>
            </div>

            {error && <div className="modal-error">{error}</div>}

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedMember(null);
                  setError("");
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleRemove}
                disabled={loading}
              >
                {loading ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
