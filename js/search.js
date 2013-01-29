/**
 *
 */
function buildUrl (data, str) {
    var url = [];
    
    url.push(data.url);
    url.push("?");
    url.push(data.params);
    url.push("=");
    url.push(str);
    
    
    return url.join("");
}


/**
 * 
 */
function doSearch (form) {
    console.log ("doSearch V3");
    var searchPattern = "^:([a-z]{1,2}) (.*)";
    var rg =new RegExp(searchPattern, "g");
    
    var strSearch = form.query.value;
    
    if (rg.test(strSearch)) {
        rg.lastIndex = 0;
        var match = rg.exec(strSearch);
        var shrcut = match[1];
        var shrStr = match[2];

        srchdata = system.datas({
            type:SRCHSHRC,
            'short':shrcut
        }).first();
        
        
        if (srchdata != null) {
            url = buildUrl (srchdata, shrStr);
            window.open(url, '_blank');
            console.log (url);
            form.query.value = "";
        } else {
            form.query.value = "Le raccourcis :" + shrcut + " n'existe pas";
        }
    } else {
        console.log ("recherche standard");
        srchdata = system.datas({
            'type':SRCHSHRC,
            'def':true
        }).first();
        url = buildUrl (srchdata, strSearch);
        window.open(url, '_blank');
        form.query.value = "";
    }

    console.log ("End");
    return false;
}
