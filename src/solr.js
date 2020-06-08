/* TODO: Configure which field names Solr should use for title and text. */
export const TITLE_FIELD = "title_t";
export const TEXT_FIELD = "text_t";

export default class Solr {
    constructor(solrUrl = "http://localhost:8983/solr/simplewiki") {
        this.solrUrl = solrUrl;
    }
    
    async search(query, start = 0, rows = 10) {
        return await this.postSolrRequest("select", {
            params: {
                fl: "*,score",
                start,
                rows,
                /* TODO: Put further common query parameters (https://lucene.apache.org/solr/guide/common-query-parameters.html) here. */
            },
            query: {
                edismax: {
                    query,
                    qf: `${TITLE_FIELD}^100 ${TEXT_FIELD}^5`,
                    mm: "100%",
                    /* TODO: Put further edismax query parameters (https://lucene.apache.org/solr/guide/8_5/the-extended-dismax-query-parser.html) here. */
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
        return response.response;
    }
}
