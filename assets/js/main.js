async function loadProjects() {
  const res = await fetch("/assets/data/projects.json");
  return res.json();
}

function escapeHtml(s) {
  return (s || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function projectCard(p) {
  const stacks = (p.stack || []).slice(0, 6).map(s => `<span class="badge">${escapeHtml(s)}</span>`).join("");
  const tags = (p.tags || []).map(t => `<span class="badge">${escapeHtml(t.toUpperCase())}</span>`).join("");
  const highlights = (p.highlights || []).slice(0, 3).map(h => `<li>${escapeHtml(h)}</li>`).join("");

  const links = [];
  if (p.links?.github) links.push(`<a class="pill" href="${p.links.github}" target="_blank" rel="noreferrer">GitHub</a>`);
  if (p.links?.demo) links.push(`<a class="pill" href="${p.links.demo}" target="_blank" rel="noreferrer">Demo</a>`);
  if (p.links?.paper) links.push(`<a class="pill" href="${p.links.paper}" target="_blank" rel="noreferrer">Paper</a>`);

  return `
    <div class="card half">
      <div class="projectTitle">${escapeHtml(p.title)}</div>
      <div class="projectMeta">${escapeHtml(p.summary)}</div>
      <div class="badges">${stacks}</div>
      <div class="badges">${tags}</div>
      <ul class="projectMeta">${highlights}</ul>
      <div class="badges">${links.join("")}</div>
    </div>
  `;
}

async function renderProjects({ roleTag = null, containerId = "projects", limit = null } = {}) {
  const projects = await loadProjects();
  const filtered = roleTag ? projects.filter(p => (p.tags || []).includes(roleTag)) : projects;
  const sliced = (typeof limit === "number" && limit > 0) ? filtered.slice(0, limit) : filtered;

  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = sliced.map(projectCard).join("") || `<div class="card">No projects found for this role yet.</div>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const roleTag = window.ROLE_TAG || null;
  const limit = window.PROJECT_LIMIT || null;
  renderProjects({ roleTag, containerId: "projects", limit });
});
