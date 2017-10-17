---
layout: page
title: "Q46270: Typedef of Function Pointer with _loadds Fails"
permalink: /pubs/pc/reference/microsoft/kb/Q46270/
---

## Q46270: Typedef of Function Pointer with _loadds Fails

	Article: Q46270
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# G890616-20706
	Last Modified: 11-SEP-1989
	
	Question:
	
	I have the following typedef declaration:
	
	typedef  void far _loadds pascal MYFUNC(void);
	typedef  MYFUNC  far *PMYFUNC;
	
	The second typedef gives a compiler warning (at -W3 level):
	
	   Warning C4105: 'PMYFUNC' : code modifiers only on function
	   or pointer to function
	
	How can I avoid the warning?
	
	Response:
	
	This compiler does not handle this situation properly.
	
	One solution is to use a macro as shown below:
	
	    #define FN_FLP far _loadds pascal
	
	    void FN_FLP myfunc1();
	
	    void (FN_FLP *pmyfunc1)();
	
	This isn't as attractive as a typedef, but it does help.
	
	Another way to work around the problem is to put the definition of the
	function in a different source file than the calls, leaving the
	_loadds keyword in the function definition but taking it out of the
	declarations. Since _loadds does not affect the calling sequence, this
	process should not cause additional problems.
	
	Note: Be sure to check your generated code.
	
	Microsoft is researching this problem and will post new information as
	it becomes available.
