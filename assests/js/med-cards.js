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
});

function calculateDate (startHour,startDate, frequency, duration) {
  var firstPartHour = startHour.split(":");
  var horaInicio = parseInt(firstPartHour[0]);
  
  fechasArray = [];
  numberFrequency = Number(frequency);
  fecha = new Date(startDate);
  fecha.setHours(horaInicio);
  horasDias = 24 * duration;
  iterations = horasDias / frequency;
  partIteration = 100/iterations;
  suma = 0
  console.log(partIteration)

  for (var i = 0; i < iterations; i++) {
    fecha.setHours(fecha.getHours() + numberFrequency);
    fechasArray.push({
      dia: `${fecha.getDate()}-${fecha.getMonth() + 1}-${fecha.getFullYear()}`,
      hora: `${fecha.getHours() < 10 ? "0" : ""}${fecha.getHours()}:00`,
      progress: `${suma += partIteration}`,
    });

  }
  return fechasArray
  return console.log(fechasArray)
}

function displayCards(medicineName) {
  var subContainer = document.getElementById(medicineName);
  var cards = subContainer.querySelectorAll(".medication-card");
  var currentCardIndex = 0;
  // Hide all cards except the first one
  for (var i = 1; i < cards.length; i++) {
    cards[i].style.display = "none";
  }
  
  // Add click event listeners to each card

  var doneBtn = subContainer.querySelectorAll(".doneBtn");
  doneBtn.forEach(function (button, index) {
    button.addEventListener("click", function () {

      // Hide the current card
      cards[currentCardIndex].remove();
      
      // Increment the currentCardIndex
      currentCardIndex = (currentCardIndex + 1) % cards.length;
      
      // Display the next card
      cards[currentCardIndex].style.display = "flex";
      cards[currentCardIndex].classList.add("card","card-pop");

    });
  });
}

function addTake(event) {

  event.preventDefault();
  var medicineName = medicineNameEl.value;
  var disease = diseaseEl.value;
  var startHour = startHourEl.value;
  var startDate = startDateEl.value;
  var frequency = frequencyEl.value;
  var duration = durationEl.value;

  calculateDate(startHour, startDate, frequency, duration);

  var addResult = {
    medicineName: medicineName,
    disease: disease,
  };

    const stringObject = JSON.stringify(addResult);
    console.log(stringObject);
    localStorage.setItem("addResult", stringObject);
    const addResultsFromStorage = localStorage.getItem("addResult");
    const objectParsed = JSON.parse(addResultsFromStorage);

    var cardContainer = document.querySelector(".card-container");
    var subCardContainer = document.createElement("div");
    subCardContainer.classList.add(`sub-container-card`);
    subCardContainer.id = `${medicineName}`;
    fechasArray.forEach(function (item) {
    var medicationCard = document.createElement("div");
    medicationCard.classList.add("medication-card");

    medicationCard.innerHTML = `
          <div class = "time-section">
            <h5 class = "next-take">Next take</h5>
            <h6 class ="date-take" id= "day">${item.dia}</h6>
            <h2 class ="hour-take">${item.hora}</h2>
          </div>
          <div class = "info-section">
            <div class = "progress-wrapper">
              <div class = "progressBar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style = "width: ${item.progress}%"></div>
              <span class ="progress-text"> ${Math.floor(item.progress)}%</span>
            </div>
            <h2 id= "medicine">${addResult.medicineName}</h2>
            <p id ="discomfort" class="p-trunc">${addResult.disease}</p>
            <button class="doneBtn">Done</button>
          </div>
      `;
    subCardContainer.appendChild(medicationCard);
    cardContainer.appendChild(subCardContainer)
  });

  var formulario = document.getElementById("formulario");
  formulario.reset();

  displayCards(medicineName);

}
submitBtnMed.onclick = addTake;

