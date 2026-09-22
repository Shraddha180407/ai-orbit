import { getDb } from '../server/db.js';
const db = getDb();
const count = db.prepare("SELECT count(*) as c FROM models WHERE entityType = 'tool'").get();
console.log('Tools in DB:', count);
const allTypes = db.prepare("SELECT DISTINCT entityType FROM models").all();
console.log('Distinct entityTypes in DB models table:', allTypes);
