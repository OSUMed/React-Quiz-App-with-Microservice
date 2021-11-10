const express = require("express");
const puppeteer = require("puppeteer");
const axios = require("axios");
var myFormData = require("form-data");
var bodyParser = require("body-parser");
var fs = require("fs");

const app = express();
app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const PORT = process.env.PORT || 4000;

var form = new myFormData();
const stream = fs.createReadStream("globe1.jpg");

form.append("image", stream);
form.append("new_name", "myglobe.jpg");
form.append("width", "");
form.append("height", "");

// In Node.js environment you need to set boundary in the header field 'Content-Type' by calling method `getHeaders`
const formHeaders = form.getHeaders();

// Create placeholder to collect the url recieved from microservice:
var holdURL = "";

function test_func(form) {
  axios
    .post("http://34.71.171.250/upload", form, {
      headers: {
        ...formHeaders,
      },
    })
    .then((response) => (holdURL = response.data.image_url))
    .catch((error) =>
      console.log(
        "ERROR! Can't connect to " +
          error.config.url +
          ". The correct upload link is http://34.71.171.250/upload"
      )
    );
}
test_func(form);

app.get("/", async (req, res) => {
  console.log("farmed URL is: ", holdURL);
  res.send({ holdURL });
});

let browser;
let page;

// async function test_func(form) {
//   const config = Object.assign({
//     method: "POST",
//     url: "http://34.71.171.250/upload",
//     data: form,
//     headers: form.getHeaders(),
//   });

//   const response = await axios.request(config);
//   console.log(response.data.image_url);
// }

// function parseImage(page) {

// }

// app.get("/makefile/:mysearch", async (req, res) => {
//   (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.setViewport({
//       width: 1300,
//       height: 900,
//     });
//     console.log(
//       "https://www.google.com/search?tbm=isch&q=" + req.params.mysearch
//     );
//     await page.goto(
//       "https://www.google.com/search?tbm=isch&q=" + req.params.mysearch
//     );

//     // Respond with the image
//     await page.screenshot({ path: "myglobe.png" });
//     console.log("hello world");
//     await browser.close();
//   })();
// });

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
