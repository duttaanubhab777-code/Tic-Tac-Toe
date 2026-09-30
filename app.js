const $ = s => document.querySelector(s),
    $$ = s => [...document.querySelectorAll(s)];
const W = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
const K = "ttt-v2";
let P = {
    names: ["Player 1", "Player 2"],
    p1: "X",
    series: 3,
    w: [0, 0],
    d: 0,
    live: false,
    mute: false,
    theme: matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark"
};
try {
    Object.assign(P, JSON.parse(localStorage.getItem(K) || "{}"));
} catch (e) {}
const save = () => {
    try {
        localStorage.setItem(K, JSON.stringify(P));
    } catch (e) {}
};
const esc = s =>
    String(s).replace(/[&<>"']/g, c => "&#" + c.charCodeAt(0) + ";");
const sym = i => (i ? (P.p1 === "X" ? "O" : "X") : P.p1);
const played = () => P.w[0] + P.w[1] + P.d;
const mark = s =>
    s === "X"
        ? '<svg class="mk x" viewBox="0 0 100 100"><path pathLength="1" d="M24 24L76 76"/><path pathLength="1" d="M76 24L24 76"/></svg>'
        : '<svg class="mk o" viewBox="0 0 100 100"><circle pathLength="1" cx="50" cy="50" r="27"/></svg>';
let b,
    turn,
    over,
    last = { type: "draw", p: 0 };

/* ---------- sound, vibration, toast, confetti ---------- */
let ac;
const tone = (f, d = 0.12, t = 0) => {
    if (P.mute) return;
    try {
        ac = ac || new (window.AudioContext || webkitAudioContext)();
        const o = ac.createOscillator(),
            g = ac.createGain(),
            n = ac.currentTime + t;
        o.frequency.value = f;
        g.gain.setValueAtTime(0.15, n);
        g.gain.exponentialRampToValueAtTime(0.001, n + d);
        o.connect(g);
        g.connect(ac.destination);
        o.start(n);
        o.stop(n + d);
    } catch (e) {}
};
const vib = ms => navigator.vibrate && navigator.vibrate(ms);
const toast = m => {
    const t = $("#toast");
    t.textContent = m;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2200);
};
const cv = $("#fx"),
    cx = cv.getContext("2d");
let ps = [];
function boom(n = 140) {
    cv.width = innerWidth;
    cv.height = innerHeight;
    for (let i = 0; i < n; i++)
        ps.push({
            x: innerWidth / 2,
            y: innerHeight * 0.4,
            vx: (Math.random() - 0.5) * 16,
            vy: -Math.random() * 15 - 3,
            r: 4 + Math.random() * 5,
            c: `hsl(${Math.random() * 360} 90% 60%)`,
            a: 1
        });
    if (ps.length === n) loop();
}
function loop() {
    cx.clearRect(0, 0, cv.width, cv.height);
    ps = ps.filter(p => p.a > 0);
    ps.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.vx *= 0.99;
        p.a -= 0.008;
        cx.globalAlpha = Math.max(p.a, 0);
        cx.fillStyle = p.c;
        cx.fillRect(p.x, p.y, p.r, p.r * 1.6);
    });
    if (ps.length) requestAnimationFrame(loop);
    else cx.clearRect(0, 0, cv.width, cv.height);
}

/* ---------- theme & sound toggles ---------- */
function setTheme(t) {
    document.documentElement.dataset.theme = P.theme = t;
    $("#theme").textContent = t === "dark" ? "☀️" : "🌙";
    save();
}
$("#theme").onclick = () => setTheme(P.theme === "dark" ? "light" : "dark");
$("#snd").onclick = () => {
    P.mute = !P.mute;
    $("#snd").textContent = P.mute ? "🔇" : "🔊";
    save();
    tone(600);
};
$("#snd").textContent = P.mute ? "🔇" : "🔊";
setTheme(P.theme);

/* ---------- setup screen ---------- */
const show = v => {
    $("#setup").classList.toggle("hide", v !== "setup");
    $("#game").classList.toggle("hide", v !== "game");
};
function pv() {
    const s = $("#sy .on").dataset.v,
        n1 = $("#n1").value.trim() || "Player 1",
        n2 = $("#n2").value.trim() || "Player 2";
    $("#pv").textContent =
        `${n1} plays ${s}, ${n2} plays ${s === "X" ? "O" : "X"}`;
}
function fillSetup() {
    $("#n1").value = P.names[0];
    $("#n2").value = P.names[1];
    $$("#sy button").forEach(x =>
        x.classList.toggle("on", x.dataset.v === P.p1)
    );
    $$("#sr button").forEach(x =>
        x.classList.toggle("on", +x.dataset.v === P.series)
    );
    pv();
}
$$(".seg").forEach(
    g =>
        (g.onclick = e => {
            const B = e.target.closest("button");
            if (!B) return;
            g.querySelectorAll("button").forEach(x =>
                x.classList.toggle("on", x === B)
            );
            pv();
            tone(600, 0.06);
        })
);
["#n1", "#n2"].forEach(s => ($(s).oninput = pv));
$("#start").onclick = () => {
    P.names = [
        $("#n1").value.trim() || "Player 1",
        $("#n2").value.trim() || "Player 2"
    ];
    P.p1 = $("#sy .on").dataset.v;
    P.series = +$("#sr .on").dataset.v;
    P.w = [0, 0];
    P.d = 0;
    P.live = true;
    save();
    tone(660);
    show("game");
    newMatch();
};
$("#st").onclick = () => {
    fillSetup();
    show("setup");
};
$("#rs").onclick = newMatch;

/* ---------- board ---------- */
const bd = $("#bd");
for (let i = 0; i < 9; i++) {
    const c = document.createElement("button");
    c.className = "cell";
    c.style.setProperty("--i", i);
    c.setAttribute("aria-label", "Cell " + (i + 1));
    c.onclick = () => play(i);
    bd.insertBefore(c, $("#wl"));
}
const cells = () => $$(".cell");

function newMatch() {
    b = Array(9).fill(null);
    over = false;
    turn = played() % 2; // first move alternates every match
    bd.classList.remove("new", "shake");
    void bd.offsetWidth;
    bd.classList.add("new");
    cells().forEach(c => {
        c.innerHTML = "";
        c.disabled = false;
        c.classList.remove("win");
    });
    $("#wl").classList.remove("go");
    modal(false);
    score();
    turnUI();
}
function turnUI() {
    const t = $("#turn");
    t.className = "turn";
    void t.offsetWidth;
    t.className = "turn go " + sym(turn).toLowerCase();
    t.innerHTML = mark(sym(turn)) + `<span>${esc(P.names[turn])}'s turn</span>`;
}
function score(pop) {
    const n = played(),
        cur = over ? n : n + 1;
    $("#mn").textContent =
        cur > P.series ? "Tie-breaker match" : `Match ${cur} of ${P.series}`;
    $("#pb").style.width = Math.min(100, (n / P.series) * 100) + "%";
    $("#sc").innerHTML = [0, 1]
        .map(
            i =>
                `<div class="pc ${sym(i).toLowerCase()} ${turn === i && !over ? "on" : ""}"><div class="pn">${mark(sym(i))}<b>${esc(P.names[i])}</b></div><div class="st"><span><em class="${pop ? "pop" : ""}">${P.w[i]}</em>Won</span><span><em class="${pop ? "pop" : ""}">${P.w[1 - i]}</em>Lost</span><span><em class="${pop ? "pop" : ""}">${P.d}</em>Draw</span></div></div>`
        )
        .join("");
}
function play(i) {
    if (over || b[i] !== null) return;
    b[i] = turn;
    const c = cells()[i];
    c.innerHTML = mark(sym(turn));
    c.disabled = true;
    tone(turn ? 520 : 440);
    vib(20);
    const line = W.find(l => l.every(k => b[k] === turn));
    if (line) return end("win", line);
    if (b.every(x => x !== null)) return end("draw");
    turn = 1 - turn;
    score();
    turnUI();
}
function end(type, line) {
    over = true;
    last = { type, p: turn };
    cells().forEach(c => (c.disabled = true));
    const t = $("#turn");
    t.className = "turn go " + sym(turn).toLowerCase();
    if (type === "win") {
        P.w[turn]++;
        line.forEach(k => cells()[k].classList.add("win"));
        const C = [15.67, 50, 84.33],
            [a, z] = [line[0], line[2]];
        let x1 = C[a % 3],
            y1 = C[(a / 3) | 0],
            x2 = C[z % 3],
            y2 = C[(z / 3) | 0];
        const L = Math.hypot(x2 - x1, y2 - y1),
            ux = ((x2 - x1) / L) * 8,
            uy = ((y2 - y1) / L) * 8;
        const ln = $("#wln");
        ln.setAttribute("x1", x1 - ux);
        ln.setAttribute("y1", y1 - uy);
        ln.setAttribute("x2", x2 + ux);
        ln.setAttribute("y2", y2 + uy);
        $("#wl").classList.remove("go");
        void $("#wl").offsetWidth;
        $("#wl").classList.add("go");
        t.innerHTML = `<span>🏆 ${esc(P.names[turn])} wins!</span>`;
        [523, 659, 784, 1047].forEach((f, k) => tone(f, 0.25, k * 0.12));
        vib([40, 40, 80]);
        boom();
    } else {
        P.d++;
        t.className = "turn go";
        t.innerHTML = "<span>🤝 It's a draw</span>";
        bd.classList.remove("shake");
        void bd.offsetWidth;
        bd.classList.add("shake");
        tone(330, 0.25);
        tone(262, 0.35, 0.2);
    }
    save();
    score(true);
    setTimeout(() => modal(true), type === "win" ? 1400 : 900);
}

/* ---------- result modal & share ---------- */
function verdict() {
    const [x, y] = P.w,
        n = played();
    if (n < P.series) return `Match ${n} of ${P.series} played`;
    return x === y
        ? "Series tied"
        : `🏆 ${P.names[x > y ? 0 : 1]} won the series`;
}
function shareText() {
    return `🎮 Tic-Tac-Toe · ${P.series}-match series\n${P.names[0]} ${P.w[0]} – ${P.w[1]} ${P.names[1]}${P.d ? ` (${P.d} draw${P.d > 1 ? "s" : ""})` : ""}\n${verdict()}`;
}
async function share() {
    const text = shareText();
    try {
        if (navigator.share) {
            await navigator.share({ text });
            return;
        }
    } catch (e) {
        if (e.name === "AbortError") return;
    }
    try {
        await navigator.clipboard.writeText(text);
        toast("Score copied!");
    } catch (e) {
        toast("Could not copy score");
    }
}
function modal(on) {
    const m = $("#modal");
    if (!on) {
        m.classList.add("hide");
        return;
    }
    const [x, y] = P.w,
        n = played(),
        done = n >= P.series,
        tie = done && x === y;
    let ic,
        tt,
        bt = "";
    const shareBtn =
        '<button class="btn ghost" data-a="share">Share score</button>';
    if (!done) {
        ic = last.type === "win" ? "🎉" : "🤝";
        tt =
            last.type === "win"
                ? `${P.names[last.p]} wins match ${n}!`
                : `Match ${n} is a draw`;
        bt = '<button class="btn" data-a="next">Next match</button>';
    } else if (tie) {
        ic = "⚖️";
        tt = "The series is tied!";
        bt =
            '<button class="btn" data-a="next">Play tie-breaker</button>' +
            shareBtn;
    } else {
        ic = "🏆";
        tt = `${P.names[x > y ? 0 : 1]} wins the series!`;
        bt =
            shareBtn +
            '<button class="btn" data-a="again">Play again</button><button class="btn ghost" data-a="setup">Change players</button>';
        boom(260);
        [523, 659, 784, 1047, 1319].forEach((f, k) => tone(f, 0.3, k * 0.13));
    }
    $("#mi").textContent = ic;
    $("#mt").innerHTML = esc(tt);
    $("#ms").innerHTML =
        `${esc(P.names[0])} <b>${x}</b> – <b>${y}</b> ${esc(P.names[1])}${P.d ? ` (${P.d} draw${P.d > 1 ? "s" : ""})` : ""}`;
    $("#mb").innerHTML = bt;
    m.classList.remove("hide");
}
$("#mb").onclick = e => {
    const a = e.target.dataset.a;
    if (!a) return;
    if (a === "next") newMatch();
    else if (a === "share") share();
    else if (a === "again") {
        P.w = [0, 0];
        P.d = 0;
        save();
        newMatch();
    } else if (a === "setup") {
        modal(false);
        fillSetup();
        show("setup");
    }
};

/* ---------- boot ---------- */
fillSetup();
if (P.live) {
    show("game");
    newMatch();
    if (played() >= P.series) setTimeout(() => modal(true), 500);
}
