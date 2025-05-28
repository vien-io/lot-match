import Chart from 'chart.js/auto';


export function renderBlockRatingsChart() {
    const dataElement = document.getElementById('ratings-data');
    if (!dataElement) return;

    const blockLabels = JSON.parse(dataElement.dataset.blockLabels);
    const blockRatings = JSON.parse(dataElement.dataset.blockRatings);
    const blockReviews = JSON.parse(dataElement.dataset.blockReviews);

    const ctx = document.getElementById('ratingsChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: blockLabels,
            datasets: [
                {
                    label: 'Average Rating',
                    data: blockRatings,
                    yAxisID: 'y',
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Number of Reviews',
                    data: blockReviews,
                    yAxisID: 'y1',
                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Average Rating'
                    },
                    min: 0,
                    max: 5
                },
                y1: {
                    beginAtZero: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Number of Reviews'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
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
                backgroundColor: ratings.map((rating, index) => {
                    return index === 0 ? 'rgba(255, 99, 99, 0.6)' : 'rgba(255, 99, 132, 0.6)';
                }),
                borderColor: ratings.map((rating, index) => {
                    return index === 0 ? 'rgb(222, 71, 71)' : 'rgba(255, 99, 132, 1)';
                }),
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Top 5 Highest Rated Lots'
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 5,
                    title: {
                        display: true,
                        text: 'Average Rating'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Lot ID'
                    }
                }
            }
        }
    });
}


export function renderTopRatedLotsCards() {
    const dataElement = document.getElementById('top-rated-data');
    if (!dataElement) return;

    const labels = JSON.parse(dataElement.dataset.labels); 
    const ratings = JSON.parse(dataElement.dataset.ratings); 

    const container = document.getElementById('top-rated-lots');
    if (!container) return;

    container.innerHTML = '';

    labels.forEach((label, index) => {
     
        const card = document.createElement('div');
        card.classList.add('card');

        // Fill card content
        card.innerHTML = `
            <h4>Lot ID: ${label}</h4>
            <p>Average Rating: ${ratings[index].toFixed(2)}</p>
        `;

       
        container.appendChild(card);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    renderTopRatedLotsCards();
});




