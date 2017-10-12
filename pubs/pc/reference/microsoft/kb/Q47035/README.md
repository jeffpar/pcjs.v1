---
layout: page
title: "Q47035: QC 2.00: Watch Values on Float Pointers Show char String"
permalink: /pubs/pc/reference/microsoft/kb/Q47035/
---

	Article: Q47035
	Product: Microsoft C
	Version(s): 2.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.00
	Last Modified: 26-JUL-1989
	
	QuickC Version 2.00 does not display float pointers correctly in the
	Watch Value window. Float pointers display an ASCII character string
	of the memory that it points to, until a null character is reached.
	
	Use the following method as a workaround:
	
	For a float pointer, declared as
	
	   float *fl;
	
	display the pointer in the Watch Value window as
	
	   &*fl : 0xSEG:0xOFF         <---- displays correctly
	
	which essentially says "the address of what fl points to,"
	rather than the following
	
	   fl   : "<garbage>"         <---- displays char string
	
	which displays the ASCII string of what fl points to.
	
	The following Watch Value displays the first byte that fl points to as
	an ASCII character before program execution begins, but displays the
	correct results after initialization:
	
	   *fl  :
	
	Microsoft has confirmed this to be a problem in QuickC Version 2.00.
	We are researching this problem and will post new information as it
	becomes available.
	
	Example
	-------
	
	    float *fl
	
	    fl = (float *) malloc (sizeof(float));
	    *fl = 3.5 ;
	
	A Watch Value set to fl displays the following:
	
	    fl : "<garbage>"
	
	The "garbage" is an ASCII character string of the memory that fl
	points to. The string continues until a null character is encountered.
	The float pointer Watch Value displays a string even before program
	execution, when other watch values display <Unknown Identifier>.
