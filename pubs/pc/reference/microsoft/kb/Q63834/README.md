---
layout: page
title: "Q63834: How to LINK PROISAMD.LIB to .EXE Even If SETUP &quot;ISAM in TSR&quot;"
permalink: /pubs/pc/reference/microsoft/kb/Q63834/
---

## Q63834: How to LINK PROISAMD.LIB to .EXE Even If SETUP &quot;ISAM in TSR&quot;

	Article: Q63834
	Version(s): 7.00 7.10 | 7.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER | SR# S900706-104
	Last Modified: 6-SEP-1990
	
	The following technique gives you the setup configuration with the
	greatest flexibility of choice for ISAM support (as either a TSR
	[terminate-and-stay resident] program or linkable .LIB) in compiled
	.EXE programs.
	
	If you chose "ISAM Routines in TSR" (instead of "ISAM Routines in
	LIB") when you ran SETUP.EXE, then to make a standalone .EXE program
	(that uses ISAM) that does not require the PROISAMD.EXE or PROISAM.EXE
	TSR program, you must LINK with the PROISAMD.OBJ and PROISAMD.LIB
	component libraries in the linker's object list. This technique
	requires that you choose to retain component libraries when you run
	SETUP.EXE.
	
	This information applies to Microsoft BASIC Professional Development
	System (PDS) versions 7.00 and 7.10 under MS-DOS. This also applies to
	version 7.10 under MS OS/2.
	
	With BASIC PDS 7.00, there are four SETUP.EXE options for installing
	ISAM support for compiled .EXE programs:
	
	1. ISAM Routines in TSR
	2. ISAM Routines in LIB, Support Database Creation and Access
	3. ISAM Routines in LIB, Support Database Access Only
	4. No ISAM support
	
	Only Option 1 creates PROISAM.EXE and PROISAMD.EXE TSR programs that
	can be used with BASIC compiled .EXE programs. The TSR program created
	in Option 1 can also be used in QBX.EXE. Option 1 is the default since
	it consumes the least disk space.
	
	Options 2 and 3 create PROISAM.EXE and PROISAMD.EXE TSR programs that
	CANNOT be used in compiled .EXE programs and that can only be used by
	QBX.EXE and the ISAM utilities (ISAMIO.EXE, ISAMCVT.EXE, ISAMREPR.EXE,
	and ISAMPACK.EXE). If you choose Option 2 or 3 and you want ISAM
	support in your .EXE program, you must link to the ISAM .LIB files
	instead of using the TSR support for ISAM.
	
	SETUP Option 4 does not copy any ISAM-related files onto your
	computer.
	
	You may want to have the option of creating .EXE programs with full
	ISAM support provided either in the TSR program or linked from
	libraries. This can be accomplished by choosing Option 1 ("ISAM
	Routines in TSR") and LINKing with PROISAMD.OBJ and PROISAMD.LIB in
	the object list, as follows:
	
	   LINK /NOE ISAMPROG.OBJ+PROISAMD.OBJ+PROISAMD.LIB;
	
	The following are some important notes about the above LINK command
	line:
	
	1. The NOExtended library search option (/NOE) is necessary to prevent
	   "Symbol Defined More than Once (L2025)" errors.
	
	2. Both object (PROISAMD.OBJ) and library (PROISAMD.LIB) files are
	   required to LINK properly.
	
	3. The PROISAMD.OBJ is normally deleted with component libraries by
	   SETUP.EXE. You must choose to retain component libraries when you
	   run SETUP.EXE to retain this necessary file.
	
	4. PROISAMD.LIB must be specified in the object list instead of the
	   library list on the LINK command line, as shown. (When LINKing a
	   library in the object list, all object files contained in that
	   library are LINKed into the EXE, as opposed to only the routines
	   that are not otherwise resolved.)
	
	5. ISAMPROG.BAS must be compiled with the BC /O (standalone) option.
	   If you don't compile with BC /O, then the LINK error L2029
	   "Unresolved external" error will occur for 'b$IsamRtmUsed' and
	   'B$DOS3CHECK'.
	
	Code Example
	------------
	
	The following code example would normally require the PROISAMD.EXE TSR
	program (when the "ISAM Routines in TSR" option is chosen during
	SETUP), but using the LINK line given below, the TSR program is not
	necessary.
	
	Compile and link as follows:
	
	   BC ISAMPROG /O;
	   LINK /NOE ISAMPROG.OBJ+PROISAMD.OBJ+PROISAMD.LIB;
	
	' Name this source file as follows: ISAMPROG.BAS
	TYPE test
	  x AS INTEGER
	END TYPE
	OPEN "ISAMFILE" FOR ISAM test "table" AS #1
	CLOSE #1
	END
