Pridebot
===============

A Twilio bot that sends you info on the soonest pride event in a given city. Adapted from [Transposit](https://www.transposit.com/apps/a/pridebot/) and [Glitch Basic Twilio SMS](https://glitch.com/~basic-twilio-sms)

This bot uses a custom scraper made in [Apify](http://apify.com/) to specifically scrape https://www.nighttours.com/gaypride/ for their events. The code for this scraper can be found [here](https://gist.github.com/WingofaGriffin/83f1df1987a5ec39f5a5b38c5d5ce1d0).

Project Overview
------------

On the front-end,
* `public/style.css` is the app's style
* `views/index.html` is the app's UI

On the back-end,
* `server.js` is run when the project starts
* `package.json` contains the app's dependencies
* `.env` contains variables custom to the app we don't want other users to see

### More Info

* [Twilio node helper library](https://www.twilio.com/docs/libraries/node)
* [Twilio developer docs](https://www.twilio.com/docs/)
* [Apify developer docs](https://docs.apify.com/api/v2#/reference)


Made by [Griffin Solot-Kehl](https://griffin.run)
-------------------
