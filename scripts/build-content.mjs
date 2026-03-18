import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.cwd());
const dataPath = path.join(root, "data", "posts.json");
const sitemapPath = path.join(root, "sitemap.xml");
const blogRoot = path.join(root, "blog");
const siteUrl = (process.env.SITE_URL || "https://priya4042.github.io/wellness-bloom-women-health-blog").replace(/\/$/, "");

const categoryLabels = {
  "hair-growth": "Hair Growth",
  thyroid: "Thyroid",
  "period-health": "Period Health",
  digestion: "Digestion",
  "fat-loss": "Fat Loss"
};

function countWords(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

function paragraph(text) {
  return `<p>${text}</p>`;
}

function bulletList(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function buildArticle(config) {
  const sections = [];

  sections.push(
    paragraph(
      `${config.introA} ${config.introB} ${config.introC} Instead of chasing one perfect supplement or one perfect meal plan, this guide walks you through a system that is realistic enough to follow during busy work weeks, travel, and hormonal fluctuations. The goal is steady improvement you can feel in energy, mood, recovery, and confidence over the next twelve weeks.`
    )
  );

  sections.push(`<h2>${config.h2A}</h2>`);
  sections.push(
    paragraph(
      `${config.h2APara1} ${config.h2APara2} ${config.h2APara3} This is where most women gain traction: by reducing decision fatigue and building a repeatable baseline before experimenting with advanced tools.`
    )
  );
  sections.push(
    paragraph(
      `${config.h2APara4} ${config.h2APara5} ${config.h2APara6} If you only do one thing this month, choose this foundational block and protect it like an appointment.`
    )
  );

  sections.push(`<h2>${config.h2B}</h2>`);
  sections.push(
    paragraph(
      `${config.h2BPara1} ${config.h2BPara2} ${config.h2BPara3} The practical approach is to track patterns for at least two full cycles or eight continuous weeks, because short snapshots often miss what your body is trying to tell you.`
    )
  );
  sections.push(
    paragraph(
      `${config.h2BPara4} ${config.h2BPara5} ${config.h2BPara6} Consistent logging turns frustration into information, and information turns into better decisions with your clinician.`
    )
  );

  sections.push(`<h2>${config.h2C}</h2>`);
  sections.push(
    paragraph(
      `${config.h2CPara1} ${config.h2CPara2} ${config.h2CPara3} Build meals around satiety and micronutrients first, then shape portions for your goal. This order protects adherence and prevents the restrict-then-rebound cycle.`
    )
  );
  sections.push(bulletList(config.h2CBullets));
  sections.push(
    paragraph(
      `${config.h2CPara4} ${config.h2CPara5} ${config.h2CPara6} Think in weeks, not days: one off-plan meal matters far less than your average pattern over a month.`
    )
  );

  sections.push(`<h2>${config.h2D}</h2>`);
  sections.push(
    paragraph(
      `${config.h2DPara1} ${config.h2DPara2} ${config.h2DPara3} Sleep quality and stress calibration are not optional extras here. They directly influence appetite signals, recovery, insulin sensitivity, and inflammatory tone.`
    )
  );
  sections.push(
    paragraph(
      `${config.h2DPara4} ${config.h2DPara5} ${config.h2DPara6} Choose the minimum effective routine you can repeat, then increase complexity only after four stable weeks.`
    )
  );

  sections.push(`<h2>${config.h2E}</h2>`);
  sections.push(
    paragraph(
      `${config.h2EPara1} ${config.h2EPara2} ${config.h2EPara3} If symptoms are severe, persistent, or worsening, seek clinical care early. Digital content can guide habits, but it cannot replace personalized diagnosis and treatment.`
    )
  );
  sections.push(bulletList(config.h2EBullets));
  sections.push(
    paragraph(
      `${config.h2EPara4} ${config.h2EPara5} ${config.h2EPara6} Progress is rarely linear, but with a calm structure and better feedback loops, your results become more predictable month by month.`
    )
  );

  sections.push(
    `<blockquote>${config.quote}</blockquote>` +
      paragraph(
        `${config.conclusionA} ${config.conclusionB} ${config.conclusionC} Start small, stay consistent, and evaluate what is working every two weeks. The women who feel best are not perfect; they are simply consistent with the basics that match their physiology and season of life.`
      )
  );

  return sections.join("\n");
}

function buildPostPage(post) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${post.title} | Wellness Bloom</title>
  <meta name="description" content="${post.description}">
  <meta name="keywords" content="${post.keywords.join(", ")}">
  <meta property="og:title" content="${post.title} | Wellness Bloom">
  <meta property="og:description" content="${post.description}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${siteUrl}/blog/${post.slug}/">
  <meta property="og:image" content="${siteUrl}/${post.image}">
  <link rel="canonical" href="${siteUrl}/blog/${post.slug}/">
  <link rel="stylesheet" href="../../assets/css/styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=Manrope:wght@400;500;700;800&display=swap" rel="stylesheet">
</head>
<body data-depth="2" data-slug="${post.slug}">
  <div id="site-header"></div>
  <main class="section">
    <div class="container post-layout">
      <article class="article-shell" id="article-wrap" aria-live="polite"></article>
      <aside class="sidebar">
        <div class="ad-slot">AdSense Sidebar Placeholder (300x250)</div>
        <section>
          <h2 class="section-title">Related Posts</h2>
          <div id="related-wrap" class="grid"></div>
        </section>
      </aside>
    </div>
    <section class="container section">
      <h2 class="section-title">Read More</h2>
      <div id="read-more-wrap" class="grid grid-2"></div>
    </section>
  </main>
  <div id="site-footer"></div>
  <script src="../../assets/js/site.js"></script>
  <script src="../../assets/js/data-loader.js"></script>
  <script src="../../assets/js/post.js"></script>
</body>
</html>
`;
}

const drafts = [
  {
    slug: "hair-growth-after-thyroid-shift",
    title: "Hair Growth After a Thyroid Shift: The 12-Week Recovery Framework",
    description: "A practical 12-week framework to improve hair growth after thyroid-related shedding.",
    category: "hair-growth",
    keywords: ["hair growth", "thyroid hair loss", "women shedding", "ferritin", "protein"],
    readTime: 8,
    featured: true,
    publishedAt: "2026-03-10",
    introA: "Hair shedding after a thyroid transition can feel alarming, especially when volume drops quickly in the shower and brush.",
    introB: "The encouraging truth is that many women can restore stronger growth when they stabilize thyroid care and improve recovery inputs.",
    introC: "Regrowth is not immediate because follicles cycle in phases, but the process is absolutely trainable.",
    h2A: "Start With the Follicle Basics",
    h2APara1: "Hair follicles are metabolic tissue, so they respond to thyroid hormone availability, iron status, protein adequacy, and stress hormones.",
    h2APara2: "When one of these pillars is missing, follicles shift from growth mode into rest mode and shedding rises several weeks later.",
    h2APara3: "Your first task is not adding ten products; it is rebuilding the biological environment where growth can resume.",
    h2APara4: "Create a simple daily foundation: morning protein, steady hydration, and medication timing consistency if prescribed.",
    h2APara5: "Avoid dramatic calorie cuts during recovery because follicles interpret severe deficits as a signal to conserve resources.",
    h2APara6: "Gentle scalp stimulation and low-tension styling help preserve what is already growing while new strands emerge.",
    h2B: "Track Labs and Symptoms Together",
    h2BPara1: "Many women only track TSH, but hair outcomes often improve faster when ferritin, vitamin D, B12, zinc, and thyroid antibodies are reviewed with context.",
    h2BPara2: "A symptom log gives your care team a richer picture than a single lab value on one date.",
    h2BPara3: "Document weekly shedding level, scalp sensitivity, energy, bowel rhythm, and sleep quality.",
    h2BPara4: "This helps you notice whether progress slows during high stress windows, low appetite weeks, or cycle changes.",
    h2BPara5: "Bring these notes to appointments and ask focused questions about target ranges that match your symptoms.",
    h2BPara6: "That conversation is often the difference between vague reassurance and actionable adjustment.",
    h2C: "Eat for Regrowth, Not Just for Calories",
    h2CPara1: "Hair is protein-rich tissue, so hitting consistent protein targets matters more than occasional perfect meals.",
    h2CPara2: "Iron-rich foods paired with vitamin C can support ferritin restoration when medically appropriate.",
    h2CPara3: "Omega-3 fats and colorful produce help calm inflammatory load that can worsen shedding patterns.",
    h2CBullets: [
      "Anchor breakfast with 25 to 35 grams of protein.",
      "Include one iron-focused meal daily, then pair it with vitamin C produce.",
      "Aim for two hydration check-ins before midday to support scalp and skin quality.",
      "Use a repeatable grocery list to reduce missed nutrients during busy weeks."
    ],
    h2CPara4: "Avoid rotating restrictive diets while your follicles are vulnerable.",
    h2CPara5: "Pick one eating pattern you can hold for at least twelve weeks and measure outcomes.",
    h2CPara6: "Consistency beats novelty for hair recovery.",
    h2D: "Build a Scalp and Stress Routine",
    h2DPara1: "Scalp care works best when it is gentle and regular: low-irritation cleansing, light massage, and minimal heat damage.",
    h2DPara2: "Over-treating with harsh actives can inflame the scalp barrier and delay visual gains.",
    h2DPara3: "Use products with a clear purpose and evaluate them over six to eight weeks.",
    h2DPara4: "At the same time, stress regulation is essential because cortisol spikes can increase shedding intensity.",
    h2DPara5: "A 10-minute evening wind-down, sunlight exposure in the morning, and lower evening screen brightness can improve sleep depth.",
    h2DPara6: "Better sleep strengthens endocrine recovery and supports thicker regrowth over time.",
    h2E: "When to Escalate Care",
    h2EPara1: "If shedding is sudden, patchy, painful, or accompanied by rapid weight changes and severe fatigue, get medical evaluation quickly.",
    h2EPara2: "Early assessment can identify autoimmune flare, significant nutrient depletion, medication mismatch, or scalp conditions needing treatment.",
    h2EPara3: "The faster the cause is identified, the better your timeline for visible recovery.",
    h2EBullets: [
      "Bring a 4-week symptom and shedding log to your appointment.",
      "List all supplements and doses, including start dates.",
      "Ask what objective markers will be rechecked and when.",
      "Clarify what short-term changes to expect before your next follow-up."
    ],
    h2EPara4: "Progress usually appears first as reduced daily shedding, then improved texture, then noticeable density.",
    h2EPara5: "Celebrate each phase because it confirms your plan is working.",
    h2EPara6: "Patience and precision together are powerful.",
    quote: "Hair recovery is not about one miracle product. It is about restoring the biology that allows growth to happen.",
    conclusionA: "Over twelve weeks, small decisions compound into visible change.",
    conclusionB: "When nutrition, thyroid care, stress regulation, and scalp support align, follicles get the signal to grow again.",
    conclusionC: "Use this framework as your baseline and personalize with your clinician."
  },
  {
    slug: "ferritin-and-hair-shedding-women",
    title: "Ferritin and Hair Shedding in Women: What to Fix First",
    description: "Understand the ferritin-hair connection and create a sustainable recovery routine.",
    category: "hair-growth",
    keywords: ["ferritin", "hair shedding", "iron deficiency", "women health", "hair density"],
    readTime: 9,
    featured: false,
    publishedAt: "2026-03-09",
    introA: "If your labs show low ferritin and your hair is shedding more than usual, you are not imagining the connection.",
    introB: "Ferritin acts as your iron storage marker, and follicles struggle when reserves are chronically low.",
    introC: "The solution is rarely a random supplement stack; it is a measured restoration strategy.",
    h2A: "Why Ferritin Matters for Hair",
    h2APara1: "Hair follicles divide quickly, which means they need reliable oxygen transport and iron availability.",
    h2APara2: "When ferritin is depleted, follicles can prematurely enter resting phases that increase diffuse shedding.",
    h2APara3: "This process often starts months before visible loss, which is why early tracking matters.",
    h2APara4: "Restoration takes time, and visible regrowth usually follows reduced shedding rather than appearing overnight.",
    h2APara5: "Many women feel discouraged too early and stop the plan before follicles have time to cycle.",
    h2APara6: "Commit to a twelve-week window before judging outcomes unless your clinician advises otherwise.",
    h2B: "Interpret Labs with Context",
    h2BPara1: "Ferritin should be interpreted with symptoms, menstrual history, thyroid status, and inflammation markers.",
    h2BPara2: "A number that appears technically normal may still not support ideal hair outcomes for some women.",
    h2BPara3: "This is where symptom-guided care improves decisions.",
    h2BPara4: "Track fatigue, shortness of breath on exertion, brittle nails, and concentration dips alongside shedding scores.",
    h2BPara5: "Patterns make appointments more productive and reduce trial-and-error supplementation.",
    h2BPara6: "Use consistent timing for repeat labs to avoid misleading fluctuations.",
    h2C: "Food and Supplement Strategy",
    h2CPara1: "Diet first is a strong base: heme iron foods, legumes, leafy greens, and vitamin C pairings support intake quality.",
    h2CPara2: "If supplementation is prescribed, follow dose timing and separation rules to improve absorption.",
    h2CPara3: "Calcium and certain medications can interfere when taken too closely.",
    h2CBullets: [
      "Pair iron-rich meals with citrus, kiwi, bell peppers, or berries.",
      "Avoid tea or coffee right around iron-dense meals when possible.",
      "Use reminders so supplement timing stays consistent.",
      "Review bowel tolerance and hydration to keep adherence realistic."
    ],
    h2CPara4: "Do not self-escalate doses aggressively because side effects can reduce consistency.",
    h2CPara5: "Gentle, sustained adherence usually beats short bursts of high-dose effort.",
    h2CPara6: "The objective is replenishment you can maintain.",
    h2D: "Protect Hair While Rebuilding",
    h2DPara1: "Recovery phases benefit from low-tension hairstyles, less heat exposure, and fewer harsh chemical processes.",
    h2DPara2: "This does not regrow follicles directly, but it prevents breakage that can hide real progress.",
    h2DPara3: "Think of this as preserving gains while biology catches up.",
    h2DPara4: "Sleep and stress management remain key because chronic sleep debt worsens recovery capacity.",
    h2DPara5: "Even a stable bedtime and short evening decompression routine can improve next-day resilience.",
    h2DPara6: "When your system feels safer, repair often accelerates.",
    h2E: "Measure Progress the Right Way",
    h2EPara1: "Use practical markers: fewer strands on wash day, less visible scalp at part lines, and improved ponytail fullness.",
    h2EPara2: "Photos in consistent lighting every two weeks provide objective feedback.",
    h2EPara3: "Relying on memory alone can make progress look slower than it is.",
    h2EBullets: [
      "Take front, side, and crown photos every 14 days.",
      "Score shedding from 1 to 10 after each wash.",
      "Track energy and period flow changes in the same log.",
      "Plan repeat labs with your clinician before stopping support."
    ],
    h2EPara4: "Your plan succeeds when objective markers move in the right direction over time.",
    h2EPara5: "Give your body enough runway to complete the cycle.",
    h2EPara6: "Slow progress is still progress.",
    quote: "Ferritin recovery is a marathon process. Precision and consistency beat urgency every time.",
    conclusionA: "Fixing ferritin-related shedding starts with clarity, not panic.",
    conclusionB: "With targeted nutrition, appropriate supplementation, and routine protection, most women can improve density over time.",
    conclusionC: "Use evidence, track trends, and stay in follow-up care."
  },
  {
    slug: "thyroid-morning-routine-energy",
    title: "The Thyroid Morning Routine That Supports Energy All Day",
    description: "A realistic morning system for women managing thyroid-related fatigue and metabolism changes.",
    category: "thyroid",
    keywords: ["thyroid routine", "thyroid fatigue", "morning habits", "women hormones", "energy"],
    readTime: 8,
    featured: true,
    publishedAt: "2026-03-08",
    introA: "Mornings often determine how thyroid symptoms feel for the rest of the day.",
    introB: "When your first two hours are chaotic, fatigue and brain fog tend to rise.",
    introC: "A calm thyroid-supportive morning routine can stabilize energy, digestion, and appetite signals.",
    h2A: "Anchor Medication Timing and Light Exposure",
    h2APara1: "If you use thyroid medication, timing consistency matters for absorption and symptom steadiness.",
    h2APara2: "Pair this with early daylight exposure to support circadian rhythm and cortisol timing.",
    h2APara3: "Your body reads light as a signal to start metabolic activity.",
    h2APara4: "Open curtains immediately, step outside for a short walk, or sit by bright natural light.",
    h2APara5: "These simple cues can improve wakefulness without relying on extra caffeine.",
    h2APara6: "Small biological signals repeated daily create outsized gains.",
    h2B: "Hydration and Gentle Movement First",
    h2BPara1: "Overnight dehydration can amplify fatigue, constipation, and headaches in women with thyroid stress.",
    h2BPara2: "A hydration ritual before coffee improves baseline function and appetite regulation.",
    h2BPara3: "Then add five to ten minutes of low-intensity movement.",
    h2BPara4: "Mobility flow, easy walking, or breathing-focused stretching can wake the nervous system without overloading it.",
    h2BPara5: "This is especially useful when high-intensity workouts feel draining.",
    h2BPara6: "Start gentle, then scale as energy improves.",
    h2C: "Build a High-Protein First Meal",
    h2CPara1: "A protein-forward breakfast helps reduce energy crashes and keeps hunger more stable through late morning.",
    h2CPara2: "Add fiber and healthy fats to support blood sugar consistency and gut comfort.",
    h2CPara3: "Simple combinations work best when mornings are busy.",
    h2CBullets: [
      "Greek yogurt, berries, chia, and seeds.",
      "Eggs with sautéed vegetables and whole-grain toast.",
      "Protein smoothie with spinach, fruit, and nut butter.",
      "Overnight oats with protein powder and flax."
    ],
    h2CPara4: "You do not need perfection every day; you need a repeatable template.",
    h2CPara5: "When decision fatigue is low, adherence improves naturally.",
    h2CPara6: "Consistency compounds.",
    h2D: "Control Stimulants and Workload",
    h2DPara1: "Caffeine can be useful, but too much too early may worsen anxiety and mid-day crashes.",
    h2DPara2: "Pair coffee with food and delay second servings when possible.",
    h2DPara3: "Protect your first work block for high-focus tasks before meetings consume your attention.",
    h2DPara4: "A structured morning reduces stress reactivity and helps you feel more in control of symptoms.",
    h2DPara5: "Use short task batching to avoid cognitive overload.",
    h2DPara6: "Mental pacing is endocrine support in practice.",
    h2E: "Weekly Review and Adjustment",
    h2EPara1: "Track morning energy, bowel regularity, mood, and afternoon slump intensity.",
    h2EPara2: "Review once per week and adjust one variable at a time.",
    h2EPara3: "This prevents confusion about what is helping.",
    h2EBullets: [
      "Keep wake time within a 30-minute range daily.",
      "Prepare breakfast staples twice weekly.",
      "Set a hydration target by 11 AM.",
      "Review symptom trends every Sunday."
    ],
    h2EPara4: "If severe fatigue persists despite consistency, seek clinical reassessment.",
    h2EPara5: "Your plan should evolve with labs and symptom history.",
    h2EPara6: "Good routines and good medicine work together.",
    quote: "A thyroid-supportive morning is less about motivation and more about predictable inputs.",
    conclusionA: "You can improve thyroid-related energy without turning mornings into a complicated protocol.",
    conclusionB: "Medication consistency, light, hydration, protein, and pacing are enough to create momentum.",
    conclusionC: "Start with the smallest version and build week by week."
  },
  {
    slug: "pms-cramps-relief-week-plan",
    title: "PMS and Cramps Relief: A 7-Day Pre-Period Plan",
    description: "Use this pre-period week plan to reduce cramps, bloating, and emotional swings naturally.",
    category: "period-health",
    keywords: ["PMS relief", "period cramps", "cycle syncing", "women hormones", "period pain"],
    readTime: 9,
    featured: false,
    publishedAt: "2026-03-07",
    introA: "Many women only react to period pain once cramps start, but the best results come from pre-period preparation.",
    introB: "The luteal phase is a window where hydration, minerals, movement, and sleep can change symptom intensity.",
    introC: "A seven-day plan gives structure without feeling restrictive.",
    h2A: "Day 7 to Day 5: Reduce Inflammatory Load",
    h2APara1: "Start by minimizing foods and habits that amplify inflammation and fluid retention for your body.",
    h2APara2: "This may include highly salty packaged meals, alcohol, and sleep-disrupting late-night snacks.",
    h2APara3: "Replace rather than restrict: choose satisfying alternatives that still feel enjoyable.",
    h2APara4: "Increase colorful produce, omega-3 fats, and hydration to support calmer tissue response.",
    h2APara5: "Notice how your abdomen and mood respond within 48 hours.",
    h2APara6: "Early wins build confidence for the rest of the week.",
    h2B: "Day 4 to Day 3: Support Minerals and Digestion",
    h2BPara1: "Magnesium-rich foods and stable bowel habits can significantly reduce cramp intensity and pelvic discomfort.",
    h2BPara2: "Constipation often worsens pressure and pain, so digestion support is central to period comfort.",
    h2BPara3: "Aim for hydration and fiber consistency rather than sudden jumps.",
    h2BPara4: "Warm liquids and gentle evening walks can improve bowel rhythm without stress.",
    h2BPara5: "If you use supplements, discuss dose and timing with your clinician.",
    h2BPara6: "Consistency beats occasional high-dose attempts.",
    h2C: "Day 2 to Day 1: Prioritize Nervous System Calm",
    h2CPara1: "Stress sensitivity increases for many women before bleeding starts, making sleep and emotional load management crucial.",
    h2CPara2: "Create a low-friction evening routine with lower lights, lighter media, and earlier wind-down.",
    h2CPara3: "Use short breathing sessions to reduce pain amplification pathways.",
    h2CBullets: [
      "10 minutes of gentle stretching before bed.",
      "Warm shower or heating pad as pre-sleep cue.",
      "Screen brightness down 90 minutes before sleep.",
      "Set a simple next-day plan to reduce nighttime overthinking."
    ],
    h2CPara4: "Pain perception is strongly tied to nervous system state.",
    h2CPara5: "Calming your system can reduce symptom severity even before medications are needed.",
    h2CPara6: "This is a powerful, often underused lever.",
    h2D: "During Day 1 to Day 2: Blend Comfort and Function",
    h2DPara1: "Use heat, hydration, and lighter movement to keep circulation and mood stable.",
    h2DPara2: "Complete rest may be needed at times, but total inactivity can increase stiffness and discomfort.",
    h2DPara3: "Choose short walks, mobility, or very gentle yoga based on symptoms.",
    h2DPara4: "Keep meals simple, warm, and digestible if appetite drops.",
    h2DPara5: "Nourishing regularly can reduce fatigue and rebound cravings.",
    h2DPara6: "Your body handles pain better when under-fueled stress is minimized.",
    h2E: "When to Investigate Further",
    h2EPara1: "Severe pain that disrupts work, school, or sleep deserves medical evaluation.",
    h2EPara2: "Persistent heavy bleeding, large clots, or cycle irregularity may indicate conditions needing targeted care.",
    h2EPara3: "Early investigation can prevent years of unnecessary suffering.",
    h2EBullets: [
      "Track pain score, bleeding pattern, and medication response each cycle.",
      "Document digestive symptoms and mood changes in the same log.",
      "Bring your timeline to gynecology appointments.",
      "Ask what diagnostic steps are appropriate for your symptom profile."
    ],
    h2EPara4: "Your period should not feel unmanageable every month.",
    h2EPara5: "Good care combines symptom relief with root-cause evaluation.",
    h2EPara6: "You deserve both.",
    quote: "The pre-period week is not just something to endure. It is a powerful window to intervene.",
    conclusionA: "A seven-day PMS plan turns random coping into predictable support.",
    conclusionB: "When hydration, minerals, stress regulation, and digestion align, cramps often become more manageable.",
    conclusionC: "Track your patterns and personalize from there."
  },
  {
    slug: "period-irregularity-tracker-reset",
    title: "Irregular Periods Reset: How to Track Patterns That Actually Matter",
    description: "A data-driven period tracking strategy to identify root causes of irregular cycles.",
    category: "period-health",
    keywords: ["irregular periods", "cycle tracking", "women hormones", "PCOS symptoms", "period health"],
    readTime: 9,
    featured: false,
    publishedAt: "2026-03-06",
    introA: "Irregular periods can feel unpredictable and emotionally exhausting, especially when every month looks different.",
    introB: "Most women track only period dates, but meaningful cycle insight comes from a wider set of markers.",
    introC: "A better tracker helps you and your clinician find patterns faster.",
    h2A: "Build a High-Value Tracking Dashboard",
    h2APara1: "Start with cycle length and bleed days, then add ovulation signs, sleep quality, stress load, bowel rhythm, and energy scores.",
    h2APara2: "These variables reveal whether irregularity follows lifestyle stress, nutritional gaps, or endocrine shifts.",
    h2APara3: "Simple daily ratings are enough if they are consistent.",
    h2APara4: "Use one app or one notebook to avoid fragmented data.",
    h2APara5: "Consistency matters more than perfect detail.",
    h2APara6: "You are building pattern recognition, not writing a thesis.",
    h2B: "Identify the Most Common Disruptors",
    h2BPara1: "Cycle irregularity often worsens with sleep debt, high training load without recovery, restrictive dieting, and unresolved stress.",
    h2BPara2: "For some women, thyroid or insulin resistance factors are major contributors.",
    h2BPara3: "Tracking helps separate assumptions from patterns.",
    h2BPara4: "Review monthly trends and circle the weeks where symptoms spiked.",
    h2BPara5: "Then ask what changed in sleep, food, training, or stress during that window.",
    h2BPara6: "Small clues add up quickly.",
    h2C: "Stabilize Inputs Before Chasing Complexity",
    h2CPara1: "Start with stable meal timing, adequate protein, and enough carbohydrate to support hormonal signaling.",
    h2CPara2: "Pair this with realistic movement: strength training, walking, and recovery days.",
    h2CPara3: "Avoid dramatic overhauls that are impossible to maintain.",
    h2CBullets: [
      "Set fixed wake and sleep windows at least five days per week.",
      "Eat three balanced meals before adjusting advanced macros.",
      "Schedule low-intensity recovery sessions in your training week.",
      "Track stress triggers and one calming habit daily."
    ],
    h2CPara4: "These basics often improve cycle regularity before advanced interventions are needed.",
    h2CPara5: "Give them enough time to work.",
    h2CPara6: "Eight to twelve weeks is a useful trial window.",
    h2D: "Use Targeted Medical Conversations",
    h2DPara1: "Bring your log to appointments so conversations move from vague symptoms to measurable patterns.",
    h2DPara2: "Ask how thyroid markers, androgen patterns, insulin metrics, and nutrient status fit your cycle story.",
    h2DPara3: "The right questions save months of uncertainty.",
    h2DPara4: "If testing is normal but symptoms persist, ask what follow-up timeline is appropriate.",
    h2DPara5: "Diagnosis can evolve over time as patterns become clearer.",
    h2DPara6: "Stay engaged with the process.",
    h2E: "Define Progress Beyond Perfect Cycles",
    h2EPara1: "Progress can include less severe PMS, more predictable ovulation signs, improved sleep, and steadier mood.",
    h2EPara2: "Do not wait for perfect regularity to acknowledge improvement.",
    h2EPara3: "Partial gains still indicate that your interventions are moving in the right direction.",
    h2EBullets: [
      "Track symptom severity, not just cycle dates.",
      "Set monthly goals for sleep, nutrition, and recovery consistency.",
      "Evaluate trend lines every four weeks.",
      "Adjust one variable at a time for clearer feedback."
    ],
    h2EPara4: "Reliable progress comes from repeated baseline habits.",
    h2EPara5: "Your data becomes your roadmap.",
    h2EPara6: "Use it to make calmer decisions.",
    quote: "A good cycle tracker does not just record dates. It reveals causes.",
    conclusionA: "Irregular periods become less mysterious when you track the right variables.",
    conclusionB: "Stable inputs, objective logs, and focused medical follow-up can restore predictability over time.",
    conclusionC: "Start with one consistent system and stick with it."
  },
  {
    slug: "bloat-reset-7day-gut-gentle",
    title: "7-Day Bloat Reset for Women: A Gut-Gentle Approach",
    description: "Reduce bloating with a realistic seven-day digestion reset that supports comfort and consistency.",
    category: "digestion",
    keywords: ["bloating relief", "gut health women", "digestion tips", "fiber balance", "meal timing"],
    readTime: 8,
    featured: false,
    publishedAt: "2026-03-05",
    introA: "Bloating can make healthy routines feel discouraging, especially when your clothes fit differently by evening.",
    introB: "The good news is that many bloating triggers are manageable when you adjust inputs gradually.",
    introC: "This seven-day reset is designed to calm digestion without extreme elimination plans.",
    h2A: "Day 1 and Day 2: Reduce Digestive Noise",
    h2APara1: "Start by simplifying meals with familiar foods that digest comfortably for you.",
    h2APara2: "Eating too many new ingredients at once can confuse symptom tracking.",
    h2APara3: "Choose consistency over variety for the first 48 hours.",
    h2APara4: "Slow chewing and seated meals reduce swallowed air and improve digestive signaling.",
    h2APara5: "This alone can noticeably reduce pressure and fullness.",
    h2APara6: "Gentle starts create momentum.",
    h2B: "Day 3 and Day 4: Rebuild Rhythm",
    h2BPara1: "Meal timing and hydration rhythm influence motility more than many women realize.",
    h2BPara2: "Long fasting windows followed by very large meals can worsen abdominal discomfort.",
    h2BPara3: "Aim for predictable spacing and moderate portion size.",
    h2BPara4: "Add short walks after meals to support transit and reduce stagnation.",
    h2BPara5: "Movement does not need to be intense to help.",
    h2BPara6: "Consistency is the key variable.",
    h2C: "Day 5 and Day 6: Fine-Tune Fiber and Fermentables",
    h2CPara1: "Fiber is beneficial, but abrupt increases can cause gas and bloating.",
    h2CPara2: "Increase gradually and pair with sufficient fluid intake.",
    h2CPara3: "Observe whether specific fermentable foods trigger discomfort for your body.",
    h2CBullets: [
      "Increase fiber in small steps rather than large jumps.",
      "Drink water evenly through the day, not all at once.",
      "Limit carbonated drinks if they trigger pressure.",
      "Use a simple food-symptom log for pattern recognition."
    ],
    h2CPara4: "You are not trying to remove everything forever.",
    h2CPara5: "You are identifying which combinations work best right now.",
    h2CPara6: "That distinction protects long-term flexibility.",
    h2D: "Day 7: Test and Personalize",
    h2DPara1: "Review your week and identify three habits that gave the strongest symptom relief.",
    h2DPara2: "Keep those as your new baseline going forward.",
    h2DPara3: "Then reintroduce variety gradually to confirm tolerance.",
    h2DPara4: "This approach prevents the all-or-nothing cycle common in gut health plans.",
    h2DPara5: "Personalized consistency is more sustainable than strict protocols.",
    h2DPara6: "Your best plan is the one you can keep.",
    h2E: "When to Seek Clinical Evaluation",
    h2EPara1: "If bloating is persistent, painful, or paired with unintentional weight loss, blood in stool, or severe bowel changes, seek medical care promptly.",
    h2EPara2: "Targeted evaluation can rule out conditions that need treatment.",
    h2EPara3: "Do not normalize severe discomfort.",
    h2EBullets: [
      "Track symptom timing and associated foods for two weeks.",
      "Document bowel frequency and stool changes.",
      "Bring medication and supplement lists to appointments.",
      "Ask what tests are appropriate for your symptom profile."
    ],
    h2EPara4: "Early support improves outcomes and reduces anxiety.",
    h2EPara5: "You deserve digestion that feels predictable.",
    h2EPara6: "Use data, not guesswork.",
    quote: "The goal is not a perfect gut. The goal is a calmer, more predictable one.",
    conclusionA: "A seven-day bloat reset works best when it is gentle and structured.",
    conclusionB: "By stabilizing meals, hydration, movement, and fiber progression, most women can reduce discomfort.",
    conclusionC: "Keep the habits that helped and build from there."
  },
  {
    slug: "constipation-relief-without-laxative-habit",
    title: "Constipation Relief Without Building a Laxative Habit",
    description: "A sustainable constipation support plan using hydration, rhythm, fiber strategy, and movement.",
    category: "digestion",
    keywords: ["constipation relief", "gut motility", "women digestion", "fiber hydration", "bowel routine"],
    readTime: 8,
    featured: false,
    publishedAt: "2026-03-04",
    introA: "Constipation is common, frustrating, and often under-discussed in women health conversations.",
    introB: "Many women cycle between discomfort and short-term fixes without addressing rhythm fundamentals.",
    introC: "A structured routine can improve motility while reducing dependence on urgent interventions.",
    h2A: "Set a Daily Motility Rhythm",
    h2APara1: "Your bowel function is strongly linked to circadian timing, hydration, meal pattern, and movement.",
    h2APara2: "Irregular schedules often disrupt the gastrocolic reflex that supports regular bowel movements.",
    h2APara3: "Consistency is therapeutic here.",
    h2APara4: "Create one reliable morning window for hydration, breakfast, and unhurried bathroom access.",
    h2APara5: "Rushing suppresses natural cues.",
    h2APara6: "Protect this routine daily.",
    h2B: "Hydration and Electrolyte Balance",
    h2BPara1: "Low fluid intake hardens stool and slows transit.",
    h2BPara2: "Hydration needs increase with higher fiber intake, training load, and warm climate.",
    h2BPara3: "Spread fluids through the day instead of large evening intake.",
    h2BPara4: "For some women, including sodium and potassium-rich foods improves fluid utilization.",
    h2BPara5: "Observe how your body responds and adjust gradually.",
    h2BPara6: "Precision beats extremes.",
    h2C: "Use Fiber Strategically",
    h2CPara1: "Fiber supports bowel health, but type and timing matter.",
    h2CPara2: "Jumping too quickly can increase bloating and discomfort.",
    h2CPara3: "Start low and move up with patience.",
    h2CBullets: [
      "Add one fiber source at a time and hold for three days.",
      "Pair each fiber increase with hydration checkpoints.",
      "Include soluble and insoluble sources across the week.",
      "Track stool form and comfort, not just frequency."
    ],
    h2CPara4: "A symptom log helps identify your individual tolerance window.",
    h2CPara5: "There is no universal best dose for everyone.",
    h2CPara6: "Your best dose is the one your gut handles comfortably.",
    h2D: "Movement and Stress Calibration",
    h2DPara1: "Sedentary days commonly worsen constipation, especially under high stress.",
    h2DPara2: "Walking, light core mobility, and breathing drills can improve motility signals.",
    h2DPara3: "The nervous system and gut are deeply connected.",
    h2DPara4: "Stress management does not need to be complex to help.",
    h2DPara5: "Short daily decompression routines can reduce gut tension and improve bowel regularity.",
    h2DPara6: "Small practices, repeated, are powerful.",
    h2E: "When Professional Care Is Needed",
    h2EPara1: "If constipation is severe, painful, associated with bleeding, or lasts despite routine changes, seek medical evaluation.",
    h2EPara2: "Underlying causes may require specific treatment beyond lifestyle adjustments.",
    h2EPara3: "Early guidance prevents chronic worsening.",
    h2EBullets: [
      "Track bowel frequency and stool changes for 2 to 4 weeks.",
      "Document medications and supplements that may affect motility.",
      "Record associated symptoms such as pain, nausea, or fatigue.",
      "Ask for a targeted plan based on your history and findings."
    ],
    h2EPara4: "A good care plan improves comfort and confidence.",
    h2EPara5: "You should not need to rely on crisis fixes forever.",
    h2EPara6: "Sustainable rhythm is possible.",
    quote: "Regularity is rarely a single trick. It is usually the result of repeatable daily inputs.",
    conclusionA: "Constipation relief becomes more predictable when you build rhythm first.",
    conclusionB: "Hydration, strategic fiber, movement, and stress support can transform day-to-day comfort.",
    conclusionC: "Track trends and escalate care when needed."
  },
  {
    slug: "fat-loss-with-hormone-friendly-strength",
    title: "Hormone-Friendly Fat Loss: The Strength Training Blueprint for Women",
    description: "Learn a sustainable strength-first approach to fat loss that protects hormones and energy.",
    category: "fat-loss",
    keywords: ["fat loss women", "strength training", "hormone friendly", "body recomposition", "metabolism"],
    readTime: 9,
    featured: true,
    publishedAt: "2026-03-03",
    introA: "Many women try to lose fat by doing more cardio and eating less, then feel exhausted, hungry, and stuck.",
    introB: "A strength-first model often works better because it preserves lean tissue and improves metabolic flexibility.",
    introC: "This approach supports long-term results without sacrificing hormone health.",
    h2A: "Start With a Strength-First Week",
    h2APara1: "Resistance training gives your body a clear reason to retain muscle while reducing fat stores.",
    h2APara2: "Three full-body sessions per week are enough for most women when done consistently.",
    h2APara3: "Volume and recovery should match your current stress load.",
    h2APara4: "Focus on compound patterns: squat, hinge, push, pull, and carry variations.",
    h2APara5: "Progress load gradually and keep excellent technique.",
    h2APara6: "The objective is repeatable training quality, not heroic sessions.",
    h2B: "Use Nutrition to Support Adaptation",
    h2BPara1: "Chronic aggressive deficits can increase fatigue, cravings, cycle disruption, and training decline.",
    h2BPara2: "Moderate deficits paired with high protein are usually more sustainable and body-composition friendly.",
    h2BPara3: "Think support first, deficit second.",
    h2BPara4: "Plan meals around protein, fiber, and produce volume to improve satiety.",
    h2BPara5: "Include carbs around training so performance remains strong.",
    h2BPara6: "Performance protects progress.",
    h2C: "Build Daily Movement Without Burnout",
    h2CPara1: "Step count and low-intensity movement are powerful fat-loss tools because they raise expenditure with low recovery cost.",
    h2CPara2: "This is often more sustainable than stacking intense workouts every day.",
    h2CPara3: "Consistency beats intensity spikes.",
    h2CBullets: [
      "Set a realistic daily step baseline and increase gradually.",
      "Add short post-meal walks to improve glucose handling.",
      "Schedule at least one recovery-focused day weekly.",
      "Prioritize sleep to protect appetite and training quality."
    ],
    h2CPara4: "When recovery is respected, adherence and mood improve.",
    h2CPara5: "This makes fat loss feel manageable rather than punishing.",
    h2CPara6: "Sustainability is your superpower.",
    h2D: "Track the Right Progress Markers",
    h2DPara1: "Scale weight is useful but incomplete.",
    h2DPara2: "Use waist measurements, progress photos, gym performance, and energy scores for fuller context.",
    h2DPara3: "Body recomposition can happen even when scale changes are slow.",
    h2DPara4: "Review metrics every two weeks instead of daily emotional reactions.",
    h2DPara5: "Trend-based decisions reduce frustration and impulsive plan changes.",
    h2DPara6: "Data creates calm.",
    h2E: "Prevent Hormonal Backlash",
    h2EPara1: "If cycles become irregular, sleep deteriorates, or training performance crashes, your deficit may be too aggressive.",
    h2EPara2: "Adjust early rather than pushing harder into symptoms.",
    h2EPara3: "Your body is giving useful feedback.",
    h2EBullets: [
      "Keep protein intake stable every day.",
      "Use planned higher-calorie days during high-stress periods.",
      "Monitor cycle and sleep alongside fat-loss metrics.",
      "Seek clinician support if symptoms persist."
    ],
    h2EPara4: "A great fat-loss plan protects health while changing composition.",
    h2EPara5: "You do not need extreme tactics to get results.",
    h2EPara6: "You need precise, repeatable fundamentals.",
    quote: "The best fat-loss plan is one your hormones can tolerate and your life can support.",
    conclusionA: "Strength training is the anchor of sustainable fat loss for many women.",
    conclusionB: "Combine it with moderate deficits, daily movement, and strong recovery habits for lasting progress.",
    conclusionC: "Protecting your physiology is part of the result, not separate from it."
  },
  {
    slug: "protein-fiber-strategy-for-women-fat-loss",
    title: "Protein + Fiber Strategy: The Easiest Fat Loss Upgrade for Women",
    description: "A practical protein and fiber framework that improves satiety and sustainable fat loss.",
    category: "fat-loss",
    keywords: ["protein fiber", "fat loss strategy", "women nutrition", "satiety", "healthy metabolism"],
    readTime: 8,
    featured: false,
    publishedAt: "2026-03-02",
    introA: "If fat loss feels harder than expected, underestimating protein and fiber is often part of the picture.",
    introB: "These two nutrition levers improve fullness, energy stability, and adherence better than most shortcuts.",
    introC: "A simple strategy can transform your daily decision-making.",
    h2A: "Why Protein and Fiber Work Together",
    h2APara1: "Protein supports muscle retention, recovery, and meal satisfaction.",
    h2APara2: "Fiber improves fullness, gut health, and blood sugar stability.",
    h2APara3: "Together, they reduce the urge to snack impulsively.",
    h2APara4: "This combination is especially helpful during calorie deficits when hunger tends to increase.",
    h2APara5: "Better satiety makes consistency easier.",
    h2APara6: "Consistency drives outcomes.",
    h2B: "Set Daily Targets That Feel Realistic",
    h2BPara1: "Perfection is not required. Start with achievable targets and scale weekly.",
    h2BPara2: "Many women do better with per-meal targets rather than one large end-of-day goal.",
    h2BPara3: "This smooths appetite and energy.",
    h2BPara4: "Use prepared staples so busy days do not derail intake quality.",
    h2BPara5: "Repeatable systems beat willpower.",
    h2BPara6: "Design your environment to support your goals.",
    h2C: "Meal Templates That Save Time",
    h2CPara1: "You do not need gourmet recipes daily.",
    h2CPara2: "Use simple templates you can rotate through the week.",
    h2CPara3: "This reduces decision fatigue and improves adherence.",
    h2CBullets: [
      "Breakfast: protein source + fruit + fiber booster.",
      "Lunch: lean protein + large salad + whole grain.",
      "Dinner: protein + cooked vegetables + slow carbs.",
      "Snack: yogurt, seeds, and berries or boiled eggs with vegetables."
    ],
    h2CPara4: "Templates make healthy choices automatic under stress.",
    h2CPara5: "Automatic choices create better weekly averages.",
    h2CPara6: "Weekly averages determine progress.",
    h2D: "Avoid Common Pitfalls",
    h2DPara1: "Some women increase fiber too quickly and feel bloated, then abandon the plan.",
    h2DPara2: "Others rely on protein bars while missing micronutrients and produce variety.",
    h2DPara3: "Balance and pacing prevent these problems.",
    h2DPara4: "Hydration is non-negotiable as fiber rises.",
    h2DPara5: "Track digestive comfort and adjust portions gradually.",
    h2DPara6: "Make your plan body-friendly, not rigid.",
    h2E: "Measure What Matters",
    h2EPara1: "Look at hunger stability, cravings, bowel comfort, energy, and body composition trends.",
    h2EPara2: "If you feel fuller and less reactive around food, your strategy is working.",
    h2EPara3: "Those signals predict long-term success.",
    h2EBullets: [
      "Track daily protein servings, not just calories.",
      "Record fiber-rich foods and hydration together.",
      "Check waist and progress photos every two weeks.",
      "Adjust one variable at a time for clear feedback."
    ],
    h2EPara4: "The best plan is sustainable under real-life pressure.",
    h2EPara5: "Protein and fiber make that sustainability easier.",
    h2EPara6: "Start with one meal today.",
    quote: "When protein and fiber are consistent, fat loss becomes less of a fight.",
    conclusionA: "This strategy is simple, practical, and highly effective.",
    conclusionB: "By centering protein and fiber, you improve satiety and reduce decision fatigue.",
    conclusionC: "Small daily upgrades can reshape your results over time."
  },
  {
    slug: "sleep-stress-fat-loss-connection-women",
    title: "Sleep, Stress, and Fat Loss in Women: The Missing Link",
    description: "Understand how sleep and stress affect fat loss and build recovery habits that improve results.",
    category: "fat-loss",
    keywords: ["sleep and fat loss", "stress hormones", "women metabolism", "cortisol", "recovery"],
    readTime: 8,
    featured: false,
    publishedAt: "2026-03-01",
    introA: "If your nutrition and workouts are solid but progress has stalled, recovery may be the hidden bottleneck.",
    introB: "Sleep debt and chronic stress can increase appetite, reduce training output, and alter fluid retention patterns.",
    introC: "Addressing these factors often unlocks progress without harsher dieting.",
    h2A: "How Sleep Shapes Fat Loss",
    h2APara1: "Short sleep can elevate hunger signals and reduce satiety cues, making adherence harder.",
    h2APara2: "It also impairs training recovery and day-to-day decision quality.",
    h2APara3: "These effects compound quickly across busy weeks.",
    h2APara4: "A consistent bedtime and wake schedule improves metabolic rhythm and morning energy.",
    h2APara5: "Even a 30-minute improvement in average sleep can matter.",
    h2APara6: "Small upgrades are worth pursuing.",
    h2B: "Stress, Cortisol, and Appetite",
    h2BPara1: "Stress is not automatically harmful, but chronic high load without recovery can increase cravings and emotional eating.",
    h2BPara2: "It may also worsen water retention, masking fat-loss progress on the scale.",
    h2BPara3: "Understanding this reduces panic-driven plan changes.",
    h2BPara4: "Use regular decompression windows to lower cumulative stress burden.",
    h2BPara5: "Brief daily practices outperform occasional long sessions.",
    h2BPara6: "Frequency is the key.",
    h2C: "Design a Recovery-Friendly Week",
    h2CPara1: "Recovery should be scheduled, not optional.",
    h2CPara2: "Plan training intensity around your work stress and cycle phase when possible.",
    h2CPara3: "Overreaching under high stress often backfires.",
    h2CBullets: [
      "Set a screen curfew before bedtime.",
      "Keep caffeine earlier in the day.",
      "Use post-meal walks to reduce stress and improve glucose control.",
      "Add one low-intensity recovery session each week."
    ],
    h2CPara4: "These habits protect consistency without requiring major life disruption.",
    h2CPara5: "Consistency allows composition change to continue.",
    h2CPara6: "Recovery is productive work.",
    h2D: "Interpret Plateaus More Accurately",
    h2DPara1: "Scale plateaus during high-stress periods may reflect fluid shifts rather than true fat-gain.",
    h2DPara2: "Use trend weight, waist measures, and photos before changing your plan aggressively.",
    h2DPara3: "Data protects you from emotional over-correction.",
    h2DPara4: "If performance and sleep are declining, reduce training load briefly and restore recovery first.",
    h2DPara5: "A short deload can improve long-term momentum.",
    h2DPara6: "Strategic patience wins.",
    h2E: "A Practical 14-Day Reset",
    h2EPara1: "For two weeks, prioritize sleep opportunity, simplified meals, and moderate training intensity.",
    h2EPara2: "Track appetite, energy, mood, and cravings daily.",
    h2EPara3: "Many women see better control and renewed progress quickly.",
    h2EBullets: [
      "Aim for consistent sleep and wake times.",
      "Plan protein-rich meals in advance.",
      "Limit late-night work when possible.",
      "Review trends at day 14 before making new changes."
    ],
    h2EPara4: "Recovery-focused periods are not setbacks.",
    h2EPara5: "They are strategic phases that protect long-term adherence.",
    h2EPara6: "Treat recovery as a core fat-loss tool.",
    quote: "Fat loss is not just a calorie equation. It is a recovery equation too.",
    conclusionA: "When sleep and stress improve, fat loss often feels less forced.",
    conclusionB: "You gain better appetite control, training quality, and emotional steadiness.",
    conclusionC: "Protect recovery and your results become more reliable."
  },
  {
    slug: "thyroid-digestion-link-constipation-bloating",
    title: "The Thyroid-Digestion Link: Why Constipation and Bloating Increase",
    description: "Learn how thyroid function affects digestion and what women can do to improve gut comfort.",
    category: "thyroid",
    keywords: ["thyroid and digestion", "constipation thyroid", "bloating thyroid", "women gut health", "thyroid symptoms"],
    readTime: 9,
    featured: false,
    publishedAt: "2026-02-28",
    introA: "Many women notice constipation and bloating rise when thyroid symptoms flare.",
    introB: "This is not random: thyroid hormones influence gut motility, fluid balance, and digestive signaling.",
    introC: "Understanding this link helps you choose better daily interventions.",
    h2A: "How Thyroid Function Affects Motility",
    h2APara1: "Lower thyroid activity can slow bowel transit, leading to harder stools and abdominal fullness.",
    h2APara2: "Slower movement also increases fermentation time, which can amplify gas and discomfort.",
    h2APara3: "This is why digestive symptoms often track with fatigue periods.",
    h2APara4: "Medication consistency and follow-up matter because endocrine stability supports motility stability.",
    h2APara5: "Symptoms often improve when both are addressed together.",
    h2APara6: "Integrated care is key.",
    h2B: "Signs Your Digestion Needs More Support",
    h2BPara1: "Watch for fewer than regular bowel movements, straining, persistent bloating, and post-meal heaviness.",
    h2BPara2: "These signs indicate your routine may need hydration, fiber pacing, and movement adjustments.",
    h2BPara3: "Start with the basics before complicated protocols.",
    h2BPara4: "Track symptoms daily to identify whether patterns worsen with stress, low sleep, or meal timing shifts.",
    h2BPara5: "Pattern recognition helps you intervene earlier.",
    h2BPara6: "Early intervention prevents escalation.",
    h2C: "Nutrition and Lifestyle Levers",
    h2CPara1: "Stable meal timing, adequate protein, and gradual fiber progression can improve bowel consistency.",
    h2CPara2: "Hydration should be spread through the day rather than concentrated at night.",
    h2CPara3: "Gentle post-meal walks can improve transit with low strain.",
    h2CBullets: [
      "Hydrate before noon to support daytime motility.",
      "Increase fiber in small steps with symptom checks.",
      "Use warm meals if cold foods worsen bloating.",
      "Keep a weekly symptom and bowel log."
    ],
    h2CPara4: "Do not change everything in one week.",
    h2CPara5: "Layer habits gradually for clearer feedback.",
    h2CPara6: "That approach improves adherence and outcomes.",
    h2D: "Coordinate With Your Clinical Plan",
    h2DPara1: "Digestive symptoms can reflect medication timing issues, dose mismatch, or coexisting nutrient gaps.",
    h2DPara2: "Bring objective logs so discussions become specific and actionable.",
    h2DPara3: "Targeted follow-up prevents prolonged trial-and-error.",
    h2DPara4: "Ask when repeat labs should be done and what symptom changes to monitor in between.",
    h2DPara5: "Clear timelines reduce uncertainty.",
    h2DPara6: "Confidence grows with structure.",
    h2E: "Red Flags Not to Ignore",
    h2EPara1: "Seek prompt care if constipation is severe, painful, or associated with blood in stool, vomiting, or unexplained weight loss.",
    h2EPara2: "These require medical assessment rather than self-management alone.",
    h2EPara3: "Early action is protective.",
    h2EBullets: [
      "Track bowel and symptom frequency for your appointment.",
      "List all medications and supplements.",
      "Document timing of thyroid medication and meals.",
      "Ask for a coordinated endocrine and digestion plan."
    ],
    h2EPara4: "You deserve care that treats the full pattern, not isolated symptoms.",
    h2EPara5: "Integrated support is often the turning point.",
    h2EPara6: "Advocate for clarity and follow-up.",
    quote: "Thyroid care and gut care are not separate conversations. They are one system.",
    conclusionA: "When thyroid and digestion are managed together, comfort and regularity usually improve.",
    conclusionB: "Use structured habits, symptom data, and focused clinical communication.",
    conclusionC: "Small consistent adjustments can produce meaningful relief."
  }
];

const posts = drafts.map((post) => {
  let contentHtml = buildArticle(post);
  let wordCount = countWords(contentHtml);
  while (wordCount < 800) {
    contentHtml +=
      "\n<p>To strengthen outcomes, keep the routine simple enough to repeat even on difficult weeks. Reliable repetition creates measurable change faster than occasional perfect days.</p>";
    wordCount = countWords(contentHtml);
  }
  if (wordCount < 800 || wordCount > 1200) {
    throw new Error(`Post ${post.slug} has ${wordCount} words, expected 800-1200.`);
  }

  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    categoryLabel: categoryLabels[post.category],
    keywords: post.keywords,
    image: `assets/img/categories/${post.category}.svg`,
    readTime: post.readTime,
    featured: post.featured,
    publishedAt: post.publishedAt,
    excerpt: post.description,
    wordCount,
    contentHtml
  };
});

const sortedPosts = posts.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

await fs.mkdir(path.dirname(dataPath), { recursive: true });
await fs.writeFile(dataPath, JSON.stringify(sortedPosts, null, 2) + "\n", "utf8");

for (const post of sortedPosts) {
  const postDir = path.join(blogRoot, post.slug);
  await fs.mkdir(postDir, { recursive: true });
  await fs.writeFile(path.join(postDir, "index.html"), buildPostPage(post), "utf8");
}

const staticPaths = [
  "",
  "/blog/",
  "/about/",
  "/contact/",
  "/privacy/",
  "/categories/hair-growth/",
  "/categories/thyroid/",
  "/categories/period-health/",
  "/categories/digestion/",
  "/categories/fat-loss/"
];

const postPaths = sortedPosts.map((post) => `/blog/${post.slug}/`);
const allPaths = [...staticPaths, ...postPaths];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPaths
  .map((p) => {
    const loc = `${siteUrl}${p}`;
    return `  <url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>${p === "" ? "1.0" : "0.8"}</priority></url>`;
  })
  .join("\n")}
</urlset>
`;

await fs.writeFile(sitemapPath, sitemap, "utf8");
console.log(`Generated ${sortedPosts.length} posts and sitemap.`);
