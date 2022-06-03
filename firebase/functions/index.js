// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");
const fetch = require("node-fetch");
const cors = require("cors");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
// to prevent cors errors
const corsHandler = cors({ origin: true });
// initialize firebase app
admin.initializeApp();
/**
 * Endpoint to set a log into Firestore
 * @param type - log type, can be whatever you want, ex: 'error', 'vote', 'create something', etc
 * @param uid - user id
 * @param email - user email
 */
exports.addLog = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    if (!req.query.type || !req.query.uid || !req.query.email)
      throw new Error("Missing required query params");

    const type = req.query.type;
    const uid = req.query.uid;
    const email = req.query.email;

    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await admin
      .firestore()
      .collection("appplicationLog")
      .add({
        type: type,
        uid: uid,
        email: email,
        date: new Date(),
      });
    // Send back a message that we've successfully written the log
    res.json({ result: `Message with ID: ${writeResult.id} added.` });
  });
});

/* Endpoint to get bacon ipsum text */
exports.getBacon = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    const bacon = await getBacon();
    res.json({ result: bacon[0] });
  });
});

const getBacon = async () => {
  const data = await fetch(
    "https://baconipsum.com/api/?type=meat-and-filler&paras=1"
  );
  return await data.json();
};
