const Card = (props) => {
	const { fetchedFilm, onAddFilm } = props;

	return (
		<div className="col mb-5 d-flex justify-content-center flex-1">
			<div className="card">
				<div className="d-flex justify-content-center">
					<img
						src={fetchedFilm.ImageUrl}
						className="card-img-top pe-none picture"
						alt={fetchedFilm.Name}
					/>
				</div>
				<div className="card-body bg-third-color d-flex flex-column">
					<div className="d-flex justify-content-between">
						<h5 className="card-title m-0 lh-inherit font-weight-bold fifth-color">
							{fetchedFilm.Name.replaceAll("_", " ")}
						</h5>
						<p className="cart-text text-center m-0 fw-bold badge bg-fourth-color fs-6 h-fc">
							€ {fetchedFilm.Price}
						</p>
					</div>
					<p className="card-text my-3 text-justify mb-4 fifth-color">
						{fetchedFilm.Description}
					</p>
					{/* <p className="">
						Quantità:&nbsp;
						<span id={"quantity-" + fetchedFilm.Id}>
							{fetchedFilm.Quantity}
						</span>
					</p> */}
					<button
						id={"btn-" + fetchedFilm.Id}
						className={
							"btn btn-primary fw-bold px-5 mt-auto" +
							(fetchedFilm.Quantity === 0 ? " disabled pe-none" : "")
						}
						title="Aggiungi al carrello"
						onClick={(e) => onAddFilm(e, fetchedFilm)}
					>
						{fetchedFilm.Quantity !== 0 ? "Aggiungi al carrello" : "SOLD OUT"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default Card;
