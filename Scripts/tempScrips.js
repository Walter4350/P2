// Midlertidig testfunktion som laver 10 events automatisk
function createTestEvents() {
    const testEvents = [
        {
            title: "Football Match",
            price: "50 DKK",
            date: "2026-05-10",
            time: "18:00",
            location: "Aalborg Stadium",
            category1: "Sport",
            category2: "",
            description: "Local football match between two teams.",
            image: "Pictures/Events/football.jpg"
        },
        {
            title: "Movie Night",
            price: "Free",
            date: "2026-05-12",
            time: "20:00",
            location: "Community Center",
            category1: "Social",
            category2: "",
            description: "Movie night with popcorn and drinks.",
            image: "Pictures/Events/movie.jpg"
        },
        {
            title: "Boardgame Evening",
            price: "Free",
            date: "2026-05-14",
            time: "19:00",
            location: "Boardgame Café",
            category1: "Boardgames",
            category2: "Social",
            description: "Bring your favorite boardgames.",
            image: "Pictures/Events/boardgames.jpg"
        },
        {
            title: "Basketball Tournament",
            price: "25 DKK",
            date: "2026-05-16",
            time: "15:00",
            location: "Sports Hall",
            category1: "Sport",
            category2: "",
            description: "Friendly basketball tournament.",
            image: "Pictures/Events/basketball.jpg"
        },
        {
            title: "Coffee Meetup",
            price: "Free",
            date: "2026-05-18",
            time: "10:00",
            location: "Central Café",
            category1: "Social",
            category2: "",
            description: "Meet new people over coffee.",
            image: "Pictures/Events/coffee.jpg"
        },
        {
            title: "Chess Tournament",
            price: "15 DKK",
            date: "2026-05-20",
            time: "17:00",
            location: "Library",
            category1: "Boardgames",
            category2: "",
            description: "Competitive chess tournament.",
            image: "Pictures/Events/chess.jpg"
        },
        {
            title: "Volleyball Practice",
            price: "Free",
            date: "2026-05-22",
            time: "16:00",
            location: "Beach Arena",
            category1: "Sport",
            category2: "",
            description: "Open volleyball practice for everyone.",
            image: "Pictures/Events/volleyball.jpg"
        },
        {
            title: "Trivia Quiz Night",
            price: "20 DKK",
            date: "2026-05-24",
            time: "21:00",
            location: "Pub Downtown",
            category1: "Social",
            category2: "Boardgames",
            description: "Fun quiz night with prizes.",
            image: "Pictures/Events/quiz.jpg"
        },
        {
            title: "Running Club",
            price: "Free",
            date: "2026-05-26",
            time: "07:00",
            location: "City Park",
            category1: "Sport",
            category2: "",
            description: "Morning run through the park.",
            image: "Pictures/Events/running.jpg"
        },
        {
            title: "Dungeons & Dragons",
            price: "Free",
            date: "2026-05-28",
            time: "18:30",
            location: "Game House",
            category1: "Boardgames",
            category2: "Social",
            description: "Join an epic D&D adventure.",
            image: "Pictures/Events/dnd.jpg"
        }
    ];

    testEvents.forEach(testEvent => {
        eventArray.push({
            id: Date.now() + Math.random(),
            title: testEvent.title,
            price: testEvent.price,
            date: testEvent.date,
            time: testEvent.time,
            location: testEvent.location,
            category1: testEvent.category1,
            category2: testEvent.category2,
            description: testEvent.description,
            image: testEvent.image,
        });
    });

    saveEvents();
    displayEvents();

    console.log("10 test events created.");
}