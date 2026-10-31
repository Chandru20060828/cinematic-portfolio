/* ==========================================================================
   EVERYTHING PERSONAL LIVES IN THIS FILE.
   --------------------------------------------------------------------------
   • Text wrapped in [square brackets] is a PLACEHOLDER. It is shown with a dashed
     underline in the UI so you can spot what still needs your real information.
   • Photos / screenshots: put files in /public/images and use '/images/your-file.jpg'.
     `null` shows a labelled placeholder inside the 3D world.
   • Nothing here is invented: achievements, awards, dates and links are left empty
     until you fill them in.
   ========================================================================== */

export const profile = {
  name: 'Chandru G',
  role: 'Aspiring Full-Stack Developer',
  degree: 'B.Tech Information Technology',
  headline: 'Every Developer Has a Beginning.',
  intro:
    'I’m Chandru G — a B.Tech Information Technology student and aspiring full-stack developer who loves turning ideas into things people can actually use.',
  aboutParagraphs: [
    'I’m Chandru G, a B.Tech Information Technology student and an aspiring full-stack developer.',
    'It started with curiosity — wanting to know how things work, and imagining how they could work better.',
    'Learning became my favourite adventure, and building with technology became the dream I keep walking toward.',
  ],
};

export const school = {
  name: 'K.V.S Higher Secondary School',
  location: 'Virudhunagar',
  years: '[2021 – 2024]',
  photo: '/images/school.jpg',
  photoCaption: 'K.V.S Higher Secondary School, Virudhunagar',
  memories: ['[My school days were filled with learning, friendship and unforgettable memories.]', '[A journey of dedication, hard work and academic excellence.]'],
  // Add ONLY real achievements. Each: { title, detail, image }
  achievements: [
     {
      title: '10th Standard — School 3rd Rank',
      detail: 'Scored 471 out of 500 marks.',
      image: '/images/10.png'
    },
    {
      title: '12th Standard — School 2nd Rank',
      detail: 'Scored 570 out of 600 marks.',
      image: '/images/12.png'
    }
  ],
};

export const college = {
  name: 'Kumaraguru College of Technology',
  location: 'Coimbatore',
  course: 'B.Tech Information Technology',
  years: '[2024 – 2028]',
  summary:
    'Where the curiosity found a direction: algorithms, databases, web technologies — and the first projects I was proud to ship.',
  // Real campus / event photographs. `src: null` shows a placeholder.
  photos: [
    { src: '/images/college.jpg', label: 'Campus photograph' },
    { src: '/images/intern.png', label: 'Technical event photograph' },
  ],
  highlights: [
  'Participated in KSI Codathon 2026, a competitive coding event.',
  'Completed a Full Stack Developer internship at ElevanceSkills, gaining practical experience in web development.',
  'Developed BrainLink, a full-stack web application using the MERN stack.',
  'Built multiple real-world website projects, including e-commerce and business websites.'
   ],
};

export const projects = [
  {
    id: 'brainlink',
    name: 'BrainLink',
    tagline: 'Learning platform',
    description: 'BrainLink is a full-stack learning platform designed to help students connect, learn and grow together. It provides a digital learning environment with user authentication, interactive features and subscription-based premium access.',
    tech: ['MongoDB',
    'Express.js',
    'React.js',
    'Node.js',
    'Vite',
    'Razorpay'],
    image: '/images/brainlink.png', // screenshot, e.g. '/images/brainlink.png'
    github: 'https://github.com/Chandru20060828/brainlink', // e.g. 'https://github.com/your-username/brainlink'
    live: 'https://brainlink-rho.vercel.app/',
    color: '#8b6cff',
  },
  {
    id: 'memoria',
    name: 'Memoria Blooms',
    tagline: 'Bouquet & flower shop website',
    description:
      'Memoria Blooms is a full-stack e-commerce website for handcrafted flower bouquets. It features an elegant product catalogue, a custom admin dashboard for managing products and orders, Cloudinary image uploads, and UPI/QR-based online payments.',
    tech: ['Next.js',
    'Node.js',
    'Express.js',
    'MongoDB',
    'Cloudinary',
    'REST API',
    'UPI / QR Payments'],
    image: '/images/memoria.png',
    github: 'https://github.com/Chandru20060828/memoria-blooms',
    live: 'https://memoria-blooms-oo0m.onrender.com/',
    color: '#ff7ab8',
  },
  {
    id: 'januzz',
    name: 'Januzz Creations',
    tagline: 'Jewellery & boutique showcase',
    description:
      'A boutique website showcasing Aari work, Kundan bangles, invisible chains and saree draping, with an enquiry form that opens a prefilled WhatsApp message.',
    tech: ['HTML5', 'CSS3', 'JavaScript'],
    image: '/images/janu.png',
    github: 'https://github.com/chandru-ganesh-28/januzz-creations',
    live: 'https://chandru-ganesh-28.github.io/januzz-creations/',
    color: '#e0a36a',
  },
  {
    id: 'portfolio',
    name: 'Chandru.xyz',
    tagline: 'Personal portfolio & developer showcase',
    description: 'A personal portfolio website built to showcase my skills, projects, and professional journey as a full-stack developer. It features a custom admin dashboard, dynamic project and testimonial management, Cloudinary image uploads, and SEO optimization.',
    tech: ['HTML',
    'CSS',
    'JavaScript',
    'Node.js',
    'Express.js',
    'MongoDB',
    'Cloudinary'],
    image: '/images/portfolio.png',
    github: 'https://github.com/Chandru20060828/portfolio',
    live: 'https://chandru.xyz/',
    color: '#38e0ff',
  },
  // Add more projects here later — each one becomes another holographic display.
];

export const internship = {
  company: 'ElevanceSkills',
  role: 'Full-Stack Developer Intern',

  dates: '21 May 2026 – 21 July 2026',

  responsibilities: [
    'Developed full-stack web applications using modern web technologies.',
    'Implemented user authentication and secure backend functionality.',
    'Integrated database operations and REST APIs.',
    'Completed and submitted assigned development tasks during the internship.',
  ],

  completedTasks: [
  {
    title: 'Task 1 — Q&A Community Platform',
    detail:
      'Developed a Q&A platform with JWT authentication, four subscription tiers (Free, Bronze, Silver and Gold), Razorpay payment integration, daily question limits, automated invoice emails, and time-restricted payments.',
  },
  {
    title: 'Task 2 — Forgot Password & Password Generator',
    detail:
      'Implemented a secure password reset system using registered email or phone number, with a once-per-day request limit and a random password generator that creates passwords using uppercase and lowercase letters.',
  },
  {
    title: 'Task 3 — Social Community & Friend-Based Posting',
    detail:
      'Developed a public social platform supporting photo and video uploads, likes, comments, and sharing. Implemented friend-based daily posting limits to encourage meaningful social connections.',
  },
  {
    title: 'Task 4 — Multilingual Website & OTP Verification',
    detail:
      'Implemented multilingual support for English, Spanish, Hindi, Portuguese, Chinese, and French, with email OTP verification for French and mobile OTP verification for other language changes.',
  },
  {
    title: 'Task 5 — Login History & Device-Based Authentication',
    detail:
      'Implemented login history tracking for browser, operating system, device type, and IP address. Added browser-specific OTP verification and time-restricted mobile access.',
  },
  {
    title: 'Task 6 — User Rewards & Points Transfer System',
    detail:
      'Developed a user reward system with points for answers and upvotes, profile-based point tracking, user-to-user point transfers, and point deductions for removed or downvoted answers.',
  },
],

  documents: [
    {
      id: 'certificate',
      title: 'Internship Certificate',
      file: '/images/internship-certificate.jpg',
    },
    {
      id: 'experience',
      title: 'Experience Letter',
      file: '/images/experience-letter.jpg' ,
    },
    {
      id: 'recommendation',
      title: 'Letter of Recommendation',
      file: '/images/letter-of-recommendation.jpg',
    },
  ],
};

export const skillGroups = [
  { id: 'frontend', label: 'Frontend', color: '#4fd8ff', items: ['HTML', 'CSS', 'JavaScript', 'React'] },
  { id: 'backend', label: 'Backend', color: '#b79cff', items: ['Node.js', 'Express', 'REST APIs', 'JWT'] },
  { id: 'databases', label: 'Databases', color: '#6dffb0', items: ['MongoDB', 'MySQL'] },
  { id: 'tools', label: 'Tools', color: '#ffd28a', items: ['Git', 'GitHub', 'Cloudinary'] },
  { id: 'deployment', label: 'Deployment', color: '#ff7ab8', items: ['Render', 'Vercel'] },
];

export const contact = {
  note: 'My journey is still being written. Maybe we can build the next chapter together.',
  // `placeholder: true` marks values you still need to replace (they get a dashed underline).
  links: [
    { id: 'email', label: 'Email', value: 'chandru2006tj@gmail.com', href: 'mailto:chandru2006tj@gmail.com', placeholder: true },
    { id: 'github', label: 'GitHub', value: 'github.com/Chandru20060828', href: 'https://github.com/Chandru20060828', placeholder: true },
    { id: 'linkedin', label: 'LinkedIn', value: 'linkedin.com/in/chandru-g', href: 'https://www.linkedin.com/in/chandru-g-3141a4328/', placeholder: true },
    { id: 'portfolio', label: 'Portfolio', value: 'chandru.xyz/', href: 'https://chandru.xyz/', placeholder: true },
  ],
};

/* Voice + subtitle script. `at` = how far through the chapter (0–1) the cue begins. */
export const narration = {
  beginning: [
    {
      at: 0,
      text: 'Every great journey starts somewhere. Before the code, before the projects, before the dreams became real… there was a little boy with a curious mind.',
    },
  ],
  about: [
    { at: 0, text: 'I was the kind of kid who asked “why” about everything — why lights glow, how things really work.' },
    { at: 0.5, text: 'Imagination was my first programming language. Every idea felt like a world I could someday build.' },
  ],
  school: [
    { at: 0, text: 'School was where curiosity met discipline. New friends, new questions, and the first spark of wanting to build things that matter.' },
  ],
  college: [
    { at: 0, text: 'Then came college — a bigger campus, bigger ideas, and a brand new chapter: B.Tech in Information Technology at Kumaraguru College of Technology.' },
  ],
  projects: [
    { at: 0, text: 'Ideas turned into code, and code turned into things people could actually use. These are some of the worlds I have built.' },
  ],
  internship: [
    { at: 0, text: 'Real teams. Real deadlines. At ElevanceSkills I stepped into a full-stack developer internship and learned how products are truly made.' },
  ],
  skills: [
    { at: 0, text: 'Every project added a new tool to the belt — each one another language for saying what I imagined.' },
  ],
  transformation: [
    {
      at: 0,
      text: 'You have followed the journey of a little boy. You saw where he started, what he learned, and what he created. But there is one thing I haven’t told you yet…',
    },
    { at: 0.52, text: 'That little boy… is me.' },
    { at: 0.76, text: 'I’m Chandru G — and this is only the beginning of my story.' },
  ],
  contact: [{ at: 0, text: 'My journey is still being written. Maybe we can build the next chapter together.' }],
};
