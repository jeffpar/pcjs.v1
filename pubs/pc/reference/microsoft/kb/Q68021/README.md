---
layout: page
title: "Q68021: LOCK May Fail to Properly Return Error After CHAIN Under OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q68021/
---

## Q68021: LOCK May Fail to Properly Return Error After CHAIN Under OS/2

	Article: Q68021
	Version(s): 7.00 7.10
	Operating System: OS/2
	Flags: ENDUSER | SR# S901205-16 buglist7.00 buglist7.10
	Last Modified: 9-JAN-1991
	
	Under MS OS/2, the following program demonstrates how a LOCK statement
	can fail to properly give a "Permission Denied" error for a locked
	record in a file kept open across a CHAIN. This problem does not occur
	under MS-DOS.
	
	Microsoft has confirmed this to be a problem with Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for MS
	OS/2. We are researching this problem and will post new information
	here as it becomes available.
	
	Code Samples
	------------
	
	TEST01.BAS
	----------
	
	10 ON ERROR GOTO 70
	20 OPEN "pippo" FOR RANDOM ACCESS READ WRITE SHARED AS #1 LEN=128
	30 LOCK 1, 1
	40 CHAIN "TEST02"
	70 PRINT ERR; ERL
	80 END
	
	TEST02.BAS
	----------
	
	10 ON ERROR GOTO 70
	20 LOCK 1, 1
	30 END
	70 PRINT ERR; ERL
	80 END
	
	Compile and link the above programs as follows:
	
	  BC /X/LP test01;
	  LINK test01;
	  BC /X/LP test02;
	  LINK test02;
	
	Under MS-DOS, the second (CHAINed) program correctly returns a
	"Permission Denied" error (error code 70) for the LOCK statement;
	however, under OS/2, this program fails to give an error.
