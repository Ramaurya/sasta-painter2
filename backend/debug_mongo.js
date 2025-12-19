const MongoStore = require('connect-mongo');
console.log('MongoStore:', MongoStore);
console.log('Type of MongoStore:', typeof MongoStore);
console.log('MongoStore.create:', MongoStore.create);
try {
    console.log('MongoStore.default:', MongoStore.default);
} catch (e) { }
