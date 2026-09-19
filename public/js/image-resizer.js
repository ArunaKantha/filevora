const imageInput = document.getElementById("imageInput");
const resizeContent = document.getElementById("resizeContent");
const previewImage = document.getElementById("previewImage");

const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");

const lockRatio = document.getElementById("lockRatio");
const resizeBtn = document.getElementById("resizeBtn");

const resultArea = document.getElementById("resultArea");
const newDimensions = document.getElementById("newDimensions");
const downloadBtn = document.getElementById("downloadBtn");

let selectedImage = null;
let originalWidth = 0;
let originalHeight = 0;
let aspectRatio = 1;


// Select image
imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    selectedImage = file;

    const imageURL = URL.createObjectURL(file);

    const img = new Image();

    img.onload = function () {

        originalWidth = img.naturalWidth;
        originalHeight = img.naturalHeight;

        aspectRatio = originalWidth / originalHeight;

        previewImage.src = imageURL;

        widthInput.value = originalWidth;
        heightInput.value = originalHeight;

        resizeContent.hidden = false;
        resultArea.hidden = true;
    };

    img.src = imageURL;
});


// Width change
widthInput.addEventListener("input", function () {

    if (!lockRatio.checked) return;

    const newWidth = parseInt(this.value);

    if (newWidth > 0) {
        heightInput.value = Math.round(newWidth / aspectRatio);
    }
});


// Height change
heightInput.addEventListener("input", function () {

    if (!lockRatio.checked) return;

    const newHeight = parseInt(this.value);

    if (newHeight > 0) {
        widthInput.value = Math.round(newHeight * aspectRatio);
    }
});


// Resize
resizeBtn.addEventListener("click", function () {

    if (!selectedImage) {
        alert("Please choose an image first.");
        return;
    }

    const newWidth = parseInt(widthInput.value);
    const newHeight = parseInt(heightInput.value);

    if (
        !newWidth ||
        !newHeight ||
        newWidth <= 0 ||
        newHeight <= 0
    ) {
        alert("Please enter valid dimensions.");
        return;
    }

    const img = new Image();

    img.onload = function () {

        const canvas = document.createElement("canvas");

        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, newWidth, newHeight);

        ctx.drawImage(
            img,
            0,
            0,
            newWidth,
            newHeight
        );

        canvas.toBlob(function (blob) {

            if (!blob) {
                alert("Resize failed.");
                return;
            }

            const resizedURL = URL.createObjectURL(blob);

            downloadBtn.href = resizedURL;

            newDimensions.textContent =
                `${newWidth} × ${newHeight} px`;

            resultArea.hidden = false;
resultArea.removeAttribute("hidden");
resultArea.style.setProperty("display", "block", "important");

resultArea.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
});

        }, "image/jpeg", 0.92);
    };

    img.src = URL.createObjectURL(selectedImage);
});
// Image Resizer - Reset Button
const resetBtn = document.getElementById("resetBtn");

if (resetBtn) {
    resetBtn.addEventListener("click", function () {
        window.location.reload();
    });
}