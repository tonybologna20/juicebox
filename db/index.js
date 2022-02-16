const { Client } = require("pg");
const { resourceLimits } = require("worker_threads");

const client = new Client("postgres://localhost:5432/juicebox");

const getAllUsers = async () => {
  const { rows } = await client.query(
    `SELECT ID, username
        FROM users;
        `
  );

  return rows;
};

async function createUser({ username, password }) {
  try {
    const { rows } = await client.query(
      `

    INSERT INTO users(username,password) VALUES ($1,$2)
    ON CONFLICT (username) DO NOTHING
    RETURNING *;

        `,
      [username, password]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  getAllUsers,
  createUser,
};
