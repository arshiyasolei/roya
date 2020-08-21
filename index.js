let mysql = require('mysql');
let Mustache = require("Mustache");
let fs = require('fs');

let pool = mysql.createPool({
  connectionLimit : 50,
  host            : 'localhost',
  user            : 'root',
  password        : 'testtest',
  database        : 'roya'
});

const express = require('express')
const fileUpload = require('express-fileupload');
const app = express()
const port = 1212
app.use(express.static('frontEndScripts'))
app.use("/images",express.static('images'));
app.use(express.json())
app.use(fileUpload())
app.use(express.static('views'));

app.get('/resetTable',function(req,res,next){
  let context = {};
  pool.query("DROP TABLE IF EXISTS category", function(err){ //replace your connection pool with the your variable containing the connection pool
    let createString = `CREATE TABLE category (
      id int(10) unsigned NOT NULL AUTO_INCREMENT,
      title varchar(255) NOT NULL,
      parent_id int(10) unsigned DEFAULT NULL,
      PRIMARY KEY (id),
      FOREIGN KEY (parent_id) REFERENCES category (id) 
        ON DELETE CASCADE ON UPDATE CASCADE
    );`
    pool.query(createString, function(err){
      
      res.send("done reseting table");
    })
  });
});

app.get('/', (req, res) => res.sendFile('index.html') )

app.post('/uploadImage', function (req,res) {
    
    console.log(req.files)
    fs.writeFile("images/" + req.files.filepond.name, req.files.filepond.data, 'binary', function(err) {
        if(err)
          console.log(err);
        else
          console.log("The file was saved!");
      }); 
      res.send("done!")

});

app.get('/insertData', function (req, res) {
    // gets user input requests using AJAX
    console.log(req.query.id)
    pool.query(`INSERT INTO category(title,parent_id) VALUES( ? , ${req.query.id}) `, [req.query.value] ,function(err, result){
      if(err){
        console.log(err)
        return;
      }
      console.log(result)
      res.send("inserted")
    });

  });

app.get('/photoClick', function (req, res) {

  //console.log(Mustache.render(f, {imgs:req.query.name}))
  fs.readFile('./views/photoPage.html', function (err, html) {
    console.log(html)
    res.send( Mustache.render(html.toString(), {imgs:req.query.name, name:req.query.name}) )
  });


  });

  app.get('/getImageURLs', function (req, res) {
    // gets user input requests using AJAX
    const testFolder = './images';
    let fileArr = []
    fs.readdir(testFolder, (err, files) => {
      files.forEach(file => {
        fileArr.push(file)
      });
      res.send(fileArr)
    });

  });


app.get('updateData', function (req, res) {
  let context = {};

  pool.query("SELECT * FROM workouts WHERE id = ?", [req.query.id], function(err, result){
    if(err){
      console.log(err)
      return;
    }

    if(result.length == 1){
      let curVals = result[0];

      //(id,name,reps,weight,date,lbs)
      pool.query("UPDATE workouts SET name=?, reps=?, weight=? ,date=?, lbs=? WHERE id=? ",
        [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs, req.query.id],
        function(err, result){
        if(err){
          console.log(err)
          return;
        }
        res.send("done")

      });
    }
  });
});

app.get('deleteNode', function (req, res) {
    // gets user input requests using AJAX
    // gets user input requests using AJAX

    pool.query(`BEGIN;
    UPDATE category 
    SET 
        parent_id = 7 
    WHERE 
        parent_id = 5;
    
    DELETE FROM category 
    WHERE 
        id = 8;
    
    COMMIT;`, [req.query.pid,req.query.pid,req.query.id], function(err, result){
      if(err){
        return;
      }
    });
    
    res.send('Render posts!');
});



app.get('/getData', function (req, res) {

    let context = {};
    //let d_final = `${d.getMonth()}-${d.getDay()}-${d.getUTCFullYear()}`
    let q = `SELECT * FROM category;`
    pool.query(q, function(err, rows, fields){
      if(err){
        return;
      }

      console.log("got rows!")
      res.send(rows);
    });
});

app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(port, () => console.log(`app listening at http://localhost:${port}`))