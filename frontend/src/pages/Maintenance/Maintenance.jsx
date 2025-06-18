import { useState } from "react";

import styles from "./Maintenance.module.css";

function Maintenance() {
  const [formData, setFormData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Request");
    setFormData({ username: "", userPassword: "" });
  };

  return (
    <>
      <h1>Maintenance</h1>
      <div className={styles.requests}>
        <h2>Make New Maintenance Request</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Information
            <input
              value={formData.information}
              type="text"
              name="information"
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
            />
          </label>
        </form>
      </div>
    </>
  );
}

export default Maintenance;
