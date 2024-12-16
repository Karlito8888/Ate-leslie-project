import React from 'react'
import styles from './Home.module.scss'

const Home: React.FC = () => {
  return (
    <main className={styles.homeContent}>
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
    </main>
  )
}

export default Home 