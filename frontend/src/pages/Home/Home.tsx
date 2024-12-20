import React from 'react'
import { Link } from 'react-router-dom'
import ChatModal from '../../components/ChatModal/ChatModal'
import styles from './Home.module.scss'
import kiosk from '../../assets/images/services/acai-kiosk-small.jpg'
import exhibition from '../../assets/images/services/exhibition.jpg'
import gifts from '../../assets/images/services/corporate-gifts.jpg'

const Home: React.FC = () => {
  return (
    <div className={styles.homeContent}>
      <section className={styles.hero}>
        <h3>Creativity is intelligence, <span>having fun!</span></h3>
        <blockquote className={styles.tagline}>
          <p>"Your Vision is our Mission"</p>
        </blockquote>
      </section>

      <section className={styles.about}>
        <p className={styles.introduction}>
          Dynamic Vision Global is a creative agency that specializes in PR and marketing. We are a team of creative minds that are passionate about what we do.
        </p>
        <p className={styles.approach}>
          We provide your sales team their needs for selling activities through our marketing approach and branding that will create opportunities and platforms for a better sales turnover.
        </p>
      </section>

      <section className={styles.callToAction}>
        <strong className={styles.highlight}>
          TAKE A LOOK AT OUR PROJECTS. IMAGINE THE ENTIRE PROCESS OF THEIR
          CREATION. INVESTIGATE, EXPERIENCE THEM. BE INSPIRED.
        </strong>
      </section>

      <div className={styles.separator} />

      <section className={styles.servicesPreview}>
        <h3>Our Services</h3>
        <div className={styles.servicesGrid}>
          <div className={styles.serviceCard}>
            <img src={kiosk} alt="Indoor & Outdoor Kiosk" className={styles.serviceImage} />
            <h4>Indoor & Outdoor Kiosk</h4>
            <p>Bespoke solutions with comprehensive design process, from concept to execution.</p>
          </div>
          <div className={styles.serviceCard}>
            <img src={exhibition} alt="Exhibition Standard" className={styles.serviceImage} />
            <h4>Exhibition Standard</h4>
            <p>Custom exhibition booth designs that showcase your corporate identity.</p>
          </div>
          <div className={styles.serviceCard}>
            <img src={gifts} alt="Corporate Gift Items" className={styles.serviceImage} />
            <h4>Corporate Gift Items</h4>
            <p>Wide selection of corporate gifts that perfectly represent your brand.</p>
          </div>
        </div>
        <Link to="/services" className={styles.seeMoreButton}>
          See More
        </Link>
      </section>

      <div className={styles.separator} />

      <section className={styles.portfolioPreview}>
        <h3>Our Latest Projects</h3>
        <div className={styles.previewGrid}>
          <div className={styles.previewCard}>
            <h4>Brand Identity</h4>
            <p>Creating unique and memorable brand identities that resonate with your target audience.</p>
          </div>
          <div className={styles.previewCard}>
            <h4>Digital Marketing</h4>
            <p>Strategic digital campaigns that drive engagement and deliver measurable results.</p>
          </div>
          <div className={styles.previewCard}>
            <h4>Event Management</h4>
            <p>Seamless execution of corporate events that leave lasting impressions.</p>
          </div>
        </div>
        <Link to="/portfolio" className={styles.seeMoreButton}>
          See More
        </Link>
      </section>

      <ChatModal />
    </div>
  )
}

export default Home 