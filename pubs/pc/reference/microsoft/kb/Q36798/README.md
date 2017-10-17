---
layout: page
title: "Q36798: Microsoft System Journal M macros Fail"
permalink: /pubs/pc/reference/microsoft/kb/Q36798/
---

## Q36798: Microsoft System Journal M macros Fail

	Article: Q36798
	Version(s): 1.00 1.01 | 1.00 1.01
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 20-OCT-1988
	
	In the September 1988 issue of the "MS System Journal," the article
	entitled "Customizing the Features of the M Editor Using Macros and C
	Extensions" contains erroneous examples.
	
	Both of the macros below fail in Version 1.00. Only the Bigprint macro
	fails in Version 1.01.
	
	The following is an example:
	
	Macro 1)
	
	;print selected text macro
	print1:= copy arg "<clipboard>" setfile
	print2:= arg arg "TEMP.DAT" setfile setfile
	print3:= arg "PRINT TEMP.DAT" shell
	print4:= arg "DEL TEMP.DAT" shell
	printa:=print1 print2 print3 print4
	Printa:alt+P
	
	The above macro is supposed to print selected text. In M Version 1.00
	it works correctly the first time it is called from inside a file.
	However, it fails on subsequent calls to the macro prior to exiting
	the file. It does work correctly in the unreleased Version 1.01
	referenced in the article.
	
	The following macro is supposed to print the entire file. Instead, it
	prints only the line on which the cursor sits when the macro is
	called. As mentioned above, this fails in both Versions 1.00 and the
	unreleased Version 1.01 referred to in the article on Pages 59-72.
	
	The following is an example:
	
	Macro 2)
	
	;bigprint macro to print entire file
	select1:= arg ppage
	select2:= arg arg "endoffile" mark
	select3:= arg mpage
	select4:= arg "endoffile"
	selectall:= select1 select2 select3 select4
	bigprint:=meta +>nometa cancel selectall meta :>nometa meta printa
	
	bigprint:Alt+z
	;end of bigfoot macro.
