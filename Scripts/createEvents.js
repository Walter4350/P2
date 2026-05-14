//starter med at loade ind all DOM
const overlayCreateEvent = document.getElementById("overlay_create_event");
const overlayEvent = document.getElementById("overlay_event");
const eventList = document.getElementById("event_list");

const createEventTitle = document.getElementById("input_event_create_title");
const createEventPrice = document.getElementById("input_event_create_price");
const createEventDate = document.getElementById("input_event_create_date");
const createEventTime = document.getElementById("input_event_create_time");
const createEventLocation = document.getElementById("input_event_create_location",);
const createEventCategory1 = document.getElementById("select_event_create_category_1",);
const createEventCategory2 = document.getElementById("select_event_create_category_2");
const createEventDescription = document.getElementById("textarea_input_event_description");

const overlayEventTitle = document.getElementById("overlay_event_title");
const overlayEventPrice = document.getElementById("overlay_event_price");
const overlayEventLocation = document.getElementById("overlay_event_location");
const overlayEventDescription = document.getElementById("overlay_event_description",);
const overlayEventImage = document.getElementById("img_event_overlay");

const buttonOverlayCreateEventOpen = document.getElementById("button_overlay_create_event_open");
const buttonOverlayCreateEventClose = document.getElementById("button_overlay_create_event_close");
const buttonCreateEvent = document.getElementById("button_event_create");
const buttonOverlayClose = document.getElementById("button_overlay_event_close");
const buttonOverlayEventEdit = document.getElementById("button_overlay_event_edit");
const buttonOverlayEventDelete = document.getElementById("button_overlay_event_delete");

const searchEventsInput = document.getElementById("input_search_events");
const categoryFilterSport = document.getElementById("checkbox_filter_sport");
const categoryFilterSocial = document.getElementById("checkbox_filter_social");
const categoryFilterBoardgames = document.getElementById("checkbox_filter_boardgames");

//Opretter event listenners
buttonOverlayCreateEventOpen.addEventListener("click", openCreateEventMode);
buttonOverlayCreateEventClose.addEventListener("click", closeOverlayCreateEvent,);
buttonCreateEvent.addEventListener("click", saveEventFromForm);
buttonOverlayClose.addEventListener("click", closeOverlayEvent);
buttonOverlayEventEdit.addEventListener("click", editSelectedOverlayEvent);
buttonOverlayEventDelete.addEventListener("click", deleteSelectedOverlayEvent);
searchEventsInput.addEventListener("input", displayEvents);
categoryFilterSport.addEventListener("change", displayEvents);
categoryFilterSocial.addEventListener("change", displayEvents);
categoryFilterBoardgames.addEventListener("change", displayEvents);

let selectedOverlayEventId = null;
let eventArray = loadEvents();

let editingEventId = null;

displayEvents();

function openOverlayCreateEvent() {
    overlayCreateEvent.style.display = "flex";
}

// Closes the create/edit event window and resets it
function closeOverlayCreateEvent() {
    overlayCreateEvent.style.display = "none";
    editingEventId = null;
    buttonCreateEvent.textContent = "Create Event";
    clearCreateEventForm();
}

function openCreateEventMode() {
    if (!userIsAdmin()) return;
    editingEventId = null;
    // Changes the button text back to "Create Event"
    buttonCreateEvent.textContent = "Create Event";
    clearCreateEventForm();
    openOverlayCreateEvent();
}

function openOverlayEvent(event) {
    selectedOverlayEventId = event.id;

    overlayEventTitle.textContent = event.title;
    overlayEventPrice.textContent = event.price;
    overlayEventLocation.textContent = event.location;
    overlayEventDescription.textContent = event.description;
    overlayEventImage.src = event.image;
    // Show edit and delete buttons only for admins
    const isAdmin = typeof userIsAdmin === "function" && userIsAdmin();
    buttonOverlayEventEdit.style.display = isAdmin ? "inline-block" : "none";
    buttonOverlayEventDelete.style.display = isAdmin ? "inline-block" : "none";

    overlayEvent.style.display = "flex";
}

function closeOverlayEvent() {
    overlayEvent.style.display = "none";
    // Removes the selected event from the overlay
    selectedOverlayEventId = null;
}
// Saves the form as either a new event or an edited event
function saveEventFromForm() {
    //Gets information about the event
    const title = createEventTitle.value.trim();
    const price = createEventPrice.value;
    const date = createEventDate.value;
    const time = createEventTime.value;
    const location = createEventLocation.value.trim();
    const category1 = createEventCategory1.value;
    const category2 = createEventCategory2.value;
    const description = createEventDescription.value.trim();
    const imageURL = "Pictures/Events/football.jpg";

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
    if (!eventToEdit) {
        alert("The event could not be found.");
        return false;
    }

    eventToEdit.title = title;
    eventToEdit.price = price || "Free";
    eventToEdit.date = date;
    eventToEdit.time = time;
    eventToEdit.location = location;
    eventToEdit.category1 = category1;
    eventToEdit.category2 = category2;
    eventToEdit.description = description;
    eventToEdit.image = imageURL;

    return true;
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
        newEvent.id = "event_" + event.id;
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
                    ${createCategoryHTML(event.category1)}
                    ${createCategoryHTML(event.category2)}
                </div>
                <div class="div_event_additionalinfo">
                    <div class="div_event_date">
                        <div class="div_event_icon">
                            <img class="img_event_icon" src="Pictures/Icons/Calender.svg">
                        </div>
                        <div class="div_event_text">
                            <p class="para_event_text">
                                ${formatEventDate(event.date)}
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

// Opens an existing event in the form so it can be changed
function editEvent(eventId) {
    if (!userIsAdmin()) return;
    const eventToEdit = eventArray.find((event) => event.id === eventId);

    if (!eventToEdit) {
        alert("The event could not be found.");
        return;
    }

    editingEventId = eventId;

    createEventTitle.value = eventToEdit.title;
    createEventPrice.value =
        eventToEdit.price === "Free" ? "" : eventToEdit.price;
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

// Deletes an event from the event list
function deleteEvent(eventId) {
    if (!userIsAdmin()) return;
    const eventToDelete = eventArray.find((event) => event.id === eventId);

    if (!eventToDelete) {
        alert("The event could not be found.");
        return;
    }

    const shouldDelete = confirm("Are you sure you want to delete this event?");

    if (!shouldDelete) {
        return;
    }

    // Keeps every event except the one with the matching ID
    eventArray = eventArray.filter((event) => event.id !== eventId);
    // Saves the updated event list
    saveEvents();
    displayEvents();
    closeOverlayEvent();
}
// Starts editing the event that is selected in the overlay
function editSelectedOverlayEvent() {
    // If no event is selected, stop the function
    if (selectedOverlayEventId === null) {
        return;
    }
    // Save the selected event ID in a clearer variable name
    const eventIdToEdit = selectedOverlayEventId;

    closeOverlayEvent();
    // Open the selected event in edit mode
    editEvent(eventIdToEdit);
}

function deleteSelectedOverlayEvent() {
    // If no event is selected, stop the function
    if (selectedOverlayEventId === null) {
        return;
    }

    deleteEvent(selectedOverlayEventId);
}
// Creates the small category label shown on each event card
function createCategoryHTML(category) {
    // If there is no category, show nothing
    if (!category) {
        return "";
    }

    return `
        <div class="${"div_event_category_" + category}">
            <p class="para_event_category">
                ${category}
            </p>
        </div>
    `;
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
// Converts an event date and time into a number, so events can be sorted by time
function getEventDateTime(event) {
    return new Date(`${event.date}T${event.time}`).getTime(); // millisekunder siden 1970
}
// Changes the date from YYYY-MM-DD to DD/MM/YYYY, so it is easier to read
function formatEventDate(dateString) {
    // If there is no date, return empty text
    if (!dateString) {
        return "";
    }
    // Splits the date into year, month and day
    const dateParts = dateString.split("-");
    if (dateParts.length !== 3) {
        return dateString;
    }
    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
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
}
// Clear the search function so its blank again
function clearFilters() {
    searchEventsInput.value = "";
    categoryFilterSport.checked = false;
    categoryFilterSocial.checked = false;
    categoryFilterBoardgames.checked = false;
    displayEvents();
}