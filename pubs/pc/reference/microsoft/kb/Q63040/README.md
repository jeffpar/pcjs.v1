---
layout: page
title: "Q63040: LINK /F of Overlaid BRT70xx Program Causes &quot;Invalid Runtime&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q63040/
---

## Q63040: LINK /F of Overlaid BRT70xx Program Causes &quot;Invalid Runtime&quot;

	Article: Q63040
	Version(s): 7.00
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900615-62 buglist7.00 fixlist7.10
	Last Modified: 6-AUG-1990
	
	LINK-overlaid programs using the BRT70xxx.EXE run-time module from
	Microsoft BASIC Professional Development System (PDS) version 7.00
	should not be LINKed with the /F (/FARCALLTRANSLATION) option. When
	this is done, a CALL to an overlay causes an attempt to reload the
	run-time module. This results in an "Invalid runtime module" message
	and, in most cases, the machine hangs.
	
	To work around this problem, LINK without the /F option or compile
	for a stand-alone .EXE (with the BC /O option).
	
	Microsoft has confirmed this to be a problem in Microsoft BASIC PDS
	version 7.00. This problem does not occur in BASIC PDS 7.10.
	
	The /F (/FARCALLTRANSLATION) LINK option is described on Page 241 of
	the "Microsoft CodeView 2.3 and Utilities User's Guide" for Microsoft
	BASIC PDS version 7.00 for MS-DOS. Using this option may produce a
	slight gain in speed and size of executables by translating far calls
	to near calls. However, attempts to optimize overlaid calls cause a
	problem with the run-time module. Thus, /F should not be used with an
	overlaid program that is using the run-time module.
	
	Code Example
	------------
	
	The following programs (which are separate .BAS source files)
	compose a simple overlaid program that demonstrates the problem:
	
	CALLOVL.BAS
	-----------
	
	INPUT "Call overlay (Y/N)? ",i$
	IF ((i$ = "Y") OR (i$ = "y")) THEN CALL test
	END
	
	OVL.BAS    **** NOTE: This is a file separate from the above file!
	-------
	
	SUB test
	  PRINT "in overlay"
	END SUB
	
	The following are the compile and LINK lines to demonstrate the
	problem with the above separate modules:
	
	   BC CALLOVL;
	   BC OVL;
	   LINK /F CALLOVL+(OVL);
	
	These programs can be run properly if either /O is added to each BC
	command line or the /F is omitted from the LINK line.
