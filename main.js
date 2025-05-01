// Room objects
const rooms = [
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

const warmOverlay = `linear-gradient(
  to bottom,
  rgba(141, 158, 247, 0.2),
  rgba(194, 197, 215, 0.1)
)`;

const coolOverlay = `linear-gradient(to bottom, rgba(236, 96, 98, 0.2), rgba(248, 210, 211, 0.13))`;

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
  roomElement.style.backgroundImage = `url('${room.image}'), ${
    room.currTemp < 25 ? coolOverlay : warmOverlay
  }`;
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
  }
});

document.getElementById("reduce").addEventListener("click", () => {
  if (selectedRoom.currTemp > 10) {
    selectedRoom.decreaseTemp();
    updateRoomUI(selectedRoom);
    generateRooms();
  }
});

// Preset Controls
const inputsDiv = document.querySelector(".inputs");
document.getElementById("newPreset").addEventListener("click", () => {
  inputsDiv.classList.remove("hidden");
});

document.getElementById("close").addEventListener("click", () => {
  inputsDiv.classList.add("hidden");
});

document.getElementById("save").addEventListener("click", () => {
  const coolInput = document.getElementById("coolInput");
  const warmInput = document.getElementById("warmInput");
  const errorSpan = document.querySelector(".error");

  if (coolInput.value && warmInput.value) {
    const coolTemp = parseInt(coolInput.value);
    const warmTemp = parseInt(warmInput.value);

    if (coolTemp < 10 || coolTemp > 25 || warmTemp < 25 || warmTemp > 32) {
      errorSpan.style.display = "block";
      errorSpan.textContent = "Cool: 10°-25°, Warm: 25°-32°";
      return;
    }

    selectedRoom.setColdPreset(coolTemp);
    selectedRoom.setWarmPreset(warmTemp);
    coolInput.value = "";
    warmInput.value = "";
    errorSpan.style.display = "none";
    inputsDiv.classList.add("hidden");
  }
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
        ${room.currTemp > 25 ? "Cooling room to: " : "Warming room to: "}${room.currTemp}°
      </span>
    </div>
  `).join('');
}

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

// Initialize everything
setInitialOverlay();
initializeRoomSelection();
generateRooms();