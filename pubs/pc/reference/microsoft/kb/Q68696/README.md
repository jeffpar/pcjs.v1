---
layout: page
title: "Q68696: &quot;?CANNOT DISPLAY&quot; After Column 135 in Command Window"
permalink: /pubs/pc/reference/microsoft/kb/Q68696/
---

## Q68696: &quot;?CANNOT DISPLAY&quot; After Column 135 in Command Window

	Article: Q68696
	Version(s): 3.00 3.11 | 3.00 3.11 3.50
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 6-FEB-1991
	
	The code below demonstrates a limitation of the CodeView debugger.
	When the command "?y" is executed in the COMMAND window, the structure
	"y" is displayed. However, CodeView displays the structure only to
	column 135 and then prints "?CANNOT DISPLAY," ignoring the rest of the
	elements in the structure. The output appears as follows:
	
	   --------------------------command----------------------------
	  |>?y                                                          |
	  |{this_field_01=0x0000, ... ,this_field_07=?CANNOT DISPLAY    |
	  |                        ^                 ^                  |
	  |                        |                 |                  |
	  |                  Fields 2-6 displayed    Column 135         |
	  |                                                             |
	   -------------------------------------------------------------
	
	                      CodeView Command Window
	
	To view all elements of a structure, you should use the QUICK WATCH
	function. In the example below, the contents of the whole structure
	can be seen by typing "??y". A dialog box will appear on the screen
	showing the contents of the structure. By scrolling down in the dialog
	box, the contents of every element of the structure can be seen. The
	structure contents are displayed as follows:
	
	          --------------- Quick Watch -----------------
	         |                                             |
	         |-y                                           |
	         |   this_field_01=0                           |
	         |   this_field_02=0                           |
	         |   this_field_03=0                           |
	         |   this_field_04=0                           |
	         |   this_field_05=0                           |
	         |   this_field_06=0                           |
	         |   this_field_07=0                           |
	         |   this_field_08=0                           |
	         |   this_field_09=0                           |
	         |   this_field_10=0                           |
	         |   this_field_11=0                           |
	         |   this_field_12=0                           |
	         |   this_field_13=0                           |
	         |   this_field_14=0                           |
	         |   this_field_15=0                           |
	          ---------------------------------------------
	
	                      Quick Watch of Variable
	
	Sample Code
	-----------
	
	struct x {
	   int this_field_01;
	   int this_field_02;
	   int this_field_03;
	   int this_field_04;
	   int this_field_05;
	   int this_field_06;
	   int this_field_07;
	   int this_field_08;
	   int this_field_09;
	   int this_field_10;
	   int this_field_11;
	   int this_field_12;
	   int this_field_14;
	   int this_field_15;
	   int this_field_16;
	   int this_field_17;
	   int this_field_18;
	   int this_field_19;
	   int this_field_20;
	};
	
	main()
	{
	    struct x y;
	}
