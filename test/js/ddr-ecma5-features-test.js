
module( "ECMAScript 5 features" );

test( "ECMAScript 5 - Object extensions", function(){
	ok( Object.keys, "Object.keys" );
	ok( Object.getPrototypeOf, "Object.getPrototypeOf" );
	ok( Object.getOwnPropertyDescriptor, "Object.getOwnPropertyDescriptor" );
	ok( Object.getOwnPropertyNames, "Object.getOwnPropertyNames" );
	ok( Object.create, "Object.create" );
	ok( Object.defineProperty, "Object.defineProperty" );
	ok( Object.defineProperties, "Object.defineProperties" );
	ok( Object.seal, "Object.seal" );
	ok( Object.freeze, "Object.freeze" );
	ok( Object.preventExtensions, "Object.preventExtensions" );
	ok( Object.isSealed, "Object.isSealed" );
	ok( Object.isFrozen, "Object.isFrozen" );
	ok( Object.isExtensible, "Object.isExtensible" );
});


test( "ECMAScript 5 - Function extensions", function(){
	ok( Function.prototype.bind, "Function.prototype.bind" );
});


test( "ECMAScript 5 - String extensions", function(){
	var accessByIndex = (function(){
		var str = "abc";
		try {
			var x = str[1];
			return x === 'b';
		} catch(ex) {
			return false;
		}
	})();
	ok( accessByIndex, "Accessing character in a string with [] operator" );
});


test( "ECMAScript 5 - String.ptototype extensions", function(){
	ok( String.prototype.trim, "String.prototype.trim" );
});


test( "ECMAScript 5 - Array extensions", function(){
	ok( Array.isArray, "Array.isArray" );
});

test( "ECMAScript 5 - Array.ptototype extensions", function(){
	ok( Array.prototype.indexOf, "Array.prototype.indexOf" );
	ok( Array.prototype.lastIndexOf, "Array.prototype.lastIndexOf" );
	ok( Array.prototype.every, "Array.prototype.every" );
	ok( Array.prototype.some, "Array.prototype.some" );
	ok( Array.prototype.forEach, "Array.prototype.forEach" );
	ok( Array.prototype.map, "Array.prototype.map" );
	ok( Array.prototype.filter, "Array.prototype.filter" );
	ok( Array.prototype.reduce, "Array.prototype.reduce" );
	ok( Array.prototype.reduceRight, "Array.prototype.reduceRight" );
});

test( "ECMAScript 5 - Date.ptototype extensions", function(){
	ok( Date.now, "Date.now" );
	ok( Date.prototype.toISOString, "Date.prototype.toISOString" );
	ok( Date.prototype.toJSON, "Date.prototype.toJSON" );
});

test( "ECMAScript 5 - JSON", function(){
	var isj = typeof JSON === "object";
	ok( isj, "JSON object" );
	if( isj ) {
		ok( JSON.parse, "JSON.parse object" );
		ok( JSON.stringify, "JSON.stringify object" );
	}
});

test( "ECMAScript 5 - Strict mode", function(){
	var obj = (function(){
			"use strict";
			return this;
		})();
	ok( typeof obj === "undefined", "'use strict'" );
});