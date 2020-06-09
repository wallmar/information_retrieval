import './sass/style.scss'
import './sass/bootstrap.min.css'
import Solr from "./solr"

const form = document.querySelector(".form");
const section = document.querySelector(".section");
const input = document.querySelector(".input");
const from = document.querySelector(".from");
const to = document.querySelector(".to");


form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    resetResults();
    const solr = new Solr();
    try {
        const response = await solr.search(input.value, from.value, to.value);
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
})

function getResultHTML(doc, highlighting) {
    return `
    <article class="card result mb-5">
        <div class="card-header">
            <p class="result__title">${highlighting.title_txt_en ? highlighting.title_txt_en[0] : doc.title_txt_en}</p>
        </div>
        <div class="card-header">
            Genre: ${doc.genres} <br> Year: ${doc.year_i} <br> Runningtime: ${doc.runningtime_t} min        
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

function resetResults() {
    const articles = document.querySelectorAll(".result");
    const count = document.querySelector(".count");
    if (count)
        count.remove();
    articles.forEach(article => article.remove())
}


