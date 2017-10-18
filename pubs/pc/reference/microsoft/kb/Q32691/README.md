---
layout: page
title: "Q32691: Error Message A4100: Impure Memory Reference"
permalink: /pubs/pc/reference/microsoft/kb/Q32691/
---

## Q32691: Error Message A4100: Impure Memory Reference

	Article: Q32691
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | buglist5.10
	Last Modified: 15-JUL-1988
	
	MASM incorrectly generates the error message "A4100: Impure memory
	reference" on the following source code:
	
	.286
	CODE segment
	     ASSUME cs:code
	     var1   db    ?
	     DIV    var1
	CODE ends
	
	    The DIV instruction incorrectly generates the error message. This
	error occurs when the ".386" directive is used instead of the ".286"
	directive and the "dw" directive is used instead of the "db"
	directive. Also, if the ".386" directive is used with the "dd"
	directive, the DIV instruction will generate the error message again.
	   Microsoft has confirmed this to be a problem in Version 5.10. We
	are researching this problem and will post new information as it
	becomes available.
