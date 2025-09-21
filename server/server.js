//ONxiNDuila57X9La
//mongodb+srv://salvesiddhant49_db_user:PyNj64SdU3jNOPOt@cluster0.4h16o4t.mongodb.net/

const express = require('express');
const app = express();
const authRoute = require('./routes/auth');
const taskRoute = require('./routes/task');
const cors = require('cors');
require('dotenv').config();

app.use(express.json());
app.use(cors());


const connectDB = require('./utils/db');
connectDB();

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/task', taskRoute);

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})