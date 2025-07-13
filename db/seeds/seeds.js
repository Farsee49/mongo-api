

const mongoose = require('mongoose');

const Fish = require('../models/fish');
const User = require('../models/users');

const data = require('./seedData.js');
//console.log(data);



// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fishDB');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const seedFish = async () => {
    await Fish.deleteMany({});
    console.log('Deleted all fish');

    for (const fishData of data.fishData || []) {
        const fish = new Fish(fishData);
        await fish.save();
        console.log(`Added fish: ${fish.species}`);
    }

    console.log('Database seeding completed');
}

// If you have user data, you can add a similar function for users
const seedUsers = async () => {
    await User.deleteMany({});
    console.log('Deleted all users');

    for (const userData of data.userData || []) {
        const user = new User(userData);
        await user.save();
        console.log(`Added user: ${user.username}`);
    }
    console.log('User seeding completed');
}

const seedDb = async () => {
    
    await seedUsers();await seedFish();
}

seedDb()
    .then(() => {
        mongoose.connection.close();
        console.log('Connection closed');
    })
    .catch(err => {
        console.error('Error seeding database:', err);
        mongoose.connection.close();
    });