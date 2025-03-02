document.addEventListener("DOMContentLoaded", function () {
    const urlInput = document.getElementById("media-url");
    const downloadButton = document.getElementById("download");
    const previewArea = document.getElementById("preview-area");

    // Automatically preview the video when the URL is entered
    urlInput.addEventListener("input", function () {
        const url = urlInput.value.trim();
        previewArea.innerHTML = ""; // Clear previous preview

        if (!url) {
            return;
        }

        // Check if the URL is a YouTube URL or YouTube Shorts URL
        if (url.includes("youtube.com") || url.includes("youtu.be") || url.includes("youtube.com/shorts")) {
            const videoId = extractYouTubeID(url);
            if (videoId) {
                previewArea.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="autoplay; fullscreen"></iframe>`;
            } else {
                previewArea.innerHTML = "NO YouTube shorts URL";
            }
        }
        // Check if the URL is a TikTok URL
        else if (url.includes("tiktok.com")) {
            const videoId = extractTikTokID(url);
            if (videoId) {
                previewArea.innerHTML = `
                    <blockquote class="tiktok-embed" cite="https://www.tiktok.com/${videoId}" data-video-id="${videoId}">
                        <section></section>
                    </blockquote>
                    <script async src="https://www.tiktok.com/embed.js"></script>
                `;
            } else {
                previewArea.innerHTML = "Invalid TikTok URL";
            }
        } else {
            previewArea.innerHTML = "Only YouTube URLs are supported for preview.";
        }
    });

    // Download the video
    downloadButton.addEventListener("click", async function () {
        console.log("Download button clicked");
        const url = urlInput.value.trim();

        if (!url) {
            alert("Please enter a You Tube URL!");
            return;
        }

        try {
            console.log("Requesting download...");
            const response = await fetch("http://127.0.0.1:5000/download", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ url: url })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Convert response to blob and download
            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "downloaded_video.MP4";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            console.log("Download started...");
        } catch (error) {
            console.error("Error downloading media:", error);
            alert("Download failed. Check console for details.");
        }
    });

    function extractYouTubeID(url) {
        const match = url.match(/[?&]v=([^&#]+)/) || url.match(/\/shorts\/([^&#]+)/);
        return match ? match[1] : url.split("youtu.be/")[1];
    }

    function extractTikTokID(url) {
        const match = url.match(/\/video\/(\d+)/);
        return match ? match[1] : null;
    }
});