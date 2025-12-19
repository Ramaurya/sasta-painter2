const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Use the Atlas Connection String
const mongoURI = 'mongodb+srv://rk209402maurya_db_user:zwO7Q0fvfXBd6r99@cluster0.fhnpbhq.mongodb.net/SastaPainter?retrywrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected to Atlas'))
    .catch(err => console.error('Connection Error:', err));

const createKishlayAdmin = async () => {
    try {
        const username = 'kishlay';
        const password = 'kishlay123';
        const email = 'kishlay@admin.com'; // Dummy email

        const hashedPassword = await bcrypt.hash(password, 10);

        let admin = await User.findOne({ username });

        if (admin) {
            console.log('User kishlay found. Updating to Admin...');
            admin.password = hashedPassword;
            admin.isAdmin = true;
            await admin.save();
            console.log('User kishlay updated to Admin successfully.');
        } else {
            console.log('Creating new admin user kishlay...');
            const newAdmin = new User({
                username,
                email,
                password: hashedPassword,
                isAdmin: true
            });
            await newAdmin.save();
            console.log('Admin user kishlay created successfully.');
        }
        mongoose.disconnect();
    } catch (error) {
        console.error('Error creating admin:', error);
        mongoose.disconnect();
    }
};

createKishlayAdmin();
