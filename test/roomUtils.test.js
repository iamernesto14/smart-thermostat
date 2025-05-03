// roomUtils.test.js

const { 
    createRoom, 
    getOverlayByTemp, 
    getRoomByName, 
    updateRoomPreset, 
    removeRoom, 
    toggleRoomAC, 
    addRoom, 
    roomExists 
  } = require('../src/roomUtils');
  
  describe('Room Utilities', () => {
    let rooms;
  
    beforeEach(() => {
      rooms = [
        { name: 'Living Room', preset: 22, acOn: true },
        { name: 'Bedroom', preset: 18, acOn: false },
        { name: 'Kitchen', preset: 20, acOn: true }
      ];
    });
  
    test('createRoom should create a room with correct properties', () => {
      const room = createRoom('Bathroom', 19);
      expect(room).toEqual({ name: 'Bathroom', preset: 19, acOn: false });
    });
  
    test('getOverlayByTemp should return correct overlay based on temperature', () => {
      const overlay = getOverlayByTemp(18);
      expect(overlay).toBe('cool-overlay'); // Temperature <= 22 should return 'cool-overlay'
  
      const overlay2 = getOverlayByTemp(24);
      expect(overlay2).toBe('warm-overlay'); // Temperature > 22 should return 'warm-overlay'
    });
  
    test('getRoomByName should return the correct room', () => {
      const room = getRoomByName(rooms, 'Living Room');
      expect(room).toEqual({ name: 'Living Room', preset: 22, acOn: true });
    });
  
    test('updateRoomPreset should update room preset', () => {
      const updatedRoom = updateRoomPreset(rooms[0], 24);
      expect(updatedRoom.preset).toBe(24);
    });
  
    test('removeRoom should remove a room from the list', () => {
      const result = removeRoom(rooms, 'Living Room');
      expect(result).toBe(true);
      expect(rooms).toHaveLength(2);  // The room should be removed
    });
  
    test('toggleRoomAC should toggle the AC status', () => {
      const room = toggleRoomAC(rooms[0]);
      expect(room.acOn).toBe(false);  // AC status should be toggled
    });
  
    test('addRoom should add a new room to the list', () => {
      const newRoom = addRoom(rooms, 'Bathroom', 19, false);
      expect(newRoom).toEqual({ name: 'Bathroom', preset: 19, acOn: false });
      expect(rooms).toHaveLength(4);  // The room should be added
    });
  
    test('roomExists should return true if the room exists', () => {
      const exists = roomExists(rooms, 'Bedroom');
      expect(exists).toBe(true);
    });
  
    test('roomExists should return false if the room does not exist', () => {
      const exists = roomExists(rooms, 'Garage');
      expect(exists).toBe(false);
    });
  });
  