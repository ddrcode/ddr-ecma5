/*  ddr-ECMA5 JavaScript library, version 1.2RC3
 *  (c) 2010 David de Rosier
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Revision: 16
 *  Date: 15.07.2011
 */


(function(){

	"use strict";

	//-----------------------------------------------------------------------
	// Function.prototype extensions
	
	/**
	 * Binds the function to a context and returns a wrapper function.
	 * Practically it 'converts' a method to a function with remembering 
	 * the context.
	 * ECMAScript 5 Reference: 15.3.4.5
	 * @param ctx {object} method's context
	 * @returns {function} wrapped function
	 * @example var flatFunction = obj.method.bind(obj);
	 */
	Function.prototype.bind || (Function.prototype.bind = function(ctx){
		if( typeof this !== 'function' )
			throw new TypeError( "'this' is not a function" );
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
	 * ECMAScript 5 Reference: 15.2.3.14
	 * @param obj {object} 
	 * @returns {Array} array of own property names
	 * @throws TypeError if the parameter is not an object
	 * @example Object.keys({a:5}); // should return ["a"] 
	 */	 
	Object.keys || (Object.keys = function(obj){
		if( !_isObject(obj) ) 
			throw new TypeError( obj + " is not an object" );
		
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
	 * ECMAScript 5 Reference: 15.2.3.2
	 * @param obj {object} 
	 * @returns {object} Object's prototype
	 * @example Object.getPrototypeOf([]) === Array.prototype;
	 */
	if( !Object.getPrototypeOf ) {
		if( "".__proto__ ) {
			Object.getPrototypeOf = function(obj) {
				if( !_isObject(obj) ) 
					throw new TypeError( obj + " is not an object" );
				return obj.__proto__;
			};
		} else {
			Object.getPrototypeOf = function(obj) {
				if( !_isObject(obj) ) 
					throw new TypeError( obj + " is not an object" );
				return obj.constructor ? obj.constructor.prototype : null;
			};
		}
	}
	
	
	/**
	 * Creates a new object with given prototype. The function creates a new constructor and assigns
	 * its prototype to given parameter. Function returns an instance of such created object.
	 * 
	 * WARNING! When function called with second parameter it internally invokes Object.defineProperties method.
	 * The implementation of this method provided in this library is not 100% valid with ECMAScript 5 specification
	 * due to some limitations in ECMASCript 3. So in consequence also Object.create suffers from
	 * limited functionality. For more details see description of Object.defineProperties method.
	 * 
	 * ECMAScript 5 Reference: 15.2.3.5
	 * @param {object} proto a prototype of new object
	 * @param {object} [properties] property descriptions - UNUSED in this implementation!
	 * @returns new object with given prototype
	 * @throws {TypeError} when proto is not an object
	 * @example var newMe = Object.create( {me: 'test'} );
	 * @see Object#defineProperties
	 */
	Object.create || ( Object.create = (function(){

		/**
		 * Moved outside the function to eliminate the closure memory effect
		 * @private
		 */
		var __TmpConstructor = function(){};
		
		return function(proto, properties) {
			if( !_isObject(proto) ) 
				throw new TypeError( proto + " is not an object" );
			
			__TmpConstructor.prototype = proto;
			var obj = new __TmpConstructor();
			
			properties && Object.defineProperties( obj, properties );
			
			return obj;
		};
	})());


	/**
	 * ECMAScript 5 Reference: 15.2.3.11
	 * @param {object} 
	 * @returns {boolean} 
	 */
	Object.isSealed || ( Object.isSealed = function(obj){ 
		if( !_isObject(obj) ) 
			throw new TypeError( obj+" is not an object" );
		return false; 
	});
	
	
	/**
	 * ECMAScript 5 Reference: 15.2.3.12
	 * @param {object} 
	 * @returns {boolean} 
	 */	
	Object.isFrozen || ( Object.isFrozen = function(obj){
		if( !_isObject(obj) ) 
			throw new TypeError( obj+" is not an object" );
		return false; 		
	});
	
	
	/**
	 * Checks whether the object structure can be extended.
	 * ECMAScript 5 Reference: 15.2.3.13
	 * @param {object} 
	 * @returns {boolean} 
	 */
	Object.isExtensible || ( Object.isExtensible = function(obj){ 
		if( !_isObject(obj) ) 
			throw new TypeError( obj+" is not an object" );
		return true; 
	});	
	
	
	/**
	 * Returns property descriptor for property of given object
	 * ECMAScript 5 Reference: 15.2.3.3
	 * @since 1.2
	 * @param {object} obj an object
	 * @param {string} pname property name to test
	 * @returns {object} property descriptor or undefined
	 * @throws {TypeError} when obj is null or not an object
	 * @example Object.getOwnPropertyDescriptor(Array.prototype, "length");
	 */
	Object.getOwnPropertyDescriptor || ( Object.getOwnPropertyDescriptor = (function(){
		
		var __NUMBER_CONSTS = ['MAX_VALUE', 'MIN_VALUE','NaN','POSITIVE_INFINITY','NEGATIVE_INFINITY'],
			__MATH_CONSTS = ['PI','E','LN2','LOG2E','LOG10E','SQRT1_2','SQRT2'];
		
		return function(obj, pname){
			if( !_isObject(obj) ) 
				throw new TypeError( obj+" is not an object" );
			
			if( !(pname in obj) )
				return;
			
			var editable = true,
				configurable = true;
			
			// recognize the only cases when ECMAScript 3 protects properties
			if( (obj===Number && __NUMBER_CONSTS.indexOf(pname)>=0) 
					|| (obj===Math && __MATH_CONSTS.indexOf(pname)>=0) 
					|| (pname=='length' && (obj===String.prototype || obj instanceof String 
							|| obj===Function.prototype || obj instanceof Function)) ) {
				editable = false;
				configurable = false;
			} else if( pname=='length' && (obj===Array.prototype || Array.isArray(obj)) ) {
				configurable = false;
			} 
			
			return {
				writable: editable,
				enumerable: obj.propertyIsEnumerable ? obj.propertyIsEnumerable(pname) : true,
				configurable: configurable,
				value: obj[pname]
			};
		};
	})());	
	
	
	// Object.defineProperty and Object.defineProperties implementation
	(!Object.defineProperty || !Object.defineProperties) && (function(){
			
		/**
		 * @private
		 */
		var __applyDefaults = function(desc, defaultValue, value) {
			if(desc.hasOwnProperty("get") || desc.hasOwnProperty("set")) {
				throw new TypeError( "Getters and setters are not supported by this ECMAScript engine" );
			} else {
				desc.writable = desc.hasOwnProperty('writable') ? desc.writable : defaultValue;
				desc.value = desc.hasOwnProperty('value') ? desc.value : value;
			}
			
			desc.enumerable = desc.hasOwnProperty('enumerable') ? desc.enumerable : defaultValue;
			desc.configurable = desc.hasOwnProperty('configurable') ? desc.configurable : defaultValue;
			
			var t = null;
			if( (!desc[t="configurable"]) || (!desc[t="enumerable"]) || (!desc[t="writable"]) ) {
				throw new TypeError( "Property '".concat(t,"' cannot be set to false in this version of ECMAScript engine") );
			}		

			return desc;				
		};
		
	
		if( !Object.defineProperty ) {

			/**
			 * ECMAScript 5 Reference: 15.2.3.6
			 */
			Object.defineProperty = function(obj, property, descriptor){
				if( !_isObject(obj) ) 
					throw new TypeError( obj+" is not an object" );
				
				var pname = String(property);
				var desc = __toPropertyDescriptor(descriptor);
				desc = __applyDefaults( desc, obj.hasOwnProperty(pname), obj[pname] );
				
				obj[pname] = desc.value;
				
				return obj;
			};
			
			Object.defineProperty.DDRECMA5 = true;
		}
		
		
		if( !Object.defineProperties ) {
		
			/**
			 * ECMAScript 5 Reference: 15.2.3.6
			 */
			Object.defineProperties=function(obj, properties){
				if( !_isObject(obj) ) 
					throw new TypeError( obj+" is not an object" );
				
				var properties = Object( properties );
				var descriptors = {};
				for( var key in properties ) {
					if( properties.hasOwnProperty(key) ){
						var desc = __toPropertyDescriptor(properties[key]);
						descriptors[key] = __applyDefaults( desc, obj.hasOwnProperty(key), obj[key] );
					}
				}
				
				// when there are no error in property descriptors we can apply changes to the object
				for( key in descriptors ) {
					if( properties.hasOwnProperty(key) ){
						obj[key] = descriptors[key].value;
					}
				}
				
				return obj;
			};
		
			Object.defineProperties.DDRECMA5 = true;
		}

	})();
	
	
	//-----------------------------------------------------------------------
	// String extensions
	
	/**
	 * Trims left and right side of the string. Method removes spaces, tabulators
	 * and new line characters.
	 * Method implements probably the fastest algorithm of JavaScript trim operation
	 * (see http://blog.stevenlevithan.com/archives/faster-trim-javascript)
	 * ECMAScript 5 Reference: 15.5.4.20
	 * @returns {string} trimmed string
	 */
	String.prototype.trim || (String.prototype.trim = function(){
		return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
	});
	
	
	//-----------------------------------------------------------------------
	// Array extensions	
	
	/**
	 *  ECMAScript 5 Reference: 15.4.3.2
	 *  Tests if passed object is an Array
	 *  @since 1.0.1, revision 9 (thanks to dudleyflanders)
	 *  @param obj object to be tested
	 *  @returns {boolean} true if input parameter is an object false in any other case
	 *  @example Array.isArray([]) === true;
	 */
	Array.isArray || (Array.isArray = function(obj) {
		return Object.prototype.toString.call(obj) === "[object Array]" || (obj instanceof Array);
	});	
	
	
	//-----------------------------------------------------------------------
	// Array prototype extensions		

	var $AP = Array.prototype;
	
	/**
	 * ECMAScript 5 Reference: 15.4.4.14
	 * According to specification Array.prototype.indexOf.length is 1
	 * @param searchElement - 
	 * @param fromIndex {number} - start index (optional)
	 * @returns {number} index of found element or -1
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
			if( this.hasOwnProperty(String(i)) && this[i] ===  searchElement )
				return i;
		}
		
		return -1;
	});

	
	/**
	 * ECMAScript 5 Reference: 15.4.4.15
	 * According to specification Array.prototype.lastIndexOf.length is 1
	 * @param searchElement -
	 * @param fromIndex {number} - start index (optional)
	 * @returns {number} index of found element or -1
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
			if( this.hasOwnProperty(String(i)) && this[i] ===  searchElement )
				return i;
		}
		
		return -1;
	});
	

	/**
	 * ECMAScript 5 Reference: 15.4.4.16
	 */
	$AP.every || ($AP.every = function(callback){
		if( typeof callback !== 'function' )
			throw new TypeError( callback + " is not a function" );

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
	 * ECMAScript 5 Reference: 15.4.4.17
	 */
	$AP.some || ($AP.some = function(callback){
		if( typeof callback !== 'function' )
			throw new TypeError( callback + " is not a function" );

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
	 * ECMAScript 5 Reference: 15.4.4.18
	 */
	$AP.forEach || ($AP.forEach = function(callback){
		if( typeof callback !== 'function' )
			throw new TypeError( callback + " is not a function" );

		var thisArg = arguments[1]; 
		for(var i=0, len=this.length; i < len; ++i) {
			if( this.hasOwnProperty(String(i)) ) {
				callback.call(thisArg, this[i], i, this);
			}
		}		
	});


	/**
	 * ECMAScript 5 Reference: 15.4.4.19
	 */
	$AP.map || ($AP.map = function(callback){
		if( typeof callback !== 'function' )
			throw new TypeError( callback + " is not a function" );

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
	 * ECMAScript 5 Reference: 15.4.4.20
	 */
	$AP.filter || ($AP.filter = function(callback){
		if( typeof callback !== 'function' )
			throw new TypeError( callback + " is not a function" );

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
	 * ECMAScript 5 Reference: 15.4.4.21
	 */
	$AP.reduce || ($AP.reduce = function(callback){
		if( typeof callback !== 'function' )
			throw new TypeError( callback + " is not a function" );
		
		var len = this.length;
		if( len === 0 && arguments.length < 2 )
			throw new TypeError( "reduce of empty array with no initial value" );
		
		var initIdx = -1;
		if( arguments.length < 2 ) {
			if( (initIdx = _firstIndex(this)) === -1 )
				throw new TypeError( "reduce of empty array with no initial value" );				
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
	 * Works like Array.prototype.reduce, but starts from the end of an array
	 * @param {callable} callback function
	 * @returns {any} value of reduce; single value
	 * @see Array.prototype.reduce
	 * @example [10,20,30].reduceRight(function(a,b){return a-b;}) === 0
	 * ECMAScript 5 Reference: 15.4.4.22
	 */
	$AP.reduceRight || ($AP.reduceRight = function(callback){
		if( typeof callback !== 'function' )
			throw new TypeError( callback + " is not a function" );
		
		var len = this.length;
		if( len === 0 && arguments.length < 2 )
			throw new TypeError( "reduce of empty array with no initial value" );
		
		var initIdx = len;
		if( arguments.length < 2 ) {
			for( var k=len-1; k >=0; --k ) {
				if( this.hasOwnProperty(String(k)) ) {
					initIdx = k;
					break;
				}
			}
			if( initIdx === len )
				throw new TypeError( "reduce of empty array with no initial value" );				
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
	 * Numeric representation of current time (in milliseconds)
	 * @example var timestamp = Date.now();
	 * ECMAScript 5 Reference: 15.9.4.4
	 */
	Date.now || (Date.now = function(){
		return +new Date;
	});

	
	/**
	 * ECMAScript 5 Reference: 15.9.5.43
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
	 * ECMAScript 5 Reference: 15.9.5.44
	 */
	Date.prototype.toJSON || (Date.prototype.toJSON = function(key){ 
		if( !isFinite(this) ) 
			return null;
		if( !this.toISOString || typeof this.toISOString !== 'function' )
			throw new TypeError( "Date.prototype.toJSON called on incompatible " + (typeof this) );
		
		return this.toISOString();
	});
	
	
	//-----------------------------------------------------------------------
	// Private Utils

	/**
	 * @private
	 */
	var _toArray = function(obj, idx1, idx2) {
		var args = $AP.slice.call( arguments, 1 );
		return $AP.slice.apply( obj, args );
	};
	
	/**
	 * Check whether passed argument is an object (considering the fact that function is an object too)
	 * @private
	 */
	var _isObject = function(obj) {
		return obj && ( typeof obj === 'object' || typeof obj === 'function' );
	};
	
	/**
	 * Returns first valid index of an array
	 * @private
	 */
	var _firstIndex = function(arr) {
		for( var k=0, len=arr.length; k < len; ++k ) {
			if( arr.hasOwnProperty(String(k)) ) {
				return k;
			}
		}	
		return -1;
	};
	
	/**
	 * Implementation of inner ECMAScript 5 method ToPropertyDescriptor.
	 * ECMAScript 5 reference: 8.10.5
	 * @private
	 * @param {object} obj preperty object
	 * @return {object} property descriptor
	 */
	var __toPropertyDescriptor = function(obj){
		if( !obj || typeof obj !== 'object' )
			throw new TypeError( obj+" is not an object" );
		
		var desc = {};
		obj.hasOwnProperty("enumerable") && ( desc.enumerable = !!obj.enumerable );
		obj.hasOwnProperty("configurable") && ( desc.configurable = !!obj.configurable );
		obj.hasOwnProperty("writable") && ( desc.writable = !!obj.writable );
		obj.hasOwnProperty("value") && ( desc.value = obj.value );
		
		if( obj.hasOwnProperty("get") ) {
			if( !__isCallable(obj.get) && typeof obj.get !== 'undefined' )
				throw new TypeError( "Getter must be a callable object" );
			desc.get = obj.get;
		}
		
		if( obj.hasOwnProperty("set") ) {
			if( !__isCallable(obj.set) && typeof obj.set !== 'undefined' )
				throw new TypeError( "Setter must be a callable object" );
			desc.set = obj.set;
		}		
		
		if( (desc.hasOwnProperty("get") || desc.hasOwnProperty("set")) 
				&& (desc.hasOwnProperty("writable") || desc.hasOwnProperty("value")) ) {
			throw new TypeError("Invalid property. A property cannot both have accessors and be writable or have a value");
		}

		return desc;		
	};
	
	
	/**
	 * Implementation of internal ECMAScript function IsCallable
	 * ECMAScript 5 reference: 9.11
	 * @param {object} obj An object to examine
	 * @returns {boolean} true if object is callable false otherwise
	 */
	var __isCallable = function(obj){
		if( typeof obj === 'function' )
			return true;
		if( typeof obj !== 'object' ) 
			return false;
		if( obj instanceof Function || obj instanceof RegExp )
			return true;
		try {
			[].sort(obj);
			return true;
		} catch(ex){}
		return false;
	};

})();
