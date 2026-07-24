# Hope After Heart Failure — Website

A single-page website recreating the home page of HopeAfterHeartFailure.com.

## What's in this folder
- `index.html` — the whole page (all sections)
- `styles.css` — all the styling (colors, fonts, layout)
- `images/` — drop your real photos here (see `images/README.txt`)

To preview it on your own computer, just double-click `index.html` — it opens in
your web browser. No software needed.

---

# How to publish this for free (GitHub + Netlify)

You'll do two things: (1) put these files on GitHub, then (2) connect GitHub to
Netlify so it goes live on the internet. Total time: about 15 minutes. No coding.

## Part 1 — Put the files on GitHub

1. Go to **https://github.com** and sign in. If you don't have an account, click
   **Sign up** and create one (it's free).

2. In the top-right corner, click the **+** icon, then **New repository**.

3. Fill in the form:
   - **Repository name:** `hope-after-heart-failure` (or any name you like)
   - Leave it set to **Public**.
   - Do **not** check "Add a README file" (you already have one).
   - Click the green **Create repository** button.

4. On the next page, look for the link that says **"uploading an existing file"**
   (it's in the line: *"…or upload an existing file"*). Click it.

5. Open the folder of files on your computer. Select **everything inside it** —
   `index.html`, `styles.css`, the `README.md`, and the `images` folder — and
   **drag them onto the GitHub upload page**. Wait for them to finish uploading.

6. Scroll down and click the green **Commit changes** button.

Your files are now on GitHub. 🎉

## Part 2 — Make it live with Netlify

1. Go to **https://www.netlify.com** and click **Sign up**.

2. Choose **"Sign up with GitHub"** and approve the connection when asked. This
   lets Netlify see your GitHub repositories.

3. Once you're in the Netlify dashboard, click **Add new site** →
   **Import an existing project**.

4. Click **Deploy with GitHub**. If prompted, authorize Netlify again.

5. From the list of your repositories, click the one you just made
   (`hope-after-heart-failure`).

6. Netlify will show some build settings. **You can leave them all blank/default**
   — this is a plain HTML site with nothing to "build." Just scroll down and
   click **Deploy site**.

7. Wait about a minute. Netlify will show a link near the top that looks like
   `https://random-name-12345.netlify.app`. **Click it — your site is live!**

## Optional: give it a nicer web address

- **Free Netlify subdomain:** In Netlify, go to **Site configuration** →
  **Change site name**, and pick something like `hopeafterheartfailure`. Your
  address becomes `https://hopeafterheartfailure.netlify.app`.

- **Your own domain** (e.g. the real `hopeafterheartfailure.com`): In Netlify go
  to **Domain management** → **Add a domain**, type your domain, and follow the
  on-screen steps. (You buy a domain separately from a registrar like Namecheap
  or Google Domains; Netlify then tells you exactly what to change there.)

## Making changes later

Edit `index.html` or `styles.css`, then upload the changed file to GitHub the
same way as Part 1, step 4–6 (GitHub lets you upload a file with the same name to
replace it). Netlify automatically detects the change and updates your live site
within a minute — no extra steps.

---

## A note on the images
The real book cover, author photo, and community photo are now saved in the
`images/` folder and referenced in `index.html` — no more placeholders.
