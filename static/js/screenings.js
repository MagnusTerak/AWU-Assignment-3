//screenings.js 
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
                    const listItem = document.createElement("li");
                    listItem.innerHTML = `<strong>Datum:</strong> ${new Date(screening.attributes.start_time).toLocaleString()} <strong>Plats:</strong> ${screening.attributes.room}`;
                    screeningsList.appendChild(listItem);
                });
            } else {
                screeningsList.innerHTML = "<li>Inga kommande visningar</li>";
            }
        })
        .catch(error => console.error('Error fetching screenings:', error));
});

