const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, '../_posts');
const outputPath = path.join(__dirname, '../posts.json');

console.log('🚀 Generating posts data from frontmatter...');

if (!fs.existsSync(postsDir)) {
  console.error('❌ _posts directory not found!');
  process.exit(1);
}

const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

const posts = files.map(file => {
  const slug = file.replace(/\.md$/, '');
  const filePath = path.join(postsDir, file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Helper to extract frontmatter values (e.g., image: /assets/... or description: ...)
  const getFrontmatterField = (field) => {
    const regex = new RegExp(`^${field}:\\s*(['"]?)(.*?)\\1$`, 'm');
    const match = content.match(regex);
    return match ? match[2].trim() : null;
  };

  // Extract title (from frontmatter or first # heading)
  let title = getFrontmatterField('title');
  if (!title) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    title = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ');
  }

  // Extract custom image and description from frontmatter
  const image = getFrontmatterField('image') || '/assets/favicon.jpg';
  const description = getFrontmatterField('description') || getFrontmatterField('excerpt') || 'Technical hardware guide and diagnostic documentation.';

  return {
    slug,
    title,
    description,
    excerpt: description,
    image,
    url: `/blog/${slug}/`,
    date: getFrontmatterField('date') || fs.statSync(filePath).birthtime.toISOString().split('T')[0]
  };
});

fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2), 'utf8');
console.log(`✨ Generated data for ${posts.length} posts with custom frontmatter successfully!`);