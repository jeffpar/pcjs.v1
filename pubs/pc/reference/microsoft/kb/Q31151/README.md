---
layout: page
title: "Q31151: &quot;Path/File Access Error&quot;; OPEN FOR APPEND ACCESS WRITE"
permalink: /pubs/pc/reference/microsoft/kb/Q31151/
---

## Q31151: &quot;Path/File Access Error&quot;; OPEN FOR APPEND ACCESS WRITE

	Article: Q31151
	Version(s): 3.00 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 28-DEC-1989
	
	A "path/file access error" message occurs when OPENing with FOR APPEND
	ACCESS WRITE.
	
	The error occurs because the designated file needs to be READ in order
	to be APPENDed. If the file is OPENed with ACCESS WRITE, READing
	privileges have not been provided.
	
	To eliminate the error message, omit the ACCESS clause or change
	ACCESS WRITE to ACCESS READ WRITE.
	
	This information also applies to Microsoft BASIC Compiler Versions
	6.00 and 6.00b for MS-DOS and MS OS/2 and to Microsoft BASIC PDS
	Version 7.00 for MS-DOS and MS OS/2.
	
	The following code example demonstrates this behavior:
	
	OPEN "test1.dat" FOR APPEND ACCESS WRITE as #1   ' Incorrect.
	' OPEN "test1.dat" FOR APPEND ACCESS READ WRITE as #1   ' Correct.
	FOR k = 1 TO 100
	        WRITE #1, "hello", k
	NEXT k
	close #1
