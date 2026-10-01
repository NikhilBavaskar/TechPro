const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../_posts');
const siteUrl = 'https://techprohardware.in';
const templatePath = path.join(__dirname, '../blog/post.html');

if (!fs.existsSync(postsDir) || !fs.existsSync(templatePath)) process.exit(0);

const template = fs.readFileSync(templatePath, 'utf8');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
const posts = [];

files.forEach(file => {
  const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return;

  const meta = {};
  match[1].split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx !== -1) {
      const k = line.slice(0, idx).trim();
      let v = line.slice(idx + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      meta[k] = v;
    }
  });

  const slug = meta.slug || file.replace('.md', '');
  posts.push({
    id: slug,
    slug: slug,
    title: meta.title || slug,
    tag: meta.tag || 'Field Guide',
    date: meta.date || 'Sep 2026',
    readTime: meta.readTime || '5 min read',
    image: meta.image || '',
    excerpt: meta.excerpt || ''
  });

  // Generate Clean Subfolder Route
  const postFolder = path.join(__dirname, `../blog/${slug}`);
  if (!fs.existsSync(postFolder)) fs.mkdirSync(postFolder, { recursive: true });

  const canonicalUrl = `${siteUrl}/blog/${slug}/`;
  let pageContent = template.replace(
    /<link rel="canonical" id="canonicalLink"[^>]*>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  fs.writeFileSync(path.join(postFolder, 'index.html'), pageContent);
  console.log(`Generated clean SEO route: /blog/${slug}/`);
});

// Write posts.json
fs.writeFileSync(path.join(__dirname, '../posts.json'), JSON.stringify(posts, null, 2));

// Write sitemap.xml
const today = new Date().toISOString().split('T')[0];
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
sitemap += `  <url><loc>${siteUrl}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>\n`;

posts.forEach(p => {
  sitemap += `  <url><loc>${siteUrl}/blog/${p.slug}/</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>\n`;
});
sitemap += `</urlset>`;

fs.writeFileSync(path.join(__dirname, '../sitemap.xml'), sitemap);
console.log('Successfully regenerated posts.json, sitemap.xml, and clean blog routes.');