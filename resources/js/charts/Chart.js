import { _angleBetween } from "chart.js/helpers";
import { response } from "express";

axios.get(`/forecast/sentiment-trend/${blockId}`).then(response => {
    const data = response.data;

    const labels = Object.keys(data);
    const positive = labels.map(month => data[month].positive || 0);
    const neutral = labels.map(month => data[month].neutral || 0);
    const negative = labels.map(month => data[month].negative || 0);

    new Chart(document.getElementById("sentimentChart"), {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Positive',
                    data: positive,
                    backgroundColor: 'rgba(75, 192, 192, 0.8)'
                },
                {
                    label: 'Neutral',
                    data: neutral,
                    backgroundColor: 'rgba(201, 203, 207, 0.8)'
                },
                {
                    label: 'Negative',
                    data: negative,
                    backgroundColor: 'rgba(255, 99, 132, 0.8)'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Monthly Sentiment Trend'
                },
            },
            scales: {
                x: { stacked:true },
                y: { stacked:true }
            }
        }
    });  
})