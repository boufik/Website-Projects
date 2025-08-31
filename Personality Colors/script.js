// Color mapping for personality types
const colors = {
    red: '#e74c3c',
    yellow: '#f39c12',
    green: '#27ae60',
    blue: '#3498db'
};

// Data storage for trait values
let traitData = {
    red: new Array(22).fill(0),
    yellow: new Array(22).fill(0),
    green: new Array(22).fill(0),
    blue: new Array(22).fill(0)
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateCharts();
});

// Set up event listeners for all sliders
function setupEventListeners() {
    const sliders = document.querySelectorAll('.trait-slider');
    
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            const value = parseInt(this.value);
            const valueSpan = this.nextElementSibling;
            valueSpan.textContent = value;
            
            // Update data array
            const traitType = this.classList.contains('red-trait') ? 'red' :
                            this.classList.contains('yellow-trait') ? 'yellow' :
                            this.classList.contains('green-trait') ? 'green' : 'blue';
            
            const traitIndex = parseInt(this.dataset.trait);
            traitData[traitType][traitIndex] = value;
            
            // Update charts with a small delay for smooth performance
            clearTimeout(window.chartUpdateTimeout);
            window.chartUpdateTimeout = setTimeout(updateCharts, 100);
        });
    });
}

// Calculate traits above threshold (5) for pie chart
function calculateDominantTraits() {
    const dominantCounts = {};
    
    Object.keys(traitData).forEach(color => {
        dominantCounts[color] = traitData[color].filter(value => value >= 5).length;
    });
    
    return dominantCounts;
}

// Calculate average values for bar chart
function calculateAverageTraits() {
    const averages = {};
    
    Object.keys(traitData).forEach(color => {
        const sum = traitData[color].reduce((acc, val) => acc + val, 0);
        averages[color] = (sum / traitData[color].length).toFixed(1);
    });
    
    return averages;
}

// Update both charts
function updateCharts() {
    updatePieChart();
    updateBarChart();
}

// Create/Update pie chart
function updatePieChart() {
    const canvas = document.getElementById('pieChart');
    const ctx = canvas.getContext('2d');
    const dominantTraits = calculateDominantTraits();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate total and percentages
    const total = Object.values(dominantTraits).reduce((sum, count) => sum + count, 0);
    
    if (total === 0) {
        // Draw a gray circle if no dominant traits
        ctx.beginPath();
        ctx.arc(150, 150, 120, 0, 2 * Math.PI);
        ctx.fillStyle = '#ecf0f1';
        ctx.fill();
        ctx.strokeStyle = '#bdc3c7';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Add text
        ctx.fillStyle = '#7f8c8d';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('No Dominant Traits', 150, 155);
        return;
    }
    
    // Draw pie slices
    let currentAngle = 0;
    const centerX = 150;
    const centerY = 150;
    const radius = 120;
    
    Object.keys(dominantTraits).forEach(color => {
        const count = dominantTraits[color];
        const percentage = (count / total) * 100;
        const sliceAngle = (count / total) * 2 * Math.PI;
        
        if (count > 0) {
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[color];
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Add percentage text
            const textAngle = currentAngle + sliceAngle / 2;
            const textX = centerX + Math.cos(textAngle) * radius * 0.7;
            const textY = centerY + Math.sin(textAngle) * radius * 0.7;
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${percentage.toFixed(1)}%`, textX, textY);
        }
        
        currentAngle += sliceAngle;
    });
    
    // Update legend
    updatePieLegend(dominantTraits, total);
}

// Update pie chart legend
function updatePieLegend(dominantTraits, total) {
    const legendContainer = document.getElementById('pieLegend');
    legendContainer.innerHTML = '';
    
    Object.keys(dominantTraits).forEach(color => {
        const count = dominantTraits[color];
        const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
        
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = colors[color];
        
        const text = document.createElement('span');
        text.textContent = `${color.charAt(0).toUpperCase() + color.slice(1)}: ${count}/22 (${percentage}%)`;
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(text);
        legendContainer.appendChild(legendItem);
    });
}

// Create/Update bar chart
function updateBarChart() {
    const canvas = document.getElementById('barChart');
    const ctx = canvas.getContext('2d');
    const averages = calculateAverageTraits();
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart dimensions
    const chartWidth = 320;
    const chartHeight = 200;
    const chartX = 40;
    const chartY = 50;
    const barWidth = 60;
    const barSpacing = 20;
    const maxValue = 10;
    
    // Draw axes
    ctx.strokeStyle = '#34495e';
    ctx.lineWidth = 2;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(chartX, chartY);
    ctx.lineTo(chartX, chartY + chartHeight);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(chartX, chartY + chartHeight);
    ctx.lineTo(chartX + chartWidth, chartY + chartHeight);
    ctx.stroke();
    
    // Draw bars
    let barX = chartX + 20;
    
    Object.keys(averages).forEach((color, index) => {
        const average = parseFloat(averages[color]);
        const barHeight = (average / maxValue) * chartHeight;
        
        // Draw bar
        ctx.fillStyle = colors[color];
        ctx.fillRect(barX, chartY + chartHeight - barHeight, barWidth, barHeight);
        
        // Add border to bar
        ctx.strokeStyle = '#2c3e50';
        ctx.lineWidth = 2;
        ctx.strokeRect(barX, chartY + chartHeight - barHeight, barWidth, barHeight);
        
        // Add value on top of bar
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(average, barX + barWidth / 2, chartY + chartHeight - barHeight - 5);
        
        // Add color label below bar
        ctx.fillStyle = '#2c3e50';
        ctx.font = 'bold 11px Arial';
        ctx.fillText(color.charAt(0).toUpperCase() + color.slice(1), barX + barWidth / 2, chartY + chartHeight + 15);
        
        barX += barWidth + barSpacing;
    });
    
    // Add Y-axis labels
    ctx.fillStyle = '#34495e';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    
    for (let i = 0; i <= maxValue; i += 2) {
        const y = chartY + chartHeight - (i / maxValue) * chartHeight;
        ctx.fillText(i.toString(), chartX - 5, y + 3);
        
        // Draw grid lines
        ctx.strokeStyle = '#ecf0f1';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(chartX, y);
        ctx.lineTo(chartX + chartWidth, y);
        ctx.stroke();
    }
    
    // Update legend
    updateBarLegend(averages);
}

// Update bar chart legend
function updateBarLegend(averages) {
    const legendContainer = document.getElementById('barLegend');
    legendContainer.innerHTML = '';
    
    Object.keys(averages).forEach(color => {
        const average = averages[color];
        
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        
        const colorBox = document.createElement('div');
        colorBox.className = 'legend-color';
        colorBox.style.backgroundColor = colors[color];
        
        const text = document.createElement('span');
        text.textContent = `${color.charAt(0).toUpperCase() + color.slice(1)}: ${average} avg`;
        
        legendItem.appendChild(colorBox);
        legendItem.appendChild(text);
        legendContainer.appendChild(legendItem);
    });
}

// Add smooth animations for better user experience
function addHoverEffects() {
    const sliders = document.querySelectorAll('.trait-slider');
    
    sliders.forEach(slider => {
        slider.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        slider.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// Initialize hover effects
document.addEventListener('DOMContentLoaded', addHoverEffects);

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.target.classList.contains('trait-slider')) {
        const slider = e.target;
        let currentValue = parseInt(slider.value);
        
        if (e.key === 'ArrowLeft' && currentValue > 1) {
            slider.value = currentValue - 1;
            slider.dispatchEvent(new Event('input'));
        } else if (e.key === 'ArrowRight' && currentValue < 10) {
            slider.value = currentValue + 1;
            slider.dispatchEvent(new Event('input'));
        }
    }
});