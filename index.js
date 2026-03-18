const express = require ("express");
const api = require("./Api.js");
const app = express();
const port = 3000;

app.set('view engine', 'ejs');


app.get('/', (req, res) => { 
    res.render('home', { name: 'Dr. Horn' }, function (err,html) {
        if (err) {/* handle error here */}
        res.send(html);
    }); 
});


app.use("/api", api);



app.listen(port, function () {
  console.log(`Recipe app listening on port ${port}!`);
});
