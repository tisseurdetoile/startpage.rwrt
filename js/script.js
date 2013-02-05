/**
	Startpage Reworked
	==================

	by Christian Brassat,
	reusing code by Jukka Svahn
        update by TisseurDeToile
*/

/**
	Released under MIT License
	
	Copyright (c) 2010 Jukka Svahn, Christian Brassat, Le TisseurDeToile
	<http://rahforum.biz>
	<http://crshd.cc>

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


/*  Clock  *\
\*=========*/
function updateClock() {
    var currentTime = new Date ();
    var currentHours = currentTime.getHours ();
    var currentMinutes = currentTime.getMinutes ();
    var currentSeconds = currentTime.getSeconds ();

    // Pad the minutes and seconds with leading zeros, if required
    currentMinutes = (currentMinutes < 10 ? "0" : "") + currentMinutes;
    currentSeconds = (currentSeconds < 10 ? "0" : "") + currentSeconds;

    // Choose either "AM" or "PM" as appropriate
    var timeOfDay = (currentHours < 12) ? "AM" : "PM";

    // Convert the hours component to 12-hour format if needed
    currentHours = (currentHours > 12) ? currentHours - 12 : currentHours;

    // Convert an hours component of "0" to "12"
    currentHours = (currentHours == 0) ? 12 : currentHours;

    // Compose the string for display
    var currentTimeString = currentHours + ":" + currentMinutes + ":" + currentSeconds + " " + timeOfDay;

    // Fill '#clock' div with time
    $("#clock").html(currentTimeString);
}

/**
 * Retourne le code HTML correpondant à une entrée de type Lien.
 * @param {Object} bookmark 
 */
function getLinkInList(bookmark) {
    strLink = [];
    strLink.push("<a href='Javascript:removelink(\"" + bookmark.___id + "\")'>");
    strLink.push('-');
    strLink.push('</a>');                
    strLink.push("<a href='Javascript:updateLink(\"" + bookmark.___id + "\")'>");
    strLink.push('#');
    strLink.push('</a>');
    strLink.push('&nbsp;');
    strLink.push('<a href="');
    strLink.push(bookmark.link);
    strLink.push('"');
    if (bookmark.newwin) {
        strLink.push(' target="_blank"');
    }
    strLink.push('>');
    strLink.push(bookmark.name);
    strLink.push('</a>');
            
    return strLink.join("");
}


/**
 * retire le lien indiqué de la base et de l'affichage.
 * @param {String} id ID du lien dans taffy
 */
function removelink (id) {
    system.datas(id).remove();
    $('li#' + id).remove();
}

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
        width: 350,
        modal: true,
        buttons: {
            "Sauvegarder": function() {
                var bValid = true;
                allFields.removeClass( "ui-state-error" );
                console.log("1>>" + lien.val() + "--" + linkId.val());
                var arRes = lien.val().split("_|_");
                console.log("2>>" + arRes[0] + "--" + arRes[1]);
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



    var arrbuffer = [];
        
    system.datas({
        'type':TABS
    }).order('tabid').each(function (tabs) {
        arrbuffer.push('<div class="block">');
        arrbuffer.push('<h1 id="h1_'+ tabs.tabid +'" class="editme">');
        arrbuffer.push(tabs.tabname);
        arrbuffer.push('</h1>');
        arrbuffer.push('<ul>');
        
        system.datas({
            'type':LINKS,
            'tab':tabs.tabid
        }).order("order").each(function (bookmark) {
            arrbuffer.push('<li id="' + bookmark.___id +  '">');
            arrbuffer.push(getLinkInList (bookmark));
            arrbuffer.push('</li>');
            
        });
        
        // TODO ajouter un lien d'ajout.
        
        arrbuffer.push('</ul>');
        arrbuffer.push('</div>');
    }
    )

    $('body').append(arrbuffer.join(""));
        

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


    /*  Search Engines  */

    var search = '<div id="searches">';
	
    var search = search + '<form onsubmit="return doSearch(this)">';
    search = search + '<input type="text" id="g" name="query" size="34" maxlength="255" value="" />';
    search = search + '<input type="submit" value="Recherche" />';
    search = search + '</form>';
    var search = search + '</div>';

    /*  Add to page  *\
	\*===============*/
    $('body').append(search);
    if(focusSearch) {
        var searchDiv = document.getElementById ('searches');
        $(searchDiv.firstChild.firstChild).focus();
    }
 
    /*  Clock  *\
	\*=========*/

    if(showClock) {
        // Add empty '#clock' div
        $('body').append('<div id="clock"></div>');

        // Update clock
        setInterval('updateClock()', 1000);
    }

    /**
 * 
 * 
 */
    $("h1.editme").click(function() {
        //This if statement checks to see if there are 
        //http://www.unleashed-technologies.com/blog/2010/01/13/jquery-javascript-easy-edit-place-input-boxes-and-select-boxes
        //and children of div.editme are input boxes. If so,
        //we don't want to do anything and allow the user
        //to continue typing
        if ($(this).children('input').length == 0) {
		
            //Create the HTML to insert into the div. Escape any " characters 
            var inputbox = "<input type='text' id='"+ $(this).attr('id') + "' class='inputbox' value=\""+$(this).text()+"\">";
			
            //Insert the HTML into the div
            $(this).html(inputbox);
			
            //Immediately give the input box focus. The user
            //will be expecting to immediately type in the input box,
            //and we need to give them that ability
            $("input.inputbox").focus();
			
            //Once the input box loses focus, we need to replace the
            //input box with the current text inside of it.
            $("input.inputbox").blur(function() {
                var htmlId = $(this).attr('id');
                var id = parseInt(htmlId.split("_")[1]);
                var value = $(this).val();
                var dest="h1#" + htmlId;
                $(dest).text(value);
                system.datas({
                    'type':TABS,
                    'tabid':id
                }).update({
                    'tabname':value
                });
            });
        }
    });

});
