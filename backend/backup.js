const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

// Function to backup the database
function backupDatabase() {
    const sourceDbPath = path.join(__dirname, "users.db");
    const backupPath = path.join(__dirname, 'backups', `users_backup_${Date.now()}.db`);

    // Ensure the backup directory exists
    if (!fs.existsSync(path.join(__dirname, "backups"))) {
        fs.mkdirSync(path.join(__dirname, "backups"));
    }

    // Open the source database and the backup database
    const sourceDb = new sqlite3.Database(sourceDbPath);
    const backupDb = new sqlite3.Database(backupPath);

    sourceDb.serialize(() => {
        // Perform the backup operation
        sourceDb.backup(backupDb, (err) => {
            if (err) {
                console.error('Error while backing up the database:', err);
                return;
            }
            console.log('Database backup completed successfully');
        });
    });

    // Close the databases
    sourceDb.close();
    backupDb.close();
}

// Run the backup every hour (3600000 ms)
setInterval(backupDatabase, 3600000); // Backup every 1 hour

module.exports = backupDatabase;