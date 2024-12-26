import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { 
  useGetDashboardStatsQuery, 
  useGetAllUsersQuery, 
  useDeleteUserMutation,
  useGetMessagesQuery,
  useAssignMessageMutation,
  useUpdateMessageStatusMutation
} from '../../store/api/adminApi';
import { toast } from 'react-toastify';
import styles from './AdminDashboard.module.scss';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  assignedTo?: string;
  status: 'new' | 'assigned' | 'in_progress' | 'resolved';
}

const AdminDashboard: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState<string>('overview');
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

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    error: messagesError
  } = useGetMessagesQuery();

  const [deleteUser] = useDeleteUserMutation();
  const [assignMessage] = useAssignMessageMutation();
  const [updateMessageStatus] = useUpdateMessageStatusMutation();

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

  const handleAssignMessage = async (messageId: string) => {
    try {
      await assignMessage({ messageId, adminId: user!.id }).unwrap();
      toast.success('Message assigned successfully');
    } catch (error) {
      toast.error('Failed to assign message');
      console.error('Assign error:', error);
    }
  };

  const handleUpdateMessageStatus = async (messageId: string, status: Message['status']) => {
    try {
      await updateMessageStatus({ messageId, status }).unwrap();
      toast.success('Message status updated successfully');
    } catch (error) {
      toast.error('Failed to update message status');
      console.error('Status update error:', error);
    }
  };

  if (isLoadingStats || isLoadingUsers || isLoadingMessages) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (statsError || usersError || messagesError) {
    const errorMessage = statsError 
      ? 'Error loading dashboard stats' 
      : usersError
      ? 'Error loading users data'
      : 'Error loading messages';
    return <div className={styles.error}>{errorMessage}</div>;
  }

  const stats = statsData?.data?.stats || { totalUsers: 0, totalAdmins: 0 };
  const users = usersData?.data?.users || [];
  const messages = messagesData?.data?.messages || [];

  const filteredUsers = users.filter((user: User) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderOverviewTab = () => (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <h3>Total Users</h3>
        <div className={styles.statValue}>{stats.totalUsers}</div>
      </div>
      <div className={styles.statCard}>
        <h3>Total Admins</h3>
        <div className={styles.statValue}>{stats.totalAdmins}</div>
      </div>
      <div className={styles.statCard}>
        <h3>Total Messages</h3>
        <div className={styles.statValue}>{messages.length}</div>
      </div>
      <div className={styles.statCard}>
        <h3>Unassigned Messages</h3>
        <div className={styles.statValue}>
          {messages.filter(m => !m.assignedTo).length}
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
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
  );

  const renderMessagesTab = () => (
    <section className={styles.contentSection}>
      <h2>Messages Management</h2>
      
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search messages by subject, name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredMessages.length > 0 ? (
        <table className={styles.messageTable}>
          <thead>
            <tr>
              <th>Subject</th>
              <th>From</th>
              <th>Email</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map((message) => (
              <tr key={message._id}>
                <td>{message.subject}</td>
                <td>{message.name}</td>
                <td>{message.email}</td>
                <td>
                  <select
                    value={message.status}
                    onChange={(e) => handleUpdateMessageStatus(message._id, e.target.value as Message['status'])}
                    className={styles.statusSelect}
                  >
                    <option value="new">New</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
                <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                <td>
                  {!message.assignedTo && (
                    <button
                      className={`${styles.actionButton} ${styles.assign}`}
                      onClick={() => handleAssignMessage(message._id)}
                    >
                      Assign to Me
                    </button>
                  )}
                  <button
                    className={`${styles.actionButton} ${styles.view}`}
                    onClick={() => {
                      // TODO: Implement message view modal
                      toast.info('Message view feature coming soon');
                    }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.noResults}>No messages found</p>
      )}
    </section>
  );

  const renderSettingsTab = () => (
    <section className={styles.settingsSection}>
      <h2>Admin Settings</h2>
      <p>Settings features coming soon...</p>
    </section>
  );

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.username}</p>
      </header>

      <nav className={styles.tabsNav}>
        <button 
          className={activeTab === 'overview' ? styles.active : ''} 
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'users' ? styles.active : ''} 
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={activeTab === 'messages' ? styles.active : ''} 
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </button>
        <button 
          className={activeTab === 'settings' ? styles.active : ''} 
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </nav>

      <main className={styles.content}>
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'messages' && renderMessagesTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </main>
    </div>
  );
};

export default AdminDashboard; 