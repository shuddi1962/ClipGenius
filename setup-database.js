import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

const INSFORGE_URL = 'https://wk49fyqm.us-east.insforge.app';
const API_KEY = 'ik_b3ae8b55af494b44ea71b320a7302a07';

const client = axios.create({
  baseURL: INSFORGE_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'apikey': API_KEY,
  },
});

async function executeSQL(sql) {
  try {
    console.log('Executing SQL...');
    const response = await client.post('/rest/v1/rpc/exec_sql', {
      sql: sql
    });
    console.log('✅ SQL executed successfully');
    return response.data;
  } catch (error) {
    console.error('❌ SQL execution failed:', error.response?.data || error.message);
    throw error;
  }
}

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Nexus database on InsForge...');

    // Read the SQL schema file
    const sqlPath = path.join(process.cwd(), 'database-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    // Split SQL into individual statements (basic approach)
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📄 Found ${statements.length} SQL statements to execute`);

    // Execute statements in batches to avoid timeout
    const batchSize = 5;
    for (let i = 0; i < statements.length; i += batchSize) {
      const batch = statements.slice(i, i + batchSize);
      const batchSQL = batch.join(';\n') + ';';

      console.log(`📦 Executing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(statements.length / batchSize)}`);
      await executeSQL(batchSQL);
    }

    console.log('🎉 Database setup completed successfully!');
    console.log('');
    console.log('📋 Demo Accounts Created:');
    console.log('👑 Admin: admin@nexus.app / password123');
    console.log('👤 Demo User: demo@nexus.app / password123');
    console.log('');
    console.log('🔗 Admin Dashboard: /admin');
    console.log('🏠 User Dashboard: /dashboard (after login)');

  } catch (error) {
    console.error('💥 Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();