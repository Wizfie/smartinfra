const fs = require('fs');
const path = require('path');

const results = [];

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const full = path.join(dir, item);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (full.endsWith('.vue') || full.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (/laptop|smartlap/i.test(line)) {
          results.push(`${path.relative('.', full)}:${idx + 1}: ${line.trim()}`);
        }
      });
    }
  }
}

walk('frontend/src');
fs.writeFileSync('audit_results.txt', results.join('\n'));
console.log(`Found ${results.length} matches. Saved to audit_results.txt`);
