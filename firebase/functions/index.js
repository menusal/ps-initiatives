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
 * Endpoint to check if the user is from CARTO.
 * It sets log from any attempt to access.
 * @param req.type - log type, can be whatever you want, ex: 'error', 'vote', 'create something', etc
 * @param req.uid - user id
 * @param req.email - user email
 */
exports.customAuth = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    if (!req.query.type || !req.query.uid || !req.query.email)
      throw new Error("Missing required query params");

    const type = req.query.type;
    const uid = req.query.uid;
    const email = req.query.email;
    let result = true
    let message = 'success'

    functions.logger.info("auth() uid:", uid, "account_email:", email);

    // check if email domain cotains '@carto.com' or '@cartodb.com'
    if (!email.includes("@carto.com") && !email.includes("@cartodb.com")) {
      message = "Email domain must be provided by CARTO organization.",
      result = false
    }

    // Push the new message into Firestore using the Firebase Admin SDK.
   await admin
      .firestore()
      .collection("authLog")
      .add({
        type: type,
        uid: uid,
        email,
        date: new Date(),
        result,
        message,
      });
    // Send back a message that we've successfully written the log
    res.json({ 
      message: message,
      result
    });
  });
});
