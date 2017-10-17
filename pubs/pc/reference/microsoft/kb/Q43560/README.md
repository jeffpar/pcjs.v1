---
layout: page
title: "Q43560: Getting Full EXEC Pathname from Environment Table Using PSP"
permalink: /pubs/pc/reference/microsoft/kb/Q43560/
---

## Q43560: Getting Full EXEC Pathname from Environment Table Using PSP

	Article: Q43560
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S900406-139 B_BasicCom
	Last Modified: 15-JAN-1991
	
	In MS-DOS versions 3.00 and later, the full path of any executing
	program is stored after the environment variables in the environment
	segment that is found in the program segment prefix (PSP). This
	article provides a description of how to extract the EXEC path and
	gives an example of how to do this with BASIC.
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50, to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS, and to Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10.
	
	The segment address of the PSP for the currently executing process can
	be checked with the DOS Interrupt 21 hex, function 62 hex.
	
	The environment segment can be found in the PSP at offset 2C hex. The
	environment table has an entry for each environment variable of the
	format <name>=<parameter>. Each entry is terminated by a null
	character [CHR$(0)] and the entire table is followed by an additional
	null character. After the additional null character, there is a 2-byte
	word count. Immediately after the word count, the full path of the
	executing program is listed as
	
	   <drive>:<path>\<filename>.<extension>
	
	and is also terminated by a null character.
	
	For more information about the PSP and the environment table, see
	"Advanced MS-DOS Programming, 2nd Edition" by Ray Duncan, published by
	Microsoft Press (1988).
	
	Code Example
	------------
	
	The following code example provides a function that will return the
	full path of the currently executing program in DOS 3.00 and later:
	
	'Compile and link lines:
	' BC FULLPATH;
	' LINK FULLPATH,,,QB.LIB;    NOTE: QBX.LIB should be used for PDS
	'                                 7.00 or 7.10
	'$INCLUDE: 'qb.bi'  ' NOTE: QBX.BI should be used for PDS 7.00/7.10
	DECLARE FUNCTION FullPath$ ()
	CONST EnvOffInPSP = &H2C
	
	PRINT FullPath$
	
	FUNCTION FullPath$
	  DIM inregs AS RegType, OutRegs AS RegType
	
	  inregs.ax = &H6200 'Get PSP
	  CALL INTERRUPT(&H21, inregs, OutRegs)
	
	  PSPSeg% = OutRegs.bx
	  EnvironSeg& = 0
	  OffSet& = 0
	  tmp$ = ""
	
	  DEF SEG = PSPSeg%
	    EnvironSeg& = 256 * PEEK(EnvOffInPSP + 1) + PEEK(EnvOffInPSP)
	
	  DEF SEG = EnvironSeg&
	    WHILE (PEEK(OffSet&) <> 0 OR PEEK(OffSet& + 1) <> 0)
	      OffSet& = OffSet& + 1
	    WEND
	
	    'Skip extra bytes between Env Table and Fullpath
	    OffSet& = OffSet& + 4
	
	    'Build FullPath$ (until null terminates string)
	    WHILE PEEK(OffSet&) <> 0
	      tmp$ = tmp$ + CHR$(PEEK(OffSet&))
	      OffSet& = OffSet& + 1
	    WEND
	  DEF SEG
	
	  FullPath$ = tmp$
	END FUNCTION
