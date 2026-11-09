(function () {
    const root = document.getElementById("countdown");
    if (!root) return;

    // Change the date in index.html (data-target) once the next VulkanLAN is announced.
    const target = new Date(root.dataset.target);
    const $ = id => document.getElementById(id);
    const NS = "http://www.w3.org/2000/svg";
    const C = 500, R = 400, LABEL_R = 450, MONTH_R = 365;
    const rad = Math.PI / 180;
    const mod = (a, n) => ((a % n) + n) % n;
    const pad = n => String(n).padStart(2, "0");

    // Earth's heliocentric ecliptic longitude in degrees (low-precision solar formula, ~0.01° accuracy).
    function longitude(date) {
        const d = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 86400000;
        const L = 280.460 + 0.9856474 * d;
        const g = (357.528 + 0.9856003 * d) * rad;
        return mod(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g) + 180, 360);
    }

    // 0° (vernal equinox direction) points right, motion is counter-clockwise (viewed from ecliptic north).
    const point = (lon, r) => [C + r * Math.cos(lon * rad), C - r * Math.sin(lon * rad)];

    function place(group, lon) {
        const [x, y] = point(lon, R);
        const [lx, ly] = point(lon, LABEL_R);
        group.querySelectorAll("circle").forEach(c => { c.setAttribute("cx", x); c.setAttribute("cy", y); });
        const t = group.querySelector("text");
        t.setAttribute("x", lx);
        t.setAttribute("y", ly);
    }

    // Month ticks for the year around now.
    const year = new Date().getFullYear();
    const months = $("orbit-months");
    for (let m = 0; m < 12; m++) {
        const lon = longitude(new Date(year, m, 1));
        const [x1, y1] = point(lon, R - 10), [x2, y2] = point(lon, R + 10), [tx, ty] = point(lon, MONTH_R);
        const g = document.createElementNS(NS, "g");
        g.setAttribute("class", "orbit-month");
        g.innerHTML = `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" /><text x="${tx}" y="${ty}">${
            new Date(year, m, 1).toLocaleString("en", { month: "short" }).toUpperCase()}</text>`;
        months.appendChild(g);
    }

    const targetLon = longitude(target);
    place($("orbit-target"), targetLon);

    const units = ["days", "hours", "minutes", "seconds"].map(id => $("cd-" + id));

    function tick() {
        const now = new Date();
        const nowLon = longitude(now);
        place($("orbit-earth"), nowLon);

        const diff = target - now;
        if (diff <= 0) {
            $("cd-title").innerHTML = 'VulkanLAN is here! <a href="https://event.vulkanlan.at/">GLHF</a>';
            $("cd-units").style.display = "none";
            $("orbit-target").style.display = "none";
            $("orbit-remaining").removeAttribute("d");
            return;
        }

        // Dashed arc along the path Earth still has to travel.
        const sweep = mod(targetLon - nowLon, 360);
        const [sx, sy] = point(nowLon, R), [ex, ey] = point(targetLon, R);
        $("orbit-remaining").setAttribute("d",
            `M ${sx} ${sy} A ${R} ${R} 0 ${sweep > 180 ? 1 : 0} 0 ${ex} ${ey}`);

        const s = Math.floor(diff / 1000);
        const values = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
        values.forEach((v, i) => units[i].textContent = i === 0 ? v : pad(v));
    }

    setInterval(tick, 1000);
    tick();
})();
