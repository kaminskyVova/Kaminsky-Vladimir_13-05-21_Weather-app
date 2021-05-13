import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { FavoritesCard, HomeCard } from "./components";

import {
	useWeather,
	addToFavorites,
	removeFavorites,
} from "./store/weatherSlice";

function App() {
	const weahter = useWeather();
	const dispatch = useDispatch();

	const favorites = weahter.favoriteCities;

	const [mainMode, setMainMode] = useState(true);
	const [defaultCity, setDefaultCity] = useState("TelAviv");

	const addFavorite = (favorite) => {
		dispatch(addToFavorites(favorite));
	};

	const removeFavorite = (favoriteId) => {
		dispatch(removeFavorites(favoriteId));
	};

	let body = null;

	if (mainMode) {
		body = (
			<HomeCard
				defaultCity={defaultCity}
				favorites={favorites}
				addFavorite={addFavorite}
				removeFavorite={removeFavorite}
			/>
		);
	} else {
		body = (
			<FavoritesCard
				favorites={favorites}
				onSelect={(city) => {
					setDefaultCity(city);
					setMainMode(true);
				}}
			/>
		);
	}

	return (
		<div className="container vh-100 d-flex flex-column justify-content-center">
			<div className="card">
				<div className="card-header d-flex justify-content-end">
					<button
						className="btn btn-primary mr-2"
						onClick={() => setMainMode(true)}
					>
						Home
					</button>
					<button
						className="btn btn-primary"
						onClick={() => setMainMode(false)}
						disabled={favorites.length === 0}
					>
						Favorites
					</button>
				</div>
				<div className="card-body">{body}</div>
			</div>
		</div>
	);
}

export default App;
