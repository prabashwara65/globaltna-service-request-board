const mongoose = require('mongoose');
require('dotenv').config();

// Import your Job model
const Job = require('./model/Job');

// Sample job data - 10 realistic service requests
const sampleJobs = [
  {
    title: "Leaking kitchen sink needs urgent repair",
    description: "The kitchen sink is leaking water from the pipe underneath. Need a plumber to fix it ASAP. Water is dripping constantly.",
    category: "Plumbing",
    location: "Glasgow",
    contactName: "John Smith",
    contactEmail: "john.smith@email.com",
    status: "Open",
  },
  {
    title: "Living room ceiling light not working",
    description: "The main ceiling light in the living room stopped working. Replaced bulbs but still not working. Might be wiring issue.",
    category: "Electrical",
    location: "Edinburgh",
    contactName: "Sarah Johnson",
    contactEmail: "sarah.j@email.com",
    status: "In Progress",
  },
  {
    title: "Bedroom wall needs repainting",
    description: "Looking for a painter to repaint master bedroom walls. Color: light blue. Room size approx 4x5 meters.",
    category: "Painting",
    location: "Glasgow",
    contactName: "David Wilson",
    contactEmail: "david.w@email.com",
    status: "Open",
  },
  {
    title: "Custom wooden bookshelf installation",
    description: "Need a joiner to build and install custom bookshelf in home office. Dimensions: 2m width x 2.5m height.",
    category: "Joinery",
    location: "Aberdeen",
    contactName: "Emma Brown",
    contactEmail: "emma.brown@email.com",
    status: "Open",
  },
  {
    title: "Bathroom exhaust fan not working",
    description: "The bathroom exhaust fan is making noise but not extracting air. Need electrical repair or replacement.",
    category: "Electrical",
    location: "Dundee",
    contactName: "Michael Lee",
    contactEmail: "michael.lee@email.com",
    status: "Closed",
  },
  {
    title: "Garden fence painting required",
    description: "Wooden garden fence needs painting. Approx 20 meters length. Weather protection paint needed.",
    category: "Painting",
    location: "Glasgow",
    contactName: "Lisa Anderson",
    contactEmail: "lisa.a@email.com",
    status: "Open",
  },
  {
    title: "Toilet constantly running water",
    description: "The toilet in main bathroom keeps running water after flush. Need plumber to fix the mechanism.",
    category: "Plumbing",
    location: "Edinburgh",
    contactName: "Robert Taylor",
    contactEmail: "robert.t@email.com",
    status: "In Progress",
  },
  {
    title: "Install new kitchen cabinets",
    description: "Need joiner to install ready-made kitchen cabinets. Already purchased, just need professional installation.",
    category: "Joinery",
    location: "Aberdeen",
    contactName: "Jennifer White",
    contactEmail: "jennifer.w@email.com",
    status: "Open",
  },
  {
    title: "Garage door opener installation",
    description: "Need electrician to install automatic garage door opener. Wiring already present.",
    category: "Electrical",
    location: "Glasgow",
    contactName: "Thomas Martin",
    contactEmail: "thomas.m@email.com",
    status: "Open",
  },
  {
    title: "Water heater not heating properly",
    description: "Water heater takes too long to heat water and doesn't stay hot. Might need repair or replacement.",
    category: "Plumbing",
    location: "Dundee",
    contactName: "Patricia Clark",
    contactEmail: "patricia.c@email.com",
    status: "Open",
  },
];

// Function to insert sample jobs
async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connected to MongoDB');

    const deleteResult = await Job.deleteMany({});
    console.log(` Deleted ${deleteResult.deletedCount} existing jobs`);

    const insertedJobs = await Job.insertMany(sampleJobs);
    console.log(` Inserted ${insertedJobs.length} sample jobs`);

    console.log('\n Sample Jobs Created:');
    insertedJobs.forEach((job, index) => {
      console.log(`${index + 1}. ${job.title} (${job.status})`);
    });

    console.log('\n Seeding completed successfully!');
    
    await mongoose.connection.close();
    console.log(' Database connection closed');
    
  } catch (error) {
    console.error(' Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();