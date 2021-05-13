import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useOnce } from "../hooks";

import {
	searchCityKey,
	currentCelsiusAndWind,
	forecasts5days,
	autocompleteSearch,
	useWeather,
} from "../store/weatherSlice";

export default function HomeCard({
	defaultCity = "TelAviv",
	favorites = [],
	addFavorite,
	removeFavorite,
}) {
	const [city, setCity] = useState(defaultCity);

	const dispatch = useDispatch();

	const { autoComplete, forecasts, current, cityKey, loading } = useWeather();

	const variants = autoComplete;
	const showCityKey = cityKey;
	const showCity = city;

	const wind = current.wind;
	const humidity = current.humidity;
	const clouds = current.clouds;

	const step = useMemo(() => {
		if (loading) {
			return "loading";
		}

		if (!cityKey) {
			return "error";
		}

		return "show";
	}, [loading, cityKey]);

	useEffect(() => {
		dispatch(currentCelsiusAndWind(cityKey));
		dispatch(forecasts5days(cityKey));
	}, [currentCelsiusAndWind, forecasts5days, cityKey]);

	const search = async () => {
		if (!city) {
			return;
		}

		dispatch(searchCityKey(city));
	};

	useOnce(search);

	const autocomplite = () => dispatch(autocompleteSearch(city));

	let content = null;

	if (step === "loading") {
		content = (
			<div className="d-flex justify-content-center m-5">
				<div className="spinner-border" role="status">
					<span className="sr-only">Loading...</span>
				</div>
			</div>
		);
	} else if (step === "error") {
		content = (
			<div className="m-3">
				<div className="d-flex justify-content-center">
					<p className="text-danger">City not found. Try again.</p>
				</div>
				<div className="d-flex justify-content-center">
					<img
						width="50"
						src="https://image.flaticon.com/icons/svg/3084/3084540.svg"
					></img>
				</div>
			</div>
		);
	} else if (step === "show") {
		let button = null;

		if (favorites.some((x) => x.id === showCityKey)) {
			button = (
				<div>
					<button
						className="btn btn-primary"
						onClick={() => removeFavorite(showCityKey)}
					>
						Remove from Favorites
					</button>
				</div>
			);
		} else {
			button = (
				<div>
					<button
						className="btn btn-primary"
						onClick={() =>
							addFavorite({
								id: showCityKey,
								name: showCity,
								current,
							})
						}
					>
						Add to Favorites
					</button>
				</div>
			);
		}

		content = (
			<>
				<div className="d-flex justify-content-around">
					<div>
						{showCity}
						{favorites.some((x) => x.id === showCityKey) ? (
							<>
								<br />
								(Added)
							</>
						) : (
							""
						)}
						<br />
						{current.temperature} C
					</div>
					{button}
				</div>
				<div className="d-flex justify-content-center flex-column mx-auto">
					<span>Wind: {wind} km/h</span>
					<span>Humidity: {humidity} </span>
					<span>Clouds: {clouds}</span>
				</div>
				<div className="d-flex align-items-center justify-content-center flex-wrap">
					{forecasts.map((forecast, index) => (
						<DayCard key={index} {...forecast} />
					))}
				</div>
			</>
		);
	}

	let variantsList = null;
	if (variants && variants.length) {
		variantsList = (
			<>
				<div className="dropdown-menu display" style={{ display: "block" }}>
					{variants.map((variant, index) => (
						<a
							key={index}
							className="dropdown-item"
							onClick={(e) => {
								e.preventDefault();
								setCity(variant);
								search();
							}}
						>
							{variant}
						</a>
					))}
				</div>
			</>
		);
	}

	return (
		<div className="d-flex flex-column">
			<div className="d-flex justify-content-center">
				<div className="col-auto">
					<div className="input-group">
						<input
							type="text"
							value={city}
							onChange={(e) => {
								setCity(e.target.value.replace(/[^A-Za-z/ /[/-/]]/gi, ""));
							}}
							disabled={step === "loading"}
						/>

						<div className="input-group-append">
							<button
								className="btn btn-primary"
								onClick={search}
								disabled={step === "loading"}
							>
								Search
							</button>
						</div>
						<div className="input-group-append">
							<button
								className="btn btn-primary"
								onClick={autocomplite}
								disabled={step === "loading"}
							>
								Autocomplite
							</button>
						</div>
					</div>
					{variantsList}
				</div>
			</div>
			{content}
		</div>
	);
}

function DayCard({ date, min, max }) {
	let day = "";

	date = new Date(date);

	switch (date.getDay()) {
		case 0:
			day = "Sun";
			break;
		case 1:
			day = "Mon";
			break;
		case 2:
			day = "Tue";
			break;
		case 3:
			day = "Wed";
			break;
		case 4:
			day = "Thu";
			break;
		case 5:
			day = "Fri";
			break;
		case 6:
			day = "Sat";
			break;
	}

	return (
		<div className="border border-primary text-center p-3 m-1">
			{day}
			<br />
			{min} - {max}C
		</div>
	);
}
