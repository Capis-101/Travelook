import { useEffect } from "react";
import bulkUploadPackages from "./bulkUploadPackages";

export default function UploadPage() {
  useEffect(() => {
    bulkUploadPackages();
  }, []);

  return (
    <div style={{ padding: 20, textAlign: "center" }}>
      <h2>📦 Uploading Travel Packages to Firestore...</h2>
      <p>Check your browser console for upload progress logs.</p>
      <p style={{ color: "#00796b", fontWeight: 600 }}>
        Please wait — this may take a few seconds.
      </p>
    </div>
  );
}
