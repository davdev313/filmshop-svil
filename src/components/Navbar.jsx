/**
 * @author Davide Musarra <davide.musarra@studenti.unime.it>
 */

import logo from "../assets/images/icons/noun-roll-film-2175698.png";
import shoppingCart from "../assets/images/icons/noun-cart-2175616.png";
import ShoppingCart from "./ShoppingCart";

const Navbar = (props) => {
	const {
		cart,
		onRemoveFilm,
		onRemoveAll,
		onSubmitOrder,
		checkout,
		onCompletedCheckout,
	} = props; // destructuring dell'oggetto props
	/* 	
		con .reduce() scorro l'array sommando a total il prezzo dell'elemento corrente (currentPrice)
		ottenendo la somma totale dei prezzi degli elementi nel carrello.
		Imposto a 0 il valore iniziale cosicché al primo giro total sarà uguale a 0
	*/
	const cartTotalItems = cart.reduce(
		(total, currentPrice) => total + currentPrice.Quantity,
		0
	);

	return (
		<header>
			<nav className="navbar navbar-dark bg-first-color fixed-top">
				<div className="container">
					<a
						className="navbar-brand me-auto title-link"
						href="/"
						title="Film Shop"
					>
						<img
							src={logo}
							alt="Logo"
							width="30"
							height="24"
							className="d-inline-block invert mx-1 pe-none"
						/>
						Impressive Film Shop
					</a>
					<button
						id="btn-cart"
						title="Carrello"
						className="btn"
						type="button"
						data-bs-toggle="offcanvas"
						data-bs-target="#offcanvasRight"
						aria-controls="offcanvasRight"
					>
						<img
							src={shoppingCart}
							alt="Cart"
							width="32"
							height="32"
							className="d-inline-block invert pe-none"
						/>
						<span
							className={
								"position-absolute top-50 translate-middle badge rounded-pill bg-fourth-color cart-fs-12 " +
								(cartTotalItems > 0 ? "" : "d-none")
							}
						>
							{cartTotalItems}
						</span>
					</button>
					<div
						className="offcanvas offcanvas-end offcanvas offcanvas-end d-flex flex-column flex-shrink-0 p-3 text-bg-first-color overflow-auto"
						tabIndex="-1"
						id="offcanvasRight"
						aria-labelledby="offcanvasRightLabel"
					>
						<ShoppingCart
							cart={cart}
							cartTotalItems={cartTotalItems}
							onRemoveFilm={onRemoveFilm}
							onRemoveAll={onRemoveAll}
							onSubmitOrder={onSubmitOrder}
							checkout={checkout}
							onCompletedCheckout={onCompletedCheckout}
						/>
					</div>
				</div>
			</nav>
		</header>
	);
};

export default Navbar;
