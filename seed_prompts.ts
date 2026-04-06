import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Read Env for Supabase keys
import { loadEnv } from 'vite';

const env = loadEnv('', process.cwd(), '');
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = env.VITE_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function extractAndSeed() {
  console.log("Reading HTML files...");
  
  const imgPath = path.join(process.cwd(), 'prompts', 'MonsterDrink', 'Monster_Drink_Image.html');
  const animPath = path.join(process.cwd(), 'prompts', 'MonsterDrink', 'Monster_Drink_Animation.html');
  
  const imgHtml = fs.readFileSync(imgPath, 'utf-8');
  const animHtml = fs.readFileSync(animPath, 'utf-8');

  // Simple regex to extract the JSON blocks from <div class="code">...</div>
  const imgBlocks = [...imgHtml.matchAll(/<div class="code">\s*([\s\S]*?)\s*<\/div>/g)].map(m => m[1].trim());
  const animBlocks = [...animHtml.matchAll(/<div class="code">\s*([\s\S]*?)\s*<\/div>/g)].map(m => m[1].trim());

  console.log(`Found ${imgBlocks.length} image prompts and ${animBlocks.length} video prompts.`);

  for (let i = 0; i < imgBlocks.length; i++) {
    try {
      // Very basic parsing since it's raw JSON in the HTML
      const imgJson = JSON.parse(imgBlocks[i]);
      
      const title = imgJson.shot || `Shot ${i + 1}`;
      const brand = "Monster Energy";
      const image_prompt = imgJson.cinematic_image_prompt || "";
      const negative_prompt = imgJson.negative_prompt || "";
      
      // Video chunk is exactly the raw JSON text from the other file
      const video_prompt = animBlocks[i] || "";

      const payload = {
        title,
        brand,
        image_prompt,
        negative_prompt,
        video_prompt,
        is_free: true
      };

      console.log(`Inserting: ${title}...`);
      const { error } = await supabase.from('reel_prompts').insert([payload]);
      
      if (error) {
        console.error("Error inserting:", error.message);
      } else {
        console.log("Success!");
      }
    } catch (e) {
      console.error("Failed to parse or insert chunk", i, e);
    }
  }
  console.log("Done inserting!");
}

extractAndSeed();
