import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { useGetDashboardStatsQuery, useGetAllUsersQuery, useDeleteUserMutation } from '../../store/api/adminApi';
import { toast } from 'react-toastify';
import styles from './AdminDashboard.module.scss';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    data: statsData, 
    isLoading: isLoadingStats, 
    error: statsError 
  } = useGetDashboardStatsQuery();

  const { 
    data: usersData, 
    isLoading: isLoadingUsers, 
    error: usersError 
  } = useGetAllUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId).unwrap();
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Failed to delete user');
        console.error('Delete error:', error);
      }
    }
  };

  if (isLoadingStats || isLoadingUsers) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (statsError || usersError) {
    const errorMessage = statsError 
      ? 'Error loading dashboard stats' 
      : 'Error loading users data';
    return <div className={styles.error}>{errorMessage}</div>;
  }

  const stats = statsData?.data?.stats || { totalUsers: 0, totalAdmins: 0 };
  const users = usersData?.data?.users || [];

  const filteredUsers = users.filter((user: User) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.username}</p>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Users</h3>
          <div className={styles.statValue}>{stats.totalUsers}</div>
        </div>
        <div className={styles.statCard}>
          <h3>Total Admins</h3>
          <div className={styles.statValue}>{stats.totalAdmins}</div>
        </div>
      </div>

      <section className={styles.contentSection}>
        <h2>User Management</h2>
        
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredUsers.length > 0 ? (
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: User) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    {user.role !== 'admin' && (
                      <button
                        className={`${styles.actionButton} ${styles.delete}`}
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noResults}>No users found</p>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard; 