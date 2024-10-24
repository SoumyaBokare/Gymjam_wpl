document.addEventListener('DOMContentLoaded', function () {
    const ctx = document.getElementById('ffmiChart').getContext('2d');
    const leanMassElement = document.getElementById('leanMass');
    const bodyFatPercentageElement = document.getElementById('bodyFatPercentage');
    const ffmiValueElement = document.getElementById('ffmiValue');
    const normalizedFfmiElement = document.getElementById('normalizedFfmi');

    // Initialize Chart.js with FFMI 0
    const ffmiChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [0, 30],
                backgroundColor: ['#e6e6e6', '#f44336'],
                borderWidth: 0
            }]
        },
        options: {
            circumference: Math.PI,
            rotation: -Math.PI,
            cutout: '70%',
            responsive: true,
            plugins: {
                tooltip: {
                    enabled: false
                },
                legend: {
                    display: false
                }
            }
        }
    });

    const heightFeet = document.getElementById('heightFeet');
    const heightInches = document.getElementById('heightInches');
    const weight = document.getElementById('weight');
    const bodyFat = document.getElementById('bodyFat');

    function updateFFMI() {
        // Parse input values and ensure they are valid numbers
        const heightFeetValue = parseInt(heightFeet.value) || 0;
        const heightInchesValue = parseInt(heightInches.value) || 0;
        const weightValue = parseFloat(weight.value) || 0;
        const bodyFatValue = parseFloat(bodyFat.value) || 0;

        // Check for valid ranges
        if (heightFeetValue < 0 || heightInchesValue < 0 || heightInchesValue >= 12 || weightValue <= 0 || bodyFatValue < 0 || bodyFatValue > 100) {
            return; // Prevent invalid calculations
        }

        const heightInMeters = ((heightFeetValue * 12) + heightInchesValue) * 0.0254;
        const weightInKg = weightValue * 0.453592;
        const bodyFatPercentage = bodyFatValue;
        const leanMass = weightInKg * (1 - (bodyFatPercentage / 100));
        const ffmi = (leanMass / (heightInMeters * heightInMeters)) || 0;
        const normalizedFfmi = ffmi + (6.3 * (1.8 - heightInMeters)) || 0;

        // Update UI elements
        leanMassElement.innerText = `${(leanMass * 2.20462).toFixed(2)} lbs`;
        bodyFatPercentageElement.innerText = `${bodyFatPercentage}%`;
        ffmiValueElement.innerText = ffmi.toFixed(2);
        normalizedFfmiElement.innerText = normalizedFfmi.toFixed(2);

        // Update Chart
        const percentage = (ffmi / 30) * 100;
        const color = (ffmi >= 18.7 && ffmi <= 21) ? '#4caf50' : '#f44336';

        ffmiChart.data.datasets[0].data = [ffmi, Math.max(0, 30 - ffmi)]; // Avoid negative values
        ffmiChart.data.datasets[0].backgroundColor = [color, '#e6e6e6'];
        ffmiChart.update();
    }

    // Add event listeners for all input fields to update FFMI dynamically
    [heightFeet, heightInches, weight, bodyFat].forEach(input => {
        input.addEventListener('input', updateFFMI);
    });

    // Initialize FFMI calculation on page load
    updateFFMI();
});
