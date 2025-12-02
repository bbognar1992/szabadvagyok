// Calendar functionality
let currentDate = new Date(2025, 11, 1); // December 2025
let selectedDate = null;
let selectedTime = null;
let selectedDuration = 15;

const dayNames = ['H', 'K', 'Sz', 'Cs', 'P', 'Sz', 'V'];
const monthNames = [
    'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
    'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'
];

// Initialize calendar
function initCalendar() {
    updateCalendar();
    setupEventListeners();
    generateTimeSlots();
    updateTimezoneDisplay();
    // Update time every minute
    setInterval(updateTimezoneDisplay, 60000);
}

function updateTimezoneDisplay() {
    const timezoneDisplay = document.getElementById('timezoneDisplay');
    if (timezoneDisplay) {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        timezoneDisplay.textContent = `Central European Time (${hours}:${minutes})`;
    }
}

function updateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month/year display
    document.getElementById('monthYear').textContent = 
        `${monthNames[month]} ${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Adjust for Monday as first day (0 = Sunday, 1 = Monday, etc.)
    const adjustedStartingDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // Add day names
    dayNames.forEach(day => {
        const dayNameEl = document.createElement('div');
        dayNameEl.className = 'day-name';
        dayNameEl.textContent = day;
        calendarGrid.appendChild(dayNameEl);
    });
    
    // Add empty cells for days before month starts
    for (let i = 0; i < adjustedStartingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day disabled';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;
        
        // Check if date is in the past
        if (dayDate < today) {
            dayEl.classList.add('disabled');
        } else {
            dayEl.addEventListener('click', () => selectDate(dayDate));
        }
        
        // Highlight today
        if (dayDate.getTime() === today.getTime()) {
            dayEl.classList.add('today');
        }
        
        // Highlight selected date
        if (selectedDate && 
            dayDate.getFullYear() === selectedDate.getFullYear() &&
            dayDate.getMonth() === selectedDate.getMonth() &&
            dayDate.getDate() === selectedDate.getDate()) {
            dayEl.classList.add('selected');
        }
        
        calendarGrid.appendChild(dayEl);
    }
}

function selectDate(date) {
    selectedDate = new Date(date);
    selectedTime = null;
    updateCalendar();
    generateTimeSlots();
    hideBookingSummary();
}

function updateSelectedDateDisplay() {
    const dateDisplay = document.getElementById('selectedDate');
    if (selectedDate) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        dateDisplay.textContent = selectedDate.toLocaleDateString('hu-HU', options);
    } else {
        dateDisplay.textContent = 'Válassz egy dátumot';
    }
}

function generateTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    timeSlotsContainer.innerHTML = '';
    
    if (!selectedDate) {
        timeSlotsContainer.innerHTML = 
            '<p class="no-date-selected">Kérjük, válassz egy dátumot a naptárból</p>';
        return;
    }
    
    // Generate time slots (9 AM to 5 PM, every 15 minutes)
    const allSlots = [];
    const startHour = 9;
    const endHour = 17;
    
    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            allSlots.push(timeString);
        }
    }
    
    // Filter to only available slots (randomly exclude ~30% for realism)
    const availableSlots = allSlots.filter((slot, index) => {
        // Keep first slot and randomly keep ~70% of others
        return index === 0 || Math.random() >= 0.3;
    });
    
    // Only render available slots
    if (availableSlots.length === 0) {
        timeSlotsContainer.innerHTML = 
            '<p class="no-date-selected">Nincs elérhető időpont ezen a napon</p>';
        return;
    }
    
    availableSlots.forEach((slot) => {
        const slotEl = document.createElement('div');
        slotEl.className = 'time-slot';
        slotEl.textContent = slot;
        slotEl.addEventListener('click', () => selectTime(slot));
        
        if (selectedTime === slot) {
            slotEl.classList.add('selected');
        }
        
        timeSlotsContainer.appendChild(slotEl);
    });
}

function selectTime(time) {
    selectedTime = time;
    generateTimeSlots();
    showBookingSummary();
}

function showBookingSummary() {
    if (selectedDate && selectedTime) {
        const summary = document.getElementById('bookingSummary');
        const summaryDate = document.getElementById('summaryDate');
        const summaryTime = document.getElementById('summaryTime');
        const summaryDuration = document.getElementById('summaryDuration');
        
        const dateOptions = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
        };
        
        summaryDate.textContent = selectedDate.toLocaleDateString('hu-HU', dateOptions);
        summaryTime.textContent = selectedTime;
        summaryDuration.textContent = `${selectedDuration} perc`;
        
        summary.style.display = 'block';
    }
}

function hideBookingSummary() {
    document.getElementById('bookingSummary').style.display = 'none';
}

function setupEventListeners() {
    // Previous/Next month navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    });
    
    // Confirm booking button
    document.getElementById('confirmBooking').addEventListener('click', () => {
        if (selectedDate && selectedTime) {
            alert(`Foglalás megerősítve!\n\nDátum: ${selectedDate.toLocaleDateString('hu-HU')}\nIdőpont: ${selectedTime}\nIdőtartam: ${selectedDuration} perc`);
            // Here you would typically send the booking to a backend API
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCalendar);

