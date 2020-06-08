import './sass/style.scss'
import './sass/bootstrap.min.css'
import Solr from "./solr"

const form = document.querySelector(".form")
const section = document.querySelector(".section")
const input = document.querySelector(".input")

    form.addEventListener('submit', async (ev) => {
        ev.preventDefault()
        const solr = new Solr();
        try {
            const results = await solr.search(input.value)
            const count = document.createElement('p')
            count.innerHTML = getCountHTML(results.numFound)
            section.appendChild(count)
            for (const [i, doc] of results["docs"].entries()) {
                const result = document.createElement("article")
                result.innerHTML = getResultHTML(doc)
                section.appendChild(result)
            }
        } catch (e) {
            console.error(e);
        }
    })

function getResultHTML(doc) {
    return `
    <article class="card result mb-4">
        <div class="card-header">
            <p class="result__title">${doc.title_t}</p>
        </div>
            <div class="card-body result__body">
                <p class="card-text">${doc.text_t}</p>
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


