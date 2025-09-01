// import React, { useEffect, useState } from "react";
// import { getProfile, updateProfile } from "./api";
// import "./Profile.css";

// export default function Profile() {
//   const [formData, setFormData] = useState({ name: "", email: "", password: "" });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   useEffect(() => {
//     getProfile()
//       .then((res) => setFormData({ ...res.data, password: "" }))
//       .catch(() => setError("❌ Failed to load profile"));
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       const res = await updateProfile(formData);
//       setSuccess("✅ Profile updated successfully!");
//     } catch (err) {
//       setError("❌ Failed to update profile");
//     }
//   };

//   return (
//     <div style={{ maxWidth: "400px", margin: "auto" }}>
//       <h2>Edit Profile</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       {success && <p style={{ color: "green" }}>{success}</p>}

//       <form onSubmit={handleSubmit}>
//         <div>
//           <label>Name:</label>
//           <input type="text" name="name" value={formData.name} onChange={handleChange} />
//         </div>

//         <div>
//           <label>Email:</label>
//           <input type="email" name="email" value={formData.email} onChange={handleChange} />
//         </div>

//         <div>
//           <label>Password (optional):</label>
//           <input type="password" name="password" value={formData.password} onChange={handleChange} />
//         </div>

//         <button type="submit">Save Changes</button>
//       </form>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "./api";
import "./Profile.css"; // ✅ import the CSS

export default function Profile() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getProfile()
      .then((res) => setFormData({ ...res.data, password: "" }))
      .catch(() => setError("❌ Failed to load profile"));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await updateProfile(formData);
      setSuccess("✅ Profile updated successfully!");
    } catch (err) {
      setError("❌ Failed to update profile");
    }
  };

  return (
    <div className="profile-container">
      <h2>Edit Profile</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>

        <div>
          <label>Password (optional):</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
