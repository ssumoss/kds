////////////////GRAFİK 1///////////////////
$(document).ready(function() {
    $.get('/api/gelir-tahmin', function(data) {
        data.sort((a, b) => a.year - b.year);

        const years = data.map(item => item.year);
        const totalRevenue = data.map(item => item.toplam_gelir);
        const customerCounts = data.map(item => item.musteri_sayisi);

        const chartData = {
            labels: years,
            datasets: [{
                label: 'Satış Geliri',
                data: totalRevenue,
                borderColor: 'rgba(148, 44, 21, 1)',
                backgroundColor: 'rgba(148, 44, 21, 0.2)',
                fill: true,
                tension: 0.1
            }]
        };

        const chartOptions = {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        };

        const ctx = document.getElementById('salesChart').getContext('2d');
        const salesChart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions
        });

        $('#updateButton').click(function() {
            const customerPercentage = parseFloat($('#customerPercentage').val());
            if (!isNaN(customerPercentage)) {
                const latestRevenue = totalRevenue[totalRevenue.length - 1];
                const latestCustomerCount = customerCounts[customerCounts.length - 1];

                const newRevenue2025 = latestRevenue * (1 + customerPercentage / 100);
                const newCustomerCount2025 = latestCustomerCount * (1 + customerPercentage / 100);

                salesChart.data.labels.push(2025);
                salesChart.data.datasets[0].data.push(newRevenue2025);

                const sortedLabels = salesChart.data.labels.sort((a, b) => a - b);
                const sortedData = sortedLabels.map(label => {
                    const index = salesChart.data.labels.indexOf(label);
                    return salesChart.data.datasets[0].data[index];
                });

                salesChart.data.labels = sortedLabels;
                salesChart.data.datasets[0].data = sortedData;

                salesChart.update();
            }
        });
    });
});

////////////////GRAFİK 2////////////////////
let chart;

async function fetchChartData() {
    try {
        const response = await fetch('/api/sube-gelir-yuzdesi');
        const data = await response.json();

        const labels = data.map(item => item.sube_adi);
        const percentages = data.map(item => item.gelir_yuzdesi);

        createChart(labels, percentages);
    } catch (error) {
        console.error("API'den veri alınırken hata oluştu:", error);
    }
}

function createChart(labels, data) {
    const ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Gelir Yüzdesi',
                data: data,
                backgroundColor: 'rgba(148, 44, 21, 0.2)',
                borderColor: 'rgba(148, 44, 21, 1)',
                borderWidth: 1,
                borderRadius: 10 
            }]
        },
        options: {
            responsive: false,
            plugins: {
                annotation: {
                    annotations: []
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                }
            }
        }
    });
}

function updateChart() {
    const targetValue = parseInt(document.getElementById('target-value').value);

    chart.options.plugins.annotation.annotations = [{
        type: 'line',
        scaleID: 'y',
        value: targetValue,
        borderColor: 'black',
        borderWidth: 2,
        label: {
            enabled: true,
            content: `Hedef: ${targetValue}%`,
            position: 'center',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            font: {
                size: 12
            }
        }
    }];
    
    chart.update();
}

fetchChartData();