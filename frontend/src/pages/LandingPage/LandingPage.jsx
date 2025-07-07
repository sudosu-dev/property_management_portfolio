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
          <button
            className={styles.loginButton}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
      <div className={styles.features}>
        <div className={styles.featuresText}>
          <h2>Why you'll love Project Renta</h2>
          <div className={styles.featuresCards}>
            <div className={styles.featuresCard}>
              <h3>Seamless transactions</h3>
              <p>
                With our platform, paying rent, utilities, or other fees is
                fast, secure, and effortless. Set up recurring payments, receive
                instant confirmations, and manage your account from anywhere,
                anytime.
              </p>
            </div>
            <div className={styles.featuresCard}>
              <h3>Hassle free maintenance requests</h3>
              <p>
                Submit requests online in seconds, upload photos or
                descriptions, and track progress in real time. Our streamlined
                system ensures that issues are addressed quickly and
                efficiently.
              </p>
            </div>
            <div className={styles.featuresCard}>
              <h3>Community engagement</h3>
              <p>
                Stay informed with community announcements, connect with
                neighbors, and participate in building a welcoming, vibrant
                living environment. Whether it's a neighborhood event or an
                important update, you're always in the loop.
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
                <p>Bobby</p>
                <p>Resident at Oakmont</p>
              </div>
            </div>
          </div>
          <div className={styles.reviewCard}>
            <p>"The managers are very responsive"</p>
            <div className={styles.reviewCardProfile}>
              <img src={personCircleOutline} alt="user icon" />
              <div>
                <p>Richard</p>
                <p>Resident at Pepperridge</p>
              </div>
            </div>
          </div>
          <div className={styles.reviewCard}>
            <p>"What a fantastic website"</p>
            <div className={styles.reviewCardProfile}>
              <img src={personCircleOutline} alt="user icon" />
              <div>
                <p>Lenora</p>
                <p>Resident at Marina Towers</p>
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
