import React from 'react'
import { Link } from 'react-router-dom'
import ChatModal from '../../components/ChatModal/ChatModal'
import styles from './Home.module.scss'

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
            <h4>Public Relations</h4>
            <p>Strategic communication to build and maintain a positive public image.</p>
          </div>
          <div className={styles.serviceCard}>
            <h4>Marketing Strategy</h4>
            <p>Comprehensive marketing solutions tailored to your business goals.</p>
          </div>
          <div className={styles.serviceCard}>
            <h4>Brand Development</h4>
            <p>Creating and evolving brands that stand out in the market.</p>
          </div>
          <div className={styles.serviceCard}>
            <h4>Social Media</h4>
            <p>Engaging content and community management across platforms.</p>
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