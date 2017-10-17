---
layout: page
title: "Q65034: QBX.EXE &quot;Out of Data Space&quot; for Variable-Length String Array"
permalink: /pubs/pc/reference/microsoft/kb/Q65034/
---

## Q65034: QBX.EXE &quot;Out of Data Space&quot; for Variable-Length String Array

	Article: Q65034
	Version(s): 7.00 7.10 | 7.00 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 4-SEP-1990
	
	The 4-byte string descriptor for each variable-length string resides
	in DGROUP (the 64K near heap) regardless of the compiler string option
	(near or far).
	
	When using the far strings option (BC /Fs option, or running within
	QBX.EXE), only the contents (not the 4-byte descriptors) of the
	variable-length string are stored in the far segments. Large string
	arrays (near or far) can quickly fill up DGROUP with string
	descriptors, as shown in the examples below.
	
	This article illustrates how you can get both "Out of Data Space" and
	"Out of Memory" messages in QBX.EXE using an empty variable-length
	string array (dynamic or static) that fills up DGROUP with 4-byte
	string descriptors.
	
	This article also illustrates how, from a compiled .EXE program, you
	can get an "Out of String Space" message at run time when allocating
	dynamic variable-length string arrays and how you can get a "LINK :
	Fatal error L2041: Stack plus data exceed 64K" message at LINK time
	when allocating static variable-length string arrays, due to filling
	up DGROUP with 4-byte string descriptors.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 for MS-DOS and MS OS/2.
	
	Code Example 1 (Static Array)
	-----------------------------
	
	This example shows size limits using a static array of variable-length
	strings.
	
	This DIM gives "Out of Data Space" followed by "Out of Memory" in
	QBX.EXE before the PRINT can be executed. The string descriptors (4
	bytes per string-array element) are using up all the memory in DGROUP.
	
	   PRINT "This never prints in QBX.EXE"
	   DIM b$(12000)    ' Note:  DIM b$(11000) works without error.
	
	If you compile this program with BC /Fs to a .EXE program, you can
	specify up to about DIM b$(14000) without error. DIM b$(15000) gives
	the LINK.EXE error "LINK : Fatal error L2041: Stack plus data exceed
	64K" because DGROUP is filled up with string descriptors.
	
	Code Example 2 (dynamic array)
	------------------------------
	
	This example shows size limits using a dynamic array of
	variable-length strings.
	
	The following program gives "Out of Data Space" followed by "Out of
	Memory" at run time in QBX.EXE when the program reaches REDIM
	A$(12000). From a compiled .EXE program, an "Out of String Space"
	message occurs at REDIM A$(16000) or larger, again because DGROUP is
	filled up with string descriptors.
	
	Note that each string element has 2 additional bytes of overhead per
	element in the far heap segment (even for this array that is empty of
	any string contents).
	
	CLS
	FOR j = 5 TO 16
	REDIM a$(j * 1000)
	PRINT "DIM a$("; j * 1000; ")"; " Far string segment usage="; FRE(a$)
	' STACK returns the space available in DGROUP:
	PRINT "DGROUP available="; STACK
	NEXT
	
	References:
	
	See Pages 719-720, "Variable Storage and Memory Use," and also Chapter
	11, "Advanced String Storage," in the "Microsoft BASIC 7.0:
	Programmer's Guide" for BASIC PDS versions 7.00 and 7.10.
