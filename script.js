ocument.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.getElementById('appointmentDate');
    const slotsContainer = document.getElementById('slotsContainer');
    const modal = document.getElementById('bookingModal');
    const closeModal = document.querySelector('.close');
    const bookingForm = document.getElementById('bookingForm');
    
    // Variables to track selection
    let selectedDate = null;
    let selectedTime = null;

    // 1. Define Business Hours (30 min intervals)
    // 9:00 AM to 5:00 PM
    const startHour = 9;
    const endHour = 17; 

    // 2. Load Bookings from LocalStorage (Simulating a database)
    // Structure: { "2023-12-25": ["09:00", "10:30"] }
    let bookings = JSON.parse(localStorage.getItem('acuBookings')) || {};

    // Helper to generate time slots
    function generateTimeSlots() {
        const slots = [];
        for (let i = startHour; i < endHour; i++) {
            slots.push(`${i.toString().padStart(2, '0')}:00`);
            slots.push(`${i.toString().padStart(2, '0')}:30`);
        }
        return slots;
    }

    const allSlots = generateTimeSlots();

    // 3. Render Slots when Date Changes
    dateInput.addEventListener('change', (e) => {
        selectedDate = e.target.value;
        renderSlots(selectedDate);
    });

    function renderSlots(date) {
        slotsContainer.innerHTML = ''; // Clear previous
        
        // Get booked slots for this date
        const bookedSlots = bookings[date] || [];

        allSlots.forEach(time => {
            const slotBtn = document.createElement('div');
            slotBtn.classList.add('time-slot');
            slotBtn.textContent = time;

            // Check if booked
            if (bookedSlots.includes(time)) {
                slotBtn.classList.add('booked');
                slotBtn.title = "Already Booked";
            } else {
                slotBtn.onclick = () => openBookingModal(time);
            }

            slotsContainer.appendChild(slotBtn);
        });
    }

    // 4. Modal Handling
    function openBookingModal(time) {
        selectedTime = time;
        document.getElementById('selectedTimeDisplay').textContent = time;
        document.getElementById('selectedDateDisplay').textContent = selectedDate;
        modal.style.display = 'block';
    }

    closeModal.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = 'none';
    }

    // 5. Handle Form Submission
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('patientName').value;
        
        // Save booking
        if (!bookings[selectedDate]) {
            bookings[selectedDate] = [];
        }
        bookings[selectedDate].push(selectedTime);
        
        // Update LocalStorage
        localStorage.setItem('acuBookings', JSON.stringify(bookings));

        alert(`Thanks ${name}! Appointment confirmed for ${selectedDate} at ${selectedTime}.`);
        
        modal.style.display = 'none';
        bookingForm.reset();
        renderSlots(selectedDate); // Re-render to show slot as booked
    });
});