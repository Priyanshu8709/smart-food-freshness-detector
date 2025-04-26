 // Preview uploaded image
 function previewFile() {
    const file = document.getElementById('fileInput').files[0];
    const preview = document.getElementById('previewImage');
    
    const reader = new FileReader();
    reader.onloadend = function () {
      preview.src = reader.result;
      preview.classList.remove('hidden');
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      preview.src = "";
      preview.classList.add('hidden');
    }
  }

  // Fetch freshness result
  function checkFreshness() {
    document.getElementById('resultText').innerText = "";
    document.getElementById('spinner').classList.remove('hidden'); // Show spinner

    fetch('https://drive.google.com/file/d/1-4fYn9pL9fa-ObwPKBW8-UQnQgV1ej9w/view?usp=sharing')
      .then(response => response.text())
      .then(data => {
        document.getElementById('spinner').classList.add('hidden'); // Hide spinner

        let emoji = "";
        const result = data.trim().toLowerCase();
        if (result.includes("fresh")) {
          emoji = "✅";
        } else if (result.includes("stale")) {
          emoji = "❌";
        } else {
          emoji = "⚡";
        }

        document.getElementById('resultText').innerText = `${emoji} ${data}`;
      })
      .catch(error => {
        console.error('Error fetching result:', error);
        document.getElementById('spinner').classList.add('hidden'); // Hide spinner
        document.getElementById('resultText').innerText = "Failed to fetch result.";
      });
  }