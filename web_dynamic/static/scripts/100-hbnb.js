$(document).ready(function () {
	const HOST = "http://127.0.0.1:5001";
	const amenities = {};
	const cities = {};
	const states = {};

	$('ul li input[type="checkbox"]').on("change", function (e) {
		const el = e.target;
		let targetDict;

		switch (el.id) {
			case "state_filter":
				targetDict = states;
				break;
			case "city_filter":
				targetDict = cities;
				break;
			case "amenity_filter":
				targetDict = amenities;
				break;
		}

		if (el.checked) {
			targetDict[el.dataset.name] = el.dataset.id;
		} else {
			delete targetDict[el.dataset.name];
		}

		if (el.id === "amenity_filter") {
			$(".amenities h4").text(Object.keys(amenities).sort().join(", "));
		} else {
			$(".locations h4").text(
				Object.keys({ ...states, ...cities }).sort().join(", ")
			);
		}
	});

	// Check the status of the API
	$.getJSON("http://0.0.0.0:5001/api/v1/status/", function (data) {
		if (data.status === "OK") {
			$("#api_status").addClass("available");
		} else {
			$("#api_status").removeClass("available");
		}
	});

	// Fetch data about places
	$.ajax({
		type: "POST",
		url: `${HOST}/api/v1/places_search`,
		data: JSON.stringify({}),
		contentType: "application/json",
		success: function (data) {
			data.forEach(function (place) {
				$("section.places").append(
					`<article>
						<div class="title_box">
							<h2>${place.name}</h2>
							<div class="price_by_night">$${place.price_by_night}</div>
						</div>
						<div class="information">
							<div class="max_guest">${place.max_guest} Guest${
								place.max_guest !== 1 ? "s" : ""
							}</div>
							<div class="number_rooms">${place.number_rooms} Bedroom${
								place.number_rooms !== 1 ? "s" : ""
							}</div>
							<div class="number_bathrooms">${place.number_bathrooms} Bathroom${
								place.number_bathrooms !== 1 ? "s" : ""
							}</div>
						</div> 
						<div class="description">
							${place.description}
						</div>
					</article>`
				);
			});
		},
		dataType: "json",
	});

	// Search places on button click
	$(".filters button").on("click", searchPlace);
	searchPlace();
});
