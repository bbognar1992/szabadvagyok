// Admin panel functionality

// Update current time display
function updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    // Update the timezone display in the simplified panel
    const timezoneElement = document.getElementById('currentTimeDisplay');
    if (timezoneElement) {
        timezoneElement.textContent = `Central European Time (${timeString})`;
    }
}

// Handle duration button clicks
function handleDurationClick(button) {
    // Remove selected class from all duration buttons
    const allButtons = document.querySelectorAll('.duration-btn');
    allButtons.forEach(btn => {
        btn.classList.remove('border-green-500', 'bg-green-50', 'text-green-700');
        btn.classList.add('border-gray-300', 'bg-white', 'text-gray-700');
    });

    // Add selected class to clicked button
    button.classList.remove('border-gray-300', 'bg-white', 'text-gray-700');
    button.classList.add('border-green-500', 'bg-green-50', 'text-green-700');
}

// Show status message
function showStatusMessage(message, type) {
    const statusDiv = document.getElementById('statusMessage');
    const statusText = document.getElementById('statusText');

    if (statusDiv && statusText) {
        statusText.textContent = message;
        statusText.className = `text-sm font-medium ${
            type === 'success' ? 'text-green-600' : 'text-red-600'
        }`;

        statusDiv.classList.remove('hidden');

        // Hide after 3 seconds
        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 3000);
    }
}

// Add new schedule row
function addScheduleRow() {
    const scheduleRows = document.getElementById('scheduleRows');
    if (!scheduleRows) return;

    const rowCount = scheduleRows.children.length + 1;
    const newRow = document.createElement('div');
    newRow.className = 'schedule-row flex items-end space-x-4 p-4 bg-gray-50 rounded-lg group';
    newRow.innerHTML = `
        <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Available days</label>
            <select class="day-selector w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm">
                <option value="weekdays">Mon - Fri (Weekdays)</option>
                <option value="weekend">Sat - Sun (Weekend)</option>
                <option value="monday">Monday</option>
                <option value="tuesday">Tuesday</option>
                <option value="wednesday">Wednesday</option>
                <option value="thursday">Thursday</option>
                <option value="friday">Friday</option>
                <option value="saturday">Saturday</option>
                <option value="sunday">Sunday</option>
            </select>
        </div>
        <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Available hours</label>
            <div class="flex items-center space-x-2">
                <input type="time" class="start-time flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm" value="09:00">
                <span class="text-gray-500">to</span>
                <input type="time" class="end-time flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm" value="17:00">
            </div>
        </div>
        <div class="flex-shrink-0">
            <button type="button" class="delete-row-btn text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 opacity-100 transition-opacity" title="Remove this schedule">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    `;

    scheduleRows.appendChild(newRow);

    // Add event listeners to the new row elements
    attachRowEventListeners(newRow);
}

// Delete schedule row
function deleteScheduleRow(button) {
    const row = button.closest('.schedule-row');
    if (row && confirm('Are you sure you want to remove this schedule?')) {
        row.remove();
    }
}

// Attach event listeners to a row
function attachRowEventListeners(row) {
    // Day selector change
    const daySelector = row.querySelector('.day-selector');
    if (daySelector) {
        daySelector.addEventListener('change', (e) => {
            console.log('Selected days:', e.target.value);
        });
    }

    // Time inputs change
    const startTime = row.querySelector('.start-time');
    const endTime = row.querySelector('.end-time');

    if (startTime) {
        startTime.addEventListener('change', (e) => {
            console.log('Start time changed:', e.target.value);
        });
    }

    if (endTime) {
        endTime.addEventListener('change', (e) => {
            console.log('End time changed:', e.target.value);
        });
    }

    // Delete button
    const deleteBtn = row.querySelector('.delete-row-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deleteScheduleRow(deleteBtn));
    }
}

// Handle simplified availability panel interactions
function handleAvailabilityPanel() {
    // Handle duration buttons
    const durationButtons = document.querySelectorAll('.duration-btn');
    durationButtons.forEach(button => {
        button.addEventListener('click', () => handleDurationClick(button));
    });

    // Handle add weekday button
    const addWeekdayBtn = document.getElementById('addWeekdayBtn');
    if (addWeekdayBtn) {
        addWeekdayBtn.addEventListener('click', addScheduleRow);
    }

    // Handle other action buttons
    const addDateBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Add specific date'));
    const addBreakBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Add break time'));

    if (addDateBtn) {
        addDateBtn.addEventListener('click', () => {
            alert('Add specific date functionality - would open date picker');
        });
    }

    if (addBreakBtn) {
        addBreakBtn.addEventListener('click', () => {
            alert('Add break time functionality - would open break time configuration');
        });
    }

    // Attach event listeners to existing rows
    const existingRows = document.querySelectorAll('.schedule-row');
    existingRows.forEach(row => attachRowEventListeners(row));
}

// Save availability settings
function saveSettings() {
    // Get all schedule rows
    const scheduleRows = document.querySelectorAll('.schedule-row');
    const schedules = [];

    scheduleRows.forEach((row, index) => {
        const daySelector = row.querySelector('.day-selector');
        const startTime = row.querySelector('.start-time');
        const endTime = row.querySelector('.end-time');

        if (daySelector && startTime && endTime) {
            schedules.push({
                days: daySelector.value,
                startTime: startTime.value,
                endTime: endTime.value
            });
        }
    });

    const selectedDuration = document.querySelector('.duration-btn.border-green-500')?.dataset.duration;

    const settings = {
        schedules: schedules,
        duration: selectedDuration
    };

    console.log('Saving settings:', settings);

    // For now, just show a success message
    // In a real implementation, this would save to localStorage or send to server
    showStatusMessage('Availability settings saved successfully! ✅', 'success');
}

// Initialize admin panel
function initAdminPanel() {
    // Update time immediately and then every minute
    updateCurrentTime();
    setInterval(updateCurrentTime, 60000);

    // Set up event listeners
    const saveButton = document.getElementById('saveSettings');
    if (saveButton) {
        saveButton.addEventListener('click', saveSettings);
    }

    // Set default selected duration (30 min)
    const firstDurationButton = document.querySelector('.duration-btn');
    if (firstDurationButton) {
        handleDurationClick(firstDurationButton);
    }

    // Initialize availability panel
    handleAvailabilityPanel();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initAdminPanel);
