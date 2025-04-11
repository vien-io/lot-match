import Chart from 'chart.js/auto';

export function renderBlockRatingsChart() {
    const dataElement = document.getElementById('ratings-data');
    if (!dataElement) return;

    const labels = JSON.parse(dataElement.dataset.labels);
    const ratings = JSON.parse(dataElement.dataset.ratings);

    const ctx = document.getElementById('ratingsChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Rating',
                data: ratings,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5
                }
            }
        }
    });
}
