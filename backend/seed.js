// Run once: node seed.js
// This adds colleges, news articles, and sample jobs to your database
require('dotenv').config();
const mongoose = require('mongoose');
const { College, News, Job } = require('./models');

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected');

  // ── Colleges ──────────────────────────────────────────
  await College.deleteMany({});
  await College.insertMany([
    { name:'LNCT Bhopal',                      course:'B.Tech', fee:95000,  seats:120, affiliation:'RGPV',               badge:'Popular' },
    { name:'Bhopal College of Science',         course:'BCA',    fee:42000,  seats:60,  affiliation:'Barkatullah Univ',   badge:'Budget'  },
    { name:'Sagar Institute of R&T',            course:'B.Tech', fee:85000,  seats:90,  affiliation:'RGPV',               badge:'Popular' },
    { name:'Oriental Institute of Science',     course:'MBA',    fee:75000,  seats:60,  affiliation:'RGPV',               badge:''        },
    { name:'RKDF University',                   course:'BBA',    fee:48000,  seats:80,  affiliation:'Private University', badge:''        },
    { name:'Maulana Azad NIT',                  course:'B.Tech', fee:112000, seats:60,  affiliation:'NIT (Govt)',         badge:'Top Ranked' },
    { name:'IES College of Technology',         course:'BCA',    fee:38000,  seats:60,  affiliation:'RGPV',               badge:'Budget'  },
    { name:'Barkatullah University',            course:'B.Sc',   fee:22000,  seats:100, affiliation:'State University',   badge:'Govt'    },
    { name:'Truba Institute of Engineering',    course:'MBA',    fee:68000,  seats:60,  affiliation:'RGPV',               badge:''        },
    { name:"People's University",               course:'BBA',    fee:55000,  seats:80,  affiliation:'Private University', badge:''        },
    { name:'Vindhya Institute',                 course:'B.Com',  fee:28000,  seats:100, affiliation:'Barkatullah Univ',   badge:'Budget'  },
    { name:'Technocrats Institute',             course:'B.Tech', fee:78000,  seats:90,  affiliation:'RGPV',               badge:''        },
    { name:'Rabindranath Tagore University',    course:'BCA',    fee:45000,  seats:60,  affiliation:'Private University', badge:''        },
    { name:'Sage University Bhopal',            course:'B.Tech', fee:88000,  seats:90,  affiliation:'Private University', badge:''        },
    { name:'TIT&S Bhopal',                      course:'B.Com',  fee:32000,  seats:80,  affiliation:'Barkatullah Univ',   badge:'Budget'  },
    { name:'Bansal Institute of R&T',           course:'B.Tech', fee:72000,  seats:90,  affiliation:'RGPV',               badge:''        },
    { name:'LNCT Group of Colleges',            course:'BCA',    fee:40000,  seats:60,  affiliation:'RGPV',               badge:''        },
    { name:'Sri Aurobindo Institute',           course:'BBA',    fee:50000,  seats:80,  affiliation:'Barkatullah Univ',   badge:''        },
  ]);
  console.log('✅ 18 colleges added');

  // ── News ──────────────────────────────────────────────
  await News.deleteMany({});
  const newsData = [
    {
      title: 'Admissions Open 2026–27 at Top Bhopal Colleges',
      excerpt: 'B.Tech, BCA, MBA and BBA seats filling fast. Apply now through ir-pt Edtech for priority admission.',
      content: 'Colleges across Bhopal have officially opened admissions for the 2026–27 academic year. ir-pt Edtech has secured reserved seats at 15+ partnered colleges for eligible students. Contact us before June 30 for guaranteed consideration.\n\nRequired documents:\n• 10th & 12th marksheets\n• Transfer certificate\n• Character certificate\n• Passport photos\n• Aadhaar card\n• Domicile certificate',
      category: 'Admissions', emoji: '🎓', published: true,
    },
    {
      title: 'Free Career Counselling Camp — April 2026',
      excerpt: 'Join us for a free career guidance session for 12th class students and parents at our Bhopal office.',
      content: 'ir-pt Edtech is hosting a free career counselling camp for all 12th class students and their parents.\n\nWhat you will get:\n• Psychometric career assessment test\n• One-on-one counsellor session\n• College comparison for your stream\n• Scholarship information\n• Q&A with experts\n\nRegister by calling 82230 63535 or WhatsApp us.',
      category: 'Events', emoji: '🌟', published: true,
    },
    {
      title: '5 High-Demand Careers After 12th Commerce in 2026',
      excerpt: 'BBA, CA, Digital Marketing, Finance — top career paths for commerce students.',
      content: 'If you have completed 12th Commerce, here are the 5 most in-demand careers in 2026:\n\n1. Chartered Accountancy (CA) — High earning potential, respectable profession\n2. BBA + MBA — Opens doors to management and leadership roles\n3. Digital Marketing — Fastest growing field, high demand across all industries\n4. Investment Banking & Finance — Premium salaries in Bhopal companies\n5. E-Commerce & Entrepreneurship — Build your own business\n\nBook a free session with our counsellors to find which path suits your specific profile and strengths.',
      category: 'Career Tips', emoji: '💡', published: true,
    },
    {
      title: 'Placement Season 2026 — Top Companies Visiting Bhopal',
      excerpt: '50+ companies expected to recruit from Bhopal colleges this season. Is your resume ready?',
      content: 'The 2026 placement season has officially started across Bhopal colleges. Over 50 companies are expected to recruit students from engineering, management, and computer science programmes.\n\nir-pt Edtech is offering free placement preparation sessions including:\n• ATS-friendly resume building\n• Mock interview practice\n• LinkedIn profile optimisation\n• Soft skills training\n\nContact us today to get placement-ready before your campus drives begin.',
      category: 'Placement', emoji: '💼', published: true,
    },
  ];
  for (const n of newsData) await new News(n).save();
  console.log('✅ 4 news articles added');

  // ── Jobs ──────────────────────────────────────────────
  await Job.deleteMany({});
  await Job.insertMany([
    {
      title: 'Junior Software Developer',
      company: 'TechBhopal Solutions',
      location: 'Bhopal, MP',
      type: 'Full-time',
      category: 'IT',
      salary: '₹2.5L–₹4L/year',
      experience: 'Freshers OK (0–2 years)',
      description: 'Work on exciting web and mobile projects. Collaborative team environment with growth opportunities.',
      requirements: 'B.Tech/BCA in CS. HTML, CSS, JavaScript knowledge required. React/Node.js is a plus.',
    },
    {
      title: 'Digital Marketing Executive',
      company: 'GrowthMinds Agency',
      location: 'Bhopal, MP',
      type: 'Full-time',
      category: 'Marketing',
      salary: '₹2L–₹3.5L/year',
      experience: 'Freshers welcome',
      description: 'Run social media campaigns, Google Ads, and content creation for our clients across India.',
      requirements: 'Any graduate. Knowledge of social media platforms. Basic SEO and digital ads understanding.',
    },
    {
      title: 'Business Development Executive',
      company: 'EduReach India',
      location: 'Bhopal, MP',
      type: 'Full-time',
      category: 'Sales',
      salary: '₹2L–₹4L + incentives',
      experience: 'Freshers OK',
      description: 'Identify and develop new business opportunities. Meet schools and colleges to promote ed-tech products.',
      requirements: 'MBA/BBA preferred. Good Hindi & English communication. Own vehicle preferred.',
    },
    {
      title: 'Web Development Intern',
      company: 'PixelCraft Studio',
      location: 'Bhopal (WFH available)',
      type: 'Internship',
      category: 'IT',
      salary: '₹5,000–₹10,000/month stipend',
      experience: 'Students and freshers welcome',
      description: '3-month paid internship on real client projects. Certificate + recommendation letter provided.',
      requirements: 'BCA/B.Tech pursuing or completed. Basic HTML, CSS, JS knowledge.',
    },
    {
      title: 'Accountant',
      company: 'Sharma & Associates CA Firm',
      location: 'Bhopal, MP',
      type: 'Full-time',
      category: 'Finance',
      salary: '₹2.5L–₹4L/year',
      experience: '0–3 years',
      description: 'Day-to-day accounting, GST filing, TDS, and client account management.',
      requirements: 'B.Com / M.Com. Tally ERP knowledge. CA Inter is a plus.',
    },
    {
      title: 'Content Writer (Hindi + English)',
      company: 'MediaBridge Communications',
      location: 'Work from Home',
      type: 'Work from Home',
      category: 'Marketing',
      salary: '₹15,000–₹25,000/month',
      experience: 'Freshers OK',
      description: 'Write blog posts, social media content, ad copy in Hindi and English for clients.',
      requirements: 'Any graduate. Excellent Hindi and English writing skills. Portfolio preferred.',
    },
  ]);
  console.log('✅ 6 jobs added');

  console.log('\n🎉 Seed complete! Now run: node server.js');
  process.exit(0);
}

seed().catch(e => { console.error('❌ Seed failed:', e.message); process.exit(1); });
