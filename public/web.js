document.getElementById('map-container').addEventListener('click', (event) => {
    if (event.target.classList.contains('lot')) {
        const lotId = event.target.dataset.lotId;
        alert(`You clicked on Lot ${lotId}`);
    }
});


