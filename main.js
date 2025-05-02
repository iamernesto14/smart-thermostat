// Room objects

let rooms = [];
loadRoomsFromLocalStorage();
function loadRoomsFromLocalStorage() {
  const storedRooms = localStorage.getItem('rooms');
  if (storedRooms) { rooms = JSON.parse(storedRooms).map(room => ({
    ...room,
    setCurrTemp(temp) { this.currTemp = temp; },
    setColdPreset(temp) { this.coldPreset = temp; },
    setWarmPreset(temp) { this.warmPreset = temp; },
    increaseTemp() { this.currTemp++; },
    decreaseTemp() { this.currTemp--; },
    toggleAircon() { this.airConditionerOn = !this.airConditionerOn; }
  }));
} else {
rooms = [
  {
    name: "Living Room",
    currTemp: 32,
    coldPreset: 20,
    warmPreset: 32,
    image: "./assets/living-room.jpg",
    airConditionerOn: false,
    startTime: '16:30',
    endTime: '20:00',

    setCurrTemp(temp) {
      this.currTemp = temp;
    },

    setColdPreset(newCold) {
      this.coldPreset = newCold;
    },

    setWarmPreset(newWarm) {
      this.warmPreset = newWarm;
    },

    decreaseTemp() {
      this.currTemp--;
    },

    increaseTemp() {
      this.currTemp++;
    },
    toggleAircon() {
      this.airConditionerOn = !this.airConditionerOn;
    },
  },
  {
    name: "Kitchen",
    currTemp: 29,
    coldPreset: 20,
    warmPreset: 32,
    image: "./assets/kitchen.jpg",
    airConditionerOn: false,
    startTime: '16:30',
    endTime: '20:00',

    setCurrTemp(temp) {
      this.currTemp = temp;
    },

    setColdPreset(newCold) {
      this.coldPreset = newCold;
    },

    setWarmPreset(newWarm) {
      this.warmPreset = newWarm;
    },

    decreaseTemp() {
      this.currTemp--;
    },

    increaseTemp() {
      this.currTemp++;
    },
    toggleAircon() {
      this.airConditionerOn = !this.airConditionerOn;
    },
  },
  {
    name: "Bathroom",
    currTemp: 30,
    coldPreset: 20,
    warmPreset: 32,
    image: "./assets/bathroom.jpg",
    airConditionerOn: false,
    startTime: '16:30',
    endTime: '20:00',

    setCurrTemp(temp) {
      this.currTemp = temp;
    },

    setColdPreset(newCold) {
      this.coldPreset = newCold;
    },

    setWarmPreset(newWarm) {
      this.warmPreset = newWarm;
    },

    decreaseTemp() {
      this.currTemp--;
    },

    increaseTemp() {
      this.currTemp++;
    },
    toggleAircon() {
      this.airConditionerOn = !this.airConditionerOn;
    },
  },
  {
    name: "Bedroom",
    currTemp: 31,
    coldPreset: 20,
    warmPreset: 32,
    image: "./assets/bedroom.jpg",
    airConditionerOn: false,
    startTime: '16:30',
    endTime: '20:00',

    setCurrTemp(temp) {
      this.currTemp = temp;
    },

    setColdPreset(newCold) {
      this.coldPreset = newCold;
    },

    setWarmPreset(newWarm) {
      this.warmPreset = newWarm;
    },

    decreaseTemp() {
      this.currTemp--;
    },

    increaseTemp() {
      this.currTemp++;
    },
    toggleAircon() {
      this.airConditionerOn = !this.airConditionerOn;
    },
  }
];
saveRoomsToLocalStorage();
}
}
loadRoomsFromLocalStorage(); // Load rooms from local storage on page load

// Save rooms to local storage
function saveRoomsToLocalStorage() {
  localStorage.setItem('rooms', JSON.stringify(rooms));
}

const warmOverlay = [
  'rgba(242, 39, 42, 0.31)', // top
  'rgba(248, 210, 211, 0.13)' // bottom
];
const coolOverlay = [
  'rgba(141, 159, 247, 0.31)',
  'rgba(194, 197, 215, 0.1)'
];


// Initialize overlay for first room
const setInitialOverlay = () => {
  const roomElement = document.querySelector(".room");
  roomElement.style.backgroundImage = `url('${rooms[0].image}'), ${
    rooms[0].currTemp < 25 ? coolOverlay : warmOverlay
  }`;
};

// Set overlay based on temperature
const setOverlay = (room) => {
  const roomElement = document.querySelector(".room");
  const overlay = room.currTemp <= 24 ? coolOverlay : warmOverlay;

  roomElement.style.backgroundImage = `
    linear-gradient(to bottom, ${overlay[0]}, ${overlay[1]}),
    url('${room.image}')
  `;
  roomElement.style.backgroundRepeat = 'no-repeat';
  roomElement.style.backgroundSize = 'cover';
  roomElement.style.backgroundPosition = 'center';
};

// Temperature indicator calculations
const svgPoint = document.querySelector(".point");
const angleOffset = 86;
const calculatePointPosition = (currTemp) => {
  const normalizedTemp = (currTemp - 10) / (32 - 10);
  const angle = normalizedTemp * 180 + angleOffset;
  const radians = (angle * Math.PI) / 180;
  const radius = 116;
  return {
    translateX: radius * Math.cos(radians),
    translateY: radius * Math.sin(radians)
  };
};

const setIndicatorPoint = (currTemp) => {
  const position = calculatePointPosition(currTemp);
  svgPoint.style.transform = `translate(${position.translateX}px, ${position.translateY}px)`;
};

function showToast(message) {
  const toast = document.getElementById("toaster");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // Hide after 3 seconds
}


// Room Selection Functionality
const roomSelect = document.getElementById("rooms");
const currentTempDisplay = document.getElementById("temp");
let selectedRoom = rooms[0];

function initializeRoomSelection() {
  roomSelect.innerHTML = '';
  rooms.forEach(room => {
    const option = document.createElement("option");
    option.value = room.name;
    option.textContent = room.name;
    roomSelect.appendChild(option);
  });
  roomSelect.value = selectedRoom.name;
  updateRoomUI(selectedRoom);
}

function updateRoomUI(room) {
  document.querySelectorAll(".room-control").forEach(card => {
    card.classList.remove("selected");
    if (card.id === room.name) {
      card.classList.add("selected");
    }
  });

  // Update all temperature displays
  currentTempDisplay.textContent = `${room.currTemp}°`;
  document.querySelector(".currentTemp").textContent = `${room.currTemp}°`;
  document.querySelector(".room-name").textContent = room.name;
  
  // Update visual elements
  setOverlay(room);
  setIndicatorPoint(room.currTemp);
}

roomSelect.addEventListener("change", function() {
  selectedRoom = rooms.find(room => room.name === this.value);
  if (selectedRoom) updateRoomUI(selectedRoom);
});

// Temperature Controls
document.getElementById("increase").addEventListener("click", () => {
  if (selectedRoom.currTemp < 32) {
    selectedRoom.increaseTemp();
    updateRoomUI(selectedRoom);
    generateRooms();
    saveRoomsToLocalStorage(); // 
  }
});


document.getElementById("reduce").addEventListener("click", () => {
  if (selectedRoom.currTemp > 10) {
    selectedRoom.decreaseTemp();
    updateRoomUI(selectedRoom);
    generateRooms();
  }
});

// Default Settings Controls
document.querySelector(".default-settings").addEventListener("click", (e) => {
  if (e.target.closest("button")?.id === "cool") {
    selectedRoom.setCurrTemp(selectedRoom.coldPreset);
    updateRoomUI(selectedRoom);
    generateRooms();
    saveRoomsToLocalStorage(); // ✅ Save after preset change
  }

  if (e.target.closest("button")?.id === "warm") {
    selectedRoom.setCurrTemp(selectedRoom.warmPreset);
    updateRoomUI(selectedRoom);
    generateRooms();
    saveRoomsToLocalStorage(); // ✅ Save after preset change
  }
});

// Preset Controls
const inputsDiv = document.querySelector(".inputs");
document.getElementById("newPreset").addEventListener("click", () => {
  inputsDiv.classList.remove("hidden");
});

document.getElementById("close").addEventListener("click", () => {
  // Hide the input panel
  inputsDiv.classList.add("hidden");

  // Also hide and clear the error message
  const errorSpan = document.querySelector(".error");
  errorSpan.style.display = "none";
  errorSpan.textContent = "";
});


document.getElementById("save").addEventListener("click", () => {
  const coolInput = document.getElementById("coolInput");
  const warmInput = document.getElementById("warmInput");
  const errorSpan = document.querySelector(".error");

  const coolValue = coolInput.value.trim();
  const warmValue = warmInput.value.trim();

  const coolTemp = parseInt(coolValue, 10);
  const warmTemp = parseInt(warmValue, 10);

  const isCoolValid = !isNaN(coolTemp) && coolTemp >= 10 && coolTemp <= 24;
  const isWarmValid = !isNaN(warmTemp) && warmTemp >= 25 && warmTemp <= 32;

  if (coolValue === "" || warmValue === "") {
    errorSpan.style.display = "block";
    errorSpan.textContent = "Please fill in both preset values.";
    return;
  }

  if (!isCoolValid || !isWarmValid) {
    errorSpan.style.display = "block";
    errorSpan.textContent = "Cool: 10°–24°, Warm: 25°–32°";
    return;
  }

  // If all valid, save and reset
  selectedRoom.setColdPreset(coolTemp);
  selectedRoom.setWarmPreset(warmTemp);
  coolInput.value = "";
  warmInput.value = "";
  errorSpan.style.display = "none";
  inputsDiv.classList.add("hidden");

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    toast.classList.add("show");
  
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.classList.add("hidden"), 400); // Wait for animation to end
    }, 3000);
  }
  
  // Usage after saving:
  showToast("Presets saved successfully!");
  
});


// Rooms Control Panel
function generateRooms() {
  const roomsControlContainer = document.querySelector(".rooms-control");
  roomsControlContainer.innerHTML = rooms.map(room => `
    <div class="room-control" id="${room.name}">
      <div class="top">
        <h3 class="room-name">${room.name} - ${room.currTemp}°</h3>
        <button class="switch">
          <ion-icon name="power-outline" class="${room.airConditionerOn ? "powerOn" : ""}"></ion-icon>
        </button>
      </div>
      <div class="time-display">
        <span class="time">${room.startTime}</span>
        <div class="bars">${Array(32).fill('<span class="bar"></span>').join('')}</div>
        <span class="time">${room.endTime}</span>
      </div>
      <span class="room-status" style="display: ${room.airConditionerOn ? "block" : "none"}">
  ${room.currTemp <= 24 ? "Cooling room to: " : "Warming room to: "}${room.currTemp}°
</span>

    </div>
  `).join('');
}

const resetAllACBtn = document.getElementById("reset-ac-btn");
const acToggleLabel = document.getElementById("ac-toggle-label");

resetAllACBtn.addEventListener("change", () => {
  const newState = resetAllACBtn.checked;

  // Toggle all A/Cs
  rooms.forEach(room => {
    room.airConditionerOn = newState;
  });

  generateRooms();
});


document.querySelector(".rooms-control").addEventListener("click", (e) => {
  if (e.target.closest(".switch")) {
    const room = rooms.find(r => r.name === e.target.closest(".room-control").id);
    room.toggleAircon();
    generateRooms();
  }
  else if (e.target.classList.contains("room-name")) {
    selectedRoom = rooms.find(r => r.name === e.target.closest(".room-control").id);
    roomSelect.value = selectedRoom.name;
    updateRoomUI(selectedRoom);
  }
});


// Add Room Modal
const addRoomBtn = document.getElementById("addRoomBtn");
const addRoomModal = document.getElementById("addRoomModal");
const saveRoomBtn = document.getElementById("saveRoomBtn");
const cancelRoomBtn = document.getElementById("cancelRoomBtn");

addRoomBtn.addEventListener("click", () => {
  addRoomModal.classList.remove("hidden");
});

cancelRoomBtn.addEventListener("click", () => {
  addRoomModal.classList.add("hidden");

  // Clear inputs
  document.getElementById("newRoomName").value = "";
  document.getElementById("newRoomImage").value = "";

  // Clear validation states
  const nameInput = document.getElementById("newRoomName");
  const errorMessage = document.getElementById("roomErrorMessage");
  nameInput.classList.remove("input-error");
  errorMessage.textContent = "";
  errorMessage.style.display = "none";
});


saveRoomBtn.addEventListener("click", () => {
  const nameInput = document.getElementById("newRoomName");
  const imageInput = document.getElementById("newRoomImage");
  const errorMessage = document.getElementById("roomErrorMessage");
  const name = nameInput.value.trim();
  const imageURL = "./assets/roomImage.webp"; 

  nameInput.classList.remove("input-error");
  errorMessage.textContent = "";
  errorMessage.style.display = "none";

  if (!name) {
    nameInput.classList.add("input-error");
    errorMessage.textContent = "Room name is required.";
    errorMessage.style.display = "block";
    return;
  }

  const exists = rooms.some(r => r.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    nameInput.classList.add("input-error");
    errorMessage.textContent = "Room with that name already exists.";
    errorMessage.style.display = "block";
    nameInput.value = "";
    // imageInput.value = "";
    return;
  }

  const newRoom = {
    name,
    currTemp: 25,
    coldPreset: 20,
    warmPreset: 30,
    image: imageURL,
    airConditionerOn: false,
    startTime: '16:30',
    endTime: '20:00',
    setCurrTemp(temp) { this.currTemp = temp; },
    setColdPreset(temp) { this.coldPreset = temp; },
    setWarmPreset(temp) { this.warmPreset = temp; },
    increaseTemp() { this.currTemp++; },
    decreaseTemp() { this.currTemp--; },
    toggleAircon() { this.airConditionerOn = !this.airConditionerOn; }
  };

  rooms.push(newRoom);
  saveRoomsToLocalStorage();
  selectedRoom = newRoom;
  nameInput.value = "";
  addRoomModal.classList.add("hidden");

  showToast("Room added successfully!");
  initializeRoomSelection();
  updateRoomUI(selectedRoom); 
  generateRooms(); 
});




// Initialize everything
setInitialOverlay();
initializeRoomSelection();
generateRooms();