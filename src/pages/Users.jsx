import { useState } from "react";
import { useData } from "../context/DataContext";
import { updateUser, deleteUser } from "../services/api";
import { toast } from "react-toastify";
import "../styles/table.css";
import "../styles/index.css";

const Users = () => {
  const { users, loading, refetch } = useData();
  const [processing, setProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || user.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // All visible users selected?
  const allVisibleSelected =
    filteredUsers.length > 0 &&
    filteredUsers.every((user) => selectedUsers.includes(user._id));

  // Select All
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map((user) => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Select Single User
  const handleSelectUser = (id) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id],
    );
  };

  // Bulk Actions
  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      toast.warning("Please select at least one user.");
      return;
    }

    if (action === "delete") {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete ${selectedUsers.length} selected user(s)?`,
      );

      if (!confirmDelete) return;
    }

    setProcessing(true);

    try {
      for (const id of selectedUsers) {
        if (action === "activate") {
          await updateUser(id, { status: "Active" });
        }

        if (action === "block") {
          await updateUser(id, { status: "Blocked" });
        }

        if (action === "delete") {
          await deleteUser(id);
        }
      }

      await refetch();
      setSelectedUsers([]);

      if (action === "activate") {
        toast.success("Users activated successfully.");
      }

      if (action === "block") {
        toast.info("Users blocked successfully.");
      }

      if (action === "delete") {
        toast.success("Users deleted successfully.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Operation failed.");
    } finally {
      setProcessing(false);
    }
  };

  const statusColors = {
    Active: "#28a745",
    Blocked: "#dc3545",
    Pending: "#ffc107",
  };

  if (loading) {
    return <div className="card">Loading...</div>;
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <h1 className="page-title">Users</h1>
        <p className="page-subtitle">
          Manage customer accounts and perform bulk actions.
        </p>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="search-box">
            <input
              type="text"
              className="form-input"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-and-actions">
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Blocked">Blocked</option>
              <option value="Pending">Pending</option>
            </select>

            <span className="selected-count">
              {selectedUsers.length} selected
            </span>

            <div className="bulk-action-group">
              <button
                className="btn btn-success btn-sm toolbar-btn"
                disabled={selectedUsers.length === 0}
                onClick={() => handleBulkAction("activate")}
              >
                Activate
              </button>

              <button
                className="btn btn-warning btn-sm toolbar-btn"
                disabled={selectedUsers.length === 0}
                onClick={() => handleBulkAction("block")}
              >
                Block
              </button>

              <button
                className="btn btn-danger btn-sm toolbar-btn"
                disabled={selectedUsers.length === 0 || processing}
                onClick={() => handleBulkAction("delete")}
              >
                {processing ? "Deleting..." : "Delete"}
              </button>
              
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={handleSelectAll}
                  />
                </th>

                <th>NAME</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>ORDERS</th>
                <th>JOINED</th>
                <th>STATUS</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className={selectedUsers.includes(user._id) ? "selected" : ""}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                    />
                  </td>

                  <td>
                    <div className="user-cell">
                      <div
                        className="user-avatar"
                        style={{
                          backgroundColor: user.avatarColor || "#3498db",
                        }}
                      >
                        {user.name?.charAt(0)}
                      </div>

                      <span>{user.name}</span>
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>{user.phone}</td>

                  <td>{user.orders || 0}</td>

                  <td>
                    {user.joined
                      ? new Date(user.joined).toLocaleDateString()
                      : "-"}
                  </td>

                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: statusColors[user.status]
                          ? statusColors[user.status] + "20"
                          : "#e9ecef",
                        color: statusColors[user.status] || "#6c757d",
                      }}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
