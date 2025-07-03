const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/Schema');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const uri = process.env.Mongo_URI;
const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(uri)
    .then(() => console.log("Database Connected!"))
    .catch((error) => console.error("Connection Error with MongoDB: ", error));
// mongoose.connection.once('open', () => {
//     console.log('Database connected!');
// });

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(PORT, () => {
    console.log('listening for requests on port: ${PORT}');
});
