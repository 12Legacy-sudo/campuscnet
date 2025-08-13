/* CampusCNet — Minimal Futuristic Prototype
   All modifiable values use `let` so it’s open to users/developers. */

/* ===== Config (editable) ===== */
let theme = "dark";                   // "dark" | "light"
let activeZone = "home";              // "home" | "socialFun" | "businessOpen" | "explore" | "personal"
let searchEngine = "campus";          // "campus" | "google" | "bing"
let enableAnimations = true;

/* Demo data WITHOUT people names/images — clean & empty-friendly */
let socialModules = [
  { title:"Clubs & Groups", body:"Create hubs for interests, labs, and communities.", c1:"Create", c2:"Browse" },
  { title:"Realtime Chat", body:"Rooms for study, events, and quick meetups.", c1:"Open", c2:"Start" },
  { title:"Shorts & Posts", body:"Vertical shorts + long-form posts in one feed.", c1:"Post", c2:"Draft" },
];
let businessModules = [
  { title:"Opportunities Board", body:"Internships, grants, research roles, startups.", c1:"Create profile", c2:"Explore" },
  { title:"Open Source", body:"Find projects, contribute, and build plugins.", c1:"New repo", c2:"Gallery" },
  { title:"Trust & Verify", body:"Earn verified status via institution email.", c1:"Verify", c2:"Governance" },
];
let exploreModules = [
  { title:"Smart Search", body:"Find people, projects, datasets, and papers.", c1:"Try it", c2:"Filters" },
  { title:"Maps & Events", body:"Conferences, meetups, and innovation hubs.", c1:"Map", c2:"Calendar" },
  { title:"Random Find", body:"A serendipity button for discovery.", c1:"Surprise me", c2:"Collections" },
];

/* ===== Boot ===== */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initTopBar();
  initTabs();
  initHeroJumps();
  initCmdPalette();
  renderZone(activeZone);
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ===== Theme ===== */
function initTheme(){
  applyTheme(theme);
  document.getElementById("themeBtn").addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme(theme);
  });
}
function applyTheme(mode){
  let root = document.documentElement;
  if(mode === "light"){ root.classList.add("light"); } else { root.classList.remove("light"); }
}

/* ===== Top Bar: Search + Login ===== */
function initTopBar(){
  let omniForm = document.getElementById("omniboxForm");
  let omni = document.getElementById("omnibox");
  omniForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let q = omni.value.trim();
    if(!q) return;
    runSearch(q);
  });

  document.getElementById("loginBtn").addEventListener("click",(e)=>{
    e.preventDefault();
    // Placeholder login behavior (no user names/images)
    alert("Login portal coming soon.");
  });
}

function runSearch(q){
  if(searchEngine === "google"){ window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`,"_blank"); return; }
  if(searchEngine === "bing"){ window.open(`https://www.bing.com/search?q=${encodeURIComponent(q)}`,"_blank"); return; }
  // Internal demo search — render simple results card
  activeZone = "explore";
  highlightActiveTab();
  const content = document.getElementById("content");
  content.style.opacity = 0;
  content.innerHTML = `
    <div class="card" style="grid-column: span 12;">
      <div class="meta"><b>Search</b><span style="margin-left:auto; color:var(--muted)">CampusCNet results</span></div>
      <div class="row">Query: “${escapeHTML(q)}”</div>
      <div class="row"><button class="btn">People</button><button class="btn">Projects</button><button class="btn">Papers</button><button class="btn">Jobs</button></div>
    </div>
  `;
  fadeIn(content);
}

/* ===== Tabs ===== */
function initTabs(){
  document.querySelectorAll(".tab").forEach(a=>{
    a.addEventListener("click",(e)=>{
      e.preventDefault();
      let z = a.getAttribute("data-zone");
      if(z){ activeZone = z; renderZone(activeZone); highlightActiveTab(); }
    });
  });
  highlightActiveTab();
}
function highlightActiveTab(){
  document.querySelectorAll(".tab").forEach(a=>a.classList.remove("active"));
  let current = document.querySelector(`.tab[data-zone="${activeZone}"]`);
  current && current.classList.add("active");
}

/* ===== Hero chips → jump to zones ===== */
function initHeroJumps(){
  document.querySelectorAll(".chip[data-jump]").forEach(c=>{
    c.addEventListener("click",()=>{
      activeZone = c.getAttribute("data-jump");
      renderZone(activeZone);
      highlightActiveTab();
      window.scrollTo({ top: document.querySelector(".tabs").offsetTop, behavior: "smooth" });
    });
  });
}

/* ===== Render Zones ===== */
function renderZone(zone){
  const content = document.getElementById("content");
  if(enableAnimations) content.style.opacity = 0;

  if(zone === "home"){
    content.innerHTML = `
      ${renderSection("Start Here", [
        { title:"Create your space", body:"Set preferences, theme, and layout for a personal touch.", c1:"Open settings", c2:"Customize" },
        { title:"Connect & Share", body:"Form groups, plan events, and post updates.", c1:"Create", c2:"Browse" },
        { title:"Explore opportunities", body:"Find internships, grants, projects, and partners.", c1:"Discover", c2:"Track" },
      ])}
    `;
  }
  else if(zone === "socialFun"){
    content.innerHTML = renderSection("Social + Fun", socialModules);
  }
  else if(zone === "businessOpen"){
    content.innerHTML = renderSection("Business + Open Source", businessModules);
  }
  else if(zone === "explore"){
    content.innerHTML = renderSection("Exploration & Findings", exploreModules) + `
      <div class="card" style="grid-column: span 12;">
        <div class="meta"><b>Quick Search</b><span style="margin-left:auto; color:var(--muted)">Try the omnibox ↑</span></div>
        <div class="row">
          <form id="quickForm" style="display:flex; gap:8px; width:100%;">
            <input id="quickInput" type="search" placeholder="Search papers, datasets, tools…" style="flex:1; padding:10px 14px; border-radius:9999px; border:1px solid rgba(255,255,255,0.25); background:rgba(255,255,255,0.06); color:var(--text); outline:none;">
            <button class="btn primary" type="submit">Search</button>
          </form>
        </div>
      </div>
    `;
    // hook quick search
    const quickForm = document.getElementById("quickForm");
    if(quickForm){
      quickForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        let v = document.getElementById("quickInput").value.trim();
        if(v) runSearch(v);
      });
    }
  }
  else if(zone === "personal"){
    content.innerHTML = `
      ${renderSection("Personal Space", [
        { title:"Workspace", body:"Your drafts, saved items, and tasks live here.", c1:"Open", c2:"Organize" },
        { title:"Collections", body:"Pin posts, projects, and notes.", c1:"New collection", c2:"View all" },
        { title:"Preferences", body:"Theme, density, animations, notifications.", c1:"Theme", c2:"Settings" },
      ])}
    `;
  }

  fadeIn(content);
}

/* Card grid section renderer */
function renderSection(title, items){
  let html = `
    <div class="card" style="grid-column: span 12;">
      <div class="meta"><b>${escapeHTML(title)}</b><span style="margin-left:auto; color:var(--muted)">Modular • Future-ready</span></div>
      <div class="row"><button class="btn primary">Quick Start</button><button class="btn">Docs</button></div>
    </div>
  `;
  items.forEach(it=>{
    html += `
      <div class="card">
        <div class="meta"><b>${escapeHTML(it.title)}</b></div>
        <div class="title">${escapeHTML(it.title)}</div>
        <div class="body">${escapeHTML(it.body)}</div>
        <div class="row"><button class="btn primary">${escapeHTML(it.c1)}</button><button class="btn">${escapeHTML(it.c2)}</button></div>
      </div>
    `;
  });
  return html;
}

/* ===== Command Palette (Ctrl/⌘K) ===== */
function initCmdPalette(){
  let palette = document.getElementById("cmdPalette");
  let input = document.getElementById("cmdInput");
  let list = document.getElementById("cmdResults");
  let btn = document.getElementById("cmdBtn");
  let commands = [
    { label:"Go: Home", run:()=>{ activeZone="home"; renderZone(activeZone); highlightActiveTab(); } },
    { label:"Go: Social + Fun", run:()=>{ activeZone="socialFun"; renderZone(activeZone); highlightActiveTab(); } },
    { label:"Go: Business + Open Source", run:()=>{ activeZone="businessOpen"; renderZone(activeZone); highlightActiveTab(); } },
    { label:"Go: Exploration & Findings", run:()=>{ activeZone="explore"; renderZone(activeZone); highlightActiveTab(); } },
    { label:"Go: Personal Space", run:()=>{ activeZone="personal"; renderZone(activeZone); highlightActiveTab(); } },
    { label:"Theme: Toggle", run:()=>{ theme = theme==="dark" ? "light" : "dark"; applyTheme(theme); } },
    { label:"Search: People", run:()=> seedSearch("people ") },
    { label:"Search: Projects", run:()=> seedSearch("project ") },
    { label:"Search: Papers", run:()=> seedSearch("paper ") },
  ];

  function open(){ palette.classList.remove("hidden"); input.value=""; render(""); setTimeout(()=>input.focus(),0); }
  function close(){ palette.classList.add("hidden"); }

  function render(q){
    let r = q.toLowerCase();
    let items = commands.filter(c=>c.label.toLowerCase().includes(r));
    list.innerHTML = items.map((c,i)=>`<li role="option" data-i="${i}" ${i===0?'aria-selected="true"':''}>${c.label}</li>`).join("") || "<li>No matches</li>";
  }

  let sel=0;
  list.addEventListener("mousemove",(e)=>{
    let li = e.target.closest('li[role="option"]'); if(!li) return;
    [...list.children].forEach(n=>n.setAttribute("aria-selected","false"));
    li.setAttribute("aria-selected","true");
    sel = [...list.children].indexOf(li);
  });
  list.addEventListener("click",(e)=>{
    let li = e.target.closest('li[role="option"]'); if(!li) return;
    let idx = parseInt(li.dataset.i,10);
    let filtered = commands.filter(c=>c.label.toLowerCase().includes(input.value.toLowerCase()));
    filtered[idx]?.run(); close();
  });

  input.addEventListener("input",()=>render(input.value));
  input.addEventListener("keydown",(e)=>{
    let opts = list.querySelectorAll('li[role="option"]');
    if(!opts.length) return;
    if(e.key==="ArrowDown"){ sel=Math.min(sel+1, opts.length-1); setSel(opts); e.preventDefault(); }
    else if(e.key==="ArrowUp"){ sel=Math.max(sel-1, 0); setSel(opts); e.preventDefault(); }
    else if(e.key==="Enter"){ opts[sel].click(); }
    else if(e.key==="Escape"){ close(); }
  });
  function setSel(opts){ opts.forEach(n=>n.setAttribute("aria-selected","false")); opts[sel].setAttribute("aria-selected","true"); }

  document.addEventListener("keydown",(e)=>{
    let mod = e.ctrlKey || e.metaKey;
    if(mod && e.key.toLowerCase()==="k"){ e.preventDefault(); palette.classList.contains("hidden")?open():close(); }
    if(e.key==="Escape" && !palette.classList.contains("hidden")) close();
  });
  btn.addEventListener("click", open);
}

function seedSearch(seed){
  let o = document.getElementById("omnibox");
  o.value = seed;
  o.focus();
}

/* ===== Helpers ===== */
function fadeIn(node){
  if(!enableAnimations){ node.style.opacity = 1; return; }
  requestAnimationFrame(()=> node.style.opacity = 1);
}
function escapeHTML(s){ return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
