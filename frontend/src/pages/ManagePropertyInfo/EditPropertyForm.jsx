import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { API } from "../../api/ApiContext";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";

export default function EditPropertyForm() {
  const [propertyName, setPropertyName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [totalUnits, setTotalUnits] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  // Fetch existing property info on mount
  useEffect(() => {
    async function fetchProperty() {
      try {
        const response = await axios.get(`${API}/properties/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const { property_name, address, phone_number, total_units } =
          response.data;

        setPropertyName(property_name);
        setAddress(address);
        setPhoneNumber(phone_number);
        setTotalUnits(total_units);
      } catch (error) {
        console.error("Error fetching property:", error);
      }
    }

    fetchProperty();
  }, [id, token]);

  // Handle PATCH request to update property
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `${API}/properties/${id}`,
        {
          property_name: propertyName,
          address,
          phone_number: phoneNumber,
          total_units: totalUnits,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Property updated:", response.data);
      navigate("/admin/propertyinfo");
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return (
    <>
      <div>
        <h2>Edit Property</h2>
        <form onSubmit={handleSubmit}>
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

          <input type="submit" value="Save Changes" />
        </form>
      </div>

      <button onClick={() => navigate("/admin/propertyinfo")}>Back</button>
    </>
  );
}
