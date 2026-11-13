import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabase = createClient(
  'https://klwexowmvxurphajwlyk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsd2V4b3dtdnh1cnBoYWp3bHlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzU1OTEwNywiZXhwIjoyMDgzMTM1MTA3fQ.NQ5sCmYzT41uf-fnMDOQeLYIcMO4CBVZx3inGW-K_pw'
);

const covers = [
  { slug: 'business', filePath: 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\0dbcfeba-a8f6-4af0-a718-ce1711e03322\\business_skill_cover_1775082729395.png' },
  { slug: 'communication', filePath: 'C:\\Users\\ACER\\.gemini\\antigravity\\brain\\0dbcfeba-a8f6-4af0-a718-ce1711e03322\\communication_skill_cover_1775082747653.png' }
];

async function main() {
  console.log('🚀 Uploading final cover images...\n');

  for (const cover of covers) {
    if (!fs.existsSync(cover.filePath)) {
      console.log(`  ⚠ Missing file: ${cover.filePath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(cover.filePath);
    const storagePath = `skills/${cover.slug}-cover.png`;

    const { error: uploadError } = await supabase.storage
      .from('libribooks')
      .upload(storagePath, fileBuffer, { contentType: 'image/png', upsert: true });

    if (uploadError) {
      console.log(`  ✗ Upload failed for ${cover.slug}: ${uploadError.message}`);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('libribooks')
      .getPublicUrl(storagePath);

    const { error: updateError } = await supabase
      .from('skills')
      .update({ cover_image_url: publicUrl })
      .eq('slug', cover.slug);

    if (updateError) {
      console.log(`  ✗ Update failed for ${cover.slug}: ${updateError.message}`);
    } else {
      console.log(`  ✓ Successfully updated: ${cover.slug}`);
    }
  }

  console.log('\n✅ All covers updated!');
}

main().catch(console.error);
