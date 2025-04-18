document.getElementById('fileInput').addEventListener('change', previewImage);
function previewImage(e){
    const file = e.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = function(event){
            preview.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
    else{
        preview.src = '';
    }
}
document.getElementById('fileInput').addEventListener('change', function (e) {
    const fileInput = e.target;
    const label = document.getElementById('fileLabel');
    if (fileInput.files.length > 0) {
        label.textContent = fileInput.files[0].name; 
    } else {
        label.textContent = "Choose File"; 
    }
});