
var finalData = {}

window.onload = function () {

  getImagesFromServer()
  getTree()
    //get user image for uploading
    document.getElementById("userImage").onchange = function () {
        let fileName = document.getElementById("userImage").value;
        document.getElementById('userImageLabel').innerHTML = fileName;
    }
    FilePond.registerPlugin(FilePondPluginImagePreview);
    const pond = FilePond.create(
        document.getElementById('userImage')
    );
    FilePond.setOptions({
        server: {
            fetch: null,
            revert: null,
            process: 'uploadImage/'
        }
    });
    pond.on('processfile', (error, file) => {
      if (error) {
          console.log('Oh no');
          return;
      }
      insertData(file.source.name)
      console.log('File added', file);
      getImagesFromServer()
  });

}

function getPostPage(s){

  let req = new XMLHttpRequest();
  console.log("getting new page",s.src)
  //let payload = {longUrl:null};
  //payload.longUrl = document.getElementById('longUrl').value;
  req.open('GET', `/photoClick?name=${s.name}`, true);
  //req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load',function(){
    if(req.status >= 200 && req.status < 400){
      console.log(req.response)
      let newHTML = document.open("text/html", "replace"); 
      newHTML.write(req.responseText); 
      newHTML.close(); 
    } else {
      console.log("Error in network request: " + req.statusText);
    }});
  req.send();

}

function getImagesFromServer(){

  let req = new XMLHttpRequest();
  //let payload = {longUrl:null};
  //payload.longUrl = document.getElementById('longUrl').value;
  req.open('GET', `/getImageURLs`, true);
  //req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load',function(){
    if(req.status >= 200 && req.status < 400){
      console.log(req.response)

      function getRandomSize(min, max) {
        return Math.round(Math.random() * (max - min) + min);
      }
      
      let allImages = "";
      
      for (let i of JSON.parse(req.response)) {
        let width = getRandomSize(200, 400);
        let height =  getRandomSize(200, 400);
        //allImages += '<div class= "blurRemover"><img  src="https://placekitten.com/'+width+'/'+height+'" alt="pretty kitty" title="Click here!"></div>';
        allImages += `<div class= "blurRemover"><img  name= "${i}" src="/images/${i}" alt="" title="Click here!" onclick="getPostPage(this)"></div>`;
      }
      
      document.getElementById("photos").innerHTML = allImages

    } else {
      console.log("Error in network request: " + req.statusText);
    }});
  req.send();

}

function insertData(s) {

  let paramString = `?value=${s}&id=${finalData[null]}`

  let req = new XMLHttpRequest();
  console.log(paramString)
  //let payload = {longUrl:null};
  //payload.longUrl = document.getElementById('longUrl').value;
  req.open('GET', `/insertData${paramString}`, true);
  //req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load',function(){
    if(req.status >= 200 && req.status < 400){
      
      console.log("done")
      getImagesFromServer()
      //document.getElementById('originalUrl').textContent = response.longUrl;
      //document.getElementById('shortUrl').textContent = response.id;
    } else {
      console.log("Error in network request: " + req.statusText);
    }});
  req.send();

}


function getTree(){
  
  let req = new XMLHttpRequest();
  console.log('test')
  //let payload = {longUrl:null};
  //payload.longUrl = document.getElementById('longUrl').value;
  req.open('GET', `/getData`, true);
  //req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load',function(){
    if(req.status >= 200 && req.status < 400){
      let data = JSON.parse(req.responseText);

      for (let j = 0; j < data.length; j ++){
        console.log(data[j])
        finalData[data[j]['parent_id']] = data[j]['id']
        //finalData[data[j]['parentId']] = data[j]['parent_id']

      }

    } else {
      console.log("Error in network request: " + req.statusText);
    }});
  req.send();
  
}

