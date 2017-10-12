---
layout: page
title: "Q61304: CL: Error Output Not Redirected in Certain Cases"
permalink: /pubs/pc/reference/microsoft/kb/Q61304/
---

	Article: Q61304
	Product: Microsoft C
	Version(s): 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | buglist6.00
	Last Modified: 11-JUL-1990
	
	When using the C 6.00 CL command-line compiler under DOS with the
	following options
	
	   /B1 C1L.EXE /Zi
	
	the output is not redirected properly (using the DOS stdout redirect
	">").
	
	The following code example reproduces the problem:
	
	void main(void)
	{
	  int i
	}
	
	Compile using the following command line (assuming you save the above
	in a file called FOO.C):
	
	   cl /B1 C1L.EXE /Zi foo.c > foo.out
	
	The above program contains an error at Line 3 (no semicolon), and the
	following error should be generated and sent to the file BUG.OUT:
	
	   foo.c(4) : error C2059: syntax error : '}'
	
	This error text never appears in the file FOO.OUT.
	
	This problem can be worked around by omitting the /Zi option from the
	command line, or omitting /B1 C1L.EXE.
	
	Microsoft has confirmed this to be a problem in C version 6.00. We
	researching this problem and will post new information here as it
	becomes available.
