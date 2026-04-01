import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://klwexowmvxurphajwlyk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsd2V4b3dtdnh1cnBoYWp3bHlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzU1OTEwNywiZXhwIjoyMDgzMTM1MTA3fQ.NQ5sCmYzT41uf-fnMDOQeLYIcMO4CBVZx3inGW-K_pw'
);

async function main() {
  const { data, error } = await supabase.from('articles').select('*').eq('slug', '5-evidence-based-habits-that-will-transform-your-daily-productivity').single();
  if (error) {
    console.error(error);
    return;
  }
  console.log('Article details:');
  console.log('Slug:', data.slug);
  console.log('Skill Slug:', data.skill_slug);
  console.log('Role:', data.article_role);
  console.log('Links in content:', data.content.includes('/author/') && data.content.includes('/book/'));
}

main();
