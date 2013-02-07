/* 
 * Widget de recherche
 * Permet l'affichage et l'utilisation de la barre de recherche
 */

var wsearch = {
    /**
     * Construit l'url de recherche methode GET
     * @param {Object} data Données sur le moteur de recherche
     * @param {String} str chaine à chercher 
     * @return {String}
     */
    buildUrl : function (data, str) {
        console.log ("wsearch_buildUrl");
        var url = [];
    
        url.push(data.url);
        url.push("?");
        url.push(data.params);
        url.push("=");
        url.push(str);
    
        return url.join("");
    },
    
    /**
     * Recupere les information de recherche et ouvre c'elle ci
     * dans le type de fenêtre désirée.
     * @param {Object} form DOM du formulaire
     */
    doSearch : function(form) {
        console.log ("wsearch_doSearch");
        var searchPattern = "^:([a-z]{1,2}) (.*)";
        var rg =new RegExp(searchPattern, "g");
    
        var strSearch = form.query.value;
    
        if (rg.test(strSearch)) {
            rg.lastIndex = 0;
            var match = rg.exec(strSearch);
            var shrcut = match[1];
            var shrStr = match[2];

            srchdata = system.datas({
                type:system.SRCHSHRC,
                'short':shrcut
            }).first();
        
        
            if (srchdata != null) {
                url = wsearch.buildUrl (srchdata, shrStr);
                window.open(url, '_blank');
                console.log (url);
                form.query.value = "";
            } else {
                form.query.value = "Le raccourcis :" + shrcut + " n'existe pas";
            }
        } else {
            console.log ("recherche standard");
            srchdata = system.datas({
                'type':system.SRCHSHRC,
                'def':true
            }).first();
            url = wsearch.buildUrl (srchdata, strSearch);
            //console.log ("wsearch_doSearch url = " + url);
            window.open(url, '_blank');
            form.query.value = "";
        }

        console.log ("End");

    },


    /**
     * Affiche le formulaire de recherche dans la page
     */
    render : function () {
        console.log ("wsearch_render");
        var srchBuff = [];
        srchBuff.push('<form onsubmit="return wsearch.doSearch(this);return false;">');
        srchBuff.push('<input type="text" id="g" name="query" size="34" maxlength="255" value="" />');
        srchBuff.push('<input type="submit" value="Recherche" />');
        srchBuff.push('</form>');

        $('#searches').append(srchBuff.join(""));
    },

    init : function () {
        console.log ("wsearch_init");
        wsearch.render();
    }
};

/**
 * Enregistre l'initialisation du widget au démarrage
 */
system.addStartUp(wsearch.init);