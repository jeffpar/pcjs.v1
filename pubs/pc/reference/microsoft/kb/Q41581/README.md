---
layout: page
title: "Q41581: More Information about BASIC's DRAW Statement Macro Language"
permalink: /pubs/pc/reference/microsoft/kb/Q41581/
---

## Q41581: More Information about BASIC's DRAW Statement Macro Language

	Article: Q41581
	Version(s): 1.00 1.01 1.02 2.00 2.01 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom B_GWBasicI SR# S890217-132
	Last Modified: 12-DEC-1989
	
	This information illustrates the DRAW statement, which is supported in
	the following products:
	
	1. Microsoft QuickBASIC Compiler Versions 1.00, 1.01, 1.02, 2.00,
	   2.01, 3.00, 4.00, 4.00b, and 4.50 for the IBM PC
	
	2. Microsoft BASIC Compiler Versions 6.00 and 6.00b for MS OS/2
	   and MS-DOS
	
	3. Microsoft BASIC PDS Version 7.00 for MS-DOS and MS OS/2.
	
	4. Microsoft GW-BASIC Interpreter Versions 3.20, 3.22, and 3.23
	
	The DRAW statement is only valid in a graphics mode (i.e., SCREEN 1,
	2, and higher). The DRAW statement is not supported in SCREEN 0.
	
	DRAW allows you to draw lines, shapes, change colors, fill in areas,
	and also perform powerful graphic functions. The DRAW statement
	combines most of the capabilities of the other graphics statements
	found in BASIC into an object-definition language called the Graphics
	Macro Language (GML).
	
	The syntax for the DRAW statement is as follows:
	
	   DRAW string-expression
	
	This syntax is documented under the BASIC statement DRAW in the
	"Microsoft GW-BASIC Interpreter: User's Reference" and the BASIC
	language reference manuals for QuickBASIC and the BASIC compiler. The
	valid options for string expressions are also documented with the DRAW
	command.
	
	The DRAW command expects a string expression that is composed of the
	following, where "x" is a reserved letter (command) and "n" is a
	numerical value, interpreted as a string:
	
	   xn
	
	You can have one or more combinations of xn's separated by a space or
	a comma. The following are examples:
	
	   DRAW "U5"         'Moves the pointer Up 5
	   DRAW "U5 L7"      'Moves the pointer Up 5 and Left 7
	   DRAW "U5,L7"      'Moves the pointer Up 5 and Left 7
	   DRAW "G5"         'Moves the pointer diagonally down and left 5
	
	The integer value of "n" can also be assigned to a string variable and
	then used as in the following example. You will have to concatenate
	the strings to build the command. The following is an example:
	
	   A$ = "200" : B$ = "120" : DRAW "M" + A$ + "," + B$
	
	The value for "n" can also be stored in an integer variable, and then
	converted to a string using the VARPTR$() or STR$() functions. If
	using VARPTR$(), you must include the extra "=" signs or else an
	"Illegal function call" error is generated. The syntax is as follows:
	
	   A% = 200 : B% = 120 : DRAW "M=" + VARPTR$(A%) + ",=" + VARPTR$(B%)
	                         DRAW "M" + STR$(A%) + "," + STR$(B%)
	
	This command moves the pointer to pixel location (200,120) on the
	screen.
	
	DRAW "X" is another powerful command. This command allows you to
	execute a substring of commands. The BASIC reference describes this as
	being a powerful tool to execute second, third, etc. strings, but does
	not give any examples.
	
	The DRAW "X" command allows you to embed draw commands within a string
	variable and then execute that string at any point. This is a nice
	concept but can be accomplished with simpler means. The following is
	an example of DRAW "X":
	
	   D$ = "F60 L120 E60 BD30 P1,2 BU30 E60 L120 F60 BU30 P1,2"
	   DRAW "X" + VARPTR$(D$)
	
	The above command draws two triangles, sitting one on top of the
	other, and fills them both in. The following two commands do the same
	thing:
	
	   DRAW "F60 L120 E60 BD30 P1,2 BU30 E60 L120 F60 BU30 P1,2"
	or
	   D$ = "F60 L120 E60 BD30 P1,2 BU30 E60 L120 F60 BU30 P1,2"
	   DRAW D$
	
	You can use whichever DRAW syntax is easiest for you.
	
	Note: Remember the following when using DRAW:
	
	1. If your "n" value is an INTEGER, use string concatenation with
	   VARPTR$() and EQUAL signs, or use STR$().
	
	2. If your "n" value is assigned as a STRING variable, use string
	   concatenation.
	
	This Graphics Macro Language (GML) is a very powerful addition to the
	BASIC language, but there are limitations. The DRAW statement just
	draws graphics, it does not have any conditional or looping
	statements. Therefore, the DRAW "X" command is not recursive.
	
	Please refer to the BASIC language reference for further details about
	the DRAW statement.
