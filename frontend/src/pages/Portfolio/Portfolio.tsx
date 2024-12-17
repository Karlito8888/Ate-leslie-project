import React from 'react'
import styles from './Portfolio.module.scss'

const Portfolio: React.FC = () => {
  const portfolioItems = [
    {
      title: 'Brand Identity',
      category: 'Branding',
      description: 'Complete brand overhaul for a luxury Dubai-based real estate company.',
      impact: 'Increased brand recognition by 45% within 6 months.'
    },
    {
      title: 'Digital Marketing Campaign',
      category: 'Marketing',
      description: 'Integrated digital campaign for a major UAE retail chain.',
      impact: 'Generated 2.5M impressions and 150% ROI.'
    },
    {
      title: 'Corporate Event',
      category: 'Event Management',
      description: 'Annual tech conference organization for 1000+ attendees.',
      impact: 'Achieved 98% satisfaction rate from attendees.'
    },
    {
      title: 'Social Media Strategy',
      category: 'Digital',
      description: 'Social media presence development for a luxury hotel chain.',
      impact: 'Doubled engagement rates across all platforms.'
    },
    {
      title: 'PR Crisis Management',
      category: 'Public Relations',
      description: 'Successful crisis management for a major corporate client.',
      impact: 'Maintained brand integrity and stakeholder trust.'
    },
    {
      title: 'Market Launch',
      category: 'Strategy',
      description: 'Product launch strategy for a new tech startup.',
      impact: 'Secured 10,000+ pre-orders before launch.'
    }
  ]

  return (
    <div className={styles.portfolioContent}>
      <section className={styles.portfolioHeader}>
        <h3>Our Portfolio</h3>
        <p className={styles.subtitle}>
          Discover how we've helped businesses transform their vision into reality.
          Each project represents our commitment to excellence and innovation.
        </p>
      </section>

      <div className={styles.portfolioGrid}>
        {portfolioItems.map((item, index) => (
          <article key={index} className={styles.portfolioCard}>
            <div className={styles.cardContent}>
              <span className={styles.category}>{item.category}</span>
              <h4>{item.title}</h4>
              <p className={styles.description}>{item.description}</p>
              <p className={styles.impact}>{item.impact}</p>
            </div>
          </article>
        ))}
      </div>

      <section className={styles.contactCTA}>
        <h4>Ready to Start Your Project?</h4>
        <p>Let's create something amazing together.</p>
        <a href="/contact" className={styles.ctaButton}>
          Get in Touch
        </a>
      </section>
    </div>
  )
}

export default Portfolio 