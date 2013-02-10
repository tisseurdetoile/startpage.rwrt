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
        //console.log("system_doCallback");
        var ni = system.callbackList.length;
        while (ni--) {
            system.callbackList[ni]();
        }
    },

    /**
     * Compare la version de la base actuelle avec la nouvelle
     * @return {Boolean} 
     */
    needUpdate : function () {
        console.log ("system_needUpdate");
        
        var defVer = defDatas[0];
        
        var curVer = system.datas({
            type:system.VERSION
        }).first();
        
        return (defVer.version > curVer.version);
    },

    /**
     * routine de mise à jour des données
     * nota pas plus de 10 version de difference en 1 coup.
     */
    update : function () {
        console.log ("system_update");
        
        var loop = 10;
        
        while (system.needUpdate() && (loop > 0)) {
            //console.log ("+" + loop);
            
            var curVer = system.datas({
                type:system.VERSION
            }).first().version;
                
            var ni = update.length;
        
            //console.log ("system_update" + " ni :" + ni);
        
            while (ni--) {
                var upData = update[ni];
            
                //console.log ("system_update" + " to :" + upData.ver);
                //console.log ("system_update" + " from :" + curVer);
            
                if (upData.ver === curVer) {
                    //console.log ("system_update" + " update for :" + curVer);
                
                    var nj = upData.actions.length;
                
                    //console.log ("system_update" + " nj :" + nj);
                
                    while (nj--) {
                        var action = upData.actions[nj];
                        //console.log ("select :" + action.select + " mod  " + action.mod);
                        system.datas(action.select).update(action.mod);
                    }
                }
            }
            loop--;
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
            } else {
                if (system.needUpdate()) {
                    system.update();
                }
            }
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

