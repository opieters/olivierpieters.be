function Get(yourUrl){
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
};

var pagesIndex = JSON.parse(Get("/js/lunr/PagesIndex.json"));

var index = lunr(function () {
    this.field("title", { boost: 10 });
    this.field("tags", { boost: 5 });
    this.field("date");
    //this.field("summary");
    this.field("href");
    this.field("content");

    // ref is the result item identifier (I chose the page URL)
    this.ref('id');

    pagesIndex.forEach(function (page) {
        this.add(page);
    }, this)
});


var input = document.getElementById("search");
var resultsdiv = document.getElementById("results");

input.onkeyup = function () {
    // Search for it
    var result = index.search(input.value);
    // Show results
    resultsdiv.innerHTML = "";
    // Add status
    var p = document.createElement("p");
    p.className = "search-count"
    p.appendChild(document.createTextNode('Found ' + result.length + ((result.length>1 || result.length==0)  ? " results" : " result") ))
    resultsdiv.appendChild(p);
    // Loop through, match, and add results
    for (var item in result) {
        var ref = result[item].ref;
        var entry = pagesIndex[ref];
        var searchitem = document.createElement("div");
        searchitem.className = "result";
        var body = document.createElement("div");
        body.className = "result-body";
        var link = document.createElement("a");
        link.href = entry.href;
        link.className = "search-title";
        link.appendChild(document.createTextNode(entry.title));
        var meta = document.createElement("div");
        meta.className = "post-meta";
        meta.appendChild(document.createTextNode(entry.date));
        //var summary = document.createElement("p");
        //summary.appendChild(document.createTextNode(entry.summary));

        body.appendChild(link);
        //body.appendChild(meta);
        //body.appendChild(summary);
        searchitem.appendChild(body);
        resultsdiv.appendChild(searchitem);
    }
}