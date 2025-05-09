import { renderBlockForecastChart } from '../charts/blockRatingForecastChart';

document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('forecastChart');
    const blockId = ctx.dataset.blockId; 
    renderBlockForecastChart(ctx, blockId);
});
