const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const recipeControllers = require("./api/recipe.controllers");

const app = express();
const dataBaseURL = process.env.DATABASE;

app.use(express.static("static"));
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	next();
});

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/static/index.html");
});

app.get("/api/recipes", recipeControllers.findAll);
app.get("/api/recipes/:id", recipeControllers.findById);
app.post("/api/recipes", recipeControllers.add);
app.put("/api/recipes/:id", recipeControllers.update);
app.delete("/api/recipes/:id", recipeControllers.delete);
app.get("/api/import", recipeControllers.import);
app.get("/api/killall", recipeControllers.killall);
app.post("/api/upload", recipeControllers.upload);

mongoose
	.connect(dataBaseURL, {})
	.then(() => console.log("MongoDb connected"))
	.catch((err) => console.log(err));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
