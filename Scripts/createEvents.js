//inderlæser event listen
const eventList = document.getElementById("event_list");

//inderlæser create event overlay
const overlayCreateEvent = document.getElementById("overlay_create_event");
const createEventTitle = document.getElementById("input_event_create_title");
const createEventPrice = document.getElementById("input_event_create_price");
const createEventDate = document.getElementById("input_event_create_date");
const createEventTime = document.getElementById("input_event_create_time");
const createEventLocation = document.getElementById("input_event_create_location",);
const createEventCategory1 = document.getElementById("select_event_create_category_1",);
const createEventCategory2 = document.getElementById("select_event_create_category_2");
const createEventDescription = document.getElementById("textarea_input_event_description");
const createEventImage = document.getElementById("input_event_create_image");

//indlæser event overlay
const overlayEvent = document.getElementById("overlay_event");
const overlayEventTitle = document.getElementById("overlay_event_title");
const overlayEventPrice = document.getElementById("overlay_event_price");
const overlayEventLocation = document.getElementById("overlay_event_location");
const overlayEventDescription = document.getElementById("overlay_event_description",);
const overlayEventImage = document.getElementById("img_event_overlay");

//indlæser ALLE knapper
const buttonOverlayCreateEventOpen = document.getElementById("button_overlay_create_event_open");
const buttonOverlayCreateEventClose = document.getElementById("button_overlay_create_event_close");
const buttonCreateEvent = document.getElementById("button_event_create");
const buttonOverlayClose = document.getElementById("button_overlay_event_close");
const buttonOverlayEventEdit = document.getElementById("button_overlay_event_edit");
const buttonOverlayEventDelete = document.getElementById("button_overlay_event_delete");
const buttonClearFilters = document.getElementById("button_clear_filters");

//indlæser søge boksen
const searchEventsInput = document.getElementById("input_search_events");
const categoryFilterSport = document.getElementById("checkbox_filter_sport");
const categoryFilterSocial = document.getElementById("checkbox_filter_social");
const categoryFilterBoardgames = document.getElementById("checkbox_filter_boardgames");

//Opretter event listenners
buttonOverlayCreateEventOpen.addEventListener("click", openOverlayCreateEvent);
buttonOverlayCreateEventClose.addEventListener("click", closeOverlayCreateEvent,);
buttonCreateEvent.addEventListener("click", createEvent);
buttonOverlayClose.addEventListener("click", closeOverlayEvent);
buttonOverlayEventEdit.addEventListener("click", () => {
    editEvent(selectedOverlayEventId);
    closeOverlayEvent();
});
buttonOverlayEventDelete.addEventListener("click", () => deleteEvent(selectedOverlayEventId));
searchEventsInput.addEventListener("input", displayEvents);
categoryFilterSport.addEventListener("change", displayEvents);
categoryFilterSocial.addEventListener("change", displayEvents);
categoryFilterBoardgames.addEventListener("change", displayEvents);
buttonClearFilters.addEventListener("click", clearFilters);

let selectedOverlayEventId = null;
let eventArray = loadEvents();
let editingEventId = null;
displayEvents();

function openOverlayEvent(event) {
    selectedOverlayEventId = event.id;

    overlayEventTitle.textContent = event.title;
    overlayEventPrice.textContent = event.price;
    overlayEventLocation.textContent = event.location;
    overlayEventDescription.textContent = event.description;
    overlayEventImage.src = event.image;
    // Show edit and delete buttons only for admins
    if(userIsAdmin()){
        buttonOverlayEventEdit.style.display = "inline-block";
        buttonOverlayEventDelete.style.display = "inline-block";
    } else {
        buttonOverlayEventEdit.style.display = "none";
        buttonOverlayEventDelete.style.display = "none";
    }

    overlayEvent.style.display = "flex";
}

function closeOverlayEvent() {
    overlayEvent.style.display = "none";
    selectedOverlayEventId = null;
}

function openOverlayCreateEvent() {
    editingEventId = null;
    // Changes the button text back to "Create Event"
    buttonCreateEvent.textContent = "Create Event";
    clearCreateEventForm();
    overlayCreateEvent.style.display = "flex";
}

// Closes the create/edit event window and resets it
function closeOverlayCreateEvent() {
    overlayCreateEvent.style.display = "none";
    editingEventId = null;
    buttonCreateEvent.textContent = "Create Event";
    clearCreateEventForm();
}

function createEvent() {
    //Gets information about the event
    const title = createEventTitle.value.trim();
    const price = createEventPrice.value;
    const date = createEventDate.value;
    const time = createEventTime.value;
    const location = createEventLocation.value.trim();
    const category1 = createEventCategory1.value;
    const category2 = createEventCategory2.value;
    const description = createEventDescription.value.trim();
    let imageURL = "Pictures/Events/football.jpg";
    if (createEventImage.files[0]) {
    imageURL = URL.createObjectURL(createEventImage.files[0]);
    }

    if (!title || !date || !time || !location || (!category1 && !category2)) {
        alert("Please fill out title, date, time, location and at least one category.");
        return;
    }

    if (editingEventId === null) {
        createNewEvent(title, price, date, time, location, category1, category2, description, imageURL);
    } else {
        updateExistingEvent(title, price, date, time, location, category1, category2, description, imageURL);
    }

    // Saves the updated event list
    saveEvents();
    displayEvents();
    closeOverlayCreateEvent();
}
// Creates a new event object and adds it to the event list
function createNewEvent(title, price, date, time, location, category1, category2, description, imageURL) {
    
    // Creates the object that stores all information about the event
    let newEvent = {
        // Gives the event a unique ID based on the current time
        id: Date.now(),
        title: title,
        // Uses "Free" if the price field is empty
        price: price || "Free",
        date: date,
        time: time,
        location: location,
        category1: category1,
        category2: category2,
        description: description,
        image: imageURL,
    };

    // Adds the new event to the list
    eventArray.push(newEvent);
}
function updateExistingEvent(title, price, date, time, location, category1, category2, description, imageURL,) {
    // Finds the event that should be edited
    const eventToEdit = eventArray.find((event) => event.id === editingEventId);

    eventToEdit.title = title;
    eventToEdit.price = price || "Free";
    eventToEdit.date = date;
    eventToEdit.time = time;
    eventToEdit.location = location;
    eventToEdit.category1 = category1;
    eventToEdit.category2 = category2;
    eventToEdit.description = description;
    eventToEdit.image = imageURL;
}

// Opens an existing event in the form so it can be changed
function editEvent(eventId) {
    const eventToEdit = eventArray.find((event) => event.id === eventId);

    editingEventId = eventId;
    createEventTitle.value = eventToEdit.title;
    createEventPrice.value = eventToEdit.price;
    createEventDate.value = eventToEdit.date;
    createEventTime.value = eventToEdit.time;
    createEventLocation.value = eventToEdit.location;
    createEventCategory1.value = eventToEdit.category1;
    createEventCategory2.value = eventToEdit.category2 || "";
    createEventDescription.value = eventToEdit.description;

    // Changes the button text because the user is editing now
    buttonCreateEvent.textContent = "Save Changes";
    openOverlayCreateEvent();
}

function displayEvents() {
    eventList.innerHTML = "";

    const eventsToDisplay = getFilteredEvents();

    if (eventsToDisplay.length === 0) {
        eventList.innerHTML = `<p class="para_no_events">No events match your search/filter.</p>`;
        return;
    }

    for (let event of eventsToDisplay) {
        let newEvent = document.createElement("div");
        newEvent.addEventListener("click", () => openOverlayEvent(event));
        newEvent.classList.add("div_event");
        newEvent.innerHTML = `
            <div class="div_event_picture">
                <img class="img_event" src="${event.image}">
            </div>
            <div class="div_event_info">
                <div class="div_event_title">
                    <p class="para_event_title">
                        ${event.title}
                    </p>
                </div>
                <div class="div_event_categories">
                    <div class="${"div_event_category_" + event.category1}">
                        <p class="para_event_category">
                        ${event.category1}
                        </p>
                    </div>
                    <div class="${"div_event_category_" + event.category2}">
                        <p class="para_event_category">
                        ${event.category2}
                        </p>
                    </div>
                </div>
                <div class="div_event_additionalinfo">
                    <div class="div_event_date">
                        <div class="div_event_icon">
                            <img class="img_event_icon" src="Pictures/Icons/Calender.svg">
                        </div>
                        <div class="div_event_text">
                            <p class="para_event_text">
                                ${event.date}
                            </p>
                        </div>
                    </div>
                    <div class="div_event_time">
                        <div class="div_event_icon">
                            <img class="img_event_icon" src="Pictures/Icons/Clock.svg">
                        </div>
                        <div class="div_event_text">
                            <p class="para_event_text">
                                ${event.time}
                            </p>
                        </div>
                    </div>
                    <div class="div_event_attendees">
                        <div class="div_event_icon">
                            <img class="img_event_icon" src="Pictures/Icons/Pin.svg">
                        </div>
                        <div class="div_event_text">
                            <p class="para_event_text">
                                ${event.location}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        eventList.appendChild(newEvent);
    }
}

// Deletes an event from the event list
function deleteEvent(eventId) {
    if (!confirm("Are you sure you want to delete this event?")) {
        return;
    }
    // Keeps every event except the one with the matching ID
    eventArray = eventArray.filter((event) => event.id !== eventId);

    saveEvents();
    displayEvents();
    closeOverlayEvent();
}

// Finds the events that should be shown after search and category filtering
function getFilteredEvents() {
    const searchText = searchEventsInput.value.toLowerCase().trim();
    const selectedCategories = [];
    if(categoryFilterSport.checked){
        selectedCategories.push("Sport");
    }
    if(categoryFilterSocial.checked){
        selectedCategories.push("Social");
    }
    if(categoryFilterBoardgames.checked){
        selectedCategories.push("Boardgames");
    }

    // Goes through each event and keeps only the ones that match
    let filteredEvents = eventArray.filter((event) => {
        const matchesSearch = event.title.toLowerCase().includes(searchText)

        const eventCategories = [event.category1, event.category2];

        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.some((category) => eventCategories.includes(category),);

        // The event is shown only if it matches both search and category filters
        return matchesSearch && matchesCategory;
    });

    // Sorts events so the earliest event is shown first
    filteredEvents.sort((eventA, eventB) => {
        return getEventDateTime(eventA) - getEventDateTime(eventB);
    });

    return filteredEvents;
}
// Converts an event date and time into format "2026-05-20T18:00", that JS can understand and use
function getEventDateTime(event) {
    return new Date(event.date + "T" + event.time);
}

// Saves the event list in the browser, so events are not lost when the page refreshes
function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventArray));
}
// Loads events that were saved earlier in the browser
function loadEvents() {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) {
        return JSON.parse(savedEvents);
    }
    return [];
}
// Clears the form, so it is ready for a new event next time
function clearCreateEventForm() {
    createEventTitle.value = "";
    createEventPrice.value = "";
    createEventDate.value = "";
    createEventTime.value = "";
    createEventLocation.value = "";
    createEventCategory1.value = "";
    createEventCategory2.value = "";
    createEventDescription.value = "";
    createEventImage.value = "";
}
// Clear the search function so its blank again
function clearFilters() {
    searchEventsInput.value = "";
    categoryFilterSport.checked = false;
    categoryFilterSocial.checked = false;
    categoryFilterBoardgames.checked = false;
    displayEvents();
}