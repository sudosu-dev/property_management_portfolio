import useQuery from "../../api/useQuery";
import styles from "./Contact.module.css";
import StaffImage from "../../assets/oakwood-staff.png";

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
    <div className={styles.page}>
      <div className={styles.pageContainer}>
        <h1 className={styles.header}>Contact Us</h1>

        {properties && properties.length > 0 ? (
          properties.map((prop) => (
            <div key={prop.id} className={styles.contactCard}>
              <img
                src={StaffImage}
                alt="Oakwood Staff"
                className={styles.staffImage}
              />
              <div className={styles.info}>
                <h2>{prop.property_name}</h2>
                {prop.address && <p>{prop.address}</p>}
                {prop.phone_number && <p>{prop.phone_number}</p>}
                {!prop.address && !prop.phone_number && (
                  <p>Contact information is not currently available.</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No contact information available.</p>
        )}
      </div>
    </div>
  );
}
