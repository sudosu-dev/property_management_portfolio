import styles from "./About.module.css";

export default function About() {
  return (
    <div>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <p>Our Journey</p>
          <h1>
            <span>About Us</span>
          </h1>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ut eveniet
            reprehenderit perspiciatis laudantium veniam nemo, sequi repudiandae
            minus porro ipsum exercitationem, quam sint, adipisci animi
            voluptatibus non totam doloribus nulla!
          </p>
        </div>
      </div>
      <div className={styles.infoCards}>
        <div className={styles.infoCard}>
          <h2>Our company</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores
            cum aperiam labore consectetur numquam nihil, placeat, quidem,
            impedit perspiciatis minus dolorum hic. Voluptates amet quae,
            voluptas omnis fuga nihil in.
          </p>
        </div>
        <div className={styles.infoCard}>
          <h2>Our regard for community</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores
            cum aperiam labore consectetur numquam nihil, placeat, quidem,
            impedit perspiciatis minus dolorum hic. Voluptates amet quae,
            voluptas omnis fuga nihil in.
          </p>
        </div>
        <div className={styles.infoCard}>
          <h2>Our philosophy</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores
            cum aperiam labore consectetur numquam nihil, placeat, quidem,
            impedit perspiciatis minus dolorum hic. Voluptates amet quae,
            voluptas omnis fuga nihil in.
          </p>
        </div>
      </div>
    </div>
  );
}
