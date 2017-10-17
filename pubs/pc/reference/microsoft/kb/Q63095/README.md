---
layout: page
title: "Q63095: QB Sample Function to Convert from Floating-Point to String"
permalink: /pubs/pc/reference/microsoft/kb/Q63095/
---

## Q63095: QB Sample Function to Convert from Floating-Point to String

	Article: Q63095
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900608-167 B_BasicCom
	Last Modified: 8-AUG-1990
	
	This article provides a code example of a FUNCTION procedure that
	always returns the string equivalent of a real number in the format
	"WholeNumber.Fraction". This works around the usual behavior of the
	STR$ function, which, depending on how a real number is represented in
	binary, returns either a string in the form of "WholeNumber.Fraction"
	or a string in scientific notation.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	STR$ merely converts a SINGLE or DOUBLE into a string based on a real
	number's internal representation. Because some real numbers cannot be
	represented exactly in binary, the STR$ function returns some numbers
	in scientific notation and others in normal notation. The RealString$
	FUNCTION below never returns scientific notation, but always returns
	normal notation.
	
	Code Example
	------------
	
	The code example below provides a FUNCTION procedure that consistently
	converts a real number into a string of the format "WholeNumber.Fraction".
	Please note that this function is provided as a general example of how
	to approach solving this programming problem. It represents only one
	solution; others may be possible.
	
	1. Description: The RealString$ function converts a DOUBLE-precision
	   number into a string, rounding the result to the specified
	   precision.
	
	2. The parameters are as follows:
	
	   a. RealNumber - Any DOUBLE type value.
	
	      Note: You can also pass INTEGER, LONG, and SINGLE types in
	      conjunction with the BASIC keyword CDBL. Of course, STR$ with
	      the INTEGER and LONG types will yield the same result. For
	      example:
	
	         a$ = RealString$(CDBL(b!),10)
	              where b! is a variable of type SINGLE
	
	   b. MaxPrecision - Indicates the maximum number of decimal places
	      you are willing to tolerate to the right of the decimal point.
	      For this function to work properly, MaxPrecision MUST be greater
	      than or equal to the total number of fractional decimal places
	      of the value being passed in RealNumber. For example, if you are
	      calling this function with .005 in RealNumber, you MUST pass a
	      number no less than 3 in MaxPrecision. A number greater than 3
	      still returns "0.005" in RealString$. For example, passing 5
	      through MaxPrecision returns ".005" NOT "0.00500". Zeros are NOT
	      padded in the string to give a result the length of
	      MaxPrecision.
	
	      WARNING: If MaxPrecision is substantially greater than the
	      fractional decimal places in the value passed through parameter
	      RealNumber, extraneous results may be returned in RealString$.
	      For example:
	
	         a$ = RealString$(.05,30) returns
	         "0.0500000007450580596923828125"
	
	3. Returns: RealString$ returns a string containing the string
	   equivalent of RealNumber. For real numbers greater than -1 and less
	   than 1, RealString$ always appends a zero in the 1's digit
	   position. For example, a$ = RealString$(.005,3) returns "0.005" in
	   a$.
	
	   Note: The maximum number of possible digits to the right of the
	   decimal point is determined by the parameter MaxPrecision. (See
	   above.)
	
	'********************  RealString FUNCTION **************************
	FUNCTION RealString$ (RealNumber AS DOUBLE, MaxPrecision AS INTEGER)
	
	  IF MaxPrecision < 0 OR MaxPrecision > 50 THEN
	           RealString$ = ""
	  ELSE
	
	     ' Break the RealNumber into its whole and decimal parts
	     whole& = FIX(RealNumber#)
	     decimal# = ABS(RealNumber# - whole&)
	
	     ' Add in a rounding factor. This compensates for numbers
	     ' such as .05 that can't be stored exactly in binary. For
	     ' example, .05 is represented as .04999. This is the means
	     ' to round it up to .05 as it should be.
	     decimal# = decimal# + 5 * 10 ^ -(MaxPrecision% + 1)
	
	     IF decimal# >= 1 THEN
	        whole& = whole& + 1
	     END IF
	
	     ' Convert the fractional part to a string
	     DecString$ = ""
	
	     FOR i% = 1 TO MaxPrecision + 1
	             DecDigit% = FIX(decimal# * 10)
	             DecString$ = DecString$ + RIGHT$(STR$(DecDigit%), 1)
	             decimal# = decimal# * 10 - FIX(decimal# * 10)
	     NEXT i%
	
	     ' Ensure that the fractional part is equal
	     ' in length to the maximum precision allowed
	     IF LEN(DecString$) > MaxPrecision THEN
	        DecString$ = LEFT$(DecString$, MaxPrecision%)
	
	        ' Remove all trailing zeros from the end of the
	        ' fractional part
	       i% = LEN(DecString$)
	
	       WHILE i% > 0
	          IF MID$(DecString$, i%, 1) = "0" THEN
	             DecString$ = LEFT$(DecString$, i% - 1)
	          ELSE
	             i% = 0
	          END IF
	
	          i% = i% - 1
	       WEND
	
	     END IF
	
	     ' Include the decimal point before the fraction
	     IF DecString$ <> "" THEN
	             DecString$ = "." + DecString$
	     END IF
	
	     ' Compose a string of the whole and fractional parts of
	     ' the real number
	     RealString$ = STR$(whole&) + DecString$
	  END IF      ' (END of IF from very top of function)
	
	END FUNCTION
	
	Sample Program Using This Function
	----------------------------------
	
	DECLARE FUNCTION RealString$ (RealNumber AS DOUBLE, MaxPrecision AS_
	INTEGER)
	
	CLS
	PRINT RealString$(3.1415927, 7)
	PRINT RealString$(437.137827#, 5)
	PRINT RealString$(.000173, 10)
	PRINT RealString$(99.997,2)
	END
	
	Sample Output
	-------------
	
	   3.14157927
	   437.13783
	   0.000173
	   100
