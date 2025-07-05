import styles from "./About.module.css";
import modernHome from "../../assets/modern-home.jpg";

export default function About() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        {/* Hero Section */}
        <section className={styles.heroSection} aria-labelledby="about-heading">
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 id="about-heading">About Project Rent</h1>
              <p>
                Simplifying property management and enhancing resident
                experience through innovative technology and community-focused
                solutions.
              </p>
            </div>
            <div className={styles.heroImage}>
              <img
                src={modernHome}
                alt="Modern residential building showcasing quality living spaces"
              />
            </div>
          </div>
        </section>

        {/* Description Section */}
        <section
          className={styles.descriptionSection}
          aria-labelledby="mission-heading"
        >
          <div className={styles.descriptionContent}>
            <h2 id="mission-heading" className={styles.sectionTitle}>
              Our Mission
            </h2>
            <div className={styles.descriptionText}>
              <p>
                At Project Rent, we believe that property management should be
                seamless, transparent, and community-driven. Our platform
                bridges the gap between property managers and residents,
                creating an ecosystem where communication flows freely and
                efficiently.
              </p>
              <p>
                We've designed our system to eliminate the traditional pain
                points of property management - from maintenance requests that
                disappear into the void to payment processes that feel outdated
                and cumbersome. Our technology-first approach ensures that every
                interaction is smooth, secure, and satisfying.
              </p>
              <p>
                Whether you're a resident looking for a hassle-free living
                experience or a property manager seeking to streamline
                operations, Project Rent provides the tools and community
                support you need to thrive in today's rental market.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          className={styles.featuresSection}
          aria-labelledby="features-heading"
        >
          <div className={styles.featuresContent}>
            <h2 id="features-heading" className={styles.sectionTitle}>
              Platform Features
            </h2>
            <div className={styles.featuresGrid}>
              <article className={styles.featureCard}>
                <div className={styles.featureImage}>
                  <img
                    src="https://placehold.co/300x200/1976d2/ffffff?text=Payment+Management"
                    alt="Digital payment interface showing secure transaction processing"
                  />
                </div>
                <div className={styles.featureContent}>
                  <h3>Secure Payment Processing</h3>
                  <p>
                    Make rent and utility payments online with bank-level
                    security. Set up automatic payments, view payment history,
                    and receive instant confirmations for peace of mind.
                  </p>
                </div>
              </article>

              <article className={styles.featureCard}>
                <div className={styles.featureImage}>
                  <img
                    src="https://placehold.co/300x200/04aa6d/ffffff?text=Maintenance+Requests"
                    alt="Mobile interface showing maintenance request submission with photo upload"
                  />
                </div>
                <div className={styles.featureContent}>
                  <h3>Smart Maintenance Requests</h3>
                  <p>
                    Submit maintenance requests instantly with photo attachments
                    and detailed descriptions. Track progress in real-time and
                    communicate directly with maintenance teams.
                  </p>
                </div>
              </article>

              <article className={styles.featureCard}>
                <div className={styles.featureImage}>
                  <img
                    src="https://placehold.co/300x200/8b5cf6/ffffff?text=Community+Hub"
                    alt="Community bulletin board showing announcements and neighbor connections"
                  />
                </div>
                <div className={styles.featureContent}>
                  <h3>Community Engagement</h3>
                  <p>
                    Stay connected with your community through announcements,
                    events, and neighbor networking. Build relationships and
                    create a welcoming living environment for everyone.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
