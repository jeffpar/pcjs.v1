---
layout: page
title: "Q43972: QuickC: Bad Symbolic Information for Char Array in Structure"
permalink: /pubs/pc/reference/microsoft/kb/Q43972/
---

## Q43972: QuickC: Bad Symbolic Information for Char Array in Structure

	Article: Q43972
	Version(s): 1.00 1.01
	Operating System: MS-DOS
	Flags: ENDUSER | buglist1.00 buglist1.01
	Last Modified: 2-MAY-1989
	
	Under Microsoft QuickC (QC) Versions 1.00 and 1.01, incorrect symbolic
	information is generated for particular elements of the structure
	defined below. The structure contains a pointer to itself, a bit
	field, and a character array.
	
	The structure is defined as follows:
	
	struct tag {
	                  .
	                  .
	             struct tag *ptr;
	                  .
	                  .
	             unsigned bit : 1;    /* problem is not dependent      */
	                  .
	                  .
	             char array[10];      /* upon size of either data item */
	                  .
	                  .
	           };
	
	Using CodeView (CV) or the integrated QC debugger, an examination of
	the array via a watch expression or a display expression (CV only)
	will yield "0" for its address and "" (double quotation marks) for its
	contents. However, dumping memory with the DA command in CodeView will
	reveal the actual contents of the array.
	
	This problem is dependent upon the existence and arrangement of the
	three data items, and not on additional structure elements. Without
	one of the three, proper symbolic information is produced. If the
	respective order of the three items is changed, the problem is also
	eliminated.
	
	Microsoft has confirmed this to be a problem in Versions 1.00 and
	1.01. We are researching this problem and will post new information as
	it becomes available.
	
	The problem does not manifest itself under the Microsoft QuickC
	Compiler Version 2.00 or the Microsoft Optimizing Compiler Versions
	5.x.
	
	The following sample program illustrates the necessary structure
	definition and arrangement to cause the problem:
	
	#include <string.h>
	
	struct tag {
	             struct tag *ptr;
	             unsigned bit : 1;
	             char array[10];
	           };
	
	void main( void )
	{
	  strcpy(info.array, "boing");
	}
	
	Issuing the following commands displays the lack of proper symbolic
	information:
	
	>? info.array        /* debugging command */
	"0"                  /*   return value    */
	
	                     /* debugging command--in QC, use the Add Watch */
	>w? info.array       /*                                Menu option  */
	"0"                  /*   return value in watch window */
