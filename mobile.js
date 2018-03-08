const express = require("express");
const bodyParser = require("body-parser");
const mobile = express();
const mongoose = require( "mongoose" );
const fileUpload = require('express-fileupload');
/*
	configuration of express and body parser and mongoose
*/

mobile.use( bodyParser.urlencoded( {extended : false} ) );
mobile.use( bodyParser.json() );
mobile.set( "view engine", "ejs" );
mobile.use( express.static( "public" ) );	
mobile.use(fileUpload());
mongoose.connect( "mongodb://localhost/mobile" );






/*
	checking if connection is working or not
*/
mongoose.connection.on( "error", console.error.bind(console, 'connection error:') )
/*
creating post schema
*/
var mobilePostSchema = mongoose.Schema({
	model : String,
	brand : String,
	weight : String,
	os : String,
	sim : String,
	camera : String,
	net : String,
	color : String,
	comment : String,
	path : String
	
});

// creating signup information

var signupInfoschema = mongoose.Schema({
	email: String,
	password : String
});

var signupInfo = mongoose.model( "user", signupInfoschema );

/*
	modeling the schema
*/
var mobilePost = mongoose.model( "mobilePost", mobilePostSchema );

/*
	all data for the rendering pages
*/
let AllData = {
	mobileList : [],
	header : "Wellcome to my First Nodejs app.",
	shoar : "Good luck to everyone.",
	title : "Best Group",
	defaultColor : "black"
}
mobilePost.find({}, (err, data)=>{
	if(err === null) AllData.mobileList = data;
})
/*
	let's get the index page
*/
mobile.get( "/", (req, res)=>{



	res.render( "index", AllData );
} );


mobile.get( "/Login", (req, res)=>{


	res.render( "Login", AllData );
	
} );

mobile.get( "/Register", (req, res)=>{


	res.render( "register", AllData );
	
} );

mobile.get( "/compare", (req, res)=>{
	let compareData = {
		compareList : [],
		header : "Wellcome to my First Nodejs app.",
		shoar : "Good luck to everyone.",
		title : "Best Group",
		defaultColor : "black"
	}
	


var compareList=[];
	for(mob of AllData.mobileList) { 
		for(var i=0;i<=2;i++){
			if(mob.id == req.query.c[i]){
				var mobile = ({
					model : mob.model,
					brand : mob.brand,
					weight : mob.weight,
					os : mob.os,
					sim : mob.sim,
					camera : mob.camera,	
					net : mob.net,
					color : mob.color,
					comment : mob.comment,
					path : mob.path
					
					});
				compareData.compareList.push(mobile);
			}
		}
		

	  } 

	console.log( compareList);


	res.render( "compare", compareData );
} );
/*
	let's get the single post view page
*/
mobile.get( "/single/:postId", (req, res)=>{
	// find post by entered id
	let getSinglePost = postId => {
		for( post of AllData.mobileList )
			if( post.id == postId )
				return post;

		return false;
	}

	let singlePostData = getSinglePost( req.params.postId )

	if( !singlePostData ) res.send( "404.. post not found" );

	let singleData = {
		header : AllData.header,
		title : AllData.title,
		shoar : AllData.shoar,
		defaultColor : AllData.defaultColor,
	}

console.log( singlePostData );


	res.render( "post/single", singleData );
} );
/*
	handling the post submition for new post
*/
mobile.post( "/", (req, res)=>{

// /uploadFile


	if (!req.files)
	  return res.status(400).send('No files were uploaded.');
   
	// The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
	let sampleFile = req.files.upfile;
	console.log(sampleFile);

	// Use the mv() method to place the file somewhere on your server
	
	sampleFile.mv('./public/uploads/'+sampleFile.name, function(err) {
		
	//   if (err != null){
	// 	return res.status(500).send(err);
	//   }
   
		let newData = {
				model : req.body.model,
				brand : req.body.brand,
				weight : req.body.weight,
				os : req.body.os,
				sim : req.body.sim,
				camera : req.body.camera,
				net : req.body.net,
				color : req.body.color,
				comment : req.body.comment,
				path : '/uploads/'+sampleFile.name
		}


		mobilePost.create( newData, (err, data) => {
			if( err === null ) 
			{
				AllData.mobileList.push( data );
				res.redirect( "/" );
				
			}
		} )

	//   res.send('File uploaded!');
	//   console.log("uploaded");
	});
  
  


} );
// signup
mobile.post( "/signup", (req, res)=>{
console.log( req );
let newuser= {
	email: req.body.email,
	password: req.body.password
}
signupInfo.create( newuser, (err, data) => {
	if( err === null ) 
		{
			
	     res.redirect( "/" );
			
		}else{
			alert("error");
		}
} )

});

// login

mobile.post( "/login", (req, res)=>{
	
	
	signupInfo.find( { email : req.body.email }, (err, data) => {
		console.log(req.body);
		console.log(data);
		if( err === null ) 
			{
			if(data[0].password == req.body.password)
			 res.redirect( "/" );
			else{
				console.log("passerror");
                res.redirect( "/404" );
			}	
		}else{
			console.log("error");
            res.redirect( "/404" );
			}
	} )	
	});
function findPostId()
{
	return AllData.mobileList.length + 1  ;
}



mobile.listen( 8080, _=> console.log( "mobile server is online." ) );