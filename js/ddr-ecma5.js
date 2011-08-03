/*  
 *  ddr-ECMA5 JavaScript library, version 1.2.1
 *  (c) 2010 David de Rosier
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license.php
 *
 *  Revision: 25
 *  Date: 04.08.2011
 */


(function(global, undefined){

	"use strict";
	
	/**
	 * Checks features of the JavaScript engine 
	 * @private
	 */
	var __features = {
			STRING_INDEX_ENUMERABLE: "abc".propertyIsEnumerable("1"),
			ACCESSORS: Object.prototype.__defineGetter__ && Object.prototype.__defineSetter__,
			DOM: typeof window === 'object' && typeof document === 'object'
		};

	
	/**
	 * Safe equivalent of Object.prototype.propertyIsEnumerable. The original method 
	 * is not available on older versions of IE for global object (same as hasOwnProperty)
	 * @private 
	 */
	var __propertyIsEnumerable = function(obj, property) {
		if( obj.propertyIsEnumerable ) {
			return obj.propertyIsEnumerable(property);
		}
		for(var key in obj) {
			if( key === property && (obj.hasOwnProperty ? obj.hasOwnProperty(property) : true) ){
				return true;
			}
		}
		return false;
	};
	

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
			args = __toArray(arguments,1);
			
		return function() {
			return fn.apply( ctx, args.concat(__toArray(arguments)) );
		};
	});

	
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
	 * If given callback returns true for all elements of the array, the method
	 * itself returns true as well; false otherwise. 
	 * ECMAScript 5 Reference: 15.4.4.16
	 * @param {function} callback a callback
	 * @returns {boolean} true when callback returns true for all elements of 
	 * 			the array; false otherwise 
	 * @throws {TypeError} when callback is not callable object
	 * @see Array.prototype.some
	 * @example var allEven = array.every(function(el){
	 * 				return !(el & 1);
	 * 			});
	 */
	$AP.every || ($AP.every = function(callback){
		if( !__isCallable(callback) )
			throw new TypeError( callback + " is not a callable object" );

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
	 * When callback returns true for at least one element of the array, then
	 * the Array.prototype.some method returns true as well; false otherwise.
	 * ECMAScript 5 Reference: 15.4.4.17
	 * @param {function} callback a callback
	 * @returns {boolean} true when the callback returns true for at least one
	 * 			array element
	 * @throws {TypeError} when callback is not callable object
	 * @see Array.prototype.every
	 * @example var containsNull = array.some(function(el){ return el===null });
	 */
	$AP.some || ($AP.some = function(callback){
		if( !__isCallable(callback) )
			throw new TypeError( callback + " is not a callable object" );

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
	 * Invokes given callback function for each element of an array.
	 * ECMAScript 5 Reference: 15.4.4.18
	 * @param {function} callback a callback
	 * @throws {TypeError} when callback is not callable object
	 * @example [1,2,3].forEach(function(el){ console.log(el); });
	 */
	$AP.forEach || ($AP.forEach = function(callback){
		if( !__isCallable(callback) )
			throw new TypeError( callback + " is not a callable object" );

		var thisArg = arguments[1]; 
		for(var i=0, len=this.length; i < len; ++i) {
			if( this.hasOwnProperty(String(i)) ) {
				callback.call(thisArg, this[i], i, this);
			}
		}		
	});


	/**
	 * Invokes the callback for each element of an array and return the
	 * array of callback results. The result array has the same length as 
	 * input array.  
	 * ECMAScript 5 Reference: 15.4.4.19
	 * @param {function} callback a callback
	 * @returns {Array} array of callback results
	 * @throws {TypeError} when callback is not a callable object
	 * @example var squares = [1,2,3].map(function(n){return n*n;});
	 */
	$AP.map || ($AP.map = function(callback){
		if( !__isCallable(callback) )
			throw new TypeError( callback + " is not a callable object" );

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
	 * Invokes callback for each element of an array (starting from first one)
	 * and returns array of those elements for which the callback returned true.
	 * ECMAScript 5 Reference: 15.4.4.20
	 * @param {function} callback a callback
	 * @return {Array} an array of results
	 * @throws {TypeError} when callback is not callable object
	 * @example var odds = [1,2,3,4].filter(function(n){return n & 1; });
	 */
	$AP.filter || ($AP.filter = function(callback){
		if( !__isCallable(callback) )
			throw new TypeError( callback + " is not a callable object" );

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
	 * Reduces an array to a single value. The callback is executed for each
	 * element of an array starting from the first one. First argument of the
	 * callback takes the result of previous callback invocation. For the first 
	 * invocation either first element of an array is taken or the last (optional)
	 * argument of the reduce method.
	 * ECMAScript 5 Reference: 15.4.4.21
	 * @param {function} callback a callback object
	 * @returns {any} value of reduce algorithm; single value
	 * @throws {TypeError} when callback is not a callable object
	 * @see Array.prototype.reduceRight
	 * @example var sum=[1,2,3].reduce(function(s,v){return s+v;}); 
	 */
	$AP.reduce || ($AP.reduce = function(callback){
		if( !__isCallable(callback) )
			throw new TypeError( callback + " is not a callable object" );
		
		var len = this.length;
		if( len === 0 && arguments.length < 2 )
			throw new TypeError( "reduce of empty array with no initial value" );
		
		var initIdx = -1;
		if( arguments.length < 2 ) {
			if( (initIdx = __firstIndex(this)) === -1 )
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
	 * Works like Array.prototype.reduce, but starts from the end of an array.
	 * ECMAScript 5 Reference: 15.4.4.22
	 * @param {callable} callback function
	 * @returns {any} value of reduce; single value
	 * @throws {TypeError} when callback is not a callable object
	 * @see Array.prototype.reduce
	 * @example [10,20,30].reduceRight(function(a,b){return a-b;}) === 0
	 */
	$AP.reduceRight || ($AP.reduceRight = function(callback){
		if( !__isCallable(callback) )
			throw new TypeError( callback + " is not a callable object" );
		
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
	 * @returns {number} 
	 * @example var timestamp = Date.now();
	 * ECMAScript 5 Reference: 15.9.4.4
	 */
	Date.now || (Date.now = function(){
		return +new Date;
	});

	
	/**
	 * ECMAScript 5 Reference: 15.9.5.43
	 * @returns {string}
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
	// Object extensions
	
	
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
				if( !__isObject(obj) ) 
					throw new TypeError( obj + " is not an object" );
				return obj.__proto__;
			};
		} else {
			Object.getPrototypeOf = function(obj) {
				if( !__isObject(obj) ) 
					throw new TypeError( obj + " is not an object" );
				return obj.constructor ? obj.constructor.prototype : null;
			};
		}
	}
	
	
	/**
	 * Creates a new object with given prototype. The constructor of new object will point to its
	 * prototype constructor. 
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
			if( !__isObject(proto) ) 
				throw new TypeError( proto + " is not an object" );
			
			__TmpConstructor.prototype = proto;
			var obj = new __TmpConstructor();
			
			properties && Object.defineProperties( obj, properties );
			
			return obj;
		};
	})());


	/**
	 * Checks whather the object structure is sealed with Object.seal or Object.freeze
	 * methods. Because the implementation of these methods is impossible in ECMAScript 3,
	 * this method always returns false.
	 * ECMAScript 5 Reference: 15.2.3.11
	 * @param {object} obj an object to examine
	 * @returns {boolean} always false
	 * @throws {TypeError} when obj is not an object
	 */
	Object.isSealed || ( Object.isSealed = function(obj){ 
		if( !__isObject(obj) ) 
			throw new TypeError( obj+" is not an object" );
		return false; 
	});
	
	
	/**
	 * Checks whether the object have been frozen with Object.freeze method.
	 * Because the implementation of Object.freeze is impossible with ECMAScript 3 features,
	 * the method always returns false.
	 * ECMAScript 5 Reference: 15.2.3.12
	 * @param {object} obj an object to examine
	 * @returns {boolean} always false
	 * @throws {TypeError} when obj is not an object
	 */	
	Object.isFrozen || ( Object.isFrozen = function(obj){
		if( !__isObject(obj) ) 
			throw new TypeError( obj+" is not an object" );
		return false; 		
	});
	
	
	/**
	 * Checks whether the object structure can be extended. It returns false only when the object has
	 * been protected by Object.preventExtensions, Object.seal or Object.freeze methods. 
	 * Because in non-ECMAScript 5 interpreters there is not possible to provide such protection,
	 * this implementation of Object.isExtensible always returns true. 
	 * ECMAScript 5 Reference: 15.2.3.13
	 * @param {object} obj an object to examine
	 * @returns {boolean} always true
	 * @throws {TypeError} when obj is not an object
	 */
	Object.isExtensible || ( Object.isExtensible = function(obj){ 
		if( !__isObject(obj) ) 
			throw new TypeError( obj+" is not an object" );
		return true; 
	});	
	
	
	/**
	 * Returns property descriptor for property of a given object
	 * ECMAScript 5 Reference: 15.2.3.3
	 * @since 1.2
	 * @param {object} obj an object
	 * @param {string} pname property name to test; when it doesn't point to a valid property name
	 * 			the method return undefined
	 * @returns {object} property descriptor or undefined
	 * @throws {TypeError} when obj is null or not an object
	 * @example Object.getOwnPropertyDescriptor(Array.prototype, "length");
	 */
	Object.getOwnPropertyDescriptor || ( Object.getOwnPropertyDescriptor = (function(){
		
		var __NUMBER_CONSTS = ['MAX_VALUE', 'MIN_VALUE','NaN','POSITIVE_INFINITY','NEGATIVE_INFINITY'],
			__MATH_CONSTS = ['PI','E','LN2','LOG2E','LOG10E','SQRT1_2','SQRT2'];
		
		return function(obj, pname){
			if( !__isObject(obj) ) 
				throw new TypeError( obj+" is not an object" );
			
			if( !(pname in obj) )
				return;
			
			var editable = true,
				configurable = true;
			
			// recognize the only cases when ECMAScript 3 protects properties
			if( (obj===Number && __NUMBER_CONSTS.indexOf(pname)>=0) 
					|| (obj===Math && __MATH_CONSTS.indexOf(pname)>=0) 
					|| (pname=='length' && (obj===String.prototype || __isString(obj) 
							|| obj===Function.prototype || obj instanceof Function)) ) {
				editable = false;
				configurable = false;
			} else if( pname=='length' && (obj===Array.prototype || Array.isArray(obj)) ) {
				configurable = false;
			} 
			
			return {
				writable: editable,
				enumerable: __propertyIsEnumerable(obj,pname),
				configurable: configurable,
				value: obj[pname]
			};
		};
	})());	
	
	
	// Object.defineProperty and Object.defineProperties implementation
	(!Object.defineProperty || !Object.defineProperties) && (function(){
			
		/**
		 * Internal method of this library which checks additional conditions in property descriptor object
		 * in order to limitations in ECMAScript 3. Should be called on a result of __toPropertyDescriptor 
		 * internal function.
		 * @private
		 * @param {Object} desc a property descriptor
		 * @param {boolean} defaultValue the default value of not provided flags
		 * @param value the value of a property
		 * @returns {Object} property descriptor with applied defaults and value 
		 * @see __toPropertyDescriptor
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
			 * Creates or redefines a property of an object. The property descriptor can contain one of
			 * following attributes: value, writable, configurable, enumerable, get, set.
			 * Get and set properties can't exist together with value or writable.
			 * 
			 * WARNING! The full implementation of defineProperty method is impossible with ECMAScript 3
			 * features. In particular ECMAScript 3 does not allow to make properties non-enumerable, 
			 * non-configurable or read only. As a consequence when at least on of these flags (enumerable,
			 * configurable or writable) is set to false, the library will throw an Error.  
			 * Also accessors (getters and setters) are not a part of ECMAScript 3 and as such they are not
			 * supported by this library. 
			 *  
			 * ECMAScript 5 Reference: 15.2.3.6
			 * @since 1.2
			 * @param {Object} obj an object
			 * @param {string} property a property name
			 * @param {Object} descriptor a property descriptor
			 * @returns {Object} obj property modified by property descriptor
			 * @throws {TypeError} when obj or descriptor is not an object or when property descriptor is 
			 * 			incorrect (i.e. contains both getter and value)
			 * @example Object.defineProperty(myObj, "testValue", {
			 * 				value:1, enumerable:true, writable:true, configurable:true});
			 */
			Object.defineProperty = function(obj, property, descriptor){
				if( !__isObject(obj) ) 
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
			 * Creates or redefines properties of an object. Each element of 'properties' object
			 * is a separate property descriptor. Each property descriptor can contain one of
			 * following attributes: value, writable, configurable, enumerable, get, set.
			 * Get and set properties can't exist together with value or writable.
			 * When at least one of the property descriptors fail, all of the changes will be discarded.
			 * 
			 * WARNING! The full implementation of defineProperties method is impossible with ECMAScript 3
			 * features. In particular ECMAScript 3 does not allow to make properties non-enumerable, 
			 * non-configurable or read only. As a consequence when at least on of these flags (enumerable,
			 * configurable or writable) is set to false, the library will throw an Error.  
			 * Also accessors (getters and setters) are not a part of ECMAScript 3 and as such they are not
			 * supported by this library. 
			 * 
			 * ECMAScript 5 Reference: 15.2.3.6
			 * @since 1.2
			 * @param {Object} obj an object
			 * @param {Object} properties a map of property descriptors
			 * @returns {Object} obj object modified with given property descriptors
			 * @throws {TypeError} {TypeError} when obj or descriptor is not an object or when property descriptor is incorrect
			 * 			(i.e. contains both getter and value)
			 * @example Object.defineProperty(myObj, { testValue: {
			 * 				value:1, enumerable:true, writable:true, configurable:true}});
			 */
			Object.defineProperties=function(obj, properties){
				if( !__isObject(obj) ) 
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
	
	
	/**
	 * Returns an array of object's own property names. It includes only the
	 * enumerable properties. For all (enumerable and non-enumerable) properties
	 * use Object.getOwnPropertyNames instead. 
	 * ECMAScript 5 Reference: 15.2.3.14
	 * @param obj {object} 
	 * @returns {Array} array of own property names
	 * @throws TypeError if the parameter is not an object
	 * @example Object.keys({a:5}); // should return ["a"] 
	 * @see Object#getOwnPropertyNames
	 */	 
	Object.keys || (Object.keys = function(obj){
		if( !__isObject(obj) ) 
			throw new TypeError( obj + " is not an object" );
		
		var results = [];
		// key in obj is tricky here, but in IE global object doesn't have hasOwnPropertyMethod
		for(var key in obj) {
			(obj.hasOwnProperty ? obj.hasOwnProperty(key) : key in obj) && results.push(key);
		}
		
		
		if( __isString(obj) && !__features.STRING_INDEX_ENUMERABLE ) {
			for(var i=0, len=obj.length; i < len; ++i) {
				results.push( String(i) );
			}
		}
		
		return results;
	});	
	
	
	// Object.getOwnPropertyNames
	!Object.getOwnPropertyNames && (function(){
		
		/**
		 * Attributes which are marked as non-enumerable by the internal ECMAScript flag.
		 * Because in ECMAScript 3 there is not possible to set enumerable flag from the
		 * language level - they should be the only non-enumerable elements in the language.
		 * (Maybe apart some DOM elements which should be added to this implementation later)
		 * @private
		 * @type Array
		 */
		var __notEnumerableProperties = (function(){
			
			var props = [
	             {
	            	 object: Object,
	            	 keys: ['getOwnPropertyNames', 'seal', 'create', 'isFrozen', 'keys', 'isExtensible', 
	            	        'getOwnPropertyDescriptor', 'preventExtensions', 'getPrototypeOf', 'defineProperty', 'isSealed', 
	            	        'defineProperties', 'freeze']
	             },{
	            	 object: Object.prototype,
	            	 keys: ['toString', '__lookupGetter__', '__defineGetter__', 'toLocaleString', 'hasOwnProperty', 'valueOf', '__defineSetter__', 
	            	        'propertyIsEnumerable', 'isPrototypeOf', '__lookupSetter__']
	             },{
	            	 object: Function.prototype,
	            	 keys: ['bind', 'arguments', 'toString', 'length', 'call', 'name', 'apply', 'caller']
	             },{
	            	 object: Number,
	            	 keys: ['NaN', 'NEGATIVE_INFINITY', 'POSITIVE_INFINITY', 'MAX_VALUE', 'MIN_VALUE']
	             },{
	            	 object: Number.prototype,
	            	 keys: ['toExponential', 'toString', 'toLocaleString', 'toPrecision', 'valueOf', 'toFixed']
	             },{
	            	 object: String,
	            	 keys: ['fromCharCode']
	             },{
	            	 object: String.prototype,
	            	 keys: ['length', 'concat', 'localeCompare', 'substring', 'italics', 'charCodeAt', 'strike', 'indexOf', 
	            	        'toLowerCase', 'trimRight', 'toString', 'toLocaleLowerCase', 'replace', 'toUpperCase', 'fontsize', 'trim', 'split', 
	            	        'substr', 'sub', 'charAt', 'blink', 'lastIndexOf', 'sup', 'fontcolor', 'valueOf', 'link', 'bold', 'anchor', 'trimLeft', 
	            	        'small', 'search', 'fixed', 'big', 'match', 'toLocaleUpperCase', 'slice']
	             },{
	            	 object: Boolean.prototype,
	            	 keys: ['toString', 'valueOf']
	             },{
	            	 object: Date,
	            	 keys: ['now', 'UTC', 'parse']
	             },{
	            	 object: Date.prototype,
	            	 keys: ['toUTCString', 'setMinutes', 'setUTCMonth', 'getMilliseconds', 'getTime', 'getMinutes', 'getUTCHours', 
	            	        'toString', 'setUTCFullYear', 'setMonth', 'getUTCMinutes', 'getUTCDate', 'setSeconds', 'toLocaleDateString', 'getMonth', 
	            	        'toTimeString', 'toLocaleTimeString', 'setUTCMilliseconds', 'setYear', 'getUTCFullYear', 'getFullYear', 'getTimezoneOffset', 
	            	        'setDate', 'getUTCMonth', 'getHours', 'toLocaleString', 'toISOString', 'toDateString', 'getUTCSeconds', 'valueOf', 
	            	        'setUTCMinutes', 'getUTCDay', 'toJSON', 'setUTCDate', 'setUTCSeconds', 'getYear', 'getUTCMilliseconds', 'getDay', 
	            	        'setFullYear', 'setMilliseconds', 'setTime', 'setHours', 'getSeconds', 'toGMTString', 'getDate', 'setUTCHours']
	             },{
	            	 object: RegExp,
	            	 keys: 	['$*', '$`', '$input', '$+', '$&', "$'", '$_']
	             },{
	            	 object: RegExp.prototype,
	            	 keys: ['toString', 'exec', 'compile', 'test']
	             },{
	            	 object: Error.prototype,
	            	 keys: ['toString']
	             },{
	            	 object: Math,
	            	 keys: ['LN10', 'PI', 'E', 'LOG10E', 'SQRT2', 'LOG2E', 'SQRT1_2', 'LN2', 'cos', 'pow', 'log', 'tan', 'sqrt', 'ceil', 'asin', 
	            	        'abs', 'max', 'exp', 'atan2', 'random', 'round', 'floor', 'acos', 'atan', 'min', 'sin']
	             },{
	            	 object: global,
	            	 keys: ['TypeError', 'decodeURI', 'parseFloat', 'Number', 'URIError', 'encodeURIComponent', 'RangeError', 'ReferenceError', 
	            	        'RegExp', 'Array', 'isNaN', 'Date', 'Infinity', 'Boolean', 'Error', 'NaN', 'String', 'Function', 
	            	        'Math', 'undefined', 'encodeURI', 'escape', 'unescape', 'decodeURIComponent', 'EvalError', 'SyntaxError', 'Object', 
	            	        'eval', 'parseInt', 'JSON', 'isFinite']
	             },{
	            	 test: function(obj){ return typeof JSON !== 'undefined' && obj === JSON; },
	            	 keys: ['stringify', 'parse']
	             },{
	            	 test: function(obj){ return Array.isArray(obj) || __isString(obj); },
	            	 keys: ['length']
	             },{
	            	 test: function(obj){ return obj instanceof RegExp },
	            	 testValue: new RegExp('.+'),
	            	 keys: ['lastIndex', 'multiline', 'global', 'source', 'ignoreCase']
	             },{
	            	 test: function(obj){ return typeof obj === 'function' && obj.apply && obj.call; },
	            	 testValue: function(a,b,c){},
	            	 keys: ['arguments', 'length', 'name', 'prototype', 'caller']
	             }
			];
			
			for( var i=0, ilen=props.length; i < ilen; ++i){
				if( props[i].object ) {
					if( typeof props[i].object === 'function' ){
						props[i].keys.push('arguments', 'length', 'name', 'prototype', 'caller');
					} else if( typeof props[i].object === 'object' && props[i].object !== Math && props[i].object !== global ) {
						props[i].keys.push('constructor');
					}
					for( var j=props[i].keys.length-1; j>=0; --j ) {
						if( !(props[i].keys[j] in props[i].object) || __propertyIsEnumerable(props[i].object,props[i].keys[j]) ) {
							props[i].keys.splice(j,1);
						}
					}
				} else if( props[i].test && props[i].testValue && props[i].test(props[i].testValue) ) {
					for( var j=props[i].keys.length-1; j>=0; --j ) {
						if( !(props[i].keys[j] in props[i].testValue) || __propertyIsEnumerable(props[i].testValue,props[i].keys[j]) ) {
							props[i].keys.splice(j,1);
						}
					}
					delete props[i].testValue;
				}
			}
			
			return props;
			
		})(); // __notEnumerableProperties
		
		
		/**
		 * Length of non-enumerable properties array
		 * @private
		 */
		var __len = __notEnumerableProperties.length;
		
		
		/**
		 * Returns an array of all direct property names of a given object - including the non-enumerable
		 * properties. It makes the difference between this method and Object.keys. 
		 * ECMAScript 5 reference: 15.2.3.4
		 * @since 1.2
		 * @param {Object} obj an object
		 * @returns {Array} Array of property names
		 * @throws {TypeError} when obj is not an object
		 * @see Object#keys
		 */
		Object.getOwnPropertyNames = function(obj){
			var keys = Object.keys(obj);
			for(var i=0; i < __len; ++i) {
				if( (__notEnumerableProperties[i].object && __notEnumerableProperties[i].object===obj) 
						|| (__notEnumerableProperties[i].test && __notEnumerableProperties[i].test(obj)) ) {
					keys = keys.concat( __notEnumerableProperties[i].keys );
					break;
				}
			}
			return keys;
		};
		
		
	})();
	
	
	//-----------------------------------------------------------------------
	// Private Utils

	
	/**
	 * Converts given array-like object to fully-qualified array
	 * @private
	 */
    var __toArray = function(obj, idx1, idx2) {
        var args = $AP.slice.call( arguments, 1 );
        return $AP.slice.apply( obj, args );
    };
	
	
	/**
	 * Check whether passed argument is an object (considering the fact that function is an object too)
	 * @private
	 */
	var __isObject = function(obj) {
		return obj && ( typeof obj === 'object' || typeof obj === 'function' );
	};
	
	
	var __isString = function(obj) {
		return typeof obj === 'string' || Object.prototype.toString.call(obj) === '[object String]';
	};
	
	
	/**
	 * Returns first valid index of an array
	 * @private
	 */
	var __firstIndex = function(arr) {
		for( var k=0, len=arr.length; k < len; ++k ) {
			if( arr.hasOwnProperty(String(k)) ) {
				return k;
			}
		}	
		return -1;
	};
	
	
	/**
	 * Implementation of ToPropertyDescriptor inner ECMAScript 5 method.
	 * ECMAScript 5 reference: 8.10.5
	 * @private
	 * @param {Object} obj a property object
	 * @returns {Object} a property descriptor
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
	 * Implementation of IsCallable internal ECMAScript function.
	 * ECMAScript 5 reference: 9.11
	 * @private
	 * @param {object} obj An object to examine
	 * @returns {boolean} true if object is callable false otherwise
	 */
	var __isCallable = (function(){ 
		
		var __sortCase = (function(){
				try {
					[].sort('abc');
					return false;
				} catch(ex) {
					return true;
				}
			})();
		
		return function(obj){
			if( typeof obj === 'function' )
				return true;
			if( typeof obj !== 'object' ) 
				return false;
			if( obj instanceof Function || obj instanceof RegExp )
				return true;
			if( __sortCase ) {
				try {
					[].sort(obj);
					return true;
				} catch(ex){ /* nothing to do */ }
			}
			return false;
		};
	})();
	
	
})(this);
