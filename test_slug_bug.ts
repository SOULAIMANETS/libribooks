
function generateSlug(title: string) {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
}

const arabicTitle = "كتاب الرجال من المريخ والنساء من الزهرة";
const slug = generateSlug(arabicTitle);

console.log(`Original Title: "${arabicTitle}"`);
console.log(`Generated Slug: "${slug}"`);

if (slug.replace(/-/g, '').length === 0) {
    console.log("FAIL: Slug is empty or only dashes!");
} else {
    console.log("SUCCESS: Slug generated.");
}
