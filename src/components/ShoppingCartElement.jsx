import React from "react";

const ShoppingCartElement = (props) => {
	const { cartElement, onRemoveFilm } = props;

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
					{/* <button
						className="btn btn-primary rm-item fw-bold btn-sm d-flex align-items-center justify-content-center h-25px w-25px"
						title="Rimuovi il rullino dal carrello"
						onClick={(e) => handleDec(e, cartElement)}
					>
						-
					</button> */}
					<span className="">€ {cartElement.Price.toFixed(2)}</span>
					{/* <button
						className={
							(cartElement.QuantityInStock ? "" : "disabled ") +
							"btn btn-primary fw-bold btn-sm d-flex align-items-center justify-content-center h-25px w-25px"
						}
						title="Aggiungine un altro al carrello"
						onClick={(e) => handleInc(e, cartElement)}
					>
						+
					</button> */}
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
