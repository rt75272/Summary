document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("summarize-form");
    const spinner = document.getElementById("loading-spinner");
    const summaryBox = document.getElementById("summary-box");
    const downloadSection = document.getElementById("download-section");
    const summaryInput = document.getElementById("summary-input");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        spinner.style.display = "block";
        summaryBox.innerHTML = "";
        downloadSection.style.display = "none";

        const formData = new FormData(form);
        const startResponse = await fetch("/start_summarization", {method: "POST", body: formData});
        const startData = await startResponse.json();
        const session_id = startData.session_id;

        // Poll progress
        let progress = 0;
        const interval = setInterval(async () => {
            const res = await fetch(`/progress/${session_id}`);
            const data = await res.json();
            progress = data.progress;

            if(progress >= 100){
                clearInterval(interval);
                spinner.style.display = "none";
                summaryBox.innerHTML = data.summary;
                summaryInput.value = data.summary;
                downloadSection.style.display = "block";
            }
        }, 500);
    });
});
