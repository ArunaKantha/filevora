const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ejs = require("ejs");

const ROOT = path.join(__dirname, "..");

class FakeElement {
    constructor(id = "") {
        this.id = id;
        this.value = "";
        this.textContent = "";
        this.innerHTML = "";
        this.style = {};
        this.dataset = {};
        this.disabled = false;
        this.href = "";
        this.download = "";
        this.files = [];
        this.children = [];
        this.listeners = new Map();
        const classes = new Set();
        this.classList = {
            add: (...names) => names.forEach((name) => classes.add(name)),
            remove: (...names) => names.forEach((name) => classes.delete(name)),
            contains: (name) => classes.has(name),
            toggle: (name, force) => {
                if (force === true) {
                    classes.add(name);
                    return true;
                }
                if (force === false) {
                    classes.delete(name);
                    return false;
                }
                if (classes.has(name)) {
                    classes.delete(name);
                    return false;
                }
                classes.add(name);
                return true;
            }
        };
    }

    addEventListener(type, listener) {
        if (!this.listeners.has(type)) this.listeners.set(type, []);
        this.listeners.get(type).push(listener);
    }

    async dispatch(type, event = {}) {
        event.target ||= this;
        event.preventDefault ||= () => {};
        for (const listener of this.listeners.get(type) || []) {
            await listener.call(this, event);
        }
    }

    appendChild(child) {
        this.children.push(child);
        return child;
    }

    remove() {}
    focus() {}
    select() {}
    scrollIntoView() {}
    click() {}
    setAttribute(name, value) { this[name] = value; }
    getAttribute(name) { return this[name] ?? null; }
    querySelector() { return null; }
    querySelectorAll() { return []; }
}

function createHarness(overrides = {}) {
    const elements = new Map();
    const documentListeners = new Map();
    const clipboard = { value: "" };
    const alerts = [];

    const getElement = (id) => {
        if (!elements.has(id)) elements.set(id, new FakeElement(id));
        return elements.get(id);
    };

    const document = {
        body: new FakeElement("body"),
        getElementById: getElement,
        createElement: () => new FakeElement(),
        querySelector: overrides.querySelector || (() => null),
        querySelectorAll: overrides.querySelectorAll || (() => []),
        execCommand: () => true,
        addEventListener(type, listener) {
            if (!documentListeners.has(type)) documentListeners.set(type, []);
            documentListeners.get(type).push(listener);
        }
    };

    class SpeechRecognitionMock {
        constructor() {
            this.continuous = false;
            this.interimResults = false;
            this.lang = "en-US";
        }
        start() { if (this.onstart) this.onstart(); }
        stop() { if (this.onend) this.onend(); }
    }

    class SpeechSynthesisUtteranceMock {
        constructor(text) {
            this.text = text;
        }
    }

    const speechSynthesis = {
        spoken: null,
        cancelled: false,
        getVoices: () => [{ name: "Test Voice", lang: "en-US" }],
        addEventListener: () => {},
        speak(utterance) {
            this.spoken = utterance;
            if (utterance.onstart) utterance.onstart();
        },
        cancel() { this.cancelled = true; }
    };

    const window = {
        document,
        SpeechRecognition: SpeechRecognitionMock,
        webkitSpeechRecognition: SpeechRecognitionMock,
        SpeechSynthesisUtterance: SpeechSynthesisUtteranceMock,
        speechSynthesis,
        addEventListener: () => {},
        location: { href: "http://localhost/" }
    };

    const context = vm.createContext({
        window,
        document,
        speechSynthesis,
        navigator: {
            clipboard: {
                async writeText(value) { clipboard.value = String(value); }
            }
        },
        SpeechSynthesisUtterance: SpeechSynthesisUtteranceMock,
        FileReader: class {
            readAsText() { if (this.onload) this.onload({ target: { result: "" } }); }
        },
        Blob,
        URL: {
            createObjectURL: () => "blob:test",
            revokeObjectURL: () => {}
        },
        alert: (message) => alerts.push(String(message)),
        console,
        setTimeout: (fn) => { fn(); return 1; },
        clearTimeout: () => {},
        structuredClone,
        Math,
        Date,
        Intl,
        Number,
        String,
        Array,
        Object,
        RegExp,
        JSON,
        Error,
        Promise
    });

    return { context, getElement, clipboard, alerts, speechSynthesis };
}

async function loadTool(name) {
    const file = path.join(ROOT, "views", `${name}.ejs`);
    const html = await ejs.renderFile(file, {});
    const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
        .map((match) => match[1])
        .filter((script) => script.trim());
    const harness = createHarness();

    for (const script of scripts) {
        new vm.Script(script, { filename: `${name}.ejs` }).runInContext(harness.context);
    }

    return harness;
}

async function loadHomeSearch() {
    const calculatorHeading = new FakeElement();
    calculatorHeading.textContent = "Calculators & Utilities Useful tools for everyday calculations";

    const percentageTool = new FakeElement();
    percentageTool.textContent = "Percentage Calculator Calculate percentages";
    percentageTool.href = "/tools/percentage-calculator";

    const tipTool = new FakeElement();
    tipTool.textContent = "Tip Calculator Calculate tips";
    tipTool.href = "/tools/tip-calculator";

    const calculatorCategory = new FakeElement("calculator-tools");
    calculatorCategory.querySelector = (selector) => selector === ".fv-category-title" ? calculatorHeading : null;
    calculatorCategory.querySelectorAll = (selector) => selector === ".fv-tool" ? [percentageTool, tipTool] : [];

    const imageHeading = new FakeElement();
    imageHeading.textContent = "Image Tools Compress, convert, resize and edit images";

    const imageTool = new FakeElement();
    imageTool.textContent = "Image Compressor Reduce image size";
    imageTool.href = "/tools/image-compressor";

    const imageCategory = new FakeElement("image-tools");
    imageCategory.querySelector = (selector) => selector === ".fv-category-title" ? imageHeading : null;
    imageCategory.querySelectorAll = (selector) => selector === ".fv-tool" ? [imageTool] : [];

    const categories = [calculatorCategory, imageCategory];
    const harness = createHarness({
        querySelectorAll: (selector) => selector === ".fv-category" ? categories : []
    });

    const html = await ejs.renderFile(path.join(ROOT, "views", "index.ejs"), {});
    const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
        .map((match) => match[1])
        .filter((script) => script.trim());

    for (const script of scripts) {
        new vm.Script(script, { filename: "index.ejs" }).runInContext(harness.context);
    }

    return { harness, calculatorCategory, imageCategory, percentageTool, tipTool, imageTool };
}

async function click(harness, id) {
    await harness.getElement(id).dispatch("click");
}

async function run() {
    let h;

    const home = await loadHomeSearch();
    home.harness.getElement("toolSearch").value = "Calculators & Utilities";
    await home.harness.getElement("toolSearch").dispatch("input");
    assert.equal(home.calculatorCategory.classList.contains("hidden"), false);
    assert.equal(home.percentageTool.classList.contains("hidden"), false);
    assert.equal(home.tipTool.classList.contains("hidden"), false);
    assert.equal(home.imageCategory.classList.contains("hidden"), true);
    assert.equal(home.harness.getElement("noResults").style.display, "none");

    h = await loadTool("color-palette-generator");
    assert.equal(h.getElement("palette").children.length, 5);
    assert.match(h.getElement("colorCodes").innerHTML, /#[0-9A-F]{6}/);

    h = await loadTool("text-to-speech");
    h.getElement("textInput").value = "FileVora works";
    await click(h, "speakBtn");
    assert.equal(h.speechSynthesis.spoken.text, "FileVora works");

    h = await loadTool("speech-to-text");
    await click(h, "startBtn");
    assert.match(h.getElement("status").textContent, /^Listening/);
    await click(h, "stopBtn");
    assert.match(h.getElement("status").textContent, /^Ready/);

    h = await loadTool("roman-numeral-converter");
    h.getElement("mode").value = "numberToRoman";
    h.getElement("inputValue").value = "2026";
    await click(h, "convertBtn");
    assert.match(h.getElement("resultText").innerHTML, /MMXXVI/);

    h = await loadTool("number-to-words");
    h.getElement("numberInput").value = "1250";
    await click(h, "convertBtn");
    assert.match(h.getElement("resultText").innerHTML, /One Thousand Two Hundred Fifty/);

    h = await loadTool("scientific-calculator");
    h.context.addFunction("sin");
    h.context.addValue("30)");
    h.context.calculate();
    assert.equal(h.getElement("calcDisplay").value, "0.5");
    h.context.clearDisplay();
    h.context.addValue("π");
    h.context.calculate();
    assert.match(h.getElement("calcDisplay").value, /^3\.14159/);

    h = await loadTool("fraction-calculator");
    h.getElement("fraction1").value = "1/2";
    h.getElement("fraction2").value = "1/4";
    h.getElement("operation").value = "+";
    await click(h, "calculateFractionBtn");
    assert.equal(h.getElement("resultFraction").textContent, "3/4");

    h = await loadTool("average-median-mode");
    h.getElement("numbersInput").value = "10, 20, 20, 30, 40";
    await click(h, "calculateStatisticsBtn");
    assert.equal(h.getElement("meanResult").textContent, "24");
    assert.equal(h.getElement("medianResult").textContent, "20");
    assert.equal(h.getElement("modeResult").textContent, "20");

    h = await loadTool("tip-calculator");
    h.getElement("billAmount").value = "100";
    h.getElement("tipPercent").value = "15";
    h.getElement("people").value = "2";
    await click(h, "calculateTipBtn");
    assert.match(h.getElement("tipResultValue").textContent, /15\.00/);
    assert.match(h.getElement("totalPerPerson").textContent, /57\.50/);

    h = await loadTool("json-to-csv");
    h.getElement("jsonInput").value = JSON.stringify([{ name: "Aruna", score: 10 }]);
    await click(h, "convertBtn");
    assert.match(h.getElement("csvOutput").value, /name,score/);
    assert.match(h.getElement("csvOutput").value, /Aruna,10/);

    h = await loadTool("csv-to-json");
    h.getElement("csvInput").value = "name,score\nAruna,10";
    await click(h, "convertBtn");
    assert.deepEqual(JSON.parse(h.getElement("jsonOutput").value), [{ name: "Aruna", score: "10" }]);

    h = await loadTool("html-formatter");
    h.getElement("htmlInput").value = "<main><h1>FileVora</h1><p>Tools</p></main>";
    await click(h, "formatBtn");
    assert.match(h.getElement("output").value, /\n\s+<h1>/);

    h = await loadTool("css-formatter");
    h.getElement("cssInput").value = "body{color:red;margin:0;}";
    await click(h, "formatBtn");
    assert.match(h.getElement("output").value, /body\s*\{/);
    assert.match(h.getElement("output").value, /color:\s*red;/);

    h = await loadTool("javascript-formatter");
    h.getElement("jsInput").value = "function test(){const value=1;return value;}";
    await click(h, "formatBtn");
    assert.match(h.getElement("output").value, /function test\(\) \{/);
    assert.match(h.getElement("output").value, /return value;/);

    h = await loadTool("json-minifier");
    h.getElement("jsonInput").value = '{ "name": "FileVora", "active": true }';
    await click(h, "minifyBtn");
    assert.equal(h.getElement("output").value, '{"name":"FileVora","active":true}');

    const appSource = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
    assert.doesNotMatch(appSource, /\/tools\/color-converter/);
    assert.equal(fs.existsSync(path.join(ROOT, "views", "color-converter.ejs")), false);

    const homeSource = fs.readFileSync(path.join(ROOT, "views", "index.ejs"), "utf8");
    assert.match(homeSource, /const categoryMatch = words\.length > 0/);
    assert.match(homeSource, /categoryMatch \|\| words\.every/);

    console.log("Validated 15 tools after Timestamp Converter; Color Converter remains removed.");
}

run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
