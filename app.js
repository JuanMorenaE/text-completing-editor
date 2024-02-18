var variables = [];

window.addEventListener("load", () => {
    const text = document.getElementById("main-text");
    const textInput = document.getElementById("text");
    const copyButton = document.getElementById("copyButton");
    text.addEventListener("input", () => {
        variables = getTextVariables(text.value);
        createInputs();
        inputsHandler();
        updateText(text.value);
    });

    textInput.addEventListener("click", copyText);
    copyButton.addEventListener("click", copyText);
});

function getTextVariables(text) {
    let pattern = /\[(.*?)\]/g;
    let matches = [];
    let match;

    while ((match = pattern.exec(text)) !== null) {
        var word = match[1];
        var firstIndex = match.index;
        var lastIndex = firstIndex + word.length + 2;

        matches.push({word: word, firstIndex: firstIndex, lastIndex: lastIndex});
    }
    return matches;
}

function createInputs() {
    const inputsContainer = document.getElementById("inputsContainer");
    const container = document.getElementById("input-wrapper");
    const fragment = document.createDocumentFragment();

    let variableNames = [];

    variables.forEach((variable) => {
        if (!variableNames.includes(variable.word)) variableNames.push(variable.word);
    });

    variableNames.forEach((name) => {
        let input = document.createElement("input");
        input.placeholder = name;
        input.setAttribute("data-variable", name);
        input.classList.add("variableInput");

        fragment.appendChild(input);
    });

    if (variableNames.length > 0) {
        inputsContainer.style.opacity = 1;
    } else {
        inputsContainer.style.opacity = 0;
    }

    container.innerHTML = "";
    container.appendChild(fragment);
}

function inputsHandler() {
    const inputs = document.querySelectorAll(".variableInput");
    inputs.forEach((input) => {
        input.addEventListener("input", () => {
            updateText();
        });
    });
}

function updateText() {
    let text = document.getElementById("main-text").value;

    const textContainer = document.getElementById("textContainer");
    const copyButton = document.getElementById("copyButton");

    const textInput = document.getElementById("text");
    const inputs = document.querySelectorAll(".variableInput");

    inputs.forEach((input) => {
        let variable = "[" + input.getAttribute("data-variable") + "]";
        let value = input.value;

        if (value !== "") text = text.replaceAll(variable, value);
    });

    if (text.trim() !== "") {
        textContainer.style.opacity = 1;
        copyButton.style.opacity = 1;
        textInput.innerText = text;
    } else {
        textContainer.style.opacity = 0;
        copyButton.style.opacity = 0;
    }
}

async function copyText() {
    let text = document.getElementById("text").innerText;

    try {
        await navigator.clipboard.writeText(text);
        console.log("Content copied to clipboard");
    } catch (err) {
        console.error("Failed to copy: ", err);
    }
}
