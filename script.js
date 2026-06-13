(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const go = id => document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
  const showToast = message => {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
  };

  // Cinematic boot sequence
  const bootMessages = [
    "> initializing jamim.os",
    "> loading projects",
    "> loading animations",
    "> connecting creativity",
    "> welcome, visitor  ✓"
  ];
  const bootLines = $("#boot-lines");
  bootMessages.forEach((message, index) => setTimeout(() => {
    const line = document.createElement("p");
    line.textContent = message;
    bootLines.appendChild(line);
    if (index === bootMessages.length - 1) setTimeout(() => $("#loader").classList.add("done"), 500);
  }, 260 * (index + 1)));

  // Ambient particles
  const particles = $("#particles");
  for (let i = 0; i < 42; i++) {
    const particle = document.createElement("i");
    particle.className = "particle";
    const size = i % 7 === 0 ? 2 : 1;
    Object.assign(particle.style, {
      left: `${(i * 47) % 100}%`, top: `${(i * 83) % 100}%`,
      width: `${size}px`, height: `${size}px`, animationDelay: `${(i % 8) * .45}s`
    });
    particles.appendChild(particle);
  }

  // Custom cursor, mouse glow, and gentle global parallax
  const cursor = $("#cursor");
  const cursorDot = $("#cursor-dot");
  const mouseGlow = $("#mouse-glow");
  let mouseX = -1000, mouseY = -1000, cursorX = -1000, cursorY = -1000;
  addEventListener("mousemove", event => {
    mouseX = event.clientX; mouseY = event.clientY;
    cursorDot.style.transform = `translate(${mouseX}px,${mouseY}px) translate(-50%,-50%)`;
    mouseGlow.style.transform = `translate(${mouseX - 350}px,${mouseY - 350}px)`;
  }, { passive: true });
  const animateCursor = () => {
    cursorX += (mouseX - cursorX) * .15; cursorY += (mouseY - cursorY) * .15;
    cursor.style.transform = `translate(${cursorX}px,${cursorY}px) translate(-50%,-50%)`;
    requestAnimationFrame(animateCursor);
  };
  animateCursor();
  $$("a,button,.project-card,input").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });

  // Staggered scroll reveals and ambient parallax
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      const siblings = entry.target.parentElement ? $$(".reveal", entry.target.parentElement) : [];
      const index = Math.max(0, siblings.indexOf(entry.target));
      setTimeout(() => entry.target.classList.add("visible"), Math.min(index * 70, 280));
      revealObserver.unobserve(entry.target);
    }
  }), { threshold: .12 });
  $$(".reveal").forEach(el => revealObserver.observe(el));
  addEventListener("scroll", () => {
    if (!reducedMotion) {
      $(".a1").style.transform = `translateY(${scrollY * .08}px)`;
      $(".a2").style.transform = `translateY(${-scrollY * .04}px)`;
    }
  }, { passive: true });

  // Navigation
  $$("[data-go]").forEach(button => button.addEventListener("click", () => go(button.dataset.go)));

  // Role typing / morphing
  const roles = ["Full Stack Developer", "Linux Enthusiast", "Open Source Contributor", "Startup Founder", "AI Explorer", "Product Builder", "Web Architect", "Discord Developer"];
  let roleIndex = 0;
  setInterval(() => {
    const role = $("#typed-role");
    role.classList.add("swap");
    setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      role.textContent = roles[roleIndex];
      role.classList.remove("swap");
    }, 250);
  }, 2300);

  // Reactive avatar
  const avatarStage = $("#avatar-stage");
  const avatar = $("#avatar");
  avatarStage.addEventListener("mousemove", event => {
    if (reducedMotion) return;
    const rect = avatarStage.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
    avatar.style.transform = `translate(${x * 18}px,${y * 18}px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
  });
  avatarStage.addEventListener("mouseleave", () => avatar.style.transform = "");

  // Tilt project cards and make the full surface clickable
  $$(".project-card").forEach(card => {
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    const openCard = () => window.open(card.dataset.url, "_blank", "noopener");
    card.addEventListener("click", event => { if (!event.target.closest("a")) openCard(); });
    card.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") openCard(); });
    card.addEventListener("mousemove", event => {
      if (reducedMotion) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty("--x", `${x * 100}%`);
      card.style.setProperty("--y", `${y * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${(y - .5) * -7}deg) rotateY(${(x - .5) * 7}deg)`;
    });
    card.addEventListener("mouseleave", () => card.style.transform = "");
  });

  // Interactive technology marquee with real destinations
  const technologies = [
    ["Next.js", "https://nextjs.org"], ["React", "https://react.dev"], ["TypeScript", "https://www.typescriptlang.org"],
    ["Tailwind CSS", "https://tailwindcss.com"], ["Linux", "https://kernel.org"], ["Docker", "https://docker.com"],
    ["Vercel", "https://vercel.com"], ["Supabase", "https://supabase.com"], ["PostgreSQL", "https://postgresql.org"],
    ["OpenAI", "https://openai.com"], ["GitHub", "https://github.com"], ["Cloudflare", "https://cloudflare.com"]
  ];
  $("#marquee-content").innerHTML = [...technologies, ...technologies].map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener">✦ ${name}</a>`).join("");

  // GitHub data remains optional so file:// and offline viewing still work
  fetch("https://api.github.com/users/nebulavex")
    .then(response => response.ok ? response.json() : Promise.reject())
    .then(profile => {
      $("#repo-count").textContent = profile.public_repos;
      $("#follower-count").textContent = profile.followers;
    }).catch(() => {});
  const contributionGrid = $("#contrib-grid");
  for (let i = 0; i < 126; i++) {
    const cell = document.createElement("i");
    cell.dataset.level = (i * 17 + i * i * 3) % 5;
    contributionGrid.appendChild(cell);
  }

  // Fully functional fake terminal
  const responses = {
    help: "available: about, projects, skills, github, contact, clear",
    about: "Jamim — developer, founder, builder. Frequently found shipping after midnight.",
    projects: "6 product ecosystems indexed. Scroll up for the visual interface.",
    skills: "React • Next.js • Linux • TypeScript • APIs • Docker • AI",
    github: "Opening github.com/nebulavex ...",
    contact: "onlyjamim@gmail.com • Discord @1wfj",
    "sudo rm -rf /": "Permission denied. Nice try. This portfolio has backups.",
    "hack nasa": "Connection refused: NASA is currently using light mode.",
    "become billionaire": "Step 1: ship. Step 2: repeat. Step 3: still loading...",
    whoami: "visitor@jamim.me — curious builder detected.",
    poweroff: "You cannot power off ambition."
  };
  $("#terminal-form").addEventListener("submit", event => {
    event.preventDefault();
    const input = $("#terminal-input");
    const command = input.value.trim().toLowerCase();
    if (!command) return;
    const body = $("#terminal-body");
    if (command === "clear") $$("p", body).forEach(p => p.remove());
    else {
      const commandLine = document.createElement("p");
      commandLine.className = "cmd"; commandLine.textContent = `❯ ${input.value}`;
      const response = document.createElement("p");
      response.textContent = responses[command] || `command not found: ${command}. Try 'help'.`;
      body.insertBefore(commandLine, event.currentTarget);
      body.insertBefore(response, event.currentTarget);
      if (command === "github") window.open("https://github.com/nebulavex", "_blank", "noopener");
    }
    input.value = ""; body.scrollTop = body.scrollHeight;
  });

  // Searchable command palette
  const palette = $("#palette-wrap");
  const paletteInput = $("#palette-input");
  const actions = [
    ["⌂", "Home", () => go("home")], ["◎", "About", () => go("about")], ["◇", "Projects", () => go("projects")],
    ["⌬", "Skills", () => go("skills")], ["◉", "Open GitHub", () => window.open("https://github.com/nebulavex", "_blank", "noopener")],
    ["✉", "Email Jamim", () => location.href = "mailto:onlyjamim@gmail.com"], ["↗", "Visit Vaultrix", () => window.open("https://vaultrix.shop", "_blank", "noopener")]
  ];
  const renderActions = query => {
    const filtered = actions.filter(action => action[1].toLowerCase().includes(query.toLowerCase()));
    $("#palette-actions").innerHTML = "";
    filtered.forEach(([icon, label, action]) => {
      const button = document.createElement("button");
      button.className = "palette-action"; button.innerHTML = `<span>${icon}</span><span>${label}</span><i>→</i>`;
      button.addEventListener("click", () => { action(); closePalette(); });
      $("#palette-actions").appendChild(button);
    });
  };
  const openPalette = () => { palette.hidden = false; paletteInput.value = ""; renderActions(""); setTimeout(() => paletteInput.focus(), 30); };
  const closePalette = () => palette.hidden = true;
  $("#palette-trigger").addEventListener("click", openPalette);
  palette.addEventListener("click", event => { if (event.target === palette) closePalette(); });
  paletteInput.addEventListener("input", () => renderActions(paletteInput.value));
  addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); palette.hidden ? openPalette() : closePalette(); }
    if (event.key === "Escape") closePalette();
  });
  renderActions("");

  // Magnetic buttons and copy actions
  $$(".magnetic").forEach(element => {
    element.addEventListener("mousemove", event => {
      if (reducedMotion) return;
      const rect = element.getBoundingClientRect();
      element.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .12}px,${(event.clientY - rect.top - rect.height / 2) * .18}px)`;
    });
    element.addEventListener("mouseleave", () => element.style.transform = "");
  });
  $$("[data-copy]").forEach(button => button.addEventListener("click", () => {
    const value = button.dataset.copy;
    navigator.clipboard?.writeText(value).catch(() => {});
    showToast(`${value} copied to clipboard`);
  }));

  // Konami code easter egg
  let sequence = [];
  const konami = "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba";
  addEventListener("keydown", event => {
    sequence = [...sequence, event.key].slice(-10);
    if (sequence.join("") === konami) showToast("FOUNDER MODE UNLOCKED ✦");
  });
})();
