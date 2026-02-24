var SparqlQueries = (function () {
    var self = {};


    self.getRefOntologyClasses = function (refOntologogySource, callback) {

        var graphUri = Config.sources[refOntologogySource].graphUri
        var query = "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
            "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
            "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
            "SELECT * from <" + graphUri + "> WHERE {\n" +
            "  ?id rdf:type owl:Class.?id rdfs:label ?label.\n" +
            "      optional{\n" +
            "    ?subClass rdfs:subClassOf ?id.\n" +
            "    ?subClass rdfs:label ?subClassLabel\n" +
            "  }\n" +
            "  \n" +
            "} "


        self.execQuery(refOntologogySource, query, callback)



    }


    self.getClassIndividuals = function (source, classUri, callback) {
        var graphUri = Config.sources[source].graphUri
        var query = "PREFIX owl: <http://www.w3.org/2002/07/owl#>\n" +
            "PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n" +
            "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
            "SELECT * from <" + graphUri + "> WHERE {\n" +
            "  ?id rdf:type <" + classUri + "> .?id rdfs:label ?label.\n" +
            "      optional{\n" +
            "    ?id owl:hasPart ?part.\n" +
            "    ?part rdfs:label ?partLabel\n filter (?id!=?part)" +
            "  }\n" +
            "  \n" +
            "} "


        self.execQuery(source, query, callback)


    }
    self.execQuery = function (source, query, callback) {
        if (true) {
            console.log(query)
        }
        var url = Config.sources[source].sparql_server.url + "?format=json&query=";

        var resultSize = 1;
        var data = [];
        var limit = 10000;
        var offset = 0
        async.whilst(
            function (callbackTest) {
                if (offset > 0 && query.toLowerCase().indexOf("by") > -1) {
                    return false;
                }
                return resultSize > 0;
            },

            function (callbackWhilst) {
                if (query.indexOf("by") < 0) {
                    var query2 = query + " limit " + limit + " offset " + offset
                } else {
                    query2 = query
                }

                Sparql_proxy.querySPARQL_GET_proxy(url, query2, "", {source: source}, function (err, result) {
                    if (err) {
                        return callbackWhilst(err);
                    }


                    data = data.concat(result.results.bindings);
                    resultSize = result.results.bindings.length;
                    offset += limit;
                    callbackWhilst()

                });
            }, function (err) {
                if (err) {
                    return callback(err)
                }

                /* if (result.results.bindings.length >= 10000) {
                     ;//  return (alert(" filter more precisely, too much data returned "));
                 }*/
                UI.message("", true);
                callback(null, data);
            })
    };

    return self;

})()

export default SparqlQueries;
window.SparqlQueries = SparqlQueries