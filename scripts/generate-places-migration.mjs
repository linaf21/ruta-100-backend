import fs from 'node:fs';
import path from 'node:path';

const inputArg = process.argv[2] ?? 'data/places.seed.json';
const cwd = process.cwd();
const inputPath = path.resolve(cwd, inputArg);

if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found: ${inputPath}`);
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, 'utf8');
let places;

try {
  places = JSON.parse(raw);
} catch (error) {
  console.error('Invalid JSON file.');
  console.error(error);
  process.exit(1);
}

if (!Array.isArray(places) || places.length === 0) {
  console.error('Input must be a non-empty array of places.');
  process.exit(1);
}

const required = ['slug', 'name', 'department', 'latitude', 'longitude'];

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function nullableString(value) {
  if (value === undefined || value === null || value === '') return 'null';
  return sqlString(value);
}

const rows = places.map((place, index) => {
  for (const key of required) {
    if (place[key] === undefined || place[key] === null || place[key] === '') {
      throw new Error(`Row ${index + 1}: missing required field ${key}`);
    }
  }

  if (typeof place.latitude !== 'number' || typeof place.longitude !== 'number') {
    throw new Error(`Row ${index + 1}: latitude and longitude must be numbers`);
  }

  return `(${[
    sqlString(place.slug),
    sqlString(place.name),
    sqlString(place.department),
    nullableString(place.region),
    nullableString(place.category),
    nullableString(place.description),
    Number(place.latitude).toFixed(6),
    Number(place.longitude).toFixed(6),
    nullableString(place.image_url),
    nullableString(place.source_url),
    'true',
  ].join(', ')})`;
});

const timestamp = new Date()
  .toISOString()
  .replace(/[-:TZ.]/g, '')
  .slice(0, 14);

// Supabase migration version parser reads the numeric prefix.
// Use a fully numeric timestamp prefix to keep each migration unique.
const fileName = `${timestamp}_seed_places_catalog.sql`;
const outputPath = path.resolve(cwd, 'supabase', 'migrations', fileName);

const sql = `-- Auto-generated from ${path.relative(cwd, inputPath)}\ninsert into public.places (\n  slug,\n  name,\n  department,\n  region,\n  category,\n  description,\n  latitude,\n  longitude,\n  image_url,\n  source_url,\n  is_active\n)\nvalues\n${rows.join(',\n')}\non conflict (slug)\ndo update set\n  name = excluded.name,\n  department = excluded.department,\n  region = excluded.region,\n  category = excluded.category,\n  description = excluded.description,\n  latitude = excluded.latitude,\n  longitude = excluded.longitude,\n  image_url = excluded.image_url,\n  source_url = excluded.source_url,\n  is_active = excluded.is_active,\n  updated_at = now();\n`;

fs.writeFileSync(outputPath, sql, 'utf8');
console.log(`Migration created: ${path.relative(cwd, outputPath)}`);
