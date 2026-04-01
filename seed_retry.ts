import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://klwexowmvxurphajwlyk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsd2V4b3dtdnh1cnBoYWp3bHlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzU1OTEwNywiZXhwIjoyMDgzMTM1MTA3fQ.NQ5sCmYzT41uf-fnMDOQeLYIcMO4CBVZx3inGW-K_pw'
);

async function main() {
  console.log('Retrying: From Zero to One article...\n');

  const article = {
    slug: 'from-zero-to-one-essential-lessons-for-aspiring-entrepreneurs',
    title: 'From Zero to One: Essential Lessons for Aspiring Entrepreneurs',
    excerpt: "The greatest businesses don't compete — they create. Discover the counterintuitive principles that built Nike, Pixar, and the world's most iconic companies, distilled from five essential business books.",
    author_name: 'Libribooks',
    date: '2026-04-02T07:00:00Z',
    skill_slug: 'business',
    article_role: 'concept',
    meta_title: 'Essential Lessons for Entrepreneurs: From Zero to One | Libribooks',
    meta_description: 'The counterintuitive business principles that built iconic companies. Insights from Zero to One, Good to Great, Shoe Dog, and more.',
    keyword_links: [
      { keyword: 'Zero to One', url: 'https://www.libribooks.com/book/zero-to-one' },
      { keyword: 'Good to Great', url: 'https://www.libribooks.com/book/good-to-great' },
      { keyword: 'Shoe Dog', url: 'https://www.libribooks.com/book/shoe-dog' },
      { keyword: 'The Personal MBA', url: 'https://www.libribooks.com/book/the-personal-mba' },
      { keyword: 'Business Adventures', url: 'https://www.libribooks.com/book/business-adventures' },
      { keyword: 'Peter Thiel', url: 'https://www.libribooks.com/author/peter-thiel' },
      { keyword: 'Jim Collins', url: 'https://www.libribooks.com/author/jim-collins' },
      { keyword: 'Phil Knight', url: 'https://www.libribooks.com/author/phil-knight' }
    ],
    cover_image_url: '',
    content: `<p>Most business advice is well-intentioned and completely wrong. Work harder. Hustle more. Network aggressively. Build a personal brand. The noise is deafening — and much of it points in the wrong direction.</p>

<p>The most important business lessons don't come from Instagram gurus. They come from people who actually built enduring, transformative companies from nothing — and were honest enough to write down what they learned. Here are the insights that matter most.</p>

<h2>The Most Important Question in Business</h2>

<p><a href="https://www.libribooks.com/author/peter-thiel">Peter Thiel</a>, co-founder of PayPal and the first outside investor in Facebook, opens <a href="https://www.libribooks.com/book/zero-to-one">Zero to One</a> with a question he asks in every interview: <em>"What important truth do very few people agree with you on?"</em></p>

<p>This is a filter for genuine contrarian insight — the kind of thinking that creates new markets rather than competing in existing ones. Thiel's central thesis: <strong>competition is for losers.</strong> The most valuable businesses don't fight for market share — they create monopolies by doing something so unique that they have no direct competition.</p>

<p>Going from "zero to one" means creating something genuinely new. Going from "one to n" means copying what already exists and improving it incrementally. The former is exponentially harder and exponentially more valuable. Thiel argues that most founders are playing the wrong game entirely.</p>

<p>Thiel's seven questions every startup must answer honestly:</p>
<ol>
<li>Can you create breakthrough technology, not just incremental improvement?</li>
<li>Is now the right time to build this particular business?</li>
<li>Are you starting with a big share of a small market?</li>
<li>Do you have the right team?</li>
<li>Do you have a way to distribute your product, not just build it?</li>
<li>Will your market position be defensible in 10 and 20 years?</li>
<li>Have you identified a unique opportunity that others don't see?</li>
</ol>

<h2>What Separates Good Companies from Great Ones</h2>

<p><a href="https://www.libribooks.com/author/jim-collins">Jim Collins</a> and his research team spent five years studying 1,435 Fortune 500 companies to answer one question: why do some companies make the leap from good to truly great while others never do? <a href="https://www.libribooks.com/book/good-to-great">Good to Great</a> reveals the answer through concepts that have become foundational to modern business thinking.</p>

<p><strong>Level 5 Leadership:</strong> Great companies are led not by charismatic visionaries, but by humble, driven leaders who channel ambition into the company rather than their ego. They look out the window to credit others for success and in the mirror to accept blame.</p>

<p><strong>The Hedgehog Concept:</strong> Great companies find the intersection of three circles — what they can be best in the world at, what drives their economic engine, and what they are deeply passionate about — and pursue that intersection with relentless focus.</p>

<p><strong>The Flywheel:</strong> There is no single defining moment when a company transforms from good to great. Greatness is the result of consistent pushes in a focused direction, each building on the last, until the flywheel gains unstoppable momentum.</p>

<h2>The Memoir Every Entrepreneur Needs</h2>

<p><a href="https://www.libribooks.com/author/phil-knight">Phil Knight</a>'s <a href="https://www.libribooks.com/book/shoe-dog">Shoe Dog</a> is the most honest entrepreneurial memoir ever written. Knight doesn't celebrate the journey — he tells the truth about it. Nike came within inches of bankruptcy multiple times. Suppliers betrayed him. Banks abandoned him. Competitors tried to destroy him.</p>

<p>What kept Nike alive wasn't a brilliant strategy. It was a <strong>mission</strong> — Knight's conviction that authentic athletics could change lives — and an almost irrational refusal to quit. The lesson for entrepreneurs isn't tactical. It's emotional: the willingness to persist through circumstances that would make any rational person walk away is not a personality quirk. It's the prerequisite for building something lasting.</p>

<h2>The Education You Can Give Yourself</h2>

<p><a href="https://www.libribooks.com/author/josh-kaufman">Josh Kaufman</a>'s <a href="https://www.libribooks.com/book/the-personal-mba">The Personal MBA</a> makes a powerful case that you can learn the essentials of business — value creation, marketing, sales, finance, negotiation, systems thinking — without a graduate degree. The book's most important concept: <strong>every successful business creates value, delivers it to people who want it, and does so at a price that exceeds the cost of production.</strong> Everything else is in service of this fundamental cycle.</p>

<h2>Timeless Lessons From Business History</h2>

<p><a href="https://www.libribooks.com/author/john-brooks">John Brooks</a>'s <a href="https://www.libribooks.com/book/business-adventures">Business Adventures</a> — Bill Gates's all-time favourite business book — collects twelve stories of 20th-century corporate triumph and failure. What makes it remarkable is how timeless the human dynamics are. The Ford Edsel disaster wasn't caused by bad engineering — it was caused by groupthink, market misjudgment, and executive hubris. All three remain as common today as they were in 1957.</p>

<h2>Your Entrepreneurship Action Plan</h2>

<ol>
<li><strong>Challenge yourself with Thiel's contrarian question:</strong> What valuable company is nobody building?</li>
<li><strong>Find your Hedgehog Concept before scaling:</strong> What are you best at, passionate about, and can generate revenue from?</li>
<li><strong>Read Shoe Dog for emotional preparation:</strong> Entrepreneurship is far harder — and more meaningful — than it looks</li>
<li><strong>Build your foundation with The Personal MBA:</strong> Learn the fundamentals before spending any money</li>
</ol>

<p>The world needs more people who build things that solve genuine problems. These books won't guarantee success — nothing can. But they'll make you vastly better prepared for the journey.</p>

<p>Explore our complete <a href="https://www.libribooks.com/skills/business">Business skill guide</a> for more reading recommendations.</p>`
  };

  const { data, error } = await supabase
    .from('articles')
    .insert(article)
    .select('slug')
    .single();

  if (error) {
    console.log(`✗ Error: ${error.message}`);
  } else {
    console.log(`✓ Created: ${data.slug}`);
    console.log('\n✅ All 10 articles are now complete!');
  }
}

main().catch(console.error);
