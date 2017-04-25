var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");

var app = express();  // make express app
var server = require('http').createServer(app);

// set up the view engine
app.set("views", path.resolve(__dirname, "views")); // path to views
app.set('view engine', 'ejs');
// End of view engine setup


// set up the logger 
//only log error responses
app.use(logger("dev"));

// End of logger
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname+'/assets/')));
// GETS
app.get("/", function(req,res){
	res.render("index");
});

app.get("/contact", function(req,res){
	res.render("contact");
});
// ENd of GET request handling

// POSTS
app.post("/contact",function(req,res){

  var api_key = 'key-9acbf68e9b57c1c89a311ae7013c6dff'; // replace with your API KEY Value
  var domain = 'sandboxbfc7a6e3f15740278937f9c06f04013c.mailgun.org'; // replace with your domain
  var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
   
  var data = {
    from: 'Mail Gun TutsDaddy <postmaster@sandboxbfc7a6e3f15740278937f9c06f04013c.mailgun.org>', //replace with your SMTP Login ID
    to: 'md.hussain.dg@gmail.com', // enter email Id to which email notification has to come. 
    subject: req.body.userName+" Sent you a message", //Subject Line
    html: "<b style='color:green'>Message: </b>"+req.body.body //Subject Body
  };
   
  mailgun.messages().send(data, function (error, body) {
    console.log(body);
    if(!error)
      res.send("Mail Sent");
    else
      res.send("Mail not sent <br/>Error Message : "+error);
  });

});

// 404
app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});	
//End of 404 error handling

// Listen for an application request on port 8081
server.listen(8081, function () {
  console.log('Nodejs app listening on http://127.0.0.1:8081/');
});