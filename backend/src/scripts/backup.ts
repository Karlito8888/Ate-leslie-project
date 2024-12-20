import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

const BACKUP_PATH = path.join(__dirname, '../../backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_PATH)) {
  fs.mkdirSync(BACKUP_PATH, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const databaseURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/ate-leslie';
const backupFile = path.join(BACKUP_PATH, `backup-${timestamp}`);

// Function to execute mongodump
const performBackup = () => {
  const mongodump = spawn('mongodump', [
    `--uri="${databaseURL}"`,
    `--out=${backupFile}`,
    '--gzip'
  ]);

  mongodump.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  mongodump.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  mongodump.on('close', (code) => {
    if (code === 0) {
      console.log(`Backup completed successfully at ${backupFile}`);
      // Keep only the last 5 backups
      cleanupOldBackups();
    } else {
      console.error(`Backup failed with code ${code}`);
    }
  });
};

// Function to clean up old backups (keep only the last 5)
const cleanupOldBackups = () => {
  fs.readdir(BACKUP_PATH, (err, files) => {
    if (err) {
      console.error('Error reading backup directory:', err);
      return;
    }

    // Sort files by creation time (oldest first)
    const sortedFiles = files
      .map(file => ({
        name: file,
        time: fs.statSync(path.join(BACKUP_PATH, file)).birthtime.getTime()
      }))
      .sort((a, b) => a.time - b.time);

    // Remove all but the last 5 backups
    while (sortedFiles.length > 5) {
      const oldestFile = sortedFiles.shift();
      if (oldestFile) {
        fs.rmSync(path.join(BACKUP_PATH, oldestFile.name), { recursive: true });
        console.log(`Removed old backup: ${oldestFile.name}`);
      }
    }
  });
};

// Execute backup
performBackup(); 