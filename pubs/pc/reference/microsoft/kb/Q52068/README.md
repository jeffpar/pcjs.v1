---
layout: page
title: "Q52068: Example of Using NPV and IRR Financial Functions in BASIC 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q52068/
---

## Q52068: Example of Using NPV and IRR Financial Functions in BASIC 7.00

	Article: Q52068
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 14-JAN-1990
	
	This article explains how to use the NPV and IRR financial functions
	in Microsoft BASIC PDS (Professional Development System) Version 7.00
	for MS-DOS and MS OS/2.
	
	Note that the NPV#, IRR#, and MIRR# functions are used for investments
	that are a series of nonconstant cash payments made at equal
	intervals. You pass the series of nonconstant payments in an array.
	[This contrasts with the financial functions for annuity investments
	(FV#, IPmt#, Rate#, NPer#, PV#, Pmt#, and PPmt#). In an annuity, each
	cash payment is the same constant amount, made at equal intervals.]
	
	The present value (PV) of a future cash receipt is the amount of money
	that, if received today, would be considered equivalent to the future
	receipt, at a given interest rate. The present value is less than the
	future receipt because you can earn interest on money received today.
	NPV (Net Present Value) compares (subtracts) the current value of a
	series of future cash flows with an amount invested today.
	
	NPV is useful to compare investment opportunities at a given discount
	(interest) rate. The discount rate (rate#) can be viewed as the rate
	of return you want out of your investment. If NPV is greater than or
	equal to 0, the investment equals or exceeds your interest (discount)
	rate requirement; if NPV is less than 0, the investment does not meet
	your interest rate requirement.
	
	The NPV#(rate#,valuearray#(),valuecount%,status%) function returns
	Net Present Value. You input the values rate#, valuearray#(), and
	valuecount% (which is the number of array elements), and get back
	status% equals 0 for success, 1 for failure.
	
	The IRR#(valuearray#(),valuecount%,guess#,status%) function returns
	Internal Rate of Return. IRR returns the discount rate at which NPV
	would return 0 (zero). For a given array of cash flow values, IRR can
	be thought of as an average interest rate (which compounds at each
	period). If IRR is lower than the interest rate you desire for this
	investment, then it is not a good investment.
	
	The first element of the input cash-flow array should usually be
	negative, indicating your initial investment. A high (positive) income
	early in the value array will make IRR higher than if the same high
	income instead occurred later in the array. This is an example of the
	time value of money.
	
	Please refer to an elementary accounting textbook for more information
	about these standard Accounting functions.
	
	Code Example
	------------
	
	You can run this program in the QuickBASIC Extended environment with
	QBX /L FINANCER.QLB. To run outside this environment, you must link
	with the appropriate library (FINANCER.LIB, FINANCAR.LIB,
	FINANCEP.LIB, or FINANCAP.LIB).
	
	REM $INCLUDE: 'FINANC.BI
	DEFDBL A-Z
	OPTION BASE 1
	CLS
	valuecount% = 5   ' = number of cash-flow values in valuearray()
	' Array holds cash flow values, one value per period (such as per
	' year):
	DIM valuearray(valuecount%)
	guess = .1        ' Guess the IRR (use .1 if in doubt)
	
	valuearray(1) = -1000 ' 0. First value negative as initial investment.
	valuearray(2) = 100   ' 1. Return on investment after 1 period.
	valuearray(3) = 200   ' 2. (Positive value is return on investment.)
	valuearray(4) = -300  ' 3. (Negative value is additional investment.)
	valuearray(5) = 1200  ' 4. Return on investment after 4 periods.
	' For the above values, IRR returns .0514. (5.14% return per period)
	status% = 0
	
	irreturn = IRR(valuearray(), valuecount%, guess, status%)
	IF status% THEN PRINT "IRR error occurred; try different guess";
	
	discountrate = irreturn
	netpresval = NPV#(discountrate, valuearray(), valuecount%, status%)
	
	'Notes for NPV#() function:
	' If discountrate = value returned by IRR(), then NPV returns zero, as
	'    in the IRR example in the "Microsoft BASIC 7.0: Language
	'    Reference" manual, and also as in this code example.
	' If discountrate = zero, NPV returns sum of values in valuearray().
	' If discountrate > zero, NPV returns an amount smaller than sum of
	'    values in valuearray() due to the discount effect at each period.
	' If discountrate < zero, NPV returns an amount larger than the sum of
	'    the values in valuearray().
	
	IF status% THEN PRINT "NPV error occurred"
	PRINT "IRR (fractional return on investment per period) = ";
	PRINT USING "##.####"; irreturn
	PRINT "NPV = ";
	PRINT USING "#######.##"; netpresval
	
	Output
	------
	
	For the above values, IRR returns .0514 (5.14 percent return per
	period). NPV returns 0 (zero), since IRR returns the discount rate at
	which NPV returns 0.
