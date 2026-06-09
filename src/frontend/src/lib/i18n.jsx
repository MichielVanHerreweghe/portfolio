/* i18n.jsx — language layer (EN / NL / FR) + content
   ============================================================
   Neutral (language-independent) data lives in NEUTRAL.
   Per-language text + content lives in I18N[lang].
   Components read everything via useT() -> { lang, setLang, C }.
   ============================================================ */
import React from 'react';

export const LANGS = [
  { code: "en", label: "English", short: "EN" },
  { code: "nl", label: "Nederlands", short: "NL" },
  { code: "fr", label: "Français", short: "FR" },
];

const NEUTRAL = {
  name: "Michiel Van Herreweghe",
  short: "Michiel V.H.",
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com/in/michiel-van-herreweghe-0ba4b71a7", handle: "/in/michiel-van-herreweghe-0ba4b71a7" },
    { label: "GitHub", href: "https://github.com/michielvanherreweghe", handle: "@MichielVanHerreweghe" },
  ],
  stack: ["KUBERNETES", "TERRAFORM", "DOCKER", "CI/CD", "AWS", "AZURE", ".NET", "ANSIBLE", "OBSERVABILITY"],
  // language-neutral certification names
  certifications: [
    { title: "GitHub Foundations" },
    { title: "CKAD" },
  ],
  // language-neutral skill items
  skillItems: {
    Infrastructure: ["Kubernetes", "Docker", "Terraform", "Ansible", "Helm"],
    Cloud: ["AWS", "Azure"],
    CICD: ["GitHub Actions", "Azure DevOps", "ArgoCD"],
    Languages: [".NET"],
    Observability: ["Prometheus", "Grafana", "Loki", "Tempo", "OpenTelemetry"],
    Data: ["PostgreSQL", "MySQL", "Microsoft SQLServer"],
  },
  projectMeta: [
    { id: "p1", slug: "t-vijverhof", year: "2025", href: "https://www.tvijverhof.be/", featured: true, tags: ["Design", "Web"],
      cover: "/projects/p1/cover.webp",
      shots: [
        { src: "/projects/p1/home.webp", label: "Home" },
        { src: "/projects/p1/menu.webp", label: "Menu" },
        { src: "/projects/p1/wijnen.webp", label: "Wines" },
        { src: "/projects/p1/dessert.webp", label: "Dessert" },
        { src: "/projects/p1/gallerij.webp", label: "Gallery" },
        { src: "/projects/p1/rouwmaaltijden.webp", label: "Memorial meals" },
        { src: "/projects/p1/contact.webp", label: "Reservation & contact" },
      ] },
    { id: "p2", slug: "uitvaartbegeleiding-stefaan", year: "2021", href: "https://www.uitvaartbegeleidingstefaan.be/", tags: ["Design", "Web"],
      cover: "/projects/p2/cover.webp",
      shots: [
        { src: "/projects/p2/home.webp", label: "Home" },
        { src: "/projects/p2/voorafregeling.webp", label: "Pre-arrangement" },
        { src: "/projects/p2/uitvaartzorg-uitvaartplechtigheid.webp", label: "Funeral ceremony" },
        { src: "/projects/p2/uitvaartzorg-meld-een-overlijden.webp", label: "Report a death" },
        { src: "/projects/p2/aula.webp", label: "Aula" },
        { src: "/projects/p2/funerarium.webp", label: "Funerarium" },
        { src: "/projects/p2/rouwtoebehoren.webp", label: "Mourning accessories" },
        { src: "/projects/p2/rondleiding.webp", label: "Guided tour" },
      ] },
  ],
  // language-neutral reading list — month is 0-indexed, localized per language.
  // cover: optional path to a cover image in /public (e.g. "covers/iron-gold.webp").
  // Leave it out to show the drop-an-image placeholder instead.
  reading: [
    { author: "Pierce Brown", book: "Dark Age", cover: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1525464420i/29226553.jpg" },
    { author: "Travis Deverell (Shirtaloon)", book: "He Who Fights With Monsters 3", cover: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1621351547i/58088499.jpg" },
  ],
};

/* helper: build skills array from neutral items + translated group names */
function skills(groups) {
  return [
    { group: groups.Infrastructure, items: NEUTRAL.skillItems.Infrastructure },
    { group: groups.Cloud, items: NEUTRAL.skillItems.Cloud },
    { group: groups.CICD, items: NEUTRAL.skillItems.CICD },
    { group: groups.Languages, items: NEUTRAL.skillItems.Languages },
    { group: groups.Observability, items: NEUTRAL.skillItems.Observability },
    { group: groups.Data, items: NEUTRAL.skillItems.Data },
  ];
}
/* helper: build projects from neutral meta + translated text */
function projects(texts) {
  return NEUTRAL.projectMeta.map((m, i) => ({ ...m, ...texts[i] }));
}
/* helper: build the reading list from neutral data + translated month names */
function reading(months) {
  return NEUTRAL.reading.map((b) => ({
    ...b,
    title: b.book,
    updatedLabel: `${months[b.month]} ${b.year}`,
  }));
}

/* ===================== ENGLISH ===================== */
const EN = {
  ...NEUTRAL,
  role: "DevOps & Software Engineer",
  location: "Belgium",
  ui: {
    navHome: "Home", navWork: "Work", navBlog: "Blog", navAbout: "About", navContact: "Contact",
    getInTouch: "Get in touch", resume: "Résumé", now: "now", tagline: "DevOps · SWE",
    heroKicker: "Infrastructure × Code",
    heroIntro: "DevOps & Software Engineer building resilient pipelines, clean infrastructure, and software that ships.",
    viewWork: "View work", downloadCV: "Download CV",
    servicesKicker: "What I do", servicesHeading: "Three things, done properly.",
    featuredKicker: "Selected work", featuredHeading: "Recent builds", allProjects: "All projects",
    portfolioKicker: "Portfolio", portfolioH1a: "Websites I've", portfolioH1b: "designed & built.",
    portfolioIntro: "A selection of sites and products I've shaped — from design through to the infrastructure they run on.",
    filterAll: "All", visit: "Visit", noProjects: "no projects match",
    blogKicker: "Writing", blogH1a: "DevOps & infrastructure,", blogH1b: "in depth.",
    blogIntro: "Hands-on guides on Kubernetes, CI/CD, and cloud infrastructure — built from production experience.",
    noPosts: "no posts match", readMore: "Read post", postedOn: "Posted",
    aboutKicker: "About", aboutH1a: "Engineer who likes things ", aboutH1b: "that stay up.",
    aboutP1: "I'm Michiel — a DevOps & Software Engineer based in Belgium. I sit between infrastructure and product, building the pipelines and platforms that let teams ship fast without breaking things.",
    aboutP2: "I care about clean automation, observable systems, and code that the next person can actually read. When I'm not in a terminal, I'm usually designing and building websites — which is what you'll find in my portfolio.",
    downloadResume: "Download résumé", locationBadge: "BELGIUM",
    statLabels: ["Years building", "Pipelines shipped", "Typical uptime", "Cups of coffee"],
    skillsKicker: "Toolbox", skillsHeading: "What I work with",
    expKicker: "Experience", expHeading: "Where I've been",
    eduKicker: "Education", eduStudies: "Studies", eduCerts: "Certifications",
    otcKicker: "Off the clock", otcHeading: "Outside work",
    currentlyReading: "CURRENTLY READING", progressIn: "% in", updated: "updated",
    contactKicker: "Get in touch", contactH1a: "Let's build", contactH1b: "something ", contactH1c: "solid.",
    contactP: "Have a role, a project, or an idea that needs reliable engineering behind it? Drop me a line.",
    sendLabel: "// SEND A MESSAGE", phName: "Your name", phEmail: "Email address", phMsg: "What's on your mind?",
    sendMsg: "Send message", sending: "Sending…",
    sendError: "Something went wrong — please try again, or email me directly.",
    sentTitle: "Message sent", sentBody: (n) => `Thanks, ${n} — I'll get back to you soon.`,
    backToTop: "BACK TO TOP", langLabel: "Language",
    backToWork: "Back to work", visitLive: "Visit live site",
    noShots: "no screenshots yet", projectNotFound: "Project not found",
  },
  services: [
    { n: "01", title: "Infrastructure & Cloud", body: "Provisioning and scaling cloud infrastructure as code — Kubernetes, Terraform, and multi-cloud setups built to survive real traffic.", tags: ["Kubernetes", "Terraform", "AWS / Azure"] },
    { n: "02", title: "CI/CD & Automation", body: "Pipelines that build, test, and deploy without drama. From zero-downtime releases to fully automated environments.", tags: ["GitHub Actions", "Azure DevOps", "ArgoCD"] },
    { n: "03", title: "Software Engineering", body: "Backend services and tooling written to be read — clean, observable, and tested.", tags: [".NET", "React"] },
  ],
  experience: [
    // Body lines summarise the stack tagged on each role — they're a content
    // floor so the SSR HTML and structured data have something coherent to
    // expose. Swap for outcome-shaped copy (impact, scale, decisions) when
    // you're ready to publish more detail.
    { role: "Medior Software Engineer", org: "Axxit", period: "2026 - present",
      body: "Building .NET services and React front-ends on Azure, with infrastructure provisioned through Terraform and shipped via GitHub Actions.",
      tags: ["Azure", "GitHub", "Terraform", ".NET", "React"] },
    { role: "DevOps Engineer", org: "Tomorrowland", period: "2025 — 2026",
      body: "Ran Kubernetes workloads on AWS for event-scale traffic, with infrastructure managed in Terraform and continuous delivery through ArgoCD.",
      tags: ["AWS", "GitHub", "Kubernetes", "Terraform", "ArgoCD"] },
    { role: "DevOps Engineer", org: "CloudFuel", period: "2024 - 2025",
      body: "Designed and operated Kubernetes platforms on Azure for .NET workloads, with Terraform infrastructure and GitOps-style deploys via ArgoCD.",
      tags: ["Azure", "GitHub", "Kubernetes", "Docker", ".NET", "Terraform", "ArgoCD"] },
    { role: "Junior Cloud Application and Platform Engineer", org: "Inetum-RealDolmen", period: "2023 - 2024",
      body: "Shipped containerised .NET applications on Azure, with Terraform for infrastructure and Azure DevOps pipelines for build and release.",
      tags: ["Azure", "Docker", "Azure DevOps", ".NET", "Terraform"] },
  ],
  education: [
    { title: "Applied Computer Science", org: "HoGent, Belgium", period: "2020 - 2023" },
    { title: "Information Management and Security", org: "Thomas More, Belgium", period: "2019 - 2020" },
  ],
  skills: skills({ Infrastructure: "Infrastructure", Cloud: "Cloud", CICD: "CI/CD", Languages: "Languages", Observability: "Observability", Data: "Data" }),
  hobbies: [
    { icon: "mountain", title: "Hiking", detail: "Trails over treadmills — happiest with a map and bad weather." },
    { icon: "board", title: "Snowboarding", detail: "A few weeks in the Alps every winter, chasing fresh powder." },
    { icon: "film", title: "Cinema", detail: "Sci-fi and slow burns. Always up for a late-night double feature." },
    { icon: "flame", title: "Cooking & Barbecue", detail: "Low and slow over fire — happiest feeding a table full of people." },
  ],
  reading: reading(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]),
  projects: projects([
    { title: "'t Vijverhof", kind: "Restaurant site", role: "Design & Build", desc: "A warm marketing site for restaurant 't Vijverhof in Erpe-Mere, with menu, wine and dessert pages, a photo gallery, and an embedded online reservation widget." },
    { title: "Uitvaartbegeleiding Stefaan", kind: "Marketing site", role: "Design & Build", desc: "A serene marketing site for a family-run funeral home in Brakel, covering every step from reporting a death to the ceremony, aula and funerarium — with 360° livestreaming of services." },
  ]),
};

/* ===================== NEDERLANDS ===================== */
const NL = {
  ...NEUTRAL,
  role: "DevOps & Software Engineer",
  location: "België",
  ui: {
    navHome: "Home", navWork: "Werk", navBlog: "Blog", navAbout: "Over mij", navContact: "Contact",
    getInTouch: "Neem contact op", resume: "CV", now: "nu", tagline: "DevOps · SWE",
    heroKicker: "Infrastructuur × Code",
    heroIntro: "DevOps & Software Engineer die veerkrachtige pipelines, propere infrastructuur en software bouwt die effectief draait.",
    viewWork: "Bekijk werk", downloadCV: "Download CV",
    servicesKicker: "Wat ik doe", servicesHeading: "Drie dingen, goed gedaan.",
    featuredKicker: "Geselecteerd werk", featuredHeading: "Recente projecten", allProjects: "Alle projecten",
    portfolioKicker: "Portfolio", portfolioH1a: "Websites die ik", portfolioH1b: "ontwierp & bouwde.",
    portfolioIntro: "Een selectie van sites en producten die ik vormgaf — van ontwerp tot de infrastructuur waarop ze draaien.",
    filterAll: "Alles", visit: "Bezoek", noProjects: "geen projecten voor",
    blogKicker: "Schrijven", blogH1a: "DevOps & infrastructuur,", blogH1b: "tot in de diepte.",
    blogIntro: "Praktische gidsen over Kubernetes, CI/CD en cloud-infrastructuur — gebaseerd op ervaring in productie.",
    noPosts: "geen posts voor", readMore: "Lees post", postedOn: "Geplaatst",
    aboutKicker: "Over mij", aboutH1a: "Engineer die houdt van dingen ", aboutH1b: "die blijven draaien.",
    aboutP1: "Ik ben Michiel — een DevOps & Software Engineer uit België. Ik sta tussen infrastructuur en product in en bouw de pipelines en platformen waarmee teams snel kunnen leveren zonder dingen kapot te maken.",
    aboutP2: "Ik geef om propere automatisering, observeerbare systemen en code die de volgende persoon ook echt kan lezen. Als ik niet in een terminal zit, ontwerp en bouw ik meestal websites — wat je terugvindt in mijn portfolio.",
    downloadResume: "Download CV", locationBadge: "BELGIË",
    statLabels: ["Jaar ervaring", "Pipelines gebouwd", "Typische uptime", "Koppen koffie"],
    skillsKicker: "Gereedschap", skillsHeading: "Waarmee ik werk",
    expKicker: "Ervaring", expHeading: "Waar ik werkte",
    eduKicker: "Opleiding", eduStudies: "Opleidingen", eduCerts: "Certificaten",
    otcKicker: "Naast het werk", otcHeading: "Buiten het werk",
    currentlyReading: "NU AAN HET LEZEN", progressIn: "% gelezen", updated: "bijgewerkt",
    contactKicker: "Neem contact op", contactH1a: "Laten we iets", contactH1b: "", contactH1c: "degelijks bouwen.",
    contactP: "Heb je een functie, een project of een idee dat betrouwbare engineering nodig heeft? Stuur me een bericht.",
    sendLabel: "// STUUR EEN BERICHT", phName: "Je naam", phEmail: "E-mailadres", phMsg: "Wat wil je kwijt?",
    sendMsg: "Verstuur bericht", sending: "Versturen…",
    sendError: "Er ging iets mis — probeer opnieuw of mail me rechtstreeks.",
    sentTitle: "Bericht verzonden", sentBody: (n) => `Bedankt, ${n} — ik kom snel bij je terug.`,
    backToTop: "TERUG NAAR BOVEN", langLabel: "Taal",
    backToWork: "Terug naar werk", visitLive: "Bekijk de live site",
    noShots: "nog geen screenshots", projectNotFound: "Project niet gevonden",
  },
  services: [
    { n: "01", title: "Infrastructuur & Cloud", body: "Cloud-infrastructuur provisioneren en schalen als code — Kubernetes, Terraform en multi-cloud opstellingen die echt verkeer aankunnen.", tags: ["Kubernetes", "Terraform", "AWS / Azure"] },
    { n: "02", title: "CI/CD & Automatisering", body: "Pipelines die bouwen, testen en deployen zonder gedoe. Van releases zonder downtime tot volledig geautomatiseerde omgevingen.", tags: ["GitHub Actions", "Azure DevOps", "ArgoCD"] },
    { n: "03", title: "Software Engineering", body: "Backend-services en tooling die je kan lezen — proper, observeerbaar en getest.", tags: [".NET", "React"] },
  ],
  experience: [
    // Mirrors the EN entries — same employers, periods and tags, with the
    // body lines translated. Keep these in sync when EN copy changes.
    { role: "Medior Software Engineer", org: "Axxit", period: "2026 - heden",
      body: ".NET-services en React-frontends bouwen op Azure, met infrastructuur via Terraform en releases via GitHub Actions.",
      tags: ["Azure", "GitHub", "Terraform", ".NET", "React"] },
    { role: "DevOps Engineer", org: "Tomorrowland", period: "2025 — 2026",
      body: "Kubernetes-workloads draaien op AWS voor evenement-volume verkeer, met infrastructuur in Terraform en continue uitrol via ArgoCD.",
      tags: ["AWS", "GitHub", "Kubernetes", "Terraform", "ArgoCD"] },
    { role: "DevOps Engineer", org: "CloudFuel", period: "2024 - 2025",
      body: "Kubernetes-platformen ontworpen en beheerd op Azure voor .NET-workloads, met Terraform-infrastructuur en GitOps-deploys via ArgoCD.",
      tags: ["Azure", "GitHub", "Kubernetes", "Docker", ".NET", "Terraform", "ArgoCD"] },
    { role: "Junior Cloud Application and Platform Engineer", org: "Inetum-RealDolmen", period: "2023 - 2024",
      body: "Gecontaineriseerde .NET-applicaties uitgerold op Azure, met Terraform voor infrastructuur en Azure DevOps-pipelines voor build en release.",
      tags: ["Azure", "Docker", "Azure DevOps", ".NET", "Terraform"] },
  ],
  education: [
    { title: "Toegepaste Informatica", org: "HoGent, België", period: "2020 - 2023" },
    { title: "Information Management & Security", org: "Thomas More, België", period: "2019 - 2020" },
  ],
  skills: skills({ Infrastructure: "Infrastructuur", Cloud: "Cloud", CICD: "CI/CD", Languages: "Talen", Observability: "Observability", Data: "Data" }),
  hobbies: [
    { icon: "mountain", title: "Wandelen", detail: "Liever bospaden dan loopbanden — gelukkigst met een kaart en slecht weer." },
    { icon: "board", title: "Snowboarden", detail: "Elke winter een paar weken in de Alpen, op zoek naar verse poeder." },
    { icon: "film", title: "Cinema", detail: "Sci-fi en slow burns. Altijd in voor een dubbele filmavond." },
    { icon: "flame", title: "Koken & Barbecue", detail: "Low and slow boven het vuur — het gelukkigst met een tafel vol mensen om te verwennen." },
  ],
  reading: reading(["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"]),
  projects: projects([
    { title: "'t Vijverhof", kind: "Restaurantsite", role: "Ontwerp & Bouw", desc: "Een warme marketingsite voor restaurant 't Vijverhof in Erpe-Mere, met menu-, wijn- en dessertpagina's, een fotogalerij en een geïntegreerde online reservatiemodule." },
    { title: "Uitvaartbegeleiding Stefaan", kind: "Marketingsite", role: "Ontwerp & Bouw", desc: "Een serene marketingsite voor een familiale uitvaartonderneming in Brakel, die elke stap behandelt van het melden van een overlijden tot de plechtigheid, aula en funerarium — met 360°-livestreaming van de dienst." },
  ]),
};

/* ===================== FRANÇAIS ===================== */
const FR = {
  ...NEUTRAL,
  role: "DevOps & Software Engineer",
  location: "Belgique",
  ui: {
    navHome: "Accueil", navWork: "Projets", navBlog: "Blog", navAbout: "À propos", navContact: "Contact",
    getInTouch: "Me contacter", resume: "CV", now: "ici", tagline: "DevOps · SWE",
    heroKicker: "Infrastructure × Code",
    heroIntro: "DevOps & Software Engineer qui conçoit des pipelines résilients, une infrastructure soignée et des logiciels prêts à être livrés.",
    viewWork: "Voir les projets", downloadCV: "Télécharger le CV",
    servicesKicker: "Ce que je fais", servicesHeading: "Trois choses, bien faites.",
    featuredKicker: "Projets sélectionnés", featuredHeading: "Réalisations récentes", allProjects: "Tous les projets",
    portfolioKicker: "Portfolio", portfolioH1a: "Des sites que j'ai", portfolioH1b: "conçus & développés.",
    portfolioIntro: "Une sélection de sites et de produits que j'ai façonnés — du design jusqu'à l'infrastructure qui les fait tourner.",
    filterAll: "Tout", visit: "Voir", noProjects: "aucun projet pour",
    blogKicker: "Écrits", blogH1a: "DevOps & infrastructure,", blogH1b: "en profondeur.",
    blogIntro: "Des guides pratiques sur Kubernetes, le CI/CD et l'infrastructure cloud — issus d'une expérience en production.",
    noPosts: "aucun article pour", readMore: "Lire l'article", postedOn: "Publié",
    aboutKicker: "À propos", aboutH1a: "Ingénieur qui aime les choses ", aboutH1b: "qui restent en ligne.",
    aboutP1: "Je suis Michiel — un DevOps & Software Engineer basé en Belgique. Je me situe entre l'infrastructure et le produit, en construisant les pipelines et plateformes qui permettent aux équipes de livrer vite sans rien casser.",
    aboutP2: "J'attache de l'importance à une automatisation propre, à des systèmes observables et à du code que la personne suivante peut vraiment lire. Quand je ne suis pas dans un terminal, je conçois et développe des sites web — ce que vous trouverez dans mon portfolio.",
    downloadResume: "Télécharger le CV", locationBadge: "BELGIQUE",
    statLabels: ["Ans d'expérience", "Pipelines livrés", "Uptime typique", "Tasses de café"],
    skillsKicker: "Boîte à outils", skillsHeading: "Mes outils",
    expKicker: "Expérience", expHeading: "Mon parcours",
    eduKicker: "Formation", eduStudies: "Formations", eduCerts: "Certifications",
    otcKicker: "Hors du travail", otcHeading: "En dehors du boulot",
    currentlyReading: "EN CE MOMENT", progressIn: "% lu", updated: "mis à jour",
    contactKicker: "Me contacter", contactH1a: "Construisons", contactH1b: "quelque chose de ", contactH1c: "solide.",
    contactP: "Un poste, un projet ou une idée qui a besoin d'une ingénierie fiable ? Écrivez-moi.",
    sendLabel: "// ENVOYER UN MESSAGE", phName: "Votre nom", phEmail: "Adresse e-mail", phMsg: "Qu'avez-vous en tête ?",
    sendMsg: "Envoyer le message", sending: "Envoi…",
    sendError: "Une erreur s'est produite — réessayez ou écrivez-moi directement.",
    sentTitle: "Message envoyé", sentBody: (n) => `Merci, ${n} — je reviens vers vous bientôt.`,
    backToTop: "HAUT DE PAGE", langLabel: "Langue",
    backToWork: "Retour aux projets", visitLive: "Voir le site en ligne",
    noShots: "pas encore de captures", projectNotFound: "Projet introuvable",
  },
  services: [
    { n: "01", title: "Infrastructure & Cloud", body: "Provisionner et faire évoluer l'infrastructure cloud en tant que code — Kubernetes, Terraform et architectures multi-cloud conçues pour encaisser un trafic réel.", tags: ["Kubernetes", "Terraform", "AWS / Azure"] },
    { n: "02", title: "CI/CD & Automatisation", body: "Des pipelines qui compilent, testent et déploient sans accroc. Des mises en production sans interruption aux environnements entièrement automatisés.", tags: ["GitHub Actions", "Azure DevOps", "ArgoCD"] },
    { n: "03", title: "Développement logiciel", body: "Des services backend et des outils faits pour être lus — propres, observables et testés.", tags: [".NET", "React"] },
  ],
  experience: [
    // Mirrors the EN entries — same employers, periods and tags, with the
    // body lines translated. Keep these in sync when EN copy changes.
    { role: "Medior Software Engineer", org: "Axxit", period: "2026 - aujourd'hui",
      body: "Développement de services .NET et de front-ends React sur Azure, avec une infrastructure provisionnée via Terraform et livrée via GitHub Actions.",
      tags: ["Azure", "GitHub", "Terraform", ".NET", "React"] },
    { role: "DevOps Engineer", org: "Tomorrowland", period: "2025 — 2026",
      body: "Exploitation de workloads Kubernetes sur AWS pour un trafic d'événement à grande échelle, avec une infrastructure gérée en Terraform et un déploiement continu via ArgoCD.",
      tags: ["AWS", "GitHub", "Kubernetes", "Terraform", "ArgoCD"] },
    { role: "DevOps Engineer", org: "CloudFuel", period: "2024 - 2025",
      body: "Conception et exploitation de plateformes Kubernetes sur Azure pour des workloads .NET, avec une infrastructure Terraform et des déploiements GitOps via ArgoCD.",
      tags: ["Azure", "GitHub", "Kubernetes", "Docker", ".NET", "Terraform", "ArgoCD"] },
    { role: "Junior Cloud Application and Platform Engineer", org: "Inetum-RealDolmen", period: "2023 - 2024",
      body: "Livraison d'applications .NET conteneurisées sur Azure, avec Terraform pour l'infrastructure et des pipelines Azure DevOps pour le build et le release.",
      tags: ["Azure", "Docker", "Azure DevOps", ".NET", "Terraform"] },
  ],
  education: [
    { title: "Informatique appliquée", org: "HoGent, Belgique", period: "2020 - 2023" },
    { title: "Information Management and Security", org: "Thomas More, Belgique", period: "2019 - 2020" },
  ],
  skills: skills({ Infrastructure: "Infrastructure", Cloud: "Cloud", CICD: "CI/CD", Languages: "Langages", Observability: "Observabilité", Data: "Données" }),
  hobbies: [
    { icon: "mountain", title: "Randonnée", detail: "Les sentiers plutôt que le tapis de course — au mieux avec une carte et un mauvais temps." },
    { icon: "board", title: "Snowboard", detail: "Quelques semaines dans les Alpes chaque hiver, à la recherche de poudreuse." },
    { icon: "film", title: "Cinéma", detail: "SF et films contemplatifs. Toujours partant pour une double séance nocturne." },
    { icon: "flame", title: "Cuisine & Barbecue", detail: "À feu doux et lent — au comble du bonheur quand il y a une tablée à régaler." },
  ],
  reading: reading(["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]),
  projects: projects([
    { title: "'t Vijverhof", kind: "Site de restaurant", role: "Design & Dév", desc: "Un site vitrine chaleureux pour le restaurant 't Vijverhof à Erpe-Mere, avec des pages menu, vins et desserts, une galerie photo et un module de réservation en ligne intégré." },
    { title: "Uitvaartbegeleiding Stefaan", kind: "Site vitrine", role: "Design & Dév", desc: "Un site vitrine empreint de sérénité pour une entreprise de pompes funèbres familiale à Brakel, couvrant chaque étape, de la déclaration du décès à la cérémonie, l'aula et le funérarium — avec diffusion en direct à 360° des services." },
  ]),
};

export const I18N = { en: EN, nl: NL, fr: FR };

/* ===================== Provider + hook ===================== */
const LangContext = React.createContext({ lang: "en", setLang: () => {}, C: EN });
export const useT = () => React.useContext(LangContext);

export function LangProvider({ initialLang = "en", children }) {
  // Language is determined by the URL (path-prefix i18n), passed in from the
  // Astro page that server-rendered this app. Starting from that value keeps
  // the SSR HTML and the first client render in agreement (no hydration
  // mismatch) — every localized page SSRs in its own language.
  const [lang, setLangState] = React.useState(I18N[initialLang] ? initialLang : "en");
  React.useEffect(() => {
    document.documentElement.lang = lang;
    // Persisted only as a hint for the language picker / Resume link; the URL,
    // not this value, is the source of truth for which language renders.
    try { localStorage.setItem("mvh-lang", lang); } catch (e) {}
  }, [lang]);
  const setLang = (l) => { if (I18N[l]) setLangState(l); };
  const C = I18N[lang] || EN;
  return React.createElement(LangContext.Provider, { value: { lang, setLang, C } }, children);
}
