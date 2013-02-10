/**
 * Widget de liens
 * Permet l'affichage des liens
 */

var wBookMarks = {
    jlien : {},
    jlinkId : {},
    jdialog : {},
    jallFields : {},
    jtips : {},
    /**
     * Retourne le code HTML de la boite de dialogue
     */
    getDialogHtml : function () {
        console.log ("wBookMarks_getDialogHtml");
        arDialog = [];
        arDialog.push ('<div id="dialog-form" title="Modifier un lien">');
        arDialog.push ('<form>');
        arDialog.push ('<fieldset>');
        arDialog.push ('<label for="name">Lien</label>');
        arDialog.push ('<input type="text" name="lien" size="60" id="lien" class="text ui-widget-content ui-corner-all" />');
        arDialog.push ('<input type="hidden" name="linkId" id="linkId" />');
        arDialog.push ('</fieldset>');
        arDialog.push ('</form>');
        arDialog.push ('</div>');
  
        return arDialog.join("");
    },
    
    renderDialog : function () {
        console.log ("wBookMarks_renderDialog");
        $('body').append(wBookMarks.getDialogHtml());
        
        wBookMarks.jlien = $( "#lien" ),
        wBookMarks.jlinkId = $( "#linkId" ),
        wBookMarks.jallFields = $( [] ).add( wBookMarks.jlien ).add( wBookMarks.jlinkId ),
        wBookMarks.jtips = $( ".validateTips" );
        
        // TODO a retravailler
        
        $( "#dialog-form" ).dialog({
            autoOpen: false,
            height: 300,
            width: 700,
            modal: true,
            buttons: {
                "Sauvegarder": function() {
                    var bValid = true;
                    wBookMarks.jallFields.removeClass( "ui-state-error" );
                    var arRes = wBookMarks.jlien.val().split("_|_");
                    system.datas(wBookMarks.jlinkId.val()).update({
                        "name":arRes[0], 
                        "link":arRes[1]
                    });
                
                    var obLi = $('li#' + wBookMarks.jlinkId.val());
                
                    obLi.empty();
                    obLi.append(wBookMarks.getLinkInList(system.datas(wBookMarks.jlinkId.val()).first()))
                
                    $( this ).dialog( "close" );
                },
                Cancel: function() {
                    $( this ).dialog( "close" );
                }
            },
            close: function() {
                wBookMarks.jallFields.val( "" ).removeClass( "ui-state-error" );
            }
        });
    },
    
    renderTabs : function () {
        console.log ("wBookMarks_renderTabs");
        var buffer = [];
        
        system.datas({
            'type':system.TABS
        }).order('tabid').each(function (tabs) {
            buffer.push('<div class="block">');
            buffer.push('<h1 id="h1_'+ tabs.tabid +'" class="editme">');
            buffer.push(tabs.tabname);
            buffer.push('</h1>');
            buffer.push('<ul>');
        
            system.datas({
                'type':system.LINKS,
                'tab':tabs.tabid
            }).order("order").each(function (bookmark) {
                buffer.push(wBookMarks.getLiForBookmark(bookmark));
            });
        
            // Lien final d'ajout
            buffer.push('<li id="li_' + tabs.tabid + '" class="new">');
            buffer.push("<a href='Javascript:wBookMarks.createLink(\"" + tabs.tabid + "\")'>");
            buffer.push('<span class="ui-icon ui-icon-plusthick" style="display:inline-block;"></span>');
            buffer.push('</a>');
            buffer.push('</li>');
            buffer.push('</ul>');
            buffer.push('</div>');
        }
        )

        $('body').append(buffer.join(""));
        
        /**
         * Animation
         */
        $('ul').slideUp();
        $('.block').mouseenter(function() {
            $('ul', this).slideDown();
        });

        $('.block').mouseleave(function() {
            $('ul', this).slideUp();
        });

        $("h1.editme").click(function() {
            if ($(this).children('input').length == 0) {
                var inputbox = "<input type='text' id='"+ $(this).attr('id') + "' class='inputbox' value=\""+$(this).text()+"\">";
                $(this).html(inputbox);
                $("input.inputbox").focus();
                $("input.inputbox").blur(function() {
                    var htmlId = $(this).attr('id');
                    var id = parseInt(htmlId.split("_")[1]);
                    var value = $(this).val();
                    var dest="h1#" + htmlId;
                    $(dest).text(value);
                    system.datas({
                        'type':system.TABS,
                        'tabid':id
                    }).update({
                        'tabname':value
                    });
                });
            }
        });
    },
    
    /**
     * Retourne le code HTML correpondant à une entrée de type Lien.
     * @param {Object} bookmark 
     */
    getLinkInList : function (bookmark) {
        console.log ("wBookMarks_getLinkInList");
        linksbuff = [];
        linksbuff.push("<a href='Javascript:wBookMarks.removelink(\"" + bookmark.___id + "\")'>");
        linksbuff.push('<span class="ui-icon ui-icon-trash" style="display:inline-block;"></span>');
        linksbuff.push('</a>');                
        linksbuff.push("<a href='Javascript:wBookMarks.updateLink(\"" + bookmark.___id + "\")'>");
        linksbuff.push('<span class="ui-icon ui-icon-pencil" style="display:inline-block;"></span>');
        linksbuff.push('</a>');
        linksbuff.push('&nbsp;');
        linksbuff.push('<a href="');
        linksbuff.push(bookmark.link);
        linksbuff.push('"');
        if (bookmark.newwin) {
            linksbuff.push(' target="_blank"');
        }
        linksbuff.push('>');
        linksbuff.push(bookmark.name);
        linksbuff.push('</a>');
            
        return linksbuff.join("");
    },
    
    /**
     * Retourne le code HTML correpondant à une entrée de type list.
     * @param {Object} bookmark  
     */
    getLiForBookmark : function (bookmark) {
        console.log ("wBookMarks_getLiForBookmark");
        liBuff = [];        

        liBuff.push('<li id="'+ bookmark.___id + '">');
        liBuff.push(wBookMarks.getLinkInList (bookmark));
        liBuff.push('</li>');
    
        return (liBuff.join(""));
    },

    /**
     * retire le lien indiqué de la base et de l'affichage.
     * @param {String} id ID du lien dans taffy
     */
    removelink : function (id) {
        console.log ("wBookMarks_removelink");
        system.datas(id).remove();
        $('li#' + id).remove();
    },

    /**
     * Ajout d'un nouveau lien
     * Ajout en base avec affichage en modification
     */
    createLink : function (idTab) {
        console.log ("wBookMarks_createLink");
        var link = {
            type : 1, 
            name :"NomDuLien", 
            tab:parseInt(idTab), 
            newwin:true, 
            link : "http://www.perdu.com"
        };
        var req = system.datas.insert(link);
        var newBookmark = req.first();

        lastLi = $('li#li_' + idTab);
    
        lastLi.before(wBookMarks.getLiForBookmark(newBookmark));
        wBookMarks.updateLink(newBookmark.___id);
    },
    
    /**
     * Preparation et affichage de la boite de dialogue de modification
     * @param {string} id Id du lien dans la base
     */
    updateLink : function (id) {
        console.log ("wBookMarks_updateLink");
        console.log ("ID:" + id);
        var linkData = system.datas(id).first();
        var arLink = [];
        arLink.push(linkData.name);
        arLink.push(linkData.link);
   
        wBookMarks.jlien.val(arLink.join("_|_"));
        wBookMarks.jlinkId.val (id);
    
        $( "#dialog-form" ).dialog( "open" );
    },
    
    render : function () {
        console.log ("wBookMarks_render");
        wBookMarks.renderDialog();
        wBookMarks.renderTabs();
    },
    
    init : function () {
        console.log ("wBookMarks_init");
        wBookMarks.render();
    }
}
system.addStartUp(wBookMarks.init);
