const { admin, db } = require("./admin");

//Token validation
module.exports = (req, res, next) => {
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    //extract token
    idToken = req.headers.authorization.split("Bearer ")[1];
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized" });
  }

  // Check is the token issued by our app
  admin
    .auth()
    .verifyIdToken(idToken)
    //get username to add to new PlantPost
    .then((decodedToken) => {
      req.user = decodedToken;
      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then((data) => {
      req.user.username = data.docs[0].data().username;
      req.user.imgUrl = data.docs[0].data().imgUrl;
      return next();
    })
    .catch((err) => {
      console.error(`token verification failed ${err}`);
      return res.status(403).json(err);
    });
};
