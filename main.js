// Room objects

let rooms = [];
loadRoomsFromLocalStorage();
function loadRoomsFromLocalStorage() {
  const storedRooms = localStorage.getItem('rooms');
  if (storedRooms) {
    rooms = JSON.parse(storedRooms).map(room => ({
      ...room,
      setCurrTemp(temp) { this.currTemp = temp; },
      setColdPreset(newCold) { this.coldPreset = newCold; },
      setWarmPreset(newWarm) { this.warmPreset = newWarm; },
      increaseTemp() { this.currTemp++; },
      decreaseTemp() { this.currTemp--; },
      toggleAircon() { this.airConditionerOn = !this.airConditionerOn; }
    }));
  } else {
    rooms = [
      // Default rooms
      {
        name: "Living Room",
        currTemp: 32,
        coldPreset: 20,
        warmPreset: 32,
        image: "./assets/living-room.jpg",
        airConditionerOn: false,
        startTime: '16:30',
        endTime: '20:00',
        setCurrTemp(temp) { this.currTemp = temp; },
        setColdPreset(newCold) { this.coldPreset = newCold; },
        setWarmPreset(newWarm) { this.warmPreset = newWarm; },
        decreaseTemp() { this.currTemp--; },
        increaseTemp() { this.currTemp++; },
        toggleAircon() { this.airConditionerOn = !this.airConditionerOn; }
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
        setCurrTemp(temp) { this.currTemp = temp; },
        setColdPreset(newCold) { this.coldPreset = newCold; },
        setWarmPreset(newWarm) { this.warmPreset = newWarm; },
        decreaseTemp() { this.currTemp--; },
        increaseTemp() { this.currTemp++; },
        toggleAircon() { this.airConditionerOn = !this.airConditionerOn; }
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
        setCurrTemp(temp) { this.currTemp = temp; },
        setColdPreset(newCold) { this.coldPreset = newCold; },
        setWarmPreset(newWarm) { this.warmPreset = newWarm; },
        decreaseTemp() { this.currTemp--; },
        increaseTemp() { this.currTemp++; },
        toggleAircon() { this.airConditionerOn = !this.airConditionerOn; }
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
        setCurrTemp(temp) { this.currTemp = temp; },
        setColdPreset(newCold) { this.coldPreset = newCold; },
        setWarmPreset(newWarm) { this.warmPreset = newWarm; },
        decreaseTemp() { this.currTemp--; },
        increaseTemp() { this.currTemp++; },
        toggleAircon() { this.airConditionerOn = !this.airConditionerOn; }
      }
    ];
    saveRoomsToLocalStorage(); // Save the default rooms to localStorage if no rooms exist
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
  
  // Update the current page based on the selected room's index
  const roomIndex = rooms.indexOf(selectedRoom);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);
  const newPage = Math.ceil((roomIndex + 1) / roomsPerPage); // Calculate the page the room is on

  // Update the page and re-render the rooms
  if (newPage !== currentPage) {
    currentPage = newPage;
    generateRooms(); // Re-render rooms with updated page
  }

  if (selectedRoom) {
    updateRoomUI(selectedRoom); // Update room UI (temperature, overlay, etc.)
  }
});


// Temperature Controls
document.getElementById("increase").addEventListener("click", () => {
  if (selectedRoom.currTemp < 32) {
    selectedRoom.increaseTemp();
    updateRoomUI(selectedRoom);
    generateRooms();
    saveRoomsToLocalStorage();
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

let currentPage = 1;
const roomsPerPage = 4;


// Rooms Control Panel
// Rooms Control Panel
function generateRooms() {
  const totalPages = Math.ceil(rooms.length / roomsPerPage);
  const roomsControlContainer = document.querySelector(".rooms-control");
  const start = (currentPage - 1) * roomsPerPage;
  const end = start + roomsPerPage;
  const paginatedRooms = rooms.slice(start, end);

  roomsControlContainer.innerHTML = paginatedRooms.map(room => `
    <div class="room-control" id="${room.name}">
      <div class="top">
        <h3 class="room-name">${room.name} - ${room.currTemp}°</h3>
        <button class="switch">
          <ion-icon name="power-outline" class="${room.airConditionerOn ? "powerOn" : ""}"></ion-icon>
        </button>
        <!-- Disable delete button for default rooms -->
        <button class="delete-btn" ${defaultRooms.includes(room.name) ? 'disabled' : ''}>Delete</button>
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

  updatePaginationControls(totalPages);
}


const defaultRooms = [
  { name: 'Living Room', temperature: 22, unit: '°C' },
  { name: 'Bedroom', temperature: 20, unit: '°C' },
  { name: 'Kitchen', temperature: 24, unit: '°C' },
];

// Load rooms from localStorage, but include default rooms if none exist
function loadRooms() {
  const storedRooms = JSON.parse(localStorage.getItem('rooms'));
  if (storedRooms && storedRooms.length > 0) {
    rooms = storedRooms;
  } else {
    rooms = [...defaultRooms];  // Use the default rooms if no rooms are saved
  }
  generateRooms();
  initializeRoomSelection();
}

// Deleting a room card
document.querySelector(".rooms-control").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const roomElement = e.target.closest(".room-control");
    const roomName = roomElement.id;
    deleteRoom(roomName); // Call deleteRoom on button click
  }
});

// Delete room logic
function deleteRoom(roomName) {
  // Prevent deleting default rooms
  if (defaultRooms.some(room => room.name === roomName)) {
    showToast(`${roomName} cannot be deleted because it is a default room.`);
    return; // Do not delete default rooms
  }

  const roomIndex = rooms.findIndex(room => room.name === roomName);
  
  if (roomIndex !== -1) {
    // Remove the room from the rooms array
    rooms.splice(roomIndex, 1);

    // Save to localStorage after deletion
    saveRoomsToLocalStorage();

    // Re-render rooms after deletion
    generateRooms();
    initializeRoomSelection();  // Re-initialize the dropdown list of rooms

    // Select the previous room or the first room if there is no previous one
    let previousRoom = roomIndex > 0 ? rooms[roomIndex - 1] : rooms[0];
    selectedRoom = previousRoom;
    roomSelect.value = selectedRoom.name;
    updateRoomUI(selectedRoom);

    // Show success toast for deletion
    showToast(`${roomName} successfully removed!`);
  }
}

// Show toast function to show success or error messages
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 400);
  }, 3000); 
}


function updatePaginationControls(totalPages) {
  const pageIndicator = document.querySelector("#pageIndicator");
  if (pageIndicator) {
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
  }

  const prevBtn = document.querySelector("#prevPage");
  const nextBtn = document.querySelector("#nextPage");

  if (prevBtn && nextBtn) {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }
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
    return;
  }

  // Create the new room object
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

  // Add the new room to the rooms array
  rooms.push(newRoom);

  // Save rooms to local storage after adding a new room
  saveRoomsToLocalStorage();

  // Update the page to reflect the new room (both the dropdown and the room display)
  currentPage = Math.ceil(rooms.length / roomsPerPage);
  generateRooms();
  initializeRoomSelection(); // This will update the dropdown to include the new room
  roomSelect.value = newRoom.name; // Select the new room in the dropdown
  updateRoomUI(newRoom); // Update the main room UI with the new room's details

  // Show success toast
  showToast("Room added successfully");

  // Reset the form and close the modal
  document.getElementById("addRoomModal").classList.add("hidden");
  nameInput.value = "";
  errorMessage.style.display = "none"; // Hide error message if any
});



document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    generateRooms();
  }
});

document.getElementById("nextPage").addEventListener("click", () => {
  const totalPages = Math.ceil(rooms.length / roomsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    generateRooms();
  }
});



// Initialize everything
setInitialOverlay();
initializeRoomSelection();
generateRooms();