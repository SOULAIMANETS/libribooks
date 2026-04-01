import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabase = createClient(
  'https://klwexowmvxurphajwlyk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsd2V4b3dtdnh1cnBoYWp3bHlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzU1OTEwNywiZXhwIjoyMDgzMTM1MTA3fQ.NQ5sCmYzT41uf-fnMDOQeLYIcMO4CBVZx3inGW-K_pw'
);

const COVER_DIR = 'C:\\Users\\ACER\\Desktop\\Cover Image he Skills';

async function uploadCover(filename: string): Promise<string> {
  const filePath = path.join(COVER_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠ Cover not found: ${filename}`);
    return '';
  }
  const fileBuffer = fs.readFileSync(filePath);
  const storagePath = `skills/${filename}`;
  
  const { error } = await supabase.storage
    .from('libribooks')
    .upload(storagePath, fileBuffer, { contentType: 'image/webp', upsert: true });
  
  if (error) {
    console.log(`  ⚠ Upload error for ${filename}: ${error.message}`);
    return '';
  }
  
  const { data } = supabase.storage.from('libribooks').getPublicUrl(storagePath);
  console.log(`  ✓ Uploaded: ${filename}`);
  return data.publicUrl;
}

const skills = [
  {
    name: 'Productivity',
    slug: 'productivity',
    icon: '⚡',
    coverFile: 'productivity.webp',
    description: 'Master the art of getting more done in less time. Learn proven systems and frameworks from the world\'s top productivity experts to eliminate distractions, build powerful habits, and achieve your most important goals.',
    pillarContent: `<h2>What Is Productivity — And Why Does It Matter?</h2>
<p>Productivity is not about doing more things — it's about doing the <strong>right things</strong>, with less wasted effort. In a world flooded with distractions, notifications, and endless to-do lists, the ability to focus on what truly matters is a superpower.</p>
<p>The most successful people in the world are not necessarily the hardest workers. They are the smartest workers — people who have learned to channel their energy into high-impact tasks while ruthlessly eliminating everything else.</p>

<h2>The Foundations of True Productivity</h2>
<p>Before diving into tactics, it's essential to understand that real productivity starts with <strong>clarity</strong>. If you don't know what your priorities are, no amount of time management will save you.</p>
<p><a href="https://www.libribooks.com/author/greg-mckeown">Greg McKeown</a>, in his transformative book <a href="https://www.libribooks.com/book/essentialism">Essentialism</a>, makes a compelling argument: "If you don't prioritize your life, someone else will." The essentialist mindset is about deliberately choosing where to invest your time and energy — and having the courage to say no to everything else.</p>
<p>This principle is echoed by <a href="https://www.libribooks.com/author/brian-tracy">Brian Tracy</a> in <a href="https://www.libribooks.com/book/eat-that-frog">Eat That Frog!</a>, where he teaches us to tackle our most important (and often most dreaded) task first thing in the morning. When you "eat the frog" early, you build momentum that carries through the rest of your day.</p>

<h2>Building Habits That Stick</h2>
<p>Productivity is not a one-time achievement — it's a daily practice built on habits. <a href="https://www.libribooks.com/author/james-clear">James Clear</a>'s masterpiece <a href="https://www.libribooks.com/book/atomic-habits">Atomic Habits</a> reveals that small, consistent improvements of just 1% each day compound into remarkable results over time.</p>
<p>Clear introduces the four laws of behavior change: make it obvious, make it attractive, make it easy, and make it satisfying. By designing your environment and routines around these principles, you can build habits that run on autopilot — freeing your mental energy for creative and strategic thinking.</p>
<p>The key insight? <strong>You do not rise to the level of your goals — you fall to the level of your systems.</strong> Focus on building better systems, and the results will follow.</p>

<h2>The Power of Deep Work</h2>
<p>In our hyperconnected world, the ability to focus without distraction is becoming increasingly rare — and increasingly valuable. <a href="https://www.libribooks.com/author/cal-newport">Cal Newport</a>'s groundbreaking book <a href="https://www.libribooks.com/book/deep-work">Deep Work</a> argues that "the ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy."</p>
<p>Newport distinguishes between <strong>deep work</strong> (cognitively demanding tasks performed in a state of distraction-free concentration) and <strong>shallow work</strong> (logistical tasks that can be performed while distracted). The most productive people design their days to maximize deep work sessions, often batching shallow tasks into specific time blocks.</p>
<p>Practical strategies from Deep Work include:</p>
<ul>
<li><strong>Time blocking</strong> — Schedule every minute of your day in advance</li>
<li><strong>Ritual design</strong> — Create a pre-work ritual that signals your brain it's time to focus</li>
<li><strong>Digital minimalism</strong> — Reduce your dependence on social media and constant connectivity</li>
<li><strong>Productive meditation</strong> — Use physical activity time to think deeply about a specific problem</li>
</ul>

<h2>The Art of Strategic Laziness</h2>
<p>Surprisingly, one of the most powerful productivity lessons comes from understanding when <em>not</em> to work. <a href="https://www.libribooks.com/author/library-mindset">Library Mindset</a>'s <a href="https://www.libribooks.com/book/the-art-of-laziness">The Art of Laziness</a> challenges the "hustle culture" narrative by showing that strategic rest, deliberate downtime, and knowing when to step back are essential components of sustained high performance.</p>
<p>The most productive people are not machines — they are strategic about their energy management. They know that creativity and problem-solving often happen during rest, not during intense work sessions.</p>

<h2>Putting It All Together: Your Productivity Framework</h2>
<p>Here is a practical framework combining the best insights from our curated productivity library:</p>
<ol>
<li><strong>Start with clarity</strong> — Define your 3-5 most important goals (Essentialism)</li>
<li><strong>Eat the frog</strong> — Tackle the hardest task first each morning (Eat That Frog!)</li>
<li><strong>Build atomic habits</strong> — Design small daily routines that compound over time (Atomic Habits)</li>
<li><strong>Protect deep work time</strong> — Block 2-4 hours daily for distraction-free focus (Deep Work)</li>
<li><strong>Rest strategically</strong> — Schedule deliberate downtime to recharge (The Art of Laziness)</li>
</ol>

<h2>Recommended Reading Order</h2>
<p>If you're new to productivity, we recommend starting with <a href="https://www.libribooks.com/book/atomic-habits">Atomic Habits</a> for building your foundation, then moving to <a href="https://www.libribooks.com/book/deep-work">Deep Work</a> for mastering focus, <a href="https://www.libribooks.com/book/eat-that-frog">Eat That Frog!</a> for daily execution, <a href="https://www.libribooks.com/book/essentialism">Essentialism</a> for strategic thinking, and finally <a href="https://www.libribooks.com/book/the-art-of-laziness">The Art of Laziness</a> for sustainable performance.</p>`
  },
  {
    name: 'Creativity',
    slug: 'creativity',
    icon: '🎨',
    coverFile: 'creativity.webp',
    description: 'Unleash your creative potential and overcome the blocks that hold you back. Discover how the world\'s most innovative minds think, create, and bring their ideas to life.',
    pillarContent: `<h2>What Is Creativity — And Can It Be Learned?</h2>
<p>Creativity is not a gift reserved for a lucky few. It is a <strong>skill</strong> — one that can be developed, practiced, and refined. Whether you're a writer, entrepreneur, designer, or simply someone who wants to think more originally, understanding the creative process is one of the most valuable investments you can make.</p>
<p>The books in our Creativity collection shatter the myth of the "lone genius" and reveal that great creative work is built on discipline, curiosity, and the willingness to show up every day — even when inspiration feels miles away.</p>

<h2>Stealing Like an Artist</h2>
<p><a href="https://www.libribooks.com/author/austin-kleon">Austin Kleon</a>'s <a href="https://www.libribooks.com/book/steal-like-an-artist-10-things-nobody-told-you-about-being-creative">Steal Like an Artist</a> opens with a radical premise: nothing is truly original. Every new idea is built on the foundation of what came before. The key is to <strong>curate your influences</strong> wisely, remix them with your unique perspective, and create something that only you could make.</p>
<p>Kleon also authored <a href="https://www.libribooks.com/book/show-your-work">Show Your Work!</a>, which argues that sharing your creative process — not just the finished product — is the most effective way to build an audience and find your creative community.</p>

<h2>Fighting the Resistance</h2>
<p>Every creative person faces an invisible enemy: Resistance. <a href="https://www.libribooks.com/author/steven-pressfield">Steven Pressfield</a>, in <a href="https://www.libribooks.com/book/the-war-of-art-break-through-the-blocks-and-win-your-inner-creative-battles">The War of Art</a>, personifies this force and shows us how to defeat it. Resistance manifests as procrastination, self-doubt, perfectionism, and fear — and it grows stronger the closer we are to doing important work.</p>
<p>The antidote? <strong>Turning pro.</strong> Pressfield distinguishes between amateurs (who wait for inspiration) and professionals (who show up every day, regardless of how they feel). The professional treats creative work as a non-negotiable discipline.</p>

<h2>Building Creative Organizations</h2>
<p><a href="https://www.libribooks.com/author/ed-catmull">Ed Catmull</a>, co-founder of Pixar, offers a masterclass in fostering creativity within teams in <a href="https://www.libribooks.com/book/creativity-inc">Creativity, Inc.</a> His central insight is that <strong>every great film starts as an ugly baby</strong> — initial ideas are always messy, and the creative process is about nurturing those ideas through honest feedback and iterative improvement.</p>

<h2>The Spiritual Path to Creativity</h2>
<p><a href="https://www.libribooks.com/author/julia-cameron">Julia Cameron</a>'s <a href="https://www.libribooks.com/book/the-artists-way-a-spiritual-path-to-higher-creativity">The Artist's Way</a> is a 12-week program designed to recover your creative self. Her signature tools — Morning Pages (three pages of stream-of-consciousness writing each morning) and Artist Dates (solo adventures to fill your creative well) — have helped millions of people unlock creativity they didn't know they had.</p>

<h2>Your Creative Toolkit</h2>
<ol>
<li><strong>Collect influences broadly</strong> — Read widely, watch curiously, listen deeply (Steal Like an Artist)</li>
<li><strong>Show up daily</strong> — Treat creativity as a practice, not a mood (The War of Art)</li>
<li><strong>Embrace ugly beginnings</strong> — Give yourself permission to create badly at first (Creativity, Inc.)</li>
<li><strong>Write morning pages</strong> — Clear your mind each morning with 3 pages of freewriting (The Artist's Way)</li>
<li><strong>Share your process</strong> — Let people see your work-in-progress (Show Your Work!)</li>
</ol>

<h2>Recommended Reading Order</h2>
<p>Begin with <a href="https://www.libribooks.com/book/steal-like-an-artist-10-things-nobody-told-you-about-being-creative">Steal Like an Artist</a> for a quick creative mindset shift, then dive into <a href="https://www.libribooks.com/book/the-war-of-art-break-through-the-blocks-and-win-your-inner-creative-battles">The War of Art</a> to combat creative resistance, follow with <a href="https://www.libribooks.com/book/the-artists-way-a-spiritual-path-to-higher-creativity">The Artist's Way</a> for deep inner work, and finish with <a href="https://www.libribooks.com/book/creativity-inc">Creativity, Inc.</a> to learn how creativity scales within teams.</p>`
  },
  {
    name: 'Critical Thinking',
    slug: 'critical-thinking',
    icon: '🧠',
    coverFile: 'critical_thinking.webp',
    description: 'Sharpen your mind and learn to think more clearly in a world full of noise. Develop the mental models and frameworks that separate great thinkers from everyone else.',
    pillarContent: `<h2>Why Critical Thinking Is the Skill of the Century</h2>
<p>We live in an era of information overload. Every day, we are bombarded with opinions, data, headlines, and advice — much of it contradictory. The ability to <strong>think critically</strong> — to evaluate evidence, question assumptions, and make sound judgments — has never been more important.</p>
<p>Critical thinking is not about being cynical or contrarian. It's about developing the intellectual tools to see the world more clearly, make better decisions, and avoid the cognitive traps that lead to poor outcomes.</p>

<h2>Recognizing Your Cognitive Biases</h2>
<p><a href="https://www.libribooks.com/author/rolf-dobelli">Rolf Dobelli</a>'s <a href="https://www.libribooks.com/book/the-art-of-thinking-clearly">The Art of Thinking Clearly</a> catalogs the most common cognitive biases that distort our thinking — from confirmation bias to the sunk cost fallacy, survivorship bias to the halo effect. By learning to recognize these mental traps, you can begin to think more clearly and make better decisions in every area of your life.</p>

<h2>The Power of Rethinking</h2>
<p><a href="https://www.libribooks.com/author/adam-grant">Adam Grant</a>'s <a href="https://www.libribooks.com/book/think-again-the-power-of-knowing-what-you-dont-know">Think Again</a> challenges us to embrace the joy of being wrong. Grant argues that in a rapidly changing world, the most important cognitive skill is the ability to <strong>rethink and unlearn</strong>. The best thinkers don't just seek information that confirms what they already believe — they actively look for reasons they might be wrong.</p>
<p>Grant introduces the concept of "thinking like a scientist" — approaching your own opinions with the same rigor and skepticism you would apply to testing a hypothesis.</p>

<h2>Clear Thinking in Everyday Moments</h2>
<p><a href="https://www.libribooks.com/author/shane-parrish">Shane Parrish</a>, founder of Farnam Street, wrote <a href="https://www.libribooks.com/book/clear-thinking-turning-ordinary-moments-into-extraordinary-results">Clear Thinking</a> to help us make better decisions in the ordinary moments that shape our lives. His key insight is that <strong>the quality of your thinking determines the quality of your life</strong>. Most of our bad decisions happen not in high-stakes moments, but in the small, seemingly insignificant moments when we operate on autopilot.</p>

<h2>Understanding Randomness and Probability</h2>
<p><a href="https://www.libribooks.com/author/nassim-nicholas-taleb">Nassim Nicholas Taleb</a>'s <a href="https://www.libribooks.com/book/fooled-by-randomness-the-hidden-role-of-chance-in-life-and-in-the-markets">Fooled by Randomness</a> explores how we consistently underestimate the role of chance and luck in our lives. We create narratives to explain random events, confuse correlation with causation, and attribute success to skill when it may simply be luck. Understanding this is fundamental to clearer thinking.</p>

<h2>Asking Better Questions</h2>
<p><a href="https://www.libribooks.com/author/m-neil-browne-and-stuart-m-keeley">M. Neil Browne and Stuart M. Keeley</a>'s <a href="https://www.libribooks.com/book/asking-the-right-questions-a-guide-to-critical-thinking">Asking the Right Questions</a> provides a systematic framework for evaluating arguments, identifying logical fallacies, and asking the questions that reveal the truth behind any claim.</p>

<h2>Your Critical Thinking Framework</h2>
<ol>
<li><strong>Learn your biases</strong> — Know the cognitive traps before they trap you (The Art of Thinking Clearly)</li>
<li><strong>Think like a scientist</strong> — Test your beliefs instead of defending them (Think Again)</li>
<li><strong>Slow down decisions</strong> — Pause in ordinary moments to think deliberately (Clear Thinking)</li>
<li><strong>Respect randomness</strong> — Acknowledge the role of chance before attributing causation (Fooled by Randomness)</li>
<li><strong>Ask better questions</strong> — Develop a systematic approach to evaluating claims (Asking the Right Questions)</li>
</ol>

<h2>Recommended Reading Order</h2>
<p>Start with <a href="https://www.libribooks.com/book/the-art-of-thinking-clearly">The Art of Thinking Clearly</a> for a comprehensive overview of cognitive biases, then read <a href="https://www.libribooks.com/book/think-again-the-power-of-knowing-what-you-dont-know">Think Again</a> to build intellectual humility, follow with <a href="https://www.libribooks.com/book/clear-thinking-turning-ordinary-moments-into-extraordinary-results">Clear Thinking</a> for practical daily application, and explore <a href="https://www.libribooks.com/book/fooled-by-randomness-the-hidden-role-of-chance-in-life-and-in-the-markets">Fooled by Randomness</a> for advanced probabilistic thinking.</p>`
  },
  {
    name: 'Discipline',
    slug: 'discipline',
    icon: '🔥',
    coverFile: 'discipline.webp',
    description: 'Build the mental toughness and self-control that separate dreamers from achievers. Learn from military leaders, Stoic philosophers, and high performers who\'ve mastered the art of discipline.',
    pillarContent: `<h2>Discipline Is the Bridge Between Goals and Accomplishment</h2>
<p>Everyone has goals. Very few have discipline. The difference between the life you're living and the life you want is often a single word: <strong>discipline</strong>. Not motivation, not inspiration, not talent — discipline.</p>
<p>The books in our Discipline collection come from some of the world's most demanding environments — Navy SEAL training, Stoic philosophy, and the crucible of extreme personal challenge. Their lessons are universal: discipline is not a punishment, it's a path to freedom.</p>

<h2>Extreme Ownership: Leading Yourself First</h2>
<p><a href="https://www.libribooks.com/author/jocko-willink-and-leif-babin">Jocko Willink and Leif Babin</a>, former Navy SEAL commanders, wrote <a href="https://www.libribooks.com/book/extreme-ownership-how-us-navy-seals-lead-and-win">Extreme Ownership</a> to share the leadership principles they forged in combat. The core message is devastatingly simple: <strong>there are no bad teams, only bad leaders</strong>. When you take complete ownership of everything in your life — no excuses, no blame — you reclaim the power to change it.</p>

<h2>Discipline Is Destiny</h2>
<p><a href="https://www.libribooks.com/author/ryan-holiday">Ryan Holiday</a>'s <a href="https://www.libribooks.com/book/discipline-is-destiny-the-power-of-self-control">Discipline Is Destiny</a> draws on the ancient Stoic virtue of temperance to show that self-control is the master virtue — the one that makes all other virtues possible. Through stories of historical figures from Queen Elizabeth II to Lou Gehrig, Holiday demonstrates that greatness is built not on talent, but on the daily practice of doing what must be done, whether you feel like it or not.</p>

<h2>Make Your Bed, Change Your Life</h2>
<p><a href="https://www.libribooks.com/author/admiral-william-h-mcraven">Admiral William H. McRaven</a>'s <a href="https://www.libribooks.com/book/make-your-bed-little-things-that-can-change-your-lifeand-maybe-the-world">Make Your Bed</a> distills the wisdom of Navy SEAL training into ten simple yet powerful principles. The first lesson? <strong>Start every day by making your bed.</strong> It's a small act of discipline that creates a chain reaction of accomplishment throughout the day.</p>

<h2>Defying the Odds Through Mental Toughness</h2>
<p><a href="https://www.libribooks.com/author/david-goggins">David Goggins</a>, in <a href="https://www.libribooks.com/book/master-your-mind-and-defy-the-odds">Master Your Mind and Defy the Odds</a>, shares his extraordinary journey from a traumatic childhood to becoming one of the world's toughest endurance athletes. His philosophy of the "40% Rule" — that when your mind tells you you're done, you're really only 40% done — has inspired millions to push past their perceived limits.</p>

<h2>The Driven Mindset</h2>
<p><a href="https://www.libribooks.com/author/robert-herjavec">Robert Herjavec</a>'s <a href="https://www.libribooks.com/book/driven-how-to-succeed-in-business-and-in-life">Driven</a> shows that discipline in business and life comes from having an unwavering sense of purpose. Herjavec's journey from immigrant to billionaire entrepreneur demonstrates that when you combine relentless work ethic with a clear vision, the results can be extraordinary.</p>

<h2>Your Discipline Framework</h2>
<ol>
<li><strong>Take extreme ownership</strong> — Stop blaming circumstances and take full responsibility (Extreme Ownership)</li>
<li><strong>Practice temperance daily</strong> — Build self-control as your master virtue (Discipline Is Destiny)</li>
<li><strong>Start small each morning</strong> — Make your bed and build momentum from there (Make Your Bed)</li>
<li><strong>Push past the 40% mark</strong> — When you want to quit, know you have more to give (Master Your Mind)</li>
<li><strong>Stay driven by purpose</strong> — Connect daily discipline to a larger mission (Driven)</li>
</ol>

<h2>Recommended Reading Order</h2>
<p>Start with <a href="https://www.libribooks.com/book/make-your-bed-little-things-that-can-change-your-lifeand-maybe-the-world">Make Your Bed</a> for accessible, actionable wisdom, then read <a href="https://www.libribooks.com/book/extreme-ownership-how-us-navy-seals-lead-and-win">Extreme Ownership</a> for a deep dive into personal accountability, follow with <a href="https://www.libribooks.com/book/discipline-is-destiny-the-power-of-self-control">Discipline Is Destiny</a> for philosophical depth, and challenge yourself with <a href="https://www.libribooks.com/book/master-your-mind-and-defy-the-odds">Master Your Mind and Defy the Odds</a> for next-level mental toughness.</p>`
  },
  {
    name: 'Human Behavior',
    slug: 'human-behavior',
    icon: '🔍',
    coverFile: 'human_behavior.webp',
    description: 'Decode the hidden forces that drive human actions, decisions, and relationships. Understand the psychology of power, persuasion, and irrational behavior that shapes the world around you.',
    pillarContent: `<h2>Understanding Why People Do What They Do</h2>
<p>Why do people make irrational choices? Why do some individuals hold power over others? What hidden forces drive our behavior — often without our conscious awareness? Understanding human behavior is one of the most valuable skills you can develop, because <strong>every area of life</strong> — from business to relationships to personal growth — depends on how well you understand people.</p>

<h2>The Laws That Govern Human Nature</h2>
<p><a href="https://www.libribooks.com/author/robert-greene">Robert Greene</a>'s <a href="https://www.libribooks.com/book/the-laws-of-human-nature">The Laws of Human Nature</a> is perhaps the most comprehensive guide to understanding why people behave the way they do. Greene identifies 18 laws of human nature — from the Law of Irrationality to the Law of Narcissism to the Law of Generational Myopia — each one illuminating a fundamental aspect of human psychology that most people never consciously recognize.</p>
<p>Greene also authored <a href="https://www.libribooks.com/book/the-48-laws-of-power">The 48 Laws of Power</a>, a controversial but deeply insightful study of how power operates throughout history. Understanding these dynamics — whether or not you choose to use them — gives you a clearer lens through which to view human interactions.</p>

<h2>Predictably Irrational: The Hidden Forces Behind Our Decisions</h2>
<p><a href="https://www.libribooks.com/author/dan-ariely">Dan Ariely</a>'s <a href="https://www.libribooks.com/book/predictably-irrational">Predictably Irrational</a> reveals through rigorous experiments that humans are not the rational decision-makers we think we are. We consistently overpay for things labeled "free," make different choices depending on irrelevant context, and let emotions override logic in predictable patterns. The good news? Once you understand these patterns, you can begin to work with them rather than against them.</p>

<h2>The Subtle Art of Letting Go</h2>
<p><a href="https://www.libribooks.com/author/mark-manson">Mark Manson</a>'s <a href="https://www.libribooks.com/book/the-subtle-art-of-not-giving-a-fck">The Subtle Art of Not Giving a F*ck</a> takes a refreshingly honest look at the human tendency to care about too many things. Manson argues that happiness comes not from avoiding problems, but from finding <strong>better problems</strong> to solve. His counterintuitive approach to self-improvement has resonated with millions precisely because it acknowledges that humans are flawed, anxious, and imperfect — and that's okay.</p>

<h2>Your Human Behavior Framework</h2>
<ol>
<li><strong>Study the laws</strong> — Learn the patterns that govern human nature across time and culture (The Laws of Human Nature)</li>
<li><strong>Understand power dynamics</strong> — Recognize how influence and authority actually work (The 48 Laws of Power)</li>
<li><strong>Embrace irrationality</strong> — Accept that humans are predictably irrational and plan accordingly (Predictably Irrational)</li>
<li><strong>Choose your battles</strong> — Be selective about what you invest emotional energy in (The Subtle Art)</li>
</ol>

<h2>Recommended Reading Order</h2>
<p>Start with <a href="https://www.libribooks.com/book/the-subtle-art-of-not-giving-a-fck">The Subtle Art of Not Giving a F*ck</a> for an accessible entry point, then read <a href="https://www.libribooks.com/book/predictably-irrational">Predictably Irrational</a> for the science behind our behavior, follow with <a href="https://www.libribooks.com/book/the-laws-of-human-nature">The Laws of Human Nature</a> for deep psychological insight, and finish with <a href="https://www.libribooks.com/book/the-48-laws-of-power">The 48 Laws of Power</a> for understanding power dynamics.</p>`
  },
  {
    name: 'Personal Finance',
    slug: 'personal-finance',
    icon: '💰',
    coverFile: 'personal_finance.webp',
    description: 'Take control of your financial future with timeless principles from the world\'s greatest money minds. Learn how to build wealth, manage risk, and achieve lasting financial freedom.',
    pillarContent: `<h2>Money Is a Tool — Learn How to Wield It</h2>
<p>Financial literacy is not taught in most schools, yet it affects every aspect of our lives. The difference between financial stress and financial freedom often comes down to a few fundamental principles — principles that the books in our collection have distilled into clear, actionable guidance.</p>

<h2>The Psychology Behind Our Financial Decisions</h2>
<p><a href="https://www.libribooks.com/author/morgan-housel">Morgan Housel</a>'s <a href="https://www.libribooks.com/book/the-psychology-of-money">The Psychology of Money</a> is not a book about spreadsheets or stock tips — it's a book about <strong>behavior</strong>. Housel reveals that financial success has less to do with intelligence and more to do with behavior. His most powerful insight: "Doing well with money has a little to do with how smart you are and a lot to do with how you behave."</p>

<h2>Rich Dad's Paradigm Shift</h2>
<p><a href="https://www.libribooks.com/author/robert-kiyosaki">Robert Kiyosaki</a>'s <a href="https://www.libribooks.com/book/rich-dad-poor-dad">Rich Dad Poor Dad</a> challenged an entire generation to rethink the relationship between working hard and building wealth. The central lesson — that the rich buy assets while the poor accumulate liabilities — is simple but transformative. Kiyosaki's framework for understanding the difference between assets (things that put money in your pocket) and liabilities (things that take money out) remains one of the most important mental models in personal finance.</p>

<h2>Timeless Wisdom from Ancient Babylon</h2>
<p><a href="https://www.libribooks.com/author/george-s-clason">George S. Clason</a>'s <a href="https://www.libribooks.com/book/the-richest-man-in-babylon">The Richest Man in Babylon</a>, written in 1926, proves that the fundamentals of wealth-building have not changed in thousands of years. The book's parables teach timeless principles: pay yourself first, live below your means, and make your money work for you.</p>

<h2>The Total Money Makeover</h2>
<p><a href="https://www.libribooks.com/author/dave-ramsey">Dave Ramsey</a>'s <a href="https://www.libribooks.com/book/the-total-money-makeover">The Total Money Makeover</a> provides a step-by-step plan for getting out of debt and building wealth. His "Baby Steps" system — from saving a $1,000 emergency fund to paying off all debt using the "debt snowball" method — has helped millions of people take control of their finances.</p>

<h2>The Fastlane to Wealth</h2>
<p><a href="https://www.libribooks.com/author/mj-demarco">MJ DeMarco</a>'s <a href="https://www.libribooks.com/book/the-millionaire-fastlane">The Millionaire Fastlane</a> challenges the conventional "save and invest for 40 years" approach. DeMarco argues that true financial freedom comes from building scalable business systems that generate income independent of your time. It's a bold counterpoint to traditional financial advice — and a valuable perspective for entrepreneurially-minded readers.</p>

<h2>Your Financial Freedom Framework</h2>
<ol>
<li><strong>Fix your money psychology</strong> — Understand the behavioral traps that sabotage financial success (The Psychology of Money)</li>
<li><strong>Learn the asset vs. liability distinction</strong> — Focus on acquiring income-producing assets (Rich Dad Poor Dad)</li>
<li><strong>Follow the ancient principles</strong> — Pay yourself first and live below your means (The Richest Man in Babylon)</li>
<li><strong>Execute a proven plan</strong> — Use the Baby Steps to eliminate debt and build wealth (The Total Money Makeover)</li>
<li><strong>Think entrepreneurially</strong> — Consider building scalable systems for accelerated wealth (The Millionaire Fastlane)</li>
</ol>

<h2>Recommended Reading Order</h2>
<p>Start with <a href="https://www.libribooks.com/book/the-psychology-of-money">The Psychology of Money</a> for the right mindset, then read <a href="https://www.libribooks.com/book/rich-dad-poor-dad">Rich Dad Poor Dad</a> for foundational financial thinking, follow with <a href="https://www.libribooks.com/book/the-richest-man-in-babylon">The Richest Man in Babylon</a> for timeless principles, and explore <a href="https://www.libribooks.com/book/the-total-money-makeover">The Total Money Makeover</a> for a practical action plan.</p>`
  },
  {
    name: 'Relationship',
    slug: 'relationship',
    icon: '❤️',
    coverFile: 'relationship.webp',
    description: 'Build deeper, more meaningful connections with the people who matter most. Understand the science of love, attachment, and communication that creates lasting bonds.',
    pillarContent: `<h2>The Science and Art of Human Connection</h2>
<p>Relationships are the single greatest predictor of happiness and well-being — yet most of us never formally learn how to build and maintain them. The books in our Relationship collection blend cutting-edge psychology with timeless wisdom to help you understand the dynamics of love, attachment, and connection.</p>

<h2>Understanding Your Attachment Style</h2>
<p><a href="https://www.libribooks.com/author/amir-levine">Amir Levine</a>'s <a href="https://www.libribooks.com/book/attached">Attached</a> introduces the science of adult attachment theory — one of the most powerful frameworks for understanding why you behave the way you do in relationships. According to attachment theory, most people fall into one of three attachment styles: <strong>Secure</strong>, <strong>Anxious</strong>, or <strong>Avoidant</strong>. Understanding your own style — and your partner's — can transform your relationships overnight.</p>

<h2>Speaking Each Other's Love Language</h2>
<p><a href="https://www.libribooks.com/author/gary-chapman-phd">Gary Chapman, Ph.D</a>'s <a href="https://www.libribooks.com/book/the-5-love-languages">The 5 Love Languages</a> reveals that people give and receive love in five distinct ways: Words of Affirmation, Acts of Service, Receiving Gifts, Quality Time, and Physical Touch. The reason so many relationships feel disconnected — even when both partners genuinely love each other — is that they're speaking <strong>different love languages</strong>.</p>

<h2>Modern Dating with Intention</h2>
<p><a href="https://www.libribooks.com/author/logan-ury">Logan Ury</a>'s <a href="https://www.libribooks.com/book/how-to-not-die-alone">How to Not Die Alone</a> combines behavioral science with practical dating advice. Ury identifies three common "dating tendencies" — the Romanticizer, the Maximizer, and the Hesitater — and shows how each one can sabotage your love life in predictable ways. Her data-driven approach to finding and keeping love is refreshingly practical.</p>

<h2>Bridging the Gender Communication Gap</h2>
<p><a href="https://www.libribooks.com/author/john-gray-phd">John Gray, Ph.D</a>'s <a href="https://www.libribooks.com/book/men-are-from-mars-women-are-from-venus">Men Are from Mars, Women Are from Venus</a> explores the fundamental differences in how men and women communicate, process emotions, and express needs. While the book's framework is deliberately simplified, its core message — that <strong>understanding differences is the path to harmony</strong> — remains profoundly relevant.</p>

<h2>Your Relationship Framework</h2>
<ol>
<li><strong>Know your attachment style</strong> — Understand the hidden patterns driving your relationship behavior (Attached)</li>
<li><strong>Learn your love language</strong> — Discover how you and your partner give and receive love differently (The 5 Love Languages)</li>
<li><strong>Date with intention</strong> — Use behavioral science to make smarter romantic choices (How to Not Die Alone)</li>
<li><strong>Bridge communication gaps</strong> — Understand and respect different communication styles (Men Are from Mars)</li>
</ol>

<h2>Recommended Reading Order</h2>
<p>Begin with <a href="https://www.libribooks.com/book/attached">Attached</a> to understand your attachment style, then read <a href="https://www.libribooks.com/book/the-5-love-languages">The 5 Love Languages</a> to improve communication, follow with <a href="https://www.libribooks.com/book/how-to-not-die-alone">How to Not Die Alone</a> for data-driven relationship advice, and explore <a href="https://www.libribooks.com/book/men-are-from-mars-women-are-from-venus">Men Are from Mars, Women Are from Venus</a> for deeper insight into communication dynamics.</p>`
  },
  {
    name: 'Self Help',
    slug: 'self-help',
    icon: '🌟',
    coverFile: 'self_help.webp',
    description: 'Embark on a journey of personal transformation and self-discovery. Find your purpose, cultivate a growth mindset, and design a life that brings genuine fulfillment and happiness.',
    pillarContent: `<h2>The Journey Inward: Becoming Your Best Self</h2>
<p>Self-help, at its best, is not about quick fixes or empty positivity — it's about the deeply human quest to understand yourself, find meaning, and live with greater intention. The books in our collection represent some of the most thoughtful, research-backed, and genuinely life-changing works in this space.</p>

<h2>Finding Your Ikigai: The Japanese Secret to Purpose</h2>
<p><a href="https://www.libribooks.com/author/hctor-garca">Héctor García</a>'s <a href="https://www.libribooks.com/book/ikigai">Ikigai</a> introduces the Japanese concept of ikigai — your "reason for being." The book draws on research from the communities with the highest life expectancy in the world to reveal that having a clear sense of purpose is not just philosophically satisfying — it's literally life-extending. The sweet spot of ikigai lies at the intersection of what you love, what you're good at, what the world needs, and what you can be paid for.</p>

<h2>The Growth Mindset Revolution</h2>
<p><a href="https://www.libribooks.com/author/carol-s-dweck">Carol S. Dweck</a>'s <a href="https://www.libribooks.com/book/mindset-the-new-psychology-of-success">Mindset</a> introduced the world to one of the most important psychological frameworks of recent decades: the distinction between a <strong>fixed mindset</strong> (believing your abilities are set in stone) and a <strong>growth mindset</strong> (believing your abilities can be developed through dedication and hard work). This single shift in perspective can transform how you approach challenges, setbacks, and learning.</p>

<h2>The Monk's Wisdom for Modern Life</h2>
<p><a href="https://www.libribooks.com/author/robin-sharma">Robin Sharma</a>'s <a href="https://www.libribooks.com/book/the-monk-who-sold-his-ferrari">The Monk Who Sold His Ferrari</a> is a fable about a high-powered lawyer who gives up his successful career to seek enlightenment in the Himalayas. Through this narrative, Sharma delivers practical wisdom about time management, positive thinking, and the importance of living according to your values rather than society's expectations.</p>

<h2>Self-Love as the Foundation</h2>
<p><a href="https://www.libribooks.com/author/vex-king">Vex King</a>'s <a href="https://www.libribooks.com/book/good-vibes-good-life-how-self-love-is-the-key-to-unlocking-your-greatness">Good Vibes, Good Life</a> argues that <strong>self-love is the key to unlocking your greatness</strong>. King shares his personal journey from adversity to empowerment, offering practical advice on how to change your mindset, overcome negativity, and create a life aligned with your deepest values.</p>

<h2>The Danish Art of Happiness</h2>
<p><a href="https://www.libribooks.com/author/meik-wiking">Meik Wiking</a>'s <a href="https://www.libribooks.com/book/the-little-book-of-hygge-danish-secrets-to-happy-living">The Little Book of Hygge</a> reveals the Danish secret to being the happiest people in the world. Hygge (pronounced "hoo-ga") is the warm, cozy feeling of being content in simple moments — a candlelit dinner, a warm cup of tea, or quality time with loved ones. It's a reminder that happiness is often found not in grand achievements, but in the everyday moments we choose to savor.</p>

<h2>Your Self-Discovery Framework</h2>
<ol>
<li><strong>Find your ikigai</strong> — Discover the intersection of passion, skill, need, and reward (Ikigai)</li>
<li><strong>Adopt a growth mindset</strong> — Believe in your ability to develop and improve (Mindset)</li>
<li><strong>Live by your values</strong> — Align daily actions with what truly matters to you (The Monk Who Sold His Ferrari)</li>
<li><strong>Practice self-love</strong> — Build a strong inner foundation before seeking external validation (Good Vibes, Good Life)</li>
<li><strong>Embrace hygge</strong> — Find joy and contentment in simple, everyday moments (The Little Book of Hygge)</li>
</ol>

<h2>Recommended Reading Order</h2>
<p>Start with <a href="https://www.libribooks.com/book/ikigai">Ikigai</a> to find your purpose, then read <a href="https://www.libribooks.com/book/mindset-the-new-psychology-of-success">Mindset</a> to unlock your potential, follow with <a href="https://www.libribooks.com/book/good-vibes-good-life-how-self-love-is-the-key-to-unlocking-your-greatness">Good Vibes, Good Life</a> for inner strength, explore <a href="https://www.libribooks.com/book/the-monk-who-sold-his-ferrari">The Monk Who Sold His Ferrari</a> for holistic wisdom, and enjoy <a href="https://www.libribooks.com/book/the-little-book-of-hygge-danish-secrets-to-happy-living">The Little Book of Hygge</a> for the art of contentment.</p>`
  },
  {
    name: 'Business',
    slug: 'business',
    icon: '💼',
    coverFile: '',
    description: 'Learn the strategies, mindsets, and frameworks that built the world\'s most successful companies. From startup founders to corporate leaders, discover what it takes to build something great.',
    pillarContent: `<h2>Building Something That Matters</h2>
<p>Business is not just about making money — it's about creating value, solving problems, and building something that endures. The books in our Business collection offer lessons from some of the most successful entrepreneurs and business thinkers of our time.</p>

<h2>From Zero to One: Creating the Future</h2>
<p><a href="https://www.libribooks.com/author/peter-thiel">Peter Thiel</a>'s <a href="https://www.libribooks.com/book/zero-to-one">Zero to One</a> challenges the conventional wisdom about competition and innovation. Thiel argues that the most valuable businesses don't compete in existing markets — they create entirely new ones. His central question, "What important truth do very few people agree with you on?" is a powerful litmus test for truly innovative thinking.</p>

<h2>What Makes Companies Great</h2>
<p><a href="https://www.libribooks.com/author/jim-collins">Jim Collins</a>'s <a href="https://www.libribooks.com/book/good-to-great">Good to Great</a> is the result of years of research into what separates good companies from truly great ones. Collins identifies key concepts like Level 5 Leadership, the Hedgehog Concept, and the Flywheel Effect that explain why some companies make the leap to sustained excellence while others never do.</p>

<h2>The Entrepreneur's Journey</h2>
<p><a href="https://www.libribooks.com/author/phil-knight">Phil Knight</a>'s <a href="https://www.libribooks.com/book/shoe-dog">Shoe Dog</a> is the raw, honest memoir of how Nike went from a crazy idea to one of the world's most iconic brands. Knight's journey is filled with near-death experiences for the business, unlikely partnerships, and the relentless determination that defines great entrepreneurs.</p>

<h2>The Personal MBA</h2>
<p><a href="https://www.libribooks.com/author/josh-kaufman">Josh Kaufman</a>'s <a href="https://www.libribooks.com/book/the-personal-mba">The Personal MBA</a> distills the essential business concepts into a single, accessible volume. Rather than spending years and hundreds of thousands on a traditional MBA, Kaufman shows you can learn the core principles of value creation, marketing, sales, finance, and systems thinking through focused self-education.</p>

<h2>Timeless Business Adventures</h2>
<p><a href="https://www.libribooks.com/author/john-brooks">John Brooks</a>'s <a href="https://www.libribooks.com/book/business-adventures">Business Adventures</a> — Bill Gates' favorite business book — tells twelve stories of Wall Street and corporate America that reveal timeless truths about human nature in business. From the Ford Edsel disaster to the rise of Xerox, these stories prove that the fundamentals of business have not changed.</p>

<h2>Your Business Framework</h2>
<ol>
<li><strong>Think from zero to one</strong> — Focus on creating new value, not copying what exists (Zero to One)</li>
<li><strong>Build for greatness</strong> — Apply the principles that separate good companies from great ones (Good to Great)</li>
<li><strong>Embrace the grind</strong> — Understand that entrepreneurship is a marathon of persistence (Shoe Dog)</li>
<li><strong>Master the fundamentals</strong> — Learn core business concepts without an MBA (The Personal MBA)</li>
<li><strong>Study business history</strong> — The best lessons come from real stories (Business Adventures)</li>
</ol>

<h2>Recommended Reading Order</h2>
<p>Start with <a href="https://www.libribooks.com/book/the-personal-mba">The Personal MBA</a> for a comprehensive business education, then read <a href="https://www.libribooks.com/book/zero-to-one">Zero to One</a> for innovative thinking, follow with <a href="https://www.libribooks.com/book/good-to-great">Good to Great</a> for building enduring organizations, enjoy <a href="https://www.libribooks.com/book/shoe-dog">Shoe Dog</a> for entrepreneurial inspiration, and explore <a href="https://www.libribooks.com/book/business-adventures">Business Adventures</a> for timeless wisdom.</p>`
  },
  {
    name: 'Communication',
    slug: 'communication',
    icon: '🗣️',
    coverFile: '',
    description: 'Master the art of conversation, persuasion, and public speaking. Learn how the world\'s best communicators connect, influence, and inspire — and how you can do the same.',
    pillarContent: `<h2>Communication: The Most Valuable Skill You Can Master</h2>
<p>Communication is the foundation of every relationship, career, and achievement. Whether you're negotiating a business deal, giving a presentation, navigating a difficult conversation, or simply trying to connect with someone new — your ability to communicate effectively determines your outcomes.</p>

<h2>Talking to Anyone, Anywhere</h2>
<p><a href="https://www.libribooks.com/author/leil-lowndes">Leil Lowndes</a>'s <a href="https://www.libribooks.com/book/how-to-talk-to-anyone">How to Talk to Anyone</a> provides 92 practical techniques for mastering social interactions. From making a powerful first impression to building instant rapport to navigating networking events with confidence, Lowndes breaks down the specific verbal and nonverbal techniques that naturally charismatic people use instinctively.</p>

<h2>The Art of Negotiation</h2>
<p><a href="https://www.libribooks.com/author/chris-voss">Chris Voss</a>, a former FBI hostage negotiator, wrote <a href="https://www.libribooks.com/book/never-split-the-difference">Never Split the Difference</a> to share the negotiation techniques that saved lives — and how you can apply them to everyday situations. His key insight: <strong>empathy is the most powerful negotiation tool</strong>. By genuinely understanding the other side's perspective, you gain the leverage to achieve outcomes that benefit everyone.</p>

<h2>Navigating Crucial Conversations</h2>
<p><a href="https://www.libribooks.com/author/joseph-grenny">Joseph Grenny</a>'s <a href="https://www.libribooks.com/book/crucial-conversations">Crucial Conversations</a> addresses the high-stakes, emotional conversations that most people either avoid or handle poorly. Whether it's addressing poor performance, discussing relationship issues, or navigating a disagreement with a family member, this book provides a framework for staying calm, creating safety, and finding mutual purpose.</p>

<h2>Speaking Like a TED Master</h2>
<p><a href="https://www.libribooks.com/author/carmine-gallo">Carmine Gallo</a>'s <a href="https://www.libribooks.com/book/talk-like-ted">T.A.L.K. Like TED</a> analyzes the most popular TED talks of all time to identify the nine secrets of great public speaking. From unleashing your passion to delivering jaw-dropping moments to sticking to the 18-minute rule, Gallo provides a practical blueprint for presentations that inform, inspire, and captivate.</p>

<h2>The Classic That Started It All</h2>
<p><a href="https://www.libribooks.com/author/dale-carnegie">Dale Carnegie</a>'s <a href="https://www.libribooks.com/book/how-to-win-friends-and-influence-people">How to Win Friends and Influence People</a>, first published in 1936, remains the gold standard for books on interpersonal communication. Carnegie's timeless principles — become genuinely interested in others, smile, remember that a person's name is the sweetest sound to them, and make the other person feel important — are as relevant today as they were nearly a century ago.</p>

<h2>Your Communication Framework</h2>
<ol>
<li><strong>Master the basics</strong> — Learn the timeless principles of genuine human connection (How to Win Friends and Influence People)</li>
<li><strong>Build social skills</strong> — Develop specific techniques for any social situation (How to Talk to Anyone)</li>
<li><strong>Negotiate with empathy</strong> — Use tactical empathy to achieve better outcomes (Never Split the Difference)</li>
<li><strong>Handle tough conversations</strong> — Navigate high-stakes discussions with composure (Crucial Conversations)</li>
<li><strong>Speak to inspire</strong> — Deliver presentations that captivate and move people (Talk Like TED)</li>
</ol>

<h2>Recommended Reading Order</h2>
<p>Start with <a href="https://www.libribooks.com/book/how-to-win-friends-and-influence-people">How to Win Friends and Influence People</a> for the timeless foundation, then read <a href="https://www.libribooks.com/book/how-to-talk-to-anyone">How to Talk to Anyone</a> for practical social skills, follow with <a href="https://www.libribooks.com/book/never-split-the-difference">Never Split the Difference</a> for negotiation mastery, explore <a href="https://www.libribooks.com/book/crucial-conversations">Crucial Conversations</a> for handling difficult discussions, and finish with <a href="https://www.libribooks.com/book/talk-like-ted">Talk Like TED</a> for public speaking excellence.</p>`
  }
];

async function main() {
  console.log('🚀 Starting skill creation...\n');
  
  for (const skill of skills) {
    console.log(`Creating skill: ${skill.name}`);
    
    let coverUrl = '';
    if (skill.coverFile) {
      coverUrl = await uploadCover(skill.coverFile);
    } else {
      console.log('  ⚠ No cover image (will be added later)');
    }
    
    const { data, error } = await supabase
      .from('skills')
      .insert({
        slug: skill.slug,
        name: skill.name,
        description: skill.description,
        pillar_content: skill.pillarContent,
        cover_image_url: coverUrl,
        icon: skill.icon
      })
      .select()
      .single();
    
    if (error) {
      console.log(`  ✗ Error: ${error.message}`);
    } else {
      console.log(`  ✓ Created: ${skill.name} (id: ${data.id})\n`);
    }
  }
  
  console.log('\n✅ All skills created!');
}

main().catch(console.error);
