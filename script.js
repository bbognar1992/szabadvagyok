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
    
    // On mobile, ensure calendar view is shown by default
    if (window.innerWidth <= 768) {
        const calendarSection = document.getElementById('calendarSection');
        const timeSlotsSection = document.getElementById('timeSlotsSection');
        const mobileBackBtn = document.getElementById('mobileBackToCalendar');

        if (calendarSection) {
            calendarSection.classList.remove('hidden');
            calendarSection.classList.add('flex');
        }
        if (timeSlotsSection) {
            timeSlotsSection.classList.add('hidden');
            timeSlotsSection.classList.remove('flex');
        }
        if (mobileBackBtn) {
            mobileBackBtn.classList.add('hidden');
            mobileBackBtn.classList.remove('block');
        }
    }
    
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
        dayNameEl.className = 'text-center text-xs font-medium text-gray-600 py-3 px-2 uppercase tracking-wider';
        dayNameEl.textContent = day;
        calendarGrid.appendChild(dayNameEl);
    });
    
    // Add empty cells for days before month starts
    for (let i = 0; i < adjustedStartingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'aspect-square flex items-center justify-center rounded-2xl cursor-not-allowed text-gray-300 bg-white/40 opacity-40';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        const dayEl = document.createElement('div');
        dayEl.className = 'aspect-square flex items-center justify-center rounded-2xl cursor-pointer text-sm font-medium transition-all duration-300 bg-white/80 text-gray-700 border border-transparent shadow-sm hover:bg-gray-50 hover:border-black/20 hover:text-black hover:-translate-y-0.5 hover:shadow-md';
        dayEl.textContent = day;
        
        // Check if date is in the past or not Monday/Wednesday
        const dayOfWeek = dayDate.getDay();
        const isPickableDay = dayOfWeek === 1 || dayOfWeek === 3; // Monday = 1, Wednesday = 3

        if (dayDate < today || !isPickableDay) {
            dayEl.className = 'aspect-square flex items-center justify-center rounded-2xl cursor-not-allowed text-gray-300 bg-white/50 opacity-40';
        } else {
            dayEl.addEventListener('click', () => selectDate(dayDate));
        }
        
        // Highlight today
        if (dayDate.getTime() === today.getTime()) {
            if (isPickableDay && dayDate >= today) {
                dayEl.className = 'aspect-square flex items-center justify-center rounded-2xl cursor-pointer text-sm font-semibold transition-all duration-300 border-2 border-black bg-gray-50 text-black shadow-md';
                dayEl.addEventListener('click', () => selectDate(dayDate));
            } else {
                dayEl.className = 'aspect-square flex items-center justify-center rounded-2xl cursor-not-allowed text-gray-300 bg-white/50 opacity-40';
            }
        }
        
        // Highlight selected date
        if (selectedDate && 
            dayDate.getFullYear() === selectedDate.getFullYear() &&
            dayDate.getMonth() === selectedDate.getMonth() &&
            dayDate.getDate() === selectedDate.getDate()) {
            dayEl.className = 'aspect-square flex items-center justify-center rounded-2xl cursor-pointer text-sm font-semibold transition-all duration-300 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-transparent shadow-lg scale-105';
            dayEl.addEventListener('click', () => selectDate(dayDate));
        }
        
        calendarGrid.appendChild(dayEl);
    }
}

function selectDate(date) {
    selectedDate = new Date(date);
    selectedTime = null;
    updateCalendar();
    generateTimeSlots();
    
    // On mobile, switch to time slots view
    if (window.innerWidth <= 768) {
        showMobileTimeSlots();
    } else {
        showBookingSelection();
    }
}

function showMobileTimeSlots() {
    const calendarSection = document.getElementById('calendarSection');
    const timeSlotsSection = document.getElementById('timeSlotsSection');
    const mobileBackBtn = document.getElementById('mobileBackToCalendar');

    if (calendarSection && timeSlotsSection && mobileBackBtn) {
        // Hide calendar and show time slots
        calendarSection.classList.add('hidden');
        calendarSection.classList.remove('flex');
        timeSlotsSection.classList.remove('hidden');
        timeSlotsSection.classList.add('flex');
        mobileBackBtn.classList.remove('hidden');
        mobileBackBtn.classList.add('block');
    }
}

function showMobileCalendar() {
    const calendarSection = document.getElementById('calendarSection');
    const timeSlotsSection = document.getElementById('timeSlotsSection');
    const mobileBackBtn = document.getElementById('mobileBackToCalendar');

    if (calendarSection && timeSlotsSection && mobileBackBtn) {
        // Show calendar and hide time slots
        calendarSection.classList.remove('hidden');
        calendarSection.classList.add('flex');
        timeSlotsSection.classList.add('hidden');
        timeSlotsSection.classList.remove('flex');
        mobileBackBtn.classList.add('hidden');
        mobileBackBtn.classList.remove('block');
        selectedTime = null;
        selectedDate = null; // Clear selected date to go back to calendar
        updateProgressBar(1);
        updateCalendar();
        generateTimeSlots();
    }
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
            '<p class="text-gray-400 text-sm text-center py-12 px-6 col-span-full font-normal">Nincs elérhető időpont ezen a napon</p>';
        return;
    }
    
    availableSlots.forEach((slot) => {
        const slotEl = document.createElement('div');
        slotEl.className = 'px-5 py-3.5 border border-black/10 rounded-2xl bg-white/90 cursor-pointer text-center text-sm font-medium text-gray-700 transition-all duration-300 w-full h-auto min-h-12 flex items-center justify-center box-border shadow-sm hover:border-black/20 hover:bg-gray-50 hover:text-black hover:-translate-y-0.5 hover:shadow-md';
        slotEl.textContent = slot;
        slotEl.addEventListener('click', () => selectTime(slot));
        
        if (selectedTime === slot) {
            slotEl.className = 'px-5 py-3.5 border-transparent rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white cursor-pointer text-center text-sm font-semibold transition-all duration-300 w-full h-auto min-h-12 flex items-center justify-center box-border shadow-lg scale-[1.02]';
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
        const selection = document.getElementById('bookingSelection');
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
        
        // Hide selection, show summary
        selection.classList.add('hidden');
        selection.classList.remove('grid');
        summary.classList.remove('hidden');
        summary.classList.add('flex');
    }
}

function showBookingSelection() {
    const summary = document.getElementById('bookingSummary');
    const selection = document.getElementById('bookingSelection');
    
    // Hide summary, show selection
    summary.classList.add('hidden');
    summary.classList.remove('flex');
    selection.classList.remove('hidden');
    selection.classList.add('grid');
    
    // On mobile, show calendar view
    if (window.innerWidth <= 768) {
        showMobileCalendar();
    }
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
    
    // Back button
    document.getElementById('backToSelection').addEventListener('click', () => {
        showBookingSelection();
    });
    
    // Mobile back to calendar button
    const mobileBackBtn = document.getElementById('mobileBackToCalendar');
    if (mobileBackBtn) {
        mobileBackBtn.addEventListener('click', () => {
            showMobileCalendar();
        });
    }
    
    // Confirm booking button
    document.getElementById('confirmBooking').addEventListener('click', () => {
        const guestName = document.getElementById('guestName').value.trim();
        const guestEmail = document.getElementById('guestEmail').value.trim();
        
        // Validation
        if (!guestName) {
            alert('Kérjük, add meg a neved!');
            document.getElementById('guestName').focus();
            return;
        }
        
        if (!guestEmail) {
            alert('Kérjük, add meg az email címed!');
            document.getElementById('guestEmail').focus();
            return;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(guestEmail)) {
            alert('Kérjük, adj meg egy érvényes email címet!');
            document.getElementById('guestEmail').focus();
            return;
        }
        
        if (selectedDate && selectedTime) {
            alert(`Foglalás megerősítve!\n\nNév: ${guestName}\nEmail: ${guestEmail}\nDátum: ${selectedDate.toLocaleDateString('hu-HU')}\nIdőpont: ${selectedTime}\nIdőtartam: ${selectedDuration} perc`);
            // Here you would typically send the booking to a backend API
            // const bookingData = {
            //     name: guestName,
            //     email: guestEmail,
            //     date: selectedDate,
            //     time: selectedTime,
            //     duration: selectedDuration
            // };
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCalendar);

