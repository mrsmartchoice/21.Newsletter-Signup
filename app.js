// Jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { dirname } = require("path");

const app = express();
const port = 3003;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed", // Change to lowercase
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us11.api.mailchimp.com/3.0/lists/3307a81460";
    const options = {
        method: "POST",
        auth: "eldnight:fa92a945193ea395d40a58e5334a6a79-us11"
    };

    const request2 = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html"); // Show success page if the request was successful
        } else {
            res.sendFile(__dirname + "/failure.html"); // Show failure page if there was an error
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request2.write(jsonData);
    request2.end();
});

app.post("/failure", function (req, res){
    res.redirect("/")
});

app.listen(process.env.PORT || port, function () {
    console.log(`The server started at port ${port}`);
});

// API KEY = fa92a945193ea395d40a58e5334a6a79-us11
// list ID = 3307a81460
