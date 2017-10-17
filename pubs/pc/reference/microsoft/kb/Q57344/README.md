---
layout: page
title: "Q57344: &quot;Subscript out of Range in Quick Library Module: WINDOW&quot; Error"
permalink: /pubs/pc/reference/microsoft/kb/Q57344/
---

## Q57344: &quot;Subscript out of Range in Quick Library Module: WINDOW&quot; Error

	Article: Q57344
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S891207-24 docerr
	Last Modified: 8-JAN-1991
	
	The following COMMON SHARED statement should be added to the global
	array declarations found on Page 550 of the "Microsoft BASIC 7.0:
	Language Reference" manual (for 7.00 and 7.10) to successfully use the
	User Interface (UI) Toolbox's WINDOW.BAS source code file:
	
	   COMMON SHARED /uitools/GloWindowStack() AS INTEGER
	
	The order of COMMON SHARED statements is important. The above
	statement should be inserted as follows:
	
	   COMMON SHARED /uitools/GloWindow()      AS WindowType
	   COMMON SHARED /uitools/GloButton ()     AS ButtonType
	   COMMON SHARED /uitools/GloEdit()        AS EditFieldType
	   COMMON SHARED /uitools/GloStorage()     AS WindowStorageType
	   COMMON SHARED /uitools/GloWindowStack() AS INTEGER
	   COMMON SHARED /uitools/GloBuffer$()
	
	If this COMMON SHARED statement is missing from a program that uses
	the WINDOW.BAS source code file, the program generates the error
	message "Subscript out of range in Quick library module: WINDOW" on
	the first call to a WINDOW.BAS procedure. This error will probably
	occur on the call to WindowInit because it must be the first
	WINDOW.BAS procedure called.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS.
