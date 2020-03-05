// init project
const express = require("express");
const app = express();
const Twilio = require("twilio");
const request = require('request');
const cron = require('node-cron');

// setup form and post handling
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// serve static files
app.use(express.static("public"));
// log requests
app.use(function (req, res, next) {
  console.log(req.method, req.url);
  next();
});

// update the apify scraper every week at 9am on monday
cron.schedule('0 9 * * MON', function(){
  request(`https://api.apify.com/v2/actor-tasks/${process.env.APIFY_TASKID}/run-sync?token=${process.env.APIFY_TOKEN}&ui=1`, { json: true }, (err, res, body) => {
    if (err) { return console.log(err); }
    console.log('Successfully ran apify task.');
  });
});

// Get the webpage
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// Set the post url for Twilio to respond to upon recieving a text
app.post("/webhook", function(req, res) {
  // setup twilio client
  const client = new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  
  // Pull the latest set of data from Apify
  request(`https://api.apify.com/v2/actor-tasks/${process.env.APIFY_TASKID}/runs/last/dataset/items?token=${process.env.APIFY_TOKEN}`, { json: true }, (err, resp, body) => {
    if (err) { return console.log(err); }
    // Use localeCompare and trim to test for edge cases and return first (already sorted by date)
    let event = body.filter(function(data){ return (data.location.trim().localeCompare(req.body.Body.trim(), 'en', {sensitivity: 'base'}) == 0) })[0];
    console.log(event);
    
    // Create options to send the twilio text message
    const options = {
      to: req.body.From,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: ''
    };
    
    // Set the response
    if (event == undefined) {
      options.body = 'Sorry, no events found in that location 😔';
    } else {
      // Parse the message into readable text
      options.body = `🏳️‍🌈 ${event.title}, ${event.date}: ${event.url} 🏳️‍🌈`;
    }
    
    // Send the message!
    client.messages.create(options, function(err, response) {
      if (err) {
        console.error(err);
        res.end('oh no, there was an error! Check the app logs for more information.');
      } else {
        console.log('success!');
        // Respond with a 204 no content
        res.writeHead(204);
        res.end('successfully sent message');
      }
    });
  });
});


// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
