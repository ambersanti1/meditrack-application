const medicationForm = document.getElementById("medication-form");
const addBtn = document.getElementById("add-btn");
const doctorNameEl = document.getElementById("doctor-name");
const specialityEl = document.getElementById("speciality");
const dayEl = document.getElementById("day");
const hourEl = document.getElementById("hour");
const locationEl = document.getElementById("search_input");
const submitBtn = document.getElementById("submit");

const today = dayjs();
$("#current-date").text(today.format("dddd, MMMM D, YYYY"));

//Scrollable menu

addBtn.addEventListener("click", function () {
  if (medicationForm.style.display === "block") {
    medicationForm.style.display = "none";
  } else {
    medicationForm.style.display = "block";
  }
});

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

const newFormHandler = async (
  doctor_name,
  speciality,
  date,
  hour,
  location
) => {
  if (doctor_name && speciality && date && hour && location) {
    const response = await fetch(`/api/projects`, {
      method: "POST",
      body: JSON.stringify({
        doctor_name,
        speciality,
        date,
        hour,
        location,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Successfully added appointment");
    } else {
      alert("Failed to add appointment");
    }
  }
};

async function fetchAppointments() {
  try {
    const response = await fetch("/api/projects");
    if (!response.ok) {
      throw new Error("Failed to fetch appointments");
    }
    const appointments = await response.json();
    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }
}

async function deleteProjectById(projectId) {
  try {
    const response = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      throw new Error(errorMessage.message);
    }
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    return false;
  }
}

const addDate = (dayValue) => {
  var fecha = new Date(dayValue);
  var months = [
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
  var nameMonth = months[fecha.getMonth()];
  var day = fecha.getDate() + 1;
  var year = fecha.getFullYear();
  var date = nameMonth + " " + day + " " + year;
  return date;
};

async function populateCards(dayValue, location, mapCount) {
  const appointments = await fetchAppointments();
  appointments.map((appointment) => {
    const { id, doctor_name, date, speciality, hour, location } = appointment;
    mapCount = id;
    const formatDate = addDate(date);
    let cardContainer = document.querySelector(".card-container");

    if (document.getElementById(`card-${id}`)) {
      return; // Skip this iteration if the card already exists
    }

    var appointmentCard = document.createElement("div");
    appointmentCard.classList.add("appointment-card");
    appointmentCard.id = `card-${id}`;
    appointmentCard.innerHTML = `
    <div class="time-info-app">
    <div class="time-section-app">
      <h5 class="next-take">Next appointment</h5>
      <h6 class="date-take">${formatDate}</h6>
      <h2 class="hour-take">${hour}</h2>
    </div>
    <div class="info-section-app">
      <h6 class="appt-details">Appointment details</h6>
      <h3 class="speciality">${speciality}</h3>
      <h2 class ="doctor-name">Dr. ${doctor_name}</h2>
      <p class="location" id="location">${location}</p>
      <button class="doneBtn">Done</button>
    </div>
    </div>
    <div class = "map" id="map-${mapCount}"></div>
    `;
    cardContainer.appendChild(appointmentCard);

    initMap(location, mapCount);

    const doneBtnApp = appointmentCard.querySelector(".doneBtn");
    doneBtnApp.addEventListener("click", async function () {
      await deleteProjectById(id); // Wait for the deletion to complete
      appointmentCard.remove();
    });
  });
}

populateCards(location);

async function addCard(event) {
  const doctor_name = doctorNameEl.value;
  const speciality = specialityEl.value;
  const dayValue = dayEl.value;
  const hour = hourEl.value;
  const location = locationEl.value;

  if (
    doctor_name === "" ||
    speciality === "" ||
    dayValue === "" ||
    hour === "" ||
    location === ""
  ) {
    alert("Fill all the boxes");
  } else {
    event.preventDefault();

    // Use Google Maps Geocoding API to validate the location
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: location }, function (results, status) {
      if (status == "OK" && results.length > 0) {

        await newFormHandler(
          doctor_name,
          speciality,
          addDate(dayValue),
          hour,
          location
        );

        await populateCards(dayValue, location, mapCount);

        var formulario = document.getElementById("formulario");
        formulario.reset();

      } else {
        alert("Location not found or invalid");
      }
    });
  }
}

submitBtn.onclick = addCard;
