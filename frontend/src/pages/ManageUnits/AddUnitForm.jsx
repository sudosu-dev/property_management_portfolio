import styles from "./ManageUnits.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { API } from "../../api/ApiContext";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";

export default function AddUnitForm() {
  const [propertyId, setPropertyId] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [tenants, setTenants] = useState("");

  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API}/units`,
        {
          propertyId: Number(propertyId),
          unitNumber: unitNumber,
          rentAmount: rentAmount === "" ? null : Number(rentAmount),
          notes: notes === "" ? null : notes,
          tenants: tenants === "" ? null : tenants,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Form submitted successfully:", response.data);

      setPropertyId("");
      setUnitNumber("");
      setRentAmount("");
      setNotes("");
      setTenants("");

      navigate("/admin/units");
    } catch (error) {
      console.error("Error submitting unit form:", error);
    }
  };

  return (
    <>
      <div className={styles.page}>
        <div className={styles.formHeader}>
          <h2>Add New Unit</h2>
        </div>
        <form onSubmit={handleSubmit} className={styles.addUnitForm}>
          <label>Property Id</label>
          <input
            type="number"
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
          />
          <br />

          <label>Unit Number</label>
          <input
            type="number"
            value={unitNumber}
            onChange={(e) => setUnitNumber(e.target.value)}
          />
          <br />

          <label>Rent Amount</label>
          <input
            type="number"
            value={rentAmount}
            onChange={(e) => setRentAmount(e.target.value)}
          />
          <br />

          <label>Notes</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <br />

          <label>Tenants</label>
          <input
            type="text"
            value={tenants}
            onChange={(e) => setTenants(e.target.value)}
          />
          <br />
          <div className={styles.addUnitButtons}>
            <button
              className={styles.secondaryButton}
              onClick={() => navigate("/admin/units")}
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
