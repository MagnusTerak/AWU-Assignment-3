//screenings.js 
// Author: Tobias-hubs
document.addEventListener("DOMContentLoaded", () => {
    console.log('DOM fully loaded and parsed');
    const movieId = window.location.pathname.split("/").pop();
    const fetchUrl = `/api/screenings/${movieId}`;
   
    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);
            const screeningsList = document.getElementById("screenings-list");
            screeningsList.innerHTML = "";
            if (data && data.length > 0) {
                data.forEach(screening => {

                    const screeningDate = new Date(screening.attributes.start_time);

                    // Get the weekday abbreviation (Mon, Tue, etc.)
                    const weekdays = ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"];
                    const weekday = weekdays[screeningDate.getDay()];

                    // Format the date as D/M (ex: 28/1) and weekday 
                    const formattedDate = `${weekday} ${screeningDate.getDate()}/${screeningDate.getMonth() + 1}`;

                    // Format the time as HH:mm (ex: 20:00)
                    const formattedTime = `${screeningDate.getHours().toString().padStart(2, '0')}:${screeningDate.getMinutes().toString().padStart(2, '0')}`;

                    const listItem = document.createElement("li");
                    listItem.innerHTML = `<strong>${formattedDate}</strong> ${formattedTime} ${screening.attributes.room}`;
                    screeningsList.appendChild(listItem);
                });
            } else {
                screeningsList.innerHTML = "<li>Inga kommande visningar</li>";
            }
        })
        .catch(error => console.error('Error fetching screenings:', error));
});

