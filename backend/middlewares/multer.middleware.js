const multer=require("multer")
let myStorage=multer.diskStorage(
    {
        destination:function(req,file,cb){
            cb(null,"public/temp")
        },
        filename:function(req,file,cb){
            // cb(null,file.originalname);   // it save the file with original name
            cb(null,Date.now()+"-"+file.originalname);

        },
    }
);

const upload=multer({storage:myStorage})

module.exports=upload;