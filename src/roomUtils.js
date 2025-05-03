// roomUtils.js

// Function to create a new room with a preset temperature and AC status
function createRoom(name, temp = 22) {
    return {
      name,
      preset: temp,
      acOn: false 
    };
  }
  
  // Function to get the overlay based on temperature
  function getOverlayByTemp(temp) {
    return temp <= 22 ? 'cool-overlay' : 'warm-overlay';
  }
  
  // Function to get a room by name from an array of rooms
  function getRoomByName(rooms, name) {
    return rooms.find(room => room.name === name);
  }
  
  // Function to update the preset temperature of a room
  function updateRoomPreset(room, newPreset) {
    room.preset = newPreset;
    return room;
  }
  
  // Function to remove a room from the list of rooms by name
  function removeRoom(rooms, name) {
    const index = rooms.findIndex(room => room.name === name);
    if (index !== -1) {
      rooms.splice(index, 1); // Remove the room from the array
      return true;
    }
    return false;
  }
  
  // Function to toggle the AC status of a room
  function toggleRoomAC(room) {
    room.acOn = !room.acOn;
    return room;
  }
  
  // Function to add a new room to the list of rooms
  function addRoom(rooms, name, temp = 22, acOn = false) {
    const newRoom = createRoom(name, temp);
    newRoom.acOn = acOn;
    rooms.push(newRoom);
    return newRoom;
  }
  
  // Function to check if a room already exists in the list
  function roomExists(rooms, name) {
    return rooms.some(room => room.name === name);
  }
  
  // Exporting the functions for use in other files (like test files)
  module.exports = {
    createRoom,
    getOverlayByTemp,
    getRoomByName,
    updateRoomPreset,
    removeRoom,
    toggleRoomAC,
    addRoom,
    roomExists
  };
  