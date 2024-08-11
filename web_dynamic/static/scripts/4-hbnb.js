$(document).ready(function () {
	const amenities = {};
	$("li input[type=checkbox]").on("change", function () {
		if (this.checked) {
			amenities[$(this).data("name")] = $(this).data("id");
		} else {
			delete amenities[$(this).data("name")];
		}
		$(".amenities h4").text(Object.keys(amenities).sort().join(", "));
	});

	// Check API status
	$.getJSON("http://0.0.0.0:5001/api/v1/status/", function (data) {
		if (data.status === "OK") {
			$("#api_status").addClass("available");
		} else {
			$("#api_status").removeClass("available");
		}
	});

	// Retrieve place data
	$.ajax({
		type: "POST",
		url: `${HOST}/api/v1/places_search`,
		data: JSON.stringify({}),
		contentType: "application/json",
		success: function (data) {
			$.each(data, function (index, place) {
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

	// Search places
	$(".filters button").on("click", searchPlace);
	searchPlace();
});
