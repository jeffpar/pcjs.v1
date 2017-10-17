---
layout: page
title: "Q64033: D2030 Caused by Undefined Identifier in Parameter List"
permalink: /pubs/pc/reference/microsoft/kb/Q64033/
---

## Q64033: D2030 Caused by Undefined Identifier in Parameter List

	Article: Q64033
	Version(s): 6.00
	Operating System: OS/2
	Flags: ENDUSER | buglist6.00
	Last Modified: 31-AUG-1990
	
	Using an undefined symbol in a function or function prototype's
	parameter list can cause the internal compiler error D2030 in
	Microsoft C version 6.00 under OS/2.
	
	The code below produces the following errors under default
	optimizations with Microsoft C version 6.00 under OS/2.
	
	   error C2065: 'maxfields' : undefined
	   error C2057: expected constant expression
	
	   Command line error D2030 : INTERNAL COMPILER ERROR in 'P1'
	                   Contact Microsoft Product Support Services
	
	If output is redirected to a file or a pseudofile, such as the compile
	window in the Programmer's WorkBench (PWB), only the internal compiler error
	will be displayed.
	
	Microsoft has confirmed this to be a problem with C version 6.00. We
	are researching this problem and will post new information here as it
	becomes available.
	
	Sample Code
	-----------
	
	void foo (char retstring[maxfields]);
	
	void main(void){}
