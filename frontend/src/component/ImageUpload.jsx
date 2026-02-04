import React, { useState } from "react";

const CLOUD_NAME = "YOUR_CLOUD_NAME"; // 🔹 replace
const UPLOAD_PRESET = "natpac_upload"; // 🔹 replace

function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedTypes.includes(file.type)) {
      alert("❌ Only JPG, JPEG, PNG images are allowed");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("❌ Max file size is 5MB");
      e.target.value = "";
      return;
    }

    setSelectedImage(file);
    alert("✅ Image accepted");
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      alert("⚠️ Please select an image first");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", selectedImage);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();
      alert("🎉 Image uploaded successfully!");
      console.log("Cloudinary URL:", data.secure_url);
    } catch (error) {
      alert("❌ Upload failed");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Upload Travel Experience</h2>

        <input
          type="file"
          accept="image/jpeg, image/png, image/jpg"
          onChange={handleFile}
          style={styles.input}
        />

        <button onClick={uploadImage} style={styles.button}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "linear-gradient(135deg, #2563eb, #1e40af)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "14px",
    width: "360px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#1e40af",
  },
  input: {
    width: "100%",
    padding: "10px",
  },
  button: {
    marginTop: "20px",
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default ImageUpload;
