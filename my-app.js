
//creating server

let express=require('express')
let app=express()
const { MongoClient, ObjectId } = require('mongodb');
const PORT = process.env.PORT || 3000;
//include javascript file

app.use(express.static('public'))
 app.use(express.json());
app.use(express.urlencoded({extended:false}))

//password protection 

 function passProtect(req,res,next){
    res.set('WWW-Authenticate','Basic realm="Simple App"')
    if(req.headers.authorization=='Basic cmFteWE6cGFzcw==' ){
        next()
    }
    else res.status(401).send("provide password and ID")
        
    }
 app.use(passProtect);

//Mongodb connection code

const dbString = process.env.MONGO_URI;
const dbName = "dbApp";
let db;
async function connectDB() {
    if (!dbString) {
        console.error("MONGO_URI not set");
        process.exit(1);
    }
    try {
        const client = new MongoClient(dbString);
        await client.connect();
        db = client.db(dbName);
        console.log("Connected to MongoDB");

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}
connectDB();



app.get('/', async (req,res)=>{
    if(!db) return res.status(503).send("Database not connected");
    try {
        const items = await db.collection('items').find().toArray();
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
      
        <button data-id=${item._id} class="edit-me" type="button">Edit</button>
        <button type="button" class="delete-me" data-id=${item._id}>Delete</button>
        </div>
       </li>`
  }).join('')}
  </ul>
  <script src="https://unpkg.com/axios@1.6.7/dist/axios.min.js"></script>
  <script src="/browser.js"> </script>
  </body>
  </html>`)} catch (err) {
        res.status(500).send("Error fetching items");
    }
});

app.post('/answer', function(req,res){
   
    db.collection('items').insertOne({text:req.body.answer},function(){
    
        res.redirect('/')
    

})})

//update post and delete post

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


