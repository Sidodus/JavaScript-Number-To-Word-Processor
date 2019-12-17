JavaScript Number To Word Processor
=====================================

<h1 align="center">
  <a href="JSnumberToWordProcessor-fullpage.png" style="margin-right: 5px"><img src="JSnumberToWordProcessor-fullpage.png" width="130"/></a>
  <a href="JSnumberToWordProcessor-console.PNG"><img src="JSnumberToWordProcessor-console.PNG" width="500"/></a>
</h1>

<h4 align="center"><code> 123,456,789,012,345,680 </code> => <code>One Hundred and Twenty-Three Quadrillion, Four Hundred and Fifty-Six Trillion, Seven Hundred and Eighty-Nine Billion, and Twelve Million, Three Hundred and Forty-Five Thousand, Six Hundred and Eighty.</code></h4>

<blockquote align="center">
    The Goal Of <em>JavaScript Number To Word Processor</em> Is A Well Formatted <code> Number </code> With A Corresponding <code> Number Words </code> That's Easily Readable To The Eyes
</blockquote>

# UPDATE:
- *). Application Can Now Handle Numbers Larger Than <code>2^53-1</code>.
- *). Spelling Errors Corrected.


# How To Use Plugin In Your Project:
- 1). Download And Attach The JSnumberToWordProcessor.js Script To Your Document.
- 2). From Your Project Script, Call JSnumberToWordProcessor(numInput); Where (numInput) is Either A String Of Number Or An Array Of Numbers-Strings.
-     a). e.g. JSnumberToWordProcessor('123456') OR JSnumberToWordProcessor(['123','445','6','8575','8474']). Ensure You Pass in The Number Argument As A String. This Is Because JavaScript Has A Number Length Limit Of 2^53-1. But If You Would Be Dealling With Numbers Less Than This Length, Then Feel Free To Input A Number As Your Argument.
-     b). Alternatively; Just Append (n) to The End Of The Number Longer Than 2^53-1 e.g. 123456789098765432n OR [123456789098765433n,123456789098765434n,123456789098765434n]. This Calls The BigInt() Method Which Allows JavaScript To Handle BIG Numbers.
-     c). Better Still; Just Check JSnumberToWordProcessor.html to See How It Is Been Put To Use.
- 3). Display The Result To Your Document.


Test Plugin @ [JavaScript Number To Word Processor](https://sidodus.github.io/JavaScript-Number-To-Word-Processor/)

Coding Exercise By Saheed Odulaja
> JavaScript Number To Word Processor Is Developed By Saheed Odulaja As A JavaScript Coding Exercise.
> Feel Free To Fork This Repository as There Is Always Room For Improvement.
> Also Be Kind Enough To Leave A STAR As A Mark Of Encouragement :)
