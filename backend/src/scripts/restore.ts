import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { config } from 'dotenv';

// Load environment variables
config();

const BACKUP_PATH = path.join(__dirname, '../../backups');

if (!process.argv[2]) {
  console.error('Please provide the backup directory name');
  console.log('Example: npm run restore backup-2024-01-01T00-00-00-000Z');
  process.exit(1);
}

const backupDir = process.argv[2];
const backupPath = path.join(BACKUP_PATH, backupDir);

if (!fs.existsSync(backupPath)) {
  console.error(`Backup directory not found: ${backupPath}`);
  process.exit(1);
}

const databaseURL = process.env.MONGODB_URI || 'mongodb://localhost:27017/ate-leslie';

// Function to execute mongorestore
const performRestore = () => {
  console.log(`Restoring from backup: ${backupPath}`);
  
  const mongorestore = spawn('mongorestore', [
    `--uri="${databaseURL}"`,
    '--drop', // Drop existing collections before restore
    '--gzip',
    backupPath
  ]);

  mongorestore.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  mongorestore.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  mongorestore.on('close', (code) => {
    if (code === 0) {
      console.log('Restore completed successfully');
    } else {
      console.error(`Restore failed with code ${code}`);
    }
  });
};

// Execute restore
performRestore(); 