import React, { useState, useEffect } from "react";
import axios from "axios";
import { CONFIG } from "../utils/config";
import { API } from "../api/api";
import Navbar from "./Navbar";
import Card from "./Card";
import Footer from "./Footer";

const Home = () => {
	const [fetchedFilms, setFetchedFilms] = useState([]); // per contenere i rullini che vengono dal db
	const [cart, setCart] = useState([]); // per contenere stato del carrello
	const [cartElements, setCartElements] = useState([]); // per contenere stato del carrello
	// const [cartElement, setCartElement] = useState({}); // per contenere [{elemento:id,quantita}] nel carrello che mi servirà per eseguire la post/put a db
	const [refresh, setRefresh] = useState(0);
	const [checkout, setCheckout] = useState(false);

	// Initial state
	useEffect(() => {
		fetchAllFilms();
		fetchShoppingCart();

		// eslint-disable-next-line
	}, [refresh]);

	const getFilmQuantity = (filmId) => {
		const qty = fetchedFilms.find((film) => film.Id === filmId)?.Quantity;
		return qty ? qty : 0;
	};

	const onAddFilm = (e, selectedFilm) => {
		e.preventDefault();
		const exist = cart.find(
			(filmInCart) => filmInCart.FilmId === selectedFilm.Id
		);
		if (!exist) {
			const newCartElements = [
				...cart,
				{
					FilmId: selectedFilm.Id,
					FilmName: selectedFilm.Name,
					Quantity: 1,
					Price: selectedFilm.Price,
				},
			];
			setCartElements(newCartElements);

			const newCartElement = newCartElements.find(
				(film) => film.FilmId === selectedFilm.Id
			);
			// setCartElement(newCartElement);
			checkInCart(newCartElements, newCartElement);
		} else {
			const newCartElements = cart.map((filmInCart) =>
				filmInCart.FilmId === selectedFilm.Id
					? { ...exist, Quantity: exist.Quantity + 1 }
					: filmInCart
			);
			setCartElements(newCartElements);

			const newCartElement = newCartElements.find(
				(film) => film.FilmId === selectedFilm.Id
			);
			// setCartElement(newCartElement);
			checkInCart(newCartElements, newCartElement);
		}
	};

	const onRemoveFilm = (e, selectedFilm) => {
		e.preventDefault();
		const exist = cartElements.find((el) => el.FilmId === selectedFilm.FilmId);
		if (exist.Quantity === 1) {
			const newCartElements = cartElements.filter(
				(el) => el.FilmId !== selectedFilm.FilmId
			);
			setCartElements(newCartElements);
			checkInCart(
				newCartElements,
				{ ...exist, Quantity: exist.Quantity - 1 },
				true
			);
		} else {
			const newCartElements = cartElements.map((el) =>
				el.FilmId === selectedFilm.FilmId
					? { ...exist, Quantity: exist.Quantity - 1 }
					: el
			);
			setCartElements(newCartElements);
			checkInCart(
				newCartElements,
				{ ...exist, Quantity: exist.Quantity - 1 },
				true
			);
		}
	};

	const onRemoveAll = (e) => {
		e.preventDefault();
		const toRemove = cartElements;
		setCartElements([]);
		checkInCart(toRemove, null, false, true);
	};

	const onSubmitOrder = (e) => {
		e.preventDefault();
		deleteAllApi();
		setCartElements([]);
		setCheckout(true);
	};

	const onCompletedCheckout = (e) => {
		e.preventDefault();
		document.getElementById("btn-cart").click();
		setCheckout(false);
	};

	const checkInCart = async (
		cartFilms,
		film,
		isRemove = false,
		isRemoveAll = false,
		submitted = false
	) => {
		let found = cart.find((cartEl) => cartEl.FilmId === film?.FilmId);
		try {
			if (!found) {
				if (isRemoveAll) {
					if (!submitted) {
						cartFilms.forEach((cartFilm) => {
							cartFilm.Quantity =
								getFilmQuantity(cartFilm.FilmId) + cartFilm.Quantity;
						});
						await (updateFilmApi([...cartFilms]), deleteAllApi());
					} else {
					}
				} else {
					// INSERT
					await (insertFilmToCartApi(cartFilms),
					updateFilmApi({
						...film,
						Quantity: getFilmQuantity(film.FilmId) - 1,
					}));
				}
			} else {
				if (film.Quantity > 0) {
					// UPDATE
					await (updateFilmApi({
						...film,
						Quantity: isRemove
							? getFilmQuantity(film.FilmId) + 1
							: getFilmQuantity(film.FilmId) - 1,
					}),
					updateCartApi(film));
				} else {
					// DELETE
					await (updateFilmApi({
						...film,
						Quantity: getFilmQuantity(film.FilmId) + 1,
					}),
					deleteApi(film));
				}
			}
			setRefresh((prev) => prev + 1);
		} catch (error) {
			console.error("error:", error);
		}
	};

	const checkForError = (res) => {
		if (res.data.errno) {
			throw new Error(
				`ERR_CODE: ${res.data.errno}\n--> ERR_MSG: ${res.data.sqlMessage}`
			);
		}
	};

	const insertFilmToCartApi = async (film) => {
		axios
			.post(
				"http://" + CONFIG.HOST + ":" + CONFIG.PORT + API.FILM_TO_CART,
				film
			)
			.then(function (response) {
				checkForError(response);
			})
			.catch((reject) => {
				console.error("reject:", reject);
			});
	};

	const updateCartApi = async (film) => {
		axios
			.put("http://" + CONFIG.HOST + ":" + CONFIG.PORT + API.UPD_CART, film)
			.then(function (response) {
				checkForError(response);
			})
			.catch((reject) => {
				console.error("reject:", reject);
			});
	};

	const updateFilmApi = async (filmToUpdate) => {
		axios
			.put(
				"http://" + CONFIG.HOST + ":" + CONFIG.PORT + API.UPD_FILM,
				filmToUpdate
			)
			.then(function (response) {
				checkForError(response);
			})
			.catch((reject) => {
				console.error("reject:", reject);
			});
	};

	const deleteApi = async (film) => {
		axios
			.delete("http://" + CONFIG.HOST + ":" + CONFIG.PORT + API.RM_FROM_CART, {
				data: film,
			})
			.then(function (response) {
				setRefresh((prev) => prev + 1);
				checkForError(response);
			})
			.catch((reject) => {
				console.error("reject:", reject);
			});
	};

	const deleteAllApi = async () => {
		axios
			.delete(
				"http://" + CONFIG.HOST + ":" + CONFIG.PORT + API.RM_ALL_FROM_CART
			)
			.then(function (response) {
				setRefresh((prev) => prev + 1);
				checkForError(response);
			})
			.catch((reject) => {
				console.error("reject:", reject);
			});
	};

	const fetchAllFilms = async () => {
		try {
			const res = await axios.get(
				"http://" + CONFIG.HOST + ":" + CONFIG.PORT + API.GET_ALL_FILMS
			);
			setFetchedFilms(res.data);
		} catch (error) {
			console.error("no data:", error);
		}
	};

	const fetchShoppingCart = async () => {
		try {
			const res = await axios.get(
				"http://" + CONFIG.HOST + ":" + CONFIG.PORT + API.GET_CART
			);
			if (res.data && res.data.value === undefined) {
				setCart(res.data);
				setCartElements(res.data);
			}
		} catch (error) {
			console.error("no data:", error);
		}
	};

	return (
		<>
			<Navbar
				cart={cartElements}
				onRemoveFilm={onRemoveFilm}
				onRemoveAll={onRemoveAll}
				onSubmitOrder={onSubmitOrder}
				checkout={checkout}
				onCompletedCheckout={onCompletedCheckout}
			/>
			<main className="container">
				<div className="text-center my-5 d-flex flex-column justify-content-center text-muted-white">
					<h1>Analogic Film Shop 🎞️</h1>
					<p className="lead">
						Questi rullini aspettano solo di essere impressionati!
					</p>
				</div>
				<div className="row d-flex flex-wrap">
					{fetchedFilms?.map((fetchedFilm) => (
						<Card
							key={fetchedFilm.Id}
							fetchedFilm={fetchedFilm}
							onAddFilm={onAddFilm}
						/>
					))}
				</div>
			</main>
			<Footer />
		</>
	);
};

export default Home;
