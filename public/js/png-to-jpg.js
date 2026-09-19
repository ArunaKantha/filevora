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


// Select PNG image
imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }

    if (file.type !== "image/png") {

        alert("Please select a PNG image.");

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


// Convert PNG to JPG
convertBtn.addEventListener("click", function () {

    if (!selectedFile) {

        alert("Please choose a PNG image first.");

        return;
    }

    const img = new Image();

    img.onload = function () {

        const canvas = document.createElement("canvas");

        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        const ctx = canvas.getContext("2d");

        // JPG does not support transparency.
        // Use white background for transparent PNG areas.
        ctx.fillStyle = "#ffffff";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

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

            const jpgURL = URL.createObjectURL(blob);

            downloadBtn.href = jpgURL;

            resultArea.hidden = false;
resultArea.removeAttribute("hidden");
resultArea.style.setProperty("display", "block", "important");

        }, "image/jpeg", 0.92);
    };


    img.onerror = function () {

        alert("Unable to read this image.");

    };


    img.src = URL.createObjectURL(selectedFile);
});
// PNG to JPG - Reset Button
const resetBtn = document.getElementById("resetBtn");

if (resetBtn) {
    resetBtn.addEventListener("click", function () {
        window.location.reload();
    });
}