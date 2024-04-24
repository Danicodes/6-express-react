import React from "react";
import { formatDate } from "./utils";
import { Link } from "react-router-dom";

function Recipe({ recipe }) {
	const { title, created, description, image, _id } = recipe;
	return (
		<summary>
			<img src={`img/${image}`} alt={title} />
			<h3>
				<Link to={_id}>{title}</Link>
			</h3>
			<p>{description}</p>
			<small>Published: {formatDate(created)}</small>
		</summary>
	);
}

export default Recipe;
