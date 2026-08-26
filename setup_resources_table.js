import { query } from './db.js';

async function createResourcesTable() {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS resources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        file_url VARCHAR(1024) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await query(sql);
    console.log("Successfully created 'resources' table.");
    process.exit(0);
  } catch (err) {
    console.error("Error creating table:", err);
    process.exit(1);
  }
}

createResourcesTable();
