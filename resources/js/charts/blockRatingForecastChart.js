import Chart from 'chart.js/auto';

export async function renderBlockForecastChart(ctx, blockId) {
    const res = await fetch(`/forecast/block/${blockId}`);
    const data = await res.json();

    if (!data.length) return alert('no rating history for this block');

    // convert to usable arrays
    const labels = data.map(d => d.month);
    const ratings = data.map(d => d.avg_rating);

    // simple linear regression
    const n = ratings.length;
    const x = [...Array(n).keys()]; // [0, 1, 2, ...]
    const y = ratings;

    const xMean = x.reduce((a, b) => a + b) / n;
    const yMean = y.reduce((a, b) => a + b) / n;

    const slope = x.reduce((sum, xi, i) => sum + (xi - xMean) * (y[i] - yMean), 0) /
                  x.reduce((sum, xi) => sum + Math.pow(xi - xMean, 2), 0);

    const intercept = yMean - slope * xMean;

    // forecast next 3 months
    const forecastLabels = [];
    const forecastValues = [];

    for (let i = n; i < n + 3; i++) {
        const forecastMonth = new Date(labels[labels.length - 1] + '-01');
        forecastMonth.setMonth(forecastMonth.getMonth() + (i - n + 1));

        const label = forecastMonth.toISOString().slice(0, 7);
        forecastLabels.push(label);
        forecastValues.push((slope * i + intercept).toFixed(2));
    }

    // plot chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: [...labels, ...forecastLabels],
            datasets: [
                {
                    label: 'Avg Rating',
                    data: ratings,
                    borderColor: 'blue',
                    tension: 0.3
                },
                {
                    label: 'Forecast',
                    data: [...Array(ratings.length).fill(null), ...forecastValues],
                    borderColor: 'orange',
                    borderDash: [5, 5],
                    tension: 0.3
                }
            ]
        }
    });
}
