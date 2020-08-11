const functions = require("firebase-functions");
const { db } = require("./util/admin");
const cors = require("cors");

const {
  getAllPlantPosts,
  postOnePlantPost,
  getPlantPost,
  uploadPlantImage,
  commentOnPlant,
  likePlant,
  unlikePlant,
  likeComment,
  unlikeComment,
  deletePlant,
  deleteComment,
  editComment,
} = require("./handlers/plantPosts");

const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getAnyUserDetails,
  markNotificationsRead,
} = require("./handlers/users");

const FBAuth = require("./util/fbAuth");

const app = require("express")();
app.use(cors({ origin: true }));

//  PlantPosts routes
app.get("/plants", getAllPlantPosts);
app.post("/plant", FBAuth, postOnePlantPost);
app.post("/plant/image", FBAuth, uploadPlantImage);
app.get("/plant/:plantId", getPlantPost);
app.get("/plant/:plantId/like", FBAuth, likePlant);
app.get("/plant/:plantId/unlike", FBAuth, unlikePlant);
app.post("/plant/:plantId/comment", FBAuth, commentOnPlant);
app.delete("/plant/:plantId/", FBAuth, deletePlant);

//PlantPostcomments routes
app.get("/comment/:commentId/like", FBAuth, likeComment);
app.get("/comment/:commentId/unlike", FBAuth, unlikeComment);
app.post("/comment/:commentId/edit", FBAuth, editComment);
app.delete("/comment/:commentId", FBAuth, deleteComment);

// Users routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:username", getAnyUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);

exports.api = functions.region("europe-west3").https.onRequest(app);

// notification when someone likes a plant, comment on plant or likes a comment

exports.createNotificationOnLike = functions
  .region("europe-west3")
  .firestore.document("/likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/plants/${snapshot.data().plantId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().username !== snapshot.data().username) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().username, //Plant document
            sender: snapshot.data().username, // like document
            type: "like",
            read: false,
            plantId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

exports.createNotificationOnComment = functions
  .region("europe-west3")
  .firestore.document("/comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/plants/${snapshot.data().plantId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().username !== snapshot.data().username) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().username, //Plant document
            sender: snapshot.data().username, // like document
            type: "comment",
            read: false,
            plantId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

exports.createNotificationOnLikeComment = functions
  .region("europe-west3")
  .firestore.document("/commentlikes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/comments/${snapshot.data().commentId}`)
      .get()
      .then((doc) => {
        if (doc.exists && doc.data().username !== snapshot.data().username) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().username, //comment document
            sender: snapshot.data().username, // like document
            type: "likeComment",
            read: false,
            commentId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  });

// If someone changes their mind
exports.deleteNotificationOnUnlike = functions
  .region("europe-west3")
  .firestore.document("/likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });
exports.deleteNotificationOnDeleteComment = functions
  .region("europe-west3")
  .firestore.document("/comments/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });
exports.deleteNotificationOnUnlikeComment = functions
  .region("europe-west3")
  .firestore.document("/commentlikes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });
// If userimage changes his picture all his plants will get that new image
exports.onUserImageChange = functions
  .region("europe-west3")
  .firestore.document("/users/{userId}")
  .onUpdate((change) => {
    if (change.before.data().imgUrl !== change.after.data().imgUrl) {
      const batch = db.batch();
      return db
        .collection("plants")
        .where("username", "==", change.before.data().username)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const plant = db.doc(`/plants/${doc.id}`);
            batch.update(plant, { userImg: change.after.data().imgUrl });
          });
          return batch.commit();
        });
    } else {
      return true;
    }
  });
//If a plant is deleted delete all things related to it
exports.onPlantDeleted = functions
  .region("europe-west3")
  .firestore.document("/plants/{plantId}")
  .onDelete((snapshot, context) => {
    const plantId = context.params.plantId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("plantId", "==", plantId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("plantId", "==", plantId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("plantId", "==", plantId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });

//if comment is deleted, delete its likes and notifications
exports.onCommentDeleted = functions
  .region("europe-west3")
  .firestore.document("/comments/{commentId}")
  .onDelete((snapshot, context) => {
    const commentId = context.params.commentId;
    const batch = db.batch();
    return db
      .collection("commentlikes")
      .where("commentId", "==", commentId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/commentlikes/${doc.id}`));
        });

        return db
          .collection("notifications")
          .where("commentId", "==", commentId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
