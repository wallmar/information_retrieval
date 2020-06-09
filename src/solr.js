export default class Solr {
    constructor(solrUrl = "http://localhost:8983/solr/movie-club") {
        this.solrUrl = solrUrl;
    }
    
    async search(query, from, to, start = 0, rows = 10) {
        if (from === "") from = 0;
        if (to === "") to = 3000;
        return await this.postSolrRequest("select", {
            params: {
                fl: "*,score",
                start,
                rows,
                fq: `year_i:[${from} TO ${to}]`,
                hl: "on",
                "hl.simple.pre": "<span class='hl'>",
                "hl.simple.post": "</span>",
                stopwords: "true",
            },
            query: {
                edismax: {
                    query,
                    qf: "title_txt_en^10 plot_txt_en^5",
                    mm: "100%",
                },
            },
        });
    }

    async postSolrRequest(url, body) {
        const jsonResponse = await fetch(`${this.solrUrl}/${url}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: { "Content-Type": "application/json" },
        });

        if (!jsonResponse.ok) {
            throw new Error(jsonResponse.statusText);
        }

        const response = await jsonResponse.json();
        return response;
    }
}
