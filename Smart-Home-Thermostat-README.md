
# 🌡️ Smart Home Thermostat Dashboard

A responsive web-based thermostat dashboard that enables users to monitor and manage room temperatures, set custom presets, control air conditioning, and maintain persistent state across sessions using `localStorage`.

## 📦 Table of Contents
- [Features](#features)
- [Bugs & Fixes](#bugs--fixes)
- [How It Works](#how-it-works)
- [Pagination](#pagination)
- [Setup Instructions](#setup-instructions)
- [Tech Stack](#tech-stack)
- [Credits](#credits)

---

## ✅ Features

### 🌡️ Temperature Controls
- Adjust temperature (10°C–32°C) via `+`/`–` buttons.
- Set **cool (10–24°C)** and **warm (25–32°C)** presets.
- Configure custom presets via input fields with validation.

### 🧠 Room Management
- Preloaded rooms: Living Room, Kitchen, Bedroom, Bathroom.
- Add new rooms through modal with input validation.
- Duplicate room names are disallowed.
- Room states persist via `localStorage`.

### 🖥️ Visual Feedback
- Blue or red background overlays based on temperature.
- Toast notifications for actions like saving presets or adding rooms.
- SVG temperature gauge dynamically updates based on temperature.
- Air conditioner status message shows:
  - `"Cooling room to: XX°"` if ≤ 24°C
  - `"Warming room to: XX°"` if ≥ 25°C

### 🧭 Pagination
- View multiple rooms with paginated controls.
- 4 rooms displayed per page.
- Buttons:
  - "Next" and "Previous" to switch pages
  - Page indicator shows current page out of total
- Disabled buttons styled to indicate inactivity.

---

## 🐞 Bugs & Fixes

### 1. **Room Gradient Not Updating with Temperature**
- ❌ Issue: Background gradient didn’t reflect current temperature.
- 🔍 Found via visual inspection and console logging.
- ✅ Fix: Used `setOverlay(room)` to apply `coolOverlay` or `warmOverlay` based on `currTemp`.

---

### 2. **Invalid Presets Accepted Silently**
- ❌ Issue: Users could input invalid temperature values without feedback.
- 🔍 Found via manual input testing.
- ✅ Fix: Added range checks (cool: 10–24°C, warm: 25–32°C) and styled inline error messages using toast notifications.

---

### 3. **Error Message Persisted After Closing Preset Form**
- ❌ Issue: Error span remained visible after closing the modal.
- 🔍 Found via user interaction tests.
- ✅ Fix: Modified `#close` button logic to also clear and hide the error span.

```js
document.getElementById("close").addEventListener("click", () => {
  inputsDiv.classList.add("hidden");

  const errorSpan = document.querySelector(".error");
  errorSpan.style.display = "none";
  errorSpan.textContent = "";
});
```

---

### 4. **Incorrect AC Status Message**
- ❌ Issue: Status message (cooling/warming) showed incorrect logic.
- 🔍 Found through manual testing of AC toggle with different temperatures.
- ✅ Fix: Reversed the conditional to:
```js
${room.currTemp <= 24 ? "Cooling room to: " : "Warming room to: "}
```

---

### 5. **Inefficient Event Binding for Preset Buttons**
- ❌ Issue: Direct listeners on multiple elements.
- 🔍 Identified through code review.
- ✅ Fix: Replaced with event delegation using a shared container `.default-settings`.

```js
document.querySelector(".default-settings").addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  if (button.id === "cool") {
    setTemperature(coldPreset);
  } else if (button.id === "warm") {
    setTemperature(warmPreset);
  }
});
```

---

## ⚙️ How It Works

1. **Initial Load**: Predefined rooms are shown with current temperatures.
2. **User Interaction**:
   - Adjust temperature
   - Toggle air conditioner
   - Set or edit presets
   - Add new rooms
3. **UI Feedback**:
   - Background changes to red/blue
   - Toasts confirm actions
   - AC status messages update correctly
4. **Persistence**: All changes are stored in `localStorage`.

---

## ⏩ Pagination

### UI Behavior
- Pagination at bottom of dashboard.
- Room cards paginated in sets of 4.
- Buttons auto-disable on first/last page.

### Responsive Design
- Pagination and cards adapt to screen size using flexible layout and media queries.

---

## 🛠️ Setup Instructions

### ✅ Prerequisites
- A modern browser (Chrome, Firefox, Edge)
- No build tools required (vanilla HTML/CSS/JS)

### 🚀 Run the App
1. Clone or download the project folder.
2. Open `index.html` in your browser.

That’s it! No server or bundler needed.

---

## 🧰 Tech Stack

| Tech | Usage |
|------|-------|
| HTML | Structure |
| CSS  | Styling and UI layout |
| JavaScript | DOM interaction, state management, logic |
| localStorage | Persistent data |

---

## 👥 Credits

Developed by Ernest Anokye as part of a Smart Thermostat lab activity, focusing on:
- DOM manipulation
- Input validation
- UI/UX patterns
- Persistent browser storage
- Modular event-driven programming
