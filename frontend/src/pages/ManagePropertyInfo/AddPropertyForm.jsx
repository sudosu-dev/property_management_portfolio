import styles from "./ManagePropertyInfo.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { API } from "../../api/ApiContext";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";

export default function AddPropertyForm() {
  const [propertyName, setPropertyName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [totalUnits, setTotalUnits] = useState("");

  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API}/properties`,
        {
          propertyName,
          address,
          phoneNumber,
          totalUnits,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Form submitted successfully:", response.data);
      setPropertyName("");
      setAddress("");
      setPhoneNumber("");
      setTotalUnits("");

      navigate("/admin/propertyinfo");
    } catch (error) {
      console.error("Error submitting property form:", error);
    }
  };

  return (
    <>
      <div className={styles.page}>
        <div className={styles.formHeader}>
          <h2>Add New Property</h2>
        </div>
        <form onSubmit={handleSubmit} className={styles.addPropertyForm}>
          <label>Property Name</label>
          <input
            type="text"
            value={propertyName}
            onChange={(e) => setPropertyName(e.target.value)}
          />
          <br />

          <label>Property Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <br />

          <label>Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <br />

          <label>Number of Units</label>
          <input
            type="number"
            value={totalUnits}
            onChange={(e) => setTotalUnits(e.target.value)}
          />
          <br />
          <div className={styles.addPropertyButtons}>
            <button
              className={styles.secondaryButton}
              onClick={() => navigate("/admin/propertyinfo")}
            >
              Back
            </button>
            <input
              className={styles.primaryButton}
              type="submit"
              value="Submit"
            />
          </div>
        </form>
      </div>
    </>
  );
}
