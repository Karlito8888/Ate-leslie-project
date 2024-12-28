import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slices/authSlice';
import { 
  useGetStatsQuery, 
  useGetUsersQuery, 
  useDeleteUserMutation,
  useGetMessagesQuery,
  useAssignMessageMutation,
  useUpdateMessageStatusMutation,
  Message,
  Admin,
  AdminMessage,
  MessageStatus
} from '../../store/api/adminApi';
import { toast } from 'react-toastify';
import styles from './AdminDashboard.module.scss';
import MessageModal from '../../components/MessageModal/MessageModal';
import NewMessageModal from '../../components/NewMessageModal/NewMessageModal';

const AdminDashboard: React.FC = () => {
  const user = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [internalMessages, setInternalMessages] = useState<AdminMessage[]>([]);
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [isLoadingInternalMessages, setIsLoadingInternalMessages] = useState(false);
  
  const { 
    data: stats, 
    isLoading: isLoadingStats, 
    error: statsError 
  } = useGetStatsQuery();

  const { 
    data: users, 
    isLoading: isLoadingUsers, 
    error: usersError 
  } = useGetUsersQuery();

  const {
    data: messages,
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

  const currentStats = stats || { 
    totalUsers: 0, 
    newUsers: 0, 
    totalMessages: 0, 
    unreadMessages: 0 
  };
  
  const currentUsers = users || [];
  const currentMessages = messages || [];

  const filteredUsers = currentUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = currentMessages.filter(message =>
    message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const admins = currentUsers.filter((u): u is Admin => 
    u.role === 'admin' && u.id !== user?.id
  );

  const renderOverviewTab = () => (
    <div className={styles.overviewTab}>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Total Users</h3>
          <div className={styles.statValue}>{currentStats.totalUsers}</div>
        </div>
        <div className={styles.statCard}>
          <h3>New Users</h3>
          <div className={styles.statValue}>{currentStats.newUsers}</div>
        </div>
        <div className={styles.statCard}>
          <h3>Total Messages</h3>
          <div className={styles.statValue}>{currentStats.totalMessages}</div>
        </div>
        <div className={styles.statCard}>
          <h3>Unread Messages</h3>
          <div className={styles.statValue}>{currentStats.unreadMessages}</div>
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className={styles.usersTab}>
      <div className={styles.searchBar}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
        />
      </div>
      
      <div className={styles.usersList}>
        {filteredUsers.map(user => (
          <div key={user.id} className={styles.userCard}>
            <div className={styles.userInfo}>
              <h3>{user.username}</h3>
              <p>{user.email}</p>
              <p>Role: {user.role}</p>
              <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
            <div className={styles.userActions}>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMessagesTab = () => (
    <div className={styles.messagesTab}>
      <div className={styles.searchBar}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search messages..."
        />
      </div>
      
      <div className={styles.messagesList}>
        {filteredMessages.map(message => (
          <div 
            key={message.id} 
            className={styles.messageCard}
            onClick={() => setSelectedMessage(message)}
          >
            <div className={styles.messageHeader}>
              <h3>{message.subject}</h3>
              <span className={styles.status}>{message.status}</span>
            </div>
            <p className={styles.sender}>
              From: {message.name} ({message.email})
            </p>
            <p className={styles.preview}>{message.content.substring(0, 100)}...</p>
            <div className={styles.messageFooter}>
              <span>{new Date(message.createdAt).toLocaleDateString()}</span>
              {!message.assignedTo && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAssignMessage(message.id);
                  }}
                  className={styles.assignButton}
                >
                  Assign to me
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedMessage && (
        <MessageModal
          message={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onUpdateStatus={handleUpdateMessageStatus}
          onReply={handleReply}
        />
      )}
    </div>
  );

  const renderInternalMessagesTab = () => (
    <div className={styles.internalMessagesTab}>
      <button
        onClick={() => setShowNewMessageModal(true)}
        className={styles.newMessageButton}
      >
        New Message
      </button>

      {isLoadingInternalMessages ? (
        <div className={styles.loading}>Loading messages...</div>
      ) : (
        <div className={styles.messagesList}>
          {internalMessages.map(message => (
            <div 
              key={message.id}
              className={`${styles.messageCard} ${!message.isRead ? styles.unread : ''}`}
              onClick={() => handleMarkAsRead(message.id)}
            >
              <div className={styles.messageHeader}>
                <h3>{message.subject}</h3>
                <span>{new Date(message.createdAt).toLocaleDateString()}</span>
              </div>
              <p>From: {message.from.username}</p>
              <p>To: {message.to.username}</p>
              <p className={styles.preview}>{message.content.substring(0, 100)}...</p>
            </div>
          ))}
        </div>
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
          onUpdateStatus={handleUpdateMessageStatus}
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