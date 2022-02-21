const {
  client,
  createUser,
  updateUser,
  getAllUsers,
  getUserById,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUser,
  createTags,
} = require("./index");

async function dropTables() {
  try {
    console.log("Starting to drop tables...");
    await client.query(`
    DROP TABLE IF EXISTS post_tags;
    DROP TABLE IF EXISTS tags;
        DROP TABLE IF EXISTS posts;
        DROP TABLE IF EXISTS users;
        `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}
async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
          CREATE TABLE users (
              id SERIAL PRIMARY KEY,
              username varchar (255) UNIQUE NOT NULL,
              password varchar (255) NOT NULL,
              name varchar (255) NOT NULL,
              location varchar (255) NOT NULL,
              active BOOLEAN DEFAULT TRUE
          );
  
          CREATE TABLE posts (
              id SERIAL PRIMARY KEY,
              "authorId" INTEGER REFERENCES users(id) NOT NULL,
              title varchar (255) NOT NULL,
              content TEXT NOT NULL, 
              active BOOLEAN DEFAULT true
          );
          CREATE TABLE tags (id SERIAL PRIMARY KEY, name varchar (255) UNIQUE NOT NULL);
          CREATE TABLE post_tags ("postId" INT REFERENCES posts(id) UNIQUE NOT NULL, "tagId" INT REFERENCES tags(id) UNIQUE NOT NULL)
  
          `);
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("starting to create users...");

    const albert = await createUser({
      username: "albert",
      password: "bertie99",
      name: "albert",
      location: "Sydney, Austrialia",
      active: true,
    });
    const sandra = await createUser({
      username: "sandra",
      password: "2sandy4me",
      name: "sandra",
      location: "cleveland",
      active: true,
    });
    const glamgal = await createUser({
      username: "glamgal",
      password: "soglam",
      name: "joshua",
      location: "Upper East Side",
      active: true,
    });

    console.log("finished creating users!");
  } catch (error) {
    console.error("error creating users!");
    throw error;
  }
}

async function createInitialPosts() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    await createPost({
      authorId: albert.id,
      title: "First Post",
      content:
        "This is my first post. I hope I love writing blogs as much as I love writing them.",
    });
    await createPost({
      authorId: sandra.id,
      title: "sandras first post",
      content: "Sandra Sandra Sandra",
    });
    await createPost({
      authorId: glamgal.id,
      title: "Glamorous",
      content: "G .. L.. A.. M.. O.. R.. O.. U.. S..",
    });

    console.log("Finished creating posts!");
  } catch (error) {
    console.log("Error creating posts!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createInitialPosts();
    await createTags();
  } catch (error) {
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");
    console.log("Calling getAllUsers");

    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY",
    });
    console.log("Result", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].id, {
      title: "New Title",
      content: "Updated Content",
    });
    console.log("Result:", updatePostResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing databse!");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
