import Chart from 'chart.js/auto';


export function renderBlockRatingsChart() {
    const dataElement = document.getElementById('ratings-data');
    if (!dataElement) return;

    const blockLabels = JSON.parse(dataElement.dataset.blockLabels);
    const blockRatings = JSON.parse(dataElement.dataset.blockRatings);

    const ctx = document.getElementById('ratingsChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: blockLabels,
            datasets: [{
                label: 'Average Rating',
                data: blockRatings,
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
export function renderRatingDistributionChart() {
    const dataElement = document.getElementById('ratings-data');
    if (!dataElement) return;

    const ratingLabels = JSON.parse(dataElement.dataset.ratingLabels);
    const ratingCounts = JSON.parse(dataElement.dataset.ratingCounts);

    const ctx = document.getElementById('ratingDistributionChart')?.getContext('2d');
    if (!ctx) return;

    const backgroundColors = [
        '#FF6384', 
        '#FF9F40', 
        '#FFCD56', 
        '#4BC0C0', 
        '#36A2EB'  
    ];

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ratingLabels.map(r => `${r}-Star`),
            datasets: [{
                label: 'Rating Distribution',
                data: ratingCounts,
                backgroundColor: backgroundColors,
                borderWidth: 1,
                hoverOffset: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 20,
                        padding: 15
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (tooltipItem) => {
                            const label = tooltipItem.label || '';
                            const value = tooltipItem.raw || 0;
                            return `${label}: ${value} reviews`;
                        }
                    }
                }
            }
        }
    });
}



export function renderTopRatedLotsChart() {
    const dataElement = document.getElementById('top-rated-data');
    if (!dataElement) return;

    const labels = JSON.parse(dataElement.dataset.labels);
    const ratings = JSON.parse(dataElement.dataset.ratings);

    const ctx = document.getElementById('topRatedLotsChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Rating',
                data: ratings,
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                },
                title: {
                    display: true,
                    text: 'Top 5 Highest Rated Lots'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Lot ID'
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 5,
                    title: {
                        display: true,
                        text: 'Average Rating'
                    }
                }
            }
        }
    });
}
