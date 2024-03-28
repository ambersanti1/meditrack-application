const today = dayjs();
$("#current-date").text(today.format("dddd, MMMM D, YYYY"));

//Scrollable menu

const medicationForm = document.getElementById("medication-form");

const addBtn = document.getElementById("add-btn");

addBtn.addEventListener("click", function () {
  if (medicationForm.style.display === "block") {
    medicationForm.style.display = "none";
  } else {
    medicationForm.style.display = "block";
  }
});

const doctorNameEl = document.getElementById("doctor-name");
const specialityEl = document.getElementById("speciality");
const dayEl = document.getElementById("day");
const hourEl = document.getElementById("hour");
const locationEl = document.getElementById("search_input");
const submitBtn = document.getElementById("submit");

let mapCount = 0; // Counter for generating unique map IDs

function initMap(address, mapId) {
  // Create a unique ID for the map container
  const mapContainerId = "map-" + mapId;

  // Create a new map container with the unique ID
  const mapDiv = document.createElement("div");
  mapDiv.id = mapContainerId;
  document.querySelector(".card-container").appendChild(mapDiv);

  // Create a new map in the container
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: address }, function (results, status) {
    if (status == "OK") {
      var latlng = results[0].geometry.location;
      var mapOptions = {
        center: latlng,
        zoom: 15,
      };
      var map = new google.maps.Map(
        document.getElementById(mapContainerId),
        mapOptions
      );
      var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: "Location",
      });
    } else {
      alert("Location not found");
    }
  });
}

function addCard(event) {
  const doctorNameValue = doctorNameEl.value;
  const specialityValue = specialityEl.value;
  const dayValue = dayEl.value;
  const hourValue = hourEl.value;
  const locationValue = locationEl.value;

  if (
    doctorNameValue === "" ||
    specialityValue === "" ||
    dayValue === "" ||
    hourValue === "" ||
    locationValue === ""
  ) {
    alert("Fill all the boxes");
  } else {
    event.preventDefault();

    // Use Google Maps Geocoding API to validate the location
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: locationValue }, function (results, status) {
      if (status == "OK" && results.length > 0) {
        // Location is valid, proceed with adding the appointment card and map
        mapCount++; // Increment the map counter for a new map
        var fechaString = dayValue;
        var fecha = new Date(fechaString);
        var meses = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        var nombreMes = meses[fecha.getMonth()];
        var dia = fecha.getDate();
        var año = fecha.getFullYear();
        var fechaFormateada = nombreMes + " " + dia + " " + año;

        let cardContainer = document.querySelector(".card-container");
        var appointmentCard = document.createElement("div");
        appointmentCard.classList.add("appointment-card");
        appointmentCard.innerHTML = `
          <div class="time-info-app">
            <div class="time-section-app">
              <h5 class="next-take">Next appointment</h5>
              <h6 class="date-take">${fechaFormateada}</h6>
              <h2 class="hour-take">${hourValue}</h2>
            </div>
            <div class="info-section-app">
              <h6 class="appt-details">Appointment details</h6>
              <h3 class="speciality">${specialityValue}</h3>
              <h2 class ="doctor-name">Dr. ${doctorNameValue}</h2>
              <p class="location" id="locationValue">${locationValue}</p>
            </div>
          </div>
          <div class = "map" id="map-${mapCount}"></div>
        `;
        cardContainer.appendChild(appointmentCard);

        // Initialize the map for the added location
        initMap(locationValue, mapCount);

        // Reset the form
        var formulario = document.getElementById("formulario");
        formulario.reset();
      } else {
        // Location is invalid, display an alert
        alert("Location not found or invalid");
      }
    });
  }
}

submitBtn.onclick = addCard;
