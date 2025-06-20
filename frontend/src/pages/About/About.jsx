import styles from "./About.module.css";
import modernHome from "../../assets/modern-home.jpg";
import { useNavigate } from "react-router";

export default function About() {
  const navigate = useNavigate();

  return (
    <>
      <section className={styles.welcome}>
        <div className={styles.welcomeText}>
          <h1>About Project Rent</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptas et aperiam, quo qui in vitae repellat eos temporibus.
          </p>
        </div>
        <img src={modernHome} alt="Image of a home" />
      </section>
      <section className={styles.description}>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eum ullam,
          modi id enim consequuntur eligendi suscipit consectetur recusandae!
          Consequuntur laboriosam corporis sequi quos, harum provident
          exercitationem ullam assumenda odit numquam!
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum et
          exercitationem odio odit architecto provident facilis maxime magnam,
          reprehenderit atque facere molestias totam nihil quaerat, eum esse
          aliquam aut quo?
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis labore
          laboriosam provident rerum nesciunt dolorum ex quod ab perspiciatis
          voluptatibus similique, neque quia est cumque ducimus facere explicabo
          doloribus beatae?
        </p>
      </section>
      <section className={styles.features}>
        <h2>Features</h2>
        <div className={styles.featuresCards}>
          <div className={styles.featuresCard}>
            <img src="https://placehold.co/250x200" alt="Placeholder Image" />
            <h3>Feature 1</h3>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Totam
              quas laudantium hic quaerat corporis sint minima.
            </p>
          </div>

          <div className={styles.featuresCard}>
            <img src="https://placehold.co/250x200" alt="Placeholder Image" />
            <h3>Feature 2</h3>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum
              quisquam eius quam repellendus.
            </p>
          </div>

          <div className={styles.featuresCard}>
            <img src="https://placehold.co/250x200" alt="Placeholder Image" />
            <h3>Feature 3</h3>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eum
              quisquam eius quam repellendus, recusandae nemo eos.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
