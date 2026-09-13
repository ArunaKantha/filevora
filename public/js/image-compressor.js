const imageInput = document.getElementById("imageInput");
const previewArea = document.getElementById("previewArea");
const previewImage = document.getElementById("previewImage");

const originalSize = document.getElementById("originalSize");
const compressedSize = document.getElementById("compressedSize");
const reduction = document.getElementById("reduction");

const quality = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");

const compressBtn = document.getElementById("compressBtn");
const resultArea = document.getElementById("resultArea");
const downloadBtn = document.getElementById("downloadBtn");

let selectedFile = null;

function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));

    return (
        (bytes / Math.pow(1024, index)).toFixed(2) +
        " " +
        units[index]
    );
}

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    selectedFile = file;

    originalSize.textContent = formatBytes(file.size);

    const imageURL = URL.createObjectURL(file);

    previewImage.src = imageURL;

    previewArea.hidden = false;
    resultArea.hidden = true;
});

quality.addEventListener("input", function () {
    qualityValue.textContent = `${this.value}%`;
});

compressBtn.addEventListener("click", function () {

    if (!selectedFile) {
        alert("Please choose an image first.");
        return;
    }

    const img = new Image();

    img.onload = function () {

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);

        const compressionQuality = Number(quality.value) / 100;

        canvas.toBlob(
            function (blob) {

                if (!blob) {
                    alert("Compression failed. Please try another image.");
                    return;
                }

                compressedSize.textContent = formatBytes(blob.size);

                const savedPercentage =
                    ((selectedFile.size - blob.size) / selectedFile.size) * 100;

                reduction.textContent =
                    savedPercentage > 0
                        ? `${savedPercentage.toFixed(1)}%`
                        : "0%";

                const compressedURL = URL.createObjectURL(blob);

                downloadBtn.href = compressedURL;

                resultArea.hidden = false;
            },
            "image/jpeg",
            compressionQuality
        );
    };

    img.src = URL.createObjectURL(selectedFile);
});