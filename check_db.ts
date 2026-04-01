import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://klwexowmvxurphajwlyk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsd2V4b3dtdnh1cnBoYWp3bHlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzU1OTEwNywiZXhwIjoyMDgzMTM1MTA3fQ.NQ5sCmYzT41uf-fnMDOQeLYIcMO4CBVZx3inGW-K_pw'
);

async function main() {
  const { data, error } = await supabase.from('skills').select('*');
  if (error) {
    console.error('Error fetching skills:', error);
    return;
  }
  console.log('Skills in database:');
  data.forEach(s => console.log(`- ${s.name} (slug: ${s.slug})`));
  
  const { data: prodSkill, error: prodError } = await supabase.from('skills').select('*').eq('slug', 'productivity').single();
  console.log('\nProductivity skill check:');
  if (prodError) {
    console.log('Error fetching productivity skill:', prodError.message);
  } else {
    console.log('Found productivity skill:', prodSkill);
  }
}

main().catch(console.error);
