// Populate the zodiac degree dropdown with degrees 1–30

const degreeDropdown = document.getElementById("search-degree");

for (let degree = 1; degree <= 30; degree++) {
    const option = document.createElement("option");

    option.value = degree;
    option.textContent = `${degree}°`;

    degreeDropdown.appendChild(option);
}

// ========================================
// SEARCH BY ZODIAC DEGREE
// ========================================

document.getElementById("degree-search-form").addEventListener(
    "submit",
    function (event) {
        event.preventDefault();

        const sign = document.getElementById("search-sign").value;
        const degree = Number(
            document.getElementById("search-degree").value
        );

        // Make sure both selections have been made.
        if (!sign || !degree) {
            alert("Please select a zodiac sign and degree.");
            return;
        }

        // Convert the sign and degree into our 1–360 number.
        const zodiacSigns = [
            "Aries", "Taurus", "Gemini", "Cancer",
            "Leo", "Virgo", "Libra", "Scorpio",
            "Sagittarius", "Capricorn", "Aquarius", "Pisces"
        ];

        const signIndex = zodiacSigns.indexOf(sign);
        const symbolNumber = signIndex * 30 + degree;

        // Find the selected symbol in our database.
        const currentSymbol = symbols.find(
            symbol => symbol.number === symbolNumber
        );

        if (!currentSymbol) {
            alert("Sorry, that Sabian Symbol could not be found.");
            return;
        }

        // Display the selected degree and phrase.
        document.getElementById("result-sun-degree").textContent =
            `${currentSymbol.degree}° ${currentSymbol.sign}`;

        document.getElementById("result-sun-phrase").textContent =
            `“${currentSymbol.phrase}”`;

        // Display the polar opposite.
        document.getElementById("result-opposite-degree").textContent =
            `Polar Opposite: ${currentSymbol.opposite.degree}° ${currentSymbol.opposite.sign}`;

        document.getElementById("result-opposite-phrase").textContent =
            `“${currentSymbol.opposite.phrase}”`;

        // Show the results.
        document.getElementById("search-results").hidden = false;

        // Bring the results into view.
        document.getElementById("search-results").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
);

// ========================================
// TODAY'S PLANETARY POSITIONS
// ========================================

const planets = [
    { name: "Sun", symbol: "☉", body: Astronomy.Body.Sun },
    { name: "Moon", symbol: "☽", body: Astronomy.Body.Moon },
    { name: "Mercury", symbol: "☿", body: Astronomy.Body.Mercury },
    { name: "Venus", symbol: "♀", body: Astronomy.Body.Venus },
    { name: "Mars", symbol: "♂", body: Astronomy.Body.Mars },
    { name: "Jupiter", symbol: "♃", body: Astronomy.Body.Jupiter },
    { name: "Saturn", symbol: "♄", body: Astronomy.Body.Saturn },
    { name: "Uranus", symbol: "♅", body: Astronomy.Body.Uranus },
    { name: "Neptune", symbol: "♆", body: Astronomy.Body.Neptune },
    { name: "Pluto", symbol: "♇", body: Astronomy.Body.Pluto }
];

function calculatePlanetaryPositions() {
    const planetList = document.getElementById("planet-list");

    // Use today's date and time.
    const date = new Date();

    planets.forEach(planet => {
        try {
            // Calculate the planet's geocentric ecliptic longitude.
            const position = Astronomy.GeoVector(planet.body, date, true);
            const ecliptic = Astronomy.Ecliptic(position);
            const longitude = ecliptic.elon;

            // Convert longitude into a zodiac sign and degree.
            const signIndex = Math.floor(longitude / 30);
            const degree = Math.floor(longitude % 30) + 1;
            const sign = zodiacSigns[signIndex];

            // Update the existing planet button.
            const button = document.querySelector(
                `.planet-link[data-planet="${planet.name}"]`
            );

            if (button) {
                button.innerHTML =
                    `${planet.symbol} ${planet.name} — ` +
                    `<span>${degree}° ${sign}</span>`;
            }

        } catch (error) {
            console.error(
                `Could not calculate ${planet.name}:`,
                error
            );
        }
    });
}

calculatePlanetaryPositions();

// ========================================
// SELECT A PLANET AND DISPLAY ITS SYMBOL
// ========================================

function displayPlanetSymbol(planetName, sign, degree) {

    const signIndex = zodiacSigns.indexOf(sign);

    if (signIndex === -1 || degree < 1 || degree > 30) {
        return;
    }

    const symbolNumber = signIndex * 30 + degree;

    // Find the Sabian Symbol.
    const currentSymbol = symbols.find(
        symbol => symbol.number === symbolNumber
    );

    if (!currentSymbol) {
        console.error("Sabian Symbol not found:", symbolNumber);
        return;
    }

    // Support the database's opposite-symbol fields.
    const oppositeDegree =
        currentSymbol.opposite?.degree ??
        currentSymbol.oppositeDegree;

    const oppositeSign =
        currentSymbol.opposite?.sign ??
        currentSymbol.oppositeSign;

    const oppositePhrase =
        currentSymbol.opposite?.phrase ??
        currentSymbol.oppositePhrase;

    // Update the heading and phrases on the right.
    document.getElementById("selected-planet-title").innerHTML =
    `<span class="zodiac-degree">${planetName}'s</span> Sabian Symbol: <span class="zodiac-degree">${degree}° ${sign}</span>`;

    document.getElementById("selected-symbol-phrase").textContent =
        `“${currentSymbol.phrase}”`;

    document.getElementById("selected-opposite-degree").textContent =
        `Polar Opposite: ${oppositeDegree}° ${oppositeSign}`;

    document.getElementById("selected-opposite-phrase").textContent =
        `“${oppositePhrase}”`;
}


// Make each planetary row respond to a click.
document.querySelectorAll(".planet-link").forEach(button => {

    button.addEventListener("click", function () {

        const positionText = this.querySelector("span").textContent;
        const match = positionText.match(/^(\d+)°\s+(\w+)$/);

        if (!match) {
            return;
        }

        const degree = Number(match[1]);
        const sign = match[2];
        const planetName = this.dataset.planet;

        displayPlanetSymbol(planetName, sign, degree);
    });

});


// Default to the Moon when the page opens.
const moonButton = document.querySelector(
    '.planet-link[data-planet="Moon"]'
);

if (moonButton) {
    moonButton.click();
}
getVisitorLocation();

// Display today's date in the header
const searchDateElement = document.getElementById("search-date");

if (searchDateElement) {
    searchDateElement.textContent = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
    }).toUpperCase();
}