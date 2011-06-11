module( "ddr-ECMA5" );


/**
 * Additional utils for testing purposes
 */
var utils = {
	
	/**
	 * Compares two arrays 
	 * @param {Array} arr1
	 * @param {Array} arr2
	 * @return true if two arrays are identical (by value) and false in other case
	 */
	compareArrays: function(arr1, arr2) {
		if (arr1.length !== arr2.length) 
			return false;
		for (var i=0; i < arr1.length; ++i) {
			if( arr1[i]==null ) {
				if( arr1[i] !== arr2[i] )
					return false;
				continue;
			}
			if( arr1[i].compare && !arr1.compare(arr2[i]) ) 
				return false;
			if (arr1[i] !== arr2[i]) 
				return false;
	    }
		return true;
	},
	
	
	/**
	 * Checks wheter error happened during code execution
	 * @param {Function} fn
	 * @return true if error happened and else in other case
	 */
	assertError: function(fn) {
		if( typeof fn !== 'function' )
			return false;
		try {
			fn();
			return false;
		} catch(e) {
			return true;
		}
	},
	
	
	/**
	 * A reference to global object
	 */
	global: (function(){ return this; })(),
	

	/**
	 * Basic test for all array methods
	 * @param {string} mth - method name
	 */
	arrayMethodTest: function(mth) {
			
		ok( Array.prototype[mth], "method existence veryfication" );
		ok ( typeof Array.prototype[mth] === 'function', mth+" should be a function" );
		
		var arr = new Array(5);
		arr[1] = 2; arr[4] = 5;
		var len = 0;
		
		if( mth !== "some" ) { // ugly exception for 'some' method, which exits after finding first matching element
			arr[mth]( function(){ return ++len;} );
			ok( len === 2, "arr."+mth+"( function(){ return ++len;} )" );
		}
		
		var arr2 = ["a"];
		arr2[mth](function(item, idx, a){
				ok(item === 'a', "Iterator parameters test - first parameter should be 'a'");
				ok(idx === 0, "Iterator parameters test - second parameter should be 0");
				ok(a === arr2, "Iterator parameters test - third parameter should be an array");
				ok(this === utils.global, "Iterator function test - this should point to a global object");
			});
		
		var obj = {};
		arr2[mth](function(){
				ok(this === obj, "Iterator function test - this should point to obj");
			}, obj);
		
		ok( Array.prototype[mth].length === 1, "Method length should be 1" );
		ok( utils.assertError(function(){ arr2[mth](123); }), mth+" with non-function argument shoudl return an error" );
	}
};


//-----------------------------------------------------------------
// Function.prototype tests

test( "Function.prototype.bind", function(){

	ok( Function.prototype.bind, "Bind existence veryfication" );

	var obj = { msg: "in", test: function(txt){ return txt || this.msg;} };
	var fun1 = obj.test.bind( obj );
	var fun2 = obj.test.bind( obj, "out" );
	
	ok( fun1() === "in", "fun1 with no param" );
	ok( fun1("out") === "out", "fun1 with 'out' param" );
	ok( fun2() === "out", "fun2 with no param" );
	ok( fun2() === "out", "fun2 with param" );

	ok( utils.assertError(function(){obj.msg.bind.call(new Object())}), "obj.msg.bind.call(new Object()) should throw an error" );
	
});


//-----------------------------------------------------------------
// Object tests

test( "Object.keys", function(){
	
	ok( Object.keys, "method existence veryfication" );
	
	var obj = { msg: "in", test: function(txt){ return txt || this.msg;} };
	
	ok( utils.compareArrays(Object.keys(obj), ["msg","test"]), "Object.keys(obj)" );
	ok( utils.assertError(function(){ Object.keys(5);}), "number primitive" );
	ok( !utils.assertError(function(){ Object.keys(new Number(5));}), "number object" );
	ok( utils.assertError(function(){ Object.keys();}), "no arguments" );
	ok( !utils.assertError(function(){ Object.keys(function(){});}), "function" );
} );


test( "Object.getPrototypeOf", function(){
	
	ok( Object.getPrototypeOf, "method existence veryfication" );
	
	var C = function(){};
	
	ok( Object.getPrototypeOf([]) === Array.prototype, "Array" );
	ok( utils.assertError( function(){ Object.getPrototypeOf(); }), "no arguments" );
	ok( Object.getPrototypeOf(new C()) === C.prototype, "Custom type" );
});
	

test( "Object.create", function(){
	
	ok( Object.create, "method existence veryfication" );
	
	var proto = { test: "ECMA5" };
	var copy = Object.create( proto );
	
	ok( Object.getPrototypeOf(copy) === proto, "New object prototype should be a reference to original object" );
	ok( copy !== proto, "New object itself shouldn't be a reference to original object" );
	ok( !copy.hasOwnProperty("test"), "Prototype attribute shouldn't be an own attribute of new object" );
	ok( utils.assertError(function(){ Object.create(); }), "Object.create without object attribute should throw exception" );
});


test( "Object.isSealed", function(){
	
	ok( Object.isSealed, "method existence veryfication" );
	ok( Object.isSealed({}) === false, "Object.isSealed({}) === false" );
	if( Object.seal ) {
		ok( Object.isSealed(Object.seal({})) === true, "Object.isSealed(Object.seal({})) === true" );
	}
	ok( utils.assertError(function(){Object.isSealed(123)}), "Object.isSealed with non-object argument should throw TypeError" );
	
});


test( "Object.isFrozen", function(){
	
	ok( Object.isFrozen, "method existence veryfication" );
	ok( Object.isFrozen({}) === false, "Object.isFrozen({}) === false" );
	if( Object.freeze ) {
		ok( Object.isFrozen(Object.freeze({})) === true, "Object.isFrozen(Object.freeze({})) === true" );
	}	
	ok( utils.assertError(function(){Object.isFrozen(123)}), "Object.isFrozen with non-object argument should throw TypeError" );
	
});


test( "Object.isExtensible", function(){
	
	ok( Object.isExtensible, "method existence veryfication" );
	ok( Object.isExtensible({}) === true, "Object.isExtensible({}) === true" );
	if( Object.seal ) {
		ok( Object.isExtensible(Object.seal({})) === false, "Object.isExtensible(Object.seal({})) === false" );
	}	
	ok( utils.assertError(function(){Object.isExtensible(123)}), "Object.isFrozen with non-object argument should throw TypeError" );
	
});

//-----------------------------------------------------------------
// String.prototype tests

test( "String.prototype.trim", function(){
	
	ok( String.prototype.trim, "method existence veryfication" );
	
	var str1 = "  test ";
	
	ok( str1.trim() === 'test', "Simple trim" );
	ok( str1==='  test ', "Check whether trim modifies original object" );
	
	ok( '\n\r\ttest'.trim() === 'test', "Trim with special characters (\\n\\r\\t)" );
	ok( new String(str1).trim() === 'test', "Trim of String instance" );
});


//-----------------------------------------------------------------
// Array tests

test( "Array.isArray", function(){

	ok( Array.isArray, "method existence verification" );
	
	ok( Array.isArray([1,2]), "isArray returns true for an array" );
	ok( Array.isArray([]), "isArray returns true for an empty array" );
	ok( !Array.isArray(2), "isArray returns false for a non-array" );
	ok( !Array.isArray(null), "isArray returns false for a null" );
});

//-----------------------------------------------------------------
// Array.prototype tests

test( "Array.prototype.indexOf", function(){
	
	ok( Array.prototype.indexOf, "method existence veryfication" );

	var arr = ['a','b','c','b','d'];
	
	ok( arr.indexOf('b') === 1, "arr.indexOf('b')" );
	ok( arr.indexOf('b',2) === 3, "arr.indexOf('b',2)" );
	ok( arr.indexOf('b',-2) === 3, "arr.indexOf('b',-2)" );
	
	ok( arr.indexOf('q') === -1, "arr.indexOf('q')" );
	ok( arr.indexOf('a', -10) === 0, "arr.indexOf('a',-10)" );
	ok( arr.indexOf('a', 100) === -1, "arr.indexOf('a',100)" );
	
	arr = new Array;
	arr[4] = 'x';
	ok( arr.indexOf(undefined) === -1, "arr.indexOf(undefined)" );
	arr[3] = undefined;
	ok( arr.indexOf(undefined) === 3, "arr.indexOf(undefined)" );
	
	var C = function(val){
		this.value = val;
	};
	C.prototype.equals = function(o1, o2) {
		return o1.value === o2.value;
	};
	arr = [ new C(1), new C('A') ];
	ok( arr.indexOf(new C('A')) === -1, "arr.indexOf(new C('A')) === 1" );

	ok( Array.prototype.indexOf.length === 1, "Method length" );
});

	
test( "Array.prototype.lastIndexOf", function(){
	
	ok( Array.prototype.lastIndexOf, "method existence veryfication" );
	
	var arr = ['a','b','c','b','d'];
	
	ok( arr.lastIndexOf('b') === 3, "arr.lastIndexOf('b')" );
	ok( arr.lastIndexOf('b',2) === 1, "arr.lastIndexOf('b',2)" );
	ok( arr.lastIndexOf('b',-2) === 3, "arr.lastIndexOf('b',-2)" );
	
	ok( arr.lastIndexOf('q') === -1, "arr.lastIndexOf('q')" );
	ok( arr.lastIndexOf('a', -10) === -1, "arr.lastIndexOf('a',-10)" );
	ok( arr.lastIndexOf('a', 100) === 0, "arr.lastIndexOf('a',100)" );

	arr = new Array;
	arr[4] = 'x';
	ok( arr.lastIndexOf(undefined) === -1, "arr.lastIndexOf(undefined)" );
	arr[3] = undefined;
	ok( arr.lastIndexOf(undefined) === 3, "arr.lastIndexOf(undefined)" );
	
	ok( Array.prototype.lastIndexOf.length === 1, "Method length" );
});	


test( "Array.prototype.every", function(){

	utils.arrayMethodTest("every");

    var arr = new Array(5);
	arr[1] = 2; arr[4] = 5;
	var len = 0;

	ok( [].every( function(){return true;} ) === true, "every on empty array" );
	ok( [].every( function(){return false;} ) === true, "every on empty array" );

	var fn = function(item, idx, arr) {
		idx < 20 && arr.push(0);
		++len;
		return true;
	};
	
	len = 0;
	ok( arr.every(fn) === true, "Array which pushes zero at the end for each iteration" );
	ok( len === 2, "len again"  );
	ok( arr.length === 7, "Array.lenght should be modified after" );
	
	arr.length = 5;
	fn = function(item, idx, arr) {
		arr[idx+1] = false;
		return item;
	};
	ok( arr.every(fn) === false, "");
	ok( utils.compareArrays(arr,[undefined,2,false,false,5]), "Array should be [undefined,2,false,false,5]) after last operation" );
});


test( "Array.prototype.some", function(){
	
	utils.arrayMethodTest("some");

    var arr = new Array(5);
	arr[1] = 2; arr[4] = 5;
	var len = 0;

    ok( arr.some( function(){ return ++len;} ) === true, "arr.some( function(){ return ++len;}" );
    ok( len === 1, "len" );
        
	ok( [].some( function(){return true;} ) === false, "some on empty array" );
	ok( [].some( function(){return false;} ) === false, "some on empty array" );

	var obj = { 
		data: true,
		test: function(){ return this.data; }
	};
	ok( arr.some(obj.test, obj) === true, "some with thisArg" );
	
    ok( Array.prototype.some.length === 1, "Method length" );
});


test( "Array.prototype.forEach", function(){
	utils.arrayMethodTest("forEach");
	ok( [1,2,3].forEach(function(){return 1;}) === undefined, "Result of forEach should be undefined" );
});


test( "Array.prototype.map", function(){
	utils.arrayMethodTest("map");
	
	var arr = [1,2,3,4];
	var map = arr.map(function(e){ return e+1; });
	ok( utils.compareArrays([2,3,4,5],map), "[1,2,3,4].map(function(e){ return e+1; }) should return [2,3,4,5]" );
});


test( "Array.prototype.filter", function(){
	utils.arrayMethodTest("filter");
	
	var arr = [1,2,3,4,5,6];
	var r = arr.filter( function(i){ return !(i%2);} );
	ok( utils.compareArrays(r, [2,4,6]), "arr.filter( function(i){ return !i%2;} ) should return [2,4,6]" );
});


test( "Array.prototype.reduce", function(){
	
	ok( Array.prototype.some, "method existence veryfication" );
	
	var arr = ['a','b'], i = 0;
	var res = arr.reduce(function(prv, curr, idx, a){
		if( i++ === 0) {
			ok(prv === 'a', "Iterator parameters test - first parameter should be 'a'");
			ok(curr === 'b', "Iterator parameters test - second parameter should be 'b'");
			ok(idx === 1, "Iterator parameters test - third parameter should be 1");
			ok(a === arr, "Iterator parameters test - fourth parameter should an array itself");
		}
	});
	ok( res === undefined, "Res should be undefined");
	
	ok( utils.assertError(function(){arr.reduce(123);}), "Reduce with non-function argument should throw an error" );
	
	ok( [42].reduce(function(){return 24;}) === 42, "Reduce on one-element array (without initial val) should return the element" );
	ok( utils.assertError( function(){[].reduce(function(){return 24;});} ), "Reduce on empty array (without initial val) should throw type error" );
	ok( [].reduce(function(){return 24;}, 42) === 42, "Reduce on empty array (with initial val) should return the initial value itself" );

	var arr = ['a','b','c','d'];
	res = arr.reduce( function(prv, curr){return prv+curr;} );
	ok( res === 'abcd', "['a','b','c','d'].reduce( function(prv, curr){return prv+curr;} ) should return 'abcd' string" );
	
	res = arr.reduce( function(prv, curr){return prv+curr;}, "0" );
	ok( res === '0abcd', "['a','b','c','d'].reduce( function(prv, curr){return prv+curr;}, '0' ) should return '0abcd' string" );
	
	arr = new Array(10);
	arr[4] = 42;
	ok( arr.reduce(function(){return 24;}) === 42, "Array with undefined elements. Reduce on one-element array (without initial val) should return the element" );
	ok( arr.reduce(function(){return 24;}, 0 ) === 24, "Array with undefined elements. Reduce on one-element array (without initial val) should return the element" );
	
	ok( utils.assertError( function(){new Array(10).reduce(function(){});} ), "Reduce on array without initialized elements should throw type error" );
});


test( "Array.prototype.reduceRight", function(){
	ok( Array.prototype.some, "method existence veryfication" );
	
	var arr = ['a','b'], i = 0;
	var res = arr.reduceRight(function(prv, curr, idx, a){
		if( i++ === 0) {
			ok(prv === 'b', "Iterator parameters test - first parameter should be 'b'");
			ok(curr === 'a', "Iterator parameters test - second parameter should be 'a'");
			ok(idx === 0, "Iterator parameters test - third parameter should be 0");
			ok(a === arr, "Iterator parameters test - fourth parameter should an array itself");
		}
	});
	ok( res === undefined, "Res should be undefined");
	
	ok( utils.assertError(function(){arr.reduceRight(123);}), "reduceRight with non-function argument should throw an error" );
	
	ok( [42].reduceRight(function(){return 24;}) === 42, "reduceRight on one-element array (without initial val) should return the element" );
	ok( utils.assertError( function(){[].reduceRight(function(){return 24;});} ), "reduceRight on empty array (without initial val) should throw type error" );
	ok( [].reduceRight(function(){return 24;}, 42) === 42, "reduceRight on empty array (with initial val) should return the initial value itself" );

	var arr = ['a','b','c','d'];
	res = arr.reduceRight( function(prv, curr){return prv+curr;} );
	ok( res === 'dcba', "['a','b','c','d'].reduceRight( function(prv, curr){return prv+curr;} ) should return 'abcd' string" );
	
	res = arr.reduceRight( function(prv, curr){return prv+curr;}, "0" );
	ok( res === '0dcba', "['a','b','c','d'].reduceRight( function(prv, curr){return prv+curr;}, '0' ) should return '0abcd' string" );
	
	arr = new Array(10);
	arr[4] = 42;
	ok( arr.reduceRight(function(){return 24;}) === 42, "Array with undefined elements. reduceRight on one-element array (without initial val) should return the element" );
	ok( arr.reduceRight(function(){return 24;}, 0 ) === 24, "Array with undefined elements. reduceRight on one-element array (without initial val) should return the element" );
	
	ok( utils.assertError( function(){new Array(10).reduceRight(function(){});} ), "reduceRight on array without initialized elements should throw type error" );
});


//-----------------------------------------------------------------
// Date.prototype and Date tests

test( "Date.prototype.toISOString", function(){
	ok( Date.prototype.toISOString, "method existence veryfication" );

	var d = new Date().toISOString();
	ok( d.length === 24 || d.length === 20, "ISO Date string should be 24 characters long" );
	ok( d.match(/^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/), "toISOString() result matches /^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/ pattern" );
	
	var zd = new Date(0).toISOString(); 
	ok( zd === '1970-01-01T00:00:00.000Z' || zd === '1970-01-01T00:00:00Z', "new Date(0).toISOString() should return '1970-01-01T00:00:00.000Z' or '1970-01-01T00:00:00Z'" );
	ok( new Date(Infinity).toISOString() === 'Invalid Date', "new Data(Infinity).toISOString() should return 'Invalid Date'" );
	ok( new Date(NaN).toISOString() === 'Invalid Date', "new Data(NaN).toISOString() should return 'Invalid Date'" );
});


test( "Date.prototype.toJSON", function() {
	ok( Date.prototype.toJSON, "method existence verification" );
	ok( typeof Date.prototype.toJSON === 'function', "Date.prototype.toJSON should be a function" );
	
	var d = new Date().toJSON();
	ok( d.length === 24 || d.length === 20, "ISO Date string should be 24 characters long" );
	ok( d.match(/^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/), "toJSON() result matches /^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/ pattern" );
	
	var zd = new Date(0).toJSON(); 
	ok( zd === '1970-01-01T00:00:00.000Z' || zd === '1970-01-01T00:00:00Z', "new Date(0).toJSON() should return '1970-01-01T00:00:00.000Z' or '1970-01-01T00:00:00Z'" );
	
	// most of the browsers gives error here ("Invalid date") which is not right according to ECMAScript 5 Specification
	ok( new Date(Infinity).toJSON() === null, "new Data(Infinity).toJSON() should be null" );
	// most of the browsers gives error here ("Invalid date") which is not right according to ECMAScript 5 Specification
	ok( new Date(NaN).toJSON() === null, "new Data(NaN).toJSON() should be null" );
	
	// most of the browser won't allow to use other types than Date here
	ok( new Date(0).toJSON.call('abc') === null, "new Date(0).toJSON.call('abc') should be null" ); 
});


test( "Date.now", function() {
	ok( Date.now, "method existence veryfication" );
	ok( typeof Date.now === 'function', "Date.now should be a function" );
	
	var now = Date.now(), date = new Date().getTime();
	ok( typeof now === 'number', "type of Date.now result should be a number" );
	ok( now - date < 1000, "Date.now() and new Date().getTime() should be equal" );
});


