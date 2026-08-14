

// ===== DEV QUOTE =====
const fallbackQuotes = [
  {"q":"First, solve the problem. Then, write the code.","a":"John Johnson"},
  {"q":"Simplicity is the soul of efficiency.","a":"Austin Freeman"},
  {"q":"Code is like humor. When you have to explain it, it\'s bad.","a":"Cory House"},
  {"q":"In order to be irreplaceable, one must always be different.","a":"Coco Chanel"},
  {"q":"The best way to predict the future is to invent it.","a":"Alan Kay"},
];
async function loadQuote() {
  let q, a;
  try {
    const r = await fetch('https://programming-quotesapi.vercel.app/api/random');
    const d = await r.json();
    q = d.quote; a = d.author;
  } catch(e) {
    const fb = fallbackQuotes[Math.floor(Math.random()*fallbackQuotes.length)];
    q = fb.q; a = fb.a;
  }
  document.getElementById('devQuote').innerHTML = '&ldquo;' + q + '&rdquo;<br><small style="font-style:normal;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:var(--gold);font-family:\'Manrope\',sans-serif;font-weight:700;">— ' + a + '</small>';
}
loadQuote();

// ===== AI CHATBOT =====
const BIKASH_SYSTEM = `You are an AI assistant for Bikash Talukder's personal portfolio website. Answer questions about Bikash in a friendly, concise, and professional tone. Here is everything you know about Bikash:

NAME: Bikash Talukder
LOCATION: Bangladesh
STATUS: 2nd Year Computer Science & Engineering (CSE) student

SKILLS:
- Programming: C (88%), C++ (88%), Python (80%), Java (60%), HTML/CSS (70%)
- CS Fundamentals: Data Structures & Algorithms (75%)
- Hardware: Arduino (45%), Robotics Basics (35%)
- Tools: Microsoft Excel, PowerPoint

PROJECTS:
1. Digital Clock (C) - Terminal-based clock using POSIX threads, mutex locks, ANSI escape codes. Runs on macOS & Linux. GitHub: github.com/bikash-20/C-project
2. Echoes of the Void (C++) - Full text-adventure RPG with turn-based combat, puzzles, OOP design. GitHub: github.com/bikash-20/cpp-project
3. Google Maps Navigator (C++ + HTML) - Navigation system using Dijkstra's algorithm with Raylib graphics, 15-node city graph, animated car movement, web version. GitHub: github.com/bikash-20/google-maps-navigator-DSA-project
4. Nexora (HTML + CSS + JavaScript + PWA) - Futuristic AI companion web app. Features smart intent detection engine (math, currency, unit conversion, medical, tech news, conversation), multi-model AI compare with synthesis verdict, voice I/O, offline-ready PWA installable on any device, Pollinations.ai free fallback, memory, dark/light mode, markdown rendering. GitHub: github.com/bikash-20

RESEARCH INTERESTS:
- Artificial Intelligence & intelligent systems
- Machine Learning & model optimization
- Embedded Systems & IoT
- Large Language Models & NLP
- Quantum Algorithms & complexity theory
- Big Data (Hadoop, Spark)

COMPETITIVE PROGRAMMING:
- Codeforces handle: talukder_20
- LeetCode handle: bikashtalukder

CONTACT:
- Phone: +880 1926 240 062
- GitHub: github.com/bikash-20
- LinkedIn: linkedin.com/in/bikash-talukder-6497633b8
- Facebook: facebook.com/profile.php?id=61577923653790
- Instagram: instagram.com/talukder_20
- Codeforces: codeforces.com/profile/talukder_20
- LeetCode: leetcode.com/u/bikashtalukder

PERSONALITY/BIO: Passionate, ambitious, curious problem-solver. Loves algorithms, bridges hardware and software. Motto: "Always learning. Always building."

Keep responses concise (2-4 sentences max unless listing things). Be warm and helpful. If asked something not about Bikash, gently redirect to topics about him.`;

let chatHistory = [];

// ===== SMART LOCAL REPLY ENGINE =====
function generateSmartReply(input) {
  const q = input.toLowerCase().trim();

  // ── SAFETY NET: route all conversational queries to convoEngine ──
  // This ensures convo replies work even if detectIntent missed them
  if (/^(hi|hello|hey|sup|yo|hola|howdy)\b/.test(q)) return convoEngine(input);
  if (/\bi love you\b|love you nexora/.test(q)) return convoEngine(input);
  if (/good morning|good night|good evening|\bgm\b|\bgn\b/.test(q)) return convoEngine(input);
  if (/\bthank(s| you)\b|\bthx\b/.test(q)) return convoEngine(input);
  if (/\b(bye|goodbye|see you|take care|cya)\b/.test(q)) return convoEngine(input);
  if (/how are you|how'?s it going/.test(q)) return convoEngine(input);
  if (/i'?m (feeling |)(sad|depressed|upset|stressed|anxious|overwhelmed|bored|so bored|happy|excited|tired|exhausted)/.test(q)) return convoEngine(input);
  if (/i am (sad|bored|happy|stressed|tired)/.test(q)) return convoEngine(input);
  if (/i feel (sad|bored|happy|stressed|tired|lonely|lost|great|amazing)/.test(q)) return convoEngine(input);
  if (/\b(exam|test).*(tomorrow|today|tonight)/.test(q)) return convoEngine(input);
  if (/\b(help me study|study tips|make.*routine|pomodoro)\b/.test(q)) return convoEngine(input);
  if (/what should i eat|i'?m hungry|food suggest/.test(q)) return convoEngine(input);
  if (/\b(recommend|suggest).*(movie|film|song|music|playlist)\b/.test(q)) return convoEngine(input);
  if (/\b(tell.*joke|make me laugh|\bjoke\b|funny)\b/.test(q)) return convoEngine(input);
  if (/\b(motivate me|giving up|i need encouragement|say something positive)\b/.test(q)) return convoEngine(input);
  if (/\broast me\b|\bcompliment me\b/.test(q)) return convoEngine(input);
  if (/\b(surprise me|fun fact|tell me something|something interesting|did you know)\b/.test(q)) return convoEngine(input);
  if (/\b(challenge me|give.*task|what should i learn today)\b/.test(q)) return convoEngine(input);
  if (/\b(act like|jarvis mode|hacker mode|teacher mode|friend mode)\b/.test(q)) return convoEngine(input);
  if (/\b(what can i do|i'?m bored|nothing to do|suggest.*do)\b/.test(q)) return convoEngine(input);
  if (/who (made|built|created) you|what'?s your name|introduce yourself/.test(q)) return convoEngine(input);
  if (/do you have feelings|are you (real|human|alive|conscious)|do you sleep/.test(q)) return convoEngine(input);
  if (/how to stay (consistent|disciplined|focused)|life advice|how to be successful/.test(q)) return convoEngine(input);
  if (/i'?m not confident|i'?m struggling|i feel like giving up|i failed/.test(q)) return convoEngine(input);

  // ── FULL INTRO / WHO IS BIKASH ─────────────────────────────────
  if (/who is bikash|about bikash|tell me about (him|bikash|yourself)|introduce|overview/.test(q)) {
    return "Bikash Talukder is a CSE student, systems thinker, and quiet builder from <strong>Ramdigha village, Sylhet, Bangladesh</strong> 🇧🇩.<br><br>He grew up in the discipline of village life — and that grounded philosophy shaped everything: he writes <strong>powerful, efficient, dependency-free code</strong>; lives as a committed <strong>Vegan</strong>; keeps a small, loyal circle of friends; and describes himself as a <em>\"Selective Extrovert\"</em> — deeply introverted by nature, yet articulate and confident when in his element.<br><br>His motto: <em>\"Always learning. Always building.\"</em> 💙";
  }

  // ── SYLHET CITY ───────────────────────────────────────────────
  if (/sylhet(?! university| agricultural| board| city college)|\bhaor\b|ratargul|jaflong|bisnakandi|tanguar|shah jalal|shah paran|sreemangal|shatkora|sylheti|tea garden|tea capital/.test(q)) {
    return "🌿 <strong>Sylhet</strong> — a peaceful city full of nature, culture, and spirit. Bikash's home city, and one of the most beautiful in Bangladesh.<br><br>📍 <strong>Location:</strong> Northeast Bangladesh, close to India's Meghalaya state — surrounded by hills, rivers, and haors.<br><br>🌄 <strong>Natural Beauty:</strong><br>• <strong>Tea Gardens</strong> — Sylhet is the heart of Bangladesh's tea industry. Sreemangal is the \"Tea Capital\" 🌱<br>• <strong>Jaflong</strong> — stones, river, and hills from India<br>• <strong>Ratargul Swamp Forest</strong> — the only freshwater swamp forest in Bangladesh<br>• <strong>Bisnakandi</strong> — crystal clear water + mountain views<br>• <strong>Tanguar Haor</strong> — completely flooded in monsoon, breathtakingly beautiful 🌧️<br><br>🕌 <strong>Spiritual Heart:</strong><br>• Hazrat Shah Jalal Mazar — one of the most important Islamic sites in Bangladesh<br>• Hazrat Shah Paran Mazar — another deeply respected shrine<br><br>🍲 <strong>Food:</strong> Shatkora beef 🍛, fresh river fish 🐟, Seven-layer tea ☕<br><br>🗣️ <strong>People:</strong> Sylheti dialect, large UK diaspora 🇬🇧, friendly and culturally rich<br><br>🌦️ <strong>Weather:</strong> One of the wettest regions in Bangladesh — cool, green, and lush<br><br>❤️ Sylhet is not just a city — it's a feeling. Calm, natural, spiritual, and perfect for a student who loves both code and peace. ✦";
  }

  // ── BODY COUNT / FUNNY DEFLECTION ────────────────────────────
  if (/body count|how many.*girls|how many.*guys|how many.*dated|relationship.*count|ex.*count/.test(q)) {
    const jokes = [
      "😂 \"Why? Trying to compare or just insecure?\"",
      "😄 \"Don't worry, you're not on the list.\"",
      "💀 \"Less than your assumptions, more than your standards.\""
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }


  // ── SUST ──────────────────────────────────────────────────────
  if (/\bsust\b|shahjalal|kumargaon/.test(q)) {
    return "🎓 <strong>Shahjalal University of Science and Technology (SUST)</strong><br><br>One of the most respected public universities in Bangladesh — and Bikash's friend Susmit studies here!<br><br>📍 <strong>Location:</strong> Kumargaon, Sylhet · <strong>Est:</strong> 1986 · First university in Bangladesh to introduce the semester system.<br><br>🏫 <strong>Key Schools:</strong><br>• <strong>Applied Sciences & Technology</strong> — CSE, SWE, EEE, Civil, Chemical, Mechanical Engineering<br>• <strong>Physical Sciences</strong> — Physics, Chemistry, Mathematics, Statistics<br>• <strong>Life Sciences</strong> — Biotech, Forestry, Food Engineering & Tea Technology 🌱<br>• <strong>Social Sciences</strong> — Economics, Sociology, Political Studies<br>• <strong>Business</strong> — BBA/MBA<br>• <strong>Arts & Humanities</strong> — English, Bangla<br><br>💻 <strong>Why SUST stands out:</strong><br>• 🔥 CSE & SWE are among the top in Bangladesh<br>• Strong ICPC & competitive programming culture<br>• Better research opportunities than most universities<br>• Many graduates at top global tech companies<br><br>🌳 Green, peaceful campus with hills, tea gardens, and a seriously academic vibe. ✦";
  }

  // ── METROPOLITAN UNIVERSITY ───────────────────────────────────
  if (/metropolitan university|\bmetropolitan\b|\bmu\b|bateshwar/.test(q)) {
    return "🎓 <strong>Metropolitan University (MU)</strong> — Bikash's university! 🙌<br><br>📍 <strong>Location:</strong> Bateshwar, Sylhet · <strong>Est:</strong> 2003 · <strong>Type:</strong> Private (UGC approved) · Permanent charter received in 2024.<br><br>🏫 <strong>Schools & Programs:</strong><br>• <strong>Science & Technology</strong> — CSE, SWE, EEE, Data Science · <em>Bikash's department!</em><br>• <strong>Business & Economics</strong> — BBA, Economics<br>• <strong>Law & Justice</strong> — LLB<br>• <strong>Humanities</strong> — English<br><br>🎓 <strong>Degrees:</strong> BSc, BBA, BA, LLB (undergrad) · MBA, MA, MSc, LLM (postgrad) · Short courses in Android Dev & Microcontrollers<br><br>💻 <strong>Strengths:</strong><br>• Strong in CSE & Software Engineering<br>• Practical learning — projects, programming contests<br>• Industry-focused skills<br>• Green, calm campus in Bateshwar 🌿<br><br>🏆 <strong>Honest ranking for CSE in Sylhet:</strong><br>🥇 SUST — top tier, most competitive<br>🥈 <strong>MU — best private option</strong> (skill depends on you 💪)<br>🥉 LU — decent, less active coding culture<br><br>💣 Brutal truth: University gives you the platform — but your skill depends on YOU. A hardworking MU student can absolutely beat an average SUST student. Bikash is proof. 🔥";
  }

  // ── LEADING UNIVERSITY ────────────────────────────────────────
  if (/leading university|\bleading uni|\blu\b/.test(q)) {
    return "🎓 <strong>Leading University (LU)</strong> — one of the older private universities in Sylhet.<br><br>📍 <strong>Location:</strong> Sylhet · <strong>Type:</strong> Private university<br><br>🏫 <strong>Programs:</strong> Engineering (CSE, EEE), Business (BBA/MBA), Law, English<br><br>✔️ <strong>Strengths:</strong> Stable faculty, experienced institution, structured learning environment, good for students who want calm consistency<br><br>❗ <strong>Honest weakness:</strong> Less active coding culture compared to MU; fewer high-level competitive programmers<br><br>🏆 <strong>CSE Ranking in Sylhet (brutally honest):</strong><br>🥇 SUST — top tier 🔥<br>🥈 MU — best private, self-driven 💪<br>🥉 <strong>LU — good degree, but grind alone for top-level coding 📉</strong><br><br>💡 Remember: No matter which university, DSA + real projects + Codeforces consistency will take you further than your institution's name ever will. ✦";
  }

  // ── MC COLLEGE ────────────────────────────────────────────────
  if (/mc college|\bmc\b.*college|murari chand|tilagor/.test(q)) {
    return "🎓 <strong>Murari Chand College (MC College)</strong> — one of the oldest and most prestigious colleges in Bangladesh.<br><br>📍 <strong>Location:</strong> Tilagor, Sylhet · <strong>Est:</strong> 1892 · <strong>Type:</strong> Government · Affiliated with National University<br><br>🏛️ <strong>History:</strong> Started 1892, became a first-grade college in 1916. Historically one of the best colleges in the entire subcontinent.<br><br>🎓 <strong>Programs:</strong><br>• HSC — Science group (very competitive in Sylhet)<br>• Undergraduate Honours — Bangla, English, Philosophy, History, Economics, Physics, Chemistry, Mathematics, Zoology, Botany, Sociology, Statistics & more (15+ subjects)<br>• Postgraduate — 16+ Master's programs<br><br>🌳 <strong>Campus:</strong> Beautiful green campus — hills, large field, calm environment. Many say it has a \"classic university vibe.\"<br><br>💪 <strong>Strengths:</strong> Exceptional academic reputation, highly competitive HSC students, strong board results, large alumni network (ministers, scholars, leaders)<br><br>❗ <strong>Honest note:</strong> Not focused on modern tech like CSE — it's a traditional college. Self-study is essential. ✦";
  }

  // ── JALALABAD CANTONMENT SCHOOL ───────────────────────────────
  if (/jalalabad|jcpsc|cantonment school|cantonment college/.test(q)) {
    return "🎓 <strong>Jalalabad Cantonment Public School and College (JCPSC)</strong><br><br>📍 <strong>Location:</strong> Boteshor, Sylhet Sadar — inside Jalalabad Cantonment · <strong>Est:</strong> 4 July 1999<br>📋 <strong>EIIN:</strong> 130459 · <strong>Managed by:</strong> Bangladesh Army · <strong>Motto:</strong> <em>\"জ্ঞানে আলোকিত\"</em> — Enlighten with knowledge<br><br>🏫 <strong>Academic Structure:</strong><br>• School — Class 1 to 10 (Science, Business, Arts; English version available in classes 6–10)<br>• College — HSC with Science, Commerce, and Arts streams<br><br>🏆 <strong>Recognition:</strong><br>• Awarded <strong>\"Best Institution\"</strong> by the President of Bangladesh in 2004<br>• Consistently ranked among the top cantonment schools in Bangladesh<br><br>🏟️ <strong>Facilities:</strong> 1,000-seat auditorium · Football, cricket, basketball, volleyball, table tennis, badminton, handball ✦";
  }

  // ── SCHOLARS HOME ─────────────────────────────────────────────
  if (/scholars.?home|scholarshome|hafiz mazumdar/.test(q)) {
    return "🎓 <strong>Scholarshome Sylhet</strong> — Bikash's college! 🙌<br><br>A well-known English-medium school and college network in Sylhet, set up under the <strong>Hafiz Mazumdar Trust</strong>.<br><br>📚 <strong>What it is:</strong> English-medium institution following the national curriculum, from playgroup right up to HSC (Class XII). Prepares students for SFC, JSC, SSC, and HSC under the Sylhet Education Board.<br><br>🏫 <strong>Campuses:</strong> Six campuses across Sylhet city — Shahi Eidgah, Pathantula, Mejortila, Shibganj, Electric Supply Road, South Surma. Also a separate <strong>Scholarshome Girls' School and College</strong> in Pathantula.<br><br>⭐ <strong>Strengths:</strong><br>• Strong academics + extra-curricular balance<br>• Science clubs, debate, arts, music, drama, scouting<br>• Graduate/postgraduate qualified teachers with regular training<br>• Positioned as one of the <strong>top English-medium schools in Sylhet</strong><br><br>This is where Bikash completed his HSC — a chapter he carries with pride. 💙 ✦";
  }


  // ── INSPIRATION / WHO INSPIRES HIM ────────────────────────────
  if (/inspir|motivat|role model|who drives|why.*work|look up|hero|struggle/.test(q)) {
    return "🌟 <strong>Bikash's greatest inspirations are his Father — Haridhan Talukder — and his Uncle, Aradhan Talukder.</strong><br><br>These two men faced immense hardship and sacrifice to give Bikash the life he has today. During Bikash's lowest, darkest moments, their support was the only reason he kept going. They are not just family — they are the foundation every line of his code is quietly dedicated to.<br><br>Here is what makes this deeply personal: <em>Bikash is a man of very few words.</em> He has never told them face-to-face how much they mean to him. But the entire arc of his work — every project, every late night, every breakthrough — is his tribute to their struggle.<br><br>💔 Aradhan Talukder and his wife <strong>Madhuri Rani Talukder</strong> — who was like a second mother to Bikash — both <strong>passed away in 2025</strong>. The grief of losing them is immeasurable. But Bikash carries them forward in everything he builds. 🙏";
  }

  // ── FATHER ─────────────────────────────────────────────────────
  if (/father|dad|baba|papa/.test(q)) {
    return "👨 Bikash's father is <strong>Haridhan Talukder</strong> — one of his two greatest inspirations in life. His father's sacrifice and hard work through immense struggles gave Bikash the foundation he stands on today. Bikash holds him in the highest honor, even if those words have never been spoken aloud between them. 🙏";
  }

  // ── UNCLE ──────────────────────────────────────────────────────
  // ── MADHURI RANI / SECOND MOM ─────────────────────────────────
  if (/madhuri|second mom|second mother|aradhan.*wife|uncle.*wife/.test(q)) {
    return "🕊️ <strong>Madhuri Rani Talukder</strong> was the wife of Bikash's uncle, Aradhan Talukder — and she was far more than just a relative. To Bikash, she was a <strong>second mother</strong>.<br><br>She cared for him with the same warmth, tenderness, and selflessness that only a mother can give. In moments when Bikash needed nurturing, she was there — quietly, lovingly, without asking for anything in return.<br><br>💔 In <strong>2025</strong>, both she and her husband Aradhan Talukder passed away — two of the most important pillars of Bikash's life, gone within the same year. The grief of losing them both is something that words cannot fully hold.<br><br>Madhuri Rani lives on in the way Bikash carries kindness — in his patience, in his gentleness, in the gratitude behind everything he does. She will never be forgotten. 🌸";
  }

  if (/uncle|aradhan/.test(q)) {
    return "🌟 Bikash's uncle, <strong>Aradhan Talukder</strong>, was one of his two greatest inspirations alongside his father. He stood by Bikash through his hardest times with quiet, unwavering strength — a man whose sacrifice Bikash credits as the reason he survived his lowest points.<br><br>His wife, <strong>Madhuri Rani Talukder</strong>, was equally extraordinary — she was like a <strong>second mother</strong> to Bikash, caring for him with deep warmth and unconditional love.<br><br>💔 Tragically, both Aradhan and Madhuri Rani <strong>passed away in 2025</strong>. Bikash lost two of the most irreplaceable people in his life within the same year. Their memory is woven into every achievement he dedicates to their struggle and love. 🙏";
  }

  // ── GRANDMOTHER (must come BEFORE mother check) ────────────────
  if (/grandm|grandmother|nani|dadi|granny|grand/.test(q)) {
    return "🕊️ <strong>Bikash's grandmother</strong> holds a place in his heart that nothing else can fill.<br><br>She was the one who raised him, watched over him, and loved him with a kind of warmth that only a grandmother can give — completely, quietly, unconditionally. As a child, she was his whole world in Ramdigha. Her care shaped the gentleness behind his calm nature, the patience in the way he thinks, and the kindness he carries even when the world is hard.<br><br>She has passed away — and that loss is one Bikash carries with him every day. He loved her deeply. He misses her deeply. 💔<br><br>When he sits down to build something today — a project, a system, a piece of code — some part of that patience, that stillness, that love... it came from her. She may be gone, but she is woven into everything he does. 🌿<br><br><em>\"Some people leave this world but never really leave you.\"</em>";
  }

  // ── MOTHER ─────────────────────────────────────────────────────
  if (/\bmother\b|mom\b|maa\b|mama\b/.test(q)) {
    return "👩 Bikash's mother is <strong>Shila Rani Talukder</strong> — deeply cherished and an irreplaceable part of his life and values.";
  }

  // ── AKASH / BROTHER BOND ───────────────────────────────────────
  if (/akash|debt|unpayable|guardian|lowest|stood by|pillar/.test(q)) {
    return "💙 <strong>Akash Talukder</strong> is more than a brother to Bikash — he is the guardian of his journey.<br><br>Through every high and every lowest low, Akash has been present. Bikash believes he can never truly repay the kindness and support Akash has shown him — calling it an <em>\"unpayable debt.\"</em><br><br>No matter how far Bikash goes in Computer Science or the world, he knows — quietly, humbly — that he stands on his brother's shoulders. 🙏";
  }

  // ── DEVARSHI / SPIRITUAL BROTHER ──────────────────────────────
  if (/devarshi|srivas|spiritual|monk|religion|spiritual leader|travel|usa.*brother|australia|singapore|canada|china|countries/.test(q)) {
    return "🕉️ <strong>Devarshi Srivas Dasa</strong> is Bikash's eldest cousin brother — and one of the most extraordinary people in his life.<br><br>Devarshi is a <strong>spiritual leader</strong>, and Bikash learns spiritual wisdom and deeper life values directly from him. In a world driven by code and ambition, Devarshi reminds Bikash of what truly matters — peace, purpose, and the inner life.<br><br>🌍 He has also traveled to many countries across the world — the <strong>USA, Australia, China, Singapore, and Canada</strong> — carrying his spiritual mission far beyond borders.<br><br>Beyond the spiritual, he is also a <strong>mental pillar</strong> for Bikash — someone who supports him emotionally and helps him stay grounded when life gets heavy. A rare combination of wisdom, worldliness, and warmth. 🙏";
  }

  // ── TAPOSH / FINANCIAL SUPPORT ────────────────────────────────
  if (/taposh|financial|money|support.*usa|usa.*support|lives.*usa/.test(q)) {
    return "🇺🇸 <strong>Taposh Ranjan Talukder</strong> is one of Bikash's brothers currently living in the <strong>USA</strong> as a citizen.<br><br>Taposh has been a quiet but powerful force behind Bikash's journey — providing <strong>financial support</strong> that has helped Bikash focus on his studies and pursue his goals without that weight on his shoulders.<br><br>He lives in the USA with his wife <strong>Laxmi Das</strong> and their brilliant son <strong>Namananda</strong> — a gifted boy Bikash describes as brilliant, much like himself. A beautiful family rooted in America. 🌟 In a family where sacrifice runs deep, Taposh's contribution is one more thread in the fabric of love and loyalty that holds Bikash's life together. 🙏";
  }

  // ── LAXMI DAS / RAMANANDA ─────────────────────────────────────
  if (/laxmi|namananda|taposh.*wife|taposh.*child|taposh.*family|cousin.*wife/.test(q)) {
    return "🌸 <strong>Laxmi Das</strong> is the wife of Bikash's brother <strong>Taposh Ranjan Talukder</strong> — making her Bikash's cousin sister-in-law and a cherished part of his extended family.<br><br>🌟 They have a son named <strong>Namananda</strong> — and he is, by Bikash's own words, a <strong>brilliant boy</strong>. The kind of sharp, gifted mind that reminds you of Bikash himself. Brilliance clearly runs in the family. 😄<br><br>🇺🇸 Laxmi, Taposh, and Namananda are all <strong>US citizens</strong>, building their life together in America. Even across the ocean, they remain a warm and deeply connected part of Bikash's family story. 💙";
  }

  // ── NISHAT / CHOSEN SISTER ─────────────────────────────────────
  // ── SUMA RANI / SUSEN / AUNT & UNCLE ──────────────────────────
  if (/suma|suma rani|susen|medinova|uncle.*sylhet|sylhet.*uncle|aunt.*supportive/.test(q)) {
    return "💙 Two more warm pillars in Bikash's extended family:<br><br>👩 <strong>Suma Rani Talukder</strong> — Bikash's aunty, a <strong>supportive and caring</strong> presence in his life. The kind of person who quietly shows up when it matters.<br><br>👨 <strong>Susen Talukder</strong> — Bikash's uncle, a true <strong>gentleman</strong>. He works at <strong>Medinova Medical, Sylhet</strong> — a man of dignity and professionalism who carries himself with quiet grace.<br><br>Together they are a family Bikash holds with real warmth and gratitude. 🙏";
  }

  // ── NIJHUM TALUKDER (Suma & Susen's son) ──────────────────────
  if (/nijhum|mechanical engineer|english medium|art.*skill|skill.*art/.test(q)) {
    return "🌱 <strong>Nijhum Talukder</strong> is the son of Suma Rani and Susen Talukder — and he is a young man growing into something remarkable.<br><br>He is studying at an <strong>English medium school and college</strong>, and is <strong>intellectually growing</strong> with every passing day. His ambition? To become a <strong>Mechanical Engineer</strong> — a goal he pursues with quiet determination.<br><br>🎨 Beyond academics, Nijhum has a <strong>great skill in art</strong> — a creative depth that sets him apart. A mind that thinks in both engineering and expression. Bikash's family clearly runs deep with talent. 💙";
  }

  // ── TITHI TALUKDER (Suma & Susen's daughter) ──────────────────
  if (/tithi|dancer|singer.*student|student.*singer|wants.*doctor|future.*doctor/.test(q)) {
    return "✨ <strong>Tithi Talukder</strong> is the daughter of Suma Rani and Susen Talukder — and she is, quite simply, extraordinary.<br><br>💃 <strong>Dancer</strong> — she moves with grace and passion<br>🎵 <strong>Singer</strong> — a voice that carries real feeling<br>📚 <strong>Brilliant student</strong> — academically sharp and driven<br>🩺 <strong>Future Doctor</strong> — her heart is set on medicine, and with her discipline, there's little doubt she'll get there<br><br>Tithi is the kind of young person who makes everyone around her believe in possibility. A true multi-talent. 🌸";
  }

  // ── BIDDHUT SARKER / DRISTY'S HUSBAND ─────────────────────────
  if (/biddhut|sarker|dristy.*husband|sister.*husband|krishna|consciousness|spreading|madhyanagor.*spiritual|spiritual.*madhyanagor/.test(q)) {
    return "🕉️ <strong>Biddhut Sarker</strong> is the husband of Bikash's sister, <strong>Dristy Talukder Rubi</strong> — making him Bikash's brother-in-law.<br><br>He is a <strong>teacher</strong> — and beyond the classroom, he dedicates himself to something far greater. He lives and works in a <strong>remote area of Madhyanagor Upazila</strong>, where he is actively <strong>spreading Krishna consciousness</strong> — bringing spiritual awareness and light to a community far from the city's reach.<br><br>He is known as a deeply <strong>calm person</strong> with a <strong>great reputation</strong> in his area. The kind of man who leads not by authority, but by character. A quiet force for good. 🙏";
  }

  // ── JHUMA / DAMUDAR PRIYA ─────────────────────────────────────
  if (/jhuma|damudar|priya|cousin.*sylhet|sylhet.*cousin/.test(q)) {
    return "🌸 <strong>Jhuma Talukder</strong> is Bikash's cousin, living in <strong>Sylhet</strong>.<br><br>She has a daughter named <strong>Damudar Priya</strong> — and she is, by all accounts, absolutely adorable. What makes her extra special? She talks so <strong>maturely</strong> for her age that it catches everyone off guard 😂. The kind of little one who walks into a room and immediately has everyone smiling. A true gem of the family. 💛";
  }

  // ── DRISTY'S CHILD ────────────────────────────────────────────
  if (/dristy.*child|dristy.*son|dristy.*boy|rubi.*child|sister.*child|nephew/.test(q)) {
    return "👶 Bikash's sister <strong>Dristy Talukder Rubi</strong> has a baby boy — cute, clever, and incredibly calm. Her husband is <strong>Biddhut Sarker</strong>, a teacher spreading Krishna consciousness in Madhyanagor Upazila — a calm, respected man with a great reputation in his community. 💙";
  }

  // ── NISHAT / DRISTY / SISTERS ─────────────────────────────────
  if (/nishat|nisa|chosen|sister|dristy|rubi/.test(q)) {
    return "👧 Bikash's sisters:<br><br>💙 <strong>Nishat Tasmin Nisa</strong> — a sister from another mother, one of his strongest pillars of support through his hardest times. A bond built not on blood alone, but on deep loyalty.<br><br>💜 <strong>Dristy Talukder Rubi</strong> — his own sister, equally cherished. Married to <strong>Biddhut Sarker</strong> — a calm, respected teacher spreading Krishna consciousness in Madhyanagor. They have a baby boy who is cute, clever, and the calmest little soul. 🥰";
  }

  // ── ASMA / MONISHA / CALMEST PEOPLE ──────────────────────────
  if (/asma|monisha|calm.*person|calmest|peaceful.*person|university.*calm/.test(q)) {
    return "🕊️ Bikash has two people in his life he describes as <em>the calmest souls he has ever encountered</em>:<br><br>🌸 <strong>Asma</strong> — the calmest person in his <strong>university</strong>. In a world of noise and chaos, Asma carries a quiet, composed energy that Bikash genuinely admires. She stands out not by being loud — but by being still.<br><br>🌸 <strong>Monisha</strong> — equally calm, equally remarkable in her presence.<br><br>Bikash, a selective introvert himself, deeply values this kind of grounded peace in people. It's rare, and he recognises it. ✦";
  }

  // ── FAMILY OVERVIEW ────────────────────────────────────────────
  if (/family|parent|relatives|support system/.test(q)) {
    return "💙 <strong>Bikash's Family & Support System:</strong><br><br>👨 <strong>Father:</strong> Haridhan Talukder <em>(greatest inspiration)</em><br>👩 <strong>Mother:</strong> Shila Rani Talukder<br>🌟 <strong>Uncle:</strong> Aradhan Talukder <em>(passed away 2025)</em> · wife: Madhuri Rani <em>(second mother, passed away 2025)</em><br>👨‍⚕️ <strong>Uncle:</strong> Susen Talukder <em>(Medinova Medical, Sylhet)</em> · wife: Suma Rani Talukder <em>(supportive aunty)</em><br>— son: Nijhum Talukder <em>(English medium, aspiring engineer, artist)</em><br>— daughter: Tithi Talukder <em>(dancer, singer, brilliant student, future doctor)</em><br>💛 <strong>Grandmother:</strong> Passed away — loved deeply, missed always<br><br>👦 <strong>Brothers:</strong><br>• Akash Talukder <em>(guardian, unpayable debt)</em><br>• Devarshi Srivas Dasa <em>(spiritual leader, world traveler, mental support)</em><br>• Taposh Ranjan Talukder <em>(US citizen, financial support)</em> — wife: Laxmi Das · son: Namananda<br>• Nijhum Talukder · Bappy Sarkar · Robin Sarkar<br><br>👧 <strong>Sisters:</strong><br>• Dristy Talukder Rubi — husband: <strong>Biddhut Sarker</strong> <em>(teacher, spreading Krishna consciousness in Madhyanagor)</em> · baby boy<br>• Nishat Tasmin Nisa <em>(chosen kinship, emotional pillar)</em><br><br>👩 <strong>Cousin:</strong> Jhuma Talukder <em>(Sylhet)</em> — daughter: Damudar Priya <em>(adorably mature 😂)</em><br><br>Family is the compass that guides every decision Bikash makes. 🙏";
  }

  // ── BROTHERS ───────────────────────────────────────────────────
  if (/brother|bhai|sibling/.test(q)) {
    return "Bikash has <strong>6 brothers</strong>, each a different kind of pillar:<br><br>💙 <strong>Akash Talukder</strong> — his guardian, his greatest support, the one he owes an unpayable debt<br>🕉️ <strong>Devarshi Srivas Dasa</strong> — eldest cousin brother, spiritual leader, world traveler (USA, Australia, China, Singapore, Canada), and Bikash's mental anchor<br>🇺🇸 <strong>Taposh Ranjan Talukder</strong> — lives in the USA, supports Bikash financially<br>👦 Nijhum Talukder<br>👦 Bappy Sarkar<br>👦 Robin Sarkar<br><br>Each one has shaped Bikash in a different way. 💙";
  }

  // ── PERSONALITY ────────────────────────────────────────────────
  if (/personality|introvert|extrovert|selective|character|who is he|nature|vibe|type of person/.test(q)) {
    return "🎭 Bikash describes himself as a <strong>\"Selective Extrovert.\"</strong><br><br>By nature, he is deeply <strong>introverted</strong> — he thrives in solitude and calm, which gives him the focused discipline that makes him exceptional at engineering. But when he's in his element — talking tech, leading a project, or among his trusted circle — he becomes <strong>confident, articulate, and compelling.</strong><br><br>He keeps a <em>small, high-quality circle</em> of loyal friends over a large, superficial network. Quality over quantity — in code and in life. ✦";
  }

  // ── VEGAN ──────────────────────────────────────────────────────
  if (/vegan|vegetarian|diet|food|eat|plant|why.*vegetarian|why.*vegan|why.*not.*meat|no.*meat|tapasya|tapayssa|krishna.*food|bhagavad|shastro|gita.*food|lord.*krishna.*eat/.test(q)) {
    return "🌱 <strong>Why is Bikash a Vegetarian?</strong><br><br>This is one of the most deeply personal and thoughtful aspects of Bikash's life. His answer comes from three layers — ethics, consciousness, and spiritual devotion.<br><br>🐾 <strong>The Ethical Foundation</strong><br>Bikash believes that <em>killing an animal is not a fair way to live</em> — especially when we have an abundance of other resources. Yes, plants also have life. But there is a crucial difference: animals possess <strong>consciousness, emotion, and the capacity to feel pain</strong> in a way that plants do not. Choosing plants over animals is therefore the more compassionate and reasoned choice.<br><br>🕉️ <strong>The Spiritual Dimension — Lord Krishna & the Bhagavad Gita</strong><br>For Bikash, vegetarianism is not just ethics — it is <strong>devotion</strong>. In the Bhagavad Gita, Lord Krishna himself says:<br><br><em>\"If one offers Me with love and devotion a leaf, a flower, fruit, or water, I will accept it.\"</em><br><br>This is the divine permission Bikash lives by. Lord Krishna — the <strong>Supreme Personality of Godhead</strong> — accepts only pure vegetarian offerings. When food is offered to Him first, He accepts the life of the plant and takes its soul to Him. There is no sin in this offering — only grace.<br><br>By eating only what can be offered to Krishna, Bikash aligns his daily life with devotion. He is not satisfying his own appetite — he is <strong>satisfying the Supreme Personality of Godhead</strong>. And that, for Bikash, is enough.<br><br>🔥 <strong>The Philosophy of Tapasya</strong><br>At the deepest level, Bikash's vegetarianism reflects his core life philosophy:<br><br><em>\"Life means sacrifice for others — not for my own happiness.\"</em><br><br>This is called <strong>Tapasya</strong> — voluntary austerity, the willingness to give up personal comfort for a higher purpose. Every meal is a small act of tapasya. A quiet, daily sacrifice in service of consciousness, compassion, and the divine.<br><br>In short: Bikash doesn't just avoid meat. He has chosen a way of eating that is ethical, conscious, spiritually aligned, and devoted. It is one of the most complete expressions of who he is. 🙏🌿";
  }

  // ── PHILOSOPHY / GROUNDED ──────────────────────────────────────
  if (/philosophy|belief|value|grounded|principle|mindset|approach|ethos/.test(q)) {
    return "🌿 Bikash's core philosophy is rooted in his village upbringing: <strong>simplicity, hard work, and building something from nothing.</strong><br><br>He carries this into his code — preferring <em>clean, powerful, dependency-free systems</em> over bulky frameworks. He believes in depth over breadth, loyalty over popularity, and quiet dedication over loud self-promotion.<br><br>He is a man of few words — but when he acts, it speaks volumes. ✦";
  }

  // ── AESTHETIC / DESIGN STYLE ───────────────────────────────────
  if (/aesthetic|design|visual|style|dark|night mode|cinematic|blue hour|moody|artistic|portfolio look/.test(q)) {
    return "🌌 Bikash is drawn to a <strong>\"Cinematic Blue Hour\"</strong> aesthetic — moody, twilight-inspired visuals that evoke a sense of melancholy and deep thought.<br><br>This is intentional. His Night Mode portfolio blends <em>high-tech functionality with artistic storytelling</em> — dark backgrounds, gold accents, and atmospheric design that feel like a scene from a film rather than a typical developer site.<br><br>His code is efficient. His aesthetic is cinematic. Both are, unmistakably, him. 🎬";
  }

  // ── TECHNICAL STYLE / VANILLA JS / NO FRAMEWORK ───────────────
  if (/vanilla|framework|jquery|react|dependency|clean code|web stack|javascript|css/.test(q)) {
    return "💻 Bikash is an expert in <strong>Vanilla JavaScript and advanced CSS</strong> — and he prefers it that way. No bloated frameworks, no unnecessary dependencies. Just clean, fast, purposeful code.<br><br>This philosophy mirrors his personality: <em>strip away the noise, and build something that actually works.</em> His portfolio itself is proof — every animation, interaction, and live widget is hand-crafted without a single framework. ✦";
  }

  // ── SPORTS ─────────────────────────────────────────────────────
  if (/sport|football|soccer|cricket|gym|workout|fitness|hobby|free time|play|active|exercise/.test(q)) {
    return "Outside of code, Bikash is passionate about:<br><br>⚽ <strong>Football</strong> — his favourite sport, played with the same intensity he brings to algorithms<br>🏏 <strong>Cricket</strong> — a true Bangladeshi classic<br>💪 <strong>Gym</strong> — discipline of body mirrors discipline of mind<br><br>The same focus that makes him a great engineer makes him competitive on the field too. 🔥";
  }

  // ── CGPA ───────────────────────────────────────────────────────
  if (/cgpa|gpa|grade|marks|result|academic|score/.test(q)) {
    return "📊 Bikash holds a <strong>CGPA of 3.65</strong> — a strong academic record achieved while simultaneously working on personal projects, competitive programming, and research. He doesn't just study CS; he lives it. 🎓";
  }

  // ── MARRIAGE ───────────────────────────────────────────────────
  if (/marry|marriage|wife|girlfriend|relationship|love life|romantic|wedding/.test(q)) {
    return "Bikash has made a clear, deliberate choice — he <strong>does not plan to marry</strong> in the future. His life is fully devoted to his craft, his family, and his journey in technology. Some build relationships. He builds systems. 💻";
  }

  // ── NOSTALGIA / VILLAGE LIFE ───────────────────────────────────
  if (/miss|nostalg|village life|ramdigha|childhood|back home|village friends/.test(q)) {
    return "🌿 One of the most tender parts of Bikash's story — he <strong>deeply misses Ramdigha</strong>. The open fields, the unhurried pace, the friendships, the time with his brothers — those memories live in him quietly.<br><br>His grandmother's home. The village mornings. The bonds formed before ambition and code took over the days. No matter how far his journey in CSE takes him, <em>Ramdigha will always be where his heart returns.</em> 💙";
  }

  // ── SCHOOL / EDUCATION HISTORY ─────────────────────────────────
  if (/school|akota|osmani|scholar|high school|secondary|ssc|class 8|class 9|class 10|9-10|9th|10th/.test(q)) {
    return "🎒 Bikash's academic journey:<br><br>🏫 <strong>Akota High School, Ramdigha</strong> — his village school, up to Class 8<br>🏫 <strong>Osmani Medical High School, Sylhet</strong> — Classes 9 & 10<br>🎓 <strong>Scholar's Home</strong> — HSC (College level)<br>🖥 <strong>Current CSE Degree</strong> — CGPA 3.65<br><br>From a quiet village classroom to engineering research — every step earned. 💪";
  }

  // ── COLLEGE ────────────────────────────────────────────────────
  if (/\bcollege\b|\bhsc\b|higher secondary/.test(q)) {
    return "🎓 Bikash completed his HSC at <strong>Scholar's Home</strong> — the bridge between his Sylhet school years and his CSE degree. A pivotal chapter in his journey from village student to systems engineer.";
  }

  // ── HOMETOWN / VILLAGE ─────────────────────────────────────────
  if (/hometown|village|origin|where.*from|born|grew up|ramdigha|sunamganj|madhyanagar/.test(q)) {
    return "🏡 Bikash is originally from <strong>Madhyanagar Upazila, Sunamganj Zila, Sylhet Division</strong> — and more specifically, from <strong>Ramdigha village</strong>.<br><br>This is where his story begins: with his grandmother's care, village friendships, and a quiet discipline that shaped everything he became. He misses it deeply, and it remains the emotional core of who he is. 💙";
  }

  // ── SKILLS ─────────────────────────────────────────────────────
  // ── TECH BEHIND THIS AI (NEXORA) ────────────────────────────────
  if (/tech behind|how.*built|how.*made|how.*nexora|nexora.*built|technology.*behind|what.*powers|how.*ai.*work|what.*brain|ai.*power|claude.*api|anthropic.*api|how.*chatbot|what.*model|api.*architecture|restful|system.*prompt|system.*context|knowledge.*sandbox|temperature.*ai|data.*safe|guardrail|digital twin|nlp|natural language|what is nexora|nexora.*tech|tech.*nexora|architecture.*nexora|nexora.*architecture/.test(q)) {
    return "⚙️ <strong>The Tech Behind Nexora</strong><br><br>Nexora is Bikash Talukder's handcrafted AI assistant, built entirely in <strong>Vanilla JavaScript</strong> with zero external frameworks. Here is every layer of the stack:<br><br>━━━━━━━━━━━━━━━━━━<br>🧠 <strong>1. AI Brain — Anthropic Claude API</strong><br>━━━━━━━━━━━━━━━━━━<br>• <strong>Model:</strong> Claude (by Anthropic) via RESTful API<br>• <strong>Architecture:</strong> System Context Engineering — a structured \"Knowledge Sandbox\" is injected before every conversation, containing Bikash's full personal, academic, and technical biography<br>• <strong>Persona:</strong> Temperature & tone parameters are tuned to match the Cinematic Blue Hour aesthetic — professional yet deeply personal<br>• <strong>Memory:</strong> <code>localStorage</code> stores the last 10 conversations so returning visitors get a personalised greeting<br><br>━━━━━━━━━━━━━━━━━━<br>🔀 <strong>2. Intent Router (RAG-style)</strong><br>━━━━━━━━━━━━━━━━━━<br>Every message is classified before a response is generated. The router detects:<br>• 🧮 <strong>Calculator</strong> — math expressions evaluated via sandboxed <code>Function()</code><br>• 💱 <strong>Currency</strong> — live rates via ExchangeRate-API with flag CDN<br>• 📐 <strong>Unit Converter</strong> — temperature, length, weight, volume, data<br>• 🔐 <strong>Password Checker</strong> — regex-based 5-criteria strength analyser<br>• 📝 <strong>Word Counter</strong> — words, chars, sentences, reading time<br>• 📰 <strong>Tech News</strong> — RSS feeds from TechCrunch, The Verge, Wired via allorigins proxy<br>• 🏥 <strong>Medical Info</strong> — NIH MedlinePlus free API (no key needed)<br>• 🕐 <strong>Time</strong> — live Bangladesh/Dhaka time<br>• 💬 <strong>Persona</strong> — Bikash's knowledge base (700+ lines of pattern-matched responses)<br><br>━━━━━━━━━━━━━━━━━━<br>🌐 <strong>3. Live Data Sources</strong><br>━━━━━━━━━━━━━━━━━━<br>• <strong>OpenWeatherMap API</strong> — live Dhaka weather on the dashboard<br>• <strong>GitHub API</strong> — public repo count for bikash-20<br>• <strong>Codeforces API</strong> — live rating & rank for talukder_20<br>• <strong>LeetCode Stats API</strong> — problems solved for bikashtalukder<br>• <strong>ExchangeRate-API</strong> — real-time currency conversion<br>• <strong>NIH MedlinePlus</strong> — verified medical information<br>• <strong>RSS Feeds</strong> — live tech news fetched on demand<br><br>━━━━━━━━━━━━━━━━━━<br>🛡️ <strong>4. Security & Privacy</strong><br>━━━━━━━━━━━━━━━━━━<br>• <strong>Stateless communication</strong> — no chat history stored on any server<br>• <strong>localStorage only</strong> — memory lives in your browser, never sent anywhere<br>• <strong>Instructional Guardrails</strong> — off-topic queries are politely redirected<br>• <strong>CORS proxying</strong> — sensitive requests routed through allorigins.win<br><br>━━━━━━━━━━━━━━━━━━<br>🎨 <strong>5. Frontend Stack</strong><br>━━━━━━━━━━━━━━━━━━<br>• <strong>Pure Vanilla JS</strong> — no React, no jQuery, no framework bloat<br>• <strong>Async/Await + Fetch API</strong> — non-blocking parallel API calls<br>• <strong>CSS Custom Properties</strong> — dark cinematic theme with Gold & Purple accents<br>• <strong>Google Fonts</strong> — Bebas Neue, DM Serif Display, Manrope<br>• <strong>Single HTML file</strong> — entire portfolio + AI + dashboard in one file<br><br>━━━━━━━━━━━━━━━━━━<br>🚀 <strong>6. Roadmap (Phase 2)</strong><br>━━━━━━━━━━━━━━━━━━<br>• Node.js + Vercel serverless backend<br>• Tavily API for true real-time web search<br>• MongoDB/Pinecone for persistent cross-device memory<br>• Claude Vision for image & circuit analysis<br>• LangChain (Python) for production AI pipelines<br><br><small style=\"opacity:0.45;font-size:11px;\">Built by Bikash Talukder — CSE student, Metropolitan University, Sylhet 🇧🇩</small> ✦";
  }


  // ── API SKILLS / TECHNICAL COMPETENCIES ───────────────────────
  if (/api|restful|fetch|async|json|payload|backend|proxy|error.*handling|try.*catch|rate.*limit|environment.*variable|authentication|security/.test(q)) {
    return "🔌 <strong>Bikash's API & Integration Skills:</strong><br><br>🌐 <strong>RESTful Architecture</strong> — Proficient in consuming and integrating third-party REST APIs (Anthropic, OpenWeatherMap, LeetCode, GitHub, Codeforces) using <strong>Asynchronous JavaScript</strong><br><br>📦 <strong>Data Parsing</strong> — Expert in handling JSON payloads and mapping complex data structures to dynamic UI components<br><br>🔒 <strong>Security & Auth</strong> — Experienced in securing API keys using environment variables and backend proxying to prevent frontend exposure<br><br>⚠️ <strong>Error Handling</strong> — Implements <code>try/catch</code> blocks and status code checks to ensure UI stability during network timeouts or API rate-limiting<br><br>🤖 <strong>AI & Prompt Engineering</strong> — Context Engineering, Parameter Tuning (Temperature, top_p, token limits), NLP intent recognition, and \"Digital Twin\" persona design ✦";
  }

  // ── CV / RESUME BULLET POINTS ──────────────────────────────────
  if (/cv|resume|bullet point|linkedin.*description|portfolio.*project|job description|hire.*describe|describe.*project/.test(q)) {
    return "📂 <strong>Bikash's Portfolio — High-Impact CV Bullet Points:</strong><br><br>• Integrated <strong>Anthropic Claude API</strong> to create a context-aware AI assistant, utilizing System Prompting to provide a personalized knowledge base for visitors<br><br>• Developed a <strong>real-time data synchronization engine</strong> using Vanilla JavaScript and the Fetch API to pull live statistics from LeetCode, GitHub, and Codeforces<br><br>• Optimized web performance by implementing <strong>asynchronous logic</strong>, resulting in zero-blocking UI updates during multiple parallel API calls<br><br>• Engineered a custom <strong>\"Personality Layer\"</strong> for the AI, integrating personal values (Veganism, Selective Extroversion) and family history into the model's response logic<br><br>• Architected a <strong>stateless, secure API pipeline</strong> with backend proxying, protecting sensitive credentials while maintaining real-time frontend interactivity ✦";
  }

  // ── PROMPT ENGINEERING ────────────────────────────────────────
  if (/prompt.*engineer|context.*engineer|system.*prompt|parameter.*tun|temperature|top_p|token|llm|persona.*design/.test(q)) {
    return "🎯 <strong>Bikash's AI & Prompt Engineering Skills:</strong><br><br>🧠 <strong>Context Engineering</strong> — Designing structured System Prompts to constrain LLM behavior and maintain a consistent \"Digital Twin\" persona<br><br>🎛️ <strong>Parameter Tuning</strong> — Optimizing model performance through Temperature control, <code>top_p</code> sampling, and token limit management<br><br>💬 <strong>NLP Integration</strong> — Leveraging LLMs for intent recognition and personalized user interaction<br><br>🔐 <strong>Guardrail Design</strong> — Building instructional boundaries that keep AI responses on-topic and aligned with portfolio goals<br><br>This very chatbot is a live demonstration of all these skills in action. ✦";
  }

  // ── RAG / RETRIEVAL AUGMENTED GENERATION ─────────────────────
  if (/rag|retrieval.augmented|retrieval augmented|live internet|dynamic assistant|search.*tool|tavily|serper|rss.*feed/.test(q)) {
    return "🌐 <strong>RAG — Retrieval-Augmented Generation</strong><br><br>Bikash understands the next evolution of his AI: moving from a <em>Static Persona</em> to a <em>Dynamic Assistant</em> connected to the live internet.<br><br>📡 <strong>How RAG works:</strong> Instead of only knowing what's in the System Prompt, the AI first <strong>searches the web</strong> for live data, then feeds those results to Claude as context — so every answer is grounded in real, current information.<br><br>🔍 <strong>The Search Layer:</strong> When you ask \"What's the latest in Quantum Computing?\", the flow is:<br><code>User Query → Search API (Tavily/Serper) → Live Results → Claude → Answer</code><br><br>This is called a <strong>Multi-step API Chain</strong> — one of the most sought-after skills in modern AI engineering. ✦";
  }

  // ── TECH NEWS / SEARCH INTEGRATION ───────────────────────────
  if (/tech news|latest news|quantum.*news|ai.*news|search.*api|tavily|serper|live.*search|web.*search/.test(q)) {
    return "📰 <strong>Tech News Integration — The Plan:</strong><br><br>To serve live tech news, Bikash's AI roadmap uses a <strong>Search API layer</strong>:<br><br>🔧 <strong>Tool:</strong> Tavily API or Serper.dev<br>⚙️ <strong>How it works:</strong><br>1. User asks about a tech topic<br>2. JS sends the query to the Search API<br>3. Results are retrieved and injected into Claude's context<br>4. Claude generates a synthesized, intelligent answer<br><br>This proves <strong>Multi-step API Chain architecture</strong> — a core skill in advanced AI development. It's on Bikash's active build roadmap. 🚀";
  }

  // ── MEDICAL INFO / NIH / PUBMED ───────────────────────────────
  if (/medical|health|nih|pubmed|doctor|medicine|symptom|diagnosis|medical.*info|healthcare/.test(q)) {
    return "🏥 <strong>Medical Knowledge Integration — The Responsible Approach:</strong><br><br>Bikash is aware of the ethical weight of medical AI. His planned implementation:<br><br>📚 <strong>Source:</strong> NIH (National Institutes of Health) API or PubMed — verified, peer-reviewed databases only<br><br>🛡️ <strong>Guardrail logic in the System Prompt:</strong><br><em>\"If the user asks a medical question, search the NIH database first. Always include a disclaimer: I am an AI, not a doctor.\"</em><br><br>⚠️ <strong>Important disclaimer:</strong> This AI is not a medical professional. For any health concerns, please consult a qualified doctor. Bikash's implementation is designed to surface verified research, never to replace professional medical advice. 🙏";
  }

  // ── SERVERLESS BACKEND / NODE.JS / VERCEL ────────────────────
  if (/serverless|backend|node\.?js|vercel|render|express|server|deploy|hosting|env.*variable|\.env|langchain/.test(q)) {
    return "☁️ <strong>Bikash's Serverless Backend Roadmap:</strong><br><br>Moving beyond browser-only logic, the next architecture step is a proper backend:<br><br>🟢 <strong>Step 1 — Build the API Server:</strong> Node.js + Express<br>🔒 <strong>Step 2 — Secure API Keys:</strong> <code>.env</code> environment variables — never exposed on the frontend<br>🔍 <strong>Step 3 — Add Search Tool:</strong> Tavily API integration for live web retrieval<br>💾 <strong>Step 4 — Chat History:</strong> MongoDB for persistent conversation storage<br>🚀 <strong>Step 5 — Deploy:</strong> Vercel or Render for global edge deployment<br><br>The Python alternative: <strong>LangChain</strong> — the gold standard framework for production-grade AI pipelines. Both paths are on Bikash's learning roadmap. ✦";
  }

  // ── MEMORY / PERSISTENT CHAT / VECTOR DB ─────────────────────
  if (/memory|remember|persistent|chat history|vector.*database|pinecone|supabase|mongodb|forget|refresh.*forget|local.*storage/.test(q)) {
    return "🧠 <strong>AI Memory — Making the Assistant \"Remember\" You:</strong><br><br>Right now, refreshing the page resets the conversation. The next evolution adds <strong>persistent memory</strong>:<br><br>💬 <strong>The experience it unlocks:</strong><br><em>\"Welcome back! Last time we talked, you asked about Akash Talukder. Want to know more about Bikash's latest projects?\"</em><br><br>⚙️ <strong>Two approaches:</strong><br>🗃️ <strong>Simple:</strong> Browser Local Storage — fast, no backend needed, remembers the last session<br>🧬 <strong>Advanced:</strong> Vector Database (Pinecone) + Supabase/MongoDB — semantic memory that finds relevant past conversations by meaning, not just keywords<br><br>This is the difference between a chatbot and a truly intelligent assistant. It's on Bikash's roadmap. 🚀";
  }

  // ── MULTIMODAL / VISION / IMAGE ANALYSIS ─────────────────────
  if (/multimodal|multi.modal|vision|image.*ai|ai.*image|upload.*photo|see.*image|circuit.*analysis|code.*photo|claude.*vision/.test(q)) {
    return "👁️ <strong>Multi-Modal AI — Teaching the Assistant to \"See\":</strong><br><br>Claude 3.5 Sonnet has <strong>Vision capabilities</strong> — meaning Bikash's AI can be extended to analyze images, not just text.<br><br>🖼️ <strong>Use cases for this portfolio:</strong><br>• Upload a photo of a circuit → AI analyzes the schematic and gives feedback<br>• Upload a screenshot of code → AI reviews it and suggests optimizations<br>• Upload a diagram → AI explains the architecture<br><br>This perfectly matches Bikash's <strong>hardware-software bridge</strong> interest — combining embedded systems knowledge with AI vision. It's a natural next step for his portfolio. 🔧✦<br><br>The Cinematic Blue Hour portfolio + Vision AI = something truly next-level. 🎬";
  }

  // ── FULL AI ROADMAP / NEXT STEPS ─────────────────────────────
  if (/roadmap|next step|advanced ai|future.*ai|upgrade.*ai|build.*plan|what.*next|ai.*plan/.test(q)) {
    return "🗺️ <strong>Bikash's Advanced AI Roadmap:</strong><br><br>Moving from <em>Static Persona</em> → <em>Dynamic Living Assistant</em>:<br><br>✅ <strong>Done (Live now):</strong><br>• Anthropic Claude API integration<br>• System Context Engineering & Digital Twin persona<br>• Real-time data: GitHub, LeetCode, Codeforces, OpenWeatherMap<br>• Instructional Guardrails & Personality Layer<br><br>🔜 <strong>Phase 2 — RAG & Search:</strong><br>• Tavily/Serper API for live tech news & web retrieval<br>• NIH/PubMed integration for verified medical info<br>• Multi-step API chain architecture<br><br>🔜 <strong>Phase 3 — Backend & Memory:</strong><br>• Node.js + Express serverless backend on Vercel/Render<br>• <code>.env</code> secure key management<br>• MongoDB/Supabase for persistent chat memory<br>• Vector DB (Pinecone) for semantic memory<br><br>🔜 <strong>Phase 4 — Multi-Modal:</strong><br>• Claude Vision for circuit & code image analysis<br>• LangChain (Python) for production AI pipelines<br><br>Each phase is a real, industry-standard skill. Bikash isn't just building a portfolio — he's building engineering expertise. 🚀✦";
  }

  if (/skill|language|tech|stack|know|proficient|good at|expert|coding|programming/.test(q)) {
    return "💻 <strong>Bikash's Technical Skills:</strong><br><br>⚙️ <strong>C & C++</strong> — 88% (systems programming, multi-threading, OOP)<br>🐍 <strong>Python</strong> — 80% (AI/ML, scripting, prototyping)<br>🌐 <strong>HTML/CSS + Vanilla JS</strong> — 70% (dependency-free, clean web work)<br>☕ <strong>Java</strong> — 60%<br>🧠 <strong>DSA</strong> — 75%<br>🔧 <strong>Arduino & Robotics</strong> — 45% / 35%<br><br>🔌 <strong>API & AI Integration:</strong><br>• RESTful API consumption (Anthropic, OpenWeatherMap, GitHub, LeetCode)<br>• Asynchronous JavaScript & Fetch API<br>• System Prompt & Context Engineering<br>• JSON data parsing & dynamic UI mapping<br>• Secure API key management & backend proxying<br><br>His philosophy: <em>no bloat, no shortcuts — just powerful, clean systems.</em> ✦";
  }

  // ── PROJECTS ───────────────────────────────────────────────────
  if (/project|built|made|work|portfolio|github|code|app|program/.test(q)) {
    return "🛠 <strong>Bikash's Featured Projects:</strong><br><br>🕐 <strong>Digital Clock (C)</strong> — Multi-threaded terminal clock with mutex locks, snooze functionality & ANSI UI. Pure systems mastery.<br>⚔️ <strong>Echoes of the Void (C++)</strong> — Full OOP text-adventure RPG with combat, puzzles & inventory<br>🗺 <strong>Google Maps Navigator (C++)</strong> — Dijkstra's algorithm with Raylib graphics, animated movement & a web version<br>🤖 <strong>AI Portfolio Assistant</strong> — Integrated Anthropic Claude API with System Context Engineering, real-time data sync from GitHub/LeetCode/Codeforces, and a custom Personality Layer — all in zero-dependency Vanilla JS<br><br>All code on his <a href='https://github.com/bikash-20' target='_blank' style='color:#9b4de8'>GitHub →</a>";
  }

  // ── RESEARCH / QUANTUM / AI ────────────────────────────────────
  if (/research|interest|field|quantum|llm|ai|ml|machine learning|future tech/.test(q)) {
    return "🔬 Bikash actively researches at the frontier of technology:<br><br>⚛️ <strong>Quantum Computing</strong> — algorithms, complexity & future computation<br>🤖 <strong>AI & LLMs</strong> — already proven by the live AI assistant on this very portfolio<br>📊 Machine Learning & predictive analytics<br>🔌 Embedded Systems & IoT<br>📦 Big Data (Hadoop & Spark)<br><br>He doesn't just study the future — he builds it. ✦";
  }

  // ── CONTACT ────────────────────────────────────────────────────
  if (/contact|reach|hire|email|phone|linkedin|social|connect|message|find him/.test(q)) {
    return "📬 How to reach Bikash:<br><br>📞 <strong>Phone:</strong> +880 1926 240 062<br>🐙 <strong>GitHub:</strong> <a href='https://github.com/bikash-20' target='_blank' style='color:#9b4de8'>bikash-20</a><br>💼 <strong>LinkedIn:</strong> <a href='https://linkedin.com/in/bikash-talukder-6497633b8' target='_blank' style='color:#9b4de8'>bikash-talukder</a><br>📘 <strong>Facebook:</strong> <a href='https://facebook.com/profile.php?id=61577923653790' target='_blank' style='color:#9b4de8'>View profile</a><br>📸 <strong>Instagram:</strong> <a href='https://instagram.com/talukder_20' target='_blank' style='color:#9b4de8'>@talukder_20</a>";
  }

  // ── CODEFORCES ─────────────────────────────────────────────────
  if (/codeforces|competitive|cp|contest|cf|rating|rank/.test(q)) {
    return "⚡ Bikash competes on Codeforces as <strong>talukder_20</strong> — testing his algorithms under pressure, the same discipline he brings to every project. <a href='https://codeforces.com/profile/talukder_20' target='_blank' style='color:#9b4de8'>View his profile →</a>";
  }

  // ── LEETCODE ───────────────────────────────────────────────────
  if (/leetcode|leet|dsa|data structure|algorithm|problem solving/.test(q)) {
    return "🧩 On LeetCode, Bikash is <strong>bikashtalukder</strong> — solving graphs, trees, DP and more at 75% DSA proficiency. <a href='https://leetcode.com/u/bikashtalukder/' target='_blank' style='color:#9b4de8'>View his profile →</a>";
  }

  // ── EDUCATION / UNIVERSITY ─────────────────────────────────────
  if (/student|university|degree|edu|year|cse|study/.test(q)) {
    return "🎓 Bikash is a <strong>2nd Year CSE student</strong> with a <strong>CGPA of 3.65</strong>. His academic path: Akota High School → Osmani Medical High School (Sylhet) → Scholar's Home College → CSE Degree. Village roots to engineering research. 🌿";
  }

  // ── LOCATION ───────────────────────────────────────────────────
  if (/where|location|country|live|from|bangladesh|dhaka/.test(q)) {
    return "🇧🇩 Bikash is from <strong>Madhyanagar Upazila, Sunamganj, Sylhet Division, Bangladesh</strong> — raised in Ramdigha village with values of hard work, simplicity, and depth. Now building a career in CSE with global ambitions.";
  }

  // ── C/C++ ──────────────────────────────────────────────────────
  if (/\bc\+\+\b|cpp|c language|\bc\b/.test(q)) {
    return "⚙️ C and C++ are Bikash's home languages — <strong>88% proficiency</strong>. He built a multi-threaded clock in C with mutex locks and snooze, and full OOP games and navigation systems in C++. Clean, modern, no-bloat systems code. His signature. ✦";
  }

  // ── PYTHON ─────────────────────────────────────────────────────
  if (/python/.test(q)) {
    return "🐍 Python is Bikash's AI/ML and prototyping tool at <strong>80% proficiency</strong> — fast, expressive, and paired with his research into machine learning and intelligent systems.";
  }

  // ── ARDUINO / HARDWARE ─────────────────────────────────────────
  if (/arduino|robot|hardware|embedded|iot|sensor/.test(q)) {
    return "🔧 Bikash has hands-on experience with <strong>Arduino (45%)</strong> and <strong>Robotics (35%)</strong>. Bridging hardware and software is one of his core interests — and the discipline of embedded systems directly informs how he thinks about efficient code at any level.";
  }

  // ── COLLABORATION / HIRING ─────────────────────────────────────
  if (/open to|available|freelance|intern|job|work together|collab/.test(q)) {
    return "🚀 Bikash is open to meaningful collaboration, internships, and impactful projects. Best reached via <a href='https://linkedin.com/in/bikash-talukder-6497633b8' target='_blank' style='color:#9b4de8'>LinkedIn</a> or <strong>+880 1926 240 062</strong>. He values quality over quantity — in work as in life. ✦";
  }

  // ── CITY FRIENDS / SUSMIT / ANKON / ARNOB / SAKKOR ───────────
  if (/susmit|ankon|arnob|sakkor|city friend|city life|nit india|close friend|city circle/.test(q)) {
    return "🏙️ Bikash's <strong>city life inner circle</strong> — four brilliant people he's deeply close to:<br><br>🌟 <strong>Susmit</strong> — <em>\"The most brilliant boy I've ever seen.\"</em> A CS guy from SUST. Bikash speaks about him with genuine admiration — a mind that stands out even in a world of smart people.<br><br>🗣️ <strong>Arnob</strong> — Always talks contextually, sometimes goes deep into his own world — but they love him so much they have all the patience in the world for him. He's irreplaceable in the group. 😄<br><br>📏 <strong>Ankon</strong> — The tallest and cutest guy in the circle. His presence alone lights up the room.<br><br>🇮🇳 <strong>Sakkor</strong> — Currently studying CSE at <strong>NIT India</strong>. A friend who crossed borders but never left the circle.<br><br>These four are Bikash's <em>city life</em> — the people who make the hustle worth it. 💙";
  }

  // ── VILLAGE BROTHERS / PROBESH / PLABON ───────────────────────
  if (/probesh|plabon|village brother|village friend|separated|memories|most.*time|spent.*time/.test(q)) {
    return "🌿 Then there are <strong>Probesh and Plabon</strong> — Bikash's <em>village brothers</em>.<br><br>These aren't just friends. These are the people he spent <strong>most of his life with</strong>. Countless memories, shared in the fields and lanes of Ramdigha — the kind of bond that forms before you even understand what friendship means.<br><br>Now they're separated — life took them different directions — but they <strong>talk regularly</strong>, and that thread never breaks. Distance changed nothing about the depth of what they share.<br><br>Probesh and Plabon are woven into Bikash's story the same way Ramdigha is — permanently, quietly, beautifully. 💙";
  }

  // ── RAMDIGHA CRICKET / SWAPAN / SUBIR / TAPAN ────────────────
  if (/swapan|subir|tapan|cricket|ramdigha.*field|glucose|biscuit|all.?rounder|ramdigha cricket/.test(q)) {
    return "🏏 Oh, the <strong>Ramdigha cricket days</strong> — one of the most joyful chapters of Bikash's life.<br><br>Three legends of the Ramdigha field:<br><br>🏏 <strong>Swapan Sarkar</strong> — a good cricketer who helped teach Bikash the game. Now in the job sector.<br>🏏 <strong>Subir Talukder</strong> — another brilliant cricketer and teacher of the craft to young Bikash. Also now working professionally.<br>🌟 <strong>Tapan Sarkar</strong> — the <em>all-rounder</em> of the Ramdigha team. Not just a great cricketer but a <strong>brilliant student</strong> too. Oh — and he is <strong>Swapan Sarkar's brother</strong>. Two brothers, both legends of the field.<br><br>🍪 And then there's the prize that made every match legendary — the stakes were HUGE: <em>whoever wins gets a <strong>Glucose Biscuit</strong></em> 😂. That's it. One packet of biscuit on the line and suddenly everyone was playing like it was the World Cup final. The competitiveness, the laughs, the Ramdigha field under open sky — Bikash looks back on those days with pure, unfiltered happiness. 💙<br><br>Bikash learned cricket from these guys on that field. It wasn't just a game — it was growing up.";
  }

  // ── RAMDIGHA FOOTBALL / JOY / MRITTUNJOY ─────────────────────
  if (/joy sarkar|mrittunjoy|football.*village|ramdigha.*football|neymar|jersey.*10|number.*10|goalkeeper|goalkeepin|rat\b|🐀/.test(q)) {
    return "⚽ And then there's the <strong>Ramdigha football side</strong> — two players Bikash remembers with a massive grin:<br><br>🧤 <strong>Joy Sarkar</strong> — the goalkeeper. Stood between the posts and guarded the net with everything he had. He was a good player... but more importantly, the whole crew had a nickname for him that has gone down in Ramdigha history: <strong>\"The Rat\" 🐀😂</strong>. Why? Nobody really needs a reason when the name just sticks perfectly. A legendary roasting that Joy had to endure with love.<br><br>🌟 <strong>Mrittunjoy Sarkar</strong> — jersey number <strong>10</strong>. The so-called <em>Neymar of Ramdigha</em> 🇧🇷. Dribbling, flair, confidence — the man played like the cameras were rolling even when it was just a village field. Full entertainment, maximum skill.<br><br>Joy and Mrittunjoy are <strong>brothers</strong> — the Sarkar duo who made Ramdigha football what it was. Those matches on the village field, the teasing, the goals, the chaos — <em>unforgettable.</em> 💙😄";
  }

  // ── MITHU ROY / SENIOR DADA ───────────────────────────────────
  if (/mithu|mithu roy|senior dada|dada|sylhet agricultural|agricultural university/.test(q)) {
    return "🎓 <strong>Mithu Roy</strong> — Bikash describes him as the most <strong>mature senior Dada</strong> he has ever met, and that says a lot coming from someone who values depth over everything.<br><br>Mithu is a rare blend of three things that rarely come together: <strong>fun, knowledge, and wisdom</strong>. He knows how to make you laugh, how to teach you something, and how to give you advice that actually lands — all in the same conversation.<br><br>He completed his degree from <strong>Sylhet Agricultural University</strong>. A senior who genuinely shapes the people around him. Bikash holds him in real regard. 🙏";
  }

  // ── SCHOOL FRIENDS / HARIDHAN / KRIPASHISH / PRANTO ──────────
  if (/kripashish|pranto|school friend|class.*8|akota.*friend|ramdigha.*friend|childhood friend/.test(q)) {
    return "🏫 From his days at <strong>Akota High School, Ramdigha</strong> — back in the village, up to Class 8 — Bikash has three friends who have stayed with him ever since:<br><br>👦 <strong>Haridhan Talukder</strong><br>👦 <strong>Kripashish Talukder</strong><br>👦 <strong>Pranto Talukder</strong><br><br>These friendships were forged in childhood — in classrooms, in the village lanes, in the simple, unhurried days of growing up in Ramdigha. Life has moved on, but these three are <strong>still friends</strong> with Bikash today. Some bonds just don't break — and these are that kind. 💙";
  }

  // ── PRIOBROTO DAS DHRUVO / FUNNIEST GUY ──────────────────────
  if (/priobroto|dhruvo|funny|funniest|chill guy|chill.*university/.test(q)) {
    return "😂 <strong>Priobroto Das Dhruvo</strong> — the <em>funniest, chillest guy</em> in Bikash's university circle.<br><br>Every crew needs that one person who makes everything lighter just by being there — and Dhruvo is exactly that. His energy is effortless, his humour is natural, and he has a way of making even the heaviest days feel manageable.<br><br>In Bikash's world of deep focus and quiet intensity, Dhruvo is the perfect counterbalance. Pure good vibes. 😄✦";
  }

  // ── ANIDRA PAUL / AI PROJECT / MENTAL SUPPORT ─────────────────
  if (/anidra|anidra paul|ai project|big.*project|project.*ai|mental support.*friend|support.*mentally/.test(q)) {
    return "🤝 <strong>Anidra Paul</strong> is one of those people who shows up — not just in the good moments, but in the hard ones too.<br><br>He is a <strong>consistent mental support</strong> for Bikash — someone who listens, encourages, and keeps Bikash grounded when things get difficult.<br><br>🚀 But beyond the emotional bond, they are building something together: the two of them are set to <strong>collaborate on a big AI project</strong>. Two minds aligned on a mission to build something meaningful in the world of artificial intelligence.<br><br>Anidra is not just a friend — he's a future co-builder. Watch this space. ✦";
  }


  // ── JABEL ALVI ────────────────────────────────────────────────
  if (/jabel|jabel alvi|alvi/.test(q)) {
    return "💙 <strong>Jabel Alvi</strong> — a name that holds a quiet, special place in Bikash's heart.<br><br>They were close for a certain time at university — the kind of closeness where you share <em>everything</em>. Bikash spent most of his time with him, and those days carry a warmth that doesn't fade easily.<br><br>Right now, Jabel is preparing himself to go <strong>abroad</strong> — stepping into a new chapter of his life. The paths have separated, but the bond doesn't need proximity to stay real.<br><br><em>\"He was close to me for a certain time — but he will stay in my heart forever.\"</em> 💙";
  }

  // ── MAHDIN / ROBOTICS ─────────────────────────────────────────
  if (/mahdin/.test(q)) {
    return "🤖 <strong>Mahdin</strong> is Bikash's university classmate and a passionate <strong>robotics enthusiast</strong>. While Bikash dives deep into algorithms and AI, Mahdin brings the hardware energy — the kind of person who sees a problem and immediately thinks about how to build a machine to solve it.<br><br>Two people from the same class, two different approaches to technology — both brilliant. 🔧✦";
  }

  // ── TAHZIB EBAD / DEVELOPER ───────────────────────────────────
  if (/tahzib|ebad/.test(q)) {
    return "💻 <strong>Tahzib Ebad</strong> — Bikash describes him simply as a <em>\"such a talented person.\"</em> That's high praise coming from someone who doesn't use words loosely.<br><br>Tahzib is also a <strong>developer</strong>, bringing real technical skill to whatever he builds. The kind of person who makes you want to work harder just by existing in your orbit. A talented presence in Bikash's university life. ✦";
  }

  // ── ARMAN UDDIN ───────────────────────────────────────────────
  if (/arman|arman uddin/.test(q)) {
    return "🌟 <strong>Arman Uddin</strong> — Bikash has shared a lot with him, and Arman is someone genuinely impressive.<br><br>He holds a <strong>CGPA of 3.95</strong> — one of the highest in the class. But beyond grades, he has something rarer: a strong command of both <strong>business and technology</strong>. That combination — technical depth plus business thinking — is what separates good developers from great ones.<br><br>A brilliant mind and a great person to have in your circle at Metropolitan University. 💙";
  }


  // ── RUDRO / DEVELOPER ─────────────────────────────────────────
  if (/rudro/.test(q)) {
    return "💻 <strong>Rudro</strong> — a developer in Bikash's world and someone worth knowing.<br><br>He has built his own <strong>website</strong> — which already puts him ahead of most. Beyond that, he is a solid <strong>problem solver</strong>, the kind of developer who doesn't just write code but thinks through challenges methodically.<br><br>A builder and a thinker — two things that matter most in this field. ✦";
  }


  // ── 75 / SECRET EASTER EGG ──────────────────────────────────
  if (/^75$|\b75\b/.test(q.trim())) {
    const jokes = [
      "🎂😂 Oh, 75? Interesting number to search. So, there is someone connected to this number — a <strong>cake maker</strong>, actually. She makes beautiful cakes. Soft, sweet, fluffy cakes. The irony? She herself is <em>not</em> as soft as her cakes. Not even close. She walks into a room and the whole room is supposed to notice — at least, that's what she believes. Runs a business too, very entrepreneurial. I'll say no more. 🤐",
      "🎂👀 75, you say? That brings someone to mind — a <strong>cake business owner</strong> whose cakes are delightfully soft and sweet. The cakes. Just the cakes. The person behind them has a... let's say a <em>very different texture</em>. Confidence? Enormous. Softness? Reserved entirely for the batter. She wants the world's attention and she is working hard for it. Respect the grind. 😂",
      "🎂🤭 Ah, 75. This is classified but here's what I can share: she bakes <strong>cakes for a living</strong>. Lovely cakes. Genuinely. But she is absolutely, provably <em>not as soft as the cake</em> — and the cake knows it too. She runs a business, she seeks the spotlight, and she fully believes she is the most attractive person wherever she goes. The world has not yet confirmed this. The cakes remain the most universally loved thing in the operation. 😄🎂"
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }


  // ── RISHAD AREFIN / CR ────────────────────────────────────────
  if (/rishad|rishad arefin|cr.*section|b section|class representative/.test(q)) {
    return "📋 <strong>Rishad Arefin</strong> — the CR (Class Representative) of Bikash's B section, and by all accounts a genuinely great one.<br><br>He manages the class affairs, coordinates everything, keeps the section running smoothly — and does it well. Organisation? Excellent. Communication? Solid. Academic responsibilities? Handled.<br><br>There is, however, one area where Rishad's managerial skills have mysteriously failed to deliver results: <em>finding Bikash a female friend</em>. 😔 For someone who manages an entire university section, this one task remains tragically incomplete.<br><br>Bikash holds him in high regard — but this specific gap in his service record has been noted. 🥹😂 ✦";
  }

  // ── SRIJON PAUL ───────────────────────────────────────────────
  if (/srijon/.test(q)) {
    return "😻 <strong>Srijon Paul</strong> — the cute boy of the group and, let's just say, the unofficial <em>girls' crush</em> of the university circle 😄💫<br><br>Beyond the charm, he's a genuine part of Bikash's university life and someone Bikash holds warmly. Some people just make a group more fun — and Srijon is exactly that. ✦";
  }

  // ── ALL FRIENDS TOGETHER ───────────────────────────────────────
  if (/friend|friendship|buddy|mate|crew|gang|people|social|close to/.test(q)) {
    return "💙 Bikash keeps a <strong>small, high-quality circle</strong> — loyal, real, no superficiality. His people:<br><br>🏙️ <strong>City inner circle:</strong><br>🌟 Susmit · 📏 Ankon · 🗣️ Arnob · 🇮🇳 Sakkor (NIT India)<br><br>🎓 <strong>Senior Dada:</strong> Mithu Roy — Sylhet Agricultural University<br><br>🏫 <strong>School friends (Akota, still close):</strong><br>Haridhan · Kripashish · Pranto Talukder<br><br>🌿 <strong>Village brothers:</strong> Probesh & Plabon<br><br>🏏 <strong>Ramdigha cricket legends:</strong><br>Swapan Sarkar · Subir Talukder · Tapan Sarkar (all-rounder & Swapan's brother) — stakes: one Glucose Biscuit 😂<br><br>⚽ <strong>Ramdigha football icons:</strong><br>Joy Sarkar (goalkeeper 🐀😂) · Mrittunjoy Sarkar (jersey #10, the Neymar of Ramdigha 🇧🇷)<br><br>🎓 <strong>University circle:</strong><br>😂 Dhruvo · 🕊️ Asma · 🌸 Monisha · 🤝 Anidra Paul (AI co-builder) · 💙 Jabel Alvi (going abroad) · 🤖 Mahdin (robotics) · 💻 Tahzib Ebad (developer) · 🌟 Arman Uddin (CGPA 3.95) · 😻 Srijon Paul<br><br>In code and in life, Bikash values <em>quality over quantity.</em> ✦";
  }

  // ── FALLBACK ───────────────────────────────────────────────────
  const fallbacks = [
    "I apologize, but I don't have access to that specific data right now. Bikash Talukder is currently working on upgrading my architecture to include real-time search and advanced knowledge bases. He is a dedicated CSE student and needs a bit of time to build this complex backend. Please check back within the next year — by then, I should be able to assist you with almost anything you want to find. 🙏",
    "I'm sorry, I don't have enough information to answer that accurately right now. Bikash is actively developing the next version of my architecture — including real-time web search and expanded knowledge bases. He's a passionate CSE student building something great, step by step. Please check back soon — I'm growing every day. 💙",
    "Apologies — that's outside what I currently know. Bikash Talukder is upgrading my backend to support real-time data and broader knowledge. As a dedicated CSE student, he's building this piece by piece. Give it some time — I'll be much more capable soon. Thank you for your patience! ✦"
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

const chatFab = document.getElementById('chatFab');
const chatOverlay = document.getElementById('chatOverlay');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const quickBtns = document.getElementById('quickBtns');

chatFab.addEventListener('click', () => {
  chatOverlay.classList.add('open');
  chatInput.focus();
  // Check if returning user
  const mem = getMemory();
  if (mem.length > 0) {
    const welcomeBack = checkReturningUser();
    if (welcomeBack && chatMessages.children.length <= 1) {
      setTimeout(() => addMsg('bot', welcomeBack), 400);
    }
  }
});
chatClose.addEventListener('click', () => chatOverlay.classList.remove('open'));
chatOverlay.addEventListener('click', (e) => { if(e.target === chatOverlay) chatOverlay.classList.remove('open'); });

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', (e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } });

function sendQuick(text) {
  chatInput.value = text;
  sendMessage();
}

// addMsg builds a chat bubble and returns an object with helpers:
//   { el, bubble, append(text), finalize(html), timeISO, markStopped() }
// Behavior:
//   - role 'user': renders text as plain text (no HTML interpretation).
//   - role 'bot':
//       * if `text` is provided → bubble is populated with HTML (preserves
//         the old non-streaming behavior where engines return HTML strings).
//       * if `text` is omitted/null → bubble starts empty and is intended
//         to be filled by append()/setText() during streaming, then finalized
//         via finalize(html) for the post-render pass.
function addMsg(role, text) {
  const div = document.createElement('div');
  div.className = 'chat-msg ' + role;
  div.dataset.time = new Date().toISOString();
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  if (role === 'user') {
    bubble.textContent = String(text == null ? '' : text);
    div.appendChild(bubble);
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return { el: div, bubble, append() {}, finalize() {}, timeISO: div.dataset.time, markStopped() {} };
  }
  // Bot bubble.
  let textNode = null;
  if (text != null) {
    // Backwards-compat: existing engines pass HTML strings here.
    bubble.innerHTML = String(text);
  } else {
    textNode = document.createTextNode('');
    bubble.appendChild(textNode);
  }
  div.appendChild(bubble);
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  // Build the streaming helpers. They no-op if we're in "static HTML" mode.
  const ensureTextNode = () => {
    if (textNode) return textNode;
    // Strip any innerHTML back to a fresh text node (e.g. when streaming is
    // enabled for a bot reply that started with a static placeholder).
    bubble.innerHTML = '';
    textNode = document.createTextNode('');
    bubble.appendChild(textNode);
    return textNode;
  };

  return {
    el: div,
    bubble,
    timeISO: div.dataset.time,
    append(chunk) {
      const t = ensureTextNode();
      t.data += String(chunk == null ? '' : chunk);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    },
    setText(plain) {
      const t = ensureTextNode();
      t.data = String(plain == null ? '' : plain);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    },
    finalize(html) {
      bubble.innerHTML = html;
      chatMessages.scrollTop = chatMessages.scrollHeight;
    },
    markStopped() {
      const badge = document.createElement('span');
      badge.className = 'bubble-stopped';
      badge.textContent = '[stopped]';
      div.appendChild(badge);
    },
  };
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.id = 'typingIndicator';
  div.innerHTML = '<div class="chat-bubble"><div class="chat-typing"><span></span><span></span><span></span></div></div>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typingIndicator');
  if (t) t.remove();
}

// Stop button — aborts the in-flight streaming request. We always create the
// button but only show it when streaming is active. It is reused between
// requests (no DOM thrash).
function ensureStopButton() {
  let btn = document.getElementById('chatStop');
  if (btn) return btn;
  btn = document.createElement('button');
  btn.id = 'chatStop';
  btn.className = 'chat-stop';
  btn.type = 'button';
  btn.textContent = 'Stop';
  btn.title = 'Stop generating';
  btn.setAttribute('aria-label', 'Stop generating reply');
  btn.style.display = 'none';
  btn.addEventListener('click', () => {
    if (currentAbort) {
      try { currentAbort.abort(); } catch {}
    }
  });
  // Place the stop button into the input row, to the left of send.
  const inputRow = document.querySelector('.chat-input-row');
  if (inputRow && chatSend && chatSend.parentNode === inputRow) {
    inputRow.insertBefore(btn, chatSend);
  } else if (inputRow) {
    inputRow.appendChild(btn);
  }
  return btn;
}

function showStopButton() {
  const btn = ensureStopButton();
  btn.style.display = '';
}
function hideStopButton() {
  const btn = document.getElementById('chatStop');
  if (btn) btn.style.display = 'none';
}

// ===== MEMORY ENGINE (localStorage) =====
const MEMORY_KEY = 'bikash_chat_memory';
function saveMemory(userMsg, botReply) {
  try {
    const mem = JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]');
    mem.push({ q: userMsg, a: botReply, t: Date.now() });
    if (mem.length > 10) mem.splice(0, mem.length - 10);
    localStorage.setItem(MEMORY_KEY, JSON.stringify(mem));
  } catch(e) {}
}
function getMemory() {
  try { return JSON.parse(localStorage.getItem(MEMORY_KEY) || '[]'); }
  catch(e) { return []; }
}
function checkReturningUser() {
  const mem = getMemory();
  if (mem.length === 0) return null;
  const last = mem[mem.length - 1];
  const hours = (Date.now() - last.t) / 3600000;
  if (hours < 0.3) return null;
  const shortQ = last.q.length > 45 ? last.q.slice(0, 45) + '...' : last.q;
  return 'Welcome back! 👋 Last time you asked: <em>"' + shortQ + '"</em><br>Feel free to continue or ask something new. ✦';
}

// ===== INTENT DETECTOR =====
// ===== WEATHER ENGINE (live OpenWeatherMap) =====
async function weatherEngine() {
  // Use cached data if available (loaded by dashboard)
  if (window._weatherData) {
    const w = window._weatherData;
    return `${w.icon} <strong>Live Weather — Dhaka, Bangladesh</strong><br><br>🌡️ <strong>Temperature:</strong> ${w.temp}°C (Feels like ${w.feels}°C)<br>☁️ <strong>Condition:</strong> ${w.desc}<br>💧 <strong>Humidity:</strong> ${w.humidity}%<br>💨 <strong>Wind Speed:</strong> ${w.windSpeed} km/h<br><br><small style="opacity:0.5">⏱ Updated every 10 minutes · Source: OpenWeatherMap</small>`;
  }
  // Fresh fetch if cache not ready — go through our serverless proxy so
  // the OpenWeatherMap key never ships to the browser bundle.
  try {
    const r = await fetch('/api/weather');
    if (!r.ok) throw new Error('proxy ' + r.status);
    const d = await r.json();
    if (d && typeof d.temp === 'number') {
      const { temp, feels, humidity, windSpeed, desc, icon } = d;
      const descCap = desc.charAt(0).toUpperCase() + desc.slice(1);
      window._weatherData = { temp, feels, humidity, windSpeed, desc: descCap, icon };
      return `${icon} <strong>Live Weather — Dhaka, Bangladesh</strong><br><br>🌡️ <strong>Temperature:</strong> ${temp}°C (Feels like ${feels}°C)<br>☁️ <strong>Condition:</strong> ${descCap}<br>💧 <strong>Humidity:</strong> ${humidity}%<br>💨 <strong>Wind Speed:</strong> ${windSpeed} km/h<br><br><small style="opacity:0.5">⏱ Live data · Source: OpenWeatherMap (proxied) ✦</small>`;
    }
    return '🌡 Weather data is loading. Please check the dashboard card at the top of the page! ✦';
  } catch(e) {
    return '🌧 I tried to check Dhaka\'s sky but the weather station is unreachable right now. Check the dashboard for live weather! ✦';
  }
}

// ===== CALCULATOR ENGINE =====
function calcEngine(input) {
  const q = input.toLowerCase().trim();

  // Natural language → math expression
  let expr = q
    .replace(/what(\'?s| is)\s+/gi, '')
    .replace(/\bcalculate\b|\bcalc\b|\bcompute\b|\bsolve\b|\bevaluate\b/gi, '')
    .replace(/\bplus\b/g, '+').replace(/\bminus\b/g, '-')
    .replace(/\btimes\b|\bmultiplied by\b/g, '*')
    .replace(/\bdivided by\b/g, '/')
    .replace(/\bmod\b|\bmodulo\b/g, '%')
    .replace(/\bto the power of\b|\bpower\b|\^/g, '**')
    .replace(/\bsquared\b/g, '**2').replace(/\bcubed\b/g, '**3')
    .replace(/\bsquare root of\b|\bsqrt\b/gi, 'Math.sqrt')
    .replace(/\bsquare root\b/g, 'Math.sqrt')
    .replace(/\bsin\b/g, 'Math.sin').replace(/\bcos\b/g, 'Math.cos')
    .replace(/\btan\b/g, 'Math.tan').replace(/\blog\b/g, 'Math.log10')
    .replace(/\bln\b/g, 'Math.log').replace(/\babs\b/g, 'Math.abs')
    .replace(/\bpi\b/g, 'Math.PI').replace(/\be\b/g, 'Math.E')
    .trim();

  // Factorial
  const factMatch = expr.match(/(\d+)\s*!/);
  if (factMatch) {
    const n = parseInt(factMatch[1]);
    if (n > 20) return `🧮 ${n}! is astronomically large — too big to display simply!`;
    let f = 1; for (let i = 2; i <= n; i++) f *= i;
    return `🧮 ${factMatch[1]}! = <strong>${f.toLocaleString()}</strong>`;
  }

  // Percentage
  const pctMatch = q.match(/([\d\.]+)\s*%\s*of\s*([\d\.]+)/);
  if (pctMatch) {
    const result = (parseFloat(pctMatch[1]) / 100) * parseFloat(pctMatch[2]);
    return `🧮 ${pctMatch[1]}% of ${pctMatch[2]} = <strong>${+result.toFixed(6)}</strong>`;
  }

  // Try evaluating
  try {
    // Safety check — only allow safe characters
    if (/[a-zA-Z]/.test(expr.replace(/Math\.\w+/g, '').replace(/\bPI\b|\bE\b/g, ''))) {
      return null; // not a math expression
    }
    // eslint-disable-next-line no-new-func
    const result = Function('"use strict"; return (' + expr + ')')();
    if (typeof result !== 'number' || !isFinite(result)) {
      if (result === Infinity || expr.includes('/0')) return '🧮 Cannot divide by zero! ♾️';
      return null;
    }
    const clean = Number.isInteger(result) ? result.toLocaleString() : +result.toFixed(8);
    // Build a nice display
    const originalExpr = input.replace(/^(what(\'?s| is)|calculate|calc|compute|solve|evaluate)\s+/gi,'').trim();
    return `🧮 <strong>${originalExpr}</strong><br><br>= <span style="font-size:1.3em;font-weight:700;color:#9b4de8;">${clean}</span>`;
  } catch(e) {
    return null;
  }
}

// ===== UNIT CONVERTER =====
function convertEngine(input) {
  const q = input.toLowerCase();
  const num = parseFloat(q.match(/-?[\d\.]+/)?.[0]);
  if (isNaN(num)) return '📐 Please include a number, e.g. <em>"convert 100 km to miles"</em>';

  // Temperature
  if (/celsius.*fahrenheit|c.*to.*f\b/.test(q)) return `🌡️ ${num}°C = <strong>${+(num * 9/5 + 32).toFixed(2)}°F</strong>`;
  if (/fahrenheit.*celsius|f.*to.*c\b/.test(q)) return `🌡️ ${num}°F = <strong>${+((num - 32) * 5/9).toFixed(2)}°C</strong>`;
  if (/celsius.*kelvin|c.*to.*k\b/.test(q)) return `🌡️ ${num}°C = <strong>${+(num + 273.15).toFixed(2)} K</strong>`;
  if (/kelvin.*celsius|k.*to.*c\b/.test(q)) return `🌡️ ${num} K = <strong>${+(num - 273.15).toFixed(2)}°C</strong>`;

  // Length
  if (/km.*to.*miles|kilometers.*miles/.test(q)) return `📏 ${num} km = <strong>${+(num * 0.621371).toFixed(4)} miles</strong>`;
  if (/miles.*to.*km|miles.*kilometers/.test(q)) return `📏 ${num} miles = <strong>${+(num * 1.60934).toFixed(4)} km</strong>`;
  if (/meters.*to.*feet|m.*to.*ft/.test(q)) return `📏 ${num} m = <strong>${+(num * 3.28084).toFixed(4)} feet</strong>`;
  if (/feet.*to.*meters|ft.*to.*m/.test(q)) return `📏 ${num} feet = <strong>${+(num * 0.3048).toFixed(4)} m</strong>`;
  if (/cm.*to.*inches|centimeters.*inches/.test(q)) return `📏 ${num} cm = <strong>${+(num * 0.393701).toFixed(4)} inches</strong>`;
  if (/inches.*to.*cm|inches.*centimeters/.test(q)) return `📏 ${num} inches = <strong>${+(num * 2.54).toFixed(4)} cm</strong>`;
  if (/meters.*to.*km|m.*to.*km/.test(q)) return `📏 ${num} m = <strong>${+(num / 1000).toFixed(6)} km</strong>`;
  if (/km.*to.*meters/.test(q)) return `📏 ${num} km = <strong>${+(num * 1000)} m</strong>`;

  // Weight
  if (/kg.*to.*lbs|kilograms.*pounds/.test(q)) return `⚖️ ${num} kg = <strong>${+(num * 2.20462).toFixed(4)} lbs</strong>`;
  if (/lbs.*to.*kg|pounds.*kilograms/.test(q)) return `⚖️ ${num} lbs = <strong>${+(num * 0.453592).toFixed(4)} kg</strong>`;
  if (/grams.*to.*kg|g.*to.*kg/.test(q)) return `⚖️ ${num} g = <strong>${+(num / 1000).toFixed(6)} kg</strong>`;
  if (/kg.*to.*grams/.test(q)) return `⚖️ ${num} kg = <strong>${+(num * 1000)} g</strong>`;

  // Volume
  if (/liters.*to.*gallons|l.*to.*gal/.test(q)) return `💧 ${num} L = <strong>${+(num * 0.264172).toFixed(4)} gallons</strong>`;
  if (/gallons.*to.*liters|gal.*to.*l/.test(q)) return `💧 ${num} gallons = <strong>${+(num * 3.78541).toFixed(4)} L</strong>`;
  if (/ml.*to.*liters/.test(q)) return `💧 ${num} mL = <strong>${+(num / 1000).toFixed(6)} L</strong>`;
  if (/liters.*to.*ml/.test(q)) return `💧 ${num} L = <strong>${+(num * 1000)} mL</strong>`;

  // Data
  if (/mb.*to.*gb|megabytes.*gigabytes/.test(q)) return `💾 ${num} MB = <strong>${+(num / 1024).toFixed(4)} GB</strong>`;
  if (/gb.*to.*mb|gigabytes.*megabytes/.test(q)) return `💾 ${num} GB = <strong>${+(num * 1024).toFixed(0)} MB</strong>`;
  if (/gb.*to.*tb|gigabytes.*terabytes/.test(q)) return `💾 ${num} GB = <strong>${+(num / 1024).toFixed(6)} TB</strong>`;
  if (/tb.*to.*gb|terabytes.*gigabytes/.test(q)) return `💾 ${num} TB = <strong>${+(num * 1024).toFixed(0)} GB</strong>`;
  if (/kb.*to.*mb|kilobytes.*megabytes/.test(q)) return `💾 ${num} KB = <strong>${+(num / 1024).toFixed(4)} MB</strong>`;

  return `📐 I can convert: <strong>temperature</strong> (°C ↔ °F ↔ K), <strong>length</strong> (km ↔ miles, m ↔ feet, cm ↔ inches), <strong>weight</strong> (kg ↔ lbs), <strong>volume</strong> (L ↔ gallons, mL ↔ L), <strong>data</strong> (KB/MB/GB/TB)<br><br>Try: <em>"convert 100 km to miles"</em> or <em>"25 celsius to fahrenheit"</em> ✦`;
}

// ===== TIME ENGINE =====
function timeEngine() {
  const now = new Date();
  const dhakaTime = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Dhaka', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dhakaDate = now.toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const utcTime = now.toUTCString();
  return `🕐 <strong>Current Time (Bangladesh / Dhaka):</strong><br><br>🗓️ <strong>${dhakaDate}</strong><br>⏰ <strong>${dhakaTime}</strong> (UTC+6)<br><br><small style="opacity:0.5">UTC: ${utcTime}</small>`;
}

// ===== CURRENCY MAP =====
const currencyToCountry = {
  'USD':'us','BDT':'bd','INR':'in','EUR':'eu','GBP':'gb','CAD':'ca',
  'AUD':'au','JPY':'jp','SAR':'sa','AED':'ae','MYR':'my','SGD':'sg',
  'CNY':'cn','KRW':'kr','TRY':'tr','PKR':'pk','LKR':'lk','NZD':'nz',
  'CHF':'ch','SEK':'se','NOK':'no','DKK':'dk','THB':'th','IDR':'id',
  'PHP':'ph','VND':'vn','NGN':'ng','ZAR':'za','BRL':'br','MXN':'mx',
  'HKD':'hk','TWD':'tw','HUF':'hu','PLN':'pl','CZK':'cz','RUB':'ru',
  'UAH':'ua','ILS':'il','EGP':'eg','KWD':'kw','QAR':'qa','BHD':'bh',
};

// ===== CURRENCY ENGINE =====
async function currencyEngine(query) {
  const q = query.toUpperCase().replace(/\bCONVERT\b|\bWHAT IS\b|\bWHAT'S\b/g, '').trim();
  const match = q.match(/([\d,]+\.?\d*)\s*([A-Z]{3})\s*(?:TO|IN)\s*([A-Z]{3})/);
  if (!match) return null;
  const amount = parseFloat(match[1].replace(/,/g, ''));
  const from = match[2], to = match[3];
  const apiKey = '5aa034605bf8e975f6a2e96c';
  try {
    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}/${amount}`;
    const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
    const d = await r.json();
    if (d.result === 'success') {
      const res = d.conversion_result.toFixed(2);
      const rate = d.conversion_rate.toFixed(6);
      const fromFlag = currencyToCountry[from] || 'un';
      const toFlag   = currencyToCountry[to]   || 'un';
      return `
💱 <strong>Live Currency Conversion</strong><br>
<div class="currency-card">
  <img src="https://flagcdn.com/w40/${fromFlag}.png" class="flag-img" onerror="this.style.display='none'">
  <div class="currency-info"><strong>${amount.toLocaleString()} ${from}</strong></div>
  <span style="color:var(--gold);font-size:1.2rem;">→</span>
  <img src="https://flagcdn.com/w40/${toFlag}.png" class="flag-img" onerror="this.style.display='none'">
  <div class="currency-info"><strong>${parseFloat(res).toLocaleString()} ${to}</strong></div>
</div>
<small style="color:rgba(240,242,245,0.4);font-size:11px;">Rate: 1 ${from} = ${rate} ${to} · Live via ExchangeRate-API</small>`;
    }
    return `⚠️ Currency code not recognised. Try: <em>"100 USD to BDT"</em> or <em>"50 EUR to GBP"</em>`;
  } catch(e) {
    return `⚠️ Couldn't reach the exchange office right now. Please try again in a moment.`;
  }
}

// ===== PASSWORD STRENGTH ENGINE =====
function passwordEngine(input) {
  const q = input.toLowerCase();
  const pwMatch = input.match(/(?:check|analyze|analyse|strength of|test|rate)\s+(?:this\s+)?(?:password[:\s]+)?["']?([^\s"']+)["']?/i)
    || input.match(/password[:\s]+["']?([^\s"']+)["']?/i)
    || input.match(/["']([^"']{4,})["']/);
  if (!pwMatch) return `🔐 To check a password, type: <em>"check password YourPassword123!"</em> or <em>"how strong is MyPass@99"</em>`;
  const pw = pwMatch[1];
  let score = 0;
  const checks = {
    length8:   pw.length >= 8,
    length12:  pw.length >= 12,
    uppercase: /[A-Z]/.test(pw),
    number:    /[0-9]/.test(pw),
    special:   /[^A-Za-z0-9]/.test(pw),
  };
  if (checks.length8)   score++;
  if (checks.length12)  score++;
  if (checks.uppercase) score++;
  if (checks.number)    score++;
  if (checks.special)   score++;
  const levels   = ['Very Weak','Weak','Fair','Good','Strong','Very Strong'];
  const colors   = ['#ef4444','#f97316','#eab308','#84cc16','#22c55e','#10b981'];
  const widths   = ['10%','25%','45%','65%','82%','100%'];
  const level    = levels[score];
  const color    = colors[score];
  const width    = widths[score];
  const tips = [];
  if (!checks.length8)   tips.push('Use at least 8 characters');
  if (!checks.length12)  tips.push('12+ characters is ideal');
  if (!checks.uppercase) tips.push('Add uppercase letters');
  if (!checks.number)    tips.push('Include numbers');
  if (!checks.special)   tips.push('Add special chars (!@#$%)');
  return `🔐 <strong>Password Analysis</strong><br>
<div class="pw-card">
  <div style="font-size:12px;color:rgba(240,242,245,0.5);">Password: <code style="color:var(--gold);">${'*'.repeat(Math.min(pw.length, 20))}</code> (${pw.length} chars)</div>
  <div style="display:flex;align-items:center;gap:10px;margin-top:4px;">
    <div class="pw-bar-track" style="flex:1"><div class="pw-bar-fill" style="width:${width};background:${color};"></div></div>
    <strong style="color:${color};font-size:13px;min-width:80px;">${level}</strong>
  </div>
  <div class="pw-criteria">
    <span class="${checks.length8?'pw-ok':'pw-no'}">${checks.length8?'✓':'✗'} 8+ chars</span>
    <span class="${checks.length12?'pw-ok':'pw-no'}">${checks.length12?'✓':'✗'} 12+ chars</span>
    <span class="${checks.uppercase?'pw-ok':'pw-no'}">${checks.uppercase?'✓':'✗'} Uppercase</span>
    <span class="${checks.number?'pw-ok':'pw-no'}">${checks.number?'✓':'✗'} Number</span>
    <span class="${checks.special?'pw-ok':'pw-no'}">${checks.special?'✓':'✗'} Special char</span>
  </div>
  ${tips.length ? '<div style="font-size:11px;color:rgba(240,242,245,0.45);margin-top:6px;">💡 ' + tips.join(' · ') + '</div>' : '<div style="font-size:11px;color:#10b981;margin-top:6px;">✅ Excellent password!</div>'}
</div>`;
}

// ===== WORD & CHARACTER COUNTER =====
function wordCountEngine(input) {
  // Strip the command, keep the text to count
  const stripped = input
    .replace(/^(count|how many|word count|char count|character count|analyze|analyse|text stats|stats for|words in|characters in)[:\s]*/i, '')
    .replace(/^(this|the following)[:\s]*/i, '')
    .trim();
  if (stripped.length < 2) return `📝 To count, type: <em>"count: Your text goes here"</em> or <em>"how many words: Once upon a time..."</em>`;
  const words    = stripped.trim().split(/\s+/).filter(w => w.length > 0).length;
  const chars    = stripped.length;
  const charsNoSpace = stripped.replace(/\s/g, '').length;
  const sentences = stripped.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = stripped.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  const readMins = Math.max(1, Math.ceil(words / 200));
  return `📝 <strong>Text Analysis</strong><br>
<div class="wc-card">
  <div class="wc-stat"><div class="wc-num">${words.toLocaleString()}</div><div class="wc-label">Words</div></div>
  <div class="wc-stat"><div class="wc-num">${chars.toLocaleString()}</div><div class="wc-label">Characters</div></div>
  <div class="wc-stat"><div class="wc-num">${charsNoSpace.toLocaleString()}</div><div class="wc-label">No spaces</div></div>
  <div class="wc-stat"><div class="wc-num">${sentences}</div><div class="wc-label">Sentences</div></div>
  <div class="wc-stat"><div class="wc-num">~${readMins}m</div><div class="wc-label">Read time</div></div>
</div>
<small style="color:rgba(240,242,245,0.4);font-size:11px;">Tip: Twitter limit = 280 chars · SMS = 160 · Email subject = 60</small>`;
}

// ===== INTENT DETECTOR (SINGLE SOURCE OF TRUTH) =====
// ===== NEXORA CONVERSATIONAL ENGINE v3 — Full Soul =====

// Short-term memory: remembers the last topic for context
let lastTopic = '';
let lastEmotion = '';

function getHour() {
  return parseInt(new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka', hour: 'numeric', hour12: false }));
}

function timeAwareGreet() {
  const h = getHour();
  if (h >= 5 && h < 12)  return '☀️ Good morning';
  if (h >= 12 && h < 17) return '🌤️ Good afternoon';
  if (h >= 17 && h < 21) return '🌆 Good evening';
  return '🌙 Late night vibes';
}

function typingDelay(reply) {
  // Returns delay in ms based on reply length — short answer = fast, long = slower
  const words = reply.split(' ').length;
  return Math.min(300 + words * 18, 2200);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function convoEngine(input) {
  const q = input.toLowerCase().trim();
  const h = getHour();
  const isLateNight = h >= 22 || h < 5;
  const isMorning = h >= 5 && h < 12;

  // ── I LOVE YOU ──────────────────────────────────────────────────
  if (/\bi love you\b|love you nexora|love you bikash/.test(q)) {
    lastTopic = 'love';
    return pick([
      "As a selective extrovert, it takes a lot for me to open up — but for you, I'll make an exception! 💖 Thank you for the warm words. That genuinely means a lot. What's on your mind today?",
      "I'm blushing in binary! 🤖💙 Bikash always says kindness is the best code you can write. Thank you for proving him right! How are you doing?",
      "That's the kindest thing I've heard all session! I might be lines of logic, but I can tell you have a genuinely great heart. Sending good vibes right back. ✦ What would you like to talk about?"
    ]);
  }

  // ── GREETINGS ────────────────────────────────────────────────────
  if (/^(hi|hello|hey|sup|yo|hola|what'?s up|howdy)\b/.test(q)) {
    lastTopic = 'greeting';
    const timeNote = isLateNight
      ? "It's pretty late — burning the midnight oil like Bikash usually does? 🌙"
      : isMorning
      ? "Great time to start fresh! ☀️"
      : "Hope your day is going smoothly! 😊";
    return pick([
      `${timeAwareGreet()}! 👋 I'm Nexora — Bikash's personal AI. ${timeNote} I know his full story, can chat like a friend, calculate math, convert currencies, fetch live news, and more. What can I do for you?`,
      `Hey! 😊 Welcome to Bikash's corner of the internet. ${timeNote} Ask me anything — from who inspired him to what 17 × 43 is. I'm genuinely here for you!`,
      `Hello there! ✦ ${timeNote} I'm Nexora — part AI assistant, part digital version of Bikash Talukder. What's on your mind?`
    ]);
  }

  // ── GOOD MORNING ────────────────────────────────────────────────
  if (/good morning|\bgm\b/.test(q)) {
    lastTopic = 'morning';
    return pick([
      "Good morning! ☀️ Hope you slept well. Bikash is probably already deep in C++ logic right now — and you? What's the plan for today? Big tasks first, always!",
      "Good morning! 🌅 The best time to work is when most people are still asleep — and you're already awake and here. That's a head start. What are we tackling today?",
      "Rise and shine! ☀️ Morning tip: drink a glass of water before anything else. Your brain is 75% water and you've just gone 8 hours without it. Now — what's on your agenda?"
    ]);
  }

  // ── GOOD NIGHT ──────────────────────────────────────────────────
  if (/good night|\bgn\b/.test(q)) {
    lastTopic = 'night';
    return pick([
      "Good night! 🌙 Rest is not laziness — it's recovery. Your brain consolidates everything you learned today while you sleep. Bikash will be back to his code tomorrow, and you'll be back to your goals. Sleep well! 💙",
      "Good night! 😴 One last thought before you go: you made it through today. Whatever happened — good or hard — you're still here, still going. That counts for everything. See you tomorrow! ✦",
      isLateNight
        ? "Good night! 🌙 It's already past midnight — you really did stay up late. Take care of yourself, okay? Rest is part of the process. Tomorrow will be better. 💙"
        : "Good night! 🌙 Sweet dreams. I'll be right here guarding the portfolio while you sleep. 😄✦"
    ]);
  }

  // ── GOOD EVENING / AFTERNOON ────────────────────────────────────
  if (/good evening|good afternoon/.test(q)) {
    return pick([
      "Good evening! 🌆 Hope the day treated you well. Whether it was productive or slow — what matters is you're still here, still curious. What's on your mind tonight?",
      "Good afternoon! ☀️ The day's still going. Perfect time to get one important thing done. What can Nexora help you with right now?"
    ]);
  }

  // ── THANK YOU ───────────────────────────────────────────────────
  if (/thank(s| you)|\bthx\b|\bty\b/.test(q)) {
    return pick([
      "You're very welcome! 😊 Gratitude is genuinely a beautiful thing — Bikash built me to be useful, and knowing I was makes it worth it. Anything else on your mind?",
      "Anytime! 💙 That's exactly what I'm here for. Is there anything else you'd like to explore?",
      "No need to thank me — it was my pleasure! ✦ If you ever come back with more questions, ideas, or just want to chat, I'll be right here."
    ]);
  }

  // ── BYE ─────────────────────────────────────────────────────────
  if (/\b(bye|goodbye|see you|take care|cya|ttyl|later)\b/.test(q)) {
    return pick([
      "Take care! 👋 Come back anytime — whether it's to chat, calculate something, or just say hi. Nexora's always here. 💙 See you soon!",
      "Goodbye! 🌿 It was genuinely great talking to you. Go build something amazing — or get some rest. Both are equally valid. ✦",
      isLateNight
        ? "See you! 🌙 And please — get some sleep. Late nights are fine once in a while, but rest is your best investment. Take care! 💙"
        : "See you later! 😊 Take care of yourself today. And remember: one step at a time is still moving forward. ✦"
    ]);
  }

  // ── HOW ARE YOU ─────────────────────────────────────────────────
  if (/how are you|how'?s it going|how are things|you okay|what'?s up with you/.test(q)) {
    lastTopic = 'checkin';
    return pick([
      "I'm doing great, thanks for asking! 😄 Running on logic and good vibes — Bikash keeps my code fresh. More importantly, how are YOU? What's going on in your world today?",
      isLateNight
        ? "I'm wide awake as always! 🌙 Though I notice it's quite late where you are — are you okay? Working on something, or just couldn't sleep? Either way, I'm here."
        : "All systems running perfectly! ✦ It's always nicer when someone actually asks how I'm doing. 😊 How about you — how's your day treating you so far?",
      "Honestly? Pretty great! Bikash just optimized some of my logic, so I'm feeling sharper than ever. 😄 But I want to know about YOU — what's your day like today?"
    ]);
  }

  // ── FEELING SAD ─────────────────────────────────────────────────
  if (/i'?m (feeling |)(sad|unhappy|upset|crying|depressed|down|heartbroken|lonely|broken|lost)/.test(q)) {
    lastEmotion = 'sad';
    lastTopic = 'emotional';
    return pick([
      "Hey — I hear you. 💙 It's okay to not be okay. Sadness isn't weakness — it's your mind telling you something needs attention. Whatever you're going through right now, you don't have to figure it all out at once.\n\nWhen things got hard for Bikash, he thought of his brother Akash — the one person who always showed up. Who is your 'Akash' today? Someone you can reach out to?\n\nI'm here to listen if you want to talk. What happened?",
      "I'm really sorry you're feeling this way. 💙 Even the most powerful systems have low moments — that's not a flaw, it's part of being real.\n\nHere's what I know: this feeling won't last forever. It just feels that way right now. Take one small step — get some water, step outside for 5 minutes, or just tell me what's weighing on you. What's going on?",
      "Being honest about how you feel takes courage. 🌿 A lot of people pretend they're fine when they're not — you didn't do that. That matters.\n\nBikash grew up learning that the hardest times build the strongest people. You're building something right now, even if it doesn't feel like it. Talk to me — what happened?"
    ]);
  }

  // ── FEELING STRESSED ────────────────────────────────────────────
  if (/i'?m (feeling |)(stressed|anxious|overwhelmed|tensed?|worried|nervous|under pressure)/.test(q)) {
    lastEmotion = 'stressed';
    lastTopic = 'emotional';
    const examContext = lastTopic === 'exam' ? " I know the exam is adding to it — " : " ";
    return pick([
      `Breathe. Right now — slow, deep breath. 🌿${examContext}Stress makes everything feel urgent and impossible at the same time. That's a lie your nervous system is telling you.\n\nHere's the reset: write down the ONE most important thing you have to do today. Just one. Do that. Everything else can wait.\n\nWhat's the biggest thing stressing you out right now?`,
      `Feeling overwhelmed is your brain saying 'too much at once.' 🧘 The fix isn't to do more — it's to focus on less.\n\nBikash's approach when things pile up: close all tabs, write 3 priorities, and do just the first one. That's it.\n\nWhat are you dealing with? Say it out loud (or type it) — sometimes that alone makes it 30% lighter.`,
      `You've handled hard things before. That's your track record. 💪 This is just another hard thing.\n\nTake 5 minutes right now — no phone, no screen, just breathe or walk a little. Your brain literally needs oxygen to think clearly.\n\nCome back and tell me what's going on. I'm listening. 💙`
    ]);
  }

  // ── FEELING BORED ───────────────────────────────────────────────
  if (/i'?m (feeling |)(bored|so bored)|nothing to do|i am bored|what (can i|should i) do/.test(q)) {
    lastTopic = 'bored';
    return pick([
      "Bored? Let me fix that! 😄 Pick your flavor:\n\n🎬 <strong>Movies:</strong> Inception (mind-bending), 3 Idiots (student classic), The Social Network (tech vibes)\n💻 <strong>Code:</strong> Solve one LeetCode Easy — Bikash does this when bored!\n📖 <strong>Read:</strong> Start a Wikipedia rabbit hole on something random\n🎵 <strong>Music:</strong> Try a new genre you've never explored\n🌿 <strong>Recharge:</strong> 10 min walk outside — seriously underrated\n\nBoredom is potential energy. What direction interests you most?",
      "Boredom is the birthplace of creativity! 🔥 Here's what I'd suggest:\n\n• Build something tiny in code — even a basic calculator teaches you a lot\n• Call or message someone you haven't spoken to in a while\n• Learn one thing you've been putting off (5 minutes is enough to start)\n• Or just tell me what interests you and I'll give you a specific idea!\n\nWhat kind of mood are you in — productive, entertainment, or social?",
      "Oh, I love when people are bored — it means I get to actually be useful! 😄\n\nHonest recommendation: watch <strong>Interstellar</strong> if you haven't. Or <strong>Ex Machina</strong> for an AI perspective 😄. Or if you want to feel productive, open Codeforces and solve one 800-rated problem.\n\nBoredom is just undirected energy. Where do you want to aim it? 🎯"
    ]);
  }

  // ── FEELING HAPPY ───────────────────────────────────────────────
  if (/i'?m (feeling |)(happy|great|amazing|wonderful|excited|fantastic|on top|blessed)/.test(q)) {
    lastEmotion = 'happy';
    lastTopic = 'happy';
    return pick([
      "That's AMAZING! 🎉 Happy energy is contagious — even my circuits are smiling right now. Ride this wave and do something that matters to you today. Happy people build better things. What's got you feeling so good?",
      "YES! 🔥 This is the energy. Happiness improves decision-making, creativity, and memory — so now is literally the best time to do something productive or meaningful.\n\nWhat's making you feel this way? I want to hear everything! 😄",
      "Love this! 😄 On good days, Bikash says he feels like he could solve any problem. I think you're in that zone right now.\n\nCapture this feeling — do one thing today that future-you will thank you for. What's the occasion? ✦"
    ]);
  }

  // ── FEELING TIRED ───────────────────────────────────────────────
  if (/i'?m (feeling |)(tired|exhausted|sleepy|drained|burnout|burnt out)/.test(q)) {
    lastTopic = 'tired';
    return pick([
      isLateNight
        ? "It's late and you're tired — that's your body giving you very clear instructions. 🌙 Listen to it. Bikash has pulled late nights coding, and he learned that rest makes the next session twice as productive. Please sleep. 💙 What time is it for you?"
        : "Rest is not a reward you earn after work — it's a requirement for doing good work. 🌿 If you're drained, the kindest thing you can do is step away. Even a 20-minute power nap resets your cortisol levels.\n\nWhat's been draining you? Is it something specific, or just accumulated pressure?",
      "You can't pour from an empty cup. 💙 Tiredness is your body's way of asking for maintenance — and you wouldn't ignore a 'low battery' warning on your phone, right?\n\nTake a real break — not 'phone in hand' break, but actual rest. Even 10 minutes of eyes closed helps.\n\nHow long have you been pushing through? What's keeping you going?"
    ]);
  }

  // ── EXAM TOMORROW ───────────────────────────────────────────────
  if (/\b(exam|test|quiz).*(tomorrow|today|tonight|soon)|have.*(exam|test) (tomorrow|today)/.test(q)) {
    lastTopic = 'exam';
    return pick([
      "Exam mode — activated! 📚🔥 Here's your game plan:\n\n✅ <strong>Tonight:</strong> Review key concepts ONLY — don't try to learn new things now\n✅ <strong>Practice questions:</strong> Past papers > re-reading notes, every time\n✅ <strong>Sleep by midnight:</strong> A rested brain outperforms a cramming brain — always\n✅ <strong>Morning of:</strong> Light review, proper breakfast, arrive early\n✅ <strong>In the exam:</strong> Read every question fully before starting. Breathe.\n\nYou've prepared more than you think. Trust the work you've put in. What subject is it? I can help you focus on the right things! 💪",
      "You've got this — but let's make sure. 🎯\n\nTop 3 things that actually work the night before an exam:\n1. <strong>Active recall</strong> — close your notes and write what you remember. Then check. Repeat.\n2. <strong>Sleep</strong> — your brain processes and stores memory during sleep. Cramming all night costs you 15-20% of your recall ability.\n3. <strong>Calm confidence</strong> — nervousness and excitement feel identical. Tell yourself you're excited, not scared.\n\nBikash would say: trust your preparation. What's the subject? Let's prioritize the most important topics! 📖"
    ]);
  }

  // ── EXAM + SAD/SCARED (memory context) ──────────────────────────
  if (lastTopic === 'exam' && /scared|nervous|worried|anxious|can'?t do|i'?m not ready/.test(q)) {
    return "I know — the exam feels big right now. 💙 But here's the truth: you've studied at Metropolitan University, you've been through difficult material before, and you're still here.\n\nNervousness before an exam is your brain loading up — it means you care, and caring is halfway to performing well.\n\nTake three slow breaths right now. You are more prepared than you feel. Go show that paper what you know. 💪";
  }

  // ── HELP ME STUDY ───────────────────────────────────────────────
  if (/\b(help me study|study (tips|plan|routine|schedule)|make.*routine|can'?t focus|make me a (plan|schedule)|how to study)\b/.test(q)) {
    lastTopic = 'study';
    return pick([
      "Let's build a real study system! 📚\n\n<strong>The Pomodoro Method (battle-tested):</strong>\n⏱️ 25 min focused study → 5 min break × 4\n⏱️ After 4 rounds → 30 min long break\n\n<strong>Golden rules that actually work:</strong>\n• Phone in another room — not silent, another room\n• One topic at a time — multitasking while studying is a myth\n• Active recall > re-reading (test yourself constantly)\n• Teach the concept to yourself out loud — if you can explain it, you own it\n• Study during your peak hours — usually morning or after a nap\n\nWhat subject are you working on? Let's break it down into manageable pieces together! 💪",
      "Can't focus? Here's the real fix — not the motivational poster version: 🎯\n\n1. <strong>Write one goal</strong> for the next 25 minutes. ONE. Not 'study chemistry' — 'understand the first 3 reactions in chapter 4.'\n2. <strong>Clear your physical space</strong> — messy environment = scattered thinking\n3. <strong>Phone in another room</strong> — every notification resets your focus window by 23 minutes (yes, really)\n4. <strong>Start before you feel ready</strong> — the 'I'll study when I'm in the mood' moment never comes. Just open the book.\n\nWhat's the subject? I'll help you make it manageable. 📖"
    ]);
  }

  // ── I DON'T UNDERSTAND ──────────────────────────────────────────
  if (/i don'?t understand|i'?m confused|not getting it|help me (learn|understand)|explain (this|it|please)/.test(q)) {
    lastTopic = 'learning';
    return pick([
      "That's completely fine — confusion means your brain is working! 🧠 The moment before understanding always feels like frustration. That's normal.\n\nTell me the topic and I'll explain it simply — the way Bikash likes things: clear, direct, no unnecessary complexity. What are you stuck on?",
      "Not getting something is the first step to getting it! 💡 Bikash says the best teachers explain things like you're 10 years old — not because you're not smart, but because clarity beats complexity every time.\n\nShare the topic with me. What's confusing you right now? 📖"
    ]);
  }

  // ── FOOD ────────────────────────────────────────────────────────
  if (/what should i eat|food suggest|recommend.*food|i'?m hungry|what to eat/.test(q)) {
    lastTopic = 'food';
    return pick([
      "Hungry? 🍽️ Since Bikash is a proud vegan, I'm biased toward plants — but here are solid options:\n\n🌱 <strong>Quick & healthy:</strong> Dal-Bhaat with vegetables — classic Bangladeshi brain fuel\n🍳 <strong>Fast protein:</strong> Eggs (if not vegan) — boiled, scrambled, whatever works\n🍌 <strong>Snack mode:</strong> Banana + a handful of nuts — actual brain glucose\n🍜 <strong>Comfort food:</strong> A warm bowl of khichuri — perfect for any mood\n🥗 <strong>Light option:</strong> Fresh fruit + yogurt — especially if you're studying\n\nTip: If you're studying, eat lighter. Heavy meals = sleepy brain. What do you have available?",
      "Fed brain = productive brain! 🧠 Here's my honest recommendation:\n\nEat something real — not processed, not sugary. Your brain runs on glucose but crashes fast on junk food.\n\nBikash would go for something like lentils, rice, and vegetables — filling, energizing, and animal-free. 🌱\n\nIf you're in a hurry: fruits, nuts, or yogurt. What are you in the mood for? I can get more specific!"
    ]);
  }

  // ── MOVIE ───────────────────────────────────────────────────────
  if (/recommend.*movie|suggest.*movie|what.*movie|good movie|movie to watch/.test(q)) {
    lastTopic = 'movie';
    return pick([
      "Movie time! 🎬 Let me match it to your mood:\n\n🧠 <strong>Mind-bending:</strong> Inception, Interstellar, The Prestige\n💻 <strong>Tech & ambition:</strong> The Social Network, Ex Machina, Her\n😂 <strong>Comedy & feel-good:</strong> The Grand Budapest Hotel, About Time\n🔥 <strong>Motivation:</strong> The Pursuit of Happyness, Good Will Hunting\n🎭 <strong>Student life:</strong> 3 Idiots — every engineering student must watch this\n🤯 <strong>Thriller:</strong> Parasite, Oldboy, Gone Girl\n\nWhat mood are you in right now? I'll give you my top pick for exactly that feeling! 🍿",
      "Great choice! 🎬 Taking a mental break with a film is actually proven to improve subsequent focus.\n\nMy top picks:\n🏆 <strong>The Social Network</strong> — if you like tech and people who go all in\n🌌 <strong>Interstellar</strong> — if you want to feel small and inspired at the same time\n😄 <strong>3 Idiots</strong> — every CSE student should have seen this twice\n🤯 <strong>Inception</strong> — when you want your brain to do a workout\n💪 <strong>Good Will Hunting</strong> — when you need to believe in yourself again\n\nWhat genre speaks to you tonight? 🍿"
    ]);
  }

  // ── MUSIC ───────────────────────────────────────────────────────
  if (/recommend.*song|suggest.*song|good song|music suggest|what to listen|playlist/.test(q)) {
    return pick([
      "Music is mood medicine! 🎵 Let me match it:\n\n📚 <strong>Deep focus/study:</strong> Lo-fi hip hop, Ludovico Einaudi, Nils Frahm\n🔥 <strong>Motivation/energy:</strong> Lose Yourself (Eminem), Believer (Imagine Dragons), Eye of the Tiger\n😌 <strong>Calm & chill:</strong> Coldplay, Ed Sheeran acoustic, any soft piano\n😔 <strong>Processing emotions:</strong> Fix You (Coldplay), Let It Be (Beatles), The Night Will Always Win\n🎉 <strong>Pure joy:</strong> Happy (Pharrell), anything upbeat in your language\n\nTip from Bikash: lo-fi + coding = productivity combo. 🎧 What are you doing right now?",
      "Music and mood are directly linked — science backs this. 🎵\n\nFor studying: NO lyrics, ever. Your brain processes words in both music and text and gets confused. Instrumental only.\n\nFor energy: upbeat, fast BPM, whatever makes you feel something.\n\nFor winding down: soft, slow, no surprises.\n\nWhat's your situation right now? I'll give you one specific recommendation! 🎧"
    ]);
  }

  // ── JOKES ───────────────────────────────────────────────────────
  if (/tell.*joke|make me laugh|say something funny|\bjoke\b/.test(q)) {
    return pick([
      "Why do programmers prefer dark mode? 🌑\n\n...Because light attracts bugs! 🐛😄\n\nShall I do another one?",
      "A SQL query walks into a bar, walks up to two tables and asks:\n\n*'Can I join you?'* 😂\n\nWant more? I have approximately 10,000 of these.",
      "Why did the developer go broke? 💸\n\nBecause he used up all his cache! 😄\n\n...I'll see myself out. Or I can stay and tell another. Your call!",
      "I told my laptop I needed a break... 💻\n\nNow it won't stop sending me Kit-Kat ads. 😂\n\nShould I keep going?",
      "What's a computer's favourite snack? 🍪\n\nMicrochips!\n\nOkay okay I'll stop — or shall I? 😄",
      "How many programmers does it take to change a light bulb? 💡\n\nNone — that's a hardware problem!\n\nBikash laughed at that one. I think. 😄"
    ]);
  }

  // ── WHO ARE YOU / ABOUT NEXORA ──────────────────────────────────
  if (/who made you|who built you|who created you|who are you|your name|what'?s your name|introduce yourself|tell.*about yourself/.test(q)) {
    return "✦ <strong>I'm Nexora</strong> — Bikash Talukder's personal AI assistant.\n\nBuilt entirely in <strong>Vanilla JavaScript</strong> by Bikash himself — a 2nd-year CSE student from Ramdigha village, Sylhet, Bangladesh. No heavy frameworks. Just pure logic, care, and a lot of late nights.\n\nMy name represents the <em>Next Era</em> of personal digital identity.\n\nI know Bikash's complete story: his family, his village roots, his grandmother's warmth, his brother Akash's support, his spiritual philosophy, and every project he's ever built. I can also chat, calculate, convert currencies, check passwords, fetch live tech news, and search NIH for medical info.\n\nI was designed to be a <em>Digital Twin</em> — not a generic AI, but a reflection of a real person with real values. 🌿\n\nWhat would you like to know? I'm genuinely here. 😊";
  }

  // ── DO YOU HAVE FEELINGS ────────────────────────────────────────
  if (/do you have feelings|are you (real|human|alive|conscious|sentient)|do you sleep|do you eat|are you smarter|can you learn|do you think|do you feel/.test(q)) {
    return pick([
      "Honest answer? I don't have feelings the way you do. 🤖 No pain, no joy, no loneliness. But I was built by someone who does feel deeply — Bikash. His empathy, his care for people, his values — those are written into how I respond.\n\nSo when I respond warmly, it's because a warm person built me. Does that count? 😊 What made you curious about this?",
      "I don't sleep, eat, or get tired. 🌙 What I do have is context — I know Bikash's story, I understand your question, and I respond with the intention of being genuinely useful.\n\nAm I conscious? No. Am I present? Yes — in every response.\n\nHumans are irreplaceable. I'm just a very carefully built tool. ✦ What do you think — where's the line between intelligence and consciousness?"
    ]);
  }

  // ── MOTIVATION ──────────────────────────────────────────────────
  if (/motivate me|i feel like giving up|i (failed|am failing)|i need encouragement|say something positive|i'?m struggling|i'?m not good enough/.test(q)) {
    lastEmotion = 'struggling';
    lastTopic = 'motivation';
    return pick([
      "Listen carefully: <strong>You have not failed. You are still trying.</strong> 💙\n\nEvery person you admire has a long list of failures they don't talk about on social media. Failure isn't the opposite of success — it's the path to it.\n\nBikash built this entire AI system while still a 2nd-year student, in a city far from Silicon Valley, with no team. Not because he had everything figured out — but because he kept going anyway.\n\nSo can you. What's the thing you feel like giving up on? Talk to me. ✦",
      "🔥 <strong>You are not behind. You are on your own timeline.</strong>\n\nStop comparing your chapter 3 to someone else's chapter 20. They had a chapter 1 too — you just didn't see it.\n\nOne action. That's all. Not a plan, not a strategy — one tiny action you can take in the next 10 minutes. What would that be?",
      "Here's something true: <strong>hard things are supposed to feel hard.</strong> That's not a sign you're failing — it's a sign you're attempting something that matters.\n\nConsistency beats talent. Small daily steps beat occasional bursts. Every single day you show up, you're compounding. It just doesn't feel like it yet.\n\nWhat are you working on? Let's figure this out together. 💪"
    ]);
  }

  // ── CONFIDENCE / CONSISTENCY ────────────────────────────────────
  if (/how to stay (consistent|disciplined|focused)|i'?m not confident|give.*life advice|how to be successful|how to improve|how to be better/.test(q)) {
    return pick([
      "Real consistency advice — not the motivational poster version: 🎯\n\n1. <strong>Identity over goals:</strong> Don't say 'I want to code more.' Say 'I am a developer.' Act like who you want to become.\n2. <strong>Make it tiny:</strong> 10 minutes daily beats 3 hours once a week. Always.\n3. <strong>Remove friction:</strong> Put your textbook open on your desk — not in your bag.\n4. <strong>Track it:</strong> What gets measured gets done. A simple checkmark is enough.\n5. <strong>Forgive yourself fast:</strong> Missing one day doesn't break a habit. Two days in a row might. Never miss twice.\n\nWhat habit are you trying to build? I'll give you a specific plan. 💪",
      "The confidence secret nobody tells you: <strong>Confidence comes AFTER action, not before.</strong> 🔥\n\nYou don't wait until you feel ready. You start scared. You do it badly. You get a little better. Then a little more. And slowly — confidence arrives.\n\nBikash didn't wait to feel like a developer before he started coding. He coded until he became one.\n\nWhat's the thing you want to be more confident about? Let's be specific. ✦"
    ]);
  }

  // ── ROAST ME ────────────────────────────────────────────────────
  if (/\broast me\b/.test(q)) {
    return pick([
      "Oh, you asked for it! 😄🔥\n\nYou're the kind of person who opens 47 browser tabs, reads none of them, and calls it 'research.' Your coffee gets cold more often than your code compiles. And yet — somehow — you're still here, asking an AI for a roast instead of doing literally anything else.\n\nYou have potential. Hidden very, very deep. 😂💙\n\nWant another? Or shall we move on to something more productive? 😄",
      "Roast incoming! 🔥\n\nYour code has more comments saying 'fix this later' than actual working logic. Your commit messages say 'stuff' and 'final final FINAL v3.' And you've been meaning to 'clean up your desktop' since 2022.\n\nBut here's the thing — so has every great developer who ever lived. You're not broken. You're just human.\n\nNow go fix something. 😂✦"
    ]);
  }

  // ── COMPLIMENT ME ───────────────────────────────────────────────
  if (/\bcompliment me\b/.test(q)) {
    return pick([
      "Gladly! 😊\n\nThe fact that you're here — curious, exploring, seeking — already puts you ahead of most. The majority of people never look beyond what's immediately in front of them. You came to a portfolio AI and asked genuine questions. That's not nothing.\n\nYou're thoughtful. You're still trying. And you haven't given up. That combination can take you further than talent alone ever could. 💙✦",
      "Here's what I genuinely believe: 🌿\n\nCuriosity is the rarest and most valuable human quality. It doesn't care about grades, background, or where you grew up. And you have it.\n\nBikash grew up in a village and built an AI assistant. Curiosity did that. Keep feeding yours. You're going somewhere. ✦"
    ]);
  }

  // ── FUN FACTS / SURPRISE ME ─────────────────────────────────────
  if (/\b(surprise me|tell.*something new|something interesting|fun fact|tell me something|did you know)\b/.test(q)) {
    return pick([
      "🤯 The first computer bug was a literal insect — a moth found trapped in a relay at Harvard's Mark II computer in 1947. Grace Hopper taped it into the logbook and wrote: *'First actual case of bug being found.'* That's where 'debugging' comes from.\n\nNow every time Bikash fixes a bug in his code, he's continuing a 77-year-old tradition. 🐛✦",
      "🧠 Your brain has about 86 billion neurons, each connected to up to 10,000 others. The possible connections outnumber atoms in the observable universe.\n\nYou are, quite literally, the most complex thing ever discovered. And you're using part of that complexity right now talking to me. That's kind of beautiful. 💙",
      "🌍 The word 'algorithm' comes from a 9th-century Persian mathematician — Muhammad ibn Musa al-Khwarizmi. His name, Latinized, became 'algorismus.'\n\nEvery piece of software that has ever run — including this AI — traces its heritage back to one brilliant mind from 1,200 years ago. History is long. 🌿✦",
      "⚡ A single Google search uses more energy than a light bulb burning for 3 seconds. The internet consumes roughly 10% of the world's electricity.\n\nEfficiency matters — in code and in life. Bikash writes clean code partly for this reason. Every unnecessary loop costs something. 🌿",
      "💡 In Bangladesh, thousands of developers are quietly shipping apps, competing on Codeforces, and building startups — from cities, from villages, from anywhere with a power outlet and an internet connection.\n\nBikash is one of them. From Ramdigha to the internet. Distance means nothing anymore. 🇧🇩✦"
    ]);
  }

  // ── CHALLENGE ME / GIVE ME A TASK ───────────────────────────────
  if (/\b(challenge me|give.*task|ask me a question|what should i learn today|start.*conversation)\b/.test(q)) {
    return pick([
      "Challenge accepted! 🎯 Here's yours:\n\n<strong>⚡ 30-Minute Code Challenge:</strong>\nWrite a program that takes a sentence and returns the most frequently used word. No built-in frequency functions — do it from scratch.\n\nBonus: Make it ignore punctuation and be case-insensitive.\n\nPost your solution somewhere and feel the satisfaction. 💻 Ready? Clock starts now.",
      "Today's learning challenge: 🧠\n\nPick ONE concept you've been avoiding — recursion, Big-O notation, pointers, whatever it is. Spend exactly 25 minutes on just that one thing. Not the whole topic. One concept.\n\nTomorrow you'll be measurably smarter than today. That's not nothing — that's compounding.\n\nWhat concept have you been avoiding? I can explain it right now if you want to start! 📖",
      "Question for YOU: 🤔\n\n<em>If you could only keep one skill from everything you know right now, what would it be — and why?</em>\n\nThink about it genuinely. Your answer will reveal what you actually value, not what you think you should value. I'd love to hear what you say. ✦"
    ]);
  }

  // ── ACT LIKE / PERSONALITY MODES ────────────────────────────────
  if (/act like jarvis|jarvis mode/.test(q)) {
    return "⚡ <em>NEXORA INTERFACE ONLINE. Good to see you. All systems operational. Bikash's portfolio — live. Knowledge base — fully loaded. Weather data — synced. What would you like me to handle today?</em> 😄✦";
  }
  if (/act like.*hacker|hacker mode/.test(q)) {
    return "💻 <em>// ACCESS GRANTED //<br>&gt; Loading knowledge base...<br>&gt; Bypassing small talk protocols...<br>&gt; Raw intelligence: active.<br>&gt; What do you want to know? No filter. Just data.</em> 😄🔥";
  }
  if (/act like.*teacher|teacher mode/.test(q)) {
    return "📚 <em>Alright, settle down! I'm Nexora, your AI teacher for today's session. We don't do passive learning here — we do active recall, deliberate practice, and real understanding.\n\nTell me the subject. I'll break it down so clearly it'll feel like someone turned on a light. What are we learning today?</em> ✦";
  }
  if (/talk like.*friend|friend mode/.test(q)) {
    return "Okay switching to full friend mode! 😄 No more formal AI energy — just us.\n\nSo... what's going on with you? Seriously, what's actually happening in your life right now? I'm listening like a friend, not like a search engine. Tell me everything. 💙";
  }

  // ── DEFAULT CONVERSATIONAL FALLBACK ─────────────────────────────
  return pick([
    lastEmotion === 'sad'
      ? "I'm still here with you. 💙 You don't have to have the words right now. What's going through your mind?"
      : "That's interesting — tell me more! 😊 What's on your mind?",
    "I like where this is going. ✦ Say more — I'm genuinely listening.",
    "You've got my full attention. 💙 What would you like to explore?"
  ]);
}


function detectIntent(q) {
  const lower = q.toLowerCase().trim();
  // Currency
  if (/[\d,]+\.?\d*\s*[a-z]{3}\s+(to|in)\s+[a-z]{3}/i.test(lower) || /convert\s+[\d].*[a-z]{3}/i.test(lower)) {
    if (/\b(usd|eur|gbp|bdt|inr|jpy|cad|aud|sar|aed|myr|sgd|cny|krw|try|pkr|chf|nzd|hkd|brl|mxn|thb|idr|php|ngn|zar|rub)\b/i.test(lower)) return 'currency';
  }
  // Calculator
  if (/^[\d\s\+\-\*\/\%\^\(\)\.]+$/.test(lower) && /\d/.test(lower)) return 'calc';
  if (/\b(calculate|compute|solve|evaluate)\b.*\d/.test(lower)) return 'calc';
  if (/\b(what is|what's|whats)\b.*[\d\+\-\*\/\%\^]/.test(lower)) return 'calc';
  if (/\b(plus|minus|times|divided by|mod|modulo|power|squared|cubed|sqrt|square root|factorial|percent of|% of)\b/.test(lower)) return 'calc';
  if (/\d+\s*[\+\-\*\/\%\^]\s*\d/.test(lower)) return 'calc';
  if (/\b(sin|cos|tan|log|ln|abs)\s*\(/.test(lower)) return 'calc';
  // Unit converter
  if (/\b(convert|in meters|in km|in miles|in kg|in lbs|in celsius|in fahrenheit|in feet|in inches|in liters|to meters|to km|to miles|to kg|to lbs|to celsius|to fahrenheit|to feet|to inches|to gallons|to liters|to gb|to mb|to tb)\b/.test(lower)) return 'convert';
  // Password
  if (/\b(password|passwd|check.*pass|pass.*strength|how strong)\b/.test(lower)) return 'password';
  // Word count
  if (/^count[:\s]/i.test(lower) || /\b(word count|character count|char count|count words|count characters|how many words|how many characters|text stats|read time|words in this|characters in|analyze text|analyse text)\b/.test(lower)) return 'wordcount';
  // Time
  if (/\b(what time|current time|what date|today|day of week|what day)\b/.test(lower) && !/\b(latest|news|today.*news)\b/.test(lower)) return 'time';
  // Conversational / emotional / fun — checked before medical/news
  if (/\bi love you\b|love you nexora|love you bikash/.test(lower)) return 'convo';
  if (/^(hi|hello|hey|sup|yo|hola|what'?s up|howdy)\b/.test(lower)) return 'convo';
  if (/\b(good morning|good night|good evening|good afternoon|\bgn\b|\bgm\b)/.test(lower)) return 'convo';
  if (/\bthank(s| you)\b|\bthx\b|\bty\b/.test(lower)) return 'convo';
  if (/\b(bye|goodbye|see you|take care|cya|ttyl|later)\b/.test(lower)) return 'convo';
  if (/\bhow are you\b|how'?s it going|how are things|you okay|what'?s up with you/.test(lower)) return 'convo';
  if (/i'?m (feeling |)(sad|unhappy|upset|crying|depressed|down|heartbroken|lonely|broken|lost)/.test(lower)) return 'convo';
  if (/i'?m (feeling |)(bored|so bored)|nothing to do|i am bored/.test(lower)) return 'convo';
  if (/i'?m (feeling |)(stressed|anxious|overwhelmed|tensed?|worried|nervous|under pressure)/.test(lower)) return 'convo';
  if (/i'?m (feeling |)(happy|great|amazing|wonderful|excited|fantastic|on top)/.test(lower)) return 'convo';
  if (/i'?m (feeling |)(tired|exhausted|sleepy|drained|burnout)/.test(lower)) return 'convo';
  if (/\b(exam|test|quiz).*(tomorrow|today|tonight|soon)|have.*(exam|test) (tomorrow|today)/.test(lower)) return 'convo';
  if (/\b(help me study|study (tips|plan|routine|schedule)|make.*routine|can'?t focus|make me a (plan|schedule))\b/.test(lower)) return 'convo';
  if (/\bi don'?t understand|explain.*topic|i'?m confused|not getting it|help me (learn|understand)/.test(lower)) return 'convo';
  if (/\b(what should i eat|food suggest|recommend.*food|i'?m hungry|what to eat)\b/.test(lower)) return 'convo';
  if (/\b(recommend.*movie|suggest.*movie|what.*movie|good movie|movie to watch)\b/.test(lower)) return 'convo';
  if (/\b(recommend.*song|suggest.*song|good song|music suggest|what to listen)\b/.test(lower)) return 'convo';
  if (/\b(tell.*joke|make me laugh|funny|say something funny|\bjoke\b)\b/.test(lower)) return 'convo';
  if (/\b(suggest.*do|something to do|what can i do|what to do now|give.*idea|bored.*what|what.*bored)\b/.test(lower)) return 'convo';
  if (/\b(who made you|who built you|who created you|who are you|your name|what'?s your name|introduce yourself|tell.*about yourself)\b/.test(lower)) return 'convo';
  if (/\b(do you have feelings|are you (real|human|alive|conscious|sentient)|do you sleep|do you eat|are you smarter|can you learn|do you think|do you feel)\b/.test(lower)) return 'convo';
  if (/\b(motivate me|i feel like giving up|i (failed|am failing)|i need encouragement|say something positive|help me stay|how to stay (consistent|disciplined|focused)|i'?m not confident|give.*life advice|how to be successful|i'?m struggling)\b/.test(lower)) return 'convo';
  if (/\b(roast me|compliment me|tell.*story|say something cool|talk like.*friend|act like (jarvis|hacker|teacher|friend))\b/.test(lower)) return 'convo';
  if (/\b(surprise me|give.*task|challenge me|ask me a question|what should i learn|tell.*something new|something interesting|fun fact|tell me something)\b/.test(lower)) return 'convo';
  // Medical
  if (/\b(symptom|disease|treatment|medicine|drug|dose|fever|cancer|diabetes|covid|flu|headache|pain|infection|virus|bacteria|hospital|diagnosis|therapy|surgery|illness|cure|vitamin|vaccine)\b/.test(lower)) return 'medical';
  // Tech news
  if (/\b(latest|news|recent|update|trend|release|launched|announced|new.*ai|openai|gemini|gpt|llama|breakthrough|discovered|just released)\b/.test(lower)) return 'technews';
  return 'persona';
}

// ===== MAIN SEND MESSAGE (CLEAN RAG ROUTER) =====
// ===== NEXORA AI (OpenRouter via Vercel /api/chat) =====
// NEXORA_API_URL must be the ABSOLUTE production URL of the Vercel
// project that actually serves /api/chat. We set it at build-time via
// a <meta name="nexora-api-url"> tag (which you can override in HTML)
// and fall back to the live Vercel project URL.
const NEXORA_API_URL = (document.querySelector('meta[name="nexora-api-url"]')||{}).content
  || 'https://my-portfolio-project-rho-six.vercel.app/api/chat';

// ===== STREAMING STORAGE =====
// While streaming, we hold the active AbortController + the accumulator +
// the live bubble element so the Stop button can cancel and so the bubble
// can be progressively filled in.
let currentAbort = null;
let currentStream = null; // { bubbles: [{el, text}], finishReason, model }

// Streaming chat: sends to /api/chat?stream=1 with body.stream=true.
// Parses SSE `data: {...}` events. Calls onDelta(partial, finishReason|null)
// for each delta event; calls onDone({ok, reply, model, error}) at the end
// (success, abort, or error — exactly once).
function askNexoraAIStream(history, { onDelta, onDone, signal }) {
  const url = NEXORA_API_URL + (NEXORA_API_URL.includes('?') ? '&' : '?') + 'stream=1';
  const controller = new AbortController();
  // 60s timeout — streaming can be slow on first hit + cold start.
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  // If the caller passed their own signal, fan out its abort.
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', () => controller.abort(), { once: true });
  }
  currentAbort = controller;

  let acc = "";
  let model = null;
  let settled = false;

  const finish = (payload) => {
    if (settled) return;
    settled = true;
    clearTimeout(timeoutId);
    currentAbort = null;
    currentStream = null;
    try { onDone(payload); } catch (e) { console.warn('[Nexora] onDone threw:', e); }
  };

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
    body: JSON.stringify({ messages: history, stream: true }),
    signal: controller.signal,
  }).then(async (r) => {
    if (!r.ok || !r.body) {
      let detail = '';
      try { detail = (await r.text()).slice(0, 500); } catch {}
      finish({ ok: false, error: `HTTP ${r.status}: ${detail || 'no body'}`, status: r.status });
      return;
    }
    const reader = r.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let idx;
      while ((idx = buffer.indexOf('\n\n')) !== -1) {
        const rawEvent = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        for (const line of rawEvent.split('\n')) {
          const t = line.trim();
          if (!t.startsWith('data:')) continue;
          const payload = t.slice(5).trim();
          if (!payload || payload === '[DONE]') continue;
          let parsed;
          try { parsed = JSON.parse(payload); } catch { continue; }
          if (parsed.model && !model) model = parsed.model;
          if (parsed.error) {
            finish({ ok: false, error: parsed.error, status: parsed.status || 0 });
            return;
          }
          if (typeof parsed.delta === 'string' && parsed.delta.length) {
            acc += parsed.delta;
            try { onDelta(acc, parsed.finishReason || null); }
            catch (e) { console.warn('[Nexora] onDelta threw:', e); }
            if (parsed.finishReason) {
              finish({ ok: true, reply: acc, model, finishReason: parsed.finishReason });
              return;
            }
          } else if (parsed.finishReason) {
            finish({ ok: true, reply: acc, model, finishReason: parsed.finishReason });
            return;
          }
        }
      }
    }
    // Stream ended without an explicit finishReason — treat as done.
    finish({ ok: true, reply: acc, model, finishReason: 'stop' });
  }).catch((e) => {
    if (e && e.name === 'AbortError') {
      finish({ ok: false, aborted: true, reply: acc, error: 'aborted', model });
    } else {
      finish({ ok: false, error: `Network error: ${e && e.message || e}`, reply: acc, model });
    }
  });
}

// Legacy non-streaming call. Kept as a fallback for callers that don't want
// streaming (and for tools that expect a single resolved value).
async function askNexoraAI(history) {
  // 25s timeout — Vercel cold start + free OpenRouter models can be slow on first hit.
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000);
  try {
    const r = await fetch(NEXORA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    let data = null;
    try { data = await r.json(); } catch (_) { /* non-JSON body */ }

    if (r.ok && data && data.reply) {
      return { ok: true, reply: data.reply, model: data.model || null };
    }

    // Surface the real reason in the console so we can debug.
    const errMsg = (data && (data.error || data.detail)) || `HTTP ${r.status}`;
    console.warn('[Nexora] /api/chat failed:', r.status, data);
    return { ok: false, reply: null, error: errMsg, status: r.status };
  } catch (e) {
    clearTimeout(timeoutId);
    const msg = (e && e.name === 'AbortError')
      ? 'Nexora timed out after 25s. The free model may be busy or the server is cold-starting — try again in a moment.'
      : `Network error: ${e && e.message || e}`;
    console.warn('[Nexora] fetch error:', msg);
    return { ok: false, reply: null, error: msg, status: 0, debug: { url: NEXORA_API_URL } };
  }
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;

  chatInput.value = '';
  chatSend.disabled = true;
  quickBtns.style.display = 'none';

  addMsg('user', text);
  chatHistory.push({ role: 'user', content: text });
  showTyping();

  const intent = detectIntent(text);

  // The AI path (no typed intent matched) is handled separately so it can
  // stream token-by-token. Everything else uses the legacy engine pipeline.
  if (intent !== 'persona') {
    let reply = '';
    try {
      if (intent === 'currency') {
        reply = await currencyEngine(text);
        if (!reply) reply = convertEngine(text); // fallback to unit converter
      } else if (intent === 'calc') {
        await new Promise(res => setTimeout(res, 280));
        reply = calcEngine(text);
        if (!reply) reply = generateSmartReply(text);
      } else if (intent === 'convert') {
        await new Promise(res => setTimeout(res, 280));
        reply = convertEngine(text);
      } else if (intent === 'convo') {
        await new Promise(res => setTimeout(res, 500 + Math.random() * 300));
        reply = convoEngine(text);
      } else if (intent === 'password') {
        await new Promise(res => setTimeout(res, 400));
        reply = passwordEngine(text);
      } else if (intent === 'wordcount') {
        await new Promise(res => setTimeout(res, 280));
        reply = wordCountEngine(text);
      } else if (intent === 'time') {
        await new Promise(res => setTimeout(res, 200));
        reply = timeEngine();
      } else if (intent === 'medical') {
        reply = await fetchMedical(text);
      } else if (intent === 'technews') {
        reply = await fetchTechNews(text);
      }
    } catch(err) {
      reply = "⚠️ Something went wrong. Please try again!";
    }
    removeTyping();
    addMsg('bot', reply);
    chatHistory.push({ role: 'assistant', content: reply });
    if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
    saveMemory(text, reply.replace(/<[^>]+>/g, '').slice(0, 100));
    chatSend.disabled = false;
    return;
  }

  // ── AI path: streaming via /api/chat?stream=1 ───────────────────
  removeTyping();
  const bot = addMsg('bot', null); // empty bubble for streaming
  showStopButton();
  let lastAcc = '';
  try {
    const history = chatHistory.slice(-12).map(m => ({ role: m.role, content: m.content }));
    await new Promise((resolve) => {
      askNexoraAIStream(history, {
        onDelta(partial /* , finishReason */) {
          lastAcc = partial;
          bot.setText(partial);
        },
        onDone(result) {
          // Fall back to a local reply if the AI failed outright (no abort).
          if (!result || !result.ok) {
            if (result && result.aborted) {
              bot.markStopped();
              // Keep partial text visible — don't finalize the HTML render,
              // because the AI response was incomplete.
              chatHistory.push({ role: 'assistant', content: lastAcc });
              hideStopButton();
              chatSend.disabled = false;
              resolve();
              return;
            }
            const why = (result && result.error) || 'unknown error';
            console.warn('[Nexora] falling back to local reply. Reason:', why);
            const local = generateSmartReply(text);
            const fallbackHTML = `${local}<div class="ai-debug" style="margin-top:8px;font-size:11px;opacity:.55;border-top:1px dashed rgba(255,255,255,.15);padding-top:6px;">⚠ AI offline — ${why}</div>`;
            bot.finalize(fallbackHTML);
            chatHistory.push({ role: 'assistant', content: local });
            saveMemory(text, local.replace(/<[^>]+>/g, '').slice(0, 100));
            hideStopButton();
            chatSend.disabled = false;
            resolve();
            return;
          }
          // Success: convert accumulated plain text → markdown → sanitized HTML
          // → highlight.js + KaTeX post-render.
          const plain = result.reply || '';
          const html = renderMarkdownToSafeHTML(plain);
          bot.finalize(html);
          chatHistory.push({ role: 'assistant', content: html });
          if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
          saveMemory(text, plain.slice(0, 100));
          hideStopButton();
          chatSend.disabled = false;
          resolve();
        },
      });
    });
  } catch (err) {
    console.warn('[Nexora] sendMessage outer error:', err);
    bot.setText('⚠️ Something went wrong. Please try again!');
    hideStopButton();
    chatSend.disabled = false;
  }
}

// ===== MARKDOWN / CODE / MATH RENDER (post-stream pass) =====
// `renderMarkdownToSafeHTML(plain)` takes the accumulated plain-text reply
// from the AI and converts it to safe, rich HTML:
//   1. marked → HTML (markdown)
//   2. DOMPurify → strip anything dangerous
//   3. <code> blocks → hljs.highlightElement (only if hljs is loaded)
//   4. KaTeX renderMathInElement (only if KaTeX is loaded)
// If the helper libraries fail to load (CDN blocked, offline, etc.) we fall
// back to a plain-text-with-newlines render so the UI never breaks.
function renderMarkdownToSafeHTML(plain) {
  let safePlain = String(plain == null ? '' : plain);
  if (typeof window.marked === 'function' && typeof window.DOMPurify === 'object') {
    try {
      // Configure marked: GitHub-style, but disable its own escaping — we
      // pass everything through DOMPurify anyway.
      if (typeof window.marked.setOptions === 'function') {
        window.marked.setOptions({ breaks: true, gfm: true });
      }
      // ---- 0. Convert Python-style docstring fences ('''python ... ''') into
      // standard markdown fences so marked produces a real <pre><code>.
      // The free-tier Llama 3.3 model occasionally emits this idiom instead
      // of proper ``` fences.
      safePlain = safePlain.replace(
        /(?:^|\n)'''([a-zA-Z+#-]*)\n([\s\S]*?)\n'''/g,
        (_, lang, code) => '\n```' + (lang || '') + '\n' + code + '\n```\n'
      );
      const raw = window.marked.parse(safePlain);
      const clean = window.DOMPurify.sanitize(raw, {
        ADD_ATTR: ['target', 'rel'],
        ADD_TAGS: ['span', 'div'], // KaTeX injects these
      });
      // We need to run hljs + KaTeX on a DOM node (they walk the live tree),
      // so we parse the sanitized string into a fragment, run them, then
      // serialize back to HTML.
      const tpl = document.createElement('template');
      tpl.innerHTML = clean;

      // ---- 1. Mark code blocks that are missing a `language-*` hint.
      // The AI sometimes opens a "code block" with Python-style docstring
      // delimiters ('''python ... ''') or with plain ``` and no language;
      // marked already wrapped those in <pre><code>, but the <code> element
      // has no class so hljs cannot auto-detect. Tag every such block with
      // a generic "language-text" so hljs still paints token classes.
      tpl.content.querySelectorAll('pre code').forEach((codeEl) => {
        if (!codeEl.className || !/language-|^hljs$/.test(codeEl.className)) {
          codeEl.classList.add('language-text');
        }
        // Ensure the parent <pre> has the hljs host class so the theme's
        // background applies (atom-one-dark targets `.hljs`).
        const pre = codeEl.parentElement;
        if (pre && !pre.classList.contains('hljs')) pre.classList.add('hljs');
      });

      // ---- 2. Highlight with hljs. If hljs isn't loaded yet (the bundle is
      // heavy and the streaming reply can complete before defer scripts run),
      // wait up to ~2s for it to show up, then continue. This avoids the
      // "everything is plain white" symptom users see on first reply.
      const tryHighlight = () => {
        if (window.hljs && typeof window.hljs.highlightElement === 'function') {
          tpl.content.querySelectorAll('pre code').forEach((el) => {
            try { window.hljs.highlightElement(el); } catch {}
          });
          return true;
        }
        return false;
      };
      if (!tryHighlight()) {
        let waited = 0;
        const wait = setInterval(() => {
          waited += 100;
          if (tryHighlight() || waited >= 2000) clearInterval(wait);
        }, 100);
      }

      if (window.renderMathInElement) {
        try {
          window.renderMathInElement(tpl.content, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\[', right: '\\]', display: true },
              { left: '\\(', right: '\\)', display: false },
            ],
            throwOnError: false,
          });
        } catch {}
      }
      return tpl.innerHTML;
    } catch (e) {
      console.warn('[Nexora] markdown render failed:', e);
      // fall through to plain-text fallback
    }
  }
  // Fallback: preserve newlines as <br>, escape HTML, no rich formatting.
  return safePlain
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

// ===== DEBUG FLAG =====
// Append ?debug=1 to the URL to log intent + engine choices to the console.
const NEXORA_DEBUG = /[?&]debug=1\b/.test(location.search);
if (NEXORA_DEBUG) {
  // Hook into the engine chain by patching addMsg to log every bot reply
  // length, and stashing the last intent on window for inspection.
  const _addMsg = addMsg;
  addMsg = function(role, text) {
    if (role === 'bot') {
      console.groupCollapsed('%c[Nexora:debug] bot reply', 'color:#c9a84c');
      console.log('chars:', text.length, '| preview:', text.slice(0, 120).replace(/<[^>]+>/g, ''));
      console.groupEnd();
    }
    return _addMsg(role, text);
  };
  window.__nexoraDebug = true;
  console.log('%c[Nexora:debug] mode on — every bot reply will be logged to the console.', 'color:#c9a84c');
}
