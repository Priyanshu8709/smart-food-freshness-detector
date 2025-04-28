function previewFile() {
    const fileInput = document.getElementById("fileInput");
    const previewImage = document.getElementById("previewImage");

   
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();

     
      reader.onload = function (e) {
        previewImage.src = e.target.result;
        previewImage.classList.remove("hidden"); 
      };

      reader.readAsDataURL(fileInput.files[0]); 
    }
  }
async function uploadImageAndFetchResult() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const uploadButton = document.getElementById('uploadButton');

    if (!file) {
        alert("Please select a file first!");
        return;
    }

    showSpinner();
    uploadButton.disabled = true;

    const reader = new FileReader();
    reader.onload = async function(event) {
        const base64Data = event.target.result.split(',')[1];
        const contentType = file.type;

        const url = "https://script.google.com/macros/s/AKfycbzX7RKyQ8rlQ_M-B69oW2mDIsyS3PUeD8UWtBwaYOyIYlrnqIgqZ-Tmp0lcYibyrcYb/exec";

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: new URLSearchParams({
                    data: base64Data,
                    contentType: contentType,
                    filename: 'test.jpg'
                })
            });

            const resultText = await response.text();
            console.log("Upload Response:", resultText);

            if (resultText.includes("Success")) {
                console.log("Waiting for prediction...");
                setTimeout(() => fetchResult(0), 6000); // Retry logic
            } else {
                alert("Upload failed: " + resultText);
                hideSpinner();
                uploadButton.disabled = false;
            }
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Error uploading image.");
            hideSpinner();
            uploadButton.disabled = false;
        }
    };

    reader.readAsDataURL(file);
}

async function fetchResult(retryCount) {
    const MAX_RETRIES = 3;

    try {
        const url = "https://script.google.com/macros/s/AKfycbzX7RKyQ8rlQ_M-B69oW2mDIsyS3PUeD8UWtBwaYOyIYlrnqIgqZ-Tmp0lcYibyrcYb/exec";

        const response = await fetch(url, {
            method: 'GET'
        });
        const text = await response.text();

        console.log("Fetched result:", text);

        if (text.toLowerCase().includes('fresh') || text.toLowerCase().includes('stale')) {
            let emoji = '';
            if (text.toLowerCase().includes('fresh')) {
                emoji = '🥗';
            } else {
                emoji = '🗑️';
            }

            document.getElementById("resultDisplay").innerHTML = `
                <p class="text-2xl font-bold">Freshness Result:</p>
                <p class="mt-2 text-3xl">${emoji} ${text.trim()}</p>
            `;
            hideSpinner();
            document.getElementById('uploadButton').disabled = false;
        } else {
            if (retryCount < MAX_RETRIES) {
                console.log("Result not ready yet, retrying...");
                setTimeout(() => fetchResult(retryCount + 1), 4000);
            } else {
                document.getElementById("resultDisplay").innerText = "Result not available. Please try again.";
                hideSpinner();
                document.getElementById('uploadButton').disabled = false;
            }
        }
    } catch (error) {
        console.error("Fetch Result Error:", error);
        document.getElementById("resultDisplay").innerText = "Error fetching result.";
        hideSpinner();
        document.getElementById('uploadButton').disabled = false;
    }
}

function showSpinner() {
    document.getElementById('spinner').classList.remove('hidden');
}

function hideSpinner() {
    document.getElementById('spinner').classList.add('hidden');
}