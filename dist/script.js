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
