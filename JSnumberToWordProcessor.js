/*
 ** JS Number To Word Pocessor v2.0.4
 ** Purpose: Improving Number / Number-Word Readability.
 ** Copyright (c) 2019-2020 Saheed Odulaja
 **
 ** Feel Free To Fork The Repository.
 ** Also Be Kind Enough To Leave A STAR As A Mark Of Encouragement :)
 **
 ** NPM @ https://www.npmjs.com/package/js-number-to-word-processor.
 ** GitHub @ https://github.com/Sidodus/JavaScript-Number-To-Word-Processor.
 ** Live Application @ https://sidodus.github.io/JavaScript-Number-To-Word-Processor/.
 ** Proforma Invoice Calculator is Another Application Using #JSnumberToWordProcessor @ https://github.com/Sidodus-proforma-invoice-calculator/
 */

const JSnumberToWordProcessor = (function () {
  let curStrLengthFunc2;
  // *************** IMPORT curStrLengthFunc_2 *****************

  //AMD.
  if (typeof define === "function" && define.amd) {
    curStrLengthFunc2 = require(["./curStrLengthFunc_2.min.js"]);
    // Node and other CommonJS-like environments that support module.exports.
  } else if (typeof module !== "undefined" && module.exports) {
    curStrLengthFunc2 = require("./curStrLengthFunc_2.min.js");
    //Browser.
  } else {
    curStrLengthFunc2 = curStrLengthFunc_2;
  } 

  // ******************** Start Processing Number(s) ********************
  const processNum = function (num) {
    let curString;
    let processedData = "";
    let processedDataArray = [];

    // Process Number If Number Is An Array OR A Single Number
    if (Array.isArray(num)) {
      num.filter(function (cur) {
        // Exclude Negative Numbers But Fractions
        if (!String(cur).includes(".") && !String(cur).includes("-")) {
          // Remove Numbers With Letters But Retain "0"
          if (Number(cur) || Number(cur) === 0) {
            // Maintain Perfect Number By removing Any Starting "0s"
            curString = BigInt(cur).toString();
            // Process Number & Get Readable Number With Word
            processedData = numProcessor(curString);
            // Parse The Object Into An Array
            processedDataArray.push(processedData);
          }
        }
      });
    } else {
      // Exclude Negative Numbers & Fractions
      if (!String(num).includes(".") && !String(num).includes("-")) {
        // Remove Numbers With Letters But Retain "0"
        if (Number(num) || Number(num) === 0) {
          // Maintain Perfect Number By removing Any Starting "0s"
          curString = BigInt(num).toString();
          // Process Number & Get Readable Number With Word
          processedData = numProcessor(curString);
          // Parse The Object Into An Array
          processedDataArray.push(processedData);
        }
      }
    } // END OF if (Array.isArray(num))

    // Number Processor(Format Number To A Readable Number & Call processCurString() To Process Number To Word)
    function numProcessor(curString) {
      let curStringSubstr;
      let newCurString = [];

      let displayNum = 0;
      let displayWord = "";

      function processNum2HumanReadable(subStrNum, curStringSlice) {
        if (curString.length > 33003) {
          let excess = curString.substr(0, curString.length);
          newCurString.push(excess);
        } else if (curStringSlice !== null) {
          newCurString.push(curStringSlice);
        } else {
          // Pick out the 1st subStrNum numbers
          curStringSubstr = curString.substr(0, subStrNum);
          // Slice out the remaining numbers
          curStringSlice = curString.slice(subStrNum);
          // Push 1st 3 numbers to newCurString
          newCurString.push(curStringSubstr);

          // Manage proceding numbers
          while (curStringSlice.length > 3) {
            // Pick out the first 3 numbers
            curStringSubstr = curStringSlice.substr(0, 3);
            // Slice out the remaining numbers
            curStringSlice = curStringSlice.slice(3);
            // Push 1st 3 numbers to newCurString
            newCurString.push(curStringSubstr);
          }

          // Manage the last 3 numbers
          if (curStringSlice.length === 3) {
            // Pick out the first 3 numbers
            curStringSubstr = curStringSlice.substr(0, 3);
            // Push 1st 3 numbers to newCurString
            newCurString.push(curStringSubstr);
          }
        }
      }

      if (curString.length > 3) {
        if (curString.length % 3 === 1) {
          // Reamender 1 e.g 1,234
          processNum2HumanReadable(1, null);
        } else if (curString.length % 3 === 2) {
          // Remander 2 e.g 12,345
          processNum2HumanReadable(2, null);
        } else if (curString.length % 3 === 0) {
          /* Remaining 3 e.g 123,456 */
          processNum2HumanReadable(3, null);
        }
      } else if (curString.length <= 3) {
        //
        processNum2HumanReadable(null, curString);
      }

      //  Set displayNum
      displayNum = newCurString.toString();

      //  Set displayWord
      if (curString.length > 33003) {
        displayWord =
          "SORRY..., YOU JUST EXCEEDED THE SUPPORTED LENGTH OF (10\u00B3\u2070\u2070\u2070\u00B3) NUMBERS";
      } else {
        // Call A Function & Pass curString
        displayWord = processCurString(curString);
      }

      return {
        displayNum,
        displayWord,
      };
    } // END OF numProcessor()

    return processedDataArray;
  }; // END OF processNum(num)

  // Process Number To Word
  const processCurString = function (curString) {
    let curStringTenseAndUnit = 0;
    let processedWord = "";
    let processedWordDummy = "";

    // Format The illion eg Trillion, Billion, Million, Thousand etc
    // NOTE: The mainWord2, & alternateWord2 is For processedWordDummy RegEX match()
    function illion(
      subStrStart,
      subStrLength,
      mainWord,
      alternateWord,
      mainWord2,
      alternateWord2
    ) {
      // If Remaining Numbers === 0, then No Need For illion Word With Comma (,), This Means illion Word Without Comma (,) Should Be Used, Meaning Full-Stop (.) ShouldFollow.
      if (Number(curString.substr(subStrStart, subStrLength)) === 0) {
        processedWord += mainWord;
        // Save To processedWordDummy For RegEX match()
        processedWordDummy = mainWord2;
      } else {
        processedWord += alternateWord;
        // Save To processedWordDummy For RegEX match()
        processedWordDummy = alternateWord2;
      }
    } // END OF illion()

    /*
     ** Match RegEx With Privious illion eg Trillion, Billion, Million
     ** Matched 'string' Means The If Statement Would Run
     */
    function processWordRegExMatch(
      llionRegEx,
      curStringNUMWord,
      curStringNUM1,
      curStringNUM2,
      NUM,
      curStringLength,
      llion1,
      llion2
    ) {
      // Chech If processedWordDummy illion Includes Comma (,) Like llionRegEx illion, Then Number Length Is Greater than (>) 3. Therefore Process The Next illion.
      if (processedWordDummy.match(llionRegEx)) {
        // NOTE: The 2nd Set Of illion(3&4) would Be Parsed To processedWordDummy For RegEX match()
        processRegExMatch(
          curStringNUMWord,
          curStringNUM1,
          curStringNUM2,
          NUM,
          curStringLength,
          llion1,
          llion2
        );
      }
    } // END OF processWordRegExMatch()

    function processRegExMatch(
      curString2Word,
      curString1,
      curString2,
      NUM,
      curStringLength,
      llion1,
      llion2
    ) {
      // Bind The Tense & Unit to Number
      curStringTenseAndUnit = Number(curString1 + curString2);

      // Handle The Hundred, Tense, & Unit
      funcTenseAndUnit(curString2Word, " Hundred", curStringTenseAndUnit);

      // Determine How The illion Is Formatted eg. Trillion, Billion, Million etc.
      // This Reformats The Words If The Remaining Number Are Just LEADING ZERO's
      // =================================================================================
      // NOTE: The llion1, & llion2 is To Be Parsed To processedWordDummy For RegEX match()
      if (curString2Word !== undefined || curStringTenseAndUnit != 0) {
        illion(NUM, curStringLength, llion1, llion2, llion1, llion2);
      } else {
        illion(NUM, curStringLength, "", "", llion1, llion2);
      }
    } // END OF processRegExMatch()

    // Convert All Tense & Unit To Word
    function funcTenseAndUnit(curString_NUM, hundred, tenseAndUnit) {
      if (curString_NUM !== undefined) {
        processedWord += curString_NUM + hundred;
      }
      let curStringTenseAndUnitWord = wordNum(tenseAndUnit);

      // Don't Display if Last Unit Is Zero
      if (curStringTenseAndUnitWord !== undefined) {
        // Prevent processedWord from Displaying Double Spacing Before (and) if curString_NUM == undefined
        if (curString_NUM !== undefined) {
          processedWord += " and " + curStringTenseAndUnitWord;
        } else {
          processedWord += "and " + curStringTenseAndUnitWord;
        }
      }
    } // END OF funcTenseAndUnit()

    // ******************** LARGE NUMBERS DEFINATION (Start) +++++++++++++++++++++++++++++

    let largeNumbers;

    function curStrLengthFunc(curStrLengthFunc) {
      if (curStrLengthFunc >= 4 && curStrLengthFunc <= 102) {
        curStrLengthFunc >= 4 && curStrLengthFunc <= 6
          ? (largeNumbers = "Thousand")
          : curStrLengthFunc >= 7 && curStrLengthFunc <= 9
          ? (largeNumbers = "Million")
          : curStrLengthFunc >= 10 && curStrLengthFunc <= 12
          ? (largeNumbers = "Billion")
          : curStrLengthFunc >= 13 && curStrLengthFunc <= 15
          ? (largeNumbers = "Trillion")
          : curStrLengthFunc >= 16 && curStrLengthFunc <= 18
          ? (largeNumbers = "Quadrillion")
          : curStrLengthFunc >= 19 && curStrLengthFunc <= 21
          ? (largeNumbers = "Quintillion")
          : curStrLengthFunc >= 22 && curStrLengthFunc <= 24
          ? (largeNumbers = "Sextillion")
          : curStrLengthFunc >= 25 && curStrLengthFunc <= 27
          ? (largeNumbers = "Septillion")
          : curStrLengthFunc >= 28 && curStrLengthFunc <= 30
          ? (largeNumbers = "Octillion")
          : curStrLengthFunc >= 31 && curStrLengthFunc <= 33
          ? (largeNumbers = "Nonillion")
          : curStrLengthFunc >= 34 && curStrLengthFunc <= 36
          ? (largeNumbers = "Decillion")
          : curStrLengthFunc >= 37 && curStrLengthFunc <= 39
          ? (largeNumbers = "Undecillion")
          : curStrLengthFunc >= 40 && curStrLengthFunc <= 42
          ? (largeNumbers = "Duodecillion")
          : curStrLengthFunc >= 43 && curStrLengthFunc <= 45
          ? (largeNumbers = "Tredecillion")
          : curStrLengthFunc >= 46 && curStrLengthFunc <= 48
          ? (largeNumbers = "Quattuordecillion")
          : curStrLengthFunc >= 49 && curStrLengthFunc <= 51
          ? (largeNumbers = "Quindecillion")
          : curStrLengthFunc >= 52 && curStrLengthFunc <= 54
          ? (largeNumbers = "Sedecillion")
          : curStrLengthFunc >= 55 && curStrLengthFunc <= 57
          ? (largeNumbers = "Septendecillion")
          : curStrLengthFunc >= 58 && curStrLengthFunc <= 60
          ? (largeNumbers = "Octodecillion")
          : curStrLengthFunc >= 61 && curStrLengthFunc <= 63
          ? (largeNumbers = "Novendecillion")
          : curStrLengthFunc >= 64 && curStrLengthFunc <= 66
          ? (largeNumbers = "Vigintillion")
          : curStrLengthFunc >= 67 && curStrLengthFunc <= 69
          ? (largeNumbers = "Unvigintillion")
          : curStrLengthFunc >= 70 && curStrLengthFunc <= 72
          ? (largeNumbers = "Duovigintillion")
          : curStrLengthFunc >= 73 && curStrLengthFunc <= 75
          ? (largeNumbers = "Tresvigintillion")
          : curStrLengthFunc >= 76 && curStrLengthFunc <= 78
          ? (largeNumbers = "Quattuorvigintillion")
          : curStrLengthFunc >= 79 && curStrLengthFunc <= 81
          ? (largeNumbers = "Quinvigintillion")
          : curStrLengthFunc >= 82 && curStrLengthFunc <= 84
          ? (largeNumbers = "Sesvigintillion")
          : curStrLengthFunc >= 85 && curStrLengthFunc <= 87
          ? (largeNumbers = "Septemvigintillion")
          : curStrLengthFunc >= 88 && curStrLengthFunc <= 90
          ? (largeNumbers = "Octovigintillion")
          : curStrLengthFunc >= 91 && curStrLengthFunc <= 93
          ? (largeNumbers = "Novemvigintillion")
          : curStrLengthFunc >= 94 && curStrLengthFunc <= 96
          ? (largeNumbers = "Trigintillion")
          : curStrLengthFunc >= 97 && curStrLengthFunc <= 99
          ? (largeNumbers = "Untrigintillion")
          : curStrLengthFunc >= 100 && curStrLengthFunc <= 102
          ? (largeNumbers = "Duotrigintillion")
          : null;
      } else if (curStrLengthFunc >= 103 && curStrLengthFunc <= 33003) {
        largeNumbers = curStrLengthFunc2(curStrLengthFunc);
      }
      return curStrLengthFunc;
    }

    // ********************** LARGE NUMBERS DEFINATION (End) +++++++++++++++++++++++++++++++

    // ***************************** START +++++++++++++++++++++++++++++++++++++++++++++++++
    // ***************************** PROCESSING ++++++++++++++++++++++++++++++++++++++++++++
    // ***************************** NUMBER ++++++++++++++++++++++++++++++++++++++++++++++++

    // Determine The Number Range Using Modulus
    if (curString.length > 3 && curString.length % 3 === 1) {
      /*
       ** Handles DYNAMIC Length Number Of 1, 4, 7, e.t.c (in addition of 3s)
       ** HANDLES UNITS
       ** 1st Check If Number Length Is Defined In Illions
       */
      if (curString.length === curStrLengthFunc(curString.length)) {
        // (1) ************************INIT **************************
        // 1,000,000,000,000,000,000,000,000,000,000,000 etc.
        // Init illion Unit
        // if (curString[0] !== undefined) {
        processedWord += wordNum(curString[0]);
        // }

        // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
        illion(
          1,
          curString.length,
          ` ${largeNumbers}`,
          ` ${largeNumbers}, `,
          ` ${largeNumbers}`,
          ` ${largeNumbers}, `
        );

        // (2-4) ************************************************
        // Don't Display New illion If Previous illion Is Closed
        let remCurStrLength = curString.length - 3;

        // Pre-Number Equvalent To curString_(2 minus 3)
        let preCurStringOf2 = -2;
        // Pre-Number Equvalent To curString[(2 minus 3)]
        let preCurStringOfArr2 = -1;
        // Pre-Number Equvalent To curString[(3 minus 3)]
        let preCurStringOfArr3 = 0;
        // Pre-Number Equvalent To Starting substr Position Of Next Number (5 minus 3)
        let preNum = 1;

        //Loop Through Each Individual Number Unit & Output It's Word Value
        while (remCurStrLength > 3) {
          let preLargeNumber = largeNumbers;
          let preCurStringOf2Plus3 = wordNum(
            `${curString[preCurStringOf2 + 3]}`
          );
          let preCurStringOfArr2Plus3 = `${curString[preCurStringOfArr2 + 3]}`;
          let preCurStringOfArr3Plus3 = `${curString[preCurStringOfArr3 + 3]}`;

          // Get Current Number illion (largeNumbers) ValueBased On Number Length
          curStrLengthFunc(remCurStrLength);

          processWordRegExMatch(
            `${preLargeNumber},`,
            preCurStringOf2Plus3,
            preCurStringOfArr2Plus3,
            preCurStringOfArr3Plus3,
            `${preNum + 3}`,
            curString.length,
            ` ${largeNumbers}`,
            ` ${largeNumbers}, `,
            ` ${largeNumbers}`,
            ` ${largeNumbers}, `
          );

          remCurStrLength -= 3;

          preCurStringOf2 += 3;
          preCurStringOfArr2 += 3;
          preCurStringOfArr3 += 3;
          preNum += 3;
        }

        // (Final 3rd) ***********************FINAL*************************
        // Determine How The Hundred Is Formatted If Previous Million Is Closed eg 1,000
        const hundreds = wordNum(
          curString.substr(
            curString.length - 3,
            curString.length - [curString.length - 1]
          )
        );
        const tens = curString.substr(
          curString.length - 2,
          curString.length - [curString.length - 1]
        );
        const units = curString.substr(
          curString.length - 1,
          curString.length - [curString.length - 1]
        );

        processWordRegExMatch(
          "Thousand,",
          hundreds,
          tens,
          units,
          "",
          "",
          "",
          "",
          "",
          ""
        );

        // End Word With Full Stop
        processedWord += ".";
      } // END OF if(curString.length % 3 === 1)
    } else if (curString.length > 3 && curString.length % 3 === 2) {
      /*
       ** Handles DYNAMIC Length Number Of 2, 5, 8, e.t.c (in addition of 3s)
       ** HANDLES TENS
       ** 1st Check If Number Length Is Defined In Illions
       */
      if (curString.length === curStrLengthFunc(curString.length)) {
        // (1-2) ************************INIT ************************** 10,000,000,000,000,000 etc.
        // Init For Non-Round Tense e.g 12,345,678,901,234,567
        let curStringTenseAndUnitToWord = wordNum(
          Number(curString[0] + curString[1])
        );
        processedWord += curStringTenseAndUnitToWord;

        // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
        illion(
          2,
          curString.length,
          ` ${largeNumbers}`,
          ` ${largeNumbers}, `,
          ` ${largeNumbers}`,
          ` ${largeNumbers}, `
        );

        // (3-5) ************************************************
        // Don't Display New illion If Previous illion Is Closed eg 10,000,000,000,000,000
        let remCurStrLength = curString.length - 3;

        // Pre-Number Equvalent To curString_(3 minus 3)
        let preCurStringOf3 = -1;
        // Pre-Number Equvalent To curString[(3 minus 3)]
        let preCurStringOfArr3 = 0;
        // Pre-Number Equvalent To curString[(4 minus 3)]
        let preCurStringOfArr4 = 1;
        // Pre-Number Equvalent To Starting substr Position Of Next Number (5 minus 3)
        let preNum = 2;

        //Loop Through Each Individual Number Unit & Output It's Word Value
        while (remCurStrLength > 3) {
          let preLargeNumber = largeNumbers;
          let preCurStringOf3Plus3 = wordNum(
            `${curString[preCurStringOf3 + 3]}`
          );
          let preCurStringOfArr3Plus3 = `${curString[preCurStringOfArr3 + 3]}`;
          let preCurStringOfArr4Plus3 = `${curString[preCurStringOfArr4 + 3]}`;

          // Get Current Number illion (largeNumbers) ValueBased On Number Length
          curStrLengthFunc(remCurStrLength);

          processWordRegExMatch(
            `${preLargeNumber},`,
            preCurStringOf3Plus3,
            preCurStringOfArr3Plus3,
            preCurStringOfArr4Plus3,
            `${preNum + 3}`,

            curString.length,
            ` ${largeNumbers}`,
            ` ${largeNumbers}, `,
            ` ${largeNumbers}`,
            ` ${largeNumbers}, `
          );

          remCurStrLength -= 3;

          preCurStringOf3 += 3;
          preCurStringOfArr3 += 3;
          preCurStringOfArr4 += 3;
          preNum += 3;
        }

        // (Final 3rd) ***********************FINAL*************************
        // Determine How The Hundred Is Formatted If Previous Million Is Closed eg 1,000
        const hundreds = wordNum(
          curString.substr(
            curString.length - 3,
            curString.length - [curString.length - 1]
          )
        );
        const tens = curString.substr(
          curString.length - 2,
          curString.length - [curString.length - 1]
        );
        const units = curString.substr(
          curString.length - 1,
          curString.length - [curString.length - 1]
        );

        processWordRegExMatch(
          "Thousand,",
          hundreds,
          tens,
          units,
          "",
          "",
          "",
          "",
          "",
          ""
        );

        // End Word With Full Stop
        processedWord += ".";
      } // END OF if(curString.length % 3 === 2)
    } else if (curString.length > 3 && curString.length % 3 === 0) {
      /*
       ** Handles DYNAMIC Length Number Of 3, 6, 9, e.t.c (in addition of 3s)
       ** HANDLES HUNDREDS
       ** 1st Check If Number Length Is Defined In Illions
       */
      if (curString.length === curStrLengthFunc(curString.length)) {
        // (1-3) ************************INIT ************************** 100,000,000,000,000,000 etc.
        // Init For Non-Round Unit e.g 123,456,789,012,345,678
        // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
        processRegExMatch(
          wordNum(curString[0]),
          curString[1],
          curString[2],
          3,
          curString.length,
          ` ${largeNumbers}`,
          ` ${largeNumbers}, `,
          ` ${largeNumbers}`,
          ` ${largeNumbers}, `
        );

        // (4-6) ************************************************
        // Don't Display New illion If Previous illion Is Closed eg 100,000,000,000,000,000
        let remCurStrLength = curString.length - 3;

        // Pre-Number Equvalent To curString_(4 minus 3)
        let preCurStringOf4 = 0;
        // Pre-Number Equvalent To curString[(4 minus 3)]
        let preCurStringOfArr4 = 1;
        // Pre-Number Equvalent To curString[(5 minus 3)]
        let preCurStringOfArr5 = 2;
        // Pre-Number Equvalent To Starting substr Position Of Next Number (6 minus 3)
        let preNum = 3;

        //Loop Through Each Individual Number Unit & Output It's Word Value
        while (remCurStrLength > 3) {
          let preLargeNumber = largeNumbers;
          let preCurStringOf4Plus3 = wordNum(
            `${curString[preCurStringOf4 + 3]}`
          );
          let preCurStringOfArr4Plus3 = `${curString[preCurStringOfArr4 + 3]}`;
          let preCurStringOfArr5Plus3 = `${curString[preCurStringOfArr5 + 3]}`;

          // Get Current Number illion (largeNumbers) ValueBased On Number Length
          curStrLengthFunc(remCurStrLength);

          processWordRegExMatch(
            `${preLargeNumber},`,
            preCurStringOf4Plus3,
            preCurStringOfArr4Plus3,
            preCurStringOfArr5Plus3,
            `${preNum + 3}`,
            curString.length,
            ` ${largeNumbers}`,
            ` ${largeNumbers}, `,
            ` ${largeNumbers}`,
            ` ${largeNumbers}, `
          );

          remCurStrLength -= 3;

          preCurStringOf4 += 3;
          preCurStringOfArr4 += 3;
          preCurStringOfArr5 += 3;
          preNum += 3;
        }

        // (Final 3rd) ***********************FINAL*************************
        // Determine How The Hundred Is Formatted If Previous Million Is Closed eg 1,000
        const hundreds = wordNum(
          curString.substr(
            curString.length - 3,
            curString.length - [curString.length - 1]
          )
        );
        const tens = curString.substr(
          curString.length - 2,
          curString.length - [curString.length - 1]
        );
        const units = curString.substr(
          curString.length - 1,
          curString.length - [curString.length - 1]
        );

        processWordRegExMatch(
          "Thousand,",
          hundreds,
          tens,
          units,
          "",
          "",
          "",
          "",
          "",
          ""
        );

        // End Word With Full Stop
        processedWord += ".";
      } // END OF if(curString.length % 3 === 0)
    } else if (curString.length <= 3) {
      /*
       ** Handles Numbers Within 3 Length
       ** HANDLES BASE - HUNDREDS, TENSE & UNITS
       */
      // (1-3) ************************INIT ************************** 123 etc.
      if (curString.length === 3) {
        let curStringSubStr = Number(curString.substr(1, curString.length));

        if (curStringSubStr !== 0) {
          let tense_Unit = Number(curString[1] + curString[2]);
          processedWord =
            wordNum(curString[0]) + " Hundred " + "and " + wordNum(tense_Unit);
        } else {
          processedWord = wordNum(curString[0]) + " Hundred";
        }

        // End Word With Full Stop
        processedWord += ".";
      } // END OF if(curString.length === 3)

      // Handles 2 Length Number
      // (1 & 2) ************************INIT ************************** 12 etc.
      if (curString.length === 2) {
        let tense_Unit = Number(curString[0] + curString[1]);
        processedWord = wordNum(tense_Unit);

        // End Word With Full Stop
        processedWord += ".";
      } // END OF if(curString.length === 2)

      // Handles 1 Length Number
      // (1) ************************INIT ************************** 1 etc.
      if (curString.length === 1) {
        if (wordNum(curString[0]) !== undefined) {
          processedWord = wordNum(curString[0]);
        } else {
          processedWord = "Zero";
        }

        // End Word With Full Stop
        processedWord += ".";
      } // END OF if(curString.length === 1)
    } // End Of Dynamically if else (curString.length % 3)

    // ***************************** END +++++++++++++++++++++++++++++++++++++++++++++++++++
    // ***************************** PROCESSING ++++++++++++++++++++++++++++++++++++++++++++
    // ***************************** NUMBER ++++++++++++++++++++++++++++++++++++++++++++++++

    return processedWord;
  }; // END OF processCurString()

  // ***************************** Set Default Tense & Unit ++++++++++++++++++++++++++++++++
  const wordNum = function (num) {
    /*
     ** Num Checking Must Not Include 0, Else It Will Make App Buggy
     ** Leading 0s are Read As undefined and Left Out Within Hundred, Tense & Unit (This Is To Ensure Readability)
     ** 0 ('Zero')  Is Included Within {if(curString.length === 1)} Statement
     */
    let newNum = num - 1;

    let firstNum = [
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
      "Twenty",
      "Twenty-One",
      "Twenty-Two",
      "Twenty-Three",
      "Twenty-Four",
      "Twenty-Five",
      "Twenty-Six",
      "Twenty-Seven",
      "Twenty-Eight",
      "Twenty-Nine",
      "Thirty",
      "Thirty-One",
      "Thirty-Two",
      "Thirty-Three",
      "Thirty-Four",
      "Thirty-Five",
      "Thirty-Six",
      "Thirty-Seven",
      "Thirty-Eight",
      "Thirty-Nine",
      "Forty",
      "Forty-One",
      "Forty-Two",
      "Forty-Three",
      "Forty-Four",
      "Forty-Five",
      "Forty-Six",
      "Forty-Seven",
      "Forty-Eight",
      "Forty-Nine",
      "Fifty",
      "Fifty-One",
      "Fifty-Two",
      "Fifty-Three",
      "Fifty-Four",
      "Fifty-Five",
      "Fifty-Six",
      "Fifty-Seven",
      "Fifty-Eight",
      "Fifty-Nine",
      "Sixty",
      "Sixty-One",
      "Sixty-Two",
      "Sixty-Three",
      "Sixty-Four",
      "Sixty-Five",
      "Sixty-Six",
      "Sixty-Seven",
      "Sixty-Eight",
      "Sixty-Nine",
      "Seventy",
      "Seventy-One",
      "Seventy-Two",
      "Seventy-Three",
      "Seventy-Four",
      "Seventy-Five",
      "Seventy-Six",
      "Seventy-Seven",
      "Seventy-Eight",
      "Seventy-Nine",
      "Eighty",
      "Eighty-One",
      "Eighty-Two",
      "Eighty-Three",
      "Eighty-Four",
      "Eighty-Five",
      "Eighty-Six",
      "Eighty-Seven",
      "Eighty-Eight",
      "Eighty-Nine",
      "Ninety",
      "Ninety-One",
      "Ninety-Two",
      "Ninety-Three",
      "Ninety-Four",
      "Ninety-Five",
      "Ninety-Six",
      "Ninety-Seven",
      "Ninety-Eight",
      "Ninety-Nine",
      "Hundred",
    ];

    return firstNum[newNum];
  }; // END OF wordNum()

  return function (num) {
    return processNum(num);
  }; // END OF process()
})(); // END OF numberToWord

//  *************** EXPORT **************************

//AMD.
if (typeof define === "function" && define.amd) {
  define(function () {
    return JSnumberToWordProcessor;
  });
  // Node and other CommonJS-like environments that support module.exports.
} else if (typeof module !== "undefined" && module.exports) {
  module.exports = JSnumberToWordProcessor;
  //Browser.
} else {
  JSnumberToWordProcessor;
}
