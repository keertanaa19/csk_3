# CSKPF Consulting Services website

Static site: HTML5, CSS3, vanilla JavaScript. No build step, backend, database or login.

## Folder structure
```
cskpf-website/
  index.html  services.html  about.html  contact.html
  css/styles.css        all styling and brand colours (see :root)
  js/config.js          EDIT FIRST: phone, email, WhatsApp, address, hours, form key
  js/main.js            mobile menu, contact details, form validation
  assets/logo.png, favicon.png   logo and favicon made from the supplied logo
  robots.txt  sitemap.xml  vercel.json  _headers (Cloudflare only)  .gitignore
  README.md
```

## 1. Open in VS Code and run locally
1. Install VS Code, then File > Open Folder and choose `cskpf-website`.
2. Install the "Live Server" extension, right-click `index.html`, choose "Open with Live Server".
   Or, in the VS Code terminal: `python -m http.server 8000` then open http://localhost:8000
3. Search the project for `REPLACE`, `CONFIRM`, `EDIT`, `YOUR-DOMAIN` and `[` to find every placeholder.

## 2. What you must replace
- `js/config.js`: phone, WhatsApp number, email, address, hours.
- Every page: replace `YOUR-DOMAIN.com` (canonical and social tags); also in `robots.txt` and `sitemap.xml`.
- `about.html`: company story and team boxes (dashed placeholders).
- `index.html`: FAQ answers marked `[EDIT ...]`, and the "Why choose us" list (keep only what is true).
- `services.html` and the cards on `index.html`: services are already filled in from the company materials; reword or remove any that do not apply.
- `js/config.js`: check the WhatsApp number and add working hours.
Do not add statistics, testimonials, certifications or experience claims unless you can prove them.

## 3. Connect the enquiry form (Web3Forms)
1. Go to https://web3forms.com, enter the email that should receive enquiries, and copy the access key sent to you.
2. Paste it into `web3formsAccessKey` in `js/config.js`.
3. Test from the live site. The key is meant to be public in front-end code; in the Web3Forms dashboard you can restrict it to your domain.
Until a key is set, the form does NOT send anything. It validates the entries, says so plainly, and offers
"Send on WhatsApp" and "Send by email" buttons with the details filled in.

## 4. Upload to GitHub
Unzip, open the `cskpf-website` folder in VS Code, then in its terminal:
```
git init
git add .
git commit -m "Initial CSK PF website"
git branch -M main
# create an EMPTY repository on github.com first (no README), then:
git remote add origin https://github.com/YOUR-USERNAME/cskpf-website.git
git push -u origin main
```
The site files (`index.html` etc.) must sit at the top level of the repository, as they do here.

## 5. Deploy on Vercel
IMPORTANT: Vercel's free Hobby plan is limited to non-commercial personal use. A website that promotes a paid consulting business counts as commercial, so Vercel asks for a Pro plan. See https://vercel.com/docs/limits/fair-use-guidelines or ask Vercel support if unsure. If you want a free host for a business site, use section 6 instead.
1. Sign in at https://vercel.com with your GitHub account.
2. Add New > Project > Import your `cskpf-website` repository.
3. Framework Preset: Other. Build Command and Output Directory: leave empty. Root Directory: `./`.
4. Click Deploy. You get a `your-project.vercel.app` address, and every `git push` to `main` redeploys.
`vercel.json` already turns on clean URLs (`/services` instead of `/services.html`) and basic security headers.

## 6. Deploy on Cloudflare Pages (free alternative)
1. Cloudflare dashboard > Workers & Pages > Create > Pages > Connect to Git; choose the repository.
2. Framework preset: None. Build command: empty. Build output directory: `/`.
3. Save and Deploy. Check Cloudflare's current free-plan terms for commercial use.

## 7. Custom domain
- Vercel: Project > Settings > Domains > Add, enter your domain, then create the DNS records Vercel shows at your domain provider.
- Cloudflare Pages: Project > Custom domains > Set up a custom domain.
After the domain works, replace `YOUR-DOMAIN.com` in every page, `robots.txt` and `sitemap.xml`, and push again.
Dashboard labels change occasionally; follow the host's own docs if one differs.
