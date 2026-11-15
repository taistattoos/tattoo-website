# Updating Your Website — A Quick Guide 🐈‍⬛

Hi! This is your guide for changing things on your website yourself — photos, text, reviews — without needing to ask anyone for help. It only takes a minute once you're used to it.

---

## Where you go to make changes

Your website has a secret little back door just for you:

**taistattoos.com/admin**

Bookmark that page — that's your control panel.

---

## Logging in (only the first time is a bit different)

1. Go to the `/admin` link above.
2. Click **"Login with GitHub."**
3. If this is your very first time, it'll ask you to log into GitHub
4. After that, your browser usually remembers you, so most days you'll just land straight in.

---

## Adding a new tattoo photo to your gallery

1. Log into `/admin`.
2. Click **"Gallery"** on the left.
3. Click **"New Gallery photo"** (or the **+** button).
4. Fill in:
   - **Title** — just a short name for the piece, like "Rose forearm" — one box per language (English, Serbian, Russian). English is enough if you're in a rush, you can always add the others later.
   - **Image** — click the box, choose a photo from your phone or computer.
   - **Image description** *(optional, but worth it)* — one sentence describing the photo, like "Japanese koi sleeve, black and grey, on the forearm". This is how Google Images finds your work. If you skip it, the title is used instead.
   - **Category** — tick whatever fits (Japanese, black & grey, etc.)
   - **Featured on homepage** — turn this on if you want this specific photo to show up on your homepage. Leave it off for photos that only live in the full gallery.
5. Scroll up, click the green **"Publish"** button in the top corner.

**That's the step people forget** — if you don't click Publish, it stays as a private draft and nobody sees it but you. Always publish.

Give it about a minute after publishing before checking the live site — it needs a moment to update.

---

## Changing the text on your homepage

1. Log into `/admin`.
2. Click **"Home Page."**
3. You'll see boxes for things like your headline, your intro sentence, and your button text — each one has separate boxes for English, Serbian, and Russian.
4. Change whatever you like. You don't have to fill in every language right away — if a box is empty, the site just shows the English version instead, so nothing looks broken.
5. Click **"Publish"** when you're happy with it.

---

## Adding a client review / testimonial

1. Log into `/admin`.
2. Click **"Testimonials."**
3. Click **"New Testimonial."**
4. Fill in:
   - **Client Name** — first name, or first name + last initial ("Ana M.")
   - **Date** — when they wrote it. The newest reviews show first.
   - **Rating** — out of 5
   - **Source** — where it's from, like "Instagram" or "iNKPPL"
   - **Original language** — the language the client wrote in
   - **Quote** — exactly what they said, in their language
   - **Translations** *(optional)* — if you add them, visitors reading the site in another language see the translation, with a small "Translated from …" note. If you skip them, everyone sees the original.
5. Publish.

The home page shows the 6 newest reviews, with a button to open the rest.

---

## Adding photos to "How booking works"

The booking steps can show photos. On computers the photo sits beside the steps and changes as visitors scroll; on phones each photo appears under its own step.

1. Log into `/admin` → **"How booking works."**
2. Open a step and use **Image** to pick a photo. Add a short **Image description** too.
3. Publish.

**Best photos, ideally all from one real project:**
- **Step 1 – Your idea:** the client's references or a moodboard
- **Step 2 – Consultation:** you at the desk, sketchbook out, or marking placement
- **Step 3 – The design:** the finished sketch (the most important one!)
- **Step 4 – The session:** the healed tattoo, or you tattooing it

Portrait photos (taller than wide) look best. You can start with just one or two; steps without a photo keep showing the previous one. If no step has a photo, the section simply shows the steps on their own.

---

## Changing the video at the top of the home page

Big videos make the site slow, and Google ranks slow sites lower, so shrink it first with **HandBrake** (free):

1. Open your video in HandBrake.
2. Preset: **Web → Creator 720p30**.
3. **Audio** tab: remove all tracks (the video plays without sound anyway).
4. **Summary** tab: tick **Web Optimized**.
5. Start Encode. Aim for **under 3 MB**. If it's bigger, raise **Constant Quality RF** on the Video tab to 26–28 and encode again.

Then in `/admin` → **Home Page**, upload it under **Hero video**. For a poster, open the video in VLC, pause on a nice frame, use **Video → Take Snapshot**, and upload that picture under **Hero poster image**. Visitors see it instantly while the video loads.

---

## A few things worth knowing

- **Nothing you do here can "break" the website.** Worst case, something looks a little off for a minute — it's never permanent, and it's always fixable.
- **If you're not sure, don't publish yet.** Changes only go live once you hit Publish — until then, feel free to poke around and see what a field does.
- **Uploading a photo takes a few seconds**, especially if it's a big file straight from your phone. That's normal, just wait for it to finish before publishing.
- If something ever looks genuinely broken, or a page won't load, just message [your dev] — it's almost always a 30-second fix on their end, not something you did wrong.

---

## Things that are *not* for you to touch (yet)

There are a few settings pages in your website's code — you won't see these in `/admin`, so don't worry about them. That side of things is handled by [your dev]. Your whole world lives inside that `/admin` page — if you can't find it in there, you probably don't need to touch it.

---

That's genuinely most of it. Once you've added one photo and edited one bit of text, you'll have basically seen the whole system — it repeats the same pattern everywhere. 🩶

---

<sub>Website designed and built by **Daniel Cikora**. Technical documentation for developers: [docs/TECHNICAL.md](docs/TECHNICAL.md).</sub>
