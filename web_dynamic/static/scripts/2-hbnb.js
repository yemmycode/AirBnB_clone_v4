$(document).ready(function () {
    const amenities = {};

    $("li input[type='checkbox']").on('change', function () {
        const name = this.dataset.name;
        const id = this.dataset.id;
        
        if (this.checked) {
            amenities[name] = id;
        } else {
            delete amenities[name];
        }
        
        $(".amenities h4").text(Object.keys(amenities).sort().join(", "));
    });

    // Retrieve API status
    $.getJSON("http://0.0.0.0:5001/api/v1/status/", function (data) {
        if (data.status === "OK") {
            $("#api_status").addClass("available");
        } else {
            $("#api_status").removeClass("available");
        }
    });
});

