/**
 * Created by ub on 6/6/14.
 *
 * @see http://www.neo4j.org/console_assets/javascripts/cypher.js
 */

Polymer('search-bar', {
    publish: {
        mode: "simple",
        query: "",
        model: {}
    },

    clauses: [
        {
            "id": "a",
            "type": "node",
            "model": "Person",
            "filter": ""
        }
    ],

    nodes: [ ],
    links: [ ],
    selected: 0, // node or relation
    nextId: 97,

    ready: function () {
        this.nodes = Object.keys(this.model.nodes);
        this.links = Object.keys(this.model.links);
    },


    addClause: function (event, detail, sender) {
        // TODO: dynamic name generation
        this.nextId = this.nextId + 1;
        var c = {
            "id": String.fromCharCode(this.nextId),
            "type": "node",
            "model": "Person",
            "filter": ""
        };

        this.clauses.push(c);
    },

    buildQuery: function () {
        var s = "";

        for (var i = 0; i < this.clauses.length; i++) {
            var c = this.clauses[i];
            if (c.type == "node") {
                s = s + "(";
                s = s + c.id + ":" + c.model;

                if (c.filter.length > 0) {
                    s = s + "{";
                    s = s + c.filter;
                    s = s + "}";
                }
                s = s + ")";
            }
        }

        this.query = s;
    },

    find: function (event, detail, sender) {
        event.preventDefault();

        if (this.mode == "cypher") {
            this.buildQuery();
        }

        console.log("Query: " + this.query);

        // TODO: хайлтын query-г дамжуулах
        this.fire(event, detail);
    },

    toggleCypher: function (event, detail, sender) {
        this.mode = (this.mode == 'simple' ? 'cypher' : 'simple');
    },

    isCypher: function () {
        return this.query && this.query.match(/\b(start|merge|match|foreach|drop|create|delete|relate|return)\b/i);
    },

    send: function (query) {
        if (this.isCypher(query)) {
            post("console/cypher" + getPostQueryParams(), query, showResults, "json");
        }
        else {
            post("console/geoff", query, function () {
                viz();
            });
        }
    },

    post: function (uri, data, done, dataType) {
        data = data.trim();
        // console.log("Post data: " + data);
        $.ajax(uri, {
            type: "POST",
            data: data,
            dataType: dataType || "text",
            beforeSend: setSessionHeader,
            success: function (data) {
                if (dataType == "text") {
                    append($("#output"), data);
                }
                if (done) {
                    done(data);
                }
            },
            error: function (data, error) {
                append($("#output"), "Error: " + error + "\n" + data.responseText + "");
            }
        });
    },

    append: function (element, text, doHighlight) {
        if (!text) {
            return;
        }
        if (typeof ( text ) == 'object') {
            text = JSON.stringify(text);
        }

        text = "\n" + text;
        if (doHighlight) {
            text = highlight(text);
        }
        element.append($("<span class='textblock'>" + text + "</span>"));
        element.prop("scrollTop", element.prop("scrollHeight") - element.height());
    }

});