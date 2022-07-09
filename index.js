require('dotenv').config();
const http = require('http');
const fs = require('fs');
var requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf-8");


const replaceVal = (tempVal, orgVal) => {
    let temprature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temprature = temprature.replace("{%tempmin%}", orgVal.main.temp_min);
    temprature = temprature.replace("{%tempmax%}", orgVal.main.temp_max);
    temprature = temprature.replace("{%location%}", orgVal.name);
    temprature = temprature.replace("{%country%}", orgVal.sys.country);
    temprature = temprature.replace("{%tempstatus%}", orgVal.weather[0].main);
    temprature = temprature.replace("{%humidity%}", orgVal.main.humidity);
    temprature = temprature.replace("{%pressure%}", orgVal.main.pressure);
    return temprature;

};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests(`https://api.openweathermap.org/data/2.5/weather?q=Gorakhpur&units=metric&appid=9b3b9f4c6298f3c5178727d9ba566c07`)
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrdata = [objdata];
                const realTimeData = arrdata.map((val) => replaceVal(homeFile, val))
                    .join("");
                res.write(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    } else {
        res.end("File not found");
    }
});

server.listen(8000, "127.0.0.1");