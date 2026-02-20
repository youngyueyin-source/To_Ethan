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
    title: "i am always here for you.",
    envelope: "images/paper.jpg",
    body: `
      <p>if you shoot me a text, i'll reply as soon as i can. if you call me, i'll pick up. no hesitation. you are my priority and you always will be. I love you so dearly.</p>
      <p>and besides me, there are so many other people who love you too. i've seen it with my own eyes. your family loves you so much. i see it in the way they talk with you, even when they bicker. i see it in the way they laugh with you. in the way they make sure you're fed every single day without fail. it's such a soft and constant kind of love. sometimes i get jealous of it, if i'm being honest.</p>
      <p>and your friends, you have great ones. whether you're playing board games, going on runs, or locked in on val/any video game like the competitive king you are, i can tell you feel alive with them. i'm grateful you have people who make your days feel more colorful, who remind you how fun life can be.</p>
      <p>you are never alone, ethan, because there are so many people who love you and care about you. and do you know why?</p>
      <p>because you are amazing.</p>
      <p>because you are kind.</p>
      <p>because you are thoughtful and funny and smart.</p>
      <p>because you make people feel safe and seen.</p>
      <p>that is why.</p>
      <p>you are so deeply loved. by them, and especially by me.</p>
      <h2>love, jade .✦ ݁˖</h2>
    `
  },
  miss: {
    title: "i’m right here.",
    envelope: "images/paper.jpg",
    body: `
      <p>although i may not be with you in person right now, i truly believe that no. matter the distance between us, we carry each other in our hearts. you are in my every thought, woven into my every plan. every decision i make ultimately leads to one goal: us, one day, living side by side so we won't have to miss each other like this anymore.</p>
      <p>so when you miss me, take a moment and sit with that feeling. let it be sweet instead of heavy. because one day, it won't be distance you feel. instead you will feel my arms around you and a kiss on your beautiful head.</p>
      <p>imagine coming home from work to dinner on the table and a glass of wine waiting for you. imagine me there, geeking, ready to hug you the second you walk through the door, kissing you like i've been waiting all day – because i have.</p>
      <p>imagine our nights. showering/taking a bath together, laughing about our day, playing video games side by side, winding down together. falling asleep in each others arms with the soft sound of the tv in the background. your hand finding mine without thinking.</p>
      <p>imagine waking up and going to the gym together, or stepping out for a quiet morning walk. we'll build routines that are ours. ordinary days will feel extraordinary because we are sharing them. this is how i picture our future. simple. warm. full of us.</p>
      <p>i know you miss me because i feel it too. whenever we're apart, i ache to feel your touch, to hear your voice, and to smell your scent. you make everything feel safe.</p>
      <p>hold onto this: one day, you won't have to miss me like this. one day, i'll be apart of your everyday, and you'll be mine.</p>
      <h2>love, jade .✦ ݁˖</h2>
    `
  },
  laugh: {
    title: "ok stop 😭",
    envelope: "images/paper.jpg",
    body: `
      <p>this is your reminder that no matter how cool, calm, and collected you think you are... you've witnessed me 10x cooler in 4k.</p>
      <p>lets revisit salt & straw</p>
      <p>the cashier literally saluted us. no words. just 🫡</p>
      <p>and you, trying to be polite and majestic, said “have a good day.”</p>
      <p>and i, with absolutely zero survival instincts, said "you too."</p>
      <p>YOU TOO?!</p>
      <p>it was widdaly so embarrassing i think my soul left my body and hovered above for 3-5 business days.</p>
      <p>and the way we stood there buffering like two npc characters for a few secs...cinematic.</p>
      <p>speaking of cinematic... lets talk about tahoe.</p>
      <p>you skiing down the mountain so perfectly. controlled. elegant. slightly carving down the slope like you're in a winter sports commerical.</p>
      <p>then you stop, turn around to look at me</p>
      <p>and i am eating shit on my snowboard. like fully horizontal. snow flying everywhere. limbs in unknown places.</p>
      <p>but i'd like to believe that i eat shit gracefully.</p>
      <p>and the way you stand there watching the struggle like a proud but slightly concerned boyfriend. i felt it, thats love.</p>
      <p>you: alpine prince. me: saddam hussein in the snow.</p>
      <p>i love that we can be embarassing together and laugh about it.</p>
      <p>so if you ever feel too serious or overwhelmed. remember that:</p>
      <p>you once got saluted by an ice cream employee.</p>
      <p>and you once watched your girlfriend descend a mountain in ways that defy physics.</p>
      <p>and we survived both.</p>
      <p>power couple.</p>
      <h2>love, jade .✦ ݁˖</h2>
    `
  },
  mad: {
    title: "let’s fix it.",
    envelope: "images/paper.jpg",
    body: `
      <p>write your “when you’re mad” letter here.</p>
      <h2>love, jade .✦ ݁˖</h2>
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