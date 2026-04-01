import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://klwexowmvxurphajwlyk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsd2V4b3dtdnh1cnBoYWp3bHlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzU1OTEwNywiZXhwIjoyMDgzMTM1MTA3fQ.NQ5sCmYzT41uf-fnMDOQeLYIcMO4CBVZx3inGW-K_pw'
);

async function main() {
  const { data, error } = await supabase.from('skills').select('slug');
  if (error) {
    console.error(error);
    return;
  }
  console.log('Slugs with quotes:');
  data.forEach(s => console.log(`'${s.slug}'`));
  
  const slugToTest = 'productivity';
  const { data: test, error: err } = await supabase.from('skills').select('*').eq('slug', slugToTest).single();
  console.log(`\nTesting eq('slug', '${slugToTest}'):`);
  if (err) console.log('Error:', err.message);
  else console.log('Found:', test.name);
}

main();
