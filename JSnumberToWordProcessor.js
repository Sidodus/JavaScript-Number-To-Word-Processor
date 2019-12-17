const JSnumberToWordProcessor = (function () {

    const processNum = function (num) {
        let curString;
        let processedData = '';
        let processedDataDisplayNum;
        let processedDataCurStringProcessor;
        let processedDataObj;
        let processedDataArray = [];

        // Process Number If Number Is An Array OR A Single Number
        if (Array.isArray(num)) {

            num.forEach(function (cur) {
                curString = cur.toString();

                // Process Number & Get Readable Number With Word
                processedData = numProcessor(curString);

                processedDataDisplayNum = processedData.displayNum;
                processedDataCurStringProcessor = processedData.curStringProcessor;

                // Put Readable Number With Word Into An Object
                processedDataObj = {
                    displayNum: processedDataDisplayNum,
                    displayWord: processedDataCurStringProcessor
                }

                // Parse The Object Into An Array
                processedDataArray.push(processedDataObj)
            });
        } else if (num == BigInt(num)) {

            curString = num.toString();

            // Process Number & Get Readable Number With Word
            processedData = numProcessor(curString);

            processedDataDisplayNum = processedData.displayNum;
            processedDataCurStringProcessor = processedData.curStringProcessor;

            // Put Readable Number With Word Into An Object
            processedDataObj = {
                displayNum: processedDataDisplayNum,
                displayWord: processedDataCurStringProcessor
            }

            // Parse The Object Into An Array
            processedDataArray.push(processedDataObj)
        } // END OF if (Array.isArray(num))

        // Number Processor(Format Number To A Readable Number & Call processCurString() To Process Number To Word)
        function numProcessor(curString) {
            let displayNum = 0;
            let curStringProcessor = '';

            if (curString.length > 18) {
                displayNum = curString.substr(0, curString.length);

                // Call A Function & Pass curString
                curStringProcessor = 'SORRY: THIS APP CURRENTLY SUPPORT ONLY NUMBERS BETWEEN ONE(1) & QUADRILLION ( 10 \u00B9\u2077 )';

            } else if (curString.length === 18) {

                displayNum = curString.substr(0, 3) + ',' + curString.substr(curString.length - 15, 3) + ',' + curString.substr(curString.length - 12, 3) + ',' + curString.substr(curString.length - 9, 3) + ',' + curString.substr(curString.length - 6, 3) + ',' + curString.substr(curString.length - 3, curString.length);

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 17) {

                displayNum = curString.substr(0, 2) + ',' + curString.substr(curString.length - 15, 3) + ',' + curString.substr(curString.length - 12, 3) + ',' + curString.substr(curString.length - 9, 3) + ',' + curString.substr(curString.length - 6, 3) + ',' + curString.substr(curString.length - 3, curString.length);

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 16) {

                displayNum = curString.substr(0, 1) + ',' + curString.substr(curString.length - 15, 3) + ',' + curString.substr(curString.length - 12, 3) + ',' + curString.substr(curString.length - 9, 3) + ',' + curString.substr(curString.length - 6, 3) + ',' + curString.substr(curString.length - 3, curString.length);

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 15) {

                displayNum = curString.substr(0, 3) + ',' + curString.substr(curString.length - 12, 3) + ',' + curString.substr(curString.length - 9, 3) + ',' + curString.substr(curString.length - 6, 3) + ',' + curString.substr(curString.length - 3, curString.length);

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 14) {

                displayNum = curString.substr(0, 2) + ',' + curString.substr(curString.length - 12, 3) + ',' + curString.substr(curString.length - 9, 3) + ',' + curString.substr(curString.length - 6, 3) + ',' + curString.substr(curString.length - 3, curString.length);

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 13) {

                displayNum = curString.substr(0, 1) + ',' + curString.substr(curString.length - 12, 3) + ',' + curString.substr(curString.length - 9, 3) + ',' + curString.substr(curString.length - 6, 3) + ',' + curString.substr(curString.length - 3, curString.length);

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 12) {

                displayNum = curString.substr(curString.length - 12, 3) + ',' + curString.substr(curString.length - 9, 3) + ',' + curString.substr(curString.length - 6, 3) + ',' + curString.substr(curString.length - 3, curString.length);

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 11) {

                displayNum = curString.substr(0, 2) + ',' + curString.substr(curString.length - 9, 3) + ',' + curString.substr(curString.length - 6, 3) + ',' + curString.substr(curString.length - 3, curString.length);

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 10) {

                displayNum = curString.substr(0, 1) + ',' + curString.substr(curString.length - 9, 3) + ',' + curString.substr(curString.length - 6, 3) + ',' + curString.substr(curString.length - 3, curString.length);

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 9) {

                displayNum = curString.substr(curString.length - 9, 3) + ',' + curString.substr(curString.length - 6, 3) + ',' + curString.substr(curString.length - 3, curString.length);

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 8) {

                displayNum = curString.substr(0, 2) + ',' + curString.substr(curString.length - 6, 3) + ',' + curString.substr(curString.length - 3, curString.length);

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 7) {

                displayNum = curString.substr(0, 1) + ',' + curString.substr(curString.length - 6, 3) + ',' + curString.substr(curString.length - 3, curString.length);

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 6) {

                displayNum = curString.substr(0, 3) + ',' + curString.substr(curString.length - 3, curString.length);

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 5) {

                displayNum = curString.substr(0, 2) + ',' + curString.substr(curString.length - 3, curString.length);

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 4) {

                displayNum = curString.substr(0, 1) + ',' + curString.substr(curString.length - 3, curString.length);

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 3) {
                displayNum = curString;

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 2) {
                displayNum = curString;

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);

            } else if (curString.length === 1) {
                displayNum = curString;

                // Call A Function & Pass curString
                curStringProcessor = processCurString(curString);
            }

            return {
                displayNum,
                curStringProcessor
            }
        } // END OF numProcessor()

        return processedDataArray
    } // END OF processNum(num)

    // Process Number To Word
    const processCurString = function (curString) {
        let curString_18, curString_17, curString_16, curString_15, curString_14, curString_13, curString_12, curString_11, curString_10, curString_9, curString_8, curString_7, curString_6, curString_5, curString_4, curString_3, curString_2, curString_1;

        let curStringTenseAndUnit = 0;
        let processedWord = '';
        let processedWordDummy = '';

        curString_1 = wordNum(Number(curString[0]));
        curString_2 = wordNum(Number(curString[1]));
        curString_3 = wordNum(Number(curString[2]));
        curString_4 = wordNum(Number(curString[3]));
        curString_5 = wordNum(Number(curString[4]));
        curString_6 = wordNum(Number(curString[5]));
        curString_7 = wordNum(Number(curString[6]));
        curString_8 = wordNum(Number(curString[7]));
        curString_9 = wordNum(Number(curString[8]));
        curString_10 = wordNum(Number(curString[9]));
        curString_11 = wordNum(Number(curString[10]));
        curString_12 = wordNum(Number(curString[11]));
        curString_13 = wordNum(Number(curString[12]));
        curString_14 = wordNum(Number(curString[13]));
        curString_15 = wordNum(Number(curString[14]));
        curString_16 = wordNum(Number(curString[15]));
        curString_17 = wordNum(Number(curString[16]));
        curString_18 = wordNum(Number(curString[17]));

        // Format The illion eg Trillion, Billion, Million, Thousand etc
        // NOTE: The mainWord2, & alternateWord2 is For processedWordDummy RegEX match()
        function illion(subStrStart, subStrLength, mainWord, alternateWord, mainWord2, alternateWord2) {

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
        function processWordRegExMatch(llionRegEx, curStringNUMWord, curStringNUM1, curStringNUM2, NUM, curStringLength, llion1, llion2, llion3, llion4) {

            let ifMatchedRegEx = llionRegEx;

            if (processedWordDummy.match(ifMatchedRegEx)) {
                // NOTE: The 2nd Set Of illion(3&4) would Be Parsed To processedWordDummy For RegEX match()
                processRegExMatch(curStringNUMWord, curStringNUM1, curStringNUM2, NUM, curStringLength, llion1, llion2, llion3, llion4);
            }
        } // END OF processWordRegExMatch()


        function processRegExMatch(curString2Word, curString1, curString2, NUM, curStringLength, llion1, llion2) {
            // Bind The Tense & Unit to Number
            curStringTenseAndUnit = Number(curString1 + curString2);

            // Handle The Hundred, Tense, & Unit
            funcTenseAndUnit(curString2Word, ' Hundred', curStringTenseAndUnit);

            // Determine How The illion Is Formatted eg. Trillion, Billion, Million etc.
            // This Reformats The Words If The Remaining Number Are Just LEADING ZERO's
            // =================================================================================
            // NOTE: The llion1, & llion2 is To Be Parsed To processedWordDummy For RegEX match()
            if (curString2Word !== undefined || curStringTenseAndUnit != 0) {

                illion(NUM, curStringLength, llion1, llion2, llion1, llion2);
            } else {

                illion(NUM, curStringLength, '', '', llion1, llion2);
            }
        } // END OF processRegExMatch()

        // Convert All Tense & Unit To Word
        function funcTenseAndUnit(curString_NUM, hundred, tenseAndUnit) {

            if (curString_NUM !== undefined) {
                processedWord += curString_NUM + hundred;
            }
            curStringTenseAndUnitWord = wordNum(tenseAndUnit);

            // Don't Display if Last Unit Is Zero
            if (curStringTenseAndUnitWord !== undefined) {
                // Prevent processedWord from Displaying Double Spacing Before (and) if curString_NUM == undefined
                if (curString_NUM !== undefined) {
                    processedWord += ' and ' + curStringTenseAndUnitWord;
                } else {
                    processedWord += 'and ' + curStringTenseAndUnitWord;
                }
            }
        } // END OF funcTenseAndUnit()

        // Handles 18 Length Number
        if (curString.length === 18) {

            // (1-3) ************************INIT ************************** 100,000,000,000,000,000 etc.
            // Init For Non-Round Unit e.g 123,456,789,012,345,678
            // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
            processRegExMatch(curString_1, curString[1], curString[2], 3, curString.length, ' Quadrillion', ' Quadrillion, ', ' Quadrillion', ' Quadrillion, ');

            // (4-6) ************************************************
            // Don't Display Trillion If Previous Quadrillion Is Closed eg 100,000,000,000,000,000
            processWordRegExMatch("Quadrillion,", curString_4, curString[4], curString[5], 6, curString.length, ' Trillion', ' Trillion, ', ' Trillion', ' Trillion, ');

            // (7-9) ************************************************
            // Don't Display Billion If Previous Trillion Is Closed eg 100,000,000,000,000
            processWordRegExMatch("Trillion,", curString_7, curString[7], curString[8], 9, curString.length, ' Billion', ' Billion, ', ' Billion', ' Billion, ');

            // (10-12) ************************************************
            // Don't Display Million If Previous Billion Is Closed eg 100,000,000,000
            processWordRegExMatch("Billion,", curString_10, curString[10], curString[11], 12, curString.length, ' Million', ' Million, ', ' Million', ' Million, ');

            // (13-15) ************************************************
            // Don't Display Thousand If Previous Million Is Closed eg 100,000,000
            processWordRegExMatch("Million,", curString_13, curString[13], curString[14], 15, curString.length, ' Thousand', ' Thousand, ', ' Thousand', ' Thousand, ');

            // (16-18) ***********************FINAL*************************
            // Determine How The Hundred Is Formatted If Previous Thousand Is Closed eg 100,000
            processWordRegExMatch("Thousand,", curString_16, curString[16], curString[17], '', '', '', '', '', '');

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 18)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 17 Length Number
        if (curString.length === 17) {

            // (1-2) ************************INIT ************************** 10,000,000,000,000,000 etc.
            // Init For Non-Round Tense e.g 12,345,678,901,234,567
            let curStringTenseAndUnitToWord = wordNum(Number(curString[0] + curString[1]));
            processedWord += curStringTenseAndUnitToWord;

            // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
            illion(2, curString.length, ' Quadrillion', ' Quadrillion, ', ' Quadrillion', ' Quadrillion, ');

            // (3-5) ************************************************
            // Don't Display Trillion If Previous Quadrillion Is Closed eg 10,000,000,000,000,000
            processWordRegExMatch("Quadrillion,", curString_3, curString[3], curString[4], 5, curString.length, ' Trillion', ' Trillion, ', ' Trillion', ' Trillion, ');

            // (6-8) ************************************************
            // Don't Display Billion If Previous Trillion Is Closed eg 10,000,000,000,000
            processWordRegExMatch("Trillion,", curString_6, curString[6], curString[7], 8, curString.length, ' Billion', ' Billion, ', ' Billion', ' Billion, ');

            // (9-11) ************************************************
            // Don't Display Million If Previous Billion Is Closed eg 10,000,000,000
            processWordRegExMatch("Billion,", curString_9, curString[9], curString[10], 11, curString.length, ' Million', ' Million, ', ' Million', ' Million, ');

            // (12-14) ************************************************
            // Don't Display Thousand If Previous Million Is Closed eg 10,000,000
            processWordRegExMatch("Million,", curString_12, curString[12], curString[13], 14, curString.length, ' Thousand', ' Thousand, ', ' Thousand', ' Thousand, ');

            // (15-17) ***********************FINAL*************************
            // Determine How The Hundred Is Formatted If Previous Thousand Is Closed eg 10,000
            processWordRegExMatch("Thousand,", curString_15, curString[15], curString[16], '', '', '', '', '', '');

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 17)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 16 Length Number
        if (curString.length === 16) {

            // (1) ************************INIT ************************** 1,000,000,000,000,000 etc.
            // Init illion Unit
            if (curString_1 !== undefined) {
                processedWord += curString_1;
            }
            // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
            illion(1, curString.length, ' Quadrillion', ' Quadrillion, ', ' Quadrillion', ' Quadrillion, ');

            // (2-4) ************************************************
            // Don't Display Trillion If Previous Quadrillion Is Closed eg 1,000,000,000,000,000
            processWordRegExMatch("Quadrillion,", curString_2, curString[2], curString[3], 4, curString.length, ' Trillion', ' Trillion, ', ' Trillion', ' Trillion, ');

            // (5-7) ************************************************
            // Don't Display Billion If Previous Trillion Is Closed eg 1,000,000,000,000
            processWordRegExMatch("Trillion,", curString_5, curString[5], curString[6], 7, curString.length, ' Billion', ' Billion, ', ' Billion', ' Billion, ');

            // (8-10) ************************************************
            // Don't Display Million If Previous Billion Is Closed eg 1,000,000,000
            processWordRegExMatch("Billion,", curString_8, curString[8], curString[9], 10, curString.length, ' Million', ' Million, ', ' Million', ' Million, ');

            // 11-13) ************************************************
            // Don't Display Thousand If Previous Million Is Closed eg 1,000,000
            processWordRegExMatch("Million,", curString_11, curString[11], curString[12], 13, curString.length, ' Thousand', ' Thousand, ', ' Thousand', ' Thousand, ');

            // (14-16) ***********************FINAL*************************
            // Determine How The Hundred Is Formatted If Previous Million Is Closed eg 1,000
            processWordRegExMatch("Thousand,", curString_14, curString[14], curString[15], '', '', '', '', '', '');

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 16)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 15 Length Number
        if (curString.length === 15) {

            // (1-3) ************************INIT ************************** 100,000,000,000,000 etc.
            // Init For Non-Round Unit e.g 123,456,789,012,345
            // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
            processRegExMatch(curString_1, curString[1], curString[2], 3, curString.length, ' Trillion', ' Trillion, ', ' Trillion', ' Trillion, ');

            // (4-6) ************************************************
            // Don't Display Billion If Previous Trillion Is Closed eg 100,000,000,000,000
            processWordRegExMatch("Trillion,", curString_4, curString[4], curString[5], 6, curString.length, ' Billion', ' Billion, ', ' Billion', ' Billion, ');

            // (7-9) ************************************************
            // Don't Display Million If Previous Billion Is Closed eg 100,000,000,000
            processWordRegExMatch("Billion,", curString_7, curString[7], curString[8], 9, curString.length, ' Million', ' Million, ', ' Million', ' Million, ');

            // (10-12) ************************************************
            // Don't Display Thousand If Previous Million Is Closed eg 100,000,000
            processWordRegExMatch("Million,", curString_10, curString[10], curString[11], 12, curString.length, ' Thousand', ' Thousand, ', ' Thousand', ' Thousand, ');

            // (13-15) ***********************FINAL*************************
            // Determine How The Hundred Is Formatted If Previous Thousand Is Closed eg 100,000
            processWordRegExMatch("Thousand,", curString_13, curString[13], curString[14], '', '', '', '', '', '');

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 15)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 14 Length Number
        if (curString.length === 14) {

            // (1-2) ************************INIT ************************** 10,000,000,000,000 etc.
            // Init For Non-Round Tense e.g 12,345,678,901,234
            let curStringTenseAndUnitToWord = wordNum(Number(curString[0] + curString[1]));
            processedWord += curStringTenseAndUnitToWord;

            // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
            illion(2, curString.length, ' Trillion', ' Trillion, ', ' Trillion', ' Trillion, ');

            // (3-5) ************************************************
            // Don't Display Billion If Previous Billion Is Closed eg 10,000,000,000,000
            processWordRegExMatch("Trillion,", curString_3, curString[3], curString[4], 5, curString.length, ' Billion', ' Billion, ', ' Billion', ' Billion, ');

            // (6-8) ************************************************
            // Don't Display Billion If Previous Billion Is Closed eg 10,000,000,000
            processWordRegExMatch("Billion,", curString_6, curString[6], curString[7], 8, curString.length, ' Million', ' Million, ', ' Million', ' Million, ');

            // (9-11) ************************************************
            // Don't Display Million If Previous Million Is Closed eg 10,000,000
            processWordRegExMatch("Million,", curString_9, curString[9], curString[10], 11, curString.length, ' Thousand', ' Thousand, ', ' Thousand', ' Thousand, ');

            // (12-14) ***********************FINAL*************************
            // Determine How The Hundred Is Formatted If Previous Thousand Is Closed eg 10,000
            processWordRegExMatch("Thousand,", curString_12, curString[12], curString[13], '', '', '', '', '', '');

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 14)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 13 Length Number
        if (curString.length === 13) {

            // (1) ************************INIT ************************** 1,000,000,000,000 etc.
            // Init illion Unit
            if (curString_1 !== undefined) {
                processedWord += curString_1;
            }
            // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
            illion(1, curString.length, ' Trillion', ' Trillion, ', ' Trillion', ' Trillion, ');

            // (2-4) ************************************************
            // Don't Display Billion If Previous Trillion Is Closed eg 1,000,000,000,000
            processWordRegExMatch("Trillion,", curString_2, curString[2], curString[3], 4, curString.length, ' Billion', ' Billion, ', ' Billion', ' Billion, ');

            // (5-7) ************************************************
            // Don't Display Million If Previous Billion Is Closed eg 1,000,000,000
            processWordRegExMatch("Billion,", curString_5, curString[5], curString[6], 7, curString.length, ' Million', ' Million, ', ' Million', ' Million, ');

            // (8-10) ************************************************
            // Don't Display Thousand If Previous Million Is Closed eg 1,000,000
            processWordRegExMatch("Million,", curString_8, curString[8], curString[9], 10, curString.length, ' Thousand', ' Thousand, ', ' Thousand', ' Thousand, ');

            // (11-13) ***********************FINAL*************************
            // Determine How The Hundred Is Formatted If Previous Million Is Closed eg 1,000
            processWordRegExMatch("Thousand,", curString_11, curString[11], curString[12], '', '', '', '', '', '');

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 13)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 12 Length Number
        if (curString.length === 12) {

            // (1-3) ************************INIT ************************** 100,000,000,000 etc.
            // Init For Non-Round Unit e.g 123,456,789,012
            // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
            processRegExMatch(curString_1, curString[1], curString[2], 3, curString.length, ' Billion', ' Billion, ', ' Billion', ' Billion, ');

            // (4-6) ************************************************
            // Don't Display Million If Previous Billion Is Closed eg 100,000,000,000
            processWordRegExMatch("Billion,", curString_4, curString[4], curString[5], 6, curString.length, ' Million', ' Million, ', ' Million', ' Million, ');

            // (7-9) ************************************************
            // Don't Display Thousand If Previous Million Is Closed eg 100,000,000
            processWordRegExMatch("Million,", curString_7, curString[7], curString[8], 9, curString.length, ' Thousand', ' Thousand, ', ' Thousand', ' Thousand, ');

            // (10-12) ***********************FINAL*************************
            // Determine How The Hundred Is Formatted If Previous Thousand Is Closed eg 100,000
            processWordRegExMatch("Thousand,", curString_10, curString[10], curString[11], '', '', '', '', '', '');

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 12)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 11 Length Number
        if (curString.length === 11) {

            // (1-2) ************************INIT ************************** 10,000,000,000 etc.
            // Init For Non-Round Tense e.g 12,345,678,901
            let curStringTenseAndUnitToWord = wordNum(Number(curString[0] + curString[1]));
            processedWord += curStringTenseAndUnitToWord;

            // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
            illion(2, curString.length, ' Billion', ' Billion, ', ' Billion', ' Billion, ');

            // (3-5) ************************************************
            // Don't Display Billion If Previous Billion Is Closed eg 10,000,000,000
            processWordRegExMatch("Billion,", curString_3, curString[3], curString[4], 5, curString.length, ' Million', ' Million, ', ' Million', ' Million, ');

            // (6-8) ************************************************
            // Don't Display Million If Previous Million Is Closed eg 10,000,000
            processWordRegExMatch("Million,", curString_6, curString[6], curString[7], 8, curString.length, ' Thousand', ' Thousand, ', ' Thousand', ' Thousand, ');

            // (9-11) ***********************FINAL*************************
            // Determine How The Hundred Is Formatted If Previous Thousand Is Closed eg 10,000
            processWordRegExMatch("Thousand,", curString_9, curString[9], curString[10], '', '', '', '', '', '');

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 11)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 10 Length Number
        if (curString.length === 10) {

            // (1) ************************INIT ************************** 1,000,000,000 etc.
            // Init illion Unit
            if (curString_1 !== undefined) {
                processedWord += curString_1;
            }
            // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
            illion(1, curString.length, ' Billion', ' Billion, ', ' Billion', ' Billion, ');

            // (2-4) ************************************************
            // Don't Display Million If Previous Billion Is Closed eg 1,000,000,000
            processWordRegExMatch("Billion,", curString_2, curString[2], curString[3], 4, curString.length, ' Million', ' Million, ', ' Million', ' Million, ');

            // (5-7) ************************************************
            // Don't Display Thousand If Previous Million Is Closed eg 1,000,000
            processWordRegExMatch("Million,", curString_5, curString[5], curString[6], 7, curString.length, ' Thousand', ' Thousand, ', ' Thousand', ' Thousand, ');

            // (8-10) ***********************FINAL*************************
            // Determine How The Hundred Is Formatted If Previous Million Is Closed eg 1,000
            processWordRegExMatch("Thousand,", curString_8, curString[8], curString[9], '', '', '', '', '', '');

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 10)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 9 Length Number
        if (curString.length === 9) {

            // (1-3) ************************INIT ************************** 100,000,000 etc.
            // Init For Non-Round Unit e.g 123,456,789
            // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
            processRegExMatch(curString_1, curString[1], curString[2], 3, curString.length, ' Million', ' Million, ', ' Million', ' Million, ');

            // (4-6) ************************************************
            // Don't Display Million If Previous Billion Is Closed eg 100,000,000
            processWordRegExMatch("Million,", curString_4, curString[4], curString[5], 6, curString.length, ' Thousand', ' Thousand, ', ' Thousand', ' Thousand, ');

            // (7-9) ***********************FINAL*************************
            // Determine How The Hundred Is Formatted If Previous Thousand Is Closed eg 100,000
            processWordRegExMatch("Thousand,", curString_7, curString[7], curString[8], '', '', '', '', '', '');

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 9)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 8 Length Number
        if (curString.length === 8) {

            // (1-2) ************************INIT ************************** 10,000,000 etc.
            // Init For Non-Round Tense e.g 12,345,678
            let curStringTenseAndUnitToWord = wordNum(Number(curString[0] + curString[1]));
            processedWord += curStringTenseAndUnitToWord;

            // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
            illion(2, curString.length, ' Million', ' Million, ', ' Million', ' Million, ');

            // (3-5) ************************************************
            // Don't Display Thousand If Previous Million Is Closed eg 10,000,000
            processWordRegExMatch("Million,", curString_3, curString[3], curString[4], 5, curString.length, ' Thousand', ' Thousand, ', ' Thousand', ' Thousand, ');

            // (6-8) ***********************FINAL*************************
            // Determine How The Hundred Is Formatted If Previous Thousand Is Closed eg 10,000
            processWordRegExMatch("Thousand,", curString_6, curString[6], curString[7], '', '', '', '', '', '');

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 8)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 7 Length Number
        if (curString.length === 7) {

            // (1) ************************INIT ************************** 1,000,000 etc.
            // Init illion Unit
            if (curString_1 !== undefined) {
                processedWord += curString_1;
            }
            // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
            illion(1, curString.length, ' Million', ' Million, ', ' Million', ' Million, ');

            // (2-4) ************************************************
            // Don't Display Million If Previous Billion Is Closed eg 1,000,000
            processWordRegExMatch("Million,", curString_2, curString[2], curString[3], 4, curString.length, ' Thousand', ' Thousand, ', ' Thousand', ' Thousand, ');

            // (5-7) ***********************FINAL*************************
            // Determine How The Hundred Is Formatted If Previous Million Is Closed eg 1,000
            processWordRegExMatch("Thousand,", curString_5, curString[5], curString[6], '', '', '', '', '', '');

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 7)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 6 Length Number
        if (curString.length === 6) {

            // (1-3) ************************INIT ************************** 100,000 etc.
            // Init For Non-Round Unit e.g 123,456
            // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
            processRegExMatch(curString_1, curString[1], curString[2], 3, curString.length, ' Thousand', ' Thousand, ', ' Thousand', ' Thousand, ');

            // (4-6) ***********************FINAL*************************
            // Determine How The Hundred Is Formatted If Previous Thousand Is Closed eg 100,000
            processWordRegExMatch("Thousand,", curString_4, curString[4], curString[5], '', '', '', '', '', '');

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 6)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 5 Length Number
        if (curString.length === 5) {

            // (1-2) ************************INIT ************************** 10,000 etc.
            // Init For Non-Round Tense e.g 12,345
            let curStringTenseAndUnitToWord = wordNum(Number(curString[0] + curString[1]));
            processedWord += curStringTenseAndUnitToWord;

            // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
            illion(2, curString.length, ' Thousand', ' Thousand, ', ' Thousand', ' Thousand, ');

            // (3-5) ***********************FINAL*************************
            // Determine How The Hundred Is Formatted If Previous Thousand Is Closed eg 10,000
            processWordRegExMatch("Thousand,", curString_3, curString[3], curString[4], '', '', '', '', '', '');

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 5)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 4 Length Number
        if (curString.length === 4) {

            // (1) ************************INIT ************************** 1,000 etc.
            // Init illion Unit
            if (curString_1 !== undefined) {
                processedWord += curString_1;
            }
            // NOTE: The 2nd Set Of illion would Be Parsed To processedWordDummy For RegEX match()
            illion(1, curString.length, ' Thousand', ' Thousand, ', ' Thousand', ' Thousand, ');

            // (2-4) ***********************FINAL*************************
            // Determine How The Hundred Is Formatted If Previous Million Is Closed eg 1,000
            processWordRegExMatch("Thousand,", curString_2, curString[2], curString[3], '', '', '', '', '', '');

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 4)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 3 Length Number
        // (1-3) ************************INIT ************************** 123 etc.
        if (curString.length === 3) {
            let curStringSubStr = Number(curString.substr(1, curString.length));

            if (curStringSubStr !== 0) {
                let tense_Unit = Number(curString[1] + curString[2]);
                processedWord = curString_1 + ' Hundred ' + 'and ' + wordNum(tense_Unit);
            } else {
                processedWord = curString_1 + ' Hundred';
            }

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 3)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 2 Length Number
        // (1 & 2) ************************INIT ************************** 12 etc.
        if (curString.length === 2) {
            let tense_Unit = Number(curString[0] + curString[1]);
            processedWord = wordNum(tense_Unit);

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 2)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        // Handles 1 Length Number
        // (1) ************************INIT ************************** 1 etc.
        if (curString.length === 1) {
            if (curString_1 !== undefined) {
                processedWord = curString_1;
            } else {
                processedWord = 'Zero';
            }

            // End Word With Full Stop
            processedWord += '.';
        } // END OF if(curString.length === 1)

        // ((((((((((((((((((((((((((((((((((((((()))))))))))))))))))))))))))))))))))))))

        return processedWord;
    } // END OF processCurString()

    // Default Tense & Unit
    const wordNum = function (num) {
        let firstNum;

        /*
         ** Num Checking Must Not Include 0, Else It Will Make App Buggy
         ** Leading 0s are Read As undefined and Left Out Within Hundred, Tense & Unit (This Is To Ensure Readability)
         ** 0 ('Zero')  Is Included Within {if(curString.length === 1)} Statement
         */

        if (num === 1) {
            firstNum = 'One';
            return firstNum;
        } else if (num === 2) {
            firstNum = 'Two';
            return firstNum;
        } else if (num === 3) {
            firstNum = 'Three';
            return firstNum;
        } else if (num === 4) {
            firstNum = 'Four';
            return firstNum;
        } else if (num === 5) {
            firstNum = 'Five';
            return firstNum;
        } else if (num === 6) {
            firstNum = 'Six';
            return firstNum;
        } else if (num === 7) {
            firstNum = 'Seven';
            return firstNum;
        } else if (num === 8) {
            firstNum = 'Eight';
            return firstNum;
        } else if (num === 9) {
            firstNum = 'Nine';
            return firstNum;
        } else if (num === 10) {
            firstNum = 'Ten';
            return firstNum;
        } else if (num === 11) {
            firstNum = 'Eleven';
            return firstNum;
        } else if (num === 12) {
            firstNum = 'Twelve';
            return firstNum;
        } else if (num === 13) {
            firstNum = 'Thirteen';
            return firstNum;
        } else if (num === 14) {
            firstNum = 'Fourteen';
            return firstNum;
        } else if (num === 15) {
            firstNum = 'Fifteen';
            return firstNum;
        } else if (num === 16) {
            firstNum = 'Sixteen';
            return firstNum;
        } else if (num === 17) {
            firstNum = 'Seventeen';
            return firstNum;
        } else if (num === 18) {
            firstNum = 'Eighteen';
            return firstNum;
        } else if (num === 19) {
            firstNum = 'Nineteen';
            return firstNum;
        } else if (num === 20) {
            firstNum = 'Twenty';
            return firstNum;
        } else if (num === 21) {
            firstNum = 'Twenty-One';
            return firstNum;
        } else if (num === 22) {
            firstNum = 'Twenty-Two';
            return firstNum;
        } else if (num === 23) {
            firstNum = 'Twenty-Three';
            return firstNum;
        } else if (num === 24) {
            firstNum = 'Twenty-Four';
            return firstNum;
        } else if (num === 25) {
            firstNum = 'Twenty-Five';
            return firstNum;
        } else if (num === 26) {
            firstNum = 'Twenty-Six';
            return firstNum;
        } else if (num === 27) {
            firstNum = 'Twenty-Seven';
            return firstNum;
        } else if (num === 28) {
            firstNum = 'Twenty-Eight';
            return firstNum;
        } else if (num === 29) {
            firstNum = 'Twenty-Nine';
            return firstNum;
        } else if (num === 30) {
            firstNum = 'Thirty';
            return firstNum;
        } else if (num === 31) {
            firstNum = 'Thirty-One';
            return firstNum;
        } else if (num === 32) {
            firstNum = 'Thirty-Two';
            return firstNum;
        } else if (num === 33) {
            firstNum = 'Thirty-Three';
            return firstNum;
        } else if (num === 34) {
            firstNum = 'Thirty-Four';
            return firstNum;
        } else if (num === 35) {
            firstNum = 'Thirty-Five';
            return firstNum;
        } else if (num === 36) {
            firstNum = 'Thirty-Six';
            return firstNum;
        } else if (num === 37) {
            firstNum = 'Thirty-Seven';
            return firstNum;
        } else if (num === 38) {
            firstNum = 'Thirty-Eight';
            return firstNum;
        } else if (num === 39) {
            firstNum = 'Thirty-Nine';
            return firstNum;
        } else if (num === 40) {
            firstNum = 'Forty';
            return firstNum;
        } else if (num === 41) {
            firstNum = 'Forty-One';
            return firstNum;
        } else if (num === 42) {
            firstNum = 'Forty-Two';
            return firstNum;
        } else if (num === 43) {
            firstNum = 'Forty-Three';
            return firstNum;
        } else if (num === 44) {
            firstNum = 'Forty-Four';
            return firstNum;
        } else if (num === 45) {
            firstNum = 'Forty-Five';
            return firstNum;
        } else if (num === 46) {
            firstNum = 'Forty-Six';
            return firstNum;
        } else if (num === 47) {
            firstNum = 'Forty-Seven';
            return firstNum;
        } else if (num === 48) {
            firstNum = 'Forty-Eight';
            return firstNum;
        } else if (num === 49) {
            firstNum = 'Forty-Nine';
            return firstNum;
        } else if (num === 50) {
            firstNum = 'Fifty';
            return firstNum;
        } else if (num === 51) {
            firstNum = 'Fifty-One';
            return firstNum;
        } else if (num === 52) {
            firstNum = 'Fifty-Two';
            return firstNum;
        } else if (num === 53) {
            firstNum = 'Fifty-Three';
            return firstNum;
        } else if (num === 54) {
            firstNum = 'Fifty-Four';
            return firstNum;
        } else if (num === 55) {
            firstNum = 'Fifty-Five';
            return firstNum;
        } else if (num === 56) {
            firstNum = 'Fifty-Six';
            return firstNum;
        } else if (num === 57) {
            firstNum = 'Fifty-Seven';
            return firstNum;
        } else if (num === 58) {
            firstNum = 'Fifty-Eight';
            return firstNum;
        } else if (num === 59) {
            firstNum = 'Fifty-Nine';
            return firstNum;
        } else if (num === 60) {
            firstNum = 'Sixty';
            return firstNum;
        } else if (num === 61) {
            firstNum = 'Sixty-One';
            return firstNum;
        } else if (num === 62) {
            firstNum = 'Sixty-Two';
            return firstNum;
        } else if (num === 63) {
            firstNum = 'Sixty-Three';
            return firstNum;
        } else if (num === 64) {
            firstNum = 'Sixty-Four';
            return firstNum;
        } else if (num === 65) {
            firstNum = 'Sixty-Five';
            return firstNum;
        } else if (num === 66) {
            firstNum = 'Sixty-Six';
            return firstNum;
        } else if (num === 67) {
            firstNum = 'Sixty-Seven';
            return firstNum;
        } else if (num === 68) {
            firstNum = 'Sixty-Eight';
            return firstNum;
        } else if (num === 69) {
            firstNum = 'Sixty-Nine';
            return firstNum;
        } else if (num === 70) {
            firstNum = 'Seventy';
            return firstNum;
        } else if (num === 71) {
            firstNum = 'Seventy-One';
            return firstNum;
        } else if (num === 72) {
            firstNum = 'Seventy-Two';
            return firstNum;
        } else if (num === 73) {
            firstNum = 'Seventy-Three';
            return firstNum;
        } else if (num === 74) {
            firstNum = 'Seventy-Four';
            return firstNum;
        } else if (num === 75) {
            firstNum = 'Seventy-Five';
            return firstNum;
        } else if (num === 76) {
            firstNum = 'Seventy-Six';
            return firstNum;
        } else if (num === 77) {
            firstNum = 'Seventy-Seven';
            return firstNum;
        } else if (num === 78) {
            firstNum = 'Seventy-Eight';
            return firstNum;
        } else if (num === 79) {
            firstNum = 'Seventy-Nine';
            return firstNum;
        } else if (num === 80) {
            firstNum = 'Eighty';
            return firstNum;
        } else if (num === 81) {
            firstNum = 'Eighty-One';
            return firstNum;
        } else if (num === 82) {
            firstNum = 'Eighty-Two';
            return firstNum;
        } else if (num === 83) {
            firstNum = 'Eighty-Three';
            return firstNum;
        } else if (num === 84) {
            firstNum = 'Eighty-Four';
            return firstNum;
        } else if (num === 85) {
            firstNum = 'Eighty-Five';
            return firstNum;
        } else if (num === 86) {
            firstNum = 'Eighty-Six';
            return firstNum;
        } else if (num === 87) {
            firstNum = 'Eighty-Seven';
            return firstNum;
        } else if (num === 88) {
            firstNum = 'Eighty-Eight';
            return firstNum;
        } else if (num === 89) {
            firstNum = 'Eighty-Nine';
            return firstNum;
        } else if (num === 90) {
            firstNum = 'Ninety';
            return firstNum;
        } else if (num === 91) {
            firstNum = 'Ninety-One';
            return firstNum;
        } else if (num === 92) {
            firstNum = 'Ninety-Two';
            return firstNum;
        } else if (num === 93) {
            firstNum = 'Ninety-Three';
            return firstNum;
        } else if (num === 94) {
            firstNum = 'Ninety-Four';
            return firstNum;
        } else if (num === 95) {
            firstNum = 'Ninety-Five';
            return firstNum;
        } else if (num === 96) {
            firstNum = 'Ninety-Six';
            return firstNum;
        } else if (num === 97) {
            firstNum = 'Ninety-Seven';
            return firstNum;
        } else if (num === 98) {
            firstNum = 'Ninety-Eight';
            return firstNum;
        } else if (num === 99) {
            firstNum = 'Ninety-Nine';
            return firstNum;
        } else if (num === 100) {
            firstNum = 'Hundred';
            return firstNum;
        }
    } // END OF wordNum()


    return function (num) {
            return processNum(num)
        } // END OF process()
})() // END OF numberToWord
