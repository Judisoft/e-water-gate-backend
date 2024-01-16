const express = require('express')
const otpController = require('./controllers/otpController');
const cors = require('cors');

const app = express();
app.use(cors());
// parse request of content-type - application/json
app.use(express.json());

// parse request of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true}));

require('dotenv').config()
const PORT = process.env.PORT || 4000


app.use(express.json())


//route importing and mounting
const user = require('./routes/user');
const group = require('./routes/group');
const member = require('./routes/member');
const ballot = require('./routes/ballot');
const contact = require('./routes/contact');

app.use('/api/v1', user);
app.post('/api/v1/send-otp', otpController.sendOTP);
app.use('/api/v1', group);
app.use('/api/v1', member);
app.use('/api/v1', ballot);
app.use('/api/v1', contact);




async function start() {
    try {
        //calling Database function
        require('./config/database').connect();

        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);

        });
    } catch (error) {
        console.log(error);
    }
}
start();