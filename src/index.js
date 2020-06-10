import './sass/style.scss'
import './sass/bootstrap.min.css'
import Solr from "./solr"

const form = document.querySelector(".form");
const section = document.querySelector(".section");
const input = document.querySelector(".input");
const from = document.querySelector(".from");
const to = document.querySelector(".to");
const genres = document.querySelector(".genres");

const solr = new Solr();

form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    displayResults();
});

form.addEventListener('reset', () => {
    resetResults();
});

document.addEventListener("DOMContentLoaded",async () => {
    try {
        const genres_res = await solr.getGenres();
        const fields = genres_res.facet_counts.facet_fields.genres;
        const genres_obj = {};
        for(let i = 0; i < fields.length; i += 2) {
            if(fields[i] === "sci")
                fields[i] = "sci-fi";
            if(fields[i] === "fi")
                continue;
            genres_obj[fields[i]] = fields[i + 1];
        }
        for (const [genre, count] of Object.entries(genres_obj)) {
            const node = document.createElement("div");
            node.classList.add("form-check");
            node.classList.add("genre-item");
            node.innerHTML = getGenreHTML(genre, count);
            genres.appendChild(node);
        }
    }
    catch (e) {
        console.error(e);
    }
    genres.childNodes.forEach(genre => {
        genre.firstElementChild.addEventListener('change', () => {
            resetResults();
            displayResults();
        });
    });
});

function getResultHTML(doc, highlighting) {
    return `
    <article class="card result mb-5">
        <div class="card-header">
            <p class="result__title">${highlighting.title_txt_en ? highlighting.title_txt_en[0] : doc.title_txt_en}</p>
        </div>
        <div class="card-header">
            ${doc.genres ? `<br>Genre: ${doc.genres.join(', ')}` : ""}<br> Year: ${doc.year_i} ${doc.runningtime_t ? `<br>Runningtime: ${doc.runningtime_t} min` : ""}       
        </div>
        <div class="card-body result__body">
            <p class="card-text">${highlighting.plot_txt_en ? highlighting.plot_txt_en[0] : ""}</p>
        </div>
        <button class="btn btn-primary" type="button" data-toggle="collapse" data-target="#collapse${doc.id}" aria-expanded="false" aria-controls="collapseExample">
            Plot (Spoiler)
        </button>
        <div class="collapse" id="collapse${doc.id}">
          <div class="card card-body">
            ${doc.plot_txt_en}
          </div>
        </div>
    </article>
    `
}

function getCountHTML(count) {
    return `
    <div class="alert alert-primary" role="alert">
        ${count} results found!
    </div>
    `
}

function getGenreHTML(genre, count) {
    return `
        <input type="checkbox" class="form-check-input genre-input" value="${genre}" id="${genre}">
        <label class="form-check-label genre-label" for="${genre}">${genre.toUpperCase()} (${count})</label>   
    `
}

function resetResults() {
    const articles = document.querySelectorAll(".result");
    const count = document.querySelector(".count");
    if (count)
        count.remove();
    articles.forEach(article => article.remove())
}

function getCheckedGenres() {
    const children = genres.childNodes;
    const checked = [];
    children.forEach(genre => {
        if(genre.firstElementChild.checked)
          checked.push(genre.firstElementChild.value)
    });
    return checked;
}

async function displayResults() {
    resetResults();
    try {
        const checkedGenres = getCheckedGenres();
        const response = await solr.search(input.value, from.value, to.value, checkedGenres);
        const count = document.createElement('p');
        count.classList.add('count');
        count.innerHTML = getCountHTML(response.response.numFound);
        section.appendChild(count);
        for (const [i, doc] of response.response["docs"].entries()) {
            const result = document.createElement("div");
            result.innerHTML = getResultHTML(doc, response.highlighting[doc.id]);
            section.appendChild(result);
        }
    } catch (e) {
        console.error(e);
    }
}


