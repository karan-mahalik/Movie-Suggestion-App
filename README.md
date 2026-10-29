# Movie Suggestion App

**🌐 Professional portfolio:** [Karan Mahalik — Data Analyst & Power BI Developer](https://karan-mahalik-portfolio.vercel.app/)

A React/Vite movie discovery interface that retrieves movie information from the OMDb API. The source includes search, genre-based discovery, IMDb rating and release-year sorting, random keyword suggestions, and a local list of liked movie titles.

**Career relevance:** Supports Karan's data-focused profile by demonstrating use of externally retrieved structured data, client-side filtering and sorting, and UI development. It is **not** a data analytics dashboard or a deployed BI project.

## Technologies

- React, Vite, JavaScript and CSS
- OMDb movie API
- Browser localStorage for liked movie titles

## Run locally

```bash
git clone https://github.com/karan-mahalik/Movie-Suggestion-App.git
cd Movie-Suggestion-App
npm install
npm run dev
```

Available scripts include `npm run build`, `npm run lint` and `npm run preview`. No runtime validation is claimed here.

## Configuration and deployment caution

- The current app source embeds an **OMDb API key in browser-facing code**. Treat that value as public; check its provider restrictions, usage and rotation requirements. Do not place private secrets in a browser bundle.
- `package.json` contains a placeholder homepage URL and a `gh-pages` deployment script targeting `build`, although Vite typically outputs `dist`. These deployment settings need correction and testing before publishing a GitHub Pages link.
- There is no independently verified live demo or screenshot included here.

## Potential analytical extensions

For a data-focused portfolio, an optional future enhancement would be a reproducible exploration of movie ratings by genre and year, with validated source definitions and clearly documented results.

## Author

[Karan Mahalik](https://github.com/karan-mahalik) · [LinkedIn](https://www.linkedin.com/in/karan-mahalik-122438369/)
