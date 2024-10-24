document.getElementById('calorieForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const age = parseFloat(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const bodyFat = parseFloat(document.getElementById('bodyFat').value) || 0;
    const formula = document.getElementById('formula').value;
    
    let bmr;

    // Mifflin-St Jeor Equation
    if (formula === "mifflin") {
        if (gender === "male") {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }
    }

    // Revised Harris-Benedict Equation
    else if (formula === "harris") {
        if (gender === "male") {
            bmr = 13.397 * weight + 4.799 * height - 5.677 * age + 88.362;
        } else {
            bmr = 9.247 * weight + 3.098 * height - 4.330 * age + 447.593;
        }
    }

    // Katch-McArdle Formula (Requires Body Fat %)
    else if (formula === "katch") {
        if (bodyFat > 0) {
            bmr = 370 + 21.6 * (1 - (bodyFat / 100)) * weight;
        } else {
            alert('Please enter a valid Body Fat Percentage for the Katch-McArdle formula.');
            return;
        }
    }

    // Display the result
    document.getElementById('bmrResult').textContent = `BMR: ${bmr.toFixed(2)} kcal/day`;

    // Send data to backend
    fetch('http://localhost:3000/calorie', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ age, gender, height, weight, bodyFat, formula, bmr })
    })
    .then(response => {
        if (response.ok) {
            alert('Calorie data saved successfully');
        } else {
            alert('Failed to save calorie data');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to save calorie data');
    });
});

// FFMI form submission
document.getElementById('ffmiForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const weight = parseFloat(document.getElementById('ffmiWeight').value);
    const bodyFat = parseFloat(document.getElementById('ffmiBodyFat').value);
    const heightFeet = parseFloat(document.getElementById('feet').value);
    const heightInches = parseFloat(document.getElementById('inches').value);

    const heightCm = (heightFeet * 30.48) + (heightInches * 2.54);
    const totalBodyFat = weight * (bodyFat / 100);
    const leanWeight = weight - totalBodyFat;
    const ffmi = leanWeight / Math.pow(heightCm / 100, 2);
    const adjustedFfmi = ffmi + (6.1 * (1.8 - (heightCm / 100)));

    // Display the results
    document.getElementById('totalBodyFat').textContent = `Total Body Fat: ${totalBodyFat.toFixed(2)} kg`;
    document.getElementById('leanWeight').textContent = `Lean Weight: ${leanWeight.toFixed(2)} kg`;
    document.getElementById('ffmi').textContent = `FFMI: ${ffmi.toFixed(2)}`;
    document.getElementById('adjustedFfmi').textContent = `Adjusted FFMI: ${adjustedFfmi.toFixed(2)}`;

    // Send data to backend
    fetch('http://localhost:3000/ffmi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ weight, bodyFat, heightFeet, heightInches, totalBodyFat, leanWeight, ffmi, adjustedFfmi })
    })
    .then(response => {
        if (response.ok) {
            alert('FFMI data saved successfully');
        } else {
            alert('Failed to save FFMI data');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to save FFMI data');
    });
});
const revenueTrendChart = new Chart(document.getElementById('revenueTrendChart').getContext('2d'), {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [{
            label: 'Revenue',
            data: [12000, 19000, 15000, 22000, 24000, 28000],
            borderColor: '#3498db',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});