var system = {
    callbackList : [],
    datas : TAFFY(),
    
    /**
     * Ajoute une methode à la routine de callback
     * @param {Object} obj Ajoute une methode à la liste des callback
     */
    addCallback : function (obj) {
        system.callbackList.push(obj);
    },

    /**
     * rafraichie l'enssemble des donnée
     */
    refresh : function () {
        system.doCallback();
    },

    /**
     * rafraichie l'enssemble des donnée
     */
    doCallback : function () {
        var ni = system.callbackList.length;
        while (ni--) {
            system.callbackList[ni]();
        }
    },
    
    
    loadData : function () {
        console.log("system_loadData");       
        boload = system.datas.store("startpage");
        
        if (boload === null) {
            console.log("ERREUR pas de localstorage");
        }
        
        if (boload) {
            
            if (system.datas().count() === 0) {
                system.datas.merge (defDatas);
            }
        }
    },
    
    init : function () {
        console.log("Init");
        system.loadData();
        system.doCallback();
    }

}

var LINKS = 1;
var VERSION = 0;
var TABS = 2;
var SRCHSHRC = 3;

$(document).ready(function() {
    system.init();
});