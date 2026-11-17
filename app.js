const express = require("express");
const path = require("path");

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "CareerTrack API is running"
  });
});

app.get("/api/applications", async (req, res) => {
  try {
    const snapshot = await db.collection("applications").get();

    const applications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(applications);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to load applications"
    });
  }
});

app.delete("/api/applications/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const document = db.collection("applications").doc(id);

    const snapshot = await document.get();

    if (!snapshot.exists) {
      return res.status(404).json({
        error: "Application not found"
      });
    }

    await document.delete();

    res.status(200).json({
      message: "Application deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete application"
    });
  }
});

app.listen(PORT, () => {
  console.log(`CareerTrack running at http://localhost:${PORT}`);
});