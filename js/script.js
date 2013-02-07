/**
	Startpage Reworked
	==================

	by Christian Brassat,
	reusing code by Jukka Svahn
        updated by TisseurDeToile
*/

/**
	Released under MIT License
	
	Copyright (c) 2010 Jukka Svahn, Christian Brassat, Le TisseurDeToile
	<http://rahforum.biz>
	<http://crshd.cc>
        <http://www.tisseurdetoile.net>

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
*/

/**
 * Retourne le code HTML correpondant à une entrée de type Lien.
 * @param {Object} bookmark 
 */
function getLinkInList(bookmark) {
    linksbuff = [];
    linksbuff.push("<a href='Javascript:removelink(\"" + bookmark.___id + "\")'>");
    linksbuff.push('-');
    linksbuff.push('</a>');                
    linksbuff.push("<a href='Javascript:updateLink(\"" + bookmark.___id + "\")'>");
    linksbuff.push('#');
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
}


// TODO renommer les array en buff 

/**
 * Retourne le code HTML correpondant à une entrée de type list.
 * @param {Object} bookmark  
 * */
function getLiForBookmark(bookmark) {
    liBuff = [];        

    liBuff.push('<li>');
    liBuff.push(getLinkInList (bookmark));
    liBuff.push('</li>');
    
    return (liBuff.join(""));
}

/**
 * retire le lien indiqué de la base et de l'affichage.
 * @param {String} id ID du lien dans taffy
 */
function removelink (id) {
    system.datas(id).remove();
    $('li#' + id).remove();
}

/**
 * Ajout d'un nouveau lien
 * Ajout en base avec affichage en modification
 */
function createLink (idTab) {
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
    
    lastLi.before(getLiForBookmark(newBookmark));
    updateLink(newBookmark.___id);
}

/**
 * Preparation et affichage de la boite de dialogue de modification
 * @param {string} id Id du lien dans la base
 */
function updateLink (id) {
    console.log ("ID:" + id);
    var linkData = system.datas(id).first();
    var arLink = [];
    arLink.push(linkData.name);
    arLink.push(linkData.link);
   
    lien.val(arLink.join("_|_"));
    linkId.val (id);
    
    $( "#dialog-form" ).dialog( "open" );
}

$(document).ready(function() {
    lien = $( "#lien" ),
    linkId = $( "#linkId" ),
    allFields = $( [] ).add( lien ).add( linkId ),
    tips = $( ".validateTips" );
    /**
 * Dialog
 */
    $( "#dialog-form" ).dialog({
        autoOpen: false,
        height: 300,
        width: 700,
        modal: true,
        buttons: {
            "Sauvegarder": function() {
                var bValid = true;
                allFields.removeClass( "ui-state-error" );
                var arRes = lien.val().split("_|_");
                system.datas(linkId.val()).update({
                    "name":arRes[0], 
                    "link":arRes[1]
                });
                
                var obLi = $('li#' + linkId.val());
                
                obLi.empty();
                obLi.append(getLinkInList(system.datas(linkId.val()).first()))
                
                $( this ).dialog( "close" );
            },
            Cancel: function() {
                $( this ).dialog( "close" );
            }
        },
        close: function() {
            allFields.val( "" ).removeClass( "ui-state-error" );
        }
    });

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
            buffer.push(getLiForBookmark(bookmark));
        });
        
        buffer.push('<li id="li_' + tabs.tabid + '" class="new">');
        buffer.push("<a href='Javascript:createLink(\"" + tabs.tabid + "\")'>");
        buffer.push('Ajouter');
        buffer.push('</a>');
        buffer.push('</li>');
        buffer.push('</ul>');
        buffer.push('</div>');
    }
    )

    $('body').append(buffer.join(""));
        

    /*  Animation Time!  *\
	\*===================*/
	
    /*  Hide lists  *\
	\*==============*/
    $('ul').slideUp();

    /*  Show on hover  *\
	\*=================*/
    $('.block').mouseenter(function() {
        $('ul', this).slideDown();
    });

    /*  Hide on unhover  *\
	\*===================*/
    $('.block').mouseleave(function() {
        $('ul', this).slideUp();
    });

    /**
     * Gestion du changement de nom des blocs de liens
     */
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

});
