import styles from "./LandingPage.module.css";
import featuresImage from "../../assets/features-image.jpg";
import personCircleOutline from "../../assets/person-circle-outline.svg";
import { useNavigate } from "react-router";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Easy Living</h1>
          <p>
            The Online Portal is an easy, fast, and secure way to pay charges
            online, view payment history, and submit maintenance requests.
          </p>
          <button onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>
      <div className={styles.features}>
        <div className={styles.featuresText}>
          <h2>Why you'll love Project Rent</h2>
          <div className={styles.featuresCards}>
            <div className={styles.featuresCard}>
              <h3>Seamless transactions</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam
                repellat, doloremque libero eaque quas, reiciendis veritatis
                adipisci nostrum atque porro quasi corporis voluptatem, nihil
                maxime. Repudiandae voluptatum commodi impedit doloremque.
              </p>
            </div>
            <div className={styles.featuresCard}>
              <h3>Hassle free maintenance requests</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Perspiciatis necessitatibus aspernatur eveniet repellendus
                laborum voluptatum doloribus quaerat quas officiis! Quae
                repellat earum quisquam ad asperiores accusantium corrupti,
                expedita modi nemo.
              </p>
            </div>
            <div className={styles.featuresCard}>
              <h3>Community engagement</h3>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Accusantium rem illo magni cupiditate consequatur. Eligendi,
                debitis quidem corporis est dignissimos officia repudiandae
                nobis corrupti? Asperiores perspiciatis animi odio labore
                dolores?
              </p>
            </div>
          </div>
        </div>
        <div className={styles.featuresImage}>
          <img src={featuresImage} alt="beachfront property" />
        </div>
      </div>
      <div className={styles.reviews}>
        <h2>Reviews</h2>
        <div className={styles.reviewCards}>
          <div className={styles.reviewCard}>
            <p>"I love my apartment"</p>
            <div className={styles.reviewCardProfile}>
              <img src={personCircleOutline} alt="user icon" />
              <div>
                <p>name</p>
                <p>description</p>
              </div>
            </div>
          </div>
          <div className={styles.reviewCard}>
            <p>"The managers are very responsive"</p>
            <div className={styles.reviewCardProfile}>
              <img src={personCircleOutline} alt="user icon" />
              <div>
                <p>name</p>
                <p>description</p>
              </div>
            </div>
          </div>
          <div className={styles.reviewCard}>
            <p>"What a fantastic website"</p>
            <div className={styles.reviewCardProfile}>
              <img src={personCircleOutline} alt="user icon" />
              <div>
                <p>name</p>
                <p>description</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.cta}>
        <h2>Ready to join the party?</h2>
        <button onClick={() => navigate("/register")}>Register Now</button>
      </div>
    </div>
  );
}
