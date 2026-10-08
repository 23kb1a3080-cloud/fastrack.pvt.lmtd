const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function deleteProjects() {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const envFile = Object.fromEntries(
    envContent.split('\n')
      .filter(line => line && !line.startsWith('#'))
      .map(line => {
        const [key, ...val] = line.split('=');
        return [key.trim(), val.join('=').trim()];
      })
  );

  const supabaseUrl = envFile['NEXT_PUBLIC_SUPABASE_URL'] || envFile['SUPABASE_URL'];
  const supabaseKey = envFile['SUPABASE_SERVICE_ROLE_KEY'] || envFile['SUPABASE_SECRET_KEY'];

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('Deleting all projects...');
  const { error } = await supabase
    .from('projects')
    .delete()
    .neq('id', 'dummy-uuid-that-never-exists'); // Delete all rows

  if (error) {
    console.error('Error deleting projects:', error);
  } else {
    console.log('Successfully deleted all projects!');
  }
}

deleteProjects();
