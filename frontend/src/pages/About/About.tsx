import React from 'react'
import styles from './About.module.scss'

const About: React.FC = () => {
  const values = [
    {
      title: 'Professional Approach',
      description: 'We emphasize your company\'s core competencies with a professional and strategic approach.',
      icon: '🎯'
    },
    {
      title: 'Marketing Excellence',
      description: 'We provide your sales team with effective marketing strategies and branding solutions.',
      icon: '📈'
    },
    {
      title: 'Comprehensive Solutions',
      description: 'From branding to product launching, booth exhibitions, and corporate gift items.',
      icon: '🎁'
    },
    {
      title: 'Partnership Focus',
      description: 'We become your dedicated partners in product development and promotions.',
      icon: '🤝'
    }
  ]

  return (
    <div className={styles.aboutContent}>
      <section className={styles.aboutHeader}>
        <h3>About Us</h3>
        <p className={styles.tagline}>
          We help grow your business with bespoke ideas
        </p>
        <p className={styles.subtitle}>
          We believe in coming up with original ideas and turning them into digital work 
          that is both innovative and measurable.
        </p>
      </section>

      <section className={styles.vision}>
        <div className={styles.visionContent}>
          <h4>Who We Are</h4>
          <p>
            Dynamic Vision International (DVI) is your partner in all your marketing needs!
            We make your market presence visible with professional approach, emphasizing 
            on your company's core competencies.
          </p>
          <p>
            DVI provides your sales team their needs for selling activities through our 
            marketing approach and branding that will create opportunities and platforms 
            for a better sales turnover.
          </p>
        </div>
      </section>

      <section className={styles.values}>
        <h4>Our Values</h4>
        <div className={styles.valuesGrid}>
          {values.map((value, index) => (
            <article key={index} className={styles.valueCard}>
              <span className={styles.icon}>{value.icon}</span>
              <h5>{value.title}</h5>
              <p>{value.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.mission}>
        <div className={styles.missionContent}>
          <h4>Our Mission</h4>
          <p className={styles.highlight}>Your Vision Is Our Mission</p>
          <p>
            Sparing our customers with branding, product launching, booth exhibition 
            and corporate gift items, we will be your partners in your product and promotions.
          </p>
        </div>
      </section>

      <section className={styles.contactCTA}>
        <h4>Let's Work Together</h4>
        <p>Ready to create an online strategy that works?</p>
        <a href="/contact" className={styles.ctaButton}>
          Start a Project
        </a>
      </section>
    </div>
  )
}

export default About 