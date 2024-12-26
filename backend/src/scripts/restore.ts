import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const dir = process.argv[2];
if (!dir) {
  console.log('Usage: npm run restore <backup-dir>');
  process.exit(1);
}

const file = path.join(__dirname, '../../backups', dir);
if (!fs.existsSync(file)) {
  console.log('Backup not found:', file);
  process.exit(1);
}

const restore = spawn('mongorestore', [
  '--uri=mongodb://localhost/db',
  '--drop',
  '--gzip',
  file
]);

restore.on('close', code => {
  process.exit(code || 0);
}); 