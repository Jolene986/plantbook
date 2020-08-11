const admin = require('firebase-admin');
var serviceAccount = require("./plantbook-7d437-firebase-adminsdk-7kyzr-1c99c2e966.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "",
  storageBucket: ""
});

const db = admin.firestore();

module.exports = {admin, db}