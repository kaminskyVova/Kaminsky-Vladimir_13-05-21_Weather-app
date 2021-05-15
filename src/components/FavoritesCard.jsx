import React from "react";
import "../scss/favoritePage.scss"

export default function FavoritesCard({ onSelect, favorites }) {
	return (
		<div className="d-flex justify-content-center flex-wrap">
			{favorites.map(({ name, current, id }) => (
				<div
					key={id}
					className="border border-primary text-center p-3 m-1 border-added"
					onClick={() => onSelect(name)}
				>
					{name}
					<br />
					{current.temperature} C
				</div>
			))}
		</div>
	);
}
