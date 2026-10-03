const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../_posts');
const sitemapPath = path.join(__dirname, '../sitemap.xml');
const domain = 'https://techprohardware.in';

console.log('🚀 Generating clean sitemap.xml...');

if (!fs.existsSync(postsDir)) {
  console.error('❌ _posts directory not found!');
  process.exit(1);
}

const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domain}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <priority>1.0</priority>
  </url>`;

files.forEach(file => {
  const slug = file.replace(/\.md$/, '');
  const filePath = path.join(postsDir, file);
  const stats = fs.statSync(filePath);
  const lastMod = stats.mtime.toISOString().split('T')[0];

  xml += `
  <url>
    <loc>${domain}/blog/${slug}/</loc>
    <lastmod>${lastMod}</lastmod>
    <priority>0.8</priority>
  </url>`;
});

xml += `\n</urlset>`;

fs.writeFileSync(sitemapPath, xml, 'utf8');
console.log(`✨ Sitemap generated successfully with ${files.length + 1} clean URLs!`);