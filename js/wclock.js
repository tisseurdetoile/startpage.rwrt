/* 
 * Widget de l'horloge
 * Permet l'affichage et l'horloge
 */

function CustomDate (date, locale, pattern) {
    this.date = date;
    this.locale = locale;
    this.pattern = pattern;
    
    /**
     * http://www.editeurjavascript.com/scripts/scripts_temps_3_775.php
     * @return {String} numéro de la semaine
     */
    this.getWeekNumber = function () {
        var annee = this.date.getFullYear();//année de la date à traiter
        var NumSemaine = 0,//numéro de la semaine
        
        // calcul du nombre de jours écoulés entre le 1er janvier et la date à traiter.
        // ----------------------------------------------------------------------------
        // initialisation d'un tableau avec le nombre de jours pour chaque mois
        ListeMois = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
        // si l'année est bissextile alors le mois de février vaut 29 jours
        if (annee %4 == 0 && annee %100 !=0 || annee %400 == 0) {
            ListeMois[1]=29
        }
        
        var mm = this.date.getMonth();
        var jj = this.date.getDate();
        
        // on parcours tous les mois précédants le mois à traiter 
        // et on calcul le nombre de jour écoulé depuis le 1er janvier dans TotalJour
        var TotalJour=0;
        for(cpt=0; cpt<mm; cpt++){
            TotalJour+=ListeMois[cpt];
        }
        TotalJour+=jj;

        //Calcul du nombre de jours de la première semaine de l'année à retrancher de TotalJour
        //-------------------------------------------------------------------------------------
        //on initialise dans DebutAn le 1er janvier de l'année à traiter
        DebutAn = new Date(annee,0,1);
        //on determine ensuite le jour correspondant au 1er janvier
        //de 1 pour un lundi à 7 pour un dimanche/
        var JourDebutAn;
        JourDebutAn=DebutAn.getDay();
        if(JourDebutAn==0){
            JourDebutAn=7
        }

        //Calcul du numéro de semaine
        //----------------------------------------------------------------------
        //on retire du TotalJour le nombre de jours que dure la première semaine 
        TotalJour-=8-JourDebutAn;
        //on comptabilise cette première semaine
        NumSemaine = 1;
        //on ajoute le nombre de semaine compléte (sans tenir compte des jours restants)
        NumSemaine+=Math.floor(TotalJour/7);
        // s'il y a un reste alors le n° de semaine est incrémenté de 1
        if(TotalJour%7!=0){
            NumSemaine+=1
        }


        NumSemaine = (NumSemaine < 10 ? "0" : "") + NumSemaine;
        return(NumSemaine);
  
    }
    
    /**
     * retourne l'heure
     */
    this.getHours = function () {
        return this.date.getHours();
    }

    /**
     * retourne les minutes
     */
    this.getMinutes = function () {
        var currentMinutes = this.date.getMinutes ();
        currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
        return currentMinutes;
    }
                
    /**
     * retourne les secondes
     */                
    this.getSeconds = function () {
        var currentSeconds = this.date.getSeconds();
        currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;
        return currentSeconds;                    
    }
    
    /**
     * Aiguillage du mapping des mots clefs
     */
    this.getStringFor = function (info) {
        switch (info) {
            case "WW" :
                str = this.getWeekNumber();
                break;
            case "HH" :
                str = this.getHours();
                break;                            
            case "MM" :
                str = this.getMinutes();
                break;                            
            case "SS" :
                str = this.getSeconds();
                break;                            
            default:
                str = "";
                break;
        }
                    
        return str;
    }
    
    /**
     * retourne la date formaté selon le pattern specifé
     */
    this.parse = function () {
        var patt = /\[(..)\]/;
        var str = this.pattern;
        
        while (str.match(patt)) {
            arres = patt.exec(str);
            str = str.replace(patt, this.getStringFor(arres[1]));
        }
        return str;
    }
}            

var wclock = {
    render : function () {
        var jid = '#' + wclock.RENDERID;
        var datePat = system.datas({
            type:system.VERSION
        }).first().clockPattern;
        
        var cDate = new CustomDate (new Date (), "fr", "S[WW] [HH]:[MM]:[SS]")

        $(jid).html(cDate.parse());

    },
    
    init : function () {
        var active = system.datas({
            type:system.VERSION
        }).first().showclock;
        
        if (active) {
            console.log ("wclock_init");
            divbuff = [];
            divbuff.push('<div id="');
            divbuff.push(wclock.RENDERID);
            divbuff.push('">');
            divbuff.push('</div>');
        
            $('body').append(divbuff.join(""));
            system.addCallback(wclock.render);
        }
    },
    RENDERID : "clock"
}

system.addStartUp(wclock.init);

