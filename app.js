const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");

//the following code has storage engine.destination of the file uploaded is uploads.
const storage = multer.diskStorage({
    destination: './public/uploads/' ,
    // the following function renames the file...this is to avoid overwrite errors.change if you wish to.
    filename : function(req,file,cb){
        cb(null,file.fieldname +'_'+Date.now()+path.extname(file.originalname));
    }
})

//initialise upload variable.
const upload = multer({
    storage: storage,
    //file size limit.in bytes
    limits:{fileSize: 10000000},
    //type of file or file filter...the function is defined below .single...
    fileFilter:function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myfile');
//check filetype function.
function checkFileType(file, cb){
    // allowed extensions.add more according to need.each divided with |...jpeg is for testing
    const filetypes =/pdf|jpeg|jpg/;
    //check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mimetype.for additional error free upload.
    const mimetype = filetypes.test(file.mimetype);


    if(mimetype && extname){
        return cb(null,true);
    }else {
        cb('error: invalid filetype!');
    }
}

//init app.
 const app= express();

 //EJS view engine
app.set("view engine","ejs");

//public folder.this is the folder in witch uploads will be present....
app.use(express.static('./public'));
//the index is the ejs file which contain the uploader template and all...

 app.get('/', (req,res) => res.render('index'));
//the following code handles the upload.upon completion of a successful upload.
//the console will give out details of the file which can be used to connect the file to database.
 app.post('/upload',(req,res) =>{
  upload(req,res,(err) => {
     if(err){
         res.render('index',{
             msg: err
         });
     }else {
         //this following code prints file info in the console.
         console.log(req.file);
         res.send('uploaded');
     }
  });
 });
// nodemon port set to port 3000 change if you want to.
 const port=3000;

 app.listen(port, () => console.log('server started on port 3000'));
