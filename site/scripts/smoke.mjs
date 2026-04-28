import postgres from "postgres";
const url = process.env.DATABASE_URL;
console.log("URL set?", !!url);
if (!url) process.exit(1);
const sql = postgres(url, { ssl: "require", max: 1 });
try {
  const cats = await sql`SELECT COUNT(*)::int AS n FROM menu_categories`;
  const items = await sql`SELECT COUNT(*)::int AS n FROM menu_items`;
  const sample = await sql`SELECT c.name AS cat, COUNT(i.id)::int AS items
    FROM menu_categories c LEFT JOIN menu_items i ON i.category_id = c.id
    GROUP BY c.id, c.name, c.sort_order ORDER BY c.sort_order LIMIT 5`;
  console.log("cats:", cats[0].n, "items:", items[0].n);
  console.log("first 5:", sample);
} catch (e) {
  console.error("ERR:", e.message);
  process.exitCode = 1;
} finally {
  await sql.end();
}
