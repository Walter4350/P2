// DOM Content Load
const overlayCreateEvent = document.getElementById("overlay_create_event");
const overlayEvent = document.getElementById("overlay_event");
const eventList = document.getElementById("event_list");

const createEventTitle = document.getElementById("input_event_create_title");
const createEventPrice = document.getElementById("input_event_create_price");
const createEventDate = document.getElementById("input_event_create_date");
const createEventTime = document.getElementById("input_event_create_time");
const createEventLocation = document.getElementById("input_event_create_location");
const createEventCategory1 = document.getElementById("select_event_create_category_1");
const createEventCategory2 = document.getElementById("select_event_create_category_2");
const createEventDescription = document.getElementById("textarea_input_event_description");
const createEventImage = document.getElementById("input_event_create_image");

const overlayEventTitle = document.getElementById("overlay_event_title");
const overlayEventPrice = document.getElementById("overlay_event_price");
const overlayEventLocation = document.getElementById("overlay_event_location");
const overlayEventDescription = document.getElementById("overlay_event_description");
const overlayEventImage = document.getElementById("img_event_overlay");

const buttonOverlayCreateEventOpen = document.getElementById("button_overlay_create_event_open");
const buttonOverlayCreateEventClose = document.getElementById("button_overlay_create_event_close");
const buttonCreateEvent = document.getElementById("button_event_create");
const buttonOverlayClose = document.getElementById("button_overlay_event_close");
const buttonOverlayEventEdit = document.getElementById("button_overlay_event_edit");
const buttonOverlayEventDelete = document.getElementById("button_overlay_event_delete");

// Filter inputs
const searchEventsInput = document.getElementById("input_search_events");
const categoryFilterCheckboxes = document.querySelectorAll(".checkbox_filter_category");
const clearFiltersButton = document.getElementById("button_clear_filters");

// Event Listeners
buttonOverlayCreateEventOpen.addEventListener("click", openCreateEventMode);
buttonOverlayCreateEventClose.addEventListener("click", closeOverlayCreateEvent);
buttonCreateEvent.addEventListener("click", saveEventFromForm);
buttonOverlayClose.addEventListener("click", closeOverlayEvent);
buttonOverlayEventEdit.addEventListener("click", editSelectedOverlayEvent);
buttonOverlayEventDelete.addEventListener("click", deleteSelectedOverlayEvent);

searchEventsInput.addEventListener("input", displayEvents);
categoryFilterCheckboxes.forEach(checkbox => checkbox.addEventListener("change", displayEvents));
clearFiltersButton.addEventListener("click", clearFilters);

// Data
const currentUserId = getCurrentUserId();
let selectedOverlayEventId = null;
let eventArray = addCreatorToOldEvents(loadEvents());

// This variable remembers whether the form is creating a new event or editing an existing one.
// If it is null, we create a new event. If it contains an id, we update that event instead.
let editingEventId = null;

displayEvents();

// Functions
function openOverlayCreateEvent() {
    overlayCreateEvent.style.display = "flex";
}

function closeOverlayCreateEvent() {
    overlayCreateEvent.style.display = "none";
    editingEventId = null;
    buttonCreateEvent.textContent = "Create Event";
    clearCreateEventForm();
}

function openCreateEventMode() {
    // When the user clicks "Create Event", the form should always start fresh.
    editingEventId = null;
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

    // Edit and delete should only be possible for the browser/user that created the event.
    // This is a local prototype solution. Later, a real login/database should decide ownership.
    if (event.creatorId === currentUserId) {
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

function saveEventFromForm() {
    const title = createEventTitle.value.trim();
    const date = createEventDate.value;
    const time = createEventTime.value;
    const location = createEventLocation.value.trim();
    const category1 = normalizeCategory(createEventCategory1.value);
    const category2 = normalizeCategory(createEventCategory2.value);

    // Category 2 is optional. We only require that the user chooses at least one category.
    if (!title || !date || !time || !location || (!category1 && !category2)) {
        alert("Please fill out title, date, time, location and at least one category.");
        return;
    }

    // If the user uploads a picture, we use that picture while the page is open.
    // If no picture is uploaded, we either keep the old picture when editing or use a default picture when creating.
    let imageURL = "Pictures/Events/football.jpg";

    if (createEventImage.files[0]) {
        imageURL = URL.createObjectURL(createEventImage.files[0]);
    }

    if (editingEventId === null) {
        createNewEvent(title, date, time, location, category1, category2, imageURL);
    } else {
        const eventWasUpdated = updateExistingEvent(title, date, time, location, category1, category2, imageURL);

        // If the event could not be updated, we stop here so the form does not close.
        if (!eventWasUpdated) {
            return;
        }
    }

    saveEvents();
    displayEvents();
    closeOverlayCreateEvent();
}

function createNewEvent(title, date, time, location, category1, category2, imageURL) {
    let newEvent = {
        id: Date.now(),
        title: title,
        price: createEventPrice.value.trim() || "Free",
        date: date,
        time: time,
        location: location,
        category1: category1,
        category2: category2,
        description: createEventDescription.value.trim(),
        image: imageURL,
        createdAt: Date.now(),
        creatorId: currentUserId
    };

    eventArray.push(newEvent);
}

function updateExistingEvent(title, date, time, location, category1, category2, imageURL) {
    const eventToEdit = eventArray.find(event => event.id === editingEventId);

    if (!eventToEdit) {
        alert("The event could not be found.");
        return false;
    }

    eventToEdit.title = title;
    eventToEdit.price = createEventPrice.value.trim() || "Free";
    eventToEdit.date = date;
    eventToEdit.time = time;
    eventToEdit.location = location;
    eventToEdit.category1 = category1;
    eventToEdit.category2 = category2;
    eventToEdit.description = createEventDescription.value.trim();

    // Only replace the image if the user has selected a new file.
    // Otherwise the event keeps its old image.
    if (createEventImage.files[0]) {
        eventToEdit.image = imageURL;
    }

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

function editEvent(eventId) {
    const eventToEdit = eventArray.find(event => event.id === eventId);

    if (!eventToEdit) {
        alert("The event could not be found.");
        return;
    }

    if (eventToEdit.creatorId !== currentUserId) {
        alert("Only the person who created this event can edit it.");
        return;
    }

    editingEventId = eventId;

    createEventTitle.value = eventToEdit.title;
    createEventPrice.value = eventToEdit.price === "Free" ? "" : eventToEdit.price;
    createEventDate.value = eventToEdit.date;
    createEventTime.value = eventToEdit.time;
    createEventLocation.value = eventToEdit.location;
    createEventCategory1.value = eventToEdit.category1;
    createEventCategory2.value = eventToEdit.category2 || "";
    createEventDescription.value = eventToEdit.description;
    createEventImage.value = "";

    buttonCreateEvent.textContent = "Save Changes";
    openOverlayCreateEvent();
}

function deleteEvent(eventId) {
    const eventToDelete = eventArray.find(event => event.id === eventId);

    if (!eventToDelete) {
        alert("The event could not be found.");
        return;
    }

    if (eventToDelete.creatorId !== currentUserId) {
        alert("Only the person who created this event can delete it.");
        return;
    }

    const shouldDelete = confirm("Are you sure you want to delete this event?");

    if (!shouldDelete) {
        return;
    }

    eventArray = eventArray.filter(event => event.id !== eventId);
    saveEvents();
    displayEvents();
    closeOverlayEvent();
}

function editSelectedOverlayEvent() {
    if (selectedOverlayEventId === null) {
        return;
    }

    // We save the id before closing the overlay.
    // closeOverlayEvent() resets selectedOverlayEventId to null, so using it after closing would lose the event id.
    const eventIdToEdit = selectedOverlayEventId;
    const eventToEdit = eventArray.find(event => event.id === eventIdToEdit);

    if (!eventToEdit || eventToEdit.creatorId !== currentUserId) {
        alert("Only the person who created this event can edit it.");
        return;
    }

    closeOverlayEvent();
    editEvent(eventIdToEdit);
}

function deleteSelectedOverlayEvent() {
    if (selectedOverlayEventId === null) {
        return;
    }

    deleteEvent(selectedOverlayEventId);
}

function createCategoryHTML(category) {
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

function getFilteredEvents() {
    const searchText = searchEventsInput.value.toLowerCase().trim();
    const selectedCategories = getSelectedCategories();

    let filteredEvents = eventArray.filter(event => {
        const matchesSearch =
            event.title.toLowerCase().includes(searchText) ||
            event.location.toLowerCase().includes(searchText);

        const eventCategories = [normalizeCategory(event.category1), normalizeCategory(event.category2)];

        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.some(category => eventCategories.includes(category));

        return matchesSearch && matchesCategory;
    });

    // Sort by the actual event date and time instead of when the event was created.
    // The earliest upcoming date is shown first.
    filteredEvents.sort((eventA, eventB) => {
        return getEventDateTime(eventA) - getEventDateTime(eventB);
    });

    return filteredEvents;
}

function getEventDateTime(event) {
    return new Date(`${event.date}T${event.time || "00:00"}`).getTime();
}

function formatEventDate(dateString) {
    if (!dateString) {
        return "";
    }

    const dateParts = dateString.split("-");

    if (dateParts.length !== 3) {
        return dateString;
    }

    return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
}

function getSelectedCategories() {
    // We normalize the checkbox values so the filter still works even if an older event
    // was saved with a slightly different spelling, for example "Board Games".
    return Array.from(categoryFilterCheckboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => normalizeCategory(checkbox.value));
}

function normalizeCategory(category) {
    if (!category) {
        return "";
    }

    const categoryText = category.toString().trim().toLowerCase().replace(/\s+/g, "");

    if (categoryText === "sport") {
        return "Sport";
    }

    if (categoryText === "social") {
        return "Social";
    }

    if (categoryText === "boardgames" || categoryText === "boardgame") {
        return "Boardgames";
    }

    return category;
}

function saveEvents() {
    localStorage.setItem("events", JSON.stringify(eventArray));
}

function loadEvents() {
    const savedEvents = localStorage.getItem("events");

    if (savedEvents) {
        return JSON.parse(savedEvents);
    }

    return [];
}

function getCurrentUserId() {
    let storedUserId = localStorage.getItem("currentUserId");

    if (!storedUserId) {
        storedUserId = "user_" + Date.now();
        localStorage.setItem("currentUserId", storedUserId);
    }

    return storedUserId;
}

function addCreatorToOldEvents(events) {
    let hasChangedOldEvents = false;

    const eventsWithCreator = events.map(event => {
        const normalizedCategory1 = normalizeCategory(event.category1);
        const normalizedCategory2 = normalizeCategory(event.category2);
        const needsCreator = !event.creatorId;
        const needsCategoryFix = event.category1 !== normalizedCategory1 || event.category2 !== normalizedCategory2;

        if (needsCreator || needsCategoryFix) {
            hasChangedOldEvents = true;
            return {
                ...event,
                category1: normalizedCategory1,
                category2: normalizedCategory2,
                creatorId: event.creatorId || currentUserId
            };
        }

        return event;
    });

    if (hasChangedOldEvents) {
        localStorage.setItem("events", JSON.stringify(eventsWithCreator));
    }

    return eventsWithCreator;
}

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

function clearFilters() {
    // Reset the search input first, so the text field becomes empty again.
    if (searchEventsInput) {
        searchEventsInput.value = "";
    }

    // Find the checkboxes fresh from the HTML each time.
    // This makes the Clear button reliable even if the checkbox list changes later.
    document.querySelectorAll(".checkbox_filter_category").forEach(checkbox => {
        checkbox.checked = false;
    });

    // Show the full event list again after all filters have been reset.
    displayEvents();
}

function resetEvents() {
    localStorage.removeItem("events");
    location.reload();
}
