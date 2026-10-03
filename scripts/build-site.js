const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../_posts');
const outputDir = path.join(__dirname, '../blog');
const templatePath = path.join(outputDir, 'post.html');

console.log('🚀 Starting TechPro Static Site Build...');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

let templateHtml = '';
try {
  templateHtml = fs.readFileSync(templatePath, 'utf8');
} catch (err) {
  console.error('❌ Error reading post.html template:', err.message);
  process.exit(1);
}

if (!fs.existsSync(postsDir)) {
  console.error('❌ _posts directory not found!');
  process.exit(1);
}

const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

files.forEach(file => {
  const slug = file.replace(/\.md$/, '');
  const postFolder = path.join(outputDir, slug);

  if (!fs.existsSync(postFolder)) {
    fs.mkdirSync(postFolder, { recursive: true });
  }

  const outputFilePath = path.join(postFolder, 'index.html');
  
  // Dynamically replace the generic canonical URL with the unique post URL
  const uniqueCanonicalUrl = `https://techprohardware.in/blog/${slug}/`;
  let postHtml = templateHtml.replace(
    /href="https:\/\/techprohardware\.in\/blog\/post\.html"/g, 
    `href="${uniqueCanonicalUrl}"`
  );

  fs.writeFileSync(outputFilePath, postHtml, 'utf8');
  console.log(`✔ Built static route with unique canonical: /blog/${slug}/`);
});

console.log('✨ Build completed successfully!');
