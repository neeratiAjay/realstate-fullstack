const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Function to backup the database
function backupDatabase() {
    const sourceDbPath = path.join(__dirname, "users.db");
    const backupDir = path.join(__dirname, "backups");
    const backupPath = path.join(backupDir, `users_backup_${Date.now()}.db`);

    try {
        // Ensure the backup directory exists
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true });
        }

        // Copy the database file to the backup location
        fs.copyFileSync(sourceDbPath, backupPath);

        console.log(`Database backup completed successfully. Backup file: ${backupPath}`);
    } catch (err) {
        console.error("Error during database backup:", err);
    }
}

// Run the backup every hour (3600000 ms)
setInterval(backupDatabase, 3600000); // Backup every 1 hour

module.exports = backupDatabase;
