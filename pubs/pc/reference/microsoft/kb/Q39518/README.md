---
layout: page
title: "Q39518: EXTR Examples incorrect in MASM Programmer's Guide"
permalink: /pubs/pc/reference/microsoft/kb/Q39518/
---

## Q39518: EXTR Examples incorrect in MASM Programmer's Guide

	Article: Q39518
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | DOCERR
	Last Modified: 12-JAN-1989
	
	There are a number of errors in example 2 on Page 90 of the "Microsoft
	MASM 5.1 Programmer's Guide."
	
	The following lines
	
	   EXTR    xvariable:FAR
	
	   EXTR    xprocedure:PROC
	
	should be as follows:
	
	   EXTRN   xvariable:FAR
	
	   EXTRN   xprocedure:PROC
	
	Please use this as a model. It was not intended to be linked and run.
