const medicineNameEl = document.querySelector(".medicine-name");
const diseaseEl = document.getElementById("disease");
const startHourEl = document.getElementById("start-hour");
const startDateEl = document.getElementById("start-date");
const frequencyEl = document.getElementById("frequency");
const durationEl = document.getElementById("duration");
const submitBtnMed = document.getElementById("submit");
const medicationForm = document.getElementById("medication-form");
const addBtn = document.getElementById("add-btn");

const today = dayjs();
$("#current-date").text(today.format("dddd, MMMM D, YYYY"));

addBtn.addEventListener("click", function () {
  if (medicationForm.style.display === "block") {
    medicationForm.style.display = "none";
  } else {
    medicationForm.style.display = "block";
  }
})
function calculateDate(startHour, startDate, frequency, duration) {
  var firstPartHour = startHour.split(":");
  var horaInicio = parseInt(firstPartHour[0]);

  fechasArray = [];
  numberFrequency = Number(frequency);
  fecha = new Date(startDate);
  fecha.setHours(horaInicio);
  horasDias = 24 * duration;
  iterations = horasDias / frequency;
  partIteration = 100 / iterations;
  suma = 0;

  // Push the initial object with start date and start hour
  fechasArray.push({
    dia: `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}`,
    hora: `${fecha.getHours() < 10 ? "0" : ""}${fecha.getHours()}:00`,
    progress: `${suma}`,
  });

  for (var i = 0; i < iterations; i++) {
    fecha.setHours(fecha.getHours() + numberFrequency);
    fechasArray.push({
      dia: `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}`,
      hora: `${fecha.getHours() < 10 ? "0" : ""}${fecha.getHours()}:00`,
      progress: `${(suma += partIteration)}`,
    });
  }
  return fechasArray;
}

function displayCards(medicineName, id) {
  var subContainer = document.getElementById(medicineName);
  var cards = subContainer.querySelectorAll(".medication-card");

  // Retrieve the index of the last displayed card from local storage
  var lastCardIndex =
    parseInt(localStorage.getItem(`${medicineName}_currentCardIndex`)) || 0;

  // Hide all cards except the last displayed card
  for (var i = 0; i < cards.length; i++) {
    if (i !== lastCardIndex) {
      cards[i].style.display = "none";
    }
  }

  var doneBtn = subContainer.querySelectorAll(".doneBtn");
  doneBtn.forEach(function (button, index) {
    button.addEventListener("click", async function () {
      // Hide the current card
      cards[lastCardIndex].style.display = "none";

      // Increment the currentCardIndex
      lastCardIndex = (lastCardIndex + 1) % cards.length;

      localStorage.setItem(`${medicineName}_currentCardIndex`, lastCardIndex);

      if (lastCardIndex === cards.length -1) {
        await deleteProjectById(id);
        cards[lastCardIndex].remove()
        localStorage.removeItem(`${medicineName}_currentCardIndex`);
      }
      // Display the next card
      cards[lastCardIndex].style.display = "flex";
      cards[lastCardIndex].classList.add("card", "card-pop");
    });
  });
}

const newFormHandler = async (
  medicine_name,
  disease,
  start_hour,
  start_date,
  frequency,
  duration
) => {
  if (
    medicine_name &&
    disease &&
    start_hour &&
    start_date &&
    frequency &&
    duration
  ) {
    const response = await fetch(`/api/medications`, {
      method: "POST",
      body: JSON.stringify({
        medicine_name,
        disease,
        start_hour,
        start_date,
        frequency,
        duration,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      alert("Successfully added medication");
    } else {
      alert("Failed to add medication");
    }
  }
};

async function fetchMedications() {
  try {
    const response = await fetch("/api/medications");
    if (!response.ok) {
      throw new Error("Failed to fetch medication");
    }
    const medications = await response.json();
    return medications;
  } catch (error) {
    console.error("Error fetching medications:", error);
    return [];
  }
}

async function deleteProjectById(medicationId) {
  try {
    const response = await fetch(`/api/medications/${medicationId}`, {
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
    console.error("Error deleting medication:", error);
    return false;
  }
}

async function populateCards(start_hour, start_date, frequency, duration) {
  const medications = await fetchMedications();
  medications.map((medication) => {
    const {
      id,
      medicine_name,
      disease,
      start_hour,
      start_date,
      frequency,
      duration,
    } = medication;
    let cardContainer = document.querySelector(".card-container");

    if (document.getElementById(`card-${id}`)) {
      return; // Skip this iteration if the card already exists
    }
    calculateDate(start_hour, start_date, frequency, duration);

    var subCardContainer = document.createElement("div");
    subCardContainer.classList.add(`sub-container-card`);
    subCardContainer.id = `${medicine_name}`;
    fechasArray.forEach(function (item) {
      var medicationCard = document.createElement("div");
      medicationCard.classList.add("medication-card");
      medicationCard.id = `card-${id}`;
      medicationCard.innerHTML = `
        <div class = "time-section">
          <h5 class = "next-take">Next take</h5>
          <h6 class ="date-take" id= "day">${item.dia}</h6>
          <h2 class ="hour-take">${item.hora}</h2>
        </div>
        <div class = "info-section">
          <div class = "progress-wrapper">
            <div class = "progressBar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style = "width: ${
              item.progress
            }%"></div>
            <span class ="progress-text"> ${Math.floor(item.progress)}%</span>
          </div>
          <h2 class = "medicine-name" id= "medicine">${medicine_name}</h2>
          <p class="discomfort" id ="discomfort">${disease}</p>
          <button class="doneBtn">Done</button>
        </div>
      `;
      subCardContainer.appendChild(medicationCard);
      cardContainer.appendChild(subCardContainer);
    });
    displayCards(medicine_name, id);
  });
}

populateCards();

function addTake(event) {
  var medicineName = medicineNameEl.value;
  var disease = diseaseEl.value;
  var startHour = startHourEl.value;
  var startDate = startDateEl.value;
  var frequency = frequencyEl.value;
  var duration = durationEl.value;
  if (
    medicineName === "" ||
    disease === "" ||
    startHour === "" ||
    startDate === "" ||
    frequency === "" ||
    duration === ""
  ) {
    alert("Fill all the boxes");
  } else {
    event.preventDefault();

    newFormHandler(
      medicineName,
      disease,
      startHour,
      startDate,
      frequency,
      duration
    );
    populateCards(startHour, startDate, frequency, duration);

    var formulario = document.getElementById("formulario");
    formulario.reset();
  }
}
submitBtnMed.onclick = addTake;
