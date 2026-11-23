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

// GET all applications
app.get("/api/applications", async (req, res) => {
  try {
    const snapshot = await db.collection("applications").get();

    const applications = snapshot.docs.map((doc) => ({
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

// GET one application
app.get("/api/applications/:id", async (req, res) => {
  try {
    const document = db.collection("applications").doc(req.params.id);
    const snapshot = await document.get();

    if (!snapshot.exists) {
      return res.status(404).json({
        error: "Application not found"
      });
    }

    res.json({
      id: snapshot.id,
      ...snapshot.data()
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to retrieve application"
    });
  }
});

// CREATE application
app.post("/api/applications", async (req, res) => {
  try {
    const {
      company,
      role,
      status,
      date,
      deadline,
      interviewDate,
      notes
    } = req.body;

    if (!company || !role || !status || !date) {
      return res.status(400).json({
        error: "Company, role, status, and date are required"
      });
    }

    const newApplication = {
      company: String(company).trim(),
      role: String(role).trim(),
      status: String(status),
      date: String(date),
      deadline: deadline ? String(deadline) : "",
      interviewDate: interviewDate ? String(interviewDate) : "",
      notes: notes ? String(notes).trim() : "",
      createdAt: new Date().toISOString()
    };

    const docRef = await db
      .collection("applications")
      .add(newApplication);

    res.status(201).json({
      id: docRef.id,
      ...newApplication
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create application"
    });
  }
});

// UPDATE application
app.put("/api/applications/:id", async (req, res) => {
  try {
    const {
      company,
      role,
      status,
      date,
      deadline,
      interviewDate,
      notes
    } = req.body;

    if (!company || !role || !status || !date) {
      return res.status(400).json({
        error: "Company, role, status, and date are required"
      });
    }

    const document = db
      .collection("applications")
      .doc(req.params.id);

    const snapshot = await document.get();

    if (!snapshot.exists) {
      return res.status(404).json({
        error: "Application not found"
      });
    }

    const updatedApplication = {
      company: String(company).trim(),
      role: String(role).trim(),
      status: String(status),
      date: String(date),
      deadline: deadline ? String(deadline) : "",
      interviewDate: interviewDate ? String(interviewDate) : "",
      notes: notes ? String(notes).trim() : ""
    };

    await document.update(updatedApplication);

    res.json({
      id: req.params.id,
      ...updatedApplication
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update application"
    });
  }
});

// DELETE application
app.delete("/api/applications/:id", async (req, res) => {
  try {
    const document = db
      .collection("applications")
      .doc(req.params.id);

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