/* 
 * Widget system
 * Permet l'accès aux données
 * et les callbacks pour les widgets à affichage dynamique
 */

var system = {
    /**
     * @param {Array} startUpList Tableau des méthode de lancer à l'init
     */
    startUpList : [],
    
    /**
     * @param {Array} callbackList Tableau des méthode de callback
     */
    callbackList : [],

    /**
     * @param {Object} datas Base de données localstorage TAFFY
     */
    datas : TAFFY(),

    /**
     * Ajoute une methode à la routine de StartUp
     * @param {Object} obj Ajoute une methode à la liste StartUp
     */
    addStartUp : function (obj) {
        console.log("system_addStartUp");
        system.startUpList.push(obj);
    },

    /**
     * lance tout les initialisation
     */
    doStartUp : function () {
        console.log("system_doStartUp");
        var ni = system.startUpList.length;
        while (ni--) {
            system.startUpList[ni]();
        }
    },


    /**
     * Ajoute une methode à la routine de callback
     * @param {Object} obj Ajoute une methode à la liste des callback
     */
    addCallback : function (obj) {
        console.log("system_addCallback");
        system.callbackList.push(obj);
    },

    /**
     * lance tout les callbacks
     */
    doCallback : function () {
        console.log("system_doCallback");
        var ni = system.callbackList.length;
        while (ni--) {
            system.callbackList[ni]();
        }
    },

    /**
     * charge les données dans le localstorage
     */
    loadData : function () {
        console.log("system_LoadData");       
        boload = system.datas.store("startpage");
        
        if (boload === null) {
            console.log("ERREUR pas de localstorage");
        }
        
        if (boload) {
            if (system.datas().count() === 0) {
                system.datas.merge (defDatas);
            }
        // TODO ici le system de merge
        }
    },
    
    init : function () {
        console.log("system_Init");
        system.loadData();
        system.doStartUp();
        system.doCallback();
        setInterval('system.doCallback()', 2000);
    },
    
    /**
     * Constantes
     */
    LINKS : 1,
    VERSION : 0,
    TABS : 2,
    SRCHSHRC : 3
}

