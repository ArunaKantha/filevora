const imageInput = document.getElementById("imageInput");

const previewArea = document.getElementById("previewArea");
const previewImage = document.getElementById("previewImage");

const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");

const convertBtn = document.getElementById("convertBtn");

const resultArea = document.getElementById("resultArea");
const downloadBtn = document.getElementById("downloadBtn");

let selectedFile = null;


function formatBytes(bytes) {

    if (bytes === 0) {
        return "0 Bytes";
    }

    const units = ["Bytes", "KB", "MB", "GB"];

    const index = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    return (
        (bytes / Math.pow(1024, index)).toFixed(2)
        + " "
        + units[index]
    );
}


// Select JPG image
imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }

    if (file.type !== "image/jpeg") {

        alert("Please select a JPG or JPEG image.");

        imageInput.value = "";

        return;
    }

    selectedFile = file;

    const imageURL = URL.createObjectURL(file);

    previewImage.src = imageURL;

    fileName.textContent = file.name;

    fileSize.textContent = formatBytes(file.size);

    previewArea.hidden = false;

    resultArea.hidden = true;
});


// Convert JPG to PNG
convertBtn.addEventListener("click", function () {

    if (!selectedFile) {

        alert("Please choose a JPG image first.");

        return;
    }

    const img = new Image();

    img.onload = function () {

        const canvas = document.createElement("canvas");

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");

        ctx.drawImage(
            img,
            0,
            0,
            canvas.width,
            canvas.height
        );


        canvas.toBlob(function (blob) {

            if (!blob) {

                alert("Conversion failed. Please try again.");

                return;
            }

            const pngURL = URL.createObjectURL(blob);

            downloadBtn.href = pngURL;

            resultArea.hidden = false;
resultArea.removeAttribute("hidden");
resultArea.style.setProperty("display", "block", "important");

        }, "image/png");
    };


    img.onerror = function () {

        alert("Unable to read this image.");

    };


    img.src = URL.createObjectURL(selectedFile);
});
// JPG to PNG - Reset Button
const resetBtn = document.getElementById("resetBtn");

if (resetBtn) {
    resetBtn.addEventListener("click", function () {
        window.location.reload();
    });
}