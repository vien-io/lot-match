export function loadBlockSummary(blockId) {
    fetch(`/forecast/summary/${blockId}`)
    .then(res => res.json())
    .then(data => {
        const summaryDiv = document.getElementById('block-summary');
        summaryDiv.textContent = data.summary;
    })
    .catch(err => {
        console.error(err);
        document.getElementById('block-summary').textContent = "Unable to load summary.";
    });

}