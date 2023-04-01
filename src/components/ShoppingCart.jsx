import ShoppingCartElement from "./ShoppingCartElement";

const ShoppingCart = (props) => {
	const {
		cart,
		cartTotalItems,
		onRemoveFilm,
		onRemoveAll,
		onSubmitOrder,
		checkout,
		onCompletedCheckout,
	} = props;

	const cartTotalPrice = cart.reduce((a, c) => a + c.Quantity * c.Price, 0);

	return (
		<div>
			<div className="offcanvas-header d-flex align-items-center px-3 py-0">
				<h5
					id="offcanvasRightLabel"
					className="d-flex justify-content-between align-items-center"
				>
					<span className="fs-4">
						Il tuo carrello
						<span className="mx-3 badge bg-fourth-color rounded-pill">
							{cartTotalItems}
						</span>
					</span>
				</h5>
				<button
					type="button"
					className="btn-close text-reset"
					data-bs-dismiss="offcanvas"
					aria-label="Close"
				></button>
			</div>
			<hr className="mt-2" />
			<div className="offcanvas-body">
				{/* ELEMENTI CARRELLO */}
				<ul className="list-group mb-3">
					{cart.length === 0 && (
						<div className="fs-4 text-center d-flex align-items-center flex-column">
							{!checkout && (
								<>
									<p>Oh no, il tuo carrello è vuoto!</p>
									<p className="m-0">🥲</p>
								</>
							)}
							{checkout && (
								<>
									<p>Impressiona questi rullini e loro impressioneranno te!</p>
									<p className="m-0">Grazie per l'acquisto!</p>
									<p>😍</p>
									<button
										id={"btnBack"}
										className={"btn btn-primary fw-bold px-5 mt-auto"}
										title="Torna ad acquistare"
										onClick={(e) => onCompletedCheckout(e)}
									>
										Torna ad acquistare
									</button>
								</>
							)}
						</div>
					)}
					{cart?.map((cartElement) => (
						<ShoppingCartElement
							key={`CART-${cartElement.Id}`}
							cartElement={cartElement}
							onRemoveFilm={onRemoveFilm}
						/>
					))}
					{cart.length !== 0 && (
						<li className="list-group-item d-flex flex-column">
							<div className="d-flex justify-content-between my-2">
								<span>Totale (EUR):</span>
								<strong>€ {cartTotalPrice.toFixed(2)}</strong>
							</div>
							<div className="d-flex flex-column">
								<button
									className="btn btn-link fourth-color font-weight-bold p-0 align-self-start"
									title="Svuota il carrello"
									onClick={(e) => onRemoveAll(e)}
								>
									Svuota carrello
								</button>
								<button
									id="btn-acquista"
									className="btn btn-primary fw-bold px-5 mt-3"
									title="Aquista"
									onClick={(e) => onSubmitOrder(e)}
								>
									Acquista
								</button>
							</div>
						</li>
					)}
				</ul>
			</div>
		</div>
	);
};

export default ShoppingCart;
