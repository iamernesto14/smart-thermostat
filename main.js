// ==========================================
// Room Management System
// ==========================================

// Global state
let rooms = [];
let selectedRoom = null;
let currentlyEditingRoom = null;
let currentPage = 1;
const roomsPerPage = 4;

// Constants
const TEMP_MIN = 10;
const TEMP_MIN_COOL = 10;
const TEMP_MAX_COOL = 24;
const TEMP_MIN_WARM = 25;
const TEMP_MAX_WARM = 32;
const TEMP_MAX = 32;
const DEFAULT_START_TIME = '16:30';
const DEFAULT_END_TIME = '20:00';

const warmOverlay = [
  'rgba(242, 39, 42, 0.31)', // top
  'rgba(248, 210, 211, 0.13)' // bottom
];
const coolOverlay = [
  'rgba(141, 159, 247, 0.31)', // top
  'rgba(194, 197, 215, 0.1)'   // bottom
];

// ==========================================
// Helper Functions
// ==========================================

// Convert time string to decimal for percentage calculations
function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours + (minutes / 60);
}

// Calculate time percentages for UI display
function calculateTimePercentages(startTime, endTime) {
  return {
    startPercent: (parseTime(startTime) / 24) * 100,
    endPercent: (parseTime(endTime) / 24) * 100
  };
}

// Room factory function to ensure consistent room objects
function createRoom(config) {
  const { name, currTemp = 25, coldPreset = 20, warmPreset = 30, image, airConditionerOn = false } = config;
  
  const startTime = config.startTime || DEFAULT_START_TIME;
  const endTime = config.endTime || DEFAULT_END_TIME;
  const { startPercent, endPercent } = calculateTimePercentages(startTime, endTime);
  
  return {
    name,
    currTemp,
    coldPreset,
    warmPreset,
    image: image || "./assets/roomImage.webp",
    airConditionerOn,
    schedule: {
      startTime,
      endTime,
      startPercent,
      endPercent
    },
    setCurrTemp(temp) { this.currTemp = temp; },
    setColdPreset(newCold) { this.coldPreset = newCold; },
    setWarmPreset(newWarm) { this.warmPreset = newWarm; },
    increaseTemp() { 
      if (this.currTemp < TEMP_MAX) this.currTemp++; 
    },
    decreaseTemp() { 
      if (this.currTemp > TEMP_MIN) this.currTemp--; 
    },
    toggleAircon() { this.airConditionerOn = !this.airConditionerOn; }
  };
}

// ==========================================
// Storage Functions
// ==========================================

// Save rooms to local storage
function saveRoomsToLocalStorage() {
  try {
    localStorage.setItem('rooms', JSON.stringify(rooms));
  } catch (error) {
    console.error('Failed to save rooms to localStorage:', error);
  }
}

// Load rooms from local storage
function loadRoomsFromLocalStorage() {
  try {
    const storedRooms = localStorage.getItem('rooms');
    
    if (storedRooms) {
      // Parse rooms and recreate with proper methods
      rooms = JSON.parse(storedRooms).map(room => createRoom({
        name: room.name,
        currTemp: room.currTemp,
        coldPreset: room.coldPreset,
        warmPreset: room.warmPreset,
        image: room.image,
        airConditionerOn: room.airConditionerOn,
        startTime: room.schedule?.startTime,
        endTime: room.schedule?.endTime
      }));
    } else {
      // Create default rooms
      rooms = [
        createRoom({
          name: "Living Room",
          currTemp: 32,
          coldPreset: 20,
          warmPreset: 32,
          image: "./assets/living-room.jpg"
        }),
        createRoom({
          name: "Kitchen",
          currTemp: 29,
          coldPreset: 20,
          warmPreset: 32,
          image: "./assets/kitchen.jpg"
        }),
        createRoom({
          name: "Bathroom",
          currTemp: 30,
          coldPreset: 20,
          warmPreset: 32,
          image: "./assets/bathroom.jpg"
        }),
        createRoom({
          name: "Bedroom",
          currTemp: 31,
          coldPreset: 20,
          warmPreset: 32,
          image: "./assets/bedroom.jpg"
        })
      ];
      saveRoomsToLocalStorage();
    }
    
    // Set initially selected room
    selectedRoom = rooms[0];
    
  } catch (error) {
    console.error('Failed to load rooms from localStorage:', error);
    // Fallback to default rooms if there's an error
    rooms = [
      createRoom({
        name: "Living Room",
        currTemp: 32,
        image: "./assets/living-room.jpg"
      })
    ];
    selectedRoom = rooms[0];
  }
}

// ==========================================
// UI Functions
// ==========================================

// Display toast notification
function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast");
  if (!toast) {
    console.error("Toast element not found");
    return;
  }
  
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 400);
  }, duration);
}

// Set room background overlay based on temperature
function setOverlay(room) {
  const roomElement = document.querySelector(".room");
  if (!roomElement) return;
  
  const overlay = room.currTemp <= TEMP_MAX_COOL ? coolOverlay : warmOverlay;

  roomElement.style.backgroundImage = `
    linear-gradient(to bottom, ${overlay[0]}, ${overlay[1]}),
    url('${room.image}')
  `;
  roomElement.style.backgroundRepeat = 'no-repeat';
  roomElement.style.backgroundSize = 'cover';
  roomElement.style.backgroundPosition = 'center';
}

// Set initial room overlay
function setInitialOverlay() {
  const roomElement = document.querySelector(".room");
  if (!roomElement || !selectedRoom) return;
  
  const overlay = selectedRoom.currTemp <= TEMP_MAX_COOL ? coolOverlay : warmOverlay;
  
  roomElement.style.backgroundImage = `
    linear-gradient(to bottom, ${overlay[0]}, ${overlay[1]}),
    url('${selectedRoom.image}')
  `;
}

// Position temperature indicator on UI
function setIndicatorPoint(currTemp) {
  const svgPoint = document.querySelector(".point");
  if (!svgPoint) return;
  
  const position = calculatePointPosition(currTemp);
  svgPoint.style.transform = `translate(${position.translateX}px, ${position.translateY}px)`;
}

// Calculate position for temperature indicator
function calculatePointPosition(currTemp) {
  const normalizedTemp = (currTemp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN);
  const angleOffset = 86;
  const angle = normalizedTemp * 180 + angleOffset;
  const radians = (angle * Math.PI) / 180;
  const radius = 116;
  
  return {
    translateX: radius * Math.cos(radians),
    translateY: radius * Math.sin(radians)
  };
}

// Update room UI with current room data
function updateRoomUI(room) {
  if (!room) return;
  
  // Update room selection in UI
  document.querySelectorAll(".room-control").forEach(card => {
    card.classList.remove("selected");
    if (card.dataset.roomName === room.name) {
      card.classList.add("selected");
    }
  });

  // Update temperature displays
  const currentTempDisplay = document.getElementById("temp");
  if (currentTempDisplay) {
    currentTempDisplay.textContent = `${room.currTemp}°`;
  }
  
  const additionalTempDisplay = document.querySelector(".currentTemp");
  if (additionalTempDisplay) {
    additionalTempDisplay.textContent = `${room.currTemp}°`;
  }
  
  // Update room name
  const roomNameDisplay = document.querySelector(".room-name");
  if (roomNameDisplay) {
    roomNameDisplay.textContent = room.name;
  }
  
  // Update visual elements
  setOverlay(room);
  setIndicatorPoint(room.currTemp);
}

// Initialize room dropdown selection
function initializeRoomSelection() {
  const roomSelect = document.getElementById("rooms");
  if (!roomSelect) return;
  
  roomSelect.innerHTML = '';
  
  rooms.forEach(room => {
    const option = document.createElement("option");
    option.value = room.name;
    option.textContent = room.name;
    roomSelect.appendChild(option);
  });
  
  if (selectedRoom) {
    roomSelect.value = selectedRoom.name;
    updateRoomUI(selectedRoom);
  }
}

// Generate room control cards with pagination
function generateRooms() {
  const roomsControlContainer = document.querySelector(".rooms-control");
  if (!roomsControlContainer) return;
  
  const totalPages = Math.ceil(rooms.length / roomsPerPage);
  const start = (currentPage - 1) * roomsPerPage;
  const end = start + roomsPerPage;
  const paginatedRooms = rooms.slice(start, end);

  roomsControlContainer.innerHTML = paginatedRooms.map(room => `
    <div class="room-control" data-room-name="${room.name}" id="${room.name.replace(/\s+/g, '-')}">
      <div class="top">
        <h3 class="room-name">${room.name} - ${room.currTemp}°</h3>
        <button class="switch">
          <ion-icon name="power-outline" class="${room.airConditionerOn ? "powerOn" : ""}"></ion-icon>
        </button>
      </div>
      <div class="time-display">
        <span class="time">${room.schedule.startTime}</span>
        <div class="bars">${Array(32).fill('<span class="bar"></span>').join('')}</div>
        <span class="time">${room.schedule.endTime}</span>
      </div>
      <span class="room-status" style="display: ${room.airConditionerOn ? "block" : "none"}">
        ${room.currTemp <= TEMP_MAX_COOL ? "Cooling room to: " : "Warming room to: "}${room.currTemp}°
      </span>
    </div>
  `).join('');
  
  updatePaginationControls(totalPages);
}

// Update pagination indicators and buttons
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

// Show schedule modal for a room
function showScheduleModal(room) {
  const modal = document.getElementById('scheduleModal');
  if (!modal) {
    console.error("Schedule modal not found!");
    return;
  }

  const startInput = document.getElementById('startTimeInput');
  const endInput = document.getElementById('endTimeInput');
  
  if (startInput && endInput) {
    startInput.value = room.schedule.startTime;
    endInput.value = room.schedule.endTime;
  }
  
  modal.classList.remove('hidden');
}

// ==========================================
// Event Handlers
// ==========================================

// Handle room selection change
function handleRoomSelectChange(event) {
  const roomName = event.target.value;
  selectedRoom = rooms.find(room => room.name === roomName);
  
  if (!selectedRoom) return;
  
  // Update the current page based on the selected room's index
  const roomIndex = rooms.indexOf(selectedRoom);
  const totalPages = Math.ceil(rooms.length / roomsPerPage);
  const newPage = Math.ceil((roomIndex + 1) / roomsPerPage); // Calculate the page the room is on

  // Update the page and re-render the rooms
  if (newPage !== currentPage) {
    currentPage = newPage;
    generateRooms(); 
  }

  updateRoomUI(selectedRoom);
}

// Handle temperature increase
function handleTemperatureIncrease() {
  if (!selectedRoom) return;
  
  selectedRoom.increaseTemp();
  updateRoomUI(selectedRoom);
  generateRooms();
  saveRoomsToLocalStorage();
}

// Handle temperature decrease
function handleTemperatureDecrease() {
  if (!selectedRoom) return;
  
  selectedRoom.decreaseTemp();
  updateRoomUI(selectedRoom);
  generateRooms();
  saveRoomsToLocalStorage();
}

// Handle preset button clicks
function handlePresetClick(event) {
  if (!selectedRoom) return;
  
  const buttonId = event.target.closest("button")?.id;
  if (!buttonId) return;
  
  if (buttonId === "cool") {
    selectedRoom.setCurrTemp(selectedRoom.coldPreset);
  } else if (buttonId === "warm") {
    selectedRoom.setCurrTemp(selectedRoom.warmPreset);
  }
  
  updateRoomUI(selectedRoom);
  generateRooms();
  saveRoomsToLocalStorage();
}

// Handle preset panel opening and closing
function handlePresetPanelToggle(isOpen) {
  const inputsDiv = document.querySelector(".inputs");
  if (!inputsDiv) return;
  
  if (isOpen) {
    inputsDiv.classList.remove("hidden");
  } else {
    inputsDiv.classList.add("hidden");
    
    // Clear error message
    const errorSpan = document.querySelector(".error");
    if (errorSpan) {
      errorSpan.style.display = "none";
      errorSpan.textContent = "";
    }
  }
}

// Handle preset saving
function handlePresetSave() {
  if (!selectedRoom) return;
  
  const coolInput = document.getElementById("coolInput");
  const warmInput = document.getElementById("warmInput");
  const errorSpan = document.querySelector(".error");
  
  if (!coolInput || !warmInput || !errorSpan) return;

  const coolValue = coolInput.value.trim();
  const warmValue = warmInput.value.trim();

  const coolTemp = parseInt(coolValue, 10);
  const warmTemp = parseInt(warmValue, 10);

  const isCoolValid = !isNaN(coolTemp) && coolTemp >= TEMP_MIN_COOL && coolTemp <= TEMP_MAX_COOL;
  const isWarmValid = !isNaN(warmTemp) && warmTemp >= TEMP_MIN_WARM && warmTemp <= TEMP_MAX_WARM;

  if (coolValue === "" || warmValue === "") {
    errorSpan.style.display = "block";
    errorSpan.textContent = "Please fill in both preset values.";
    return;
  }

  if (!isCoolValid || !isWarmValid) {
    errorSpan.style.display = "block";
    errorSpan.textContent = `Cool: ${TEMP_MIN_COOL}°–${TEMP_MAX_COOL}°, Warm: ${TEMP_MIN_WARM}°–${TEMP_MAX_WARM}°`;
    return;
  }

  // Save presets
  selectedRoom.setColdPreset(coolTemp);
  selectedRoom.setWarmPreset(warmTemp);
  saveRoomsToLocalStorage();
  
  // Reset inputs and UI
  coolInput.value = "";
  warmInput.value = "";
  errorSpan.style.display = "none";
  handlePresetPanelToggle(false);

  showToast("Presets saved successfully!");
}

// Handle room control power button clicks
function handleRoomControlClick(event) {
  if (!event.target.closest(".switch")) return;
  
  const roomElement = event.target.closest(".room-control");
  if (!roomElement) return;
  
  const roomName = roomElement.dataset.roomName;
  const room = rooms.find(r => r.name === roomName);
  
  if (!room) return;
  
  if (!room.airConditionerOn) {
    // When turning ON, show the schedule modal
    currentlyEditingRoom = room;
    showScheduleModal(room);
  } else {
    // When turning OFF, just toggle
    room.toggleAircon();
    generateRooms();
    saveRoomsToLocalStorage();
  }
}

// Handle schedule confirmation
function handleScheduleConfirmation() {
  if (!currentlyEditingRoom) return;
  
  const modal = document.getElementById('scheduleModal');
  const startInput = document.getElementById('startTimeInput');
  const endInput = document.getElementById('endTimeInput');
  
  if (!modal || !startInput || !endInput) return;
  
  // Validate times
  if (startInput.value >= endInput.value) {
    alert('End time must be after start time');
    return;
  }
  
  // Update room with new schedule
  const { startPercent, endPercent } = calculateTimePercentages(startInput.value, endInput.value);
  
  currentlyEditingRoom.schedule = {
    startTime: startInput.value,
    endTime: endInput.value,
    startPercent,
    endPercent
  };
  
  currentlyEditingRoom.airConditionerOn = true;
  
  // Update UI
  generateRooms();
  saveRoomsToLocalStorage();
  
  // Close modal
  modal.classList.add('hidden');
  
  // Show confirmation
  showToast(`Schedule set for ${currentlyEditingRoom.name}`);
}

// Handle adding a new room
function handleAddRoom() {
  const nameInput = document.getElementById("newRoomName");
  const errorMessage = document.getElementById("roomErrorMessage");
  const modal = document.getElementById("addRoomModal");
  
  if (!nameInput || !errorMessage || !modal) return;
  
  const name = nameInput.value.trim();

  // Reset validation state
  nameInput.classList.remove("input-error");
  errorMessage.textContent = "";
  errorMessage.style.display = "none";

  // Validation
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

  // Create and add the new room
  const newRoom = createRoom({ name });
  rooms.push(newRoom);
  saveRoomsToLocalStorage();

  // Update the page to show the new room
  currentPage = Math.ceil(rooms.length / roomsPerPage);
  generateRooms();
  initializeRoomSelection();
  
  // Select the new room
  const roomSelect = document.getElementById("rooms");
  if (roomSelect) {
    roomSelect.value = newRoom.name;
    selectedRoom = newRoom;
    updateRoomUI(newRoom);
  }

  // Show success toast
  showToast("Room added successfully");

  // Reset the form and close the modal
  nameInput.value = "";
  modal.classList.add("hidden");
}

// Handle turning all ACs on/off
function handleAllAcToggle(event) {
  const newState = event.target.checked;
  
  // Toggle all A/Cs
  rooms.forEach(room => {
    room.airConditionerOn = newState;
  });

  generateRooms();
  saveRoomsToLocalStorage();
}

// Handle pagination buttons
function handlePaginationClick(direction) {
  const totalPages = Math.ceil(rooms.length / roomsPerPage);
  
  if (direction === 'prev' && currentPage > 1) {
    currentPage--;
    generateRooms();
  } else if (direction === 'next' && currentPage < totalPages) {
    currentPage++;
    generateRooms();
  }
}

// ==========================================
// Initialize Application
// ==========================================

function initializeApp() {
  // Load data
  loadRoomsFromLocalStorage();
  
  // Set up UI
  setInitialOverlay();
  initializeRoomSelection();
  generateRooms();
  
  // Set up event listeners
  const roomSelect = document.getElementById("rooms");
  if (roomSelect) {
    roomSelect.addEventListener("change", handleRoomSelectChange);
  }
  
  // Temperature controls
  const increaseBtn = document.getElementById("increase");
  const decreaseBtn = document.getElementById("reduce");
  if (increaseBtn) increaseBtn.addEventListener("click", handleTemperatureIncrease);
  if (decreaseBtn) decreaseBtn.addEventListener("click", handleTemperatureDecrease);
  
  // Preset controls
  const defaultSettingsDiv = document.querySelector(".default-settings");
  if (defaultSettingsDiv) {
    defaultSettingsDiv.addEventListener("click", handlePresetClick);
  }
  
  // Preset panel controls
  const newPresetBtn = document.getElementById("newPreset");
  const closePresetBtn = document.getElementById("close");
  const savePresetBtn = document.getElementById("save");
  
  if (newPresetBtn) newPresetBtn.addEventListener("click", () => handlePresetPanelToggle(true));
  if (closePresetBtn) closePresetBtn.addEventListener("click", () => handlePresetPanelToggle(false));
  if (savePresetBtn) savePresetBtn.addEventListener("click", handlePresetSave);
  
  // Room controls
  const roomsControlContainer = document.querySelector(".rooms-control");
  if (roomsControlContainer) {
    roomsControlContainer.addEventListener("click", handleRoomControlClick);
  }
  
  // Schedule modal
  const closeModalBtn = document.querySelector('.close-modal');
  const confirmScheduleBtn = document.getElementById('confirmSchedule');
  const cancelScheduleBtn = document.getElementById('cancelSchedule');
  
  if (closeModalBtn) closeModalBtn.addEventListener('click', () => {
    const modal = document.getElementById('scheduleModal');
    if (modal) modal.classList.add('hidden');
  });
  
  if (confirmScheduleBtn) confirmScheduleBtn.addEventListener('click', handleScheduleConfirmation);
  if (cancelScheduleBtn) cancelScheduleBtn.addEventListener('click', () => {
    const modal = document.getElementById('scheduleModal');
    if (modal) modal.classList.add('hidden');
  });
  
  // Add room
  const addRoomBtn = document.getElementById("addRoomBtn");
  const saveRoomBtn = document.getElementById("saveRoomBtn");
  const cancelRoomBtn = document.getElementById("cancelRoomBtn");
  
  if (addRoomBtn) addRoomBtn.addEventListener("click", () => {
    const modal = document.getElementById("addRoomModal");
    if (modal) modal.classList.remove("hidden");
  });
  
  if (saveRoomBtn) saveRoomBtn.addEventListener("click", handleAddRoom);
  if (cancelRoomBtn) cancelRoomBtn.addEventListener("click", () => {
    const modal = document.getElementById("addRoomModal");
    if (modal) modal.classList.add("hidden");
    
    // Clear inputs
    const nameInput = document.getElementById("newRoomName");
    const errorMessage = document.getElementById("roomErrorMessage");
    if (nameInput) nameInput.value = "";
    if (errorMessage) {
      errorMessage.textContent = "";
      errorMessage.style.display = "none";
    }
  });
  
  // Reset all AC toggle
  const resetAllACBtn = document.getElementById("reset-ac-btn");
  if (resetAllACBtn) {
    resetAllACBtn.addEventListener("change", handleAllAcToggle);
  }
  
  // Pagination buttons
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  
  if (prevPageBtn) prevPageBtn.addEventListener("click", () => handlePaginationClick('prev'));
  if (nextPageBtn) nextPageBtn.addEventListener("click", () => handlePaginationClick('next'));
}

// Start the application
document.addEventListener('DOMContentLoaded', initializeApp);