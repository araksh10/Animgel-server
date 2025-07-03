const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/Schema');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.Mongo_URI);
mongoose.connection.once('open', () => {
    console.log('Database connected!');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('listening for requests on port: 4000');
})
