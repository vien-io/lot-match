document.querySelectorAll('.lot').forEach((lot) => {
    lot.addEventListener('click', (event) => {
        const lotId = event.target.dataset.lotId;
        alert(`You clicked on Lot ${lotId}`);
        // Later, fetch and display lot details in a modal or new page
    });
});


