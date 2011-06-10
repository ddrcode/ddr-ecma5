/**
15: In Edition 5, the following new properties are defined on built-in objects that exist in Edition 3: 
Object.getPrototypeOf, Object.getOwnPropertyDescriptor, Object.getOwnPropertyNames, 
Object.create, Object.defineProperty, Object.defineProperties, Object.seal, 
Object.freeze, Object.preventExtensions, Object.isSealed, Object.isFrozen, 
Object.isExtensible, Object.keys, Function.prototype.bind, Array.prototype.indexOf,  
Array.prototype.lastIndexOf, Array.prototype.every, Array.prototype.some, 
Array.prototype.forEach, Array.prototype.map, Array.prototype.filter, 
Array.prototype.reduce, Array.prototype.reduceRight, String.prototype.trim, Date.now, 
Date.prototype.toISOString, Date.prototype.toJSON. 
*/

module( "ddr-ECMA5 features" );

test( "ECMA5 - Object extensions", function(){
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


test( "ECMA5 - Function extensions", function(){
	ok( Function.prototype.bind, "Function.prototype.bind" );
});


test( "ECMA5 - String.ptototype extensions", function(){
	ok( String.prototype.trim, "String.prototype.trim" );
});

test( "ECMA5 - Array.ptototype extensions", function(){
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

test( "ECMA5 - Date.ptototype extensions", function(){
	ok( Date.now, "Date.now" );
	ok( Date.prototype.toISOString, "Date.prototype.toISOString" );
	ok( Date.prototype.toJSON, "Date.prototype.toJSON" );
});

test( "ECMA5 - JSON", function(){
	var g = function(){return this;}.call();
	ok( g.JSON, "JSON object" );
	if( g.JSON ) {
		ok( g.JSON.parse, "JSON.parse object" );
		ok( g.JSON.stringify, "JSON.stringify object" );
	}
});