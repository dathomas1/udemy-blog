// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

// our default array of dreams
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"), bodyParser.urlencoded({extended: true}));

/*
// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});
*/

// What browser should do when the browser makes get request
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/my-index.html");
});

app.post("/my-index.html", (request, response) => {
  let weight = Number(request.body.weight);
  let height = Number(request.body.height);
  let bmi = 704 * weight / (height ** 2);
  
  response.send(`Your BMI with a weight of ${weight} lbs. and a height of ${height} inches is ${bmi}`);
});

app.post("/weather", (request, response) => {  
  let city = request.body.cityName;
  let appId = process.env.WEATHER_KEY;
  let units = "imperial";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${appId}&units=${units}`;
  
  
  https.get(url, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);
    
    res.on("data", (data) => {
      const weatherData = JSON.parse(data);
      const temperature = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const iconURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
      
      response.write(`<h1>Welcome</h1>`)
      response.write(`<p>The weather in ${city} is...</p>`);
      response.write(`<h2>${temperature} degrees with ${description}</h2>`);
      response.write(`<img src=${iconURL}>`);
      response.send()
    })
  });
});

app.get("/weather", (request, response) => {
  response.sendFile(__dirname + "/views/weather.html");
  
})

app.get("/dreams", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(dreams);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
