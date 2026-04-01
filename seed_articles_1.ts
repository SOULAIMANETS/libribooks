import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://klwexowmvxurphajwlyk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsd2V4b3dtdnh1cnBoYWp3bHlrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzU1OTEwNywiZXhwIjoyMDgzMTM1MTA3fQ.NQ5sCmYzT41uf-fnMDOQeLYIcMO4CBVZx3inGW-K_pw'
);

const articles = [
  {
    slug: '5-evidence-based-habits-that-will-transform-your-daily-productivity',
    title: '5 Evidence-Based Habits That Will Transform Your Daily Productivity',
    excerpt: 'Discover the science-backed habits used by top performers to accomplish more meaningful work every day — without burning out. These five strategies, drawn from the world\'s best productivity books, will help you reclaim your time and focus.',
    author_name: 'Libribooks',
    date: '2026-04-01T10:00:00Z',
    skill_slug: 'productivity',
    article_role: 'pillar-support',
    meta_title: '5 Evidence-Based Productivity Habits | Libribooks',
    meta_description: 'Discover 5 science-backed productivity habits from bestselling books like Atomic Habits and Deep Work. Transform how you work without burning out.',
    keyword_links: [
      { keyword: 'Atomic Habits', url: 'https://www.libribooks.com/book/atomic-habits' },
      { keyword: 'Deep Work', url: 'https://www.libribooks.com/book/deep-work' },
      { keyword: 'Eat That Frog!', url: 'https://www.libribooks.com/book/eat-that-frog' },
      { keyword: 'Essentialism', url: 'https://www.libribooks.com/book/essentialism' },
      { keyword: 'James Clear', url: 'https://www.libribooks.com/author/james-clear' },
      { keyword: 'Cal Newport', url: 'https://www.libribooks.com/author/cal-newport' }
    ],
    cover_image_url: '',
    content: `<p>We all have the same 24 hours, yet some people seem to accomplish extraordinary things while the rest of us struggle to check items off a never-ending to-do list. What's their secret?</p>

<p>It's not talent, luck, or even working longer hours. After studying the world's most impactful productivity books, one truth emerges clearly: <strong>the most productive people have built better habits and systems.</strong> They've learned to work <em>with</em> their psychology rather than against it.</p>

<p>Here are five evidence-based habits — drawn from the very best productivity research — that can genuinely transform how you spend your days.</p>

<h2>1. Eat the Frog First: Tackle Your Hardest Task Before 10 AM</h2>

<p>There's a reason <a href="https://www.libribooks.com/author/brian-tracy">Brian Tracy</a>'s classic <a href="https://www.libribooks.com/book/eat-that-frog">Eat That Frog!</a> has remained a bestseller for over two decades. The concept is deceptively simple: identify the single most important — and often most daunting — task on your list, and do it first thing in the morning.</p>

<p>Why does this work so well? Research in cognitive psychology shows that our willpower and decision-making ability are strongest in the morning. As the day progresses, we experience "decision fatigue," making it harder and harder to tackle demanding work. By eating the frog first, you leverage your peak mental hours for your most impactful work.</p>

<p>The psychological payoff is equally powerful. Completing your hardest task early creates a sense of momentum and accomplishment that carries through the rest of your day. Suddenly, everything else feels manageable by comparison.</p>

<p><strong>Try this tomorrow:</strong> Before opening your email or checking social media, spend 60-90 minutes on your most important task. Notice how different the rest of your day feels.</p>

<h2>2. Build Atomic Habits: Small Changes, Remarkable Results</h2>

<p><a href="https://www.libribooks.com/author/james-clear">James Clear</a>'s groundbreaking <a href="https://www.libribooks.com/book/atomic-habits">Atomic Habits</a> introduced the world to a revolutionary idea: you don't need massive transformations to achieve massive results. You need <strong>tiny, consistent improvements</strong> — just 1% better each day — that compound over time into something extraordinary.</p>

<p>Clear's framework rests on four laws of behavior change:</p>
<ul>
<li><strong>Make it obvious</strong> — Design your environment so the right behaviors are visible and easy to start</li>
<li><strong>Make it attractive</strong> — Pair habits you need to do with habits you want to do</li>
<li><strong>Make it easy</strong> — Reduce friction for good habits and increase friction for bad ones</li>
<li><strong>Make it satisfying</strong> — Give yourself an immediate reward after completing the habit</li>
</ul>

<p>The genius of this approach is that it works with human nature rather than against it. Instead of relying on motivation (which is unreliable), you're building systems that make productive behavior automatic.</p>

<p>Perhaps Clear's most powerful insight is this: <em>"You do not rise to the level of your goals. You fall to the level of your systems."</em> Stop obsessing over outcomes and start building better daily systems.</p>

<h2>3. Protect Your Deep Work: Schedule Distraction-Free Focus Blocks</h2>

<p>In a world of constant notifications, open-plan offices, and an "always on" work culture, <a href="https://www.libribooks.com/author/cal-newport">Cal Newport</a>'s <a href="https://www.libribooks.com/book/deep-work">Deep Work</a> arrives like a wake-up call. Newport argues that the ability to concentrate without distraction on a cognitively demanding task is becoming both increasingly rare and increasingly valuable.</p>

<p>Newport draws a clear line between <strong>deep work</strong> — professional activities performed in a state of distraction-free concentration that push your cognitive capabilities to their limit — and <strong>shallow work</strong> — logistical tasks that don't require much thought and are often performed while distracted.</p>

<p>The most successful producers in the knowledge economy, Newport shows, are those who have learned to carve out 2-4 hours of protected deep work time each day. This isn't about working more hours — it's about making the hours you do work dramatically more valuable.</p>

<p><strong>Practical strategies to try:</strong></p>
<ul>
<li>Block 2-3 hours each morning on your calendar as "Deep Work" — treat it like an unmissable meeting</li>
<li>Put your phone in another room during deep work sessions</li>
<li>Use a "shutdown ritual" at the end of each workday to fully disconnect</li>
</ul>

<h2>4. Practice Essentialism: Do Less, But Better</h2>

<p>Most of us are busy. Very few of us are productive. <a href="https://www.libribooks.com/author/greg-mckeown">Greg McKeown</a>'s <a href="https://www.libribooks.com/book/essentialism">Essentialism</a> exposes the trap that catches so many ambitious people: saying yes to everything means you're really saying no to the things that matter most.</p>

<p>Essentialism is not about getting more things done — it's about getting the <em>right things</em> done. McKeown's framework asks you to ruthlessly evaluate where your time and energy are going, and to develop the discipline to eliminate or delegate everything that doesn't directly serve your highest priorities.</p>

<p>This is harder than it sounds. It requires saying no to good opportunities so you can say yes to great ones. It means disappointing people in the short term so you can serve them better in the long term. But the payoff — a life focused on what truly matters — is immeasurable.</p>

<p><em>"If you don't prioritize your life, someone else will."</em> — Greg McKeown</p>

<h2>5. Rest Strategically: Understand That Recovery Is Productive</h2>

<p>Here's something that the "hustle harder" crowd doesn't want you to hear: rest isn't the opposite of productivity — it's an essential component of it. <a href="https://www.libribooks.com/author/library-mindset">Library Mindset</a>'s <a href="https://www.libribooks.com/book/the-art-of-laziness">The Art of Laziness</a> makes a compelling case that strategic laziness — knowing when to step back, when to do nothing, when to let your mind wander — is what separates sustainable high performers from those who burn out.</p>

<p>Neuroscience research supports this. Your brain's "default mode network" — the neural network that activates during rest and daydreaming — plays a crucial role in creativity, problem-solving, and memory consolidation. When you're constantly busy, you never give this network the chance to do its vital background processing.</p>

<p>The most productive people are not the ones who work the most hours. They're the ones who strategically alternate between intense focus and deliberate recovery.</p>

<h2>Bringing It All Together</h2>

<p>These five habits aren't five separate strategies — they're an integrated system for sustainable productivity:</p>

<ol>
<li><strong>Morning:</strong> Eat the frog — tackle your most important task first</li>
<li><strong>Mid-morning:</strong> Enter deep work mode — protect 2-3 hours of distraction-free focus</li>
<li><strong>Daily:</strong> Build atomic habits — make small improvements that compound over time</li>
<li><strong>Weekly:</strong> Practice essentialism — ruthlessly evaluate what deserves your time</li>
<li><strong>Ongoing:</strong> Rest strategically — schedule recovery as seriously as you schedule work</li>
</ol>

<p>Start with one. Master it. Then add the next. Remember — it's about atomic improvements, not overnight transformation. The journey of a thousand miles begins with a single, well-chosen step.</p>

<p>Ready to dive deeper? Explore our complete <a href="https://www.libribooks.com/skills/productivity">Productivity skill guide</a> for more insights and book recommendations.</p>`
  },
  {
    slug: 'how-to-unlock-your-creative-potential-lessons-from-5-groundbreaking-books',
    title: 'How to Unlock Your Creative Potential: Lessons from 5 Groundbreaking Books',
    excerpt: 'Creativity isn\'t a mystical gift — it\'s a skill anyone can develop. Discover how the world\'s most innovative minds overcome creative blocks, find inspiration, and bring bold ideas to life.',
    author_name: 'Libribooks',
    date: '2026-04-01T09:00:00Z',
    skill_slug: 'creativity',
    article_role: 'pillar-support',
    meta_title: 'Unlock Your Creative Potential: 5 Book Lessons | Libribooks',
    meta_description: 'Learn to unleash your creativity with lessons from Steal Like an Artist, The War of Art, and more. Practical strategies for overcoming creative blocks.',
    keyword_links: [
      { keyword: 'Steal Like an Artist', url: 'https://www.libribooks.com/book/steal-like-an-artist-10-things-nobody-told-you-about-being-creative' },
      { keyword: 'The War of Art', url: 'https://www.libribooks.com/book/the-war-of-art-break-through-the-blocks-and-win-your-inner-creative-battles' },
      { keyword: 'Austin Kleon', url: 'https://www.libribooks.com/author/austin-kleon' },
      { keyword: 'Steven Pressfield', url: 'https://www.libribooks.com/author/steven-pressfield' }
    ],
    cover_image_url: '',
    content: `<p>There's a persistent myth that creativity is something you're born with — a divine spark that either exists or doesn't. If you've ever sat at a blank page, an empty canvas, or an unwritten business plan and thought, "I'm just not a creative person," you've fallen for this myth.</p>

<p>The truth, as revealed by some of the most brilliant books on the creative process, is far more empowering: <strong>creativity is a practice.</strong> It can be learned, developed, and strengthened — just like any other skill. Here's what five groundbreaking books teach us about unlocking it.</p>

<h2>Lesson 1: Nothing Is Original — And That's Liberating</h2>

<p><a href="https://www.libribooks.com/author/austin-kleon">Austin Kleon</a>'s <a href="https://www.libribooks.com/book/steal-like-an-artist-10-things-nobody-told-you-about-being-creative">Steal Like an Artist</a> begins with a truth that creative people throughout history have understood: every new idea is built on the foundation of existing ideas. The notion of a completely "original" thought is, frankly, a fantasy — and a paralyzing one at that.</p>

<p>Kleon encourages us to stop trying to create something from nothing and instead <strong>curate our influences</strong> with intention. Read widely. Watch curiously. Listen to genres you've never explored. Travel to places that challenge your assumptions. The more diverse your inputs, the more unique your creative outputs will become — because nobody else has your exact combination of influences.</p>

<p>The key distinction is between stealing (taking something and making it your own) and plagiarizing (taking something and pretending it's yours). Good artists steal. They absorb, transform, and recombine ideas into something the world hasn't seen before.</p>

<h2>Lesson 2: Show Up Every Day — Regardless of How You Feel</h2>

<p><a href="https://www.libribooks.com/author/steven-pressfield">Steven Pressfield</a>'s <a href="https://www.libribooks.com/book/the-war-of-art-break-through-the-blocks-and-win-your-inner-creative-battles">The War of Art</a> names the enemy that every creative person faces: <strong>Resistance</strong>. It's that invisible force that shows up as procrastination, self-doubt, perfectionism, distraction, and fear — and it grows stronger the more important the work.</p>

<p>Pressfield's solution is both simple and demanding: <strong>turn pro.</strong> The amateur waits for inspiration. The professional shows up every single day, sits down, and does the work — whether inspiration has arrived or not. Professionals do not identify with their feelings; they identify with their commitment to the craft.</p>

<p>This reframe is genuinely life-changing. When you stop waiting to "feel creative" and start treating creative work as a non-negotiable daily practice, you discover that inspiration often arrives <em>after</em> you start working — not before.</p>

<h2>Lesson 3: Give Your Ideas Permission to Be Ugly</h2>

<p><a href="https://www.libribooks.com/author/ed-catmull">Ed Catmull</a>, the co-founder of Pixar, shares an insight in <a href="https://www.libribooks.com/book/creativity-inc">Creativity, Inc.</a> that has transformed how organizations think about innovation: <strong>every great movie starts as an ugly baby.</strong></p>

<p>The early versions of Pixar's most beloved films — Toy Story, Finding Nemo, Inside Out — were, by Catmull's own admission, terrible. They were messy, confusing, and far from the polished masterpieces we know today. The magic happened in the <em>process</em> of iterating, getting honest feedback, and having the courage to rework ideas again and again.</p>

<p>This lesson applies far beyond filmmaking. Whether you're writing a novel, building a startup, or designing a product — give yourself permission to create a bad first draft. Perfectionism at the beginning of the creative process is creativity's most effective killer.</p>

<h2>Lesson 4: Recover Your Creative Self Through Practice</h2>

<p><a href="https://www.libribooks.com/author/julia-cameron">Julia Cameron</a>'s <a href="https://www.libribooks.com/book/the-artists-way-a-spiritual-path-to-higher-creativity">The Artist's Way</a> is a 12-week program that has helped millions of people recover creativity they didn't even know they'd lost. Cameron's two signature tools are elegantly simple:</p>

<ul>
<li><strong>Morning Pages:</strong> Every morning, write three pages of stream-of-consciousness. Don't edit. Don't judge. Just write. This practice clears the mental clutter that blocks creative thinking.</li>
<li><strong>Artist Dates:</strong> Once a week, take yourself on a solo "date" to fill your creative well — visit a museum, explore a bookshop, walk through a neighborhood you've never been to, or simply sit in a café and people-watch.</li>
</ul>

<p>The power of these practices lies in their consistency. Over twelve weeks, they gradually dissolve the inner critic, reconnect you with your sense of play, and open channels of creativity you may have shut down years ago.</p>

<h2>Lesson 5: Share Your Process, Not Just Your Product</h2>

<p>In <a href="https://www.libribooks.com/book/show-your-work">Show Your Work!</a>, <a href="https://www.libribooks.com/author/austin-kleon">Austin Kleon</a> makes the case that the most effective way to build a creative audience and community is to share your <em>process</em> — the messy, in-progress, behind-the-scenes reality of creative work — not just the polished final product.</p>

<p>This approach does three things: it creates genuine human connection with your audience, it holds you accountable to keep creating, and it attracts like-minded people who resonate with your creative journey. In an age of curated perfection on social media, authenticity stands out.</p>

<h2>Your Creative Action Plan</h2>

<p>Ready to unlock your creative potential? Here's where to start:</p>

<ol>
<li><strong>This week:</strong> Start Morning Pages — write 3 pages every morning before doing anything else</li>
<li><strong>This month:</strong> Read <a href="https://www.libribooks.com/book/steal-like-an-artist-10-things-nobody-told-you-about-being-creative">Steal Like an Artist</a> — it's short, visual, and immediately actionable</li>
<li><strong>Ongoing:</strong> Commit to showing up daily — even for just 15 minutes of creative work</li>
<li><strong>When stuck:</strong> Revisit <a href="https://www.libribooks.com/book/the-war-of-art-break-through-the-blocks-and-win-your-inner-creative-battles">The War of Art</a> to identify and overcome your Resistance</li>
</ol>

<p>Creativity is not a gift reserved for a few. It's a birthright you've forgotten to claim. Go claim it.</p>

<p>Ready for more? Explore our complete <a href="https://www.libribooks.com/skills/creativity">Creativity skill guide</a> for deeper insights and reading recommendations.</p>`
  },
  {
    slug: 'the-art-of-thinking-clearly-a-guide-to-better-decision-making',
    title: 'The Art of Thinking Clearly: A Guide to Better Decision-Making',
    excerpt: 'Your brain is lying to you — and it\'s doing it in predictable ways. Learn to recognize the cognitive biases that distort your thinking and discover frameworks for making sharper, clearer decisions every day.',
    author_name: 'Libribooks',
    date: '2026-04-01T08:00:00Z',
    skill_slug: 'critical-thinking',
    article_role: 'pillar-support',
    meta_title: 'Think More Clearly: A Guide to Better Decisions | Libribooks',
    meta_description: 'Learn to recognize cognitive biases and make better decisions. Insights from Think Again, Clear Thinking, and The Art of Thinking Clearly.',
    keyword_links: [
      { keyword: 'Think Again', url: 'https://www.libribooks.com/book/think-again-the-power-of-knowing-what-you-dont-know' },
      { keyword: 'Clear Thinking', url: 'https://www.libribooks.com/book/clear-thinking-turning-ordinary-moments-into-extraordinary-results' },
      { keyword: 'Adam Grant', url: 'https://www.libribooks.com/author/adam-grant' },
      { keyword: 'Shane Parrish', url: 'https://www.libribooks.com/author/shane-parrish' }
    ],
    cover_image_url: '',
    content: `<p>You made a bad decision recently. So did I. And the scary part isn't that we made mistakes — it's that our brains are wired to make the <em>same</em> mistakes over and over, in predictable patterns we rarely recognize.</p>

<p>These patterns are called <strong>cognitive biases</strong>, and they affect every aspect of our lives — from how we invest our money to whom we choose as friends, from the careers we pursue to the arguments we win or lose. The good news? Once you learn to see these biases, you can begin to think more clearly than the vast majority of people around you.</p>

<h2>The Bias Catalog: Know Your Enemy</h2>

<p><a href="https://www.libribooks.com/author/rolf-dobelli">Rolf Dobelli</a>'s <a href="https://www.libribooks.com/book/the-art-of-thinking-clearly">The Art of Thinking Clearly</a> catalogs dozens of cognitive biases that silently distort our judgment. Here are some of the most dangerous:</p>

<ul>
<li><strong>Confirmation bias:</strong> We seek out information that confirms what we already believe and dismiss evidence that contradicts it</li>
<li><strong>Sunk cost fallacy:</strong> We continue investing in failing projects because we've already invested so much — even when quitting is the rational choice</li>
<li><strong>Survivorship bias:</strong> We study the winners and ignore the losers, drawing wildly inaccurate conclusions about what leads to success</li>
<li><strong>The availability heuristic:</strong> We judge probability based on how easily examples come to mind, not on actual data</li>
<li><strong>The halo effect:</strong> We let one positive trait (like attractiveness or eloquence) color our entire judgment of a person or idea</li>
</ul>

<p>Simply being aware of these biases doesn't eliminate them — but it does give you a fighting chance. When you can name the trap, you're far less likely to fall into it.</p>

<h2>Think Like a Scientist: Embrace Being Wrong</h2>

<p>In <a href="https://www.libribooks.com/book/think-again-the-power-of-knowing-what-you-dont-know">Think Again</a>, organizational psychologist <a href="https://www.libribooks.com/author/adam-grant">Adam Grant</a> makes a provocative argument: <strong>the ability to rethink and unlearn is more important than the ability to think and learn.</strong></p>

<p>Grant identifies four modes of thinking — Preacher (defending sacred beliefs), Prosecutor (attacking opposing views), Politician (seeking approval), and Scientist (testing hypotheses). Most of us default to the first three. The best thinkers operate in Scientist mode: they hold their opinions as hypotheses, actively seek evidence that might prove them wrong, and take genuine pleasure in updating their beliefs.</p>

<p>This isn't about being wishy-washy or having no convictions. It's about <strong>confident humility</strong> — being secure enough in your identity to separate who you are from what you believe. When changing your mind becomes a sign of growth rather than weakness, your thinking improves dramatically.</p>

<h2>The Ordinary Moments That Shape Your Life</h2>

<p><a href="https://www.libribooks.com/author/shane-parrish">Shane Parrish</a>, the founder of Farnam Street and one of the internet's most respected thinkers, wrote <a href="https://www.libribooks.com/book/clear-thinking-turning-ordinary-moments-into-extraordinary-results">Clear Thinking</a> to address a simple but profound truth: <strong>most of our worst decisions happen not in dramatic moments, but in ordinary ones.</strong></p>

<p>We think poor decisions happen during high-stakes negotiations or life-changing crossroads. In reality, they happen when we respond to an email while tired, when we agree to a commitment out of social pressure, or when we react emotionally to a comment that triggered us.</p>

<p>Parrish introduces the concept of "default patterns" — automatic responses that hijack our thinking in ordinary moments. By learning to recognize these patterns and create space between stimulus and response, we can transform the quality of our everyday decisions.</p>

<h2>Respecting the Role of Luck</h2>

<p><a href="https://www.libribooks.com/author/nassim-nicholas-taleb">Nassim Nicholas Taleb</a>'s <a href="https://www.libribooks.com/book/fooled-by-randomness-the-hidden-role-of-chance-in-life-and-in-the-markets">Fooled by Randomness</a> adds another crucial dimension to clear thinking: understanding the role of chance. Humans are narrative-seeking creatures — we desperately want to explain why things happen, even when the honest answer is "randomness."</p>

<p>We attribute a CEO's success to their brilliant strategy when it might simply be luck. We blame a failed entrepreneur for poor execution when market timing was the real factor. By acknowledging the enormous role that randomness plays in outcomes, we can stop drawing false conclusions and start evaluating decisions based on their <em>process</em>, not just their results.</p>

<h2>Five Practices for Clearer Thinking</h2>

<ol>
<li><strong>Name the bias:</strong> When you notice yourself feeling certain about something, pause and ask which cognitive bias might be at play</li>
<li><strong>Seek disconfirming evidence:</strong> Actively look for information that challenges your current view</li>
<li><strong>Create decision space:</strong> When you feel pressured to decide quickly, that's often when you should slow down the most</li>
<li><strong>Separate process from outcome:</strong> Judge your decisions by the quality of your reasoning, not just the result</li>
<li><strong>Ask better questions:</strong> As <a href="https://www.libribooks.com/author/m-neil-browne-and-stuart-m-keeley">M. Neil Browne and Stuart M. Keeley</a> teach in <a href="https://www.libribooks.com/book/asking-the-right-questions-a-guide-to-critical-thinking">Asking the Right Questions</a>, the quality of your thinking is directly proportional to the quality of the questions you ask</li>
</ol>

<p>Clear thinking is not about being the smartest person in the room. It's about recognizing the traps that snare everyone else — and having the discipline to avoid them.</p>

<p>Ready to sharpen your mind further? Explore our complete <a href="https://www.libribooks.com/skills/critical-thinking">Critical Thinking skill guide</a> for deeper reading recommendations.</p>`
  },
  {
    slug: 'building-unbreakable-discipline-strategies-from-military-leaders-and-stoic-philosophers',
    title: 'Building Unbreakable Discipline: Strategies from Military Leaders and Stoic Philosophers',
    excerpt: 'Discipline is the bridge between who you are and who you want to become. Learn battle-tested strategies from Navy SEALs, Stoic thinkers, and extreme performers who\'ve mastered the art of showing up — especially when it\'s hard.',
    author_name: 'Libribooks',
    date: '2026-04-01T07:00:00Z',
    skill_slug: 'discipline',
    article_role: 'pillar-support',
    meta_title: 'Building Unbreakable Discipline | Libribooks',
    meta_description: 'Learn discipline strategies from Navy SEALs and Stoic philosophers. Insights from Extreme Ownership, Discipline Is Destiny, and Make Your Bed.',
    keyword_links: [
      { keyword: 'Extreme Ownership', url: 'https://www.libribooks.com/book/extreme-ownership-how-us-navy-seals-lead-and-win' },
      { keyword: 'Discipline Is Destiny', url: 'https://www.libribooks.com/book/discipline-is-destiny-the-power-of-self-control' },
      { keyword: 'Make Your Bed', url: 'https://www.libribooks.com/book/make-your-bed-little-things-that-can-change-your-lifeand-maybe-the-world' },
      { keyword: 'Jocko Willink', url: 'https://www.libribooks.com/author/jocko-willink-and-leif-babin' },
      { keyword: 'Ryan Holiday', url: 'https://www.libribooks.com/author/ryan-holiday' }
    ],
    cover_image_url: '',
    content: `<p>Motivation gets you started. <strong>Discipline keeps you going.</strong></p>

<p>We live in a culture obsessed with motivation — inspirational quotes, hype videos, vision boards. But anyone who has pursued a meaningful goal knows the truth: motivation is fleeting. It burns brightly for a few days, then fades when the work gets hard, boring, or uncomfortable.</p>

<p>Discipline is different. Discipline doesn't care how you feel. It's the commitment to doing what needs to be done — especially when you don't feel like doing it. And the world's most accomplished people, from Navy SEAL commanders to ancient Stoic philosophers, have left us a roadmap for building it.</p>

<h2>Start Impossibly Small: Make Your Bed</h2>

<p><a href="https://www.libribooks.com/author/admiral-william-h-mcraven">Admiral William H. McRaven</a>, commander of the forces that captured Saddam Hussein and planned the raid on Osama bin Laden, distilled decades of Navy SEAL training into one absurdly simple piece of advice in <a href="https://www.libribooks.com/book/make-your-bed-little-things-that-can-change-your-lifeand-maybe-the-world">Make Your Bed</a>: <strong>start every day by making your bed.</strong></p>

<p>It sounds trivial. That's precisely the point. Making your bed is a small act of discipline that creates a chain reaction. You've accomplished your first task of the day. You've demonstrated to yourself that the little things matter. And if you have a terrible day, you come home to a bed that's made — a small reminder that tomorrow is a fresh start.</p>

<p>McRaven's deeper lesson: <em>if you want to change the world, start by changing yourself. And if you want to change yourself, start with one small thing you can control.</em></p>

<h2>Take Extreme Ownership: No Excuses, No Blame</h2>

<p><a href="https://www.libribooks.com/author/jocko-willink-and-leif-babin">Jocko Willink and Leif Babin</a> learned their leadership philosophy in the brutal crucible of the Battle of Ramadi. In <a href="https://www.libribooks.com/book/extreme-ownership-how-us-navy-seals-lead-and-win">Extreme Ownership</a>, they share a principle that applies far beyond the battlefield: <strong>leaders must own everything in their world. There is no one else to blame.</strong></p>

<p>When a mission went wrong, Willink didn't point fingers at his troops, the intelligence, or the conditions. He asked: "What could <em>I</em> have done differently?" This mindset — extreme ownership — is the ultimate expression of discipline because it eliminates the most common escape hatch we all use: blaming circumstances.</p>

<p>When you stop blaming your boss, your schedule, your genetics, or your upbringing, something remarkable happens. You reclaim power. If it's your fault, it's within your power to fix. That's not a burden — it's liberation.</p>

<h2>Discipline as the Master Virtue</h2>

<p><a href="https://www.libribooks.com/author/ryan-holiday">Ryan Holiday</a>'s <a href="https://www.libribooks.com/book/discipline-is-destiny-the-power-of-self-control">Discipline Is Destiny</a> draws on thousands of years of Stoic philosophy to argue that <strong>self-control is the virtue that makes all other virtues possible.</strong> You can be brilliant, talented, and well-intentioned — but without discipline, none of it matters.</p>

<p>Holiday tells the stories of people who embodied this principle: Queen Elizabeth II, who maintained composure through seven decades of public service. Lou Gehrig, who showed up every single game for 17 consecutive years. Eisenhower, who suppressed his legendary temper to lead the Allied forces to victory.</p>

<p>The Stoic insight is that discipline isn't about deprivation or punishment. It's about <strong>freedom</strong>. The disciplined person is free from the tyranny of impulse, free from the regret of wasted potential, free to pursue what truly matters.</p>

<h2>The 40% Rule: You Have More in the Tank</h2>

<p><a href="https://www.libribooks.com/author/david-goggins">David Goggins</a>, once an overweight exterminator with no future, transformed himself into one of the world's toughest endurance athletes. In <a href="https://www.libribooks.com/book/master-your-mind-and-defy-the-odds">Master Your Mind and Defy the Odds</a>, he shares his "40% Rule": <strong>when your mind tells you you're done, you're really only at 40% of your capacity.</strong></p>

<p>This doesn't mean ignoring genuine physical danger or pushing yourself to injury. It means recognizing that the voice telling you to quit is usually <em>comfort</em> talking, not genuine limitation. Most of the time, you can go further than you think.</p>

<h2>Building Your Discipline Practice</h2>

<ol>
<li><strong>Tomorrow morning:</strong> Make your bed. Start the day with a small win.</li>
<li><strong>This week:</strong> Identify one area where you've been blaming circumstances. Take extreme ownership of it.</li>
<li><strong>This month:</strong> Choose one daily discipline — exercise, reading, meditation — and commit to it for 30 consecutive days, regardless of how you feel.</li>
<li><strong>When you want to quit:</strong> Remember the 40% Rule. Push through to 41%. Then 42%. Then see what happens.</li>
</ol>

<p>Discipline is not a personality trait. It is a <strong>practice</strong> — and like all practices, it gets stronger the more you exercise it.</p>

<p>Ready to go deeper? Explore our complete <a href="https://www.libribooks.com/skills/discipline">Discipline skill guide</a> for more insights and reading recommendations.</p>`
  },
  {
    slug: 'why-we-do-what-we-do-understanding-human-behavior-through-books',
    title: 'Why We Do What We Do: Understanding Human Behavior Through Books',
    excerpt: 'What if you could read people like a book? Discover the hidden psychological forces — from power dynamics to irrational decision-making — that drive human behavior, and learn how to navigate them wisely.',
    author_name: 'Libribooks',
    date: '2026-04-01T06:00:00Z',
    skill_slug: 'human-behavior',
    article_role: 'pillar-support',
    meta_title: 'Understanding Human Behavior Through Books | Libribooks',
    meta_description: 'Decode human behavior with insights from The Laws of Human Nature, Predictably Irrational, and The 48 Laws of Power.',
    keyword_links: [
      { keyword: 'The Laws of Human Nature', url: 'https://www.libribooks.com/book/the-laws-of-human-nature' },
      { keyword: 'The 48 Laws of Power', url: 'https://www.libribooks.com/book/the-48-laws-of-power' },
      { keyword: 'Predictably Irrational', url: 'https://www.libribooks.com/book/predictably-irrational' },
      { keyword: 'Robert Greene', url: 'https://www.libribooks.com/author/robert-greene' }
    ],
    cover_image_url: '',
    content: `<p>Have you ever watched someone make a decision that seemed completely irrational — and then realized you've done the same thing yourself? Have you ever wondered why some people effortlessly command attention in a room while others fade into the background?</p>

<p>Human behavior is endlessly fascinating, maddeningly complex, and — as it turns out — far more <strong>predictable</strong> than we think. The books in our Human Behavior collection pull back the curtain on the psychological forces that drive our actions, decisions, and relationships. Understanding these forces doesn't just make you smarter — it makes you more empathetic, more effective, and more self-aware.</p>

<h2>The Hidden Laws Governing Human Nature</h2>

<p><a href="https://www.libribooks.com/author/robert-greene">Robert Greene</a> spent years studying history, psychology, and biography to produce what may be the most comprehensive guide to understanding people ever written: <a href="https://www.libribooks.com/book/the-laws-of-human-nature">The Laws of Human Nature</a>.</p>

<p>Greene identifies 18 fundamental laws that govern human behavior across time, culture, and circumstance. A few that will change how you see the world:</p>

<ul>
<li><strong>The Law of Irrationality:</strong> We like to think of ourselves as rational beings, but emotions drive the vast majority of our decisions. The first step to wisdom is accepting this about yourself.</li>
<li><strong>The Law of Narcissism:</strong> Everyone exists on a spectrum of narcissism. Understanding where you and others fall on this spectrum is essential for navigating relationships.</li>
<li><strong>The Law of Role-Playing:</strong> People wear masks. Learning to read behind the mask — through body language, micro-expressions, and behavioral patterns — is one of the most valuable social skills you can develop.</li>
<li><strong>The Law of Envy:</strong> Envy is the most hidden of all human emotions, yet it drives an enormous amount of interpersonal conflict. People will rarely admit to envying you, but they will act on it.</li>
</ul>

<p>Greene's work is not about manipulation — it's about <strong>understanding</strong>. When you understand why people behave the way they do, you can respond with wisdom rather than react with confusion.</p>

<h2>We Are Predictably Irrational</h2>

<p>Behavioral economist <a href="https://www.libribooks.com/author/dan-ariely">Dan Ariely</a> takes a more scientific approach in <a href="https://www.libribooks.com/book/predictably-irrational">Predictably Irrational</a>. Through clever experiments, he demonstrates that humans don't just make irrational decisions — they make irrational decisions in <strong>systematic, predictable patterns.</strong></p>

<p>For instance: we dramatically overvalue things that are "free," even when a better deal exists. We make completely different choices depending on irrelevant context (a $50 pen feels expensive when shopping for pens but cheap when buying a $1,000 suit). We procrastinate even when we know the consequences and have the tools to avoid them.</p>

<p>The beauty of Ariely's work is that once you see these patterns, you can design your environment and decisions to work <em>with</em> your irrationality rather than against it.</p>

<h2>Understanding Power: The 48 Laws</h2>

<p><a href="https://www.libribooks.com/author/robert-greene">Robert Greene</a>'s <a href="https://www.libribooks.com/book/the-48-laws-of-power">The 48 Laws of Power</a> is one of the most controversial and widely-read books of the last three decades. Drawing from thousands of years of history — from Machiavelli to Louis XIV, Sun Tzu to contemporary power players — Greene distills the mechanics of power into 48 laws.</p>

<p>Some people read this book as a manual for manipulation. That's a misreading. Its greatest value is <strong>defensive</strong>: by understanding how power operates, you can recognize when these dynamics are being used against you. You don't have to play power games, but you should understand the rules of the game you're in.</p>

<h2>Choosing What Matters: The Subtle Art</h2>

<p><a href="https://www.libribooks.com/author/mark-manson">Mark Manson</a>'s <a href="https://www.libribooks.com/book/the-subtle-art-of-not-giving-a-fck">The Subtle Art of Not Giving a F*ck</a> examines a specific aspect of human behavior: our tendency to care about too many things. Manson argues that we have a limited amount of emotional energy, and most of us waste it on things that don't deserve it — other people's opinions, minor inconveniences, social media outrage.</p>

<p>The solution isn't to stop caring about everything — it's to be <strong>selective</strong> about what earns your emotional investment. This is a profound behavioral insight: the most content people are not those who never face problems but those who have chosen <em>better problems</em> to face.</p>

<h2>Applying These Insights to Your Life</h2>

<ol>
<li><strong>Start with self-awareness:</strong> Before trying to understand others, understand your own emotional patterns, biases, and triggers</li>
<li><strong>Read behind the mask:</strong> Pay attention not just to what people say but to what they do, especially when they think no one is watching</li>
<li><strong>Design for irrationality:</strong> Set up your decisions, habits, and environment to account for the fact that you will not always act rationally</li>
<li><strong>Be selective with your energy:</strong> Consciously choose what deserves your emotional investment</li>
</ol>

<p>Understanding human behavior is not about gaining an unfair advantage over others. It's about navigating the world with greater wisdom, empathy, and clarity — and becoming more fully human in the process.</p>

<p>Ready to explore further? Visit our complete <a href="https://www.libribooks.com/skills/human-behavior">Human Behavior skill guide</a> for more reading recommendations.</p>`
  }
];

async function main() {
  console.log('🚀 Creating articles (batch 1: 1-5)...\n');
  
  for (const article of articles) {
    console.log(`Creating: ${article.title.substring(0, 60)}...`);
    
    const { data, error } = await supabase
      .from('articles')
      .insert(article)
      .select('slug')
      .single();
    
    if (error) {
      console.log(`  ✗ Error: ${error.message}\n`);
    } else {
      console.log(`  ✓ Created: ${data.slug}\n`);
    }
  }
  
  console.log('✅ Batch 1 complete!');
}

main().catch(console.error);
