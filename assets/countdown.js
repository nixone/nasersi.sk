(function () {
    const el = document.getElementById("countdown");
    if (!el) return;

    // Change the date in index.html (data-target) once the next VulkanLAN is announced.
    const target = new Date(el.dataset.target).getTime();
    const parts = ["days", "hours", "minutes", "seconds"].map(id => document.getElementById("cd-" + id));
    const pad = n => String(n).padStart(2, "0");

    function tick() {
        const diff = target - Date.now();
        if (diff <= 0) {
            el.querySelector(".countdown-title").innerHTML = 'VulkanLAN is here! <a href="https://event.vulkanlan.at/">GLHF</a>';
            el.querySelector(".countdown-units").style.display = "none";
            clearInterval(timer);
            return;
        }
        const s = Math.floor(diff / 1000);
        const values = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
        values.forEach((v, i) => parts[i].textContent = i === 0 ? v : pad(v));
    }

    const timer = setInterval(tick, 1000);
    tick();
})();
