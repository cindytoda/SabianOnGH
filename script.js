// ========================================
// DAILY SABIAN SUN
// ========================================

// Start with the visitor's current local date.
let selectedDate = new Date();


// ========================================
// CALCULATE THE SUN'S LONGITUDE
// ========================================

function getSunLongitude(date) {

    // Julian date
    const jd = (date.getTime() / 86400000) + 2440587.5;
    const T = (jd - 2451545.0) / 36525;

    // Sun's mean longitude
    let L0 = 280.46646
        + 36000.76983 * T
        + 0.0003032 * T * T;

    L0 = L0 % 360;
    if (L0 < 0) L0 += 360;

    // Sun's mean anomaly
    const M = 357.52911
        + 35999.05029 * T
        - 0.0001537 * T * T;

    const Mrad = M * Math.PI / 180;

    // Equation of center
    const C =
        (1.914602 - 0.004817 * T - 0.000014 * T * T)
            * Math.sin(Mrad)
        + (0.019993 - 0.000101 * T)
            * Math.sin(2 * Mrad)
        + 0.000289 * Math.sin(3 * Mrad);

    // Apparent longitude of the Sun
    let longitude = L0 + C;

    longitude = longitude % 360;
    if (longitude < 0) longitude += 360;

    return longitude;
}


// ========================================
// CONVERT LONGITUDE TO SABIAN NUMBER
// ========================================

function getSabianNumber(longitude) {

    const signIndex = Math.floor(longitude / 30);

    // Always advance to the next whole degree.
    const degree = Math.floor(longitude % 30) + 1;

    const number = signIndex * 30 + degree;

    return {
        signIndex: signIndex,
        degree: degree,
        number: number
    };
}


// ========================================
// ZODIAC SIGNS
// ========================================

const zodiacSigns = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces"
];


// ========================================
// DISPLAY THE SELECTED DAY
// ========================================

function displaySelectedDay() {

    // Calculate the Sun's position for the selected date.
    const sunLongitude = getSunLongitude(selectedDate);

    const sabian = getSabianNumber(sunLongitude);

    const sign = zodiacSigns[sabian.signIndex];

    // Find today's Sabian Symbol in our database.
    const currentSymbol = symbols.find(
        symbol => symbol.number === sabian.number
    );

    if (!currentSymbol) {
        console.error("Sabian Symbol not found:", sabian.number);
        return;
    }

    // Update the newspaper header date.
    const dateOptions = {
        month: "long",
        day: "numeric",
        year: "numeric"
    };

    document.getElementById("header-date").textContent =
        selectedDate.toLocaleDateString(
            "en-US",
            dateOptions
        ).toUpperCase();

    // Update the Sun degree in the heading.
    document.getElementById("sun-symbol-degree").textContent =
        `${sabian.degree}° ${sign}`;

    // Update the main Sabian phrase.
    document.getElementById("sun-symbol-phrase").textContent =
        `“${currentSymbol.phrase}”`;

    // Update the opposite degree.
    document.getElementById("opposite-symbol-degree").textContent =
        `${currentSymbol.opposite.degree}° ${currentSymbol.opposite.sign}`;

    // Update the opposite phrase.
    document.getElementById("opposite-symbol-phrase").textContent =
        `“${currentSymbol.opposite.phrase}”`;
}


// ========================================
// PREVIOUS AND NEXT DAY BUTTONS
// ========================================

document.getElementById("previous-day").addEventListener(
    "click",
    function () {

        selectedDate.setDate(selectedDate.getDate() - 1);

        displaySelectedDay();
    }
);


document.getElementById("next-day").addEventListener(
    "click",
    function () {

        selectedDate.setDate(selectedDate.getDate() + 1);

        displaySelectedDay();
    }
    
);


// ========================================
// INITIAL DISPLAY
// ========================================

displaySelectedDay();

// ========================================
// VISITOR LOCATION
// ========================================

async function getVisitorLocation() {
    const locationElement =
        document.getElementById("visitor-location");

    try {
        const response = await fetch("https://ipapi.co/json/");

        if (!response.ok) {
            throw new Error("Location lookup failed");
        }

        const location = await response.json();

        if (location.city && location.region_code) {
            locationElement.textContent =
                `${location.city}, ${location.region_code}`.toUpperCase();
        } else {
            locationElement.textContent = "LOCATION UNAVAILABLE";
        }

    } catch (error) {
        console.error("Could not retrieve visitor location:", error);
        locationElement.textContent = "LOCATION UNAVAILABLE";
    }
}

getVisitorLocation();