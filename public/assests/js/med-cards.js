const medicineNameEl = document.querySelector(".medicine-name");
const diseaseEl = document.getElementById("disease");
const startHourEl = document.getElementById("start-hour");
const startDateEl = document.getElementById("start-date");
const frequencyEl = document.getElementById("frequency");
const durationEl = document.getElementById("duration");
const submitBtnMed = document.getElementById("submit");
const medicationForm = document.getElementById("medication-form");
const addBtn = document.getElementById("add-btn");

// DISPLAY CURRENT DAY
const today = dayjs();
$("#current-date").text(today.format("dddd, MMMM D, YYYY"));
let cardContainer = document.querySelector(".card-container");

//HIDE AND SHOW MEDICATION FORM
addBtn.addEventListener("click", function () {
  if (medicationForm.style.display === "block") {
    medicationForm.style.display = "none";
  } else {
    medicationForm.style.display = "block";
  }
});

// POST INFO TRIAL
const postMedication = async (medicine_name, disease, dia, hora, progress) => {
  const response = await fetch(`/api/meds`, {
    method: "POST",
    body: JSON.stringify({
      medicine_name,
      disease,
      dia,
      hora,
      progress,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

async function getMedications() {
  try {
    const response = await fetch("/api/meds");
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

async function deleteMedications(medicationId) {
  try {
    const response = await fetch(`/api/meds/${medicationId}`, {
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

//CALCULATE MEDICATION TREATMENT FREQUENCY
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
    dia: `${fecha.getDate() +1}-${fecha.getMonth() + 1}-${fecha.getFullYear()}`,
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

const noMedDiv = document.createElement("div");
const noMedText = document.createElement("p");
noMedDiv.classList.add("noMedDiv");
noMedText.textContent = "No medications registered yet";
const medFormCard = document.querySelector(".med-form-card");

async function addCard() {
  var medicineName = medicineNameEl.value;
  var disease = diseaseEl.value;
  var startHour = startHourEl.value;
  var startDate = startDateEl.value;
  var frequency = frequencyEl.value;
  var duration = durationEl.value;
  if (
    medicineName &&
    disease &&
    startHour &&
    startDate &&
    frequency &&
    duration
  ) {

      var existingCards = document.querySelectorAll(".medicine-name");
      var medicineNameExists = Array.from(existingCards).some(
        (card) => card.textContent === medicineName
      );

      if (medicineNameExists) {
        alert(
          "You already have a treatment with that medicine"
        );
        return;
      }

      var cardContainer = document.querySelector(".card-container");

      calculateDate(startHour, startDate, frequency, duration);

      var medicineCardMap = new Map();

      // Map each async operation to a promise
      var postRequests = fechasArray.map(async function (item) {
        return postMedication(
          medicineName,
          disease,
          item.dia,
          item.hora,
          item.progress
        );
      });

      // Wait for all async operations to complete
      await Promise.all(postRequests);

      // Reload the page after all data is posted
      location.reload();
    
  } else {
    alert("Fill all the boxes");
  }
}

async function showCards() {
  const meds = await getMedications();

  let cardContainer = document.querySelector(".card-container");
  if (meds.length === 0) {
    cardContainer.innerHTML = "";
    cardContainer.appendChild(noMedDiv);
    noMedDiv.appendChild(noMedText);
    return; // Exit the function early if there are no medications
  }

  meds.sort((a, b) => a.progress - b.progress);
  
  cardContainer.innerHTML = "";

  var medicineCardMap = new Map();

  meds.forEach((med) => {
    med
    const { id, medicine_name, disease, dia, hora, progress } = med;
    var medicationCard = document.createElement("div");
    medicationCard.classList.add("medication-card");
    medicationCard.id = `${id}`;
    medicationCard.innerHTML = `
        <div class = "time-section">
          <h5 class = "next-take">Next take</h5>
          <h6 class ="date-take" id= "day">${dia}</h6>
          <h2 class ="hour-take">${hora}</h2>
        </div>
        <div class = "info-section">
          <div class = "progress-wrapper">
            <div class = "progressBar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style = "width: ${progress}%"></div>
            <span class ="progress-text"> ${Math.floor(progress)}%</span>
          </div>
          <h2 class = "medicine-name" id= "medicine">${medicine_name}</h2>
          <p class="discomfort" id ="discomfort">${disease}</p>
          <button class="doneBtn">Done</button>
        </div>
      `;
      if (!medicineCardMap.has(medicine_name)) {
        medicineCardMap.set(medicine_name, []);
      }
      medicineCardMap.get(medicine_name).push(medicationCard);
  });
      medicineCardMap.forEach(function (cards, medicine_name) {
        var subCardContainer = document.createElement("div");
        subCardContainer.classList.add(`sub-container-card`);
        subCardContainer.id = `${medicine_name}`;
        cards.forEach(function (card) {
          subCardContainer.appendChild(card);
        });
        cardContainer.appendChild(subCardContainer);
      });
      medicineCardMap.forEach(function (cards, medicine_name) {
        displayCards(medicine_name);
      });
}

showCards()

async function displayCards(medicineName) {
  var subContainer = document.getElementById(medicineName);
  var cards = subContainer.querySelectorAll(".medication-card");
  var cardIndex = 0;

  // Hide all cards except the last displayed card
  for (var i = 1; i < cards.length; i++) {
      cards[i].style.display = "none";
  }

  var doneBtn = subContainer.querySelectorAll(".doneBtn");
  doneBtn.forEach( async function (button, index) {
    button.addEventListener("click", async function () {
      // Hide the current card
      var id = button.closest(".medication-card").id; // Get the ID of the parent card
      await deleteMedications(id);
      cards[cardIndex].remove();

      // Increment the currentCardIndex
      cardIndex = (cardIndex + 1) % cards.length;

      // Display the next card
      cards[cardIndex].style.display = "flex";
      cards[cardIndex].classList.add("card", "card-pop");
    });
  });
}
    
    submitBtnMed.onclick = addCard;
