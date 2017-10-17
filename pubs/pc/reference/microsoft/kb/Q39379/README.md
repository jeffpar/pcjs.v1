---
layout: page
title: "Q39379: QB.EXE 4.50 &quot;Binding...&quot; then Hang If SWAP User-TYPE Strings"
permalink: /pubs/pc/reference/microsoft/kb/Q39379/
---

## Q39379: QB.EXE 4.50 &quot;Binding...&quot; then Hang If SWAP User-TYPE Strings

	Article: Q39379
	Version(s): 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | buglist4.50 SR# S881206-72
	Last Modified: 24-MAR-1989
	
	SWAPping two string variables that are fields of a user-defined type
	can display the "Binding..." message and then hang the QuickBASIC
	QB.EXE Version 4.50 editor. Hanging does not happen SWAPping
	non-user-defined type strings or other types of variables. The hanging
	does not occur in programs compiled with BC.EXE Version 4.50, it is
	just a QB.EXE editor problem.
	
	Microsoft has confirmed this to be a problem in Version 4.50. We are
	researching this problem and will post new information as it becomes
	available.
	
	QB.EXE Versions 4.00 and 4.00b do not have this problem.
	
	Putting the TYPE variables in either $DYNAMIC or $STATIC arrays still
	hangs. If an INTEGER or DOUBLE appears in the record before the string
	field that is being swapped, then you can usually warm reboot,
	otherwise it usually requires a cold reboot. Other variables such as
	floating point or other TYPES do not prevent the cold reboot. Which
	String is swapped (1-5) in the following record makes no difference.
	
	Swapping any non-string type of field in a user-defined record does
	not hang the computer. Swapping both variable- and fixed-length
	strings as single variables (not in record) also does not hang the
	computer.
	
	The following code demonstrates the problem:
	
	   TYPE rectype
	      num1 AS INTEGER
	      string1 AS STRING * 16
	      string2 AS STRING * 16
	      string3 AS STRING * 16
	      string4 AS STRING * 16
	      string5 AS STRING * 16
	   END TYPE
	   DIM var1  AS rectype, var2 AS rectype
	   var1.string1 = "String1"
	   var2.string1 = "String2"
	   SWAP var1.string1, var2.string1
	   ' The QB.EXE environment will freeze up at this SWAP statement.
	
	To work around the problem, use a standard swapping technique with two
	variables and a temporary variable:
	
	   DIM var1 as rectype, var2 as rectype, temp as rectype
	   temp.string1 = var1.string1      ' 1. a -> temp
	   var1.string1 = var2.string1      ' 2. b -> a
	   var2.string1 = temp.string1      ' 3. temp -> b
