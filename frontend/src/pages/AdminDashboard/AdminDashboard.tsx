import React, { useState, useEffect } from 'react';
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
import MessageModal from '../../components/MessageModal/MessageModal';
import NewMessageModal from '../../components/NewMessageModal/NewMessageModal';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

type MessageStatus = 'new' | 'assigned' | 'in_progress' | 'resolved';

interface Reply {
  admin: {
    username: string;
  };
  content: string;
  createdAt: string;
}

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  assignedTo?: string;
  replies: Reply[];
  createdAt: string;
}

interface ApiMessage extends Omit<Message, 'replies'> {
  replies?: Reply[];
}

interface AdminMessage {
  _id: string;
  from: {
    _id: string;
    username: string;
  };
  to: {
    _id: string;
    username: string;
  };
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [internalMessages, setInternalMessages] = useState<AdminMessage[]>([]);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [isLoadingInternalMessages, setIsLoadingInternalMessages] = useState(false);
  
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

  const handleUpdateMessageStatus = async (messageId: string, status: MessageStatus) => {
    try {
      await updateMessageStatus({ messageId, status }).unwrap();
      toast.success('Message status updated successfully');
    } catch (error) {
      toast.error('Failed to update message status');
      console.error('Status update error:', error);
    }
  };

  const handleReply = async (messageId: string, content: string) => {
    try {
      const response = await fetch(`/api/admin/messages/${messageId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) throw new Error('Failed to send reply');
      toast.success('Reply sent successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send reply');
    }
  };

  const fetchInternalMessages = async () => {
    setIsLoadingInternalMessages(true);
    try {
      const response = await fetch('/api/admin/internal/inbox', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setInternalMessages(data.messages);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch internal messages');
    } finally {
      setIsLoadingInternalMessages(false);
    }
  };

  const handleSendInternalMessage = async (to: string, subject: string, content: string) => {
    try {
      const response = await fetch('/api/admin/internal/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ to, subject, content })
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      toast.success('Message sent successfully');
      setShowNewMessageModal(false);
      fetchInternalMessages();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send message');
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/admin/internal/messages/${messageId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to mark message as read');
      fetchInternalMessages();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to mark message as read');
    }
  };

  useEffect(() => {
    if (activeTab === 'internal') {
      fetchInternalMessages();
    }
  }, [activeTab]);

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
  const apiMessages = (messagesData?.data?.messages || []) as ApiMessage[];
  
  const messages: Message[] = apiMessages.map(msg => ({
    ...msg,
    replies: msg.replies || []
  }));

  const filteredUsers = users.filter((user: User) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = messages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const admins = users.filter((u: User) => 
    u.role === 'admin' && u._id !== user?.id
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
            {filteredMessages.map((message: Message) => (
              <tr key={message._id}>
                <td>{message.subject}</td>
                <td>{message.name}</td>
                <td>{message.email}</td>
                <td>
                  <select
                    value={message.status}
                    onChange={(e) => handleUpdateMessageStatus(message._id, e.target.value as MessageStatus)}
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
                    onClick={() => setSelectedMessage(message)}
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

  const renderInternalMessagesTab = () => (
    <section className={styles.contentSection}>
      <div className={styles.header}>
        <h2>Internal Messages</h2>
        <button 
          className={styles.newMessageButton}
          onClick={() => setShowNewMessageModal(true)}
        >
          New Message
        </button>
      </div>

      {isLoadingInternalMessages ? (
        <div className={styles.loading}>Loading messages...</div>
      ) : internalMessages.length > 0 ? (
        <div className={styles.messagesList}>
          {internalMessages.map(message => (
            <div 
              key={message._id} 
              className={`${styles.messageCard} ${!message.isRead ? styles.unread : ''}`}
              onClick={() => handleMarkAsRead(message._id)}
            >
              <div className={styles.messageHeader}>
                <span className={styles.from}>From: {message.from.username}</span>
                <span className={styles.date}>
                  {new Date(message.createdAt).toLocaleString()}
                </span>
              </div>
              <h3 className={styles.subject}>{message.subject}</h3>
              <p className={styles.preview}>{message.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noMessages}>No messages in your inbox</p>
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
          className={activeTab === 'internal' ? styles.active : ''} 
          onClick={() => setActiveTab('internal')}
        >
          Internal Messages
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
        {activeTab === 'internal' && renderInternalMessagesTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </main>

      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onReply={handleReply}
        />
      )}

      {showNewMessageModal && (
        <NewMessageModal
          admins={admins}
          onClose={() => setShowNewMessageModal(false)}
          onSend={handleSendInternalMessage}
        />
      )}
    </div>
  );
};

export default AdminDashboard; 