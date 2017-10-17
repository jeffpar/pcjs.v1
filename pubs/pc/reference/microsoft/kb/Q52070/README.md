---
layout: page
title: "Q52070: Example of PPMT and PMT Financial Functions in BASIC 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q52070/
---

## Q52070: Example of PPMT and PMT Financial Functions in BASIC 7.00

	Article: Q52070
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 14-JAN-1990
	
	This program demonstrates the PPMT and PMT financial functions in
	Microsoft BASIC Professional Development System (PDS) Version 7.00 for
	MS-DOS and MS OS/2.
	
	PMT returns the periodic payment for an investment. In the case of a
	loan, PMT returns the amount of the constant monthly payment (the sum
	of principal plus interest) for the loan, based upon a constant
	interest rate, the total number of payments, and the amount (present
	value) of the loan.
	
	PPMT is the payment on the principal for an investment at a specified
	period. (PMT minus PPMT is the payment on the interest at a specified
	period.) The sum of all PPMT values returned over the life of the loan
	equals the loan amount.
	
	Below is an analysis of the finances for buying and selling a house.
	The program returns average equity gain per month after the house has
	been bought and sold. You can change the initial parameters (such as
	houseval, down, rate1, sellper, apprec, etc.) to explore different
	scenarios, including a simplified inflation effect. Negative net
	equity gain per month is outgoing money; positive net equity gain per
	month is income.
	
	You can choose the period of time at which you sell the house and
	compare the net income or outgo per month to that of your current
	housing situation.
	
	Run this program with QBX /L FINANCER.QLB in Microsoft BASIC PDS
	Version 7.00 for MS-DOS. To run outside the QBX.EXE environment, you
	must link with the appropriate library (FINANCER.LIB, FINANCAR.LIB,
	FINANCEP.LIB, or FINANCAP.LIB).
	
	Code Example
	------------
	
	REM $INCLUDE: 'financ.bi'
	DEFDBL A-Z
	
	' Initialize variables:
	CLS
	houseval = 110000#     ' Purchase price of house (median for Seattle).
	apprec = 1.07#         ' Assumed yearly appreciation rate of house.
	sellper = 10# * 12#    ' Period (month) at which you choose to sell.
	down = .1#             ' Fraction of houseval paid as down payment.
	equity = down * houseval  ' Initial equity in house (10% down payment)
	pv1 = (1 - down) * houseval 'Present value of loan = 90% of houseval
	rate1 = .1025# / 12 ' Loan interest rate (10.25%) divided by 12 months
	pool = 0 ' Pool of money, if any, to earn interest & subtract payments
	poolint = 1.0057# ' Monthly interest earned on pool to get 7% yearly.
	pointsbuy = .02#  ' Assumed fees to buy loan, as fraction of houseval.
	pointsell = .07#  ' Selling fees (points) as fraction of selling price
	per = 0#           ' Month (period) counter.
	nper1 = 360#       ' # periods in loan. 30-year loan has 360 months.
	ptype% = 0#        ' 0 means payment due at end of each period.
	fv1 = 0#           ' Future value (the goal) of a loan is always zero.
	ptot1 = 0#         ' Current total of principal paid towards loan.
	in = .95#          ' 1 minus the inflation rate
	proptax = -130#    ' property taxes per month (tax deductible)
	fire = -25#        ' fire/house insurance per month
	roommate = 400#   ' Rent income from roommate (0 if none) after taxes.
	roominflate = 1.02 ' Yearly rate you increase your roommate's rent.
	tax = .8#       ' 1 minus your average yearly Tax rate (as a fraction)
	initial = pool + equity
	PRINT "Purchase price ="; houseval;
	PRINT " // Initial pool + equity = "; initial
	upfront = equity + (pointsbuy * houseval)
	PRINT "Up front cost (down payment + loan fees) ="; upfront
	
	' Calculate monthly (principal+interest) payment:
	payment1 = Pmt(rate1, nper1, pv1, fv1, ptype%, status%)
	IF down < .2# THEN
	   minsure = .03 * payment1 ' Monthly mortgage insurance rate (3% of
	ELSE               ' principal+interest payment). You usually must pay
	   minsure = 0#    ' mortgage insurance if you paid < 20% down.
	END IF
	PRINT "monthly payment= "
	PRINT payment1; "+"; fire; "+"; proptax; "+"; minsure; "= ";
	PRINT payment1 + fire + proptax + minsure
	PRINT "not counting tax savings ("; 1 - tax; "factor ) ";
	PRINT "or roommate income ("; roommate; ")";
	PRINT "**************************************************"
	
	' Add up numbers until the period (month) where you sell (sellper):
	FOR j = 1 TO sellper
	   per = j
	   ' Yearly rent increase:
	   IF j MOD 12 = 0 THEN roommate = roominflate * roommate
	
	   ' Calculate principal and interest amounts paid:
	   principal1 = PPmt(rate1, per, nper1, pv1, fv1, ptype%, status%)
	
	   ptot1 = ptot1 + principal1   ' total accumulated principal to date
	   interest1 = payment1 - principal1
	   itot1 = itot1 + interest1  'total accumulated interest paid to date
	   ' Outaftertax1 and outgo values are negative:
	   outaftertax1 = ((interest1+proptax)*tax) +principal1 +fire +minsure
	   pool = pool + outaftertax1 + roommate  ' (outaftertax is negative)
	   ' pool earns interest if positive (no interest charged if negative,
	   ' assuming you make monthly house payments without borrowing):
	   IF pool > 0 THEN pool = pool * poolint
	   equity = equity + ABS(principal1) ' Monthly principal builds equity
	NEXT
	
	' Calculate final appreciation and closing costs; and print out:
	years = sellper / 12#   ' Number of years after which you sold.
	aphouseval = houseval * (apprec ^ years) ' Appreciated house value.
	closecost = -(pointsbuy * houseval) - (pointsell * aphouseval)
	naphouseval = aphouseval - houseval  ' net appreciation on house value
	final = pool + equity + naphouseval + closecost
	in1989 = final * (in ^ years)  ' In 1989 dollars (inflation adjusted).
	PRINT
	PRINT "After"; years; " years, buy+sell closecost ="; closecost
	PRINT "total principal paid="; ptot1 + ptot2
	PRINT "total interest paid="; itot1 + itot2
	PRINT "Appreciated value of house = "; aphouseval
	PRINT "final pool+equity+apprec-close="; final
	PRINT "or"; in1989; " in 1989 dollars with"; 1 - in;"yearly inflation"
	PRINT "(which is a"; CSNG(in ^ years); " overall inflation factor)"
	PRINT
	PRINT "Net ave. equity increase per month="; (final-initial)/sellper
	PRINT"(or with inflation=";(in1989-initial)/sellper;"in 1989 dollars)"
