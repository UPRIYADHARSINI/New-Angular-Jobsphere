const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;


//app.use(cors({ origin: 'http://localhost:4200' })); // Explicitly allow CORS for Angular app

app.use(cors({
  origin: [
    "http://localhost:4200",
    "https://your-frontend.onrender.com"
  ]
}));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// MongoDB Connection
mongoose.connect("mongodb+srv://Jobsphere:Priya%402004@cluster0.dbaghil.mongodb.net/jobsphere", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully!'))
.catch(err => console.error('❌ MongoDB Connection Failed:', err));

// Schemas
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  qualification: String,
  status: String,
  resumeUrl: { type: String, default: '' },
  profileImageUrl: { type: String, default: '' }
});
const User = mongoose.model('User', UserSchema);

const RecruiterSchema = new mongoose.Schema({
  name: String,
  companyType: String,
  companyName: String,
  mainBranch: String,
  experience: Number,
  email: { type: String, unique: true },
  contactNumber: String,
  website: String,
  password: String,
  profileImageUrl: { type: String, default: '' }
}, { timestamps: true });
const Recruiter = mongoose.model('Recruiter', RecruiterSchema);

const JobSchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  companyName: String,
  jobTitle: String,
  location: String,
  salary: String,
  experience: String,
  skills: String,
  description: String,
  applicants: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: String,
      email: String,
      phone: String,
      resumeLink: String,
      status: { type: String, default: 'applied' }
    }
  ]
}, { timestamps: true });
const Job = mongoose.model('Job', JobSchema);

const LoginHistorySchema = new mongoose.Schema({
  email: String,
  role: String,
  loginTime: { type: Date, default: Date.now }
});
const LoginHistory = mongoose.model('LoginHistory', LoginHistorySchema);

const AppliedJobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  appliedDate: { type: Date, default: Date.now },
  status: { type: String, default: 'applied' } // Added status field
});
const AppliedJob = mongoose.model('AppliedJob', AppliedJobSchema);

// Schema to Track Job Deletions
const JobDeletionSchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  jobTitle: String,
  deletedAt: { type: Date, default: Date.now }
});
const JobDeletion = mongoose.model('JobDeletion', JobDeletionSchema);

const AdminSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }
});
const Admin = mongoose.model('Admin', AdminSchema);

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// User Registration
app.post('/api/user-register', async (req, res) => {
  try {
    const { email, phone, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).send({ message: '❌ User already exists with this email or phone number.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();
    res.send({ message: '✅ User Registered Successfully!' });
  } catch (err) {
    res.status(500).send({ message: '❌ Error registering user', error: err });
  }
});

// Recruiter Registration
app.post('/api/recruiter-register', async (req, res) => {
  try {
    const { email, contactNumber, password } = req.body;
    const existingRecruiter = await Recruiter.findOne({ $or: [{ email }, { contactNumber }] });
    if (existingRecruiter) {
      return res.status(409).send({ message: '❌ Recruiter already exists with this email or contact number.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const recruiter = new Recruiter({ ...req.body, password: hashedPassword });
    await recruiter.save();
    res.send({ message: '✅ Recruiter Registered Successfully!', recruiter });
  } catch (err) {
    res.status(500).send({ message: '❌ Error registering recruiter', error: err });
  }
});

// User Login
app.post('/api/user-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      await new LoginHistory({ email: user.email, role: 'user' }).save();
      res.send({ message: '✅ Login successful!', user });
    } else {
      res.status(401).send({ message: '❌ Invalid credentials!' });
    }
  } catch (err) {
    res.status(500).send({ message: '❌ Error during login', error: err });
  }
});

// Recruiter Login
app.post('/api/recruiter-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const recruiter = await Recruiter.findOne({ email });
    if (recruiter && await bcrypt.compare(password, recruiter.password)) {
      await new LoginHistory({ email: recruiter.email, role: 'recruiter' }).save();
      res.send({ message: '✅ Recruiter Login successful!', recruiter, recruiterId: recruiter._id });
    } else {
      res.status(401).send({ message: '❌ Invalid recruiter credentials!' });
    }
  } catch (err) {
    res.status(500).send({ message: '❌ Error during recruiter login', error: err });
  }
});

// Admin Login
app.post('/api/admin-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: '❌ Invalid admin credentials!' });
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) return res.status(401).json({ message: '❌ Invalid admin credentials!' });
    await new LoginHistory({ email: admin.email, role: 'admin' }).save();
    res.json({ message: '✅ Admin login successful!' });
  } catch (err) {
    res.status(500).json({ message: '❌ Error during admin login', error: err });
  }
});

// Get All Users and Recruiters for Admin Home Page
app.get('/api/admin/users-recruiters', async (req, res) => {
  console.log('Received request for /api/admin/users-recruiters'); // Debugging log
  try {
    const users = await User.find().select('-password');
    const recruiters = await Recruiter.find().select('-password');
    res.json({ users, recruiters });
  } catch (err) {
    res.status(500).json({ message: '❌ Error fetching users and recruiters', error: err });
  }
});

// Get User Activity
app.get("/api/admin/user-activity/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ message: '❌ User not found' });
    const loginHistory = await LoginHistory.find({ email: user.email }).sort({ loginTime: -1 });
    const appliedJobs = await AppliedJob.find({ userId: id })
      .populate({
        path: 'jobId',
        populate: { path: 'recruiterId', select: 'name companyName' }
      });
    res.json({ user, loginHistory, appliedJobs });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user activity", error });
  }
});

// Get Recruiter Activity
app.get("/api/admin/recruiter-activity/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const recruiter = await Recruiter.findById(id).select('-password');
    if (!recruiter) return res.status(404).json({ message: '❌ Recruiter not found' });
    const loginHistory = await LoginHistory.find({ email: recruiter.email }).sort({ loginTime: -1 });
    const jobsPosted = await Job.find({ recruiterId: id }).sort({ createdAt: -1 });
    const jobsDeleted = await JobDeletion.find({ recruiterId: id }).sort({ deletedAt: -1 });
    res.json({ recruiter, loginHistory, jobsPosted, jobsDeleted });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch recruiter activity", error });
  }
});

// Get Login History (with optional email filter)
app.get('/api/login-history', async (req, res) => {
  try {
    const { email } = req.query;
    const query = email ? { email } : {};
    const history = await LoginHistory.find(query).sort({ loginTime: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: '❌ Error fetching login history', error: err });
  }
});

// Post a Job
app.post('/api/post-job', async (req, res) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.send({ message: '✅ Job posted successfully!', job });
  } catch (err) {
    res.status(500).send({ message: '❌ Error posting job', error: err });
  }
});

// Get All Jobs
app.get('/api/get-jobs', async (req, res) => {
  try {
    const jobs = await Job.find().populate('recruiterId', 'name companyName');
    res.send({ jobs });
  } catch (err) {
    res.status(500).send({ message: '❌ Error fetching jobs', error: err });
  }
});

// Get Recruiter-Specific Jobs
app.get('/api/recruiter-jobs/:recruiterId', async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.params.recruiterId }).populate('recruiterId', 'name companyName');
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: '❌ Error fetching recruiter jobs', error: err });
  }
});

// Get Jobs User Applied For
app.get('/api/user-applied-jobs/:userId', async (req, res) => {
  try {
    const applied = await AppliedJob.find({ userId: req.params.userId });
    const jobIds = applied.map(a => a.jobId);
    const jobs = await Job.find({ _id: { $in: jobIds } })
      .populate('recruiterId', 'name companyName')
      .populate('applicants.userId', 'name email');

    // Map the status and appliedDate from AppliedJob to each job
    const jobsWithStatus = jobs.map(job => {
      const application = applied.find(app => app.jobId.toString() === job._id.toString());
      const jobWithStatus = {
        ...job.toObject(),
        applicationStatus: application ? application.status : 'applied',
        appliedDate: application ? application.appliedDate : null
      };
      console.log(`Job ${job._id} status:`, jobWithStatus.applicationStatus); // Debug log
      return jobWithStatus;
    });

    res.json({ jobs: jobsWithStatus });
  } catch (err) {
    res.status(500).json({ message: '❌ Failed to load applied jobs', error: err });
  }
});
// Apply for a Job
app.post('/api/apply-job', async (req, res) => {
  try {
    const { userId, jobId, name, email, phone, resumeLink } = req.body;
    if (!jobId || !email || !userId) {
      return res.status(400).send({ message: 'Missing required fields' });
    }

    // Check if the user has already applied for this job
    const existingApplication = await AppliedJob.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(409).send({ message: '❌ You have already applied for this job!' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).send({ message: 'Job not found' });
    }

    // Add the applicant to the job
    job.applicants.push({ userId, name, email, phone, resumeLink, status: 'applied' });
    await job.save();

    // Record the application in AppliedJob collection with status
    const appliedJob = new AppliedJob({ userId, jobId, status: 'applied' });
    await appliedJob.save();

    res.send({ message: '✅ Application submitted successfully!' });
  } catch (err) {
    res.status(500).send({ message: '❌ Error applying for job', error: err });
  }
});

// Recruit a Candidate
app.put('/api/recruit-candidate/:jobId/:email', async (req, res) => {
  try {
    const { jobId, email } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).send({ message: '❌ Job not found' });

    const applicantIndex = job.applicants.findIndex(applicant => applicant.email === email);
    if (applicantIndex === -1) return res.status(404).send({ message: '❌ Applicant not found' });

    // Check if the applicant is already recruited
    const applicant = job.applicants[applicantIndex];
    if (applicant.status === 'recruited') {
      return res.status(409).send({ message: '❌ This candidate has already been recruited for this job!' });
    }

    // Update status in job.applicants
    job.applicants[applicantIndex].status = 'recruited';
    await job.save();

    // Update status in AppliedJob collection
    const updateResult = await AppliedJob.updateOne(
      { userId: applicant.userId, jobId },
      { $set: { status: 'recruited' } }
    );
    console.log('AppliedJob update result:', updateResult); // Debug log

    res.send({ message: '✅ Candidate recruited successfully!', job });
  } catch (err) {
    res.status(500).send({ message: '❌ Error recruiting candidate', error: err });
  }
});

// Delete a Job (Track Deletion)
app.delete('/api/delete-job/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).send({ message: '❌ Job not found' });
    }
    const jobDeletion = new JobDeletion({
      recruiterId: job.recruiterId,
      jobId: job._id,
      jobTitle: job.jobTitle
    });
    await jobDeletion.save();
    await Job.findByIdAndDelete(jobId);
    await AppliedJob.deleteMany({ jobId });
    res.send({ message: '✅ Job deleted successfully!' });
  } catch (err) {
    res.status(500).send({ message: '❌ Error deleting job', error: err });
  }
});

// Get User by ID
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: '❌ User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: '❌ Error fetching user', error: err });
  }
});

// Update User Profile
app.put('/api/user/:id', async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ message: '❌ User not found' });
    res.json({ message: '✅ Profile updated', user: updated });
  } catch (err) {
    res.status(500).json({ message: '❌ Error updating profile', error: err });
  }
});

// Upload Resume
app.post('/api/upload-resume/:id', upload.single('resume'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: '❌ No file uploaded' });
  const filePath = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, { resumeUrl: filePath }, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ message: '❌ User not found' });
    res.json({ message: '✅ Resume uploaded', user: updated });
  } catch (err) {
    res.status(500).json({ message: '❌ Upload failed', error: err });
  }
});

// Upload Profile Photo
app.post('/api/upload-profile-photo/:id', upload.single('profilePhoto'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: '❌ No file uploaded' });
  const imagePath = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, { profileImageUrl: imagePath }, { new: true }).select('-password');
    if (!updated) return res.status(404).json({ message: '❌ User not found' });
    res.json({ message: '✅ Profile photo uploaded', user: updated });
  } catch (err) {
    res.status(500).json({ message: '❌ Upload failed', error: err });
  }
});

// Get Recruiter Details by Email
app.get('/api/get-recruiter/:email', async (req, res) => {
  try {
    const recruiter = await Recruiter.findOne({ email: req.params.email }).select('-password');
    if (!recruiter) return res.status(404).json({ message: '❌ Recruiter not found' });
    res.json({ recruiter });
  } catch (err) {
    res.status(500).json({ message: '❌ Error fetching recruiter', error: err });
  }
});

// Update Recruiter Profile
app.put('/api/update-recruiter/:email', async (req, res) => {
  try {
    const { name, companyType, companyName, mainBranch, experience, contactNumber, website, profileImageUrl } = req.body;
    const updated = await Recruiter.findOneAndUpdate(
      { email: req.params.email },
      { name, companyType, companyName, mainBranch, experience, contactNumber, website, profileImageUrl },
      { new: true }
    ).select('-password');
    if (!updated) return res.status(404).json({ message: '❌ Recruiter not found' });
    res.json({ message: '✅ Profile updated', recruiter: updated });
  } catch (err) {
    res.status(500).json({ message: '❌ Error updating profile', error: err });
  }
});

// Upload Profile Photo for Recruiter
app.post('/api/upload-recruiter-profile-photo/:email', upload.single('profilePhoto'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: '❌ No file uploaded' });
  const imagePath = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  try {
    const updated = await Recruiter.findOneAndUpdate(
      { email: req.params.email },
      { profileImageUrl: imagePath },
      { new: true }
    ).select('-password');
    if (!updated) return res.status(404).json({ message: '❌ Recruiter not found' });
    res.json({ message: '✅ Profile photo uploaded', recruiter: updated });
  } catch (err) {
    res.status(500).json({ message: '❌ Upload failed', error: err });
  }
});

// Root Route for Debugging
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Catch-All Route for Debugging Unhandled Routes
app.use((req, res) => {
  console.log(`Unhandled route: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});