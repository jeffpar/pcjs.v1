---
layout: page
title: "Q49315: Parameter Order Incorrect for _pg_chartms, _pg_charscatterms"
permalink: /pubs/pc/reference/microsoft/kb/Q49315/
---

	Article: Q49315
	Product: Microsoft C
	Version(s): 2.00 2.01
	Operating System: MS-DOS
	Flags: ENDUSER | docerr S_QuickAsm
	Last Modified: 10-OCT-1989
	
	Pages 322 and 323 of the Microsoft QuickC "C for Yourself" reference
	incorrectly states the order of the parameters for _pg_chartms() and
	_pg_chartscatterms().
	
	The variables "n" and "nseries" are not in their correct order for the
	_pg_chartms() and _pg_chartscatterms() functions to properly plot the
	data values. The two variables, "n" and "nseries", must be switched
	for the functions to work correctly.
	
	The correct documentation for _pg_chartms() and _pg_chartscatterms() can
	be found in the on-line help for QuickC and QuickC with QuickAssembler
	integrated environment, and on Pages 144 and 145 of the "Microsoft
	QuickC Graphics Library Reference" manual.
	
	The incorrect functions are as follows:
	
	   _pg_chartms (chartenv far *env, char * far *categories,
	                float far *values, short n, short nseries,
	                short arraydim, char far *serieslabels);
	
	   _pg_chartscatterms (chartenv far *env, float far *valuesx,
	                       float far *valuesy, short n, short nseries,
	                       short arraydim, char * far *serieslabels);
	
	The correct parameters should read as follows:
	
	   _pg_chartms (chartenv far *env, char * far *categories,
	                float far *values, short nseries, short n,
	                short arraydim, char far *serieslabels);
	
	   _pg_chartscatterms (chartenv far *env, float far *valuesx,
	                       float far *valuesy, short nseries, short n,
	                       short arraydim, char * far *serieslabels);
