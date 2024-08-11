$(document).ready(function () {
	const HOST = "http://127.0.0.1:5001";
	const amenities = {};
	const cities = {};
	const states = {};

	$('ul li input[type="checkbox"]').on("change", (e) => {
		const element = e.target;
		let targetDict;
		switch (element.id) {
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
		if (element.checked) {
			targetDict[element.dataset.name] = element.dataset.id;
		} else {
			delete targetDict[element.dataset.name];
		}
		if (element.id === "amenity_filter") {
			$(".amenities h4").text(Object.keys(amenities).sort().join(", "));
		} else {
			$(".locations h4").text(
				Object.keys({ ...states, ...cities }).sort().join(", ")
			);
		}
	});

	// Check API status
	$.getJSON("http://0.0.0.0:5001/api/v1/status/", (data) => {
		if (data.status === "OK") {
			$("div#api_status").addClass("available");
		} else {
			$("div#api_status").removeClass("available");
		}
	});

	// Retrieve and display places data
	$.post({
		url: `${HOST}/api/v1/places_search`,
		data: JSON.stringify({}),
		headers: {
			"Content-Type": "application/json",
		},
		success: (data) => {
			data.forEach((place) =>
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
				)
			);
		},
		dataType: "json",
	});

	// Search for places when the button is clicked
	$(".filters button").on("click", searchPlace);
	searchPlace();


	 // Fetch and display filtered places
	 function searchPlace() {
		$.post({
		  url: `${HOST}/api/v1/places_search`,
		  data: JSON.stringify({
			amenities: Object.values(amenities),
			states: Object.values(states),
			cities: Object.values(cities),
		  }),
		  headers: {
			"Content-Type": "application/json",
		  },
		  success: (data) => {
			$("section.places").empty();
			data.forEach((d) => console.log(d.id));
			data.forEach((place) => {
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
					  <div class="number_bathrooms">${
						place.number_bathrooms
					  } Bathroom${place.number_bathrooms !== 1 ? "s" : ""}</div>
				  </div> 
				  <div class="description">
					${place.description}
				  </div>
				  <div class="reviews" data-place="${place.id}">
					<h2></h2>
					<ul></ul>
				  </div>
				</article>`
			  );
			  fetchReviews(place.id);
			});
		  },
		  dataType: "json",
		});
	  }
	
	  function fetchReviews(placeId) {
		$.getJSON(
		  `${HOST}/api/v1/places/${placeId}/reviews`,
		  (data) => {
			$(`.reviews[data-place="${placeId}"] h2`)
			  .text(`${data.length} Reviews`)
			  .html(`<span id="toggle_review">show</span>`);
			$(`.reviews[data-place="${placeId}"] h2 #toggle_review`).on(
			  "click",
			  { placeId },
			  function (e) {
				const reviewList = $(`.reviews[data-place="${e.data.placeId}"] ul`);
				if (reviewList.css("display") === "none") {
				  reviewList.css("display", "block");
				  data.forEach((review) => {
					$.getJSON(
					  `${HOST}/api/v1/users/${review.user_id}`,
					  (user) =>
						$(".reviews ul").append(`
					  <li>
						<h3>From ${user.first_name} ${user.last_name} on ${
						  review.created_at
						}</h3>
						<p>${review.text}</p>
					  </li>`),
					  "json"
					);
				  });
				} else {
				  reviewList.css("display", "none");
				}
			  }
			);
		  },
		  "json"
		);
	  }
});
