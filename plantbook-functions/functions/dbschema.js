// not actual just reference

let db = {
  plants: [
    {
      title: "Title of PostPlant",
      username: "User",
      userImg: "",
      posted: "Sat, 30 May 2020 15:47:13 GMT",
      category: "Wild plants",
      commonName: "Common name",
      scientificName: "Scientific name",
      description: "Plant description",
      family: "",
      location: "string ",
      imgUrl: "",
      likes: 5,
      commentCount: 2,
    },
  ],
  users: [
    {
      userId: "5s54s58d1s5s4s5",
      email: "user@mail.com",
      username: "user",
      password: "",
      createdAt: "Sun, 31 May 2020 18:44:05 GMT",
      imgUrl: "",
      bio: "bio",
      ocupation: "student",
      website: "www.school.com",
      location: "Belgrade, Serbia",
    },
  ],
  comments: [
    {
      userImg: "",
      plantId: "5s54s58d1s5s4s5",
      body: "Nice plant",
      username: "user",
      createdAt: "Sun, 31 May 2020 18:44:05 GMT",
      likes: 1,
    },
  ],
  likes: [
    {
      plantId: "",
      username: "",
    },
  ],
  commentlikes: [
    {
      commentId: "",
      username: "",
    },
  ],
  notifications: [
    {
      recipient: "user",
      sender: "user2",
      read: "true || false",
      id: "plantId || commentId",
      type: "like || comment || likeComment",
      createdAt: "2020-03-15T10:59:59.7987",
    },
  ],
};
