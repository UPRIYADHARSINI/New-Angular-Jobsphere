const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/jobsphere', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('✅ Connected to MongoDB');

  // Define the Admin schema
  const Admin = mongoose.model('Admin', new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
  }));

  // Check if admin already exists
  const existingAdmin = await Admin.findOne({ email: 'adminjobsphere@gmail.com' });
  if (existingAdmin) {
    console.log('⚠️ Admin already exists:', existingAdmin);
    await Admin.deleteOne({ email: 'adminjobsphere@gmail.com' });
    console.log('🗑️ Deleted existing admin');
  }

  // Hash the password and create the admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const newAdmin = await Admin.create({ email: 'adminjobsphere@gmail.com', password: hashedPassword });
  console.log('✅ Admin created successfully:', newAdmin);

  // Verify the admin was created
  const verifyAdmin = await Admin.findOne({ email: 'adminjobsphere@gmail.com' });
  console.log('✅ Verified admin in database:', verifyAdmin);

  mongoose.disconnect();
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});