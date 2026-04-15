const mongoose = require('mongoose');
const { Schema } = mongoose;

/* ── Lead ── */
const LeadSchema = new Schema({
  leadId:    { type: String, unique: true, sparse: true },
  name:      { type: String, required: true, trim: true },
  phone:     { type: String, required: true, trim: true },
  email:     { type: String, default: '' },
  classYear: { type: String, default: '' },
  course:    { type: String, default: 'General' },
  message:   { type: String, default: '' },
  source:    { type: String, default: 'Website',
               enum: ['Website','WhatsApp','Referral','Walk-in','Event',
                      'Phone Call','College Page','Contact Form','Job Page','Upload','Manual'] },
  status:    { type: String, default: 'New',
               enum: ['New','Follow-up','Enrolled','Cold'] },
  notes:     { type: String, default: '' },
  college:   { type: String, default: '' },
}, { timestamps: true });

LeadSchema.pre('save', async function(next) {
  if (!this.leadId) {
    const n = await mongoose.model('Lead').countDocuments();
    this.leadId = 'L' + String(n + 1).padStart(4, '0');
  }
  next();
});

/* ── College ── */
const CollegeSchema = new Schema({
  name:        { type: String, required: true, trim: true },
  course:      { type: String, required: true },
  fee:         { type: Number, required: true },
  seats:       { type: Number, default: 60 },
  location:    { type: String, default: 'Bhopal, MP' },
  affiliation: { type: String, default: '' },
  badge:       { type: String, default: '',
                 enum: ['','Popular','Budget','Top Ranked','Govt','New'] },
  description: { type: String, default: '' },
  active:      { type: Boolean, default: true },
}, { timestamps: true });

/* ── News ── */
const NewsSchema = new Schema({
  title:     { type: String, required: true, trim: true },
  excerpt:   { type: String, default: '' },
  content:   { type: String, required: true },
  category:  { type: String, default: 'Announcement',
               enum: ['Admissions','Career Tips','Placement','Events','Announcement'] },
  emoji:     { type: String, default: '📰' },
  published: { type: Boolean, default: true },
  slug:      { type: String, unique: true, sparse: true },
}, { timestamps: true });

NewsSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
      .substring(0, 80) + '-' + Date.now();
  }
  next();
});

/* ── Job ── */
const JobSchema = new Schema({
  title:        { type: String, required: true, trim: true },
  company:      { type: String, required: true, trim: true },
  location:     { type: String, default: 'Bhopal, MP' },
  type:         { type: String, default: 'Full-time',
                  enum: ['Full-time','Part-time','Internship','Work from Home','Contract'] },
  category:     { type: String, default: 'IT',
                  enum: ['IT','Marketing','Finance','Sales','Management','Teaching','Healthcare','Other'] },
  salary:       { type: String, default: '' },
  experience:   { type: String, default: 'Freshers OK' },
  description:  { type: String, default: '' },
  requirements: { type: String, default: '' },
  applyLink:    { type: String, default: '' },
  active:       { type: Boolean, default: true },
}, { timestamps: true });

module.exports = {
  Lead:    mongoose.model('Lead',    LeadSchema),
  College: mongoose.model('College', CollegeSchema),
  News:    mongoose.model('News',    NewsSchema),
  Job:     mongoose.model('Job',     JobSchema),
};
