import React from "react";
import Recipe from "./Recipe";
import FormCreateRecipe from "./FormCreateRecipe";

function Recipes({ recipes, loggedin, addRecipe }) {
	return (
		<section>
			{loggedin && <FormCreateRecipe addRecipe={addRecipe} />}
			{recipes.map((recipe) => (
				<Recipe key={recipe._id} recipe={recipe} />
			))}
		</section>
	);
}

export default Recipes;
