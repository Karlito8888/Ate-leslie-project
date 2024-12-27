import React, { useState } from 'react';
import styles from './MessageModal.module.scss';

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
  status: string;
  replies: Reply[];
  createdAt: string;
}

interface Props {
  message: Message;
  onClose: () => void;
  onReply: (messageId: string, content: string) => Promise<void>;
}

const MessageModal: React.FC<Props> = ({ message, onClose, onReply }) => {
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(message._id, replyContent);
      setReplyContent('');
    } finally {
      setIsSubmitting(false);
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
            <p><strong>Status:</strong> {message.status}</p>
          </div>

          <div className={styles.messageContent}>
            <p>{message.message}</p>
          </div>

          {message.replies.length > 0 && (
            <div className={styles.replies}>
              <h4>Réponses:</h4>
              {message.replies.map((reply, index) => (
                <div key={index} className={styles.reply}>
                  <div className={styles.replyHeader}>
                    <span>{reply.admin.username}</span>
                    <span>{new Date(reply.createdAt).toLocaleString()}</span>
                  </div>
                  <p>{reply.content}</p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.replyForm}>
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Écrivez votre réponse..."
              rows={4}
            />
            <button type="submit" disabled={isSubmitting || !replyContent.trim()}>
              {isSubmitting ? 'Envoi...' : 'Répondre'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageModal; 