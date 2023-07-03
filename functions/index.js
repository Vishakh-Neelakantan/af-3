const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");

admin.initializeApp();

const db = admin.firestore();

const corsHandler = cors({origin: true});

exports.deleteSubject = functions.https.onRequest(async (req, res) => {
  try {
    await corsHandler(req, res);

    if (req.method !== "POST") {
      res.status(400).send("Invalid request method.");
      return;
    }

    const {subjectId} = req.body;

    if (!subjectId) {
      res.status(400).send("Subject ID is required.");
      return;
    }

    const subjectRef = db.collection("subjects").doc(subjectId);
    await subjectRef.delete();

    res.status(200).send("Subject deleted successfully.");
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).send("An error occurred while deleting the subject.");
  }
});
