import { users } from './store.js';

console.log('\n=== SprintDesk Demo Credentials ===');
for (const u of users) {
  console.log(`  username: ${u.username}  password: ${u.username}pass`);
}
console.log();
