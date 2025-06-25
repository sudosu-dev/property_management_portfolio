import styles from "./ManageUnits.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { API } from "../../api/ApiContext";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";

export default function EditUnitForm() {
  const [propertyId, setPropertyId] = useState("");
  const [unitNumber, setUnitNumber] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [tenants, setTenants] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  // Fetch existing property info on mount
  useEffect(() => {
    async function fetchUnit() {
      try {
        const response = await axios.get(`${API}/units/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const { property_id, unit_number, rent_amount, notes, tenants } =
          response.data;

        setPropertyId(property_id);
        setUnitNumber(unit_number);
        setRentAmount(rent_amount);
        setNotes(notes);
        setTenants(tenants);
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    }

    fetchUnit();
  }, [id, token]);

  // Handle PATCH request to update property
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `${API}/units/${id}`,
        {
          property_id: propertyId,
          unit_number: unitNumber,
          rent_amount: rentAmount,
          notes: notes,
          tenants: tenants,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Unit updated:", response.data);
      navigate("/admin/units");
    } catch (error) {
      console.error("Error updating unit:", error);
    }
  };

  return (
    <>
      <div className={styles.page}>
        <div className={styles.formHeader}>
          <h2>Edit Unit</h2>
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
            value={notes ?? ""}
            onChange={(e) => setNotes(e.target.value)}
          />
          <br />

          <label>Tenants</label>
          <input
            type="text"
            value={tenants ?? ""}
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
              value="Save Changes"
            />
          </div>
        </form>
      </div>
    </>
  );
}
