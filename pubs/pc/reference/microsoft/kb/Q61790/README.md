---
layout: page
title: "Q61790: A1022 Error If Include Environment Variable Is Not Set"
permalink: /pubs/pc/reference/microsoft/kb/Q61790/
---

## Q61790: A1022 Error If Include Environment Variable Is Not Set

	Article: Q61790
	Version(s): 2.51
	Operating System: MS-DOS
	Flags: ENDUSER | buglist2.51
	Last Modified: 11-MAY-1990
	
	In QuickC with QuickAssembler version 2.51, when using QCL.EXE to
	compile assembly language programs, if the INCLUDE environment
	variable is not set, the following error is generated:
	
	   command line fatal error A1022: source file name not specified
	
	This problem does not occur in the QuickC with QuickAssembler
	environment (QC.EXE) or with QuickC with QuickAssembler version 2.01.
	
	Microsoft has confirmed this to be a problem with QuickAssembler
	version 2.51. We are researching this problem and will post new
	information here as it becomes available.
	
	The following DOS commands reproduce the "A1022: source file name not
	specified" error:
	
	   SET INCLUDE=
	   QCL test.asm
	
	To compile programs successfully, set the INCLUDE environment variable
	to the QuickC with QuickAssembler INCLUDE directory; for example, SET
	INCLUDE=D:\QCQA\INCLUDE.
