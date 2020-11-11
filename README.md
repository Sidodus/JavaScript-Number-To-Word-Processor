<h1 align= "center"><ins>JavaScript Number To Word Processor</ins>
<h6 align= "center" style="color: grey; margin-top: -10px"><small><a href="https://sidodus.github.io/JavaScript-Number-To-Word-Processor/" target="_blank">... #JSnumberToWordProcessor ...</a></small></h6><br />

<div align="center" style="margin-top: -15px">
  <a href="JSnumberToWordProcessor-fullpage.png" target="_blank" style="margin-right: 5px"><img src="JSnumberToWordProcessor-fullpage.png" width="265"/></a>
  <a href="JSnumberToWordProcessor-console.png" target="_blank"><img src="JSnumberToWordProcessor-console.PNG" width="370"/></a>
</div>

<h4 align="center"><code> 123,456,789,012,345,680 </code> => <code>One Hundred and Twenty-Three Quadrillion, Four Hundred and Fifty-Six Trillion, Seven Hundred and Eighty-Nine Billion, and Twelve Million, Three Hundred and Forty-Five Thousand, Six Hundred and Eighty.</code></h4>

<h4 align="center"><code> <span style="color: red">-</span>97,000,005,430,000.<small>98,766,537,867</small> </code> => <code><span style="color: tomato">(negative)</span> Ninety-Seven Trillion, and Five Million, Four Hundred and Thirty Thousand <span style="color: tomato">(dot)</span> Ninety-Eight Billion, Seven Hundred and Sixty-Six Million, Five Hundred and Thirty-Seven Thousand, Eight Hundred and Sixty-Seven <span style="color: gray">hundred-billionths</span>.</code></h4>

<blockquote align="center">
    The Goal Of <em>JSnumberToWordProcessor</em> Is A Well Formatted Human Readable <code> Number, </code> With It's Corresponding <code> Words. </code>
</blockquote>
<blockquote align="center">
    <em>JSnumberToWordProcessor</em> Is A Pure Vanilla JavaScript Plugin With No Dependencies.
</blockquote>
<br />

<hr />

<h2 align="center"> UPDATE </h2>

<h6 margin-bottom="-5px"><em>Version: 3.0.4</em></h6>
  <ol>
    <li> Fixed Display Of Multiple Zeros Greater Than 2 Length.
      <ul>
        <li>If A Decimal Place Length Greater Than 2 Is Specified, And Its Corresponding Decimal  Number Is 0, Application Would Fallback To A  2 Decimal Place Number of (.00) <br /> <b>e.g</b> <br /> <code>JSnumberToWordProcessor(26.00000232, 5)</code> would return <code>26.00</code> instead of <code>26.00000</code> </li>
      </ul>
    </li>
    <li>Correct Decimal Place Word With Starting Zeros <br /><b>e.g</b><br />
      <code>JSnumberToWordProcessor(26.00002, 5)</code> Now Returns <code>Twenty-Six (dot) Two tenths</code> Instead Of <code>Twenty-Six (dot) undefined Thousand, and Two hundred-thousandths</code>
    </li>
  </ol>

  <br />

<hr />

<h2 align="center"> Use Plugin Without Installing </h2>

<h6>Use On <a href="https://repl.it/languages/Nodejs#index.js" target="_blank">repl.it</a></h6>

```js
// Navigate To https://repl.it/languages/Nodejs#index.js
// On repl.it Call...

const JSnumberToWordProcessor = require("js-number-to-word-processor");

// Pass In A Single Number-String (with or without a decimal number argument)
JSnumberToWordProcessor("-4783484773.7634656549", 9);

// OR An Array Of Numbers
JSnumberToWordProcessor(["6677", "-7674.969", "0.00"]);
```

<br />

<hr />

<h2 align="center"> Setup In Project </h2>

<h6>HTML Script</h6>

```html
<script src="curStrLengthFunc_2.min.js"></script>
<script src="JSnumberToWordProcessor.js"></script>
```

<br />

<hr />

<h2 align="center"> Installation </h2>
<h6>NPM Installation</h6>

```sh
npm i js-number-to-word-processor
```

<br />

<hr />

<h2 align="center"> Import In Project </h2>

<h6>ES5 module:</h6>

```js
const JSnumberToWordProcessor = require("js-number-to-word-processor");
```

<h6>ES6 module:</h6>

```js
import JSnumberToWordProcessor from "js-number-to-word-processor";
```

<h6>AMD loader libraries such as requireJS:</h6>

```js
require(["js-number-to-word-processor"], function (num) {
  // Use JSnumberToWordProcessor here in local scope.
});
```

<br />

<hr />

<h2 align="center"> Use In Project: </h2>

<h6><ins>NOTE</ins> <br/ > 
  Always Use BigInteger / BigInt or Number String When Dealing With Big Numbers Above 2^53-1 <br /><br />
  e.g <br />
  877373863274895753n or '877373863274895753' <br />
  <b>OR</b> <br />
  BigInt(245786743890965998) or '245786743890965998' <br /><br /> <br />

Call JSnumberToWordProcessor & PASS In Either A Positive Whole Number, BigInteger, OR Number-String

</h6>

```js
JSnumberToWordProcessor("987"); // 987: Nine Hundred and Eighty-Seven
```

```js
JSnumberToWordProcessor(8476787747); // 8,476,787,747: Eight Billion, Four Hundred and Seventy-Six Million, Seven Hundred and Eighty-Seven Thousand, Seven Hundred and Forty-Seven
```

```js
JSnumberToWordProcessor(5876985876950n); // 5,876,985,876,950: Five Trillion, Eight Hundred and Seventy-Six Billion, Nine Hundred and Eighty-Five Million, Eight Hundred and Seventy-Six Thousand, Nine Hundred and Fifty
```

```js
JSnumberToWordProcessor(BigInt(6856767875879601367476468) % BigInt(8)); // 0: Zero
```

<h6> PASS An Array Of Positive Whole Number, BigInteger, OR Number-Strings </h6>

```js
JSnumberToWordProcessor([
  "6478", // 6,478: Six Thousand, Four Hundred and Seventy-Eight
  579n, // 579: Five Hundred and Seventy-Nine
  "57682587695780", // 57,682,587,695,780: Fifty-Seven Trillion, Six Hundred and Eighty-Two Billion, Five Hundred and Eighty-Seven Million, Six Hundred and Ninety-Five Thousand, Seven Hundred and Eighty
]);
```

```js
JSnumberToWordProcessor([
  6478 * (55.999865 * -8), // -2,902,137.38: (negative) Two Million, Nine Hundred and Two Thousand, One Hundred and Thirty-Seven (dot) Thirty-Eight hundredths
  579n / ((55n / 11n) * 10n), // 11: Eleven
  579 / ((55 / 11) * 10), // 11.58: Eleven (dot) Fifty-Eight
]);
```

<h6> PASS A Decimal Numbers </h6>

```js
JSnumberToWordProcessor(5876.98587695); // 5,876.99: Five Thousand, Eight Hundred and Seventy-Six (dot) Ninety-Nine hundredths
```

```js
JSnumberToWordProcessor("5876.985876950", 5); // 5,876.98,588: Five Thousand, Eight Hundred and Seventy-Six (dot) Ninety-Eight Thousand, Five Hundred and Eighty-Eight hundred-thousandths
```

<h6> PASS A Negative Numbers </h6>

```js
JSnumberToWordProcessor("-876950"); // -876,950: (negative) Eight Hundred and Seventy-Six Thousand, Nine Hundred and Fifty
```

```js
JSnumberToWordProcessor("-8769.5", 1); // -8,769.50: (negative) Eight Thousand, Seven Hundred and Sixty-Nine (dot) Five tenths
```

<h6> SOLVE Arithmetic Operations <br />
     When Solving Arithmetic Calculations (+), Always Pass Arguments As Numbers, OR BigIntegers, <br />
     Other Arithmetic Operations Could Be Passed In As A Numbers, BigInteger, OR As A String.
</h6>

```js
JSnumberToWordProcessor(55 / 11); // 5: Five
```

```js
JSnumberToWordProcessor(55 * 11); // 605: Six Hundred and Five
```

```js
JSnumberToWordProcessor(555n * 111n); // 61,605: Sixty-One Thousand, Six Hundred and Five
```

```js
JSnumberToWordProcessor(55 - 11); // 44: Forty-Four
```

```js
JSnumberToWordProcessor(55 + 11); // 66: Sixty-Six
```

```js
JSnumberToWordProcessor("55" ** "3"); // 166,375: One Hundred and Sixty-Six Thousand, Three Hundred and Seventy-Five
```

```js
JSnumberToWordProcessor(55 % 3); // 1: One
```

```js
JSnumberToWordProcessor(55 + -8); // 47: Forty-Seven
```

```js
JSnumberToWordProcessor(55.1 / 3 - 8.2); // 10.17: Ten (dot) Seventeen hundredths
```

```js
JSnumberToWordProcessor(55 * 0.8); // 44: Forty-Four
```

```js
JSnumberToWordProcessor(5876 / 985876950); // 0.60: Zero (dot) Sixty
```

<h6>Use BigInteger / BigInt</h6>

```js
JSnumberToWordProcessor(55n ** 18n); // 21,209,401,372,879,911,350,250,244,140,625: Twenty-One Nonillion, Two Hundred and Nine Octillion, Four Hundred and One Septillion, Three Hundred and Seventy-Two Sextillion, Eight Hundred and Seventy-Nine Quintillion, Nine Hundred and Eleven Quadrillion, Three Hundred and Fifty Trillion, Two Hundred and Fifty Billion, Two Hundred and Forty-Four Million, One Hundred and Forty Thousand, Six Hundred and Twenty-Five
```

```js
JSnumberToWordProcessor([(BigInt(55) / BigInt(11)) * BigInt(10)]); // 50: Fifty
```

<h6>
  Define The Decimal Place Length With A Second Number Argument <br /><br/>
  NOTE:
  The Second Argument Would Only Be Called On A Decimal Number
  If The Second Argument Is Greater Than The Decimal Point Length, A Default 2 Decimal Point Would Be Used
  
</h6>

```js
JSnumberToWordProcessor(55.999865 * -8.5, 6); // -475.99,885: (negative) Four Hundred and Seventy-Five (dot) Nine Hundred and Ninety-Eight Thousand, Eight Hundred and Fifty-Three millionths
```

```js
JSnumberToWordProcessor(
  [
    "55.999858659554367" * "-8.79", // -475.99,885: (negative) Four Hundred and Ninety-Two (dot) Twenty-Three Trillion, Eight Hundred and Seventy-Five Billion, Seven Hundred and Sixty-One Million, Seven Hundred and Forty-Eight Thousand, Two Hundred and Eighty-Six hundred-trillionths
    55.999999 + 8, // 64.00: Sixty-Four
  ],
  14
);
```

```js
JSnumberToWordProcessor(55.888888 + 8, 5); // 63.88,889: Sixty-Three (dot) Eighty-Eight Thousand, Eight Hundred and Eighty-Nine hundred-thousandths
```

```js
JSnumberToWordProcessor(55.999999 / 8, 5); // 7.00: Seven
```

```js
JSnumberToWordProcessor(55.1 - 8.2, 3); // 46.900: Forty-Six (dot) Nine Hundred thousandths
```

```js
JSnumberToWordProcessor(55.9979865 * -(-8.5), 7); // 475.9,828,853: Four Hundred and Seventy-Five (dot) Nine Million, Eight Hundred and Twenty-Eight Thousand, Eight Hundred and Fifty-Three ten-millionths
```

```js
JSnumberToWordProcessor(
  [
    -55.999865 * -8.5, // 475.9,988,525: Four Hundred and Seventy-Five (dot) Nine Million, Nine Hundred and Eighty-Eight Thousand, Five Hundred and Twenty-Five ten-millionths
    5 ** 4, // 625: Six Hundred and Twenty-Five
  ],
  7
);
```

<h6> PROCESS Booleans </br>
    NOTE: 0 === false && 1 === true
</h6>

```js
JSnumberToWordProcessor(55 > 26); // 1: One
```

```js
JSnumberToWordProcessor(55 < 26); // 0: Zero
```

```js
JSnumberToWordProcessor(55 <= 26); // 0: Zero
```

```js
JSnumberToWordProcessor(55 == "55"); // 1:
```

```js
JSnumberToWordProcessor(55 === "55"); // 0: Zero
```

```js
JSnumberToWordProcessor(55 !== "55"); // 1: One
```

<br />

<div>
    <hr />
      <h2 align="center"> How To Use JSnumberToWordProcessor Plugin In Your Project </h2>
      <ul>
          <li>Install JSnumberToWordProcessor Plugin In Your Project File <br />
          <b>OR</b> <br />
          Download, And Attach <code>curStrLengthFunc_2.min.js</code> & <code>JSnumberToWordProcessor.js</code> Script To Your HTML Document.</li>
          <li>      Ensure You Pass in The Number Argument As A String OR As A BigInter(). <br />
                    This Is Because JavaScript Has A Number Length Limit Of 2^53-1. <br />
                    But If You Would Be Dealing With Numbers Less Than 2^53-1 Length, <br />
                    Then Feel Free To Input A Number As Your Argument. <br />
                                  <b style="color: grey;">For Decimal Numbers </b><br />
          Pass A The Second Argument Which Could either Be A Number Or A String. If No Second Argument Is Passed In For Decimal Numbers Or The Second Argument Is Greater Than The Actual  Decimal Number Length, A default Value Of 2 Decimal Number Length Is Used.  <br />
          <b style="color: grey;">e.g</b><br />
                <code>JSnumberToWordProcessor('123456.78998765', 5)</code> <br />
                                  <b>OR</b> <br />
                <code>JSnumberToWordProcessor(['123.98765', '445.556', '68', '8575.7766', '84974'], 3)</code>.                    
              </li>
              <li>
                <b style="color: grey;"><i>Alternatively;</i></b> <br />
                    Just Append <code>(n)</code> (Without Parentheses) to The End Of The Number Longer Than 2^53-1 <br />
                    e.g. <br />
                        <code>123456789098765432n</code> <br />
                                 <b>OR</b> <br />
                        <code>[123456789098765433n, BigInt(123456789098765434), 123456789098765434n]</code>. <br />
                    This Calls The BigInt() Method Which Allows JavaScript To Handle BIG Numbers. <br />
              </li>              
              <li>
              <b style="color: grey;"><i>Better Still; </i></b> <br />
                    Just Check <a href="https://sidodus.github.io/JavaScript-Number-To-Word-Processor/" target="_blank">JSnumberToWordProcessor's index.html</a> & See How It's Been Put To Use
                    <br />
                    <b>OR</b>
                    <br />
                    Check <a href="https://sidodus.github.io/Sidodus-proforma-invoice-calculator/">Proforma Invoice Calculator</a> To See JSnumberToWordProcessor At Work  <br />
              </li>
            </ol>
          </li>
          <li>
            Display The Result In Your Project.
          </li>
      </ul>
    </div>
    <br />

<hr />

<h2 align="center">UPDATE History</h2>

<h6 margin-bottom="-5px"><em>Version: 3.0.3</em></h6>
  <ol>
    <li> Corrected Application Dismissal Of Starting Zeros After A Decimal Point.</li>
  </ol>

<h6 margin-bottom="-5px"><em>Version: 3.0.2</em></h6>
  <ol>
    <li> Application Now Handles Decimal Numbers, With Fractions.</li>
      <ol>
        <li>For decimal numbers, users can pass in a second argument which would indicate the decimal number length</li>
        <li>If a second  argument isn't passed in for decimal numbers, a default 2 decimal point would be used</li>
      </ol>
    <li> Application Now Handles Negative Numbers.</li>
    <li>Application Can Solve Arithmetic Operations and Output The Result In Human Readable Number & Word </li>
  </ol>

<h6 margin-bottom="-5px"><em>Version: 2.0.5</em></h6>
  <ol>
    <li> Corrected Read Me installation process.</li>
    <li> Code Optimized.</li>
  </ol>

<h6 margin-bottom="-5px"><em>Version: 2.0.4</em></h6>
  <ol>
    <li> Application Can Now Process Numbers Up To "<code>10^33003</code>", Into Human Readable Numbers & Words Based On <a href="https://www.mrob.com/pub/math/largenum.html" target="_blank"
          >Conway-Wechsler Numbering System</a
        >. </li>
    <li> Optimized Code For Efficiency (Rewrote Most Part). </li>
    <li> Pure Vanilla JS With No Dependencies.</li>
  </ol>

<h6 margin-bottom="-5px"><em>Version: 1.1.0</em></h6>
  <ol>
    <li> Application Can Now Handle Numbers Larger Than <code>2^53-1</code> Up To <code>10^126</code>. </li>
    <li> Spelling Errors Corrected. </li>
    <li> Code Refined. </li>
  </ol>
  <br />

<hr />

<h2 align="center"> Install From: </h2>

<h6>Install From <a href="https://www.npmjs.com/package/js-number-to-word-processor" target="_blank">NPM</a></h6>
<h6>Get Source Code From <a href="https://github.com/Sidodus/JavaScript-Number-To-Word-Processor" target="_blank">GitHub</a></h6>
<h6>Use Live Site @ <a href="https://sidodus.github.io/JavaScript-Number-To-Word-Processor/" target="_blank">JSnumberToWordProcessor</a></h6>
<h6><a href="https://sidodus.github.io/Sidodus-proforma-invoice-calculator/" target="_blank">Proforma Invoice Calculator </a>is Another Application Using #JSnumberToWordProcessor</h6>

<br /><br />

> JavaScript Number To Word Processor Is Developed By <a href="https://www.linkedin.com/in/saheed-odulaja-75111337" target="_blank"> Saheed Odulaja</a>. <br />
> Feel Free To Fork This Repository. <br />
> Also Be Kind Enough To Leave A STAR 🌟 As A Mark Of Encouragement 😃.
