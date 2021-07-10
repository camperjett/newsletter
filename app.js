const express = require("express")
const request = require("request")
const bodyParser = require("body-parser")
const https = require("https")

const app = express();

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is up at port 3000.")
})

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res){
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const email = req.body.email

  console.log(firstName + " " + lastName + " " + email);

  //  Let create a new js object k/a newData
  const newData = {
    members: [  //  members is an array of objects aka the new members.
                //  max possible number of new members in each api call 500
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }
  //  In order to send the data, we need to first make it JSON type...
  const jsonData = JSON.stringify(newData);
  const url = "https://us6.api.mailchimp.com/3.0/lists/34317ee2e3";
  const options = {
    method: "POST",
    auth: 'camperjett:4e9d5b22f8d80b9e8360aaf67f75241b-us6'
  };

  const requestForSubs = https.request(url, options, function(response){
    // response.on("data", function(data){
    //   console.log(JSON.parse(data));
    // })
    console.log(response.statusCode);
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });
  //  Writing onto the request
  requestForSubs.write(jsonData);
  requestForSubs.end();
})

app.post("/failure", function(reqf, resf){
  resf.redirect("/");
})
//  mail chimp api key
//  4e9d5b22f8d80b9e8360aaf67f75241b-us6
//  list id
//  34317ee2e3
