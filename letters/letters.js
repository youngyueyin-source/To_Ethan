// ---------- carousel arrows ----------
const carousel = document.querySelector(".carousel");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

const scrollByCard = (dir) => {
  if (!carousel) return;
  const card = carousel.querySelector(".card");
  if (!card) return;

  const gap = 14;
  const amount = card.getBoundingClientRect().width + gap;
  carousel.scrollBy({ left: dir * amount, behavior: "smooth" });
};

if (prevBtn) prevBtn.addEventListener("click", () => scrollByCard(-1));
if (nextBtn) nextBtn.addEventListener("click", () => scrollByCard(1));

// ---------- modal logic ----------
const overlay = document.querySelector(".overlay");
const closeBtn = document.querySelector(".close");
const titleEl = document.querySelector("#letterTitle");
const bodyEl = document.querySelector("#letterBody");

// IMPORTANT: update these image paths to match your folder.
// If your envelope images are just in /images/, use "../images/sad.jpg", etc.
const letters = {
  sad: {
    title: "hey love,",
    envelope: "images/paper.jpg",
    body: `
      <p>if you're reading this, i'm guessing today feels heavier than usual. i'd like you to know something first: i am always there for you. not just when it's easy, not just when you're happy, but especially when things feel hard. you never have to carry anything alone.</p>
      <p>your smile is what lifts me up. even on days when you don't feel like smiling, the thought of it means everything to me. it's one of my favorite things in the world. when you're happy i feel lighter too. but even when you're not, i still choose you.</p>
      <p>you have so much ahead of you. so many things to look forward to, so many moments you haven't seen yet. and i promise you, i'll be there with you all along the way. through all the uncertaintly, through the growth, through the wins and the losses, through the confusing days. i am not going anywhere.</p>
      <p>you are so smart. the way your mind works, the way you think through things, and the way you teach me things – i'm always in awe of you. i've learned so much from you. you're also sooo handsome, in ways you probably don't even realize. your personality? perfection. i see the small ways you care and the ways you try. you have a quiet strength that means more than you know</p>
      <p>if today feels overwhelming, it's okay. let it. you're allowed to feel. just remember that this moment will not define you. and remember that i'm right here beside you. always.</p>
      <h2>love, jade .✦ ݁˖</h2>
    `
  },
  lonely: {
    title: "come here.",
    envelope: "images/paper.jpg",
    body: `
      <p>write your lonely letter here.</p>
      <p>love, jade .✦ ݁˖</p>
    `
  },
  miss: {
    title: "i’m right here.",
    envelope: "images/paper.jpg",
    body: `
      <p>write your miss me letter here.</p>
      <p>love, jade .✦ ݁˖</p>
    `
  },
  laugh: {
    title: "ok stop 😭",
    envelope: "images/paper.jpg",
    body: `
      <p>put an inside joke, something funny, or a mini roast.</p>
      <p>love, jade .✦ ݁˖</p>
    `
  },
  mad: {
    title: "let’s fix it.",
    envelope: "images/paper.jpg",
    body: `
      <p>write your “when you’re mad” letter here.</p>
      <p>love, jade .✦ ݁˖</p>
    `
  },
};

const openModal = (key) => {
  const data = letters[key];
  if (!data) return;

  titleEl.textContent = data.title;
  bodyEl.innerHTML = data.body;

  // set envelope background for modal
  document.documentElement.style.setProperty(
    "--envelope-url",
    `url("${data.envelope}")`
  );

  overlay.classList.add("is-open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  overlay.classList.remove("is-open");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

// open when clicking a card
document.querySelectorAll(".card[data-letter]").forEach((btn) => {
  btn.addEventListener("click", () => openModal(btn.dataset.letter));
});

// close actions
closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay.classList.contains("is-open")) closeModal();
});