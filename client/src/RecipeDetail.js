import React from "react";
import { Link, useParams } from "react-router-dom";

function RecipeDetail(props) {
	const { recipeId } = useParams();
	const currRecipe = props.recipes.filter((recipe) => recipe._id === recipeId);
	const thisRecipe = { ...currRecipe[0] };
	console.log("currRecipe[0]", currRecipe[0]);

	return (
		<div>
			<img src={`/img/${thisRecipe.image}`} alt={thisRecipe.title} />
			<h1>{thisRecipe.title}</h1>
			<p>{thisRecipe.description}</p>
			<Link to="/">Home</Link>
		</div>
	);
}

export default RecipeDetail;
