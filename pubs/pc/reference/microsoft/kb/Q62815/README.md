---
layout: page
title: "Q62815: &quot;Not Enough Memory on Exec&quot; When Using RUN with ISAM File Open"
permalink: /pubs/pc/reference/microsoft/kb/Q62815/
---

## Q62815: &quot;Not Enough Memory on Exec&quot; When Using RUN with ISAM File Open

	Article: Q62815
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900525-29 buglist7.00 fixlist7.10
	Last Modified: 6-AUG-1990
	
	From within the QBX.EXE environment or a compiled program, an attempt
	to execute a RUN statement while there are open ISAM files results in
	the run-time error R6007, "Not enough memory on EXEC." The RUN
	statement is documented as having the ability to close all files;
	therefore, this error should not occur.
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC
	Professional Development System (PDS) version 7.00 for MS-DOS. This
	problem was corrected in BASIC PDS version 7.10.
	
	To work around the problem in version 7.00, CLOSE all ISAM files
	before executing a RUN statement.
	
	The following code example demonstrates the problem:
	
	Code Example
	------------
	
	TYPE testtype
	  test AS INTEGER
	END TYPE
	OPEN "test.dat" FOR ISAM testtype "runexe" AS #1
	'CLOSE        'If this line is put in, the program will run correctly
	RUN "test"
