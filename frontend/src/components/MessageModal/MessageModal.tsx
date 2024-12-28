import React, { useState } from 'react';
import { Message, MessageStatus } from '../../store/api/adminApi';
import styles from './MessageModal.module.scss';

interface Props {
  message: Message;
  onClose: () => void;
  onUpdateStatus: (messageId: string, status: MessageStatus) => Promise<void>;
  onReply: (messageId: string, content: string) => Promise<void>;
}

const MessageModal: React.FC<Props> = ({ message, onClose, onUpdateStatus, onReply }) => {
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(message.id, replyContent);
      setReplyContent('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (status: MessageStatus) => {
    try {
      await onUpdateStatus(message.id, status);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{message.subject}</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>

        <div className={styles.content}>
          <div className={styles.messageInfo}>
            <p><strong>From:</strong> {message.name} ({message.email})</p>
            <p><strong>Date:</strong> {new Date(message.createdAt).toLocaleString()}</p>
            <div className={styles.statusSection}>
              <strong>Status:</strong>
              <select
                value={message.status}
                onChange={(e) => handleStatusChange(e.target.value as MessageStatus)}
                className={styles.statusSelect}
              >
                <option value="new">New</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className={styles.messageContent}>
            <p>{message.content}</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.replyForm}>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              rows={4}
            />
            <button type="submit" disabled={isSubmitting || !replyContent.trim()}>
              {isSubmitting ? 'Sending...' : 'Reply'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageModal; 