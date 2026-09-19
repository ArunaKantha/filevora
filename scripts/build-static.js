const fs = require("node:fs");
const path = require("node:path");
const ejs = require("ejs");

const root = path.join(__dirname, "..");
const viewsDir = path.join(root, "views");
const publicDir = path.join(root, "public");
const outputDir = path.join(root, "dist");
const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
const adTag = '<script src="https://quge5.com/88/tag.min.js" data-zone="280972" async data-cfasync="false"></script>';
const siteUrl = "https://filevora-olive.vercel.app";

function routeForView(view) {
    if (view === "index") return "/";
    if (appSource.includes(`app.get("/tools/${view}"`)) return `/tools/${view}`;
    if (appSource.includes(`app.get("/${view}"`)) return `/${view}`;
    return null;
}

function outputPath(route) {
    return route === "/"
        ? path.join(outputDir, "index.html")
        : path.join(outputDir, route.slice(1), "index.html");
}

async function main() {
    fs.rmSync(outputDir, { recursive: true, force: true });
    fs.mkdirSync(outputDir, { recursive: true });
    fs.cpSync(publicDir, outputDir, { recursive: true });

    const vendorCopies = [
        ["@pdfsmaller/pdf-encrypt/dist", "vendor/pdf-encrypt"],
        ["@pdfsmaller/pdf-decrypt/dist", "vendor/pdf-decrypt"]
    ];

    for (const [source, destination] of vendorCopies) {
        const sourceDir = path.join(root, "node_modules", source);
        if (fs.existsSync(sourceDir)) {
            fs.cpSync(sourceDir, path.join(outputDir, destination), { recursive: true });
        }
    }

    const views = fs.readdirSync(viewsDir)
        .filter((file) => file.endsWith(".ejs"))
        .filter((file) => !file.includes(".backup"));

    let rendered = 0;

    for (const file of views) {
        const view = path.basename(file, ".ejs");
        const route = routeForView(view);
        if (!route) continue;

        let html = await ejs.renderFile(path.join(viewsDir, file), {});
        const canonicalTag = `<link rel="canonical" href="${siteUrl}${route}">`;
        if (html.includes("</head>") && !html.includes('rel="canonical"')) {
            html = html.replace("</head>", `${canonicalTag}\n</head>`);
        }
        if (html.includes("</head>") && !html.includes("quge5.com/88/tag.min.js")) {
            html = html.replace("</head>", `${adTag}\n</head>`);
        }

        const destination = outputPath(route);
        fs.mkdirSync(path.dirname(destination), { recursive: true });
        fs.writeFileSync(destination, html);
        rendered += 1;
    }

    const notFound = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | FileVora</title><link rel="stylesheet" href="/css/style.css"><main class="container" style="padding:6rem 1.25rem;text-align:center"><h1>Page not found</h1><p>The page you requested does not exist.</p><a href="/">Return to FileVora</a></main></html>`;
    fs.writeFileSync(path.join(outputDir, "404.html"), notFound);

    console.log(`Built ${rendered} FileVora pages in ${outputDir}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
