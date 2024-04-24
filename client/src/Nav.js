import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Button from "./Button";

const StyledNav = styled.nav`
	--bg-color: #007eb6;
	--btn-color: var(--blue-dark);

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
`;

const Nav = ({ loggedin, setLoggedin }) => {
	return (
		<StyledNav>
			<h1>
				<Link to="/">Recipes</Link>
			</h1>

			{loggedin ? (
				<Button func={() => setLoggedin(false)}>Log Out</Button>
			) : (
				<Button func={() => setLoggedin(true)}>Log In</Button>
			)}
		</StyledNav>
	);
};

export default Nav;
