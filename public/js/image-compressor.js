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
let previewURL = null;
let downloadURL = null;


function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];

    const index = Math.min(
        Math.floor(Math.log(bytes) / Math.log(1024)),
        units.length - 1
    );

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

    if (previewURL) {
        URL.revokeObjectURL(previewURL);
    }

    previewURL = URL.createObjectURL(file);

    previewImage.src = previewURL;

    previewArea.hidden = false;
    resultArea.hidden = true;

});


quality.addEventListener("input", function () {

    qualityValue.textContent = this.value + "%";

});


compressBtn.addEventListener("click", function () {
    console.log("COMPRESS BUTTON CLICKED");
console.log("IMAGE STATE:", previewImage.complete, previewImage.naturalWidth, previewImage.naturalHeight);
    if (!selectedFile) {
        alert("Please choose an image first.");
        return;
    }

    if (!previewImage.complete || !previewImage.naturalWidth) {
        alert("Please wait for the image to finish loading.");
        return;
    }

    compressBtn.disabled = true;
    compressBtn.textContent = "Compressing...";


    const canvas = document.createElement("canvas");

    canvas.width = previewImage.naturalWidth;
    canvas.height = previewImage.naturalHeight;


    const ctx = canvas.getContext("2d");

    if (!ctx) {
        alert("Your browser could not process this image.");

        compressBtn.disabled = false;
        compressBtn.textContent = "Compress Image";

        return;
    }


    ctx.drawImage(
        previewImage,
        0,
        0,
        canvas.width,
        canvas.height
    );
    console.log("CANVAS DRAW DONE", canvas.width, canvas.height);


    /*
       Use JPEG output for JPG images.
       WebP stays WebP.
       PNG stays PNG.
    */

    let outputType = selectedFile.type;

    if (
        outputType !== "image/jpeg" &&
        outputType !== "image/png" &&
        outputType !== "image/webp"
    ) {
        outputType = "image/jpeg";
    }


    const compressionQuality =
        Number(quality.value) / 100;

console.log("STARTING TOBLOB", outputType, compressionQuality);
    canvas.toBlob(

        function (blob) {
            console.log("TOBLOB CALLBACK", blob);

            compressBtn.disabled = false;
            compressBtn.textContent = "Compress Image";


            if (!blob) {

                alert(
                    "Compression failed. Please try another image."
                );

                return;
            }


            // Never return a file larger than the original
let finalBlob;

if (blob.size < selectedFile.size) {

    finalBlob = blob;

    compressedSize.textContent =
        formatBytes(blob.size);

    const difference =
        selectedFile.size - blob.size;

    const savedPercentage =
        (difference / selectedFile.size) * 100;

    reduction.textContent =
        savedPercentage.toFixed(1) + "%";

} else {

    finalBlob = selectedFile;

    compressedSize.textContent =
        formatBytes(selectedFile.size);

    reduction.textContent =
        "No reduction possible at this quality";
}

if (downloadURL) {
    URL.revokeObjectURL(downloadURL);
}

downloadURL =
    URL.createObjectURL(finalBlob);

downloadBtn.href = downloadURL;


            let extension = "jpg";

            if (outputType === "image/png") {
                extension = "png";
            }

            if (outputType === "image/webp") {
                extension = "webp";
            }


            downloadBtn.download =
                "filevora-compressed-image." +
                extension;


            resultArea.hidden = false;
resultArea.removeAttribute("hidden");
resultArea.style.setProperty("display", "block", "important");


            resultArea.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        },

        outputType,

        compressionQuality

    );

});
// Image Compressor - Reset Button
const compressResetBtn =
    document.getElementById("compressResetBtn");

if (compressResetBtn) {
    compressResetBtn.addEventListener("click", function () {
        window.location.reload();
    });
}