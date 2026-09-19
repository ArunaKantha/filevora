(function () {
    const tools = window.fileVoraTools || [];

    const toolsBtn = document.getElementById("globalToolsBtn");
    const categoriesBtn = document.getElementById("globalCategoriesBtn");
    const toolPanel = document.getElementById("globalToolPanel");
    const categoryPanel = document.getElementById("globalCategoryPanel");
    const searchInput = document.getElementById("globalToolSearch");
    const resultsBox = document.getElementById("globalToolResults");
    const categoryBox = document.getElementById("categoryToolsBox");
    const categoryTitle = document.getElementById("categoryToolsTitle");
    const categoryGrid = document.getElementById("categoryToolsGrid");

    if (
        !toolsBtn ||
        !categoriesBtn ||
        !toolPanel ||
        !categoryPanel ||
        !searchInput ||
        !resultsBox ||
        !categoryBox ||
        !categoryTitle ||
        !categoryGrid
    ) {
        return;
    }

    function normalize(value) {
        return String(value || "")
            .toLowerCase()
            .replace(/→|⇒|➜|➡|->/g, " to ")
            .replace(/[\/\\|_–—-]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function wordMatches(text, word) {
        if (text.includes(word)) {
            return true;
        }

        if (word.endsWith("y")) {
            return text.includes(word.slice(0, -1) + "ies");
        }

        if (word.endsWith("ies")) {
            return text.includes(word.slice(0, -3) + "y");
        }

        return false;
    }

    function createToolLink(tool, showCategory) {
        const link = document.createElement("a");
        link.href = tool.url;
        link.className = "global-tool-item";

        if (showCategory) {
            link.innerHTML =
                tool.name +
                "<small>" +
                tool.category +
                "</small>";
        } else {
            link.textContent = tool.name;
        }

        return link;
    }

    function renderSearch() {
        const query = normalize(searchInput.value);
        const words = query.split(" ").filter(Boolean);

        let matches;

        if (!words.length) {
            matches = tools.slice(0, 18);
        } else {
            matches = tools.filter(function (tool) {
                const text = normalize(
                    tool.name + " " + tool.category + " " + tool.url
                );

                return words.every(function (word) {
                    return wordMatches(text, word);
                });
            });
        }

        resultsBox.innerHTML = "";

        if (!matches.length) {
            resultsBox.innerHTML =
                '<div class="global-empty">No tools found.</div>';
            return;
        }

        matches.forEach(function (tool) {
            resultsBox.appendChild(
                createToolLink(tool, true)
            );
        });
    }

    toolsBtn.addEventListener("click", function () {
        const opening = !toolPanel.classList.contains("show");

        categoryPanel.classList.remove("show");
        categoryBox.classList.remove("show");

        toolPanel.classList.toggle("show", opening);

        if (opening) {
            renderSearch();

            setTimeout(function () {
                searchInput.focus();
            }, 100);
        }
    });

    searchInput.addEventListener("input", renderSearch);

    categoriesBtn.addEventListener("click", function () {
        const opening = !categoryPanel.classList.contains("show");

        toolPanel.classList.remove("show");
        categoryPanel.classList.toggle("show", opening);

        if (!opening) {
            categoryBox.classList.remove("show");
        }
    });

    document
        .querySelectorAll(".global-category-btn")
        .forEach(function (button) {
            button.addEventListener("click", function () {
                const category = button.dataset.category;

                const matches = tools.filter(function (tool) {
                    return tool.category === category;
                });

                categoryTitle.textContent = category;
                categoryGrid.innerHTML = "";

                if (!matches.length) {
                    categoryGrid.innerHTML =
                        '<div class="global-empty">No tools available yet.</div>';
                } else {
                    matches.forEach(function (tool) {
                        categoryGrid.appendChild(
                            createToolLink(tool, false)
                        );
                    });
                }

                categoryBox.classList.add("show");
            });
        });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            toolPanel.classList.remove("show");
            categoryPanel.classList.remove("show");
            categoryBox.classList.remove("show");
        }
    });
})();
