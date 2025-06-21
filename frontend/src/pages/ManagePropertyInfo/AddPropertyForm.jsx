import { useNavigate } from "react-router-dom";

export default function AddPropertyForm() {
  const navigate = useNavigate();
  const toPropertyInfo = () => {
    navigate("/admin/propertyinfo");
  };

  return (
    <>
      <div>
        <form>
          <label>Property Name</label>
          <input type="text" />
          <br />
          <label>Property Address</label>
          <input type="text" />
          <br />
          <label>Number of Units</label>
          <input type="number" />
          <br />
          <input type="submit" />
        </form>
      </div>
      <button onClick={toPropertyInfo}>back</button>
    </>
  );
}
