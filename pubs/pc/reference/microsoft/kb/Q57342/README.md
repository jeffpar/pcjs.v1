---
layout: page
title: "Q57342: Light Pens Tested with Microsoft BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q57342/
---

## Q57342: Light Pens Tested with Microsoft BASIC

	Article: Q57342
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S891206-121 B_BasicCom
	Last Modified: 22-JAN-1990
	
	The following light pens by the LightPen Company were tested with
	QuickBASIC Version 4.50, Microsoft BASIC Compiler Versions 6.00 and
	6.00b, and Microsoft BASIC Professional Development System (PDS)
	Version 7.00:
	
	1. Light Pen
	2. Soft Pen
	
	The following code example is from Page 315 of the "Microsoft
	QuickBASIC 4.0: BASIC Language Reference" manual under the example for
	the PEN function. This code example was used to test the light pen. If
	you do not have a light pen, pushing both buttons on the mouse at the
	same time simulates a light pen being on.
	
	The code produces an endless loop to give the current position and
	status of the pen.
	
	Compile and link with the following command lines:
	
	   BC test.bas;
	   LINK test.obj,,,BRUNxx.Lib;
	
	Code Example
	------------
	
	CLS
	PEN ON
	DO
	   p = PEN(3)
	   LOCATE 1,1: PRINT "Pen Is ";
	   IF p THEN PRINT "down" ELSE PRINT "up"
	   x = PEN (4) : y = PEN(5)
	   PRINT "x=" x, "y=" y
	LOOP
