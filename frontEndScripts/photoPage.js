
var finalData = {}
var finalData1 = {}
window.onload = function () {
    //create the table
    
    getTree()
    document.getElementById("userImage").onchange = function () {
        let fileName = document.getElementById("userImage").value;
        document.getElementById('userImageLabel').innerHTML = fileName;
    }


}

function upload(){

    
}


function insertData() {

    let paramString = `?value=${document.getElementById('u1').value}&id=${document.getElementById('u2').value}`

    let req = new XMLHttpRequest();
    console.log(paramString)
    //let payload = {longUrl:null};
    //payload.longUrl = document.getElementById('longUrl').value;
    req.open('GET', `/insertData${paramString}`, true);
    //req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        
        console.log("done")
        getTree();
        //document.getElementById('originalUrl').textContent = response.longUrl;
        //document.getElementById('shortUrl').textContent = response.id;
      } else {
        console.log("Error in network request: " + req.statusText);
      }});
    req.send();
    event.preventDefault();
}

function deleteData(j){
  return function() {
  let req = new XMLHttpRequest();
  //let payload = {longUrl:null};
  //payload.longUrl = document.getElementById('longUrl').value;
  req.open('GET', `/deleteData?id=${document.getElementById(`row_id_${j}`).innerText}`, true);
  //req.setRequestHeader('Content-Type', 'application/json');
  req.addEventListener('load',function(){
    if(req.status >= 200 && req.status < 400){
      
      console.log("done")
      get_workouts();
      //document.getElementById('originalUrl').textContent = response.longUrl;
      //document.getElementById('shortUrl').textContent = response.id;
    } else {
      console.log("Error in network request: " + req.statusText);
    }});
  req.send();
  event.preventDefault();
  }
}

function updateData(j){
    return function(){
    
    console.log(j)
    let paramString = `?id=${document.getElementById(`row_id_${j}`).innerHTML}&`
    for (let x of arr){
      if (x === "date"){
        if (document.getElementById(`date_${j}`).value === ""){
          paramString += `${x}=%20&`
        } else {
          paramString += `${x}=${document.getElementById(`date_${j}`).value}&`
        }
      } else {
      console.log(document.getElementById(`${x}_${j}`))
      if (document.getElementById(`${x}_${j}`).innerHTML === ""){
        paramString += `${x}=%20&`
      } else {
        paramString += `${x}=${document.getElementById(`${x}_${j}`).innerHTML}&`
      }
    }
    }
    let req = new XMLHttpRequest();
    console.log(paramString)
    //let payload = {longUrl:null};
    //payload.longUrl = document.getElementById('longUrl').value;
    req.open('GET', `/updateData${paramString}`, true);
    //req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        console.log("done")
        get_workouts();
        //document.getElementById('originalUrl').textContent = response.longUrl;
        //document.getElementById('shortUrl').textContent = response.id;
      } else {
        console.log("Error in network request: " + req.statusText);
      }});
    req.send();
    event.preventDefault();
    }
}


function createTree(root,newId){
  
  let stack = [root]
  
  while (stack.length) {      
    let curr = stack.pop()
    console.log("median",curr)
    //create element here
    let n;
    if (curr.parentId === newId){
    n = document.getElementById(newId);

    } else {
      //n = document.createElement("div");
      //n.className = "list-group collapse"
      //n.id = curr.id
      //console.log(curr.parentId)
      //document.getElementById(curr.parentId).appendChild(n)
      n = document.getElementById("t" + curr.parentId);
    }

    let alink = document.createElement("a")
    alink.href = `#t${curr.id}`
    alink.className = "list-group-item"
    alink.setAttribute("data-toggle", "collapse");
    let b = document.createElement("i")
    b.className = "fas fa-angle-right mr-2"
    
    alink.appendChild(b)
    alink.appendChild(document.createTextNode(finalData1[curr.id]))
    
    n.appendChild(alink)
    //b.id = curr.id
    
    //alink.innerText += finalData[curr.id]

    let divi = document.createElement("div");
    divi.className = "list-group collapse"
    divi.id = "t" + curr.id
    n.appendChild(divi)
    //console.log(n,curr.parentId,finalData[curr.id])
    //console.log(document.getElementById(curr.parentId))
 
    if (curr.children){
      for (let x of curr.children) {
        if (x) {
          stack.push(x)
        }
      }
    }
  }
  $(function() {
      
    $('.list-group-item').on('click', function() {
      console.log("azan")
      $('.fas', this)
        .toggleClass('fa-angle-right')
        .toggleClass('fa-angle-down');
    });
  
  });
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
      
      let tree = [];
      for (let j = 0; j < data.length; j ++){
        // let head_tr = document.createElement("tr");
        // //console.log(j.job , j.status)
        // for (let p in data[j]) {
        //   let td;
        tree.push({id :data[j]['id'] , parentId: data[j]['parent_id']} )
        finalData[data[j]['title']] = data[j]['id']
        finalData1[data[j]['id']] = data[j]['title']
        //finalData[data[j]['parentId']] = data[j]['parent_id']

        //   td = document.createElement("td");
        //   td.contentEditable = true;
        //   td.id = `${p}_${j}`
        //   td.appendChild(document.createTextNode(`${data[j][p]}`));
        
        //   head_tr.appendChild(td)
        // }

        // let anotherTd2 = document.createElement("td");
        // let remove = document.createElement("button");
        // remove.className = "btn btn-primary"
        // remove.innerText = "Remove row"
        // head_tr.appendChild(anotherTd2)
        // remove.onclick = delete_workout(j)
        // anotherTd2.appendChild(remove);
        //th.style.border = '1px solid black';
        //table.appendChild(head_tr)

      }
      const idMapping = tree.reduce((acc, el, i) => {
        acc[el.id] = i;
        return acc;
      }, {});
      let root;
      console.log(finalData,idMapping,tree)
      
      tree.forEach(el => {
        // Handle the root element
        if (el.parentId === null) {
          root = el;
          return;
        }
        // Use our mapping to locate the parent element in our data array
        const parentEl = tree[idMapping[el.parentId]];
        // Add our current el to its parent's `children` array
        parentEl.children = [...(parentEl.children || []), el];
      });
      console.log("root",root)
      for (let f of root.children){
        //console.log("yes,",document.getElementById("rootImage").name , finalData[document.getElementById("rootImage").name])
          if (f.id === finalData[document.getElementById("rootImage").name] ){
            console.log("yes,",document.getElementById("rootImage").name)
            if (document.getElementById('t') ) {
                document.getElementById('t').id = root.id
            } else {
                document.getElementById(root.id).innerHTML = ""
            }
            createTree(f,root.id)
          }
      }
      //document.getElementById('originalUrl').textContent = response.longUrl;
      //document.getElementById('shortUrl').textContent = response.id;
    } else {
      console.log("Error in network request: " + req.statusText);
    }});
  req.send();
  
}