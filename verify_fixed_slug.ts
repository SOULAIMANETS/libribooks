
function generateSlug(title: string) {
    return title.toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\p{L}\p{N}-]+/gu, '') || `article-${Date.now()}`;
}

const arabicTitle = "كتاب الرجال من المريخ والنساء من الزهرة";
const slug = generateSlug(arabicTitle);

console.log(`Original Title: "${arabicTitle}"`);
console.log(`Generated Slug: "${slug}"`);

if (slug.length > 10 && slug !== "------") {
    console.log("SUCCESS: Slug generated correctly.");
} else {
    console.log("FAIL: Slug is still broken or empty.");
}
