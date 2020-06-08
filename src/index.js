import './sass/style.scss'
import './sass/bootstrap.min.css'

const form = document.querySelector(".form")
const section = document.querySelector(".section")
const result_html = `
<article class="card result mb-4">
    <div class="card-header">
        <p class="result__title">Das erste Ergebnis</p>
    </div>
        <div class="card-body result__body">
            <p class="card-text">With supporting text below as a natural lead-in to additional content. With supporting text below as a natural lead-in to additional content.With supporting text below as a natural lead-in to additional content.</p>
        </div>
</article>
`
const count_html = `
    <div class="alert alert-primary" role="alert">
      3 results found!
    </div>
`

form.addEventListener('submit', (ev) => {
    ev.preventDefault()
    const result = document.createElement("article")
    result.innerHTML = result_html
    const count = document.createElement('p')
    count.innerHTML = count_html
    section.appendChild(count)
    section.appendChild(result)
})


