document.addEventListener('DOMContentLoaded', (event) => {
    // Load the saved section from localStorage if available
    const savedSection = localStorage.getItem('currentSection') || 'Home';
    showContent(savedSection);
    setActiveLink(savedSection);

    // Add hover effect
    const links = document.querySelectorAll('.sidebar ul li a');
    links.forEach(link => {
        link.addEventListener('mouseover', handleMouseOver);
        link.addEventListener('mouseout', handleMouseOut);
    });

    // Initialize mode toggles and sliders
    initializeSliders('3');
    initializeSliders('4');

    // Event listeners for simulation buttons
    const simulateButton3 = document.querySelector('.play3');
    const stopButton3 = document.querySelector('.stop3');
    const status3 = document.querySelector('.status3');

    const simulateButton4 = document.querySelector('.play4');
    const stopButton4 = document.querySelector('.stop4');
    const status4 = document.querySelector('.status4');

    simulateButton3.addEventListener('click', () => {
        startSimulation3('3');
        // Change color of simulate button on click
        simulateButton3.style.backgroundColor = '#ccc'; // Light green
        // Optional: Reset color of stop button
        stopButton3.style.backgroundColor = '#E76F51'; // Default color

        status3.style.backgroundColor = '#6CD089';

    });

    stopButton3.addEventListener('click', () => {
        stopSimulation3('3');
        // Change color of stop button on click
        stopButton3.style.backgroundColor = '#ccc'; // Light red
        // Optional: Reset color of simulate button
        simulateButton3.style.backgroundColor = '#6CD089'; // Default color

        status3.style.backgroundColor = '#E76F51';
    });


    simulateButton4.addEventListener('click', () => {
        startSimulation4('4');
        // Change color of simulate button on click
        simulateButton4.style.backgroundColor = '#ccc'; // Light green
        // Optional: Reset color of stop button
        stopButton4.style.backgroundColor = '#E76F51'; // Default color

        status4.style.backgroundColor = '#6CD089';

    });

    stopButton4.addEventListener('click', () => {
        stopSimulation4('4');
        // Change color of stop button on click
        stopButton4.style.backgroundColor = '#ccc'; // Light red
        // Optional: Reset color of simulate button
        simulateButton4.style.backgroundColor = '#6CD089'; // Default color

        status4.style.backgroundColor = '#E76F51';
    });

// Access button elements
const compare4 = document.getElementById('compare4');
const compare3 = document.getElementById('compare3');

compare4.addEventListener('click', function() {
    var table = document.getElementById('comparison-table4');
    if (table.classList.contains('hidden')) {
        table.classList.remove('hidden');
        compare4.textContent = "Hide";
    } else {
        compare4.textContent = "Compare";
        table.classList.add('hidden');
    }
});

compare3.addEventListener('click', function() {
    var table = document.getElementById('comparison-table3');
    if (table.classList.contains('hidden')) {
        table.classList.remove('hidden');
        compare3.textContent = "Hide";
    } else {
        compare3.textContent = "Compare";
        table.classList.add('hidden');
    }
});

    document.getElementById('propose').addEventListener('click', function() {
        var data = document.getElementById('propose-solution');
        var overlays = document.querySelectorAll('.overlay');
        var compare = document.getElementById('propose');
    
        if (data.classList.contains('hiddendata')) {
            data.classList.remove('hiddendata');
            overlays.forEach(function(overlay) {
                overlay.classList.add('hiddendata');
            });
            compare.textContent = "Hide";
        } else {
            data.classList.add('hiddendata');
            overlays.forEach(function(overlay) {
                overlay.classList.remove('hiddendata');
            });
            compare.textContent = "See Solutions We Propose";
        }
    });
    

});

function initializeSliders(suffix) {
    const modeToggle = document.getElementById(`modeToggle${suffix}`);
    const trafficMode = document.getElementById(`mode${suffix}`);
    const sliderContainer = document.querySelector(`.Control-Panel${suffix} .slider-container${suffix}`);
    const sliders = sliderContainer.querySelectorAll(`.slider${suffix}`);
    const outputs = sliderContainer.querySelectorAll(`.sliderLevel${suffix}`);

    function updateMode(mode) {
        sliders.forEach((slider, index) => {
            slider.disabled = mode === 'static';
            slider.style.background = mode === 'static' ? '#ccc' : ''; // Gray color for disabled sliders
            outputs[index].textContent = mode === 'static' ? '---' : getSliderLabel(slider.value);
            slider.value = 2;
            trafficMode.textContent = mode === 'static' ? 'Static' : 'Adaptive';
        });
    }

    function updateSlider(slider, output) {
        output.textContent = getSliderLabel(slider.value);
        slider.style.background = getSliderColor(slider.value);
    }

    function getSliderLabel(value) {
        return value == 1 ? "Low" : value == 2 ? "Medium" : "High";
    }

    function getSliderColor(value) {
        return value == 1 ? "#36BA98" : value == 2 ? "#E9C46A" : "#E76F51";
    }

    updateMode(modeToggle.value == 1 ? 'static' : 'dynamic');

    modeToggle.addEventListener('input', () => {
        updateMode(modeToggle.value == 1 ? 'static' : 'dynamic');
    });

    sliders.forEach((slider, index) => {
        slider.addEventListener('input', () => {
            updateSlider(slider, outputs[index]);
        });
    });
}


function showContent(section) {
    // Hide all content
    const contents = document.querySelectorAll('.content');
    contents.forEach(content => content.style.display = 'none');

    // Show the selected content
    const activeContent = document.getElementById(section);
    if (activeContent) {
        activeContent.style.display = 'block';
    }

    // Save the current section to localStorage
    localStorage.setItem('currentSection', section);

    // Set active link color
    setActiveLink(section);
}

function setActiveLink(section) {
    // Remove active class from all links
    const links = document.querySelectorAll('.sidebar ul li a');
    links.forEach(link => link.classList.remove('active'));

    // Add active class to the selected link
    const activeLink = document.querySelector(`.sidebar ul li a[onclick="showContent('${section}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

function handleMouseOver(event) {
    const activeLink = document.querySelector('.sidebar ul li a.active');
    if (event.target !== activeLink) {
        event.target.classList.add('hover');
    }
}

function handleMouseOut(event) {
    event.target.classList.remove('hover');
}

const lightConfig3 = [
    { id: 'light1', offset: 0 },
    { id: 'light2', offset: 0 },
    { id: 'light3', offset: 0 }
];

let cycleTime = 0;
let simulationInterval3 = null;

function getTrafficLevels3() {
    const levels = [];
    const sliders = document.querySelectorAll('.slider3'); // Adjust selector if needed
    sliders.forEach(slider => {
        levels.push(parseInt(slider.value, 10));
    });
    return levels;
}

function adjustDurationsBasedOnTraffic3(levels) {
    const greenDurations = [0, 0, 0];
    let totalDurations = 0; // Initialize totalDurations to 0

    // Determine the green duration for each lane based on traffic levels
    levels.forEach((level, index) => {
        switch (level) {
            case 1: // Low
                greenDurations[index] = 2000; // 2 seconds
                break;
            case 2: // Medium
                greenDurations[index] = 4000; // 4 seconds
                break;
            case 3: // High
                greenDurations[index] = 6000; // 6 seconds
                break;
        }
    });

    // Calculate total cycle duration
    const yellowDuration = 1000; // 1 second
    totalDurations = greenDurations[0] + yellowDuration + yellowDuration + yellowDuration + greenDurations[1] + greenDurations[2];

    return {
        greenDurations,
        yellowDuration,
        totalDurations
    };
}

function updateLights3() {
    if (cycleTime === null) return; // Ensure simulation has started

    cycleTime += 100; // Increment cycleTime by the interval duration (100 ms)
    const trafficLevels = getTrafficLevels3();
    const { greenDurations, yellowDuration, totalDurations } = adjustDurationsBasedOnTraffic3(trafficLevels);

    lightConfig3[1].offset = greenDurations[0] + yellowDuration;
    lightConfig3[2].offset = greenDurations[0] + greenDurations[1] + yellowDuration + yellowDuration;
    

    // Calculate dynamic offsets and current cycle time
    lightConfig3.forEach((light, index) => {
        const currentTimeInCycle = totalDurations-(cycleTime + light.offset) % totalDurations;
        const greenDuration = greenDurations[index];

        let remainingTime3;
        let greenActive = false;
        let yellowActive = false;
        let redActive = false;

        if (currentTimeInCycle < greenDuration) {
            greenActive = true;
            remainingTime3 = currentTimeInCycle;
        } else if (currentTimeInCycle < (greenDuration + yellowDuration)) {
            yellowActive = true;
            remainingTime3 = currentTimeInCycle - greenDuration;
        } else {
            redActive = true;
            remainingTime3 = currentTimeInCycle - (greenDuration + yellowDuration);
        }

        // Update light colors
        document.querySelector(`#${light.id} .green`).classList.toggle('active', greenActive);
        document.querySelector(`#${light.id} .yellow`).classList.toggle('active', yellowActive);
        document.querySelector(`#${light.id} .red`).classList.toggle('active', redActive);

        // Update timer display for each color
        document.querySelector(`#${light.id} .green .timer`).textContent = greenActive ? (remainingTime3 / 1000).toFixed(0) : '';
        document.querySelector(`#${light.id} .yellow .timer`).textContent = yellowActive ? (remainingTime3 / 1000).toFixed(0) : '';
        document.querySelector(`#${light.id} .red .timer`).textContent = redActive ? (remainingTime3 / 1000).toFixed(0) : '';
    });
}

// Function to start the simulation
function startSimulation3(suffix) {
    if (simulationInterval3) {
        clearInterval(simulationInterval3);
    }

    cycleTime = 0; // Reset cycleTime

    // Start the light simulation
    simulationInterval3 = setInterval(updateLights3, 100);
}

// Function to stop the simulation
function stopSimulation3(suffix) {
    if (simulationInterval3) {
        clearInterval(simulationInterval3);
    }

    // Reset all lights to off
    lightConfig3.forEach(light => {
        document.querySelector(`#${light.id} .green`).classList.remove('active');
        document.querySelector(`#${light.id} .yellow`).classList.remove('active');
        document.querySelector(`#${light.id} .red`).classList.remove('active');
        document.querySelector(`#${light.id} .green .timer`).textContent = '';
        document.querySelector(`#${light.id} .yellow .timer`).textContent = '';
        document.querySelector(`#${light.id} .red .timer`).textContent = '';
    });

    cycleTime = null; // Reset cycleTime
}


const lightConfig4 = [
    { id: 'light4', offset: 0 },
    { id: 'light5', offset: 0 },
    { id: 'light6', offset: 0 },
    { id: 'light7', offset: 0 }
];

let simulationInterval4 = null;

function getTrafficLevels4() {
    const levels = [];
    const sliders = document.querySelectorAll('.slider4'); // Adjust selector if needed
    sliders.forEach(slider => {
        levels.push(parseInt(slider.value, 10));
    });
    return levels;
}

function adjustDurationsBasedOnTraffic4(levels) {
    const greenDurations = [0, 0, 0 , 0];
    let totalDurations = 0; // Initialize totalDurations to 0

    // Determine the green duration for each lane based on traffic levels
    levels.forEach((level, index) => {
        switch (level) {
            case 1: // Low
                greenDurations[index] = 2000; // 2 seconds
                break;
            case 2: // Medium
                greenDurations[index] = 4000; // 4 seconds
                break;
            case 3: // High
                greenDurations[index] = 6000; // 6 seconds
                break;
        }
    });

    // Calculate total cycle duration
    const yellowDuration = 1000; // 1 second
    totalDurations = greenDurations[0] +  greenDurations[1] + greenDurations[2] + yellowDuration*4 + greenDurations[3];

    return {
        greenDurations,
        yellowDuration,
        totalDurations
    };
}

function updateLights4() {
    if (cycleTime === null) return; // Ensure simulation has started

    cycleTime += 100; // Increment cycleTime by the interval duration (100 ms)
    const trafficLevels = getTrafficLevels4();
    const { greenDurations, yellowDuration, totalDurations } = adjustDurationsBasedOnTraffic4(trafficLevels);

    lightConfig4[1].offset = greenDurations[0] + yellowDuration;
    lightConfig4[2].offset = greenDurations[0] + greenDurations[1] + yellowDuration + yellowDuration;
    lightConfig4[3].offset = greenDurations[0] + greenDurations[1]+ greenDurations[2] + yellowDuration + yellowDuration + yellowDuration;
    

    // Calculate dynamic offsets and current cycle time
    lightConfig4.forEach((light, index) => {
        const currentTimeInCycle = totalDurations-(cycleTime + light.offset) % totalDurations;
        const greenDuration = greenDurations[index];

        let remainingTime4;
        let greenActive = false;
        let yellowActive = false;
        let redActive = false;

        if (currentTimeInCycle < greenDuration) {
            greenActive = true;
            remainingTime4 = currentTimeInCycle;
        } else if (currentTimeInCycle < (greenDuration + yellowDuration)) {
            yellowActive = true;
            remainingTime4 = currentTimeInCycle - greenDuration;
        } else {
            redActive = true;
            remainingTime4 = currentTimeInCycle - (greenDuration + yellowDuration);
        }

        // Update light colors
        document.querySelector(`#${light.id} .green`).classList.toggle('active', greenActive);
        document.querySelector(`#${light.id} .yellow`).classList.toggle('active', yellowActive);
        document.querySelector(`#${light.id} .red`).classList.toggle('active', redActive);

        // Update timer display for each color
        document.querySelector(`#${light.id} .green .timer`).textContent = greenActive ? (remainingTime4 / 1000).toFixed(0) : '';
        document.querySelector(`#${light.id} .yellow .timer`).textContent = yellowActive ? (remainingTime4 / 1000).toFixed(0) : '';
        document.querySelector(`#${light.id} .red .timer`).textContent = redActive ? (remainingTime4 / 1000).toFixed(0) : '';
    });
}

// Function to start the simulation
function startSimulation4(suffix) {
    if (simulationInterval4) {
        clearInterval(simulationInterval4);
    }

    cycleTime = 0; // Reset cycleTime

    // Start the light simulation
    simulationInterval4 = setInterval(updateLights4, 100);
}

// Function to stop the simulation
function stopSimulation4(suffix) {
    if (simulationInterval4) {
        clearInterval(simulationInterval4);
    }

    // Reset all lights to off
    lightConfig4.forEach(light => {
        document.querySelector(`#${light.id} .green`).classList.remove('active');
        document.querySelector(`#${light.id} .yellow`).classList.remove('active');
        document.querySelector(`#${light.id} .red`).classList.remove('active');
        document.querySelector(`#${light.id} .green .timer`).textContent = '';
        document.querySelector(`#${light.id} .yellow .timer`).textContent = '';
        document.querySelector(`#${light.id} .red .timer`).textContent = '';
    });

    cycleTime = null; // Reset cycleTime
}


// Function to initialize the page display
function initializePages() {
    document.querySelectorAll('.page').forEach((page) => {
        page.style.display = 'none'; // Hide all pages
    });
    document.querySelector('.page1').style.display = 'block'; // Show Page 1
}

// Function to handle button clicks and page switching
function setupPageButtons() {
    document.querySelectorAll('.selector button').forEach((button, index) => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.page').forEach((page) => {
                page.style.display = 'none'; // Hide all pages
            });
            document.querySelector(`.page${index + 1}`).style.display = 'block'; // Show selected page

            document.querySelectorAll('.selector button').forEach((btn) => {
                btn.classList.remove('active'); // Remove active class from all buttons
            });
            button.classList.add('active'); // Add active class to the clicked button
        });
    });
}

// Initialize pages and setup button handlers
document.addEventListener('DOMContentLoaded', () => {
    initializePages();
    setupPageButtons();
});
