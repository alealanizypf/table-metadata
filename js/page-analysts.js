function toggleDiv(buttonId, divId) {
    var btn = document.getElementById(buttonId);
    var div = document.getElementById(divId);
    
    if (div.classList.contains("hidden")) {
        div.classList.remove("hidden");
        div.classList.add("visible");
        btn.setAttribute("aria-expanded", "true");
    } else {
        div.classList.remove("visible");
        div.classList.add("hidden");
        btn.setAttribute("aria-expanded", "false");
    }
}