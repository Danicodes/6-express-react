import React from "react";
import Recipes from "./Recipes";
import RecipeDetail from "./RecipeDetail";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useToggle from "./hooks/useToggle";
import { useFetch } from "./hooks/useFetch";
import Nav from "./Nav";

function App() {
	const [recipes, setRecipes] = React.useState([]);
	const [loggedin, setLoggedin] = useToggle(false);
	const [loading, setLoading] = useToggle(false);
	const [error, setError] = React.useState("");

	const { get, post } = useFetch("/api/recipes");
	const addRecipe = (recipe) => {
		post("/api/recipes", recipe).then((data) => setRecipes([...recipes, data]));
	};

	if (loading === true) {
		return <p>Loading</p>;
	}

	if (error) {
		return <p>{error}</p>;
	}

	return (
		<main>
			<BrowserRouter>
				<Nav setLoggedin={setLoggedin} loggedin={loggedin} />
				<Routes>
					<Route
						path="/"
						element={
							<Recipes
								recipes={recipes}
								loggedin={loggedin}
								addRecipe={addRecipe}
							/>
						}
					/>
					<Route
						path="/:recipeId"
						element={<RecipeDetail recipes={recipes}></RecipeDetail>}
					></Route>
				</Routes>
			</BrowserRouter>
		</main>
	);
}

export default App;
