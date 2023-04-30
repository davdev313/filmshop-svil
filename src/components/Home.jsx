/**
 * @author Davide Musarra <davide.musarra@studenti.unime.it>
 */

// import di librerie, componenti e file di configurazione
import React, { useState, useEffect } from "react";
import axios from "axios";
import { CONFIG } from "../utils/config";
import { API } from "../api/api";
import Navbar from "./Navbar";
import Card from "./Card";
import Footer from "./Footer";

const Home = () => {
	const [fetchedFilms, setFetchedFilms] = useState([]); // utile per contenere i rullini che presenti a db
	const [cart, setCart] = useState([]); // utile per contenere i rullini nel carrello presente a db
	const [cartElements, setCartElements] = useState([]); // utile per contenere stato del carrello a run-time
	const [refresh, setRefresh] = useState(0); // utile per aggiornare i dati da visualizzare in pagina
	const [checkout, setCheckout] = useState(false); // utile per gestire messaggio di avvenuto acquisto

	// nell'hook useEffect faccio eseguire le chiamate alle query a backend
	useEffect(() => {
		fetchAllFilms();
		fetchShoppingCart();

		// eslint-disable-next-line
	}, [refresh]);
	// imposto come elemento dell'array delle dipendenze dell'hook useEffect la variabile refresh così da eseguirlo a ogni cambio di stato della variabile

	const getFilmQuantity = (filmId) => {
		const qty = fetchedFilms.find((film) => film.Id === filmId)?.Quantity;	// ottengo la quantità a db dell'elemento selezionato. lo individuo grazie alla funzione find()
		return qty ? qty : 0;
	};

	// metodo utile per gestire l'aggiunta di un prodotto al carrello
	const onAddFilm = (e, selectedFilm) => {
		e.preventDefault();
		setCheckout(false);
		// controllo se l'elemento selezionato è già presente nel carrello
		const exist = cart.find(
			(filmInCart) => filmInCart.FilmId === selectedFilm.Id
		);
		if (!exist) {	// se non esiste, allora cambio stato alla variabile cartElements con i dati del prodotto scelto
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
		} else {	// se esiste, aggiorno la quantità del prodotto da aggiungere al carrello aumentandola di 1
			const newCartElements = cart.map((filmInCart) =>
				filmInCart.FilmId === selectedFilm.Id
					? { ...exist, Quantity: exist.Quantity + 1 }
					: filmInCart
			);
			setCartElements(newCartElements);

			const newCartElement = newCartElements.find(
				(film) => film.FilmId === selectedFilm.Id
			);
			checkInCart(newCartElements, newCartElement);
		}
	};

	// metodo utile per gestire la rimozione di un prodotto al carrello
	const onRemoveFilm = (e, selectedFilm) => {
		e.preventDefault();
		const exist = cartElements.find((el) => el.FilmId === selectedFilm.FilmId);
		if (exist.Quantity === 1) {	// se è l'ultimo elemento, in termine di quantità, di quel rullino nel carrello, allora procedo alla delete
			const newCartElements = cartElements.filter(	// col metodo .filter() faccio in modo di farmi tornare un array contenente tutti i prodotti tranne quello scelto
				(el) => el.FilmId !== selectedFilm.FilmId
			);
			setCartElements(newCartElements);
			checkInCart(
				newCartElements,
				{ ...exist, Quantity: exist.Quantity - 1 },
				true
			);
		} else {	// altimenti procedo solo all'update del record
			const newCartElements = cartElements.map((el) =>	// col metodo .map() scorro, se presente, per elemento singolo tutto l'array a disposizione modificando ciò che mi serve
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

	// metodo utile per gestire lo svuotamento del carrello
	const onRemoveAll = (e) => {
		e.preventDefault();
		const toRemove = cartElements;
		setCartElements([]);	// imposto l'array di elementi del carrello usato a run-time come vuoto
		checkInCart(toRemove, null, false, true);
	};

	// metodo utile per gestire e simulare la sottomissione dell'ordine
	const onSubmitOrder = (e) => {
		e.preventDefault();
		deleteAllApi();	// svuto il carrello eliminandone i record dalla tabella CART
		setCartElements([]);
		setCheckout(true);
	};

	// metodo utile per gestire la chiusura automatica del pannello del carrello una volta sottomesso l'ordine
	const onCompletedCheckout = (e) => {
		e.preventDefault();
		document.getElementById("btn-cart").click();	// simulazione del click
		setCheckout(false);
	};

	// metodo utile per gestire i prodotti nel carrello
	const checkInCart = async (
		cartFilms,
		film,
		isRemove = false,
		isRemoveAll = false
	) => {
		let found = cart.find((cartEl) => cartEl.FilmId === film?.FilmId);
		try {
			if (!found) {	// se non trovo il prodotto selezionato all'interno del carrello, procedo o allo svuotamento del carrello (isRemoveAll = true) o all'inserimento del nuovo prodotto
				if (isRemoveAll) {
					cartFilms.forEach((cartFilm) => {
						cartFilm.Quantity =
							getFilmQuantity(cartFilm.FilmId) + cartFilm.Quantity;
					});
					await (updateFilmApi([...cartFilms]), deleteAllApi());
				} else {
					// INSERT
					await (insertFilmToCartApi(cartFilms),
					updateFilmApi({
						...film,
						Quantity: getFilmQuantity(film.FilmId) - 1,
					}));
				}
			} else {	// se presente, allora ne controllo la quantità
				if (film.Quantity > 0) {	// se maggiore di 0, ne aggiorno la quantità 
					// UPDATE
					await (updateFilmApi({
						...film,
						Quantity: isRemove
							? getFilmQuantity(film.FilmId) + 1
							: getFilmQuantity(film.FilmId) - 1,
					}),
					updateCartApi(film));
				} else {	// altrimenti viene cancellato l'elemento dal carrello e ne viene ripristinata la quantità sulla tabella FILM
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

	// metodo utile per tracciare errori se presenti
	const checkForError = (res) => {
		if (res.data.errno) {
			throw new Error(
				`ERR_CODE: ${res.data.errno}\n--> ERR_MSG: ${res.data.sqlMessage}`
			);
		}
	};

	// metodo utile a gestire la richiesta HTTP di tipo POST
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

	// metodo utile a gestire la richiesta HTTP di tipo PUT per la tabella CART
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

	// metodo utile a gestire la richiesta HTTP di tipo PUT per la tabella FILM
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

	// metodo utile a gestire la richiesta HTTP di tipo DELETE
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

	// metodo utile a gestire la richiesta HTTP di tipo DELETE
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

	// metodo utile a gestire la richiesta HTTP di tipo GET per ottenere i record della tabella FILM
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

	// metodo utile a gestire la richiesta HTTP di tipo GET per ottenere i record della tabella CART
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
					<h1 className="title">Impressive Film Shop 🎞️</h1>
					<p className="lead font-weight-bold">
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
