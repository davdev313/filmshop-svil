/**
 * @author Davide Musarra <davide.musarra@studenti.unime.it>
 */

import React from "react";

const ShoppingCartElement = (props) => {
	const { cartElement, onRemoveFilm } = props;	// destructuring dell'oggetto props

	return (
		<li
			id={cartElement.Id}
			className="list-group-item d-flex flex-column lh-sm"
		>
			<div className="d-flex justify-content-between my-1">
				<div className="d-flex justify-content-between flex-column">
					<h6 className="my-0 fw-bold">
						{cartElement.FilmName.replaceAll("_", " ")}
					</h6>
					<small className="mt-1 fs-777">
						<span>Quantità: {cartElement.Quantity}</span>
					</small>
				</div>
				<div className="d-flex align-items-center">
					{/* Intendo tenere solo 2 cifre decimali per rappresentare il prezzo */}
					<span className="">€ {cartElement.Price.toFixed(2)}</span>
				</div>
			</div>
			<div>
				<button
					className="btn btn-link fourth-color font-weight-normal p-0 mt-2"
					title="Rimuovi il rullino dal carrello"
					onClick={(e) => onRemoveFilm(e, cartElement)}
				>
					Rimuovi dal carrello
				</button>
			</div>
		</li>
	);
};

export default ShoppingCartElement;
