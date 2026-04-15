//Dom Content Load
const overlayCreateEvent = document.getElementById("overlay_create_event");
const eventList = document.getElementById("event_list")

const createEventTitle = document.getElementById("input_event_create_title");
const createEventPrice = document.getElementById("input_event_create_price");
const createEventDate = document.getElementById("input_event_create_date");
const createEventTime = document.getElementById("input_event_create_time");
const createEventLocation = document.getElementById("input_event_create_location");
const createEventCategory = document.getElementById("select_event_create_category");
const createEventDescription = document.getElementById("textarea_input_event_description");

const buttonOverlayCreateEventOpen = document.getElementById("button_overlay_create_event_open");
const buttonOverlayCreateEventClose = document.getElementById("button_overlay_create_event_close");
const buttonCreateEvent = document.getElementById("button_event_create");

//EventListeneres
buttonOverlayCreateEventOpen.addEventListener("click", openOverlayCreateEvent);
buttonOverlayCreateEventClose.addEventListener("click", closeOverlayCreateEvent);
buttonCreateEvent.addEventListener("click", createEvent);

//Functions
function openOverlayCreateEvent() {
    overlayCreateEvent.style.display = "flex";
}

function closeOverlayCreateEvent() {
    overlayCreateEvent.style.display = "none";
}

let eventArray = [];
function createEvent() {
    let newEvent = {
        title: createEventTitle.value,
        price: createEventPrice.value,
        date: createEventDate.value,
        time: createEventTime.value,
        location: createEventLocation.value,
        category: createEventCategory.value,
        description: createEventDescription.value,
    };
    eventArray.push(newEvent);
    displayEvents();
    createEventTitle.value = "";
    createEventPrice.value = "";
    createEventDate.value = "";
    createEventTime.value = "";
    createEventLocation.value = "";
    createEventCategory.value = "";
    createEventDescription.value = "";
    closeOverlayCreateEvent();
};

function displayEvents() {
    eventList.innerHTML = "";
    for(let event of eventArray){
        let newEvent = document.createElement("div");
        newEvent.classList.add("div_event");
        newEvent.innerHTML = `
        <div class="div_event_picture">
                <img class="img_event" src="Pictures/Events/football.jpg">
            </div>
            <div class="div_event_info">
                <div class="div_event_title">
                    <p class="para_event_title">
                        ${event.title}
                    </p>
                </div>
                <div class="div_event_categories">
                    <div class="${"div_event_category_"+event.category}">
                        <p class="para_event_category">
                            ${event.category}
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
                            <img class="img_event_icon" src="Pictures/Icons/User.svg">
                        </div>
                        <div class="div_event_text">
                            <p class="para_event_text">
                                16 Attendees
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `  
        eventList.appendChild(newEvent);
    }
}