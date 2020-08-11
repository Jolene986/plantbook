const { admin, db } = require("../util/admin");
const firebaseConfig = require("../util/firebaseConfig");

//Get all plant posts
exports.getAllPlantPosts = (req, res) => {
  db.collection("plants")
    .orderBy("posted", "desc")
    .get()
    .then((data) => {
      let plantPosts = [];
      data.forEach((doc) => {
        plantPosts.push({
          plantId: doc.id,
          username: doc.data().username,
          userImg: doc.data().userImg,
          title: doc.data().title,
          description: doc.data().description,
          category: doc.data().category,
          commonName: doc.data().commonName,
          scientificName: doc.data().scientificName,
          family: doc.data().family,
          posted: doc.data().posted,
          location: doc.data().location,
          imgUrl: doc.data().imgUrl,
          likes: doc.data().likes,
          commentCount: doc.data().commentCount,
        });
      });
      return res.json(plantPosts);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
//Post one plant post
exports.postOnePlantPost = (req, res) => {
  const newPlantPost = {
    title: req.body.title,
    username: req.user.username, // from FBAuth
    userImg: req.user.imgUrl,
    posted: new Date().toISOString(),
    category: req.body.category,
    commonName: req.body.commonName,
    scientificName: req.body.scientificName,
    description: req.body.description,
    location: req.body.location,
    family: req.body.family,
    imgUrl: req.body.imgUrl,
    likes: 0,
    commentCount: 0,
  };

  db.collection("plants")
    .add(newPlantPost)
    .then((doc) => {
      const resPlantPost = newPlantPost;
      resPlantPost.plantId = doc.id;
      res.json(resPlantPost);
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};
// Plant post image upload
exports.uploadPlantImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });
  let imgFileName;
  let imgToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    const imgExtension = filename.split(".")[filename.split(".").length - 1];
    imgFileName = `${Math.round(Math.random() * 100000000000)}.${imgExtension}`;
    const filepath = path.join(os.tmpdir(), imgFileName);
    imgToBeUploaded = {
      filepath,
      mimetype,
    };
    file.pipe(fs.createWriteStream(filepath)); // this creates the file
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imgToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imgToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        //construct img url to add to user ; alt=media shows it in the browser otherwise it downloads it
        const imgUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imgFileName}?alt=media`;
        return res.json({ imgUrl });
      })

      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

// Get one plant and its comments (plantData)
exports.getPlantPost = (req, res) => {
  let plantData = {};

  db.doc(`/plants/${req.params.plantId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Plant not found" });
      }
      plantData = doc.data();

      plantData.plantId = doc.id; //assign the plant id from the doc id itself

      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("plantId", "==", req.params.plantId) //
        .get();
    })
    .then((data) => {
      plantData.comments = [];
      data.forEach((doc) => {
        plantData.comments.push({
          commentId: doc.id,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
          plantId: doc.data().plantId,
          username: doc.data().username, //user obj is passed through FBAuth middleware
          userImg: doc.data().userImg,
          likes: doc.data().likes,
        });
      });
      return res.json(plantData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};
//Post a comment on plant

exports.commentOnPlant = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    plantId: req.params.plantId,
    username: req.user.username, //user obj is passed through FBAuth middleware
    userImg: req.user.imgUrl,
    likes: 0,
  };
  db.doc(`/plants/${req.params.plantId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Plant post not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then((doc) => {
      const resComment = newComment;
      resComment.commentId = doc.id;
      return res.json(resComment);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Something went wrong, please try again" });
    });
};
// Like a Plant

exports.likePlant = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("username", "==", req.user.username)
    .where("plantId", "==", req.params.plantId)
    .limit(1);
  const plantDocument = db.doc(`/plants/${req.params.plantId}`);

  let plantData;
  plantDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        plantData = doc.data();
        plantData.plantId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Plant not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            plantId: req.params.plantId,
            username: req.user.username,
          })
          .then(() => {
            plantData.likes++;
            return plantDocument.update({ likes: plantData.likes });
          })
          .then(() => {
            return res.json(plantData);
          });
      } else {
        return res.status(400).json({ error: "Plant is already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

//Unilike the PlantPost
exports.unlikePlant = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("username", "==", req.user.username)
    .where("plantId", "==", req.params.plantId)
    .limit(1);
  const plantDocument = db.doc(`/plants/${req.params.plantId}`);
  let plantData;

  plantDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        plantData = doc.data();
        plantData.plantId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Plant not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Plant not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            plantData.likes--;
            return plantDocument.update({ likes: plantData.likes });
          })
          .then(() => {
            return res.json(plantData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
//Like a comment
exports.likeComment = (req, res) => {
  const commentLikeDocument = db
    .collection("commentlikes")
    .where("username", "==", req.user.username)
    .where("commentId", "==", req.params.commentId)
    .limit(1);

  const commentDocument = db.doc(`/comments/${req.params.commentId}`);

  let commentData;

  commentDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        commentData = doc.data();
        commentData.commentId = doc.id;
        return commentLikeDocument.get();
      } else {
        res.status(404).json({ error: "Comment not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("commentlikes")
          .add({
            commentId: req.params.commentId,
            username: req.user.username,
          })
          .then(() => {
            commentData.likes++;
            return commentDocument.update({ likes: commentData.likes });
          })
          .then(() => {
            return res.json(commentData);
          });
      } else {
        return res.status(400).json({ error: "Comment already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
//Unlike a comment
exports.unlikeComment = (req, res) => {
  const commentLikeDocument = db
    .collection("commentlikes")
    .where("username", "==", req.user.username)
    .where("commentId", "==", req.params.commentId)
    .limit(1);

  const commentDocument = db.doc(`/comments/${req.params.commentId}`);

  let commentData;

  commentDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        commentData = doc.data();
        commentData.commentId = doc.id;
        return commentLikeDocument.get();
      } else {
        res.status(404).json({ error: "Comment not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Comment not liked" });
      } else {
        return db
          .doc(`/commentlikes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            commentData.likes--;
            return commentDocument.update({ likes: commentData.likes });
          })
          .then(() => {
            return res.json(commentData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
//Delete a Plant post
exports.deletePlant = (req, res) => {
  const plantDocument = db.doc(`plants/${req.params.plantId}`);
  plantDocument
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Plant not found" });
      }
      if (doc.data().username !== req.user.username) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return plantDocument.delete();
      }
    })
    .then(() => {
      return res.json({ message: "Plant deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
//Delete comment
exports.deleteComment = (req, res) => {
  const commentDocument = db.doc(`comments/${req.params.commentId}`);
  commentDocument
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Comment not found" });
      }
      if (doc.data().username !== req.user.username) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        db.doc(`/plants/${doc.data().plantId}`) // find a plant that has that comment and reduce commentCount
          .get()
          .then((doc) => {
            if (!doc.exists) {
              return res.status(404).json({ error: "Plant post not found" });
            }
            return doc.ref.update({
              commentCount: doc.data().commentCount - 1,
            });
          })
          .then(() => {
            return commentDocument.delete();
          });
      }
    })
    .then(() => {
      return res.json({ message: "Comment deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
// Edit comment
exports.editComment = (req, res) => {
  const commentDocument = db.doc(`comments/${req.params.commentId}`);
  commentDocument
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Comment not found" });
      }
      if (doc.data().username !== req.user.username) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return commentDocument.update({ body: req.body.body });
      }
    })
    .then(() => {
      return res.json({ message: "Comment updated successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
