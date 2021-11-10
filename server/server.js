const express = require("express");
const axios = require("axios");
var myFormData = require("form-data");
var bodyParser = require("body-parser");
var fs = require("fs");

const app = express();
app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Collected from a CORS error from online. Found to fix the problem to specifically put "Access-Control-Allow-Origin", "*"
// inside the header. Thus, did it:
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// We listen on port 4000. Front end is on port 3001:
const PORT = process.env.PORT || 4000;

// Code created by using the documentaiton for help--
//Under "Integreation with other libraries", https://www.npmjs.com/package/form-data
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

function microservice_call(form) {
    //Make axios call to teammate's microservice: pass the created form and header:
    axios
    .post("http://34.71.171.250/upload", form, {
      headers: {
        ...formHeaders,
      },
    })
    .then((response) => (holdURL = response.data.image_url))
    .catch((error) =>
        // If there is an error, show what URL we inputted and also the correct URL that we are supposed to put:
      console.log(
        "ERROR! Can't connect to " +
          error.config.url +
          ". The correct upload link is http://34.71.171.250/upload"
      )
    );
}

// Here we call our function to upload our link and to get holdURL to collect it:
microservice_call(form);

// App.get hosts the holdURL. When a call is made to here it will send the holdURL out. Our React frontend will make the call to 
// collect this variable so it can render the picture there:
app.get("/", async (req, res) => {
  console.log("farmed URL is: ", holdURL);
  res.send({ holdURL });
});

// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
