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

function initMap(address) {
  // Crear un mapa en el contenedor con id "map"
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: address }, function (results, status) {
    if (status == "OK") {
      // Obtener las coordenadas de latitud y longitud
      var latlng = results[0].geometry.location;
      var lat = latlng.lat();
      var lng = latlng.lng();

      // Mostrar un mapa centrado en esas coordenadas
      var mapOptions = {
        center: { lat: lat, lng: lng },
        zoom: 15,
      };
      var map = new google.maps.Map(document.getElementById("map"), mapOptions);

      // Crear un marcador en la ubicación
      var marker = new google.maps.Marker({
        position: { lat: lat, lng: lng },
        map: map,
        title: "Ubicación",
      });
    } else {
      alert("Geocodificación fallida debido a: " + status);
    }
  });
}

function addCard(event) {
  const doctorNameValue = doctorNameEl.value;
  const specialityValue = specialityEl.value;
  const dayValue = dayEl.value;
  const hourValue = hourEl.value;
  const locationValue = locationEl.value;

  event.preventDefault();
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
      <div class = "time-info-app">
        <div class = "time-section-app">
        <h5 class = "next-take">Next appointment</h5>
        <h6>${fechaFormateada}</h6>
        <h2>${hourValue}</h2>
        </div>
        <div class = "info-section-app">
          <h6>Appointment details</h6>
          <h2>${specialityValue}</h2>
          <h3>Dr. ${doctorNameValue}</h3>
          <p id = "locationValue">${locationValue}</p>
        </div>
        </div>
        <div id="map"></div>
    `;
  cardContainer.appendChild(appointmentCard);

  var formulario = document.getElementById("formulario");
  formulario.reset();

  initMap(locationValue);
}

submitBtn.onclick = addCard;
