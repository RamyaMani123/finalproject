
//creating server

let express=require('express')
let app=express()
let mongodb=require('mongodb')
let db=null
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
// let port=process.env.PORT
// if(port==null||port==""){
//     port=3000
// }
const port = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use(express.static('public'))

const MongoClient=mongodb.MongoClient;
var dbString=process.env.MONGO_URL;

var dbString="mongodb+srv://RamyaMani:123123123@cluster0.jion7hv.mongodb.net/"
var dbName="dbApp";
// app.listen();
// app.listen(PORT)
MongoClient.connect(dbString,{useNewUrlParser:true},function(err,client){
    if (err){
        throw err;
    }
    db=client.db(dbName)
    

})

app.use(express.urlencoded({extended:false}))
 app.use(express.json());
//password protection
 function passProtect(req,res,next){
    res.set('WWW-Authenticate','Basic realm="Simple App"')
    if(req.headers.authorization=='Basic cmFteWE6cGFzcw==' ){
        next()
    }

        else{
            res.status(401).send("provide password and ID")
        }
    }
 app.use(passProtect)
app.get('/',  function(req,res)

{
     db.collection('items').find().toArray(function (err,items ) {
       // console.log(items)
    
    res.send(`
        <html>
        <head>
        <title> Name List</title>
        </head>
        <body>
        <h1> Adding Names </h1>
        <div>
        <form action = '/answer' method='POST'>
            <input name="answer"  type="text" autoComplete='off' required></input>
            <button> submit </button>
        </form>
</div>
        <h2>Name List</h2>
  <ul class="list-group">
  
  ${items.map(function(item){

  return`
    <li class="list-group-item" >
    <span class="list-item">${item.text}</span>
      <div>
      
        <button data-id=${item._id} class="edit-me" type="submit">Edit</button>
        <button type="submit" class="delete-me" data-id=${item._id}>Delete</button>
        </div>
       </li>`
  }).join('')}
  </ul>
  <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
  <script src="/browser.js"> </script>
  </body>
  </html>`)
    
  })})

app.post('/answer', function(req,res){
   
    db.collection('items').insertOne({text:req.body.answer},function(){
    
        res.redirect('/')
    

})})
app.post('/update-item', function(req,res){
    console.log(req.body.text)
    db.collection('items').findOneAndUpdate({_id:new mongodb.ObjectId(req.body.id)},{$set:{text:req.body.text}},function(){
res.send("data updated")
    })
})
app.post('/delete-item', function(req,res){
    console.log(req.body.text)
    db.collection('items').deleteOne({_id:new mongodb.ObjectId(req.body.id)},function(){
        res.send('data deleted')

        
    })
})
    

   

    

