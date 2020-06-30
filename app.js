var express=require("express");
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var request=require("request");
var methodOverride=require("method-override");
mongoose.connect("mongodb://localhost:27017/covid19",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.set("view engine","ejs");

// Schema setup
var reportScehma= new mongoose.Schema({
 name:{
    type: String,
    required: true
},
 age:{
    type: String,
    required: true
},
 state:{
    type: String,
    required: true
},
 city:{
    type: String,
    required: true
}
});
 var Report=mongoose.model("Report",reportScehma);
  // data create into the DB
 /*Report.create({
    
    name:"Rohit" , 
    age:17,
    state:"Madhey pradesh" ,
    city:"bhopal"
    
 },function(err,data){
 if(err)
 {
     console.log(err);
 }
 else
 {
     console.log("newly data created");
     console.log(data);
 }

 });
 */
// get -->show value searhced
app.get("/",function(req,res)
{
    request("https://api.covid19api.com/summary",function(error,response,body){
     
      if(!error  && response.statusCode==200)
      {
          var data=JSON.parse(body);
        res.render("landing",{data:data});    
        //res.send(data);
      }
 });
});
//  Index route- show all pateint details
app.get("/report",function(req,res){
 //  displaying the data inside the DB
 Report.find({},function(err,data){
   if(err)
   {
       console.log(err);
   }
   else
   {
    res.render("report",{report:data});
   }

 });


});
// create route - add new pateint details in DB
app.post("/report",function(req,res){
    // get data form and add to new covid19 patient details
    var name=req.body.name;
    var age=req.body.age;
    var state=req.body.state; 
    var city=req.body.city;
    var newreport={name:name , age:age , state:state, city:city};
    // create a new report and save to DB
    Report.create(newreport,function(err,data){
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.redirect("/report");
        }
     
      });
    // redirect back to report page
    
});

// new route -show form to create new pateint details
app.get("/report/new",function(req,res){
 res.render("new");
});

// search route: find data by id 
app.get("/report/search",function(req,res){
Report.find({$or:[{name:{'$regex':req.query.dsearch}},{state:{'$regex':req.query.dsearch}}]},function(err,data){
    if(err)
    {
        console.log(err);
        
    }
    else
    {
        res.render("report",{report:data});  
    }
});
});

// edit route
app.get("/report/:id/edit",function(req,res){
    Report.findById(req.params.id,function(err,foundreport){
    if(err)
    {
        res.redirect("/report");
    }
    else
    {
        res.render("edit",{report:foundreport});
    }
    });
});
// update route
app.put("/report/:id",function(req,res){

    Report.findByIdAndUpdate(req.params.id,req.body.report,function(err,updateData)
    {
            if(err)
            {
                res.redirect("/report");
            }
            else
            {
                res.redirect("/report");
            }
    });
});

// delete route
app.delete("/report/:id",function(req,res){

Report.findByIdAndRemove(req.params.id,function(err){
       if(err)
       {
           res.redirect("/report");
       }
       else
       {
        res.redirect("/report");

       }
});
});
app.listen(9009,function(){
    console.log("the covid19 tracker server has started!!"); 
 });