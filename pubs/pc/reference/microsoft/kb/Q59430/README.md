---
layout: page
title: "Q59430: 3 Cases Where DIR&#36; Gives &quot;Illegal Function Call&quot; in BASIC 7.00"
permalink: /pubs/pc/reference/microsoft/kb/Q59430/
---

## Q59430: 3 Cases Where DIR&#36; Gives &quot;Illegal Function Call&quot; in BASIC 7.00

	Article: Q59430
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | docerr
	Last Modified: 8-JAN-1991
	
	Page 107 of the "Microsoft BASIC 7.0: Language Reference" manual (for
	7.00 and 7.10) incorrectly states that you can only receive "Illegal
	Function Call" using the DIR$ function if you don't specify a
	filespec$ the first time you call DIR$.
	
	However, the DIR$ function returns an "Illegal Function Call" in the
	following three circumstances:
	
	1. Invoking DIR$ for the first time without a filespec$ parameter
	   causes an "Illegal Function Call" error.
	
	2. If you invoke DIR$ with a filespec$ and no matching files are found
	   (it returns a null string -- ""), if you then invoke DIR$ another
	   time without the filespec$ parameter, you will receive an "Illegal
	   Function Call" error. In other words, you must call DIR$ with a
	   filespec$ until a match is found. After that, DIR$ can be called
	   again with no filespec$ to get the next filename in the list of
	   files found.
	
	3. Once the entire list of matched file names has been retrieved,
	   using DIR$ without a filespec$ correctly returns a null string
	   telling you that the end of the list has been reached. Invoking
	   DIR$ one more time after that point generates an "Illegal Function
	   Call." In other words, once you run out of files that matched your
	   original filespec$, you must call DIR$ with a filespec$ again until
	   another match is achieved.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) Versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	The code example below demonstrates that when DIR$ is used
	incorrectly, it generates an "Illegal Function Call." If you comment
	out DIR$ after the WHILE loop, the program runs correctly.
	
	The DIR$ function is a new function introduced in Microsoft BASIC PDS
	7.00. It is designed to let you find files and browse through
	directories looking for files without having to use SHELL, as in
	earlier versions of BASIC. DIR$ takes a filespec$ parameter that is
	very similar to the parameters that can be passed to the DIR command
	found in MS-DOS or OS/2.
	
	Code Example
	------------
	
	   DIM test(200) AS STRING * 12
	   CLS
	   temp$ = DIR$("*.*")
	   count = 0
	   WHILE temp$ <> "" ' When it returns null,
	                     ' the end of the list has been reached.
	      test(count) = temp$
	      count = count + 1
	      PRINT temp$
	      temp$ = DIR$
	   WEND
	   PRINT DIR$       ' If this line is left here, it will cause the error
	                    ' "Illegal Function Call" to occur.
	   END
