ddr-ecma5
=========

ddr-ecma5 lets you to write ECMAScript 5 code and run it on older environments like IE6 
(I know - it must die anyway) or Firefox < 4. It works also perfectly outside the browser 
- like Rhino, SpiderMonkey, etc. 

## Installation
Just add it to your webpage and enjoy<br/> 
```html
<script type="text/javascript" src="ddr-ecma5.js"></script>
```

In Rhino/SpiderMonkey environments use `load` function:
```js
load('ddr-ecma5.js');
```

Node.JS - do not bother to load the library to your node projects - V8 supports ECMAScript 5 by itself. 

## Testing
If you are curious which functionality of ECMAScript 5 is currently supported by your browser 
open  `test/ddr-ecma5-features-test.html` file. Another test file - `ddr-ecma5-test.html` - executes 
a test of the library itself. All tests are using [QUnit](https://github.com/jquery/qunit) framework. 

## Is it stable?
Yes it is! The library development started at the end beginning of 2010 and each feature of it has been
properly tested. Version 1.2 of the library contains all ECMAScript 5 methods which can be implemented 
with ECMAScript 3 features - means no new methods will be added.  
Currently the author focuses only on the stability and performance of the library.
ddr-ecma5 is used by many developers in their private and commercial projects.  

## Functionality and compatibility
Not all features of ECMAScript 5 can be implemented with ECMAScript 3. An example can be _freeze_ 
feature or the _strict mode_. However most of extensions, like new methods of Array, String or Function 
are provided by the library. 

The table below illustrates in which version of a browser the particular feature of ECMAScript 5 
has been introduced. As you can see in most of the cases only the latest versions of the browsers 
(like IE9, FF4, SF5) are supporting the ECMAScript 5 standard. You can use ddr-ecma5 library to 
keep the backward compatibility with older browsers without resigning from ECMAScript 5 features. 

<table>
<thead>
<tr>
  <th>Feature</th>
  <th>ddr-ecma5</th><th>Chrome</th><th>Firefox</th><th>Safari</th><th>Opera</th><th>IE</th><th>Rhino</th>
</tr>
</thead>
<tbody>
<tr>
  <th>Function.prototype.bind</th>
  <td>1.0</td><td>7.0</td><td>4.0</td><td>-</td><td>-</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Object.keys</th>
  <td>1.0</td><td>5.0</td><td>4.0</td><td>5.0</td><td>-</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Object.getPrototypeOf</th>
  <td>1.0 <sup>1</sup></td><td>5.0</td><td>4.0</td><td>5.0</td><td>-</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Object.create</th>
  <td>1.0 <sup>1</sup></td><td>5.0</td><td>4.0</td><td>5.0</td><td>-</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Object.defineProperty</th>
  <td>1.2 <sup>1</sup></td><td>5.0</td><td>4.0</td><td>5.0</td><td>-</td><td>8.0 <sup>3</sup></td><td>1.7R3</td>
</tr><tr>  
  <th>Object.defineProperties</th>
  <td>1.2 <sup>1</sup></td><td>5.0</td><td>4.0</td><td>5.0</td><td>-</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Object.getOwnPropertyDescriptor</th>
  <td>1.2</td><td>5.0</td><td>4.0</td><td>5.0</td><td>-</td><td>8.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Object.getOwnPropertyNames</th>
  <td>1.2</td><td>5.0</td><td>4.0</td><td>5.0</td><td>-</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Object.preventExtensions</th>
  <td>- <sup>2</sup></td><td>6.0</td><td>4.0</td><td>-</td><td>-</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Object.seal</th>
  <td>- <sup>2</sup></td><td>6.0</td><td>4.0</td><td>-</td><td>-</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Object.freeze</th>
  <td>- <sup>2</sup></td><td>6.0</td><td>4.0</td><td>-</td><td>-</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Object.isExtensible</th>
  <td>1.1</td><td>6.0</td><td>4.0</td><td>-</td><td>-</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Object.isSealed</th>
  <td>1.1</td><td>6.0</td><td>4.0</td><td>-</td><td>-</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Object.isFrozen</th>
  <td>1.1</td><td>6.0</td><td>4.0</td><td>-</td><td>-</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>String.prototype.trim</th>
  <td>1.0</td><td>5.0</td><td>3.5</td><td>5.0</td><td>10.5</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Array.isArray</th>
  <td>1.0.1</td><td>5.0</td><td>4.0</td><td>5.0</td><td>10.5</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Array.prototype.indexOf</th>
  <td>1.0</td><td>5.0</td><td>3.0</td><td>3.2</td><td>10.1</td><td>9.0</td><td>1.6R3</td>
</tr><tr>  
  <th>Array.prototype.lastIndexOf</th>
  <td>1.0</td><td>5.0</td><td>3.0</td><td>3.2</td><td>10.1</td><td>9.0</td><td>1.6R3</td>
</tr><tr>  
  <th>Array.prototype.every</th>
  <td>1.0</td><td>5.0</td><td>3.0</td><td>3.2</td><td>10.1</td><td>9.0</td><td>1.6R3</td>
</tr><tr>  
  <th>Array.prototype.some</th>
  <td>1.0</td><td>5.0</td><td>3.0</td><td>3.2</td><td>10.1</td><td>9.0</td><td>1.6R3</td>
</tr><tr>  
  <th>Array.prototype.forEach</th>
  <td>1.0</td><td>5.0</td><td>3.0</td><td>3.2</td><td>10.1</td><td>9.0</td><td>1.6R3</td>
</tr><tr>  
  <th>Array.prototype.map</th>
  <td>1.0</td><td>5.0</td><td>3.0</td><td>3.2</td><td>10.1</td><td>9.0</td><td>1.6R3</td>
</tr><tr>  
  <th>Array.prototype.filter</th>
  <td>1.0</td><td>5.0</td><td>3.0</td><td>3.2</td><td>10.1</td><td>9.0</td><td>1.6R3</td>
</tr><tr>  
  <th>Array.prototype.reduce</th>
  <td>1.0</td><td>5.0</td><td>3.0</td><td>4.0</td><td>10.5</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Array.prototype.reduceRight</th>
  <td>1.0</td><td>5.0</td><td>3.0</td><td>4.0</td><td>10.5</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Date.prototype.toISOString</th>
  <td>1.0</td><td>5.0</td><td>3.5</td><td>4.0</td><td>10.5</td><td>9.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Date.prototype.toJSON</th>
  <td>1.0</td><td>5.0</td><td>3.5</td><td>4.0</td><td>?</td><td>8.0</td><td>1.7R3</td>
</tr><tr>  
  <th>Date.now</th>
  <td>1.0</td><td>5.0</td><td>3.0</td><td>4.0</td><td>10.5</td><td>9.0</td><td>1.6R1</td>
</tr><tr>  
  <th>Strict mode</th>
  <td>- <sup>2</sup></td><td>-</td><td>4.0</td><td>-</td><td>-</td><td>-</td><td>-</td>
</tr>
</tbody>
</table>

Notes<br/>
<sup>1</sup> - limited functionality in comparison to ECMAScript 5 specification<br/>
<sup>2</sup> - impossible to implement this feature with ECMAScript 3 functionality<br/>
<sup>3</sup> - on IE8 Object.defineProperty works only with DOM objects
