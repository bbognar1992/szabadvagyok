// Calendar functionality
let currentDate = new Date(2025, 11, 1); // December 2025
let selectedDate = null;
let selectedTime = null;
let selectedDuration = 15;
let currentStep = 1;

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
        step1.className = 'w-8 h-8 rounded-full bg-playful-purple flex items-center justify-center text-white font-bold text-sm transition-all duration-300';
    }
    if (currentStep >= 2) {
        step2.className = 'w-8 h-8 rounded-full bg-playful-purple flex items-center justify-center text-white font-bold text-sm transition-all duration-300';
        progress1.className = 'w-8 h-0.5 bg-playful-purple transition-all duration-300';
    }
    if (currentStep >= 3) {
        step3.className = 'w-8 h-8 rounded-full bg-playful-purple flex items-center justify-center text-white font-bold text-sm transition-all duration-300';
        progress2.className = 'w-8 h-0.5 bg-playful-purple transition-all duration-300';
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
        dayNameEl.className = 'text-center text-xs font-bold bg-gradient-to-r from-playful-purple to-playful-pink bg-clip-text text-transparent py-4 px-2 uppercase tracking-wider';
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
        dayEl.className = 'aspect-square flex items-center justify-center rounded-2xl cursor-pointer text-sm font-bold transition-all duration-300 bg-gradient-to-br from-white to-playful-purple/10 text-gray-700 border-2 border-white/30 shadow-lg hover:bg-gradient-to-br hover:from-playful-purple hover:to-playful-pink hover:text-white hover:-translate-y-1 hover:shadow-xl hover:scale-110 hover:border-transparent';
        dayEl.textContent = day;
        
        // Check if date is in the past or not Monday/Wednesday
        const dayOfWeek = dayDate.getDay();
        const isPickableDay = dayOfWeek === 1 || dayOfWeek === 3; // Monday = 1, Wednesday = 3

        if (dayDate < today || !isPickableDay) {
            dayEl.className = 'aspect-square flex items-center justify-center rounded-2xl cursor-not-allowed text-gray-300 bg-gradient-to-br from-gray-100/50 to-gray-200/50 opacity-40 border-2 border-gray-200/30';
        } else {
            dayEl.addEventListener('click', () => selectDate(dayDate));
        }
        
        // Highlight today
        if (dayDate.getTime() === today.getTime()) {
            if (isPickableDay && dayDate >= today) {
                dayEl.className = 'aspect-square flex items-center justify-center rounded-2xl cursor-pointer text-sm font-bold transition-all duration-300 border-3 border-playful-orange bg-gradient-to-br from-playful-orange/20 to-playful-pink/20 text-playful-orange shadow-xl animate-pulse';
                dayEl.addEventListener('click', () => selectDate(dayDate));
            } else {
                dayEl.className = 'aspect-square flex items-center justify-center rounded-2xl cursor-not-allowed text-gray-300 bg-gradient-to-br from-gray-100/50 to-gray-200/50 opacity-40 border-2 border-gray-200/30';
            }
        }
        
        // Highlight selected date
        if (selectedDate &&
            dayDate.getFullYear() === selectedDate.getFullYear() &&
            dayDate.getMonth() === selectedDate.getMonth() &&
            dayDate.getDate() === selectedDate.getDate()) {
            dayEl.className = 'aspect-square flex items-center justify-center rounded-2xl cursor-pointer text-sm font-bold transition-all duration-300 bg-gradient-to-br from-playful-purple via-playful-pink to-playful-orange text-white border-transparent shadow-2xl scale-110 animate-bounce';
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
        dateDisplay.innerHTML = `Kiválasztott dátum: <span class="font-semibold text-playful-purple">${dateText}</span>`;
    }
}

function generateTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');
    timeSlotsContainer.innerHTML = '';
    
    if (!selectedDate) {
        timeSlotsContainer.innerHTML =
            '<p class="text-gray-400 text-sm text-center py-12 px-6 col-span-full font-normal bg-gradient-to-r from-playful-purple/10 to-playful-pink/10 rounded-xl">Időpontok betöltése...</p>';
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
            '<p class="text-gray-400 text-sm text-center py-12 px-6 col-span-full font-normal bg-gradient-to-r from-playful-purple/10 to-playful-pink/10 rounded-xl">😔 Nincs elérhető időpont ezen a napon</p>';
        return;
    }
    
    availableSlots.forEach((slot) => {
        const slotEl = document.createElement('div');
        slotEl.className = 'px-3 py-2 border-2 border-white/30 rounded-xl bg-gradient-to-r from-white/90 to-playful-blue/10 cursor-pointer text-center text-xs font-bold text-gray-700 transition-all duration-300 w-full h-auto min-h-10 flex items-center justify-center box-border shadow-lg hover:border-playful-purple/50 hover:bg-gradient-to-r hover:from-playful-purple hover:to-playful-pink hover:text-white hover:-translate-y-1 hover:shadow-xl hover:scale-105 backdrop-blur-sm';
        slotEl.textContent = slot;
        slotEl.addEventListener('click', () => selectTime(slot));

        if (selectedTime === slot) {
            slotEl.className = 'px-3 py-2 border-transparent rounded-xl bg-gradient-to-br from-playful-purple via-playful-pink to-playful-orange text-white cursor-pointer text-center text-xs font-bold transition-all duration-300 w-full h-auto min-h-10 flex items-center justify-center box-border shadow-2xl scale-110 animate-pulse';
        }

        timeSlotsContainer.appendChild(slotEl);
    });
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

