/*  ddr-ECMA5 JavaScript library, version 1.0RC1
 *  (c) 2010 David de Rosier
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Revision: 7
 *  Date: 09.03.2010
 */

"use strict";

(function(){

	//-----------------------------------------------------------------------
	// Function.prototype extensions
	
	/**
	 * Binds the function to a context and returns a wrapper function.
	 * Practically it 'converts' a method to a functions with remembering 
	 * the context.
	 * ECMA5 Reference: 15.3.4.5
	 * @param ctx {object} method's context
	 * @return {function} wrapped function
	 * @example var flatFunction = obj.method.bind(obj);
	 */
	Function.prototype.bind || (Function.prototype.bind = function(ctx){
		if( typeof this !== 'function' )
			throw _typeError( "'this' is not a function" );
		var fn = this, 
			args = _toArray(arguments,1);
			
		return function() {
			return fn.apply( ctx, args.concat(_toArray(arguments)) );
		};
	});

	
	//-----------------------------------------------------------------------
	// Object extensions
	
	/**
	 * Returns an array of object's own property names.
	 * ECMA5 Reference: 15.2.3.14
	 * @param obj {object} 
	 * @return {Array} array of own property names
	 * @throws TypeError if the parameter is not an object
	 * @example Object.keys({a:5}); // should return ["a"] 
	 */	 
	Object.keys || (Object.keys = function(obj){
		if( !_isObject(obj) ) 
			throw _typeError( obj + " is not an object" );
		
		var results = [];
		for(var key in obj) {
			obj.hasOwnProperty(key) && results.push(key);
		}
		return results;
	});
	
	
	/**
	 * Returns a prototype of an object. In this implementation the method tries to
	 * use __proto__ attribute (for Spider/Trace-Monkey and Rhino) or constructor.prototype
	 * reference which won't work for the overriden constructor property
	 * ECMA5 Reference: 15.2.3.2
	 * @param obj {object} 
	 * @return {object} Object's prototype
	 * @example Object.getPrototypeOf([]) === Array.prototype;
	 */
	if( !Object.getPrototypeOf ) {
		if( "".__proto__ ) {
			Object.getPrototypeOf = function(obj) {
				if( !_isObject(obj) ) 
					throw _typeError( obj + " is not an object" );
				return obj.__proto__;
			};
		} else {
			Object.getPrototypeOf = function(obj) {
				if( !_isObject(obj) ) 
					throw _typeError( obj + " is not an object" );
				return obj.constructor ? obj.constructor.prototype : null;
			};
		}
	}
	
	
	/**
	 * Creates a new object with given prototype. The function creates a new constructor and assigns
	 * its prototype to given parameter. Function returns an instance of such created object.
	 * WARNING! The original ECMA 5 method takes an optional parameter - property descriptions.
	 * Cause property descriptions cannot be implemented with ECMA 3, this parameter will be skipped. 
	 * ECMA5 Reference: 15.2.3.5
	 * @param proto {object} a prototype of new object
	 * @param properties {object} property descriptions - UNUSED in this implementation!
	 * @return new object with given prototype
	 * @example var newMe = Object.create( {me: 'test'} );
	 */
	Object.create || ( Object.create = function(proto, properties) {
		if( !_isObject(proto) ) 
			throw _typeError( proto + " is not an object" );
		
		var F = function(){};
		F.prototype = proto;
		F.prototype.constructor = F;
		
		return new F();
	});
	
	
	//-----------------------------------------------------------------------
	// String extensions
	
	/**
	 * Trims left and right side of the string. Method removes spaces, tabulators
	 * and new line characters.
	 * Method implements probably the fastest algorithm of JavaScript trim operation
	 * (see http://blog.stevenlevithan.com/archives/faster-trim-javascript)
	 * ECMA5 Reference: 15.5.4.20
	 * return {string} trimmed string
	 */
	String.prototype.trim || (String.prototype.trim = function(){
		return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	});
	
	
	//-----------------------------------------------------------------------
	// Array extensions	

	
	var $AP = Array.prototype;
	
	/**
	 * ECMA5 Reference: 15.4.4.14
	 * According to specification Array.prototype.indexOf.length is 1
	 * @param searchElement - 
	 * @param fromIndex {number} - start index (optional)
	 * @return {number} index of found element or -1
	 * @example ['a','b','c'].indexOf('b') === 1;
	 */
	$AP.indexOf || ($AP.indexOf = function(searchElement){
		var len = this.length,
			i = +arguments[1] || 0; // fromIndex
		
		if( len === 0 || isNaN(i) || i >= len )
			return -1;
		
		if( i < 0 ) {
			i = len + i;
			i < 0 && (i = 0);
		}
		
		for( ; i < len; ++i ) {
			if( this[i] ===  searchElement )
				return i;
		}
		
		return -1;
	});

	
	/**
	 * ECMA5 Reference: 15.4.4.15
	 * According to specification Array.prototype.lastIndexOf.length is 1
	 * @param searchElement -
	 * @param fromIndex {number} - start index (optional)
	 * @return {number} index of found element or -1
	 * @example ['a','b','c'].indexOf('b') === 1;
	 */
	$AP.lastIndexOf || ($AP.lastIndexOf = function(searchElement){
		var len = this.length,
	        i = +arguments[1] || len-1; // fromIndex
		
		if( len === 0 || isNaN(i) )
			return -1;
		
		if( i < 0 ) {
			i = len + i;
		} else if( i >= len ){
			i = len-1;
		}
		
		for( ; i >= 0; --i ) {
			if( this[i] ===  searchElement )
				return i;
		}
		
		return -1;
	});
	

	/**
	 * ECMA5 Reference: 15.4.4.16
	 */
	$AP.every || ($AP.every = function(callback){
		if( typeof callback !== 'function' )
			throw _typeError( callback + " is not a function" );

		var thisArg = arguments[1]; 
		for(var i=0, len=this.length; i < len; ++i) {
			if( this.hasOwnProperty(String(i)) ) {
				if( !callback.call(thisArg, this[i], i, this) )
					return false;
			}
		}

		return true;
	});	
	
	
	/**
	 * ECMA5 Reference: 15.4.4.17
	 */
	$AP.some || ($AP.some = function(callback){
		if( typeof callback !== 'function' )
			throw _typeError( callback + " is not a function" );

		var thisArg = arguments[1]; 
		for(var i=0, len=this.length; i < len; ++i) {
			if( this.hasOwnProperty(String(i)) ) {
				if( callback.call(thisArg, this[i], i, this) )
					return true;
			}
		}		
		
		return false;
	});
	

	/**
	 * ECMA5 Reference: 15.4.4.18
	 */
	$AP.forEach || ($AP.forEach = function(callback){
		if( typeof callback !== 'function' )
			throw _typeError( callback + " is not a function" );

		var thisArg = arguments[1]; 
		for(var i=0, len=this.length; i < len; ++i) {
			if( this.hasOwnProperty(String(i)) ) {
				callback.call(thisArg, this[i], i, this);
			}
		}		
	});


	/**
	 * ECMA5 Reference: 15.4.4.19
	 */
	$AP.map || ($AP.map = function(callback){
		if( typeof callback !== 'function' )
			throw _typeError( callback + " is not a function" );

		var thisArg = arguments[1],
			len = this.length,
			results = new Array(len);
		for(var i=0; i < len; ++i) {
			if( this.hasOwnProperty(String(i)) ) {
				results[i] = callback.call(thisArg, this[i], i, this);
			}
		}
		
		return results;
	});
	
	
	/**
	 * ECMA5 Reference: 15.4.4.20
	 */
	$AP.filter || ($AP.filter = function(callback){
		if( typeof callback !== 'function' )
			throw _typeError( callback + " is not a function" );

		var thisArg = arguments[1],
			len = this.length,
			results = [];
		for(var i=0; i < len; ++i) {
			if( this.hasOwnProperty(String(i)) ) {
				callback.call(thisArg, this[i], i, this) && results.push( this[i] );
			}
		}
		
		return results;
	});
	
	
	/**
	 * ECMA5 Reference: 15.4.4.21
	 */
	$AP.reduce || ($AP.reduce = function(callback){
		if( typeof callback !== 'function' )
			throw _typeError( callback + " is not a function" );
		
		var len = this.length;
		if( len === 0 && arguments.length < 2 )
			throw _typeError( "reduce of empty array with no initial value" );
		
		var initIdx = -1;
		if( arguments.length < 2 ) {
			for( var k=0; k < len; ++k ) {
				if( this.hasOwnProperty(String(k)) ) {
					initIdx = k;
					break;
				}
			}
			if( initIdx === -1 )
				throw _typeError( "reduce of empty array with no initial value" );				
		}
		
		var val = arguments.length > 1 ? arguments[1] : this[initIdx];
		
		for(var i=initIdx+1; i < len; ++i) {
			if( this.hasOwnProperty(String(i)) ) {
				val = callback(val, this[i], i, this);
			}
		}
		
		return val;
	});	
	
	
	/**
	 * ECMA5 Reference: 15.4.4.22
	 */
	$AP.reduceRight || ($AP.reduceRight = function(callback){
		if( typeof callback !== 'function' )
			throw _typeError( callback + " is not a function" );
		
		var len = this.length;
		if( len === 0 && arguments.length < 2 )
			throw _typeError( "reduce of empty array with no initial value" );
		
		var initIdx = len;
		if( arguments.length < 2 ) {
			for( var k=len-1; k >=0; --k ) {
				if( this.hasOwnProperty(String(k)) ) {
					initIdx = k;
					break;
				}
			}
			if( initIdx === len )
				throw _typeError( "reduce of empty array with no initial value" );				
		}		
		
		var val = arguments.length > 1 ? arguments[1] : this[initIdx];
		
		for(var i=initIdx-1; i >= 0; --i) {
			if( this.hasOwnProperty(String(i)) ) {
				val = callback(val, this[i], i, this);
			}
		}
		
		return val;
	});		
	
	
	//-----------------------------------------------------------------------
	// Date.prototype and Date object extensions
	
	
	/**
	 * Numeric representation of current time
	 * @example var timestamp = Date.now();
	 * ECMA5 Reference: 15.9.4.4
	 */
	Date.now || (Date.now = function(){
		return +new Date;
	});

	
	/**
	 * ECMA5 Reference: 15.9.5.43
	 */
	Date.prototype.toISOString || (Date.prototype.toISOString = (function(){
		
		var str = function(n, l) {
			var str = String(n),
				len = l || 2;
			while( str.length < len )
				str = '0' + str;
			return str;
		};
		
		return function(){
				return isFinite( this.getTime() )
					? String(this.getUTCFullYear()).concat( '-', 
						str(this.getUTCMonth() + 1), "-",
						str(this.getUTCDate()), "T",
						str(this.getUTCHours()), ":",
						str(this.getUTCMinutes()), ":",
						str(this.getUTCSeconds()), ".",
				                str(this.getUTCMilliseconds(),3), "Z" )
			                : 'Invalid Date';
			};
		
	})() );
	
	
	/**
	 * ECMA5 Reference: 15.9.5.44
	 */
	Date.prototype.toJSON || (Date.prototype.toJSON = function(key){ 
		if( !isFinite(this) ) 
			return null;
		if( !this.toISOString )
			throw _typeError( "Date.prototype.toJSON called on incompatible " + (typeof this) );
		
		return this.toISOString();
	});
	
	
	//-----------------------------------------------------------------------
	// Private Utils

	var _toArray = function(obj, idx1, idx2) {
		var args = $AP.slice.call( arguments, 1);
		return $AP.slice.apply( obj, args );
	};
	
	var _isObject = function(obj) {
		return obj && ( typeof obj === 'object' || typeof obj === 'function' );
	};

	var _typeError = function(msg) {
		return new TypeError( "Type error: " + msg);
	};
	
})();
