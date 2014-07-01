/*
Copyright(c) 2013 Crmvillage.biz srl
*/
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/* Funzioni varie di utilità */

// TODO: un po' di sanity check

// controlla se obj è "vuoto", come per il php
/**
 * PHP's style empty function
 */
function empty(obj) {
	return (obj === undefined || obj === null || obj === false || obj === '' || obj === 0 || obj === [] || obj === {});
}


// include dinamicamente un file js
// attenzione: non è garantito che al termine della funzione il file sia stato tutto caricato
/**
 * Includes a javascript file from another location
 * @param {String} file The url of the javascript file to be fetched
 * @param {Function} callback the function to call when the javascript file has been loaded (successfully or not)
 */
function include(file, callback) {
	if (document.createElement && document.getElementsByTagName) {
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', file);
		if (callback && typeof callback == 'function') {
			script.onreadystatechange = callback;
			script.onload = callback;
			script.onerror = callback;
		}
		head.appendChild(script);
	}
}

/**
 * @class String
 * Some additions to the standard Javascript String.
 * The methods are used only if they don't exist in the String Object.
 */

// Aggiunte alla classe String
if (!String.prototype.trim) {
	/**
	 * @method trim
	 * Removes whitespace characters from the beginning and from the end of the string
	 */
	String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ''); };
}

if (!String.prototype.nl2br) {
	/**
	 * Replaces newlines (ASCII 0x13) characters with &lt;br&gt; tags
	 */
	String.prototype.nl2br = function() { return this.replace(/\n/g, '<br/>'); };
}

if (!String.prototype.url2link) {
	/**
	 * Converts urls in clickable &lt;a href=""&gt; links
	 */
	String.prototype.url2link = function() {
		// open new broswer tab
		var limit = (Ext.os.is.Phone ? 40 : 60),
			ret =
			this.replace(/((ht|f)tps?:\/\/.*?)(([\r\t\n ]|$))/ig, '<a class="alink" href="#" onclick="window.open(\'$1\', \'_system\', \'location=no\');">$1</a>$3')
				.replace(/(^|[^\/\/])(www\..*?)([\r\t\n ]|$)/ig, '$1<a class="alink" href="#" onclick="window.open(\'http://$2\', \'_system\', \'location=no\');">$2</a>$3')
				.replace(/&amp;/, '&');
		// shorten link
		var re = /<a class="alink"/g,
			match;
		while ((match = re.exec(ret)) != null) {
		    var l1 = ret.indexOf('>', match.index),
				l2 = ret.indexOf('</a>', match.index+1),
				innerLink = ((l1 > 0 && l2 > 0) ? ret.substring(l1+1, l2) : false);
		    if (innerLink && innerLink.length > limit) {
		    	ret = ret.slice(0, l1+1)+innerLink.substr(0, limit)+'...'+ret.slice(l2);
		    }
			
			
			
		}

		return ret;
	}
}

if (!String.prototype.mail2link) {
	/**
	 * Converts email addresses in clickable &lt;a href=""&gt; links
	 */
	String.prototype.mail2link = function() {
		var ret = this.replace(/(\b[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}\b)/ig, '<a class="alink" href="mailto:$1">$1</a>');
		return ret;
	}
}

if (!String.prototype.capitalize) {
	/**
	 * Capitalizes first letter of the string
	 */
	String.prototype.capitalize = function() {
	    return this.charAt(0).toUpperCase() + this.slice(1);
	}
}

if (!String.prototype.addEllipses) {
	/**
	 * Truncate a string adding ellipses if it exceeds maxlen
	 * @param {Number} [maxlen=50]
	 */
	String.prototype.addEllipses = function(maxlen) {
		var replace = '...';
		if (maxlen === undefined || maxlen === null) maxlen = 50;
		if (this.length > maxlen) {
			return this.substr(0, maxlen-replace.length) + replace;
		}
		return this;
	}
}

if (!String.prototype.pad) {
	/**
	 * Pads a string with another string to reach the desired length
	 * @param {Number} l The desired length
	 * @param {String} s The string to pad with, default to space
	 * @param {0/1/2} t The type of padding (0 = left, 1 = right, 2 = both sides)
	 */
	String.prototype.pad = function(l, s, t) {
		return s || (s = " "), (l -= this.length) > 0 ? (s = new Array(Math.ceil(l / s.length)
				+ 1).join(s)).substr(0, t = !t ? l : t == 1 ? 0 : Math.ceil(l / 2))
				+ this + s.substr(0, l - t) : this;
	};
}

if (!String.prototype.xor) {
	/**
	 * Ciphers a string using xor method
	 * @param key The value to xor with
	 */
	String.prototype.xor = function(key) {
		var xored = '';
	    for (var i=0; i<this.length; ++i) {
	        xored += String.fromCharCode(this.charCodeAt(i) ^ key);
	    }
	    return xored;
	}
}

if (!String.prototype.wordWrap) {
	/**
	 * Wraps a string at a specified length, trying to break it between words
	 * @param {Number} [int_width=75] Length of the line
	 * @param {String} [str_break="\n"] break the string with this string
	 * @param {Boolean} [cut=false] if True, cut inside words
	 */
	String.prototype.wordWrap = function(int_width, str_break, cut) {
	  var m = ((arguments.length >= 1) ? arguments[0] : 75);
	  var b = ((arguments.length >= 2) ? arguments[1] : "\n");
	  var c = ((arguments.length >= 3) ? arguments[2] : false);
	  var i, j, l, s, r;

	  if (m < 1) {
	    return this;
	  }

	  for (i = -1, l = (r = this.split(/\r\n|\n|\r/)).length; ++i < l; r[i] += s) {
	    for (s = r[i], r[i] = ""; s.length > m; r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? b : "")) {
	      j = c == 2 || (j = s.slice(0, m + 1).match(/\S*(\s)?$/))[1] ? m : j.input.length - j[0].length || c == 1 && m || j.input.length + (j = s.slice(m).match(/^\S*/)).input.length;
	    }
	  }

	  return r.join("\n");
	}
}

/**
 * @class Math
 * Some additions to Math class
 */
if (!window.Math) Math = {};

/**
 * @method mid Casts a value between 2 other values (inclusive)
 * @param {Number} min The lower bound
 * @param {Number} n The value to cast
 * @param {Number} max The upper bound
 */
Math.mid = function(min, n, max) {
	return Math.max(min, Math.min(n, max));
}



/**
 * @class Object
 * Some additions to Object class
 */
if (!window.Object) Object = {};

/**
 * @method values
 * Returns an array with the values of the object
 */
Object.values = function(obj) {
	var key, ret = [];
	for (key in obj) ret.push(obj[key]);
	return ret;
}

/**
 * @method keyvalues
 * Turn an object in an array of key+glue+value
 */
Object.keyvalues = function(obj, glue) {
	var key, ret = [];
	for (key in obj) ret.push(key + glue + obj[key]);
	return ret;
}

/**
 * @method setValues
 * Sets all the properties of the object to the same value
 */
Object.setValues = function(obj, val) {
	var key, objout = {};
	for (key in obj) objout[key] = val;
	return objout;
}

/**
 * @method merge
 * Merges 2 objects, the last one has priority when the objects share some keys
 */
Object.merge = function(obj1, obj2) {
	var attr, ret = {};
	for (attr in obj1) { ret[attr] = obj1[attr]; }
	for (attr in obj2) { ret[attr] = obj2[attr]; }
	return ret;
}

/**
 * @class Number
 * Some additions to Number class
 */
if (!window.Number) Number = {};

/**
 * @method format
 * Formats a number with thousands_separator, decimal_separator and decimal_digits
 */
Number.prototype.format = function() {
	var me;

	// calcolo cifre decimali
	me = this.toFixed(CONFIG.decimal_digits).toString();

	var x = me.split('.'),
		x1 = x[0],
		x2 = x.length > 1 ? CONFIG.decimal_separator + x[1] : '',
		rgx = /(\d+)(\d{3})/;
	if (CONFIG.thousand_separator && CONFIG.thousand_separator != '') {
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + CONFIG.thousand_separator + '$2');
		}
	}
	return x1 + x2;
};

// not documented
Number.prototype.formatUserUnmber = function() {
	return this.format();
};

String.prototype.parseUserNumber = function() {
	// TODO!
	return this;
}


// CLASSE HOUR
// TODO: validazione dati, spostare in file autonomo

/**
 * @class Hour
 * Nothing documented at the moment
 */
function Hour(h,m,s) {

	if (typeof h == 'string' && (typeof m == 'undefined')) {
		this.fromString(h);
	} else if (typeof h == 'object' && h instanceof Date) {
		this.h = h.getHours();
		this.m = h.getMinutes();
		this.s = h.getSeconds();
	} else if (typeof h == 'undefined') {
		var now = new Date();
		this.h = now.getHours();
		this.m = now.getMinutes();
		this.s = now.getSeconds();
	} else {

		this.h = parseInt(h);
		this.m = parseInt(m);
		if (typeof s != 'undefined' && s !== null) this.s = parseInt(s);
	}
}

Hour.prototype.fromString = function(str) {
	var h,m,s, comp = str.split(':');
	if (comp.length < 2) {
		console.log('Hour error: not a valid hour');
		return;
	}

	h = parseInt(comp[0]);
	m = parseInt(comp[1]);
	this.h = h;
	this.m = m;
	if (comp.length > 2) this.s = parseInt(comp[2]);
}

Hour.prototype.pad2 = function(n) {
	if (n < 10 && n >= 0) n = '0'+n;
	return n;
}

Hour.prototype.toString = function() {
	var sec = (this.s ? (':'+this.pad2(this.s)) : '');
	return this.pad2(this.h)+':'+this.pad2(this.m)+sec;
}

Hour.prototype.getHours = function() {
	return this.h;
}

Hour.prototype.getMinutes = function() {
	return this.m;
}

Hour.prototype.getSeconds = function() {
	return this.s;
}

function isHour(value) {
	return (value instanceof Hour);
}

function isValidHour(str) {
	if (typeof str != 'string') return false;
	return str.match(/\d{2}:\d{2}(:\d{2})?/);
}

// back to the global scope!

/**
 * @class global
 */

// -------------------------
// semplice gestione semafori

var Semaphores = [];

/**
 * Find a {@link Semaphore} by name
 * @param {String} name The name of the Semaphore to look for
 * @return
 */
function findSemaphore(name) {
	var i=0;
	for (i=0; i<Semaphores.length; ++i) {
		if (Semaphores[i].name == name) return Semaphores[i];
	}
	return null;
}


/**
 * @class Semaphore
 * Implements a simple way to serialize multiple asynchronous requests.
 * A Semaphore is created with a function and a number. Everytime the Semaphore.go() method is called
 * the number is decreased and when it reaches 0, the callback function is called.
 *
 * To execute some code after other several asynchronous operations (like ajax calls or db queries),
 * a Semaphore is created, with the function to be called and the number of async operations; then
 * in the callback of each async operation the method go() is called, so the last operation that
 * finishes, regardless of which one it is, will actually fire the callback.
 *
 * @constructor
 * Creates a new Semaphore
 * @param {String} name The name of the Sempahore
 * @param {Function} callable
 * A function to call when the Sempahore reaches level 0. The first argument is a reference
 * to the Semaphore
 * @param {Object} args Extra arguments to pass to the callback function
 * @param {Number} [start=1] The initialization level for the Semaphore
 */
function Semaphore(name, callable, args, start) {

	if (typeof callable == 'function') {
		this.callable = callable;
		this.args = args;
	}

	/**
	 * @property {String} name The name of the Semaphore
	 */
	this.name = name;

	if (typeof start == 'undefined' || start === null)
		this.counter = 1;
	else
		this.counter = start;

	// TODO: controlla se esiste gia
	Semaphores.push(this);
}

/**
 * Increments the internal level
 * @param {Number} [turns=1]
 */
Semaphore.prototype.wait = function(turns) {
	if (typeof turns == 'undefined' || turns === null) turns = 1;
	this.counter += turns;
	if (typeof this.waitCallback == 'function') {
		this.waitCallback(this.counter);
	}
}

/**
 * @method go
 * Decrements the internal level and call the callback if it reaches 0
 */
Semaphore.prototype.go = function() {
	if (this.counter == 0) {
		if (typeof this.goCallback == 'function') {
			this.goCallback(this.counter);
		}
		return;
	}

	--this.counter;

	if (typeof this.goCallback == 'function') {
		this.goCallback(this.counter);
	}

	if (this.counter == 0) {
		this.callable(this, this.args);
	}
}

/**
 * @method destroy
 * Destroys the Semaphore.
 * It's good practice to call this method in the callback function, to ensure
 * no ghost objects sticks around in the memory
 */
Semaphore.prototype.destroy = function() {
	var i = 0;
	for (i=0; i<Semaphores.length; ++i) {
		if (Semaphores[i].name == this.name) {
			Semaphores.splice(i, 1);
			break;
		}
	}
}

/**
 * @method setWaitCallback
 * @private
 */
Semaphore.prototype.setWaitCallback = function(callback) {
	if (typeof callback == 'function') {
		this.waitCallback = callback;
	}
}

/**
 * @method setGoCallback
 * @private
 */
Semaphore.prototype.setGoCallback = function(callback) {
	if (typeof callback == 'function') {
		this.goCallback = callback;
	}
}


// -------------------------

/**
 * @class global
 */



// imposta un badge nell'icona dell'app
/**
 * @method setBadge
 * Sets or clears a badge (string) on the app icon
 * @param {String} value The value to show. If empty, the badge will be removed
 */
function setBadge(value) {
	if (window.plugins && window.plugins.badge && window.plugins.badge.set) {
		// plugin iOS
		if (value)
			window.plugins.badge.set(value);
		else
			window.plugins.badge.clear();
	}
}

// undocumented
function doNotification(text) {
	var realtext = ''+text;

	// DISABLED!!!
	return;

	if (window.plugins && window.plugins.localNotification) {
		// plugin iOS
		navigator.notification.vibrate(500);
		window.plugins.localNotification.add({
			date: new Date(), // now!!
		    message: realtext,
		    //repeat: 'weekly', // will fire every week on this day
		    //badge: 1,
		    //foreground: function() { alert('in foreground'); },
		    //background:function() { alert('in background'); },
		    //sound:'sub.caf'
		});
	} else {
		// DEBUG
		//alert(realtext);
	}

}


function array_find(arr, name, value) {
	for (var i=0; i<arr.length; ++i) {
		if (arr[i][name] == value) return arr[i];
	}
	return null;
}

// estrae da un array di oggetti un array con solo il campo scelto
function array_getfield(arr, name) {
	var ret = [];
	for (var i=0; i<arr.length; ++i) {
		ret.push(arr[i][name]);
	}
	return ret;
}



// converte n in formato float, in caso di errori, imposta a fallback
function toFloat(n, fallback) {
	if (fallback === undefined) fallback = 0.0;
	n = parseFloat(n);
	if (isNaN(n)) n = fallback;
	return n;
}

//trova tanti record nello store, non solo il primo
function storeFindAll(store, field, value) {
	var idx, start = 0, ret = [];

	while ((idx = store.find(field, value, start)) != -1) {
		start = idx+1;
		ret.push(store.getAt(idx));
	}
	return ret;
}

//deserializza un url (versione base)
function params_unserialize(p){
	if (typeof p !== 'string') return {};

	var ret = {},
		seg = p.replace(/^\?/,'').split('&'),
	    len = seg.length, i = 0, s;
	for (;i<len;i++) {
	    if (!seg[i]) continue;
	    s = seg[i].split('=');
	    ret[s[0]] = s[1];
	}
	return ret;
}



/**
 * @class Color
 * @singleton
 * Some useful function to convert between colors format.
 *
 * Barely documented
 */
var Color = {

	/**
	 *
	 */
	HexToRgb: function(hexcolor) {
		if (hexcolor.match(/#?([0-9a-f]{3}){1,2}/i)) {
			hexcolor = hexcolor.replace('#', '');
			return {
				r: parseInt(hexcolor.substr(0, 2), 16),
				g: parseInt(hexcolor.substr(2, 2), 16),
				b: parseInt(hexcolor.substr(4, 2), 16),
			}
		}
		return {r:0, g:0, b:0};
	},

	/**
	 *
	 */
	RgbToHex: function(r,g,b) {
		r = r.toString(16).pad(2,'0',0);
		g = g.toString(16).pad(2,'0',0);
		b = b.toString(16).pad(2,'0',0);
		return r+g+b;
	},

	/**
	 *
	 */
	RgbToHsv: function(r, g, b) {
		var min = Math.min(r, g, b),
        	max = Math.max(r, g, b),
        	delta = max - min,
        	h, s, v = max;

		v = Math.floor(max / 255 * 100);
		if (max == 0) return [0, 0, 0];

		s = Math.floor(delta / max * 100);
		var deltadiv = delta == 0 ? 1 : delta;

		if( r == max ) h = (g - b) / deltadiv;
		else if(g == max) h = 2 + (b - r) / deltadiv;
		else h = 4 + (r - g) / deltadiv;

		h = Math.floor(h * 60);
		if( h < 0 ) h += 360;

		return { h:h, s:s, v:v }
	},

	/**
	 *
	 */
	HsvToRgb: function(h, s, v) {
		h = h / 360;
		s = s / 100;
		v = v / 100;

		if (s == 0) {
			var val = Math.round(v * 255);
			return {r:val,g:val,b:val};
		}

		var hPos = h * 6,
    		hPosBase = Math.floor(hPos),
    		base1 = v * (1 - s),
    		base2 = v * (1 - s * (hPos - hPosBase)),
    		base3 = v * (1 - s * (1 - (hPos - hPosBase))),
    		red, green, blue;

		if (hPosBase == 0) {red = v; green = base3; blue = base1}
		else if (hPosBase == 1) {red = base2; green = v; blue = base1}
    	else if (hPosBase == 2) {red = base1; green = v; blue = base3}
    	else if (hPosBase == 3) {red = base1; green = base2; blue = v}
    	else if (hPosBase == 4) {red = base3; green = base1; blue = v}
    	else {red = v; green = base1; blue = base2};

    	red = Math.round(red * 255);
    	green = Math.round(green * 255);
    	blue = Math.round(blue * 255);

    	return {r:red, g:green, b:blue};
	}
}


/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/*
string translations
*/

if (typeof ALL_LANGS == 'undefined') ALL_LANGS = {};

/**
 * @class ALL_LANGS.en_us
 * @singleton
 * The english language pack
 */
ALL_LANGS['en_us'] = {

	// replace Sencha strings
	senchaStrings : function() {

		Ext.Date.dayNames =
		Ext.DateExtras.dayNames = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday',
				'Thursday', 'Friday', 'Saturday' ];

		Ext.Date.monthNames =
		Ext.DateExtras.monthNames = [ 'January', 'February', 'March', 'April', 'May',
				'June', 'July', 'August', 'September', 'October', 'November',
				'December' ];

		Ext.Date.monthNumbers =
		Ext.DateExtras.monthNumbers = {
			'Jan' : 0,
			'Feb' : 1,
			'Mar' : 2,
			'Apr' : 3,
			'May' : 4,
			'Jun' : 5,
			'Jul' : 6,
			'Aug' : 7,
			'Sep' : 8,
			'Oct' : 9,
			'Nov' : 10,
			'Dec' : 11
		};

		if (Ext.Date.parseCodes && Ext.Date.parseCodes.S) {
			Ext.Date.parseCodes.S.s = '(?:st|nd|rd|th)';
		}

		if (Ext.picker.Picker) {
			Ext.picker.Picker.prototype.config.doneButton = true;
			Ext.picker.Picker.prototype.config.cancelButton = true;
		}

		if (Ext.picker.Date) {
			Ext.override(Ext.picker.Date, {
				'dayText' : 'Day',
				'monthText' : 'Month',
				'yearText' : 'Year',
				'slotOrder' : [ 'month', 'day', 'year' ]
			});
		}

		if (Ext.NestedList) {
			Ext.override(Ext.NestedList, {
				'backText' : 'Back',
				'loadingText' : 'Loading...',
				'emptyText' : 'No items available.'
			});
		}

		if (Ext.util.Format) {
			Ext.util.Format.defaultDateFormat = 'm/d/Y';
			Ext.util.Format.defaultHourFormat = 'h:iA';
		}

		if (Ext.MessageBox) {
			Ext.MessageBox.OK.text = 'OK';
			Ext.MessageBox.CANCEL.text = 'Cancel';
			Ext.MessageBox.YES.text = 'Yes';
			Ext.MessageBox.NO.text = 'No';
			Ext.MessageBox.YESNO[0].text = 'No';
			Ext.MessageBox.YESNO[1].text = 'Yes';
		}

	},

	config: 'Configuration',
	logout: 'Logout',
	login: 'Login',
	username: 'Username',
	password: 'Password',
	vte_address: 'VTE Address',
	warning: 'Warning',
	error: 'Error',
	login_failed: 'Login failed',
	specify_username: 'Specify a username',
	specify_password: 'Specify a password',
	specify_address: 'Specify an address',
	loading_login: 'Login...',
	loading_modules: 'Reading modules...',
	loading_entities: 'Loading list...',
	loading: 'Loading...',
	lbl_new: 'New',
	back: 'Back',
	forward: 'Forward',
	save: 'Save',
	recents: 'Recents',
	favourites: 'Favourites',
	search: 'Search',
	field: 'Field',
	previous_value: 'Previous value',
	current_value: 'Current value',
	to: 'to',
	notifications: 'Notifications',
	talks: 'Talks',
	added_items: 'Added items',
	changed_items: 'changed items',
	publish: 'Publish',
	do_answer: 'Answer',
	choose: 'Choose',
	users: 'Users',
	user: 'User',
	groups: 'Groups',
	all: 'All',
	done: 'Done',
	select: 'Select',
	selected: 'Selected',
	write_something: 'You have to write something',
	select_users: 'You have to select some users',
	saving_comment: 'Saving comment...',
	to_read: 'To read',
	other_talks: 'Other talks',
	language: 'Language',
	italian: 'Italian',
	english: 'English',
	from_vte: 'From VTE',
	offline: 'Offline',
	delete_label: 'Delete',
	autogenerate_msg: 'AUTO GENERATED ON SAVE',
	year: 'Year',
	month: 'Month',
	day: 'Day',
	ok: 'OK',
	save_pending: 'Save changes?',
	delete_record: 'Delete the record?',
	delete_product: 'Delete the product?',
	delete_relation: 'Delete the relation?',
	delete_message: 'Delete the message?',
	fill_mandatory: 'Fill mandatory fields',
	fill_fields: 'Fill in the fields',
	mandatory_field: 'Mandatory field',
	informations: 'Informations',
	version: 'Version',
	no_records: 'No records',
	total: 'Total',
	products: 'Products',
	settings: 'Settings',
	api_version_mismatch: 'The server version is not supported. It\'s reccomended to upgrade the app.',
	end: 'End',
	mask_timeout: 'Server is taking too long to respond. Check the connection',
	animations: 'Animations',
	record_already_opened: 'Record is already open',
	nesting_limit_reached: 'The limit of concurrent open panels has been reached',
	invalid_server_response: 'Invalid response from the server',
	not_target_revision: 'The server version is not up to date, some features are disabled. It\'s reccomended to upgrade VTE to the latest revision.',
	add: 'Add',
	no_modules_reload: 'No modules loaded. Login again',
	confirm_offline: 'About to download data from the CRM for the offline mode. This process may take several minutes',
	logout_offline: 'All offline data will be lost. Continue with logout?',
	about: 'About',
	module: 'Module',
	filters: 'Filters',
	notification_delay: 'Notifications check',
	never: 'Never',
	todos: 'Task',
	is_expired: 'Is expired',
	expires: 'Expires',
	expiring: 'Expiring',
	others: 'Others',
	minute: 'minute',
	minutes: 'minutes',
	hour: 'hour',
	hours: 'hours',
	create: 'Create',
	author: 'Author',
	you_have_1_new_comment: 'You have a new Talk',
	you_have_n_new_comment: 'You have {N} new Talks',
	you_have_1_new_notif: 'You have a new notification',
	you_have_n_new_notif: 'You have {N} new notifications',
	order: 'Order',
	direction: 'Direction',
	ascending: 'Ascending',
	descending: 'Descending',
	first: 'First',
	second: 'Second',
	third: 'Third',
	none: 'None',
	show_more_fields: 'Show more fields',
	show: 'Show',
	close: 'Close',
	folder: 'Folder',
	folders: 'Folders',
	no_templates: 'No templates',
	choose_template: 'Choose a template',
	choose_recipients: 'Choose the recipients',
	choose_pdf_export: 'Choose export type',
	pdfmaker_sendemail: 'Send by email',
	pdfmaker_savedoc: 'Save as a Document',
	subject: 'Subject',
	message: 'Message',
	messages: 'Messages',
	send: 'Send',
	select_one_recipient: 'Select at least one recipient',
	correctly_saved: 'correctly saved',
	email_sent: 'Email sent',
	sending_email: 'Sending email...',
	permission_denied: 'Permission denied',
	not_enough_privileges: 'Insufficient privileges',
	vte_lang_not_found: 'VTE Language not found',
	download: 'Download',
	please_select: 'Please select',
	no_recipients: 'No recipients found',
	autoscroll_blocks: 'Auto scrolling of blocks',
	new_talk: 'New talk',
	select_recipients: 'Select recipients',
	post_comment_to_all: 'Send the comment to all VTE users?',
	answer: 'Answer',
	publish_answer: 'Publish answer',
	close_task: 'Close Task',
	edit: 'Edit',
	details: 'Details',
	not_supported_by_server: 'This feature is not yet supported by VTE',
	open_todo_details: 'Open task details',
	ajax_failed: 'Request failed. Check the network connection',
	configure_messages: 'Messages not configured. Check the settings in VTE.',
	calendar: 'Calendar',
	from: 'From',
	date: 'Date',
	mailboxes: 'Mailboxes',
	mail_cc: 'Cc',
	mail_bcc: 'Bcc',
	compose: 'Compose',
	replyHeader: 'On {date}, {author} wrote:',
	reply: 'Reply',
	reply_to_all: 'Reply all',
	do_forward: 'Forward',
	original_message: 'Original message',
	type_a_recipient: 'Insert at least one recipient',
	type_a_subject: 'Insert the subject',
	invalid_following_addr: 'The following addresses are not valid',
	mark_as_unread: 'Mark as unread',
	mark_as_read: 'Mark as read',
	flag_message: 'Flag',
	unflag_message: 'Remove flag',
	linked_items: 'Linked records',
	create_new: 'Create new',
	link_record: 'Link',
	link_to: 'Link to',
	attachment: 'Attachment',
	attachments: 'Attachments',
	what_to_search: 'What are you looking for?',
	where: 'Where',
	all_the_crm: 'All the CRM',
	area: 'Area',
	download_error: 'Unable to download file',
	cancel_compose_message: 'Cancel the message delivery?',
	shared_calendars: 'Shared calendars',
	show_calendar_of: 'Show calendar of',
	description: 'Description',
	begin: 'Begin',
	all_day: 'All day',
	select_message: 'Select a message',
	send_options: 'Send options',
	send_mode: 'Send mode',
	single: 'Single',
	multiple: 'Multiple',
	sender: 'Sender',
	participation: 'Participation',
	participate: 'Participate',
	pull_to_refresh: 'Pull to refresh',
	release_to_refresh: 'Release to refresh',
	last_updated: 'Last updated',
	invalid_credentials: 'Invalid username or password',
	check_connection: 'Check network connection',
};
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/*
string translations
*/

if (typeof ALL_LANGS == 'undefined') ALL_LANGS = {};

/**
 * @class ALL_LANGS.it_it
 * @singleton
 * The italian language pack
 */
ALL_LANGS['it_it'] = {

	// this is called when setting the language, to override Sencha strings (especially dates)
	senchaStrings : function() {

		Ext.Date.dayNames =
		Ext.DateExtras.dayNames = [ 'Domenica', 'Lunedì', 'Martedì', 'Mercoledì',
				'Giovedì', 'Venerdì', 'Sabato' ];

		Ext.Date.monthNames =
		Ext.DateExtras.monthNames = [ 'Gennaio', 'Febbraio', 'Marzo', 'Aprile',
				'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre',
				'Novembre', 'Dicembre' ];

		Ext.Date.monthNumbers =
		Ext.DateExtras.monthNumbers = {
			'Gen' : 0,
			'Feb' : 1,
			'Mar' : 2,
			'Apr' : 3,
			'Mag' : 4,
			'Giu' : 5,
			'Lug' : 6,
			'Ago' : 7,
			'Set' : 8,
			'Ott' : 9,
			'Nov' : 10,
			'Dic' : 11
		};

		if (Ext.Date.parseCodes && Ext.Date.parseCodes.S) {
			Ext.Date.parseCodes.S.s = '(?:st|nd|rd|th)';
		}

		if (Ext.picker.Picker) {
			// this is a very dirty hack ;)
			Ext.picker.Picker.prototype.config.doneButton = 'Fatto';
			Ext.picker.Picker.prototype.config.cancelButton = 'Annulla';
		}

		if (Ext.picker.Date) {
			Ext.override(Ext.picker.Date, {
				'dayText' : 'Giorno',
				'monthText' : 'Mese',
				'yearText' : 'Anno',
				'slotOrder' : [ 'day', 'month', 'year' ]
			});
		}

		if (Ext.NestedList) {
			Ext.override(Ext.NestedList, {
				'backText' : 'Indietro',
				'loadingText' : 'Caricamento...',
				'emptyText' : 'Nessun elemento disponibile.'
			});
		}

		if (Ext.util.Format) {
			Ext.util.Format.defaultDateFormat = 'd/m/Y';
			Ext.util.Format.defaultHourFormat = 'H:i';
		}

		if (Ext.MessageBox) {
			Ext.MessageBox.OK.text = 'OK';
			Ext.MessageBox.CANCEL.text = 'Annulla';
			Ext.MessageBox.YES.text = 'Sì';
			Ext.MessageBox.NO.text = 'No';
			Ext.MessageBox.YESNO[0].text = 'No';
			Ext.MessageBox.YESNO[1].text = 'Sì';
		}

	},

	config: 'Impostazioni',
	logout: 'Logout',
	login: 'Login',
	username: 'Username',
	password: 'Password',
	vte_address: 'Indirizzo VTE',
	warning: 'Attenzione',
	error: 'Errore',
	login_failed: 'Login fallito',
	specify_username: 'Specificare un nome utente',
	specify_password: 'Specificare una password',
	specify_address: 'Specificare un indirizzo',
	loading_login: 'Login in corso...',
	loading_modules: 'Lettura moduli...',
	loading_entities: 'Caricamento lista...',
	loading: 'Caricamento...',
	lbl_new: 'Nuovo',
	back: 'Indietro',
	forward: 'Avanti',
	save: 'Salva',
	recents: 'Recenti',
	favourites: 'Preferiti',
	search: 'Ricerca',
	field: 'Campo',
	previous_value: 'Valore precedente',
	current_value: 'Valore attuale',
	to: 'a',
	notifications: 'Notifiche',
	talks: 'Conversazioni',
	added_items: 'Elementi aggiunti',
	changed_items: 'Elementi cambiati',
	publish: 'Pubblica',
	do_answer: 'Rispondi',
	choose: 'Scegli',
	users: 'Utenti',
	user: 'Utente',
	groups: 'Gruppi',
	all: 'Tutti',
	done: 'Fatto',
	select: 'Seleziona',
	selected: 'Selezionati',
	write_something: 'Devi scrivere qualcosa',
	select_users: 'Devi selezionare degli utenti',
	saving_comment: 'Salvataggio commento...',
	to_read: 'Da leggere',
	other_talks: 'Altre conversazioni',
	language: 'Lingua',
	italian: 'Italiano',
	english: 'Inglese',
	from_vte: 'Da VTE',
	offline: 'Offline',
	delete_label: 'Elimina',
	autogenerate_msg: 'AUTOGENERATO AL SALVATAGGIO',
	year: 'Anno',
	month: 'Mese',
	day: 'Giorno',
	ok: 'OK',
	save_pending: 'Salvare le modifiche?',
	delete_record: 'Eliminare il record?',
	delete_product: 'Eliminare il prodotto?',
	delete_relation: 'Eliminare la relazione?',
	delete_message: 'Eliminare il messaggio?',
	fill_mandatory: 'Compilare i campi obbligatori',
	fill_fields: 'Compilare i campi',
	mandatory_field: 'Campo obbligatorio',
	informations: 'Informazioni',
	version: 'Versione',
	no_records: 'Nessun record',
	total: 'Totale',
	products: 'Prodotti',
	settings: 'Impostazioni',
	api_version_mismatch: 'La versione lato server non &egrave; supportata. Si consiglia di aggiornare l\'app.',
	end: 'Fine',
	mask_timeout: 'Il server sta impiegando troppo tempo a rispondere. Controllare la connessione',
	animations: 'Animazioni',
	record_already_opened: 'Il record &egrave; gi&agrave; aperto',
	nesting_limit_reached: '&Egrave; stato raggiunto il limite di pannelli aperti simultaneamente.',
	invalid_server_response: 'Risposta non valida dal server',
	not_target_revision: 'La versione lato server non &egrave; aggiornata, alcune funzionalit&agrave; sono disabilitate. Si consiglia un aggiornamento del VTE.',
	add: 'Aggiungi',
	no_modules_reload: 'Nessun modulo caricato. Effettuare nuovamente il login',
	confirm_offline: 'Verranno scaricati i dati dal CRM per l\'utilizzo offline. La procedura potrebbe richiedere alcuni minuti',
	logout_offline: 'Se non si effettua una sincronizzazione verranno persi i dati offline. Effettuare comunque il logout?',
	about: 'Riguardo a',
	module: 'Modulo',
	filters: 'Filtri',
	notification_delay: 'Controllo notifiche',
	never: 'Mai',
	todos: 'Compiti',
	is_expired: '&Egrave; scaduto',
	expires: 'Scade',
	expiring: 'In scadenza',
	others: 'Altri',
	minute: 'minuto',
	minutes: 'minuti',
	hour: 'ora',
	hours: 'ore',
	create: 'Crea',
	author: 'Autore',
	you_have_1_new_comment: 'Hai {N} nuova conversazione',
	you_have_n_new_comment: 'Hai {N} nuove conversazioni',
	you_have_1_new_notif: 'Hai {N} nuova notifica',
	you_have_n_new_notif: 'Hai {N} nuove notifiche',
	order: 'Ordinamento',
	direction: 'Direzione',
	ascending: 'Ascendente',
	descending: 'Discendente',
	first: 'Primo',
	second: 'Secondo',
	third: 'Terzo',
	none: 'Nessuno',
	show_more_fields: 'Mostra altri campi',
	show: 'Mostra',
	close: 'Chiudi',
	folder: 'Cartella',
	folders: 'Cartelle',
	no_templates: 'Nessun template',
	choose_template: 'Scegli un template',
	choose_recipients: 'Scegli i destinatari',
	choose_pdf_export: 'Scegli il tipo di esportazione',
	pdfmaker_sendemail: 'Invia per email',
	pdfmaker_savedoc: 'Salva nei Documenti',
	subject: 'Oggetto',
	message: 'Messaggio',
	messages: 'Messaggi',
	send: 'Invia',
	select_one_recipient: 'Seleziona almeno un destinatario',
	correctly_saved: 'salvato correttamente',
	email_sent: 'Email inviata',
	sending_email: 'Invio email...',
	permission_denied: 'Permesso negato',
	not_enough_privileges: 'Privilegi insufficienti',
	vte_lang_not_found: 'Lingua VTE non trovata',
	download: 'Scarica',
	please_select: 'Prego selezionare',
	no_recipients: 'Nessun destinatario trovato',
	autoscroll_blocks: 'Scorrimento automatico blocchi',
	new_talk: 'Nuova conversazione',
	select_recipients: 'Seleziona destinatari',
	post_comment_to_all: 'Inviare il commento a tutti gli utenti di VTE?',
	answer: 'Risposta',
	publish_answer: 'Pubblica risposta',
	close_task: 'Chiudi compito',
	edit: 'Modifica',
	details: 'Dettagli',
	not_supported_by_server: 'Funzionalit&agrave; non ancora supportata da VTE',
	open_todo_details: 'Aprire i dettagli del compito',
	ajax_failed: 'Richiesta fallita. Controllare la connessione',
	configure_messages: 'Messaggi non configurati. Controllare le impostazioni nel VTE',
	calendar: 'Calendario',
	from: 'Da',
	date: 'Data',
	mailboxes: 'Caselle',
	mail_cc: 'Cc',
	mail_bcc: 'Ccn',
	compose: 'Componi',
	replyHeader: '{date}, {author} ha scritto:',
	reply: 'Rispondi',
	reply_to_all: 'Rispondi a tutti',
	do_forward: 'Inoltra',
	original_message: 'Messaggio originale',
	type_a_recipient: 'Inserire almeno un destinatario',
	type_a_subject: 'Inserire l\'oggetto',
	invalid_following_addr: 'I seguenti indirizzi non sono validi',
	mark_as_unread: 'Segna come non letto',
	mark_as_read: 'Segna come letto',
	flag_message: 'Contrassegna',
	unflag_message: 'Rimuovi contrassegno',
	linked_items: 'Record collegati',
	create_new: 'Crea nuovo',
	link_record: 'Collega',
	link_to: 'Collegare a',
	attachment: 'Allegato',
	attachments: 'Allegati',
	what_to_search: 'Cosa cerchi?',
	where: 'Dove',
	all_the_crm: 'Tutto il CRM',
	area: 'Area',
	download_error: 'Impossibile scaricare il file',
	cancel_compose_message: 'Annullare l\'invio del messaggio?',
	shared_calendars: 'Calendari condivisi',
	show_calendar_of: 'Mostra calendario di',
	description: 'Descrizione',
	begin: 'Inizio',
	all_day: 'Tutto il giorno',
	select_message: 'Seleziona un messaggio',
	send_options: 'Opzioni di invio',
	send_mode: 'Invio',
	single: 'Singolo',
	multiple: 'Multiplo',
	sender: 'Mittente',
	participation: 'Partecipazione',
	participate: 'Partecipa',
	pull_to_refresh: 'Trascina per aggiornare',
	release_to_refresh: 'Rilascia per aggiornare',
	last_updated: 'Ultimo aggiornamento',
	invalid_credentials: 'Nome utente o password errati',
	check_connection: 'Controllare connessione di rete',
};
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

// classi per gestire il db

/**
 * @class DBQuery
 * Defines a single query statement
 *
 * @constructor
 * @param {String} q The query statement (with ? in place of literal parameters)
 * @param {Array} params Array with parameters
 * @param {Function} callback A callback function to call when the query has been executed
 */
function DBQuery(q, params, callback) {
	arguments.callee.internalId = ++arguments.callee.internalId || 1;
	if (typeof q != 'string' || q === '') {
		throw "DBQuery: Not a valid query string ('"+q+"')";
	}
	if (params === undefined || params === null) {
		params = [];
	} else {
		// converto in array semplice (permetto i null)
		params = $.map(params, function (value, key) { return (value === null ? [value] : value); });
	}
	this.id = arguments.callee.internalId;

	/**
	 * @property {String} q The query
	 */
	this.q = q;

	/**
	 * @property {Array} params The list of parameters
	 */
	this.params = params;

	/**
	 * @property {Function} callback The callback function
	 */
	this.callback = callback;

	this.sql = null;
	// TODO: result
}

// metodi per gli oggetti DBQuery
//DBQuery.prototype.??


/**
 * @class DB
 * @singleton
 * Wrapper to prepare and execute queries on the local WebSQL database engine
 *
 * @requires DBQuery
 */
var DB = {

	// timeout per le query, in secondi
	// quando falliscono esce un popup
	// TODO: non usato
	timeout: 5,

	/**
	 * @property {Number} [size=2097152 (2MB)]
	 * Size of the DB in bytes
	 */
	size: 1024*1024*2,

	// the db object
	db: null,

	// true if there's a query running
	// used to simulate timeout
	busy: false,

	// la coda delle query
	queue: [],

	// coda di funzioni da eseguire quando finisce la coda delle query
	endqueue: [],

	init: function() {
		this.db = openDatabase("VTE", "1.0", "VTE App Database", this.size);
		if (this.db == null) return this.errorCallback();
	},

	/**
	 * Checks if the engine is busy processing a query
	 */
	isBusy: function() {
		return this.busy;
	},

	/**
	 * Checks if there are no queued queries and the last query has been processed
	 */
	hasFinished: function() {
		return (this.queue.length == 0 && !this.isBusy());
	},

	/**
	 * Executes a query
	 * @param {String} q The query
	 * @param {Function} callcback The callback function
	 */
	query: function(q, callback) {
		return this.pquery(q, [], callback);
	},

	/**
	 * Executes a query with parameters
	 * @param {String} q The query
	 * @param {String} param The parameters
	 * @param {Function} callcback The callback function
	 */
	pquery: function(q, param, callback) {
		// inserisce nella coda
		var qobj = new DBQuery(q, param, callback);
		this.queue.push(qobj);
		// se è l'unica in coda, eseguo
		if (this.queue.length == 1)	this.executeNext();
	},

	// esegue la prossima query nella coda
	executeNext: function() {
		var me = this,
			nq;

		// se coda vuota o già in elaborazione esco
		if (this.queue.length == 0 || this.busy) {
			if (!this.busy) this.executeHandlers();
			return;
		}

		this.busy = true;
		nq = this.queue.shift();

		me.db.transaction(function(tx) {
			//console.log('PQUERY: '+nq.q, nq.params);
			tx.executeSql(nq.q, nq.params,
				// success callback
				function (tx, res) {
					me.busy = false;
					if (nq.callback && typeof nq.callback == 'function') nq.callback(me.resultToArray(res), res);
					// vai con la prossima
					me.executeNext();
				},
				// fail callback
				function (tx, err) {
					me.busy = false;
					me.errorCallback(err.message, nq.q);
					// vai con la prossima
					me.executeNext();
				}
			);
		});
	},

	/**
	 * Sets a function to be called at the end of the current queue or immediately if the queue is empty
	 */
	atEnd: function(callable, data) {
		if (typeof callable == 'function') {
			this.endqueue.push([callable, data]);
			this.executeHandlers();
		}
	},

	// esegue gli handler a fine query
	executeHandlers: function() {
		if (this.endqueue.length == 0 || !this.hasFinished()) return;

		while (this.endqueue.length > 0) {
			var funcinfo = this.endqueue.shift();
			funcinfo[0](funcinfo[1]);
		}
	},

	// restituisce un array di oggetti che rappresentano le righe di un risultato
	resultToArray: function(res) {
		var i, ret = [];

		for (i=0; i<res.rows.length; ++i) {
			ret.push(res.rows.item(i));
		}

		return ret;
	},

	// called when a query goes in timeout
	timeoutCallback: function() {
		console.log('DB TIMEOUT');
	},

	// called for other db errors
	errorCallback: function(msg, sqlerr) {
		console.log('DB ERROR: '+msg, 'QUERY: '+sqlerr);
	}
};


/**
 * @class DBUtils
 * @singleton
 * Utility functions for database operations
 *
 * @requires DB
 */
var DBUtils = {

	/**
	 * Creates tables needed by the app
	 */
	initTables: function() {

		var tab1 = "CREATE TABLE IF NOT EXISTS crmentity (crmid INTEGER PRIMARY KEY, tabid INTEGER NOT NULL, module TEXT, favourite INTEGER, recent INTEGER, modflag INTEGER, entityname TEXT, fields TEXT)";
		var tab2 = "CREATE TABLE IF NOT EXISTS blocks (blockid INTEGER PRIMARY KEY, tabid INTEGER NOT NULL, module TEXT, type TEXT, related_tabid INTEGER, label TEXT, fields TEXT, related_module TEXT, actions TEXT)";
		var tab3 = "CREATE TABLE IF NOT EXISTS users (userid INTEGER PRIMARY KEY, user_name TEXT, first_name TEXT, last_name TEXT, complete_name TEXT, allow_generic_talks INTEGER, receive_public_talks INTEGER, preferencies TEXT)";
		var tab4 = "CREATE TABLE IF NOT EXISTS groups (groupid INTEGER PRIMARY KEY, groupname TEXT)";

		DB.query(tab1);
		DB.query(tab2);
		DB.query(tab3);
		DB.query(tab4);
	},

	/**
	 * Deletes all the tables
	 */
	dropTables: function() {
		DB.query('DROP TABLE IF EXISTS blocks');
		DB.query('DROP TABLE IF EXISTS crmentity');
		DB.query('DROP TABLE IF EXISTS users');
		DB.query('DROP TABLE IF EXISTS groups');
	},

	/**
	 * Executes a simple INSERT query
	 * @param {String} table
	 * The table where to insert the row
	 * @param {Object} obj
	 * An object which represents the row. Keys are column names
	 * @param {Boolean} replaceExisting
	 * If True, when a row with the same key fields is about to be inserted, it will be replaced
	 */
	insert: function(table, obj, replaceExisting) {
		if (obj == undefined || obj == null) return false;
		var keys = Object.keys(obj),
			replacesql = (replaceExisting ? 'OR REPLACE' : '');
		var query = "INSERT "+replacesql+" INTO "+table+" ("+keys.join(',')+") VALUES ("+this.questionMarks(obj)+")" ;
		DB.pquery(query, obj);
	},

	/**
	 * Counts the row in a table
	 * @param {String} table The table
	 * @param {Function} resCallback The callback function to call when the query has terminated
	 */
	count: function(table, resCallback) {
		var query = "SELECT COUNT(*) as count FROM "+table;
		return DB.query(query, resCallback);
	},

	// TODO: usare obj come colonna->alias
	// TODO: implementa orderby
	// TODO: controlli fatti bene sui parametri
	/**
	 * Executes a SELECT query
	 * @param {String} table The table
	 * @param {Object} obj The keys of this object defines which columns to retrieve
	 * @param {Object} objwhere This object generates the WHERE clause (keys = columns, joined with AND operators)
	 * @param {Function} resCallback The function call when the query is completed
	 */
	select: function(table, obj, objwhere, resCallback) {
		if (obj == undefined || obj == null) return false;
		var selectkeys = Object.keys(obj),
			wheresql = Object.setValues(objwhere, '?');
		wheresql = Object.keyvalues(wheresql, ' = ').join(' AND ');
		var query = "SELECT "+selectkeys.join(',')+" FROM "+table+(wheresql ? (" WHERE "+wheresql) : '');
		return DB.pquery(query, objwhere, resCallback);
	},

	/**
	 * Executes an UPDATE query. Same parameters of DBUtils.select
	 */
	update: function(table, obj, objwhere, resCallback) {
		if (obj == undefined || obj == null) return false;
		var updateobj = Object.setValues(obj, '?'),
			whereobj = Object.setValues(objwhere, '?'),
			updatesql = Object.keyvalues(updateobj, ' = ').join(', '),
			wheresql = Object.keyvalues(whereobj, ' = ').join(' AND '),
			query = "UPDATE "+table+" SET "+updatesql+(wheresql ? (" WHERE "+wheresql) : ''),
			params = Object.values(obj).concat(Object.values(objwhere));
		return DB.pquery(query, params, resCallback);
	},

	/**
	 * Execute an update if the row is present, an insert otherwise.
	 */
	upsert: function(table, obj, objwhere) {
		if (obj == undefined || obj == null) return false;
		var me = this,
			updateobj = Object.setValues(obj, '?'),
			whereobj = Object.setValues(objwhere, '?'),
			updatesql = Object.keyvalues(updateobj, ' = ').join(', '),
			wheresql = Object.keyvalues(whereobj, ' = ').join(' AND '),
			query = "UPDATE "+table+" SET "+updatesql+" WHERE "+wheresql,
			params = Object.values(obj).concat(Object.values(objwhere));
		DB.pquery(query, params, function(res, res2) {
			if (res2.rowsAffected == 0) {
				//do the insert
				me.insert(table, obj);
			}
		});
	},

	// TODO vacuum

	/**
	 * Deletes rows from a table
	 * @param {String} table The table
	 * @param {Object} obj The object to use to select rows to be deleted (keys:values)
	 */
	deleteTable: function(table, obj) {
		if (obj == undefined || obj == null) return false;
		var keys = Object.keys(obj);
		var query = "DELETE FROM "+table+" WHERE ";
		for (k in obj) {
			query += k+'=? AND ';
		}
		query = query.substr(0, query.length-5);
		DB.pquery(query, obj);
	},

	/**
	 * Drops a table from the database
	 * @param {String} table The name of the table
	 */
	drop: function(table) {
		var query = "DROP TABLE IF EXISTS "+table;
		DB.query(query);
	},

	/**
	 * Deletes all the rows of a table
	 * @param {String} table The name of the table
	 */
	truncate: function(table) {
		var query = "DELETE FROM "+table;
		DB.query(query);
	},

	// genera una stringa di punti interrogativi da usare con pquery
	// obj è un oggett, un array o un tipo atomico
	/**
	 * Generates a string of question marks separated by commas from the parameter passed.
	 * @param {Object/String} obj
	 */
	questionMarks: function(obj) {
		var qs = "";
		if (obj == undefined || obj == null) return qs;

		if (typeof obj == 'object') {
			var len = Object.keys(obj).length;
			for (var i=0; i<len-1; ++i) {
				qs += '?,';
			}
		}
		qs += '?';
		return qs;
	}

};
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/* inizializzazione variabili globali */

// debug: phone layout, android
//Ext.os.is.Phone = true;
//Ext.os.is.Android = true;


/**
 * @property
 * @readonly
 * App version. Must be a numeric value
 */
var app_version = 38;

/**
 * @property
 * @readonly
 * List of supported Webservice API versions
 */
var supp_api_versions = ['1.3', '1.4', '1.5', '1.6'];


// [undocumented] for now keep it compatible with vte 4.4.1
var vte_target_revision = 691; // revisione minima consigliata - kept to 691 for compatibility -> should be 830

// [undoc]
var demo_mode = false;

/**
 * @property
 * @readonly
 * VTECRM Website
 */
var crm_website = "http://www.vtecrm.com";

/**
 * @property
 * @readonly
 * Width of the available viewport for the app
 */
var viewport_width = 0;

/**
 * @property
 * @readonly
 * Height of the available viewport for the app
 */
var viewport_height = 0;

/**
 * @property {String} [vtwsUrl='']
 * @readonly
 * @postlogin
 * Url of the current VTE plus the path to the touch module.
 *
 * Example: http://yourvte.vtecrm.com/modules/Touch/
 */
var vtwsUrl = localStorage.getItem('vtwsUrl');

// [ Undocumented ] 'username='+user+'&password='+ws_accesskey+'&';
var vtwsOpts = localStorage.getItem('vtwsOpts');

/**
 * @property {String} [currentUserName='']
 * @readonly
 * @postlogin
 * Username of the current logged in user
 */
var currentUserName = vtwsOpts && vtwsOpts.split('&')[0].split('=')[1];

// [Undocumented] initial orientation
var display_orient = 'portrait';

/**
 * @property {Object} [current_user=null]
 * @readonly
 * @postlogin
 * Object which holds information about the current logged in user
 */
var current_user = null;

/**
 * @property
 * @readonly
 * Current language of the App interface.
 */
var language = 'en_us'; // lingua attualmente usata

/**
 * @property {String} [deviceLanguage=null]
 * @readonly
 * The language of the device. Currently the only supported values are 'it_it' and 'en_us'.
 */
var deviceLanguage = null;
if (navigator.language) {
	switch (navigator.language.substr(0,2).toLowerCase()) {
		case 'it' : deviceLanguage = 'it_it'; break;
		case 'en' : deviceLanguage = 'en_us'; break;
	}
}

// segnalibro variabile globale del calendario
var globalCalendar = null;

// segnalibro variabile globale dell'azienda selezionata nei rapportini
var globalAccountSelected = '';

/**
 * @class CONFIG
 * @singleton
 */
var default_config = {
	// variabili per le valute (usate solo parzialmente)
	// TODO: leggere da vte quando ci sarà
	'decimal_separator':		'.',
	'decimal_digits':			2,
	'thousand_separator':		'',
	'currency_symbol':			'&euro;',

	// timeout per le maschere, in millisecondi
	'mask_timeout':				60000,

	/**
	 * Time interval in ms to check for notifications (new messages, talks or notifications) from the server
	 */
	'notification_timeout':		60000,

	// limite per i pannelli aperti contemporaneamente
	'nesting_limit':			8,

	// offline - DISABLED
	'vte_offline':				0,
	'app_offline':				0,

	/**
	 * Enable various animations in the app
	 */
	'enable_animations':		1,

	/**
	 * @postlogin
	 * Language of the VTE
	 */
	'vte_language':				'',
	'language':					deviceLanguage || 'en_us',

	// gestione versione - se aggiorno, forzo un logout
	'app_version':				0,

	// gestione paginazione delle liste
	'list_page_limit':			40,

	/**
	 * If True or 1, autoscroll of blocks is enabled.
	 * In the config page, this option is only visible for iOS devices
	 */
	'autoscroll_blocks':		0,

	/*
	 * If True or 1 the fields has the VTE5 layout, with the text box under the field label
	 */
	'vertical_layout':			1,

};

/**
 * @class CONFIG
 * @singleton
 * Global App Configuration
 */
var CONFIG = {

	loadDefaults: function() {
		for (k in default_config) {
			this[k] = default_config[k];
		}
	},

	/**
	 * Load the configuration from the localStorage
	 */
	load: function() {
		var savedCfg = localStorage.getItem('config');
		try {
			savedCfg = JSON.parse(savedCfg);
		} catch (e) {
			savedCfg = default_config;
		}

		// load defaults
		this.loadDefaults();

		// override it
		if (savedCfg !== null && savedCfg !== '' ) {
			for (k in savedCfg) {
				this[k] = savedCfg[k];
			}
		}
	},

	/**
	 * Save the configuration to the localStorage
	 */
	save: function() {
		var savedCfg = {};
		for (k in this) {
			if (typeof this[k] === 'function') continue;
			savedCfg[k] = this[k];
		}
		localStorage.setItem('config', JSON.stringify(savedCfg));
	},

	/**
	 * Set a config value
	 * @param {String} cfg
	 * The name of the property to set
	 * @param {String} value
	 * The value of this property
	 */
	set: function(cfg, value) {
		this[cfg] = value;
		this.save();
	},

	clearOldConfig: function() {
		for (k in default_config) {
			localStorage.removeItem(k);
		}
	}

}

// carico config e salvo (per aggiornare con nuova configurazione)
CONFIG.load();
CONFIG.save();

// lingua
if (CONFIG.language == 'fromVTE' && !empty(CONFIG.vte_language)) {
	language = CONFIG.vte_language;
} else {
	language = CONFIG.language;
}
/**
 * @class LANG
 * @singleton
 * Current language object which holds all the strings used in the app.
 * To use a specific string use LANG.label syntax.
 * This object is created from one of the available languages in {@link ALL_LANGS}
 *
 */
var LANG = (ALL_LANGS[language] ? ALL_LANGS[language] : ALL_LANGS[(language = 'en_us')]);
if (typeof LANG.senchaStrings == 'function') LANG.senchaStrings();

// inizializzo db sql
DB.init();

//gestione versione - se aggiorno, forzo un logout
if (empty(CONFIG.app_version) || CONFIG.app_version < app_version) {
	// TODO: rimuovere anche altre robe (db...)
	localStorage.removeItem('vtwsOpts');
	localStorage.removeItem('modulesList');
	vtwsOpts = null;
	CONFIG.set('app_version', app_version);
	CONFIG.clearOldConfig();

	// clear DB also
	DBUtils.dropTables();
}

// fix
Ext.event.publisher.TouchGesture.prototype.isNotPreventable=/^(select|a|input|textarea|div)$/i;

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * @class Ext
 * Some standard SenchaTouch classes have been overridden to correct some bugs or provide new functionalities.
 * The SenchaTouch version used is 2.0.3
 */

/**
 * @class Ext.event
 */

/**
 * @class Ext.event.recognizer
 */

/**
 * @class Ext.event.recognizer.LongPress
 */


/**
 * Overridden to shorten the duration for the LongPress event to 500ms
 */
Ext.define('Ext.event.recognizer.LongPress2', {
	override: 'Ext.event.recognizer.LongPress',

	constructor: function() {
		this.callOverridden(arguments);
		this.setMinDuration(500);
	}
});

/**
 * @class Ext.plugin
 */

/**
 * @class Ext.plugin.PullRefresh
 */


/**
 * A little fixing for this class too
 */
Ext.define('Ext.plugin.PullRefresh2', {
	override: 'Ext.plugin.PullRefresh',

	// fix the date format
    resetRefreshState: function() {
        var me = this;

        me.isRefreshing = false;
        me.lastUpdated = new Date();

        me.setViewState('pull');
        // only hour
        me.updatedEl.setHtml(Ext.util.Format.date(me.lastUpdated, Ext.util.Format.defaultHourFormat));
    },

    // added delay and maskview
    loadStore: function() {
        var me = this,
            list = me.getList(),
            delay = 200,
            scroller = list.getScrollable().getScroller();

        me.setViewState('loading');
        me.isReleased = false;

        Ext.defer(function() {
        	maskView();
            scroller.on({
                scrollend: function() {
                	unMaskView();
                    if (me.getRefreshFn()) {
                        me.getRefreshFn().call(me, me);
                    } else {
                        me.fetchLatest();
                    }
                    me.resetRefreshState();
                },
                delay: 100,
                single: true,
                scope: me
            });
            scroller.minPosition.y = 0;
            scroller.scrollTo(null, 0, true);
        }, delay, me);
    },
});

/**
 * @class Ext.Container
 */

/**
 *
 */
Ext.define('Ext.Container2', {
	override: 'Ext.Container',

	/**
	 * Returns a list of visible (not hidden) inner items
	 */
	getVisibleInnerItems: function() {
		var innerItems = this.getInnerItems(),
			ret = [];

		for (var i=0; i<innerItems.length; ++i) {
			if (!innerItems[i].isHidden()) ret.push(innerItems[i]);
		}
		return ret;
	},

	/**
	 * Performs a quick destroy: instead of calling remove for each child component recursively, just removes the dom
	 * @experimental
	 * @protected
	 */
	quickDestroy: function() {
		var modal = this.getModal();

		if (modal) modal.destroy();
		Ext.destroy(this.getScrollable(), this.bodyElement);

		// call the destroy of the component (removes the dom at once!!)
		this.superclass.superclass.destroy.call(this);

	}
});

/**
 * @class Ext.dataview
 */

/**
 * @class Ext.dataview.element
 */

/**
 * @class Ext.dataview.element.List
 */

// TODO: rivedere per sencha 2.1
/**
 *
 */
Ext.define('Ext.dataview.element.List2', {
	override: 'Ext.dataview.element.List',


	// 1. use functions as disclosureProperty
	// 2. use templates also for class
	// 3. use templates for disclosure class
	getItemElementConfig: function(index, data) {
        var me = this,
            dataview = me.dataview,
            itemCls = dataview.getItemCls(),
            cls = me.itemClsShortCache,
            config, iconSrc;

        if (itemCls) {
        	var clsTpl = new Ext.XTemplate(itemCls);
            cls += ' ' + clsTpl.apply(data);
        }

        config = {
            cls: cls,
            children: [{
                cls: me.labelClsShortCache,
                html: dataview.getItemTpl().apply(data)
            }]
        };

        if (dataview.getIcon()) {
            iconSrc = data.iconSrc;
            config.children.push({
                cls: me.iconClsShortCache,
                style: 'background-image: ' + iconSrc ? 'url("' + newSrc + '")' : ''
            });
        }

        if (dataview.getOnItemDisclosure()) {
        	// mycrmv@touch
        	var disc = dataview.getDisclosureProperty(),
        		discCls2 = dataview.getDisclosureCls() || '',
        		discTpl2 = new Ext.XTemplate(discCls2);
        	if (Ext.isFunction(disc) || typeof disc === 'function') {
        		disc = disc.apply(me, [data]);
        	} else {
        		disc = data[disc];
        	}
            config.children.push({
                cls: me.disclosureClsShortCache + ' ' + discTpl2.apply(data) + ' ' + ((disc === false) ? me.hiddenDisplayCache : '')
            });
            // mycrmv@touch-e
        }
        return config;
    },
});

/**
 * @class Ext.scroll
 */

/**
 * @class Ext.scroll.Scroller
 */


/**
 * Added possibility to disable bounce effect while scrolling. Used mostly on Android since this
 * effect has terrible performances
 */
Ext.define('Ext.scroll.Scroller2', {
	override: 'Ext.scroll.Scroller',

	/**
	 * Disables the bounce effect
	 */
	disableBounce: function() {
		var me = this;

		me.setMomentumEasing({
			momentum: {
				acceleration: 30,
				friction: 0.5,
			},
			bounce: {
				acceleration: 0.0001,
				springTension: 0.9999,
			},
			minVelocity: 0.2,
		});
		me.setOutOfBoundRestrictFactor(0);
	}
});

/**
 * @class Ext.dataview
 */

/**
 * @class Ext.dataview.List
 */


/**
 * Adds a config parameter and disable the bounce effect by default when the OS is Android
 */
Ext.define('Ext.dataview.List2', {
	override: 'Ext.dataview.List',

	// TODO: BUG SENCHA!!!! http://www.sencha.com/forum/showthread.php?187525
	/*
	config: {
		disclosureCls: 'cc',
	},
	*/
	// i have to do this

	/**
	 * @cfg disclosureCls
	 *
	 */
	disclosureCls: '',

	constructor: function(config) {
		if (config.disclosureCls) {
			this.disclosureCls = config.disclosureCls;
		}
		this.callOverridden(arguments);

		// disable bounce in Android (horribly slow)
		if (Ext.os.is.Android) {
			this.disableBounce();
		}
	},

	getDisclosureCls: function() {
		return this.disclosureCls;
	},

	setDisclosureCls: function(cls) {
		this.disclosureCls = cls;
	},


	/**
	 * Disables the bounce effect when scrolling
	 */
	disableBounce: function() {
		var me = this;
		if (me.getScrollable() && me.getScrollable().getScroller()) {
			me.getScrollable().getScroller().disableBounce();
		}
	}
});


// implementa disable bounce e sync scrolling position al back
// REMOVED, not needed anymore
/*
Ext.define('Ext.dataview.NestedList2', {
	override: 'Ext.dataview.NestedList',

	constructor: function(config) {
		this.callOverridden(arguments);

		// disable bounce in Android (horribly slow)
		if (Ext.os.is.Android) {
			this.disableBounce();
		}
	},

	syncToolbar: function(forceDetail) {
        var me = this,
            detailCard = me.getDetailCard(),
            node = me.getLastNode(),
            detailActive = forceDetail || (detailCard && (me.getActiveItem() == detailCard)),
            parentNode = (detailActive) ? node : node.parentNode,
            backButton = me.getBackButton();

        //show/hide the backButton, and update the backButton text, if one exists
        if (backButton) {
            backButton[parentNode ? 'show' : 'hide']();
            if (parentNode && me.getUseTitleAsBackText()) {
                backButton.setText(me.renderTitleText(node.parentNode, true));
            }
        }

        if (node) {
            me.setTitle(me.renderTitleText(node));
        }

        if (me.bounceDisabled) me.disableBounce();
    },

	disableBounce: function() {
		var me = this,
			items = me.getItems();

		me.bounceDisabled = true;

		if (items.length > 0) {
			items.each(function(item) {
				if (Ext.getClassName(item) == 'Ext.dataview.List') {
					item.disableBounce();
				}
			});
		}
	},

    onItemTap: function(list, index, target, record, e) {
        var me = this,
            store = list.getStore(),
            node = store.getAt(index);

        me.fireEvent('itemtap', this, list, index, target, record, e);
        if (node.isLeaf()) {
            me.fireEvent('leafitemtap', this, list, index, target, record, e);
            me.goToLeaf(node);
        } else {
        	me.rootScrollY = list.getScrollable().getScroller().position.y;
            this.goToNode(node);
        }
    },

    doBack: function(me, node, lastActiveList, detailCardActive) {
        var layout = me.getLayout(),
            animation = (layout) ? layout.getAnimation() : null;

        if (detailCardActive && lastActiveList) {
            if (animation) {
                animation.setReverse(true);
            }
            me.setActiveItem(lastActiveList);
            me.setLastNode(node.parentNode);
            me.syncToolbar();
        }
        else {
            this.goToNode(node.parentNode);
        	if (this.rootScrollY) {
                this.firstList.getScrollable().getScroller().scrollTo(null, this.rootScrollY);
            	delete this.rootScrollY;
            }
        }
    },
});
*/

/**
 * @class Ext.field
 */

/**
 * @class Ext.field.Field
 */

/**
 * Adds a vertical layout to the fields
 */
Ext.define('Ext.field.Field2', {
	override: 'Ext.field.Field',

	/**
	 * @cfg [pressedCls=x-field-pressing]
	 */

	/**
	 * @cfg [verticalLayoutCls=x-container-vert]
	 */

	/**
	 * @cfg [verticalLayoutLabelCls=x-form-label-vert]
	 */

	/**
	 * @cfg {Boolean} button
	 * If True a button is displayed at the beginning of the field
	 */

	/**
	 * @cfg [buttonCls='']
	 */

	/**
	 * @cfg {Boolean} [verticalLayout=false]
	 * If True, the field is displayd with the new vertical layout
	 */

	/**
	 *
	 */
	getVerticalLayoutCls: function() {
		return this._verticalLayoutCls;
	},

	/**
	 *
	 */
	getButton: function() {
		return this._button;
	},

	/**
	 *
	 */
	getButtonCls: function() {
		return this._buttonCls;
	},

	/**
	 *
	 */
	getVerticalLayoutLabelCls: function() {
		return this._verticalLayoutLabelCls;
	},

	/**
	 *
	 */
	getVerticalLayout: function() {
		return this._verticalLayout;
	},

	/**
	 *
	 */
	getPressedCls: function() {
		return this._pressedCls;
	},

	/**
	 *
	 */
	setVerticalLayout: function(active) {
		var renderElement = this.renderElement,
			superOuter = renderElement.down('.x-component-super-outer'),
			labelCont = renderElement.getFirstChild(),
			prefix = Ext.baseCSSPrefix;

		this._verticalLayout = active;
		if (active) {
			this.setLabelWidth('90%');
			renderElement.removeCls('x-container').addCls(this.getVerticalLayoutCls());
			labelCont.removeCls('x-form-label').addCls(this.getVerticalLayoutLabelCls());
		} else {
			// TODO
		}
	},

	/**
	 *
	 */
	setButton: function(active) {
		var renderElement = this.renderElement,
			superOuter = renderElement.down('.x-component-super-outer'),
			buttonCont = superOuter.getFirstChild(),
			outerCont = superOuter.child('.x-component-outer'),
			prefix = Ext.baseCSSPrefix;

		this._button = active;
		buttonCont[active ? 'addCls' : 'removeCls'](prefix + 'field-buttons');
		outerCont[active ? 'addCls' : 'removeCls'](prefix + 'component-outer-vert');
		if (active) {
			// create the button
			var btn = this.createButton();

			buttonCont.appendChild(btn.element);
		}
	},

	setRequiredAlert: function(active) {
		var renderElement = this.renderElement,
			superOuter = renderElement.down('.x-component-super-outer'),
			outerCont = superOuter.child('.x-component-outer'),
			prefix = Ext.baseCSSPrefix,
			isVertical = this.getVerticalLayout();

		if (active) {
			if (isVertical) {
				outerCont.addCls('x-field-mustbefilled');
			} else {
				renderElement.addCls('x-field-mustbefilled');
			}
		} else {
			if (isVertical) {
				outerCont.removeCls('x-field-mustbefilled');
			} else {
				renderElement.removeCls('x-field-mustbefilled');
			}
		}
	},

	constructor: function(config) {
		var addedConfig = {
			verticalLayoutCls: 'x-container-vert',
			verticalLayoutLabelCls: 'x-form-label-vert',
			verticalLayout: false,
			button: false,
			buttonCls: '',
			pressedCls: 'x-field-pressing',
		};

		config = Ext.mergeIf(config || {}, addedConfig);
		this._verticalLayout = config.verticalLayout;
		this._verticalLayoutCls = config.verticalLayoutCls;
		this._verticalLayoutLabelCls = config.verticalLayoutLabelCls;
		this._button = config.button;
		this._buttonCls = config.buttonCls;
		this._pressedCls = config.pressedCls;

		this.callOverridden([config]);

		// vertical layout
		if (this.getVerticalLayout()) {
			this.setLabelWidth('90%');
			this.setVerticalLayout(true);
		}

		// buttons
		if (this.getButton()) this.setButton(true);

		// readonly
		var renderElement = this.renderElement,
			superOuter = renderElement.down('.x-component-super-outer'),
			outerCont = superOuter.child('.x-component-outer');
			//field = outerCont.child('.x-field-input')
		if (this.getReadOnly && this.getReadOnly()) {
			outerCont.addCls('x-field-readonly'+ (this.getVerticalLayout() ? '-vert' : '') );
		}

		// label
		if (this.getLabel() == null || this.getLabel() == '') {
			// add a class
			var el = this.element.down('.x-field-input');
			if (el) el.addCls('x-field-input-nolabel');
		}

		//press event
		outerCont.on({
			scope: this,
			touchstart: 'onPress',
			touchend: 'onRelease',
			dragstart: 'onRelease',
		});
	},

	onPress: function() {
		var me = this,
            pressedCls = me.getPressedCls(),
            renderElement = this.renderElement,
			superOuter = renderElement.down('.x-component-super-outer'),
			outerCont = superOuter.child('.x-component-outer'),
			ro = (this.getReadOnly && this.getReadOnly());

        if (!me.getDisabled() && !ro) {
        	outerCont.addCls(pressedCls);
        }
    },

    onRelease: function() {
    	var me = this,
        	pressedCls = me.getPressedCls(),
        	renderElement = this.renderElement,
        	superOuter = renderElement.down('.x-component-super-outer'),
        	outerCont = superOuter.child('.x-component-outer'),
        	ro = (this.getReadOnly && this.getReadOnly());

        if (!me.getDisabled() && !ro) {
        	outerCont.removeCls(pressedCls);
        }
    },

    createButton: function() {
    	var me = this;
    	if (!me.buttonElement) {
    		// genero il pulsante
    		me.buttonElement = Ext.create('Ext.Button', me.getButtonConfig());
    	}
    	return me.buttonElement;
    },

    getButtonConfig: function() {
    	var me = this,
    		isVertical = me.getVerticalLayout();

    	return ({
    		xtype: 'button',
    		cls: 'field-button'+(isVertical ? '-vert' : ''),
   			iconMask: true,
   			iconCls: 'field-button-image'+(isVertical ? '-vert' : '') + ' ' + me.getButtonCls(),
   			ui: 'action',
   			handler: function() {
   				me.fireEvent('buttontap', me);
   			}
   		});
    },

	// called once per fieldtype
    getElementConfig: function() {
        var prefix = Ext.baseCSSPrefix;

        return {
            reference: 'element',
            className: 'x-container',
            children: [
                {
                    reference: 'label',
                    cls: prefix + 'form-label',
                    children: [{
                        reference: 'labelspan',
                        tag: 'span'
                    }]
                },
                {
                    reference: 'fieldContainer',
                    cls: prefix + 'component-super-outer',
                    children: [
                        {
                        	reference: 'buttonsContainer',
                        	//cls: prefix + 'field-buttons',
                        },
                        {
                        	reference: 'innerElement',
                        	cls: prefix + 'component-outer'
                        }
                    ]
                },

            ]
        };
    },
});


/**
 * @class Ext.form
 */

/**
 * @class Ext.form.FieldSet
 */

/**
 * Some additions to the FormSet to support the vertical layout
 */
Ext.define('Ext.form.FieldSet2', {
	override: 'Ext.form.FieldSet',

	/**
	 * @cfg {String} [verticalLayoutCls=form-fieldset-vert]
	 */

	/**
	 * @cfg {Boolean} [verticalLayout=false]
	 */

	// BUG SENCHA: doesn't work for overrides
	//config: {
	//},

	/**
	 *
	 */
	getVerticalLayoutCls: function() {
		return this._verticalLayoutCls;
	},

	/**
	 *
	 */
	getVerticalLayout: function() {
		return this._verticalLayout;
	},

	/**
	 *
	 */
	setVerticalLayoutCls: function(cls) {
		this._verticalLayoutCls = cls;
	},

	/**
	 *
	 */
	setVerticalLayout: function(active) {
		this._verticalLayout = active;
	},

	constructor: function(config) {
		var addedConfig = {
			verticalLayoutCls: 'form-fieldset-vert',
			verticalLayout: false,
		};

		config = Ext.mergeIf(config || {}, addedConfig);
		this._verticalLayoutCls = config.verticalLayoutCls;
		this._verticalLayout = config.verticalLayout;

		this.callOverridden([config]);

		if (this.getVerticalLayout()) this.setBaseCls(Ext.baseCSSPrefix + this.getVerticalLayoutCls());
	},

	/*
	 * INUTILE: i campi sono già creati
	 * add: function(newItems) {
		var isVertical = this.getVerticalLayout();

		newItems = Ext.Array.from(newItems);
		if (isVertical) {
		     for (var i=0; i<newItems.length; ++i) {
		    	 // TODO: if is a config object, just set the option
		    	 newItems[i].setVerticalLayout(true);
		     }
		}
		return this.callOverridden(newItems);
	},*/

});


/**
 * @class Ext.field.Select
 */


/**
 * Fix some bugs and autoscroll to selected record
 */
Ext.define('Ext.field.Select2', {
	override: 'Ext.field.Select',

    onListTap: function() {
    	var me = this,
    		animation = (CONFIG.enable_animations ? {
            type : 'fade',
            out  : true,
            scope: this
        } : undefined);

    	var task = Ext.create('Ext.util.DelayedTask', function() {
    		me.listPanel.hide(animation);
    	});

    	task.delay(150); // fix for iPad, prevent ghost clicks (doesn't work enyway)
    },

    getValueLabel: function() {
    	var value = this.getValue(),
    		store = this.getStore(),
    		dispField = this.getDisplayField(),
    		valField = this.getValueField(),
    		rec = (store ? store.findRecord(valField, value) : null),
    		label = (rec ? rec.get(dispField) : null);

    	return label;
    },

    showPicker: function() {
        var store = this.getStore();
        //check if the store is empty, if it is, return
        if (!store || store.getCount() === 0) {
            return;
        }

        if (this.getReadOnly()) {
            return;
        }

        this.isFocused = true;

        //hide the keyboard
        //the causes https://sencha.jira.com/browse/TOUCH-1679
        // Ext.Viewport.hideKeyboard();

        if (this.getUsePicker()) {
            var picker = this.getPhonePicker(),
                name   = this.getName(),
                value  = {};

            value[name] = this.getValue();
            picker.setValue(value);
            if (!picker.getParent()) {
                Ext.Viewport.add(picker);
            }
            picker.show();
        } else {
            var listPanel = this.getTabletPicker(),
                list = listPanel.down('list'),
                store = list.getStore(),
                index = store.find(this.getValueField(), this.getValue(), null, null, null, true),
                record = store.getAt((index == -1) ? 0 : index);

            if (!listPanel.getParent()) {
                Ext.Viewport.add(listPanel);
            }

            listPanel.showBy(this.getComponent());
            list.select(record, null, true);

            // e scrollo al punto giusto
        	var scroller = list.getScrollable().getScroller(),
        		storeIndex = list.getStore().indexOf(record),
        		item = list.container.getViewItems()[storeIndex],
        	    containerSize = scroller.getContainerSize().y,
                size = scroller.getSize().y,
                maxOffset = size - containerSize,
                offset = (item.offsetTop > maxOffset) ? maxOffset : item.offsetTop;
        	if (offset) scroller.scrollTo(0, offset);
        }
    },
});


/**
 * @class Ext.picker
 */

/**
 * @class Ext.picker.Date
 */

/**
 * Fixes the order of dates for non-US calendar (day, month, year)
 *
 * Adds a little delay to avoid a ghost click on iPad
 */
Ext.define('Ext.picker.Date2', {
	override: 'Ext.picker.Date',

	config: {
		slotOrder: (language == 'en_us' ? ['month', 'day', 'year'] : ['day', 'month', 'year']),
	},

	onDoneButtonTap: function() {
        var oldValue = this._value,
            newValue = this.getValue(true),
            testValue = newValue;

        if (Ext.isDate(newValue)) {
            testValue = newValue.toDateString();
        }
        if (Ext.isDate(oldValue)) {
            oldValue = oldValue.toDateString();
        }

        if (testValue != oldValue) {
            this.fireEvent('change', this, newValue);
        }

        Ext.defer(this.hide, 100, this); // fix for ipad
    }
});


/**
 * @class Ext.field.DatePicker
 */

/**
 * Various fixing
 */
Ext.define('Ext.field.DatePicker2', {
	override: 'Ext.field.DatePicker',

    applyValue: function(value) {
        if (!Ext.isDate(value) && !Ext.isObject(value) && !Ext.isString(value)) {
            return null;
        }

        if (Ext.isObject(value)) {
            return new Date(value.year, value.month - 1, value.day);
        } else if (Ext.isString(value)) {
        	// fix for safari, turn "-" into "/"
        	value = value.replace(/-/g, '/');
        	var date = new Date(value);
        	if (date == 'Invalid Date') date = null;
        	return date;
        }

        return value;
    },

    getPicker: function() {
        var picker = this._picker,
            value = this.getValue();

        // default data odierna
        if (value == null) value = new Date();

        if (picker && !picker.isPicker) {
            picker = Ext.factory(picker, Ext.picker.Date);
            if (value != null) {
                picker.setValue(value);
            }
        }

        picker.on({
            scope: this,
            change: 'onPickerChange',
            hide  : 'onPickerHide'
        });
        Ext.Viewport.add(picker);
        this._picker = picker;

        return picker;
    },
});

/**
 * @class Ext.form.TextArea
 */

/**
 * Fix for textarea on iOS
 */
Ext.define('Fix.Ext.form.TextArea', {
	override: 'Ext.form.TextArea',

	initialize: function() {
		this.callParent();
		this.element.dom.addEventListener(
			Ext.feature.has.Touch ? 'touchstart' : 'mousedown',
			this.handleTouchListener = Ext.bind(this.handleTouch, this),
			false
		);
		this.element.dom.addEventListener(
			Ext.feature.has.Touch ? 'touchmove' : 'mousemove',
			this.handleMoveListener = Ext.bind(this.handleMove, this),
			false
		);
		this.moveListenersAttached = true;
	},

	destroy: function() {
		// cleanup event listeners to avoid memory leak
		if (this.moveListenersAttached) {
			this.moveListenersAttached = false;
			this.element.dom.removeEventListener(
				Ext.feature.has.Touch ? 'touchstart' : 'mousedown',
				this.handleTouchListener,
				false
			);
			this.element.dom.removeEventListener(
				Ext.feature.has.Touch ? 'touchmove' : 'mousemove',
				this.handleMoveListener,
				false
			);
			this.handleTouchListener = this.handleMoveListener = null;
		};
		this.callParent();
	},

	handleTouch: function(e) {
		this.lastY = e.pageY;
	},

  	handleMove: function(e) {
  		var textArea = e.target,
  			top = textArea.scrollTop <= 0,
  			bottom = textArea.scrollTop + textArea.clientHeight >= textArea.scrollHeight,
  			up = e.pageY > this.lastY,
  			down = e.pageY < this.lastY;

  		this.lastY = e.pageY;

      // default (mobile safari) action when dragging past the top or bottom of a scrollable
      // textarea is to scroll the containing div, so prevent that.
  		if((top && up) || (bottom && down))	e.preventDefault();
      // Sencha disables textarea scrolling on iOS by default,
      // so stop propagating the event to delegate to iOS.
  		if(!(top && bottom))	e.stopPropagation();
  	}

});

// fox for total in treestore
// REMOVED!
/*
Ext.define('Ext.data.TreeStore2', {
	override: 'Ext.data.TreeStore',

    onProxyLoad: function(operation) {
        var me = this,
            records = operation.getRecords(),
            successful = operation.wasSuccessful(),
            resultSet = operation.getResultSet(), // added
            node = operation.getNode();

        // added
        if (resultSet) {
            me.setTotalCount(resultSet.getTotal());
        }

        node.beginEdit();
        node.set('loading', false);
        if (successful) {
            records = me.fillNode(node, records);
        }
        node.endEdit();

        me.loading = false;
        me.loaded = true;

        node.fireEvent('load', node, records, successful);
        me.fireEvent('load', this, records, successful, operation);

        //this is a callback that would have been passed to the 'read' function and is optional
        Ext.callback(operation.getCallback(), operation.getScope() || me, [records, operation, successful]);
    },

    load: function(options) {
        options = options || {};
        options.params = options.params || {};

        var me = this,
            node = options.node = options.node || me.getRoot(),
            pl = me.getClearOnPageLoad();

        options.params[me.getNodeParam()] = node.getId();

        // ugly fix for pageload (clear if page = 1)
        if (me.currentPage <= 1) {
            node.removeAll(true);
        }
        node.set('loading', true);

        return me.callParent([options]);
    },
});
*/

/**
 * @class Ext.plugin.ListPaging
 */

/**
 * Fixes some bugs when using listpaging plugin with Nested Lists
 */
Ext.define('Ext.plugin.ListPaging2', {
	override: 'Ext.plugin.ListPaging',

    init: function(list) {
        var me = this,
        	scroller = list.getScrollable().getScroller(),
            store    = list.getStore();

        me.storeBinded = true;
        if (Ext.getClassName(store) == 'Ext.data.NodeStore') {
        	// TODO: questo non va, il parent non c'è
        	var plist = list.getParent();
        	store = (plist ? plist.getStore() : null);
        	if (!store) me.storeBinded = false;
        }

        this.setList(list);
        this.setScroller(scroller);
        this.bindStore(store);

        // We provide our own load mask so if the Store is autoLoading already disable the List's mask straight away,
        // otherwise if the Store loads later allow the mask to show once then remove it thereafter
        if (store) {
            this.disableDataViewMask(store);
        }

        // The List's Store could change at any time so make sure we are informed when that happens
        list.updateStore = Ext.Function.createInterceptor(list.updateStore, this.bindStore, this);

        if (this.getAutoPaging()) {
            scroller.on({
                scrollend: this.onScrollEnd,
                scope: this
            });
        }
    },

    storeFullyLoaded: function() {
        var me = this,
        	list = me.getList(),
        	store = list.getStore(),
            total = store.getTotalCount();

        if (Ext.getClassName(store) == 'Ext.data.NodeStore') {
        	var plist = list.getParent()
        		pstore = (plist ? plist.getStore() : null),
        		ptotal = (pstore ? pstore.getTotalCount() : null);

            if (!me.storeBidned && pstore) {
            	me.bindStore(pstore, store);
            	me.storeBinded = true
            }

       		return ptotal !== null ? pstore.getTotalCount() <= (pstore.currentPage * pstore.getPageSize()) : false;
        } else {
        	return total !== null ? store.getTotalCount() <= (store.currentPage * store.getPageSize()) : false;
        }

    },


    loadNextPage: function() {
        var me = this;

        if (!me.storeFullyLoaded()) {
            me.setLoading(true);

            //keep a cache of the current scroll position as we'll need to reset it after the List is
            //updated with new data
            me.scrollY = me.getScroller().position.y;

            var list = me.getList(),
            	store = list.getStore();
            if (Ext.getClassName(store) == 'Ext.data.NodeStore') {
            	var plist = list.getParent()
            		pstore = (plist ? plist.getStore() : null);

            	if (pstore) {
            		var node = plist.getLastNode(),
            			isroot = (node.get('text') == 'Root');
            		if (isroot) {
            			// load only if in the root node
            			pstore.nextPage({ addRecords: true });
            		}
            	}
            } else {
            	store.nextPage({ addRecords: true });
            }
        }
    }
});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/* qui devo già avere incluso (1) utils.js e (2) app-initvars.js */

Ext.Loader.setConfig({
	enabled: true,
	disableCaching: false,
	paths: {
		//'Ext.data': 'SenchaTouch/src/data',
	    'Vtecrm': 'app',
	    'Ext': 'SenchaTouch/src'
	}
});

// to have the symbol defined
var Vtecrm = null;
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * WebSQL basic proxy, uses one table at time
 */
Ext.define('Vtecrm.store.proxy.WebSQL', {
    extend: 'Ext.data.proxy.WebStorage',

    alias: 'proxy.WebSQL',
    //alternateClassName: 'Vtecrm.proxy.SingleLocalStorage',

    requires: ['Ext.Date'],

    config: {
    	batchOrder: 'create,update,destroy',

    	/**
    	 *
    	 */
    	table: undefined,

    	reader: null,
    	writer: null,

    	sqlFilters: {}, // simple conditions used to read data: SELECT ... WHERE key1 = value1 AND ke2 = value2 ...
    },

    cache: undefined,

    initialize: function() {
    },


    create: function(operation, callback, scope) {

        var me = this,
        	modelClass = operation.getModel(),
        	model = new modelClass(),
        	records = operation.getRecords(),
            length  = records.length,
            idfield = (model && model.getIdField ? model.getIdField() : 'crmid'),
            wherefld = {},
            id, record, i;

        operation.setStarted();

        for (i = 0; i < length; ++i) {
        	if (records.items)
        		record = records.items[i];
        	else
        		record = records[i];
            id = record.getId();
            // insert or update
            wherefld[idfield] = id;
            DBUtils.upsert(me.getTable(), me.modelToDB(record), wherefld);
            me.cache[id] = record;
        }

        operation.setCompleted();
        operation.setSuccessful();

        if (typeof callback == 'function') {
            callback.call(scope || this, operation);
        }
    },

    // Warning: ASYNC!
    read: function(operation, callback, scope) {
    	var	me = this,
    		records    = [],
    		model      = this.getModel(),
    		idProperty = model.getIdProperty(),
    		params     = operation.getParams() || {},
    		sorters = operation.getSorters(),
    		filters = operation.getFilters(),
    		start = operation.getStart(),
    		limit = operation.getLimit(),
    		record, collection;

    	//read a single record, TODO
    	if (params[idProperty] !== undefined) {
    		console.log('TODO: WEBSQL READ SINGLE');
	   		/*
	   		record = this.getRecord(params[idProperty]);
	   		if (record) {
	   			records.push(record);
	   			operation.setSuccessful();
	   		}
	   		*/
	   	} else {

	   		var modelInstance = new model(),
	   			modelFields = modelInstance.getFields(),
	   			fields = this.modelToDB(modelInstance);

	   		collection = Ext.create('Ext.util.Collection');

	   		// First we comply to filters
	   		if (filters && filters.length) {
	   			collection.setFilters(filters);
	   		}
	   		// Then we comply to sorters
	   		if (sorters && sorters.length) {
	   			collection.setSorters(sorters);
	   		}

	   		var where = this.getSqlFilters();

	   		DBUtils.select(this.getTable(), fields, where, function(res) {
	   			length = res.length;

	   			for (var i = 0; i < length; ++i) {
	   				var object = Ext.clone(res[i]);

	   				// find the type of the field from the model
	   				for (var colname in object) {
	   					var resvalue = object[colname],
	   						modelIndex = modelFields.indices[colname],
	   						modelType = (modelIndex ? modelFields.items[modelIndex].getType().type: null);

	   					if (modelType == 'auto') {
	   						// try to decode it
	   						try {
	   							object[colname] = Ext.decode(resvalue);
	   						} catch (e) {
	   						}
	   					}
	   				}
	   	   			records.push(object);
	   	   		}

	   			collection.addAll(records);

	   			if (me.getEnablePagingParams() && start !== undefined && limit !== undefined) {
	   	   			records = collection.items.slice(start, start + limit);
	   	   		} else {
	   	   			records = collection.items.slice();
	   	   		}

	   			operation.setSuccessful();
	   			operation.setCompleted();

	   			operation.setResultSet(Ext.create('Ext.data.ResultSet', {
	   		   		records: records,
	   		   		total  : records.length,
	   		   		loaded : true
	   		   	}));
	   		   	operation.setRecords(records);

	   		   	if (typeof callback == 'function') {
	   		   		callback.call(scope || this, operation);
	   		   	}

	   		});

	   	}

    },

    batch: function(options, /* deprecated */listeners) {
        var me = this,
            useBatch = me.getBatchActions(),
            model = me.getModel(),
            batch,
            records;

        if (options.operations === undefined) {
            // the old-style (operations, listeners) signature was called
            // so convert to the single options argument syntax
            options = {
                operations: options,
                listeners: listeners
            };

            Ext.Logger.deprecate('Passes old-style signature to Proxy.batch (operations, listeners). Please convert to single options argument syntax.');
        }

        if (options.batch && options.batch.isBatch) {
            batch = options.batch;
        } else {
            batch = new Ext.data.Batch(options.batch || {});
        }

        batch.setProxy(me);

        batch.on('complete', Ext.bind(me.onBatchComplete, me, [options], 0));
        if (options.listeners) {
            batch.on(options.listeners);
        }

        if (me.getBatchOrder()) { // sanity check
        Ext.each(me.getBatchOrder().split(','), function(action) {
             records = options.operations[action];
             if (records) {
                 if (useBatch) {
                     batch.add(new Ext.data.Operation({
                         action: action,
                         records: records,
                         model: model
                     }));
                 } else {
                     Ext.each(records, function(record) {
                         batch.add(new Ext.data.Operation({
                             action : action,
                             records: [record],
                             model: model
                         }));
                     });
                 }
             }
        }, me);
        }

        batch.start();
        return batch;
    },

    update: function(operation, callback, scope) {
    	console.log('SQL UPDATE');
    },

    destroy: function(operation, callback, scope) {
    	//console.log('SQL DESTROY');
    },


    clear: function() {
    	DBUtils.truncate(this.getTable());
    	this.cache = undefined;
    },

    getStorageObject: function() {
    	return false;
    },

    countRecords: function(callback) {
    	DBUtils.count(this.getTable(), function(r) {
    		if (typeof callback == 'function') callback(r[0].count);
    	});
    },

    modelToDB: function(record) {
    	var name,
    		dbrec = {},
    		fields = record.getFields().items,
    		data = record.getData();

    	for (k in fields) {
    		name = fields[k].getName();
    		if (name != 'id') {
    			var d = data[name];
    			if (typeof d == 'object') {
    				d = Ext.encode(d);
    			} else if (typeof d == 'undefined') {
    				d = null;
    			}
    			dbrec[name] = d;
    		}
    	}
    	return dbrec;
    }



});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/*
// non va, perchè?
Ext.define("Vtecrm.model.VteNotificationDetail", {
	extend: "Ext.data.Model",
	belongsTo: {
		model: 'Vtecrm.model.VteNotification',
		associationKey: 'changelogid',
		foreignKey: 'changelogid'
	},
	config: {
		fields: [
		    {name: 'changelogid', type: 'int'},
	        {name: 'fieldname', type: 'string'},
		    {name: 'previous', type: 'string'},
		    {name: 'current', type: 'string'},
		]
	}
});
*/

/**
 *
 */
Ext.define("Vtecrm.model.VteNotification", {
    extend: "Ext.data.Model",
    config: {
    	/*idProperty: 'crmid',
    	clientIdProperty: 'crmid',
    	identifier: 'simple',*/
    	/*hasMany: {
    		model:'Vtecrm.mode.VteNotificationDetail',
    		associationName: 'details',
    		associationKey: 'changelogid',
    		foreignKey: 'changelogid',
    		name: 'details',
    		autoLoad: true,
    	},*/
        fields: [
            {name: 'crmid', type: 'int'},
            {name: 'action', type: 'string'},
            {name: 'author', type: 'string'},
            {name: 'timestamp', type: 'string'},
            {name: 'timestampago', type: 'string'},
            {name: 'hasdetails', type: 'boolean'},
            {name: 'haslist', type: 'boolean'},
            //{name: 'changelogid', type: 'int'},
            {name: 'details', type: 'auto'},
            {name: 'list', type: 'auto'},

            {name: 'item-module', type: 'string'},
            {name: 'item-record', type: 'int'},
            {name: 'item-value', type: 'string'},
            {name: 'item-type', type: 'string'},

            {name: 'related_module', type: 'string'},
            {name: 'related_record', type: 'int'},
            {name: 'related_value', type: 'string'},
            {name: 'related_type', type: 'string'},
        ]
    },
    getId: function() {
    	var data = this.getData();
    	if (data && data['crmid'] !== undefined) {
    		return data['crmid'];
    	} else {
    		return this.callParent(arguments);
    	}
    },
    getDetails: function() {
    	return this.get('details');
    },
    getList: function() {
    	return this.get('list');
    }
});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

// Questo modello contiene la definione della tabella crmentity per gli elementi

/**
 *
 */
Ext.define("Vtecrm.model.VteUser", {
    extend: "Ext.data.Model",
    config: {
        fields: [
            {name: 'userid', type: 'int'},
            {name: 'user_name', type: 'string'},
            {name: 'first_name', type: 'string'},
            {name: 'last_name', type: 'string'},
            {name: 'complete_name', type: 'string'},
            {name: 'allow_generic_talks', type: 'int'}, // può creare commenti non collegati a record
            {name: 'receive_public_talks', type: 'int'}, // può ricevere conversazioni pubbliche
            {name: 'preferencies', type: 'auto'}, // other preferencies, TODO: move here also *talks
        ]
    },
    getId: function() {
    	var data = this.getData();
    	if (data && data['userid'] !== undefined) {
    		return data['userid'];
    	} else {
    		return this.callParent(arguments);
    	}
    },
    getIdField: function() {
    	return 'userid';
    }
});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

// Questo modello contiene la definione della tabella crmentity per gli elementi

/**
 *
 */
Ext.define("Vtecrm.model.VteGroup", {
    extend: "Ext.data.Model",
    config: {
        fields: [
            {name: 'groupid', type: 'int'},
            {name: 'groupname', type: 'string'},
        ]
    },
    getId: function() {
    	var data = this.getData();
    	if (data && data['groupid'] !== undefined) {
    		return data['groupid'];
    	} else {
    		return this.callParent(arguments);
    	}
    },
    getIdField: function() {
    	return 'groupid';
    }
});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 *
 */
Ext.define("Vtecrm.model.VteAssocProduct", {
    extend: "Ext.data.Model",
    config: {
        fields: [
            /**
             * @property {Number} crmid
             */
            {name: 'crmid', type: 'int'},

            /**
             * @property {Number} lineItemId
             */
            {name: 'lineItemId', type: 'int'},

            /**
             * @property {Number} tabid
             */
            {name: 'tabid', type: 'int'},

            /**
             * @property {String} setype
             */
            {name: 'setype', type: 'string'},

            /**
             * @property {String} entityname
             */
            {name: 'entityname', type: 'string'},

            /**
             * @property {Number} lineTotal
             */
            {name: 'lineTotal', type: 'number'},
        ]
    }
});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/


/**
 *
 */
Ext.define("Vtecrm.model.VteComment", {
    extend: "Ext.data.Model",
    config: {
        fields: [
            {name: 'crmid', type: 'int'},
            {name: 'author', type: 'string'},
            {name: 'authorPhoto', type: 'string'},
            {name: 'recipients', type: 'auto'},
            {name: 'timestamp', type: 'string'},
            {name: 'timestampago', type: 'string'},
            {name: 'commentcontent', type: 'string'},
            {name: 'related_to', type: 'int'},
            {name: 'related_to_module', type: 'string'},
            {name: 'related_to_name', type: 'string'},
            {name: 'leaf', type: 'boolean'},
            {name: 'unseen', type: 'boolean'},
            {name: 'forced', type: 'boolean'},
            {name: 'parent_comments', type:'int'},

            {name: 'comments', type: 'auto'},
        ]
    },
    getId: function() {
    	var data = this.getData();
    	if (data && data['crmid'] !== undefined) {
    		return data['crmid'];
    	} else {
    		return this.callParent(arguments);
    	}
    },
    // if deep == true, descend recursively
    setSeen: function(deep) {
    	var leaf = this.get('leaf');
    	this.set('unseen', false);
    	if (this.raw) this.raw.unseen = false;
    	if (!leaf && deep && this.childNodes && this.childNodes.length > 0) {
    		for (var i=0; i<this.childNodes.length; ++i) {
    			this.childNodes[i].setSeen(deep);
    		}
    	}

    }
    /*getDetails: function() {
    	return this.get('details');
    },
    getList: function() {
    	return this.get('list');
    }*/
});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/* TODO: unificare questi 2 */

/**
 *
 */
Ext.define("Vtecrm.model.VteFavourite", {
    extend: "Ext.data.Model",
    config: {
    	/*idProperty: 'crmid',
    	clientIdProperty: 'crmid',
    	identifier: 'simple',*/
        fields: [
            {name: 'crmid', type: 'int'},
            {name: 'tabid', type: 'int'},
            {name: 'module', type: 'string'},
            {name: 'entityname', type: 'string'},
            {name: 'favourite', type: 'int'},
            {name: 'extrafields', type: 'auto'}, // added to show extra fields
            //{name: 'recent', type: 'int'},
        ]
    },
    getId: function() {
    	var data = this.getData();
    	if (data && data['crmid'] !== undefined) {
    		return data['crmid'];
    	} else {
    		return this.callParent(arguments);
    	}
    }
});

/**
 *
 */
Ext.define("Vtecrm.model.VteRecent", {
    extend: "Ext.data.Model",
    config: {
    	/*idProperty: 'crmid',
    	clientIdProperty: 'crmid',
    	identifier: 'simple',*/
        fields: [
            {name: 'crmid', type: 'int'},
            {name: 'tabid', type: 'int'},
            {name: 'module', type: 'string'},
            {name: 'entityname', type: 'string'},
            //{name: 'favourite', type: 'int'},
            {name: 'recent', type: 'int'},
        ]
    },
    getId: function() {
    	var data = this.getData();
    	if (data && data['crmid'] !== undefined) {
    		return data['crmid'];
    	} else {
    		return this.callParent(arguments);
    	}
    }
});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 *
 */
Ext.define("Vtecrm.model.BlockListItem", {
    extend: "Ext.data.Model",
    config: {
        fields: [
            /**
             * @property {Number} blockid
             */
            {name: 'blockid', type: 'int'},
            /**
             * @property {String} blocklabel
             */
            {name: 'blocklabel', type: 'string'},
            /**
             * @property {String} type
             */
            {name: 'type', type: 'string'},
            /**
             * @property {String} related_module
             */
            {name: 'related_module', type: 'string'},
        ]
    },
});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

// modello che memorizza i filtri

/**
 *
 */
Ext.define("Vtecrm.model.VteFilter", {
    extend: "Ext.data.Model",

    config: {
        fields: [
            {name: 'cvid', type: 'int'},
            {name: 'all', type: 'boolean'},
            {name: 'viewname', type: 'string'},
            {name: 'sortfield', type: 'string'},
            {name: 'sortorder', type: 'string'},
            // todo: campi extra
        ]
    },

    getId: function() {
    	var data = this.getData();
    	if (data && data['cvid'] !== undefined) {
    		return data['cvid'];
    	} else {
    		return this.callParent(arguments);
    	}
    },

    getIdField: function() {
    	return 'cvid';
    }
});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

// modello che memorizza le cartelle

/**
 *
 */
Ext.define("Vtecrm.model.VteFolder", {
    extend: "Ext.data.Model",

    config: {
        fields: [
            {name: 'folderid', type: 'int'},
            {name: 'foldername', type: 'string'},
            {name: 'description', type: 'string'},
        ]
    },

    getId: function() {
    	var data = this.getData();
    	if (data && data['folderid'] !== undefined) {
    		return data['folderid'];
    	} else {
    		return this.callParent(arguments);
    	}
    },

    getIdField: function() {
    	return 'folderid';
    }
});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

// modello per campi in una picklist

/**
 *
 */
Ext.define("Vtecrm.model.VteFieldBasic", {
    extend: "Ext.data.Model",
    config: {

        fields: [
            {name: 'fieldid', type: 'int'},
            {name: 'name', type: 'string'},
            {name: 'label', type: 'string'},
        ]
    }
});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

// modello che memorizza i filtri

/**
 *
 */
Ext.define("Vtecrm.model.VteTodo", {
    extend: "Ext.data.Model",

    config: {
        fields: [
            {name: 'crmid', type: 'int'},
            {name: 'module', type: 'string'},
            {name: 'entityname', type: 'string'},
            {name: 'description', type: 'string'},
            {name: 'expired', type: 'boolean'},
            {name: 'is_now', type: 'boolean'},
            {name: 'date', type: 'date'},
            {name: 'timestampago', type: 'string'},
        ]
    },

    getId: function() {
    	var data = this.getData();
    	if (data && data['crmid'] !== undefined) {
    		return data['crmid'];
    	} else {
    		return this.callParent(arguments);
    	}
    },

    getIdField: function() {
    	return 'crmid';
    }
});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/


/**
 * @class Vtecrm.model.VteAutocomplete
 *
 * A basic model for the Vtecrm.field.Autocomplete field
 *
 */
Ext.define("Vtecrm.model.VteAutocomplete", {
    extend: "Ext.data.Model",
    config: {
        fields: [
            /**
             * @property {Number} crmid
             */
            {name: 'crmid', type: 'int'},
            /**
             * @property {Number} fieldid
             */
            {name: 'fieldid', type: 'int'},
            /**
             * @property {String} module
             */
            {name: 'module', type: 'string'},
            /**
             * @property {String} entityname
             */
            {name: 'entityname', type: 'string'},
            /**
             * @property {String} basicname
             */
            {name: 'basicname', type: 'string'},
            /**
             * @property {String} address
             */
            {name: 'address', type: 'string'},
        ]
    },
    getId: function() {
    	var data = this.getData();
    	if (data && data['crmid'] !== undefined) {
    		return data['crmid']+'@'+data['fieldid'];
    	} else {
    		return this.callParent(arguments);
    	}
    }
});

/**
 * @class Vtecrm.field.Autocomplete
 *
 * Provides an autocomplete field which calls the Autocomplete Webservice to get the list of results
 *
 */
Ext.define('Vtecrm.field.Autocomplete', {
    extend: 'Ext.field.Text',

    xtype: 'autocompletefield',

    config: {

    	clearIcon: false,

    	/**
    	 * @cfg {Number} minCharacters
    	 * Start the research only when there are at least these number of characters
    	 */
    	minCharacters: 3,

    	/**
    	 * @cfg {Number} keyTimeout
    	 * Start the research after this number of milliseconds
    	 */
    	keyTimeout: 500,

    	// if true, enable multiple values
    	multiple: false,
    	// values are separated by this regex
    	valueSeparator: /[\s,]+/,
    	// sanitize with this
    	properSeparator: ', ',

    	listConfig: {},
    	listProperty: '',
    },

    list: null,
    listPanel: null,

    initialize: function() {
    	var me = this;

    	// private properties
    	me.boxes = [];
    	me.timer = null;

    	this.callParent(arguments);

    	this.list = Ext.create('Ext.List', Ext.Object.merge({
    		store: {
    			autoLoad: false,
        		model: 'Vtecrm.model.VteAutocomplete',
    			proxy: {
    				type: "ajax",
        			url: vtwsUrl + "ws.php?wsname=Autocomplete",
        			extraParams: params_unserialize(vtwsOpts),
        			actionMethods: {read: 'POST'},
        			reader: {
        				type: 'json',
        				totalProperty: "total",
        				rootProperty: 'entries',
        			},
    			},
    		}
    	}, this.getListConfig()));

    	this.list.on({
    		scope: this,
    		'itemtap': 'onListTap',
    	});
    	var listStore = this.list.getStore();
    	if (listStore) {
    		listStore.on({
    			'beforeload' : function(self) {
        			var params = params_unserialize(vtwsOpts),
        				ids = [];

        			for (var i=0; i<me.boxes.length; ++i) {
        				ids.push(me.boxes[i].getId());
        			}
        			// extract found ids
        			params = Ext.Object.merge(params, {
        				'search' : me.getLastValue(),
        				'excludeIds' : ids.join(':'),
        			});
        			self.getProxy().setExtraParams(params);
        			// mostra girella
        			me.setStyle({
        				'background-image': 'url(resources/img/loader.gif)',
        				'background-repeat': 'no-repeat',
        				'background-position': '99% 0.7em',
        			});
    			},
    			'load': function(self, records) {
    				// nascondi girella
    				me.setStyle({
        				'background-image':'none',
        			});
    				if (records.length > 0) {
    					me.blur();
    					me.listPanel.showBy(me.getComponent());
    				}
    			}
    		});
    	}

    	this.listPanel = Ext.create('Ext.Panel', {
    		modal: true,
    		hideOnMaskTap: true,
    		left: '0px',
    		minHeight: '200px',
    		minWidth: '250px',
    		width: '50%',
    		maxWidth: '500px',
    		hidden: true,
    		layout: 'fit',
    		items: this.list,
    	});

    },

    getLastValue: function() {
    	var me = this,
    		value = me.getValue(),
    		tokens = value.split(me.getValueSeparator());

    	return tokens[tokens.length-1];
    },

    setLastValue: function(val) {
    	var me = this,
			value = me.getValue(),
			tokens = value.split(me.getValueSeparator());

    	tokens[tokens.length-1] = val;

    	me.setValue(tokens.join(me.getProperSeparator()));
    },

    // get address (+ id)
    getValues: function() {
    	var me = this,
    		value = me.getValue(),
    		tokens = value.split(me.getValueSeparator()),
    		ret = Ext.Array.merge(tokens, me.boxes);

    	return Ext.Array.clean(ret);
    },

    setValues: function(list) {
    	var me = this,
    		modelname = Vtecrm.model.VteAutocomplete.getName();

    	list = Ext.Array.from(list);

    	for (var i=0; i<list.length; ++i) {
    		var val = list[i];
    		if (typeof val == 'string') {
    			me.setLastValue(val);
    		} else if (val && val.modelName == modelname) {
    			me.addRecordBox(val);
    		}
    	}
    },

    clear: function() {
    	var me = this,
    		parentCont = me.getComponent().element,
    		eboxes = parentCont.query('.x-autocomplete-valuebox');

    	me.setValue('');

    	// remove the boxes
    	for (var i=0; i<me.boxes.length; ++i) {
    		parentCont.removeChild(eboxes[i]);
		}
    	me.boxes = [];
    	parentCont.repaint();
    },

    onKeyUp: function(e) {
    	var me = this,
    		value = me.getLastValue();

    	if (me.timer) {
    		clearTimeout(me.timer);
    		me.timer = null;
    	}

    	if (value.length >= me.getMinCharacters()) {
    		me.timer = setTimeout(function() {
    			me.list.getStore().load();
    			me.list.deselectAll();
    		}, me.getKeyTimeout());

    	}

    	return this.callParent(arguments);
    },

    addRecordBox: function(record) {
    	var me = this,
    		index = me.boxes.length,
    		showValue = record.raw[me.getListProperty()];

    	var newBox = Ext.Element.create({
    		cls: 'x-autocomplete-valuebox',
    		html: showValue+' ',
    		'data-id': record.getId(),
    	});

    	var deleteCross = Ext.Element.create({
    		cls: 'x-autocomplete-valuebox-remove',
    	});
    	newBox.appendChild(deleteCross);
    	deleteCross.on({
    		'tap': function(event, node, options) {
    			var recordId = node.parentNode.getAttribute('data-id'),
    				index = null;

    			for (var i=0; i<me.boxes.length; ++i) {
    				if (me.boxes[i].getId() == recordId) {
    					index = i;
    					break;
    				}
    			}
    			if (index !== null) {
    				me.removeBox(index, me.boxes[index], node.parentNode);
    			}
    		}
    	});


    	me.boxes.push(record);

    	var parentCont = me.getComponent().element;
    	parentCont.appendChild(newBox);
    },

    removeBox: function(index, record, node) {
    	var me = this;

    	me.boxes.splice(index, 1);
    	if (CONFIG.enable_animations) {
    		jQuery(node).fadeOut(400, function() {
    			node.parentNode.removeChild(node);
    		});
    	} else {
    		node.parentNode.removeChild(node);
    	}
    },

    onListTap: function(self,index,target,record, e) {
    	var me = this;
    	me.setLastValue('');
    	me.listPanel.hide();
    	me.addRecordBox(record);
    	me.focus();

    	// prevent the click to fire under the list (this fix doesn't work in Android)
    	e.preventDefault();
    },

});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

// TODO: non usare ID, ma ItemID per i bottoni


/**
 * The main container which contains everything
 */
Ext.define('Vtecrm.view.Main', {
	extend: 'Ext.Container',

	requires: [
	    'Ext.Container',
	    'Ext.TitleBar',
	    'Ext.Button'
	],

	config: {

		/**
		 * @hide
		 */
		id: 'mainPanel',

		/**
		 *
		 */
		itemId: 'mainView',

		/**
		 *
		 */
		layout: 'fit',

		/**
		 *
		 */
		flex: 1,

		/**
		 *
		 */
		fullscreen: true,

		/**
		 *
		 */
		scrollable: false,

		/**
		 * @hide
		 */
		items: [
		    {
		    	id: 'mainNavigationBar',
		    	itemId: 'mainNavigationBar',
		    	xtype: 'titlebar',
		        docked: 'top',
		        ui: 'dark',
		        scrollable: false,
				hidden: true,
				// segnalibro hidden: true per nascondere la barra superiore

		        defaults: {
					xtype: 'button',
					ui: 'plain',
					align: 'left',
				} ,

		        items: [
					{
						id: 'btnHome',
						iconCls: 'home',
						iconMask: true,
						hidden: !(Vtecrm && Vtecrm.app && Vtecrm.app.getHasLoginInfo()),
						handler: function() { Vtecrm.app.goHome(); },
					},
					{
						id: 'btnRecents',
						iconCls: 'recent',
						iconMask: true,
						hidden: true,
						handler: function() { Vtecrm.app.showRecents(); },
					},
					{
						id: 'btnFavourites',
						iconCls: 'favorites',
						iconMask: true,
						hidden: true,
						handler: function() { Vtecrm.app.showFavourites(); },
					},
					{
						id: 'btnMessages',
						iconCls: 'mail',
						iconMask: true,
						hidden: true,
						handler: function() { Vtecrm.app.showMessages(); },
					},
					{
						id: 'btnComments',
						iconCls: 'chat',
						iconMask: true,
						hidden: true,
						handler: function() { Vtecrm.app.showComments(); },
					},
					{
						id: 'btnNotifications',
						iconCls: 'world',
						iconMask: true,
						//badgeText: ""
						hidden: true,
						handler: function() { Vtecrm.app.showNotifications(); },
					},
					{
						//iconMask: true,
						//iconCls: "info",
						itemId: 'vtecrmLogo',
						text: '<img src="img/logo_vtecrm_phone.png" title="VTE CRM" alt="VTE CRM" />',
						align: "right",
						hidden: (Vtecrm && Vtecrm.app && Vtecrm.app.getHasLoginInfo()),
					    handler: function () {
					    	window.open(crm_website, '_system', 'location=no');
					    },
					}
		        ]
		    }

		],

		/**
		 * @hide
		 */
		listeners: {
			initialize: function(self) {
				var me = self,
					titlebar = me.down('titlebar'),
					autoButtons = ['btnHome'],
					reverseButtons = ['vtecrmLogo'],
					items = me.query('button');

				// fix for iOS 7
				if (Ext.os.is.iOS && Ext.os.version.major >= 7) {
					titlebar.element.applyStyles("height: 62px; padding-top: 15px;");
				}

				// show/hide buttons
				Ext.Array.forEach(items, function(item, index) {
					var itemId = item.getItemId() || item.getId();
					if (autoButtons.indexOf(itemId) >= 0) {
						item.setHidden(!(Vtecrm && Vtecrm.app && Vtecrm.app.getHasLoginInfo()));
					} else if (reverseButtons.indexOf(itemId) >= 0) {
						item.setHidden((Vtecrm && Vtecrm.app && Vtecrm.app.getHasLoginInfo()));
					}
				})

			}
		}
	},

	/**
	 * Sets the title in the main bar
	 */
	setMainTitle: function (title) {
		// disabilita se poco spazio (telefono)
		if (!Ext.os.is.Phone) {
			this.getComponent('mainNavigationBar').setTitle(title);
		}
	},


});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * A container with edit capabilities
 */
Ext.define('Vtecrm.view.EditableContainer', {
	extend: 'Ext.Container',

	config: {
		/**
		 *
		 */
		scrollable: true,

		/**
		 * @hide
		 */
		html: '',
	},

	// private stuff
	editable: false,
	edited: false,
	oldViewportAutoBlur: null,

	constructor: function(config) {
		var me = this,
			parent = me.getParent();
		this.callParent(arguments);

		this.element.on({
			scope: this,
			'tap' : 'onElementTap',
		});

		var scrollable = this.getScrollable(),
			scroller = (scrollable ? scrollable.getScroller() : null);

		// use the parent scroller in case
		if (!scroller && parent) {
			scroller = (parent.getScrollable() ? parent.getScrollable().getScroller() : null);
		}

		if (scroller) {
			scroller.on({
				scope: this,
				'scrollstart': function() {
					// make it not editable during the scroll
					if (me.isEditable()) {
						me.wasEditable = true;
						me.setEditable(false);
					}

				},
				'scrollend': function() {
					if (me.wasEditable) {
						me.setEditable(true);
						me.wasEditable = null;
					}
				}
			});
		}

		// this is not supported by Sencha, attach it directly to the DOM
		this.element.dom.addEventListener('keyup', this.onElementKeyUp.bind(me), false);

		// fix for Android (doesn't fire keyup when pressing Return)
		/*if (Ext.os.is.Android) {
			this.element.dom.addEventListener('keydown', this.onElementKeyDown.bind(me), false);
		}
		*/
	},

	/**
	 *
	 */
	isEditable: function() {
		return this.editable;
	},

	/**
	 *
	 */
	resetEdited: function() {
		this.edited = false;
	},

	/**
	 *
	 */
	hasBeenEdited: function() {
		return this.edited;
	},


	/**
	 * Called when the user taps on this component
	 */
	onElementTap: function(event, node, options) {
		this.setEditable(true);
	},

	// -------- these fixes are not needed anymore
	/**
	 * @hide
	 */
	onElementKeyDown: function(event) {
		var me = this;

		if (event.keyCode == 13) {
			// fires the keyup for Return key, since in Android is not fired!
			//return me.onElementKeyUp(event);
		}
	},

	/**
	 * @hide
	 */
	onElementKeyUp: function(event) {
		var me = this,
			key = event.keyCode;

		me.edited = true;

		// works in iOS and Android
		// insert linebreak, and put the cursor right after it
		/*if (key == 13 && window.getSelection) {
			var selection = window.getSelection(),
				range = selection.getRangeAt(0),
				br = document.createElement("br"),
				textNode = document.createTextNode($("<div>&nbsp;</div>").text()); //Passing " " directly will not end up being shown correctly

			event.preventDefault(); //Prevent default browser behavior
			range.deleteContents();
			range.insertNode(br);
			range.collapse(false);
			range.insertNode(textNode);
			range.selectNodeContents(textNode);
			range.collapse(true);
			selection.removeAllRanges();
			selection.addRange(range);
			return false;
		}*/
	},

	// -----------------------

	/**
	 * @protected
	 */
	destroy: function() {
		if (this.oldViewportAutoBlur !== null) {
			Ext.Viewport.setAutoBlurInput(this.oldViewportAutoBlur);
		}

		return this.callParent();
	},

	/**
	 *
	 */
	toggleEditable: function() {
		return this.setEditable(!this.editable);
	},

	/**
	 * @param {Boolean} [edit=false]
	 */
	setEditable: function(edit) {
		var me = this,
			element = me.element.down('.x-innerhtml');

		if (edit && !this.editable) {
			// this is to show the copy/paste menu in iOS
			this.oldViewportAutoBlur = Ext.Viewport.getAutoBlurInput();
			Ext.Viewport.setAutoBlurInput(false);
			// and now wet it editable
			element.set({'contenteditable':true});
			element.addCls('contentEditable');
			element.dom.focus();
			me.editable = true;
		} else if (!edit && this.editable){
			element.dom.blur();
			element.removeCls('contentEditable');
			element.set({'contenteditable':false});
			me.editable = false;
			// restore the old autoblur status
			if (this.oldViewportAutoBlur !== null) {
				Ext.Viewport.setAutoBlurInput(this.oldViewportAutoBlur);
				this.oldViewportAutoBlur = null;
			}
		}

	},

	/**
	 *
	 */
	setValue: function(val) {
		this.setHtml(val);
		this.edited = false;
	},

	/**
	 *
	 */
	getValue: function() {
		var htmlCont = this.innerElement.down('.x-innerhtml');
		return htmlCont.getHtml();
	}

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * Base class for the Vtecrm.view.GridView component
 */
Ext.define('Vtecrm.component.GridItem', {
    extend: 'Ext.dataview.component.DataItem',

    xtype: 'griditem',

    config: {
    	/**
    	 * The record
    	 */
    	dataRecord: null,

    	/**
    	 * if true, add a new line
    	 */
    	lastOfLine: false,


    	/**
    	 * @cfg {"big"/"small"} iconSize Size of the box
    	 */
    	iconSize: 'big',

    	/**
    	 * @protected
    	 */
    	iconSizes: {
    		small: '64px',
    		big: '128px',
    	},

    	// questo è una merda, non va una pippa!
    	/**
    	 * @hide
    	 */
    	dataMap: { },

    },

    constructor: function() {

    	var record = arguments[0].record;

    	if (record) {
    		if (record.get('lastOfLine') !== undefined) {
    			this.setLastOfLine(record.get('lastOfLine'));
    		}
    		//this.setDataRecord(record);
    	}

    	this.callParent(arguments);
    },

    updateLastOfLine: function(lol) {
    	if (lol) {
    		this.addCls('x-data-item-br');
    	} else {
    		this.removeCls('x-data-item-br');
    	}
    },


});

/**
 *
 */
Ext.define('Vtecrm.component.Module', {
	extend: 'Vtecrm.component.GridItem',

	xtype: 'gridmodule',

	config: {
		fallbackIcon: 'resources/img/mod_Generic',
	},

    updateRecord: function(record) {

    	if (!record) return;

    	var me = this,
    		dataview = me.config.dataview
    		data = dataview.prepareData(record.getData(true), dataview.getStore().indexOf(record), record),
    		module = data.view,
    		badgeText = data.badge,
    		last = data.lastOfLine,
    		element = me.element,
    		small = (me.getIconSize() == 'small'),
    		cellSize = me.getIconSizes()[me.getIconSize()];

    	// imposto last
    	me.setLastOfLine(last);

    	// creo o recupero l'elemento
    	var wrapElement = element.down('.x-dataview-grid-item'),
    		badgeElement = element.down('.x-badge'),
    		wrapLabel = element.down('.x-dataview-grid-label');

    	// create if missing
    	if (!wrapElement) {
    		wrapElement = Ext.Element.create();
            wrapElement.addCls('x-dataview-grid-item');
            wrapElement.addCls('x-dataview-grid-item-'+me.getIconSize());
            wrapElement.setSize(cellSize, cellSize);

            // carico l'immagine se esiste, altrimenti quella generica
            var imgurl = 'resources/img/mod_'+module+(small ? '_sm' : '')+'.png';
            btnimg = new Image();
            btnimg.onerror = function() {
            	wrapElement.setStyle({
            		'background-image': 'url('+me.getFallbackIcon()+(small ? '_sm' : '')+'.png)',
            	});
            }
            btnimg.onload = function() {
            	wrapElement.setStyle({
            		'background-image': 'url('+imgurl+')',
            	});
            }
            btnimg.src = imgurl;

            // badge
            badgeElement = Ext.Element.create({
        		tag: 'span',
        		cls: 'x-badge',
        		hidden: true,
        	});
            badgeElement.appendTo(wrapElement);

            // label
            wrapLabel = Ext.Element.create({
            	cls: 'x-dataview-grid-label',
            });
            wrapLabel.addCls('x-dataview-grid-label-'+me.getIconSize());
            wrapLabel.appendTo(wrapElement);

            wrapElement.appendTo(element);
    	}

    	// update section
    	wrapElement.data = module;

    	// badge
    	if (badgeText) {
        	wrapElement.addCls('x-hasbadge');
        	badgeElement.setHtml(badgeText);
        	badgeElement.show();
        } else {
        	wrapElement.removeCls('x-hasbadge');
        	badgeElement.setHtml('');
        	badgeElement.hide();
        }

        // etichetta
        wrapLabel.setHtml(data.label);

    },

});

/**
 *
 */
Ext.define('Vtecrm.component.Filter', {
	extend: 'Vtecrm.component.GridItem',

	xtype: 'gridfilter',

	config: {

	},

    updateRecord: function(record) {

    	if (!record) return;

    	var me = this,
    		dataview = me.config.dataview
    		data = dataview.prepareData(record.getData(true), dataview.getStore().indexOf(record), record),
    		module = data.module,
    		last = data.lastOfLine,
    		cvid = data.cvid,
        	recfilt = Vtecrm.app.getRecentFilter(module),
        	isRecent = (recfilt ? recfilt.cvid == cvid : false),

    		element = me.element,
    		small = (me.getIconSize() == 'small'),
    		cellSize = me.getIconSizes()[me.getIconSize()];

    	// imposto last
    	me.setLastOfLine(last);

        // creo l'elemento che contiene il pulsante
        var wrapElement = Ext.Element.create();
        wrapElement.addCls('x-dataview-grid-item');
        wrapElement.addCls('x-dataview-grid-item-'+me.getIconSize());
        wrapElement.setSize(cellSize, cellSize);
        wrapElement.data = record;

        // carico l'immagine se esiste, altrimenti quella generica
        var imgurl = 'resources/img/filter'+(small ? '_sm' : '')+'.png';
        btnimg = new Image();
        btnimg.onload = function() {
        	wrapElement.setStyle({
        		'background-image': 'url('+imgurl+')',
        	});
        }
        btnimg.src = imgurl;

        // etichetta
        var wrapLabel = Ext.Element.create({
        	cls: 'x-dataview-grid-label',
        	html: record.get('viewname'),
        });
        wrapLabel.setId('filter_label_'+module+'_'+cvid);
        wrapLabel.addCls('x-dataview-grid-label-'+me.getIconSize());
        if (isRecent) {
        	wrapLabel.addCls('x-grid-label-selected');
        }
        wrapLabel.appendTo(wrapElement);

        wrapElement.appendTo(element);
    },

});

/**
 *
 */
Ext.define('Vtecrm.component.Folder', {
	extend: 'Vtecrm.component.GridItem',

	xtype: 'gridfolder',

	config: {

	},

    updateRecord: function(record) {

    	if (!record) return;

    	var me = this,
    		dataview = me.config.dataview
    		data = dataview.prepareData(record.getData(true), dataview.getStore().indexOf(record), record),
    		module = data.module,
    		last = data.lastOfLine,
    		folderid = data.folderid,

    		element = me.element,
    		small = (me.getIconSize() == 'small'),
    		cellSize = me.getIconSizes()[me.getIconSize()];

    	// imposto last
    	me.setLastOfLine(last);

        // creo l'elemento che contiene il pulsante
        var wrapElement = Ext.Element.create();
        wrapElement.addCls('x-dataview-grid-item');
        wrapElement.addCls('x-dataview-grid-item-'+me.getIconSize());
        wrapElement.setSize(cellSize, cellSize);
        wrapElement.data = record;

        // carico l'immagine se esiste, altrimenti quella generica
        var imgurl = 'resources/img/filter'+(small ? '_sm' : '')+'.png';
        btnimg = new Image();
        btnimg.onload = function() {
        	wrapElement.setStyle({
        		'background-image': 'url('+imgurl+')',
        	});
        }
        btnimg.src = imgurl;

        // etichetta
        var wrapLabel = Ext.Element.create({
        	cls: 'x-dataview-grid-label',
        	html: record.get('foldername'),
        });
        wrapLabel.setId('folder_label_'+module+'_'+folderid);
        wrapLabel.addCls('x-dataview-grid-label-'+me.getIconSize());
        wrapLabel.appendTo(wrapElement);

        wrapElement.appendTo(element);
    },

});

/**
 *
 */
Ext.define('Vtecrm.view.GridView', {
	extend: 'Ext.dataview.DataView',
	xtype: 'gridview',

	config: {

		scrollable: false,
		inline: true,

		useComponents: true,
		//defaultType: 'moduleitem',

		label: '',
		columns: null,
		module: null,

		items: [
		    {
		    	xtype: 'label',
		    	itemId: 'gridLabel',
		    	docked: 'top',
		    	cls: 'x-grid-mainlabel',
		    	html: '',
		    	hidden: true,
		    },
		],

		listeners: {

			itemtouchstart: function(self, index, target, record) {
				self.onItemPress(target);
			},
			itemtouchend: function(self, index, target, record) {
				self.onItemRelease(target);
			},
		}

	},

    statics: {
        // calcola le dimensioni ottimali per icone e numero di righe, colonne
        // return array: [iconsize, margin, columns, rows]
        calcDimensions: function(type, container) {
        	var ret = ['128px', 2, 3],
        		iconSize = 128,
        		margin = 20,
        		sizex, sizey, dim_min, cols, rows;

        	display_orient = Ext.Viewport.getOrientation();
            if (display_orient == undefined || display_orient == null) display_orient = 'portrait';

            if (container && container.element) {
            	sizex = container.element.getWidth();
            	sizey = container.element.getHeight();
            } else {
            	sizex = document.body.clientWidth;
            	sizey = document.body.clientHeight;
            }

            if (!sizex)	sizex = (window.innerWidth > 0 ? window.innerWidth : screen.width);
        	if (!sizey) sizey = (window.innerHeight > 0 ? window.innerHeight : screen.height);

        	dim_min = Math.min(sizex, sizey);
        	if (Ext.os.is.Phone || dim_min < 480) {
        		iconSize = 64;
        		margin = 10;
        	}

        	cols = Math.max(2, Math.floor(0.9*sizex / (iconSize + margin*2)));
        	rows = Math.max(2, Math.floor(0.9*sizey / (iconSize + margin*2)));

        	// TODO: cerca di evitare la riga singola

        	ret = [iconSize+'px', margin, cols, rows];
        	return ret;
        }
    },

    updateLabel: function(text) {
    	var me = this,
    		label = me.down('#gridLabel');

    	label.setHtml(text);
    	label[text ? 'show' : 'hide']();
    },

	// add some properties to the record and pass them to the component
	prepareData: function(data, index, record) {
		var me = this,
			columns = me.getColumns(),
			outData = me.callParent(arguments);

		if (index > 0 && (index % columns) == (0)) {
			outData.lastOfLine = true;
		} else {
			outData.lastOfLine = false;
		}
		outData.module = me.getModule();
		return outData;
	},

	onItemPress: function(target) {
    	var label = target.element.down('.x-dataview-grid-label');
    	if (label) label.addCls('x-grid-label-pressed');
    },

    onItemRelease: function(target) {
    	var label = target.element.down('.x-dataview-grid-label');
    	if (label) label.removeCls('x-grid-label-pressed');
    },



});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * The modules grid in the main view
 */
Ext.define('Vtecrm.view.ModulesGrid', {
	extend: 'Ext.carousel.Carousel',

    alias: "view.ModulesGrid",

    requires: ['Vtecrm.view.GridView'],

    config: {

    	/**
    	 *
    	 */
    	itemId: 'modulesList',

    	/**
    	 *
    	 */
    	direction: 'horizontal',

    	/**
    	 * @hide
    	 */
    	scrollable: false,

    	/**
    	 * @hide
    	 */
    	width: '100%',

    	/**
    	 * @hide
    	 */
    	height: '100%',
    	//top: '-'+(document.height/16) + 'px',
    	//top : '-16px',

    	// custom
    	/**
    	 * @hide
    	 */
    	pages: 3,

    	/**
    	 *
    	 */
    	locked: false,

    	/**
    	 * If set, display only these modules
    	 */
    	showModules: [],

    	/**
    	 * If set, don't display these modules
    	 */
    	excludeMods: [],

    	/**
    	 * @hide
    	 */
    	listeners: {
    		initialize: function () {
    			var dimensions = Vtecrm.view.GridView.calcDimensions('main'),
    				modperpage = dimensions[2]*dimensions[3],
    				store = Ext.getStore('modulesStoreOffline');
    			if (store) {
    				// TODO: possible error: use a callback in the load
    				store.load();

    				if (store.getTotalCount() == 0) {
    					// should never get here
    					localStorage.setItem('vtwsOpts', '');
    					Ext.Msg.alert(LANG.error, LANG.no_modules_reload, function() {
        					window.location.reload();
    					});
    				}

    				// this is useless
    				this.setPages(Math.ceil(store.getTotalCount() / modperpage));
    			}

    			this.createGrids();
    		},

    		show: function() {
    			Vtecrm.app.mainview.setMainTitle('');
    		}
    	}
    },

    // disable dragging
    onDrag: function() {
    	if (!this.getLocked()) {
    		return this.callParent(arguments);
    	}
    },

    /**
     * Sets a badge for a module icon
     */
    setModuleBadge: function(module, badgeText) {
    	var me = this,
    		items = me.getInnerItems();

    	for (var i=0; i<items.length; ++i) {
    		var gview = items[i].down('gridview');
    		if (gview && gview.getStore) {
    			var store = gview.getStore(),
    				mod = store.findRecord('view', module);

    			if (mod) {
    				mod.set('badge', badgeText);
    			}
    		}
    	}
    },

    getModulesToDraw: function() {
    	var store = Ext.getStore('modulesStoreOffline'),
    		showOnly = this.getShowModules(),
    		exclude = this.getExcludeMods(),
    		mods = [];

    	store.each(function(record) {
    		var modname = record.get('view');
    		if (exclude.indexOf(modname) >= 0) return;
    		if (showOnly.length > 0 && showOnly.indexOf(modname) > -1) {
    			mods.push(modname);
    		} else if (showOnly.length == 0) {
    			mods.push(modname);
    		}
    	});

    	return mods;
    },

    /**
     * Creates the list of modules to display, divided by page
     */
    getPagedModules: function() {
    	var me = this,
    		dimensions = Vtecrm.view.GridView.calcDimensions('main'),
    		modperpage = dimensions[2]*dimensions[3],
    		mods = me.getModulesToDraw(),
    		modCount = mods.length,
    		pages = 0,
    		pagedMods = [];

    	for (var i=0, cnt=0; i<modCount; ++i) {
    		//console.log(mods[i], i, cnt, pages);
    		if (mods[i] == 'PageBreak') {
    			cnt = 0;
    			continue;
    		}
    		if (cnt % modperpage == 0) {
    			++pages;
    			cnt = 0;
    		}

    		if (mods[i] != 'PageBreak') {
    			if (!pagedMods[pages-1]) {
    				pagedMods[pages-1] = [];
    			}
    			pagedMods[pages-1].push(mods[i]);
    			++cnt;
    		}

    	}

    	return Ext.Array.toArray(pagedMods);
    },

    /**
     * Create the grids
     */
    createGrids: function() {
    	var me = this,
    		areas = Vtecrm.app.getAreas() || [],
    		store = Ext.getStore('modulesStoreOffline'),
    		mods = me.getModulesToDraw(),
    		pagedMods = me.getPagedModules(),
    		npages = pagedMods.length,
    		dimensions = Vtecrm.view.GridView.calcDimensions('main'),
    		smallOrBig = (dimensions[0] == '64px' ? 'small' : 'big');

    	this.setPages(npages);

    	if (this.getPages() <= 1) {
    		this.setLocked(true);
    		this.setIndicator(false);
    	} else {
    		this.setLocked(false);
    		this.setIndicator(true);
    	}

    	for (i = 0; i<this.getPages(); ++i) {
    		var records = [];
    		for (j=0; j<pagedMods[i].length; ++j) {
    			var rec = store.findRecord('view', pagedMods[i][j]);
    			if (rec) records.push(rec);
    		}

    		// optimize columns with the actual page records num
    		var cols = Math.min(Math.ceil(records.length/2), dimensions[2]),
    			areaLabel = '';

    		// if first module has an areaid, get the label from areas
    		var aid = records[0].get('areaid');
    		if (aid > 0 && areas.length > 0) {
    			Ext.Array.each(areas, function(area) {
    				if (area.areaid == aid) {
    					areaLabel = area.label;
    					return false;
    				}
    			});
    		}

			me.add(Ext.create('Ext.Container', {
				layout: 'fit',
				items: [{
					xclass: 'Vtecrm.view.GridView',
					defaultType: 'gridmodule',
					centered: true,
					label: areaLabel,
					columns: cols,
					itemConfig: {
						iconSize: smallOrBig,
					},
					store: {
						model: store.getModel(),
						data: records,
					},
					listeners: {
						itemtap: function(self, index, target, record) {
							var module = record.get('view');
							Vtecrm.app.showModuleHome(module);
						},
					}
				}]
			}));
		}
    },

    handleOrientationChange: function(viewport, new_orient, width, height, opts){
    	var oldHidden = this.getHidden(),
    		lastcard = this.indexOf(this.getActiveItem())-1;

    	this.hide();
    	this.removeAll();
    	//this.setTop('-'+(height/16) + 'px');
    	this.createGrids();
    	this.setActiveItem(lastcard);
    	if (!oldHidden) this.show();
    }


});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * This view show the list of filters for a module
 */
Ext.define('Vtecrm.view.FiltersGrid', {
	extend: 'Ext.carousel.Carousel',

    alias: "view.FiltersGrid",
    //layout: 'grid',

    requires: [],

    config: {
    	/**
    	 *
    	 */
    	itemId: 'filtersGrid',

    	/**
    	 *
    	 */
    	direction: 'horizontal',

    	// REMOVE this stuff!
    	/**
    	 * @hide
    	 */
    	scrollable: false,
    	/**
    	 * @hide
    	 */
    	centered: true,
    	/**
    	 * @hide
    	 */
    	width: '100%',
    	/**
    	 * @hide
    	 */
    	height: '100%',

    	// custom
    	pages: 3,
    	locked: false,
    	/**
    	 *
    	 */
    	module: null,
    	/**
    	 *
    	 */
    	searchString: '',

    	cvFilters: null,

    	/**
    	 * @hide
    	 */
    	listeners: {
    		// listen to painted event because i need the sizes
    		painted: function (self) {
    			if (!self.hasGrids) self.createGrids();
    		},

    	}
    },

    // private:
    cvStore: null,
    hasGrids: false,


    /**
     * @private
     * Overridden to disable the dragging if disabled
     */
    onDrag: function() {
    	if (!this.getLocked()) {
    		return this.callParent(arguments);
    	}
    },

    /**
     * @protected
     * Initilizes internal data when setting the module
     */
    applyModule: function(module) {
    	var self = this,
    		store = Ext.getStore('modulesStoreOffline'),
    		modrec = store.findRecord('view', module),
    		filters = (modrec ? modrec.get('filters') : null);

    	if (filters && module != this._module) {

    		// 	genero lo store per i filtri
			self.setCvFilters(filters);

			if (self.cvStore) self.cvStore.destroy();

			self.cvStore = Ext.data.Store.create({
				model: 'Vtecrm.model.VteFilter',
				data: filters,
				totalCount: filters.length,
			});
			self.cvStore.setTotalCount(filters.length);
    	}
    	this._module = module;
    },

    /**
     * Creates the grid element for the filters
     */
    createGrids: function() {
    	var me = this,
    		dimensions = Vtecrm.view.GridView.calcDimensions('filter', me),
    		modperpage = dimensions[2]*dimensions[3],
    		smallOrBig = (dimensions[0] == '64px' ? 'small' : 'big'),
    		gstore = me.cvStore;

    	me.setPages(Math.ceil(gstore.getTotalCount() / modperpage));

    	if (this.getPages() <= 1) {
    		this.setLocked(true);
    		this.setIndicator(false);
    	} else {
    		this.setLocked(false);
    		this.setIndicator(true);
    	}

    	for (var i = 0; i<this.getPages(); ++i) {
			me.add(Ext.create('Ext.Container', {
				layout: 'fit',
				items: [{
					xclass: 'Vtecrm.view.GridView',
					centered: true,
					defaultType: 'gridfilter',
					store: {
						model: gstore.getModel(),
						data: gstore.getRange(i*modperpage, (i+1)*modperpage-1),
					},
					module: me.getModule(),
					columns: dimensions[2],
					itemConfig: {
						iconSize: smallOrBig,
					},
					listeners: {
						itemtap: function(self, index, target, record) {
							me.doTapFilter(record);
						},
					}
				}]
			}));
		}

    	me.hasGrids = true;
    },

    /**
     * Called when a filter is tapped
     */
    doTapFilter: function(record) {
    	var data = record.getData(),
    		cvid = data.cvid,
    		modhome = Vtecrm.app.modulehome,
    		listSearch = (modhome ? modhome.down('#listSearch') : null),
    		filtersGrid = (modhome ? modhome.down('#filtersGrid') : null);

    	if (listSearch) {
    		listSearch.setFolderid(0);
    		listSearch.setFilterInfo(data);
    		listSearch.setFolderInfo(null);
    		listSearch.getStore().removeAll();
    		listSearch.getStore().loadPage(1);
    		modhome.setActiveItem(3);
    	}
    },

    /**
     * @protected
     * Called when the device rotates. Redraws the list of filters.
     */
    handleOrientationChange: function(viewport, new_orient, width, height, opts){
    	var oldHidden = this.getHidden(),
    		lastcard = this.indexOf(this.getActiveItem())-1;

    	this.hide();
    	this.removeAll();
    	this.createGrids();
    	this.setActiveItem(lastcard);
    	if (!oldHidden) this.show();
    },

    /**
     * Starts a search on the "all" filter
     */
    goSearch: function(oldval, newval) {
    	var me = this,
    		modhome = Vtecrm.app.modulehome,
    		listSearch = (modhome ? modhome.down('#listSearch') : null);
    		store = me.cvStore,
    		allfilt = store.findRecord('all', true);

    	if (listSearch && allfilt) {
    		var cvid = allfilt.get('cvid');
    		listSearch.setViewid(cvid);
    		listSearch.setSearchString(newval);
    		listSearch.getStore().removeAll();
    		listSearch.getStore().loadPage(1);
    		modhome.setActiveItem(3);
    	}
    	me.setSearchString(newval);
    }


});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * Shows the popup for the configuration of a filter
 */
Ext.define('Vtecrm.view.FilterConfig', {
    extend: 'Ext.Container',

    config: {

    	/**
    	 *
    	 */
    	layout: 'vbox',

    	/**
    	 *
    	 */
    	itemId: 'filterConfig',

    	/**
    	 *
    	 */
    	cls: 'x-layout-card-item', // grey background

    	/**
    	 *
    	 */
    	flex: 1,

    	/**
    	 * @hide
    	 */
    	scrollable: (Ext.os.is.Phone ? 'vertical' : false),

    	/**
    	 * @cfg {String} [module=null]
    	 * The module
    	 */
    	module: null,

    	/**
    	 * @hide
    	 */
    	type: 'filter',		// 'filter' or 'folder'

    	/**
    	 * @hide
    	 */
    	filterList: null,

    	/**
    	 * @hide
    	 */
    	filterInfo: null,

    	/**
    	 * @hide
    	 */
    	fieldStore: null,

    	/**
    	 * @hide
    	 */
    	items: [
    	    {
    	    	xtype: 'label',
    	    	margin: '8px',
    	    	//centered: true,
    	    	cls: 'filter-config-title',
    	    	html: LANG.settings+' '+LANG.filters,
    	    },
    	    {
    	    	xtype: 'fieldset',
    	    	title: LANG.order,
    	    	margin: '4px',
    	    	items: [
    	    	    {
    	    	    	xtype: 'selectfield',
    	    	    	itemId: 'sortField',
    	    	    	label: LANG.field,
    	    	    	name: 'sortfield',
    	    	    	displayField: 'label',
    	    	    	valueField: 'name',
    	    	    },
    	    	    {
    	    	    	xtype: 'selectfield',
    	    	    	itemId: 'sortDir',
    	    	    	label: LANG.direction,
    	    	    	name: 'sortdir',
    	    	    	options: [
    	    	    	    {text: LANG.ascending, value: 'ASC'},
    	    	    	    {text: LANG.descending, value: 'DESC'},
    	    	    	]
    	    	    },
    	    	]
    	    },
    	    {
    	    	xtype: 'fieldset',
    	    	title: LANG.show_more_fields,
    	    	margin: '4px',
    	    	//instructions: 'non so cosa scrivere',
    	    	defaults: {
    	    		displayField: 'label',
	    	    	valueField: 'name',
    	    	},

    	    	items: [
    	    	    {
    	    	    	xtype: 'selectfield',
    	    	    	label: LANG.first+' '+LANG.field,
    	    	    	name: 'field1',
    	    	    	itemId: 'field1',
    	    	    },
    	    	    {
    	    	    	xtype: 'selectfield',
    	    	    	label: LANG.second+' '+LANG.field,
    	    	    	name: 'field2',
    	    	    	itemId: 'field2',
    	    	    },
    	    	    {
    	    	    	xtype: 'selectfield',
    	    	    	label: LANG.third+' '+LANG.field,
    	    	    	name: 'field3',
    	    	    	itemId: 'field3',
    	    	    },
    	    	]
    	    },
    	    {
    	    	xtype: 'container',
    	    	layout: {
    	    		type: 'hbox',
    	    		pack: 'center',
    	    		align: 'start',
    	    	},
    	    	items: [
    	    	    {
    	    	    	xtype: 'button',
    	    	    	ui: 'action',
    	    	    	margin: '4px',
    	    	    	text: LANG.close,
    	    	    	handler: function(btn) {
    	    	    		var cfg = btn.up('#filterConfig'),
    	    	    			panel = (cfg ? cfg.getParent() : null);
    	    	    		if (panel) panel.hide();
    	    	    	}
    	    	    }
    	    	]
    	    }
    	],

    	/**
    	 * @hide
    	 */
    	control: {
    		'selectfield': {
				change: function() {
					var me = this;
					if (!me.ready) return;
					me.changed = true;
				}
			},
    	}
    },

    changed: false, // NOT USED
    ready: false,

    constructor: function() {
    	this.callParent(arguments);

    	var st = Ext.create('Ext.data.Store', {
    		autoLoad: false,
    		model: "Vtecrm.model.VteFieldBasic",
    	});
    	// aggiungo i campi
    	var module = this.getModule(),
    		moduleStore = Ext.getStore('modulesStoreOffline'),
    		blockStore = Ext.getStore('storeVteBlocks'),
    		modinfo = moduleStore.findRecord('view', module);

    	// recupero i campi del modulo
    	st.add({fieldid:0, name:'none', label: LANG.none});
    	blockStore.each(function(rec) {
    		if (rec.get('module') == module && rec.get('blockid') < 1000000) {
    			var i, sfield, flds = rec.get('fields');
    			try {
    				flds = Ext.decode(flds);
    				for (i=0; i<flds.length; ++i) {
    					sfield = {
    						fieldid: flds[i].fieldid,
    						name: flds[i].name,
    						label: flds[i].label,
    					}
    					st.add(sfield);
    				}
    			} catch (e) { }
    		}
    	});

    	this.setFieldStore(st);
    	this.ready = true;
    },

    applyFieldStore: function(store) {
    	// set store for all select field
    	var me = this,
    		type = me.getType(),
    		module = me.getModule(),
    		finfo = me.getFilterInfo(),
    		fconfig = (type == 'filter' ? Vtecrm.app.getFilterSettings(module, finfo.cvid) : Vtecrm.app.getFolderSettings(module, finfo.folderid)),
    		selfield = me.down('#sortField'),
    		selorder = me.down('#sortDir'),
    		extrafields = [
    		    me.down('#field1'),
    		    me.down('#field2'),
    		    me.down('#field3')
    		];

    	selfield.setStore(store);
    	extrafields[0].setStore(store);
    	extrafields[1].setStore(store);
    	extrafields[2].setStore(store);

    	// seleziono valori iniziali
    	if (finfo && finfo.sortfield) {
    		selfield.setValue(finfo.sortfield);
    		if (finfo.sortorder) selorder.setValue(finfo.sortorder);
    	}

    	// altri campi
    	if (fconfig && fconfig.extrafields && fconfig.extrafields.length > 0) {
    		for (var i=0; i<fconfig.extrafields.length; ++i) {
    			var ffield = fconfig.extrafields[i];
    			if (extrafields[i]) {
    				extrafields[i].setValue(ffield.name);
    			}
    		}
    	}

    	me._fieldStore = store;
    },

    destroy: function() {
    	var me = this,
    		type = me.getType(),
    		module = me.getModule(),
    		list = me.getFilterList(),
    		finfo = me.getFilterInfo(),
    		selfield = me.down('#sortField').getValue(),
    		selorder = me.down('#sortDir').getValue(),
    		efields = [
    		    me.down('#field1'),
    		    me.down('#field2'),
    		    me.down('#field3')
    		],
    		moduleStore = Ext.getStore('modulesStoreOffline'),
    		modinfo = moduleStore.findRecord('view', module),
    		oldfilters = modinfo.get('filters'),
    		oldfinfo;

    	if (type == 'filter') {
    		// why this?
    		oldfinfo = array_find(oldfilters, 'cvid', finfo.cvid);

    		if (!me.changed) return this.callParent(arguments);

    		// do save before destroy
    		var findex = oldfilters.indexOf(oldfinfo);
    		oldfilters[findex]['sortfield'] = ((selfield || selfield != 'none') ? selfield : null);
    		oldfilters[findex]['sortorder'] = selorder;

    		modinfo.set('filters', oldfilters);
    		modinfo.setDirty();
    		moduleStore.sync();
    	}

    	//salvo i campi extra
    	var extrafields = [];
    	for (var i=0; i<efields.length; ++i) {
    		if (efields[i]) {
    			var val = efields[i].getValue();
    			if (val && val != 'none') {
    				extrafields.push({
    					'name': val,
    					'label': efields[i].getValueLabel()
    				});
    			}
    		}
    	}
    	var fconfig = {
    		'extrafields' : extrafields,
    		'sortfield': ((selfield || selfield != 'none') ? selfield : null),
    		'sortorder': selorder,
    	};
    	if (finfo) {
    		if (type == 'filter') {
    			Vtecrm.app.setFilterSettings(module, finfo.cvid, fconfig);
    			list.setFilterInfo(oldfilters[findex]);
    		} else {
    			Vtecrm.app.setFolderSettings(module, finfo.folderid, fconfig);
    			var oldfoinfo = list.getFolderInfo() || {};
    			list.setFolderInfo(Ext.merge(oldfoinfo, fconfig));
    		}
    	}

    	// ricarico la lista

    	list.getStore().removeAll();
    	list.getStore().loadPage(1);

    	this.callParent(arguments);
    }

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * List of notifications
 */
Ext.define('Vtecrm.view.ListNotifications', {
	extend: 'Ext.List',

    alias: "view.ListNotifications",


    config: {

    	/**
    	 *
    	 */
    	itemId: 'listNotifications',

    	/**
    	 *
    	 */
    	styleHtmlContent: true,

    	/**
    	 *
    	 */
    	styleHtmlCls: 'listNotifications',

    	/**
    	 *
    	 */
    	flex: 1,

    	/**
    	 *
    	 */
    	onItemDisclosure: true,

    	/**
    	 *
    	 */
    	disclosureProperty: 'hasdetails',

    	/**
    	 *
    	 */
    	emptyText: '<p align="center">'+LANG.no_records+'</p>',

    	/**
    	 *
    	 */
    	loadingText: LANG.loading,

    	/**
    	 * If true, this list is inside a popup
    	 */
    	isPopup: true,

    	/**
    	 * @hide
    	 */
    	store: {
    		autoLoad: true,
    		model: 'Vtecrm.model.VteNotification',
    		proxy: {
    			type: "ajax",
    			url: vtwsUrl + "ws.php?wsname=GetNotifications",
    			extraParams: params_unserialize(vtwsOpts),
    			actionMethods: {read: 'POST'},
    			reader: 'json',
    			listeners: {
        			// json decoding error
        			exception: function(reader,response,error,opts) {
   						Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
   						unMaskView();
   						return false;
   					},
        		}
    		}
    	},

    	/**
    	 * @hide
    	 */
    	items: [
    	    {
   	    		ui: 'light',
       	    	xtype: 'titlebar',
                docked: 'top',
                scrollable: false,
                title: LANG.notifications,
                items: [
                    {
                      	//ui: 'back',
                       	text: LANG.end,
                       	align: 'left',
                       	handler: function(self) {
                       		var me = self.up('#listNotifications');

                       		if (me.getParent()) {
                       			me.getParent().hide();
                       		}
                       	}
                    }
                ]
    	    }
    	],

    	/**
    	 * @hide
    	 */
    	listeners: {

    		disclose: function(self, record) {
    			self.disclosing = true;
    			var crmid = record.get('crmid'),
    				recordid = record.get('item-record'),
    				recordmod = record.get('item-module'),
    				recordname = record.get('item-value');

    			if (!empty(recordid) && !empty(recordmod)) {
    				// imposta come letta
        			Vtecrm.app.seeNotifications([crmid]);
        			// mostro record
    				Vtecrm.app.showRecord(recordmod, recordid, recordname);
    				if (self.getIsPopup() && self.getParent()) {
    					self.getParent().hide();
    				}
    			}
    			return false;
    		},

    		itemtap: function(self, index, target, record, e) {
    			var crmid = record.get('crmid'),
					opened = $('#notifdetails_'+crmid).is(':visible');

    			// workaround: prevent tapping after disclosing
    			if (self.disclosing) {
    				self.disclosing = false;
    				return;
    			}

    			// mostra contenuti se ci sono
    			$('div.notifdetails:visible').slideUp('fast');
    			if (!opened) {
    				$('#notifdetails_'+crmid).slideDown('fast');
    			}

    			self.deselectAll();
    			self.select(record);
    			// imposta come letta
    			if (!record.raw.seen) {
    				Vtecrm.app.seeNotifications([crmid]);
    				record.raw.seen = true;
    			}
    		},

    		show: function() {
    			//Vtecrm.app.mainview.setMainTitle(LANG.notifications);
    			// reload store
    			//this.getStore().load();
    		}
    	}
    },

    /**
     * @private
     */
    initialize: function() {
    	var tpl = new Ext.XTemplate(
    	    '<tpl for=".">',
    	    	'<div>',
    	        	'<div><b>{author}</b> {action} <tpl if="related_record &gt; 0"><b>{related_value}</b> ({related_type}) '+LANG.to+' </tpl><b>{item-value}</b> ({item-type})</div>',
    	        	'<div class="notifTime">{timestampago}</div>',
   	        		'<div class="notifdetails" id="notifdetails_{crmid}">',
    	        		'<tpl if="hasdetails == true && haslist == false">',
    	        			'<table class="notifTableDetails">',
    	        				'<tr><td class="notifdetails_header">'+LANG.field+'</td><td class="notifdetails_header">'+LANG.previous_value+'</td><td class="notifdetails_header">'+LANG.current_value+'</td></tr>',
    	        				'<tpl for="details">',
    	        					'<tr><td class="notifdetails_row">{fieldname_trans}</td><td class="notifdetails_row">{previous}</td><td class="notifdetails_row">{current}</td></tr>',
    	        				'</tpl>',
    	        			'</table>',
    	        		'</tpl>',

    	        		'<tpl if="haslist == true">',
    	        			'<div><b>'+LANG.added_items+':</b> ',
    	        				'<tpl for="list">',
    	        					'{value}, ',
    	        				'</tpl>',
    	        			'</div>',
    	        		'</tpl>',
    	        	'</div>',
    	        '</div>',
    	    '</tpl>'
    	);

    	this.setItemTpl(tpl);
    	return this.callParent(arguments);
    }


});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * List of talks. Implemented as 2 lists in a Ext.Carousel
 */
Ext.define('Vtecrm.view.ListComments', {
	extend: 'Ext.Carousel',

    alias: "view.ListComments",

    requires: [],

    config: {

    	/**
    	 *
    	 */
    	itemId: 'listComments',

    	/**
    	 * Hides the inidicator
    	 */
    	indicator: false,

    	/**
    	 * Not automatically scrolalble
    	 */
    	scrollable: false,

    	/**
    	 * Not scrollable by dragging
    	 */
    	locked: true,

    	flex: 1,


    	// CUSTOM
    	isPopup: false,

    	/**
    	 *
    	 */
    	module: null,

    	/**
    	 * The crmid of the open record, to show only related talks
    	 */
    	crmid: null,

    	/**
    	 *
    	 */
    	searchString: '',

    	// config for a new toolbar or existing toolbar
    	/**
    	 * @hide
    	 */
    	toolbar: {
    		xtype: 'titlebar',
        	docked: 'top',
            ui: 'light',
            items: [
                {
                	xtype: 'button',
                	itemId: 'btnClose',
                	text: LANG.end,
                	align: 'left',
                },
            ]
    	},

    	/**
    	 * @hide
    	 */
        items: [
            {
            	xtype: 'list',
            	itemId: 'primaryList',

            	styleHtmlContent: true,
            	styleHtmlCls: 'listComments',
            	onItemDisclosure: true,
            	loadingText: LANG.loading,
            	emptyText: '<p align="center">'+LANG.no_records+'</p>',

            	disclosureProperty: function(rec) {
            		var self = this,
            			me = self.up('.carousel'),
            			relmod = rec.related_to_module;
            		return (!rec.leaf && rec.related_to > 0 && !me.getCrmid() && Vtecrm.app.isModuleAvailable(relmod));
            	},

            	plugins: [
              	{
              	   	xclass: 'Ext.plugin.ListPaging',
              	   	ptype: 'listpaging',
              	   	autoPaging: true,
              	   	loadMoreText: LANG.loading,
              	   	noMoreRecordsText: '',
              	},
            	],

            	store: {
            		autoLoad: false,
            		clearOnLoad: false,
            		clearOnPageLoad: false,
            		model: 'Vtecrm.model.VteComment',
            		//rootVisible: true,
            		defaultRootProperty: 'comments',
            		pageSize: (CONFIG.list_page_limit || 20),
            		proxy: {
            			type: "ajax",
            			url: vtwsUrl + "ws.php?wsname=GetComments",
            			extraParams: params_unserialize(vtwsOpts),
            			actionMethods: {read: 'POST'},
            			reader: {
            				type: 'json',
            				totalProperty: "total",
            				rootProperty: 'comments',
            			},
            			listeners: {
                			// json decoding error
                			exception: function(reader,response,error,opts) {
           						Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
           						unMaskView();
           						return false;
           					},
                		}
            		},
            		listeners: {

            			beforeload: function(self) {
            				var list = self.listObject,
            					me = self.listComments,
            					toolbar = (me ? me.getToolbar() : null),
            					searchField = (toolbar ? toolbar.down('#commentFieldSearch') : null),
            					btnCreate = (toolbar ? toolbar.down('#commentBtnCreate') : null),
            					btnAnswer = (toolbar ? toolbar.down('#commentBtnAnswer') : null),
            					module = (me ? me.getModule() : ''),
            					crmid = (me ? me.getCrmid() : 0),
            					sstring = (me ? me.getSearchString() : ''),
            					proxy = self.getProxy();

            				if (proxy) {
            					proxy.setExtraParams(params_unserialize(vtwsOpts+"module="+module+"&record="+crmid+"&search="+sstring));
            				}

            				// disable buttons
            				if (searchField) searchField.setDisabled(true);
            				if (btnCreate) btnCreate.setDisabled(true);
            				if (btnAnswer) btnAnswer.setDisabled(true);
            				return true;
            			},

            			// convert links to clickable <a>
            			load: function(self, records) {
            				var list = self.listObject,
            					me = self.listComments,
            					toolbar = (me ? me.getToolbar() : null),
            					searchField = (toolbar ? toolbar.down('#commentFieldSearch') : null),
            					btnCreate = (toolbar ? toolbar.down('#commentBtnCreate') : null),
            					btnAnswer = (toolbar ? toolbar.down('#commentBtnAnswer') : null);

            				if (records) {
            					for (var i=0; i<records.length; ++i) {
            						var r = records[i],
            							val = r.get('commentcontent'),
            							nval = (val ? val.url2link().mail2link().nl2br() : null);
            						if (!nval) continue;
            						r._data.commentcontent = nval;
            						r.data.commentcontent = nval;
            						r.raw.commentcontent = nval;
            						//r.set('commentcontent', nval);
            						// update children
            						if (r.raw.comments) {
            							for (var j=0; j<r.raw.comments.length; ++j) {
            								var val2 = r.raw.comments[j].commentcontent,
            									nval2 = (val2 ? val2.url2link().mail2link().nl2br() : null);
            								if (!nval2) continue;
            								r._data.comments[j].commentcontent = nval2;
            								r.data.comments[j].commentcontent = nval2;
            								r.raw.comments[j].commentcontent = nval2;

            							}
            						}
            					}
            				}

            				// enable buttons
            				if (searchField) searchField.setDisabled(false);
            				if (btnCreate) btnCreate.setDisabled(false);
            				if (btnAnswer) btnAnswer.setDisabled(false);
            			}

            		}
            	},
            },
            {
            	xtype: 'list',
            	itemId : 'secondaryList',
            	styleHtmlContent: true,
            	styleHtmlCls: 'listComments',
            	loadingText: LANG.loading,
            	emptyText: '<p align="center">'+LANG.no_records+'</p>',
            	store: {
            		model: 'Vtecrm.model.VteComment',
            	}
            }
        ],


        /**
         * @hide
         */
        listeners: {
        	initialize: function(self) {
        		var me = self,
        			priList = me.down('#primaryList'),
        			secList = me.down('#secondaryList'),
        			priStore = priList.getStore(),
        			secStore = secList.getStore();

       			priStore.on({
       				scope: me,
       				updaterecord: 'recordUpdated',
       			});

       			secStore.on({
       				scope: me,
       				updaterecord: 'recordUpdated',
       			});
        	},

        	show: function(self) {
        		var me = self,
        			priList = me.down('#primaryList');

        		me.createButtons();
        		me.syncButtons();
        		priList.getStore().load();
        	},

        	activeitemchange: function(self, value, oldValue) {
        		var me = self;
        		me.syncButtons();
        	},

        	hide: function() {
        		var me = this;
        		// hide all buttons
            	if (me.searchfield) me.searchfield.hide();
            	if (me.buttonback) me.buttonback.hide();
            	if (me.buttoncreate) me.buttoncreate.hide();
            	if (me.buttonanswer) me.buttonanswer.hide();
        	}

        },

        /**
         * @hide
         */
        control: {
        	'#btnClose': {
        		tap: function() {
            		this.onCloseButton();
            	}
        	},

        	'#primaryList': {
        		itemtap: function(self, index, target, record) {
        			var me = this;
        			me.onPrimaryListTap(self, record);
        		},
        		disclose: function(self, record, target, index) {
        			var me = this;
        			me.onPrimaryListDisclose(self, record);
        		}
        	}
        }
    },

    // disable dragging (TODO: ovverride the carousel when Sencha will support config overrides )
    onDrag: function() {
    	if (!this.getLocked()) {
    		return this.callParent(arguments);
    	}
    },

    constructor: function() {
    	var me = this;
    	this.callParent(arguments);

    	var priList = me.down('#primaryList'),
    		priStore = priList.getStore(),
    		secList = me.down('#secondaryList'),
    		secStore = secList.getStore();

    	if (priStore) {
    		priStore.listComments = me;
    		priStore.listObject = priList;
    	}
    	if (secStore) {
    		secStore.listComments = me;
    		secStore.listObject = secList;
    	}

    	// overload some methods in the lists
    	priList.getItemTpl = Ext.bind(me.getListTpl, me);
    	secList.getItemTpl = Ext.bind(me.getListTpl, me);

    	//this.createButtons();
    },

    applyToolbar: function(toolbar, oldToolbar) {
    	var me = this;
   		oldToolbar = Ext.factory(toolbar, 'Ext.TitleBar', oldToolbar);
    	me.parentToolbar = (oldToolbar && oldToolbar.getParent());
    	return oldToolbar;
    },

    updateToolbar: function(toolbar, oldToolbar) {
    	var me = this;
    	if (toolbar) {
    		if (!toolbar.getParent()) {
    			me.add(toolbar);
    		}
    	} else if (oldToolbar) {
    		oldToolbar.destroy();
    	}
    	// recreate buttons if needed (error, dom is not ready at this point)
    	//me.createButtons(toolbar);
    },

    destroy: function() {
    	var me = this;
    	if (me.searchfield) {
    		me.searchfield.destroy();
    		me.searchfield = null;
    	}

    	if (me.buttonback) {
    		me.buttonback.destroy();
    		me.buttonback = null;
    	}

    	if (me.buttoncreate) {
    		me.buttoncreate.destroy();
    		me.buttoncreate = null;
    	}

    	if (me.buttonanswer) {
    		me.buttonanswer.destroy();
    		me.buttonanswer = null;
    	}
    	me.callParent(arguments);
    },

    // TODO: fare con setter/getter apply/update
    createButtons: function() {
    	var me = this,
    		toolbar = me.getToolbar(),
    		crmid = me.getCrmid();

    	// first create buttons
    	if (!me.searchfield) {
    		me.searchfield = Ext.create('Ext.field.Search', {
    			itemId: 'commentFieldSearch',
    			xtype: 'searchfield',
    			align: 'right',
    			scope: this,
    			disabled: true,
    			minWidth: '160px',
    			maxWidth: (document.body.clientWidth/2) + 'px',
    			clearIcon: true,
    			autoCapitalize: false,
    			listeners: {
    				change: function(self, newval, oldval) {
    					me.goSearch(me, self, oldval, newval);
    				}
    			}
    		});
    	}

    	if (!me.buttonback) {
    		me.buttonback = Ext.create('Ext.Button', {
				itemId: 'btnBack',
				xtype: 'button',
            	ui: 'back',
            	align: 'left',
            	hidden: true,
            	//text: LANG.back,
            	iconCls: 'arrow_left',
            	iconMask: true,
            	scope: me,
            	handler: me.onBackButton,
    		});
    	}

    	if ((current_user && current_user['allow_generic_talks']) || crmid > 0) {
			if (!me.buttoncreate) {
    			me.buttoncreate = Ext.create('Ext.Button', {
    				itemId: 'commentBtnCreate',
    				xtype: 'button',
	            	//ui: 'plain',
	            	iconCls: 'add',
	            	iconMask: true,
	            	align: 'right',
	            	scope: this,
	            	disabled: true,
	            	handler: me.onCreateButton,
	    		});
			}
		}

    	if (!me.buttonanswer) {
    		me.buttonanswer = Ext.create('Ext.Button', {
				itemId: 'commentBtnAnswer',
				xtype: 'button',
        		text: LANG.do_answer,
        		align: 'right',
        		scope: this,
        		hidden: true,
        		disabled: true,
        		handler: me.onAnswerButton,
			});
    	}

    	if (!me.buttonforceunread) {
    		me.buttonforceunread = Ext.create('Ext.Button', {
				itemId: 'commentBtnForce',
				xtype: 'button',
				iconCls: 'more',
            	iconMask: true,
        		align: 'right',
        		scope: this,
        		hidden: true,
        		handler: me.onForceButton,
			});
    	}

    	// then add them to the toolbar


    	if (toolbar) {
    		// search only available in popup
    		if (me.searchfield.getParent() != toolbar && !me.parentToolbar) {
    			toolbar.add(me.searchfield);
    		}

    		if (me.buttonback.getParent() != toolbar) {
    			toolbar.add(me.buttonback);
    		}

    		if (me.buttoncreate && me.buttonback.getParent() != toolbar) {
    			toolbar.add(me.buttoncreate);
    		}

    		if (me.buttonforceunread && me.buttonforceunread.getParent() != toolbar) {
    			toolbar.add(me.buttonforceunread);
    		}

    		if (me.buttonanswer && me.buttonanswer.getParent() != toolbar) {
    			toolbar.add(me.buttonanswer);
    		}

    		if (!me.parentToolbar && !Ext.os.is.Phone) {
    			toolbar.setTitle(LANG.talks);
    		}
    	}
    },

    /**
     * Retrieves the tpl for the list
     */
    getListTpl: function() {
    	var me = this,
			crmid = me.getCrmid(),
			ispopup = me.getIsPopup(),
			crmpath = (vtwsUrl ? vtwsUrl.replace('modules/Touch/', '') : ''),
			tpl = new Ext.XTemplate(
		'<div id="notifContainer<tpl if=\'leaf==true\'>Leaf</tpl>_{crmid}" class="notifContainer<tpl if=\'leaf==true\'> notifLeaf</tpl><tpl if=\'unseen==true || unseen==1\'> notifUnseen</tpl>">' +
			'<table width="100%"><tr><td>' +
				'<img src="'+crmpath+'{authorPhoto}" alt="" title="{author}" class="notifPhoto" />'+'</td>'+
				'<td width="100%" valign="top"><div style="clear:both">' +
				'<div class="notifAuthor">'+'{author}' +
					'<tpl if="recipients.length == 1">' +
						' &gt; <tpl for="recipients">{name} </tpl>' +
					'</tpl>' +
					'<tpl if="recipients.length &gt; 1">' +
						' &gt; {recipients.length} '+LANG.users +
					'</tpl>' +
					'</div>' +
				'<div class="notifTime">{timestampago}</div>' +
			'</div>' +
			'<tpl if="recipients.length &gt; 1">'+
				'<div name="notifAuthorsList" class="notifAuthorsList"><b>'+LANG.users+':</b> <tpl for="recipients">{name}, </tpl></div>' +
			'</tpl>'+
			'</td></tr></table>' +
			'<div class="notifComment">{commentcontent}</div>' +
			((ispopup) ? (
			    '<tpl if="related_to &gt; 0">' +
					'<div class="notifRelatedTo">'+LANG.about+' <b>{related_to_name}</b></div>' +
				'</tpl>'
			) : '') +
		'</div>');
    	return tpl;
    },

    /**
     * Called when the user taps on the first list
     */
    onPrimaryListTap: function(list, record) {
    	var me = this,
    		priList = me.down('#primaryList'),
    		secList = me.down('#secondaryList'),
    		secStore = secList.getStore(),
    		secRecords = record.get('comments'),
    		forced = record.get('forced') || false;

    	if (secRecords.length > 0) {
    		secStore.removeAll();
    		secStore.setData(secRecords);
    		me.next();

    		// see the comments (only if not forced)
			// prendo gli id dei figli

    		if (!forced) {
    			var children = me.getRecordChildren(record, true);

    			if (children.length > 0) {
    				// delay 1 sec
    				setTimeout(function() {
    					me.seeComments(children);
    				}, 1000);
    			}
    		}
    	}

    },

    getRecordChildren: function(record, onlyunseen) {
    	var children = [],
			comments = record.get('comments');

    	if ((onlyunseen && record.get('unseen')) || (!onlyunseen)) children.push(record.get('crmid'));
    	comments.forEach(function(item) {
    		if ((onlyunseen && item.unseen) || (!onlyunseen)) children.push(parseInt(item.crmid));
    	});
    	children = Ext.Array.unique(children);
    	return children;
    },

    /**
     * Called when the user taps on the disclose iconin the primary list
     */
    onPrimaryListDisclose: function(list, record) {
    	var me = this,
			crmid = record.get('related_to'),
			module = record.get('related_to_module'),
			name = record.get('related_to_name');

    	if (crmid > 0 && module) {
    		Vtecrm.app.showRecord(module, crmid, name);
    		if (me.getIsPopup() && me.getParent()) {
    			me.getParent().hide();
    		}
    	}
    },

    /**
     * Adjust the buttons in the toolbar according to the active list
     */
    syncButtons: function() {
    	var me = this,
    		item = me.getActiveItem(),
			id = item.getItemId(),
			toolbar = me.getToolbar(),
			btnClose = toolbar.down('#btnClose'),
			btnBack = toolbar.down('#btnBack'),
			btnCreate = toolbar.down('#commentBtnCreate'),
			btnAnswer = toolbar.down('#commentBtnAnswer'),
			btnForce = toolbar.down('#commentBtnForce'),
			searchField = toolbar.down('#commentFieldSearch');

		if (id == 'primaryList') {
			if (btnClose) btnClose.show();
			if (btnBack) btnBack.hide();
			if (searchField) searchField.show();
			if (btnCreate) btnCreate.show();
			if (btnAnswer) btnAnswer.hide();
			if (btnForce) btnForce.hide();
		} else {
			if (btnClose) btnClose.hide();
			if (btnBack) btnBack.show();
			if (searchField) searchField.hide();
			if (btnCreate) btnCreate.hide();
			if (btnAnswer) btnAnswer.show();
			if (btnForce) btnForce.show();
		}
    },

    /**
     * Called when the clsoe button is pressed
     */
    onCloseButton: function() {
    	var me = this;
    	if (me.getParent()) {
			me.getParent().hide();
    	}
    },

    /**
     * Called when the back button is pressed
     */
    onBackButton: function() {
    	var me = this,
			priList = me.down('#primaryList'),
			secList = me.down('#secondaryList');

    	if (me.commentCreationMode) {
    		me.closeNewComment();
    	}
    	me.syncButtons();
    	me.previous();

    },

    /**
     * Called when the Create button is pressed
     */
    onCreateButton: function() {
    	this.addNewComment('create');
    },

    /**
     * Called when the Answer button is pressed
     */
    onAnswerButton: function() {
    	this.addNewComment('answer');
    },


    onForceButton: function() {
    	var me = this,
    		toolbar = me.getToolbar(),
    		btnForce = toolbar.down('#commentBtnForce');

    	var panel = Ext.create('Ext.Panel', {
    		modal: true,
    		hideOnMaskTap: true,
    		layout: 'vbox',
    		padding: '4px',
    		right: '10px',
    		zIndex: 20,
    		defaults: {
    			xtype: 'button',
		    	ui: 'action',
		    	margin: '2px',
    		},
    		items: [
    		    {
    		    	text: LANG.mark_as_read,
    		    	handler: function() {
    		    		panel.hide();
    		    		me.markThreadRead();
    		    	}
    		    },
    		    {
    		    	text: LANG.mark_as_unread,
    		    	handler: function() {
    		    		panel.hide();
    		    		me.markThreadUnread();
    		    	}
    		    },
    		],
    		listeners: {
    			hide: function(self) {
    				self.quickDestroy();
    			}
    		}
    	});

    	panel.showBy(btnForce);
    },

    markThreadRead: function() {
    	var me = this,
    		priList = me.down('#primaryList'),
    		record = priList.getSelection()[0];

    	if (record) {
    		var children = me.getRecordChildren(record, true);
    		if (children.length > 0) {
    			me.seeComments(children, true);
    		}
    	}
    },

    markThreadUnread: function() {
    	var me = this,
			priList = me.down('#primaryList'),
			record = priList.getSelection()[0],
			mainThreadId = record.get('parent_comments') || record.get('crmid');

    	if (mainThreadId) {
    		var children = me.getRecordChildren(record);
    		me.unseeComments(children, true);
    	}

    },

    recordUpdated: function(store, record, newIndex, oldIndex, fieldnames, values, opts) {
    	var me = this,
    		list = store.listObject;

    	if (list && fieldnames && fieldnames.indexOf('unseen') >= 0) {
    		var unseen = record.get('unseen'),
    			listId = list.getItemId(),
    			listRawId = list.getId(),
    			baseId = (listId == 'primaryList' ? 'notifContainer_' : 'notifContainerLeaf_'),
    			crmid = record.get('crmid');

    		if (unseen) {
    			$('#'+listRawId+' #'+baseId+crmid).fadeOut(function() {
    				$(this).addClass('notifUnseen').fadeIn('fast');
    			});
    		} else {
    			$('#'+listRawId+' #'+baseId+crmid).fadeOut(function() {
    				$(this).removeClass('notifUnseen').fadeIn('fast');
    			});
    		}
    	}

    },

    /**
     * Marks the comments as seen
     */
	seeComments: function(ids, forced) {
		var me = this,
			priList = me.down('#primaryList'),
			secList = me.down('#secondaryList'),
			priStore = priList.getStore(),
			secStore = secList.getStore();

		if (!ids) return;

		if (typeof ids !== 'object') ids = [ids];

		Vtecrm.app.touchRequest('SeeNotifications', {
			module: 'ModComments',
			records: ids.join(':'),
			forced: (forced ? '1' : '0')
		}, false, function(count) {
	    	var btn = Ext.getCmp('btnComments'),
    			oldcount = btn.getBadgeText() || 0;

	    	if (!btn.getHidden() && count != '' && count > 0) {
	    		btn.setBadgeText(count);
	    	} else {
    			btn.setBadgeText(false);
	    	}

    		// tolgo la sfumatura e aggiorno lo store
    		for (var i=0; i<ids.length; ++i) {
    			var curRecord = priStore.findRecord('crmid', ids[i]),
    				curRecord2 = secStore.findRecord('crmid', ids[i]);

    			// set the unseen flag (for all sub records also
    			if (curRecord) {
    				var children = curRecord.get('comments');
    				curRecord.beginEdit();
    				curRecord.set('unseen', false);
    				curRecord.set('forced', false);
    				if (children && children.length > 0) {
    					children.forEach(function(item) {
    						item.unseen = false;
    					});
    					curRecord.set('comments', children);
    				}
    				curRecord.endEdit();
    			}

    			if (curRecord2) {
    				curRecord2.set('unseen', false);
    			}

    		}

		}, true);

	},

	/**
	 * Marks the comments as unseen
	 */
	unseeComments: function(ids, forced) {
		var me = this,
			priList = me.down('#primaryList'),
			secList = me.down('#secondaryList'),
			priStore = priList.getStore(),
			secStore = secList.getStore();

		if (!ids) return;

		if (typeof ids !== 'object') ids = [ids];

		Vtecrm.app.touchRequest('UnseeNotifications', {
			module: 'ModComments',
			records: ids.join(':'),
			forced: (forced ? '1' : '0')
		}, false, function(count) {
	    	var btn = Ext.getCmp('btnComments'),
    			oldcount = btn.getBadgeText() || 0;

	    	if (!btn.getHidden() && count != '' && count > 0) {
	    		btn.setBadgeText(count);
	    	} else {
    			btn.setBadgeText(false);
	    	}

    		// tolgo la sfumatura e aggiorno lo store
    		for (var i=0; i<ids.length; ++i) {
    			var curRecord = priStore.findRecord('crmid', ids[i]),
    				curRecord2 = secStore.findRecord('crmid', ids[i]);

    			if (curRecord) {
    				var children = curRecord.get('comments');
    				curRecord.beginEdit();
    				curRecord.set('unseen', true);
    				curRecord.set('forced', forced);
    				if (children && children.length > 0) {
    					children.forEach(function(item) {
    						item.unseen = true;
    					});
    					curRecord.set('comments', children);
    				}
    				curRecord.endEdit();
    			}

    			if (curRecord2) {
    				curRecord2.set('unseen', true);
    			}

    		}

		}, true);

	},

	/**
	 * Opens the panel for the creation of a new comment
	 */
    addNewComment: function(mode) {
    	var me = this,
    		toolbar = me.getToolbar(),
    		btnAdd = toolbar.down('#commentBtnCreate'),
    		btnAnswer = toolbar.down('#commentBtnAnswer'),
    		btnBack = toolbar.down('#btnBack'),
    		btnClose = toolbar.down('#btnClose'),
    		srchfield = toolbar.down('#commentFieldSearch'),
    		smallLayout = (document.body.clientWidth < 400 || Ext.os.is.Phone),
    		isAnswer = (mode == 'answer');

    	if (!me.commentCreate) {
    		// creo qui altrimenti finisce sopra la toolbar
	    	me.commentCreate = Ext.create('Ext.Container', {
		    	itemId: 'commentCreate2',
		    	xtype: 'container',
		    	docked: (isAnswer ? 'bottom' : 'top'),
		    	layout: 'vbox',
		    	padding: '16px',
		    	hidden: true,

		    	items: [
		    	    {
		    	    	xtype: 'fieldset',
		    	    	verticalLayout: true,
		    	    	items: [

		    	    {
		    	    	itemId: 'commentFieldCreate',
		    	    	xtype: 'textareafield',
		    	    	label: (isAnswer ? LANG.answer : LANG.new_talk),
		    	    	verticalLayout: true,
		    	    	maxRows: (smallLayout ? 5 : 8),
		    	    },
		    	    {
		    	    	itemId: 'commentPublishCont',
		    	    	xtype: 'container',
		    	    	layout: (smallLayout ? 'vbox' : {type: 'hbox', align: 'center'} ),
		    	    	hidden: (isAnswer),
		    	    	defaults: {
		    	    		margin: '4px',
		    	    		ui: 'action',
		    	    	},
		    	    	items: [
		    	    	    {
		    	    	    	xtype: 'label',
		    	    	    	html: LANG.publish + ' ' + LANG.to + ':',
		    	    	    	flex: (smallLayout ? undefined : 1),
		    	    	    },
		    	    	    {
		    	    	    	xtype: 'button',
		    	    	    	flex: (smallLayout ? undefined : 2),
		    	    	    	text: LANG.all,
		    	    	    	scope: me,
		    	    	    	handler: me.tapPostToAll,
		    	    	    },
		    	    	    {
		    	    	    	xtype: 'button',
		    	    	    	itemId: 'btnCommSelUsers',
		    	    	    	flex: (smallLayout ? undefined : 2),
		    	    	    	text: LANG.select_recipients,
		    	    	    	scope: this,
		    	    	    	handler: me.tapPostToUsers
		    	    	    }
		    	    	]
		    	    },
		    	    {
		    	    	itemId: 'commentAnswerBtnCont',
		    	    	xtype: 'container',
		    	    	layout: {type: 'hbox', pack: 'center'},
		    	    	hidden: (!isAnswer),
		    	    	items: [
		    	    	    {
		    	    	    	xtype: 'button',
		    	    	    	itemId: 'btnCommBtnAnswer',
		    	    	    	ui: 'action',
		    	    	    	margin: '4px',
		    	    	    	text: LANG.publish_answer,
		    	    	    	scope: me,
		    	    	    	handler: me.tapPostAnswer,
		    	    	    }
		    	    	]
		    	    }


		    	]
		    	    }]

			});
	    	me.insert(0, me.commentCreate);
    	}

    	me.commentCreationMode = mode;

    	var iitems = me.getInnerItems();
    	iitems[0].hide();

    	if (btnAdd) btnAdd.hide();
    	if (btnAnswer) btnAnswer.hide();
    	if (srchfield) srchfield.hide();
    	if (btnBack) btnBack.show();
    	if (btnClose) btnClose.hide();

    	me.commentCreate.setDocked(isAnswer ? 'bottom' : 'top');
    	me.commentCreate.show();
    	var area = me.commentCreate.down('#commentFieldCreate'),
    		answerCont = me.commentCreate.down('#commentAnswerBtnCont'),
    		publishCont = me.commentCreate.down('#commentPublishCont');

    	answerCont[(isAnswer ? 'show' : 'hide')]();
    	publishCont[(isAnswer ? 'hide' : 'show')]();
    	area.setLabel((isAnswer ? LANG.answer : LANG.new_talk));
    	area.focus();
    },


    tapCloseNewComment: function() {
    	var me = this;
    	me.closeNewComment();
    },

    tapPostAnswer: function() {
    	var me = this,
    		priList = me.down('#primaryList'),
    		record = priList.getSelection()[0],
    		record_crmid = parseInt(record.get('crmid')),
    		record_parent = parseInt(record.get('parent_comments')),
    		parentid = record_parent || record_crmid,
    		commentField = me.down('#commentFieldCreate'),
    		comment = commentField.getValue();

    	// controllo se commento vuoto
    	if (!comment) {
    		Ext.Msg.alert(LANG.warning, LANG.write_something, function() {
    			commentField.focus();
    		});
    		return;
    	}

    	if (parentid > 0) {
    		me.postComment(me, parentid, comment, null, null);
    		return;
    	}
    },

    /**
     * Called when the user taps the Post To All button
     */
    tapPostToAll: function() {
    	var me = this,
    		commentField = me.down('#commentFieldCreate'),
    		comment = commentField.getValue();

    	// controllo se commento vuoto
    	if (!comment) {
    		Ext.Msg.alert(LANG.warning, LANG.write_something, function() {
    			commentField.focus();
    		});
    		return;
    	}

    	Ext.Msg.confirm(LANG.alert, LANG.post_comment_to_all, function(buttonId, value, opt) {
    		if (buttonId == 'yes') {
    			me.postComment(me, null, comment, 'All', null);
    		}
    	});
    },

    /**
     * Called when the user taps on the Post To Users button
     */
    tapPostToUsers: function() {
    	var me = this,
    		btnSelUsers = me.down('#btnCommSelUsers'),
    		commentField = me.down('#commentFieldCreate'),
    		comment = commentField.getValue();

    	// controllo se commento vuoto
    	if (!comment) {
    		Ext.Msg.alert(LANG.warning, LANG.write_something, function() {
    			commentField.focus();
    		});
    		return;
    	}

    	if (!me.selecusers) {
    		// creo qui altrimenti finisce sopra la toolbar
	    	me.selecusers = Ext.create('Ext.Panel', {
		    	//itemId: 'commentCreate2',
	    		itemId: 'selectUsersPanel',
		    	xtype: 'panel',
		    	fullscreen: false,
		    	modal: true,
		    	hideOnMaskTap: true,
		    	minWidth: '320px',
		    	minHeight: '450px',
		    	zIndex: 50,

		    	layout: {
		    		type: 'vbox',
		    	},
		    	//height: (screen.height / (Ext.os.is.Phone ? 2 : 4)) + 'px',
		    	//hidden: true,

		    	listeners: {
		    		hide: function(self) {
		    			var searchField = me.selecusers.down('#usersListSearch'),
		        			topList = me.selecusers.down('#usersListTop'),
		        			selLabel = me.selecusers.down('#usersListMidLabel'),
		        			bottomList = me.selecusers.down('#usersListBottom'),
		        			topStore = topList.getStore(),
		        			bottomStore = bottomList.getStore();

		    			topStore.clearFilter();
		    		}
		    	},

		    	items: [
		    	    {
		    	    	xtype: 'titlebar',
		    	    	title: LANG.to.capitalize() + ':',
		    	    	docked: 'top',
		    	    	ui: 'dark',
		    	    	items: [
		    	    	    {
		    	    	    	xtype: 'button',
		    	    	    	align: 'left',
		    	    	    	hidden: !Ext.os.is.Phone, // only for phones
		    	    	    	iconMask: true,
		    	    	    	iconCls: 'arrow_left',
		    	    	    	handler: function(self) {
		    	    	    		var cont = self.up('#selectUsersPanel');
		    	    	    		if (cont) cont.hide();
		    	    	    	}
		    	    	    },
		    	    	    {
		    	    	    	xtype: 'searchfield',
		    	    	    	align: 'right',
		    	    	    	minWidth: '160px',
		    					maxWidth: (document.body.clientWidth/2) + 'px',
		    	    	    	itemId: 'usersListSearch',
		    	    	    	listeners: {
		    	    	    		scope: me,
		    	    	    		keyup: me.usersListKeyUp,
		    	    	    		clearicontap: me.usersListKeyUp,
		    	    	    	}
		    	    	    }
		    	    	]
		    	    },
		    	    {
		    	    	xtype: 'list',
		    	    	itemId: 'usersListTop',
		    	    	flex: 3,
		    	    	store: Vtecrm.app.userstore,
		                itemTpl: '{complete_name}',
		            	listeners: {
		            		scope: me,
		            		itemtap: me.tapUsersTop,
		            	}
		    	    },
		    	    {
		    	    	xtype: 'toolbar',
		    	    	itemId: 'usersListMidLabel',
		    	    	title: LANG.selected,
		    	    	hidden: true,
		    	    	style: 'font-size: 90%',
		    	    	listeners: {
		    	    		initialize: function(self) {
		    	    			self.element.on({
		    	    				scope: me,
		    	    				tap: me.tapMidToolbar,
		    	    			});
		    	    		}

		    	    	}
		    	    },
		    	    {
		    	    	xtype: 'list',
		    	    	itemId: 'usersListBottom',
		    	    	cls: 'commentUsersListBottom',
		    	    	hidden: true,
		    	    	flex: 2,
		    	    	itemTpl: '{complete_name}',
		    	    	onItemDisclosure: true,
		    	    	disclosureProperty: 'user_name',
		    	    	store: {
		    	    		model: 'Vtecrm.model.VteUser',
		    	    	},
		    	    	listeners: {
		            		scope: me,
		            		disclose: me.tapUsersBottom,
		            	}
		    	    },
		    	    {
		    	    	xtype: 'button',
		    	    	//itemId: ''
		    	    	text: LANG.publish,
		    	    	ui: 'action',
		    	    	margin: '8px',
		    	    	scope: me,
		    	    	handler: function() {
		    	    		var bottomList = me.selecusers.down('#usersListBottom'),
		    	    			commentField = me.down('#commentFieldCreate'),
		    	    			comment = commentField.getValue(),
		    					bottomStore = bottomList.getStore(),
		    	    			users = [];

		    	    		bottomStore.each(function(record) {
		    	    			users.push(record.get('userid'));
		    	    		});

		    	    		if (users.length == 0) {
		    	    			Ext.Msg.alert(LANG.alert, LANG.select_users);
		    	    		} else {
		    	    			me.postComment(me, null, comment, 'Users', users)
		    	    		}
		    	    	}
		    	    }
		    	]
			});
    	}

    	var searchField = me.selecusers.down('#usersListSearch'),
    		topList = me.selecusers.down('#usersListTop'),
    		selLabel = me.selecusers.down('#usersListMidLabel'),
			bottomList = me.selecusers.down('#usersListBottom'),
			parentCont = topList.getParent(),
    		parentLayout = parentCont.getLayout(),
			topStore = topList.getStore(),
			bottomStore = bottomList.getStore();

    	searchField.setValue('');
    	bottomStore.removeAll();
    	topList.deselectAll();
    	topStore.clearFilter();
    	topStore.filterBy(me.usersListTopFilter, me);
    	selLabel.hide();
    	bottomList.hide();

    	parentLayout.setItemFlex(topList, topList.config.flex);
		parentLayout.setItemFlex(bottomList, bottomList.config.flex);
		me.flexChanged = false;

    	me.selecusers.showBy(btnSelUsers);

    },

    usersListTopFilter: function(record, recordid) {
    	var me = this,
    		uname = record.get('user_name'),
    		cname = record.get('complete_name'),
    		bottomList = me.selecusers.down('#usersListBottom'),
    		searchField = me.selecusers.down('#usersListSearch'),
    		bottomStore = bottomList.getStore(),
    		searchVal = searchField.getValue() || '',
    		re = new RegExp(searchVal, 'i');

    	// current user name
    	if (uname == currentUserName) return false;

    	// check if in lower list
    	if (bottomStore.find('user_name', uname, 0, false, true, true) > -1) return false;

    	// search value
    	if (searchVal != '') {
    		return (uname.match(re) || cname.match(re));
    	}

    	return true;
    },

    usersListKeyUp: function() {
    	var me = this,
    		topList = me.selecusers.down('#usersListTop'),
			bottomList = me.selecusers.down('#usersListBottom'),
			topStore = topList.getStore(),
			bottomStore = bottomList.getStore();

    	topStore.clearFilter(true);
    	topStore.filterBy(me.usersListTopFilter, me);
    },

    tapMidToolbar: function() {
    	var me = this,
    		topList = me.selecusers.down('#usersListTop'),
    		bottomList = me.selecusers.down('#usersListBottom'),
    		parentCont = topList.getParent(),
    		parentLayout = parentCont.getLayout(),
    		flex1 = topList.getHeight(),
    		flex2 = bottomList.getHeight();

    	if (!me.flexChanged) {
    		// enlarge
    		parentLayout.setItemFlex(topList, 1);
    		parentLayout.setItemFlex(bottomList, 5);
    		me.flexChanged = true;
    	} else {
    		parentLayout.setItemFlex(topList, 3);
    		parentLayout.setItemFlex(bottomList, 2);
    		me.flexChanged = false;
    	}

    },

    tapUsersTop: function(self, index, e, record) {
    	var me = this,
    		topList = me.selecusers.down('#usersListTop'),
    		bottomList = me.selecusers.down('#usersListBottom'),
    		searchField = me.selecusers.down('#usersListSearch'),
    		selLabel = me.selecusers.down('#usersListMidLabel'),
    		topStore = topList.getStore(),
    		bottomStore = bottomList.getStore();

    	// clear search
    	searchField.setValue('');
    	// add to bottom list and refresh the filter
    	bottomStore.add(record.copy());
    	topList.deselectAll();
    	topStore.clearFilter(true);
    	topStore.filterBy(me.usersListTopFilter, me);
    	//topList.deselectAll();
    	if (bottomStore.getCount() == 1) {
    		var anim = (CONFIG.enable_animations ? {type:'slide', direction: 'up'} : undefined);
    		selLabel.show(anim);
    		bottomList.show(anim);

    	}
    },

    //tapUsersBottom: function(self, index, e, record) {
    tapUsersBottom: function(self, record) {
    	var me = this,
    		selLabel = me.selecusers.down('#usersListMidLabel'),
			topList = me.selecusers.down('#usersListTop'),
			bottomList = me.selecusers.down('#usersListBottom'),
			topStore = topList.getStore(),
			parentCont = topList.getParent(),
    		parentLayout = parentCont.getLayout(),
			bottomStore = bottomList.getStore();

    	// remove it from bottom list and refresh upper list
    	bottomStore.remove(record);
    	topStore.clearFilter(true);
    	topStore.filterBy(me.usersListTopFilter, me);
    	// hide if empty
    	if (bottomStore.getCount() == 0) {
    		var anim = (CONFIG.enable_animations ? {type:'slide', out: true, direction: 'down'} : undefined);
    		selLabel.hide(anim);
    		bottomList.hide(anim);
    		// restore flexes
    		parentLayout.setItemFlex(topList, topList.config.flex);
    		parentLayout.setItemFlex(bottomList, bottomList.config.flex);
    		me.flexChanged = false;
    	}
    },

    closeNewComment: function() {
    	var me = this,
    		toolbar = me.getToolbar(),
    		btnBack = toolbar.down('#btnBack'),
    		btnClose = toolbar.down('#commentBtnCloseNew'),
    		btnAdd = toolbar.down('#commentBtnCreate'),
    		searchField = toolbar.down('#commentFieldSearch'),
    		area = (me.commentCreate ? me.commentCreate.down('#commentFieldCreate') : null),
    		iitems = me.getInnerItems();

    	// chiudo selezione utenti
    	if (me.selecusers) me.selecusers.hide();

    	// cancello vecchio commento
    	if (area) area.setValue('');
    	// nascondo form e sistemo bottoni
    	if (me.commentCreate) me.commentCreate.hide();
    	if (btnBack) btnBack.show();
    	if (btnClose) btnClose.hide();
    	if (btnAdd) btnAdd.show();
    	if (searchField) searchField.show();

    	me.commentCreationMode = null;

    	// e mostro items
    	iitems[0].show();
    },

    // TODO: spostare in general??
    // TODO: usare nuovo touchRequest
    /**
     * Posts a comment
     * @param {Object} scope Not used at the moment
     * @param {Number} parentid The crmid of the record linked to this comment
     * @param {String} comment The content of the comment
     * @param {"All"/"Users"} [visibility=null] The visibility of the comment, "All" for everyone or "Users" for specific users
     * @param {Number[]} [users=null] When visibility is "Users" a list of userids
     */
    postComment: function(scope, parentid, comment, visibility, users) {
    	var me = this,
    		mtime =  (new Date()).getTime(),
    		btn = Ext.getCmp('btnComments');

    	maskView(LANG.saving_comment);
    	Ext.Ajax.request({
    		url: vtwsUrl + 'ws.php?wsname=WriteComment&_dc='+mtime,
    		params: Ext.merge({
    			'parent_comment': parentid,
    			'related_to': me.getCrmid(),
    			'visibility': visibility,
    			'users_comm': (users ? users.join('|') : null),
    			'comment': comment
    		}, params_unserialize(vtwsOpts)),
    		method: 'POST',
    		useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
    	    success: function (b) {
    	    	var field = me.down('#commentCreate'),
    				area = me.down('#commentFieldCreate'),
    				res = Ext.decode(b.responseText);

    	    	if (!res || res.indexOf('ERROR') > 0) {
    	    		alert('ERROR: '+res);
    	    		Ext.Msg.alert(LANG.alert, LANG.invalid_server_answer);
    	    		unMaskView();
    	    		return;
    	    	}

    	    	var cs = res.split('::'),
    	    		count = (cs ? cs[1] : 0);

    	    	// reimposto il numerino
    	    	if (!btn.getHidden() && count > 0) {
    	    		btn.setBadgeText(count);
    	    		setBadge(count);
    	    	} else {
    	    		btn.setBadgeText(false);
    	    		setBadge(null);
    	    	}

    	    	// TODO: non fare un reload di tutto, inserisci solo nello store
    	    	me.reload();

    	    	me.closeNewComment();
    	    	me.onBackButton();
    	    	// tolgo maschera
    	    	unMaskView();

    	    	me.fireEvent('commentsaved', me, comment, parentid, me.getCrmid(), visibility, users);
    	    },
    	    failure: function() {
    	    	me.closeNewComment();
    	    	unMaskView();
    	    	//TODO: msg box
    	    }

    	});
    },

    /**
     * Reload the list of comments
     */
    reload: function() {
    	var me = this,
    		priList = me.down('#primaryList'),
			store = priList.getStore();

    	store.removeAll();
    	store.loadPage(1);
    },

    /**
     * Starts the search
     */
    goSearch: function(me, field, oldval, newval) {
    	var priList = me.down('#primaryList'),
    		store = priList.getStore();

    	me.setSearchString(newval);
    	me.reload();
    },


});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * List of comments for HelpDesk module
 */
Ext.define('Vtecrm.view.ListTicketComments', {
	extend: 'Ext.List',

    alias: "view.ListTicketComments",


    config: {

    	/**
    	 *
    	 */
    	itemId: 'listTicketComments',

    	/**
    	 *
    	 */
    	styleHtmlContent: true,

    	/**
    	 *
    	 */
    	styleHtmlCls: 'listTicketComments',

    	flex: (screen.width > 800 ? 4 : 3),

    	/**
    	 *
    	 */
    	scrollable: 'vertical',

    	/**
    	 * @hide
    	 */
    	hidden: true,

    	/**
    	 *
    	 */
    	loadingText: false,

    	/**
    	 *
    	 */
    	emptyText: '<p align="center">'+LANG.no_records+'</p>',

    	/**
    	 * @hide
    	 */
    	deferEmptyText: true,

    	/**
    	 *
    	 */
    	itemTpl: '<div class="content">{commentcontent}</div><div span="authordiv"><span class="author">{author}</span> <span class="time">({timestamp})</span></div>',

    	/**
    	 *
    	 */
    	isPopup: false,

    	/**
    	 *
    	 */
    	useParentToolbar: false,

    	/**
    	 *
    	 */
    	module: null,

    	/**
    	 * Id of the HelpDesk record
    	 */
    	crmid: null,

    	/**
    	 * @hide
    	 */
    	toolbar: null,

    	/**
    	 * @hide
    	 */
    	store: {
    		autoLoad: false,
    		model: 'Vtecrm.model.VteComment',
    		pageSize: CONFIG.list_page_limit,
    		proxy: {
    			type: "ajax",
    			url: vtwsUrl + "ws.php?wsname=GetTicketComments",
    			extraParams: params_unserialize(vtwsOpts),
    			actionMethods: {read: 'POST'},
    			reader: 'json',
    			listeners: {
        			// json decoding error
        			exception: function(reader,response,error,opts) {
   						Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
   						unMaskView();
   						return false;
   					},
        		}
    		},

    		listeners: {
        		beforeload: function(self) {
        			var list = self.listObject;
        			maskView();
        			self.setPageSize(CONFIG.list_page_limit);
        			self.getProxy().setExtraParams(params_unserialize(vtwsOpts+"&recordid="+list.getCrmid()));
        		},

        		load: function(self, records) {
        			if (records) {
        				for (var i=0; i<records.length; ++i) {
        					var r = records[i],
        						val = r.get('commentcontent'),
        						nval = (val ? val.url2link().mail2link() : null);
        					if (!nval) continue;
        					r._data.commentcontent = nval;
        					r.data.commentcontent = nval;
        					r.raw.commentcontent = nval;
        					r.set('commentcontent', nval);
        				}
        			}

        			unMaskView();
        		}
    		}

    	},

    	/**
    	 * @hide
    	 */
    	items: [
    	    {
    	    	itemId: 'commentCreate',
    	    	xtype: 'toolbar',
    	    	docked: 'bottom',
    	    	ui: 'light',
    	    	layout: {
    	    		type: 'hbox',
    	    		align: 'center',
    	    	},
    	    	height: (screen.height / (Ext.os.is.Phone ? 4 : 8)) + 'px',
    	    	hidden: true,

    	    	items: [
    	    	    {
    	    	    	itemId: 'commentFieldCreate',
    	    	    	xtype: 'textareafield',
    	    	    	align: 'left',
    	    	    	height: (screen.height / (Ext.os.is.Phone ? 4 : 8) - 20) + 'px',
    	    	    	maxRows: 5,
    	    	    	flex: (screen.width < 500 ? 2 : 6),
    	    	    },
    	    	    {
    	    	    	itemId: 'commentPublishCont',
    	    	    	xtype: 'container',
    	    	    	flex: 1,
    	    	    	layout: 'vbox',
    	    	    	align: 'right',
    	    	    	items: [
    	    	    	    {
    	    	    	    	xtype: 'button',
    	    	    	    	text: LANG.publish,
    	    	    	    	minWidth: '60px',
    	    	    	    	scope: this,
    	    	    	    	handler: function(self) {
    	    	    	    		var list = self.up('#listTicketComments');
    	    	    	    		list.publishComment();
    	    	    	    	}
    	    	    	    }
    	    	    	]
    	    	    }
    	    	],
    	    }
    	],

    	/**
    	 * @hide
    	 */
    	listeners: {
    		initialize: function(self) {
    			self.getStore().listObject = self;
    		},

    		hide: function(self) {
    			var me = self,
    				tbar = me.getToolbar(),
    				btn1 = (tbar ? tbar.down('#tickcommentBtnCreate') : null);
    			me.hideNewComment();
    			if (btn1) btn1.hide();
    		},
    	}
    },

    constructor: function() {
    	this.callParent(arguments);
    	this.getStore().listObject = this;

    	// creo il bottone + e rispondi
    	if (this.getUseParentToolbar()) {
    	}
    	this.createButtons();
    },

    /**
     * @private
     * Creates the buttons in the toolbar
     */
    createButtons: function() {
    	var toolbar = this.getToolbar(),
    		crmid = this.getCrmid(),
    		btn1 = (toolbar ? toolbar.down('#tickcommentBtnCreate') : null);

    	if (toolbar) {
    		// permesso di creazione
    			if (btn1) {
    				btn1.show();
    			} else {
	    			btn1 = Ext.create('Ext.Button', {
	    				itemId: 'tickcommentBtnCreate',
	    				xtype: 'button',
		            	//ui: 'plain',
		            	iconCls: 'add',
		            	iconMask: true,
		            	align: 'right',
		            	scope: this,
		            	handler: this.addNewComment
		    		});
	    			toolbar.add([btn1]);
    			}
    	}
    },

    setUseParentToolbar: function(tf) {
    	var me = this,
    		oldtbar = me.getToolbar(),
    		parent = me.getParent(),
    		tbar;
    	if (parent && parent.getToolbar) {
    		tbar = parent.getToolbar();
    		if (tbar) {
    			var oldTitle = tbar.getTitle();
    			me.setToolbar(tbar);
    			tbar.setTitle(oldTitle);
    			me.createButtons();
    		}
    	}
    	me._useParentToolbar = tf;
    },

    /**
     * Hides the field for the creation of a new comment
     */
    hideNewComment: function() {
    	var field = this.down('#commentCreate');
    	field.hide();
    },

    /**
     * Shows the field to create a new comment
     */
    addNewComment: function() {
    	var me = this,
			field = me.down('#commentCreate'),
			area = me.down('#commentFieldCreate');
    	field.show();
    	area.focus();
    },

    //TODO: use touchRequest
    /**
     * Save the new comment
     */
    publishComment: function() {
    	var me = this,
    		crmid = me.getCrmid(),
    		mtime =  (new Date()).getTime(),
			commentField = me.down('#commentFieldCreate'),
			comment = commentField.getValue(),
			father = me.down('#commentPublishCont');

    	// controllo se commento vuoto
    	if (!comment) {
    		Ext.Msg.alert(LANG.warning, LANG.write_something, function() {
    			commentField.focus();
    		});
    		return;
    	}

    	maskView(LANG.saving_comment);
    	Ext.Ajax.request({
    		url: vtwsUrl + 'ws.php?wsname=WriteTicketComment&_dc='+mtime,
    		params: vtwsOpts+'&recordid='+crmid+'&comment='+encodeURIComponent(comment),
    		method: 'POST',
    		useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
    	    success: function (b) {
    	    	var field = me.down('#commentCreate'),
    				area = me.down('#commentFieldCreate'),
    				res = b.responseText;

    	    	if (!res || res.indexOf('ERROR') > 0) {
    	    		alert('ERROR: '+res);
    	    		Ext.Msg.alert(LANG.alert, LANG.invalid_server_answer);
    	    		unMaskView();
    	    		return;
    	    	}

    	    	// reload store
    	    	me.getStore().load();
    	    	// cancello vecchio commento
    	    	area.setValue('');
    	    	// nascondo form
    	    	me.hideNewComment();
    	    	// tolgo maschera
    	    	unMaskView();
    	    },
    	    failure: function() {
    	    	unMaskView();
    	    	//TODO: msg box
    	    }

    	});

    }

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * List of tasks
 */
Ext.define('Vtecrm.view.ListTodos', {
	extend: 'Ext.List',

    alias: "view.ListTodos",


    config: {

    	/**
    	 *
    	 */
    	itemId: 'listTodos',

    	/**
    	 *
    	 */
    	flex: 1,

    	/**
    	 *
    	 */
    	styleHtmlContent: true,

    	/**
    	 *
    	 */
    	styleHtmlCls: 'listTodos',

    	/**
    	 * @hide
    	 */
    	fullscreen: true,

    	/**
    	 * @hide
    	 */
    	hidden: true,

    	/**
    	 *
    	 */
    	emptyText: '<p align="center">'+LANG.no_records+'</p>',

    	/**
    	 *
    	 */
    	loadingText: LANG.loading,

    	/**
    	 * @hide
    	 */
    	isBusy: false,

    	/**
    	 * @hide
    	 */
    	lastRecord: null,

    	/**
    	 * If true, this list is ina popup
    	 */
    	isPopup: true,

    	/**
    	 * @hide
    	 */
    	store: {
    		autoLoad: false,
    		model: 'Vtecrm.model.VteTodo',
    		proxy: {
    			type: "ajax",
    			url: vtwsUrl + "ws.php?wsname=GetTodos",
    			extraParams: params_unserialize(vtwsOpts),
    			actionMethods: {read: 'POST'},
    			reader: {
    				type: 'json',
    				totalProperty: "total",
    				rootProperty: 'todos',
    			},
    			listeners: {
        			// json decoding error
        			exception: function(reader,response,error,opts) {
   						Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
   						unMaskView();
   						return false;
   					},
        		}
    		}
    	},

    	/**
    	 * @hide
    	 */
    	items: [
    	    {
    	    	ui: 'light',
    	    	xtype: 'titlebar',
    	    	docked: 'top',
    	    	scrollable: false,
    	    	title: LANG.todos,
    	    	items: [
    	    	    {
    	    	    	text: LANG.end,
    	    	    	align: 'left',
    	    	    	handler: function(self) {
    	    	    		var me = self.up('#listTodos');

    	    	    		if (me.getParent()) {
    	    	    			me.getParent().hide();
    	    	    		}
    	    	    	}
    	    	    },
    	    	    {
    	    	    	//text: LANG.create,
    	    	    	iconMask: true,
    	    	    	iconCls: 'add',
    	    	    	align: 'right',
    	    	    	handler: function(self) {
    	    	    		var me = self.up('#listTodos');
    	    	    		Vtecrm.app.showRecord('Calendar', null, '');
    	    	    		if (me.getParent()) {
    	    	    			me.getParent().hide();
    	    	    		}
    	    	    	}
    	    	    }

    	    	]
    	    }
    	],

    	/**
    	 * @hide
    	 */
    	listeners: {

    		initialize: function(self) {
    			var store = self.getStore();
    			if (store) {
    				store.setGrouper({
    					groupFn: function(record) {
    						var unseen = record.get('expired');
    						return unseen ? ' '+LANG.expiring : LANG.others;
    					},
    					//sortProperty: 'unseen',
    				});
    				self.setPinHeaders(true);
    				self.setGrouped(true);
    			}
    		},

    		itemtap: function(self, index, target, record, e) {
    			var me = this,
    				crmid = record.get('crmid'),
    				ename = record.get('entityname'),
    				lastrecord = me.getLastRecord(),
    				lastid = (lastrecord ? lastrecord.get('crmid') : null),
    				olddivcont = $('#todoBtnContainer_'+lastid);

    			if (me.getIsBusy()) return;
    			me.setIsBusy(true);

    			// hide old pippo

    			if (lastid > 0 && olddivcont.length > 0) {
    				me.hideTodoDetails(lastid, function() {

        				if (lastid == crmid) {
        					me.setLastRecord(null);
        					me.setIsBusy(false);
        				} else {
        					me.showTodoDetails(record, function() {
        						me.setLastRecord(record);
        						me.setIsBusy(false);
            				});
        				}
    				});
    			} else {
    				// open new
    				me.showTodoDetails(record, function() {
    					me.setLastRecord(record);
    					me.setIsBusy(false);
    				});

    			}

    		},

    		show: function() {
    			this.getStore().load();
    		}
    	}

    },

    subforms: [],

    /**
     * Expands the line showing more details of the todo
     */
    showTodoDetails: function(record, callback) {
    	var me = this,
    		crmid = record.get('crmid'),
    		divcont = Ext.fly('todoBtnContainer_'+crmid), // disable cache with fly
    		jdivcont = jQuery('#todoBtnContainer_'+crmid),
    		detCmp = me.createTodoDetails(record);

    	me.setIsBusy(true);
    	jdivcont.hide();
    	divcont.appendChild(detCmp.element);

		// mostro con animazione
		jdivcont[CONFIG.enable_animations ? 'slideDown' : 'show']((CONFIG.enable_animations ? 'fast' : 0), function() {
			if (typeof callback == 'function') callback();
		});

    },

    /**
     * Hides the details of a todo
     */
    hideTodoDetails: function(oldcrmid, callback) {
    	var me = this,
    		olddivcont = $('#todoBtnContainer_'+oldcrmid);

    	olddivcont[CONFIG.enable_animations ? 'slideUp' : 'hide']((CONFIG.enable_animations ? 'fast' : 0), function() {
    		$('#todoBtnContainer_'+oldcrmid).html('');
    		if (typeof callback == 'function') callback();
    	});
    },

    /**
     * Creates the form with the details
     */
    createTodoDetails: function(record) {
    	var me = this,
			crmid = record.get('crmid'),
			formName = 'todoButtons_'+crmid;

    	//creo il form con i dati
    	if (!me.subforms[crmid]) {
    		me.subforms[crmid] = Ext.create('Ext.Container', {
    			id: formName,
    			itemId: formName,
    			xtype: 'container',
    			layout: {
    				type: 'hbox',
    				align: 'center',
    			},
    			defaults: {
    				margin: '4px',
    			},
    			items: [
    			    {
    			    	xtype: 'button',
    			    	ui: 'action',
    			    	cls: 'button-action-light',
    			    	maxWidth: '24px',
    			    	//text: LANG.close_task,
    			    	iconMask: true,
    			    	iconCls: 'check2',
    			    	flex: 1,
    			    	scope: me,
    			    	handler: me.tapCloseTaskBtn,
    			    },
    			    {
    			    	xtype: 'label',
    			    	cls: 'todoDescription',
    			    	html: record.get('description').addEllipses(1000),
    			    	flex: 10,
    			    },
    			    {
    			    	xtype: 'button',
    			    	text: (Ext.os.is.Phone ? undefined : LANG.details),
    			    	iconMask: (Ext.os.is.Phone ? true : false),
    			    	iconCls: (Ext.os.is.Phone ? 'more' : undefined),
    			    	ui: 'action',
    			    	cls: 'button-action-light',
    			    	flex: 1,
    			    	minWidth: (Ext.os.is.Phone ? undefined : '70px'),
    			    	maxWidth: '90px',
    			    	scope: me,
    			    	handler: me.tapEditBtn,
    			    },
    			]
    		});
    	}

		return me.subforms[crmid];
    },

    /**
     * Called when the edit button is pressed
     */
    tapEditBtn: function() {
    	var me = this,
    		lastrecord = me.getLastRecord(),
    		crmid = lastrecord.get('crmid'),
    		module = lastrecord.get('module'),
    		ename = lastrecord.get('entityname');

		if (crmid > 0) {
			Vtecrm.app.showRecord(module, crmid, ename);
			if (me.getIsPopup() && me.getParent()) {
				me.getParent().hide();
			}
		}
    },

    /**
     * Called when the "close task" button is pressed
     */
    tapCloseTaskBtn: function(self, e) {
    	var me = this,
    		mtime =  (new Date()).getTime(),
    		module = 'Calendar',
    		lastrecord = me.getLastRecord(),
    		crmid = lastrecord.get('crmid');

    	// prevent tap on list
    	e.stopPropagation();

		maskView();
		Ext.Ajax.request({
			url: vtwsUrl + 'ws.php?wsname=SimpleEdit&_dc='+mtime,
			params: vtwsOpts+'module='+module+'&recordid='+crmid+'&fieldname=taskstatus&fieldvalue=Completed',
			method: 'POST',
			useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
		    success: function (b) {
		    	if (empty(b.responseText)) return;

		    	try {
		    		var retStatus = Ext.decode(b.responseText);
		    		// preferito
		    	} catch (e) {
		    		// catch not supported
		    		if (b.responseText == 'ERROR::Unknown webservice') {
		    			Ext.Msg.alert(LANG.error, LANG.not_supported_by_server + ". " + LANG.open_todo_details + '.');
		    		} else {
		    			Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
		    		}
		    		unMaskView();
		    		return;
		    	}

		    	if (retStatus.success != true) {
		    		Ext.Msg.alert(LANG.error, retStatus.message);
		    	} else {
		    		// reload store
		    		me.deselectAll();
		    		me.getStore().load();
		    	}

		    	// ricreo il form se necessario
		    	unMaskView();

		    },
		});
    },

    // TODO: move to another function or in cfg
    initialize: function() {
    	var tpl = new Ext.XTemplate(
    		'<div class="todoContainer<tpl if=\'expired==true\'> todoUnseen</tpl>">',
   	    		'<div>',
   	        		'<div class="todoSubject">{entityname}</div>',
   	        		'<div class="todoTime">',
   	        			'<tpl if="expired == true && is_now == false">'+LANG.is_expired+'</tpl>',
   	        			'<tpl if="expired == true && is_now == true">'+LANG.expires+'</tpl>',
   	        			'<tpl if="expired == false">'+LANG.expires+'</tpl>',
   	        			' {timestampago}',
   	        		'</div>',
   	        	'</div>',
   	        	'<div class="todoBtnContainer" id="todoBtnContainer_{crmid}"></div>',
   	        '</div>'
    	);

    	this.setItemTpl(tpl);
    	return this.callParent(arguments);
    }

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

// TODO: unificare con lista standard
/**
 * List of related records. This List will be merged into the Vtecrm.view.ListRecords in the future.
 */
Ext.define('Vtecrm.view.ListRelated', {
	extend: 'Ext.List',

    alias: "view.ListRelated",

    config: {
    	/**
    	 *
    	 */
    	itemId: 'listRelated',

    	/**
    	 *
    	 */
    	itemTpl: '{entityname} <div class="listitem" id="relatedRecord_{crmid}" style="display:none;margin-top:8px"></div>', // TODO: aggiungere relationid

    	/**
    	 * @hide
    	 */
    	flex: (screen.width > 800 ? 4 : 3),

    	/**
    	 * @hide
    	 */
    	scrollable: true,

    	/**
    	 * @hide
    	 */
    	hidden: true,

    	/**
    	 * @hide
    	 */
    	loadingText: false,

    	/**
    	 * @hide
    	 */
    	deferEmptyText: true,

    	/**
    	 *
    	 */
    	emptyText: '<p align="center">'+LANG.no_records+'</p>',

    	/**
    	 *
    	 */
    	onItemDisclosure: true,

    	/**
    	 *
    	 */
    	disclosureProperty: function (data) {
    		if (data && data.setype) {
    			return Vtecrm.app.isModuleAvailable(data.setype);
    		}
    		return true;
    	},

    	// custom
    	/**
    	 *
    	 */
    	module: undefined,

    	/**
    	 * The name of the related module
    	 */
    	relatedModule: undefined,

    	/**
    	 * The crmid of the parent record
    	 */
    	crmid: undefined,

    	/**
    	 * The relationid
    	 */
    	relationId: undefined,

    	/**
    	 * @hide
    	 */
    	fieldStruct: undefined,

    	/**
    	 * @hide
    	 */
    	actions: [],

    	/**
    	 * @hide
    	 */
    	deleteButton: true,	// globale, mai usato

    	/**
    	 * @hide
    	 */
    	lastTapped: null,

    	/**
    	 * @hide
    	 */
    	isBusy: false,

    	/**
    	 * @hide
    	 */
    	store: {
    		autoLoad: false,
    		model: 'Vtecrm.model.VteEntity',
    		pageSize: CONFIG.list_page_limit, // TODO: sync con server
    		clearOnPageLoad: false,
    		proxy: {
        		type: "ajax",
        		url: vtwsUrl + "ws.php?wsname=GetRelated",
           	    extraParams: params_unserialize(vtwsOpts+"relationid=0&record=0"),
       			actionMethods: {read: 'POST'},
        		reader: {
        			type: 'json',
        			rootProperty: "entries",
        		    totalProperty: "total"
        		},
        	},
        	listeners: {
        		beforeload: function(self) {
        			var list = self.listObject;
        			maskView();
        			self.setPageSize(CONFIG.list_page_limit);
        			self.setProxy({
        			    type: 'ajax',
        			    url: vtwsUrl + "ws.php?wsname=GetRelated",
                   	    extraParams: params_unserialize(vtwsOpts+"module="+list.getModule()+"&relationid="+list.getRelationId()+"&recordid="+list.getCrmid()),
               			actionMethods: {read: 'POST'},
        			    reader: {
                			type: 'json',
                			rootProperty: "entries",
                		    totalProperty: "total"
                		},
                		listeners: {
                			// json decoding error
                			exception: function(reader,response,error,opts) {
           						Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
           						unMaskView();
           						return false;
           					},
                		}
        			});
        			list.setIsBusy(false);
        		},

        		load: function(self) {
        			var list = self.listObject,
        				showrecord = list.up('#viewShowRecord'),
        				//tbar = list.down('#listRelatedBar'),
        				btnSelect = showrecord.down('#recordRelBtnSelect'),
        				btnAdd = showrecord.down('#recordRelBtnAdd'),
    					actions = list.getActions();

        			btnAdd.hide();
    				btnSelect.hide();
        			if (actions.length > 0) {
        				for (var i=0; i<actions.length; ++i) {
        					switch (actions[i]) {
        						case 'ADD': btnAdd.show(); break;
        						case 'SELECT': btnSelect.show(); break;
        					}
        				}
        			}
        			/*list.setIsBusy(false);
        			list.setLastTapped(null);*/
        			unMaskView();
        		}
        	}
    	},

    	/**
    	 * @hide
    	 */
    	plugins: [
	        {
                xclass: 'Ext.plugin.ListPaging',
                ptype: 'listpaging',
                autoPaging: true,
                loadMoreText: LANG.loading,
                noMoreRecordsText: ''
	        },
    	    /*{
    	    	xclass: 'Ext.plugin.PullRefresh',
    	        pullRefreshText: 'Pull down for more new Tweets!'

    	    }*/
    	],


    	/**
    	 * @hide
    	 */
    	listeners: {

    		initialize: function(self) {
    			self.getStore().listObject = self;
    		},

    		show: function(self) {
    			self.setIsBusy(false);
    			//self.setLastTapped(null);
    		},

    		hide: function(self) {
    			var lastid = self.getLastTapped();

    			// destroy stuff
    			if (lastid > 0) {
    				var oldcomp = Ext.getCmp(self.genFormName(lastid));
    				if (oldcomp) {
    					oldcomp.destroy();
    				}
    			}
    			self.setLastTapped(null);
    		},

    		disclose: function(self, record) {
    			var setype = record.get('setype'),
    				relcrmid = record.get('crmid'),
    				entityname = record.get('entityname');

    			if (!empty(setype) && !empty(relcrmid)) {
    				Vtecrm.app.showRecord(setype, relcrmid, entityname);
    			}
    		},

    		itemtap: function(self, index, target, record, e) {
    			var subform, fieldstruct, fielddata, html,
    				lastid = self.getLastTapped(),
    				crmid = record.get('crmid'),
    				divcont = $('#relatedRecord_'+crmid),
    				olddivcont = $('#relatedRecord_'+lastid);

    			// ignoro click se dentro al form
    			if (e.target.classList && !e.target.classList.contains('listitem') && !e.target.classList.contains('x-list-item-label')) return;

    			if (self.getIsBusy()) return;
    			self.setIsBusy(true);
    			// nascondo vecchio form
    			if (lastid > 0 && olddivcont.length > 0) {

    				olddivcont[CONFIG.enable_animations ? 'slideUp' : 'hide']((CONFIG.enable_animations ? 'fast' : 0), function() {
    					$('#relatedRecord_'+lastid).html('');

    					var oldcomp = Ext.getCmp(self.genFormName(lastid));
        				if (oldcomp) oldcomp.destroy();

        				if (lastid == crmid) {
        					self.setLastTapped(null);
        				} else {
        					self.createRelatedForm(self, record);
            				self.setLastTapped(crmid);

        				}
        				self.setIsBusy(false);
    				});

    			} else {
    				self.createRelatedForm(self, record);
    				self.setLastTapped(crmid);
    				self.setIsBusy(false);
    			}

    		}
    	},

    	/**
    	 * @hide
    	 */
    	control: {
    		'#listRelatedBtnSelect': {
				tap: function() {
					var me = this;
					me.selectRecord();
				}
			},

			'#listRelatedBtnAdd': {
				tap: function() {
					var me = this;
					me.addRecord();
				}
			},
    	}
    },

    constructor: function() {
    	this.callParent(arguments);
    },

    /**
     * @protected
     * Creates the form to show extra informations
     */
    createRelatedForm: function(self, record) {
    	var me = self,
    		subform, fieldstruct, fielddata,
			lastid = me.getLastTapped(),
			crmid = record.get('crmid'),
			perm_delete = record.get('perm_delete'),
			hasDelete = (me.getDeleteButton() === true) && (perm_delete === null || perm_delete === undefined || perm_delete === true),	// backward compatibility
			divcont, jdivcont;
			/*olddivcont = Ext.get('relatedRecord_'+lastid),
			jolddivcont = $('#relatedRecord_'+lastid);*/

    	me.setIsBusy(true);

    	// controllo se esiste già
    	var existing = Ext.getCmp(me.genFormName(crmid));
    	if (existing) {
    		existing.destroy();
    	}

    	//creo il form con i dati
		subform = Ext.create('Ext.form.FieldSet', {
			id: me.genFormName(crmid),
			xtype: 'fieldset',
		});

		// pulsante elimina
		if (hasDelete) {
			var puls = Ext.create('Ext.Button', {
				xtype: 'button',
				ui: 'action',
				text: LANG.delete_label,
				width: '100px',
				align: 'center',
				margin: '2px auto 2px 2px',
				handler: function() { me.deleteRelated(me); },
			});
			subform.add([puls]);
		}

		fieldstruct = me.getFieldStruct();
		fielddata = Ext.decode(record.get('fields'));

		// creo i campi
		for (var j=0; j<fieldstruct.length; ++j) {
			var fldname = fieldstruct[j].name;
			var fieldinfo = createFieldConfig(record.get('setype'), fieldstruct[j], this, fielddata[fldname], false);
			var fieldcmp = Ext.create(fieldinfo[0], fieldinfo[1]);
			subform.add([fieldcmp]);
		}

		// contenitori: use fly to disable caching
		divcont = Ext.fly('relatedRecord_'+crmid),
		jdivcont = $('#relatedRecord_'+crmid);

		divcont.appendChild(subform.element);

		// mostro con animazione
		jdivcont[CONFIG.enable_animations ? 'slideDown' : 'show']((CONFIG.enable_animations ? 'fast' : 0), function() {
			me.setIsBusy(false);
		});
    },

    // genera il nome per il form
    genFormName: function(crmid) {
    	var me = this,
    		relid = me.getRelationId();

    	if (empty(relid)) relid = '';
    	return 'editformrel_'+relid+'_'+crmid;
    },

    /**
     * Removes the selected record from the relation
     */
    deleteRelated: function(self) {
    	var me = self,
    		mtime =  (new Date()).getTime(),
    		relstore = me.getStore(),
    		relationId = me.getRelationId(),
    		lastid = me.getLastTapped(),
    		storeidx = relstore.find('crmid', lastid),
    		oldcomp = Ext.getCmp(me.genFormName(lastid));

    	Ext.Msg.confirm(LANG.alert, LANG.delete_relation, function(buttonId, value, opt) {
   			if (buttonId == 'yes' && lastid > 0) {
   				var delrecord = relstore.getAt(storeidx);

   				// salvo lato server
   				maskView();
   				Ext.Ajax.request({
   		    		url: vtwsUrl + 'ws.php?wsname=DeleteRelation&_dc='+mtime,
   		    		params: vtwsOpts + 'module='+me.getModule()+'&relmodule='+delrecord.get('setype')+'&relationid='+me.getRelationId()+'&parentid='+me.getCrmid()+'&record='+lastid,
   		    		method: 'POST',
   		    		useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
   		    	    success: function (b) {
   		    	    	if (oldcomp) oldcomp.destroy();
   						relstore.removeAt(storeidx);
   		   				me.setLastTapped(null);
   		   				unMaskView();
   		    	    },
   		    	});
   			}
   		});
    },

    /**
     * Called when the "select" button is tapped
     */
    selectRecord: function() {
    	var me = this,
    		module = me.getModule(),
    		relModule = me.getRelatedModule(),
    		showrecordcont = me.up('#viewShowRecord');

    	var newList = Ext.create('Vtecrm.view.ListSearch', {
    		module: relModule,
    		toolbar: true,
    		useSearch: true,
    		listeners: {
    			// override tap handler
    			itemtap: function(self, index, target, record, e) {
    				var relcrmid = record.get('crmid');

    				Vtecrm.app.touchRequest('SaveRelation', {
    					module:		me.getModule(),
    					record:		me.getCrmid(),
    					relmodule:	relModule,
    					relrecord:	relcrmid,
    					relationid: me.getRelationId(),
    				}, true, function() {
    					showrecordcont.setReloadOnShow(false);
   		   				Vtecrm.app.historyBack();
    				}, false, true);
    			}
    		}
    	});
    	newList.getStore().load();
    	Vtecrm.app.historyAdd(newList);
    },

    /**
     * Called when the "create" button is tapped
     */
    addRecord: function() {
    	var me = this,
			module = me.getModule(),
			relModule = me.getRelatedModule(),
			showrecordcont = me.up('#viewShowRecord');

    	Vtecrm.app.showRecord(relModule, null, null, showrecordcont);
    }


});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * List of products for Inventory modules (Quotes, Sales Orders, Purchase Orders, Invoice, Ddt)
 */
Ext.define('Vtecrm.view.ListProducts', {
	extend: 'Ext.List',

	config: {

		/**
		 *
		 */
		itemId: 'listProducts',

		/**
		 * @hide
		 */
		hidden: true,

		/**
		 * @hide
		 */
		flex: (screen.width > 800 ? 4 : 3),

		/**
		 * The template for this list. Each line has a div with ID assocProduct_* that will be filled with the product information
		 */
		itemTpl: new Ext.XTemplate(
			'<div style="clear:both;" class="listitem">',
				'<div style="float:left;clear:left" class="listitem">{entityname}</div>',
				'<div style="float:right;clear:right" class="listitem"><span id="assocProductTotal_{lineItemId}" class="listitem">{lineTotal:this.format}</span> '+CONFIG.currency_symbol+'</div>',
			'</div>',
			'<div id="assocProduct_{lineItemId}" class="listitem" style="display:none;clear:both"></div>',
			{
				format: function(num) {
					if (num === undefined || num === null) return '?';
					return num.format();
				}
			}
		),

		/**
		 * The module
		 */
		module: null,

		/**
		 * The crmid of the record which holds the products
		 */
		crmid: null,

		/**
		 * @private
		 */
		lastTapped: null,

		/**
		 * @private
		 */
		isBusy: false,

		/**
		 * @hide
		 */
		fieldStruct: undefined,

		/**
		 * @hide
		 */
		totalStruct: undefined,

		/**
		 * @hide
		 */
		store: {
    		autoLoad: false,
    		model: 'Vtecrm.model.VteAssocProduct',
    		pageSize: CONFIG.list_page_limit, // TODO: sync con server
    		clearOnPageLoad: false,
    		proxy: {
        		type: "ajax",
        		url: vtwsUrl + "ws.php?wsname=GetAssociatedProducts",
           	    extraParams: params_unserialize(vtwsOpts+"module=&record=0"),
       			actionMethods: {read: 'POST'},
        		reader: {
        			type: 'json',
        			rootProperty: "entries",
        		    totalProperty: "total"
        		},
        	},
        	listeners: {
        		beforeload: function(self) {
        			var list = self.listObject;
        			self.setPageSize(CONFIG.list_page_limit);
        			self.setProxy({
        			    type: 'ajax',
        			    url: vtwsUrl + "ws.php?wsname=GetAssociatedProducts",
                   	    extraParams: params_unserialize(vtwsOpts+"module="+list.getModule()+"&record="+list.getCrmid()),
               			actionMethods: {read: 'POST'},
        			    reader: {
                			type: 'json',
                			rootProperty: "entries",
                		    totalProperty: "total",
                		    messageProperty: 'TOTALS', // uso per i totali
                		},
                		listeners: {
                			// json decoding error
                			exception: function(reader,response,error,opts) {
           						Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
           						unMaskView();
           						return false;
           					},
                		}
        			});
        			list.setIsBusy(true);
        		},
        		// dopo il caricamento dei dati, creo form con totali
        		load: function(self, records, succ, op) {
        			var list = self.listObject,
        				record = op.getResultSet().getMessage(); // hack: prendo i totali da message
        			// cerco record dei totali
        			list.setIsBusy(false);
        			list.createTotalForm(list, record);
        		}
        	}
    	},

    	/**
    	 * @hide
    	 */
    	listeners: {
    		itemtap: function(self, index, target, record, e) {
    			return self.onItemTap2(self, index, target, record, e);
    		},
    		hide: function(self) {
    			// destroy all formids
    			// TODO: don't use id at all!!
    			var store = self.getStore();

    			store.each(function(record) {
    				var	itemid = record.get('lineItemId'),
    					form = Ext.getCmp('editformprod_'+itemid);
        			if (form) {
        				form.destroy();
        			}
    			});
    			self.setIsBusy(false);
    			self.setLastTapped(null);
    		}
    	},

    	/**
    	 * @hide
    	 */
    	items: [
    	    {
    	    	xtype: 'container',
    	    	docked: 'top',
    	    	margin: '8px 8px 2px 8px',
    	    	layout: 'vbox',

    	    	items: [
    	    	    {
    	    	    	xtype: 'container',
    	    	    	layout: 'hbox',
    	    	    	style: 'margin-bottom: 8px;',

    	    	    	items: [
    	    	    	    {
    	    	    	    	xtype: 'container',
    	    	    	    	html: LANG.total,
    	    	    	    	styleHtmlContent: true,
    	    	    	    	styleHtmlCls: 'x-form-fieldset-title',
    	    	    	    },
    	    	    	    {
    	    	    	    	xtype: 'spacer',
    	    	    	    },
    	    	    	    {
    	    	    	    	itemId: 'prodTotalFieldCont',
    	    	    	    	xtype: 'container',
    	    	    	    	html: '',
    	    	    	    	styleHtmlContent: true,
    	    	    	    	styleHtmlCls: 'x-form-fieldset-title',
	    	    	    	},
    	    	    	    {
	    	    	    		itemId: 'prodTotalBtn',
    	    	    	    	xtype: 'button',
    	    	    	    	ui: 'action',
    	    	    	    	iconMask: true,
    	    	    	    	iconCls: 'more',
    	    	    	    },
    	    	    	]
    	    	    },
    	    	    {
    	    	    	itemId: 'prodTotalForm',
    	    	    	xtype: 'formpanel',
    	    	    	scrollable: false,

    	    	    	items: [{
    	    	    		itemId: 'prodTotalCont',
    	    	    		xtype: 'fieldset',
    	    	    		hidden: true,
    	    	    		padding: '0px',
    	    	    		scrollable: (document.height < 800 ? 'vertical' : false),
    	    	    		height: (document.height < 800 ? (document.height/2)+'px' : 'auto'),
    	    	    		verticalLayout: CONFIG.vertical_layout,
    	    	    	}]
    	    	    },
    	    	],

    	    },
    	    {
    	    	xtype: 'fieldset',
    	    	docked: 'top',
    	    	title: LANG.products,
    	    	margin: '2px 8px 2px 8px',
    	    },
    	],

    	/**
    	 * @hide
    	 */
    	control: {
    		'#prodTotalBtn' : {
    			tap: function(self) {
    				var cont = this.down('#prodTotalCont');
    	    		if (cont) {
    	    			if (cont.getHidden()) {
    	    				// recalculate size
    	    				cont.setScrollable(document.height < 800 ? 'vertical' : false);
    	    	    		cont.setHeight(document.height < 800 ? (document.height/2)+'px' : 'auto');
    	    				cont.show();
    	    				self.setIconCls('arrow_down');
    	    			} else {
    	    				cont.hide();
    	    				self.setIconCls('more');
    	    			}
    	    		}
    			}
    		},
    	}

	},

	calculating: false,

    constructor: function() {
    	this.callParent(arguments);
    	// trick to save the list instance in the store
    	this.getStore().listObject = this;
    },

    /**
     * Called when the "add" button is pressed
     */
    onButtonAddTap: function(self) {
		var me = this,
			relModule = 'Products',
			mtime =  (new Date()).getTime(),
			showrecordcont = me.up('#viewShowRecord');

		var newList = Ext.create('Vtecrm.view.ListSearch', {
    		module: relModule,
    		toolbar: true,
    		useSearch: true,
    		listeners: {
    			// override tap handler
    			itemtap: function(self, index, target, record, e) {
    				var relcrmid = record.get('crmid');

    				maskView();
    				// carico il prodotto e lo aggiungo
    				Ext.Ajax.request({
       		    		url: vtwsUrl + 'ws.php?wsname=GetRecord&_dc='+mtime,
       		    		params: vtwsOpts + 'module='+relModule+'&record='+relcrmid+'&forproductblock=1',
       		    		method: 'POST',
       		    		useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
       		    	    success: function (b) {
       		    	    	var prodinfo;

       		    	    	try {
       		    	    		prodinfo = Ext.decode(b.responseText);
       		    	    	} catch (e) {
       		    	    		prodinfo = {};
       		    	    		Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
       		    	    	}
       		    	    	me.addProduct(prodinfo);

       		   				unMaskView();
       		   				Vtecrm.app.historyBack();
       		    	    },
       		    	});
    			}
    		}
    	});
    	newList.getStore().load();
    	showrecordcont.setReloadOnShow(false);
    	Vtecrm.app.historyAdd(newList);
	},

	/**
	 * Called when the users taps on a product
	 */
	onItemTap2: function(self, index, target, record, e) {
		var subform, fieldstruct, fielddata, html,
			lastid = self.getLastTapped(),
			crmid = record.get('crmid'),
			itemid = record.get('lineItemId'),
			divcont = $('#assocProduct_'+itemid),
			olddivcont = $('#assocProduct_'+lastid),
			totcont = self.down('#prodTotalCont'),
			totbtn = self.down('#prodTotalBtn');

		// ignoro se cliccato nel form
		if (e && e.target && e.target.classList && !e.target.classList.contains('listitem') && !e.target.classList.contains('x-list-item-label')) return;

		if (self.getIsBusy()) return;
		self.setIsBusy(true);

		// chiudo i totali
		if (totcont) {
			totcont.hide();
			totbtn.setIconCls('more');
		}

		// nascondo vecchio form
		if (lastid > 0) {
			olddivcont[CONFIG.enable_animations ? 'slideUp' : 'hide']((CONFIG.enable_animations ? 'fast' : 0), function() {
				$('#assocProduct_'+lastid).html('');
				var oldcomp = Ext.getCmp('editformprod_'+lastid);
				if (oldcomp) oldcomp.destroy();

				if (lastid == itemid) {
					self.setLastTapped(null);
				} else {
					self.createProductForm(self, record);
    				self.setLastTapped(itemid);
				}
				self.setIsBusy(false);
			});

		} else {
			self.createProductForm(self, record);
			self.setLastTapped(itemid);
			self.setIsBusy(false);
		}
	},


	setTotalField: function(tot) {
		var me = this,
			cont = me.down('#prodTotalFieldCont');
		if (cont) {
			cont.setHtml(parseFloat(tot).format()+" "+CONFIG.currency_symbol);
		}
	},

	/**
	 * @protected
	 * Creates a form for the totals
	 */
	createTotalForm: function(self, record) {
		var me = self,
			cont = me.down('#prodTotalCont'),
			showrecordcont = Vtecrm.app.historyFindLast('viewShowRecord'),
			struct = me.getFieldStruct(),
			totalstruct = me.getTotalStruct(),
			i;

		me.setIsBusy(true);

		// elimino vecchi dati
		var items = cont.getItems();
		if (items) {
			items.each(function(fld, idx) {
				if (fld) fld.destroy();
				return true;
			});

		}

		// trovo la struttura per i totali se manca
		if (empty(totalstruct)) {
			for (i=0; i<struct.length; ++i) {
				if (struct[i].name == 'TOTALS') {
					totalstruct = struct[i].fields;
					me.setTotalStruct(totalstruct);
					break;
				}
			}
		}

		for (var j=0; j<totalstruct.length; ++j) {
			var fldname = totalstruct[j].name;
			var fieldinfo = createFieldConfig('Products', totalstruct[j], showrecordcont, record[fldname]);
			var fieldcmp = Ext.create(fieldinfo[0], fieldinfo[1]);
			if (fldname == 'grandTotal') me.setTotalField(record[fldname]);
			fieldcmp.on('change', function() {
					self.calcGrandTotal();
				},
			self);

			cont.add([fieldcmp]);

		}

		me.setIsBusy(false);
	},

	/**
	 * @protected
	 * Creates the form for the single product line
	 */
	createProductForm: function(self, record) {
    	var subform, fieldstruct, fielddata, html,
    		showrecordcont = Vtecrm.app.historyFindLast('viewShowRecord'),
    		lastid = self.getLastTapped(),
    		crmid = record.get('crmid'),
    		itemid = record.get('lineItemId'),
    		divcont = Ext.get('assocProduct_'+itemid),
    		jdivcont = $('#assocProduct_'+itemid),
    		olddivcont = $('#assocProduct_'+lastid),
    		i,j;

    	self.setIsBusy(true);

    	//creo il form con i dati
    	// attenzione, uso un trick: non mostro il form, solo il fieldset
    	subfield = Ext.create('Ext.form.FieldSet', {
			id: 'editformsetprod_'+itemid,
			xtype: 'fieldset',
			//height: '100%',
			//hidden: false,
		});

		subform = Ext.create('Ext.form.Panel', {
			id: 'editformprod_'+itemid,
			xtype: 'formpanel',
			items: [subfield],
			//hidden: false,
		});

		// pulsante elimina
		var puls = Ext.create('Ext.Button', {
			xtype: 'button',
			ui: 'action',
			text: LANG.delete_label,
			width: '100px',
			align: 'center',
			margin: '2px auto 2px 2px',
			scope: this,
			handler: self.deleteProduct,
		});
		subfield.add([puls]);

		fieldstruct = self.getFieldStruct();
		fielddata = record.raw;

		// tasse per il prodotto (nome->valore)
		var valid_taxes = {}
		if (fielddata.taxes) {
			for (j=0; j<fielddata.taxes.length; ++j) {
				var taxobj = fielddata.taxes[j];
				valid_taxes[taxobj.taxname] = taxobj.percentage;
			}
		}

		if (fielddata['discount_type'] == 'percentage') {
			fielddata['discount_amount'] = fielddata['discount_percent'];
		}

		// creo i campi
		for (j=0; j<fieldstruct.length; ++j) {
			var fldname = fieldstruct[j].name,
				fldvalue = fielddata[fldname];
			if (fldname == 'TOTALS') continue;
			// controllo campi tasse
			if (fieldstruct[j].type.istax) {
				if (empty(valid_taxes[fldname])) continue;
				else fldvalue = valid_taxes[fldname];
			}

			var fieldinfo = createFieldConfig(self.getModule(), fieldstruct[j], showrecordcont, fldvalue, false);
			// aggiungo handler per calcoli
			var fieldcmp = Ext.create(fieldinfo[0], fieldinfo[1]);
			fieldcmp.on('change', function() {
					self.calcProductRow();
					self.calcGrandTotal();
				},
			self);
			subfield.add([fieldcmp]);
		}

		// imposto il contenuto
		if (subform) {
			divcont.appendChild(subfield.element);
		}

		// mostro con animazione

		jdivcont[CONFIG.enable_animations ? 'slideDown' : 'show']((CONFIG.enable_animations ? 'fast' : 0), function() {
			self.setIsBusy(false);
		});
    },

    /**
     * Deletes the selected product
     */
    deleteProduct: function() {
    	var list = this,
    		recview = Vtecrm.app.historyFindLast('viewShowRecord'),
    		lastid = list.getLastTapped(),
    		oldcomp = Ext.getCmp('editformprod_'+lastid),
    		liststore = list.getStore(),
    		selprodidx = liststore.find('lineItemId', lastid);

    	Ext.Msg.confirm(LANG.alert, LANG.delete_product, function(buttonId, value, opt) {
   			if (buttonId == 'yes' && selprodidx >= 0) {
				if (oldcomp) oldcomp.destroy();
   				liststore.removeAt(selprodidx);
   				list.setLastTapped(null);
   				list.calcGrandTotal();
   				recview.saveRecord();
   			}
   		});
    },

    /**
     * Adds a product to the list
     */
    addProduct: function(prodinfo) {
    	var list = this,
    		lastid = list.getLastTapped(),
    		olddivcont = $('#assocProduct_'+lastid),
    		recview = Vtecrm.app.historyFindLast('viewShowRecord'),
    		liststore = list.getStore(),
    		model = liststore.getModel(),
    		modelInst;


    	// nascondo vecchio form
		if (lastid > 0) {
			olddivcont[CONFIG.enable_animations ? 'slideUp' : 'hide']((CONFIG.enable_animations ? 'fast' : 0), function() {
				$('#assocProduct_'+lastid).html('');
				var oldcomp = Ext.getCmp('editformprod_'+lastid);
				if (oldcomp) oldcomp.destroy();
				list.setLastTapped(null);
			});
		}

    	modelInst = new model(prodinfo);
    	modelInst.raw = prodinfo;

    	list.getStore().add(modelInst);
    	// calcolo totali
    	list.calcGrandTotal();
    	// apro il prodotto
    	list.select(modelInst);
    	list.onItemTap2(list, modelInst.get('xindex'), null, modelInst, 0);
    	recview.productsChanged = true;
    },

    // ---------------- CALCOLI --------------

    // TODO: split according to user separators
    // format: 0 = native float format, 1 = user format
    splitDiscount: function(value, inFormat, outFormat) {
    	var list = [];

    	if (value[0] != '+' && value[0] != '-') value = '+' + value;
    	var values = Ext.Array.clean(value.split(/([-+])/)),
    		len = values.length / 2;

    	for (var i=0; i<len; ++i) {
    		var sign = (values[i*2] == '-' ? -1 : +1),
    			amount = values[i*2+1];
    		// inFormat not supported, always have a float format
    		/*if (inFormat === 1) {

    		} else {

    		}*/
    		var floatAmount = sign * parseFloat(amount);
    		list.push(floatAmount);
    	}

    	return list;
    },

    joinDiscount: function(values, inFormat, outFormat) {
    	var output = '';

    	if (values && values.length > 0) {
    		for (var i=0; i<values.length; ++i) {
    			// TODO: formats not supported
    			var sign = (i == 0 ? '' : (values[i] > 0 ? '+' : '-'));
    			output += sign + values[i].toString();
    		}
    	}
    	return output;
    },

    convertMultiDiscount: function(format) {
    	// TODO
    },

    // aggiorna il totale di un singolo prodotto
    /**
     * Do the calculations for the selected product row
     */
    calcProductRow: function(self, newval, oldval, opts) {
    	var list = this,
    		fieldstruct = list.getFieldStruct(),
    		records = list.getSelection(),
    		storeRecord = records[0],
    		productid = storeRecord.get('crmid'),
    		itemid = storeRecord.get('lineItemId'),
    		prodform = Ext.getCmp('editformprod_'+itemid),
    		formvalues = prodform.getValues(),
    		prodTotal = 0.0;

    	if (list.calculating) return;
    	list.calculating = true;

    	prodTotal = toFloat(formvalues.listPrice) * toFloat(formvalues.qty);
    	storeRecord.raw.listPrice = formvalues.listPrice;
    	storeRecord.raw.qty = formvalues.qty;

    	// imposto il primo totale
    	prodform.down('[name=productTotal]').setValue(prodTotal.toFixed(2));
    	storeRecord.raw.productTotal = prodTotal;

    	// sconti
    	var discount_amount = toFloat(formvalues.discount_amount);
    	storeRecord.raw.discount_amount = storeRecord.raw.discount_percentage = formvalues.discount_amount;
    	storeRecord.raw.discount_type = formvalues.discount_type;
    	switch (formvalues.discount_type) {
    		case 'percentage':
    	    	var discList = list.splitDiscount(formvalues.discount_amount);
    	    	for (var i=0; i<discList.length; ++i) {
    	    		prodTotal -= prodTotal * discList[i] / 100.0;
    	    	}
    			break;
    		case 'amount':
    			prodTotal -= discount_amount;
    			break;
    		default:
    			break;
    	}


    	// imposto il totale dopo lo sconto
    	prodform.down('[name=totalAfterDiscount]').setValue(prodTotal.toFixed(2));
    	storeRecord.raw.totalAfterDiscount = prodTotal;

    	var tax_type = 'individual'; // TODO: prendere dai totals

    	// tasse
    	switch (tax_type) {
    		case 'individual':
    			// TODO: usare i nomi effettivi
    			var total_tax_percent = 0.0,
    				taxname;
    			for (var i=1; i<10; ++i) {
    				taxname = 'tax'+i;
    				if (formvalues[taxname] === undefined) continue;
    				total_tax_percent += toFloat(formvalues[taxname]);
    				// sync store
    				if (storeRecord.raw.taxes) {
    					for (var j=0; j<storeRecord.raw.taxes.length; ++j) {
    						var taxobj = storeRecord.raw.taxes[j];
    						if (taxobj.taxname == taxname) {
    							storeRecord.raw.taxes[j].percentage = formvalues[taxname];
    							break;
    						}
    					}
    				}
    			}
    			var total_tax = prodTotal * total_tax_percent / 100.0;
    			// imposto il valore delle tasse
    			prodform.down('[name=taxTotal]').setValue(total_tax.toFixed(2));
    			storeRecord.raw['taxTotal'] = total_tax;
    			// ricalcolo totale
    			prodTotal += total_tax;
    			break;
    		case 'group':
    		default:
    			break;
    	}

    	// imposto prezzo netto finale
    	prodform.down('[name=netPrice]').setValue(prodTotal.toFixed(2));
    	$('#assocProductTotal_'+itemid).html(prodTotal.toFixed(2));
    	storeRecord.raw.netPrice = storeRecord.raw.lineTotal = prodTotal;

    	//altri campi
    	storeRecord.raw.productDescription = formvalues.productDescription;
    	storeRecord.raw.comment = formvalues.comment;

    	list.calculating = false;
    },

    /**
     * Calculates the grand total
     */
    calcGrandTotal: function() {
    	var list = this,
    		liststore = list.getStore(),
    		totalstruct = list.getTotalStruct(),
    		totalform = list.down('#prodTotalForm'),
    		totalvalues = totalform.getValues(),
    		i, grandTotal = 0.0;

    	if (list.calculating) return;
    	list.calculating = true;

		// totale dei prodotti:
		liststore.each(function(record) {
			grandTotal += toFloat(record.raw.netPrice);
		});

		totalform.down('[name=hdnSubTotal]').setValue(grandTotal.toFixed(2));
		// TODO: store

		// TODO: tasse di gruppo

		// sconto
		var discount_val = totalvalues.discount_value;
		switch (totalvalues.discount_type_final) {
			case 'amount':
				grandTotal -= toFloat(discount_val);
				break;
			case 'percentage':
				var discList = list.splitDiscount(discount_val);
    	    	for (var i=0; i<discList.length; ++i) {
    	    		grandTotal -= grandTotal * discList[i] / 100.0;
    	    	}
				break;
		}

		//spese di spedizione
		grandTotal += toFloat(totalvalues['shipping_handling_charge']);

		//tasse spese di spedizione
		var shtaxtotal = 0.0,
			shtax_total_percent = 0.0;
		for (i=1; i<10; ++i) {
			var shtaxname = 'shtax'+i;
			if (totalvalues[shtaxname] === undefined) continue;
			shtax_total_percent += toFloat(totalvalues[shtaxname]);
		}
		shtaxtotal = toFloat(totalvalues['shipping_handling_charge']) * shtax_total_percent / 100.0;
		grandTotal += shtaxtotal;
		totalform.down('[name=shtax_totalamount]').setValue(shtaxtotal.toFixed(2));

		// arrotondamenti
		var mult = +1;
		if (totalvalues.adjustmentType == '-') {
			mult = -1;
		}

		grandTotal += mult*toFloat(totalvalues.adjustment);

		totalform.down('[name=grandTotal]').setValue(grandTotal.toFixed(2));
		list.setTotalField(grandTotal);
		list.calculating = false;
    },

    /**
     * Prepares the object with the product informations to be sent to the server and saved
     */
    getProductsData: function() {
    	var me = this,
    		liststore = me.getStore(),
    		fieldstruct = me.getFieldStruct(),
    		totalstruct = me.getTotalStruct(),
    		totalform = me.down('#prodTotalForm'),
    		totalvalues = totalform.getValues(),
    		shtaxinfo, totalprods, i,j;

    	// TOTALI
    	totalvalues.taxtype = 'individual'; // TODO : il caso group
    	if (totalvalues['discount_type_final'] == 'amount') {
    		totalvalues['discount_amount_final'] = totalvalues['discount_value'];
    		totalvalues['discount_percentage_final'] = 0;
    	} else {
    		totalvalues['discount_amount_final'] = 0
    		totalvalues['discount_percentage_final'] = totalvalues['discount_value'];
    	}

    	//tasse di spedizione
    	shtaxinfo = [];
    	for (i=1; i<10; ++i) {
    		var taxname = 'shtax'+i;
    		if (totalvalues[taxname] === undefined) continue;
    		shtaxinfo.push({
    			'taxname': taxname,
    			'percentage': totalvalues[taxname],
    		});
    		delete totalvalues[taxname];
    	}
    	if (shtaxinfo.length > 0) totalvalues['sh_taxes'] = shtaxinfo;

    	if (totalvalues['adjustmentType'] == '-')
    		totalvalues['adjustment'] = -toFloat(totalvalues['adjustment']);

    	// PRODOTTI
    	totalprods = [];
    	liststore.each(function(record) {
    		totalprods.push(record.raw);
		});

    	var formdata = {
    		'products' : totalprods,
    		'final_details' : totalvalues,
    	}
    	return formdata;
    }


});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

// TODO: unificare con lista standard
/**
 * List of records with optional search box. This list will be merged with the Vtecrm.view.ListRecords list.
 */
Ext.define('Vtecrm.view.ListSearch', {
	extend: 'Ext.List',

    //alias: "view.ListSearch",

    config: {

    	/**
    	 *
    	 */
    	itemId: 'listSearch',

    	/**
    	 *
    	 */
    	itemTpl: '{entityname} {extrafields.description}', // segnalibro qua inserisco {description} per le pratiche

    	/**
    	 *
    	 */
    	flex: 1,

    	/**
    	 * @hide
    	 */
    	width: '100%',

    	/**
    	 * @hide
    	 */
    	height: '100%',

    	/**
    	 * @hide
    	 */
    	fullscreen: true,

    	/**
    	 * @hide
    	 */
    	scrollable: true,

    	/**
    	 *
    	 */
    	loadingText: LANG.loading,

    	/**
    	 * @hide
    	 */
    	deferEmptyText: true,

    	/**
    	 *
    	 */
    	emptyText: '<p align="center">'+LANG.no_records+'</p>',

    	// il nome del semaphoro per la fine del caricamento
    	/**
    	 * @hide
    	 */
    	loadSemaphore: null,

    	/**
    	 * The module
    	 */
    	module: undefined,

    	/**
    	 *
    	 */
    	searchString: '',

    	/**
    	 * The field used to sort
    	 */
    	sortField: '',

    	/**
    	 * The sort order
    	 */
    	sortOrder: '',

    	/**
    	 * @cfg {String[]} extraFields Array of fieldnames that should be also retrieved
    	 */
    	extraFields: [], // campi aggiuntivi da restituire (array di fieldname)

    	/**
    	 * Id of the filter
    	 */
    	viewid: 0,

    	/**
    	 * Id of the folder
    	 */
    	folderid: 0,

    	/**
    	 * Timeout for the request, in ms.
    	 */
    	ajaxTimeout: 30000,

    	/**
    	 * @private
    	 */
    	extraAjaxParams: {},

    	/**
    	 * @private
    	 */
    	pageSize: null,

    	/**
    	 * @private
    	 */
    	toolbar: false, // pass true to use a standard toolbar, a config object to create a new one or an instance to an existing one

    	/**
    	 * If true, draws a "back" button in the toolbar
    	 */
    	useBackButton: true, // draw a back button in the toolbar

    	/**
    	 * IF true, draws a search box in the toolbar
    	 */
    	useSearch: false, // show search field

    	/**
    	 * @hide
    	 */
    	store: {
    		//xclass: 'Vtecrm.store.VteOnlineOffline',
    		model: 'Vtecrm.model.VteFavourite',
			autoLoad: false,
			clearOnPageLoad: false,
			/*offline: false,
			onlineProxy: {
				type: "ajax",
	    		url: vtwsUrl + "ws.php?wsname=GetList",
           	    extraParams: params_unserialize(vtwsOpts),
       			reader: 'json',
       			actionMethods: {read: 'POST'},
			},
			offlineProxy: {
				type: 'WebSQL',
				table: 'crmentity'
			},*/

			listeners: {

				beforeload: function(self) {
					var list = self.listObject,
						module = list.getModule(),
						cvid = list.getViewid(),
						folderid = list.getFolderid(),
						fconfig = Vtecrm.app.getFilterSettings(module, cvid),
						foconfig = Vtecrm.app.getFolderSettings(module, folderid),
						extrafields = (fconfig && fconfig.extrafields ? fconfig.extrafields : (foconfig && foconfig.extrafields ? foconfig.extrafields : []));

					if (extrafields && extrafields.length > 0) {
						extrafields = array_getfield(extrafields, 'name');
					}
					extrafields = Ext.Array.merge(extrafields, list.getExtraFields());

        			self.setPageSize(list.getPageSize() || CONFIG.list_page_limit);
        			self.setProxy({
        			    type: 'ajax',
        			    url: vtwsUrl + "ws.php?wsname=GetList",
        			    timeout: list.getAjaxTimeout(),
                   	    extraParams: Ext.Object.merge(params_unserialize(vtwsOpts), {
                   	    	'module': module,
                   	    	'viewid': cvid,
                   	    	"folderid": folderid,
                   	    	"search": list.getSearchString(),
                   	    	'sfield': list.getSortField(),
                   	    	'sorder': list.getSortOrder(),
                   	    	'extrafields': Ext.encode(extrafields)
                   	    }, list.getExtraAjaxParams()),
               			actionMethods: {read: 'POST'},
        			    reader: {
                			type: 'json',
                			rootProperty: "entries",
                		    totalProperty: "total",
                		},
                		listeners: {
                			// json decoding error
                			exception: function(reader,response,error,opts) {
           						Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
           						unMaskView();
           						return false;
           					},
                		}
        			});
        			maskView();
        			//list.setIsBusy(true);
				},

				load: function(store, records) {
					//segnalibro filtro le pratiche in base all azienda selezionata
					var module = this.listObject.getModule();
					if (module == 'Dossier') {
						store.filterBy(function(record){
							if (record.raw.extrafields.accountid.trim() == globalAccountSelected.trim())
								return record;
						});
					}
					
					var list = this.listObject;
					
					/*if (list && list.getLoadSemaphore()) {
						var sem = findSemaphore(list.getLoadSemaphore());

						if (sem) {
							sem.go();
						} else {
							console.log('ERROR: Semaphore not found');
						}
					}*/
					unMaskView();
				}
			}

    	},

    	/**
    	 * @hide
    	 */
    	plugins: [
    	    {
    	    	xclass: 'Ext.plugin.ListPaging',
    	        ptype: 'listpaging',
    	        autoPaging: true,
    	        loadMoreText: LANG.loading,
    	        noMoreRecordsText: ''
    		 },
    	    /*{
    	    	xclass: 'Ext.plugin.PullRefresh',
    	    	pullRefreshText: 'Pull down for more new Tweets!'
			}*/
    	],

    	/**
    	 * @hide
    	 */
    	listeners: {
    		itemtap: function(self, index, target, record, e) {
    			if (!self.getItemId().match(/^listSearch/)) return; // stupid fix
    			Vtecrm.app.showRecord(this.getModule(), record.get('crmid'), record.get('entityname'));
    		},

    	},

    },

    toolbarConfig: {
   		xtype: 'titlebar',
   		docked: 'top',
   		ui: 'light',
		style: { // segnalibro style
			'background-color': '#f80'
		}
    },

    constructor: function() {
    	this.callParent(arguments);

    	// trick to save the list instance in the store
    	this.getStore().listObject = this;
    	if (this.getPageSize() > 0) {
    		this.getStore().setPageSize(this.getPageSize());
    	}
    },

    applyToolbar: function(toolbar, oldToolbar) {
    	var me = this,
    		add = false;
    	if (toolbar === true) {
    		toolbar = me.toolbarConfig;
    		add = true;
    	}
    	oldToolbar = Ext.factory(toolbar, 'Ext.TitleBar', oldToolbar);
    	if (add && oldToolbar && oldToolbar.getParent() != me) {
    		me.add(oldToolbar);
    	}
    	return oldToolbar;
    },

    updateToolbar: function(ptoolbar) {
    	var me = this;
    	me.toolbar = ptoolbar;
    	if (me.toolbar) {
    		//re-set buttons
    		me.setUseBackButton(me.getUseBackButton());
    		me.setUseSearch(me.getUseSearch());
    	} else {
    		// remove buttons
    		me.setUseBackButton(false);
    		me.setUseSearch(false);
    	}
    },

    updateUseBackButton: function(status) {
    	var me = this;

    	// create the button always
    	if (!me.backbutton) {
    		me.backbutton = Ext.create('Ext.Button', {
    			xtype: 'button',
    			//ui: 'back',
    			iconMask: true,
    			iconCls: 'arrow_left',
    			//text: LANG.back,
    			align: 'left',
				style: { // segnalibro style
					'background-color': '#00ba00'
				},
    			handler: function() {
    				//imposto il no-reload
    				var prev = Vtecrm.app.historyGetPrevious();
    				if (prev && prev.getItemId && prev.getItemId() == 'viewShowRecord') {
    					prev.setReloadOnShow(false);
    				}
    				Vtecrm.app.historyBack();
    			}
    		});
    	}

    	// add or remove from toolbar
    	if (me.toolbar) {
    		if (status) {
    			me.toolbar.add(me.backbutton);
    		} else {
    			me.toolbar.remove(me.backbutton, false);
    		}
    	}
    },

    updateUseSearch: function(status) {
    	var me = this;

    	if (!me.searchfield) {
    		me.searchfield = Ext.create('Ext.field.Search', {
				xtype: 'searchfield',
				itemId: "searchField",
				align: 'right',
            	width: Math.min(300, screen.width / 4),
            	clearIcon: true,
            	autoCapitalize: false,
            	listeners: {
            		change: function(self, newval, oldval) {
            			me.goSearch(oldval, newval);
            		}
            	}
			});
    	}

    	if (me.toolbar) {
    		if (status) {
    			me.toolbar.add(me.searchfield);
    		} else {
    			me.toolbar.remove(me.searchfield, false);
    		}
    	}
    },

    // tried updateHidden, but not working!! :o
    setHidden: function(hidden) {
    	var me = this;

    	if (me.searchfield) {
    		me.searchfield[hidden ? 'hide' : 'show']();
    	}

    	if (me.backbutton) {
    		me.backbutton[hidden ? 'hide' : 'show']();
    	}

    	return me.callParent(arguments);
    },

    destroy: function() {
    	var me = this;

    	// clean the objects
    	if (me.backbutton) {
    		me.backbutton.destroy();
    		me.backbutton = null;
    	}

    	if (me.searchfield) {
    		me.searchfield.destroy();
    		me.searchfield = null;
    	}

    	return me.callParent();
    },

    /**
     * Starts the research
     */
    goSearch: function(oldval, newval) {
    	var me = this;
    	me.setSearchString(newval);
    	me.getStore().removeAll();
    	me.getStore().loadPage(1);
    }


});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

// TODO: unificare con lista standard
/**
 * Listview which uses filters and search box.
 * This component will be probably merged with the Vtecrm.view.ListRecords List.
 */
Ext.define('Vtecrm.view.ListFilterSearch', {
	extend: 'Vtecrm.view.ListSearch',

	config: {

		/**
		 * @cfg {"filter"/"folder"} [type='filter'] The type of the list.
		 */
		type: 'filter',		// 'filter' or 'folder'

		/**
		 * @private
		 */
		filterInfo: null,

		/**
		 * @private
		 */
		folderInfo: null,

		/**
		 * @hide
		 */
		items: [
		    {
		    	xtype: 'container',
		    	ui: 'light',
		    	layout: {
		    		type: 'hbox',
		    		align: 'start',
		    		pack: 'center'
		    	},
		    	height: '40px',
		    	//docked: 'top'

		    	items: [
		    	    {
		    	    	xtype: 'label',
		    	    	itemId: 'filterLabel',
		    	    	styleHtmlContent: true,
		    	    	styleHtmlCls: 'filter-title-cont',
		    	    	centered: true,
		    	    	html: '',
		    	    },
		    	    {
		    	    	xtype: 'spacer',
		    	    },
		    	    {
		    	    	xtype: 'button',
		    	    	itemId: 'filterBtnSettings',
		    	    	ui: 'action',
		    	    	cls: 'filter-button',
		    	    	margin: '2px',

		    	    	//flex: 2,
		    	    	iconMask: true,
		    	    	iconCls: 'folder_settings',
		    	    	align: 'right',
		    	    },

		    	]
		    }
		],

		/**
		 * @hide
		 */
		listeners: {
			// fires on first show only
			activate: function(self) {
				var module = self.getModule(),
					type = self.getType(),
					finfo = Vtecrm.app.getRecentFilter(module),
					foinfo = Vtecrm.app.getRecentFolder(module);

				if (type == 'filter' && finfo) self.setFilterInfo(finfo);
				if (type == 'folder' && foinfo) self.setFolderInfo(foinfo);
			}
		},

		/**
		 * @hide
		 */
		control: {
    		'#filterBtnSettings': {
    			tap: function(self) {
    				var me = this,
    					type = me.getType(),
    					finfo = me.getFilterInfo(),
    					foinfo = me.getFolderInfo();

    				filterConfig = Ext.create('Vtecrm.view.FilterConfig', {
    					module: me.getModule(),
    					filterList: me,
    					filterInfo: (type == 'filter' ? finfo : foinfo),
    					'type': type,
    				});

    				var floatpan = Ext.create('Ext.Panel', {
    					modal: true,
    					centered: true,
    					hideOnMaskTap: true,
    					layout: 'fit',
    					width: '90%',
    					height: '95%',
    					items: [filterConfig],
    					listeners: {
    						hide: function(selfpan) {
    							filterConfig.destroy();
    							selfpan.destroy();
    						}
    					}
    				});

    				if (CONFIG.enable_animations) {
    					floatpan.setShowAnimation({
    						type: 'fade',
    						duration: 200,
    					});
    				}

    				floatpan.showBy(self);

    			}
    		}
		}
	},

	/**
	 * @hide
	 */
	applyFilterInfo: function(finfo) {
		var me = this,
			module = me.getModule(),
			fconfig = (finfo ? Vtecrm.app.getFilterSettings(module, finfo.cvid) : {});

		me._filterInfo = finfo;
		if (finfo && finfo.viewname) {
			var flabel = me.down('#filterLabel');
			if (flabel) {
				var efielddesc = '';
				if (fconfig && fconfig.extrafields && fconfig.extrafields.length > 0) {
					efielddesc = '('+array_getfield(fconfig.extrafields, 'label').join(', ')+')';
				}
				flabel.setHtml('<span class="filter-title-name">'+finfo.viewname+'</span><br/><span class="filter-title-fields">'+efielddesc+'</span>');
			}
		}

		if (finfo && finfo.cvid) {
			me.setViewid(finfo.cvid);
			// set recent filter
			Vtecrm.app.setRecentFilter(me.getModule(), finfo);
			// remove class from old selected filter
			$('div.x-grid-label-selected').removeClass('x-grid-label-selected');
			$('#filter_label_'+module+'_'+finfo.cvid).addClass('x-grid-label-selected');
		}
		if (finfo && finfo.sortfield) me.setSortField(finfo.sortfield);
		if (finfo && finfo.sortorder) me.setSortOrder(finfo.sortorder);
	},

	// todo: unifica con sopra
	/**
	 * @hide
	 */
	applyFolderInfo: function(foinfo) {
		var me = this,
			module = me.getModule(),
			fconfig = (foinfo ? Vtecrm.app.getFolderSettings(module, foinfo.folderid) : null);

		me._folderInfo = foinfo;
		if (foinfo && foinfo.foldername) {
			var flabel = me.down('#filterLabel');
			if (flabel) {
				var efielddesc = '';
				if (fconfig && fconfig.extrafields && fconfig.extrafields.length > 0) {
					efielddesc = '('+array_getfield(fconfig.extrafields, 'label').join(', ')+')';
				}
				flabel.setHtml('<div class="folder_black inline-icon" style="display:inline-block;width:1.2em;height:1.2em;-webkit-mask-size:1.2em;vertical-align:bottom;margin-top:4px"></div> <span class="filter-title-name">'+foinfo.foldername+'</span><br/><span class="filter-title-fields">'+efielddesc+'</span>');
			}
		}

		if (foinfo && foinfo.folderid) {
			me.setFolderid(foinfo.folderid);
			Vtecrm.app.setRecentFolder(me.getModule(), foinfo);
			$('div.x-grid-label-selected').removeClass('x-grid-label-selected');
			$('#filter_label_'+module+'_'+foinfo.folderid).addClass('x-grid-label-selected');
		}
		if (foinfo && foinfo.sortfield) me.setSortField(foinfo.sortfield);
		if (foinfo && foinfo.sortorder) me.setSortOrder(foinfo.sortorder);
	},

	/**
	 * Creates the template for the line
	 */
	getItemTpl: function() {
		var me = this,
			module = me.getModule(),
			cvid = me.getViewid(),
			folderid = me.getFolderid(),
			fconfig = Vtecrm.app.getFilterSettings(module, cvid),
			foconfig = Vtecrm.app.getFolderSettings(module, folderid),
			secondline = '';

		if (!fconfig && folderid) fconfig = foconfig;

		if (fconfig && fconfig.extrafields && fconfig.extrafields.length > 0) {
			secondline = '<div class="list-extra-fields">';
			for (var i=0; i<fconfig.extrafields.length; ++i) {
				var name = fconfig.extrafields[i].name;
				secondline += '{extrafields.'+name+'}';
				if (i < fconfig.extrafields.length-1) secondline += ', ';
			}
			secondline += '</div>';
		}

		var tpl = new Ext.XTemplate(
			'{entityname}',
			secondline
    	);
		return tpl;
    },

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/


// models:
/**
 * A pdf template
 */
Ext.define("Vtecrm.model.PdfTemplate", {
    extend: "Ext.data.Model",
    config: {
        fields: [
            {name: 'templateid', type: 'int'},
            {name: 'templatename', type: 'string'},
        ]
    }
});

/**
 * An email recipient
 */
Ext.define("Vtecrm.model.EmailRecipient", {
    extend: "Ext.data.Model",
    config: {
        fields: [
            {name: 'crmid', type: 'int'},
            {name: 'module', type: 'string'},
            {name: 'entityname', type: 'string'},
            {name: 'email', type: 'string'},
        ]
    }
});

/**
 * List with PDF Templates
 */
Ext.define('Vtecrm.view.ListPdfMaker', {
	extend: 'Ext.carousel.Carousel',

    alias: "view.ListPdfMaker",

    config: {

    	/**
    	 *
    	 */
    	itemId: 'listPdfMaker',

    	/**
    	 *
    	 */
    	styleHtmlContent: true,

    	/**
    	 *
    	 */
    	styleHtmlCls: 'listPdfMaker',

    	/**
    	 *
    	 */
    	layout: 'card',
    	flex: (screen.width > 800 ? 4 : 3),
    	scrollable: false,
    	draggable: false,
    	hidden: true,
    	indicator: false,


    	/**
    	 * if True, this component is inside a popup
    	 */
    	isPopup: false,

    	/**
    	 * If true, use the parent component's toolbar to display buttons
    	 */
    	useParentToolbar: false,

    	/**
    	 * The module
    	 */
    	module: null,

    	/**
    	 * The crmid of the record where I opened this list
    	 */
    	crmid: null, // id del record in cui sono

    	/**
    	 * The toolbar object
    	 */
    	toolbar: null,

    	/**
    	 * @private
    	 */
    	pdfInfo: null,

    	/**
    	 * @hide
    	 */
    	items: [
    	    // lista template
			{
				itemId: 'listTemplates',
				xtype: 'list',
				//hidden: true,
				ui: 'round',
				itemTpl: '{templatename}',
				scrollable: 'vertical',
				store: {
					autoLoad: false,
					model: 'Vtecrm.model.PdfTemplate',
				},
				loadingText: false,
				emptyText: '<p align="center">'+LANG.no_templates+'</p>',
				deferEmptyText: true,
				items: [
				    {
				    	xtype: 'label',
				    	docked: 'top',
				    	padding: '10px',
				    	style: 'text-align:center;font-weight:700',
				    	html: LANG.choose_template,
				    }
				]
			},
			// pulsanti di scelta
			{
				itemId: 'pdfChooseAction',
				xtype: 'container',
				layout: {
					type: 'vbox',
					pack: 'center',
					align: 'middle',
				},
				hidden: false,
				//centered: true,
				defaults: {
					width: '250px',
					margin: '10px',
					padding: '10px',
				},
				items: [
				    {
				    	xtype: 'label',
				    	html: LANG.choose_pdf_export,
				    	style: 'text-align:center;font-weight:700',
				    },
				    {
				    	itemId: 'btnSaveDoc',
				    	xtype: 'button',
				    	text: LANG.pdfmaker_savedoc,
				    	ui: 'action',
				    },
				    {
				    	itemId: 'btnSendEmail',
				    	xtype: 'button',
				    	text: LANG.pdfmaker_sendemail,
				    	ui: 'action',
				    },
				]
			},
			// form per documento
			{

				itemId: 'formDocs',
				xtype: 'formpanel',
				layout: 'vbox',
				scrollable: 'vertical',
				items: [
				    {
				    	itemId: 'formDocsCont',
				    	xtype: 'fieldset',
				    	verticalLayout: true,
				    }
				],

			},
    	    // form scelta destinatari
    	    {
    	    	itemId: 'listRecipients',
    	    	xtype: 'list',
    	    	//hidden: true,
    	    	mode: 'MULTI',
    	    	ui: 'round',
    	    	itemTpl: '{entityname} &lt;{email}&gt;',
    	    	scrollable: 'vertical',
    	    	store: {
    	    		autoLoad: false,
    	    		model: 'Vtecrm.model.EmailRecipient',
    	    		proxy: {
    	        		type: "ajax",
    	        		url: vtwsUrl + "ws.php?wsname=PDFMaker&subaction=listrecipients",
    	       			actionMethods: {read: 'POST'},
    	        		reader: {
    	        			type: 'json',
    	        			rootProperty: "entries",
    	        		    totalProperty: "total"
    	        		},
    	        		listeners: {
                			// json decoding error
                			exception: function(reader,response,error,opts) {
           						Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
           						unMaskView();
           						return false;
           					},
                		}
    	        	},
    	        	listeners: {
    	        		beforeload: function(self) {
    	        			var list = self.listObject,
    	        				proxy = self.getProxy();
    	        			maskView();
    	        			proxy.setExtraParams(params_unserialize(vtwsOpts+"module="+list.getModule()+"&record="+list.getCrmid()));
    	        		},
    	        		load: function(self, records) {
    	        			var list = self.listObject,
    	        				toolbar = list.getToolbar(),
    	        				btnNext = toolbar.down('#pdfMakerBtnNext');

    	        			if (records && records.length == 0) {
    	        				btnNext.hide();
    	        			}
    	        			unMaskView();
    	        		}
    	        	}
    	    	},
    	    	loadingText: false,
        		emptyText: '<p align="center">'+LANG.no_recipients+'</p>',
        		deferEmptyText: true,
        		items: [
            	    {
            	    	xtype: 'label',
            	    	docked: 'top',
            	    	padding: '10px',
            	    	style: 'text-align:center;font-weight:700',
            	    	html: LANG.choose_recipients,
            	    },
            	]
    	    },
    	    // form "email"
    	    {
    	    	itemId: 'emailForm',
    	    	xtype: 'formpanel',
    	    	layout: 'vbox',
    	    	scrollable: 'vertical',
    	    	items: [
    			    {
    			    	itemId: 'formEmailCont',
    			    	xtype: 'fieldset',
    			    	verticalLayout: CONFIG.vertical_layout,
    			    	defaults: {
    			    		verticalLayout: CONFIG.vertical_layout,
    			    	},
    			    	items: [
    			    	    {
    			    	    	label: LANG.subject,
    			    	    	xtype: 'textfield',
    			    	    	name: 'subject',
    			    	    },
    			    	    {
    			    	    	label: LANG.message,
    			    	    	xtype: 'textareafield',
    			    	    	name: 'message',
    			    	    }
    			    	]
    			    }
    			],
    	    },
    	],

    	/**
    	 * @hide
    	 */
    	listeners: {

    		initialize: function(self) {
    			listRecipients = self.down('#listRecipients');
    			listRecipients.getStore().listObject = self;
    		},

    		hide: function(self) {
    			var me = self,
    				tbar = me.getToolbar(),
    				btns = ['pdfMakerBtnNext', 'pdfMakerBtnPrev', 'pdfMakerBtnSave', 'pdfMakerBtnSend'];

    			if (tbar) {
    				for (var i=0; i<btns.length; ++i) {
    					var b = tbar.down('#'+btns[i]);
    					if (b) b.hide();
    				}
    			}
    		},

    		show: function(self) {
    			var me = self,
    				data = me.getPdfInfo(),
    				btnDocs = me.down('#btnSaveDocs'),
    				btnEmail = me.down('#btnSendEmail'),
    				listTemplates = me.down('#listTemplates'),
    				listRecipients = me.down('#listRecipients'),
    				recStore = listRecipients.getStore();

    			// show first page when activated
    			me.setActiveItem(0);

    			if (listTemplates && data) {
    				listTemplates.getStore().setData(data.templates);
    			}
    			if (listRecipients && data) {
    				recStore.removeAll();
    			}

    			// hide buttons
    			if (data && (data.templates.length == 0 || data.actions.indexOf('sendemail') < 0)) {
    				btnEmail.hide();
    			}

    			if (data && data.actions && data.actions.indexOf('savedoc') < 0) {
    				btnDocs.hide();
    			}
    		},

    		activeitemchange: function(self, value, oldValue) {
    			var me = self,
    				itemId = value.getItemId(),
    				toolbar = me.getToolbar(),
    				listRecipients = me.down('#listRecipients'),
    				recStore = listRecipients.getStore();

    			if (!toolbar) return;
    			var	btnBack = toolbar.down('#pdfMakerBtnPrev'),
    				btnNext = toolbar.down('#pdfMakerBtnNext'),
    				btnSave = toolbar.down('#pdfMakerBtnSave'),
    				btnSend = toolbar.down('#pdfMakerBtnSend');

    			if (itemId == 'listTemplates') {
    				if (btnBack) btnBack.hide();
    			} else if (itemId == 'listRecipients') {
    				recStore.removeAll();
    				recStore.load()
    				if (btnNext) btnNext.show();
    			} else {
    				if (btnNext) btnNext.hide();
    			}

    			if (itemId == 'emailForm') {
    				if (btnSend) btnSend.show();
    				if (btnSave) btnSave.hide();
    			} else if (itemId == 'formDocs') {
    				if (btnSave) btnSave.show();
    				if (btnSend) btnSend.hide();
    			} else {
    				if (btnSave) btnSave.hide();
    				if (btnSend) btnSend.hide();
    			}
    		},

    		fieldloaded: function(self) {
    			self.createDocumentForm();
    		}
    	},

    	/**
    	 * @hide
    	 */
    	control: {
    		'#btnSaveDoc': {
    			tap: function(self) {
    				var me = this,
    					formDocs = me.down('#formDocs');
    				me.setActiveItem(formDocs);
    				//me.animateActiveItem(formDocs, {duration: 250, type:'slide', direction:'left', easing: {type: 'ease-out'}});
    				me.loadDocumentsBlocks();
    			}
    		},

    		'#btnSendEmail': {
    			tap: function(self) {
    				var me = this,
    					listTemplates = me.down('#listTemplates'),
    					listRecipients = me.down('#listRecipients');
    				me.setActiveItem(listRecipients);
    			}
    		},

    		'#listTemplates': {
    			select: function() {
    				var me = this,
    					btnBack = me.getToolbar().down('#pdfMakerBtnPrev'),
    					btnNext = me.getToolbar().down('#pdfMakerBtnNext');
            		me.next();
            		btnBack.show();
    			}
    		},

    		'#listRecipients': {
    			select: function(self) {
    				var me = this,
    					btnNext = me.getToolbar().down('#pdfMakerBtnNext');

    				if (self.getStore() && self.getStore().getData().length == 1) {
    					me.onNextButton(btnNext);
    				}
    			}
    		},

    	}
    },


    constructor: function() {
    	this.callParent(arguments);
    	this.toggleSwipe(false);

    	this.createButtons();
    },

    /**
     * Enables or disables the swipe effect
     */
    toggleSwipe : function(allow) {
        this.element[allow ? 'on' : 'un']({
            dragstart : 'onDragStart',
            drag      : 'onDrag',
            dragend   : 'onDragEnd',
            scope     : this
        });
    },

    /**
     * Loads the block of fields to create documents
     */
    loadDocumentsBlocks: function() {
    	var me = this,
    		st3 = Ext.getStore('storeVteBlocks');

    	st3.goOffline();
    	st3.setModule('Documents');
    	st3.load(function(records, operation, succ) {
    		if (!CONFIG.app_offline && (!records || records.length == 0)) {
    			// provo a caricare online
    			maskView();
    			st3.goOnline();
    			st3.load(function(records, operation, succ) {
    				if (!records || records.length == 0) k('ERROR: no blocks returned');
    				st3.goOffline();
    				unMaskView();
    				me.fireEvent('fieldloaded', me);
    			});
    		} else {
    			me.fireEvent('fieldloaded', me);
    		}
    	});
    },

    /**
     * Creates the form to save the document
     */
    createDocumentForm: function() {
    	var me = this,
    		formDocsMain = me.down('#formDocs'),
    		formDocs = me.down('#formDocsCont'),
    		st3 = Ext.getStore('storeVteBlocks'),
    		formFields = ['notes_title', 'folderid', 'notecontent'],
    		useFields = [];

    	// check if form already exists:
    	if (!empty(formDocs.getTitle())) {
    		// reset doesn't work ??
    		//formDocsMain.reset();
    		return true;
    	}

    	// search matching fields
    	st3.each(function(db) {
    		if (db.get('module') == 'Documents' && db.get('type') == 'BLOCK') {
    			var fields;
    			try {
    				fields = Ext.decode(db.get('fields'));
    				if (fields.length > 0) {
    					for (var i=0; i<fields.length; ++i) {
    						if (formFields.indexOf(fields[i].name) > -1) useFields.push(fields[i]);
    					};
    				}
    			} catch (e) {
    				// nothing
    			}
    		}
    	});

    	// titolo
    	formDocs.setTitle(LANG.informations+" "+Vtecrm.app.translateString('SINGLE_Documents'));

		// creo i campi
		for (var j=0; j<useFields.length; ++j) {
			var fieldname = useFields[j].name,
				fieldvalue = '',
				fieldinfo = createFieldConfig('Documents', useFields[j], null, fieldvalue);

			var fieldcmp = Ext.create(fieldinfo[0], fieldinfo[1]);
			// salvo per ogni campo la propria struttura
			fieldcmp.struct = useFields[j];
			formDocs.add([fieldcmp]);
		}

    },

    /**
     * @protected
     * Creates the buttons in the toolbar
     */
    createButtons: function() {
    	var toolbar = this.getToolbar(),
    		btn1 = (toolbar ? toolbar.down('#pdfMakerBtnNext') : null),
    		btn2 = (toolbar ? toolbar.down('#pdfMakerBtnPrev') : null),
    		btn3 = (toolbar ? toolbar.down('#pdfMakerBtnSave') : null),
    		btn4 = (toolbar ? toolbar.down('#pdfMakerBtnSend') : null);

    	if (toolbar) {
   			if (btn1) {
   				btn1.hide();
   			} else {
    			btn1 = Ext.create('Ext.Button', {
    				itemId: 'pdfMakerBtnNext',
    				xtype: 'button',
	            	ui: 'forward',
	            	text: LANG.forward,
	            	align: 'right',
	            	scope: this,
	            	hidden: true,
	            	handler: this.onNextButton,
	    		});
    			toolbar.add([btn1]);
   			}
   			if (btn2) {
   				btn2.hide();
   			} else {
    			btn2 = Ext.create('Ext.Button', {
    				itemId: 'pdfMakerBtnPrev',
    				xtype: 'button',
	            	ui: 'back',
	            	text: LANG.back,
	            	align: 'left',
	            	scope: this,
	            	hidden: true,
	            	handler: this.onPrevButton,
	    		});
    			toolbar.insert(0, [btn2]); // TODO: BUG SENCHA!! aggiunge sempre alla fine
   			}
   			if (btn3) {
   				btn3.hide();
   			} else {
    			btn3 = Ext.create('Ext.Button', {
    				itemId: 'pdfMakerBtnSave',
    				xtype: 'button',
	            	text: LANG.save,
	            	align: 'right',
	            	scope: this,
	            	hidden: true,
	            	handler: this.onSaveButton,
	    		});
    			toolbar.add([btn3]);
   			}
   			if (btn4) {
   				btn4.hide();
   			} else {
    			btn4 = Ext.create('Ext.Button', {
    				itemId: 'pdfMakerBtnSend',
    				xtype: 'button',
	            	text: LANG.send,
	            	align: 'right',
	            	scope: this,
	            	hidden: true,
	            	handler: this.onSendButton,
	    		});
    			toolbar.add([btn4]);
   			}
    	}
    },

    /**
     * Called when the "back" button is pressed
     */
    onPrevButton: function(self) {
    	var me = this,
    		chooseCont = me.down('#pdfChooseAction'),
    		active = me.getActiveItem(),
    		activeId = (active ? active.getItemId() : '');

    	if (activeId == 'listRecipients') {
    		me.setActiveItem(chooseCont);
    	} else {
    		this.previous();
    	}
    },

    /**
     * Called when the "next" button is pressed
     */
    onNextButton: function(self) {
    	var me = this,
    		go = true,
    		active = me.getActiveItem(),
    		activeId = (active ? active.getItemId() : '');

    	if (activeId == 'listRecipients') {
    		// check if selected
    		if (active.getSelectionCount() == 0) {
    			Ext.Msg.alert(LANG.warning, LANG.select_one_recipient);
    			go = false;
    		}
    	}

    	if (go)	me.next();
    },

    /**
     * Called when the "save" button is pressed
     */
    onSaveButton: function(self) {
    	var me = this,
    		formDocs = me.down('#formDocs'),
    		values = formDocs.getValues(),
    		listTemplates = me.down('#listTemplates'),
    		tpls = listTemplates.getSelection();

    	// check fields
    	if (empty(values.notes_title) || values.folderid == 0) {
    		Ext.Msg.alert(LANG.warning, LANG.fill_mandatory);
    		return;
    	} else if (tpls.length == 0) {
    		Ext.Msg.alert(LANG.warning, LANG.choose_template);
    		return;
    	}
    	// now save!
    	var templateid = tpls[0].get('templateid');
    	values.templateid = templateid;
    	values.record = me.getCrmid();
    	values.module = me.getModule();
    	me.saveDocument(values);
    },

    /**
     * Called when the "send" button is pressed
     */
    onSendButton: function(self) {
    	var me = this,
			formEmail = me.down('#emailForm'),
			values = formEmail.getValues(),
			listTemplates = me.down('#listTemplates'),
			listRecipients = me.down('#listRecipients'),
			tpls = listTemplates.getSelection(),
			rcpts = listRecipients.getSelection();

    	// check fields
    	if (empty(values.subject) || empty(values.message)) {
    		Ext.Msg.alert(LANG.warning, LANG.fill_fields);
    		return;
    	} else if (tpls.length == 0) {
    		Ext.Msg.alert(LANG.warning, LANG.choose_template);
    		return;
    	} else if (rcpts.length == 0) {
    		Ext.Msg.alert(LANG.warning, LANG.select_one_recipient);
    		return;
    	}
    	// now save!
    	var templateid = tpls[0].get('templateid');
    	values.templateid = templateid;
    	values.record = me.getCrmid();
    	values.module = me.getModule();
    	values.recipients = '';
    	values.parentids = '';
    	for (var i=0; i<rcpts.length; ++i) {
    		values.recipients += rcpts[i].get('email')+',';
    		values.parentids += rcpts[i].get('crmid')+'|';
    	}
    	values.parentids += me.getCrmid();
    	me.sendEmail(values);
    },

    /**
     * Sends the document to the server to save it
     */
    saveDocument: function(values) {
    	var me = this,
    		mtime =  (new Date()).getTime();

    	maskView();
		Ext.Ajax.request({
			url: vtwsUrl + 'ws.php?wsname=PDFMaker&subaction=savedoc&_dc='+mtime,
			params: vtwsOpts+Ext.Object.toQueryString(values),
			method: 'POST',
			useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
		    success: function (b) {
		    	if (empty(b.responseText)) return;

		    	try {
		    		var response = Ext.decode(b.responseText);
		    	} catch (e) {
		    		Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
		    		unMaskView();
		    		return;
		    	}
		    	unMaskView();
		    	if (response.success == true) {
		    		Ext.Msg.alert('', Vtecrm.app.translateString('SINGLE_Documents')+' '+LANG.correctly_saved, function() {
		    			me.setActiveItem(0);
		    		});
		    	} else {
		    		Ext.Msg.alert(LANG.error, response.error);
		    	}
		    },
		});
    },

    /**
     * Calls the webservice to send the email
     */
    sendEmail: function(values) {
    	var me = this,
		mtime =  (new Date()).getTime();

    	maskView(LANG.sending_email);
    	Ext.Ajax.request({
    		url: vtwsUrl + 'ws.php?wsname=PDFMaker&subaction=sendemail&_dc='+mtime,
    		params: vtwsOpts+Ext.Object.toQueryString(values),
    		method: 'POST',
    		useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
    		success: function (b) {
    			if (empty(b.responseText)) return;

    			try {
    				var response = Ext.decode(b.responseText);
    			} catch (e) {
    				Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
    				unMaskView();
    				return;
    			}
    			unMaskView();
    			if (response.success == true) {
    				Ext.Msg.alert('', LANG.email_sent, function() {
    					me.setActiveItem(0);
    				});
    			} else {
		    		Ext.Msg.alert(LANG.error, response.error);
		    	}
    		},
    	});
    },

    setUseParentToolbar: function(tf) {
    	var me = this,
    		oldtbar = me.getToolbar(),
    		parent = me.getParent(),
    		tbar;
    	if (parent && parent.getToolbar) {
    		tbar = parent.getToolbar();
    		if (tbar) {
    			var oldTitle = tbar.getTitle();
    			me.setToolbar(tbar);
    			tbar.setTitle(oldTitle);
    			me.createButtons();
    		}
    	}
    	me._useParentToolbar = tf;
    },

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * The settings page
 */
Ext.define('Vtecrm.view.Settings', {
	extend: 'Ext.Container',

	config: {
		/**
		 * @hide
		 */
		fullscreen: true,

		/**
		 * @hide
		 */
		layout: 'fit',

		/**
		 * @hide
		 */
		width: '100%',

		/**
		 * @hide
		 */
		height: '100%',

		/**
		 * @hide
		 */
		items: [
		    {
		    	xtype: 'formpanel',
		    	fullscreen: true,
		    	width: '100%',
				height: '100%',

				defaults: {
					verticalLayout: CONFIG.vertical_layout,
				},

		    	items: [
	    	        {
	    	        	xtype: 'selectfield',
	    	        	name: 'language',
	    	        	label: LANG.language,
	    	        	value: CONFIG.language,
	    	        	options: [
	    	        	    {value: 'it_it', text: LANG.italian},
	    	        	    {value: 'en_us', text: LANG.english},
	    	        	    {value: 'fromVTE', text: LANG.from_vte},
	    	        	],
	    	        	listeners: {
	    	        		initialize: function(self) {
	    	        			self.setValue(CONFIG.language);
	    	        		},
	    	        		change: function(self, newValue, oldValue, opts) {
	    	        			CONFIG.set('language', newValue);
	    	        			if (newValue != 'fromVTE') {
	    	        				language = newValue;
	    	        			} else if (!empty(CONFIG.vte_language)) {
	    	        				language = CONFIG.vte_language;
	    	        			} else {
	    	        				// error, choosen from VTE, but vte language not found
	    	        				Ext.Msg.alert(LANG.error, LANG.vte_lang_not_found);
	    	        				return;
	    	        			}
	    	        			if (ALL_LANGS) LANG = ALL_LANGS[language];
	    	        			if (typeof LANG.senchaStrings == 'function') LANG.senchaStrings();
	    	        		}
	    	        	}
	    	        },
	    	        {
	    	        	xtype: 'checkboxfield',
	    	        	name: 'animations',
	    	        	label: LANG.animations,
	    	        	checked: (CONFIG.enable_animations == 1),
	    	        	listeners: {
	    	        		initialize: function(self) {
	    	        			self.setChecked(CONFIG.enable_animations == 1);
	    	        		},
	    	        		change: function(self, newValue, oldValue) {
	    	        			CONFIG.set('enable_animations', (newValue ? 1 : 0));
	    	        		}
	    	        	}
	    	        },
	    	        {
	    	        	xtype: 'selectfield',
	    	        	name: 'notif_interval',
	    	        	label: LANG.notification_delay,
	    	        	value: (CONFIG.notification_timeout == '' ? '300000' : CONFIG.notification_timeout),
	    	        	options: [
	    	        	    {value: '0', text: LANG.never},
	    	        	    {value: '60000', text: '1 '+LANG.minute},
	    	        	    {value: '300000', text: '5 '+LANG.minutes},
	    	        	    {value: '900000', text: '15 '+LANG.minutes},
	    	        	    {value: '1800000', text: '30 '+LANG.minutes},
	    	        	    {value: '3600000', text: '1 '+LANG.hour},
	    	        	],
	    	        	listeners: {
	    	        		initialize: function(self) {
	    	        			self.setValue((CONFIG.notification_timeout == '') ? '300000' : CONFIG.notification_timeout);
	    	        		},
	    	        		change: function(self, newValue, oldValue, opts) {
	    	        			CONFIG.set('notification_timeout', newValue);
	    	        			// change intervals
	    	        			Vtecrm.app.setIntervals();
	    	        		}
	    	        	}
	    	        },
	    	        {
	    	        	xtype: 'checkboxfield',
	    	        	name: 'autoscroll_blocks',
	    	        	label: LANG.autoscroll_blocks,
	    	        	checked: (CONFIG.autoscroll_blocks == 1),
	    	        	hidden: Ext.os.is.Android,	// disabled for android, it's too slow
	    	        	listeners: {
	    	        		initialize: function(self) {
	    	        			self.setChecked(CONFIG.autoscroll_blocks == 1);
	    	        		},
	    	        		change: function(self, newValue, oldValue) {
	    	        			CONFIG.set('autoscroll_blocks', (newValue ? 1 : 0));
	    	        		}
	    	        	}
	    	        },
	    	        /*{
	    	        	itemId: 'offlineCheckbox',
	    	        	xtype: 'checkboxfield',
	    	        	name: 'offline',
	    	        	label: LANG.offline,
	    	        	checked: (CONFIG.app_offline == 1),
	    	        	listeners: {
	    	        		initialize: function(self) {
	    	        			self.setChecked(CONFIG.app_offline == 1);
	    	        		},
	    	        		change: function(self, newValue, oldValue) {
	    	        			app_offline = (newValue ? 1 : 0);
	    	        			//localStorage.setItem('app_offline', app_offline);
	    	        			if (app_offline) {
	    	        				Ext.Msg.alert(LANG.warning, LANG.confirm_offline, function() {
	    	        					Vtecrm.app.enableOffline();
	    	        				});
	    	        			} else {
	    	        				// TODO: messaggio
	    	        				Vtecrm.app.disableOffline();
	    	        			}
	    	        		}
	    	        	}
	    	        },*/

	    	        {
	    	        	xtype: 'fieldset',
	    	        	title: LANG.informations,
	    	        	verticalLayout: (document.width < 600),
	    	        	defaults: {
	    	        		verticalLayout: (document.width < 600),
	    	        	},
	    	        	items: [
	    	        	    {
	    	        	    	xtype: 'textfield',
	    	        	    	label: 'CRM',
	    	        	    	value: (vtwsUrl ? vtwsUrl.replace('modules/Touch/', '') : ''),
	    	        	    	readOnly: true,
	    	        	    	disabled: true,
	    	        	    },
	    	        	    {
	    	        	    	xtype: 'textfield',
	    	        	    	label: LANG.user,
	    	        	    	value: (vtwsOpts ? vtwsOpts.replace(/(username=)|(&password=.*)/g, '') : ''),
	    	        	    	readOnly: true,
	    	        	    	disabled: true,
	    	        	    },
	    	        	    {
	    	        	    	xtype: 'textfield',
	    	        	    	label: LANG.version,
	    	        	    	value: '1.'+app_version,
	    	        	    	readOnly: true,
	    	        	    	disabled: true,
	    	        	    }
	    	        	]
	    	        },

	    	        {
	    	        	xtype: 'button',
	    	        	text: LANG.logout,
	    	        	ui: 'action',
	    	        	docked: 'bottom',
	    	        	width: '150px',
	    	        	//margin: '2px',
	    	        	style: 'margin-top: 4px; margin-bottom: 4px; margin-left: auto; margin-right: auto;',
	    	        	handler: function() {
	    	        		if (CONFIG.app_offline) {
	    	        			Ext.Msg.confirm(LANG.alert, LANG.logout_offline, function(buttonId) {
	    	        				if (buttonId == 'yes') {
	    	        					Vtecrm.app.doLogout();
	    	        				}
	    	        			});
	    	        		} else {
	    	        			Vtecrm.app.doLogout();
	    	        		}
	    	        	}
	    	        }
	    	    ]
		    }
	    ],

	    /**
	     * @hide
	     */
	    listeners: {
	    	initialize: function(self) {
	    		// controllo disponibilità offline
	    		var offlineSet = self.down('#offlineCheckbox');
	    		/*if (CONFIG.vte_offline && !vte_offline) {
	    			offlineSet.setHidden(true);
	    		}*/
	    	}
	    }
	}


});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * An account for Messages module
 */
Ext.define("Vtecrm.model.VteMessageAccount", {
    extend: "Ext.data.Model",
    config: {
        fields: [
            {name: 'accountid', type: 'string'}, // can be "all"
            {name: 'accountname', type: 'string'},
            {name: 'group', type: 'string'},
            {name: 'type', type: 'string'},
            {name: 'unread', type: 'int'},
            {name: 'linkto_account', type: 'string'},
            {name: 'linkto_folder', type: 'string'},
        ]
    }
});

/**
 * A folder for Messages module
 */
Ext.define("Vtecrm.model.VteMessageFolder", {
    extend: "Ext.data.Model",
    config: {
        fields: [
            {name: 'foldername', type: 'string'},
            {name: 'label', type: 'string'},
            {name: 'type', type: 'string'},
            {name: 'depth', type: 'int'},
            {name: 'unread', type: 'int'},
        ]
    }
});

/**
 * The Messages view
 */
Ext.define('Vtecrm.view.Messages', {
	extend: 'Ext.Container',

	requires: [
	    'Vtecrm.view.EditableContainer',
	    'Vtecrm.field.Autocomplete',
	],

	config: {
		/**
		 *
		 */
		itemId: 'viewMessages',

		/**
		 * @hide
		 */
		fullscreen: true,

		/**
		 *
		 */
		layout: 'hbox',

		/**
		 *
		 */
		flex: 1,

		/**
		 * @cfg {"portrait"/"landscape"} displayLayout
		 * Sets the layout of the page, with 2 columns or just one
		 */
		displayLayout: null,

		/**
		 * If true, meta informations about Messages module will be loaded automatically
		 */
		autoLoadMeta: true,

		/**
		 * @private
		 * The email signature
		 */
		signature: '',

		/**
		 * @hide
		 */
		currentAccountid: null,

		/**
		 * @hide
		 */
		currentFolder: null,

		/**
		 * @hide
		 */
		currentMessage: null,

		/**
		 * @hide
		 */
		items: [
		    {
		    	itemId: 'messageTitleBar',
		    	xtype: 'titlebar',
		    	docked: 'top',
		    	ui: 'light',
		    	title: '',
		    	layout: {
		    		type: 'hbox',
		    		align: 'center',
		    	},
		    	items:[
		    	    {
		    	    	itemId: 'btnBack',
		    	    	xtype: 'button',
		    	    	align: 'left',
		    	    	ui: 'back',
		    	    	iconMask: true,
		    	    	iconCls: 'arrow_left',
		    	    },
		    	    {
		    	    	itemId: 'btnSync',
		    	    	xtype: 'button',
		    	    	align: 'left',
		    	    	iconMask: true,
		    	    	iconCls: 'refresh5',
		    	    	hidden: true,
		    	    },
		    	    {
		    	    	itemId: 'btnReply',
		    	    	xtype: 'button',
		    	    	align: 'right',
		    	    	iconMask: true,
		    	    	iconCls: 'reply',
		    	    	hidden: true,
		    	    },
		    	    {
		    	    	itemId: 'btnMore',
		    	    	xtype: 'button',
		    	    	align: 'right',
		    	    	iconMask: true,
		    	    	iconCls: 'more',
		    	    	hidden: true,
		    	    },
		    	    /* these buttons are copied into btnMore panel */
		    	    {
		    	    	itemId: 'btnLinks',
		    	    	xtype: 'button',
		    	    	align: 'right',
		    	    	iconMask: true,
		    	    	iconCls: 'link',
		    	    	hidden: true,
		    	    },
		    	    {
		    	    	itemId: 'btnAttachments',
		    	    	xtype: 'button',
		    	    	align: 'right',
		    	    	iconMask: true,
		    	    	iconCls: 'attachment',
		    	    	hidden: true,
		    	    },
		    	    {
		    	    	itemId: 'btnFlag',
		    	    	xtype: 'button',
		    	    	align: 'right',
		    	    	iconMask: true,
		    	    	iconCls: 'flag',
		    	    	hidden: true,
		    	    },
		    	    {
		    	    	itemId: 'btnTalks',
		    	    	xtype: 'button',
		    	    	align: 'right',
		    	    	iconMask: true,
		    	    	iconCls: 'chat',
		    	    	hidden: true,
		    	    },
		    	    {
		    	    	itemId: 'btnDelete',
		    	    	xtype: 'button',
		    	    	align: 'right',
		    	    	iconMask: true,
		    	    	iconCls: 'bin',
		    	    	hidden: true,
		    	    },
		    	    /* --------------- */
		    	    {
		    	    	itemId: 'btnEdit',
		    	    	xtype: 'button',
		    	    	align: 'right',
		    	    	iconMask: true,
		    	    	iconCls: 'add',
		    	    	hidden: true,
		    	    },
		    	    {
		    	    	itemId: 'btnSend',
		    	    	xtype: 'button',
		    	    	align: 'right',
		    	    	/*iconMask: true,
		    	    	iconCls: 'add',*/
		    	    	text: LANG.send,
		    	    	hidden: true,
		    	    },
		    	    {
		    	    	itemId: 'btnSendOpts',
		    	    	xtype: 'button',
		    	    	align: 'right',
		    	    	iconMask: true,
		    	    	iconCls: 'more',
		    	    	hidden: true,
		    	    },
		    	]
		    },
		    {
		    	itemId: 'notConfiguredLabel',
		    	xtype: 'label',
		    	html: LANG.configure_messages,
		    	centered: true,
		    	hidden: true,
		    },
		    {
		    	itemId: 'listAccounts',
		    	xtype: 'list',
		    	cls: 'x-messages-accounts',
		    	hidden: true,
		    	grouped: true,
		    	flex: 1,
		    	itemTpl:
		    		'<tpl switch="type">'+
	    				'<tpl case="inbox">'+
	    					'<div class="accountIcon inbox"></div>'+
	    			'</tpl>'+
		    		'<tpl if="unread &gt; 0"><b>{accountname} ({unread})</b><tpl else>{accountname}</tpl>',
		    	store: {
		    		model: 'Vtecrm.model.VteMessageAccount',
		    		grouper: {
		    			groupFn: function(record) {
		    				return record.get('group');
		    			},
		    			direction: 'DESC',
		    		}
		    	},
		    },
		    {
		    	itemId: 'listFolders',
		    	xtype: 'list',
		    	cls: 'x-messages-folders',
		    	hidden: true,
		    	flex: 1,
		    	store: {
		    		model: 'Vtecrm.model.VteMessageFolder'
		    	},
		    	itemTpl:
		    		'<span style="margin-left:{depth*20}px">'+
		    		'<tpl switch="type">'+
		    			'<tpl case="inbox">'+
		    				'<div class="folderIcon inbox"></div>'+
		    			'<tpl case="sent">'+
		    				'<div class="folderIcon outbox"></div>'+
		    			'<tpl case="spam">'+
		    				'<div class="folderIcon fireball"></div>'+
		    			'<tpl case="flagged">'+
		    				'<div class="folderIcon flag"></div>'+
		    			'<tpl case="trash">'+
		    				'<div class="folderIcon bin"></div>'+
		    			'<tpl case="drafts">'+
		    				'<div class="folderIcon emptybox"></div>'+
		    			'<tpl default>'+
		    				'<div class="folderIcon folder_black"></div>'+
		    		'</tpl>'+
		    		'<tpl if="unread &gt; 0"><b>{label} ({unread})</b><tpl else>{label}</tpl></span>',
		    },
		    {
		    	itemId: 'listMessages',
		    	hidden: true,
		    	xclass: 'Vtecrm.view.ListSearch',
		    	cls: 'x-messages-list',
		    	flex: 1,
		    	width: undefined,
		    	height: undefined,
		    	toolbar: false,
		    	useSearch: false,
		    	fullscreen: false,
		    	ajaxTimeout: 60000, // fetch can be slow
		    	module: 'Messages',
		    	sortField: 'mdate',
		    	sortOrder: 'DESC',
		    	// TODO: icone, cambio mto_n se in posta inviata o bozze
		    	extraFields: ['mdate_friendly', 'from_or_to', 'has_attachments', 'seen', 'flagged', 'forwarded', 'answered', 'has_relations', 'has_comments'],
		    	itemTpl:
		    		'<tpl if="extrafields.seen == \'No\'">'+
		    			'<div class="x-messages-item">'+ // removed the class x-messages-item-unseen
		    		'<tpl else>'+
		    			'<div class="x-messages-item">'+
		    		'</tpl>'+
		    		'<div class="x-messages-list-imgcont">'+
		    			'<div class="x-messages-list-spacer"></div>'+
		    			'<tpl if="extrafields.seen == \'No\'"><div class="x-messages-list-unseen"></div></tpl>'+
		    			'<tpl if="extrafields.has_attachments == 1"><div class="x-messages-list-icon attachment"></div></tpl>'+
		    			'<tpl if="extrafields.flagged != \'No\'"><div class="x-messages-list-icon flag"></div></tpl>'+
		    			'<tpl if="extrafields.forwarded != \'No\' && extrafields.answered != \'No\'"><div class="x-messages-list-icon replyforward"></div>'+
		    				'<tpl elseif="extrafields.forwarded != \'No\'"><div class="x-messages-list-icon forward"></div>'+
		    				'<tpl elseif="extrafields.answered != \'No\'"><div class="x-messages-list-icon reply"></div>'+
		    			'</tpl>'+
		    			'<tpl if="extrafields.has_relations == 1"><div class="x-messages-list-icon link"></div></tpl>'+
		    			'<tpl if="extrafields.has_comments == 1"><div class="x-messages-list-icon chat"></div></tpl>'+

		    		'</div><div class="x-messages-list-cont">'+
		    			'<div class="x-messages-list-date">{extrafields.mdate_friendly}</div>'+
		    			'<div class="x-messages-list-sender">{extrafields.from_or_to}</div>'+
		    			'<div class="x-messages-list-subject">{entityname}</div>'+
		    		'</div>'+
		    		'</div>',
		    	plugins: [
		    	    {
		    	    	xclass: 'Ext.plugin.PullRefresh',
		    	    	pullRefreshText: LANG.pull_to_refresh,
		    	    	releaseRefreshText: LANG.release_to_refresh,
		    	    	loadingText: LANG.loading,
		    	    	refreshFn: function(self) {
		    	    		var list = self.getParent(),
		    	    			me = (list ? list.getParent() : null);
		    	    		if (me) me.onSyncButton();
		    	    	},
		    	    	listeners: {
		    	    		// fix labels
		    	    		initialize: function(plugin) {
		    	    			var tpl = plugin.getPullTpl()
		    	    				newtpl = tpl.html;

		    	    			if (language == 'it_it') {
		    	    				// change the date format and the text
		    	    				newtpl = newtpl
		    	    					.replace(/date\(['"]m\/d\/Y h:iA['"]\)/, 'date("d/m/Y H:i")')
		    	    					.replace('Last Updated', LANG.last_updated);
		    	    				tpl.set(newtpl);
		    	    			}
		    	    		}
		    	    	}
		    	    },
		    	    {
		    	    	xclass: 'Ext.plugin.ListPaging',
		    	        ptype: 'listpaging',
		    	        autoPaging: true,
		    	        loadMoreText: LANG.loading,
		    	        noMoreRecordsText: '',
		    	    }
		    	]
		    },
		    {
		    	itemId: 'noMessageLabel',
		    	xtype: 'label',
		    	flex: 3,
		    	html: LANG.select_message,
		    	hidden: true,
		    	style: {
		    		'text-align': 'center',
		    		'margin-top': '100px',
		    	}
		    },
		    {
		    	itemId: 'showMessage',
		    	xtype: 'container',
		    	hidden: true,
		    	scrollable: true,
		    	layout: 'vbox',
		    	flex: 3,
		    	items: [
		    	    {
		    	    	itemId: 'messageFields',
		    	    	xtype: 'fieldset',
		    	    	defaults: {
		    	    		readOnly: true,
		    	    	},
		    	    	items: [
		    	    	    {
		    	    	    	itemId: 'mailFrom',
		    	    	    	xtype: 'textfield',
		    	    	    	name: 'mfrom_n',
		    	    	    	label: LANG.from.capitalize(),
		    	    	    },
		    	    	    {
		    	    	    	itemId: 'mailTo',
		    	    	    	xtype: 'textfield',
		    	    	    	name: 'mto_n',
		    	    	    	label: LANG.to.capitalize(),
		    	    	    },
		    	    	    {
		    	    	    	itemId: 'mailCC',
		    	    	    	xtype: 'textfield',
		    	    	    	name: 'mcc_n',
		    	    	    	label: LANG.mail_cc.capitalize(),
		    	    	    	hidden: true,
		    	    	    },
		    	    	    {
		    	    	    	xtype: 'textfield',
		    	    	    	name: 'mdate',
		    	    	    	label: LANG.date.capitalize(),
		    	    	    }
		    	    	]
		    	    },
		    	    {
		    	    	itemId: 'messageBody',
		    	    	xtype: 'container',
		    	    	//scrollable: false,
		    	    	padding: '8px',
		    	    },

		    	]
		    },
		    {
		    	itemId: 'editMessage',
		    	xtype: 'container',
		    	flex: 3,
		    	layout: 'vbox',
		    	hidden: true,
		    	scrollable: true,
		    	items: [
		    	    {
		    	    	xtype: 'fieldset',
		    	    	//flex: 1,
		    	    	items:[
		    	            {
		    	            	itemId: 'composeTo',
		    	            	xtype: 'autocompletefield',
		    	            	label: LANG.to.capitalize(),
		    	            	multiple: true,
		    	            	listProperty: 'basicname',
		    	            	listConfig: {
		    	            		itemTpl: '{entityname}',
		    	            	},
		    	            	component: {
		    	            		type: 'email'
		    	            	}
		    	            },
		    	            {
		    	            	itemId: 'composeCC',
		    	            	xtype: 'autocompletefield',
		    	            	hidden: false,
		    	            	label: LANG.mail_cc,
		    	            	multiple: true,
		    	            	listProperty: 'basicname',
		    	            	listConfig: {
		    	            		itemTpl: '{entityname}',
		    	            	},
		    	            	component: {
		    	            		type: 'email'
		    	            	}
		    	            },
		    	            {
		    	            	itemId: 'composeCCN',
		    	            	xtype: 'autocompletefield',
		    	            	hidden: true,
		    	            	label: LANG.mail_bcc,
		    	            	multiple: true,
		    	            	listProperty: 'basicname',
		    	            	listConfig: {
		    	            		itemTpl: '{entityname}',
		    	            	},
		    	            	component: {
		    	            		type: 'email'
		    	            	}
		    	            },
		    	            {
		    	            	xtype: 'textfield',
		    	            	itemId: 'subject',
		    	            	label: LANG.subject,
		    	            },
		    	            // hidden fields
		    	            {
		    	            	xtype: 'textfield',
		    	            	itemId: 'sendMode',
		    	            	hidden: true,
		    	            	value: 'single',
		    	            },
		    	            {
		    	            	xtype: 'textfield',
		    	            	itemId: 'sender',
		    	            	hidden: true,
		    	            },
		    	            {
		    	            	xtype: 'textfield',
		    	            	itemId: 'attachIds',
		    	            	hidden: true,
		    	            }
		    	    	]
		    	    },
		    	    /*{
		    	    	xtype: 'container',
		    	    	flex: 1,
		    	    	scrollable: false,
		    	    	layout: 'fit',
		    	    	margin: '8px',
		    	    	items: [*/
		    	    	    {
		    	    	    	itemId: 'messageBodyEdit',
		    	    	    	xclass: 'Vtecrm.view.EditableContainer',
		    	    	    	//value: "",
		    	    	    	clearIcon: false,
		    	    	    	scrollable: false,
		    	    	    	padding: '2px',
		    	    	    	margin: '8px',
		    	    	    	/*style: {
		    	    	    		'border' : '1px solid #d0d0d0',
		    	    	    		'border-radius' : '4px',
		    	    	    		'-webkit-border-radius' : '4px',
		    	    	    	},*/
		    	    	    }
		    	    	/*]
		    	    }*/

		    	]
		    },
		    {
		    	xclass: 'Vtecrm.view.ListLinked',
		    	itemId: 'listLinked',
		    	flex: 3,
		    	module: 'Messages',
		    	hidden: true,
		    },
		    {
		    	xclass: 'Vtecrm.view.ListSearch',
		    	itemId: 'listSearchLink',
		    	hidden: true,
		    	height: null,
		    	width: null,
		    	flex: 3,
		    	fullscreen: false,
		    	toolbar: false,
		    	useBackButton: false,
		    	useSearch: true,
		    }
	    ],

	    /**
	     * @hide
	     */
	    control: {
			'#btnBack': {
				tap: function() {
					var me = this;
    	    		me.onBackButton();
				}
			},

			'#btnSync': {
				tap: function() {
					var me = this;
    	    		me.onSyncButton();
				}
			},

			'#btnReply': {
				tap: function() {
					var me = this;
    	    		me.onReplyButton();
				}
			},

			'#btnLinks': {
				tap: function(self) {
					var me = this;
    	    		me.onLinksButton(self);
				}
			},

			'#btnAttachments': {
				tap: function(self) {
					var me = this;
    	    		me.onAttachmentsButton(self);
				}
			},

			'#btnFlag': {
				tap: function(self) {
					var me = this;
    	    		me.onFlagButton(self);
				}
			},

			'#btnDelete': {
				tap: function(self) {
					var me = this;
    	    		me.onDeleteButton(self);
				}
			},

			'#btnEdit': {
				tap: function() {
					var me = this;
					me.editMessage();
				}
			},

			'#btnSend': {
				tap: function() {
					var me = this;
					me.sendMessage();
				}
			},

			'#btnSendOpts': {
				tap: function() {
					var me = this;
					me.showSendOptions();
				}
			},

			'#btnMore': {
				tap: function() {
					var me = this;
					me.openMoreButton();
				}
			},

			'#listAccounts': {
				itemtap: function(self, index, target, record, e) {
					var me = this;
					me.onAccountTap(record);
				},
				show: function(self) {
					var me = this,
						store = self.getStore(),
						titleLabel = me.down('#messageTitleBar');

					titleLabel.setTitle(LANG.mailboxes);
					me.syncButtons();

				}
			},

			'#listFolders': {
				itemtap: function(self, index, target, record, e) {
					var me = this;
					me.onFolderTap(record);
				},
				show: function(self) {
					var me = this,
						store = self.getStore(),
						titleLabel = me.down('#messageTitleBar');

					titleLabel.setTitle(LANG.folders);
					me.setCurrentFolder(null);
					me.syncButtons();

				}
			},

			'#listMessages': {
				itemtap: function(self, index, target, record, e) {
					var me = this;
					me.onMessageTap(record);
				},
				show: function(self) {
					var me = this,
						titleLabel = me.down('#messageTitleBar'),
						listFolders = me.down('#listFolders'),
						store = self.getStore(),
						storeFolders = listFolders.getStore(),
						folder = me.getCurrentFolder(),
						folderRecord = storeFolders.findRecord('foldername', folder),
						folderLabel = folderRecord.get('label');

					titleLabel.setTitle(folderLabel);
					me.syncButtons();

				}
			},

			'#showMessage': {
				show: function(self) {
					var me = this,
						titleLabel = me.down('#messageTitleBar');

					me.syncButtons();
					if (self.message) titleLabel.setTitle(self.message.subject);
				},

			},

			'#btnTalks': {
				tap: function() {
					var me = this;
					me.openTalks();
				}
			},

			'#editMessage': {
				show: function() {
					var me = this,
						ccn = me.down('#composeCCN'),
						noMessageLabel = me.down('#noMessageLabel'),
						titleLabel = me.down('#messageTitleBar');

					titleLabel.setTitle(LANG.compose);
					noMessageLabel.hide();
					ccn.hide();
					me.syncButtons();
				},

			},

			'#composeCC': {
				focus: function() {
					var me = this,
						ccn = me.down('#composeCCN');

					ccn.show();
				}
			},

			'#listLinked': {
				show: function() {
					var me = this,
						titleLabel = me.down('#messageTitleBar');

					titleLabel.setTitle(LANG.linked_items);
					me.syncButtons();
				}
			},

			'#listSearchLink': {
				show: function() {
					var me = this,
						titleLabel = me.down('#messageTitleBar');

					titleLabel.setTitle(LANG.link_record);
					me.syncButtons();
				},

				itemtap: function(self, index, target, record, e) {
					var me = this,
						listMessages = me.down('#listMessages'),
						showMessage = me.down('#showMessage'),
						message = showMessage.message,
						messageid = me.getCurrentMessage(),
						module_to = record.get('module'),
						crmid_to = record.get('crmid'),
						ename = record.get('entityname');

					Ext.Msg.confirm(LANG.alert, LANG.link_to+' '+ename, function(buttonId, value, opt) {
						if (buttonId == 'yes') {
							Vtecrm.app.linkModules('Messages', messageid, module_to, crmid_to, function(data) {
								me.onBackButton();
								if (data.success == true) {
									// update the cache (and the list)
									message.has_related_ids = true;
									var store = listMessages.getStore(),
										msgModel = store.findRecord('crmid', messageid),
										efields = msgModel.get('extrafields');

									efields.has_relations = true;
									msgModel.set('extrafields', efields);

								} else {
									// alert
									Ext.Msg.alert(LANG.error, data.message);
								}
							});
						}
					});
					return false;
				}

			}

	    },

	    /**
	     * @hide
	     */
	    listeners: {

	    	show: function(self) {
	    		Vtecrm.app.mainview.setMainTitle(LANG.messages);
	    	}
	    }
	},

	// info about dir structure
	metaData: null,
	// if true, you can only see one message, no folders, no accounts...
	singleRecord: false,
	singleEdit: false,

	multiAccount: false,

	navigateTo: [0,0,0], // after opening, navigate to this place


	constructor: function() {
		var me = this;

		// load auto navigation (can be overridden in initialize)
		var lastPlaces = Vtecrm.app.getLastModuleTab('Messages');
		if (lastPlaces) me.navigateTo = lastPlaces.split(':');

		this.callParent(arguments);

		Ext.Viewport.on({
			scope: me,
			'orientationchange': 'handleOrientationChange'
		});

		// load meta
		if (me.getAutoLoadMeta()) me.loadMeta(true, false);
	},

	saveLastVivisted: function() {
		var me = this,
			account = me.getCurrentAccountid() || '',
			folder = me.getCurrentFolder() || '',
			messageid = me.getCurrentMessage() || '',
			pieces = [account, folder, messageid];

		Vtecrm.app.setLastModuleTab('Messages', pieces.join(':'));
	},

	quickDestroy: function() {
		var me = this;

		Ext.Viewport.un({
			scope: me,
			'orientationchange': 'handleOrientationChange'
		});

		return this.callParent(arguments);
	},

    handleOrientationChange: function(viewport, new_orient, width, height, opts){
    	var me = this;
    	me.setDisplayLayout(new_orient);
    },

    // applied only with big screen and not on phones
    applyDisplayLayout: function(newlayout) {
    	var me = this,
    		width = Ext.Viewport.windowWidth,
    		height = Ext.Viewport.windowHeight,
    		maxsize = Math.max(width, height);

    	if (maxsize > 800 && !Ext.os.is.Phone) return newlayout;

    	return 'portrait';
    },

    updateDisplayLayout: function(newlayout, oldlayout) {
    	var me = this;

    	if (newlayout != oldlayout) {
    		me.changeLayout(newlayout);
    	}
    },

    /**
     * Changes the layout
     */
	changeLayout: function(orient) {
		var me = this,
			listAccounts = me.down('#listAccounts'),
			listFolders = me.down('#listFolders'),
			listMessages = me.down('#listMessages'),
			showMessage = me.down('#showMessage'),
			editMessage = me.down('#editMessage'),
			noMessageLabel = me.down('#noMessageLabel'),
			listLinked = me.down('#listLinked'),
			listSearchLink = me.down('#listSearchLink'),
			activeList = me.getActiveList();

		// these ones are always fullscreen
		if (!editMessage.isHidden()) {
			if (orient == 'landscape' && listMessages) {
				editMessage.previousItems.push(listMessages);
			} else if (orient == 'portrait' && listMessages) {
				Ext.Array.remove(editMessage.previousItems, listMessages);
			}
			return;
		} else if (!listSearchLink.isHidden()) {
			return;
		}

		if (orient == 'landscape') {
			if (activeList) {
				// i was on a list, show the message
				if (showMessage.message)
					showMessage.show();
				else
					noMessageLabel.show();
			} else if (listSearchLink.isHidden()) {
				listMessages.show();
			}

		} else if (orient == 'portrait') {

			if (showMessage.message && listLinked.isHidden() && listSearchLink.isHidden()) {
				// hide all lists, keep the message
				showMessage.show();
				listAccounts.hide();
				listFolders.hide();
				listMessages.hide();
			} else {
				// no message, stay on a list
				showMessage.hide();
				noMessageLabel.hide();
				if (!listLinked.isHidden() || !listSearchLink.isHidden()) {
					listMessages.hide();
				} else if (activeList) {
					activeList.show();
				} else {
					if (me.multiAccount)
						listAccounts.show();
					else
						listFolders.show();
				}
			}
		}
	},

	getActiveList: function() {
		var me = this,
			listAccounts = me.down('#listAccounts'),
			listFolders = me.down('#listFolders'),
			listMessages = me.down('#listMessages');

		if (!listAccounts.isHidden()) return listAccounts;
		else if (!listFolders.isHidden()) return listFolders;
		else if (!listMessages.isHidden()) return listMessages;

		return null;
	},

	/**
	 * Loads meta informations about the Messages module
	 */
	loadMeta: function(forceRemote, loadOnly) {
		var me = this,
			data = null;

		preload = me.fireEvent('beforemetaload', me);
		if (preload === false) return;

		if (loadOnly === undefined) loadOnly = false;

		me.metaData = null;

		// try to load id locally
		// TODO: new messages counters can't be stored!
		if (!forceRemote) {
			try {
				data = Ext.decode(localStorage.getItem('messagesMeta'));
			} catch (e) {
				data = null;
			}
		}

		if (data && data.configured) {
			// use cached data
			me.processMeta(data, loadOnly);
		} else {
			// reload from server
			Vtecrm.app.touchRequest('GetMessagesMeta', {}, true, function(data) {
				me.processMeta(data, loadOnly);
			});
		}
	},

	/**
	 * @private
	 */
	processMeta: function(data, loadOnly) {
		var me = this,
			listAccounts = me.down('#listAccounts'),
			listFolders = me.down('#listFolders');

		if (!data.configured) {
			me.down('#notConfiguredLabel').show();
			return;
		}

		if (loadOnly === undefined) loadOnly = false;

		me.metaData = data;
		localStorage.setItem('messagesMeta', Ext.encode(data));

		if (!loadOnly) {
			// populate lists
			if (data.accounts.length > 1) {
				me.multiAccount = true;
				listAccounts.getStore().add(data.accounts);
				listAccounts.show();
			} else {
				// populate folders if only 1 account
				me.multiAccount = false;
				me.setCurrentAccountid(data.accounts[0].accountid);
				listFolders.getStore().add(data.accounts[0].folders);
				listFolders.show();
			}

			me.setDisplayLayout(Ext.Viewport.getOrientation());
		}

		me.fireEvent('metaloaded', me, data);
		me.onMetaLoaded();
	},

	/**
	 * Called when the meta informations have been loaded
	 */
	onMetaLoaded: function() {
		this.gotoMessage();
	},

	/**
	 * Called when the list of folders has been loaded
	 */
	onFoldersLoaded: function() {
		this.gotoMessage();
	},

	/**
	 * Called when the list of messages has been loaded
	 */
	onMessagesLoaded: function() {
		this.gotoMessage();
	},

	/**
	 * @private
	 * Goes to a specific message. One step at time.
	 */
	gotoMessage: function() {
		var me = this,
			navigate = me.navigateTo,
			listAccounts = me.down('#listAccounts'),
			storeAccounts = listAccounts.getStore(),
			listFolders = me.down('#listFolders'),
			storeFolders = listFolders.getStore(),
			listMessages = me.down('#listMessages'),
			storeMessages = listMessages.getStore();

		if (navigate[0] && !listAccounts.isHidden()) {
			var record = storeAccounts.findRecord('accountid', navigate[0], 0, false, true, true);
			me.navigateTo[0] = 0;
			if (record) {
				listAccounts.select(record, false);
				me.onAccountTap(record);
			}
		} else if (navigate[1] && !listFolders.isHidden()) {
			var record = storeFolders.findRecord('foldername', navigate[1], 0, false, true, true);
			me.navigateTo[1] = 0;
			if (record) {
				listFolders.select(record, false);
				me.onFolderTap(record);
			}
		} else if (navigate[2] && !listMessages.isHidden()) {
			var record = storeMessages.findRecord('crmid', navigate[2], 0, false, true, true);
			me.navigateTo[2] = 0;
			if (record) {
				listMessages.select(record, false);
				me.onMessageTap(record);
			}
		}
	},

	getSignature: function() {
		var me = this,
			signature = me._signature,
			accountid = me.getCurrentAccountid();

		// get the signature based on the current account
		if (me.metaData) {
			if (me.metaData.accounts.length > 1 && accountid > 0) {
				for (var i=0; i<me.metaData.accounts.length; ++i) {
					var acc = me.metaData.accounts[i];
					if (acc.accountid == accountid) {
						signature = acc.signature;
						break;
					}
				}
			} else if (me.metaData.accounts.length == 1) {
				signature = me.metaData.accounts[0].signature;
			}
		}

		// wrap it in magic block
		signature = '<!-- SIGNATURE START -->' + signature + '<!-- SIGNATURE END -->';

		return signature;
	},

	/**
	 * Opens the view to a single message, without loading the lists
	 */
	showSingleMessage: function(messageid) {
		var me = this,
			listMessages = me.down('#listMessages'),
			store = listMessages.getStore(),
			model = store.getModel(),
			record = Ext.factory({
				crmid: messageid
			}, model);

		me.navigateTo = [0,0,0]; // avoid to go to the last message

		me.singleRecord = true;
		me.onMessageTap(record);
	},

	/**
	 * Opens the composer to write an email, without loading all the lists
	 */
	showSingleEdit: function(recipients) {
		var me = this,
			edit = me.down('#editMessage'),
			composeTo = edit.down('#composeTo');

		me.navigateTo = [0,0,0]; // avoid to go to the last message

		// load meta locally
		me.singleEdit = true;
		me.editMessage();
		// add recipients
		if (recipients && recipients.length > 0) {
			composeTo.setValues(recipients);
		} else {
			composeTo.clear();
		}
	},

	// hide all buttons in the toolbar, except the back
	hideAllButtons: function() {
		var me = this,
			toolbar = me.down('titlebar'),
			items = toolbar.query('button');

		for (var i=0; i<items.length; ++i) {
			if (items[i].getItemId() != 'btnBack') items[i].hide();
		}
	},

	// add the prefix Re: or Fwd to the subject
	alterSubject: function(subject, mode) {
		var reply_re = /^(Re\s*:)|^(Re\[\d+\]:)|^(Re\d+:)|^(Rif\s*:)|^(R\s*:)/i,
			reply_replacement = 'Re:',
			forward_re = /^(Fwd\s*:)|^(Fw\s*:)/i
			forward_replacement = 'Fwd:';

		// trim first
		subject = subject.trim();

		if (mode == 'reply') {
			if (subject.match(reply_re)) {
				subject = subject.replace(reply_re, reply_replacement);
			} else {
				subject = reply_replacement + ' ' + subject;
			}
		} else if (mode == 'forward') {
			if (subject.match(forward_re)) {
				subject = subject.replace(forward_re, forward_replacement);
			} else {
				subject = forward_replacement + ' ' + subject;
			}

		}

		return subject;
	},

	// extract mail addresses from standard email field
	// returns array of addresses
	extractAddresses: function(str) {
		var ret = [],
			tokens = str.trim().split(','),
			i,j;

		for (i=0; i<tokens.length; ++i) {
			var piece = tokens[i].trim(),
				addr;
			if (piece.indexOf('<') > -1) {
				var matches = piece.match(/<([a-z0-9%@_.-]+)>/);
				addr = matches[1];
			} else {
				addr = piece;
			}

			// very basic email address match
			if (addr.match(/[a-z0-9%_.-]+@[a-z0-9.-]+\.[a-z]{2,5}/i)) {
				ret.push(addr);
			}
		}

		return ret;
	},

	/**
	 * Alters the body to the message when answering or forwarding emails
	 */
	quoteBody: function(body, mode, message) {
		var me = this,
			date_format = CONFIG.language == 'it_it' ? 'l d F Y \\a\\l\\l\\e H:i:s' : 'l, dS F Y \\a\\t H:i:s',
			signature = me.getSignature() || '';

		// quotation
		if (mode == 'reply' || mode == 'replyall') {
			var dt = Ext.Date.parse(message.mdate, 'Y-m-d H:i:s'),
				mdate = (dt ? Ext.Date.format(dt, date_format) : message.mdate),
				h = LANG.replyHeader
					.replace('{date}', mdate)
					.replace('{author}', message.mfrom_n);

			body = "<br>\n<br>\n" + h + "<br>\n<br>\n" + '<blockquote class="messageQuote" type="cite">' + body + '</blockquote>';
		} else if (mode == 'forward') {
			var h = '<tt>'+(' '+LANG.original_message+' ').pad(72, '-', 2) + "<br>\n";

			// add info for forwarded message
			h += LANG.subject+': '+message.subject+"<br>\n";
			h += LANG.from+': '+message.mfrom+"<br>\n";
			h += LANG.date+': '+message.mdate+"<br>\n";
			h += LANG.to.capitalize()+': '+message.mto+"<br>\n";
			if (message.mcc_f) {
				var otherAddr = me.extractAddresses(message.mcc_f);
				if (otherAddr.length > 0) {
					h += LANG.mail_cc.capitalize()+': '+otherAddr.join(', ').wordWrap(72, "<br>\n", false)+"<br>\n";
				}
			}
			h += ''.pad(72, '-', 0) + "<br></tt>\n";

			body = "<br>\n<br>\n" + h + "<br>\n<br>\n" + body;
			body += "<br>\n<br>\n<tt>" + ''.pad(72, '-', 0) + "</tt><br>\n";

		}

		if (signature.length > 0) {
			body += "<br>\n" + signature;
		}

		return body;
	},

	/**
	 * Called when the user taps on the "more" button
	 */
	openMoreButton: function() {
		var me = this,
			moreBtn = me.down('#btnMore'),
			btnDelete = me.down('#btnDelete'),
			btnAttach = me.down('#btnAttachments'),
			btnLinks = me.down('#btnLinks'),
			btnFlag = me.down('#btnFlag'),
			btnTalks = me.down('#btnTalks'),
			showMessage = me.down('#showMessage'),
			message = showMessage.message;

		if (me.morePanel) {
			var btnMoreAttach = me.morePanel.down('#btnAttachments');
			if (btnMoreAttach) btnMoreAttach.setHidden(!message.has_attachments);

		} else {

		var defaults = {
			hidden: false,
			ui: 'action',
			margin: '2px',
			flex: 1,
			handler: function(self, e) {
				var btnId = self.getItemId(),
					controls = me.getControl(),
					control = (controls ? controls['#'+btnId] : null),
					origFunc = (control && control.tap ? control.tap : null);

				if (origFunc) origFunc.apply(me, [self, e]);
			}
		};

		me.morePanel = Ext.create('Ext.Panel', {
			xtype: 'panel',
			itemId: 'showMorePanel',
			fullscreen: false,
			padding: '4px',
			right: '0px',
			maxWidth: '60px',
			modal: true,
			hideOnMaskTap: true,
			layout: 'vbox',
			scrollable: false,
			items: [
			    Ext.merge(btnLinks.config, defaults),
			    Ext.merge(btnAttach.config, defaults, {hidden: !message.has_attachments}),
			    Ext.merge(btnFlag.config, defaults),
			    Ext.merge(btnTalks.config, defaults),
			    Ext.merge(btnDelete.config, defaults),
			],
			listeners: {
				hide: function(self) {
					//self.quickDestroy();
					me.showMorePanel = null;
				}
			}
		});

		}

		// TODO: showBy with modal panels is very slow, why??
		me.morePanel.showBy(moreBtn);
		me.showMorePanel = me.morePanel;


	},

	/**
	 * Called when the user taps on the "back" button
	 */
	onBackButton: function() {
		var me = this,
			listAccounts = me.down('#listAccounts'),
			listFolders = me.down('#listFolders'),
			listMessages = me.down('#listMessages'),
			listLinked = me.down('#listLinked'),
			listSearchLink = me.down('#listSearchLink'),
			showMessage = me.down('#showMessage'),
			editMessage = me.down('#editMessage'),
			animOut = (CONFIG.enable_animations ? {'type':'slide',	'direction':'right', 'out':true} : null),
			animIn = (CONFIG.enable_animations ? {
				'type':'slide',
				'direction':'right',
				'from' : {'opacity': 0},
				'to' : {'opacity': 1},
			} : null);

		if ((me.multiAccount && !listAccounts.isHidden()) ||
			(!me.multiAccount && !listFolders.isHidden())) {
			Vtecrm.app.historyBack();
		} else if (!listFolders.isHidden()) {
			// show accounts
			listFolders.hide();
			listAccounts.show(animIn);

		// these linked lists are here becasue they have priority
		} else if (!listLinked.isHidden()) {
			listLinked.hide();
			showMessage.show(animIn);
			if (me.getDisplayLayout() == 'landscape') listMessages.show(animIn);
		} else if (!listSearchLink.isHidden()) {
			listSearchLink.hide();
			showMessage.show(animIn);
			if (me.getDisplayLayout() == 'landscape') listMessages.show(animIn);

		} else if (!listMessages.isHidden()) {
			listMessages.hide();
			if (me.multiAccount) {
				var accountRecord = listAccounts.getSelection()[0],
					linkAccount = accountRecord.get('linkto_account'),
					linkFolder = accountRecord.get('linkto_folder');

				if (linkAccount && linkFolder) {
					listFolders.hide();
					listAccounts.show(animIn);
				} else {
					listFolders.show(animIn);
				}

			} else {
				listFolders.show(animIn);
			}

		} else if (!showMessage.isHidden()) {
			if (me.singleRecord) {
				Vtecrm.app.historyBack();
			} else {
				showMessage.hide();
				listMessages.show(animIn);
			}
		} else if (!editMessage.isHidden() && (editMessage.previousItems || me.singleEdit)) {
			// we are in edit mode, back
			var composeTo = editMessage.down('#composeTo'),
				composeCC = editMessage.down('#composeCC'),
				body = editMessage.down('#messageBodyEdit');
			// check if there are changes

			if (body && body.hasBeenEdited()) {
				Ext.Msg.confirm(LANG.alert, LANG.cancel_compose_message, function(buttonId, value, opt) {
		    		if (buttonId == 'yes') {
		    			if (me.singleEdit) {
							Vtecrm.app.historyBack();
						} else {
							editMessage.hide();
							editMessage.previousItems.forEach(function(item) {
								item.show(animIn);
							});
						}
		    		}
		    	});
			} else {
				if (me.singleEdit) {
					Vtecrm.app.historyBack();
				} else {
					editMessage.hide();
					editMessage.previousItems.forEach(function(item) {
						item.show(animIn);
					});
				}
			}
		}

	},

	/**
	 * Shows or hides buttons accordingly with the right toolbar
	 */
	syncButtons: function() {
		var me = this,
			btnEdit = me.down('#btnEdit'),
			btnSend = me.down('#btnSend'),
			btnMore = me.down('#btnMore'),
			btnSync = me.down('#btnSync'),
			btnReply = me.down('#btnReply'),
			btnFlag = me.down('#btnFlag'),
			btnDelete = me.down('#btnDelete'),
			btnAttach = me.down('#btnAttachments'),
			btnLinks = me.down('#btnLinks'),
			btnSendOpts = me.down('#btnSendOpts'),
			showMessage = me.down('#showMessage'),
			dualColumn = (me.getDisplayLayout() == 'landscape'),
			visibleItems = me.getVisibleInnerItems();

		// hide all
		me.hideAllButtons();

		// show some buttons according to the visible items
		for (var i=0; i<visibleItems.length; ++i) {
			itemid = visibleItems[i].getItemId();
			switch (itemid) {
				case 'listAccounts':
					btnEdit.show();
					break;
				case 'listFolders':
					btnEdit.show();
					break;
				case 'listMessages':
					btnSync.show();
					btnEdit.show();
					break;
				case 'showMessage':
					btnReply.show();
					btnMore.show();
					btnEdit.show();
					break;
				case 'editMessage':
					btnSend.show();
					btnSendOpts.show();
					break;
				case 'listLinked':
					break;
				case 'listSearchLink':
					break;
			}
		}

		// hide some buttons for some cases
		for (var i=0; i<visibleItems.length; ++i) {
			itemid = visibleItems[i].getItemId();
			switch (itemid) {
				case 'listAccounts':
					break;
				case 'listFolders':
					break;
				case 'listMessages':
					break;
				case 'showMessage':
					break;
				case 'editMessage':
					break;
				case 'listLinked':
					btnEdit.hide();
					break;
				case 'listSearchLink':
					btnEdit.hide();
					break;
			}
		}
	},

	/**
	 * Called when the sync button is pressed
	 */
	onSyncButton: function() {
		var me = this,
			curr_folder =  me.getCurrentFolder(),
			curr_account =  me.getCurrentAccountid(),
			listMessages = me.down('#listMessages');

		if (!curr_folder || !curr_account) return;

		listMessages.setExtraAjaxParams({
			'mail_folder': curr_folder,
			'mail_accountid': curr_account,
			'force_fetch' : 1
		});
		listMessages.getStore().removeAll(true); // avoid the repaint of the list
		listMessages.getStore().loadPage(1);
	},

	/**
	 * Opens the panel for the sending options
	 */
	showSendOptions: function() {
		var me = this,
			showMessage = me.down('#showMessage'),
			editMessage = me.down('#editMessage'),
			btnSendOpts = me.down('#btnSendOpts'),
			sendMode = editMessage.down('#sendMode'),
			sender = editMessage.down('#sender'),
			attachIds = editMessage.down('#attachIds'),
			showSender = false,
			showAttach = false,
			senderOpts = [],
			attachOpts = [];

		if (me.metaData && me.metaData.senders && me.metaData.senders.length > 1) {
			me.metaData.senders.forEach(function(acc) {
				senderOpts.push({
					text: acc.name + ' <'+acc.email+'>',
					value: acc.email,
					accountid: acc.account,
				})
			});
			showSender = true;
		}

		if (editMessage.edit_mode == 'forward' && showMessage.message && showMessage.message.attachments && showMessage.message.attachments.length > 0) {
			showAttach = true;
			showMessage.message.attachments.forEach(function(att) {
				attachOpts.push({
					text: att.name,
					value: att.contentid,
				});
			});
		}


		var optPanel = Ext.create('Ext.Panel', {
			modal: true,
			hideOnMaskTap: true,
			centered: true,
			minWidth: '300px',
			width: '90%',
			maxWidth: '500px',
			minHeight: '250px',
			/*height: '90%',
			maxHeight: '500px',*/

			items: [
			    {
			    	xtype: 'titlebar',
			    	docked: 'top',
			    	title: LANG.send_options,
			    	items: [
			    	    {
			    	    	xtype: 'button',
			    	    	text: LANG.end,
			    	    	align: 'left',
			    	    	handler: function() {
			    	    		optPanel.hide();
			    	    	}
			    	    }
			    	]
			    },
			    {
			    	xtype: 'fieldset',
			    	items: [
			    	    {
			    	    	xtype: 'selectfield',
			    	    	label: LANG.send_mode,
			    	    	value: sendMode.getValue() || 'single',
			    	    	options: [
			    	    	    {text: LANG.single, value: 'single'},
			    	    	    {text: LANG.multiple, value: 'multiple'},
			    	    	],
			    	    	listeners: {
			    	    		change: function(self, newval, oldval) {
			    	    			sendMode.setValue(newval);
			    	    		}
			    	    	}
			    	    },
			    	    {
			    	    	xtype: 'selectfield',
			    	    	label: LANG.sender,
			    	    	hidden: !showSender,
			    	    	value: sender.getValue() || '',
			    	    	options: senderOpts,
			    	    	listeners: {
			    	    		change: function(self, newval, oldval) {
			    	    			sender.setValue(newval);
			    	    			// update the accountid

			    	    			if (me.metaData && me.metaData.accounts && me.metaData.accounts.length > 1) {
			    	    				var goodacc = array_find(senderOpts, 'value', newval);
			    	    				if (goodacc && goodacc.accountid > 0) {
			    	    					me.setCurrentAccountid(goodacc.accountid);
			    	    					// also update the signature
					    	    			me.adjustSignature();
			    	    				}
			    	    			}
			    	    		}
			    	    	}
			    	    },
			    	    {
			    	    	xtype: 'multiselectfield',
			    	    	label: LANG.attachments,
			    	    	hidden: !showAttach,
			    	    	value: attachIds.getValue() || '',
			    	    	options: attachOpts,
			    	    	listeners: {
			    	    		change: function(self, newval, oldval) {
			    	    			attachIds.setValue(newval || '');
			    	    		}
			    	    	}
			    	    }
			    	]
			    },
			],
			listeners: {
				hide: function(self) {
					self.quickDestroy();
				}
			}
		});

		Ext.Viewport.add(optPanel);

	},

	// replace the signature
	adjustSignature: function() {
		var me = this,
			editMessage = me.down('#editMessage'),
			body = editMessage.down('#messageBodyEdit'),
			signature = me.getSignature(),
			content = body.getValue();

		// the [\S\s] trick is to match also newlines (the single dot doesn't)
		content = content.replace(/<!-- SIGNATURE START -->[\S\s]*<!-- SIGNATURE END -->/, signature);
		body.setValue(content);
	},

	/**
	 * Called when the user taps in the accounts list
	 */
	onAccountTap: function(record) {
		var me = this,
			linkAccount = record.get('linkto_account'),
			linkFolder = record.get('linkto_folder'),

			accountid = (linkAccount || record.get('accountid')),
			listAccounts = me.down('#listAccounts'),
			listFolders = me.down('#listFolders'),
			listMessages = me.down('#listMessages'),
			account = array_find(me.metaData.accounts, 'accountid', accountid),
			anim = (CONFIG.enable_animations ? {
				'type':'slide',
				'direction':'left',
				'containerBox': listAccounts.element.getPageBox(),
				'from': {'opacity':0},
				'to':{'opacity': 1}
				} : null);

		listAccounts.hide();

		listMessages.setExtraAjaxParams({});
		listMessages.getStore().removeAll();

		listFolders.getStore().removeAll();
		listFolders.getStore().add(account.folders);

		me.setCurrentAccountid(accountid);
		me.saveLastVivisted();

		if (linkFolder) {
			//simulate a click in the folder store
			var folderStore = listFolders.getStore(),
				folderRecord = folderStore.findRecord('foldername', linkFolder);
			if (folderRecord) {
				me.onFolderTap(folderRecord);
			}
		} else {
			listFolders.show(anim);
			me.setCurrentFolder(null);
			me.fireEvent('foldersloaded');
			me.onFoldersLoaded();
		}
	},

	/**
	 * Called when the user taps in the folders list
	 */
	onFolderTap: function(record) {
		var me = this,
			foldername = record.get('foldername'),
			listAccounts = me.down('#listAccounts'),
			listFolders = me.down('#listFolders'),
			listMessages = me.down('#listMessages'),
			anim = (CONFIG.enable_animations ? {
				'type':'slide',
				'direction':'left',
				'containerBox': listFolders.element.getPageBox(),
				'from': {'opacity':0},
				'to':{'opacity': 1}
				} : null);

		me.setCurrentFolder(foldername);
		me.saveLastVivisted();

		listMessages.setExtraAjaxParams({
			'mail_folder': foldername,
			'mail_accountid': me.getCurrentAccountid(),
		});
		listMessages.getStore().removeAll();
		listMessages.getStore().loadPage(1, {
			callback: function() {
				listAccounts.hide(); // hide it when using a linkto_folder
				listFolders.hide();
				listMessages.show(anim);
				me.fireEvent('messagesloaded');
				me.onMessagesLoaded();
			}
		});

	},

	/**
	 * Called when the user taps on a message in the list
	 */
	onMessageTap: function(record) {
		var me = this,
			listMessages = me.down('#listMessages'),
			showMessage = me.down('#showMessage'),
			messageid = record.get('crmid'),
			titleLabel = me.down('#messageTitleBar'),
			noMessageLabel = me.down('#noMessageLabel'),
			anim = (CONFIG.enable_animations ? {'type':'slide',	'direction':'left'} : null);

		//retrieve message
		Vtecrm.app.touchRequest('GetRecord', {
			'module' : 'Messages',
			'record': messageid,
			'set_seen' : 1,
		}, true, function(data) {
			me.setCurrentMessage(messageid);
			me.saveLastVivisted();

			data.has_attachments = (data.attachments && data.attachments.length > 0);
			me.populateMessageFields(data);
			titleLabel.setTitle(record.get('entityname'));
			if (me.getDisplayLayout() == 'portrait') listMessages.hide();
			noMessageLabel.hide();
			showMessage.show(anim);
			me.setSeenMessage(record);
		});

	},

	/**
	 * Set a message as seen
	 */
	setSeenMessage: function(record) {
		var me = this,
			messageid = record.get('crmid'),
			efields = record.get('extrafields');

		if (efields) {
			efields.seen = 'Yes';
			record.set('extrafields', efields);
		}

		// update server side
		// -- done during record fetch --

	},

	populateMessageFields: function(message) {
		var me = this,
			showMessage = me.down('#showMessage'),
			fieldset = me.down('#messageFields'),
			fields = fieldset.getInnerItems(),
			bodyField = me.down('#messageBody');

		showMessage.message = message;
		fields.forEach(function(item,index,arr) {
			var fname = item.getName();
			if (message.hasOwnProperty(fname)) {
				var value = message[fname];
				// TODO: fix this
				if (value == '' && fname == 'mto_n') {
					value = message.mto;
				}
				if (fname == 'mcc_n') {
					if (value) {
						item.show();
					} else {
						item.hide();
					}
				}
				item.setValue(value);
			}
		});

		bodyField.setHtml(me.convertLinks(message.description));
	},

	// convert href links to window.open
	convertLinks: function(message) {
		var re = /<a /g,
			match;
		while ((match = re.exec(message)) != null) {
			var l1 = message.indexOf('>', match.index),
				//l2 = ret.indexOf('</a>', match.index+1),
				innerLink = ((l1 > 0) ? message.substring(match.index, l1+1) : false);
			if (innerLink) {
				innerLink = innerLink
					.replace(/target=['"][^'"]*['"]/ig, '')
					.replace(/href=['"]([^'"]*)['"]/ig, 'onclick="window.open(\'$1\', \'_system\', \'location=no\');"')
					.replace(/<a /g, '<a href="javascript:void(0);" ');
				message = message.slice(0, match.index) + innerLink + message.slice(l1+1);
			}
		}
		return message;
	},

	/**
	 * Called when the reply-to button is tapped
	 */
	onReplyButton: function() {
		var me = this,
			listMessages = me.down('#listMessages'),
			showMessage = me.down('#showMessage'),
			btnReply = me.down('#btnReply'),
			message = showMessage.message;

		var panelButtons = [];

		panelButtons.push({
	    	text: LANG.reply,
	    	handler: function() {
	    		panel.hide();
	    		me.editMessage(message, 'reply');
	    	}
		});

		if (message.mcc.length > 0) {
			panelButtons.push({
				text: LANG.reply_to_all,
				handler: function() {
		    		panel.hide();
		    		me.editMessage(message, 'replyall');
		    	}
			});
		}

		panelButtons.push({
	    	text: LANG.do_forward,
	    	handler: function() {
	    		panel.hide();
	    		me.editMessage(message, 'forward');
	    	}
		});

		// show a panel
		var panel = Ext.create('Ext.Panel', {
			xtype: 'panel',
			fullscreen: false,
			padding: '6px',
			left: '0px',
			modal: true,
			hideOnMaskTap: true,
			defaults: {
				xtype: 'button',
				ui: 'action',
				margin: '6px',
				style: {
					'min-width': '150px',
				}
			},
			items: panelButtons,
			listeners: {
				hide: function(self) {
					self.destroy();
				}
			}
		});

		panel.showBy(btnReply);
	},

	/**
	 * Open the Talks panel which shows the talks related to the message only.
	 */
	openTalks: function() {
		var me = this,
			listMessages = me.down('#listMessages'),
			store = listMessages.getStore(),
			showMessage = me.down('#showMessage'),
			message = showMessage.message,
			messageid = me.getCurrentMessage(),
			msgModel = store.findRecord('crmid', messageid),
			efields = (msgModel ? msgModel.get('extrafields') : null);

		if (me.showMorePanel) me.showMorePanel.hide();

		Vtecrm.app.showComments({
			module: 'Messages',
			crmid: messageid,
			listeners: {
				commentsaved: function(self, comment, parentcomment, related_to) {
					// sync the mail store
					if (efields && related_to == messageid) {
						message.has_comments = true;
						efields.has_comments = true;
						msgModel.set('extrafields', efields);
					}
				}
			}
		});
	},

	/**
	 *
	 */
	onLinksButton: function(self) {
		var me = this,
			listMessages = me.down('#listMessages'),
			showMessage = me.down('#showMessage'),
			btnLinks = self,
			message = showMessage.message,
			messageid = me.getCurrentMessage();

		var panelButtons = [
		    /*{
		    	text: 'Crea Evento',
		    	handler: function() {
		    		panel.hide();
		    	}
		    },
		    {
		    	text: 'Crea Compito',
		    	handler: function() {
		    		panel.hide();
		    	}
		    },*/
		    {
		    	text: LANG.create_new,
		    	handler: function() {
		    		panel.hide();
		    		me.showLinkModules('create', self);
		    	}
		    },
		    {
		    	text: LANG.link_record,
		    	handler: function() {
		    		panel.hide();
		    		me.showLinkModules('link', self);
		    	}
		    },
		];

		if (message.has_related_ids) {
			panelButtons.push({
				text: LANG.linked_items,
				handler: function() {
					panel.hide();
					me.showLinkedRecords();
				}
			});
		}

		// show a panel
		var panel = Ext.create('Ext.Panel', {
			xtype: 'panel',
			fullscreen: false,
			padding: '6px',
			left: '0px',
			modal: true,
			hideOnMaskTap: true,
			defaults: {
				xtype: 'button',
				ui: 'action',
				margin: '6px',
				style: {
					'min-width': '150px',
				}
			},
			items: panelButtons,
			listeners: {
				hide: function(self) {
					self.quickDestroy();
				}
			}
		});

		panel.showBy(btnLinks, 'tr-tl');
	},

	/**
	 *
	 */
	showLinkModules: function(mode, btnLinks) {
		var me = this,
			store = Ext.getStore('modulesStoreOffline'),
			modRecord = store.findRecord('view', 'Messages'),
			listMods = modRecord.get(mode == 'create' ? 'mods_create' : 'mods_link');

		if (mode == 'create' && me.createModsList) {
			var list = me.createModsList;
		} else if (mode == 'link' && me.linkModsList) {
			var list = me.linkModsList;
		} else {
			var data = [];
			for (var i=0; i<listMods.length; ++i) {
				var modRec = store.findRecord('view', listMods[i]);
				data.push({
					'module' : listMods[i],
					'label': Vtecrm.app.translateString('SINGLE_'+listMods[i]),
				})
			}
			var list = Ext.create('Ext.Panel', {
				modal: true,
				fullscreen: false,
				padding: '6px',
				left: '0px',
				hideOnMaskTap: true,
				layout: 'fit',
				minHeight: '200px',
				height: '75%',
				maxHeight: '400px',
				minWidth: '250px',
				items: {
					xtype: 'list',
					itemTpl: '{label}',
					'data' : data,
					listeners: {
						itemtap: function(self, index, target, record, e) {
							var mod = record.get('module');
							list.hide();
							me.openLinkPanel(mod, mode);
						}
					}
				}
			});
			me[mode+'ModsList'] = list;
		}

		list.down('list').deselectAll();
		list.showBy(btnLinks);
	},

	/**
	 *
	 */
	openLinkPanel: function(module, mode) {
		var me = this,
			messageid = me.getCurrentMessage(),
			showMessage = me.down('#showMessage'),
			listMessages = me.down('#listMessages'),
			linkList = me.down('#listSearchLink'),
			message = showMessage.message,
			anim = (CONFIG.enable_animations ? {'type':'slide',	'direction':'left'} : null);

		if (me.showMorePanel) me.showMorePanel.hide();

		if (mode == 'create') {
			// show a create view
			Vtecrm.app.showRecord(module, '', '', null, {
				reloadOnCreate: false,
				listeners: {
					'recordsaved': function(self, mode, module, crmid, values) {
						// hide the form
						self.onBackButton();

						// do the link
						Vtecrm.app.linkModules('Messages', messageid, module, crmid, function(data) {
							if (data.success == true) {
								// update the cache
								message.has_related_ids = true;
								var store = listMessages.getStore(),
									msgModel = store.findRecord('crmid', messageid),
									efields = msgModel.get('extrafields');

								efields.has_relations = true;
								msgModel.set('extrafields', efields);

							} else {
								// alert
								Ext.Msg.alert(LANG.error, data.message);
							}
						});
					}
				}
			});
		} else if (mode == 'link') {
			// show a search list
			showMessage.hide();
			listMessages.hide();
			linkList.setToolbar(me.down('titlebar'));
			linkList.setUseSearch(true);
			linkList.setModule(module);
			linkList.show(anim);
			linkList.getStore().load();
		}
	},

	/**
	 * Shows the list of linked records
	 */
	showLinkedRecords: function() {
		var me = this,
			messageid = me.getCurrentMessage(),
			listLinked = me.down('#listLinked'),
			showMessage = me.down('#showMessage'),
			anim = (CONFIG.enable_animations ? {'type':'slide',	'direction':'left'} : null);

		if (me.showMorePanel) me.showMorePanel.hide();

		listLinked.setCrmid(messageid);

		showMessage.hide();
		listLinked.show(anim);
		listLinked.getStore().load();

	},

	/**
	 * Called when the user taps on the attachments button
	 */
	onAttachmentsButton: function(self) {
		var me = this,
			btnAttachments = self,
			listMessages = me.down('#listMessages'),
			showMessage = me.down('#showMessage'),
			message = showMessage.message,
			messageid = me.getCurrentMessage();

		var panel = Ext.create('Ext.Panel', {
			xtype: 'panel',
			fullscreen: false,
			padding: '6px',
			left: '0px',
			modal: true,
			hideOnMaskTap: true,
			items: [{
				xtype: 'list',

				minHeight: '200px',
				maxHeight: '400px',
				minWidth: '250px',
				maxWidth: '400px',

				itemTpl: '{name}',
				data: message.attachments,
				listeners: {
					scope: me,
					itemtap: me.downloadAttach,
					hide: function() {
						panel.hide();
					}
				}
			}],
			listeners: {
				hide: function(self) {
					self.destroy();
				}
			}
		});

		panel.showBy(btnAttachments, 'tr-tl?');

	},

	/**
	 * Downloads an attachment
	 */
	downloadAttach: function(self, index, target, record, e) {
		var me = this,
			list = self,
			messageid = me.getCurrentMessage();

		if (list) list.hide();
		if (me.showMorePanel) me.showMorePanel.hide();

		Vtecrm.app.touchRequest('ShareToken', {
			module: 'Messages',
			contentid: record.get('contentid'),
			recordid: messageid,
		}, true, function(data) {
			if (data && data.token) {
				var url = vtwsUrl.replace('modules/Touch/', '')+'index.php?share_action=dl_attachment&sharetoken='+data.token;
				window.open(url, '_system', 'location=no');
			} else {
				Ext.Msg.alert(LANG.error, LANG.download_error);
			}
		});
	},

	/**
	 * Called when the user presses the flag button
	 */
	onFlagButton: function(self) {
		var me = this,
			listMessages = me.down('#listMessages'),
			showMessage = me.down('#showMessage'),
			btnReply = me.down('#btnReply'),
			btnFlag = self,
			message = showMessage.message,
			messageid = me.getCurrentMessage();

		var panelButtons = [];

		panelButtons.push({
	    	text: LANG.mark_as_unread,
	    	handler: function() {
	    		panel.hide();
	    		if (me.showMorePanel) me.showMorePanel.hide();
	    		me.flagMessage(messageid, 'seen', 0);
	    	}
		});

		if (message.flagged == '1') {
			panelButtons.push({
				text: LANG.unflag_message,
				handler: function() {
		    		panel.hide();
		    		if (me.showMorePanel) me.showMorePanel.hide();
		    		me.flagMessage(messageid, 'flagged', 0);
		    	}
			});
		} else {
			panelButtons.push({
		    	text: LANG.flag_message,
		    	handler: function() {
		    		panel.hide();
		    		if (me.showMorePanel) me.showMorePanel.hide();
		    		me.flagMessage(messageid, 'flagged', 1);
		    	}
			});
		}

		// show a panel
		var panel = Ext.create('Ext.Panel', {
			xtype: 'panel',
			fullscreen: false,
			padding: '6px',
			left: '0px',
			modal: true,
			hideOnMaskTap: true,
			defaults: {
				xtype: 'button',
				ui: 'action',
				margin: '6px',
				style: {
					'min-width': '150px',
				}
			},
			items: panelButtons,
			listeners: {
				hide: function(self) {
					self.quickDestroy();
				}
			}
		});

		panel.showBy(btnFlag, 'tr-tl');

	},

	/**
	 * Applies or removes a flag to the message
	 */
	flagMessage: function(messageid, flag, value) {
		var me = this
			listMessages = me.down('#listMessages'),
			showMessage = me.down('#showMessage'),
			store = listMessages.getStore(),
			msgIndex = store.find('crmid', messageid);

		if (value == 0) {
			var storeValue = 'No';
		} else if (value == 1) {
			var storeValue = 'Yes';
		}

		// call the server
		Vtecrm.app.touchRequest('SetFlag', {
			'module' : 'Messages',
			'recordid' : messageid,
			'flag' : flag,
			'value' : value,
		}, true, function() {
			// set the cached message
			showMessage.message[flag] = value;

			// set the list
			if (store && msgIndex >= 0) {
				var mRecord = store.getAt(msgIndex),
					efields = mRecord.get('extrafields');
				efields[flag] = storeValue;
				mRecord.set('extrafields', efields);
			}

		});

	},

	/**
	 * Called when the user presses the delete button
	 */
	onDeleteButton: function(self) {
		var me = this;

		if (me.showMorePanel) me.showMorePanel.hide();

		Ext.Msg.confirm(LANG.alert, LANG.delete_message, function(buttonId, value, opt) {
    		if (buttonId == 'yes') {
    			me.deleteMessage();
    		}
    	});

	},

	/**
	 * Deletes the selected message
	 */
	deleteMessage: function() {
		var me = this,
			messageid = me.getCurrentMessage(),
			listMessages = me.down('#listMessages'),
			showMessage = me.down('#showMessage'),
			noMessageLabel = me.down('#noMessageLabel'),
			store = listMessages.getStore(),
			msgIndex = store.find('crmid', messageid);

		if (!messageid) return;

		Vtecrm.app.touchRequest('DeleteRecord', {
			'module':'Messages',
			'record': messageid,
		}, true, function(data) {
			if (data == 'SUCCESS') {
				// remove from messages list
				if (store && msgIndex >= 0) {
					store.removeAt(msgIndex);
				}
				if (me.getDisplayLayout() == 'landscape') {
					// two columns, show the next message
					var nextMessage = store.getAt(msgIndex);
					if (nextMessage) {
						showMessage.hide();
						noMessageLabel.show();
						listMessages.select(nextMessage);
						me.onMessageTap(nextMessage);
					}
				} else {
					me.onBackButton();
				}
			} else {
				Ext.Msg.alert(LANG.error, data);
			}
		});

	},

	/**
	 * Opens the compose view to edit or create a message
	 */
	editMessage: function(msg, mode) {
		var me = this,
			accountid = me.getCurrentAccountid(),
			listAccounts = me.down('#listAccounts'),
			listFolders = me.down('#listFolders'),
			listMessages = me.down('#listMessages'),
			showMessage = me.down('#showMessage'),
			anim = (CONFIG.enable_animations ? {'type':'slide',	'direction':'left'} : null),
			edit = me.down('#editMessage'),
			composeTo = edit.down('#composeTo'),
			composeCC = edit.down('#composeCC'),
			composeCCN = edit.down('#composeCCN'),
			sendMode = edit.down('#sendMode'),
			sender = edit.down('#sender'),
			attachIds = edit.down('#attachIds'),
			subject = edit.down('#subject'),
			body = edit.down('#messageBodyEdit');

		var visibleItems = me.getVisibleInnerItems();

		listAccounts.hide();
		listFolders.hide();
		listMessages.hide();
		showMessage.hide();

		edit.edit_mode = mode;
		edit.previousItems = visibleItems;

		sendMode.setValue('single');
		// populate sender with accountid
		if (accountid > 0 && me.metaData && me.metaData.senders.length > 0) {
			for (var i=0; i<me.metaData.senders.length; ++i) {
				var sendinfo = me.metaData.senders[i];
				if (sendinfo.account == accountid) {
					sender.setValue(sendinfo.email);
					break;
				}
			}
		}
		attachIds.setValue('');

		composeTo.clear();
		composeCC.clear();
		composeCCN.clear();

		if (msg) {
			if (mode == 'reply') {
				composeTo.setValue(msg.mfrom);
			} else if (mode == 'replyall') {
				composeTo.setValue(msg.mfrom);
				var newCC = Ext.Array.merge(msg.mto.split(','), msg.mcc.split(','));
				newCC = Ext.Array.map(newCC, function(e) {
					return e.trim();
				});
				composeCC.setValue(newCC.join(', '));
			} else if (mode == 'forward') {

				// in case of forward, populate with attachid
				if (msg.attachments && msg.attachments.length > 0)
				attachIds.setValue(Ext.Array.pluck(msg.attachments, 'contentid').join(','));
			}

			subject.setValue(me.alterSubject(msg.subject, mode));
			if (body.getScrollable()) {
				// TODO: fix this scroll
				body.getScrollable().getScroller().scrollTo(0,0, false);
			}
			body.setValue(me.quoteBody(msg.description, mode, msg));

		} else {
			// new message
			subject.setValue('');
			body.setValue(me.quoteBody(''));
		}


		// these actions must be done after showing the component
		if (anim) {
			anim = Ext.merge(anim, {
				listeners: {
					animationend: function() {
						if (msg && (mode == 'reply' || mode == 'replyall')) {
							body.setEditable(true);
						} else {
							// TODO: not working in iOS, keyboard is not showed by design outside click events.
							// ... naah, tried to emulate a click event... no luck man!
							composeTo.focus();
						}
					}
				}
			});
		}

		edit.show(anim);

		// same actions here, without animation
		if (!anim) {
			if (msg && (mode == 'reply' || mode == 'replyall')) {
				body.setEditable(true);
			} else {
				// bug in Android,
				if (!Ext.os.is.Android) {
					composeTo.focus();
				}
			}
		}

	},

	/**
	 * Sends a message
	 */
	sendMessage: function() {
		var me = this,
			messageid = me.getCurrentMessage(),
			editCont = me.down('#editMessage'),
			mail_to = editCont.down('#composeTo'),
			mail_cc = editCont.down('#composeCC'),
			mail_ccn = editCont.down('#composeCCN'),
			sendMode = editCont.down('#sendMode'),
			sender = editCont.down('#sender'),
			attachIds = editCont.down('#attachIds'),
			values_to = mail_to.getValues(),
			values_cc = mail_cc.getValues(),
			values_ccn = mail_ccn.getValues(),
			mail_re = /^[a-z0-9._%-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i,
			mtime =  (new Date()).getTime(),
			values_to_crmid = [],
			values_cc_crmid = [],
			values_ccn_crmid = [],
			values_to_addr = [],
			values_cc_addr = [],
			values_ccn_addr = [],
			invalid = [];

		// check if empty addresses
		if (values_to.length == 0 && values_cc.length == 0 && values_ccn.length == 0) {
			Ext.Msg.alert(LANG.alert, LANG.type_a_recipient);
			return;
		}

		// check if empty subject
		if (editCont.down('#subject').getValue() == '') {
			Ext.Msg.alert(LANG.alert, LANG.type_a_subject);
			return;
		}

		// validate addresses (and generate ids)
		for (var i=0; i<values_to.length; ++i) {
			if (typeof values_to[i] == 'string') {
				if (!values_to[i].match(mail_re)) {
					invalid.push(values_to[i]);
				} else {
					values_to_addr.push(values_to[i]);
				}
			} else {
				values_to_crmid.push(values_to[i].getId());
			}
		}
		for (var i=0; i<values_cc.length; ++i) {
			if (typeof values_cc[i] == 'string') {
				if (!values_cc[i].match(mail_re)) {
					invalid.push(values_cc[i]);
				} else {
					values_cc_addr.push(values_cc[i]);
				}
			} else {
				values_cc_crmid.push(values_cc[i].getId());
			}
		}
		for (var i=0; i<values_ccn.length; ++i) {
			if (typeof values_ccn[i] == 'string') {
				if (!values_ccn[i].match(mail_re)) {
					invalid.push(values_ccn[i]);
				} else {
					values_ccn_addr.push(values_ccn[i]);
				}
			} else {
				values_ccn_crmid.push(values_ccn[i].getId());
			}
		}

		if (invalid.length > 0) {
			Ext.Msg.alert(LANG.alert, LANG.invalid_following_addr+":<br>\n"+invalid.join("<br>\n"));
			return;
		}

		var bodycont = editCont.down('#messageBodyEdit').getValue();
		// replace signature markers
		bodycont = bodycont.replace('<!-- SIGNATURE START -->', '').replace('<!-- SIGNATURE END -->', '');

		// prepare values
		var values = {
			'mto_addr' : values_to_addr.join(','),
			'mto_crmid': values_to_crmid.join(','),
			'mcc_addr' : values_cc_addr.join(','),
			'mcc_crmid': values_cc_crmid.join(','),
			'mccn_addr' : values_ccn_addr.join(','),
			'mccn_crmid': values_ccn_crmid.join(','),
			'subject' : editCont.down('#subject').getValue(),
			'body' : bodycont,
			'messageid': (editCont.edit_mode == 'forward' && messageid > 0 ? messageid : '' ),
			'message_mode' : editCont.edit_mode || '', // forward or others
			'send_mode': sendMode.getValue() || 'single',
			'sender': sender.getValue() || '',
			'attachments_ids' : attachIds.getValue() || '',
		};
		var ajaxParams = {
			module : 'Messages',
			values: Ext.encode(values),
		};

		Vtecrm.app.touchRequest('SendMail', ajaxParams, true, function(data) {
			if (data.success) {
	    		Ext.Msg.alert('', LANG.email_sent, function() {
	    			editCont.down('#messageBodyEdit').resetEdited();
	    			me.onBackButton();
	    		});
	    	} else {
	    		Ext.Msg.alert(LANG.error, data.error);
	    	}
		});

	},

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/


//TODO: rename this
/**
 * Model for calendar's events. The name of this class is temporary, it will be changed soon, don't rely on it in future releases.
 */
Ext.define("Event", {
	extend: "Ext.data.Model",
	config: {
		fields: [
		    {name: 'title', type: 'string'},
		    {name: 'description', type: 'string'},
		    {name: 'start',	type: 'date', dateFormat: 'c'},
		    {name: 'end', type: 'date',	dateFormat: 'c'},
		    {name: 'crmid', type: 'integer'},
		    {name: 'smownerid', type: 'integer'},
		    {name: 'mine', type: 'boolean'},
		    {name: 'allday', type: 'boolean'},
		    // these are special
		    {name: 'css', type: 'string'},
		    {name: 'style', type: 'string'},
		]
	}
});

// segnalibro Model per i rapportini salvati nel calendario (registrare in models:[])
/**
 * Model for calendar's events. The name of this class is temporary, it will be changed soon, don't rely on it in future releases.
 */
Ext.define("Rapport", {
	extend: "Ext.data.Model",
	config: {
		fields: [
		    {name: 'crmid', type: 'integer'},
		    {name: 'title', type: 'string'},
		    {name: 'start',	type: 'date', dateFormat: 'c'},
		    {name: 'end', type: 'date',	dateFormat: 'c'}
		    // these are special 
		    /*,
			{name: 'description', type: 'string'},
		    {name: 'smownerid', type: 'integer'},
		    {name: 'mine', type: 'boolean'},
		    {name: 'allday', type: 'boolean'},{name: 'css', type: 'string'},
		    {name: 'style', type: 'string'}, */
		]
	}
});

/**
 * The calendar
 */
Ext.define('Vtecrm.view.Calendar', {
	extend: 'Ext.Container',
	config: {

		/**
		 * The default layout is 'vbox'
		 */
		layout: 'vbox',

		/**
		 * The itemId of this component
		 */
		itemId: 'VteCalendar',

		/**
		 * Extra users to show calendar of
		 * @hide
		 */
		userIds: [],

		/**
		 * @protected
		 * If true, when the show event is fired, the list of events is reloaded
		 */
		reloadOnShow: false,
		
		//segnalibro variabile per salvare i valori di data e ora correnti
		dateValues: null,

		/**
		 * @hide
		 */
		items: [
		    {
		    	xtype: 'titlebar',
		    	docked: 'top',
		    	ui: 'dark', //light
				style: { // segnalibro style barra superiore
					'background-color': '#f80'
				},
		    	title: LANG.calendar,

		    	items: [
		    	    {
		    	    	itemId: 'btnBack',
		    	    	xtype: 'button',
		    	    	align: 'left',
		    	    	//ui: 'back',
						style: { // segnalibro style
							'background-color': '#00ba00'
						},
		    	    	iconMask: true,
		    	    	iconCls: 'arrow_left',
		    	    },
		    	    {
                    	itemId: 'btnCreate',
                    	xtype: 'button',
                    	ui: 'plain',
                    	iconCls: 'add',
                    	iconMask: true,
                    	align: 'right',
                    },
                    {
                    	itemId: 'btnShared',
                    	xtype: 'button',
                    	iconCls: 'more',
                    	iconMask: true,
                    	align: 'right',
						hidden: true,//segnalibro nascondo il bottone per il calendario condiviso
					},
					{
                    	itemId: 'btnLogOut',
                    	xtype: 'button',
                    	iconCls: 'more',
						style: { // segnalibro style
							'background-color': '#00ba00'
						},
                    	iconMask: true,
                    	align: 'right',
						handler: function() {
								var me = this;

								var panel = Ext.create('Ext.Panel', {
									layout: 'vbox',
									modal: true,
									hideOnMaskTap: true,
									right: '0px',
									padding: '4px',
									items: [
										{
											xtype: 'button',
											ui: 'action',
											text: 'Logout',
											style: { // segnalibro style
												'background-color': '#00ba00'
											},
											margin: '4px',
											handler: function() {
												panel.hide();
												if (CONFIG.app_offline) {
													Ext.Msg.confirm(LANG.alert, LANG.logout_offline, function(buttonId) {
														if (buttonId == 'yes') {
															Vtecrm.app.doLogout();
														}
													});
												} else {
													Ext.Msg.confirm(LANG.alert, 'effettuare il logout?', function(buttonId) {
														if (buttonId == 'yes') {
															Vtecrm.app.doLogout();
														}
													});
												}
											}

										}
									],
									listeners: {
										hide: function(self) {
											self.quickDestroy();
										}
									}
								});

								panel.showBy(this);
							},
                    }
		    	]
		    },
		    {
		    	itemId: 'touchCalendar',
		    	xclass: 'Ext.ux.TouchCalendar',
		    	viewMode: 'month',
		    	flex: 3,

                value: new Date(),
                enableSimpleEvents: {
                	multiEventDots: true, // one dot per day
                	groupByProperty: 'smownerid', // group by property (1 for me, 1 for others)
                	eventTpl:
                		// values of record are in data
                		'<span class="{wrapperCls}">'+
                	    	'<tpl for="events">' +
                	    		'<tpl if="data.mine == false">'+
                	    			'<span class="{[parent.eventDotCls]} notmine" style="{data.style}"></span>' +
                	    		'<tpl else>'+
                	     			'<span class="{[parent.eventDotCls]} mine" style="{data.style}"></span>' +
                	     		'</tpl>' +
                	     	'</tpl>' +
                	     '</span>'
                },
                enableEventBars: false,
                viewConfig: {
                    weekStart: 1,
                    eventStore: Ext.create('Ext.data.Store', {
					//segnalibro  model: 'Event',
                    	model: 'Rapport',
                    })
                }
		    },
		    {
		    	itemId: 'touchCalendarDay',
		    	xclass: 'Ext.ux.TouchCalendar',
		    	//hidden: true,
		    	viewMode: 'day',
		    	flex: 3,
		    	hidden:true,
                enableSimpleEvents: false,
                enableEventBars: {
                	eventBarTpl: '{title}<br><div class="event-bar-description">{[values.description.addEllipses(60)]}</div>',
                },
                viewConfig: {
                	// TODO: use the same store??
                    eventStore: Ext.create('Ext.data.Store', {
                    //segnalibro  model: 'Event',
                    	model: 'Rapport',
                    })
                }
		    },

		    {
		    	itemId: 'listEvents',
		    	hidden: true,
		    	xclass: 'Vtecrm.view.ListSearch',
		    	flex: 1,
		    	width: undefined,
		    	height: undefined,
		    	toolbar: false,
		    	useSearch: false,
		    	fullscreen: false,
				sortField: 'diary_date',
				sortOrder: 'DESC',
				//segnalibro module: event potrebbe essere module: diary per i rapportini
		    	module: 'Diary',
		    	pageSize: 30, // very big, we need all the events in 3 months!
		    }
		],

		/**
		 * @hide
		 */
		listeners: {
			initialize: function() {
				var me = this,
					listEvents = me.down('#listEvents'),
					btnShared = me.down('#btnShared'),
					userslist = (current_user.preferencies ? current_user.preferencies.cal_users : null),
					cal = me.down('#touchCalendar'),
					calday = me.down('#touchCalendarDay');

				// show or hide shared button

				if (!userslist || userslist.length == 0) {
					btnShared.hide();
				}


				cal.getActiveItem().eventStore.removeAll();
				calday.getActiveItem().eventStore.removeAll();
				listEvents.getStore().removeAll();

				this.refreshList();
			},

			show: function() {
				var me = this;
				Vtecrm.app.mainview.setMainTitle('');
				if(me.down('#touchCalendarDay').getHidden()) me.down('#btnBack').hide();//segnalibro nasconde il back button nella homepage del calendar
				if (me.getReloadOnShow()) {
					var touchCalendar = me.down('#touchCalendar'),
						touchCalendarDay = me.down('#touchCalendarDay'),
						listEvents = me.down('#listEvents'),
						listStore = listEvents.getStore();
					me.setReloadOnShow(false);
					 //reloadviews
					touchCalendar.getActiveItem().eventStore.removeAll();
					touchCalendarDay.getActiveItem().eventStore.removeAll();
					listEvents.getStore().removeAll();
					me.refreshList();
				}
				//Vtecrm.app.mainview.setMainTitle(LANG.calendar);
			}

		},

		/**
		 * @hide
		 */
		control: {
			'#btnBack': {
				tap: function() {
    	    		this.onBackButton();
				}
			},

			'#btnCreate': {
				tap: function() {
    	    		this.onCreateButton();
				}
			},

			'#btnShared': {
				tap: function() {
					this.onSharedButton();
				}
			},

			'#touchCalendar': {
				selectionchange: function(self, newDate, oldDate) {
					this.onDayTap(newDate, oldDate);
				},

				periodchange: function(item, mindate, maxdate) {
					this.onMonthChange(item, mindate, maxdate);
				}
			},

			'#touchCalendarDay': {
				eventtap: function(record, event) {
					this.onEventTap(record);
				},

				longpresscell: function(calview) {
					this.onCreateButton();
					// segnalibro bug di touchcalendar, evento mai sollevato
				}
			}
		}

	},

	monthsLoaded: [],

	constructor: function(config) {
		var me = this;

		// alter config of day view to change the start hour
		// TODO: very bad idea to use an index!
		if (current_user.preferencies && this.config.items[2]) {
			if (current_user.preferencies.calendar_start_hour) {
				this.config.items[2].viewConfig.startHour = current_user.preferencies.calendar_start_hour;
			}
			if (current_user.preferencies.calendar_end_hour) {

				this.config.items[2].viewConfig.endHour = current_user.preferencies.calendar_end_hour;
			}
		}

		this.callParent(arguments);

		var listEvents = me.down('#listEvents'),
			listStore = listEvents.getStore();

		if (listStore) {
			listStore.on({
				scope: me,
				load: 'onListLoad'
			});
		}
	},

	addUserId: function(id) {
		var me = this,
			ids = me.getUserIds() || [];

		ids.push(id);
		me.setUserIds(ids);
	},

	/**
	 * Called when the back button is pressed. Used to show the monthly view or to go back to the home page.
	 */
	onBackButton: function() {
		var me = this,
			touchCalendar = me.down('#touchCalendar'),
			touchCalendarDay = me.down('#touchCalendarDay');

		if (!touchCalendarDay.isHidden()) {
			touchCalendarDay.hide();
			touchCalendar.show();
			me.down('#btnBack').hide();//segnalibro nasconde il back button nella homepage del calendar
		} else {
			//segnalibro dead code
			//Vtecrm.app.historyBack();
		}
	},

	/**
	 * Called when the create button is pressed. Opens the quickEdit dialog.
	 */
	onCreateButton: function() {
		var me = this,
			shownDay, shownDayEnd,
			values = {},
			touchCalendar = me.down('#touchCalendar'),
			touchCalendarDay = me.down('#touchCalendarDay'),
			startHour = touchCalendarDay.getActiveItem().getStartHour() || '09:00';

		if (!touchCalendarDay.isHidden()) {
			var selected = touchCalendarDay.getActiveItem().getValue();
			if (selected && selected.getHours() != 0 ) {
				shownDay = selected;
			} else {
				shownDay = touchCalendarDay.getActiveItem().currentDate;
			}
		} else if (!touchCalendar.isHidden()) {
			var selected = touchCalendar.getActiveItem().getValue();
			shownDay = selected || touchCalendar.getActiveItem().currentDate;
		}
		shownDayEnd = Ext.Date.clone(shownDay);

		if (startHour && shownDay.getHours() == 0) {
			var hours = startHour.split(':');
			shownDay.setHours(hours[0]);
			shownDay.setMinutes(hours[1]);
		}

		shownDayEnd.setHours(shownDay.getHours()+1);
		shownDayEnd.setMinutes(shownDay.getMinutes());

		if (shownDay) {
			values.event_start = Ext.Date.format(shownDay, 'Y-m-d H:i');
			values.event_end = Ext.Date.format(shownDayEnd, 'Y-m-d H:i');
		}
		me.showQuickEdit(null, values);

		/*Vtecrm.app.showRecord('Events', null, '', null, {
			'forcedInitValues' : values,
		});*/
	},

	/**
	 * Called when the "more" button is pressed. Opens a little popup with the option to show shared calendar.
	 * More options will be added in the future.
	 */
	onSharedButton: function() {
		var me = this,
			btnShared = me.down('#btnShared'),
			userslist = current_user.preferencies.cal_users;

		if (!userslist || userslist.length == 0) return;

		var panel = Ext.create('Ext.Panel', {
			layout: 'vbox',
			modal: true,
			hideOnMaskTap: true,
			right: '0px',
			padding: '4px',
			items: [
			    {
			    	xtype: 'button',
			    	ui: 'action',
			    	text: LANG.shared_calendars,
			    	margin: '4px',
			    	handler: function() {
			    		panel.hide();
			    		me.showSharedUsersList();
			    	}

			    }
			],
			listeners: {
				hide: function(self) {
					self.quickDestroy();
				}
			}
		});

		panel.showBy(btnShared);
	},

	/**
	 * Shows the list of available users for shared calendars.
	 */
	showSharedUsersList: function() {
		var me = this,
			userstore = Vtecrm.app.userstore,
			shareids = current_user.preferencies.cal_users,
			sharerecords = [];

		Ext.Array.each(shareids, function(userid) {
			var urecord = userstore.findRecord('userid', userid);
			if (urecord)
				sharerecords.push(urecord);
		});
		if (sharerecords.length == 0) return;

		// TODO: show already selected items
		var upanel = Ext.create('Ext.Panel', {
			modal: true,
			layout: 'fit',
			hideOnMaskTap: true,
			centered: true,
			minWidth: '250px',
			width: '40%',
			maxWidth: '400px',
			minHeight: '300px',
			height: '70%',
			items: [
			    {
			    	xtype: 'titlebar',
			    	title: LANG.show_calendar_of+':',
			    	docked: 'top',
			    },
			    {
			    	xtype: 'list',
			    	flex: 1,
			    	itemTpl: '</div>{complete_name} <div class="cal-users-color-dot" style="background-color:#{preferencies.cal_color}"></div>',
			    	store: {
			    		model: 'Vtecrm.model.VteUser',
			    		data: sharerecords,
			    	},
			    	listeners: {
			    		// select active users
			    		initialize: function(self) {
			    			var oldids = me.getUserIds() || [],
			    				store = self.getStore();

		    				Ext.Array.forEach(oldids, function(oldid) {
		    					var recIdx = store.findExact('userid', oldid);
		    					if (recIdx >= 0) self.select(store.getAt(recIdx), true, true);
		    				});
			    		},
			    		itemtap: function(self, index, target, record) {
			    			var oldids = me.getUserIds() || [],
			    				store = self.getStore(),
			    				userid = record.get('userid'),
			    				wasActive = (oldids.indexOf(userid) >= 0),
			    				passRecord;

			    			self.deselectAll(true);

			    			if (wasActive) {
			    				// remove user
			    				passRecord = null;
			    			} else {
			    				// add user
			    				self.select(record);
			    				passRecord = record;
			    			}

			    			upanel.hide();
			    			me.showUserCalendar(passRecord);
			    		}
			    	}
			    }
			],
			listeners: {
				hide: function(self) {
					self.quickDestroy();
				}
			}

		});

		Ext.Viewport.add(upanel);
	},

	/**
	 * Resets the display and reload the list, showing also the Calendar of the user in record
	 * @param {Vtecrm.model.VteUser} record
	 */
	showUserCalendar: function(record) {
		var me = this,
			listEvents = me.down('#listEvents'),
			cal = me.down('#touchCalendar'),
			calday = me.down('#touchCalendarDay');

		if (record) {
			me.setUserIds([record.get('userid')]);
		} else {
			me.setUserIds([]);
		}

		// clear also the stores
		cal.getActiveItem().eventStore.removeAll();
		calday.getActiveItem().eventStore.removeAll();
		listEvents.getStore().removeAll();

		me.refreshList();

	},

	/**
	 * @protected
	 * Called after the list of events has been loaded, so they are ready to be drawn on the monthly and daily view
	 */
	onListLoad: function(store, records, success, operation, opts) {
		var me = this,
			userstore = Vtecrm.app.userstore,
			touchCalendar = me.down('#touchCalendar'),
			touchCalendarDay = me.down('#touchCalendarDay'),
			touchStore = touchCalendar.getActiveItem().eventStore,
			touchStoreDay = touchCalendarDay.getActiveItem().eventStore, //getStore(),
			listEvents = me.down('#listEvents');
			//al momento sta caricando la lista con i campi degli Events compilati con quelli dei Diary che combaciano
		for (var i=0; i<records.length; ++i) {
			var extrafield = records[i].get('extrafields');
			var title = extrafield['diary_subject'];
			var day = extrafield['diary_date'];
			var hstart = extrafield['hh_start'];
			var mstart = extrafield['mm_start'];
			var hend = extrafield['hh_end'];
			var mend = extrafield['mm_end'];
			
			var	event = {
							'crmid' : records[i].get('crmid'),
							'title': title,
							'start': Ext.Date.parse(day.substr(0, 10)+' '+hstart.substr(0, 2)+':'+mstart.substr(0, 2), 'Y-m-d H:i'),//Ext.Date.format(new Date(2014,5,11,15,30), 'Y-m-d H:i')
							'end': Ext.Date.parse(day.substr(0, 10)+' '+hend.substr(0, 2)+':'+mend.substr(0, 2), 'Y-m-d H:i')
						};
				// segnalibro copia nello store locale gli eventi arrivati da online
				touchStore.add(event);
				touchStoreDay.add(event);
		}
		
		touchCalendar.refreshEvents();
		touchCalendarDay.refreshEvents();
		
		//alternativa usando getrecord, funziona ma è troppo lenta
		/* for (var i=0; i<2; ++i) {
			console.log(records[i]);
			Vtecrm.app.touchRequest('GetRecord',{'module':'Diary','record':records[i].get('crmid')}, true, function(result){
					
						
						console.log(result);
						
						var	event = {
										'crmid' : records[i].get('crmid'),
										'title': result['diary_no'],
										'start': Ext.Date.parse(result['diary_date'].substr(0, 10)+' '+result['hh_start'].substr(0, 2)+':'+result['mm_start'].substr(0, 2), 'Y-m-d H:i'),//Ext.Date.format(new Date(2014,5,11,15,30), 'Y-m-d H:i'),//,
										'end': Ext.Date.parse(result['diary_date'].substr(0, 10)+' '+result['hh_end'].substr(0, 2)+':'+result['mm_end'].substr(0, 2), 'Y-m-d H:i')
									};
							touchStore.add(event);
							touchStoreDay.add(event);
			});
		} */
		
		return;
		
		var me = this,
			userstore = Vtecrm.app.userstore,
			touchCalendar = me.down('#touchCalendar'),
			touchCalendarDay = me.down('#touchCalendarDay'),
			touchStore = touchCalendar.getActiveItem().eventStore,
			touchStoreDay = touchCalendarDay.getActiveItem().eventStore, //getStore(),
			listEvents = me.down('#listEvents');

		for (var i=0; i<records.length; ++i) {
			var crmid = records[i].get('crmid'),
				extrafields = records[i].get('extrafields');

			// if already existing, skip (use calendar Day, otherwise the eventstore is cleared)
			if (touchStoreDay.find('crmid', crmid) >= 0) continue;

			if (extrafields) { 
				if (extrafields.is_all_day_event == '1') {
					// is a "all day" event, but here it is just a normal event, starting at 00:00 and ending at 24:00 (will be turned into 0)
					extrafields.time_start = '00:00';
					extrafields.time_end = '24:00';
				}

				var event_start = extrafields.date_start.substr(0, 10) + ' ' + extrafields.time_start.substr(0,5) + ':00',
					event_end = extrafields.due_date.substr(0, 10) + ' ' + extrafields.time_end.substr(0,5) + ':00',
					mine = (extrafields.assigned_user_id == current_user.userid),
					css = '';

					if (!mine) {
						// use other user's color
						var otherUser = userstore.findRecord('userid', extrafields.assigned_user_id);
						if (otherUser) {
							var hexColor = otherUser.get('preferencies').cal_color;
							if (hexColor) {
								var border = Color.HexToRgb(hexColor),
									borderHsv = Color.RgbToHsv(border.r, border.g, border.b);

								borderHsv.v = Math.max(borderHsv.v-10, 0);
								var borderRgb = Color.HsvToRgb(borderHsv.h, borderHsv.s, borderHsv.v),
									borderHex = Color.RgbToHex(borderRgb.r, borderRgb.g, borderRgb.b);

								css = 'background-color: #'+hexColor+';border: 1px solid #'+borderHex;
							}
						}
					}

					var date_start = Ext.Date.parse(event_start, 'c'),
						date_end = Ext.Date.parse(event_end, 'c');
						//timestr = '['+(date_start ? Ext.Date.format(date_start, 'H:i') : '?:?')+' - '+(date_end ? Ext.Date.format(date_end, 'H:i') : '?:?')+']';

					if (!date_start || !date_end) continue;
					var	event = {
						'crmid' : crmid,
						'smownerid' : extrafields.assigned_user_id,
						'title': records[i].get('entityname'),
						'description' : extrafields.description,
						'start': date_start,
						'end': date_end,
						'mine' : mine,
						'allday': (extrafields.is_all_day_event == '1'),
						'css' : (mine ? 'mine' : 'notmine'),
						'style' : css,
					};
				// TODO: usare lo stesso store!
				// segnalibro copia nello store locale gli eventi arrivati da online
				touchStore.add(event);
				touchStoreDay.add(event);
			}
		}

		touchCalendar.refreshEvents();
		touchCalendarDay.refreshEvents();

	},

	/**
	 * Reload the list of events from the server and refresh the views
	 */
	refreshList: function(today) {
		var me = this,
			basedate = today || new Date(),
			monthBegin = Ext.Date.getFirstDateOfMonth(basedate),
			monthAgo = Ext.Date.add(monthBegin, Ext.Date.MONTH, -1),
			monthNext1 = Ext.Date.add(monthBegin, Ext.Date.MONTH, 1),
			monthNext2 = Ext.Date.add(monthBegin, Ext.Date.MONTH, 2),
			listEvents = me.down('#listEvents');
		//segnalibro refresh evito il raddoppio dei dati
		me.down('#touchCalendar').getActiveItem().eventStore.removeAll();
		me.down('#touchCalendarDay').getActiveItem().eventStore.removeAll();
		listEvents.getStore().removeAll();
		// get date interval

		// retrieve also time informations
		// segnalibro cambio gli extrafields apposta per i rapportini
		listEvents.setExtraAjaxParams({
			'extrafields' : Ext.encode(['diary_subject', 'diary_date', 'hh_start', 'mm_start', 'hh_end', 'mm_end']),//'date_start', 'time_start', 'due_date', 'time_end', 'assigned_user_id', 'description', 'is_all_day_event']),
			'extrafields_raw' : '1',
			'show_users' : me.getUserIds().join(','),
			// see in QueryGenerator for a list of operators
			'conditions' : Ext.encode([{
				'type' : 'group',
				'glue' : 'and',
				'conds' : [
				    {'field':'date_start', 'operator': 'h', 'value': Ext.Date.format(monthAgo, 'Y-m-d')},
				    {'field':'due_date', 'operator': 'm', 'value': Ext.Date.format(monthNext2, 'Y-m-d')},
				]
			}])
		});

		// save the months loaded
		me.monthsLoaded.push(Ext.Date.format(basedate, 'Y-m'));
		me.monthsLoaded.push(Ext.Date.format(monthAgo, 'Y-m'));
		me.monthsLoaded.push(Ext.Date.format(monthNext1, 'Y-m'));
		me.monthsLoaded = Ext.Array.unique(me.monthsLoaded);

		//listEvents.getStore().removeAll();
		listEvents.getStore().loadPage(1);
	},

	/**
	 * Called when the user taps a day in the monthly view
	 */
	onDayTap: function(newDate, oldDate) {
		var me = this,
			touchCalendar = me.down('#touchCalendar'),
			touchCalendarDay = me.down('#touchCalendarDay');

		touchCalendar.hide();

		touchCalendarDay.show();
		touchCalendarDay.setValue(newDate);
		me.down('#btnBack').show();//segnalibro mostra il back button nel calendar day
	},

	/**
	 * @protected
	 * Called when the current month is changed
	 */
	onMonthChange: function(item,mindate, maxdate) {
		var me = this,
			basedate = item.currentDate,
			month = Ext.Date.format(basedate, 'Y-m');

		// don't reload same months
		if (me.monthsLoaded.indexOf(month) < 0) {
			me.refreshList(basedate);
		}
	},

	/**
	 * Called when the user taps on an event in the daily view
	 */
	onEventTap: function(record) {
		var me = this;
		//segnalibro azzero dateValues
		me.setDateValues('');
		me.showQuickEdit(record);
		
	},

	// TODO: get the fields from calendar
	/**
	 * Opens the QuickEdit popup to edit or create an event
	 */
	showQuickEdit: function(record, calValues) {
		// segnalibro qua dovrebbe comparire form dei rapportini
		this.setDateValues(calValues);
		if (record){
			Vtecrm.app.showRecord('Diary', record.get('crmid'));
		}
		else{
			Vtecrm.app.showRecord('Diary', null);
		}
		return;
		
		
		
		var me = this,
			touchCalendar = me.down('#touchCalendar'),
			touchCalendarDay = me.down('#touchCalendarDay'),
			crmid = (record ? record.get('crmid') : null),
			touchStore = touchCalendar.getActiveItem().eventStore,
			touchStoreDay = touchCalendarDay.getActiveItem().eventStore,
			subject, description, event_start, event_end,
			allday = false;

		if (crmid > 0) {
			description = record.get('description');
			subject = record.get('title');
			event_start = Ext.Date.format(record.get('start'), 'Y-m-d H:i');
			event_end = Ext.Date.format(record.get('end'), 'Y-m-d H:i');
			allday = record.get('allday');
		}

		calValues = calValues || {};
		if (calValues.subject) subject = calValues.subject;
		if (calValues.description) description = calValues.description;
		if (calValues.event_start) event_start = calValues.event_start;
		if (calValues.event_end) event_end = calValues.event_end;

		// maps itemIds with VTE fieldnames
		//segnalibro bisogna fare lo stesso per i rapportini
		var fieldMap = {
			'eventSubject' : 'subject',
			'eventDescription' : 'description',
    	    'eventStartDateTime' : 'date_start',
    	    'eventEndDateTime' : 'due_date',
    	    'eventStartDate': 'date_start',
    	    'eventEndDate': 'due_date',
    	    'eventAllDay': 'is_all_day_event',
		};

		var qcreate = Ext.create('Ext.Panel', {
			modal: true,
			hideOnMaskTap: true,
			centered: true,
			minWidth: '300px',
			width: '80%',
			minHeight: '350px',
			height: '80%',
			layout: 'fit',
			items: [
			    {
			    	xtype: 'titlebar',
			    	docked: 'top',
			    	items: [
			    	    {
			    	    	xtype: 'button',
			    	    	align: 'left',
			    	    	text: LANG.close,
			    	    	handler: function() {
			    	    		qcreate.hide();
			    	    	}
			    	    },
			    	    {
			    	    	xtype: 'button',
			    	    	align: 'right',
			    	    	text: LANG.details,
			    	    	handler: function() {
			    	    		var fieldset = qcreate.down('fieldset'),
		    	    				fields = fieldset.query('field:not(hidden)'),
		    	    				subject = fieldset.down('#eventSubject').getValue(),
		    	    				description = fieldset.down('#eventDescription').getValue(),
		    	    				allday = fieldset.down('#eventAllDay').getChecked(),
		    	    				s1 = fieldset.down('#eventStartDateTime'),
		    	    				s2 = fieldset.down('#eventEndDateTime'),
		    	    				s3 = fieldset.down('#eventStartDate'),
		    	    				s4 = fieldset.down('#eventEndDate'),
		    	    				values = {};

			    	    		if (!crmid) {
			    	    			values.subject = subject;
			    	    			values.description = description;
			    	    			values.is_all_day_event = (allday ? '1' : '0');
			    	    			if (allday) {
			    	    				values.date_start = Ext.Date.format(s3.getValue(), 'Y-m-d');
			    	    				values.due_date = Ext.Date.format(s4.getValue(), 'Y-m-d');
			    	    			} else {
			    	    				values.date_start = Ext.Date.format(s1.getValue(), 'Y-m-d');
			    	    				values.due_date = Ext.Date.format(s2.getValue(), 'Y-m-d');
			    	    				values.time_start = Ext.Date.format(s1.getValue(), 'H:i');
			    	    				values.time_end = Ext.Date.format(s2.getValue(), 'H:i');
			    	    			}
			    	    		}

			    	    		qcreate.hide();
			    	    		me.setReloadOnShow(true); // reload when coming back
			    	    		Vtecrm.app.showRecord('Events', crmid, (record ? record.get('title') : ''), null, {
			    	    			'forcedInitValues' : values,
			    	    		});
			    	    	}
			    	    },
			    	    {
			    	    	xtype: 'button',
			    	    	align: 'right',
			    	    	text: LANG.save,
			    	    	handler: function() {
			    	    		var fieldset = qcreate.down('fieldset'),
			    	    			fields = fieldset.query('field:not(hidden)'),
			    	    			subject = fieldset.down('#eventSubject').getValue(),
			    	    			s1 = fieldset.down('#eventStartDateTime'),
	    	    					s2 = fieldset.down('#eventEndDateTime'),
	    	    					s3 = fieldset.down('#eventStartDate'),
	    	    					s4 = fieldset.down('#eventEndDate'),
			    	    			values = {};

			    	    		if (!subject) {
			    	    			Ext.Msg.alert(LANG.error, LANG.type_a_subject);
			    	    			return;
			    	    		}

			    	    		fields.forEach(function(item) {
			    	    			if (item.isHidden()) return;

			    	    			var vtename = fieldMap[item.getItemId()];
			    	    			if (!vtename) return;

			    	    			var value = item.getValue();
			    	    			if (vtename == 'is_all_day_event') {
			    	    				value = (value ? 1 : 0);
			    	    			} else if (vtename == 'date_start' || vtename == 'due_date') {
			    	    				value = Ext.Date.format(value, 'Y-m-d\\T00:00:00');
			    	    			}
			    	    			values[vtename] = value;
			    	    		});

			    	    		if (!values.is_all_day_event) {
			    	    			// set hours also
			    	    			values['time_start'] = Ext.Date.format(s1.getValue(), 'H:i');
			    	    			values['time_end'] = Ext.Date.format(s2.getValue(), 'H:i');
			    	    		}

			    	    		// add some values in creation
			    	    		if (!crmid) {
			    	    			// TODO: take mandatory fields from vte
			    	    			values['assigned_user_id'] = current_user.userid;
			    	    			values['eventstatus'] = 'Planned';
			    	    			values['activitytype'] = 'Call';
			    	    		}
								// prendono con getRecord, e le liste con getList
			    	    		Vtecrm.app.touchRequest('SaveRecord', {
			    	    			module: 'Events',
			    	    			record: crmid,
			    	    			values: Ext.encode(values),
			    	    		}, true, function(response) {

			    	    			if (response.success) {

			    	    				if (!crmid) {
				    	    				// add a new record
				    	    				record = Ext.create('Event', {
				    	    					'crmid' : response.result.crmid,
				    	    					'smownerid' : response.result.assigned_user_id,
				    	    					'allday' : response.result.is_all_day_event,
				    	    					'mine' : (response.result.assigned_user_id == current_user.userid),
				    	    					'css' : 'mine',
				    	    					'style': '',
				    	    				});
				    	    			}

			    	    				// update the record now
			    	    				qcreate.hide();
			    	    				// update in the store as well, and refresh the view
					    	    		record.set('title', values['subject']);
					    	    		record.set('description', values['description']);
					    	    		record.set('allday', values['is_all_day_event']);
					    	    		if (values['time_start']) {
					    	    			var dstart = Ext.Date.parse(values['date_start'].substr(0, 10)+' '+values['time_start'], 'Y-m-d H:i');
					    	    			var dend = Ext.Date.parse(values['due_date'].substr(0, 10)+' '+values['time_end'], 'Y-m-d H:i');
					    	    		} else {
					    	    			var dstart = Ext.Date.parse(values['date_start'].substr(0, 10), 'Y-m-d');
					    	    			var dend = Ext.Date.parse(values['due_date'].substr(0, 10), 'Y-m-d');

					    	    		}
					    	    		record.set('start', dstart);
				    	    			record.set('end', dend);

				    	    			if (!crmid) {
				    	    				touchStore.add(record);
				    	    				touchStoreDay.add(record);
				    	    			}

					    	    		// TODO: avoid the scroll
					    	    		touchCalendarDay.refreshAll();
					    	    		touchCalendar.refreshAll();
			    	    			} else {
			    	    				Ext.Msg.alert(LANG.error, response.error);
			    	    			}

			    	    		});

			    	    	}
			    	    },
			    	]
			    },
			    {
			    	xtype: 'fieldset',
			    	flex: 1,
			    	padding: '20px',
			    	scrollable: true,
			    	defaults: {
			    		'verticalLayout': true,
			    	},
			    	items: [
			    	    {
			    	    	itemId: 'eventSubject',
			    	    	xtype: 'textfield',
			    	    	label : LANG.subject,
			    	    	value: subject,
			    	    },
			    	    {
			    	    	itemId: 'eventDescription',
			    	    	xtype: 'longtextareafield',
			    	    	label : LANG.description,
			    	    	value: description,
			    	    },
			    	    {
			    	    	itemId: 'eventStartDateTime',
			    	    	xtype: 'datetimepickerfield',
			    	    	label: LANG.begin,
			    	    	value: event_start,
			    	    	hidden: allday,
			    	    	listeners: {
			    	    		change: function(self, value) {
			    	    			var s2 = qcreate.down('#eventEndDateTime'),
			    	    				s4 = qcreate.down('#eventEndDate');
			    	    				s2value = s2.getValue();

			    	    			if (value >= s2value) {
			    	    				// add 1 hour
			    	    				var endval = Ext.Date.add(value, Ext.Date.HOUR, 1);
			    	    				s2.setValue(endval);
			    	    				s4.setValue(endval);
			    	    			}
			    	    		}
			    	    	}
			    	    },
			    	    {
			    	    	itemId: 'eventEndDateTime',
			    	    	xtype: 'datetimepickerfield',
			    	    	label: LANG.end,
			    	    	value: event_end,
			    	    	hidden: allday,
			    	    },
			    	    {
			    	    	itemId: 'eventStartDate',
			    	    	xtype: 'datepickerfield',
			    	    	label: LANG.begin,
			    	    	value: event_start,
			    	    	hidden: !allday,
			    	    	listeners: {
			    	    		change: function(self, value) {
			    	    			var s2 = qcreate.down('#eventEndDateTime'),
			    	    				s3 = qcreate.down('#eventStartDate'),
			    	    				s4 = qcreate.down('#eventEndDate');
			    	    				s4value = s4.getValue();

			    	    			if (value >= s4value) {
			    	    				// add 1 hour
			    	    				var endval = Ext.Date.add(value, Ext.Date.DAY, 1);
			    	    				s2.setValue(endval);
			    	    				s4.setValue(endval);
			    	    			}
			    	    		}
			    	    	}

			    	    },
			    	    {
			    	    	itemId: 'eventEndDate',
			    	    	xtype: 'datepickerfield',
			    	    	label: LANG.end,
			    	    	value: event_end,
			    	    	hidden: !allday
			    	    },
			    	    {
			    	    	itemId: 'eventAllDay',
			    	    	xtype: 'checkboxfield',
			    	    	label: LANG.all_day,
			    	    	checked: !!allday,
			    	    	listeners: {
			    	    		change: function(self, value) {
			    	    			var s1 = qcreate.down('#eventStartDateTime'),
			    	    				s2 = qcreate.down('#eventEndDateTime'),
			    	    				s3 = qcreate.down('#eventStartDate'),
			    	    				s4 = qcreate.down('#eventEndDate');

			    	    			s1[value ? 'hide' : 'show']();
			    	    			s2[value ? 'hide' : 'show']();
			    	    			s3[value ? 'show' : 'hide']();
			    	    			s4[value ? 'show' : 'hide']();
			    	    			if (value) {
			    	    				s3.setValue(s1.getValue());
			    	    				s4.setValue(s2.getValue());
			    	    			} else {
			    	    				s1.setValue(s3.getValue());
			    	    				s2.setValue(s4.getValue());
			    	    			}
			    	    		}
			    	    	}
			    	    }
			    	]
			    }
			],
			listeners: {
				hide: function(self) {
					self.quickDestroy();
				}
			}

		});

		Ext.Viewport.add(qcreate);
	},




});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * Global Search
 */
Ext.define('Vtecrm.view.GlobalSearch', {
	extend: 'Ext.Panel',

	config: {

		/**
		 *
		 */
		itemId: 'globalSearch',

		/**
		 *
		 */
		centered: true,

		/**
		 *
		 */
		modal: true,

		/**
		 *
		 */
		hideOnMaskTap: true,

		/**
		 *
		 */
		zIndex: 50,

		/**
		 *
		 */
		padding: '8px',

		/**
		 *
		 */
		minWidth: '300px',

		/**
		 *
		 */
		width: '60%',

		/**
		 *
		 */
		maxWidth: '500px',

		/**
		 * @hide
		 */
		items: [
		    {
		    	xtype: 'label',
		    	html: LANG.what_to_search,
		    	margin: '4px',
		    },
		    {
		    	xtype: 'fieldset',
		    	items: [
		    	    {
		    	    	itemId: 'globalSearchField',
		    	    	xtype: 'searchfield',

		    	    }
		    	]

		    },
		    {
		    	xtype: 'container',
		    	itemId: 'globalSearchWhere',
		    	hidden: true,
		    	layout: {
		    		type: 'hbox',
		    		align: 'center',
		    		//pack: 'stretch',
		    	},
		    	defaults: {
		    		xtype: 'button',
		    		margin: (Ext.os.is.Phone ? '2px' : '4px'),
		    		flex: 1,
		    		ui: 'action',
		    		cls: (Ext.os.is.Phone ? 'text-nowrap': ''), // ?? not working?
		    	},
		    	items: [
		    	    {
		    	    	xtype: 'label',
		    	    	html: LANG.where+'?',
		    	    	margin: '4px',
		    	    	docked: 'top',
		    	    },
		    	    {
		    	    	itemId: 'btnEverywhere',
		    	    	xtype: 'button',
		    	    	text: LANG.all_the_crm,
		    	    },
		    	    {
		    	    	itemId: 'btnArea',
		    	    	text: LANG.area,
		    	    	hidden: true,
		    	    },
		    	    {
		    	    	itemId: 'btnModule',
		    	    	text: LANG.module,
		    	    }

		    	]
		    }
		],

		/**
		 * @hide
		 */
		listeners: {
			// not called, why??
			/*show: function(self) {

			}*/
		},

		/**
		 * @hide
		 */
		control: {
			'#globalSearchField' : {
				action: function(self, e) {
					this.showWhere();
				},
				clearicontap: function(self) {
					this.hideWhere();
				},
				keyup: function(self) {
					if (self.getValue() == '') {
						this.hideWhere();
					}
				}
			},

			'#btnEverywhere': {
				tap: function() {
					this.doSearch('everywhere');
				}
			},

			'#btnArea': {
				tap: function() {
					this.onButtonArea();
				}
			},

			'#btnModule': {
				tap: function() {
					this.onButtonModule();
				}
			},
		}

	},

	/**
	 * Sets the focus on the search field
	 */
	focus: function() {
		var me = this,
			field = me.down('#globalSearchField');
		field.focus();
	},

	/**
	 * Hides the "where" panel
	 */
	hideWhere: function() {
		var me = this,
		where = me.down('#globalSearchWhere'),
		anim = (CONFIG.enable_animations ? {type: 'fadeOut'} : null);

		where.hide(anim);
	},

	/**
	 * Shows the "where" panel
	 */
	showWhere: function() {
		var me = this,
			areas = Vtecrm.app.getAreas(),
			btnArea = me.down('#btnArea'),
			where = me.down('#globalSearchWhere'),
			anim = (CONFIG.enable_animations ? {type: 'fade'} : null);

		if (areas) {
			btnArea.show();
		}
		where.show(anim);
	},

	/**
	 * Called when the Area button is tapped
	 */
	onButtonArea: function() {
		var me = this,
			btnArea = me.down('#btnArea'),
			areas = Vtecrm.app.getAreas();

		if (!areas) return; // shouldn't arrive here

		// create panel with list for areas
		var panel = Ext.create('Ext.Panel', {
			modal: true,
			left: '0px',
			minWidth: '250px',
			width: '40%',
			maxWidth: '400px',

			zIndex: 52,
			hideOnMaskTap: true,
			items: [
			    {
			    	xtype: 'list',
			    	itemTpl: '{label}<br><span class="areaListModules">({[Ext.Array.pluck(values.modules, "label").join(", ")]})</span>',
			    	minHeight: '200px',
			    	height: '50%',
			    	maxHeight: '300px',
			    	data: areas,
			    	listeners: {
			    		itemtap: function(list, index, target, record) {
			    			var areaid = record.get('areaid');
			    			panel.hide();
			    			me.doSearch('area', areaid);
			    		}
			    	}
			    }
			],
			listeners: {
				hide: function(self) {
					self.destroy();
				}
			}
		});


		panel.showBy(btnArea, 'cc-cc');
	},

	/**
	 * Called when the Module button is tapped
	 */
	onButtonModule: function() {
		var me = this,
			store = Ext.getStore('modulesStoreOffline'),
			btnArea = me.down('#btnArea'),
			btnModule = me.down('#btnModule'),
			list = [];

		store.each(function(record) {
			var modname = record.get('view');
			if (record.get('tabid') > 0 && modname != 'Messages')
				list.push({
					'module': modname,
					'label' : record.get('label')
				});
		});

		// create panel with list for areas
		var panel = Ext.create('Ext.Panel', {
			modal: true,
			left: '0px',
			minWidth: '250px',
			width: '30%',
			maxWidth: '400px',

			zIndex: 52,
			hideOnMaskTap: true,
			items: [
			    {
			    	xtype: 'list',
			    	itemTpl: '{label}',
			    	minHeight: '250px',
			    	height: '50%',
			    	maxHeight: '400px',
			    	data: list,
			    	listeners: {
			    		itemtap: function(list, index, target, record) {
			    			var module = record.get('module');
			    			panel.hide();
			    			me.doSearch('modules', module);
			    		}
			    	}
			    }
			],
			listeners: {
				hide: function(self) {
					self.destroy();
				}
			}
		});

		panel.showBy(btnArea, 'cc-cc');
	},


	/**
	 * Starts the search
	 */
	doSearch: function(where, whereid) {
		var me = this,
			sfield = me.down('#globalSearchField'),
			search = sfield.getValue();

		var listpanel = Ext.create('Ext.Panel',{
			itemId: '#panelGlobalSearchResults',
			width: '90%',
			height: '90%',
			centered: true,
			modal: true,
			hideOnMaskTap: true,
			layout: 'fit',
			zIndex: 52,
			items: [
			    {
			    	xtype: 'titlebar',
			    	ui: 'light',
			    	docked: 'top',
			    	items: [
			    	    {
			    	    	xtype: 'button',
			    	    	text: LANG.end,
			    	    	handler: function(self) {
			    	    		listpanel.hide();
			    	    	}
			    	    }
			    	]
			    },
			    {
			    	xclass:'Vtecrm.view.ListRecords',
			    	flex: 1,
			    	isPopup: true,
			    	showModuleName: false,
			    	groupByModule: true,
					ajaxParams: {
						'where' : where,
						'areaid' : whereid,
						'modules': whereid,
						'search': search,
					}
			    }
			],
			listeners: {
				hide: function(self) {
					self.destroy;
				}
			}
		});

		var list = listpanel.down('#listRecords');

		list.load();
		Ext.Viewport.add(listpanel);
		me.destroy();

	}

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * Store that can read data from remote source (via Ajax calls) or from local WebSQL database
 *
 */
Ext.define('Vtecrm.store.VteOnlineOffline', {
    extend: 'Ext.data.Store',

    alias: "store.VteOnlineOffline",

    config: {
    	model: null,

    	// true to use local cache
    	offline: false,
    	// after load go offline
    	offlineOnLoad: false,

    	proxy: {

    	},

    	onlineProxy: {
    		type: "ajax",
    		url: null,
    		reader: 'json'
    	},

    	offlineProxy: {
    		type: 'WebSQL',
    		table: null,
    	},

    	listeners: {
   	    	load: function(self) {
   	    		if (self.getOfflineOnLoad()) self.goOffline();
   	    	}

    		// offlinedone(self)
   	    }

    },

    constructor: function(config) {
    	var offline = config.offline || this.config.offline,
    		online_proxy = config.onlineProxy || this.config.onlineProxy,
    		offline_proxy = config.offlineProxy || this.config.offlineProxy;

    	// imposto il proxy iniziale
    	if (offline) {
    		config.proxy = this.config.proxy = offline_proxy;
    	} else {
    		config.proxy = this.config.proxy = online_proxy;
    	}

    	// costruisco in modo standard
    	this.callParent(arguments);

    	// e copio le istanze delle classi nei posti giusti
    	if (offline) {
    		this.setOfflineProxy(this.getProxy());
        	this.setOnlineProxy(Ext.factory(this.config.onlineProxy, null, null, 'proxy'));
    	} else {
    		this.setOnlineProxy(this.getProxy());
        	this.setOfflineProxy(Ext.factory(this.config.offlineProxy, null, null, 'proxy'));
    	}

    	// impostazione modelli
    	if (!this.getOnlineProxy().getModel()) this.getOnlineProxy().setModel(this.getModel());
    	if (!this.getOfflineProxy().getModel()) this.getOfflineProxy().setModel(this.getModel());

    	// ugly fix for the table.
    	// TODO: capire perchè non va
    	if (this.config.offlineProxy.table) {
    		this.getOfflineProxy().setTable(this.config.offlineProxy.table);
    	}
    },

    // TODO: finire
    goOnline: function() {

    	// già online
    	if (!this.getOffline()) return;

    	this.setOffline(false);
    	this.setProxy(this.getOnlineProxy());
    },

    goOffline: function() {
    	var me = this,
    		operation,
    		options = {},
    		currentPage = me.currentPage,
            pageSize = me.getPageSize(),
            orecords = me.getData();

    	// già offline
    	if (this.getOffline()) return;

    	this.setOffline(true);

    	//this.setProxy(this.getOfflineProxy()); // non va così
    	this._proxy = this.getOfflineProxy();

    	if (me.getRemoteSort()) {
            options.sorters = options.sorters || this.getSorters();
        }

        if (me.getRemoteFilter()) {
            options.filters = options.filters || this.getFilters();
        }

        if (me.getRemoteGroup()) {
            options.grouper = options.grouper || this.getGrouper();
        }

    	Ext.applyIf(options, {
            page: currentPage,
            start: (currentPage - 1) * pageSize,
            limit: pageSize,
            addRecords: true,
            action: 'read',
            model: this.getModel(),
            records: orecords,
        });

    	operation = Ext.create('Ext.data.Operation', options);
    	me.getProxy().create(operation, function(a,b,c) {
    		me.onOfflineDone(me);
    	}, me);
    },

    onOfflineDone: function(self) {
    	self.fireEvent('offlinedone', self);
    }

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

// TODO: unificare con lista standard
/**
 * List of favourites records (global or for a single module).
 * This class will probably be removed and merged with the more generic ListRecords in the future.
 */
Ext.define('Vtecrm.view.ListFavourites', {
	extend: 'Ext.List',

    alias: "view.ListFavourites",

    config: {

    	/**
    	 *
    	 */
    	itemId: 'listFavourites',

    	/**
    	 * @hide
    	 */
    	width: '100%',

    	/**
    	 * @hide
    	 */
    	height: '100%',

    	/**
    	 * @hide
    	 */
    	fullscreen: true,

    	/**
    	 *
    	 */
    	itemTpl: '{entityname}',

    	/**
    	 * @hide
    	 */
    	scrollable: true,

    	/**
    	 * @hide
    	 */
    	hidden: true,

    	/**
    	 *
    	 */
    	loadingText: LANG.loading,

    	/**
    	 * @hide
    	 */
    	deferEmptyText: true,

    	/**
    	 *
    	 */
    	emptyText: '<p align="center">'+LANG.no_records+'</p>',


    	// custom

    	/**
    	 * True if the list is inside a popup
    	 */
    	isPopup: false,

    	/**
    	 * The module
    	 */
    	module: undefined,

    	/**
    	 * If true, shows the module name next to each entry
    	 */
    	showModuleName: false,

    	/**
    	 *
    	 */
    	searchString: '',

    	/**
    	 * The name of the semaphore for the end of loading
    	 * TODO: handle this with events
    	 * @hide
    	 */
    	loadSemaphore: null,

    	/**
    	 * @hide
    	 */
    	store: {
    		xclass: 'Vtecrm.store.VteOnlineOffline',
    		model: 'Vtecrm.model.VteFavourite',
			autoLoad: false,
			offline: (CONFIG.app_offline == 1),
			onlineProxy: {
				type: "ajax",
	    		url: vtwsUrl + "ws.php?wsname=GetFavorites",
	       	    extraParams: params_unserialize(vtwsOpts),
	   			reader: 'json',
	   			actionMethods: {read: 'POST'},
	   			listeners: {
	   				// json decoding error
	   				exception: function(reader,response,error,opts) {
	   					Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
			    		unMaskView();
						return false;
					},
	   			}
			},
			offlineProxy: {
				type: 'WebSQL',
				table: 'crmentity'
			},

			listeners: {
				beforeload: function(store) {
					var list = this.listObject;

					if (list && list.getModule && !empty(list.getModule())) {
						var mod = list.getModule(),
							search = list.getSearchString();

						list.deselectAll(false);
	    		    	store.clearFilter(false);
	    		    	store.setFilters([{
	    		    		property: 'module',
	    		    		value: mod
	    		    	},{
	    		    		property: 'entityname',
	    		    		value: search,
	    		    		anyMatch: true,
	    		    	}]);
					} else {
						list.deselectAll(false);
	    		    	store.clearFilter(false);
					}
				},

				load: function(store, records) {
					var list = this.listObject;
					if (list && list.getLoadSemaphore()) {
						var sem = findSemaphore(list.getLoadSemaphore());
						if (sem) {
							sem.go();
						} else {
							console.log('ERROR: Semaphore not found');
						}
					}
				}

			}
    	},


    	/**
    	 * @hide
    	 */
    	listeners: {

    		itemtap: function(self, index, target, record, e) {
    			var mod = record.get('module');
    			if (empty(mod)) mod = this.getModule();
    			if (empty(mod)) return;
    			Vtecrm.app.showRecord(mod, record.get('crmid'), record.get('entityname'));

    			// nascondo il popup?
    			if (self.getIsPopup() && self.getParent()) {
    				self.getParent().hide();
    			}
    		}
    	}
    },

    constructor: function() {
    	this.callParent(arguments);

    	if (this.getShowModuleName()) {
    		this.setItemTpl(this.getModTemplate());
    	}

    	// trick to save the list instance in the store
    	this.getStore().listObject = this;
    },

    /**
     * Creates the template for the list
     * @return {Ext.XTemplate}
     */
    getModTemplate: function() {
    	var tpl;

    	if (Ext.os.is.Phone) {
    		tpl= new Ext.XTemplate(
   					'<div><span class="listIcon {module:this.maskMod}"></span> {entityname}</div>',
    	    		{
    	    			maskMod: function(mod) {
    	    				var maskname = 'mask-mod-'+mod;
    	    				if (Vtecrm.app.moduleIconsCss && Vtecrm.app.moduleIconsCss.indexOf('.'+maskname) == -1) {
    							maskname = 'mask-mod-Generic';
    						}
    	    				return maskname;
    	    			}
    	    		}
    		    );
    	} else {
    		tpl= new Ext.XTemplate(
    		    	'<div style="width: 100%; clear:both">',
    					'<div style="text-align:left;float:left;clear:left">{entityname}</div>',
    					'<div style="text-align:right;float:right;clear:right; color:#A0A0A0"><b>{module:this.transModule}</b></div>',
    				'</div>',
    	    		{
    	    			transModule: function(mod) {
    	    				return Vtecrm.app.translateString('SINGLE_'+mod);
    	    			},
    	    		}
    		);
    	}

    	return tpl;
    },

    /**
     * Loads the store
     */
    loadStore: function() {
    	this.getStore().load();
    },

    /**
     * Starts the research
     */
    goSearch: function(oldval, newval) {
    	var me = this,
    		module = me.getModule(),
    		store = me.getStore();

    	me.setSearchString(newval);

    	if (newval && module) {
    		store.clearFilter();
    		store.setFilters([{
    			property: 'module',
    			value: module
    		},{
    			property: 'entityname',
    			value: newval,
    			anyMatch: true,
    		}]);
    		store.filter();
    	} else if (module){
    		store.clearFilter();
    		store.setFilters({
    			property: 'module',
    			value: module
    		});
    		store.filter();
    	} else {
    		store.clearFilter();
    	}
    }

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

// TODO: unificare con lista standard
/**
 * List of recent records.
 * This component will be merged into Vtecrm.view.ListRecords in the near future
 */
Ext.define('Vtecrm.view.ListRecents', {
	extend: 'Ext.List',

    alias: "view.ListRecents",

    config: {
    	/**
    	 *
    	 */
    	itemId: 'listRecents',

    	/**
    	 * @hide
    	 */
    	width: '100%',

    	/**
    	 * @hide
    	 */
    	height: '100%',

    	/**
    	 *
    	 */
    	itemTpl: '{entityname}',

    	/**
    	 * True if this list is inside a popup
    	 */
    	isPopup: false,

    	/**
    	 * @hide
    	 */
    	scrollable: true,

    	/**
    	 * @hide
    	 */
    	fullscreen: true,

    	/**
    	 * @hide
    	 */
    	hidden: true,

    	/**
    	 * @hide
    	 */
    	deferEmptyText: true,

    	/**
    	 *
    	 */
    	emptyText: '<p align="center">'+LANG.no_records+'</p>',

    	/**
    	 *
    	 */
    	loadingText: '',

    	// custom

    	/**
    	 * The module
    	 */
    	module: undefined,

    	/**
    	 * If true, shows the name of the current module
    	 */
    	showModuleName: false,

    	/**
    	 * @hide
    	 * The name of the semaphore for the end of loading
    	 */
    	loadSemaphore: null,

    	/**
    	 *
    	 */
    	searchString: '',

    	/**
    	 * @hide
    	 */
    	store: {
    		xclass: 'Vtecrm.store.VteOnlineOffline',
    		model: 'Vtecrm.model.VteFavourite',
			autoLoad: false,
			offline: (CONFIG.app_offline == 1),
			onlineProxy: {
				type: "ajax",
	    		url: vtwsUrl + "ws.php?wsname=GetRecents",
	       	    extraParams: params_unserialize(vtwsOpts),
	   			reader: 'json',
	   			actionMethods: {read: 'POST'},
	   			listeners: {
	   				// json decoding error
	   				exception: function(reader,response,error,opts) {
	   					Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
			    		unMaskView();
						return false;
					},
	   			}
			},
			offlineProxy: {
				type: 'WebSQL',
				table: 'crmentity'
			},

			listeners: {

				beforeload: function(store) {
					var list = this.listObject;

					// gestione offline/online
					/*if (CONFIG.app_offline) {
						store.goOffline();
					} else {
						store.goOnline();
					}*/
					if (list && list.getModule && !empty(list.getModule())) {
						var mod = list.getModule(),
							search = list.getSearchString();

						list.deselectAll(false);
	    		    	store.clearFilter(false);
	    		    	store.setFilters([{
	    		    		property: 'module',
	    		    		value: mod
	    		    	},{
	    		    		property: 'entityname',
	    		    		value: search,
	    		    		anyMatch: true,
	    		    	}]);
					} else if (list) { // no module [no search]
						list.deselectAll(false);
	    		    	store.clearFilter(false);
					}
				},

				load: function(store, records) {
					var list = this.listObject;
					if (list && list.getLoadSemaphore()) {
						var sem = findSemaphore(list.getLoadSemaphore());
						if (sem) {
							sem.go();
						} else {
							console.log('ERROR: Semaphore not found');
						}
					}
				}
			}
    	},

    	/**
    	 * @hide
    	 */
    	listeners: {
    		itemtap: function(self, index, target, record, e) {
    			var mod = record.get('module');
    			if (empty(mod)) mod = this.getModule();
    			if (empty(mod)) return;
    			Vtecrm.app.showRecord(mod, record.get('crmid'), record.get('entityname'));

    			// nascondo il popup?
    			if (self.getIsPopup() && self.getParent()) {
    				self.getParent().hide();
    			}
    		}
    	}

    },

    constructor: function() {
    	this.callParent(arguments);

    	if (this.getShowModuleName()) {
    		this.setItemTpl(this.getModTemplate());
    	}

    	// trick to save the list instance in the store
    	this.getStore().listObject = this;
    },

    /**
     * Returns the template for the list
     */
    getModTemplate: function() {
    	var tpl;

    	if (Ext.os.is.Phone) {
    		tpl= new Ext.XTemplate(
   					'<div><span class="listIcon {module:this.maskMod}"></span> {entityname}</div>',
    	    		{
    	    			maskMod: function(mod) {
    	    				var maskname = 'mask-mod-'+mod;
    	    				if (Vtecrm.app.moduleIconsCss && Vtecrm.app.moduleIconsCss.indexOf('.'+maskname) == -1) {
    							maskname = 'mask-mod-Generic';
    						}
    	    				return maskname;
    	    			}
    	    		}
    		    );
    	} else {
    		tpl= new Ext.XTemplate(
    		    	'<div style="width: 100%; clear:both">',
    					'<div style="text-align:left;float:left;clear:left">{entityname}</div>',
    					'<div style="text-align:right;float:right;clear:right; color:#A0A0A0"><b>{module:this.transModule}</b></div>',
    				'</div>',
    	    		{
    	    			transModule: function(mod) {
    	    				return Vtecrm.app.translateString('SINGLE_'+mod);
    	    			},
    	    		}
    		);
    	}

    	return tpl;
    },

    /**
     * Loads the store
     */
    loadStore: function() {
    	this.getStore().load();
    },

    /**
     * Starts the research
     */
    goSearch: function(oldval, newval) {
    	var me = this,
    		module = me.getModule(),
    		store = me.getStore();

    	me.setSearchString(newval);

    	if (newval && module) {
    		store.clearFilter();
    		store.setFilters([{
    			property: 'module',
    			value: module
    		},{
    			property: 'entityname',
    			value: newval,
    			anyMatch: true,
    		}]);
    		store.filter();
    	} else if (module){
    		store.clearFilter();
    		store.setFilters({
    			property: 'module',
    			value: module
    		});
    		store.filter();
    	} else {
    		store.clearFilter();
    	}
    }

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

// TODO: unificare con lista standard
/**
 * List of related records.
 * This list will be merged with the more generic Vtecrm.view.ListRecords in the future.
 */
Ext.define('Vtecrm.view.ListLinked', {
	extend: 'Ext.List',

    config: {

    	/**
    	 *
    	 */
    	itemId: 'listLinked',
    	/**
    	 *
    	 */
    	itemTpl: '{entityname}',

    	/**
    	 * @hide
    	 */
    	scrollable: true,

    	/*
    	 *
    	 */
    	loadingText: LANG.loading,

    	/**
    	 * @hide
    	 */
    	deferEmptyText: true,

    	/**
    	 *
    	 */
    	emptyText: '<p align="center">'+LANG.no_records+'</p>',


    	// custom

    	/**
    	 * Set this to true if the list is shown inside a popup
    	 */
    	isPopup: false,

    	/**
    	 * The module
    	 */
    	module: null,

    	/**
    	 * The parent crmid
    	 */
    	crmid: null,

    	/**
    	 * If true, shows the module name
    	 */
    	showModuleName: true,

    	// il nome del semaphoro per la fine del caricamento
    	/**
    	 * @hide
    	 */
    	loadSemaphore: null,

    	/**
    	 * @hide
    	 */
    	store: {
    		model: 'Vtecrm.model.VteFavourite',
			autoLoad: false,
			proxy: {
        		type: "ajax",
        		url: vtwsUrl + "ws.php?wsname=GetLinkedRecords",
       			actionMethods: {read: 'POST'},
        		reader: {
        			type: 'json',
        			rootProperty: "entries",
        		    totalProperty: "total"
        		},
        		listeners: {
        			// json decoding error
        			exception: function(reader,response,error,opts) {
   						Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
   						unMaskView();
   						return false;
   					},
        		}
        	},
        	listeners: {
        		beforeload: function(self) {
        			var list = self.listObject,
        				proxy = self.getProxy();

        			maskView();
        			self.setPageSize(CONFIG.list_page_limit);
        			proxy.setExtraParams(params_unserialize(vtwsOpts+"module="+list.getModule()+"&recordid="+list.getCrmid()));
        		},
        		load: function(self) {
        			unMaskView();
        		}
        	},

    	},

    	/**
    	 * @hide
    	 */
    	listeners: {

    		itemtap: function(self, index, target, record, e) {
    			var mod = record.get('module');
    			if (empty(mod)) mod = this.getModule();
    			if (empty(mod)) return;
    			Vtecrm.app.showRecord(mod, record.get('crmid'), record.get('entityname'));

    			// nascondo il popup?
    			if (self.getIsPopup() && self.getParent()) {
    				self.getParent().hide();
    			}
    		}
    	}
    },

    constructor: function() {
    	this.callParent(arguments);

    	if (this.getShowModuleName()) {
    		this.setItemTpl(this.getModTemplate());
    	}

    	// trick to save the list instance in the store
    	this.getStore().listObject = this;
    },

    /**
     * Returns the new template for the list
     * @return {Ext.XTemplate}
     */
    getModTemplate: function() {
    	var tpl;

    	if (Ext.os.is.Phone) {
    		tpl = new Ext.XTemplate(
   					'<div><span class="listIcon {module:this.maskMod}"></span> {entityname}</div>',
    	    		{
    	    			maskMod: function(mod) {
    	    				var maskname = 'mask-mod-'+mod;
    	    				if (Vtecrm.app.moduleIconsCss && Vtecrm.app.moduleIconsCss.indexOf('.'+maskname) == -1) {
    							maskname = 'mask-mod-Generic';
    						}
    	    				return maskname;
    	    			}
    	    		}
    		    );
    	} else {
    		tpl = new Ext.XTemplate(
    		    	'<div style="width: 100%; clear:both">',
    					'<div style="text-align:left;float:left;clear:left">{entityname}</div>',
    					'<div style="text-align:right;float:right;clear:right; color:#A0A0A0"><b>{module:this.transModule}</b></div>',
    				'</div>',
    	    		{
    	    			transModule: function(mod) {
    	    				return Vtecrm.app.translateString('SINGLE_'+mod);
    	    			},
    	    		}
    		);
    	}

    	return tpl;
    },

    /**
     * Loads the store
     */
    loadStore: function() {
    	this.getStore().load();
    },

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * Generic list that shows records. This list will be used in the future to display many types of lists.
 *
 */
Ext.define('Vtecrm.view.ListRecords', {
	extend: 'Ext.List',

    config: {

    	/**
    	 *
    	 */
    	itemId: 'listRecords',

    	/**
    	 *
    	 */
    	flex: 1,

    	/**
    	 *
    	 */
    	itemTpl: '{entityname}',

    	/**
    	 * @hide
    	 */
    	deferEmptyText: true,

    	/**
    	 *
    	 */
    	emptyText: '<p align="center">'+LANG.no_records+'</p>',

    	/**
    	 *
    	 */
    	loadingText: '',

    	// custom

    	/**
    	 * If true, the list is in a popup, and when hid, the parent container is also hid
    	 */
    	isPopup: false, // if true, hide the parent element on click

    	/**
    	 *
    	 */
    	module: undefined,

    	/**
    	 * If true, shows the module name next to the record name
    	 */
    	showModuleName: false,

    	/**
    	 * The search string
    	 */
    	searchString: '',

    	/**
    	 * If true, records of the same module will be grouped together
    	 */
    	groupByModule: false,

    	/**
    	 * @private
    	 * The webservice name that will be called to retrieve the results
    	 */
    	wsName: 'GlobalSearch',

    	/**
    	 * @private
    	 */
    	ajaxParams: {},

    	/**
    	 * @hide
    	 */
    	store: {
    		model: 'Vtecrm.model.VteFavourite', // generic record class, should be renamed
    		autoLoad: false,
    		proxy: {
				type: "ajax",
	    		url: null, // to be set before load
	   			actionMethods: {read: 'POST'},
	   			reader: {
        			type: 'json',
        			rootProperty: "entries",
        		    totalProperty: "total",
        		},
	   			listeners: {
	   				// json decoding error
	   				exception: function(reader,response,error,opts) {
	   					Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
			    		unMaskView();
						return false;
					},
	   			}
			},
    	},

    	/**
    	 * @hide
    	 */
    	listeners: {
    		itemtap: function(self, index, target, record, e) {
    			var me = this,
    				mod = record.get('module') || me.getModule();

    			if (empty(mod)) return;
    			Vtecrm.app.showRecord(mod, record.get('crmid'), record.get('entityname'));

    			// nascondo il popup?
    			if (self.getIsPopup() && self.getParent()) {
    				self.getParent().hide();
    			}
    		}
    	}

    },

    // inject a reference to this list in the store
    updateStore: function(store, oldStore) {
    	var me = this;
    	store.listObject = this;
    	if (store) {
    		store.on({
                beforeload: 'onStoreBeforeLoad',
                load: 'onStoreLoad',
                scope: this
            });
    	} else if (oldStore) {
    		oldStore.un({
                beforeload: 'onStoreBeforeLoad',
                load: 'onStoreLoad',
                scope: this
            });
    	}

    	if (me.getGroupByModule()) {
    		me.setGrouped(true);
    		store.setGrouper({
    			groupFn: function(record) {
                    return Vtecrm.app.getModuleLabel(record.get('module'));
                },
    		});
    	}
    },

    updateShowModuleName: function(show) {
    	var me = this;

    	if (show) {
    		me.setItemTpl(me.getModTemplate());
    	}
    },

    onStoreBeforeLoad: function(store) {
    	var me = this,
    		proxy = store.getProxy();

    	if (proxy) {
    		// set connection parameters
    		proxy.setUrl(vtwsUrl + 'ws.php?wsname='+me.getWsName());
    		proxy.setExtraParams(Ext.merge(me.getAjaxParams(), params_unserialize(vtwsOpts)));
    	}

    	me.deselectAll(false);
    	store.clearFilter(false);
    	maskView(LANG.search+'...');
    },

    /**
     * Called when the store has finished loading
     */
    onStoreLoad: function(store, records) {
    	var me = this;
    	unMaskView();

    },

    /**
     * Loads the store
     */
    load: function() {
    	this.getStore().load();
    },

    /**
     * Creates the template for the list
     * @return {Ext.XTemplate}
     */
    getModTemplate: function() {
    	var tpl;

    	if (Ext.os.is.Phone) {
    		tpl= new Ext.XTemplate(
   					'<div><span class="listIcon {module:this.maskMod}"></span> {entityname}</div>',
    	    		{
    	    			maskMod: function(mod) {
    	    				var maskname = 'mask-mod-'+mod;
    	    				if (Vtecrm.app.moduleIconsCss && Vtecrm.app.moduleIconsCss.indexOf('.'+maskname) == -1) {
    							maskname = 'mask-mod-Generic';
    						}
    	    				return maskname;
    	    			}
    	    		}
    		    );
    	} else {
    		tpl= new Ext.XTemplate(
    		    	'<div style="width: 100%; clear:both">',
    					'<div style="text-align:left;float:left;clear:left">{entityname}</div>',
    					'<div style="text-align:right;float:right;clear:right; color:#A0A0A0"><b>{module:this.transModule}</b></div>',
    				'</div>',
    	    		{
    	    			transModule: function(mod) {
    	    				return Vtecrm.app.translateString('SINGLE_'+mod);
    	    			},
    	    		}
    		);
    	}

    	return tpl;
    },


    /**
     * Starts the research
     */
    goSearch: function(oldval, newval) {
    	var me = this,
    		module = me.getModule(),
    		store = me.getStore();

    	me.setSearchString(newval);

    	if (newval && module) {
    		store.clearFilter();
    		store.setFilters([{
    			property: 'module',
    			value: module
    		},{
    			property: 'entityname',
    			value: newval,
    			anyMatch: true,
    		}]);
    		store.filter();
    	} else if (module){
    		store.clearFilter();
    		store.setFilters({
    			property: 'module',
    			value: module
    		});
    		store.filter();
    	} else {
    		store.clearFilter();
    	}
    }

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * @class Vtecrm.field.Phone
 *
 * Field which displays a phone number and when tapped, starts a phone call
 *
 * Calls are enabled for all devices other than iPad
 */
Ext.define('Vtecrm.field.Phone', {
    extend: 'Ext.field.Text',
    xtype: 'phonefield',
    alternateClassName: 'Ext.form.Phone',

    config: {

    },

    constructor: function(config) {
    	if (Ext.os.is.iPad != true) {
    		config.button = true;
    		config.buttonCls = 'phone1';
    	}

    	this.callParent([config]);

    	if (Ext.os.is.iPad != true) {
    		this.on({
    			buttontap: 'onPhoneButtonTap'
    		});
    	}
    },

    /**
     * @private
     */
    onPhoneButtonTap: function() {
    	var val = this.getValue();
		if (!empty(val)) {
			location.href = 'tel:'+val;
		}
    }

});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * @class Vtecrm.field.MailButton
 *
 * A field which displays an email address and open the device mail composer when tapped
 */
Ext.define('Vtecrm.field.MailButton', {
    extend: 'Ext.field.Email',
    xtype: 'mailbuttonfield',
    alternateClassName: 'Ext.form.MailButton',

    config: {
    },

    constructor: function(config) {
   		config.button = true;
   		config.buttonCls = 'mail';
    	this.callParent([config]);
    	this.on({
			buttontap: 'onMailButtonTap'
		});
    },

    /**
     * @private
     */
    onMailButtonTap: function() {
    	var me = this,
    		val = me.getValue();
		if (!empty(val)) {
			location.href = 'mailto:'+val;
		}
    }

});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * @class Vtecrm.field.UrlButton
 *
 * A field which displays an url and navigate to that url when the button is pressed
 *
 */
Ext.define('Vtecrm.field.UrlButton', {
    extend: 'Ext.field.Url',
    xtype: 'urlbuttonfield',
    alternateClassName: 'Ext.form.UrlButton',

    config: {

        /**
         * @cfg [newWindow=true]
         * If true links will be open in a new window, otherwise they will be open inside the webview
         */
        newWindow: true,

        /**
         * @cfg filterFunc
         * A function to transform the appearance of the link
         */
        filterFunc: null,	// function

    },

    realValue: null,

    constructor: function(config) {
    	config.button = true;
    	config.buttonCls = 'action';
    	this.callParent([config]);
    	this.on({
			buttontap: 'onUrlButtonTap'
		});
    },

    /**
     * @private
     */
    updateValue: function(newValue) {
    	var f = this.getFilterFunc();
    	this.realValue = newValue;
    	if (typeof f == 'function') newValue = f(newValue);
    	return this.callParent(arguments);
    },

    /**
     * @private
     */
    getValue: function() {
    	var me = this;
    	me.callParent(arguments);
    	return me.realValue;
    },

    /**
     * @private
     */
    onUrlButtonTap: function() {
    	var me = this,
    		gotoaddr,
			val = me.getValue();

    	if (val.trim) val = val.trim();
    	if (!empty(val)) {
    		if (!val.match(/^(ht|f)tp(s?)\:\/\/.+/)) {
    			gotoaddr = 'http://'+val;
    		} else {
    			gotoaddr = val;
    		}
    		if (me.getNewWindow()) {
    			window.open(gotoaddr, '_system', 'location=no');
    		} else {
    			location.href = gotoaddr;
    		}
    	}
    }

});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * @class Vtecrm.field.RelatedTo
 *
 * A field which shows the name of a linked record and opens it when tapped
 */
Ext.define('Vtecrm.field.RelatedTo', {
    extend: 'Ext.field.Text',
    xtype: 'relatedtofield',

    config: {
    	clearIcon: true,

    	origReadOnly: false,

    	/**
    	 * @cfg [crmid=null]
    	 * crmid of the record
    	 */
        crmid: null,

        /**
         * @cfg {String/Array}
         * Module(s) available for this field
         */
        setype: null,	// can be an array
        allSetypes: null,

        listeners: {

        	focus: function(self, e) {
        		self.onFieldTap(self);
        		return true;
        	},

        	blur: function(self) {
        		self.tapcleared = false;
        	},

        	clearicontap: function(self) {
        		return self.onClearIconTap2(self);
        	},

           	buttontap: function(self) {
           		var me = self,
           			crmid = me.getCrmid(),
					setype = me.getSetype(),
					display = me.getValue();

           		if (crmid > 0 && !empty(setype)) {
           			Vtecrm.app.showRecord(setype, crmid, display);
           		}
            },

        }
    },

    constructor: function(config) {
    	config.button = true;
    	config.buttonCls = 'action';
    	this.callParent([config]);
    },

    onClearIconTap2: function(self) {
    	self.setCrmid(null);

    	if (self.getAllSetypes()) {
    		self.setSetype(self.getAllSetypes());
    	}

    	if (Ext.os.is.iOS) {
    		self.tapcleared = true;
    	}
    	return true;
    },

    onFieldTap: function(self, e) {
    	var setypes = self.getSetype();

    	if (self.tapcleared) {
    		self.blur();
    		return;
    	}

		if (empty(setypes) || self.getOrigReadOnly()) {
			//console.log('EMPTY SETYPE');
			return;
		}

		if (setypes && typeof setypes != 'string' && setypes.length > 1) {
			self.showModuleSelector();
		} else {
			self.showList(setypes);
		}
	},

	showModuleSelector: function() {
		var me = this,
			setypes = me.getSetype(),
			data = [];

		if (!me.modulePanel) {
			// create the records
			for (var i=0; i<setypes.length; ++i) {
				data.push({
					'value' : setypes[i],
					'title' : Vtecrm.app.translateString(setypes[i]),
				});
			}
            me.modulePanel = Ext.create('Ext.Panel', {
                centered: true,
                modal: true,
                cls: Ext.baseCSSPrefix + 'select-overlay',
                layout: 'fit',
                hideOnMaskTap: true,
                items: {
                    xtype: 'list',
                    //store: this.getStore(),
                    'data': data,
                    itemTpl: '<span class="x-list-label">{title:htmlEncode}</span>',
                    listeners: {
                        select : me.onListSelect,
                        itemtap: me.onListTap,
                        scope  : me
                    }
                }
            });
        }

        me.modulePanel.showBy(me.getComponent());
	},

	onListSelect: function(self) {
	},

	onListTap: function(self, index, target, record) {
		var me = this,
			module = (record ? record.get('value') : null);

		me.setSetype(module);
		me.modulePanel.hide();
		me.showList(module);
	},

	showList: function(module) {
		var me = this,
			newList = Ext.create('Vtecrm.view.ListSearch', {
    		'module': module,
    		toolbar: true,
    		useSearch: true,
			extraFields: (module == 'Dossier' ? ['description', 'accountid'] : []),

    		listeners: {
    			// override tap handler
    			itemtap: function(selflist, index, target, record, e) {
    				var relcrmid = record.get('crmid'),
    					entityname = record.get('entityname'),
    					showrecordcont = Vtecrm.app.historyFindLast('viewShowRecord');
						
					
    				me.setSetype(module);
    				me.setValue(entityname);
    				me.setCrmid(relcrmid);
					
					// segnalibro salvo il no azienda selezionato globalmente
					if (module == 'Accounts'){
						globalAccountSelected = entityname;
					}
    				showrecordcont.setReloadOnShow(false);
       		   		Vtecrm.app.historyBack();
    			}
    		}
    	});
    	newList.getStore().load();
    	Vtecrm.app.historyAdd(newList);
	},

    // @private
    initialize: function() {
        var me = this;

        me.initialized = false;
        me.callParent();

        // readonly trick to prevent keyboard
        me.setOrigReadOnly(me.getReadOnly());
        // force readonly
        me.setReadOnly(true);
        me.showClearIcon();
        me.initialized = true;
    },

    getReadOnly: function() {
    	var me = this;
    	if (me.initialized) {
    		return me.getOrigReadOnly();
    	} else {
    		return me.callParent();
    	}
    },

    setReadOnly: function(ro) {
    	this.callParent(arguments);

    	// also, remove/add class
    	var renderElement = this.renderElement,
			superOuter = renderElement.down('.x-component-super-outer'),
			outerCont = superOuter.child('.x-component-outer');

    	outerCont[this.getOrigReadOnly() ? 'addCls' : 'removeCls']('x-field-readonly'+ (this.getVerticalLayout() ? '-vert' : '') );
    },

    // @private
    showClearIcon: function() {
        var me = this;

        if (!me.getDisabled() && !me.getOrigReadOnly() && me.getValue() && me.getClearIcon()) {
            me.element.addCls(Ext.baseCSSPrefix + 'field-clearable');
        }

        return me;
    },


});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/* Thanks to shaneavery : http://www.sencha.com/forum/showthread.php?181809-New-quot-Multi-select-field-quot-extension-for-ST2-(RC) */
// TODO: rifare questa classe, fa un po' schifo

/**
 * @class Vtecrm.field.MultiSelect
 */
Ext.define('Vtecrm.field.MultiSelect', {
    extend: 'Ext.field.Select',
    alias : 'widget.multiselectfield',
    xtype : 'multiselectfield',

    config: {
    	usePicker : false,  //force list panel, not picker
    	showTitleBar: false,
    	showSearchField: false,
    	titleBarLabel: '',
    	okButtonLabel: LANG.done,
    	allButtonLabel: LANG.all,
    	showTotalCount: false,
    	showAllButton: true,
    	totalCountTpl: '{count} elements',
    },

    listeners: {
    	oktap: null, // preventable
    	alltap: null, // preventable
    },

    getTabletPicker: function() {  //override with modified function
        var me = this,
        	config = this.getDefaultTabletPickerConfig();
        if (!(this.listPanel)) {
            this.listPanel = Ext.create('Ext.Panel', Ext.apply({
                centered: true,
                modal: true,
                //width: '',
                height: (Ext.os.is.Phone ? '90%' : 'auto'),
                cls: Ext.baseCSSPrefix + 'select-overlay',
                layout: 'fit',
                hideOnMaskTap: true,
                items: {
                    xtype: 'list',
                    mode: 'MULTI', //set list to multi-select mode
                    store: this.getStore(),
                    //data:this.getOptions(),
                    itemTpl: '<span class="x-list-label">{' + this.getDisplayField() + ':htmlEncode}</span>',
                    listeners: {
                        select : this.onListSelect,
                        itemtap  : this.onListTap,
                        hide : this.onListHide, //new listener
                        scope  : this,
                    },
                    items: [
                        {
                        	xtype: 'titlebar',
                        	title: this.getTitleBarLabel(),
                        	docked: 'top',
                        	hidden: !(this.getShowTitleBar()),
                        	items: [
                        	    {
                        	    	itemId: 'selectSearch',
                        	    	xtype: 'searchfield',
                        	    	align: 'right',
                        	    	hidden: !(this.getShowSearchField()),
                        	    	listeners: {
                        	    		scope: me,
                        	    		keyup: this.onSearchKeyUp,
                        	    		clearicontap: this.onSearchKeyUp,
                        	    	}
                        	    }
                        	]
                        },
                        { //new button to trigger formatting/setting new field value with joined string
                        	xtype: 'container',
                        	layout: 'hbox',
                        	docked: 'bottom',
                        	align: 'center',
                        	//margin: '4px',
                        	defaults: {
                        		ui: 'action',
                        		margin: '4px',
                        		flex: 1
                        	},

                        	items: [
								{
									xtype: 'button',
									text: this.getAllButtonLabel(),
									hidden: !this.getShowAllButton(),
									listeners: {
										tap: this.onAllButtonTap,
										scope: this
									}
								},
                        	    {
                                	xtype: 'button',
                                	text: this.getOkButtonLabel(),
                                	width: (this.getShowAllButton() ? '50%' : '50%'),
                                	margin: (this.getShowAllButton() ? '4px' : '4px auto 4px auto'),
                                	listeners: {
                                		tap: this.onButtonTap,
                                		scope: this
                                	}
                        	    }
                        	]
                        }
                    ]
                },
                listeners: {
                	scope: this,
                	//hide: this.onListHide
                }
            }, config));
        }
        return this.listPanel;
    },

    onSearchKeyUp: function(self, e, opts) {
    	var searchVal = self.getValue(),
    		store = this.getStore(),
    		re = new RegExp(searchVal, 'i');

   		store.clearFilter(true);

    	store.filterBy(function(record, id) {
    		var uname = record.get('user_name'),
    			cname = record.get('complete_name');
    		if (searchVal == '') {
    			return (uname != currentUserName);
    		} else {
    			return (uname != currentUserName) && (cname.match(re) || uname.match(re));
    		}
    	});
    },

    applyValue: function(value) {  //override with modified function

        var record = value,
        	displayStringArray = new Array(),
        	index, store;

        //we call this so that the options configruation gets intiailized, so that a store exists, and we can find the correct value
        this.getOptions();

        store = this.getStore();

        if ((value && !value.isModel) && store) {
        	var v,
        		displayField = this.getDisplayField(),
        		valueStringArray = value.split(',');

			for (v=0; v<valueStringArray.length; ++v) {
				item = store.find(this.getValueField(), valueStringArray[v], null, null, null, true);
				if (item == -1) {
					// TODO
				} else {
					displayStringArray.push(store.getAt(item).get(displayField));
				}
			}
        }

        // display csv string in field when value applied
        //console.log(this.element);x-field-input
        var elem = this.element.down('input.x-input-el');
        if (this.getShowTotalCount()) {
        	var cont = this.getTotalCountTpl().replace('{count}', displayStringArray.length);
        } else {
        	var cont = displayStringArray.join(', ');
        }
        if (elem) elem.set({'value': cont});
        return record;
    },


    updateValue: function(newValue, oldValue) {  //override with modified function
        this.previousRecord = oldValue;
        this.record = newValue;
        // String does not have methods //this.callParent([newValue ? newValue.get(this.getDisplayField()) : '']);
        if (this.pickerOpened) {
        	// fires only after opening the picker, avoid fire during component creation
        	this.fireEvent('change', this, newValue, oldValue);
        }
    },


    getValue: function() {  //override with modified function
        var record = this.record;
        return (record) // Use literal string value of field // ? record.get(this.getValueField()) : null;
    },


    showPicker: function() {  //override with modified function
    	var store = this.getStore();
        //check if the store is empty, if it is, return
        if (!store || store.getCount() === 0 || this.getReadOnly()) {
            return;
        }
        this.isFocused = true;
        this.pickerOpened = true;
        //hide the keyboard
        //the causes https://sencha.jira.com/browse/TOUCH-1679
        // Ext.Viewport.hideKeyboard();
        if (this.getUsePicker()) {
        	// TODO:
            /*var picker = this.getPhonePicker(),
            	name   = this.getName(),
            	value  = {};
            value[name] = this.record.get(this.getValueField());
            picker.setValue(value);
            if (!picker.getParent()) {
                Ext.Viewport.add(picker);
            }
            picker.show();
            */
        } else { //reworked code to split csv string into array and select correct list items
            var listPanel = this.getTabletPicker(),
            	list = listPanel.down('list'),
            	store = list.getStore(),
            	itemStringArray = new Array(),
            	values = (this.getValue() == null ? '' : this.getValue().split(',')),
            	v = 0,
            	vNum = values.length;
            if (!listPanel.getParent()) {
                Ext.Viewport.add(listPanel);
            }
            for (v = 0; v < vNum; ++v) {
                itemStringArray.push(values[v]);
            }
            v = 0;
            for (v = 0; v < vNum; ++v) {
                //var record = store.findRecord(this.getDisplayField(), itemStringArray[v], 0, true, false, false );
                var record = store.findRecord(this.getValueField(), itemStringArray[v], 0, true,false,false );
                list.select(record, true, false);
            }
            listPanel.showBy(this.getComponent());
            listPanel.down('list').show();
        }
    },


    onListSelect: function(item, record) {  //override with empty function
    },


    onListTap: function() {  //override with empty function
    },


    onButtonTap: function() {
    	var handlers = this.getListeners(),
    		eventres = this.fireEvent('oktap', this);

    	//this.realUpdateValue();
    	if (handlers && !eventres) return eventres;

        this.setValue('');
        this.listPanel.down('list').hide(); //force list hide event
        this.listPanel.hide({
            type : 'fade',
            out  : true,
            scope: this
        });
    },

    onAllButtonTap: function() {
    	var handlers = this.getListeners(),
    		eventres = this.fireEvent('alltap', this);

    	//this.realUpdateValue();
    	if (handlers && !eventres) return eventres;

    	this.setValue('');
    	this.listPanel.down('list').selectAll(true);
        this.listPanel.down('list').hide(); //force list hide event
        this.listPanel.hide({
            type : 'fade',
            out  : true,
            scope: this
        });
    },

    /*getCurrentValue: function() {
    	var ret = [],
    		recordArray;
    	if (!this.listPanel) return ret;

    	recordArray = this.listPanel.down('list').selected.items;
    },*/

    realUpdateValue: function(onlyreturn) {
    	var me = this,
    		valueStringArray = new Array(),
    		v, recordArray;

    	if (!this.listPanel) return;

    	recordArray = this.listPanel.down('list').selected.items;
    	//itemStringArray = new Array(),

    	vNum = recordArray.length;
    	for (v = 0; v < vNum; ++v) {
    		if  (recordArray[v].data[this.getDisplayField()]){
    			valueStringArray.push(recordArray[v].data[this.getValueField()]);
    		}
    	}
    	if (!onlyreturn) {
    		if (valueStringArray.length > 0) {
    			//me.setValue(itemStringArray.join(','));
    			me.setValue(valueStringArray.join(','));
    			this.listPanel.down('list').deselectAll();
    		} else {
    			me.setValue(null);
    		}
    	}
    	return valueStringArray;
   	},

    onListHide: function(cmp, opts) {
        this.realUpdateValue(false);
    }
});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/* i valori devono essere univoci tra tutti gli store */
/* TODO: estendere a n picklist */

/**
 * @class Vtecrm.field.OwnerSelect
 *
 * Select field which enable to select an user or a group
 */
Ext.define('Vtecrm.field.OwnerSelect', {
    extend: 'Ext.field.Select',
    alias : 'widget.ownerselectfield',
    xtype : 'ownerselectfield',

    config: {
    	usePicker : false,  //force list panel, not picker

    	listsConfig: [],
    	activeListIndex: 0,

    	listeners: {
    		initialize: function(self) {
    			self.clearStores();
    		}
    	}
    },


    // rimuove eventuali filtri dallo store
    clearStores: function() {
    	var me = this,
    		i, store, cfgs = me.getListsConfig();

		if (cfgs && cfgs.length > 0) {
			for (i=0; i<cfgs.length; ++i) {
				store = cfgs[i].store;
				if (store) {
					store.clearFilter();
				}
			}
		}
    },

    getTabletPicker: function(initValue) {  //override with modified function
        var me = this,
        	multiconf = me.getListsConfig(),
        	config = this.getDefaultTabletPickerConfig(),
        	activeIndex = this.getActiveListIndex(),
        	i,j;

        if (!(this.listPanel)) {

        	// bottoni
        	this.listButtons = [];
        	if (multiconf.length > 1) {
        		for (i=0; i<multiconf.length; ++i) {
        			var btn = Ext.create('Ext.Button', {
        				itemId: 'btn'+i,
        				xtype: 'button',
        				text: multiconf[i].buttonText,
        				listeners: {
        					scope: this,
        					tap: me.onButtonTap,
        				}
        			});
        			this.listButtons.push(btn);
        		}
        	}

        	// liste
        	this.listLists = [];
        	if (multiconf.length > 1) {
        		for (i=0; i<multiconf.length; ++i) {
        			var list = Ext.create('Ext.List', Ext.apply({
        				itemId: 'list'+i,
        				xtype: 'list',
        				hidden: (i != activeIndex),
        				listeners: {
        					select : this.onListSelect,
        					itemtap  : this.onListTap,
        					scope  : this,
                    	},
        			}, multiconf[i]));
        			this.listLists.push(list);
        		}
        	}

            this.listPanel = Ext.create('Ext.Panel', Ext.apply({
                centered: true,
                modal: true,
                cls: Ext.baseCSSPrefix + 'select-overlay',
                layout: 'fit',
                hideOnMaskTap: true,
                items: [
                    {
                      	xtype: 'container',
                       	layout: 'hbox',
                       	docked: 'bottom',
                       	align: 'center',
                       	//margin: '4px',
                       	defaults: {
                       		ui: 'action',
                       		margin: '4px',
                       		flex: 1
                       	},
                       	items: this.listButtons,
                    }
                ]
            }, config));
        }
        this.listPanel.add(this.listLists);

        return this.listPanel;
    },

    onMaskTap: function() {
        if (this.getDisabled()) return false;
        this.showPicker();
        return false;
    },

    onButtonTap: function(btn) {
    	var btnIndex = btn.getItemId().replace('btn', ''),
    		panel = btn.getParent().getParent(),
    		lists = panel.getInnerItems(),
    		i;

    	for (i=0; i<lists.length; ++i) {
    		var list = lists[i],
    			listIdx = list.getItemId().replace('list', '');

    		if (btnIndex == listIdx) {
    			list.setHidden(false);
    			this.setActiveListIndex(listIdx);
    		} else {
    			list.setHidden(true);
    		}
    	}

    },

    onListSelect: function(item, record) {
        var me = this;
        if (record) {
            me.setValue(record);
        }
    },

    onChange: function(component, newValue, oldValue) {
        var me = this,
        	multiconf = this.getListsConfig(),
        	lists = this.listLists,
        	listids = this.findListIndex(oldValue),
        	record = listids[1],
        	valueField = (listids[0] != -1) ? multiconf[listids[0]].valueField : '',
        	oldValue = (record && valueField) ? record.get(valueField) : null;

        me.fireEvent('change', me, me.getValue(), oldValue);
    },


    // TODO
    /*reset: function() {
    },*/

    applyValue: function(value) {
        var record = value,
        	lists = this.listLists,
        	multiconf = this.getListsConfig(),
            i, list, valueField, displayField, index, store;

        if (!lists || lists.length == 0) return record;

        //we call this so that the options configruation gets intiailized, so that a store exists, and we can
        //find the correct value
        this.getOptions();

        var listinfo = this.findListIndex(value);

        if (listinfo && listinfo[0] != -1) {
        	record = listinfo[1];
        	this.setActiveListIndex(listinfo[0]);
        }

        return record;
    },

    updateValue: function(newValue, oldValue) {
    	var multiconf = this.getListsConfig(),
    		indexList = this.getActiveListIndex(),
    		displayField = multiconf[indexList].displayField;

        if (newValue && !newValue.isModel) {
        	var recs = this.findListIndex(newValue);
        	if (recs && recs[0] != -1) {
        		this.setActiveListIndex(recs[0]);
        		newValue = recs[1];
        		displayField = multiconf[recs[0]].displayField;
        	}
        }

        this.previousRecord = oldValue;
        this.record = newValue;

        // call the grand parent
        Ext.field.Text.prototype.updateValue.call(this, [(newValue && newValue.isModel) ? newValue.get(displayField) : '']);
    },

    getValue: function() {
        var record = this.record,
        	multiconf = this.getListsConfig(),
        	indexList = this.getActiveListIndex(),
            valueField = multiconf[indexList].valueField;

        return (record && record.isModel) ? record.get(valueField) : null;
    },

	/*setValue: function(value) {
		console.log('SETVALUE', value);
		return this.callParent(arguments);
	},*/

    // trova l'indice della lista per il valore selezionato e anche il record
    findListIndex: function(value) {
    	var multiconf = this.getListsConfig(),
    		lists = this.listLists,
    		index = -1,
    		record = value,
    		valueField, displayField, i, store;

    	if (!multiconf) return [index, record];

    	this.clearStores();

    	for (i=0; i<multiconf.length; ++i) {
        	store = multiconf[i].store;
        	valueField = multiconf[i].valueField;
        	displayField = multiconf[i].displayField;

        	if ((value && !value.isModel) && store) {
        		index = store.find(valueField, value, null, null, null, true);

        		if (index == -1) {
        			index = store.find(displayField, value, null, null, null, true);
        		}

        		if (index != -1) {
        			record = store.getAt(index);
        			index = i;
        			break;
        		}
        	} else if (value && value.isModel) {
        		console.log('TODO FROM RECORD', value.stores);
        	}
        }
    	return [index, record];
    },


    showPicker: function() {  //override with modified function
    	var multiconf = this.getListsConfig(),
    		indexList = this.getActiveListIndex(),
    		valueField = multiconf[indexList].valueField,
    		i;

        if (!multiconf || multiconf.length == 0 || this.getReadOnly()) {
            return;
        }
        this.isFocused = true;

        if (this.getUsePicker()) {
            // TODO: non usato per ora
        } else {
            var listPanel = this.getTabletPicker(this.getValue()),
            	listIds = this.findListIndex(this.getValue()),
            	listIndex = listIds[0],
            	listRecord = listIds[1],
            	lists = this.listLists;

            listPanel.showBy(this.getComponent());

            if (lists && listIndex != -1) {
            	var list = lists[listIndex];

            	// seleziono il valore
            	list.select(listRecord, null, false);

            	// e scrollo al punto giusto
            	var scroller = list.getScrollable().getScroller(),
            		storeIndex = list.getStore().indexOf(listRecord),
            		item = list.container.getViewItems()[storeIndex],
            	    containerSize = scroller.getContainerSize().y,
                    size = scroller.getSize().y,
                    maxOffset = size - containerSize,
                    offset = (item.offsetTop > maxOffset) ? maxOffset : item.offsetTop;
            	if (offset) scroller.scrollTo(0, offset);

            	// deseleziono le altre
            	for (i=0; i<lists.length; ++i) {
            		if (i != listIndex) lists[i].deselectAll();
            	}
            }
        }
    },


});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * @class Vtecrm.field.LongTextArea
 *
 * Textarea field which expands when the user tap on it and shrinks back to regular size on blur
 *
 * Some workarounds are used to enable native scrolling on iOS
 *
 */
Ext.define('Vtecrm.field.LongTextArea', {
    extend: 'Ext.field.TextArea',
    xtype: 'longtextareafield',
    alternateClassName: 'Ext.form.LongTextArea',

    config: {

    	longText: false,

    	listeners: {
    		focus: function(self, e, opts) {
    			var lt = self.checkLongText();
    			if (lt[0]) {
    				self.extendArea(lt[1]);
    			}
    		},

    		blur: function(self) {
    			self.reduceArea();
    		},

    	}
    },

    areaExtended: false,

    constructor: function() {
    	this.callParent(arguments);
    	var tarea = this.getComponent().element.dom.firstChild;
    	// in modo che su iOS scrolli nativamente
    	if (tarea && Ext.os.is.iOS) {
    		tarea.ontouchstart = this.handleTouch;
    		tarea.ontouchmove = this.handleMove;
    	}
    },

    handleTouch: function(e) {
    	this.lastY = e.pageY;
    },

    handleMove: function(e) {
    	var textArea = e.target,
    		top = textArea.scrollTop <= 0,
    		bottom = textArea.scrollTop + textArea.clientHeight >= textArea.scrollHeight,
    		up = e.pageY > this.lastY,
    		down = e.pageY < this.lastY;

    	  this.lastY = e.pageY;

    	  // default (mobile safari) action when dragging past the top or bottom of a scrollable
    	  // textarea is to scroll the containing div, so prevent that.
    	  if ((top && up) || (bottom && down)) {
    		  e.preventDefault();
    		  return;
    		  //e.stopPropagation(); // this tops scroll going to parent
    	  }

    	  // Sencha disables textarea scrolling on iOS by default,
    	  // so stop propagating the event to delegate to iOS.
    	  if (!(top && bottom)) {
    	    e.stopPropagation(); // this tops scroll going to parent
    	  }
    },

    // stupid code to count lines, doesn't take into account textarea wrapping
    checkLongText: function() {
    	var val = this.getValue();
    		longText = false,
    		rows = 0;
    	if (val) {
    		rows = val.split('\n').length;
    		longText = ( rows > 5 ? true : false);
    		this.setLongText(longText);
    	}
    	return [longText, rows];
    },

    extendArea: function(rows) {
    	if (this.areaExtended) return;
    	if (rows > 5) {
    		var maxrows = Math.min(Math.max(5, Math.round(document.body.clientHeight / (1.8*20))), 20);
    		this.setMaxRows(Math.min(rows, maxrows));
    	}

    	this.areaExtended = true;
    },

    reduceArea: function() {
    	if (!this.areaExtended) return;
    	this.setMaxRows(5);
    	this.areaExtended = false;
    }
});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * @class Vtecrm.field.HtmlTextArea
 *
 * A textarea which displays html formatted content
 *
 */
Ext.define('Vtecrm.field.HtmlTextArea', {
    extend: 'Ext.field.TextArea',
    xtype: 'htmltextareafield',
    alternateClassName: 'Ext.form.HtmlTextArea',

    config: {

    	cls: 'textarea-html',
    	maxRows: 6,
    	autoExpand: true,

    	rowHeight: 16, // px

    	listeners: {

    		painted: function(self, e, opts) {
    			self.maximizeHeight();

    		},

    	}
    },

    areaExtended: false,

    constructor: function(cfg) {
    	var me = this;

    	me.callParent(arguments);

    	var maxRows = me.getMaxRows() || 5,
    		h = (me.getRowHeight() * maxRows) + 'px';

    	me.setHeight(h);

    	var panel = Ext.create('Ext.Component', {
    	    html: me.getValue(),
    	    //minHeight: h,
    	    height: h,
    	    //flex: 1,
    	    //maxHeight: h,
    	    //padding: '0px',
    	});

    	var innerEl = panel.element.down('.x-innerhtml');
    	if (innerEl) {
			if (this.getReadOnly() == false) innerEl.set({'contenteditable':true});
    		innerEl.setStyle({
    			'height': '100%',
    			'-webkit-overflow-scrolling': 'auto',
    			//'-webkit-user-drag' : 'auto',
    			'overflow': 'auto'
    		});
    		innerEl.on({
    			scope: this,
    			'focus' : 'onFocus',
    			'blur'  : 'onBlur'
    		});
    	}

    	this.setComponent(panel);

    },

    setValue: function(val) {
    	var me = this,
    		c = me.getComponent();
    	if (c) {
    		if (c.getId().match(/textareainput/)) {
    			return this.callParent(arguments);
    		} else {
    			var innerEl = c.element.down('.x-innerhtml');
    			if (innerEl) innerEl.setHtml(val);
    		}
    	}
    },

    getValue: function() {
    	var c = this.getComponent();
    	if (c) {
    		if (c.getId().match(/textareainput/)) {
    			return this.callParent(arguments);
    		} else {
    			var innerEl = c.element.down('.x-innerhtml');
    			if (innerEl) return innerEl.getHtml();
    		}
    	}
    	return null;
    },

    doSetHeight: function(newHeight) {
    	var c = this.getComponent();

        this.element.setHeight(newHeight);
        //this.element.setMinHeight(newHeight);
        //this.element.setMaxHeight(newHeight);
        if (c) {
        	c.setHeight(newHeight);
    		//c.setMaxHeight(newHeight);
    		//c.setMinHeight(newHeight);
        }
    },

    /*setMaxRows: function (mr, self) {
    	if (!self) self = this;

   		var h = mr*self.getRowHeight()+'px';
   		self.setHeight(h);
   		self.setMinHeight(h);
   		self.setMaxHeight(h);
    },*/

    onFocus: function(self, e) {
    	var me = this;

    	if (me.getAutoExpand()) {
    		me.extendArea();
    	}
    	me.fireEvent('focus', me, e, {scope: me});
    },

    onBlur: function(self, e) {
    	var me = this;
    	// TODO: blur is called also when clicking inside -> NON HO TROVATO SOLUZIONI
    	/*
    	if (me.getAutoExpand()) {
    		self.reduceArea();
    	}
    	*/
    	me.fireEvent('blur', me, e, {scope: me});
    },

    maximizeHeight: function() {
    	var me = this,
    		parent = me.getParent(),
    		// aaargh, orribilissimo!!
    		pHeight = (parent ? jQuery(parent.element.dom).height() : 0);

    	if (pHeight) {
    		me.setHeight(pHeight);
    	}

    },

    extendArea: function() {
    	var me = this,
    		c = me.getComponent();
    	if (me.areaExtended) return;

    	me.setHeight('auto');
    	me.setMinHeight('auto');
    	me.setMaxHeight('auto');

    	if (c) {
    		c.setHeight('auto');
    		c.setMaxHeight('auto');
    		c.setHeight('auto');
    	}

    	this.areaExtended = true;
    },

    /*reduceArea: function() {
    	if (!this.areaExtended) return;
    	this.setMaxRows(5, this);
    	this.areaExtended = false;
    }*/
});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * @class Vtecrm.model.VteModule
 *
 * Modle for a module
 */
Ext.define("Vtecrm.model.VteModule", {
    extend: "Ext.data.Model",
    config: {
        fields: [
            {name: 'tabid', type: 'int'},
            {name: 'label', type: 'string'},
            {name: 'single_label', type: 'string'},
            {name: 'text', type: 'string'},
            {name: 'view', type: 'string'},
            {name: 'areaid', type: 'int'},
            {name: 'access', type: 'string'}, // access sharing (private, public_readonly, ...)
            {name: 'perm_create', type: 'boolean'}, // permesso di creazione
            {name: 'perm_write', type: 'boolean'}, // permesso di modifica
            {name: 'perm_delete', type: 'boolean'}, // permesso di cancellazione
            {name: 'filters', type: 'auto'}, // filtri
            {name: 'folders', type: 'auto'}, // cartelle
            {name: 'defaults', type: 'auto'}, // default settings
            // module list for link and create popup
            {name: 'mods_link', type: 'auto'},
            {name: 'mods_create', type: 'auto'},
            {name: 'hide_tabs', type: 'auto'},
        ]
    }
});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/*
 * TODO: gestire anche rimozione records
 */

/**
 * This proxy saves data in a single item in localStorage, instead of creating one item per record
 */
Ext.define('Vtecrm.store.proxy.SingleLocalStorage', {
    extend: 'Ext.data.proxy.LocalStorage',
    alias: 'proxy.SingleLocalStorage',
    //alternateClassName: 'Vtecrm.proxy.SingleLocalStorage',

    requires: ['Ext.Date'],

    config: {
    },

    // private stuff
    storagedata: undefined,


    initialize: function() {
    	this.callParent(arguments);
    },

    getRecord: function(id) {
    	if (this.cache[id] === undefined) {
    		if (this.storagedata === undefined) {
    			this.storagedata = Ext.decode(this.getStorageObject().getItem(this.getId()));
    		}

    		var item = this.storagedata[id],
    			data = {},
            	Model   = this.getModel(),
            	fields  = Model.getFields().items,
            	length  = fields.length,
            	i, field, name, record, dateFormat;

    		if (!item) return;

    		for (i = 0; i < length; ++i) {
                field = fields[i];
                name  = field.getName();

                if (typeof field.getDecode() == 'function') {
                    data[name] = field.getDecode()(item[name]);
                } else {
                    if (field.getType().type == 'date') {
                        dateFormat = field.getDateFormat();
                        if (dateFormat) {
                            data[name] = Ext.Date.parse(item[name], dateFormat);
                        } else {
                            data[name] = new Date(item[name]);
                        }
                    } else {
                        data[name] = item[name];
                    }
                }
            }

            record = new Model(data, id);
            this.cache[id] = record;
    	}

    	return this.cache[id];
    },

    setRecord: function(record, id) {
        if (id) {
            record.setId(id);
        } else {
            id = record.getId();
        }

        var me = this,
            rawData = record.getData(),
            data    = {},
            Model   = me.getModel(),
            fields  = Model.getFields().items,
            length  = fields.length,
            i, field, name, obj, key, dateFormat;

        for (i=0; i < length; ++i) {
            field = fields[i];
            name  = field.getName();

            if (typeof field.getEncode() == 'function') {
                data[name] = field.getEncode()(rawData[name], record);
            } else {
                if (field.getType().type == 'date' && Ext.isDate(rawData[name])) {
                    dateFormat = field.getDateFormat();
                    if (dateFormat) {
                        data[name] = Ext.Date.format(rawData[name], dateFormat);
                    } else {
                        data[name] = rawData[name].getTime();
                    }
                } else {
                    data[name] = rawData[name];
                }
            }
        }

        obj = me.getStorageObject();
        key = me.getRecordKey(id);

        if (this.storagedata === undefined) {
        	this.storagedata = [];
        } else {
        	delete this.storagedata[key];
        }

        me.cache[key] = record;
        this.storagedata[key] = data;
        obj.setItem(this.getId(), Ext.encode(this.storagedata));

        record.commit();
    },

    // TODO
    removeRecord: function(id, updateIds) {
    	console.log("DEL "+id);
    },

    getRecordKey: function(id) {
    	if (this.storagedata === undefined) {
        	this.storagedata = [];
        }

        if (id.isModel) {
            id = id.getId();
        }

        var pc = id.split('-');
        pc = pc[pc.length-1];
        if (pc > this.storagedata.length) pc = this.storagedata.length;
        return pc;
    },

    getIds: function() {
    	var ids = [], outids = [];
    	if (this.storagedata === undefined) {
    		var rawids = this.getStorageObject().getItem(this.getId());
        	if (rawids !== undefined && rawids !== null && rawids != '') {
        		rawids = Ext.decode(rawids);
        		if (typeof rawids === 'object') {
        			ids = rawids;
        		}
        	}
        	this.storagedata = ids;
    	}

    	for (key in this.storagedata) outids.push(key);
    	return outids;
    },

    setIds: function(ids) {
    },

    clear: function() {
    	var obj = this.getStorageObject();
    	obj.removeItem(this.getId());
    }

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

// Questo modello contiene la definione della tabella crmentity per gli elementi

/**
 *
 */
Ext.define("Vtecrm.model.VteEntity", {
    extend: "Ext.data.Model",
    config: {
        fields: [
            {name: 'crmid', type: 'int'},
            {name: 'tabid', type: 'int'},
            {name: 'setype', type: 'string'},
            {name: 'entityname', type: 'string'},
            {name: 'fields', type: 'string'},
            {name: 'modflag', type: 'int'},
            {name: 'perm_delete', type: 'boolean'},
        ]
    }
});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

// modello che memorizza i blocchi
// nota: 1 record != 1 blocco, bensì, 1 record = tutti i blocchi. diciamo grazie a quella merda di getBlocks().

/**
 *
 */
Ext.define("Vtecrm.model.VteBlock", {
    extend: "Ext.data.Model",

    //requires: ['Vtecrm.model.VteField'],

    config: {

    	//hasMany: 'Vtecrm.model.VteField',

        fields: [
            // campi per blocco standard
            {name: 'blockid', type: 'int'}, // in caso di related, è il relationid
            {name: 'tabid', type: 'int'},
            {name: 'module', type: 'string'},
            {name: 'label', type: 'string'},
            {name: 'fields', type: 'string'}, // stringa json che rappresenta i campi

            {name: 'type', type: 'string'}, // tipo del blocco (BLOCK, RELATED)

            // campi per related
            {name: 'related_tabid', type: 'int'},
            {name: 'related_module', type: 'string'},
            {name: 'actions', type: 'string'},
        ]
    },

    getId: function() {
    	var data = this.getData();
    	if (data && data['blockid'] !== undefined) {
    		return data['blockid'];
    	} else {
    		return this.callParent(arguments);
    	}
    },

    getIdField: function() {
    	return 'blockid';
    }
});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * @class Vtecrm.field.DateTime
 */
Ext.define('Vtecrm.field.DateTime', {
    extend: 'Ext.picker.Picker',
    xtype: 'datetimepicker',
    alternateClassName: 'Vtecrm.DateTimePicker',
    requires: ['Ext.DateExtras'],

    config: {
        /**
         * @cfg {Number} yearFrom
         * The start year for the date picker.
         * @accessor
         */
        yearFrom: 1980,

        /**
         * @cfg {Number} [yearTo=(new Date().getFullYear()) + 1]
         * The last year for the date picker.
         * @accessor
         */
        yearTo: new Date().getFullYear() + 1,

        /**
         * @cfg {String} monthText
         * The label to show for the month column.
         * @accessor
         */
        monthText: (Ext.os.deviceType.toLowerCase() == "phone") ? 'M' : 'Month',

        /**
         * @cfg {String} dayText
         * The label to show for the day column.
         * @accessor
         */
        dayText: (Ext.os.deviceType.toLowerCase() == "phone") ? 'j' : 'Day',

        /**
         * @cfg {String} yearText
         * The label to show for the year column.
         * @accessor
         */
        yearText: (Ext.os.deviceType.toLowerCase() == "phone") ? 'Y' : 'Year',

        /**
        * @cfg {String} hourText
        * The label to show for the hour column. Defaults to 'Hour'.
        */
        hourText: (Ext.os.deviceType.toLowerCase() == "phone") ? 'H' : 'Hour',

        /**
         * @cfg {String} minuteText
         * The label to show for the minute column. Defaults to 'Minute'.
         */
        minuteText: (Ext.os.deviceType.toLowerCase() == "phone") ? 'i' : 'Minute',

        /**
         * @cfg {String} ampmText
         * The label to show for the ampm column. Defaults to 'AM/PM'.
         */
        ampmText: (Ext.os.deviceType.toLowerCase() == "phone") ? 'A' : 'AM/PM',

        /**
         * @cfg {Array} slotOrder
         * An array of strings that specifies the order of the slots.
         * @accessor
         */
        slotOrder: ['month', 'day', 'year','hour','minute','ampm'],

        /**
         * @cfg {Number} minuteInterval
         * @accessor
         */
        minuteInterval : 15,

        /**
         * @cfg {Boolean} ampm
         * @accessor
         */
        ampm : false,


        /**
         * @cfg {Object/Date} value
         * Default value for the field and the internal {@link Ext.picker.Date} component. Accepts an object of 'year',
         * 'month' and 'day' values, all of which should be numbers, or a {@link Date}.
         *
         * Examples:
         * {year: 1989, day: 1, month: 5} = 1st May 1989.
         * new Date() = current date
         * @accessor
         */

        /**
         * @cfg {Boolean} useTitles
         * Generate a title header for each individual slot and use
         * the title configuration of the slot.
         * @accessor
         */

        /**
         * @cfg {Array} slots
         * @hide
         * @accessor
         */
    },

    initialize: function() {
        this.callParent();

        this.on({
            scope: this,
            delegate: '> slot',
            slotpick: this.onSlotPick
        });
    },

    setValue: function(value, animated) {
        if (Ext.isDate(value)) {

            ampm =  'AM';
            currentHours = hour =  value.getHours();
            if(this.getAmpm()){
                if (currentHours > 12) {
                    ampm = "PM";
                    hour -= 12;
                } else if(currentHours == 12) {
                   ampm = "PM";
                } else if(currentHours == 0) {
                    hour = 12;
                }
            }
            value = {
                day  : value.getDate(),
                month: value.getMonth() + 1,
                year : value.getFullYear(),
                hour : hour,
                minute : value.getMinutes(),
                ampm : ampm
            };
        }

        this.callParent([value, animated]);
    },

    getValue: function() {
        var values = {},
            daysInMonth, day, hour, minute,
            items = this.getItems().items,
            ln = items.length,
            item, i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item instanceof Ext.picker.Slot) {
                values[item.getName()] = item.getValue();
            }
        }
        daysInMonth = this.getDaysInMonth(values.month, values.year);
        day = Math.min(values.day, daysInMonth),hour = values.hour,  minute = values.minute;


        var yearval = (isNaN(values.year)) ? new Date().getFullYear() : values.year,
            monthval = (isNaN(values.month)) ? (new Date().getMonth()) : (values.month - 1),
            dayval = (isNaN(day)) ? (new Date().getDate()) : day,
            hourval = (isNaN(hour)) ? new Date().getHours() : hour,
            minuteval = (isNaN(minute)) ? new Date().getMinutes() : minute;
            if(values.ampm && values.ampm == "PM" && hourval<12){
                hourval = hourval + 12;
            }
            if(values.ampm && values.ampm == "AM" && hourval == 12){
                hourval = 0;
            }
        return new Date(yearval, monthval, dayval, hourval, minuteval);
    },

    /**
     * Updates the yearFrom configuration
     */
    updateYearFrom: function() {
        if (this.initialized) {
            this.createSlots();
        }
    },

    /**
     * Updates the yearTo configuration
     */
    updateYearTo: function() {
        if (this.initialized) {
            this.createSlots();
        }
    },

    /**
     * Updates the monthText configuration
     */
    updateMonthText: function(newMonthText, oldMonthText) {
        var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if ((typeof item.title == "string" && item.title == oldMonthText) || (item.title.html == oldMonthText)) {
                    item.setTitle(newMonthText);
                }
            }
        }
    },

    /**
     * Updates the dayText configuraton
     */
    updateDayText: function(newDayText, oldDayText) {
        var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if ((typeof item.title == "string" && item.title == oldDayText) || (item.title.html == oldDayText)) {
                    item.setTitle(newDayText);
                }
            }
        }
    },

    /**
     * Updates the yearText configuration
     */
    updateYearText: function(yearText) {
        var innerItems = this.getInnerItems,
            ln = innerItems.length,
            item, i;

        //loop through each of the current items and set the title on the correct slice
        if (this.initialized) {
            for (i = 0; i < ln; i++) {
                item = innerItems[i];

                if (item.title == this.yearText) {
                    item.setTitle(yearText);
                }
            }
        }
    },

    // @private
    constructor: function() {
        this.callParent(arguments);
        this.createSlots();
    },

    /**
     * Generates all slots for all years specified by this component, and then sets them on the component
     * @private
     */
    createSlots: function() {
        var me        = this,
            slotOrder = this.getSlotOrder(),
            yearsFrom = me.getYearFrom(),
            yearsTo   = me.getYearTo(),
            years     = [],
            days      = [],
            months    = [],
            hours = [],
            minutes = [],
            ampm= [],
            ln, tmp, i,
            daysInMonth;

        if(!this.getAmpm()){
            var index = slotOrder.indexOf('ampm')
            if(index >= 0){
                slotOrder.splice(index);
            }
        }
        // swap values if user mixes them up.
        if (yearsFrom > yearsTo) {
            tmp = yearsFrom;
            yearsFrom = yearsTo;
            yearsTo = tmp;
        }

        for (i = yearsFrom; i <= yearsTo; i++) {
            years.push({
                text: i,
                value: i
            });
        }

        daysInMonth = this.getDaysInMonth(1, new Date().getFullYear());

        for (i = 0; i < daysInMonth; i++) {
            days.push({
                text: i + 1,
                value: i + 1
            });
        }

        for (i = 0, ln = Ext.Date.monthNames.length; i < ln; i++) {
            months.push({
                text: (Ext.os.deviceType.toLowerCase() == "phone") ? Ext.Date.monthNames[i].substring(0,3) : Ext.Date.monthNames[i],
                value: i + 1
            });
        }

        var hourLimit =  (this.getAmpm()) ? 12 : 23
        var hourStart =  (this.getAmpm()) ? 1 : 0
        for(i=hourStart;i<=hourLimit;i++){
            hours.push({
                text: this.pad2(i),
                value: i
            });
        }


        for(i=0;i<60;i+=this.getMinuteInterval()){
            minutes.push({
                text: this.pad2(i),
                value: i
            });
        }

        ampm.push({
            text: 'AM',
            value: 'AM'
        },{
            text: 'PM',
            value: 'PM'
        });

        var slots = [];

        slotOrder.forEach(function(item) {
            slots.push(this.createSlot(item, days, months, years,hours,minutes,ampm));
        }, this);

        me.setSlots(slots);
    },

    /**
     * Returns a slot config for a specified date.
     * @private
     */
    createSlot: function(name, days, months, years,hours,minutes,ampm) {
        switch (name) {
            case 'year':
                return {
                    name: 'year',
                    align: (Ext.os.deviceType.toLowerCase() == "phone") ? 'left' : 'center',
                    data: years,
                    title: this.getYearText(),
                    flex: (Ext.os.deviceType.toLowerCase() == "phone") ? 1.3 : 3
                };
            case 'month':
                return {
                    name: name,
                    align: (Ext.os.deviceType.toLowerCase() == "phone") ? 'left' : 'right',
                    data: months,
                    title: this.getMonthText(),
                    flex: (Ext.os.deviceType.toLowerCase() == "phone") ? 1.2 : 4
                };
            case 'day':
                return {
                    name: 'day',
                    align: (Ext.os.deviceType.toLowerCase() == "phone") ? 'left' : 'center',
                    data: days,
                    title: this.getDayText(),
                    flex: (Ext.os.deviceType.toLowerCase() == "phone") ? 0.9 : 2
                };
            case 'hour':
                return {
                    name: 'hour',
                    align: (Ext.os.deviceType.toLowerCase() == "phone") ? 'left' : 'center',
                    data: hours,
                    title: this.getHourText(),
                    flex: (Ext.os.deviceType.toLowerCase() == "phone") ? 0.9 : 2
                };
            case 'minute':
                return {
                    name: 'minute',
                    align: (Ext.os.deviceType.toLowerCase() == "phone") ? 'left' : 'center',
                    data: minutes,
                    title: this.getMinuteText(),
                    flex: (Ext.os.deviceType.toLowerCase() == "phone") ? 0.9 : 2
                };
            case 'ampm':
                return {
                    name: 'ampm',
                    align: (Ext.os.deviceType.toLowerCase() == "phone") ? 'left' : 'center',
                    data: ampm,
                    title: this.getAmpmText(),
                    flex: (Ext.os.deviceType.toLowerCase() == "phone") ? 1.1 : 2
                };
        }
    },

   onSlotPick: function(pickedSlot, oldValue, htmlNode, eOpts) {

        // We don't actually get passed the new value. I think this is an ST2 bug. Instead we get passed the slot,
        // the oldValue, the node in the slot which was moved to, and options for the event.
        //
        // However looking at the code that fires the slotpick event, the slot.selectedIndex is always set there
        // We can therefore use this to pull the underlying value that was picked out of the slot's store
        var pickedValue = pickedSlot.getStore().getAt(pickedSlot.selectedIndex).get(pickedSlot.getValueField());

        pickedSlot.setValue(pickedValue);

        if(pickedSlot.getName() === 'month' || pickedSlot.getName() === 'year') {
            this.repopulateDaySlot();
        }
    },


    repopulateDaySlot: function() {
        var slot = this.getDaySlot(),
            days = [],
            month = this.getSlotByName('month').getValue(),
            year = this.getSlotByName('year').getValue(),
            daysInMonth;

        // Get the new days of the month for this new date
        daysInMonth = this.getDaysInMonth(month, year);

        for (i = 0; i < daysInMonth; i++) {
            days.push({
                text: i + 1,
                value: i + 1
            });
        }

        // We dont need to update the slot days unless it has changed
        if (slot.getData().length == days.length) {
            return;
        }

        slot.setData(days);
    },


    getSlotByName: function(name) {
        return this.down('pickerslot[name=' + name + ']');
    },


    getDaySlot: function() {
        return this.getSlotByName('day');
    },

    // @private
    getDaysInMonth: function(month, year) {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        return month == 2 && this.isLeapYear(year) ? 29 : daysInMonth[month-1];
    },

    // @private
    isLeapYear: function(year) {
        return !!((year & 3) === 0 && (year % 100 || (year % 400 === 0 && year)));
    },
    pad2 : function(number) {
     return (number < 10 ? '0' : '') + number
    }
});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * @class Vtecrm.field.TimePicker
 */
Ext.define('Vtecrm.field.TimePicker', {
    extend: 'Ext.picker.Picker',
    xtype: 'timepicker',
    alternateClassName: 'Vtecrm.TimePicker',

    config: {


        /**
         * @cfg {Number} hourFrom
         * The start hour for the time picker.  Defaults to 0
         */
        hourFrom: 0,

        /**
         * @cfg {Number} hourTo
         * The last hour for the time picker.  Defaults to 23
         */
        hourTo: 23,


        /**
        * @cfg {String} hourText
        * The label to show for the hour column. Defaults to 'Hour'.
        */
        hourText: (Ext.os.deviceType.toLowerCase() == "phone") ? 'H' : 'Hour',

        /**
         * @cfg {String} minuteText
         * The label to show for the minute column. Defaults to 'Minute'.
         */
        minuteText: (Ext.os.deviceType.toLowerCase() == "phone") ? 'i' : 'Minute',

        /**
         * @cfg {String} ampmText
         * The label to show for the ampm column. Defaults to 'AM/PM'.
         */
        ampmText: (Ext.os.deviceType.toLowerCase() == "phone") ? 'A' : 'AM/PM',

        /**
         * @cfg {Array} slotOrder
         * An array of strings that specifies the order of the slots.
         * @accessor
         */
        slotOrder: ['hour','minute','ampm'],

        /**
         * @cfg {Number} minuteInterval
         * @accessor
         */
        minuteInterval : 5,

        /**
         * @cfg {Boolean} ampm
         * @accessor
         */
        ampm : false,


        /**
         * @cfg {Object/Date} value
         * Default value for the field and the internal {@link Ext.picker.Date} component. Accepts an object of 'year',
         * 'month' and 'day' values, all of which should be numbers, or a {@link Date}.
         *
         * Examples:
         * {year: 1989, day: 1, month: 5} = 1st May 1989.
         * new Date() = current date
         * @accessor
         */

        /**
         * @cfg {Boolean} useTitles
         * Generate a title header for each individual slot and use
         * the title configuration of the slot.
         * @accessor
         */

        /**
         * @cfg {Array} slots
         * @hide
         * @accessor
         */
    },

    // @private
    constructor: function() {
        this.callParent(arguments);
        this.createSlots();
    },

    initialize: function() {
        this.callParent();

        this.on({
            scope: this,
            delegate: '> slot',
            slotpick: this.onSlotPick
        });
    },

    setValue: function(value, animated) {
    	var step = this.getMinuteInterval();

        if (isHour(value)) {

        	// imposto al più minuto inferirore multiplo dello step
        	if (step > 1 && value.m % step != 0) {
        		value.m = step*Math.floor(value.m / step);
        	}

            ampm =  'AM';
            currentHours = hour =  value.getHours();
            if(this.getAmpm()){
                if (currentHours > 12) {
                    ampm = "PM";
                    hour -= 12;
                } else if(currentHours == 12) {
                   ampm = "PM";
                } else if(currentHours == 0) {
                    hour = 12;
                }
            }
            value = {
                hour : hour,
                minute : value.getMinutes(),
                ampm : ampm
            };
        }

        this.callParent([value, animated]);
    },

    getValue: function() {
        var values = {},
            hour, minute,
            items = this.getItems().items,
            ln = items.length,
            item, i;

        for (i = 0; i < ln; i++) {
            item = items[i];
            if (item instanceof Ext.picker.Slot) {
                values[item.getName()] = item.getValue();
            }
        }
        hour = values.hour;
        minute = values.minute;

        // TODO: secondi

        var hourval = (isNaN(hour)) ? new Date().getHours() : hour,
            minuteval = (isNaN(minute)) ? new Date().getMinutes() : minute;
            if(values.ampm && values.ampm == "PM" && hourval<12){
                hourval = hourval + 12;
            }
            if(values.ampm && values.ampm == "AM" && hourval == 12){
                hourval = 0;
            }
        return new Hour(hourval, minuteval);
    },

    /**
     * Generates all slots for all years specified by this component, and then sets them on the component
     * @private
     */
    createSlots: function() {
        var me        = this,
            slotOrder = this.getSlotOrder(),
            hours = [],
            minutes = [],
            ampm = [],
            ln, tmp, i,
            daysInMonth;

        if(!this.getAmpm()){
            var index = slotOrder.indexOf('ampm')
            if(index >= 0){
                slotOrder.splice(index);
            }
        }


        var hourLimit =  (this.getAmpm()) ? 12 : 23
        var hourStart =  (this.getAmpm()) ? 1 : 0
        for(i=hourStart; i<=hourLimit; ++i){
            hours.push({
                text: this.pad2(i),
                value: i
            });
        }

        for(i=0; i<60; i+=this.getMinuteInterval()){
            minutes.push({
                text: this.pad2(i),
                value: i
            });
        }

        ampm.push({
            text: 'AM',
            value: 'AM'
        },{
            text: 'PM',
            value: 'PM'
        });

        var slots = [];

        slotOrder.forEach(function(item) {
            slots.push(this.createSlot(item, hours,minutes,ampm));
        }, this);

        me.setSlots(slots);
    },

    /**
     * Returns a slot config for a specified date.
     * @private
     */
    createSlot: function(name, hours,minutes,ampm) {
        switch (name) {
            case 'hour':
                return {
                    name: 'hour',
                    align: (Ext.os.deviceType.toLowerCase() == "phone") ? 'left' : 'center',
                    data: hours,
                    title: this.getHourText(),
                    flex: (Ext.os.deviceType.toLowerCase() == "phone") ? 0.9 : 2
                };
            case 'minute':
                return {
                    name: 'minute',
                    align: (Ext.os.deviceType.toLowerCase() == "phone") ? 'left' : 'center',
                    data: minutes,
                    title: this.getMinuteText(),
                    flex: (Ext.os.deviceType.toLowerCase() == "phone") ? 0.9 : 2
                };
            case 'ampm':
                return {
                    name: 'ampm',
                    align: (Ext.os.deviceType.toLowerCase() == "phone") ? 'left' : 'center',
                    data: ampm,
                    title: this.getAmpmText(),
                    flex: (Ext.os.deviceType.toLowerCase() == "phone") ? 1.1 : 2
                };
        }
    },

   onSlotPick: function(pickedSlot, oldValue, htmlNode, eOpts) {

        // We don't actually get passed the new value. I think this is an ST2 bug. Instead we get passed the slot,
        // the oldValue, the node in the slot which was moved to, and options for the event.
        //
        // However looking at the code that fires the slotpick event, the slot.selectedIndex is always set there
        // We can therefore use this to pull the underlying value that was picked out of the slot's store
        var pickedValue = pickedSlot.getStore().getAt(pickedSlot.selectedIndex).get(pickedSlot.getValueField());

        pickedSlot.setValue(pickedValue);
    },


    getSlotByName: function(name) {
        return this.down('pickerslot[name=' + name + ']');
    },

    pad2 : function(number) {
    	return (number < 10 ? '0' : '') + number
    }
});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * @class Vtecrm.field.TimePickerField
 */
Ext.define('Vtecrm.field.TimePickerField', {
    extend: 'Ext.field.Text',
    alternateClassName: 'Vtecrm.form.TimePickerField',
    xtype: 'timepickerfield',
    requires: [
        'Vtecrm.field.TimePicker',
    ],


    config: {
        ui: 'select',

        /**
         * @cfg {Object/Vtecrm.field.DateTime} picker
         * An object that is used when creating the internal {@link Vtecrm.field.DateTime} component or a direct instance of {@link Vtecrm.field.DateTime}
         * Defaults to true
         * @accessor
         */
        picker: true,

        /**
         * @cfg {Boolean}
         * @hide
         * @accessor
         */
        clearIcon: false,

        /**
         * @cfg {Object/Date} value
         * Default value for the field and the internal {@link Vtecrm.field.DateTime} component. Accepts an object of 'year',
         * 'month' and 'day' values, all of which should be numbers, or a {@link Date}.
         *
         * Example: {year: 1989, day: 1, month: 5} = 1st May 1989 or new Date()
         * @accessor
         */

        /**
         * @cfg {Boolean} destroyPickerOnHide
         * Whether or not to destroy the picker widget on hide. This save memory if it's not used frequently,
         * but increase delay time on the next show due to re-instantiation. Defaults to false
         * @accessor
         */
        destroyPickerOnHide: false,

        /**
         * @cfg {String} dateTimeFormat The format to be used when displaying the date in this field.
         * Accepts any valid datetime format. You can view formats over in the {@link Ext.Date} documentation.
         * Defaults to `Ext.util.Format.defaultDateFormat`.
         */
        //dateTimeFormat: 'd/m/Y h:i',
        /**
         * @cfg {Object}
         * @hide
         */
        component: {
            useMask: true
        }
    },

    initialize: function() {
        this.callParent();

        this.getComponent().on({
            scope: this,
            masktap: 'onMaskTap'
        });

        this.getComponent().input.dom.disabled = true;
    },

    syncEmptyCls: Ext.emptyFn,

    applyValue: function(value) {
        if (!isHour(value) && !Ext.isObject(value) && !isValidHour(value)) {
            value = null;
        }

        // oggetto ora
        if (isHour(value)) {
        	value = value.toString();
        // stringa
        } else if (isValidHour(value)) {
            value = new Hour(value);
            value = value.toString();
        // oggetto generico
        } else if (Ext.isObject(value)) {
            value = new Hour(value.hour, value.minute, value.second);
            value = value.toString();
        }
        return value;
    },

    updateValue: function(newValue) {
        var picker = this._picker;
        if (picker && picker.isPicker) {
            picker.setValue(newValue);
        }

        // Ext.Date.format expects a Date
        if (newValue !== null) {
            this.getComponent().setValue(newValue); //Ext.Date.format(newValue, this.getDateTimeFormat() || Ext.util.Format.defaultDateFormat));
        } else {
            this.getComponent().setValue('');
        }

        if (this._picker && this._picker instanceof Vtecrm.field.TimePicker) {
            this._picker.setValue(newValue);
        }
    },

    /* REMOVED
     * Updates the date format in the field.
     * @private
     */
    /*updateDateFormat: function(newDateFormat, oldDateFormat) {
        var value = this.getValue();
        if (newDateFormat != oldDateFormat && Ext.isDate(value) && this._picker && this._picker instanceof Vtecrm.field.DateTime) {
            this.getComponent().setValue(Ext.Date.format(value, newDateFormat || Ext.util.Format.defaultDateFormat));
        }
    },*/

    /**
     * Returns the {@link Date} value of this field.
     * If you wanted a formated date
     * @return {Date} The date selected
     */
    getValue: function() {
        if (this._picker && this._picker instanceof Vtecrm.field.TimePicker) {
        	var val = this._picker.getValue();
        	if (isHour(val)) val = val.toString();
            return val;
        }
        return this._value;
    },


    applyPicker: function(picker, pickerInstance) {
        if (pickerInstance && pickerInstance.isPicker) {
            picker = pickerInstance.setConfig(picker);
        }

        return picker;
    },

    getPicker: function() {
        var picker = this._picker,
            value = this.getValue();

        if (!isHour(value) && isValidHour(value)) {
        	value = new Hour(value);
        } else if (value == null) {
        	value = new Hour();
        }

        if (picker && !picker.isPicker) {
            picker = Ext.factory(picker, Vtecrm.field.TimePicker);
            picker.on({
                scope: this,
                cancel: 'onPickerCancel',
                change: 'onPickerChange',
                hide  : 'onPickerHide'
            });

            if (value !== null) {
                picker.setValue(value);
            }

            Ext.Viewport.add(picker);
            this._picker = picker;
        }

        return picker;
    },

    /**
     * @private
     * Listener to the tap event of the mask element. Shows the internal DatePicker component when the button has been tapped.
     */
    onMaskTap: function() {
        if (this.getDisabled()) {
            return false;
        }

        if (this.getReadOnly()) {
            return false;
        }

        this.getPicker().show();

        return false;
    },

    /**
     * @private
     * Revert internal date so field won't appear changed
     */
    onPickerCancel: function(picker, options) {
        this._picker = this._picker.config;
        picker.destroy();
        return true;
    },

    /**
     * Called when the picker changes its value
     * @param {Vtecrm.field.DateTime} picker The date picker
     * @param {Object} value The new value from the date picker
     * @private
     */
    onPickerChange: function(picker, value) {
        var me = this;

        me.setValue(value);
        me.fireEvent('change', me, me.getValue());
    },

    /**
     * Destroys the picker when it is hidden, if
     * {@link Vtecrm.field.DateTimePicker#destroyPickerOnHide destroyPickerOnHide} is set to true
     * @private
     */
    onPickerHide: function() {
        var picker = this.getPicker();
        if (this.getDestroyPickerOnHide() && picker) {
            picker.destroy();
            this._picker = true;
        }
    },

    reset: function() {
        this.setValue(this.originalValue);
    },

    // @private
    destroy: function() {
        var picker = this.getPicker();

        if (picker && picker.isPicker) {
            picker.destroy();
        }

        this.callParent(arguments);
    }


});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * Login page
 */
Ext.define('Vtecrm.view.Login', {
	extend: 'Ext.form.Panel',

	requires: [
	    'Ext.field.Password',
    ],

	config: {

		/**
		 *
		 */
		itemId: 'loginForm',

		/**
		 *
		 */
		centered: true,

		/**
		 *
		 */
		scrollable: false,

		/**
		 *
		 */
		padding: '4px',

		/**
		 *
		 */
		submitOnAction: true,

		/**
		 *
		 */
		layout: 'vbox',

		/**
		 *
		 */
		style: 'background-color: transparent; -webkit-box-shadow: ' + (Ext.os.is.Phone ? 'none' : 'rgba(0, 0, 0, 0.8) 0 0.2em 0.6em'),

		/**
		 *
		 */
		width: (Ext.os.is.Phone ? '250px' : '350px'),

		/**
		 * @hide
		 */
		items: [
		    {
		    	xtype: 'fieldset',
		    	verticalLayout: true,
		    	defaults: {
		    		verticalLayout: true,
		    	},

				items: [
			        {
			        	xtype: 'textfield',
				    	itemId: 'loginUsername',
				    	name: 'loginUsername',
				    	autoCapitalize: false,
				    	autoCorrect: false,
				    	label: LANG.username
				    },
				    {
				    	xtype: 'passwordfield',
				    	itemId: 'loginPassword',
				    	name: 'loginPassword',
				    	label: LANG.password
				    },
				    {
				    	xtype: 'textfield',
				    	itemId: 'loginVteUrl',
				    	name: 'loginVteUrl',
				    	label: LANG.vte_address,
				    	placeHolder: 'http://',
				    	autoCapitalize: false,
				    	autoCorrect: false,
				    	value: (vtwsUrl != null && vtwsUrl != '') ? vtwsUrl.replace('modules/Touch/', '') : '',
				    	labelWrap: true,
				    	bubbleEvents: ['action'], // for some reason, this was not fired on this field
				    }
				]
		    },
		    {
    	    	xtype: 'button',
    	    	text: LANG.login,
    	    	itemId: 'loginBtn',
    	    	margin: '20px auto 10px auto',
    	    	width: '120px',
		       	ui: 'action',
		    }
		],

		/**
		 * @hide
		 */
		listeners: {
			action: function() {
				// do the login
				this.doLogin();
				// prevent default form post
				return false;
			}
		},

		/**
		 * @hide
		 */
		control: {
			'#loginBtn': {
				tap: function(self) {
					this.fireEvent('action');
				}
			}
		}
	},

	/**
	 * Starts the login process. The username and password are taken from the form and submitted to the server
	 */
    doLogin: function() {
    	var me = this,
    		lform = me,
    		mtime = (new Date()).getTime();

    	if (!lform) return;
    	var fval = lform.getValues();

    	// check for empty values
    	var username = fval.loginUsername;
    	if (username == '') {
    		Ext.Msg.alert(LANG.error, LANG.specify_username);
    		return;
    	}

    	var pwd = fval.loginPassword;
    	if (pwd == '') {
    		Ext.Msg.alert(LANG.error, LANG.specify_password);
    		return;
    	}

    	var vteurl = fval.loginVteUrl;
    	if (vteurl == '') {
    		Ext.Msg.alert(LANG.error, LANG.specify_address);
    		return;
    	}

    	// add protocol and remove final / if needed
    	if (!vteurl.match(/^https?:\/\//)) {
    		vteurl = 'http://'+vteurl;
    	}
    	if (vteurl.charAt(vteurl.length-1) == '/') {
    		vteurl = vteurl.substring(0, vteurl.length-1);
    	}
    	vteurl = vteurl.trim();

    	vtwsUrl = vteurl+'/modules/Touch/';
    	localStorage.setItem('vtwsUrl',vtwsUrl);

    	// mostro la girella :)
    	maskView(LANG.loading_login);

    	Ext.Ajax.request({
    		url: vtwsUrl + 'ws.php?wsname=Login&_dc='+mtime,
    		params: 'password='+encodeURIComponent(pwd)+'&username='+encodeURIComponent(username)+'&url='+vteurl,
    		method: 'POST',
    		useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
    	    success: function (b) {
    	    	if (b.responseText == '') {
    	    		// TODO: chiama il callback failure
    	    		unMaskView();
    	    		Ext.Msg.alert(LANG.error, LANG.login_failed);
    	    	} else {

    	    		// controllo risposta
    	    		try {
    	    			var answer = Ext.decode(b.responseText);
    	    			if (answer.success == false && answer.error_message) {
    	    				unMaskView();
    	    				if (answer.error_code == 'INVALID_USER_CREDENTIALS') {
    	    					Ext.Msg.alert(LANG.error, LANG.invalid_credentials);
    	    				} else {
    	    					Ext.Msg.alert(LANG.error, answer.error_message);
    	    				}
    	    				return;
    	    			} else if (!answer.key) {
    	    				console.log('Empty accesskey!');
    	    				throw 42;
    	    			}
    	    		} catch (e) {
    	    			unMaskView();
        	    		Ext.Msg.alert(LANG.error, LANG.login_failed);
        	    		return;
    	    		}

    	    		// ricarico il loader
    	    		unMaskView();
    	    		maskView(LANG.loading_modules);

    	    		var	version = answer.version,
    	    			lang = answer.user_language,
    	    			listpagelimit = answer.list_page_limit,
    	    			login_vte_offline = answer.enable_offline,
    	    			vte_revision = parseInt(answer.vte_revision),
    	    			onlinestore;

    	    		// controllo versione api
    	    		if (version && supp_api_versions.indexOf(version) == -1) {
    	    			Ext.Msg.alert(LANG.warning, LANG.api_version_mismatch, function() {
    	    				window.location.reload();
    	    			});
    	    			return;
    	    		}

    		    	vtwsOpts = 'username='+username+'&password='+answer.key+'&';
    		    	localStorage.setItem('vtwsOpts',vtwsOpts);
    		    	currentUserName = username;

    		    	// lingua (prendo da VTE solo se non è impostata)
    		    	CONFIG.set('vte_language',lang);

    		    	// limite liste
    		    	CONFIG.set('list_page_limit',listpagelimit);

    		    	localStorage.setItem('vteInfo', Ext.encode({
    		    		'revision': vte_revision,
    		    	}));

    		    	// offline
    		    	/*CONFIG.set('vte_offline', login_vte_offline);
    		    	CONFIG.set('app_offline', 0);
    		    	*/

    		    	// creo semaforo per il reload
    		    	var sReload = new Semaphore('reload', function() {
    		    		DB.atEnd(function() {
    		    			window.location.reload();
    		    		});
    		    	}, null, 4);

    		    	// controllo revisione - rimosso
    	    		/*if (!vte_revision || vte_revision < vte_target_revision) {
    	    			sReload.wait(1);
    	    			Ext.Msg.alert(LANG.warning, LANG.not_target_revision, function() {
    	    				sReload.go();
    	    			});
    	    		}*/

    		    	// carico gli utenti
    		    	Vtecrm.app.userstore = Ext.create('Vtecrm.store.VteOnlineOffline', {
    	    			model: 'Vtecrm.model.VteUser',
    	    			autoLoad: true,
    	    			offline: false,
    	    			offlineOnLoad: true,
    	    			onlineProxy: {
    	    				type: "ajax",
    	    	    		url: vtwsUrl + "ws.php?wsname=GetUsers",
   	    	           	    extraParams: params_unserialize(vtwsOpts),
   	    	       			reader: 'json',
   	    	       			actionMethods: {read: 'POST'},
   	    	       			listeners: {
   	    	       				// json decoding error
   	    	       				exception: function(reader,response,error,opts) {
   	    	       					localStorage.setItem('vtwsOpts','');
   	    	       					Ext.Msg.alert(LANG.error, LANG.invalid_server_response, function() {
   	    	       						window.location.reload();
   	    	       					});
   	    	       					return false;
   	    	       				},
   	    	       			}
    	    			},
    	    			offlineProxy: {
    	    				type: 'WebSQL',
    	    				table: 'users'
    	    			},
    	    			listeners: {
    	    				offlinedone: function() {
    	    					sReload.go();
    	    				},
    	    			}
    	    		});

    		    	// e i gruppi
    		    	Vtecrm.app.groupstore = Ext.create('Vtecrm.store.VteOnlineOffline', {
    	    			model: 'Vtecrm.model.VteGroup',
    	    			autoLoad: true,
    	    			offline: false,
    	    			offlineOnLoad: true,
    	    			onlineProxy: {
    	    				type: "ajax",
    	    	    		url: vtwsUrl + "ws.php?wsname=GetGroups",
   	    	           	    extraParams: params_unserialize(vtwsOpts),
   	    	       			reader: 'json',
   	    	       			actionMethods: {read: 'POST'},
   	    	       			listeners: {
	    	       				// json decoding error
	    	       				exception: function(reader,response,error,opts) {
	    	       					localStorage.setItem('vtwsOpts','');
	    	       					Ext.Msg.alert(LANG.error, LANG.invalid_server_response, function() {
	    	       						window.location.reload();
	    	       					});
	    	       					return false;
	    	       				},
	    	       			}
    	    			},
    	    			offlineProxy: {
    	    				type: 'WebSQL',
    	    				table: 'groups'
    	    			},
    	    			listeners: {
    	    				offlinedone: function() {
    	    					sReload.go();
    	    				}
    	    			}
    	    		});

    		    	// load areas
    		    	Vtecrm.app.fetchAreas(function() {
    		    		sReload.go();
    		    	});

    		    	// carico la lista dei moduli (fa un refresh della pagina alla fine
    	    		onlinestore = Ext.create('Vtecrm.store.VteModulesOnline');
    	    		DB.atEnd(function() {
    	    			onlinestore.load();
    	    		});

    	    	}
    	    },
    	    failure: function (xhr, o) {
    	    	//nascondo il loader
    			unMaskView();
    			Ext.Msg.alert(LANG.error, LANG.login_failed+'. '+LANG.check_connection);
    	    }
    	});

    }

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * Login page for Demo mode
 * @hide
 */
Ext.define('Vtecrm.view.LoginDemo', {
	extend: 'Vtecrm.view.Login',

	config: {

		layout: 'hbox',

		padding: '16px',

		width: (Ext.os.is.Phone ? '250px' : '460px'),

		height: '200px',

		defaults: {
			mode: '',
			margin: (Ext.os.is.Phone ? '4px' : '8px'),
			listeners: {
				tap: function(self, e) {
					var me = self.up('#loginForm');
					var demoid = self.getItemId().replace('img_', '');
					me.demoLogin.call(me, demoid);
				},
			}
		},
		items: [
		    {
		    	xtype: 'image',
		    	itemId: 'img_Telemarketing',
		    	src: (Ext.os.is.Phone ? 'resources/img/demo_Telemarketing_sm.png' : 'resources/img/demo_Telemarketing.png'),

		    },
		    {
		    	xtype: 'image',
		    	itemId: 'img_Sales',
		    	src: (Ext.os.is.Phone ? 'resources/img/demo_Sales_sm.png' : 'resources/img/demo_Sales.png'),
		    },
		    {
		    	xtype: 'image',
		    	itemId: 'img_Support',
		    	src: (Ext.os.is.Phone ? 'resources/img/demo_Support_sm.png' :'resources/img/demo_Support.png'),
		    },
		],


	},

	pressedProfile: null,

	getValues: function() {
		var me = this,
			val = {
				'loginUsername' : (me.pressedProfile ? me.pressedProfile.username: ''),
				'loginPassword' : (me.pressedProfile ? me.pressedProfile.password : ''),
				'loginVteUrl' : demo_url,
			};

		return val;
	},

	demoLogin: function(demoid) {
		var me = this;

		if (demo_profiles[demoid]) {
			me.pressedProfile = demo_profiles[demoid];
		} else {
			me.pressedProfile = null;
		}

		me.doLogin();
	}

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * This view show the list of folders.
 * This class is  very similar to Vtecrm.view.FiltersGrid
 */
Ext.define('Vtecrm.view.FoldersGrid', {
	extend: 'Ext.carousel.Carousel',

    alias: "view.FoldersGrid",
    //layout: 'grid',

    requires: [],

    config: {
    	/**
    	 *
    	 */
    	itemId: 'foldersGrid',
    	direction: 'horizontal',

    	/**
    	 * @hide
    	 */
    	scrollable: false,

    	/**
    	 * @hide
    	 */
    	centered: true,

    	/**
    	 * @hide
    	 */
    	width: '100%',

    	/**
    	 * @hide
    	 */
    	height: '100%',

    	// custom
    	pages: 3,
    	/**
    	 *
    	 */
    	locked: false,
    	/**
    	 *
    	 */
    	module: null,
    	/**
    	 *
    	 */
    	searchString: '',

    	cvFolders: null,

    	/**
    	 * @hide
    	 */
    	listeners: {
    		painted: function (self) {
    			if (!self.hasGrids) self.createGrids();
    		},

    		show: function() {
    			//Vtecrm.app.mainview.setMainTitle('');
    		}
    	}
    },

    // private:
    cvStore: null,
    hasGrids: false,


    // disable dragging
    onDrag: function() {
    	if (!this.getLocked()) {
    		return this.callParent(arguments);
    	}
    },

    applyModule: function(module) {
    	var me = this,
    		store = Ext.getStore('modulesStoreOffline'),
    		modrec = store.findRecord('view', module),
    		folders = (modrec ? modrec.get('folders') : null);

    	if (folders && module != me._module) {

    		// 	genero lo store per le cartelle
			me.setCvFolders(folders);
			if (me.cvStore) self.cvStore.destroy();

			me.cvStore = Ext.data.Store.create({
				model: 'Vtecrm.model.VteFolder',
				data: folders,
				totalCount: folders.length,
			});
			me.cvStore.setTotalCount(folders.length);
    	}
    	me._module = module;
    },

    /**
     *
     */
    createGrids: function() {
    	var me = this,
    		dimensions = Vtecrm.view.GridView.calcDimensions('folder', me),
    		smallOrBig = (dimensions[0] == '64px' ? 'small' : 'big'),
    		modperpage = dimensions[2]*dimensions[3],
    		gstore = me.cvStore,
    		storeCount = (gstore ? gstore.getTotalCount() : 0);

    	me.setPages(Math.ceil(storeCount / modperpage));

    	if (me.getPages() <= 1) {
    		me.setLocked(true);
    		me.setIndicator(false);
    	} else {
    		me.setLocked(false);
    		me.setIndicator(true);
    	}

    	for (var i = 0; i<me.getPages(); ++i) {
			me.add(Ext.create('Ext.Container', {
				layout: 'fit',
				items: [{
					xclass: 'Vtecrm.view.GridView',
					defaultType: 'gridfolder',
					centered: true,
					module: me.getModule(),
					store: {
						model: gstore.getModel(),
						data: gstore.getRange(i*modperpage, (i+1)*modperpage-1),
					},
					columns: dimensions[2],
					itemConfig: {
						iconSize: smallOrBig,
					},
					listeners: {
						itemtap: function(self, index, target, record) {
							me.doTapFolder(record);
						},
					}
				}]
			}));
		}
    	me.hasGrids = true;
    },

    /**
     *
     */
    doTapFolder: function(record) {
    	var data = record.getData(),
    		cvid = record.get('cvid'),
    		modhome = Vtecrm.app.modulehome,
    		listSearch = (modhome ? modhome.down('#listSearch') : null),
    		listSearch2 = (modhome ? modhome.down('#listSearch2') : null),
    		btnFolderList = (modhome ? modhome.down('#modHomeFolderListBtn') : null),
    		foldersGrid = (modhome ? modhome.down('#foldersGrid') : null);

    	if (listSearch2) {
    		listSearch2.setViewid(0);
    		listSearch2.setFilterInfo(null);
    		listSearch2.setFolderInfo(data);
    		listSearch2.getStore().removeAll();
    		listSearch2.getStore().loadPage(1);
    		modhome.setActiveItem(btnFolderList);
    	}
    },

    handleOrientationChange: function(viewport, new_orient, width, height, opts){
    	var oldHidden = this.getHidden(),
    		lastcard = this.indexOf(this.getActiveItem())-1;

    	this.hide();
    	this.removeAll();
    	this.createGrids();
    	this.setActiveItem(lastcard);
    	if (!oldHidden) this.show();
    },

    // ricerca sul filtro "tutti"
    // TODO: -> cerca nei filtri
    /*goSearch: function(oldval, newval) {
    	var me = this,
    		modhome = Vtecrm.app.modulehome,
    		listSearch = (modhome ? modhome.down('#listSearch') : null);
    		store = me.cvStore,
    		allfilt = store.findRecord('all', true);

    	if (listSearch && allfilt) {
    		var cvid = allfilt.get('cvid');
    		listSearch.setViewid(cvid);
    		listSearch.setSearchString(newval);
    		listSearch.getStore().removeAll();
    		listSearch.getStore().loadPage(1);
    		modhome.setActiveItem(3);
    	}
    	me.setSearchString(newval);
    }*/


});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * The module's home view
 */
Ext.define('Vtecrm.view.ModuleHome', {
    extend: 'Ext.TabPanel',

    requires: [
        'Vtecrm.view.ListFavourites',
        'Vtecrm.view.ListRecents',
        'Vtecrm.view.ListSearch',
        'Vtecrm.view.ListFilterSearch',
        'Vtecrm.view.FiltersGrid',
        'Vtecrm.view.FilterConfig',
        'Vtecrm.view.FoldersGrid',
        'Ext.field.Search'
    ],

    config: {

    	// TODO: replace it with itemId
    	/**
    	 * @hide
    	 */
    	id: 'moduleHome',

    	/**
    	 *
    	 */
    	ui: 'light',

    	/**
    	 *
    	 */
    	flex: 1,

    	/**
    	 *
    	 */
    	grouped: false,

    	/**
    	 *
    	 */
    	indexBar: false,

    	/**
    	 *
    	 */
    	tabBarPosition: 'bottom',

    	/**
    	 *
    	 */
    	scrollable: false,

    	/**
    	 * @hide
    	 */
    	layout: {
    		//type: 'fit',
    		// TODO: gestire da impostazioni
    		animation: 'fade'
    	},

    	/**
    	 * The current module
    	 */
    	module: undefined,

    	/**
    	 * @hide
    	 */
    	items: [
    	    // toolbar

    	    {
    	    	ui: 'light',
    	    	xtype: 'toolbar',
                docked: 'top',
                scrollable: false,
                items: [
                    {
                    	itemId: 'moduleHomeBtnBack',
                    	ui: 'back',
                    	//text: LANG.back,
                    	iconMask: true,
                    	iconCls: 'arrow_left',
                    	align: 'left',
                    },
                    {
                    	xtype: 'spacer',
                    },
                    {
                    	itemId: 'modButton',
                    	xtype: 'button',
                    	ui: 'plain',
                    	align: 'center',
                    	iconMask: true,
                    	cls: 'smallMaskSize',
                    	iconCls: 'mask-mod-Generic',
                    	hidden: true,
                    },
                    {
                    	xtype: 'spacer',
                    },

                    {
                    	xtype: 'searchfield',
                    	itemId: "searchField",
                    	align: 'right',
                    	minWidth: '140px',
                    	width: '30%',
                    	maxWidth: '320px',
                    	clearIcon: true,
                    	autoCapitalize: false,
                    },
                    {
                    	itemId: 'modhomeBtnCreate',
                    	xtype: 'button',
                    	ui: 'plain',
                    	iconCls: 'add',
                    	iconMask: true,
                    	align: 'right',
                    }
                ]
    	    },
    	    // buttons
       		{
       			itemId: 'modHomeRecentsBtn',
    	    	title: LANG.recents,
       			iconCls: 'recent',
       			cls: 'lmt_recents', // used only to save the tab number
       			items: [
       			    {
        			   	xclass: 'Vtecrm.view.ListRecents',
        			   	loadingText: false,
       			    }
        		]
       		},
    		{
       			itemId: 'modHomeFavouritesBtn',
    			title: LANG.favourites,
    			iconCls: 'favorites',
    			cls: 'lmt_favourites',
    			items: [
    			    {
    			    	xclass: 'Vtecrm.view.ListFavourites',
    			    	loadingText: false,
    			    }
    			]
    		},
    		{
    			itemId: 'modHomeFiltersBtn',
    			title: LANG.filters,
    			iconCls: 'folder_black',
    			cls: 'lmt_filters',
    			items: [
        		    {
        		    	xclass: 'Vtecrm.view.FiltersGrid',
        		    	defaultType: 'gridmodule',
        		    }
        		]
    		},
    		{
    			title: LANG.search,
    			iconCls: 'search',
    			cls: 'lmt_search',
    			hidden: true,
    			items: [
        		    {
        		    	xclass: 'Vtecrm.view.ListFilterSearch',
        		    	loadingText: false,
        		    }
        		]
    		},
    		{
    			title: LANG.folders,
    			itemId: 'modHomeFolderBtn',
    			iconCls: 'folder_black',
    			cls: 'lmt_folders',
    			hidden: true,	// default is hidden, enable for modules with folders
    			items: [
        		    {
        		    	xclass: 'Vtecrm.view.FoldersGrid',
        		    }
        		]
    		},
    		{
    			title: LANG.search,
    			itemId: 'modHomeFolderListBtn',
    			iconCls: 'search',
    			hidden: true,
    			cls: 'lmt_foldercont',
    			items: [
        		    {
        		    	xclass: 'Vtecrm.view.ListFilterSearch',
        		    	loadingText: false,
        		    	itemId: 'listSearch2',
        		    	type: 'folder',
        		    }
        		]
    		},
    	],

    	/**
    	 * @hide
    	 */
    	control: {
    		'#moduleHomeBtnBack': {
    			tap: function(self) {
    				var me = this,
    					filtersBtn = me.down('#modHomeFiltersBtn'),
    					foldersBtn = me.down('#modHomeFolderBtn'),
    					innerItem = me.getActiveInnerItem(),
    					innerItemId = (innerItem ? innerItem.getItemId() : '');

    				// se sono in lista, torno a lista filtri
    				if (innerItemId.match(/^listSearch/)) {
    					if (innerItemId == 'listSearch' && filtersBtn) {
    						me.setActiveItem(filtersBtn);
    						Vtecrm.app.setLastModuleTab(me.getModule(), 'filters');
    					} else if (foldersBtn) {
    						me.setActiveItem(foldersBtn);
    						Vtecrm.app.setLastModuleTab(me.getModule(), 'lmt_folders');
    					} else {
    						Vtecrm.app.historyBack();
    					}
    				} else {
    					Vtecrm.app.historyBack();
    				}
    			}
    		},
    		'#modButton': {
    			tap: function() {
    				var me = this,
    					module = me.getModule(),
    					msg = LANG.module+': '+Vtecrm.app.translateString(module);
    				Ext.Msg.alert(LANG.informations, msg);
    			}
    		},
    		'#searchField': {
    			change: function(self, newval, oldval) {
        			var me = this;
        			me.goSearch(oldval, newval);
        		}
    		},
    		'#modhomeBtnCreate': {
    			tap: function() {
    				var me = this;
            		Vtecrm.app.showRecord(me.getModule(), null, '');
    			}
    		},

    	},

    	/**
    	 * @hide
    	 */
    	listeners: {

    		show: function(me) {
    			// struttura dei blocchi
    			var btnCreate = me.down('#modhomeBtnCreate'),
    				st3 = Ext.getStore('storeVteBlocks'),
    				listSearch = me.down('#listSearch'),
    				listSearch2 = me.down('#listSearch2'),
    				recentsBtn = me.down('#modHomeRecentsBtn'),
    				favouritesBtn = me.down('#modHomeFavouritesBtn'),
    				filtersBtn = me.down('#modHomeFiltersBtn'),
    				activeItem = me.getActiveInnerItem();

    			// load store only if showing searchlist
    			if (activeItem && activeItem.getItemId() == listSearch.getItemId()) {
    				listSearch.setModule(this.getModule());
    				listSearch.getStore().removeAll();
    				listSearch.getStore().loadPage(1);
    			}
    			if (activeItem && activeItem.getItemId() == listSearch2.getItemId()) {
    				listSearch2.setModule(this.getModule());
    				listSearch2.getStore().removeAll();
    				listSearch2.getStore().loadPage(1);
    			}

				st3.goOffline();
				st3.setModule(this.getModule());
				st3.load(function(records, operation, succ) {
					if (!CONFIG.app_offline && (!records || records.length == 0)) {
						// provo a caricare online
						maskView();
						st3.goOnline();
						st3.load(function(records, operation, succ) {
							if (!records || records.length == 0) console.log('ERROR: no blocks returned');
				    		st3.goOffline();
				    		unMaskView();
		    			});
					}
				});
    			var modInfo = Ext.getStore('modulesStoreOffline').findRecord('view', this.getModule());

    			var modTrans = modInfo.get('label'),
    				modPermCreate = modInfo.get('perm_create');
				if (modTrans != undefined && modTrans != null && Vtecrm.app.mainview) {
					Vtecrm.app.mainview.setMainTitle(modTrans);
				}

				// pulsanti
				btnCreate.setHidden(!modPermCreate);
    		},

    		activeitemchange: function(self, index, oldItem) {
    			var item = (index ? index.getItems().first() : null),
    				itemSearch = ((item && item.getSearchString) ? item.getSearchString() : null),
    		        module = self.getModule(),
    				searchfield = self.down('#searchField');

   				if (item == 0) {
   					item = index.down('#filtersGrid');
   					itemSearch = (item ? item.getSearchString() : null);
   				}
    			if (item) {
    				// salvo ultimo tab
    				var cls, clss = item.getParent().getCls();
    				// find the good one
    				for (var i=0; i<clss.length; ++i) {
    					if (clss[i].match(/^lmt_/)) {
    						cls = clss[i];
    						break;
    					}
    				}
    				Vtecrm.app.setLastModuleTab(module, cls.replace('lmt_', ''));
    				// ripristino ricerca
    				searchfield.suspendEvents();
    				searchfield.setValue(itemSearch);
    				searchfield.resumeEvents();
    			}
    		},

    	}
    },

    constructor: function(config) {
    	var me = this;

    	// inject module into children at creation
    	if (config && config.module) {
    		this.setChildrenModule(config.module);
    	}
    	this.callParent(arguments);

    	// restore old tab
    	var oldTab = Vtecrm.app.getLastModuleTab(this.getModule());

    	// by default, go to filters list
    	if (!oldTab) oldTab = 'filters';

    	if (oldTab !== undefined && oldTab !== null) {
    		// find the right tab
    		var items = me.getInnerItems(),
    			activeItem = -1;
    		for (var i=0; i<items.length; ++i) {
    			var clss = items[i].getCls();
    			for (var j=0; j<clss.length; ++j) {
    				if (clss[j] == 'lmt_'+oldTab) {
    					activeItem = i;
    					break;
    				}
    			}
    			if (activeItem >= 0) break;
    		}

    		if (activeItem >= 0) me.setActiveItem(activeItem);
    	}

    },

    // get real element
    getActiveInnerItem: function() {
    	var me = this,
    		activeItem = me.getActiveItem(),
    		innerItem = (activeItem ? activeItem.getActiveItem() : null);

    	return innerItem;
    },

    // imposta i moduli per i figli
    setChildrenModule: function(mod) {
    	var i, j, item, item2;
    	for (i=0; i<this.config.items.length; ++i) {
			item = this.config.items[i];
			if (item && item.items) {
				for (j=0; j<item.items.length; ++j) {
					item2 = item.items[j];
					if (item2.xclass) {
						item2.module = mod;
					}
				}
			}
		}
    },

    show: function() {
    	var me = this,
    		module = me.getModule(),
    		tabbar = me.getTabBar(),
    		recentsBtn = me.down('#modHomeRecentsBtn'),
			favouritesBtn = me.down('#modHomeFavouritesBtn'),
			filtersBtn = me.down('#modHomeFiltersBtn'),
			foldersBtn = me.down('#modHomeFolderBtn'),
			folderButton = tabbar.down('[title="'+LANG.folders+'"]'),
    		list1 = me.down('#listRecents'),
    		list2 = me.down('#listFavourites'),
    		list3 = me.down('#listSearch'),
    		modButton = me.down('#modButton'),
    		moduleStore = Ext.getStore('modulesStoreOffline'),
			moduleInfo = moduleStore.findRecord('view', module),
			hideTabs = (moduleInfo ? moduleInfo.get('hide_tabs') : []),
			modFolders = (moduleInfo ? moduleInfo.get('folders') : [] ),
    		semaphore;

    	// hide unavailable tabs
		if (hideTabs && hideTabs.length > 0) {
			if (hideTabs.indexOf('recents') >= 0) me.remove(recentsBtn);
			if (hideTabs.indexOf('favourites') >= 0) me.remove(favouritesBtn);
			if (hideTabs.indexOf('filters') >= 0) me.remove(filtersBtn);
			if (hideTabs.indexOf('folders') >= 0) me.remove(foldersBtn);
		}

    	// mostro/nascondo bottone cartelle
    	if (moduleInfo && foldersBtn && folderButton && modFolders && modFolders.length > 0) {
    		//foldersBtn.show();
    		folderButton.show();
    	}

    	// controllo se esiste
    	semaphore = findSemaphore('homeload');
    	if (semaphore) semaphore.destroy();

    	var semcount = (list1 ? 1 : 0) + (list2 ? 1 : 0);

    	if (semcount > 0) {
    		// maschera
    		maskView();
    		// ne creo uno nuovo
    		semaphore = new Semaphore('homeload', function(sem) {
    			DB.atEnd(function() {
    				unMaskView();
    				sem.destroy();
    			});
    		}, null, semcount);

    		if (list1) list1.setLoadSemaphore('homeload');
    		if (list2) list2.setLoadSemaphore('homeload');
    		if (list1) list1.loadStore();
    		if (list2) list2.loadStore();
    	}

		//mostro icona modulo per telefoni
		if (Ext.os.is.Phone && modButton) {
			var mod = (me.getModule() ? me.getModule() : 'generic');
			var maskname = 'mask-mod-'+me.getModule();
			if (Vtecrm.app.moduleIconsCss && Vtecrm.app.moduleIconsCss.indexOf('.'+maskname) == -1) {
				maskname = 'mask-mod-Generic';
			}
			modButton.setIconCls(maskname);
			modButton.setHidden(false);
		}

		return this.callParent(arguments);
    },

    /**
     * Starts the search
     */
    goSearch: function(oldval, newval) {
    	var me = this,
    		filtersGrid = me.down('#filtersGrid'),
    		active = me.getActiveItem().getActiveItem(),
    		activeid = (active ? active.getItemId() : null);

    	// maybe it's the filter page
    	if (active == 0) {
    		active = me.getActiveItem().down('#filtersGrid');
    		activeid = (active ? active.getItemId() : null);
    	}

    	// search
    	if (active && activeid) {
    		active.setSearchString(newval);
    		active.goSearch(oldval, newval);
    		if (activeid == 'listSearch') {
    			// sync con lista filtri
    			filtersGrid.setSearchString(newval);
    		}
    	}
    },

    handleOrientationChange: function(viewport, new_orient, width, height, opts){
    	var me = this,
    		filtersGrid = me.down('#filtersGrid');

    	if (filtersGrid) filtersGrid.handleOrientationChange(viewport, new_orient, width, height, opts);
    },

});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/*
 * Questo store viene caricato dallo store online solo una volta
 */

/**
 *
 */
Ext.define('Vtecrm.store.VteModulesOffline', {
    extend: 'Ext.data.Store',

    requires: ['Vtecrm.model.VteModule', 'Vtecrm.store.proxy.SingleLocalStorage'],

    //id: 'menuStore',
    alias: "store.VteModulesOffline",

    config: {
    	storeId: 'modulesStoreOffline',
    	autoLoad: false,
    	autoSync: false,
    	model: 'Vtecrm.model.VteModule',
    	clearOnPageLoad: true,
    	syncRemovedRecords: false,
    	destroyRemovedRecords: false,
    	pageSize: 6,
    	//defaultRootProperty: "modules",
        root: {},
        proxy: {
        	type: 'SingleLocalStorage',
        	id: 'modulesList'
        },

        listeners: {
        	addrecords: function() {
        	},
        	load: function(self, records) {
        		var i,j, record, label, trans, defaults;
        		if (records) {
        			for (i=0; i<records.length; ++i) {
        				record = records[i];
        				label = record.get('view');
        				trans = record.get('label');
        				singletrans = record.get('single_label');
        				if (label && trans) Vtecrm.app.insertTranslation(label, trans);
        				if (label && singletrans) Vtecrm.app.insertTranslation('SINGLE_'+label, singletrans);

        				// now set the defaults
        				defaults = record.get('defaults');
        				if (defaults) {
        					if (defaults.mobiletab !== undefined && defaults.mobiletab !== null && defaults.mobiletab !== '') {
        						var lastid = parseInt(defaults.mobiletab);
        						if (!isNaN(lastid) && (lastid != 3 || defaults.cvid > 0)) Vtecrm.app.setLastModuleTab(label, lastid);
        					}
        					if (defaults.cvid !== undefined && defaults.cvid !== null && defaults.cvid > 0) {
        						var cvid = parseInt(defaults.cvid),
        							sortfield = (empty(defaults.sortfield) ? null : defaults.sortfield),
        							sortorder = (empty(defaults.sortorder) ? null : defaults.sortorder),
        							extrafields = (empty(defaults.extrafields) ? [] : defaults.extrafields);
        						if (!isNaN(cvid)) {
        							Vtecrm.app.setRecentFilter(label, {
        								'cvid': cvid,
        								'viewname' : defaults.cvname,
        								'sortfield' : sortfield,
        								'sortorder' : sortorder,
        							});
        							Vtecrm.app.setFilterSettings(label, cvid, {
        								'extrafields' : extrafields,
        								'sortfield' : sortfield,
        								'sortorder' : sortorder,
        							});
        						}
        					}
        				}
        			}
        		}
        	},

        }
    },


});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/*
 * Questo store prende la lista dei moduli online
 * TODO: usare il proxy singlelocalstorage
 */

/**
 *
 */
Ext.define('Vtecrm.store.VteModulesOnline', {
    extend: 'Ext.data.Store',

    requires: ['Vtecrm.model.VteModule', 'Vtecrm.store.VteModulesOffline'],

    //id: 'menuStore',
    alias: "store.VteModulesOnline",

    config: {
    	storeId: 'modulesStoreOnline',
    	autoLoad: false,
    	model: 'Vtecrm.model.VteModule',
    	//defaultRootProperty: "modules",
        //root: {},
    	proxy: {
    		type: "ajax",
    		url: vtwsUrl + "ws.php?wsname=ModulesList",
    	    extraParams: params_unserialize(vtwsOpts),
    	    reader: 'json',
   			actionMethods: {read: 'POST'},
    	},

    	listeners: {

    		// carico lo store offline
        	load: function (self) {

        		var offstore = Ext.getStore('modulesStoreOffline');
        		// create if missing
        		if (offstore == undefined || offstore == null) {
        			Ext.create('Vtecrm.store.VteModulesOffline');
        			offstore = Ext.getStore('modulesStoreOffline');
        		}
        		// clear it
        		offstore.getProxy().clear();
        		offstore.removeAll();
        	    this.each(function (record) {
        	    	offstore.add(record.copy());
        	    });

        	    // aggiungo il modulo fittizio per le impostazioni
        	    var settingsRecord = Ext.create('Vtecrm.model.VteModule', {
        	    	 'label': LANG.settings,
        	         'text': LANG.settings,
        	         'view': 'Settings',
        	         'tabid': 0,
        	         'perm_create': true,
        	         'perm_write': true,
        	         'perm_delete': false,
        	    });
        	    offstore.add(settingsRecord);

        	    offstore.sync();
        	    // TODO: spostare nella gestione del login, non qui
        	    // uso il semaphoro per ricaricare la pagina
        	    var s = findSemaphore('reload');
        	    if (s) s.go();
        	}
    	// hookare exception?
        },

    },

    // alla creazione dello store imposto l'url dall'effettivo indirizzo
    constructor: function(config) {
    	this.callParent([config]);
    	this.setProxy({
    		type: 'ajax',
    		url: vtwsUrl + "ws.php?wsname=ModulesList",
    	    extraParams: params_unserialize(vtwsOpts),
			reader: 'json',
			actionMethods: {read: 'POST'},
			listeners: {
      			// json decoding error
      			exception: function(reader,response,error,opts) {
      				localStorage.setItem('vtwsOpts','');
      				Ext.Msg.alert(LANG.error, LANG.invalid_server_response, function() {
      					window.location.reload();
      				});
      				return false;
      			},
      		}
    	});
    	return this;
    },



});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * This store holds the structure of blocks and field for each module.
 *
 */
Ext.define('Vtecrm.store.VteBlocks', {
    extend: 'Vtecrm.store.VteOnlineOffline',

    requires: ['Vtecrm.model.VteBlock'],

    alias: "store.VteBlocks",

    config: {
    	storeId: 'storeVteBlocks',
    	autoLoad: false,
    	model: 'Vtecrm.model.VteBlock',

    	module: null,

    	offline: false,
		onlineProxy: {
			type: "ajax",
    		url: vtwsUrl + "ws.php?wsname=GetBlocks",
    		extraParams: params_unserialize(vtwsOpts),
			reader: 'json',
			actionMethods: {read: 'POST'},
			listeners: {
      			// json decoding error
      			exception: function(reader,response,error,opts) {
      				unMaskView();
      				Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
      				return false;
      			},
      		}
		},
		offlineProxy: {
			type: 'WebSQL',
			table: 'blocks',
		},

		listeners: {
			beforeload: function() {
				var me = this,
					mod = this.getModule(),
					postparams = params_unserialize(vtwsOpts);

				// imposto il filtro per il modulo
				if (mod) {
					if (this.getOffline()) {
						this.getOfflineProxy().setSqlFilters({
							'module': mod,
						});
					} else {
						postparams['module'] = mod;
						this.getOnlineProxy().setExtraParams(postparams);
					}
				}

			}
		}

    },

    /*initialize: function() {
    	console.log(this);
    	this.callParent(arguments);
    }
    */

    /*initialize: function() {
    	console.log('PENE');
    }*/

});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * @aside guide forms
 *
 * This is a specialized field which shows a {@link Vtecrm.field.DateTime} when tapped. If it has a predefined value,
 * or a value is selected in the {@link Vtecrm.field.DateTime}, it will be displayed like a normal {@link Ext.field.Text}
 * (but not selectable/changable).
 *
 *     Ext.create('Vtecrm.field.DateTimePicker', {
 *         label: 'Birthday',
 *         value: new Date()
 *     });
 *
 * {@link Vtecrm.field.DateTimePicker} fields are very simple to implement, and have no required configurations.
 *
 * ## Examples
 *
 * It can be very useful to set a default {@link #value} configuration on {@link Vtecrm.field.DateTimePicker} fields. In
 * this example, we set the {@link #value} to be the current date. You can also use the {@link #setValue} method to
 * update the value at any time.
 *
 *     @example miniphone preview
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 items: [
 *                     {
 *                         xtype: 'datetimepickerfield',
 *                         label: 'Birthday',
 *                         name: 'birthday',
 *                         value: new Date()
 *                     }
 *                 ]
 *             },
 *             {
 *                 xtype: 'toolbar',
 *                 docked: 'bottom',
 *                 items: [
 *                     { xtype: 'spacer' },
 *                     {
 *                         text: 'setValue',
 *                         handler: function() {
 *                             var datetimepickerfield = Ext.ComponentQuery.query('datetimepickerfield')[0];
 *
 *                             var randomNumber = function(from, to) {
 *                                 return Math.floor(Math.random() * (to - from + 1) + from);
 *                             };
 *
 *                             datetimepickerfield.setValue({
 *                                 month: randomNumber(0, 11),
 *                                 day  : randomNumber(0, 28),
 *                                 year : randomNumber(1980, 2011)
 *                             });
 *                         }
 *                     },
 *                     { xtype: 'spacer' }
 *                 ]
 *             }
 *         ]
 *     });
 *
 * When you need to retrieve the date from the {@link Vtecrm.field.DateTimePicker}, you can either use the {@link #getValue} or
 * {@link #getFormattedValue} methods:
 *
 *     @example preview
 *     Ext.create('Ext.form.Panel', {
 *         fullscreen: true,
 *         items: [
 *             {
 *                 xtype: 'fieldset',
 *                 items: [
 *                     {
 *                         xtype: 'datetimepickerfield',
 *                         label: 'Birthday',
 *                         name: 'birthday',
 *                         value: new Date()
 *                     }
 *                 ]
 *             },
 *             {
 *                 xtype: 'toolbar',
 *                 docked: 'bottom',
 *                 items: [
 *                     {
 *                         text: 'getValue',
 *                         handler: function() {
 *                             var datetimepickerfield = Ext.ComponentQuery.query('datetimepickerfield')[0];
 *                             Ext.Msg.alert(null, datetimepickerfield.getValue());
 *                         }
 *                     },
 *                     { xtype: 'spacer' },
 *                     {
 *                         text: 'getFormattedValue',
 *                         handler: function() {
 *                             var datetimepickerfield = Ext.ComponentQuery.query('datetimepickerfield')[0];
 *                             Ext.Msg.alert(null, datetimepickerfield.getFormattedValue());
 *                         }
 *                     }
 *                 ]
 *             }
 *         ]
 *     });
 *
 *
 */
Ext.define('Vtecrm.field.DateTimePicker', {
    extend: 'Ext.field.Text',
    alternateClassName: 'Vtecrm.form.DateTimePicker',
    xtype: 'datetimepickerfield',
    requires: [
        'Vtecrm.field.DateTime',
        'Ext.DateExtras'
    ],

    /**
     * @event change
     * Fires when a date is selected
     * @param {Vtecrm.field.DateTimePicker} this
     * @param {Date} date The new date
     */

    config: {
        ui: 'select',

        /**
         * @cfg {Object/Vtecrm.field.DateTime} picker
         * An object that is used when creating the internal {@link Vtecrm.field.DateTime} component or a direct instance of {@link Vtecrm.field.DateTime}
         * Defaults to true
         * @accessor
         */
        picker: true,

        /**
         * @cfg {Boolean}
         * @hide
         * @accessor
         */
        clearIcon: false,

        /**
         * @cfg {Object/Date} value
         * Default value for the field and the internal {@link Vtecrm.field.DateTime} component. Accepts an object of 'year',
         * 'month' and 'day' values, all of which should be numbers, or a {@link Date}.
         *
         * Example: {year: 1989, day: 1, month: 5} = 1st May 1989 or new Date()
         * @accessor
         */

        /**
         * @cfg {Boolean} destroyPickerOnHide
         * Whether or not to destroy the picker widget on hide. This save memory if it's not used frequently,
         * but increase delay time on the next show due to re-instantiation. Defaults to false
         * @accessor
         */
        destroyPickerOnHide: false,

        /**
         * @cfg {String} dateTimeFormat The format to be used when displaying the date in this field.
         * Accepts any valid datetime format. You can view formats over in the {@link Ext.Date} documentation.
         * Defaults to `Ext.util.Format.defaultDateFormat`.
         */
        dateTimeFormat: 'd/m/Y H:i',
        /**
         * @cfg {Object}
         * @hide
         */
        component: {
            useMask: true
        }
    },

    initialize: function() {
        this.callParent();

        this.getComponent().on({
            scope: this,

            masktap: 'onMaskTap'
        });

        this.getComponent().input.dom.disabled = true;
    },

    syncEmptyCls: Ext.emptyFn,

    applyValue: function(value) {

    	function isDateTime(val) {
    		var nd = new Date(val);
    		return (nd != 'Invalid Date');
    	}

    	// fix for safari
    	if (Ext.isString(value) && value.match(/\d{4}-\d{2}-\d{2}.*/)) {
    		value = value.replace(/-/g, '/');
    	}

        if (!Ext.isDate(value) && !Ext.isObject(value) && !isDateTime(value)) {
            value = null;
        }

        if (Ext.isObject(value)) {
            value = new Date(value.year, value.month - 1, value.day,value.hour,value.minute);
        }

        if (isDateTime(value)) {
            value = new Date(value);
        }

        return value;
    },

    updateValue: function(newValue) {
        var picker = this._picker;
        if (picker && picker.isPicker) {
            picker.setValue(newValue);
        }

        // Ext.Date.format expects a Date
        if (newValue !== null) {
            this.getComponent().setValue(Ext.Date.format(newValue, this.getDateTimeFormat() || Ext.util.Format.defaultDateFormat));
        } else {
            this.getComponent().setValue('');
        }

        if (this._picker && this._picker instanceof Vtecrm.field.DateTime) {
            this._picker.setValue(newValue);
        }
    },

    /**
     * Updates the date format in the field.
     * @private
     */
    updateDateFormat: function(newDateFormat, oldDateFormat) {
        var value = this.getValue();
        if (newDateFormat != oldDateFormat && Ext.isDate(value) && this._picker && this._picker instanceof Vtecrm.field.DateTime) {
            this.getComponent().setValue(Ext.Date.format(value, newDateFormat || Ext.util.Format.defaultDateFormat));
        }
    },

    /**
     * Returns the {@link Date} value of this field.
     * If you wanted a formated date
     * @return {Date} The date selected
     */
    getValue: function() {
        if (this._picker && this._picker instanceof Vtecrm.field.DateTime) {
            return this._picker.getValue();
        }

        return this._value;
    },

    /**
     * Returns the value of the field formatted using the specified format. If it is not specified, it will default to
     * {@link #dateFormat} and then {@link Ext.util.Format#defaultDateFormat}.
     * @param {String} format The format to be returned
     * @return {String} The formatted date
     */
    getFormattedValue: function(format) {
        var value = this.getValue();
        return (Ext.isDate(value)) ? Ext.Date.format(value, format || this.getDateTimeFormat() || Ext.util.Format.defaultDateFormat) : value;
    },

    applyPicker: function(picker, pickerInstance) {
        if (pickerInstance && pickerInstance.isPicker) {
            picker = pickerInstance.setConfig(picker);
        }

        return picker;
    },

    getPicker: function() {
        var picker = this._picker,
            value = this.getValue();

        if (value == null) value = new Date();

        if (picker && !picker.isPicker) {
            picker = Ext.factory(picker, Vtecrm.field.DateTime);
            picker.on({
                scope: this,
                cancel: 'onPickerCancel',
                change: 'onPickerChange',
                hide  : 'onPickerHide'
            });

            if (value !== null) {
                picker.setValue(value);
            }

            Ext.Viewport.add(picker);
            this._picker = picker;
        }

        return picker;
    },

    /**
     * @private
     * Listener to the tap event of the mask element. Shows the internal DatePicker component when the button has been tapped.
     */
    onMaskTap: function() {
        if (this.getDisabled()) {
            return false;
        }

        if (this.getReadOnly()) {
            return false;
        }

        this.getPicker().show();

        return false;
    },

    /**
     * @private
     * Revert internal date so field won't appear changed
     */
    onPickerCancel: function(picker, options) {
        this._picker = this._picker.config;
        picker.destroy();
        return true;
    },

    /**
     * Called when the picker changes its value
     * @param {Vtecrm.field.DateTime} picker The date picker
     * @param {Object} value The new value from the date picker
     * @private
     */
    onPickerChange: function(picker, value) {
        var me = this;

        me.setValue(value);
        me.fireEvent('change', me, me.getValue());
    },

    /**
     * Destroys the picker when it is hidden, if
     * {@link Vtecrm.field.DateTimePicker#destroyPickerOnHide destroyPickerOnHide} is set to true
     * @private
     */
    onPickerHide: function() {
        var picker = this.getPicker();
        if (this.getDestroyPickerOnHide() && picker) {
            picker.destroy();
            this._picker = true;
        }
    },

    reset: function() {
        this.setValue(this.originalValue);
    },

    // @private
    destroy: function() {
        var picker = this.getPicker();

        if (picker && picker.isPicker) {
            picker.destroy();
        }

        this.callParent(arguments);
    }
}, function() {
    this.override({
        getValue: function(format) {
            if (format) {
                Ext.Logger.deprecate("format argument of the getValue method is deprecated, please use getFormattedValue instead", this);
                return this.getFormattedValue(format);
            }
            return this.callOverridden();
        }
    });

    /**
     * @method getDatePicker
     * @inheritdoc Vtecrm.field.DateTimePicker#getPicker
     * @deprecated 2.0.0 Please use #getPicker instead
     */
    Ext.deprecateMethod(this, 'getDatePicker', 'getPicker');
});

/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * @class Vtecrm.view.ShowRecord
 *
 * The DetailView/EditView for a single record
 *
 */
Ext.define('Vtecrm.view.ShowRecord', {
	extend: 'Ext.Container',

	requires: [
	    'Vtecrm.field.Phone',
	    'Vtecrm.field.MailButton',
	    'Vtecrm.field.UrlButton',
	    'Vtecrm.field.DateTimePicker',
	    'Vtecrm.field.RelatedTo',
	    'Vtecrm.field.MultiSelect',
	    'Vtecrm.field.OwnerSelect',
	    'Vtecrm.field.TimePickerField',
	    'Vtecrm.field.LongTextArea',
	    'Vtecrm.field.HtmlTextArea',
	],

	config: {

		/**
		 *
		 */
		itemId: 'viewShowRecord',

		/**
		 *
		 */
		flex: 1,

		/**
		 *
		 */
		layout: 'hbox',

		/**
		 * @hide
		 */
		hidden: true,

		/**
		 * @hide
		 */
		fullscreen: true,

		/**
		 * @hide
		 */
		scrollable: false,

		/**
		 *
		 */
		module: null,

		/**
		 * @hide
		 * what is this ?
		 */
		record: null,

		/**
		 * @hide
		 */
		fieldsetModule: null,

		/**
		 * The crmid of the record
		 */
		crmid: null,

		/**
		 * The entityname (shown in the title)
		 */
		entityName: null,

		/**
		 * @protected
		 * The parent record
		 */
		parentRecord: null, // record padre (caso related...)

		/**
		 * If true, the record is marked as favourite
		 */
		isFavourite: false,

		/**
		 * If true, on show the data will be reloaded from the server.
		 */
		reloadOnShow: true,

		/**
		 * If true, after create, the data will be reloaded from the server
		 */
		reloadOnCreate: true,

		/**
		 * @hide
		 */
		initValues: {},

		/**
		 * @hide
		 */
		forcedInitValues: {},

		/**
		 * @hide
		 */
		items: [
		    {
		    	itemId: 'showRecordTitlebar',
    	    	xtype: 'titlebar',
    	    	docked: 'top',
    	    	ui: 'dark', //light
				style: { // segnalibro style
					'background-color': '#f80'
				},

    	    	layout: {
    	    		type: 'hbox',
    	    		align: 'center',
    	    	},
    	    	items:[
    	    	    {
    	    	    	itemId: 'recordBtnBack',
    	    	    	xtype: 'button',
    	    	    	align: 'left',
    	    	    	//ui: 'back',
			style: { // segnalibro style
				'background-color': '#00ba00'
			},
    	    	    	iconMask: true,
    	    	    	iconCls: 'arrow_left',
    	    	    	//text: LANG.back,
    	    	    },
    	    	    {
    	    	    	itemId: 'recordBtnShowRight',
    	    	    	xtype: 'button',
    	    	    	align: 'left',
    	    	    	iconMask: true,
    	    	    	iconCls: 'more',
			style: { // segnalibro style
				'background-color': '#00ba00'
			},
			hidden: true //segnalibro
    	    	    	//text: '...',
    	    	    },
		    {
			xtype: 'button',
			itemId: 'btnPdf',
    	    	    	align: 'left',
    	    	    	iconMask: true,
    	    	    	iconCls: 'more',
			style: { // segnalibro style
				'background-color': '#00ba00'
			}
		    },
    	    	    {
    	    	    	itemId: 'modButton',
    	    	    	ui: 'plain',
    	    	    	xtype: 'button',
    	    	    	align: 'left',
    	    	    	iconMask: true,
    	    	    	cls: 'smallMaskSize',
    	    	    	iconCls: 'mask-mod-Generic',
    	    	    	hidden:true,
    	    	    },
	   	    	    {
    	    	    	itemId: 'recordBtnSave',
			xtype: 'button',
			align: 'right',
			text: LANG.save,
			style: { // segnalibro style
				'background-color': '#00ba00'
			},
			hidden: true,
			},
			{
    	    	    	itemId: 'recordInvitation',
			xtype: 'button',
			align: 'right',
			iconMask: true,
    	    	    	iconCls: 'invitation',
			hidden: true,
			},
			{
			itemId: 'recordBtnDownload',
			xtype: 'button',
			align: 'right',
			text: (Ext.os.is.Phone ? null : LANG.download),
			iconMask: (Ext.os.is.Phone ? true : null),
			iconCls: (Ext.os.is.Phone ? 'doc_down' : null),
			hidden: true,
			},
			{
    	    	    	itemId: 'recordBtnToggleFav',
	   	    	    	hidden: true, 
	   	    	    	xtype: 'button',
	   	    	    	align: 'right',
	   	    	    	iconMask: true,
    	    	    	iconCls: 'favorites',
    	    	    	styleHtmlContent: true,
    	    	    	styleHtmlCls: 'noclass',
	   	    	    },
	   	    	    {
	   	    	    	itemId: 'recordBtnDelete',
	   	    	    	xtype: 'button',
	   	    	    	align: 'right',
	   	    	    	iconMask: true,
						style: { // segnalibro style
							'background-color': '#00ba00'
						},
    	    	    	iconCls: 'trash',
	   	    	    	//text: LANG.delete_label,
	   	    	    },
	   	    	    {
	   	    	    	itemId: 'recordRelBtnAdd',
	   	    	    	xtype: 'button',
	   	    	    	align: 'right',
	   	    	    	//text: LANG.add,
	   	    	    	iconMask: true,
	   	    	    	iconCls: 'add',
	   	    	    	hidden: true,
	   	    	    },
	   	    	    {
	   	    	    	itemId: 'recordRelBtnSelect',
	   	    	    	xtype: 'button',
	   	    	    	align: 'right',
	   	    	    	text: LANG.select,
	   	    	    	hidden: true,
	   	    	    },
    	    	]
		    },
			{
				itemId: 'recordRightList',
				xtype: 'list',
				flex: 1,
				height: 'auto',
				//docked: 'left',
				width: (Ext.os.is.Phone ? '100%' : '25%'),
				hidden: Ext.os.is.Phone,
				scrollable: true,
				fullscreen: false,
				itemTpl: '{blocklabel}',
				//itemCls: 'rightListItem blocktype-{type} relmod-{related_module}',
				disclosureCls: 'mask-mod-{related_module}',
				onItemDisclosure: true,
				disclosureProperty: function(data) {
					return (data.type == 'RELATED' || data.type == 'PRODUCTS' || data.type == 'COMMENTS' || data.type == 'PDFMAKER' || data.type == 'INVITEES');
				},
				lastTappedIndex: null,
				store: {
					storeId: 'storeRightList', // TODO: rendere non univoco
					model: 'Vtecrm.model.BlockListItem',
					autoLoad: false,
				},
				hidden: true //segnalibro
			}, // rightlist
			{
				itemId: 'recordFormCont',
				xtype: 'formpanel',
				flex: (screen.width > 800 ? 4 : 3),
				//width: '100%', // TODO: usare flex, che sulla 2.0.3 non vanno
				//layout: 'vbox',
				//height: '100%', // non toccare, su ipad poi non va
				//width: 'auto',
				hidden: false,
				scrollable: 'vertical',
				fullscreen: false,

				listeners: {
					initialize: function(self) {
						// disabilito bounce su android
						if (self.getScrollable() && self.getScrollable().getScroller()) {
							var scroller = self.getScrollable().getScroller();
							if (Ext.os.is.Android) {
								scroller.disableBounce();
							}

							if (CONFIG.autoscroll_blocks) {
								// horrible trick!
								// use timeout, otherwise i don't have the parent
								setTimeout(function() {
									var me = self.getParent();
									if (me) scroller.on({
										scope: me,
										'scroll': me.onScrolling,
										'scrollend': me.onScrollEnd,
									});
								}, 300);
							}
						}
					},
				},

			},
			{
	    		xclass: 'Vtecrm.view.ListRelated',
	    		//flex: (screen.width > 800 ? 4 : 3),
	    	},
	    	{
	    		xclass: 'Vtecrm.view.ListProducts',
	    		//flex: (screen.width > 800 ? 4 : 3),
	    	},
	    	{
	    		xclass: 'Vtecrm.view.ListComments',
	    		hidden: true,
	    		fullscreen: false,
	    		flex: (screen.width > 800 ? 4 : 3),
	    		//useParentToolbar: true,
	    	},
	    	{
	    		xclass: 'Vtecrm.view.ListTicketComments',
	    		hidden: true,
	    		/*hidden: true,
	    		fullscreen: false,
	    		flex: (screen.width > 800 ? 4 : 3),
	    		useParentToolbar: true,*/
	    	},
	    	{
	    		xclass: 'Vtecrm.view.ListPdfMaker',
	    		hidden: true,
	    		fullscreen: false,
	    		flex: (screen.width > 800 ? 4 : 3),
	    		useParentToolbar: true,
	    	},
	    	// if you add a component, remember to update the getActiveContainer method
		],


		// TODO: sposta in un controller
		// eventi per i componenti
		/**
		 * @hide
		 */
		control: {
			'#btnPdf': {
				tap: function(){
					console.log('morebutton');
					this.down('#recordFormCont').hide();
					this.populatePdfMaker(2500000);
				}
			},
			
			'#recordBtnBack': {
				tap: function() {
					var me = this;
    	    		me.onBackButton();
				}
			},

			'#modButton': {
				tap: function() {
					var me = this,
						module = me.getModule(),
						ename = me.getEntityName();
					Ext.Msg.alert(Vtecrm.app.translateString('SINGLE_'+module), ename);
				}
			},

			'#recordBtnSave': {
				tap: function() {
					var me = this;
	    	    	if (!me.checkMandatory()) {
	    	    		Ext.Msg.alert(LANG.alert, LANG.fill_mandatory);
	    	    		return;
	    	    	}

	    	    	if (me.itemChanged || me.productsChanged) me.saveRecord();
				}
			},

			'#recordInvitation' : {
				tap: function() {
					this.onInvitationBtnTap();
				}
			},

			'#recordBtnDownload': {
				tap: function() {
					var me = this;
					me.downloadDocument();
				}
			},

			'#recordBtnToggleFav': {
				tap: function() {
					var me = this;
					me.toggleFavourite();
				}
			},

			'#recordBtnDelete': {
				tap: function() {
					var me = this;
	    	    	Ext.Msg.confirm(LANG.alert, LANG.delete_record, function(buttonId, value, opt) {
	    	    		if (buttonId == 'yes') {
	    	    			me.deleteRecord();
	    	    		}
	    	    	});
				}
			},

			'#recordBtnShowRight': {
				tap: function(self, e, opts) {
					var me = this,
						isphone = Ext.os.is.Phone,
	    				what = me.down('#recordRightList'),
	    				comp = me.getActiveContainer() || me.lastActiveCont || null,
	    				showme = what.getHidden();

					if (opts.show !== undefined && opts.show !== null) showme = opts.show;

					if (showme) {
						if (isphone && comp) {
							me.lastActiveCont = comp;
							comp.hide();
						}
						if (CONFIG.enable_animations) {
							what.show({
								type: 'slideIn',
								direction: 'right',
								duration: 200
							});
						} else {
							what.show();
						}
					} else {
						if (CONFIG.enable_animations) {
							what.hide({
								type: 'slideOut',
								direction: 'left',
								duration: 200
							});
						} else {
							what.hide();
						}
						if (isphone && comp) {
							me.lastActiveCont = null;
							comp.show();
						}
					}
				}
			},

			'#recordRelBtnAdd': {
				tap: function() {
					var me = this,
    					listRel = me.down('#listRelated'),
    					listProd = me.down('#listProducts');

					if (listProd && !listProd.getHidden()) {
						listProd.onButtonAddTap(listProd);
					} else {
						listRel.addRecord();
					}
				}
			},

			'#recordRelBtnSelect': {
				tap: function() {
					var me = this,
						list = me.down('#listRelated');

					list.selectRecord();
				}
			},

			'#recordRightList': {

				disclose: function(self, record) {
					self.select(record);
				},

				select: function(self, record, opts) {
	    			// nascondo gli altri form
				console.log('asd', record);
	    			var index = record.get('xindex'),
	    				blockid = record.get('blockid'),
	    				parent = this,
	    				crmid = (parent.getCrmid() ? parent.getCrmid() : ''),
	    				contForm = parent.down('#recordFormCont'),
	    				formItems = (contForm ? contForm.getItems() : null),
	    				formScroller = (contForm && contForm.getScrollable() ? contForm.getScrollable().getScroller() : null),
	    				contRelated = parent.down('#listRelated'),
	    				contProducts = parent.down('#listProducts'),
	    				contComments = parent.down('#listComments'),
	    				contTickComments = parent.down('#listTicketComments'),
	    				contPdfMaker = parent.down('#listPdfMaker'),
	    				btnAdd = parent.down('#recordRelBtnAdd'),
	    				btnSelect = parent.down('#recordRelBtnSelect'),
	    				backBtn = parent.down('#recordBtnBack'),
	    				rightListBtn = parent.down('#recordBtnShowRight'),
	    				taptype = record.get('type');

	    			if (formItems) {
	    				formItems.each(function(item, index) {
	    					if (item && item.getItemId().match(/^editform/)) item.hide();
	    				});
	    			}

	    			if (self.lastTappedIndex && self.lastTappedIndex == index) {
	    				return;
	    			}

	    			// controllo se salvare i prodotti
	    			// TODO: non andare avanti finchè non ho scelto
	    			if (!contProducts.getHidden() && parent.productsChanged) {
	    				Ext.Msg.confirm(LANG.alert, LANG.save_pending, function(buttonId, value, opt) {
	    					if (buttonId == 'yes') {
	    						parent.saveRecord();
	    					} else {
	    						parent.productsChanged = false;
	    					}
	    				});
	    			}

	    			if (taptype == 'RELATED' || taptype == 'INVITEES') {
	    				contProducts.hide();
	    				contForm.hide();
	    				contComments.hide();
	    				contTickComments.hide();
	    				contPdfMaker.hide();
	    				backBtn.show();
	    				parent.showHideButtons(false);
	    				parent.populateRelated(blockid, taptype);
	    				contRelated.show();
	    			} else if (taptype == 'PRODUCTS') {
	    				contRelated.hide();
	    				contForm.hide();
	    				contComments.hide();
	    				contTickComments.hide();
	    				contPdfMaker.hide();
	    				contProducts.show();
	    				backBtn.show();
	    				parent.showHideButtons(false);
	    				btnSelect.setHidden(true);
	    				btnAdd.setHidden(false);
	    				// populate products
	    				parent.populateProducts(blockid);
	    			} else if (taptype == 'COMMENTS') {
	    				contRelated.hide();
	    				contForm.hide();
	    				contProducts.hide();
	    				contTickComments.hide();
	    				contPdfMaker.hide();
	    				backBtn.hide();
	    				parent.showHideButtons(false);
	    				btnSelect.setHidden(true);
	    				btnAdd.setHidden(true);
	    				parent.populateComments(blockid);
	    			} else if (taptype == 'TICKETCOMMENTS') {
	    				contRelated.hide();
	    				contForm.hide();
	    				contProducts.hide();
	    				contComments.hide();
	    				contPdfMaker.hide();
	    				backBtn.show();
	    				parent.showHideButtons(false);
	    				btnSelect.setHidden(true);
	    				btnAdd.setHidden(true);
	    				parent.populateTicketComments(blockid);
	    			} else if (taptype == 'PDFMAKER') {
	    				contRelated.hide();
	    				contForm.hide();
	    				contProducts.hide();
	    				contComments.hide();
	    				//contPdfMaker.show();
	    				backBtn.hide();
	    				parent.showHideButtons(false);
	    				btnSelect.setHidden(true);
	    				btnAdd.setHidden(true);
	    				parent.populatePdfMaker(blockid); // not really used
	    			} else {
	    				contProducts.hide();
	    				contRelated.hide();
	    				contComments.hide();
	    				contTickComments.hide();
	    				contPdfMaker.hide();
	    				backBtn.show();
	    				contForm.show();
	    				parent.showHideButtons(true);
	    				btnAdd.setHidden(true);
	    				btnSelect.setHidden(true);
	    				var itemShow = contForm.down('#'+parent.getEditformName(blockid));
	    				if (itemShow) itemShow.show();
	    				if (formScroller) formScroller.scrollTo(0,0);
	    			}

	    			self.lastTappedIndex = index;

	    			if (Ext.os.is.Phone) {
	    				rightListBtn.fireEvent('tap', rightListBtn, null, {show:false});
	    			}
				},

				/*itemtap: function(self, index, target, record, event) {

	    		},*/
	    		/*itemswipe: function(self, index, target, record, e) {
	    			var me = this,
	    				btn = me.down('#recordBtnShowRight');

	    			if (e.direction == 'left') {
	    				me.hide({
	    					type: 'slideOut',
	    					direction: 'left',
	    					duration: 200
	    				});
	    				btn.show();
	    			}
	    		}*/
			}

		},

		/**
		 * @hide
		 */
		listeners: {

			show: function() {
				var me = this,
					module = me.getModule(),
					entityname = me.getEntityName(),
					moduleStore = Ext.getStore('modulesStoreOffline'),
					moduleInfo = moduleStore.findRecord('view', module),
					titlebar = me.down('#showRecordTitlebar'),
					modButton = me.down('#modButton'),
					listRelated = me.down('#listRelated');

				// titolo

				if (Ext.os.is.Phone) {
					var maskname = 'mask-mod-'+module;
					if (Vtecrm.app.moduleIconsCss && Vtecrm.app.moduleIconsCss.indexOf('.'+maskname) == -1) {
						maskname = 'mask-mod-Generic';
					}
					modButton.setIconCls(maskname);
					modButton.setHidden(false);
					titlebar.setTitle(null);
				} else {
					titlebar.setTitle(entityname);
				}

				if (moduleInfo) {
					// titolo modulo
					Vtecrm.app.mainview.setMainTitle(moduleInfo.get('label'));
				}

				if (me.getReloadOnShow()) {
					// mostro/nascondo pulsanti
					me.showHideButtons(true);
					// prendo i dati e creo il form
					this.retrieveFields(module, this.getCrmid());
				} else {
					if (!listRelated.getHidden()) {
						var relid = listRelated.getRelationId();
						// se torno in related, aggiorno
						if (relid) me.populateRelated(3000000 + relid);
					}
					me.setReloadOnShow(true);
				}

			},
		}

	},

	// private stuff
	itemChanged: false,
	productsChanged: false,
	// permessi
	perm_delete: false,
	perm_write: true,
	perm_favourites: true,

	perm_delete_record: null,
	perm_write_record: null,

	lastScrollCheck: 0,
	scrollPull: null,
	onScrolling: function(self, x, y, eopts) {
		var me = this,
			minpos = 0,
			maxpos = self.getMaxPosition().y,
			scrollThreshold = 40,
			contForm = me.down('#recordFormCont'),
			rightcont = me.down('#recordRightList');

		// check for bottom/top pull
		if (y < minpos-scrollThreshold) {
			me.scrollPull = 'top';
		} else if (y > maxpos+scrollThreshold) {
			me.scrollPull = 'bottom';
		}

		// do the check every 100px, otherwise it's too heavy
		if (Math.abs(y-me.lastScrollCheck) > 100) {
			// check which form is visible
			var items = contForm.getItems();
			if (items) {
				items.each(function(item, index, itemcount) {
					if (!item.isHidden() && item.element.getY() < 250 && item.element.getY() > -10) {
						var itemid = item.getItemId(),
							blockid = itemid.split('_')[2];
						if (blockid > 0) {
							// select based on index, faster than searching in the store
							if (Ext.os.is.Phone) index -= 1; // skip record label
							rightcont.select(index,false, true);
							rightcont.lastTappedIndex = null;
						}
					}
				});
			}
			me.lastScrollCheck = y;
		}
	},

	onScrollEnd: function(self, x, y, eopts) {
		var i, me = this,
			contForm = me.down('#recordFormCont'),
			scroller = (contForm && contForm.getScrollable() ? contForm.getScrollable().getScroller() : null),
			fitems = (contForm ? contForm.getItems() : null);

		if (!fitems) return;

		if (me.scrollPull == 'top') {
			// scroll to begin

			var lastVisible = null;
			// get first visible
			for (i=0; i<fitems.getCount(); ++i) {
				var item = fitems.getAt(i);
				if (item && item.getHidden() == false && item.getXTypes().match(/fieldset$/)) {
					lastVisible = item;
					break;
				}
			}
			if (lastVisible && i > 0) {
				var toShow = fitems.getAt(i-1);
				if (toShow && toShow.getXTypes().match(/fieldset$/)) {
					toShow.show();
					// scroll back to the previous
					var h = toShow.element.getSize().height;
					scroller.scrollBy(0, h);
				}
			}

		} else if (me.scrollPull == 'bottom') {
			// scroll to end - show next block
			var lastVisible = null;
			// get last visible
			for (i=fitems.getCount()-1; i>=0; --i) {
				var item = fitems.getAt(i);
				if (item && item.getHidden() == false) {
					lastVisible = item;
					break;
				}
			}
			if (lastVisible && i < (fitems.getCount()-1)) {
				var toShow = fitems.getAt(i+1);
				if (toShow) {
					toShow.show();
					scroller.scrollBy(0, 20);
				}
			}
		}

		me.scrollPull = null;
	},

	// extract email addresses from the current record
	/**
	 * Extract all the email addresses (from email fields) from this record
	 */
	getEmailAddresses: function(forAutocomplete) {
		var me = this,
			crmid = me.getCrmid(),
			module = me.getModule(),
			store = Ext.getStore('storeVteBlocks'),
			blocks = storeFindAll(store, 'module', me.getModule()),
			list = [];

		if (!crmid) return list;

		// get email fields
		for (var i=0; i<blocks.length; ++i) {
			var subform,
				block = blocks[i],
				blocktype = block.get('type'),
				fields = Ext.decode(block.get('fields'));

			if (blocktype == 'BLOCK') {
				for (var j=0; j<fields.length; ++j) {
					var fieldname = fields[j].name,
						fieldvalue = (me.savedValues ? me.savedValues[fieldname] : null);

					if (fields[j].type && fields[j].type.name == 'email' && fieldvalue) {
						// ok, add it
						if (forAutocomplete) {
							list.push(Ext.create('Vtecrm.model.VteAutocomplete', {
								'crmid': crmid,
								'fieldid': fields[j].fieldid,
								'module': module,
								'entityname': me.getEntityName()+' <'+fieldvalue+'>',
								'basicname': me.getEntityName(),
								'address': fieldvalue,
							}));
						} else {
							list.push(fieldvalue);
						}
					}
				}
			}

		}
		return list;
	},

	// mostra o nasconde i pulsanti salva/elimina
	showHideButtons: function(show) {
		var me = this,
			delBtn = me.down('#recordBtnDelete'),
			downBtn = me.down('#recordBtnDownload'),
			saveBtn = me.down('#recordBtnSave'),
			favBtn = me.down('#recordBtnToggleFav'),
			invitBtn = me.down('#recordInvitation'),
			module = me.getModule(),
			moduleStore = Ext.getStore('modulesStoreOffline'),
			moduleInfo = moduleStore.findRecord('view', module);

		if (!delBtn || !saveBtn || !favBtn) return;

		if (!show) {
			saveBtn.setHidden(true);
			delBtn.setHidden(true);
			favBtn.setHidden(true);
			downBtn.setHidden(true);
			invitBtn.setHidden(true);
		} else if (moduleInfo) {
			// mostro/nascondo pulsanti
			me.perm_delete = (me.perm_delete_record === null ? (moduleInfo.get('perm_delete') === true) : me.perm_delete_record);
			me.perm_write = (me.perm_write_record === null ? (moduleInfo.get('perm_write') === true) : me.perm_write_record);
			delBtn.setHidden(!me.perm_delete || empty(me.getCrmid()));
			//favBtn.setHidden(!me.perm_favourites);
			if (me.itemChanged || me.productsChanged) saveBtn.setHidden(!me.perm_write);
			else saveBtn.setHidden(true);

			// downloadbutton for documents
			downBtn.setHidden(!((module == 'Documents' || module == 'Myfiles') && me.savedValues && !empty(me.savedValues.filename)));

			// invitation button
			invitBtn[(me.savedValues && me.savedValues.am_i_invited) ? 'show' : 'hide']();
			me.updateInvitationButton();
		}
	},

	// apply the right color to the button
	updateInvitationButton: function() {
		var me = this,
			invitBtn = me.down('#recordInvitation');

		if (invitBtn && me.savedValues && me.savedValues.am_i_invited) {
			invitBtn.removeCls('participationYes');
			invitBtn.removeCls('participationNo');
			if (me.savedValues.invitation_answer == '1') {
				// no
				invitBtn.addCls('participationNo');
			} else if (me.savedValues.invitation_answer == '2') {
				// yes
				invitBtn.addCls('participationYes');
			}
		}
	},

	// show a little panel to answer the invitation
	onInvitationBtnTap: function() {
		var me = this,
			invitBtn = me.down('#recordInvitation');

		var panel = Ext.create('Ext.Panel', {
			modal: true,
			hideOnMaskTap: true,
			layout: 'vbox',
			padding: '2px',
			right: '5px',
			minWidth: '300px',
			items: [
			    {
			    	xtype: 'titlebar',
			    	docked: 'top',
			    	title: LANG.participation,
			    },
			    {
			    	xtype: 'checkboxfield',
			    	label: LANG.participate,
			    	checked: (me.savedValues.invitation_answer == '2'),
			    	listeners: {
			    		scope: me,
			    		change: me.changeInvitation
			    	}
			    }
			],

			listeners: {
				hide: function(self) {
					self.quickDestroy();
				}
			}
		});

		panel.showBy(invitBtn);
	},

	changeInvitation: function(self, value) {
		var me = this;

		self.disable();
		Vtecrm.app.touchRequest('AnswerInvitation', {
			'recordid' : me.getCrmid(),
			'participation' : (value ? 2 : 1),
		}, false, function(data) {
			self.enable();

			if (data && data.success) {
				me.savedValues.invitation_answer = data.invitation_answer;
				me.updateInvitationButton();
			}

		});

	},

	// restituisce il componente attivo
	// TODO: migliora questa funzione orrenda
	getActiveContainer: function() {
		var me = this,
			contForm = me.down('#recordFormCont'),
			contRelated = me.down('#listRelated'),
			contProducts = me.down('#listProducts'),
			contComments = me.down('#listComments'),
			contTicketComments = me.down('#listTicketComments'),
			contPdfMaker = me.down('#listPdfMaker');

		if (!contForm.getHidden()) return contForm;
		else if (!contRelated.getHidden()) return contRelated;
		else if (!contProducts.getHidden()) return contProducts;
		else if (!contComments.getHidden()) return contComments;
		else if (!contTicketComments.getHidden()) return contTicketComments;
		else if (!contPdfMaker.getHidden()) return contPdfMaker;
		else return null;
	},

	/**
	 * Called when the back button is pressed
	 */
	onBackButton: function() {
		var me = this,
			prev = Vtecrm.app.historyGetPrevious();

		if ((me.itemChanged || me.productsChanged) && me.perm_write) {
			Ext.Msg.confirm(LANG.alert, LANG.save_pending, function(buttonId, value, opt) {
				if (buttonId == 'yes') {
					if (me.itemChanged || me.productsChanged) me.saveRecord({noreload: true});
				}
				// imposto il no-reload
	        	if (prev && prev.getItemId && prev.getItemId() == 'viewShowRecord') {
	        		prev.setReloadOnShow(false);
	        	}
				//segnalibro refresh del calendario
			globalCalendar.refreshList();
				Vtecrm.app.historyBack();
			globalCalendar.down('#btnBack').show();
			});
		} else {
			if (prev && prev.getItemId && prev.getItemId() == 'viewShowRecord') {
        		prev.setReloadOnShow(false);
        	}
			globalCalendar.refreshList();
			Vtecrm.app.historyBack();
			globalCalendar.down('#btnBack').show();
		}
	},

	// timer serve per capire quando volte ho richiamato la funzione (evitare deadlock)
	/**
	 * Creates the fieldset to display the record
	 */
	createFieldset: function(timer) {
		// prendo la descrizione dei campi
		var me = this,
			crmid = me.getCrmid(),
			store = Ext.getStore('storeVteBlocks'),
			cont = me.down('#recordFormCont'),
			rightcont = me.down('#recordRightList'),
			//rightdata = [], // TODO: usare
			rightstore = rightcont.getStore(),
			contRelated = me.down('#listRelated'),
			contProducts = me.down('#listProducts');

		maskView();

		// provo a ricaricare lo store dei blocchi se è vuoto
		if ((store.getCount() == 0 || store.getModule() != this.getModule()) && timer !== 2) {

			store.goOffline();
			store.setModule(this.getModule());
			store.load(function(records, operation, succ) {
				if (!records || records.length == 0) {
					// provo a caricare online
					store.goOnline();
					store.load(function(records, operation, succ) {
						if (!records || records.length == 0) console.log('ERROR: no blocks returned');
			    		store.goOffline();
			    		DB.atEnd(function() {
			    			unMaskView();
			    			me.createFieldset(2);
			    		});
	    			});
				} else {
					unMaskView();
	    			me.createFieldset(2);
				}
			});
			return;
		}
		// lista dei blocchi
		store.setModule(this.getModule());
		blocks = storeFindAll(store, 'module', this.getModule());

		cont.removeAll(); // davvero?
		rightstore.removeAll();

		//creo il titolo nel caso di telefoni
		if (Ext.os.is.Phone) {
			var formtitle = Ext.create('Ext.Label', {
				xtype: 'label',
				styleHtmlContent: true,
				styleHtmlCls: 'recordLabel',
				html: me.getEntityName(),
			});
			cont.add([formtitle]);
		}

		// TODO: fare le aggiunte tutte in una volta
		for (var i=0; i<blocks.length; ++i) {
			var subform,
				block = blocks[i],
				blocktype = block.get('type'),
				fields = Ext.decode(block.get('fields'));

			/*rightdata.push({
				title: block.get('label'),
			});*/

			// skip related if in creation
			if (blocktype != 'BLOCK' && empty(crmid)) continue;

			// lista laterale
			rightstore.add({
				blockid: block.get('blockid'),
				blocklabel: block.get('label'),
				type: blocktype,
				related_module: block.get('related_module')
			});

			if (blocktype == 'BLOCK') {

				// creo il form
				subform = Ext.create('Ext.form.FieldSet', {
					itemId: me.getEditformName(block.get('blockid')),
					xtype: 'fieldset',
					title: block.get('label'),
					verticalLayout: CONFIG.vertical_layout,
					hidden: (i > 0), // mostro solo il primo
				});
				// creo i campi
				for (var j=0; j<fields.length; ++j) {
					var fieldname = fields[j].name;
					//segnalibro seleziono i campi inutili
					var hidden = false;
					if(fieldname == 'pause_start' || fieldname == 'pause_end'|| fieldname == 'place' || fieldname == 'calendar' || fieldname == 'duration'  || fieldname == 'external_code' || fieldname == 'cf_deleted'  || fieldname == 'bill' || fieldname == 'modifiedtime' || fieldname == 'createdtime' || fieldname == 'detail' || fieldname == 'link_to_task' || fieldname == 'link_to_ticket' || fieldname == 'assigned_user_id') {
						hidden = true; //continue; 
					}
					var	fieldvalue = (me.savedValues ? me.savedValues[fieldname] : null);// segnalibro savedvalues per la data selezionata

					if (!crmid) {
						fieldvalue = (fieldname == 'diary_date' ? globalCalendar.getDateValues().event_start : (me.savedValues ? me.savedValues[fieldname] : null));// segnalibro savedvalues per la data selezionata
						
					} else {
						if (fieldname == 'link_to_account') globalAccountSelected = me.savedValues['link_to_account'].display.trim();
						fieldvalue = (me.savedValues ? me.savedValues[fieldname] : null);
					}
					var	fieldinfo = createFieldConfig(block.get('module'), fields[j], this, fieldvalue, true, hidden); //segnalibro aggiunto parametro hidden per nascondere i campi inutili
	
					var fieldcmp = Ext.create(fieldinfo[0], fieldinfo[1]);
					// salvo per ogni campo la propria struttura
					fieldcmp.struct = fields[j];
					subform.add([fieldcmp]);
				}
			}

			if (subform) cont.add([subform]);
		}

		// selezioni il primo
		if (rightcont.getStore().getCount() > 0) {
			rightcont.selectRange(0,0);
			contProducts.hide();
			contRelated.hide();
		}
		// aggiungo alla lista laterale
		//rightcont.getStore().add(rightdata);

		this.setFieldsetModule(this.getModule());
		unMaskView();
	},

	// calcola il nome per il form che contiene un blocco
	getEditformName: function(blockid) {
		var me = this,
			crmid = me.getCrmid();

		if (empty(crmid)) crmid = '';
		return 'editform_'+crmid+'_'+blockid;
	},

	// trova l'id del blocco dall'id del form
	getBlockidFromEditform: function(formname) {
		var lastUs = formname.lastIndexOf('_');

		if (lastUs != -1) {
			return formname.substr(lastUs+1);
		}
		return 0;
	},

	/**
	 *
	 */
	toggleFavourite: function() {
		var me = this;
		me.setFavourite(!me.getIsFavourite());
	},

	/**
	 *
	 */
	setFavourite: function(enable) {
		var me = this,
			crmid = me.getCrmid(),
			oldstatus = me.getIsFavourite();

		if (enable == oldstatus) return;

		maskView();
		Ext.Ajax.request({
			url: vtwsUrl + 'ws.php?wsname=SetFavorites',
			params: vtwsOpts+'&records='+crmid,
			method: 'POST',
			useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
		    success: function (b) {
		    	unMaskView();
		    	if (empty(b.responseText)) return;
		    	me.setBtnFavourite(enable);
				me.setIsFavourite(enable);
		    },
		});

	},

	setBtnFavourite: function(enable) {
		/* var me = this,
			btn = me.down('#recordBtnToggleFav');

		if (enable) {
			btn.setStyleHtmlCls('fav_active');
		} else {
			btn.setStyleHtmlCls('noclass');
		} */
	},

	/**
	 * Checks if there are mandatory empty fields
	 */
	checkMandatory: function() {
		var me = this,
			cont = me.down('#recordFormCont'),
			rightcont = me.down('#recordRightList'),
			blocks = cont.getInnerItems(),
			crmid = (me.getCrmid() ? me.getCrmid() : ''),
			ret = true, firstfocus = false,
			i, j, fields, field, val;

		for (i=0; i<blocks.length; ++i) {
			if (!blocks[i].getItems) continue;
			fields = blocks[i].getItems();
			for (j=0; j<fields.length; ++j) {
				field = fields.getAt(j);
				if (field && field.getRequired && field.getRequired() && field.getDisabled && !field.getDisabled()) {
					if (field.isXType('checkboxfield')) {
						val = field.isChecked();
					} else {
						val = field.getValue();
					}
					if (empty(val)) {
						field.setRequiredAlert(true);
						if (!firstfocus) {
							firstfocus = true;
							rightcont.select(i);
							rightcont.setActiveItem(i);
							// show the block
							if (blocks[i]) blocks[i].show();

							// no focus if related
							if (field.struct && field.struct.type.name == 'reference') {

							} else {
								if (field.focus) field.focus();
							}
						}
						ret = false;
					} else {
						field.setRequiredAlert(false);
					}
				}
			}

		}
		return ret;
	},

	/**
	 * Loads data from the server
	 */
	retrieveFields: function(module, crmid) {
		var me = this,
			mtime =  (new Date()).getTime(),
			parent = me.getParentRecord(),
			btnFav = me.down('#recordBtnToggleFav'),
			btnDown = me.down('#recordBtnDownload'),
			initialValues = me.getInitValues() || {},
			forcedInitValues = me.getForcedInitValues() || {},
			extradata = '';

		// TODO: temporaneamente rimosso
		/*if (empty(crmid) || crmid === 0) { // creazione
			me.savedValues = {};
			// ricreo in ogni caso
			// TODO: svuotare solo i campi
			me.createFieldset();
			return;
		}*/

		// gestione parent
		if (parent) {
			extradata = {
				'parent_module': parent.getModule(),
				'parent_id': parent.getCrmid(),
			}
			extradata = '&APP_DATA='+Ext.encode(extradata);
		}

		// prende un record da vte
		// TODO: salvarlo in db per uso futuro/offline
		maskView();
		Ext.Ajax.request({
			url: vtwsUrl + 'ws.php?wsname=GetRecord&_dc='+mtime,
			params: vtwsOpts+'module='+module+'&record='+crmid+'&set_recent=1'+extradata,
			method: 'POST',
			useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
		    success: function (b) {
		    	if (empty(b.responseText)) return;

		    	try {
		    		me.savedValues = Ext.decode(b.responseText);
		    		if (!crmid && initialValues) {
		    			me.savedValues = Ext.merge(initialValues, me.savedValues, forcedInitValues);
		    		}
		    		// preferito
		    		if (me.savedValues.vtecrm_favourite === undefined) {
		    			btnFav.hide();
		    			me.perm_favourites = false;
		    		} else {
		    			me.perm_favourites = true;
		    			me.setBtnFavourite(me.savedValues.vtecrm_favourite);
		    			me.setIsFavourite(me.savedValues.vtecrm_favourite);
		    		}
		    		// permessi
		    		if (me.savedValues.vtecrm_permissions !== undefined) {
		    			me.perm_read_record = me.savedValues.vtecrm_permissions.perm_read;
		    			me.perm_delete_record = me.savedValues.vtecrm_permissions.perm_delete;
		    			me.perm_write_record = me.savedValues.vtecrm_permissions.perm_write;
		    			me.showHideButtons(true);
		    		}
		    	} catch (e) {
		    		Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
		    		unMaskView();
		    		return;
		    	}

		    	// ricreo il form se necessario
		    	unMaskView();

		    	// check read permission
		    	if (me.perm_read_record === false) {
		    		Ext.Msg.alert(LANG.error, LANG.not_enough_privileges, function() {
		    			me.onBackButton();
		    		});
		    	} else {
		    		//if (me.getFieldsetModule() == null || me.getFieldsetModule() != module) {
						me.createFieldset();
					//}
		    	}
		    },
		});

	},


	populateRelated: function(blockid, type) {
		var me = this,
			module = me.getModule(),
			recordid = me.getCrmid(),
			listcont = me.down('#listRelated'),
			store = Ext.getStore('storeVteBlocks');

		type = type || 'RELATED';
		var deltas = {
			'RELATED' : 3000000,
			'INVITEES': 0
		};

		listcont.setModule(module);

		listcont.setRelationId(blockid - deltas[type]);
		listcont.setCrmid(recordid);
		var record = store.findRecord('blockid', blockid);

		if (record) {
			listcont.setFieldStruct(Ext.decode(record.get('fields')));
			var act = record.get('actions');
			// i can't add new invitees if i can't edit the record
			if (type == 'INVITEES' && me.perm_write_record === false) {
				act = '';
			}
			listcont.setActions( empty(act) ? [] : act.split(','));
			listcont.setRelatedModule(record.get('related_module'));
		}

		listcont.getStore().removeAll();
		listcont.getStore().loadPage(1);
	},

	// todo: unificare con sopra?
	populateProducts: function(blockid) {
		var me = this,
			module = me.getModule(),
			recordid = me.getCrmid(),
			listcont = me.down('#listProducts'),
			store = Ext.getStore('storeVteBlocks');

		listcont.setModule(module);
		listcont.setCrmid(recordid);
		var record = store.findRecord('blockid', blockid);
		if (record) {
			listcont.setFieldStruct(Ext.decode(record.get('fields')));
		}

		listcont.getStore().removeAll();
		//listcont.getStore().data.clear();
		listcont.getStore().loadPage(1);
	},

	populateComments: function(blockid) {
		var me = this,
			listcomm = me.down('#listComments'),
			toolbar = me.down('#showRecordTitlebar');

		listcomm.setCrmid(me.getCrmid());
		listcomm.setToolbar(toolbar);
		//listcomm.removeAll();
		listcomm.show();

	},

	populateTicketComments: function(blockid) {
		var me = this,
			listcomm = me.down('#listTicketComments');

		listcomm.setCrmid(me.getCrmid());
		listcomm.setUseParentToolbar(true);
		//listcomm.removeAll();
		listcomm.getStore().removeAll();
		listcomm.getStore().loadPage(1);
		listcomm.show();
	},

	populatePdfMaker: function(blockid) {
		var me = this,
			listpdf = me.down('#listPdfMaker');

		listpdf.setCrmid(me.getCrmid());
		listpdf.setModule(me.getModule());
		if (me.savedValues && me.savedValues.vtecrm_pdfmaker !== undefined) {
			listpdf.setPdfInfo(me.savedValues.vtecrm_pdfmaker);
		}
		listpdf.setUseParentToolbar(true);
		listpdf.show();
	},

	getToolbar: function() {
		return this.down('#showRecordTitlebar');
	},

	/**
	 * Deletes the record
	 */
	deleteRecord: function() {
		var me = this,
			crmid = me.getCrmid(),
			mtime =  (new Date()).getTime(),
			module = me.getModule();

		maskView();
		Ext.Ajax.request({
			url: vtwsUrl + 'ws.php?wsname=DeleteRecord&_dc='+mtime,
			params: vtwsOpts+'module='+module+'&record='+crmid,
			method: 'POST',
			useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
		    success: function (b) {
		    	unMaskView();

		    	if (empty(b.responseText)) {
		    		Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
		    		return;
		    	}

		    	if (b.responseText == 'SUCCESS') {
		    		me.itemChanged = false;
		    		me.productsChanged = false;
		    		// reload task count
		    		if (module == 'Calendar') Vtecrm.app.countTodos();
		    		// go back to list
		    		me.onBackButton();
		    	} else {
		    		Ext.Msg.alert(LANG.error, b.responseText);
		    	}
		    },
		});
	},

	/**
	 * Saves the record
	 */
	saveRecord: function(config) {
		var me = this,
			crmid = me.getCrmid(),
			mtime =  (new Date()).getTime(),
			module = me.getModule(),
			form = me.down('#recordFormCont'),
			values = form.getValues(),
			prodlist = me.down('#listProducts'),
			rightlist = me.down('#recordRightList'),
			parent = me.getParentRecord(),
			fldname, id, typename;

		config = config || {};

		maskView();

		if (empty(crmid)) crmid = '';

		// converte i valori per il vte
		for (fldname in values) {
			cmp = form.down('#field_'+module+'_'+crmid+'_'+fldname);
			if (cmp) {
				typename = cmp.struct.type.name;
    			switch (typename) {
    				case 'reference':
    					if (cmp.getCrmid && cmp.getCrmid()) {
    						values[fldname] = cmp.getCrmid();
    					} else {
    						values[fldname] = 0;
    					}
    					break;
    				case 'boolean':
    					values[fldname] = (cmp.getChecked() ? 1 : 0);
    					break;
    				default:
    					break;
    			}

			}
		}


		// gestione blocco prodotti
		if (me.productsChanged && prodlist && prodlist.getProductsData) {
			values['product_block'] = prodlist.getProductsData();
		}

		// gestione parent
		if (parent) {
			values['APP_DATA'] = {
				'parent_module' : parent.getModule(),
				'parent_id' : parent.getCrmid(),
			}
		}

		// TODO: related, use the Vtecrm.app.touchRequest (problems with maskview)

		Ext.Ajax.request({
			url: vtwsUrl + 'ws.php?wsname=SaveRecord&_dc='+mtime,
			method: 'POST',
			params: vtwsOpts+'module='+module+'&record='+crmid+'&values='+encodeURIComponent(Ext.encode(values)),
			useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
		    success: function (b) {
		    	unMaskView();
		    	if (empty(b.responseText)) return;

		    	try {
		    		var response = Ext.decode(b.responseText);
		    	} catch (e) {
		    		Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
   		    		return;
   		    	}

		    	if (response.success) {
		    		me.itemChanged = false;
		    		me.productsChanged = false;
		    		me.showHideButtons(true);

		    		// ricarico todo counter se sono nel calendario
		    		if (module == 'Calendar') {
		    			Vtecrm.app.countTodos();
		    		}

		    		var type = 'update';

		    		// creazione, ricarico
		    		if (empty(crmid) && response.result && !config['noreload']) {
		    			var newcrmid = response.result.crmid;
		    			if (!empty(newcrmid)) {
		    				type = 'create';
		    				me.setCrmid(newcrmid);
		    				crmid = newcrmid;
		    				// ricarica tutto
		    				if (rightlist) rightlist.lastTappedIndex = null;
		    				if (me.getReloadOnCreate())	me.retrieveFields(module, newcrmid);
		    			}
		    		}
		    		me.fireEvent('recordsaved', me, type, module, crmid, values);
		    	} else {
		    		Ext.Msg.alert(LANG.error, response.error);
		    	}
		    },
		});
	},

	/**
	 * Downloads a document
	 */
	downloadDocument: function() {
		var me = this,
			module = me.getModule();

		if ((module == 'Documents' || module == 'Myfiles') && me.savedValues && !empty(me.savedValues.filename)) {
			var fname = me.savedValues.filename;
			window.open(fname, '_system', 'location=no');
		}

	}

});

/**
 * @class global
 */


// TODO: passare un hint per le related
// TODO: move inside the class
/**
 * Returns the configuration to create a suitable field component in the format [class, config_object]
 * @param {String} module The module
 * @param {Object} field The field structure
 * @param {Object} scope A reference to the Vtecrm.view.ShowRecord component
 * @param {String} savedValue The original value of the field
 * @param {Boolean} verticalLayout Indicates if the new vertical layout should be used
 * @return {Array}
 */
function createFieldConfig(module, field, scope, savedValue, verticalLayout, hidd) {
	var moduleStore = Ext.getStore('modulesStoreOffline'),
		moduleInfo = moduleStore.findRecord('view', module),
		type = field.type,
		retClass = 'Ext.field.Text',
		retConfig = {},
		extraConfig = {},
		label = field.label,
		xtype = 'textfield',
		required = field.mandatory,
		defaultValue = '',
		readonly = ( (scope && scope.perm_write === false) ? true : !(field.editable)),
		disabled = false,
		options = null,
		now = new Date(),
		hidd = hidd,
		crmid = (scope && scope.getCrmid && scope.getCrmid() > 0) ? scope.getCrmid() : '';

		// if not speicified, use the global setting
	if (verticalLayout === undefined || verticalLayout === null) verticalLayout = CONFIG.vertical_layout;

	// gestione tipi(usando info sul tipo da webservice)
	switch (type.name) {
		case 'picklist':
		case 'picklistmultilanguage': {
			retClass = 'Ext.field.Select';
			xtype = 'selectfield';
			options = [];
			// fake empty value for multilang picklist
			if (type.name == 'picklistmultilanguage') {
				options.push({
					value: '',
					text: '-- ' + LANG.please_select + ' --'
				});
			}
			if (type.picklistValues) {
				for (var i=0; i<type.picklistValues.length; ++i) {
					options.push({
						value: type.picklistValues[i].value,
						text: type.picklistValues[i].label,
					});
				}
			}
			extraConfig = {
				clearIcon: false,
			}
			break;
		}
		case 'multipicklist': {
			retClass = 'Vtecrm.field.MultiSelect';
			xtype = 'multiselectfield';
			options = [];
			for (var i=0; i<type.picklistValues.length; ++i) {
				options.push({
					value: type.picklistValues[i].value,
					text: type.picklistValues[i].label,
				});
			}
			extraConfig = {
				okButtonLabel: LANG.ok,
				showAllButton: false,
				clearIcon: false,
			}
			break;
		}
		case 'owner': {
			retClass = 'Vtecrm.field.OwnerSelect';
			xtype = 'ownerselectfield';

			if (moduleInfo && moduleInfo.get('access') == 'private') {
				// show only me (and the value)
				var ulist = [];
				ulist.push(Vtecrm.app.userstore.findRecord('userid', current_user.userid));
				if (savedValue > 0) {
					ulist.push(Vtecrm.app.userstore.findRecord('userid', savedValue));
				}
				var ownerstore = Ext.create('Ext.data.Store', {
					model: 'Vtecrm.model.VteUser',
					data: Ext.Array.clean(ulist)
				});
			} else {
				// show all users
				var ownerstore = Vtecrm.app.userstore;
			}
			extraConfig = {
				listsConfig: [
				    {
				    	store: ownerstore,
				    	itemTpl: '{complete_name}',
				    	displayField: 'complete_name',
				    	valueField: 'userid',
				    	buttonText: LANG.users,
				    },
				    {
				    	store: Vtecrm.app.groupstore,
				    	itemTpl: '{groupname}',
				    	displayField: 'groupname',
				    	valueField: 'groupid',
				    	buttonText: LANG.groups,
				    },
				],
                clearIcon: false,
			}
			break;
		}
		case 'time': {
			retClass = 'Vtecrm.field.TimePickerField';
			xtype = 'timepickerfield';
			break;
		}
		case 'date': {
			retClass = 'Ext.field.DatePicker';
			xtype = 'datepickerfield';
			extraConfig = {
				dateFormat: 'd/m/Y',
				picker: {
					dayText: LANG.day,
					monthText: LANG.month,
					yearText: LANG.year,
					yearFrom: 1990,
					yearTo: now.getFullYear() + 10,
				}
			}
			break;
		}
		case 'datetime': {
			retClass = 'Vtecrm.field.DateTimePicker';
			xtype = 'datetimepicker';
			extraConfig = {
				dateTimeFormat: 'Y-m-d H:i:s',
				picker: {
					dayText: LANG.day,
					monthText: LANG.month,
					yearText: LANG.year,
					yearFrom: 1990,
					yearTo: now.getFullYear() + 10,
				}
			}
			break;
		}
		case 'integer':
		case 'double': {
			if (savedValue && typeof savedValue == 'string' && !savedValue.match(/^[+-]*[0-9,.]*$/)) {
				// in case the value it's not numeric, treat it as a string
				retClass = 'Ext.field.Text';
				xtype = 'textfield';
			} else {
				retClass = 'Ext.field.Number';
				xtype = 'numberfield';
			}
			break;
		}
		case 'currency': {
			retClass = 'Ext.field.Number';
			xtype = 'numberfield';
			label = label + ' ('+type.symbol+')';
			// remove special chars
			if (savedValue) {
				savedValue = parseFloat(savedValue.replace(/&#?[a-z0-9]{2,8};/i,""));
			}
			break;
		}
		case 'phone': {
			retClass = 'Vtecrm.field.Phone';
			xtype = 'phonefield';
			break;
		}
		case 'email': {
			retClass = 'Vtecrm.field.MailButton';
			xtype = 'mailbuttonfield';
			break;
		}
		case 'file': {
			retClass = 'Vtecrm.field.UrlButton';
			xtype = 'urlbuttonfield';
			extraConfig['newWindow'] = true;
			// removed
			//if (scope && scope.savedValues && scope.savedValues['filelocationtype'] == 'I') {
				extraConfig['filterFunc'] = function(v) {
					return v.replace(/^.*\//, ''); // return only basename
				};
			//}
			break;
		}
		case 'url': {
			retClass = 'Vtecrm.field.UrlButton';
			xtype = 'urlbuttonfield';
			break;
		}
		case 'boolean': {
			retClass = 'Ext.field.Checkbox';
			xtype = 'checkboxfield';
			extraConfig['checked'] = (savedValue === true || savedValue === '1' || savedValue === 'true');
			//retClass = 'Ext.field.Toggle';
			//xtype = 'togglefield';
			break;
		}
		case 'text': {
			if (field.uitype == 210) {
				retClass = 'Vtecrm.field.HtmlTextArea';
				xtype = 'htmltextareafield';
			} else {
				retClass = 'Vtecrm.field.LongTextArea';
				xtype = 'longtextareafield';
			}
			// non si può, sono textarea
			//if (savedValue) savedValue = savedValue.url2link().mail2link();
			break;
		}
		case 'reference': {
			var referMod = type.refersTo[0];
			// TODO: multipli
			if (referMod == 'Users') {
				retClass = 'Ext.field.Select';
				xtype = 'selectfield';
				extraConfig = {
					store: Vtecrm.app.userstore,
					displayField: 'complete_name',
					valueField: 'userid',
				}
				if (savedValue && savedValue.crmid)	savedValue = savedValue.crmid;
			} else {
				retClass = 'Vtecrm.field.RelatedTo';
				xtype = 'relatedtofield';
				if (savedValue && savedValue.crmid > 0) {
					extraConfig['crmid'] = savedValue.crmid;
					extraConfig['setype'] = savedValue.setype || field.type.refersTo[0];
					extraConfig['allSetypes'] = field.type.refersTo;
					savedValue = savedValue.display;
				} else {
					if (field.type.refersTo && field.type.refersTo.length > 0) {
						if (field.type.refersTo.length == 1) {
							extraConfig['setype'] = field.type.refersTo[0];
						} else {
							extraConfig['setype'] = extraConfig['allSetypes'] = field.type.refersTo;
						}
					}
					savedValue = '';
				}
				// TODO
			}
			break;
		}
		case 'string':
		default:
			retClass = 'Ext.field.Text';
			xtype = 'textfield';
	}

	// gestione basata su uitype
	switch (field.uitype) {
		case '4':
			required = true;
			defaultValue = LANG.autogenerate_msg;
			disabled = true;
			break;
		case '16':
			required = true;
			break;
		case '20':
		case '22':
			required = true;
			break;
		case '23':
			// obbligatorio? di default quella odierna?
			break;
	}

	if (required && empty(defaultValue)) {
		defaultValue = LANG.mandatory_field;
	}
	if (savedValue !== undefined && savedValue !== null && savedValue !== '') {
		extraConfig.value = savedValue;
	}

	// gestione config // TODO: impostare field se related
	retConfig = {
		//'id': 'field_'+module+'_'+crmid+'_'+field.name,
		'itemId': 'field_'+module+'_'+crmid+'_'+field.name,
		'xtype': xtype,
		'required': required,
		'readOnly': readonly,
		'name': field.name,
		'label': label,
		'placeHolder': defaultValue,
		'disabled': disabled,
		'options': options,
		'clearIcon': true,
		'verticalLayout': verticalLayout,
		listeners: {
			change: {
				'fn': onFieldChange,
				'scope': scope
			}
		},
		hidden: hidd, //segnalibro variabile per nascondere i campi inutili nei rapportini
		value: savedValue
	};

	retConfig = Object.merge(retConfig, extraConfig);

	return [retClass, retConfig];
}

// called when a field changes
function onFieldChange(self, newValue, oldValue, eOpts) {
	var me = this, // the showRecord instance
		val = self.getValue(),
		itemid = self.getItemId(),
		ids = itemid.split('_'),
		module = (ids ? ids[1] : ''),
		crmid = (ids ? ids[2] : ''),
		fieldname = self.getName();

	// gestione colorazione per campi obbligatori
	if (self.getRequired && self.getRequired() && !self.getDisabled()) {
		self.setRequiredAlert(empty(val));
	}

	if (!me) return;
	// from now we have ShowRecord Instance

	var prodlist = me.down('#listProducts'),
		formCont = me.down('#recordFormCont');

	// calendar handler -> set due date based on date start
	if ((module == 'Calendar' || module == 'Events') && fieldname == 'date_start') {
		var duefield = formCont.down('#field_'+module+'_'+crmid+'_due_date');
		if (duefield && duefield.getValue() < val) {
			duefield.setValue(val);
		}
	}

	if (prodlist && !prodlist.isHidden()) {
		me.productsChanged = true;
	} else {
		me.itemChanged = true;
	}

	me.showHideButtons(true);

}

/*
uitypes testati:

1, 2, 4, 5, 7, 9, 11, 13, 15, 19,20,21,22, 24, 33, 55, 56, 71, 255, 1013, 70 (nascondi in creazione)

incerti:
23

uitypes da fare:
6 (datetime del calendario)

da verificare:
10
59: popup prodotti
66 related del calendario (related_to in seactivityrel)
68: parentid dei ticket
73: popup accounts
75: popup vendors
76: popup potentials
80: popup sales order
81: popup vendors

116, 117: related to currency

69: image di contatti e prodotti
83: saltato
85 (skype) : saltato


52,77 (picklist utente) - visto come reference to users
53 (picklist utente+gruppo) - tipo owner - aggiungere i gruppi - controllare se filtrare utenti

*/
/*
Ext.ux.TouchCalendar
*/

//segnalibro startEventField:"start",endEventField:"end" sostituiti coi rispettivi per la visualizzazione
Ext.define("Ext.ux.TouchCalendar",{extend:"Ext.carousel.Carousel",xtype:"calendar",config:{viewMode:"month",enableSwipeNavigate:true,enableSimpleEvents:false,enableEventBars:false,viewConfig:{}},defaultViewConfig:{viewMode:"MONTH",weekStart:1,bubbleEvents:["selectionchange","longpresscell"]},indicator:false,initialize:function(){this.viewConfig=Ext.applyIf(this.viewConfig||{},this.defaultViewConfig);this.viewConfig.currentDate=this.viewConfig.currentDate||this.viewConfig.value||new Date();this.setViewMode(this.viewConfig.viewMode.toUpperCase());this.initViews();Ext.apply(this,{cls:"touch-calendar",activeItem:(this.getEnableSwipeNavigate()?1:0),direction:"horizontal"});this.setIndicator(false);this.setActiveItem(1);this.on("selectionchange",this.onSelectionChange);this.on("activeitemchange",this.onActiveItemChange);if(this.getEnableSwipeNavigate()){this.on(this.element,{drag:this.onDrag,dragThreshold:5,dragend:this.onDragEnd,direction:this.direction,scope:this});this.element.addCls(this.baseCls+"-"+this.direction)}},getViewConfig:function(c){var a=[];if(this.getEnableSimpleEvents()){var b=Ext.isObject(this.getEnableSimpleEvents())?this.getEnableSimpleEvents():{};a.push(Ext.create("Ext.ux.TouchCalendarSimpleEvents",b))}else{if(this.getEnableEventBars()){var b=Ext.isObject(this.getEnableEventBars())?this.getEnableEventBars():{};a.push(Ext.create("Ext.ux.TouchCalendarEvents",b))}}Ext.apply(this._viewConfig,{plugins:a,currentDate:c,viewMode:this.getViewMode(),onTableHeaderTap:Ext.bind(this.onTableHeaderTap,this),bubbleEvents:["periodchange","eventtap","selectionchange","longpresscell"]});return this._viewConfig},getViewDate:function(a,b){var d=(this.getViewMode()==="WEEK"?"DAY":this.getViewMode().toUpperCase()),c=(this.getViewMode()==="WEEK"?(8*b):b);return Ext.Date.add(a,Ext.Date[d],c)},initViews:function(){var c=[];var f=Ext.Date.clone(this.viewConfig.currentDate),d=(this.getEnableSwipeNavigate()?-1:0),a=(this.getEnableSwipeNavigate()?1:0),b=[];var e=this.getViewDate(f,-1);c.push(Ext.create("Ext.ux.TouchCalendarView",Ext.applyIf({currentDate:e},this.getViewConfig(e))));c.push(Ext.create("Ext.ux.TouchCalendarView",Ext.ux.TouchCalendarView(this.getViewConfig(f))));e=this.getViewDate(f,1);c.push(Ext.create("Ext.ux.TouchCalendarView",Ext.ux.TouchCalendarView(Ext.applyIf({currentDate:e},this.getViewConfig(e)))));this.setItems(c);this.view=c[(this.getEnableSwipeNavigate()?1:0)]},onTableHeaderTap:function(b,a){a=Ext.fly(a);if(a.hasCls(this.view.getPrevPeriodCls())||a.hasCls(this.view.getNextPeriodCls())){this[(a.hasCls(this.view.getPrevPeriodCls())?"previous":"next")]()}},applyViewMode:function(a){return a.toUpperCase()},updateViewMode:function(a){this.viewConfig=this.viewConfig||{};this.viewConfig.viewMode=a;if(this.view){Ext.each(this.getInnerItems(),function(b,c){b.currentDate=this.getViewDate(Ext.Date.clone(this.view.currentDate),c-1);b.setViewMode(a,true);b.refresh()},this)}},getValue:function(){var a=this.view.getSelected();return(a.length>0)?a:null},setValue:function(b){var a=this.getItems(),f=a.get(0),e=a.get(a.getCount()-1),d=this.getViewDate(b,-1),c=this.getViewDate(b,+1);this.view.currentDate=b;this.view.setValue(b);this.view.refresh();if(this.getEnableSwipeNavigate()){f.currentDate=d;f.setValue(d);f.refresh();e.currentDate=c;e.setValue(c);e.refresh()}},onActiveItemChange:function(a,g,b){if(this.getEnableSwipeNavigate()){var d=this.getItems();var h=d.indexOf(g),e=d.indexOf(b),f=(h>e)?"forward":"backward";this.counter=(this.counter||0)+1;if(f==="forward"){this.remove(d.get(0));var c=new Ext.ux.TouchCalendarView(this.getViewConfig(this.getViewDate(g.currentDate,1)));this.add(c)}else{this.remove(d.get(d.getCount()-1));var c=new Ext.ux.TouchCalendarView(this.getViewConfig(this.getViewDate(g.currentDate,-1)));this.insert(0,c)}this.view=g;var i=this.view.getPeriodMinMaxDate();this.fireEvent("periodchange",this.view,i.min.get("date"),i.max.get("date"),f)}},refreshAll:function(){var b=this,a=b.getInnerItems();a.forEach(function(c){c.refresh()})},refreshEvents:function(){var b=this,a=b.getInnerItems();a.forEach(function(c){if(c.eventsPlugin){c.eventsPlugin.refreshEvents()}if(c.simpleEventsPlugin){c.simpleEventsPlugin.refreshEvents()}})}});Ext.define("Ext.ux.TouchCalendarView",{extend:"Ext.Container",alias:"widget.touchcalendarview",config:{viewMode:"month",weekStart:1,startHour:"00:00",endHour:"24:00",todayCls:"today",selectedItemCls:"selected",unselectableCls:"unselectable",prevMonthCls:"prev-month",nextMonthCls:"next-month",weekendCls:"weekend",sundayCls:"sunday",prevPeriodCls:"goto-prev",nextPeriodCls:"goto-next",dayTimeSlotSize:30,timeSlotDateTpls:{},hideHalfHourTimeSlotLabels:true,value:null,store:null,baseTpl:['<table class="{[this.me.getViewMode().toLowerCase()]}" cellspacing="0" cellpadding="0">',"<thead>","<tr>",'<tpl for="this.getDaysArray(values)">','<th class="{[this.getHeaderClass(xindex)]}">','<tpl if="xindex === 4">','<span>{[Ext.Date.format(this.me.currentDate, "F")]} {[Ext.Date.format(this.me.currentDate, "Y")]}</span>',"</tpl>",'{date:date("D")}',"</th>","</tpl>","</tr>","</thead>","<tbody>",'<tr class="time-block-row">','<tpl for=".">','<td class="time-block {[this.getClasses(values)]}" datetime="{[this.me.getDateAttribute(values.date)]}">',"{date:this.formatDate()}","</td>",'<tpl if="this.isEndOfRow(xindex)">',"</tr>",'<tpl if="!this.isEndOfPeriod(xindex)">',"<tr>","</tpl>","</tpl>","</tpl>","</tr>","</tbody>","</table>"],cls:"touch-calendar-view",itemSelector:"td.time-block"},timeSlotDateTplsDefaults:{day:'<span class="hour">{date:date("H")}</span><span class="minutes">{date:date("i")}</span>',month:'{date:date("j")}',week:'{date:date("j")}'},commonTemplateFunctions:{getTimeSlotRowCls:function(b){var c=[],a=b.getMinutes()!==0;if(a){c.push("half-hour")}return c.join(" ")},isHalfHour:function(a){return a.getMinutes()!==0},formatDate:function(a){return this.getTimeSlotDateTpl().apply({date:a})},getTimeSlotDateTpl:function(){var a=this.me.getViewMode().toLowerCase();return this.me.getTimeSlotDateTpls()[a]},getClasses:function(a){var b=[];if(a.selected){b.push(this.me.getSelectedItemCls())}if(a.unselectable){b.push(this.me.getUnselectableCls())}if(a.prevMonth){b.push(this.me.getPrevMonthCls())}if(a.nextMonth){b.push(this.me.getNextMonthCls())}if(a.weekend){b.push(this.me.getWeekendCls())}if(a.sunday){b.push(this.me.getSundayCls())}if(a.today){b.push(this.me.getTodayCls())}return b.join(" ")},isEndOfRow:function(a){return(a%7)===0&&(a>0)},isStartOfRow:function(a){return((a-1)%7)===0&&(a-1>=0)},isEndOfPeriod:function(a){return a%this.me.periodRowDayCount===0},getDaysArray:function(a){var c=[],b;for(b=0;b<this.me.periodRowDayCount;b++){c.push(a[b])}return c},getHeaderClass:function(a){return a===1?this.me.getPrevPeriodCls():a===7?this.me.getNextPeriodCls():""}},constructor:function(b){this.initModel();var a=Ext.create("Ext.data.Store",{model:"TouchCalendarViewModel"});this.setStore(a);b.timeSlotDateTpls=b.timeSlotDateTpls||{};Ext.applyIf(b.timeSlotDateTpls,this.timeSlotDateTplsDefaults);Ext.apply(this,b||{});this.callParent(arguments);this.minDate=this.minDate?Ext.Date.clearTime(this.minDate,true):null;this.maxDate=this.maxDate?Ext.Date.clearTime(this.maxDate,true):null;this.refresh()},initialize:function(){this.element.on({tap:this.onTableHeaderTap,scope:this,delegate:"th"});this.element.on({tap:this.onTimeSlotTap,longpress:this.onTimeSlotLongTap,scope:this,delegate:this.getItemSelector()});this.on({painted:this.syncHeight,resize:this.onComponentResize,scope:this});this.callParent()},initModel:function(){if(!Ext.ModelManager.isRegistered("TouchCalendarViewModel")){Ext.define("TouchCalendarViewModel",{extend:"Ext.data.Model",config:{fields:[{name:"date",type:"date",dateFormat:"c"},{name:"today",type:"boolean"},{name:"unselectable",type:"boolean"},{name:"selected",type:"boolean"},{name:"prevMonth",type:"boolean"},{name:"nextMonth",type:"boolean"},{name:"weekend",type:"boolean"},{name:"sunday",type:"boolean"},"timeSlots"]}})}},updateViewMode:function(a,c){this.refresh();var b=this.getPeriodMinMaxDate();this.fireEvent("periodchange",this,b.min.get("date"),b.max.get("date"),"none")},applyViewMode:function(b){b=b.toUpperCase();var a=Ext.ux.TouchCalendarView[b.toUpperCase()];this.getStartDate=a.getStartDate;this.getTotalDays=a.getTotalDays;this.dateAttributeFormat=a.dateAttributeFormat;this.getNextIterationDate=a.getNextIterationDate;this.getDeltaDate=a.getDeltaDate;this.periodRowDayCount=a.periodRowDayCount;Ext.apply(this.commonTemplateFunctions,{me:this});this.setTpl(new Ext.XTemplate((a.tpl||this.getBaseTpl()).join(""),this.commonTemplateFunctions));this.setScrollable({direction:b.toUpperCase()==="DAY"?"vertical":false,directionLock:true});return b},collectData:function(a){var b=[];Ext.each(a,function(c,d){b.push(c.data)},this);return b},populateStore:function(){this.currentDate=this.currentDate||this.getValue()||new Date();var d=true,e=this.currentDate,c=this.getStartDate(e),f=this.getTotalDays(e),a;this.getStore().suspendEvents();this.getStore().data.clear();for(var b=0;b<f;b++){c=this.getNextIterationDate(c,(b===0?0:1));d=(this.minDate&&c<this.minDate)||(this.maxDate&&c>this.maxDate);a=Ext.create("TouchCalendarViewModel",{today:this.isSameDay(c,new Date()),unselectable:d,selected:this.isSameDay(c,this.getValue())&&!d,prevMonth:(c.getMonth()<e.getMonth()),nextMonth:(c.getMonth()>e.getMonth()),weekend:this.isWeekend(c),sunday:this.isSunday(c),date:c});this.getStore().add(a)}this.getStore().resumeEvents()},refreshDelta:function(d){var b=this.currentDate||new Date();var a=this.getDeltaDate(b,d);if(this.isOutsideMinMax(a)){return}this.currentDate=a;this.refresh();var c=this.getPeriodMinMaxDate();this.fireEvent("periodchange",this,c.min.get("date"),c.max.get("date"),(d>0?"forward":"back"))},getPeriodMinMaxDate:function(){return{min:this.getStore().data.first(),max:this.getStore().data.last()}},isOutsideMinMax:function(a){var b=false;if(this.getViewMode()==="MONTH"){b=((this.minDate&&Ext.Date.getLastDateOfMonth(a)<this.minDate)||(this.maxDate&&Ext.Date.getFirstDateOfMonth(a)>this.maxDate))}else{b=((this.minDate&&this.getWeekendDate(a)<this.minDate)||(this.maxDate&&this.getStartDate(a)>this.maxDate))}return b},onTableHeaderTap:function(b,a){a=Ext.fly(a);if(a.hasCls(this.getPrevPeriodCls())||a.hasCls(this.getNextPeriodCls())){this.refreshDelta(a.hasCls(this.getPrevPeriodCls())?-1:1)}},onTimeSlotTap:function(d){if(!d.getTarget("."+this.getUnselectableCls())){var c=Ext.fly(d.getTarget());this.selectCell(c);var b=this.getCellDate(c);var a=this.getValue()||this.currentDate;if(b.getTime()!==a.getTime()){this.setValue(b);this.fireEvent("selectionchange",this,b,a)}}},onTimeSlotLongTap:function(a){this.onTimeSlotTap(a);this.fireEvent("longpresscell",this)},onComponentResize:function(a){this.syncHeight()},refresh:function(){this.populateStore();var a=this.getStore().getRange();this.setData(this.collectData(a));this.syncHeight()},syncHeight:function(){if(this.getViewMode().toUpperCase()!=="DAY"){var a=this.element.select("table",this.element.dom).first();if(a){a.setHeight(this.element.getHeight())}}},selectCell:function(a){var b=this.getSelectedItemCls();var c=this.element.select("."+b,this.element.dom);if(c){c.removeCls(b)}a.addCls(b);a.up("tr").addCls(b)},getDateRecord:function(a){return this.getStore().findBy(function(b){var c=Ext.Date.clearTime(b.get("date"),true).getTime();return c===Ext.Date.clearTime(a,true).getTime()},this)},getDayStartDate:function(a){return a},dateDiff:function(b,a){var c=b.getTime()-a.getTime();return(c/(24*60*60*1000))},isSameDay:function(b,a){if(!b||!a){return false}return Ext.Date.clearTime(b,true).getTime()===Ext.Date.clearTime(a,true).getTime()},isWeekend:function(a){return a.getDay()===0||a.getDay()===6},isSunday:function(a){return a.getDay()===0},getWeekendDate:function(b){var a=b.getDay()-this.getWeekStart();a=a<0?6:a;return new Date(b.getFullYear(),b.getMonth(),b.getDate()+0+a)},getCellDate:function(b){var a=b.dom.getAttribute("datetime");return this.stringToDate(a)},getDateCell:function(a){return this.element.select('td[datetime="'+this.getDateAttribute(a)+'"]',this.element.dom).first()},getDateAttribute:function(a){return Ext.Date.format(a,this.dateAttributeFormat)},getSelected:function(){var a=this.element.select("td."+this.getSelectedItemCls(),this.element.dom),b=[];a.each(function(c){b.push(this.getCellDate(c))},this);return b},stringToDate:function(a){return Ext.Date.parseDate(a,this.dateAttributeFormat)},applyTimeSlotDateTpls:function(a){Ext.Object.each(a,function(b,c){if(Ext.isString){a[b]=Ext.create("Ext.XTemplate",c)}},this);return a},statics:{MONTH:{dateAttributeFormat:"d-m-Y",getNextIterationDate:function(b,a){return new Date(b.getFullYear(),b.getMonth(),b.getDate()+(a===0?0:1))},getTotalDays:function(a){var b=Ext.Date.getFirstDateOfMonth(a);return this.isWeekend(b)?42:35},getStartDate:function(a){return Ext.bind(Ext.ux.TouchCalendarView.WEEK.getStartDate,this)(new Date(a.getFullYear(),a.getMonth(),1))},getDeltaDate:function(b,d){var c=b.getMonth()+d,a=new Date(b.getFullYear(),c,1);a.setDate(Ext.Date.getDaysInMonth(a)<b.getDate()?Ext.Date.getDaysInMonth(a):b.getDate());return a},periodRowDayCount:7},WEEK:{dateAttributeFormat:"d-m-Y",getNextIterationDate:function(b,a){return new Date(b.getFullYear(),b.getMonth(),b.getDate()+(a===0?0:1))},getTotalDays:function(a){return 7},getStartDate:function(b){var a=b.getDay()-this.getWeekStart();a=a<0?6:a;return new Date(b.getFullYear(),b.getMonth(),b.getDate()-0-a)},getDeltaDate:function(a,b){return new Date(a.getFullYear(),a.getMonth(),a.getDate()+(b*7))},periodRowDayCount:7},DAY:{dateAttributeFormat:"d-m-Y H:i",tpl:['<table class="{[this.me.getViewMode().toLowerCase()]}">',"<thead>","<tr>",'<th class="{[this.me.getPrevPeriodCls()]} style="display: block;">',"</th>","<th>",'<span>{[Ext.Date.format(values[0].date, "D j M Y")]}</span>',"</th>",'<th class="{[this.me.getNextPeriodCls()]} style="display: block;"">',"</th>","</tr>","</thead>","<tbody>","<tr>",'<td colspan="3">','<table class="time-slot-table">','<tpl for=".">','<tr class="{[this.getTimeSlotRowCls(values.date)]}">','<td class="label">','<tpl if="!this.me.getHideHalfHourTimeSlotLabels() || !this.isHalfHour(values.date)">',"{date:this.formatDate()}","</tpl>","</td>",'<td class="time-block" colspan="2" datetime="{[this.me.getDateAttribute(values.date)]}">',"</td>","</tr>","</tpl>","</table>","</td>","</tr>","</tbody>","</table>"],getNextIterationDate:function(b,a){var c=b.getTime()+((a===0?0:1)*(this.getDayTimeSlotSize()*60*1000));return new Date(c)},getTotalDays:function(d){var b=this.getStartHour()||"00:00",e=this.getEndHour()||"24:00",h=b.split(":"),i=e.split(":"),c=parseInt(h[0],10)*60+parseInt(h[1],10),f=parseInt(i[0],10)*60+parseInt(i[1],10),g=f-c,a=(g>0?g:1440);return a/this.getDayTimeSlotSize()},getStartDate:function(b){var a=Ext.Date.clearTime(b,true),c=this.getStartHour();if(c){var d=c.split(":");if(d[0]>0){a.setHours(d[0])}if(d[1]>0){a.setMinutes(d[1])}}return a},getDeltaDate:function(a,b){return new Date(a.getFullYear(),a.getMonth(),a.getDate()+b)},periodRowDayCount:1}}});Ext.define("Ext.ux.TouchCalendarEventsBase",{extend:"Ext.Base",config:{calendar:null,plugin:null,eventsPerTimeSlot:{},eventsPerTimeSlotAllDay:{},eventSortDirection:"DESC"},constructor:function(a){this.initConfig(a);this.callParent(arguments)},generateEventBars:function(){this.eventBarStore=Ext.create("Ext.data.Store",{model:"Ext.ux.CalendarEventBarModel",data:[]});this.setEventsPerTimeSlot({});this.setEventsPerTimeSlotAllDay({});var h=this.getCalendar(),a=h.getStartHour(),b=h.getEndHour(),g=h.getStore(),d=h.eventStore,c,f=0,e=0;if(a){a=a.split(":");a=parseInt(a[0])*3600+parseInt(a[1])*60+0}if(b){b=b.split(":");b=parseInt(b[0])*3600+parseInt(b[1])*60+0}g.each(function(j){var i=j.get("date"),k=i.getTime(),o=k+(a||0),l=k+(b||0),m=[],n=[];d.sort(this.getPlugin().getStartEventField(),this.getEventSortDirection());d.each(function(r){if(!this.eventFilterFn.call(this,r,r.getId(),o,l)){return}var p=this.isAllDayEvent(r);if(p){++e}else{++f}var t=this.eventBarStore.findBy(function(u,v){return u.get("EventID")===r.internalId},this);if(t>-1){c=this.eventBarStore.getAt(t);while(c.linked().getCount()>0){c=c.linked().getAt(c.linked().getCount()-1)}if(p){n.push(c.get("BarPosition"))}else{m.push(c.get("BarPosition"))}if(i.getDay()===this.getCalendar().getWeekStart()){var q=Ext.create("Ext.ux.CalendarEventBarModel",{EventID:r.internalId,Date:i,BarLength:1,BarPosition:c.get("BarPosition"),Record:r});c.linked().add(q)}else{c.set("BarLength",c.get("BarLength")+1)}}else{if(p){var s=this.getNextFreePosition(n);n.push(s)}else{var s=this.getNextFreePosition(m);m.push(s)}c=Ext.create("Ext.ux.CalendarEventBarModel",{EventID:r.internalId,Date:i,BarLength:1,BarPosition:s,Colour:this.getRandomColour(),Record:r});this.eventBarStore.add(c)}},this);if(f>0){this.getEventsPerTimeSlot()[i.getTime()]=f}if(e>0){this.getEventsPerTimeSlotAllDay()[i.getTime()]=e}f=0;e=0},this)},eventBarDoesWrap:function(a){var b=Ext.Date.add(a.get("Date"),Ext.Date.DAY,(a.get("BarLength")-1));return Ext.Date.clearTime(b,true).getTime()!==Ext.Date.clearTime(a.get("Record").get(this.getPlugin().getEndEventField()),true).getTime()},eventBarHasWrapped:function(a){return Ext.Date.clearTime(a.get("Date"),true).getTime()!==Ext.Date.clearTime(a.get("Record").get(this.getPlugin().getStartEventField()),true).getTime()},getNextFreePosition:function(a){var b=0;while(a.indexOf(b)>-1){b++}return b},createEventBar:function(c,b){var a=this.eventBarDoesWrap(c),g=this.eventBarHasWrapped(c),d=[this.getPlugin().getEventBarCls(),"e-"+c.get("EventID"),(a?" wrap-end":""),(g?" wrap-start":""),b.get(this.getPlugin().getCssClassField())],f=b.get(this.getPlugin().getCssStyleField());var e=Ext.DomHelper.append(this.getPlugin().getEventWrapperEl(),{tag:"div",html:this.getPlugin().getEventBarTpl().apply(b.data),eventID:c.get("EventID"),cls:d.join(" "),style:(f||null),},true);return e},getRandomColour:function(){return"#"+(Math.random()*16777215<<0).toString(16)}});Ext.define("Ext.ux.TouchCalendarDayEvents",{extend:"Ext.ux.TouchCalendarEventsBase",config:{eventSortDirection:"ASC"},eventFilterFn:function(b,f,e,c){var a=this.getRoundedTime(b.get(this.getPlugin().getStartEventField())).getTime(),d=this.getRoundedTime(b.get(this.getPlugin().getEndEventField())).getTime();if(c!==undefined){return((a<=e)&&(d>=e)||(a>e)&&(d<=c))}else{return(a<=e)&&(d>=e)}},renderEventBars:function(m){var g=this,a=g.getLeftMargin(),b=m.getCount(),d=0,c;for(;d<b;d++){c=m.getAt(d);var h=c.data.Record,k=g.createEventBar(c,h),f=g.getEventBarWidth(c,a+10),e=g.getVerticalDayPosition(c),j=g.getHorizontalDayPosition(c,f),n=g.getEventBarHeight(c);k.setLeft(j);k.setTop(e-g.getCalendar().element.getY());k.setHeight(n);k.setWidth(f)}},getEventBarWidth:function(c,f){var a=this.isAllDayEvent(c.data.Record),e=(a?this.getEventsPerTimeSlotAllDay():this.getEventsPerTimeSlot()),d=e[c.get("Date").getTime()],b=this.getCalendar().element.getWidth();d=d||1;f=f||0;return Math.floor((b-f)/d)},getEventBarHeight:function(a){var b=this.getPlugin().getEventHeight();if(Ext.isNumeric(b)){return b}else{if(b==="duration"){return this.getEventBarHeightDuration(a)}else{return"auto"}}},getEventBarHeightDuration:function(q){var m=this.getCalendar(),j=q.get("Date"),c=Ext.Date.clearTime(j,true),n=m.getStartHour(),a=0,g=this.isAllDayEvent(q.data.Record),e=m.element.down("table.time-slot-table td");if(g&&e){return e.getHeight()-10}var d=q.data.Record.get(this.getPlugin().getStartEventField()),r=q.data.Record.get(this.getPlugin().getEndEventField()),p=Ext.Date.clearTime(d,true),x=Ext.Date.clearTime(r,true),l=this.getRoundedTime(d),t=this.getRoundedTime(r),w=m.getDateCell(l);if(p.getTime()!=x.getTime()){if(c.getTime()!=x.getTime()){r=Ext.clone(j);r.setHours(23);r.setMinutes(59);t=this.getRoundedTime(r)}}if(n){n=n.split(":");a=parseInt(n[0],10)*2}var h=(r.getTime()-t.getTime())/1000/60,u=(t.getHours()*2-a)+(t.getMinutes()===30?1:0),v=m.element.query("table.time-slot-table td.time-block")[u],s=0;if(v){v=new Ext.dom.Element(v);var k=v.getHeight(),i=k/30,f=h*i,o=this.getVerticalDayPosition(q),b=v.getY()+f;s=b-o}return s},getVerticalDayPosition:function(q){var u=this,l=u.getCalendar(),j=q.get("Date"),b=Ext.Date.clearTime(j,true),m=l.getStartHour(),a=0,g=u.isAllDayEvent(q.data.Record),c=q.data.Record.get(u.getPlugin().getStartEventField()),r=q.data.Record.get(u.getPlugin().getEndEventField()),p=Ext.Date.clearTime(c,true),v=Ext.Date.clearTime(r,true),k=u.getRoundedTime(c),d=l.element.down("table.time-slot-table td");if(g&&d){return d.getY()+1}if(p.getTime()!=v.getTime()){var e=m.split(":");if(b.getTime()!=p.getTime()){c=Ext.clone(j);c.setHours(e[0]||0);c.setMinutes(e[1]||0);k=this.getRoundedTime(c)}}if(m){m=m.split(":");a=parseInt(m[0],10)*2}var t=(k.getHours()*2-a)+(k.getMinutes()===30?1:0),h=(c.getTime()-k.getTime())/1000/60,s=l.element.query("table.time-slot-table td.time-block")[t],o=0;if(d&&s){s=new Ext.dom.Element(s);var n=d.getHeight(),i=n/30,f=h*i;o=s.getY()+f+1}return o},getLeftMargin:function(){var c=this.getCalendar(),b=c.element.down("table.time-slot-table td.time-block"),a=50;if(b&&b.dom.offsetLeft){a=b.dom.offsetLeft+5}return a},getHorizontalDayPosition:function(c,a){var d=c.get("BarPosition"),b=this.getLeftMargin(),e=this.getPlugin().getEventBarSpacing();return b+(d*a)+(d*e)},getRoundedTime:function(a){a=Ext.Date.clone(a);var b=a.getMinutes();a.setMinutes(b-(b%this.getCalendar().getDayTimeSlotSize()));a.setSeconds(0);a.setMilliseconds(0);return a},eventBarDoesWrap:function(a){var f=this.getPlugin(),b=f.getStartEventField(),h=f.getEndEventField(),e=a.get("Record"),k=this.isAllDayEvent(e),g=Ext.Date.clearTime(a.get("Date"),true),j=Ext.Date.clearTime(e.get(h),true),c=g.getTime(),d=j.getTime(),i=d-c;return((!k&&i>0)||(k&&i>24*3600*1000))},isAllDayEvent:function(c){var b=this.getPlugin(),a=c.get(b.getStartEventField()),d=c.get(b.getEndEventField());return(a.getHours()==0&&a.getMinutes()==0&&d.getHours()==0&&d.getMinutes()==0)}});Ext.define("Ext.ux.TouchCalendarMonthEvents",{extend:"Ext.ux.TouchCalendarEventsBase",eventFilterFn:function(b,e,c){var a=Ext.Date.clearTime(b.get(this.getPlugin().getStartEventField()),true).getTime(),d=Ext.Date.clearTime(b.get(this.getPlugin().getEndEventField()),true).getTime();return(a<=c)&&(d>=c)},renderEventBars:function(a){var b=this;a.each(function(e){var k=this.getPlugin().getEventRecord(e.get("EventID")),j=this.getCalendar().getDateCell(e.get("Date")),h=this.eventBarDoesWrap(e),u=this.eventBarHasWrapped(e),f=[this.getPlugin().getEventBarCls(),"e-"+e.get("EventID"),(h?" wrap-end":""),(u?" wrap-start":""),k.get(this.getPlugin().getCssClassField())];var m=Ext.DomHelper.append(this.getPlugin().getEventWrapperEl(),{tag:"div",style:{"background-color":k.get(this.getPlugin().colourField)},html:this.getPlugin().getEventBarTpl().apply(k.data),eventID:e.get("EventID"),cls:f.join(" ")},true);if(this.allowEventDragAndDrop){new Ext.util.Draggable(m,{revert:true,onStart:function(A){var w=this,z=w.el.getAttribute("eventID"),x=b.getPlugin().getEventRecord(z),y=b.getEventBarRecord(z);w.el.setWidth(w.el.getWidth()/y.get("BarLength"));w.el.setLeft(A.startX-(w.el.getWidth()/2));b.calendar.element.select("div."+x.internalId,b.calendar.element.dom).each(function(B){if(B.dom!==w.el.dom){B.hide()}},this);Ext.util.Draggable.prototype.onStart.apply(this,arguments);b.calendar.fireEvent("eventdragstart",w,x,A);return true}})}var t=this.getCalendar().element.select("thead",this.getCalendar().element.dom).first().getHeight();var s=this.getCalendar().element.select("tbody",this.getCalendar().element.dom).first().getHeight();var o=this.getCalendar().element.select("tbody tr",this.getCalendar().element.dom).getCount();var d=s/o;var q=this.getCalendar().getStore().findBy(function(w){return w.get("date").getTime()===Ext.Date.clearTime(e.get("Date"),true).getTime()},this);var p=Math.floor(q/7)+1;var r=t+(d*p);var v=e.get("BarPosition"),l=e.get("BarLength"),c=(this.getCalendar().element.getWidth()/7)*j.dom.cellIndex,i=j.getWidth(),n=m.getHeight(),g=this.getPlugin().getEventBarSpacing();m.setLeft(c+(u?0:g));m.setTop(r-n-(v*n+(v*g)+g));m.setWidth((i*l)-(g*(h?(h&&u?0:1):2)));if(e.linked().getCount()>0){this.renderEventBars(e.linked())}},this)}});Ext.define("Ext.ux.TouchCalendarWeekEvents",{extend:"Ext.ux.TouchCalendarMonthEvents"});Ext.define("Ext.ux.TouchCalendarEvents",{extend:"Ext.mixin.Observable",config:{viewModeProcessor:null,eventBarTpl:"{title}",eventBarCls:"event-bar",colourField:"colour",cssClassField:"css",cssStyleField:"style",eventHeight:"duration",eventWidth:"auto",startEventField:"start",endEventField:"end",eventWrapperCls:"event-wrapper",eventBarSelectedCls:"event-bar-selected",cellHoverCls:"date-cell-hover",autoUpdateEvent:true,allowEventDragAndDrop:false,eventBarSpacing:1,eventWrapperEl:null},init:function(b){var a=this;this.calendar=b;this.calendar.eventsPlugin=this;this.calendar.refresh=Ext.Function.createSequence(this.calendar.refresh,this.refreshEvents,this);this.calendar.setViewMode=this.createPreSequence(this.calendar.setViewMode,this.onViewModeUpdate,this);this.calendar.onComponentResize=Ext.Function.createSequence(this.calendar.onComponentResize,this.onComponentResize,this);this.onViewModeUpdate(this.calendar.getViewMode())},onComponentResize:function(){var a=this;setTimeout(function(){a.refreshEvents()},200)},createPreSequence:function(b,c,a){if(!c){return b}else{return function(){c.apply(a||this,arguments);var d=b.apply(this,arguments);return d}}},onViewModeUpdate:function(a){this.setViewModeProcessor(Ext.create(this.getViewModeProcessorClass(a),{calendar:this.calendar,plugin:this}))},getViewModeProcessorClass:function(a){var b="";switch(a.toLowerCase()){case"month":b="Ext.ux.TouchCalendarMonthEvents";break;case"week":b="Ext.ux.TouchCalendarWeekEvents";break;case"day":b="Ext.ux.TouchCalendarDayEvents";break}return b},refreshEvents:function(){if(this.calendar.getScrollable()){this.calendar.getScrollable().getScroller().scrollTo(0,0)}this.removeEvents();this.getViewModeProcessor().generateEventBars();this.createEventWrapper();if(this.getAllowEventDragAndDrop()){this.createDroppableRegion()}},createDroppableRegion:function(){var b=this;var a=0},onEventDropDeactivate:function(f,a,d,c){if(a.el.hasCls(this.eventBarCls)){var b=this.getEventRecord(a.el.getAttribute("eventID"));this.calendar.element.select("div."+b.internalId,this.calendar.element.dom).each(function(e){e.show()},this)}},onEventDrop:function(f,a,d,c){var b=false;if(a.el.hasCls(this.eventBarCls)){this.calendar.all.each(function(e){var j=e.getPageBox(true);var k=a.el.getPageBox(true);if(j.partial(k)&&this.calendar.fireEvent("beforeeventdrop",a,f,g,d)){b=true;var g=this.getEventRecord(a.el.getAttribute("eventID")),h=this.calendar.getCellDate(e),i=this.getDaysDifference(g.get(this.getStartEventField()),h);if(this.getAutoUpdateEvent()){g.set(this.getStartEventField(),h);g.set(this.getEndEventField(),g.get(this.getEndEventField()).add(Date.DAY,i))}this.refreshEvents();this.calendar.fireEvent("eventdrop",a,f,g,d);return}},this);this.calendar.all.removeCls(this.getCellHoverCls());if(!b){a.setOffset(a.startOffset,true)}}},onEventDragStart:function(a,f){var d=a.el.getAttribute("eventID"),b=this.getEventRecord(d),c=this.getEventBarRecord(d);a.el.setWidth(a.el.getWidth()/c.get("BarLength"));a.updateBoundary(true);this.calendar.element.select("div."+b.internalId,this.calendar.element.dom).each(function(e){if(e.dom!==a.el.dom){e.hide()}},this);this.calendar.fireEvent("eventdragstart",a,b,f)},createEventWrapper:function(){if(this.calendar.rendered&&!this.getEventWrapperEl()){this.setEventWrapperEl(Ext.DomHelper.append(this.getEventsWrapperContainer(),{tag:"div",cls:this.getEventWrapperCls()},true));this.getEventWrapperEl().on("tap",this.onEventWrapperTap,this,{delegate:"div."+this.getEventBarCls()});if(this.getViewModeProcessor().eventBarStore){this.getViewModeProcessor().renderEventBars(this.getViewModeProcessor().eventBarStore)}}else{this.calendar.on("painted",this.createEventWrapper,this)}},onEventWrapperTap:function(g,f){g.stopPropagation();var d=g.getTarget("div."+this.getEventBarCls());if(d){var c=d.getAttribute("eventID"),b=Ext.fly(d);if(c){var a=this.getEventRecord(c);this.deselectEvents();b.addCls(this.getEventBarSelectedCls());this.calendar.fireEvent("eventtap",a,g)}}},getEventsWrapperContainer:function(){return this.calendar.element.select("thead th",this.calendar.element.dom).first()||this.calendar.element.select("tr td",this.calendar.element.dom).first()},getEventRecord:function(a){var b=this.calendar.eventStore.findBy(function(c){return c.internalId===a},this);return this.calendar.eventStore.getAt(b)},getEventBarRecord:function(a){var b=this.eventBarStore.findBy(function(c){return c.get("EventID")===a},this);return this.eventBarStore.getAt(b)},deselectEvents:function(){this.calendar.element.select("."+this.getEventBarSelectedCls(),this.calendar.element.dom).removeCls(this.getEventBarSelectedCls())},getDaysDifference:function(b,a){b=b.clearTime(true).getTime();a=a.clearTime(true).getTime();return(a-b)/1000/60/60/24},removeEvents:function(){if(this.getEventWrapperEl()){this.getEventWrapperEl().dom.innerHTML="";this.getEventWrapperEl().destroy();this.setEventWrapperEl(null)}if(this.eventBarStore){this.eventBarStore.remove(this.eventBarStore.getRange());this.eventBarStore=null}if(this.droppable){this.droppable=null}},applyEventBarTpl:function(a){if(Ext.isString(a)||Ext.isArray(a)){a=Ext.create("Ext.XTemplate",a)}return a}});Ext.define("Ext.ux.CalendarEventBarModel",{extend:"Ext.data.Model",config:{fields:[{name:"EventID",type:"string"},{name:"Date",type:"date"},{name:"BarLength",type:"int"},{name:"BarPosition",type:"int"},{name:"Colour",type:"string"},"Record"],hasMany:[{model:"Ext.ux.CalendarEventBarModel",name:"linked"}]}});Ext.define("Ext.util.Region.partial",{extend:"Ext.util.Region",partial:function(g){var f=this,e=g.right-g.left,c=g.bottom-g.top,b=f.right-f.left,a=f.bottom-f.top,d=g.top>f.top&&g.top<f.bottom;horizontalValid=g.left>f.left&&g.left<f.right;return horizontalValid&&d}});Ext.define("Ext.ux.TouchCalendarSimpleEvents",{extend:"Ext.mixin.Observable",config:{startEventField:"start",endEventField:"end",allDayField:"allday",multiEventDots:true,wrapperCls:"simple-event-wrapper",eventDotCls:"simple-event",dotWidth:6,groupByProperty:null,eventTpl:['<span class="{wrapperCls}">','<tpl for="events">','<span class="{[parent.eventDotCls]}"></span>',"</tpl>","</span>"].join(""),},filterFn:function(c,g,b){if(arguments.length===2){b=g}var f=c.get(this.getStartEventField()),d=c.get(this.getEndEventField()),a=Ext.Date.clearTime(f,true).getTime(),e=Ext.Date.clearTime(d,true).getTime(),b=Ext.Date.clearTime(b,true).getTime();if(c.get(this.getAllDayField())){if(e==b){return false}}else{if(Ext.Date.format(f,"Y-m-d H:i")==Ext.Date.format(d,"Y-m-d H:i")){return false}}return(a<=b)&&(e>=b)},init:function(a){this.calendar=a;this.calendar.simpleEventsPlugin=this;this.setWrapperCls(this.getWrapperCls()+(this.getMultiEventDots()?"-multi":""));this.setEventDotCls(this.getEventDotCls()+(this.getMultiEventDots()?"-multi":""));this.calendar.showEvents=this.showEvents;this.calendar.hideEvents=this.hideEvents;this.calendar.removeEvents=this.removeEvents;this.calendar.refresh=Ext.Function.createSequence(this.calendar.refresh,this.refreshEvents,this);this.calendar.syncHeight=Ext.Function.createSequence(this.calendar.syncHeight,this.refreshEvents,this)},refreshEvents:function(){if(!this.disabled&&this.calendar.getViewMode()!=="DAY"){var a=this.calendar.getStore();if(a){this.removeEvents();a.each(function(k){var d=k.get("date");var i=this.calendar.getDateCell(d);var h=this.calendar.eventStore;if(i){h.clearFilter();h.setGroupField(null);var g=h[this.getMultiEventDots()?"filterBy":"findBy"](Ext.bind(this.filterFn,this,[d],true));var b=h.getRange().length;if((!this.getMultiEventDots()&&g>-1)||(this.getMultiEventDots()&&b>0)){var f=Math.min((i.getWidth()/this.getDotWidth()),b),e=[];if(this.getGroupByProperty()){h.setGroupField(this.getGroupByProperty());var c=h.getGroups();c.forEach(function(m,l){e.push(m.children[0])})}else{e=(this.getMultiEventDots()?h.getRange().slice(0,f):["event"])}var j=new Ext.XTemplate(this.getEventTpl()).append(i,{events:e,wrapperCls:this.getWrapperCls(),eventDotCls:this.getEventDotCls()},true);j.setWidth(Math.min((this.getMultiEventDots()?e.length:1)*this.getDotWidth()+4,i.getWidth()));j.setY((i.getY()+i.getHeight())-(j.getHeight()+(i.getHeight()*0.1)));j.setX((i.getX()+(i.getWidth()/2))-(j.getWidth()/2)+2)}}},this)}}},hideEvents:function(){this.simpleEventsPlugin.disabled=true;this.calendar.element.select("span."+this.getWrapperCls(),this.calendar.element.dom).hide()},showEvents:function(){this.simpleEventsPlugin.disabled=false;this.calendar.element.select("span."+this.getWrapperCls(),this.calendar.element.dom).show()},removeEvents:function(){if(this.calendar.element){this.calendar.element.select("span."+this.getWrapperCls(),this.calendar.element.dom).each(function(a){Ext.destroy(a)})}}});
/***************************************************************************************
 * The contents of this file are subject to the VTECRM License Agreement
 * ("licenza.txt"); You may not use this file except in compliance with the License
 * The Original Code is:  VTECRM
 * The Initial Developer of the Original Code is VTECRM LTD.
 * Portions created by VTECRM LTD are Copyright (C) VTECRM LTD.
 * All Rights Reserved.
 ***************************************************************************************/

/**
 * @class Vtecrm.app
 * This is the app instance
 *
 * @singleton
 */
Ext.application({
    name: 'Vtecrm',

    requires: ['Vtecrm.store.proxy.WebSQL'],

    // TODO: caricare solo quelli che servono
    views: [
        'Main',
        'GridView',
        'Login',
        'LoginDemo',
        'ModulesGrid',
        'ModuleHome',
        'ListTodos',
        'ListNotifications',
        'ListComments',
        'ListTicketComments',
        'ListRelated',
        'ListProducts',
        'ListPdfMaker',
        'ListSearch',
        'ListLinked',
        'ListRecords', // TODO: unificare con ListRecents & Favourites
        'Settings',
        'ShowRecord',
        'Messages',
        'Calendar',
        'GlobalSearch',
    ],
    models: [
        'VteNotification',
        'VteUser',
        'VteGroup',
        'VteAssocProduct',
        'VteComment',
        'VteFavourite',
        'VteTodo',
        'BlockListItem',
        'VteFilter',
        'VteFolder',
        'VteFieldBasic',
        'VteEntity',
    ], // non togliere, saltano fuori bug assurdi!
    // TODO: unificare gli online-offline
    stores: [
        'VteModulesOffline',
        'VteModulesOnline',
        'VteBlocks',
        'VteOnlineOffline'
    ],
    profiles: [],
    controllers: [],

    // store degli utenti
    userstore: undefined,

    // traduzioni
    translations: {},

    // TODO: coda delle viste aperte, farlo bene, magari con un manager per gestire i diversi tipi di viste (record, lista, related...)
    history_queue: [],

    // vero se ho fatto il login nel crm
    hasLoginInfo: (vtwsUrl != null && vtwsUrl != '' && vtwsOpts != null && vtwsOpts != ''),

    // se busy, non eseguo azioni
    busy: false,

    moduleIconsCss: [],

    // some things that server can do
    /**
     * @property
     * @readonly
     * A list of features that can be activated in the app
     */
    capabilities: {
    	'multi_call' : true,
    	'messages': true,
    	// these are always true
    	'notifications' : true,
    	'conversations' : true,
    	// following ones are not used
    	'recents' : true,
    	'favourites' : true,
    	'global_search' : true,
    },

    // disable some event recognizers, especially double tap
    eventPublishers: {
		touchGesture: {
			recognizers: {
				doubletap: null,
				pinch: null,
				rotate: null,
			}
		}
	},

	/**
	 * This is the first method launched after the framework and the device are ready.
	 * You can override it to provide custom functionalities
	 * @hide
	 */
    launch: function() {
		
	  
    	var me = this;
    	
		me.loadApp();
    },

    /**
     * This is the entry point for the app. A lot of initialization is done here and
     * the appropriate view is created (Vtecrm.view.Login or Vtecrm.view.Main)
     *
     */
    loadApp: function(initval) {
    	var me = this;

    	// fix for android, delay initial rendering
    	if (Ext.os.is.Android && !initval) {
   			setTimeout(function() {
   				me.loadApp(1);
   			}, 250);
   			return;
    	}

    	// calculate the size of the viewport
    	me.calculateViewportSize();

    	// disable options request
    	Ext.Ajax.setUseDefaultXhrHeader(false);

    	// rimossa animazione per gli alert
    	Ext.Msg.defaultAllowedConfig.showAnimation = false;
    	Ext.Msg.defaultAllowedConfig.hideAnimation = false;


    	// register device specific handlers
    	document.addEventListener("backbutton", this.handleBackButton, false);
    	document.addEventListener("online", this.handleDeviceOnline, false);
    	document.addEventListener("offline", this.handleDeviceOffline, false);


    	if (vtwsUrl != null && vtwsUrl != '' && vtwsOpts != null && vtwsOpts != '') this.hasLoginInfo = true;

    	// creo tabelle
    	DBUtils.initTables();

    	this.mainview = Ext.create('Vtecrm.view.Main');
		
    	display_orient = Ext.Viewport.getOrientation();
    	if (display_orient == undefined || display_orient == null) display_orient = 'portrait';
		
    	if (!this.hasLoginInfo) {
    		//clear any badge
    		setBadge(null);

    		// loginform
    		var loginform = Ext.create((demo_mode ? 'Vtecrm.view.LoginDemo' : 'Vtecrm.view.Login'));
    		this.mainview.add([loginform]);
    	} else {
    		// get overrides from server

    		Ext.Ajax.request({
    			url: vtwsUrl + 'ws.php?wsname=GetOverrideFile',
    			params: vtwsOpts,
    			method: 'POST',
    			useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
    			success: function (b) {
    				var ofiles;
       	    		try {
       		    		ofiles = Ext.decode(b.responseText);
       		    	} catch (e) {
       		    		console.log('ERROR: invalid server answer in getOverrideFile');
       		    	}
       		    	if (ofiles && ofiles.length > 0) {
       		    		// create semaphore to wait for the end of the extra scripts
       		    		var osem = new Semaphore('loadServerOverrides', function(self) {
       	    				self.destroy();
       	    				me.postLoginInit();
       	    			}, null, ofiles.length);
       		    		for (var i=0; i<ofiles.length; ++i) {
       		    			var ofileurl = vtwsUrl.replace('modules/Touch/', '') + ofiles[i]+'?1'; // avoid caching
       		    			include(ofileurl, function() {osem.go();});
       		    		}
       		    	} else {
       		    		// proceed with login
       		    		me.postLoginInit();
       		    	}
    			},
    			failure: function(response, options) {
    				// go on with login
    				me.postLoginInit();
    			}
    		});

    	}
    },

    /**
     * Performs other initializations if valid credentials exist.
     * Users, Groups, Modules and Areas are loaded
     */
    postLoginInit: function() {
		
    	var me = this;

    	// utenti
    	if (!this.userstore) {
	    	this.userstore = Ext.create('Vtecrm.store.VteOnlineOffline', {
    			model: 'Vtecrm.model.VteUser',
    			autoLoad: false,
    			offline: true,
    			onlineProxy: {
    				type: "ajax",
    	    		url: vtwsUrl + "ws.php?wsname=GetUsers",
    	    	    extraParams: params_unserialize(vtwsOpts),
    				reader: 'json',
    				actionMethods: {read: 'POST'},
    			},
    			offlineProxy: {
    				type: 'WebSQL',
    				table: 'users',
    			},
    		});
	    	this.userstore.load(function(records, operation) {
	    		if (records && records.length <= 1) {
	    			// disabilito conversazioni se c'è solo 1 utente - disabilitato
	    			//me.mainview.down('#btnComments').setHidden(true);
	    			current_user = records[0];
	    		} else if (records) {
	    			// cerco l'utente corrente
	    			var username = (vtwsOpts ? vtwsOpts.replace(/(username=)|(&password=.*)/g, '') : '');
	    			for (i=0; i<records.length; ++i) {
	    				if (records[i]['user_name'] == username) current_user = records[i];
	    			}
	    		}
    			if (!current_user) {
    				console.log('ERRORE: nessun utente corrisponde all\'utente corrente');
    			}
				// segnalibro  all'avvio mostro direttamente il calendario
				me.showCalendar();
    			me.userstore.sort('complete_name');
				
	    	}); // warning, this function retrieve async from db
	    	// TODO: se è vuoto, carica da online
		}
		
		// gruppi
		if (!this.groupstore) {
	    	this.groupstore = Ext.create('Vtecrm.store.VteOnlineOffline', {
    			model: 'Vtecrm.model.VteGroup',
    			autoLoad: false,
    			offline: true,
    			onlineProxy: {
    				type: "ajax",
    	    		url: vtwsUrl + "ws.php?wsname=GetGroups",
    	    	    extraParams: params_unserialize(vtwsOpts),
    				reader: 'json',
    				actionMethods: {read: 'POST'},
    			},
    			offlineProxy: {
    				type: 'WebSQL',
    				table: 'groups'
    			}

    		});
	    	this.groupstore.load(); // warning, this function retrieve async from db
	    	// TODO: se è vuoto, carica da online
		}
		this.loadAreas();

		// main app
		// check if we can use the new interface
		try {
			var vteInfo = Ext.decode(localStorage.getItem('vteInfo')),
				store = Ext.getStore('modulesStoreOffline');
		} catch (e) {
			var vteInfo = {};
		}

		if (vteInfo.revision === undefined || vteInfo.revision < 817) {
			// multicall is not supported, fallback on old calls
			this.capabilities.multi_call = false;
		}

		// check if there are some new modules

		// Messages, Recents and Favourites, Notifications and Talks
		if (store) {
			store.load({
				callback: function() {
					var btnMessages = me.mainview.down('#btnMessages'),
						btnNotif = me.mainview.down('#btnNotifications'),
						btnComments = me.mainview.down('#btnComments'),
						btnRecents = me.mainview.down('#btnRecents'),
						btnFavourites = me.mainview.down('#btnFavourites');
					if (me.isModuleAvailable('Messages')) {
						 btnMessages.show();
						 me.capabilities.messages = true;
					} else {
						 me.capabilities.messages = false;
					}
					if (!me.isModuleAvailable('Recents')) {
						btnRecents.show();
					}
					if (!me.isModuleAvailable('Favourites')) {
						btnFavourites.show();
					}

					if (me.capabilities.notifications) btnNotif.show();
					if (me.capabilities.conversations) btnComments.show();
				}
			});
		}
		//me.showModulesList(); segnalibro

		Ext.Viewport.on('orientationchange', 'handleOrientationChange', this);

		// counters
		this.setIntervals();

		// fill array with standard modules (with builtin icon)
		for (var i=0; i<document.styleSheets.length; ++i) {
			if (document.styleSheets[i] && typeof document.styleSheets[i].href == 'string' && document.styleSheets[i].href.match(/vtecrm.css$/)) {
				var rules = document.styleSheets[i].rules;
				for (var j=0; j<rules.length; ++j) {
					if ((typeof rules[j].selectorText == 'string') && rules[j].selectorText.match(/^\.mask-mod-.+$/)) {
						this.moduleIconsCss.push(rules[j].selectorText);
					}
				}
			}
		}
    },

    /**
     * @private
     * Sets intarvals for notifications
     */
    setIntervals: function() {
    	// pulisco vecchi timer
    	if (this.badges_interval) {
    		clearInterval(this.badges_interval);
    		this.badges_interval = null;
    	}

    	// any value less than 1000 (1s) is not considered
    	var timeout = parseInt(CONFIG.notification_timeout);
    	if (timeout <= 1000) return;

    	this.countAppBadges();
    	this.badges_interval = setInterval(this.countAppBadges, timeout);
    },


    // -------------------
    // GESTIONE CODA DEI COMPONENTI
    // ci deve essere sempre un elemento: la root è moduleslist

    /**
     * Gets active component in the history
     */
    historyGetActive: function() {
    	if (this.history_queue.length > 0) {
    		return this.history_queue[this.history_queue.length-1];
    	} else {
    		return null;
    	}
    },

    /**
     * Gets previous component in the history
     */
    historyGetPrevious: function() {
    	if (this.history_queue.length > 1) {
    		return this.history_queue[this.history_queue.length-2];
    	} else {
    		return null;
    	}
    },


    /**
     * Look for a component with specified itemId in the history
     */
    historyFind: function(itemId) {
    	var i;
    	for (i=0; i<this.history_queue.length; ++i) {
    		comp = this.history_queue[i];
    		if (comp.getItemId() == itemId) return comp;
    	}
    	return null;
    },

    /**
     * Look for the last component with a specified itemId in the history
     */
    historyFindLast: function(itemId) {
    	var i, comp;

    	for (i=this.history_queue.length-1; i>=0; --i) {
    		comp = this.history_queue[i];
    		if (comp.getItemId() == itemId) return comp;
    	}
    	return null;
    },

    /**
     * Look for all the components with the specified itemId in the history
     */
    historyFindAll: function(itemId) {
    	var i, comp, ret = [];

    	for (i=this.history_queue.length-1; i>=0; --i) {
    		comp = this.history_queue[i];
    		if (comp.getItemId() == itemId) ret.push(comp);
    	}
    	return ret;
    },

    /**
     * Removes everything from the history and goes back to the home page
     */
    historyClear: function() {
    	var me = Vtecrm.app;

    	if (this.history_queue.length <= 1) {
    		// sono già in home, forzo il reload dei numerini di commenti/notifiche
    		if (!CONFIG.app_offline) {
    			maskView();
    			me.countAppBadges(unMaskView);
    		}
    		return;
    	}

    	if (this.history_destroying) return;

    	var destroy_array = [];
    	while (this.history_queue.length > 1) {
    		var comp = this.history_queue.pop();
    		comp.hide();
    		destroy_array.push(comp);
    		//comp.destroy();
    	}
    	// distrugge i componenti in background
    	this.history_destroying = true;
    	maskView();
    	setTimeout(function() {
    		for (var i=0; i<destroy_array.length; ++i) {
    			var comp = destroy_array[i];
    			if (comp && comp.destroy) comp.quickDestroy();
    		}
    		unMaskView();
    		me.history_destroying = false;
    	}, 300);

    	if (CONFIG.enable_animations) {
    		this.history_queue[0].show({
    			type: 'fadeIn',
    			duration: 200,
    		});
    	} else {
    		this.history_queue[0].show();
    	}
    },

    // TODO: lanciare eventi per i componenti
    /**
     * Adds a component to the history. The History is a queue of active (although only the last one is visible)
     * full-page components in the app. When a component is added, the previous one is hidden.
     */
    historyAdd: function(component) {
    	var me = this;
    		active = this.historyGetActive();

    	if (this.history_queue.length >= CONFIG.nesting_limit) {
    		Ext.Msg.alert(LANG.alert, LANG.nesting_limit_reached);
    		return;
    	}

    	//controllo se sto distruggendo qualcosa, in caso aspetto
    	if (this.history_destroying) {
    		// never enter here
    		setTimeout(function() {
    			me.historyAdd(component);
    		}, 200);
    		return;
    	}

    	this.history_queue.push(component);

    	component.setHidden(true);
    	this.mainview.add(component);
    	//component.setHidden(true); // there's some bug, on add(), it's shown again
    	if (active) active.hide();
    	if (CONFIG.enable_animations) {
        	component.show({
        		type: 'slideIn',
        		direction: 'left',
        		duration: 200,
        	});
    	} else {
        	component.show();
    	}
    },

    /**
     * Removes the last component in the history and show the previous one.
     * The callback function is called when the previous component is shown
     */
    historyBack: function(callback) {

    	// lascio sempre la root
    	if (this.history_queue.length == 1) return;

    	var lastcomp = this.history_queue.pop(),
    		previous = this.historyGetActive();

    	if (CONFIG.enable_animations) {
    		if (lastcomp) {
    			maskView();
    			lastcomp.hide({
    				type: 'slideOut',
    				direction: 'right',
    				duration: 200,
    				listeners: {
    					animationend: function() {
    						lastcomp.quickDestroy();
    						if (previous) previous.show({
    							listeners: {
    								animationend: function() {
    									unMaskView();
    									if (typeof callback == 'function') callback();
    								}
    							}
    						});
    					}
    				}
    			});
    		} else {
    			if (previous) previous.show();
    		}
    	} else {
    		maskView();
    		if (lastcomp) {
    			lastcomp.hide();
    			lastcomp.quickDestroy();
    		}
    		if (previous) previous.show({
				listeners: {
					animationend: function() {
						unMaskView();
						if (typeof callback == 'function') callback();
					}
				}
			});
    	}
    },

    // -------------------

    /**
     * Return true if there are login informations
     */
	getHasLoginInfo: function () {
		return this.hasLoginInfo;
	},

	/**
	 * @protected
	 * Add the list of modules to the homepage.
	 */
	showModulesList: function(showMods, excludeMods) {
		this.modulelist = Ext.create('Vtecrm.view.ModulesGrid', {
			showModules: showMods || [],
			excludeMods: excludeMods || []
		});
		this.historyAdd(this.modulelist);
	},

	/**
	 * Shows the module homepage for the specified module
	 * @param {String} mod The module to show
	 */
	showModuleHome: function(mod) {
		var me = this;

		if (mod == 'Settings') {
			return me.showSettings();
		} else if (mod == 'Messages') {
			return me.showMessages();
		} else if (mod == 'Calendar') {
			return me.showTodos();
		} else if (mod == 'Events') {
			return me.showCalendar();
		} else if (mod == 'Recents') {
			return me.showRecents();
		} else if (mod == 'Favourites') {
			return me.showFavourites();
		} else if (mod == 'Search') {
			return me.showGlobalSearch();
		}

		//if (!me.modulehome) {
			me.modulehome = Ext.create('Vtecrm.view.ModuleHome', {
				module: mod,
				hidden: true
			});
		//}
		//me.modulehome.setModule(mod);

		me.historyAdd(me.modulehome);
	},

	/**
	 * @private
	 * Load the areas from the localStorage
	 */
	loadAreas: function() {
		var me = this,
			stored = localStorage.getItem('areas');

		me.areas = null;
		if (stored) {
			try {
				stored = Ext.decode(stored);
				me.areas = stored;
			} catch (e) {

			}
		}
	},

	/**
	 * Gets the list of Areas
	 */
	getAreas: function() {
		var me = this;
		return me.areas;
	},

	/**
	 * @private
	 * Loads the Areas from the server and stores them locally
	 */
	fetchAreas: function(callback) {
		var me = this;

		me.touchRequest('GetAreas', null, false, function(data) {
			if (data && data.areas) {
				me.areas = data.areas;
				localStorage.setItem('areas', Ext.encode(data.areas));
			}
			if (typeof callback == 'function') callback(data);
		});

	},

	/**
	 * Shows the global search
	 */
	showGlobalSearch: function(options) {
		var me = this,
			areas = me.getAreas();

		var searchpanel = Ext.create('Vtecrm.view.GlobalSearch', options || {});
		Ext.Viewport.add(searchpanel);
		searchpanel.focus();
	},

	/**
	 * Shows the Messages module
	 */
	showMessages: function(options) {
		var me = Vtecrm.app,
			active = me.historyGetActive(),
			activeId = (active ? active.getItemId() : '');

		// check if already in messages
		if (activeId == 'viewMessages') return;

		var messages = Ext.create('Vtecrm.view.Messages', Ext.merge({
			hidden: true,
		}, options || {}));
		me.historyAdd(messages);
	},

	/**
	 * Shows the Calendar view
	 */
	showCalendar: function() {
		var me = Vtecrm.app;
		var calendar = Ext.create('Vtecrm.view.Calendar', {hidden: true});
		globalCalendar = calendar;
		me.historyAdd(calendar);
	},

	/**
	 * Fetches notification counters from the server
	 */
    countAppBadges: function(callback) {
    	var me = Vtecrm.app,
    		wsnames = ['GetMessagesCount', 'GetComments', 'GetNotifications', 'GetTodos'],
    		wsparams = {
    			'GetComments' : {'onlycount' : true},
    			'GetNotifications' : {'onlycount' : true},
    			'GetTodos' : {'onlycount' : true},
    		},
    		wscallbacks = {
    			'GetMessagesCount': me.processMessagesCount,
    			'GetComments': me.processCommentsCount,
    			'GetNotifications': me.processNotificationsCount,
    			'GetTodos': function(data) {
    				me.processTodosCount(data);
    				if (typeof callback == 'function') callback();
    			}
    		};

    	// remove messages if not supported
    	if (!me.capabilities.messages) wsnames.shift();

    	me.touchMultiRequest(wsnames, wsparams, false, wscallbacks, true);

    },

    processMessagesCount: function(data) {
    	var me = Vtecrm.app,
    		btn = Ext.getCmp('btnMessages'),
    		count = parseInt(data);

    	if (btn) {
    		var oldcount = btn.getBadgeText() || 0;

    		if (!btn.getHidden() && count != '' && count > 0) {
    			btn.setBadgeText(count);
    			setBadge(count);
    		} else {
    			btn.setBadgeText('');
    			setBadge(null);
    		}
    	}

    	// update module if present
		if (me.modulelist) {
			me.modulelist.setModuleBadge('Messages', count);
		}
    },

    processCommentsCount: function(data) {
    	var me = Vtecrm.app,
    		btn = Ext.getCmp('btnComments'),
    		count = parseInt(data);

    	if (btn) {
    		var oldcount = btn.getBadgeText() || 0;

    		if (!btn.getHidden() && count != '' && count > 0) {
    			btn.setBadgeText(count);
    			setBadge(count);
    		} else {
    			btn.setBadgeText('');
    			setBadge(null);
    		}
    	}

	    // mando notifica
	    if (!me.comment_first_count) {
	    	me.comment_first_count = true;
	    } else {
	    	if (count > oldcount) {
	    		var diff = (count-oldcount),
	    			str = (diff == 1 ? LANG.you_have_1_new_comment : LANG.you_have_n_new_comment);
	    		str = str.replace('{N}', diff);
	    		doNotification(str);
	    	}
	    }

	    // aggiorna se cambia conteggio
	    var activecomp = me.historyGetActive();
	    if (oldcount != count && activecomp == me.commentsview) {
	    	me.commentsview.getStore().load();
	    }
    },

    processNotificationsCount: function(data) {
    	var me = Vtecrm.app,
			btn = Ext.getCmp('btnNotifications'),
			count = parseInt(data);

    	if (btn) {
    		var oldcount = btn.getBadgeText() || 0;

    		if (!btn.getHidden() && count != '' && count > 0) {
    			btn.setBadgeText(count);
    		} else {
    			btn.setBadgeText('');
    		}
    	}

		// mando notifica (tranne al primo caricamento)
		if (!me.notif_first_count) {
			me.notif_first_count = true;
		} else {
			if (count > oldcount) {
				var diff = (count-oldcount),
					str = (diff == 1 ? LANG.you_have_1_new_notif : LANG.you_have_n_new_notif);
				str = str.replace('{N}', diff);
				doNotification(str);
			}
		}

		// aggiorna se cambia conteggio
		if (oldcount != count && me.notifview /*&& me.getActiveComponent() == me.notifview*/) { // TODO: gestire con i nuovi popup
			me.notifview.getStore().load();
		}

    },

    processTodosCount: function(data) {
    	var me = Vtecrm.app,
			btn = Ext.getCmp('btnTodos'),
			count = parseInt(data);

    	if (btn) {
    		var	oldcount = btn.getBadgeText() || 0;

    		if (!btn.getHidden() && count != '' && count > 0) {
    			btn.setBadgeText(count);
    		} else {
    			btn.setBadgeText('');
    		}
    	}

		// update module if present
		if (me.modulelist) {
			me.modulelist.setModuleBadge('Calendar', count);
		}

		// aggiorna se cambia conteggio
		if (oldcount != count && me.todos /*&& me.getActiveComponent() == me.notifview*/) { // TODO: gestire con i nuovi popup
			// REMOVED
			//me.todos.getStore().load();
		}
    },

    /**
     * Shows Task list
     */
	showTodos: function() {
		var me = Vtecrm.app,
			btnTodos = Ext.getCmp('btnTodos');

		if (me.busy) return;
		me.busy = true;

		var floatpan = Ext.create('Ext.Panel', {
			modal: true,
			centered: true,
			hideOnMaskTap: true,
			layout: 'fit',
			width: '98%',
			height: '90%',
			items: [
			    {
			    	xclass: 'Vtecrm.view.ListTodos',
			    	isPopup: true,
			    }
			],
			listeners: {
				hide: function(self) {
					self.destroy();
				}
			}
		});

		if (CONFIG.enable_animations) {
			floatpan.setShowAnimation({
				type: 'fade',
				duration: 200,
			});
		}

		if (btnTodos && !btnTodos.isHidden()) {
			floatpan.showBy(btnTodos);
		} else {
			Ext.Viewport.add(floatpan);
		}
		me.busy = false;
	},

	/**
	 * Shows notifications list
	 */
	showNotifications: function() {
		var me = Vtecrm.app,
			mainbar = me.mainview.down('#mainNavigationBar'),
			barh = (mainbar ? mainbar.element.getHeight() : 40),
			btnComm = Ext.getCmp('btnNotifications');

		if (me.busy) return;
		me.busy = true;

		if (!me.notifview) {
			me.notifview = Ext.create('Vtecrm.view.ListNotifications', {
				isPopup: true,
			});
		} else {
			//me.notifview.setModule(mod);
		}
		var floatpan = Ext.create('Ext.Panel', {
			top: '0px',
			modal: true,
			//centered: true,
			hideOnMaskTap: true,
			layout: 'fit',
			width: '97%',
			height: '90%',
			minWidth: '200px',
			//maxWidth: '800px',
			minHeight: '200px',
			maxHeight: (viewport_height - barh - 30) + 'px',
			items: [me.notifview],
			listeners: {
				hide: function(self) {
					me.notifview.destroy();
					self.destroy();
					me.notifview = null;
				}
			}
		});

		if (CONFIG.enable_animations) {
			floatpan.setShowAnimation({
				type: 'fade',
				duration: 200,
			});
		}

		floatpan.showBy(btnComm);
		me.busy = false;
	},

	// controlla le conversazioni

	countComments: function(callback) {
		var me = this;

		if (CONFIG.app_offline) return;
		Vtecrm.app.touchRequest('GetComments', {'onlycount':true}, false, me.processCommentsCount, true);
	},

	countTodos: function(callback) {
		var me = this;

		if (CONFIG.app_offline) return;
		Vtecrm.app.touchRequest('GetTodos', {'onlycount':true}, false, me.processTodosCount, true);
	},

	/**
	 * Shows the talks list
	 */
	showComments: function(options) {
		var me = Vtecrm.app,
			mainbar = me.mainview.down('#mainNavigationBar'),
			barh = (mainbar ? mainbar.element.getHeight() : 40),
			btnComm = Ext.getCmp('btnComments');

		if (me.busy) return;
		me.busy = true;
		options = options || {};

		// count comments (to update badge);
		// TODO: remove me and update it only with the list
		me.countComments();
		if (!me.commentsview) {
			me.commentsview = Ext.create('Vtecrm.view.ListComments', Ext.merge({
				hidden: true,
				isPopup: true,
			}, options));
		} else {
			// never get here (it is always destroyed)
			me.commentsview = Ext.factory(options, 'Vtecrm.view.ListComments', me.commentsview);
		}

		var floatpan = Ext.create('Ext.Panel', {
			left: '0px',
			modal: true,
			//centered: true,
			hideOnMaskTap: true,
			layout: 'fit',

			width: '97%',
			height: '90%',
			minWidth: '300px',
			//maxWidth: '800px',
			minHeight: '300px',
			maxHeight: (viewport_height - barh - 30) + 'px',
			items: [me.commentsview],
			listeners: {
				hide: function(self) {
					// TODO: fix this
					//me.commentsview.destroy();
					self.destroy();
					me.commentsview = null;
				}
			}
		});

		if (CONFIG.enable_animations) {
			floatpan.setShowAnimation({
				type: 'fade',
				duration: 200,
			});
		}

		floatpan.showBy(btnComm);
		//floatpan.add([me.commentsview]); // fix for android
		me.commentsview.show();
		me.busy = false;
	},

	/**
	 * Sets a notification as seen
	 * @param {Array} ids List of crmid to set as seen
	 */
	seeNotifications: function(ids) {
		var me = Vtecrm.app;

		if (ids == undefined || ids == null || ids == '') return;

		if (typeof ids !== 'object') ids = [ids];

		Ext.Ajax.request({
    		url: vtwsUrl + 'ws.php?wsname=SeeNotifications',
    		params: vtwsOpts+'&module=ModNotifications&records='+ids.join(':'),
    		method: 'POST',
    		useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
    	    success: function (b) {
    	    	var btn = Ext.getCmp('btnNotifications'),
    	    		oldcount = btn.getBadgeText() || 0,
    	    		count;

    	    	try {
    	    		count = Ext.decode(b.responseText);
    	    	} catch (e) {
   		    		console.log('ERROR: invalid server answer in seeComments');
   		    		return;
   		    	}

    	    	if (!btn.getHidden() && count != '' && count > 0) {
    	    		btn.setBadgeText(count);
    	    	} else {
    	    		btn.setBadgeText(false);
    	    	}
    	    	// aggiorna se cambia conteggio
    	    	/*if (oldcount != count) {
    	    		// tolgo la sfumatura e aggiorno lo store
    	    		for (var i=0; i<ids.length; ++i) {
    	    			var currid = ids[i];
    	    			// TODO: non usare jquery
    	    	    	$('#notifContainerLeaf_'+currid).fadeOut(function() {
    	    	    		$(this).removeClass('notifUnseen').fadeIn('fast', function() {
    	    	    			me.commentsview.getStore().getById(currid).setSeen(true);
    	    	    		});
    	    	    	});

    	    		}
    	    	}*/
    	    },
    	});

	},

	/**
	 * Shows the Settings page
	 */
	showSettings: function() {
		var me = Vtecrm.app;
		me.settings = Ext.create('Vtecrm.view.Settings', {hidden: true});
		me.historyAdd(me.settings);
	},

	/**
	 * Hides the Settings page
	 */
	hideSettings: function() {
		var me = this;
		if (me.settings) {
			me.settings.quickDestroy();
			me.settings = null;
		}
	},

	/**
	 * Shows a record. For special types, like Messages, the specialized views are created,
	 * otherwise the standard Vtecrm.view.ShowRecord will be used
	 * @param {String} mod The module
	 * @param {Number} recordid The crmid of the record
	 * @param {String} entityname The name of this record
	 */
	showRecord: function(mod, recordid, entityname, parent, options) {
		var me = Vtecrm.app,
			created = false,
			openedRecords;

		options = options || {};

		if (mod == 'Messages') {
			// check if messages open and i have a record to show
			var existing = me.historyFind('viewMessages');
			if (existing && recordid > 0) {
				me.historyClear();
			}

			me.showMessages(Ext.merge({
				// avoid autoload of meta info
				autoLoadMeta: false,
				listeners: {

					initialize: function(self) {
						// load meta only from local, to avoid overhead
						self.loadMeta(false, true);

						if (recordid > 0) {
							self.showSingleMessage(recordid);
						} else {
							var recipients = null;
							if (parent && parent.getItemId() == 'viewShowRecord') {
								// extract the email addresses from the record
								recipients = parent.getEmailAddresses(true);
							}
							self.showSingleEdit(recipients);
						}
					}
				}
			}, options));
			return;
		}

		//console.log('SHOW RECORD FOR '+mod+" ID: "+recordid);

		if (empty(mod)) {
			console.log('ERROR: empty mod');
			return;
		}

		// controllo se sto per aprire lo stesso id
		openedRecords = me.historyFindAll('viewShowRecord');
		for (var i=0; i<openedRecords.length; ++i) {
			if (openedRecords[i].getCrmid() == recordid) {
				Ext.Msg.alert(LANG.alert, LANG.record_already_opened);
				return;
			}
		}

		// TODO: riutilizza e ricrea all'occorrenza
		// TODO: svuotare dai vecchi dati
		//if (!me.showrecord) {
			me.showrecord = Ext.create('Vtecrm.view.ShowRecord', Ext.merge({
				hidden: true,
			}, options));
			created = true;
		

		me.showrecord.setModule(mod);
		me.showrecord.setEntityName(entityname);
		me.showrecord.setCrmid(recordid);

		if (!empty(parent)) me.showrecord.setParentRecord(parent);

		me.historyAdd(me.showrecord);
	},

	/**
	 * Removes all the active components and go back to the home page. If there were modified fields,
	 * a popup will open asking to save the changes.
	 *
	 */
	goHome: function() {
		var i,
			tosave = [],
			me = Vtecrm.app;

		// controllo se ci sono showrecord da salvare
		var showrecords = me.historyFindAll('viewShowRecord');
		if (showrecords && showrecords.length > 0) {
			for (i=0; i<showrecords.length; ++i) {
				var rec = showrecords[i];
				if (rec.itemChanged || rec.productsChanged) {
					tosave.push(rec);
				}
			}
		}

		if (tosave.length > 0) {
			Ext.Msg.confirm(LANG.alert, LANG.save_pending, function(buttonId, value, opt) {
				if (buttonId == 'yes') {
					for (i=0; i<tosave.length; ++i) {
						tosave[i].saveRecord();
					}
					me.historyClear();
				} else {
					me.historyClear();
				}
			});
		} else {
			me.historyClear();
		}
	},

	/**
	 * Shows recent records list
	 */
	showRecents: function() {
		var me = Vtecrm.app,
			btnRec = Ext.getCmp('btnRecents');

		if (me.busy) return;
		me.busy = true;

		var floatpan = Ext.create('Ext.Panel', {
			modal: true,
			centered: true,
			hideOnMaskTap: true,
			layout: 'fit',
			width: '98%',
			height: '90%',
			zIndex: 10,
			items: [
			    {
			    	xtype: 'toolbar',
			    	docked: 'top',
			    	ui: 'light',
			    	title: LANG.recents,
			    	items: [
			    	    {
			    	    	xtype: 'button',
			    	    	text: LANG.end,
			    	    	align: 'left',
			    	    	handler: function() {
			    	    		floatpan.destroy();
			    	    	}
			    	    }
			    	]
			    },
			    {
			    	xclass: 'Vtecrm.view.ListRecents',
			    	isPopup: true,
					loadingText: LANG.loading,
					showModuleName: true,
			    }
			],
			listeners: {
				hide: function(self) {
					self.destroy();
				}
			}
		});

		if (CONFIG.enable_animations) {
			floatpan.setShowAnimation({
				type: 'fade',
				duration: 200,
			});
		}

		if (btnRec && !btnRec.isHidden()) {
			floatpan.showBy(btnRec);
		} else {
			Ext.Viewport.add(floatpan);
		}
		floatpan.down('#listRecents').loadStore();
		me.busy = false;
	},

	/**
	 * Shows favourites records list
	 */
	showFavourites: function() {
		var me = Vtecrm.app,
			btnFav = Ext.getCmp('btnFavourites');

		if (me.busy) return;
		me.busy = true;

		var floatpan = Ext.create('Ext.Panel', {
			modal: true,
			centered: true,
			hideOnMaskTap: true,
			layout: 'fit',
			width: '98%',
			height: '90%',
			zIndex: 10,
			items: [
			    {
			    	xtype: 'toolbar',
			    	docked: 'top',
			    	ui: 'light',
			    	title: LANG.favourites,
			    	items: [
			    	    {
			    	    	xtype: 'button',
			    	    	text: LANG.end,
			    	    	align: 'left',
			    	    	handler: function() {
			    	    		floatpan.hide();
			    	    	}
			    	    }
			    	]
			    },
			    {
			    	xclass: 'Vtecrm.view.ListFavourites',
			    	isPopup: true,
					loadingText: LANG.loading,
					showModuleName: true,
			    }
			],
			listeners: {
				hide: function(self) {
					self.destroy();
				}
			}
		});

		if (CONFIG.enable_animations) {
			floatpan.setShowAnimation({
				type: 'fade',
				duration: 200,
			});
		}

		if (btnFav && !btnFav.isHidden()) {
			floatpan.showBy(btnFav);
		} else {
			Ext.Viewport.add(floatpan);
		}
		floatpan.down('#listFavourites').loadStore();
		me.busy = false;
	},

	/**
	 * Translates a string
	 * @private
	 */
	translateString: function(label) {
		var me = Vtecrm.app;
		if (!me.translations || me.translations[label] === undefined) return label;
		return me.translations[label];
	},

	/**
	 * Adds a translation
	 * @private
	 */
	insertTranslation: function(label, trans) {
		var me = Vtecrm.app;
		if (!me.translations) return;
		me.translations[label] = trans;
	},

	/**
	 * Returns the label of a module
	 */
	getModuleLabel: function(module) {
		var me = this,
			store = Ext.getStore('modulesStoreOffline');

		if (!me.moduleLabels || !me.moduleLabels[module]) {
			var record = store.findRecord('view', module),
				label = (record ? record.get('label') : '');
			if (!me.moduleLabels) me.moduleLabels = {};
			me.moduleLabels[module] = label;

		}
		return me.moduleLabels[module];
	},

	/**
	 * Logout from the application
	 * The localstorage and the DB tables are cleared
	 */
	doLogout: function() {
		// LOGOUT
		maskView();

		// cancello database
		DBUtils.dropTables();

		// cancello localstorage
		localStorage.removeItem('vteInfo');
		localStorage.removeItem('vtwsOpts');
    	localStorage.removeItem('modulesList');
    	localStorage.removeItem('areas');
    	localStorage.removeItem('recent_filters');
    	localStorage.removeItem('recent_folders');
    	localStorage.removeItem('last_module_tab');
    	localStorage.removeItem('filter_settings');
    	localStorage.removeItem('messagesMeta');
    	localStorage.removeItem('compatibility_mode');

    	vtwsUrl = null;
    	vtwsOpts = null;
    	DB.atEnd(function() {
    		setBadge(null);
    		window.location.reload();
    	});
	},

	// gestione orientamento
	handleOrientationChange: function(viewport, new_orient, width, height, opts) {
		var me = Vtecrm.app;

		me.calculateViewportSize();

		if (display_orient != new_orient) {
    		display_orient = new_orient;

    		if (me.modulelist) {
    			me.modulelist.handleOrientationChange(viewport, new_orient, width, height, opts);
    		}

    		// cerco module home
    		if (me.modulehome) {
    			me.modulehome.handleOrientationChange(viewport, new_orient, width, height, opts);
    		}
		}

	},

	calculateViewportSize: function() {
		// calculate the size of the viewport (drawable area for the app)
		var size = Ext.Viewport.getSize();
		viewport_width = size.width;
		viewport_height = size.height;
		return size;
	},

	/**
	 * Closes the app (if supported by the device)
	 */
	exitApp: function() {
		if (navigator && navigator.app && navigator.app.exitApp) {
			navigator.app.exitApp();
		}
	},

	// Only available for Android
	handleBackButton: function() {
		var me = Vtecrm.app;
		if (me.hasLoginInfo) {
			var lastItem = me.historyGetActive();
			if (lastItem && lastItem.getItemId && lastItem.getItemId() == 'modulesList') {
				me.exitApp();
			} else {
				//TODO: chiamare backbutton del componente attivo se disponibile
				me.historyBack();
			}
		} else {
			me.exitApp();
		}
	},

	// fires when Internet connection is available
	handleDeviceOnline: function() {
		// TODO!!
	},

	// fires when device goes offline
	handleDeviceOffline: function() {
		// TODO!!
	},

	// TODO: usare una cache
	/**
	 * Checks whether a module is available
	 * @param {String/String[]} module The name(s) of the module. In case a list is passed, ALL modules must be available
	 */
	isModuleAvailable: function(module) {
		var modstore = Ext.getStore('modulesStoreOffline');
		if (!Ext.isArray(module)) module = [module];
		for (var i=0; i<module.length; ++i) {
			if (modstore.find('view', module[i]) < 0) return false;
		}
		return true;
	},

	// TODO: unificare!!, usare storage

	// imposta l'ultimo filtro usato per il modulo
	/**
	 * @private
	 */
	setRecentFilter: function(module, cvinfo) {
		var me = Vtecrm.app;

		if (!module) return;
		if (me.recentFilters === undefined) me.recentFilters = {};
		me.recentFilters[module] = cvinfo;
		// salvo storage
		localStorage.setItem('recent_filters', Ext.encode(me.recentFilters));
	},

	// prende l'ultimo filtro usato per il modulo
	/**
	 * @private
	 */
	getRecentFilter: function(module) {
		var me = Vtecrm.app;
		if (me.recentFilters === undefined) {
    		// provo a prendere da storage
    		var fs = localStorage.getItem('recent_filters');
    		me.recentFilters = (fs ? Ext.decode(fs) : {});
		}
		return me.recentFilters[module];
	},

	// imposta l'ultima cartella usato per il modulo
	/**
	 * @private
	 */
	setRecentFolder: function(module, cvinfo) {
		var me = Vtecrm.app;

		if (!module) return;
		if (me.recentFolders === undefined) me.recentFolders = {};
		me.recentFolders[module] = cvinfo;
		// salvo storage
		localStorage.setItem('recent_folders', Ext.encode(me.recentFolders));
	},

	// prende l'ultima cartella usato per il modulo
	/**
	 * @private
	 */
	getRecentFolder: function(module) {
		var me = Vtecrm.app;
		if (me.recentFolders === undefined) {
    		// provo a prendere da storage
    		var fs = localStorage.getItem('recent_folders');
    		me.recentFolders = (fs ? Ext.decode(fs) : {});
		}
		return me.recentFolders[module];
	},

	// imposta l'ultimo filtro usato per il modulo
	/**
	 * @private
	 */
	setLastModuleTab: function(module, tabn) {
		var me = Vtecrm.app;

		if (!module) return;
		if (me.lastModuleTab === undefined) me.lastModuleTab = {};
		me.lastModuleTab[module] = tabn;
		// salvo storage
		localStorage.setItem('last_module_tab', Ext.encode(me.lastModuleTab));
	},

	// prende l'ultimo filtro usato per il modulo
	/**
	 * @private
	 */
	getLastModuleTab: function(module) {
		var me = Vtecrm.app;
		if (me.lastModuleTab === undefined) {
    		// provo a prendere da storage
    		var fs = localStorage.getItem('last_module_tab');
    		me.lastModuleTab = (fs ? Ext.decode(fs) : {});
		}
		return me.lastModuleTab[module];
	},

	// imposta l'ultimo filtro usato per il modulo
	/**
	 * @private
	 */
	setFilterSettings: function(module, cvid, info) {
		var me = Vtecrm.app;

		if (!module) return;
		if (me.filterSettings === undefined) me.filterSettings = {};
		if (me.filterSettings[module] === undefined) me.filterSettings[module] = {};
		me.filterSettings[module][cvid] = info;
		// salvo storage
		localStorage.setItem('filter_settings', Ext.encode(me.filterSettings));
	},

	// prende l'ultimo filtro usato per il modulo
	/**
	 * @private
	 */
	getFilterSettings: function(module, cvid) {
		var me = Vtecrm.app;
		if (me.filterSettings === undefined) {
    		// provo a prendere da storage
    		var fs = localStorage.getItem('filter_settings');
    		me.filterSettings = (fs ? Ext.decode(fs) : {});
		}
		return (me.filterSettings[module] ? me.filterSettings[module][cvid] : undefined);
	},

	// imposta l'ultima cartella usato per il modulo
	/**
	 * @private
	 */
	setFolderSettings: function(module, cvid, info) {
		var me = Vtecrm.app;

		if (!module) return;
		if (me.folderSettings === undefined) me.folderSettings = {};
		if (me.folderSettings[module] === undefined) me.folderSettings[module] = {};
		me.folderSettings[module][cvid] = info;
		// salvo storage
		localStorage.setItem('folder_settings', Ext.encode(me.folderSettings));
	},

	// prende l'ultima cartella usato per il modulo
	/**
	 * @private
	 */
	getFolderSettings: function(module, cvid) {
		var me = Vtecrm.app;
		if (me.folderSettings === undefined) {
    		// provo a prendere da storage
    		var fs = localStorage.getItem('folder_settings');
    		me.folderSettings = (fs ? Ext.decode(fs) : {});
		}
		return (me.folderSettings[module] ? me.folderSettings[module][cvid] : undefined);
	},

	/**
	 * Links 2 records
	 * @param {String} moduleFrom The module of the first record
	 * @param {Number} crmidFrom The crmid of the first record
	 * @param {String} moduleTo The module of the second record
	 * @param {Number} crmidTo The crmid of the second record
	 * @param {Function} callback The function to be called when the request is completed
	 */
	linkModules: function(moduleFrom, crmidFrom, moduleTo, crmidTo, callback) {
		var me = Vtecrm.app;

		if (Ext.isArray(crmidTo)) crmidTo = crmidTo.join(';');

		me.touchRequest('LinkModules', {
			'module_from' : moduleFrom,
			'crmid_from' : crmidFrom,
			'module_to' : moduleTo,
			'crmid_to' : crmidTo
		}, false, callback);
	},

	// TODO: far passare tutte le chiamate ajax sparse in giro da qui
	// TODO: trovare un modo di farci passare anche gli store
	// TODO: callback per errore
	/**
	 * Executes a request to the VTE Touch Webservices
	 * @param {String} wsname The name of the webservice
	 * @param {Object} params The parameters to pass
	 * @param {Boolean} showLoader If true mask the screen during the request
	 * @param {Function} callback Function to be called with the resulting data
	 * @param {Boolean} [besilent=false] If true, nothing will be shown to the user
	 * @param {Boolean} [skipreturncheck=false] If true, skips any validation of the data
	 * returned and pass it directly to the callback. Used for old style webserices, new ones should
	 * always return JSON data
	 */
	touchRequest: function(wsname, params, showLoader, callback, besilent, skipreturncheck) {
		var mtime = (new Date()).getTime();

		params = params || {};
		if (besilent === undefined) besilent = false;
		if (skipreturncheck === undefined) skipreturncheck = false;
		var paramsString = Ext.Object.toQueryString(params);

		if (showLoader) maskView();
		Ext.Ajax.request({
			url: vtwsUrl + 'ws.php?wsname='+wsname+'&_dc='+mtime,
			params: vtwsOpts + (paramsString ? '&'+paramsString : ''),
			method: 'POST',
			useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
			'callback': function() {
				// beware! this is called AFTER the success or failure callbacks
				if (showLoader) unMaskView();
			},
		    success: function (b) {
		    	// all the responses must be JSON encoded
		    	if (skipreturncheck) {
		    		parsedData = b.responseText;
		    	} else {
		    		try {
		    			parsedData = Ext.decode(b.responseText);
		    		} catch (e) {
		    			// might be an old API
		    			if (b.responseText.match(/^SUCCESS|^ERROR/)) {
		    				parsedData = b.responseText;
		    			} else {
		    				if (!besilent)
		    					Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
		    				return;
		    			}
		    		}
		    	}
		    	if (typeof callback == 'function') {
		    		callback(parsedData);
		    	}
		    },
		    failure: function(xhr, opt) {
		    	if (!besilent)
		    		Ext.Msg.alert(LANG.error, LANG.ajax_failed);
		    }
		});
	},

	// if multirequest is not available, call single webservices and return the data at the end of each request
	touchOldMultiRequest: function(wsnames, params, showLoader, callbacks, besilent) {
		var me = Vtecrm.app,
			mtime = (new Date()).getTime();

		if (besilent === undefined) besilent = false;

		for (var i=0; i<wsnames.length; ++i) {
			var wname = wsnames[i];
			me.touchRequest(wname, params[wsnames[i]] || {}, showLoader, callbacks[wname], besilent);
		}
	},

	// if callbacks is a function, call that for every ws, otherwise it should be an object with ws names as keys
	/**
	 * Executes multiple webservice calls with just one ajax request. Available only if server supports it
	 */
	touchMultiRequest: function(wsnames, params, showLoader, callbacks, besilent) {
		var me = Vtecrm.app,
			mtime = (new Date()).getTime(),
			wslist = [];

		if (!me.capabilities.multi_call) return me.touchOldMultiRequest(wsnames, params, showLoader, callbacks, besilent);

		if (besilent === undefined) besilent = false;

		for (var i=0; i<wsnames.length; ++i) {
			var wsinfo = {
				'wsname': wsnames[i],
				'wsparams' : params[wsnames[i]] || {},
			};
			wslist.push(wsinfo);
		}

		var paramsObj = Ext.merge({
			'wslist': Ext.encode(wslist)
		}, params_unserialize(vtwsOpts));

		if (showLoader) maskView();
		Ext.Ajax.request({
			url: vtwsUrl + 'ws.php?wsname=MultiCall&_dc='+mtime,
			params: paramsObj,
			method: 'POST',
			useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
			'callback': function() {
				if (showLoader) unMaskView();
			},
		    success: function (b) {
		    	// all the responses must be JSON encoded
		    	try {
		    		parsedData = Ext.decode(b.responseText);
		    	} catch (e) {
		    		if (!besilent)
		    			Ext.Msg.alert(LANG.error, LANG.invalid_server_response);
		    		return;
		    	}

		    	// now call appropriate callback
		    	if (typeof callback == 'function') {
		    		callback(parsedData);
		    	} else if (Ext.isObject(callbacks)) {
		    		for (var i=0; i<wsnames.length; ++i) {
		    			var wname = wsnames[i];
		    			if (typeof callbacks[wname] == 'function') {
		    				callbacks[wname](parsedData[wname]);
		    			}
		    		}
		    	}
		    },
		    failure: function(xhr, opt) {
		    	if (!besilent)
		    		Ext.Msg.alert(LANG.error, LANG.ajax_failed);
		    }
		});


	},



	// ----- GESTIONE OFFLINE ----------------------------

	// abilita l'offline, carica i dati per ogni store, nel db locale
	enableOffline: function() {
		var me = this;

		console.log('GOING OFFLINE');
		maskView(LANG.loading);

		// store dei recenti
		// TODO: gli store devono essere globali
		var list1 = Ext.create('Vtecrm.view.ListRecents');
		var st1 = list1.getStore();
		st1.goOnline();
		st1.load(function() {
			st1.goOffline();
			st1.sync();
			list1.destroy();
		});

		// e dei preferiti
		var list2 = Ext.create('Vtecrm.view.ListFavourites');
		var st2 = list2.getStore();
		st2.goOnline();
		st2.load(function() {
			st2.goOffline();
			st2.sync();
			list2.destroy();
		});

		// e i blocchi
		/*var st3 = Ext.getStore('storeVteBlocks');
		st3.goOnline();
		st3.setModule('ALL');
		st3.load(function() {
			st3.goOffline();
		});*/

		// i record
		Ext.Ajax.request({
    		url: vtwsUrl + 'ws.php?wsname=GetOfflineData',
    		params: vtwsOpts+'page=1',
    		method: 'POST',
    		useDefaultXhrHeader: false, // prevent OPTIONS request, enable for cross site
    	    success: function (b) {

    	    },
    	});

		// TODO: chiamare solo alla fine
		DB.atEnd(function() {
			// nascondo le icone per conversazioni e notifiche
			me.mainview.down('#btnComments').setHidden(true);
			me.mainview.down('#btnNotifications').setHidden(true);

			unMaskView();
		})
	},

	// sincronizza con il server
	disableOffline: function() {
		var me = this;

		console.log('GOING ONLINE');
		maskView(LANG.loading);

		unMaskView();
		me.mainview.down('#btnComments').setHidden(false);
		me.mainview.down('#btnNotifications').setHidden(false);
	}

});

/**
 * @class global
 */

// coda per la maschera
var mask_queue = [];


/**
 * Shows a grey mask on the app, preventing any user interaction.
 * An optional message can be displayed.
 * Remember to call unMaskView for every time maskView is called.
 * @param {String} [msg='']
 */
function maskView(msg) {
	arguments.callee.internalId = ++arguments.callee.internalId || 1;

	var maskitem = {
		'maskid' : arguments.callee.internalId,
		'timeoutId' : setTimeout(maskTimeout, CONFIG.mask_timeout)
	}
	mask_queue.push(maskitem);
	Ext.Viewport.setMasked({
		xtype: 'loadmask',
		message: msg,
		zIndex: 100,
	});

}

// parametri: vuoto: nascondi l'ultima maschera, -1: nascondi tutto, id: nascondi la maschera con l'id specificato
/**
 * Remove the last mask applied to the viewport
 * @param {Number} [maskid=undefined]
 */
function unMaskView(maskid) {
	var i, to;

	if (Ext.Viewport.getMasked()) {

		if (maskid === undefined || maskid === null) {
			// clear only last one
			if (mask_queue.length == 0) {
				console.log('MASK INVALID STATE. CLEARING MASK ANYWAY');
				Ext.Viewport.unmask();
			} else {
				to = mask_queue.shift();
				clearInterval(to.timeoutId);
				if (mask_queue.length == 0) {
					Ext.Viewport.unmask();
				}
			}
		} else if (maskid === -1) {
			// clear all queue
			for (i=0; i<mask_queue.length; ++i) {
				to = mask_queue[i];
				clearInterval(to.timeoutId);
			}
			Ext.Viewport.unmask();
			mask_queue = [];
		} else {
			// clear the specified one
			for (i=0; i<mask_queue.length; ++i) {
				to = mask_queue[i];
				if (t['maskid'] == maskid) {
					clearInterval(to.timeoutId);
					mask_queue.splice(i, 1);
					if (mask_queue.length == 0) {
						Ext.Viewport.unmask();
					}
					break;
				}
			}
		}
	}
}

// gestisce il timeout per la maschera
function maskTimeout() {
	//console.log('MASK TIMEOUT');
	unMaskView(-1);
	Ext.Msg.alert(LANG.error, LANG.mask_timeout);
}

// this function is called when entering background state
function appOnPause() {
	var cc  = 1;
	/*setInterval(function() {
		doNotification('ciao '+cc);
		++cc;
	}, 4000);
*/

	/*var d = new Date();
		d = d.getTime() + 10*1000; //10 seconds from now
		d = new Date(d);
	if (window.plugins && window.plugins.localNotification) {
		navigator.notification.vibrate(600);
		setTimeout(function() {
			navigator.notification.vibrate(400);
	window.plugins.localNotification.add({
		date: d,
	    message: 'ciao',
	    //repeat: 'weekly', // will fire every week on this day
	    //badge: 1,
	    foreground: function() { alert('in foreground'); },
	    background: function() { alert('in background'); },
	    //sound:'sub.caf'
	});

		}, 1000);
	}*/

}

