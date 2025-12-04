// Calendar functionality
let currentDate = new Date(2025, 11, 1); // December 2025
let selectedDate = null;
let selectedTime = null;
let selectedDuration = 15;
let currentStep = 1;
let currentTimeTab = 1; // 1-6 for the 6 time intervals

const dayNames = ['H', 'K', 'Sz', 'Cs', 'P', 'Sz', 'V'];
const monthNames = [
    'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
    'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'
];

// Initialize calendar
function initCalendar() {
    updateCalendar();
    setupEventListeners();
    updateTimezoneDisplay();
    updateProgressIndicator();
    updateTabStyles();
    showStep(1); // Start with step 1

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

// Step management functions
function updateProgressIndicator() {
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const progress1 = document.getElementById('progress1');
    const progress2 = document.getElementById('progress2');

    // Reset all to inactive state
    step1.className = 'w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm transition-all duration-300';
    step2.className = 'w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm transition-all duration-300';
    step3.className = 'w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm transition-all duration-300';
    progress1.className = 'w-8 h-0.5 bg-gray-300 transition-all duration-300';
    progress2.className = 'w-8 h-0.5 bg-gray-300 transition-all duration-300';

    // Update based on current step
    if (currentStep >= 1) {
        step1.className = 'w-8 h-8 bg-cyan-400 flex items-center justify-center text-black font-bold text-sm transition-all duration-200';
    }
    if (currentStep >= 2) {
        step2.className = 'w-8 h-8 bg-cyan-400 flex items-center justify-center text-black font-bold text-sm transition-all duration-200';
        progress1.className = 'w-8 h-0.5 bg-cyan-400 transition-all duration-200';
    }
    if (currentStep >= 3) {
        step3.className = 'w-8 h-8 bg-cyan-400 flex items-center justify-center text-black font-bold text-sm transition-all duration-200';
        progress2.className = 'w-8 h-0.5 bg-cyan-400 transition-all duration-200';
    }
}

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(step => {
        step.classList.add('hidden');
    });

    // Show target step
    const targetStep = document.getElementById(`step${getStepName(stepNumber)}`);
    if (targetStep) {
        targetStep.classList.remove('hidden');
    }

    currentStep = stepNumber;
    updateProgressIndicator();
}

function getStepName(stepNumber) {
    const stepNames = {
        1: 'DateSelection',
        2: 'TimeSelection',
        3: 'BookingDetails'
    };
    return stepNames[stepNumber] || 'DateSelection';
}

function goToTimeSelection() {
    if (selectedDate) {
        showStep(2);
    }
}

function goToBookingDetails() {
    if (selectedDate && selectedTime) {
        showBookingSummary();
        showStep(3);
    }
}

function goBackToCalendar() {
    selectedDate = null;
    selectedTime = null;
    updateCalendar();
    generateTimeSlots();
    showStep(1);
}

function goBackToTimeSelection() {
    showStep(2);
}

function goToStep(stepNumber) {
    // Allow going back to previous steps, but not forward beyond current progress
    if (stepNumber === 1) {
        goBackToCalendar();
    } else if (stepNumber === 2 && selectedDate) {
        showStep(2);
    } else if (stepNumber === 3 && selectedDate && selectedTime) {
        showStep(3);
    }
    // If trying to go to a step that's not accessible, do nothing
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
        dayNameEl.className = 'text-center text-xs font-bold text-cyan-400 py-4 px-2 uppercase tracking-wider';
        dayNameEl.textContent = day;
        calendarGrid.appendChild(dayNameEl);
    });
    
    // Add empty cells for days before month starts
    for (let i = 0; i < adjustedStartingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'aspect-square flex items-center justify-center rounded-2xl cursor-not-allowed text-gray-300 bg-gradient-to-br from-gray-100/40 to-gray-200/40 opacity-40';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Add days of the month
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        const dayEl = document.createElement('div');
        dayEl.className = 'aspect-square flex items-center justify-center cursor-pointer text-sm font-bold transition-all duration-200 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white hover:border-cyan-400';
        dayEl.textContent = day;
        
        // Check if date is in the past or not Monday/Wednesday
        const dayOfWeek = dayDate.getDay();
        const isPickableDay = dayOfWeek === 1 || dayOfWeek === 3; // Monday = 1, Wednesday = 3

        if (dayDate < today || !isPickableDay) {
            dayEl.className = 'aspect-square flex items-center justify-center cursor-not-allowed text-gray-600 bg-gray-900 opacity-40 border border-gray-800';
        } else {
            dayEl.addEventListener('click', () => selectDate(dayDate));
        }
        
        // Highlight today
        if (dayDate.getTime() === today.getTime()) {
            if (isPickableDay && dayDate >= today) {
                dayEl.className = 'aspect-square flex items-center justify-center cursor-pointer text-sm font-bold transition-all duration-200 border-2 border-cyan-400 bg-cyan-400/10 text-cyan-400';
                dayEl.addEventListener('click', () => selectDate(dayDate));
            } else {
                dayEl.className = 'aspect-square flex items-center justify-center cursor-not-allowed text-gray-600 bg-gray-900 opacity-40 border border-gray-800';
            }
        }
        
        // Highlight selected date
        if (selectedDate &&
            dayDate.getFullYear() === selectedDate.getFullYear() &&
            dayDate.getMonth() === selectedDate.getMonth() &&
            dayDate.getDate() === selectedDate.getDate()) {
            dayEl.className = 'aspect-square flex items-center justify-center cursor-pointer text-sm font-bold transition-all duration-200 bg-cyan-400 text-black border-transparent scale-105';
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
    updateSelectedDateDisplay();

    // Move to step 2: Time selection
    showStep(2);
}


function updateSelectedDateDisplay() {
    const dateDisplay = document.getElementById('selectedDateDisplay');
    if (dateDisplay && selectedDate) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        };
        const dateText = selectedDate.toLocaleDateString('hu-HU', options);
        dateDisplay.innerHTML = `SELECTED DATE: <span class="font-semibold text-cyan-400">${dateText}</span>`;
    }
}

function generateTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    timeSlotsContainer.innerHTML = '';

    if (!selectedDate) {
        timeSlotsContainer.innerHTML =
            '<p class="text-gray-500 text-sm text-center py-12 px-6 col-span-full font-normal">LOADING TIME SLOTS...</p>';
        return;
    }

    let slots = [];
    let emptyMessage = '';

    // Define time intervals (2-hour blocks from 8 AM to 8 PM)
    const intervals = [
        { start: { hour: 8, minute: 0 }, end: { hour: 10, minute: 0 } },    // 8:00-10:00
        { start: { hour: 10, minute: 0 }, end: { hour: 12, minute: 0 } },  // 10:00-12:00
        { start: { hour: 12, minute: 0 }, end: { hour: 14, minute: 0 } },  // 12:00-14:00
        { start: { hour: 14, minute: 0 }, end: { hour: 16, minute: 0 } },  // 14:00-16:00
        { start: { hour: 16, minute: 0 }, end: { hour: 18, minute: 0 } },  // 16:00-18:00
        { start: { hour: 18, minute: 0 }, end: { hour: 20, minute: 0 } }   // 18:00-20:00
    ];

    const interval = intervals[currentTimeTab - 1];
    if (interval) {
        let currentHour = interval.start.hour;
        let currentMinute = interval.start.minute;

        while (currentHour < interval.end.hour || (currentHour === interval.end.hour && currentMinute < interval.end.minute)) {
            const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            slots.push(timeString);

            currentMinute += 15;
            if (currentMinute >= 60) {
                currentMinute = 0;
                currentHour++;
            }
        }
        emptyMessage = `😔 Nincs elérhető időpont ${currentTimeTab}. intervallumban`;
    }

    // Filter to only available slots (randomly exclude ~30% for realism)
    const availableSlots = slots.filter((slot, index) => {
        return index === 0 || Math.random() >= 0.3;
    });

    // Render slots
    if (availableSlots.length === 0) {
        timeSlotsContainer.innerHTML =
            `<p class="text-gray-500 text-sm text-center py-12 px-6 col-span-full font-normal">${emptyMessage}</p>`;
        return;
    }

    // Create grid container
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid grid-cols-2 sm:grid-cols-3 gap-3';

    availableSlots.forEach((slot) => {
        const slotEl = createTimeSlotElement(slot);
        gridContainer.appendChild(slotEl);
    });

    timeSlotsContainer.appendChild(gridContainer);
}

function createTimeSlotElement(slot) {
    const slotEl = document.createElement('div');
    slotEl.className = 'px-3 py-2 border border-gray-600 bg-gray-800 cursor-pointer text-center text-xs font-bold text-gray-300 transition-all duration-200 w-full h-auto min-h-10 flex items-center justify-center box-border hover:bg-gray-700 hover:text-white hover:border-cyan-400';
    slotEl.textContent = slot;
    slotEl.addEventListener('click', () => selectTime(slot));

    if (selectedTime === slot) {
        slotEl.className = 'px-3 py-2 border-cyan-400 bg-cyan-400 text-black cursor-pointer text-center text-xs font-bold transition-all duration-200 w-full h-auto min-h-10 flex items-center justify-center box-border scale-105';
    }

    return slotEl;
}

function switchTimeTab(tab) {
    currentTimeTab = tab;
    updateTabStyles();
    generateTimeSlots();
}

function updateTabStyles() {
    for (let i = 1; i <= 6; i++) {
        const tabElement = document.getElementById(`interval${i}Tab`);
        if (i === currentTimeTab) {
            tabElement.className = 'py-2 px-3 text-xs font-medium transition-all duration-200 bg-cyan-400 text-black';
        } else {
            tabElement.className = 'py-2 px-3 text-xs font-medium transition-all duration-200 text-gray-400 hover:text-white hover:bg-gray-700';
        }
    }
}

function selectTime(time) {
    selectedTime = time;
    generateTimeSlots();

    // Automatically proceed to booking details
    showBookingSummary();
    showStep(3);
}

function showBookingSummary() {
    if (selectedDate && selectedTime) {
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

    // Step navigation buttons
    const backToCalendarBtn = document.getElementById('backToCalendar');
    if (backToCalendarBtn) {
        backToCalendarBtn.addEventListener('click', goBackToCalendar);
    }

    const continueToBookingBtn = document.getElementById('continueToBooking');
    if (continueToBookingBtn) {
        continueToBookingBtn.addEventListener('click', goToBookingDetails);
    }

    const backToTimeSelectionBtn = document.getElementById('backToTimeSelection');
    if (backToTimeSelectionBtn) {
        backToTimeSelectionBtn.addEventListener('click', goBackToTimeSelection);
    }

    // Time slot tabs
    for (let i = 1; i <= 6; i++) {
        document.getElementById(`interval${i}Tab`).addEventListener('click', () => switchTimeTab(i));
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
            alert(`🎉 Foglalás megerősítve!\n\n👤 Név: ${guestName}\n📧 Email: ${guestEmail}\n📅 Dátum: ${selectedDate.toLocaleDateString('hu-HU')}\n⏰ Időpont: ${selectedTime}\n⏳ Időtartam: ${selectedDuration} perc\n\nHamarosan jelentkezem! ☕`);
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

