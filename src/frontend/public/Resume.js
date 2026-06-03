/* ============================================================
   Résumé content — mirrors the site's i18n data (EN / NL / FR).
   Language is chosen from ?lang= (falls back to en); the in-page
   switcher updates the URL so the chosen version is shareable.
   Keep this in sync with src/lib/i18n.jsx.

   Loaded as an external script (script-src 'self') so the page
   works under the hardened Content-Security-Policy — no inline
   <script> or inline onclick handlers.
   ============================================================ */

// language-neutral data
var CONTACT = {
  email: "michiel.vanherreweghe@outlook.com",
  emailLabel: "michiel.vanherreweghe@outlook.com",
  linkedin: { href: "https://linkedin.com/in/michiel-van-herreweghe-0ba4b71a7", label: "linkedin.com/in/michiel-van-herreweghe" },
  github:   { href: "https://github.com/michielvanherreweghe", label: "github.com/michielvanherreweghe" }
};
var SKILL_VALUES = {
  infra: "Kubernetes, Docker, Terraform, Ansible, Helm",
  cloud: "AWS, Azure",
  cicd:  "GitHub Actions, Azure DevOps, ArgoCD",
  langs: ".NET, React",
  obs:   "Prometheus, Grafana, Loki, Tempo, OpenTelemetry",
  data:  "PostgreSQL, MySQL, Microsoft SQL Server"
};
var CERTS = "GitHub Foundations · CKAD";
var EXP_META = [
  { when: "2026 — Present", org: "Axxit" },
  { when: "2025 — 2026", org: "Tomorrowland" },
  { when: "2024 — 2025", org: "CloudFuel" },
  { when: "2023 — 2024", org: "Inetum-RealDolmen" }
];

var I18N = {
  en: {
    htmlLang: "en", docTitle: "Michiel Van Herreweghe — Résumé",
    back: "← Back to site",
    tip: "Tip: in the print dialog, choose “Save as PDF”.",
    download: "Download PDF ↓",
    role: "DevOps & Software Engineer · Belgium",
    sections: { summary: "Summary", experience: "Experience", skills: "Skills", education: "Education" },
    skillLabels: { infra: "Infrastructure", cloud: "Cloud", cicd: "CI/CD", langs: "Languages", obs: "Observability", data: "Data" },
    summary: "DevOps & Software Engineer based in Belgium, sitting between infrastructure and product — building the pipelines and platforms that let teams ship fast without breaking things. I care about clean automation, observable systems, and code the next person can actually read.",
    experience: [
      { role: "Medior Software Engineer", body: "Building and shipping .NET and React applications on Azure, with infrastructure managed as code in Terraform and delivery through GitHub." },
      { role: "DevOps Engineer", body: "Ran workloads on AWS and Kubernetes, with GitOps delivery via ArgoCD and infrastructure provisioned as code in Terraform." },
      { role: "DevOps Engineer", body: "Containerised .NET services with Docker and Kubernetes on Azure, automating provisioning with Terraform and deployments with ArgoCD." },
      { role: "Junior Cloud Application & Platform Engineer", body: "Developed .NET applications and platform tooling on Azure, with containerised workloads and CI/CD pipelines in Azure DevOps." }
    ],
    education: [
      { title: "Applied Computer Science", org: "HoGent, Belgium", when: "2020 — 2023" },
      { title: "Information Management and Security", org: "Thomas More, Belgium", when: "2019 — 2020" }
    ],
    certsLabel: "Certifications"
  },
  nl: {
    htmlLang: "nl", docTitle: "Michiel Van Herreweghe — CV",
    back: "← Terug naar site",
    tip: "Tip: kies “Opslaan als pdf” in het printvenster.",
    download: "Download pdf ↓",
    role: "DevOps & Software Engineer · België",
    sections: { summary: "Samenvatting", experience: "Ervaring", skills: "Vaardigheden", education: "Opleiding" },
    skillLabels: { infra: "Infrastructuur", cloud: "Cloud", cicd: "CI/CD", langs: "Talen", obs: "Observability", data: "Data" },
    summary: "DevOps & Software Engineer uit België die tussen infrastructuur en product in staat — en de pipelines en platformen bouwt waarmee teams snel kunnen leveren zonder dingen kapot te maken. Ik geef om propere automatisering, observeerbare systemen en code die de volgende persoon ook echt kan lezen.",
    experience: [
      { role: "Medior Software Engineer", body: "Bouwt en levert .NET- en React-applicaties op Azure, met infrastructuur als code in Terraform en delivery via GitHub." },
      { role: "DevOps Engineer", body: "Beheerde workloads op AWS en Kubernetes, met GitOps-delivery via ArgoCD en infrastructuur als code in Terraform." },
      { role: "DevOps Engineer", body: "Containeriseerde .NET-services met Docker en Kubernetes op Azure, met provisioning via Terraform en deployments via ArgoCD." },
      { role: "Junior Cloud Application & Platform Engineer", body: "Ontwikkelde .NET-applicaties en platformtooling op Azure, met gecontaineriseerde workloads en CI/CD-pipelines in Azure DevOps." }
    ],
    education: [
      { title: "Toegepaste Informatica", org: "HoGent, België", when: "2020 — 2023" },
      { title: "Information Management and Security", org: "Thomas More, België", when: "2019 — 2020" }
    ],
    certsLabel: "Certificaten"
  },
  fr: {
    htmlLang: "fr", docTitle: "Michiel Van Herreweghe — CV",
    back: "← Retour au site",
    tip: "Astuce : choisissez « Enregistrer en PDF » dans la boîte d'impression.",
    download: "Télécharger le PDF ↓",
    role: "DevOps & Software Engineer · Belgique",
    sections: { summary: "Profil", experience: "Expérience", skills: "Compétences", education: "Formation" },
    skillLabels: { infra: "Infrastructure", cloud: "Cloud", cicd: "CI/CD", langs: "Langages", obs: "Observabilité", data: "Données" },
    summary: "DevOps & Software Engineer basé en Belgique, entre l'infrastructure et le produit — je construis les pipelines et plateformes qui permettent aux équipes de livrer vite sans rien casser. J'attache de l'importance à une automatisation propre, à des systèmes observables et à du code que la personne suivante peut vraiment lire.",
    experience: [
      { role: "Medior Software Engineer", body: "Conçoit et livre des applications .NET et React sur Azure, avec une infrastructure en tant que code dans Terraform et une livraison via GitHub." },
      { role: "DevOps Engineer", body: "Gestion des workloads sur AWS et Kubernetes, avec livraison GitOps via ArgoCD et infrastructure provisionnée en tant que code dans Terraform." },
      { role: "DevOps Engineer", body: "Conteneurisation de services .NET avec Docker et Kubernetes sur Azure, provisionnement via Terraform et déploiements via ArgoCD." },
      { role: "Junior Cloud Application & Platform Engineer", body: "Développement d'applications .NET et d'outils de plateforme sur Azure, avec des workloads conteneurisés et des pipelines CI/CD dans Azure DevOps." }
    ],
    education: [
      { title: "Informatique appliquée", org: "HoGent, Belgique", when: "2020 — 2023" },
      { title: "Information Management and Security", org: "Thomas More, Belgique", when: "2019 — 2020" }
    ],
    certsLabel: "Certifications"
  }
};

var ORDER = ["en", "nl", "fr"];
var SHORT = { en: "EN", nl: "NL", fr: "FR" };

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function pickLang() {
  var q = new URLSearchParams(window.location.search).get("lang");
  if (q && I18N[q]) return q;
  return "en";
}

function render(lang) {
  var t = I18N[lang];
  document.documentElement.lang = t.htmlLang;
  document.title = t.docTitle;

  document.getElementById("r-back").textContent = t.back;
  document.getElementById("r-tip").textContent = t.tip;
  document.getElementById("r-download").textContent = t.download;
  document.getElementById("r-role").textContent = t.role;

  document.getElementById("r-contact").innerHTML =
    '<a href="mailto:' + esc(CONTACT.email) + '">' + esc(CONTACT.emailLabel) + '</a><br />' +
    '<a href="' + esc(CONTACT.linkedin.href) + '">' + esc(CONTACT.linkedin.label) + '</a><br />' +
    '<a href="' + esc(CONTACT.github.href) + '">' + esc(CONTACT.github.label) + '</a>';

  // language switcher
  var ls = document.getElementById("r-langs");
  ls.innerHTML = "";
  ORDER.forEach(function (code) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = SHORT[code];
    if (code === lang) b.setAttribute("aria-current", "true");
    b.addEventListener("click", function () { switchLang(code); });
    ls.appendChild(b);
  });

  var xp = t.experience.map(function (e, i) {
    var m = EXP_META[i];
    return '' +
      '<div class="xp">' +
        '<div class="when">' + esc(m.when) + '</div>' +
        '<div>' +
          '<h3>' + esc(e.role) + '</h3>' +
          '<div class="org">' + esc(m.org) + '</div>' +
          '<p>' + esc(e.body) + '</p>' +
        '</div>' +
      '</div>';
  }).join("");

  var sk = t.skillLabels;
  var skills = '' +
    skillRow(sk.infra, SKILL_VALUES.infra) +
    skillRow(sk.cloud, SKILL_VALUES.cloud) +
    skillRow(sk.cicd, SKILL_VALUES.cicd) +
    skillRow(sk.langs, SKILL_VALUES.langs) +
    skillRow(sk.obs, SKILL_VALUES.obs) +
    skillRow(sk.data, SKILL_VALUES.data);

  var edu = t.education.map(function (e) {
    return '<div class="edu"><span><strong>' + esc(e.title) + '</strong> — ' + esc(e.org) + '</span><span class="when">' + esc(e.when) + '</span></div>';
  }).join("");
  edu += '<div class="edu"><span><strong>' + esc(t.certsLabel) + '</strong> — ' + esc(CERTS) + '</span><span class="when"></span></div>';

  document.getElementById("r-grid").innerHTML = '' +
    '<section class="block"><h2>' + esc(t.sections.summary) + '</h2><p class="summary">' + esc(t.summary) + '</p></section>' +
    '<section class="block"><h2>' + esc(t.sections.experience) + '</h2>' + xp + '</section>' +
    '<section class="block"><h2>' + esc(t.sections.skills) + '</h2><div class="skills">' + skills + '</div></section>' +
    '<section class="block"><h2>' + esc(t.sections.education) + '</h2>' + edu + '</section>';
}

function skillRow(g, v) {
  return '<div class="skill-row"><span class="g">' + esc(g) + '</span><span class="v">' + esc(v) + '</span></div>';
}

function switchLang(lang) {
  var url = new URL(window.location.href);
  url.searchParams.set("lang", lang);
  window.history.replaceState(null, "", url);
  render(lang);
}

// Print/download — replaces the inline onclick so script-src 'self' holds.
document.getElementById("r-download").addEventListener("click", function () {
  window.print();
});

render(pickLang());
