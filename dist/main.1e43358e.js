// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/main.js":[function(require,module,exports) {
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
// Global state
var rooms = [];
var selectedRoom = null;
var currentlyEditingRoom = null;
var currentPage = 1;
var roomsPerPage = 4;

// Constants
var TEMP_MIN = 10;
var TEMP_MIN_COOL = 10;
var TEMP_MAX_COOL = 24;
var TEMP_MIN_WARM = 25;
var TEMP_MAX_WARM = 32;
var TEMP_MAX = 32;
var DEFAULT_START_TIME = '16:30';
var DEFAULT_END_TIME = '20:00';
var warmOverlay = ['rgba(242, 39, 42, 0.31)', 'rgba(248, 210, 211, 0.13)'];
var coolOverlay = ['rgba(141, 159, 247, 0.31)', 'rgba(194, 197, 215, 0.1)'];

// Convert time string to decimal for percentage calculations
function parseTime(timeStr) {
  var _timeStr$split$map = timeStr.split(':').map(Number),
    _timeStr$split$map2 = _slicedToArray(_timeStr$split$map, 2),
    hours = _timeStr$split$map2[0],
    minutes = _timeStr$split$map2[1];
  return hours + minutes / 60;
}

// Calculate time percentages for UI display
function calculateTimePercentages(startTime, endTime) {
  return {
    startPercent: parseTime(startTime) / 24 * 100,
    endPercent: parseTime(endTime) / 24 * 100
  };
}

// Room factory function to ensure consistent room objects
function createRoom(config) {
  var name = config.name,
    _config$currTemp = config.currTemp,
    currTemp = _config$currTemp === void 0 ? 25 : _config$currTemp,
    _config$coldPreset = config.coldPreset,
    coldPreset = _config$coldPreset === void 0 ? 20 : _config$coldPreset,
    _config$warmPreset = config.warmPreset,
    warmPreset = _config$warmPreset === void 0 ? 30 : _config$warmPreset,
    image = config.image,
    _config$airConditione = config.airConditionerOn,
    airConditionerOn = _config$airConditione === void 0 ? false : _config$airConditione;
  var startTime = config.startTime || DEFAULT_START_TIME;
  var endTime = config.endTime || DEFAULT_END_TIME;
  var _calculateTimePercent = calculateTimePercentages(startTime, endTime),
    startPercent = _calculateTimePercent.startPercent,
    endPercent = _calculateTimePercent.endPercent;
  return {
    name: name,
    currTemp: currTemp,
    coldPreset: coldPreset,
    warmPreset: warmPreset,
    image: image || "./assets/roomImage.webp",
    airConditionerOn: airConditionerOn,
    schedule: {
      startTime: startTime,
      endTime: endTime,
      startPercent: startPercent,
      endPercent: endPercent
    },
    setCurrTemp: function setCurrTemp(temp) {
      this.currTemp = temp;
    },
    setColdPreset: function setColdPreset(newCold) {
      this.coldPreset = newCold;
    },
    setWarmPreset: function setWarmPreset(newWarm) {
      this.warmPreset = newWarm;
    },
    increaseTemp: function increaseTemp() {
      if (this.currTemp < TEMP_MAX) this.currTemp++;
    },
    decreaseTemp: function decreaseTemp() {
      if (this.currTemp > TEMP_MIN) this.currTemp--;
    },
    toggleAircon: function toggleAircon() {
      this.airConditionerOn = !this.airConditionerOn;
    }
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
    var storedRooms = localStorage.getItem('rooms');
    if (storedRooms) {
      // Parse rooms and recreate with proper methods
      rooms = JSON.parse(storedRooms).map(function (room) {
        var _room$schedule, _room$schedule2;
        return createRoom({
          name: room.name,
          currTemp: room.currTemp,
          coldPreset: room.coldPreset,
          warmPreset: room.warmPreset,
          image: room.image,
          airConditionerOn: room.airConditionerOn,
          startTime: (_room$schedule = room.schedule) === null || _room$schedule === void 0 ? void 0 : _room$schedule.startTime,
          endTime: (_room$schedule2 = room.schedule) === null || _room$schedule2 === void 0 ? void 0 : _room$schedule2.endTime
        });
      });
    } else {
      // Create default rooms
      rooms = [createRoom({
        name: "Living Room",
        currTemp: 32,
        coldPreset: 20,
        warmPreset: 32,
        image: "./assets/living-room.jpg"
      }), createRoom({
        name: "Kitchen",
        currTemp: 29,
        coldPreset: 20,
        warmPreset: 32,
        image: "./assets/kitchen.jpg"
      }), createRoom({
        name: "Bathroom",
        currTemp: 30,
        coldPreset: 20,
        warmPreset: 32,
        image: "./assets/bathroom.jpg"
      }), createRoom({
        name: "Bedroom",
        currTemp: 31,
        coldPreset: 20,
        warmPreset: 32,
        image: "./assets/bedroom.jpg"
      })];
      saveRoomsToLocalStorage();
    }

    // Set initially selected room
    selectedRoom = rooms[0];
  } catch (error) {
    console.error('Failed to load rooms from localStorage:', error);
    // Fallback to default rooms if there's an error
    rooms = [createRoom({
      name: "Living Room",
      currTemp: 32,
      image: "./assets/living-room.jpg"
    })];
    selectedRoom = rooms[0];
  }
}

// ==========================================
// UI Functions
// ==========================================

// Display toast notification
function showToast(message) {
  var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3000;
  var toast = document.getElementById("toast");
  if (!toast) {
    console.error("Toast element not found");
    return;
  }
  toast.textContent = message;
  toast.classList.remove("hidden");
  toast.classList.add("show");
  setTimeout(function () {
    toast.classList.remove("show");
    setTimeout(function () {
      return toast.classList.add("hidden");
    }, 400);
  }, duration);
}

// Set room background overlay based on temperature
function setOverlay(room) {
  var roomElement = document.querySelector(".room");
  if (!roomElement) return;
  var overlay = room.currTemp <= TEMP_MAX_COOL ? coolOverlay : warmOverlay;
  roomElement.style.backgroundImage = "\n    linear-gradient(to bottom, ".concat(overlay[0], ", ").concat(overlay[1], "),\n    url('").concat(room.image, "')\n  ");
  roomElement.style.backgroundRepeat = 'no-repeat';
  roomElement.style.backgroundSize = 'cover';
  roomElement.style.backgroundPosition = 'center';
}

// Set initial room overlay
function setInitialOverlay() {
  var roomElement = document.querySelector(".room");
  if (!roomElement || !selectedRoom) return;
  var overlay = selectedRoom.currTemp <= TEMP_MAX_COOL ? coolOverlay : warmOverlay;
  roomElement.style.backgroundImage = "\n    linear-gradient(to bottom, ".concat(overlay[0], ", ").concat(overlay[1], "),\n    url('").concat(selectedRoom.image, "')\n  ");
}

// Position temperature indicator on UI
function setIndicatorPoint(currTemp) {
  var svgPoint = document.querySelector(".point");
  if (!svgPoint) return;
  var position = calculatePointPosition(currTemp);
  svgPoint.style.transform = "translate(".concat(position.translateX, "px, ").concat(position.translateY, "px)");
}

// Calculate position for temperature indicator
function calculatePointPosition(currTemp) {
  var normalizedTemp = (currTemp - TEMP_MIN) / (TEMP_MAX - TEMP_MIN);
  var angleOffset = 86;
  var angle = normalizedTemp * 180 + angleOffset;
  var radians = angle * Math.PI / 180;
  var radius = 116;
  return {
    translateX: radius * Math.cos(radians),
    translateY: radius * Math.sin(radians)
  };
}

// Update room UI with current room data
function updateRoomUI(room) {
  if (!room) return;

  // Update room selection in UI
  document.querySelectorAll(".room-control").forEach(function (card) {
    card.classList.remove("selected");
    if (card.dataset.roomName === room.name) {
      card.classList.add("selected");
    }
  });

  // Update temperature displays
  var currentTempDisplay = document.getElementById("temp");
  if (currentTempDisplay) {
    currentTempDisplay.textContent = "".concat(room.currTemp, "\xB0");
  }
  var additionalTempDisplay = document.querySelector(".currentTemp");
  if (additionalTempDisplay) {
    additionalTempDisplay.textContent = "".concat(room.currTemp, "\xB0");
  }

  // Update room name
  var roomNameDisplay = document.querySelector(".room-name");
  if (roomNameDisplay) {
    roomNameDisplay.textContent = room.name;
  }

  // Update visual elements
  setOverlay(room);
  setIndicatorPoint(room.currTemp);
}

// Initialize room dropdown selection
function initializeRoomSelection() {
  var roomSelect = document.getElementById("rooms");
  if (!roomSelect) return;
  roomSelect.innerHTML = '';
  rooms.forEach(function (room) {
    var option = document.createElement("option");
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
  var roomsControlContainer = document.querySelector(".rooms-control");
  if (!roomsControlContainer) return;
  var totalPages = Math.ceil(rooms.length / roomsPerPage);
  var start = (currentPage - 1) * roomsPerPage;
  var end = start + roomsPerPage;
  var paginatedRooms = rooms.slice(start, end);
  roomsControlContainer.innerHTML = paginatedRooms.map(function (room) {
    return "\n    <div class=\"room-control\" data-room-name=\"".concat(room.name, "\" id=\"").concat(room.name.replace(/\s+/g, '-'), "\">\n      <div class=\"top\">\n        <h3 class=\"room-name\">").concat(room.name, " - ").concat(room.currTemp, "\xB0</h3>\n        <button class=\"switch\">\n          <ion-icon name=\"power-outline\" class=\"").concat(room.airConditionerOn ? "powerOn" : "", "\"></ion-icon>\n        </button>\n      </div>\n      <div class=\"time-display\">\n        <span class=\"time\">").concat(room.schedule.startTime, "</span>\n        <div class=\"bars\">").concat(Array(32).fill('<span class="bar"></span>').join(''), "</div>\n        <span class=\"time\">").concat(room.schedule.endTime, "</span>\n      </div>\n      <span class=\"room-status\" style=\"display: ").concat(room.airConditionerOn ? "block" : "none", "\">\n        ").concat(room.currTemp <= TEMP_MAX_COOL ? "Cooling room to: " : "Warming room to: ").concat(room.currTemp, "\xB0\n      </span>\n    </div>\n  ");
  }).join('');
  updatePaginationControls(totalPages);
}

// Update pagination indicators and buttons
function updatePaginationControls(totalPages) {
  var pageIndicator = document.querySelector("#pageIndicator");
  if (pageIndicator) {
    pageIndicator.textContent = "Page ".concat(currentPage, " of ").concat(totalPages);
  }
  var prevBtn = document.querySelector("#prevPage");
  var nextBtn = document.querySelector("#nextPage");
  if (prevBtn && nextBtn) {
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }
}

// Show schedule modal for a room
function showScheduleModal(room) {
  var modal = document.getElementById('scheduleModal');
  if (!modal) {
    console.error("Schedule modal not found!");
    return;
  }
  var startInput = document.getElementById('startTimeInput');
  var endInput = document.getElementById('endTimeInput');
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
  var roomName = event.target.value;
  selectedRoom = rooms.find(function (room) {
    return room.name === roomName;
  });
  if (!selectedRoom) return;

  // Update the current page based on the selected room's index
  var roomIndex = rooms.indexOf(selectedRoom);
  var totalPages = Math.ceil(rooms.length / roomsPerPage);
  var newPage = Math.ceil((roomIndex + 1) / roomsPerPage); // Calculate the page the room is on

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
  var _event$target$closest;
  if (!selectedRoom) return;
  var buttonId = (_event$target$closest = event.target.closest("button")) === null || _event$target$closest === void 0 ? void 0 : _event$target$closest.id;
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
  var inputsDiv = document.querySelector(".inputs");
  if (!inputsDiv) return;
  if (isOpen) {
    inputsDiv.classList.remove("hidden");
  } else {
    inputsDiv.classList.add("hidden");

    // Clear error message
    var errorSpan = document.querySelector(".error");
    if (errorSpan) {
      errorSpan.style.display = "none";
      errorSpan.textContent = "";
    }
  }
}

// Handle preset saving
function handlePresetSave() {
  if (!selectedRoom) return;
  var coolInput = document.getElementById("coolInput");
  var warmInput = document.getElementById("warmInput");
  var errorSpan = document.querySelector(".error");
  if (!coolInput || !warmInput || !errorSpan) return;
  var coolValue = coolInput.value.trim();
  var warmValue = warmInput.value.trim();
  var coolTemp = parseInt(coolValue, 10);
  var warmTemp = parseInt(warmValue, 10);
  var isCoolValid = !isNaN(coolTemp) && coolTemp >= TEMP_MIN_COOL && coolTemp <= TEMP_MAX_COOL;
  var isWarmValid = !isNaN(warmTemp) && warmTemp >= TEMP_MIN_WARM && warmTemp <= TEMP_MAX_WARM;
  if (coolValue === "" || warmValue === "") {
    errorSpan.style.display = "block";
    errorSpan.textContent = "Please fill in both preset values.";
    return;
  }
  if (!isCoolValid || !isWarmValid) {
    errorSpan.style.display = "block";
    errorSpan.textContent = "Cool: ".concat(TEMP_MIN_COOL, "\xB0\u2013").concat(TEMP_MAX_COOL, "\xB0, Warm: ").concat(TEMP_MIN_WARM, "\xB0\u2013").concat(TEMP_MAX_WARM, "\xB0");
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
  var roomElement = event.target.closest(".room-control");
  if (!roomElement) return;
  var roomName = roomElement.dataset.roomName;
  var room = rooms.find(function (r) {
    return r.name === roomName;
  });
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
  var modal = document.getElementById('scheduleModal');
  var startInput = document.getElementById('startTimeInput');
  var endInput = document.getElementById('endTimeInput');
  if (!modal || !startInput || !endInput) return;

  // Validate times
  if (startInput.value >= endInput.value) {
    alert('End time must be after start time');
    return;
  }

  // Update room with new schedule
  var _calculateTimePercent2 = calculateTimePercentages(startInput.value, endInput.value),
    startPercent = _calculateTimePercent2.startPercent,
    endPercent = _calculateTimePercent2.endPercent;
  currentlyEditingRoom.schedule = {
    startTime: startInput.value,
    endTime: endInput.value,
    startPercent: startPercent,
    endPercent: endPercent
  };
  currentlyEditingRoom.airConditionerOn = true;

  // Update UI
  generateRooms();
  saveRoomsToLocalStorage();

  // Close modal
  modal.classList.add('hidden');

  // Show confirmation
  showToast("Schedule set for ".concat(currentlyEditingRoom.name));
}

// Handle adding a new room
function handleAddRoom() {
  var nameInput = document.getElementById("newRoomName");
  var errorMessage = document.getElementById("roomErrorMessage");
  var modal = document.getElementById("addRoomModal");
  if (!nameInput || !errorMessage || !modal) return;
  var name = nameInput.value.trim();

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
  var exists = rooms.some(function (r) {
    return r.name.toLowerCase() === name.toLowerCase();
  });
  if (exists) {
    nameInput.classList.add("input-error");
    errorMessage.textContent = "Room with that name already exists.";
    errorMessage.style.display = "block";
    nameInput.value = "";
    return;
  }

  // Create and add the new room
  var newRoom = createRoom({
    name: name
  });
  rooms.push(newRoom);
  saveRoomsToLocalStorage();

  // Update the page to show the new room
  currentPage = Math.ceil(rooms.length / roomsPerPage);
  generateRooms();
  initializeRoomSelection();

  // Select the new room
  var roomSelect = document.getElementById("rooms");
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
  var newState = event.target.checked;

  // Toggle all A/Cs
  rooms.forEach(function (room) {
    room.airConditionerOn = newState;
  });
  generateRooms();
  saveRoomsToLocalStorage();
}

// Handle pagination buttons
function handlePaginationClick(direction) {
  var totalPages = Math.ceil(rooms.length / roomsPerPage);
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
  var roomSelect = document.getElementById("rooms");
  if (roomSelect) {
    roomSelect.addEventListener("change", handleRoomSelectChange);
  }

  // Temperature controls
  var increaseBtn = document.getElementById("increase");
  var decreaseBtn = document.getElementById("reduce");
  if (increaseBtn) increaseBtn.addEventListener("click", handleTemperatureIncrease);
  if (decreaseBtn) decreaseBtn.addEventListener("click", handleTemperatureDecrease);

  // Preset controls
  var defaultSettingsDiv = document.querySelector(".default-settings");
  if (defaultSettingsDiv) {
    defaultSettingsDiv.addEventListener("click", handlePresetClick);
  }

  // Preset panel controls
  var newPresetBtn = document.getElementById("newPreset");
  var closePresetBtn = document.getElementById("close");
  var savePresetBtn = document.getElementById("save");
  if (newPresetBtn) newPresetBtn.addEventListener("click", function () {
    return handlePresetPanelToggle(true);
  });
  if (closePresetBtn) closePresetBtn.addEventListener("click", function () {
    return handlePresetPanelToggle(false);
  });
  if (savePresetBtn) savePresetBtn.addEventListener("click", handlePresetSave);

  // Room controls
  var roomsControlContainer = document.querySelector(".rooms-control");
  if (roomsControlContainer) {
    roomsControlContainer.addEventListener("click", handleRoomControlClick);
  }

  // Schedule modal
  var closeModalBtn = document.querySelector('.close-modal');
  var confirmScheduleBtn = document.getElementById('confirmSchedule');
  var cancelScheduleBtn = document.getElementById('cancelSchedule');
  if (closeModalBtn) closeModalBtn.addEventListener('click', function () {
    var modal = document.getElementById('scheduleModal');
    if (modal) modal.classList.add('hidden');
  });
  if (confirmScheduleBtn) confirmScheduleBtn.addEventListener('click', handleScheduleConfirmation);
  if (cancelScheduleBtn) cancelScheduleBtn.addEventListener('click', function () {
    var modal = document.getElementById('scheduleModal');
    if (modal) modal.classList.add('hidden');
  });

  // Add room
  var addRoomBtn = document.getElementById("addRoomBtn");
  var saveRoomBtn = document.getElementById("saveRoomBtn");
  var cancelRoomBtn = document.getElementById("cancelRoomBtn");
  if (addRoomBtn) addRoomBtn.addEventListener("click", function () {
    var modal = document.getElementById("addRoomModal");
    if (modal) modal.classList.remove("hidden");
  });
  if (saveRoomBtn) saveRoomBtn.addEventListener("click", handleAddRoom);
  if (cancelRoomBtn) cancelRoomBtn.addEventListener("click", function () {
    var modal = document.getElementById("addRoomModal");
    if (modal) modal.classList.add("hidden");

    // Clear inputs
    var nameInput = document.getElementById("newRoomName");
    var errorMessage = document.getElementById("roomErrorMessage");
    if (nameInput) nameInput.value = "";
    if (errorMessage) {
      errorMessage.textContent = "";
      errorMessage.style.display = "none";
    }
  });

  // Reset all AC toggle
  var resetAllACBtn = document.getElementById("reset-ac-btn");
  if (resetAllACBtn) {
    resetAllACBtn.addEventListener("change", handleAllAcToggle);
  }

  // Pagination buttons
  var prevPageBtn = document.getElementById("prevPage");
  var nextPageBtn = document.getElementById("nextPage");
  if (prevPageBtn) prevPageBtn.addEventListener("click", function () {
    return handlePaginationClick('prev');
  });
  if (nextPageBtn) nextPageBtn.addEventListener("click", function () {
    return handlePaginationClick('next');
  });
}
document.addEventListener('DOMContentLoaded', initializeApp);
},{}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62707" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/main.js"], null)
//# sourceMappingURL=/main.1e43358e.js.map