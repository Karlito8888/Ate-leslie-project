import React from 'react'
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa'
import styles from './Footer.module.scss'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerGrid}>
          {/* Contact Information */}
          <div className={styles.footerSection}>
            <h3>Contact Us</h3>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <FaMapMarkerAlt className={styles.icon} />
                <p>
                  Unit No. 1304<br />
                  Jumeirah Bay X2, Cluster X<br />
                  Jumeirah Lakes Tower<br />
                  Dubai, UAE
                </p>
              </div>
              <div className={styles.contactItem}>
                <FaPhone className={styles.icon} />
                <div>
                  <p>Tel: +971 4 514 6764</p>
                  <p>+971 4 514 6935</p>
                  <p>PO BOX: 30893</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <FaEnvelope className={styles.icon} />
                <a href="mailto:info@dynamicvisionint.com">
                  info@dynamicvisionint.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className={styles.copyrightBar}>
          <p>
            © {currentYear} Dynamic Vision International. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 