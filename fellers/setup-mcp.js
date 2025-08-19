// Setup script for Supabase MCP server
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://mzqbheqosfjddmbytkzz.supabase.co';
// Using the old anon key temporarily - you'll need to update this with the new project's key
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljZndreHZoZG5xbmN5aHluY21qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwOTk3NzEsImV4cCI6MjA1ODY3NTc3MX0.2_0pduHQDFktd7f6fOBCHM91WOIDr1U7npqG0MkFgJA';

const supabase = createClient(supabaseUrl, anonKey);

async function setupMCP() {
  console.log('🔧 Setting up Supabase MCP server...');
  
  try {
    // Test connection to the new database
    console.log('🔍 Testing connection to new Supabase project...');
    const { data, error } = await supabase
      .from('contacts')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Contacts table not found. Please run the SQL script first:');
        console.log('1. Go to https://supabase.com/dashboard');
        console.log('2. Select project: mzqbheqosfjddmbytkzz');
        console.log('3. Open SQL Editor');
        console.log('4. Run the table creation SQL');
        return false;
      } else {
        console.log('❌ Database connection error:', error.message);
        console.log('💡 You may need to update the API keys for the new project');
        return false;
      }
    }
    
    console.log('✅ Database connection successful!');
    console.log('📊 Contacts table found');
    
    // Create MCP configuration
    const mcpConfig = {
      "mcpServers": {
        "fellers-supabase": {
          "command": "enhanced-postgres-mcp-server",
          "args": [
            "--database-url",
            `postgresql://postgres.mzqbheqosfjddmbytkzz:[YOUR_DB_PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
          ],
          "env": {
            "DATABASE_URL": `postgresql://postgres.mzqbheqosfjddmbytkzz:[YOUR_DB_PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
            "SUPABASE_URL": supabaseUrl,
            "SUPABASE_ANON_KEY": anonKey
          }
        }
      }
    };
    
    // Write MCP config
    fs.writeFileSync('mcp-config.json', JSON.stringify(mcpConfig, null, 2));
    console.log('✅ MCP configuration created: mcp-config.json');
    
    // Create usage instructions
    const instructions = `# Supabase MCP Server Setup

## ✅ MCP Server Installed and Configured

### Available Tools:
- **enhanced-postgres-mcp-server**: Direct PostgreSQL queries to Supabase
- **@supabase/mcp-utils**: Supabase-specific utilities

### Database Connection:
- **Project ID**: mzqbheqosfjddmbytkzz
- **URL**: ${supabaseUrl}
- **Status**: ✅ Connected and verified

### Usage Examples:

#### Query contacts table:
\`\`\`sql
SELECT * FROM contacts ORDER BY created_at DESC LIMIT 10;
\`\`\`

#### Insert test contact:
\`\`\`sql
INSERT INTO contacts (name, phone, location, details) 
VALUES ('Test User', '555-1234', 'Test Location', 'MCP test contact');
\`\`\`

#### Check table structure:
\`\`\`sql
\\d contacts
\`\`\`

### Next Steps:
1. Update API keys for project mzqbheqosfjddmbytkzz
2. Replace [YOUR_DB_PASSWORD] in mcp-config.json with actual password
3. Use MCP tools for all database operations during development

### Testing:
Run: \`node test-mcp-connection.js\` to verify everything works
`;
    
    fs.writeFileSync('MCP_SETUP_INSTRUCTIONS.md', instructions);
    console.log('✅ Instructions created: MCP_SETUP_INSTRUCTIONS.md');
    
    return true;
    
  } catch (error) {
    console.error('💥 Setup failed:', error);
    return false;
  }
}

setupMCP()
  .then(success => {
    if (success) {
      console.log('');
      console.log('🎉 MCP setup complete!');
      console.log('📖 See MCP_SETUP_INSTRUCTIONS.md for usage details');
      console.log('🔧 Next: Update API keys and database password');
    } else {
      console.log('⚠️  Setup incomplete - see errors above');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Setup script failed:', error);
    process.exit(1);
  });