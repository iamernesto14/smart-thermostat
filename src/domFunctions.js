// domFunctions.js

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
  // Position temperature indicator on UI
  function setIndicatorPoint(currTemp) {
    const svgPoint = document.querySelector(".point");
    if (!svgPoint) return;
  
    const position = calculatePointPosition(currTemp);
    svgPoint.style.transform = `translate(${position.translateX}px, ${position.translateY}px)`;
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
  
  module.exports = {
    showToast,
    setOverlay,
    setInitialOverlay,
    setIndicatorPoint,
    updateRoomUI,
    initializeRoomSelection,
    generateRooms,
    updatePaginationControls,
    calculatePointPosition
  };
  