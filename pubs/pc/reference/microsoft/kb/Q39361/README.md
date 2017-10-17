---
layout: page
title: "Q39361: Sample Program; BASIC Invoking C Function That Returns String"
permalink: /pubs/pc/reference/microsoft/kb/Q39361/
---

## Q39361: Sample Program; BASIC Invoking C Function That Returns String

	Article: Q39361
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom SR# S881207-17
	Last Modified: 1-FEB-1990
	
	The sample program below demonstrates a BASIC program calling a C
	routine that returns a BASIC string descriptor. This programming
	example is a variation of the sample program located on Page 310 of
	the "Microsoft QuickBASIC 4.0: Learning and Using" manual.
	
	This information applies to Microsoft QuickBASIC Versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler Versions 6.00 and 6.00b for
	MS-DOS and MS OS/2, and to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	Note: The Microsoft C medium-memory model should be used to ensure
	that the C string is in DGROUP.
	
	Note: This information does not apply if using far string support in
	BASIC PDS Version 7.00 or when running inside the QuickBASIC extended
	(QBX.EXE) environment with BASIC PDS Version 7.00. For information on
	programming with mixed-languages using far strings refer to Chapter
	13, "Mixed-Language Programming with Far Strings," in the "Microsoft
	BASIC 7.0: Programmer's Guide."
	
	The COMPILE and LINK instructions are as follows:
	
	   BC test.bas;
	   CL /AM /c tc.c
	   LINK test tc /noe;
	
	The BASIC routine is as follows:
	
	   DECLARE FUNCTION t1$()
	   a$ = t1$
	   PRINT a$
	
	The C function is as follows:
	
	   struct bas_str{
	           int sd_len;
	           char *sd_addr;
	           };
	   char cstr[]="ABC";
	   struct bas_str pascal t1()
	   {
	      struct bas_str str_des;
	      str_des.sd_addr = cstr;
	      str_des.sd_len = strlen(cstr);
	      return (str_des);
	   }
