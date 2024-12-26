import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const dir = path.join(__dirname, '../../backups');
!fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true });

const backup = () => {
  const file = path.join(dir, `backup-${Date.now()}`);
  
  const dump = spawn('mongodump', [
    '--uri=mongodb://localhost/db',
    `--out=${file}`,
    '--gzip'
  ]);

  dump.on('close', code => {
    if (code === 0) {
      // Keep last 5 backups
      const files = fs.readdirSync(dir)
        .map(f => ({ name: f, time: fs.statSync(path.join(dir, f)).birthtime.getTime() }))
        .sort((a, b) => b.time - a.time);

      files.slice(5).forEach(f => {
        fs.rmSync(path.join(dir, f.name), { recursive: true });
      });
    }
    process.exit(code || 0);
  });
};

backup(); 