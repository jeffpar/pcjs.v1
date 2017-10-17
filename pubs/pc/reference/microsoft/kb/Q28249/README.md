---
layout: page
title: "Q28249: How to Derive Inverse (ARC) and Hyperbolic Trig Functions"
permalink: /pubs/pc/reference/microsoft/kb/Q28249/
---

## Q28249: How to Derive Inverse (ARC) and Hyperbolic Trig Functions

	Article: Q28249
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI B_BasicInt B_MQuickB B_BBasic
	Last Modified: 10-JAN-1991
	
	From the BASIC functions LOG, COS, SIN, TAN, SGN, EXP, and SQR, you
	can derive the other transcendental functions as shown below.
	
	The following trigonometric and mathematical functions that are not
	intrinsic to BASIC can be calculated as shown:
	
	Function                  BASIC Equivalent
	--------                  ----------------
	
	Secant                    SEC(X) = 1/COS(X)
	Cosecant                  CSC(X) = 1/SIN(X)
	Cotangent                 COT(X) = 1/TAN(X)
	Inverse Sine              ARCSIN(X) = ATN(X/SQR(1-X*X))
	Inverse Cosine            ARCCOS(X) = -ATN(X/SQR(X*X-1)) + Pi/2
	Inverse Secant            ARCSEC(X) = ATN(X/SQR(X*X-1)) + (SGN(X)-1) * Pi/2
	Inverse Cosecant          ARCCSC(X) = ATN(1/SQR(X*X-1)) + (SGN(X)-1) * Pi/2
	Inverse Cotangent         ARCCOT(X) = -ATN(X) + Pi/2
	Hyperbolic Sine           SINH(X) = (EXP(X) - EXP(-X))/2
	Hyperbolic Cosine         CACHE(X) = (EXP(X) + EXP(-X))/2
	Hyperbolic Tangent        TANH(X) = (EXP(X) - EXP(-X))/(EXP(X) + EXP(-X))
	Hyperbolic Secant         SECH(X) = 2/(EXP(X) + EXP(-X))
	Hyperbolic Cosecant       CSCH(X) = 2/(EXP(X) - EXP(-X))
	Hyperbolic Cotangent      COTH(X) = EXP(-X)/(EXP(X) - EXP(-X)) * 2 + 1
	Inverse Hyperbolic Sine   ARCSINH(X) = LOG(X + SQR(X*X+1))
	Inverse Hyperbolic Cos    ARCCOSH(X) = LOG(X + SQR(X*X-1))
	Inverse Hyperbolic Tan    ARCCTANH(X) = LOG((1 + X)/(1 - X)) / 2
	Inverse Hyperbolic CSC    ARCCSCH(X) = LOG((SGN(X)*SQR(X*X+1)+1)/X)
	Inverse Hyperbolic Sec    ARCSECH(X) = LOG((SQR(1-X*X)+1) / X)
	Inverse Hyperbolic Cot    ARCCOTH(X) = LOG((X+1)/(X-1)) / 2
	
	The above general formulas may be used in Microsoft BASIC or any other
	language. Note that the constant Pi has the following approximate
	value:
	
	   Pi# = 3.14159265359
	   Pi# = 4.0# * ATN(1.0#)
	
	The above information applies to most Microsoft BASIC products,
	including the following:
	
	1. Microsoft QuickBASIC versions 1.00, 1.01, 1.02, 2.00, 2.01,
	   3.00, 4.00, 4.00b, and 4.50 for the IBM PC
	
	2. Microsoft BASIC Compiler versions 6.00 and 6.00b for MS-DOS and
	   MS OS/2, and Microsoft BASIC Compiler versions 5.35 and 5.36 for
	   MS-DOS
	
	3. Microsoft GW-BASIC Interpreter versions 3.20, 3.22, and 3.23
	
	4. Microsoft BASIC Interpreter versions 1.00, 1.01, 2.00, 2.10,
	   and 3.00 for the Apple Macintosh
	
	5. Microsoft BASIC Compiler version 1.00 for the Apple Macintosh
	
	6. Microsoft QuickBASIC version 1.00 for the Apple Macintosh
	
	7. Microsoft BASIC Professional Development System (PDS) versions 7.00
	   and 7.10 for MS-DOS and MS OS/2
	
	8. Microsoft Business BASIC Compiler versions 1.00 and 1.10 for MS-DOS
	   (discontinued product)
	
	9. Microsoft BASIC Interpreter (BASIC86.EXE) version 5.28 for MS-DOS
