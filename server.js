if(process.env.NODE_ENV!=='production'){
    require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const expressLayout =require('express-ejs-layouts');
const port = 3000||process.env.PORT;
const indexRouter =require('./routes/index');


app.set('view engine','ejs');
app.set('views',__dirname+'/views');
app.set('layouts','layouts/layout');

app.use('/', indexRouter);
app.use(expressLayout);
app.use(express.static('public'));

mongoose.connect(process.env.DATABASE_URL, 
    {useNewUrlParser: true, useUnifiedTopology: true});
const db =mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("MongDB connected");
});
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port port!`));