/**
	Startpage Reworked
	==================

	by Christian Brassat,
	reusing code by Jukka Svahn
*/

/**
	Released under MIT License
	
	Copyright (c) 2010 Jukka Svahn, Christian Brassat
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


/**
 *https://github.com/allmarkedup/jQuery-URL-Parser
 */
function getHostname(str) {
    var re = new RegExp('^(?:f|ht)tp(?:s)?\://([^/]+)', 'im');
    return str.match(re)[1].toString();
}

/**
 *
 */

var URL = (function (a) {
    return {
        // create a querystring from a params object
        serialize: function (params) { 
            var key, query = [];
            for (key in params) {
                query.push(encodeURIComponent(key) + "=" + encodeURIComponent(params[key]));
            }
            return query.join('&');
        },

        // create a params object from a querystring
        unserialize: function (query) {
            var pair, params = {};
            query = query.replace(/^\?/, '').split(/&/);
            for (pair in query) {
                pair = query[pair].split('=');
                params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            }
            return params;
        },

        parse: function (url) {
            a.href = url;
            return {
                // native anchor properties
                hash: a.hash,
                host: a.host,
                hostname: a.hostname,
                href: url,
                pathname: a.pathname,
                port: a.port,
                protocol: a.protocol,
                search: a.search,
                // added properties
                file: a.pathname.split('/').pop(),
                params: URL.unserialize(a.search)
            };
        }
    };
}(document.createElement('a')));

/**
 *
 */


/**
 * Retourne un hash pour une url
 * Ce hash correspond à la clef du lien il sera utiliser pour maintenir
 * une coherence
 */
function computeCheckSum (url) {
    // http://pajhome.org.uk/crypt/md5/
    var hostname = getHostname (url);
}

/**
 *
 */

var bookmarkbox = ["One", "two", "three", "four", "five"];



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

$(document).ready(function() {
    $('body').empty();

    var links_table = TAFFY([
    {
        name :"google", 
        box:1,  
        newwin:true, 
        link : "http:://www.google.fr", 
        ckecksum :""
    },

    {
        name :"deviantArt",
        box:1, 
        newwin:true, 
        link : "http://deviantart.com", 
        ckecksum :""
    },

    {
        name :"gitHub",
        box:1, 
        newwin:true, 
        link : "https://github.com/", 
        ckecksum :""
    },

    {
        name :"Gmail", 
        box:1, 
        newwin:true, 
        link : "https://www.gmail.com/", 
        ckecksum :""
    },

    {
        name :"tootella", 
        box:1, 
        newwin:true, 
        link : "http://www.tootella.org", 
        ckecksum :""
    },

    {
        name :"LinuxFr", 
        box:0, 
        newwin:true, 
        link : "https://www.linuxfr.org/", 
        ckecksum :""
    },

    {
        name :"Reader", 
        box:2, 
        newwin:true, 
        link : "https://reader.google.fr/", 
        ckecksum :""
    },

    {
        name :"Ecran", 
        box:3, 
        newwin:true, 
        link : "http://www.ecrans.fr/", 
        ckecksum :""
    },

    {
        name :"Lemonde", 
        box:4, 
        newwin:true, 
        order:1, 
        link : "http://www.lemonde.fr/", 
        ckecksum :""
    },

    {
        name :"regexp", 
        box:4, 
        order:0, 
        newwin:true, 
        link : "http://regexpal.com/", 
        ckecksum :""
    }        
    ]);

    var arrbuffer = [];
        
    var ni = bookmarkbox.length;
        
    while (ni--) {
        arrbuffer.push('<div class="block">');
        arrbuffer.push('<h1 id="h1_'+ ni +'" class="editme">');
        arrbuffer.push(bookmarkbox[ni]);
        arrbuffer.push('</h1>');
        arrbuffer.push('<ul>');


        links_table({
            box:ni
        }).order("order").each(function (bookmark) {
            arrbuffer.push('<li><a href="');
            arrbuffer.push(bookmark.link);
            arrbuffer.push('"');
            if (bookmark.newwin) {
                arrbuffer.push(' target="_blank"');
            }
            arrbuffer.push('>');
            arrbuffer.push(bookmark.name);
            arrbuffer.push('</a></li>');
            
        });
            
            
            
            
        arrbuffer.push('</ul>');
        arrbuffer.push('</div>');
    }
        

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


    /*  Search Engines  *\
	\*==================*/

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
                console.log ("---" + $(this).attr('id') + "---");
                var value = $(this).val();
                var dest="h1#" + $(this).attr('id');
                console.log(dest);
                $(dest).text(value);
            //$(".editme").text(value);
            });
        }
    });

});
