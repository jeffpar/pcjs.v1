---
layout: page
title: "Q19842: How Microsoft BASIC ON ERROR Handles DOS General Drive Failure"
permalink: /pubs/pc/reference/microsoft/kb/Q19842/
---

## Q19842: How Microsoft BASIC ON ERROR Handles DOS General Drive Failure

	Article: Q19842
	Version(s): 6.00 6.00b 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | B_QuickBas
	Last Modified: 2-FEB-1990
	
	Error trapping in Microsoft BASIC programs (invoked with the ON ERROR
	statement) will trap a DOS general drive failure.
	
	A DOS general drive failure occurs if an error occurs while trying to
	read the specified drive (for example, the drive door is not closed or
	the disk is improperly formatted). The general drive failure message
	is usually of the following form:
	
	   General failure reading drive A:
	   (Abort, Retry, Ignore)?
	
	BASIC error trapping invoked with the BASIC ON ERROR statement traps
	the DOS general drive failure and returns a BASIC error number 57,
	"Device I/O error."
