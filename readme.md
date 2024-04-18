# Express and React

## Assignment

Customize the backend and client work with your own content to create a full stack website.
Edit the schema to conform to you content.
Edit the client to display any content that you add.

- CRUD operations are optional
- CSS and design are optional

## Reading

You should have read and stepped through the [useState](https://reactjs.org/docs/hooks-state.html) and [useEffect](https://reactjs.org/docs/hooks-effect.html) documentation. Use Code Sandbox to examine the code samples.

Read:

- [Building Your Own Hooks](https://reactjs.org/docs/hooks-custom.html)
- [useContext](https://reactjs.org/docs/context.html)

## Exercise: React Front End

Clone this repo into your projects folder and cd into it.

Remove the `.git` directory with `rm -rf .git`.

### Backend

- cd into the backend,
- initialize it as a git repo,
- NPM install all dependencies,
- start Docker and run `docker run --name recipes-mongo -dit -p 27017:27017 --rm mongo:4.4.1`
- start the backend: `npm run dev`
- test by visiting localhost on port 3456.

Note the scripts in package.json:

```js
"scripts": {
  "start": "NODE_ENV=production node server.js",
  "dev": "NODE_ENV=development nodemon server.js"
},
```

Note the following in server.js:

```js
if (process.env.NODE_ENV === "production") {
  require("dotenv").config();
}
```

## Environment Variables

<!-- `DATABASE=mongodb+srv://daniel:dd2345@cluster0.bs2la.mongodb.net/recipes?retryWrites=true&w=majority` -->

Go to [MongoDb](https://www.mongodb.com) and sign in to your account. Find the Cluster you created and click on 'Connect' to get the connection string.

Replace the database variable in `backend/.env.sample` with your own and rename the file to `.env`. Review the Database Access and Network Access settings on MongoDb. Check to ensure that your IP address settings are current or set to 'all.'

Ensure that your local DB is running:

`docker run --name recipes-mongo -dit -p 27017:27017 --rm mongo:4.4.1`

npm install and run `npm run dev` to test. You should see the vanilla js site we constructed. Be sure to test the `/api/recipes` endpoint as well.

Note: install a JSON formatter for your browser.

[Chrome](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa) or use [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/).

## Create a React Project

cd into _the top level_ of the project directory and run Create React App:

`npx create-react-app client`

CD into the client folder and remove the contents of the src folder and create an initial index.js file:

```sh
$ cd client
$ rm src/*
$ touch src/index.js
```

in `client/.vscode/settings.json`:

```js
{
  "workbench.colorCustomizations": {
    "titleBar.activeForeground": "#fff",
    "titleBar.inactiveForeground": "#ffffffcc",
    "titleBar.activeBackground": "#235694",
    "titleBar.inactiveBackground": "#235694CC"
  }
}
```

Create a simple start page in `index.js`:

```js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
```

Set a [Proxy](https://create-react-app.dev/docs/proxying-api-requests-in-development/) in the React client package.json.

To use the Heroku app:

`"proxy": "https://recipes-do-not-delete.herokuapp.com/",`

To use your local db (make sure you start the backend using `npm run dev`)

`"proxy": "http://localhost:3456/",`

This will enable us to use 'fetch(`/api/recipes`)' instead of 'fetch(`http://localhost:3456/api/recipes`)'.

Create `App.js`:

```js
import React from "react";

function App() {
  const [recipes, setRecipes] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/recipes`)
      .then((response) => response.json())
      .then((data) => console.log(data));
  });

  return (
    <div>
      <p>Hello from App</p>
    </div>
  );
}

export default App;
```

Add some basic CSS:

```js
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
```

Add a new index.css file in src:

```css
body {
  max-width: 940px;
  margin: 0 auto;
  font-family: sans-serif;
  color: #333;
  background-color: #eee;
}

a {
  color: #007eb6;
}

main {
  padding: 1rem;
  background-color: #fff;
}

summary {
  margin: 1rem 0;
  border-bottom: 1px dotted #666;
}

img {
  max-width: 200px;
}

input,
textarea {
  font-size: 1rem;
  display: block;
  margin: 1rem;
  width: 90%;
  padding: 0.5rem;
  font-family: inherit;
}

label {
  margin: 1rem;
  padding: 0.5rem;
}

button {
  color: #fff;
  font-size: 1rem;
  padding: 0.5rem;
  margin: 0 1rem;
  background: #007eb6;
  border: none;
  border-radius: 3px;
}

button.delete {
  background: unset;
  margin: unset;
  border: none;
  padding: 0;
  color: #007eb6;
  cursor: pointer;
}
```

## Note: CORS

If you ever need to deal with [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), add the following middleware to `server.js`:

```js
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  next();
});
```

## Displaying Data

Use a Recipe component to display the recipes.

In `App.js`:

```js
import React from "react";

function App() {
  const [recipes, setRecipes] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/recipes`)
      .then((response) => response.json())
      .then((data) => setRecipes(data));
  }, []);

  return (
    <div>
      {recipes.map((recipe) => (
        <Recipe key={recipe._id} recipe={recipe} />
      ))}
    </div>
  );
}

function Recipe(props) {
  return <p>{props.recipe.title}</p>;
}

export default App;
```

Demo - the problem with not adding an empty dependency array:

```js
React.useEffect(() => {
  console.log(" useEffect running ");
  fetch(`/api/recipes`)
    .then((response) => response.json())
    .then((data) => setRecipes(data));
});
```

## Multiple Components

Breakout the Recipe component into a separate `src/Recipe.js` file:

```js
import React from "react";

function Recipe(props) {
  return <p>{props.recipe.title}</p>;
}

export default Recipe;
```

Import it and compose it in App.js and test.

Scaffold the Recipe component:

```js
import React from "react";

function Recipe({ recipe }) {
  const { title, year, description, image, _id } = recipe;
  return (
    <summary>
      <img src={`img/${image}`} alt={title} />
      <h3>
        <a href={_id}>{title}</a>
      </h3>
      <p>{description}</p>
      <small>Published: {year}</small>
    </summary>
  );
}

export default Recipe;
```

In preparation for the next steps, create two new components. We'll use these components in the next steps to explore routing.

A `Recipes` component:

```js
import React from "react";
import Recipe from "./Recipe";

function Recipes({ recipes }) {
  return (
    <summary>
      {recipes.map((recipe) => (
        <Recipe key={recipe._id} recipe={recipe} />
      ))}
    </summary>
  );
}

export default Recipes;
```

And a RecipeDetail component:

```js
import React from "react";

function RecipeDetail(props) {
  return (
    <details>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </details>
  );
}

export default RecipeDetail;
```

`App.js` imports and renders `Recipes.js`:

```js
import React from "react";
import Recipes from "./Recipes";

function App() {
  const [recipes, setRecipes] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/recipes`)
      .then((response) => response.json())
      .then((data) => setRecipes(data));
  }, []);

  return (
    <main>
      <Recipes recipes={recipes} />
    </main>
  );
}

export default App;
```

Demo - in Recipe.js:

<!-- prettier-ignore -->
```js
{ process.env.NODE_ENV === "production" ? "prod" : "dev" }
<small>
  You are running this application in <b>{process.env.NODE_ENV}</b> mode.
</small>;
```

## Client Side Routing

Up until this point, you have dealt with simple projects that do not require transitioning from one view to another. You have yet to work with Routing in React.

In SPAs, routing is the ability to move between different parts of an application when a user enters a URL or clicks an element without actually going to a new HTML document or refreshing the page.

We could build a "list / detail" type site without routing but it is important to have an introduction to it so that you can use it in larger projects.

To begin exploring client side routing we'll use the [React Router](https://reactrouter.com/web/guides/quick-start).

_Note_: be sure you are cd'd into the client directory before installing React related packages.

npm install the latest version of [react router](https://reactrouter.com/docs/en/v6) and import the router into App.

```sh
npm i react-router-dom
```

Begin configuring App.js for routing:

```js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Recipes from "./Recipes";
import RecipeDetail from "./RecipeDetail";

function App() {
  const [recipes, setRecipes] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/recipes`)
      .then((response) => response.json())
      .then((data) => setRecipes(data));
  }, []);

  return (
    <main>
      <BrowserRouter>
        <Recipes recipes={recipes} />
      </BrowserRouter>
    </main>
  );
}

export default App;
```

Add a Route:

```js
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Recipes recipes={recipes} />} />
  </Routes>
</BrowserRouter>
```

Add a second Route:

```js
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Recipes recipes={recipes} />} />
    <Route path="/:recipeId" element={<RecipeDetail recipes={recipes} />} />
  </Routes>
</BrowserRouter>
```

Use the router's Link component in `Recipe.js`:

```js
import React from "react";
import { Link } from "react-router-dom";

function Recipe({ recipe }) {
  const { title, year, description, image, _id } = recipe;
  return (
    <summary>
      <img src={`img/${image}`} alt={title} />
      <h3>
        <Link to={_id}>{title}</Link>
      </h3>
      <p>{description}</p>
      <small>Published: {year}</small>
    </summary>
  );
}

export default Recipe;
```

Check for browser refresh on the new route by watching the console.

Demo - note that the component renders twice. Try using an object instead of an array to initialize state:

`const [recipes, setRecipes] = React.useState({});`

Here is the entire App component:

```js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Recipes from "./Recipes";
import RecipeDetail from "./RecipeDetail";

function App() {
  const [recipes, setRecipes] = React.useState([]);

  React.useEffect(() => {
    fetch(`/api/recipes`)
      .then((response) => response.json())
      .then((data) => setRecipes(data));
  }, []);

  return (
    <main>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Recipes recipes={recipes} />} />
          <Route
            path="/:recipeId"
            element={<RecipeDetail recipes={recipes} />}
          />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
```

`App.js` imports and renders `Recipes.js` and renders either `Recipes.js` or `RecipesDetail.js` depending on the Route.

Edit the RecipeDetail component:

```js
import React from "react";
import { useParams } from "react-router-dom";

function RecipeDetail(props) {
  const { recipeId } = useParams();
  const currRecipe = props.recipes.filter((recipe) => recipe._id === recipeId);
  console.log("currRecipe[0]", currRecipe[0]);
  // const thisRecipe = { ...currRecipe[0] };
  // console.log(" thisRecipe ", thisRecipe);

  return (
    <div>
      <h2>{currRecipe[0].title}</h2>
    </div>
  );
}

export default RecipeDetail;
```

Note the use of filter above which returns an array. We can spread the array into a new variable and use `<h2>{thisRecipe.title}</h2>`.

## Recipe Detail

Add a 'Home' link to `RecipeDetail.js` and flesh out the return value:

```js
import React from "react";
import { Link, useParams } from "react-router-dom";

function RecipeDetail(props) {
  const { recipeId } = useParams();
  const currRecipe = props.recipes.filter((recipe) => recipe._id === recipeId);
  const thisRecipe = { ...currRecipe[0] };

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
```

## Custom Hooks

Building [custom Hooks](https://reactjs.org/docs/hooks-custom.html) lets you extract component logic into reusable functions.

<!-- Do this in a new branch. -->

<!-- Create Toggle.js, import it into App and render it. -->
<!--
```js
import React, { useState } from "react";

function Toggler() {
  const [isHappy, setIsHappy] = useState(true);
  const [isBanana, setIsBanana] = useState(true);

  const toggleIsHappy = () => {
    setIsHappy(!isHappy);
  };

  const toggleIsBanana = () => {
    setIsBanana(!isBanana);
  };

  return (
    <div>
      <h1 onClick={toggleIsHappy}>{isHappy ? "😄" : "😢"}</h1>
      <h1 onClick={toggleIsBanana}>{isBanana ? "🍌" : "👹"}</h1>
    </div>
  );
}

export default Toggler;
```

Test it. -->

Create a hooks directory and save this as useToggle.js:

```js
import { useState } from "react";

function useToggle(initialVal = false) {
  // call useState, "reserve piece of state"
  const [state, setState] = useState(initialVal);
  const toggle = () => {
    setState(!state);
  };
  // return piece of state AND a function to toggle it
  return [state, toggle];
}

export default useToggle;
```

Demo the hook with `Toggle.js` in `index.js`:

```js
import useToggle from "./hooks/useToggle";

function Toggler() {
  const [isHappy, toggleIsHappy] = useToggle(true);
  const [isBanana, toggleIsBanana] = useToggle(true);

  return (
    <div>
      <h1 onClick={toggleIsHappy}>{isHappy ? "😄" : "😢"}</h1>
      <h1 onClick={toggleIsBanana}>{isBanana ? "🍌" : "👹"}</h1>
    </div>
  );
}
```

<!-- Create a playground in `index.js` by commenting out the App import statement and add some test code:

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// import App from "./components/App";

const postIds = [1, 2, 3, 4, 5, 6, 7, 8];

function App() {
  const [index, setIndex] = React.useState(0);
  const [post, setPost] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/posts/${postIds[index]}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        console.warn(error.message);
        setError("error loading data");
        setLoading(false);
      });
  }, [index]);

  const incrementIndex = () => {
    setIndex((i) => (i === postIds.length - 1 ? i : i + 1));
  };

  if (loading === true) {
    return <p>Loading</p>;
  }

  if (error) {
    return (
      <React.Fragment>
        <p>{error}</p>
        <button onClick={incrementIndex}>Next Post</button>
      </React.Fragment>
    );
  }

  return (
    <div className="App">
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      {index === postIds.length - 1 ? (
        <p>No more posts</p>
      ) : (
        <button onClick={incrementIndex}>Next Post</button>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
```

Create a function `useFetch` in index.js (not inside the component):

```js
// import App from "./components/App";
// NEW
function useFetch(url) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        console.warn(error.message);
        setError("error loading data");
        setLoading(false);
      });
  }, [url]);

  return {
    loading,
    data,
    error,
  };
}
```

Destructure the elements from the function in App:

```js
// const [post, setPost] = React.useState([]);
// const [loading, setLoading] = React.useState(false);
// const [error, setError] = React.useState("");

const {
  loading,
  data: post,
  error,
} = useFetch(`https://jsonplaceholder.typicode.com/posts/${postIds[index]}`);
```

And comment out the current useEffect:

```js
const {
  loading,
  data: post,
  error,
} = useFetch(`https://jsonplaceholder.typicode.com/posts/${postIds[index]}`);

// React.useEffect(() => {
//   setLoading(true);
//   fetch(`https://jsonplaceholder.typicode.com/posts/${postIds[index]}`)
//     .then((res) => res.json())
//     .then((data) => {
//       setPost(data);
//       setError(null);
//       setLoading(false);
//     })
//     .catch((error) => {
//       console.warn(error.message);
//       setError("error loading data");
//       setLoading(false);
//     });
// }, [index]);
```

Test and clean up the file. -->

<!-- ```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// import App from "./components/App";

function useFetch(url) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        console.warn(error.message);
        setError("error loading data");
        setLoading(false);
      });
  }, [url]);

  return {
    loading,
    data,
    error,
  };
}

const postIds = [1, 2, 3, 4, 5, 6, 7, 8];

function App() {
  const [index, setIndex] = React.useState(0);

  const {
    loading,
    data: post,
    error,
  } = useFetch(`https://jsonplaceholder.typicode.com/posts/${postIds[index]}`);

  const incrementIndex = () => {
    setIndex((i) => (i === postIds.length - 1 ? i : i + 1));
  };

  if (loading === true) {
    return <p>Loading</p>;
  }

  if (error) {
    return (
      <React.Fragment>
        <p>{error}</p>
        <button onClick={incrementIndex}>Next Post</button>
      </React.Fragment>
    );
  }

  return (
    <div className="App">
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      {index === postIds.length - 1 ? (
        <p>No more posts</p>
      ) : (
        <button onClick={incrementIndex}>Next Post</button>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
``` -->

Create a hooks directory in src, move the custom hook with the changes below into it, and export it.

```js
import React from "react";

export function useFetch(url) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setError(null);
        setLoading(false);
      })
      .catch((error) => {
        console.warn(error.message);
        setError("error loading data");
        setLoading(false);
      });
  }, [url]);

  return {
    loading,
    data,
    error,
  };
}
```

<!--
and import the hook into `index.js`:

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// import App from "./components/App";

import { useFetch } from "./hooks/useFetch";

const postIds = [1, 2, 3, 4, 5, 6, 7, 8];

function App() {
  const [index, setIndex] = React.useState(0);

  const {
    loading,
    data: post,
    error,
  } = useFetch(`https://jsonplaceholder.typicode.com/posts/${postIds[index]}`);

  const incrementIndex = () => {
    setIndex((i) => (i === postIds.length - 1 ? i : i + 1));
  };

  if (loading === true) {
    return <p>Loading</p>;
  }

  if (error) {
    return (
      <React.Fragment>
        <p>{error}</p>
        <button onClick={incrementIndex}>Next Post</button>
      </React.Fragment>
    );
  }

  return (
    <div className="App">
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      {index === postIds.length - 1 ? (
        <p>No more posts</p>
      ) : (
        <button onClick={incrementIndex}>Next Post</button>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.querySelector("#root"));
``` -->

<!-- Reset `index.js` to use our old App file. We will retrofit our hook for use in our recipes app. -->

- import the hook into App.js:

```js
import { useFetch } from "./hooks/useFetch";
```

- Remove the useEffect from App.js
- Destructure useFetch's return values:

```js
function App() {
  const { loading, data, error } = useFetch(`/api/recipes`);
```

- Change the recipes route to pass data the the recipes component:

```js
<Route path="/" element={<Recipes recipes={recipes} />} />
```

- Finally, add the loading and error returns we used in the json placeholder example:

```js
if (loading === true) {
  return <p>Loading</p>;
}

if (error) {
  return <p>{error}</p>;
}
```

Review: [destructuring on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). Note the ability to re-assign variable names and how they differ for Arrays and Objects.

After resetting data to recipes ( `data: recipes` ), here is App.js in its entirety:

```js
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Recipes from "./Recipes";
import RecipeDetail from "./RecipeDetail";
import { useFetch } from "./hooks/useFetch";

function App() {
  const { loading, data: recipes, error } = useFetch(`/api/recipes`);

  if (loading === true) {
    return <p>Loading</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Recipes recipes={recipes} />} />
        <Route path="/:recipeId" element={<RecipeDetail recipes={recipes} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## Adding a NavBar

Create `Nav.js`:

```js
import React from "react";

import { Link } from "react-router-dom";

const Nav = ({ loggedin, setLoggedin }) => {
  return (
    <nav>
      <h1>
        <Link to="/">Recipes</Link>
      </h1>

      {loggedin ? (
        <button onClick={() => setLoggedin(false)}>Log Out</button>
      ) : (
        <button onClick={() => setLoggedin(true)}>Log In</button>
      )}
    </nav>
  );
};

export default Nav;
```

Import it and render in `App.js`:

```js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Recipes from "./Recipes";
import RecipeDetail from "./RecipeDetail";
import Nav from "./Nav";
import { useFetch } from "./hooks/api";

function App() {
  const [loggedin, setLoggedin] = React.useState(false);
  const { loading, data: recipes, error } = useFetch(`/api/recipes`);

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
          <Route path="/" element={<Recipes recipes={recipes} />} />
          <Route
            path="/:recipeId"
            element={<RecipeDetail recipes={recipes} />}
          />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
```

`npm i styled-components`

Install styled components and create some css to support the new element:

```css
import styled from "styled-components";

const NavStyles = styled.nav`
  min-height: 3rem;
  background-color: #007eb6;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  a {
    color: #fff;
    padding: 1rem;
    font-size: 2rem;
    text-decoration: none;
  }
  button {
    color: #fff;
    font-size: 1rem;
    padding: 0.5rem;
    margin: 0 1rem;
    background: #007eb6;
    border: 2px solid #fff;
    border-radius: 3px;
    align-self: center;
  }
`;
```

## Creating a Reusable Button Component

An element shouldn’t set its width, margin, height and color. These attributes should be set by its parent(s).

Remove the button styles in Nav and review CSs variables by using a variable to set the background color of Nav:

```js
const NavStyles = styled.nav`
  --bg-color: #007eb6;
  min-height: 3rem;
  background-color: var(--bg-color);
  margin-bottom: 1rem;
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: space-between;
  a {
    color: #fff;
    padding: 1rem;
    font-size: 2rem;
    text-decoration: none;
  }
`;
```

Create a Button component in `src/button/Button.js`:

```js
import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  --btn-bg: var(--btn-color, #bada55);
  color: #fff;
  font-size: 1rem;
  padding: 0.5rem;
  margin: 0 1rem;
  background: var(--btn-bg);
  border: 2px solid #fff;
  border-radius: 3px;
  align-self: center;
  cursor: pointer;
`;

export default function Button({ children, func }) {
  return <StyledButton onClick={func}>{children}</StyledButton>;
}
```

Note: `--btn-bg: var(--btn-color, #bada55);` uses a variable to set a variable and provides a fallback.

Import it into Nav `import Button from "./button/Button";` and compose it:

<!-- prettier-ignore -->
```js
{ loggedin ? (
    <Button func={() => setLoggedin(false)}>Log Out</Button>
  ) : (
    <Button func={() => setLoggedin(true)}>Log In</Button>
  )
}
```

Set it to use a color variable passed in from Nav:

```js
const NavStyles = styled.nav`
  --bg-color: #007eb6;
  --btn-color: #007eb6;
```

`--btn-color: #007eb6;` overrides the default in our Button component:

`--btn-bg: var(--btn-color, #bada55);`

we proably want to store our color palette at a higher level. Add to index.css:

```css
:root {
  --blue-dark: #046e9d;
}
```

In Nav:

```css
--btn-color: var(--blue-dark);
```

This is the beginning of our standalone Button component.

Also: `const [loggedin, setLoggedin] = useToggle(false);`

## Adding a Recipe

Create `FormCreateRecipe.js`:

```js
import React from "react";

const FormCreateRecipe = () => {
  return (
    <div>
      <h3>Add Recipe Form</h3>
      <form>
        <input type="text" placeholder="Recipe name" />
        <input type="text" placeholder="Recipe image" />
        <textarea type="text" placeholder="Recipe description" />
        <button type="submit">Add Recipe</button>
      </form>
    </div>
  );
};

export default FormCreateRecipe;
```

Allow it to render only if the user is logged in.

- pass the logged in state from `App.js` to the Recipes component:

```js
<Route path="/" element={<Recipes recipes={recipes} loggedin={loggedin} />} />
```

Import the component into `Recipes.js`:

```js
import React from "react";
import Recipe from "./Recipe";
import FormCreateRecipe from "./FormCreateRecipe";

function Recipes({ recipes, loggedin }) {
  return (
    <section>
      {loggedin && <FormCreateRecipe />}
      {recipes.map((recipe) => (
        <Recipe key={recipe._id} recipe={recipe} />
      ))}
    </section>
  );
}

export default Recipes;
```

Add values state, handleInputchange and createRecipe functions to `FormCreateRecipe.js`:

```js
import React from "react";
import Button from "./Button";

const FormCreateRecipe = () => {
  const [values, setValues] = React.useState({
    title: "Recipe Title",
    image: "toast.png",
    description: "Description of the recipe",
  });

  const createRecipe = (event) => {
    event.preventDefault();
    const recipe = {
      title: values.title,
      image: values.image,
      description: values.description,
      year: values.year,
    };
    console.log(" making a recipe ", recipe);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(" name:: ", name, " value:: ", value);
    // computed property names
    setValues({ ...values, [name]: value });
  };

  return (
    <div>
      <h3>Add Recipe Form</h3>
      <form onSubmit={createRecipe}>
        <input
          type="text"
          placeholder="Recipe title"
          value={values.title}
          name="title"
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Recipe image"
          value={values.image}
          name="image"
          onChange={handleInputChange}
        />
        <textarea
          placeholder="Recipe description"
          name="description"
          onChange={handleInputChange}
          value={values.description}
        />
        <input
          type="text"
          placeholder="Recipe year"
          value={values.year}
          name="year"
          onChange={handleInputChange}
        />

        <Button type="submit">Add Recipe</Button>
      </form>
    </div>
  );
};

export default FormCreateRecipe;
```

Note the difference between what we are doing here for handling state change for inputs vs. how we accomplished the same task in previous classes. (Examine the console output.)

We are using ES6 [computed property names](https://ui.dev/computed-property-names/) which allow you to have an expression (a piece of code that results in a single value like a variable or function invocation) be computed as a property name on an object.

Review Object assignment and computed values:

```js
var testObj = {};
// dot assignment
testObj.age = 80;

var myKey = "name";
var myValue = "Daniel";

// bracket assignment
testObj[myKey] = myValue;
console.log(testObj);

// Computed Property Names
// Pre ES6:: create the object first, then use bracket notation to assign that property to the value
function objectify(key, value) {
  let obj = {};
  obj[key] = value;
  return obj;
}

objectify("name", "Daniel");

// After: use object literal notation to assign the expression as a property on the object without having to create it first
function objectifyTwo(key, value) {
  return {
    [key]: value,
  };
}

objectifyTwo("color", "purple");
```

Test the button.

## API Hook Returns a Promise

We will replace our currect `useFetch` hook with another that doesn't return the data but instead returns a promise. This is a common practice.

Edit the existing `useFetch` hook:

```js
const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

async function fetchData({ path, method, data, headers }) {
  const response = await fetch(path, {
    method: method,
    body: !!data ? JSON.stringify(data) : null,
    headers: !!headers ? headers : defaultHeaders,
  }).then((response) => response.json());
  return response;
}

export function useFetch() {
  return {
    get: (path, headers) =>
      fetchData({
        path: path,
        method: "GET",
        data: null,
        headers: headers,
      }),
    post: (path, data, headers) =>
      fetchData({
        path: path,
        method: "POST",
        data: data,
        headers: headers,
      }),
    put: (path, data, headers) =>
      fetchData({
        path: path,
        method: "PUT",
        data: data,
        headers: headers,
      }),
    del: (path, headers) =>
      fetchData({
        path: path,
        method: "DELETE",
        data: null,
        headers: headers,
      }),
  };
}

export default useFetch;
```

## Get Recipes

This is a major change. We need to alter App.js to use the new hook:

```js
import React from "react";
import Recipes from "./Recipes";
import RecipeDetail from "./RecipeDetail";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useFetch } from "./hooks/useFetch";
import Nav from "./Nav";
import useToggle from "./hooks/useToggle";

function App() {
  const [recipes, setRecipes] = React.useState([]);
  const [loggedin, setLoggedin] = useToggle(true);
  const [loading, setLoading] = useToggle(true);
  const [error, setError] = React.useState("");
  const { get } = useFetch(`/api/recipes`);

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    setLoading(true);
    get("/api/recipes")
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((error) => setError(error));
  }, []);

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
            element={<Recipes recipes={recipes} loggedin={loggedin} />}
          />
          <Route
            path="/:recipeId"
            element={<RecipeDetail recipes={recipes} />}
          />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
```

## Add the Recipe

Add an addRecipe function to App.js and props drill it down to `Recipes`:

```js
  const { get, post } = useFetch(`/api/recipes`);
...

  const addRecipe = (recipe) => {
    post("/api/recipes", recipe).then((data) => {
      setRecipes([data, ...recipes]);
    });
  };

...

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

```

Note the addition of post from the useFetch custom hook.

Props drill the addRecipe function to the form:

```js
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
```

In `FormCreateRecipe.js`, destructure addRecipe and call it with a recipe:

```js
const FormCreateRecipe = ({ addRecipe }) => {
  const [values, setValues] = React.useState({
    title: "Recipe Title",
    image: "toast.png",
    description: "Description of the recipe",
    year: "2021"
  });

  const createRecipe = (event) => {
    event.preventDefault();
    const recipe = {
      title: values.title,
      image: values.image,
      description: values.description,
      year: values.year,
    };
    addRecipe(recipe);
  };
```

Test and debug.

<!-- Demo - backend validation:

```js
const RecipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  // year: String,
  year: {
    type: String,
    required: true,
  },
});
```

```js
const [values, setValues] = React.useState({
  title: "",
  image: "",
  description: "",
  year: "",
});
``` -->

## Delete

In `App.js`:

```js
const { get, post, del } = useFetch(`/api/recipes`);
// new function
const deleteRecipe = (recipeId) => {
  console.log("recipeId:", recipeId);
  del(`/api/recipes/${recipeId}`).then(window.location.replace("/"));
};
// pass deleteRecipe prop
<Route
  path="/:recipeId"
  element={
    <RecipeDetail
      recipes={recipes}
      deleteRecipe={deleteRecipe}
      loggedin={loggedin}
    />
  }
/>;
```

In `RecipeDetail.js`:

<!-- prettier-ignore -->
```js
{props.loggedin && (
  <button onClick={() => props.deleteRecipe(thisRecipe._id)}>
    delete
  </button>
)}

<Link to="/">Home</Link>;
```

App.js:

```js
const deleteRecipe = (recipeId) => {
  console.log("recipeId:", recipeId);
  del(`/api/recipes/${recipeId}`).then(
    setRecipes((recipes) => recipes.filter((recipe) => recipe._id !== recipeId))
  );
};
```

Destructure all props and add a piece of state to determine the view:

```js
import React from "react";
import { Link, useParams } from "react-router-dom";

function RecipeDetail({ recipes, loggedin, deleteRecipe }) {
  const { recipeId } = useParams();
  const [recipeDeleted, setRecipeDeleted] = React.useState(false);

  const currRecipe = recipes.filter((recipe) => recipe._id === recipeId);
  const thisRecipe = { ...currRecipe[0] };

  const delRecipe = () => {
    deleteRecipe(thisRecipe._id);
    setRecipeDeleted(true);
  };

  if (recipeDeleted) {
    return (
      <>
        <p>Recipe deleted!</p>
        <Link to="/">Home</Link>
      </>
    );
  }

  return (
    <div>
      <img src={`/img/${thisRecipe.image}`} alt={thisRecipe.title} />
      <h1>{thisRecipe.title}</h1>
      <p>{thisRecipe.description}</p>

      {loggedin && <button onClick={() => delRecipe()}>delete</button>}

      <Link to="/">Home</Link>
    </div>
  );
}

export default RecipeDetail;
```

## Update a Recipe

App.js:

```js
const { get, post, del, put } = useFetch(`/api/recipes`);
// create a new function
const editRecipe = (updatedRecipe) => {
  console.log(updatedRecipe);
  put(`/api/recipes/${updatedRecipe._id}`, updatedRecipe).then(
    get("/api/recipes").then((data) => {
      setRecipes(data);
    })
  );
};
// prop drill
<RecipeDetail
  recipes={recipes}
  deleteRecipe={deleteRecipe}
  loggedin={loggedin}
  editRecipe={editRecipe}
/>;
```

New component; `src/FormEditRecipe.js`:

```js
import React from "react";
import Button from "./Button";

const FormEditRecipe = ({ editRecipe, thisRecipe }) => {
  const [values, setValues] = React.useState({
    title: thisRecipe.title,
    image: thisRecipe.image,
    description: thisRecipe.description,
    year: thisRecipe.year,
  });

  const updateRecipe = (event) => {
    event.preventDefault();
    const recipe = {
      ...thisRecipe,
      title: values.title,
      image: values.image,
      description: values.description,
      year: values.year,
    };
    editRecipe(recipe);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(" name:: ", name, " value:: ", value);
    setValues({ ...values, [name]: value });
  };

  return (
    <div>
      <h3>Edit Recipe</h3>
      <form onSubmit={updateRecipe}>
        <input
          type="text"
          placeholder="Recipe title"
          value={values.title}
          name="title"
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="Recipe image"
          value={values.image}
          name="image"
          onChange={handleInputChange}
        />
        <textarea
          placeholder="Recipe description"
          name="description"
          onChange={handleInputChange}
          value={values.description}
        />
        <input
          type="text"
          placeholder="Recipe year"
          value={values.year}
          name="year"
          onChange={handleInputChange}
        />

        <Button type="submit">Edit Recipe</Button>
      </form>
    </div>
  );
};

export default FormEditRecipe;
```

Compose it in`RecipeDetail.js`:

```js
import FormEditRecipe from "./FormEditRecipe";
// destructure
function RecipeDetail({ recipes, loggedin, deleteRecipe, editRecipe }) {
// compose
{loggedin && (
  <>
    <FormEditRecipe thisRecipe={thisRecipe} editRecipe={editRecipe} />
    <button onClick={() => delRecipe()}>delete</button>
  </>
)}
```

<!-- ## Array.Reduce

Array.reduce is a method that executes a reducer function on each element of the array, resulting in single output value.

Examine this simple routine:

```js
const nums = [2, 4, 6];
let state = 0;

function sum(value) {
  state += value;
}

nums.forEach(sum);

console.log("state", state);
```

`forEach` adds up all of the values but we needed to refer to an intermediate value (state).

`forEach` is dependent on the state of our application and it is modifying state outside of its own scope - this makes it an "impure" function. We can avoid this with the `reduce` method.

```js
const nums = [2, 4, 6];

function reducer(accumulator, value) {
  return accumulator + value;
}

const total = nums.reduce(reducer, 0);

console.log("total", total);
```

- The very first time the reducer function is invoked, the accumulator will be 0 and value will be 2.
- On the next invocation, state will be whatever the previous invocation returned (0 + 2) and value will be the 2nd element in the array, 4.
- On the next invocation, state will be 6 (2 + 4) and value will be 6.
- Finally, since are no more elements in the collection to iterate over, the returned value will be 6 + 6 or 12.

```
Initial Value: 0

First invocation:
  state: 0
  value: 2

Second invocation:
  state: 2
  value: 4

Third invocation:
  state: 6
  value: 6

No more elements in the collection, return 6 + 6 which is 12.
```

Note: the default initial value for reduce is 0 so the above could be written as:

```js
const nums = [2, 4, 6];

function reducer(accumulator, value) {
  return accumulator + value;
}

const total = nums.reduce(reducer);

console.log("total", total);
``` -->

<!-- ## useReducer

React comes with a built-in Hook called useReducer that allows you to add state to a function component but manage that state using the reducer pattern.

`useState` and `useReducer` both allow you to add state to components. `useReducer` offers a bit more flexibility since it allows you to decouple how the state is updated from the action that triggered the update.

`useReducer` returns an array with the first element being the state and the second element being a 'dispatch' function which when called, will invoke the reducer.

```js
const [state, dispatch] = React.useReducer(reducer, initialState);
```

Examine the following code in index.js:

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// import App from "./components/App";

function reducer(state, value) {
  return state + value;
}

function Counter() {
  const [count, dispatch] = React.useReducer(reducer, 0);

  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => dispatch(1)}>+</button>
    </>
  );
}

ReactDOM.render(<Counter />, document.querySelector("#root"));
```

When + is clicked, dispatch will be invoked. That calls reducer passing it two arguments,

1. state, which will come implicitly from React,
2. value, which will be whatever was passed to dispatch.

What we return from reducer will become the new count.

Finally, because count changed, React will re-render the component, updating the UI.

Add subtraction:

```js
function reducer(state, value) {
  return state + value;
}

function Counter() {
  const [count, dispatch] = React.useReducer(reducer, 0);

  return (
    <React.Fragment>
      <h1>{count}</h1>
      <button onClick={() => dispatch(1)}>+</button>
      <button onClick={() => dispatch(-1)}> - </button>
    </React.Fragment>
  );
}
```

Typically in React, instead of dispatching the value we dispatch the type of action that occurred and then handle the state change in the reducer function:

```js
function reducer(state, action) {
  if (action === "increment") {
    return state + 1;
  } else if (action === "decrement") {
    return state - 1;
  } else if (action === "reset") {
    return 0;
  } else {
    throw new Error(`This action type isn't supported.`);
  }
}

function Counter() {
  const [count, dispatch] = React.useReducer(reducer, 0);

  return (
    <React.Fragment>
      <h1>{count}</h1>
      <button onClick={() => dispatch("increment")}>+</button>
      <button onClick={() => dispatch("decrement")}>-</button>
      <button onClick={() => dispatch("reset")}>Reset</button>
    </React.Fragment>
  );
}
```

Note: we’ve decoupled the update logic of "count" from our component.

We’re now mapping actions to state changes and separating how the state updates from the action that occurred.

Instead of incrementing and decrementing count by 1, let’s use a slider, i.e.:

```js
export default function Slider({ onChange }) {
  const [value, setValue] = React.useState(1);

  return (
    <>
      {value}
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => {
          const value = Number(e.target.value);
          onChange(value);
          setValue(value);
        }}
      />
    </>
  );
}
``` -->

<!-- Edit index.js:

```js
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// import App from "./App";

function reducer(state, action) {
  if (action.type === "increment") {
    return {
      count: state.count + state.step,
      step: state.step,
    };
  } else if (action.type === "decrement") {
    return {
      count: state.count - state.step,
      step: state.step,
    };
  } else if (action.type === "reset") {
    return {
      count: 0,
      step: state.step,
    };
  } else if (action.type === "updateStep") {
    return {
      count: state.count,
      step: action.step,
    };
  } else {
    throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = React.useReducer(reducer, { count: 0, step: 1 });

  return (
    <>
      <Slider
        onChange={(value) =>
          dispatch({
            type: "updateStep",
            step: value,
          })
        }
      />
      <hr />
      <h1>{state.count}</h1>
      <button
        onClick={() =>
          dispatch({
            type: "increment",
          })
        }
      >
        +
      </button>
      <button
        onClick={() =>
          dispatch({
            type: "decrement",
          })
        }
      >
        -
      </button>
      <button
        onClick={() =>
          dispatch({
            type: "reset",
          })
        }
      >
        Reset
      </button>
    </>
  );
}

export default function Slider({ onChange }) {
  const [value, setValue] = React.useState(1);

  return (
    <>
      {value}
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => {
          const value = Number(e.target.value);
          onChange(value);
          setValue(value);
        }}
      />
    </>
  );
}

ReactDOM.render(<Counter />, document.querySelector("#root"));
```

To use a step we need to use an object for the intial state of our reducer:

```js
const [state, dispatch] = React.useReducer(reducer, { count: 0, step: 1 });
```

And since state is not an integer but an Object, we updated the reducer:

```js
function reducer(state, action) {
  if (action === "increment") {
    return {
      count: state.count + 1,
      step: state.step,
    };
  } else if (action === "decrement") {
    return {
      count: state.count - 1,
      step: state.step,
    };
  } else if (action === "reset") {
    return {
      count: 0,
      step: state.step,
    };
  } else {
    throw new Error(`This action type isn't supported.`);
  }
}
``` -->

<!-- Previously we dispatched the type of action that occurred (increment, decrement, and reset).

We pass along the value of the slider so we can update our step state and we've updated our dispatches to pass an object:

```js
<>
  <Slider
    onChange={(value) =>
      dispatch({
        type: "updateStep",
        step: value,
      })
    }
  />
  <hr />
  <h1>{state.count}</h1>
  <button
    onClick={() =>
      dispatch({
        type: "increment",
      })
    }
  >
    +
  </button>
  <button
    onClick={() =>
      dispatch({
        type: "decrement",
      })
    }
  >
    -
  </button>
  <button
    onClick={() =>
      dispatch({
        type: "reset",
      })
    }
  >
    Reset
  </button>
</>
```

Finally, we account for

- our new action updateStep,
- changing action to be an object instead of a string
- adjust increment and decrement to adjust the count based on the step property and not just 1

```js
function reducer(state, action) {
  if (action.type === "increment") {
    return {
      count: state.count + state.step,
      step: state.step,
    };
  } else if (action.type === "decrement") {
    return {
      count: state.count - state.step,
      step: state.step,
    };
  } else if (action.type === "reset") {
    return {
      count: 0,
      step: state.step,
    };
  } else if (action.type === "updateStep") {
    return {
      count: state.count,
      step: action.step,
    };
  } else {
    throw new Error();
  }
}
``` -->

<!-- Let's try a simple experiment on our recipes home page.

Reset index.js so its displaying the recipes.

- in App.js add a reducer after the imports:

```js
import Nav from "./Nav";

const reducer = (state, action) => {
  switch (action) {
    case "on":
      return true;
    case "off":
      return false;
    default:
      return state;
  }
};
```

- add the useReducer hook:

```js
const { get, post, del } = useFetch(`/api/recipes`);
const [light, dispatch] = React.useReducer(reducer, true);
```

Add a class to the main element and two buttons after the Nav:

```js
return (
<main className={light ? "lit" : "unlit"}>
  <BrowserRouter>
    <Nav setLoggedin={setLoggedin} loggedin={loggedin} />
    <button onClick={() => dispatch("on")}>Light</button>
    <button onClick={() => dispatch("off")}>Dark</button>
```

Finally, add some css

```js
/* dark/light */

main.lit {
  background-color: #fff;
}

.unlit {
  background-color: #555;
}

.unlit {
  color: #fff;
}

.unlit a {
  color: #eee;
}
``` -->

## Context

Context provides a way to pass data through the component tree without having to pass props down manually at every level. - The React Docs

Create `src/RecipesContext.js`:

```js
import React from "react";

const RecipesContext = React.createContext();

export default RecipesContext;
```

App.js

```js
import RecipesContext from "./RecipesContext";
...
<RecipesContext.Provider value={recipes}>
  <main>
    <BrowserRouter>
      <Nav setLoggedin={setLoggedin} loggedin={loggedin} />
      <Routes>
        {/* NOTE - we no longer pass recipes as a prop to Recipes */}
        <Route
          path="/"
          element={<Recipes loggedin={loggedin} addRecipe={addRecipe} />}
        />
        <Route
          path="/:recipeId"
          element={
            <RecipeDetail
              recipes={recipes}
              deleteRecipe={deleteRecipe}
              loggedin={loggedin}
              editRecipe={editRecipe}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  </main>
</RecipesContext.Provider>
```

Recipes.js

```js
import React from "react";
import Recipe from "./Recipe";
import FormCreateRecipe from "./FormCreateRecipe";
import RecipesContext from "./RecipesContext";

function Recipes({ loggedin, addRecipe }) {
  const recipes = React.useContext(RecipesContext);
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
```

RecipeDetail.js

```js
import RecipesContext from "./RecipesContext";

function RecipeDetail({ loggedin, deleteRecipe, editRecipe }) {
  const recipes = React.useContext(RecipesContext);
  ...
```

Expand to include additional state.

In `App.js`:

```js
// create a new variable with the loggedin state
const value = { recipes, loggedin };
// pass the variable as the value
<RecipesContext.Provider value={value}>
```

Update `Recipes.js` and `RecipeDetail.js`.

```js
function Recipes({ addRecipe }) {
  const { recipes, loggedin } = React.useContext(RecipesContext);
```

```js
function RecipeDetail({ deleteRecipe, editRecipe }) {
  const { recipes, loggedin } = React.useContext(RecipesContext);
```

Remove all props drilling for `loggedin` from `App.js`.

Continue with `setLoggedin`, `addRecipe`, `deleteRecipe` and `editRecipe`

## Notes

<!-- ## Deployment -->

<!-- ```js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware(["/api", "/img"], {
      target: "http://localhost:3456/",
    })
  );
};

  // "proxy": "https://recipes-do-not-delete.herokuapp.com/",
  // "proxy": "http://localhost:3456/",
``` -->

<!-- We could run `npm run build` in the client folder and use that or use a Heroku postbuild script.

In the script section of server's package.json add a script to:

1. turn production mode off (you can't run npm build in the production environment)
2. do an npm install and build (prefixing client)

```js
"heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"
``` -->

<!-- `server.js` needs to be set up to serve the build.

Make sure the following goes after _all_ the routes: -->

<!-- ```js
if (process.env.NODE_ENV === "production") {
  // set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
``` -->

<!-- The path.resolve has to have four arguments.

Because we're using Node's built in path method be sure to require it (at the top of server.js):

`const path = require('path');`

And also... be sure to remove the old express.static middleware (it is now in the 'else' statement above).

You can also add your database URI to `Config Vars` in the Heroku `Settings` for your project. -->
