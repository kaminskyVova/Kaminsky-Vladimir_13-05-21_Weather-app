import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

import apikey from "./key";
import FetchRequest from "../FetchRequest";

const fr = new FetchRequest({
	security: true,
	host: "dataservice.accuweather.com",
	query: { apikey },
});

export const weatherSlice = createSlice({
	name: "weather",

	initialState: {
		loading: false,
		favoriteCities: [],
		autoComplete: [],
		forecasts: [],
		current: {},
		cityKey: null,
	},

	reducers: {
		setLoading(state, action) {
			state.loading = action.payload;
		},

		addCityKey(state, action) {
			if (action.payload) {
				state.cityKey = action.payload;
				state.autoComplete = [];
			}
		},

		setCurrent(state, action) {
			state.current = action.payload;
		},

		setForecasts(state, action) {
			if (action.payload) {
				state.forecasts = action.payload;
			}
		},

		setAutoComplete(state, action) {
			if (action.payload) {
				state.autoComplete = action.payload;
			}
		},

		addToFavorites(state, action) {
			state.favoriteCities = [...state.favoriteCities, action.payload];
		},

		removeFavorites(state, action) {
			state.favoriteCities = state.favoriteCities.filter(
				(x) => x.id !== action.payload
			);
		},
	},
});

export const useWeather = () => useSelector((state) => state.weather);

export const {
	setLoading,
	addCityKey,
	setCurrent,
	setForecasts,
	setAutoComplete,
	addToFavorites,
	removeFavorites,
} = weatherSlice.actions;

export const searchCityKey = (city) => async (dispatch) => {
	if (!city) {
		return;
	}

	dispatch(setLoading(true));
	const result = await fr.get("/locations/v1/cities/search", { q: city });
	dispatch(setLoading(false));

	if (result && result.length) {
		dispatch(addCityKey(result[0].Key));
	}
};

export const currentCelsiusAndWind = (cityKey) => async (dispatch) => {
	if (!cityKey) {
		return;
	}

	dispatch(setLoading(true));
	const result = await fr.get(`/currentconditions/v1/${cityKey}`, {
		details: true,
	});
	dispatch(setLoading(false));

	if (result && result.length) {
		dispatch(
			setCurrent({
				temperature: result[0].Temperature.Metric.Value,
				wind: result[0].Wind.Speed.Metric.Value,
				humidity: result[0].RelativeHumidity,
				clouds: result[0].CloudCover,
			})
		);
	}
};

export const forecasts5days = (cityKey) => async (dispatch) => {
	if (!cityKey) {
		return;
	}

	dispatch(setLoading(true));
	const result = await fr.get(`/forecasts/v1/daily/5day/${cityKey}`, {
		metric: true,
	});
	dispatch(setLoading(false));

	if (result && result.DailyForecasts) {
		const currentValues = result.DailyForecasts.map((df) => ({
			date: df.Date,
			min: df.Temperature.Minimum.Value,
			max: df.Temperature.Maximum.Value,
		}));

		dispatch(setForecasts(currentValues));
	}
};

export const autocompleteSearch = (search) => async (dispatch) => {
	if (!search) {
		return dispatch(setAutoComplete([]));
	}

	dispatch(setLoading(true));
	const result = await fr.get("/locations/v1/cities/autocomplete", {
		q: search,
	});
	dispatch(setLoading(false));

	if (!result || !result.length) {
		return dispatch(setAutoComplete([]));
	}

	const resSearch = result.map((x) => x.LocalizedName);
	dispatch(setAutoComplete(resSearch));
};

export default weatherSlice.reducer;
