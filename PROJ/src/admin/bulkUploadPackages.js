// ✅ Bulk Upload — FINAL VERSION
// Prevents duplicates in Firestore & keeps filtering working 100%

import { db } from "../firebaseconfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// ✅ Import regional package arrays
import luzon from "../../src/package/luzon.js";
import visayas from "../../src/package/visayas.js";
import mindanao from "../../src/package/mindanao.js";

// ✅ Merge packages into one clean list
const pkglist = [...luzon, ...visayas, ...mindanao];

async function bulkUploadPackages() {
  const colRef = collection(db, "packages");
  console.log("🚀 Bulk Upload Starting...");

  // ✅ Prevent Local Duplicates Before Upload
  const keys = pkglist.map(
    (p) => `${p.packageName}-${p.destination}`
  );
  const dupes = keys.filter((k, i) => keys.indexOf(k) !== i);

  if (dupes.length > 0) {
    console.warn("⚠ Remove DUPLICATES in JS Files:", [...new Set(dupes)]);
  }

  for (let pkg of pkglist) {
    try {
      // ✅ Firestore Duplicate Check
      const q = query(
        colRef,
        where("packageName", "==", pkg.packageName),
        where("destination", "==", pkg.destination)
      );
      const exists = await getDocs(q);

      if (!exists.empty) {
        console.log(`⏩ Skipped: ${pkg.packageName}`);
        continue;
      }

      await addDoc(colRef, {
        ...pkg,
        category: pkg.category || "Others",
        region: pkg.region || "Unknown",
        price: pkg.price || 0,
        createdAt: new Date(),
      });

      console.log(`✅ Uploaded: ${pkg.packageName}`);
    } catch (err) {
      console.error(`❌ Upload Failed: ${pkg.packageName}`, err);
    }
  }

  console.log("🎯 DONE — No Duplicates ✅");
}

export default bulkUploadPackages;
