---
layout: page
title: "Q27476: Guidelines for Interfacing FORTRAN with Compiled BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q27476/
---

## Q27476: Guidelines for Interfacing FORTRAN with Compiled BASIC

	Article: Q27476
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | B_BasicCom
	Last Modified: 14-DEC-1988
	
	Interfacing FORTRAN with compiled BASIC is fairly straightforward;
	however, there are several rules to observe.
	
	These rules are as follows:
	
	1. FORTRAN should not be linked with the small-memory model.
	
	2. When compiling the FORTRAN subroutine, no special switches need to
	   be used. However, you need to LINK the BASIC and FORTRAN routines
	   with the /NOE option.
	
	3. FORTRAN has the ability to call BASIC subprograms; however, the
	   FORTRAN routine that calls the BASIC subprograms must have
	   originally been called by a BASIC main program.
	
	4. All variables that are passed from a FORTRAN routine to a BASIC
	   subprogram must be [NEAR] variables.
	
	5. FORTRAN routines can be used in a quick library if so desired.
	
	6. Microsoft FORTRAN Version 4.00 is needed to correctly interface
	   with QuickBASIC Version 4.00. Microsoft FORTRAN Version 4.10 is
	   needed to correctly interface with QuickBASIC Versions 4.00b and
	   4.50 or BASIC Compiler Versions 6.00 and 6.00b programs.
