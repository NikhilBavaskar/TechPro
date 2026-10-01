const fs = require('fs');
const path = require('path');

// Configuration
const postsDir = path.join(__dirname, '../_posts');
const outputDir = path.join(__dirname, '../blog');
const templatePath = path.join(outputDir, 'post.html');

console.log('🚀 Starting TechPro Static Site Build...');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read template file
let templateHtml = '';
try {
  templateHtml = fs.readFileSync(templatePath, 'utf8');
} catch (err) {
  console.error('❌ Error reading post.html template:', err.message);
  process.exit(1);
}

// Ensure the template header includes the technical background textures
if (!templateHtml.includes('bg-tech-mesh')) {
  templateHtml = templateHtml.replace(
    /<header class="bg-white border-b border-slate-200 py-12 md:py-16">/,
    '<header class="relative bg-white border-b border-slate-200 py-12 md:py-16 overflow-hidden">\n      <div class="absolute inset-0 bg-tech-mesh opacity-[0.03]"></div>\n      <div class="absolute inset-0 bg-noise mix-blend-overlay"></div>'
  );
}

// Read all markdown posts
if (!fs.existsSync(postsDir)) {
  console.error('❌ _posts directory not found!');
  process.exit(1);
}

const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

files.forEach(file => {
  const slug = file.replace(/\.md$/, '');
  const postFolder = path.join(outputDir, slug);

  // Create individual directory for clean URL routing (/blog/slug/)
  if (!fs.existsSync(postFolder)) {
    fs.mkdirSync(postFolder, { recursive: true });
  }

  const outputFilePath = path.join(postFolder, 'index.html');
  
  // Write out the synchronized template file to each post subfolder
  fs.writeFileSync(outputFilePath, templateHtml, 'utf8');
  console.log(`✔ Built static route: /blog/${slug}/`);
});

console.log('✨ Build completed successfully! All post headers and templates are fully synchronized.');