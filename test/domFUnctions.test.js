/**
 * @jest-environment jsdom
 */

const {
    showToast,
    setOverlay,
    setIndicatorPoint,
    updateRoomUI,
    initializeRoomSelection,
    updatePaginationControls
} = require("../src/domFunctions");

// Mock required globals
global.TEMP_MIN = 16;
global.TEMP_MAX = 30;
global.TEMP_MAX_COOL = 22;
global.coolOverlay = ["#00f", "#0ff"];
global.warmOverlay = ["#f00", "#faa"];

describe("DOM functions", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        document.body.innerHTML = "";
    });

    afterEach(() => {
        jest.runAllTimers(); // Ensure all timers run after each test
    });

    test("setIndicatorPoint should move the indicator point", () => {
        document.body.innerHTML = `<div class="point"></div>`;
        const svgPoint = document.querySelector(".point");

        global.calculatePointPosition = jest.fn(() => ({
            translateX: 100,
            translateY: 50
        }));

        setIndicatorPoint(22);

        expect(svgPoint.style.transform).toMatch(/translate\(-?\d+\.?\d*px, -?\d+\.?\d*px\)/);
    });

    test("updateRoomUI should update UI with room details", () => {
        const room = {
            name: "Living Room",
            currTemp: 20,
            image: "living-room.jpg"
        };

        document.body.innerHTML = `
            <div class="room-control" data-room-name="Living Room"></div>
            <div id="temp"></div>
            <div class="currentTemp"></div>
            <div class="room-name"></div>
            <div class="room"></div>
            <div class="point"></div>
        `;

        global.calculatePointPosition = jest.fn(() => ({
            translateX: 50,
            translateY: 30
        }));

        updateRoomUI(room);

        expect(document.getElementById("temp").textContent).toBe("20°");
        expect(document.querySelector(".currentTemp").textContent).toBe("20°");
        expect(document.querySelector(".room-name").textContent).toBe("Living Room");
    });

    test("initializeRoomSelection should populate the room selection dropdown", () => {
        global.rooms = [
            { name: "Living Room", currTemp: 20, image: "img.jpg" },
            { name: "Bedroom", currTemp: 22, image: "img.jpg" }
        ];
        global.selectedRoom = global.rooms[0];

        document.body.innerHTML = `
            <select id="rooms"></select>
            <div class="room-control" data-room-name="Living Room"></div>
            <div id="temp"></div>
            <div class="currentTemp"></div>
            <div class="room-name"></div>
            <div class="room"></div>
            <div class="point"></div>
        `;

        global.calculatePointPosition = jest.fn(() => ({
            translateX: 50,
            translateY: 30
        }));

        initializeRoomSelection();

        const roomSelect = document.getElementById("rooms");
        expect(roomSelect.options.length).toBe(global.rooms.length);
        expect(roomSelect.value).toBe(global.selectedRoom.name);
    });

    test("updatePaginationControls should update pagination controls", () => {
        global.currentPage = 1;

        document.body.innerHTML = `
            <span id="pageIndicator"></span>
            <button id="prevPage"></button>
            <button id="nextPage"></button>
        `;

        updatePaginationControls(2);

        expect(document.getElementById("pageIndicator").textContent).toBe("Page 1 of 2");
        expect(document.getElementById("prevPage").disabled).toBe(true);
        expect(document.getElementById("nextPage").disabled).toBe(false);
    });

    // Test for showToast functionality
    test("showToast should display a toast message and hide it after the specified duration", () => {
        document.body.innerHTML = `
            <div id="toast" class="hidden"></div>
        `;
        const toast = document.getElementById("toast");

        // Check that the toast element exists before proceeding
        if (!toast) {
            console.error("Toast element not found");
            return;
        }

        // Call showToast with a custom message and default duration
        showToast("Test Toast Message");

        // Check if the toast element is shown
        expect(toast.classList.contains("show")).toBe(true);
        expect(toast.classList.contains("hidden")).toBe(false);
        expect(toast.textContent).toBe("Test Toast Message");

        // Simulate the passing of time for the toast to disappear
        jest.advanceTimersByTime(3000); // Advance by 3 seconds (default duration)
        jest.runAllTimers(); // Ensure all timers are triggered

        // Check that the toast is hidden after the duration
        expect(toast.classList.contains("hidden")).toBe(true);
        expect(toast.classList.contains("show")).toBe(false);
    });

    // Test for showToast with custom duration
    test("showToast should hide the toast after a custom duration", () => {
        document.body.innerHTML = `
            <div id="toast" class="hidden"></div>
        `;
        const toast = document.getElementById("toast");

        // Check that the toast element exists before proceeding
        if (!toast) {
            console.error("Toast element not found");
            return;
        }

        // Call showToast with a custom message and custom duration
        showToast("Test Toast Message", 1000);

        // Check if the toast element is shown
        expect(toast.classList.contains("show")).toBe(true);
        expect(toast.classList.contains("hidden")).toBe(false);
        expect(toast.textContent).toBe("Test Toast Message");

        // Simulate the passing of time for the toast to disappear
        jest.advanceTimersByTime(1000); // Advance by 1 second (custom duration)
        jest.runAllTimers(); // Ensure all timers are triggered

        // Check that the toast is hidden after the custom duration
        expect(toast.classList.contains("hidden")).toBe(true);
        expect(toast.classList.contains("show")).toBe(false);
    });
});
