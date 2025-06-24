import useQuery from "../../api/useQuery";
import styles from "./Contact.module.css";

export default function Contact() {
  const {
    data: properties,
    loading,
    error,
  } = useQuery("/properties", "properties");

  if (loading)
    return (
      <div className={styles.pageContainer}>
        <p>Loading contact information...</p>
      </div>
    );
  if (error)
    return (
      <div className={styles.pageContainer}>
        <p>Error loading information: {error}</p>
      </div>
    );

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.header}>Contact Us</h1>

      {properties && properties.length > 0 ? (
        properties.map((prop) => (
          <div key={prop.id} className={styles.contactCard}>
            <div className={styles.mapPlaceholder}>Map Placeholder</div>
            <div className={styles.info}>
              <h2>{prop.property_name}</h2>
              <p>
                <span role="img" aria-label="address">
                  📍
                </span>
                {prop.address}
              </p>
              <p>
                <span role="img" aria-label="phone">
                  📞
                </span>
                {prop.phone_number}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No contact information available.</p>
      )}
    </div>
  );
}
