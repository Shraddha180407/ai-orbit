const fs = require('fs');
const files = [
  'src/app/robots/[slug]/page.tsx',
  'src/app/repositories/[slug]/page.tsx',
  'src/app/models/[slug]/page.tsx',
  'src/app/investors/[slug]/page.tsx',
  'src/app/fundraises/[slug]/page.tsx',
  'src/app/devices/[slug]/page.tsx',
  'src/app/countries/[slug]/page.tsx',
  'src/app/tasks/[slug]/page.tsx'
];
for (const f of files) {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace(/export default async function Page\(\{ params \}: \{ params: Promise<\{ slug: string \}> \}\) \{[\s\S]*?return <EntityDetail type="(.*?)" slug=\{slug\} \/>;[\s\S]*?\}/, 'export default function Page() {\n  return <EntityDetail type="$1" />;\n}');
    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
  }
}
