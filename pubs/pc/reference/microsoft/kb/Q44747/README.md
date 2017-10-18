---
layout: page
title: "Q44747: Differences between Quick Assembler and Macro Assembler"
permalink: /pubs/pc/reference/microsoft/kb/Q44747/
---

## Q44747: Differences between Quick Assembler and Macro Assembler

	Article: Q44747
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 26-JUN-1989
	
	The following article lists the major changes between the Microsoft
	Quick Assembler Versions (Qasm) 2.01 and the Macro Assembler.
	
	1. Quick Assembler Supports Only Real Mode 286
	
	   Qasm supports all Intel assembly instructions that lie within
	   the scope of real mode 80286. This means the directives .386,
	   .386p, .387, and .286p will be recognized; however, they produce
	   one of the following two errors:
	
	      A2119:    80386 processor not supported.
	      A2120:    Privileged instructions not supported.
	
	2. .MODEL TINY Is Supported to Allow for .COM Files
	
	   The Tiny model is now supported by the Quick Assembler and the
	   linker shipped with Qasm. This means that EXE2BIN is not needed for
	   .COM file production.
	
	3. .MODEL Changes and Additional Features
	
	   To assist you in writing code that can be easily switched between
	   memory models, a new predefined equate, @MODEL, is available. This
	   equate has the following values:
	
	      1 = TINY.  2 = SMALL. 3 = MEDIUM.
	      4 = COMPACT. 5 = LARGE.  6 = HUGE.
	
	   The following code fragment shows how this equate can be used to
	   switch between small and tiny models:
	
	.model    <specified model>
	.data
	.code
	
	start:
	          if @MODEL NE 1      ; if not TINY model
	          mov  ax, @data
	          mov  ds, ax
	          endif
	          .
	          .
	
	4. FAR_STACK and LOCAL_STACK attributes to .MODEL
	
	      .Model Small, c, FAR_STACK
	      .Model Small, c, LOCAL_STACK
	
	   LOCAL_STACK is the default and directs .MODEL and .STACK to behave
	   as they have done in the past, i.e., set up the segments for an
	   SS = DS environment.
	
	   FAR_STACK instructs Qasm to perform the correct setup for a
	   SS!= DS environment.
	
	5. New Directive .STARTUP
	
	   .STARTUP expands to the correct code for the given model and
	   FAR/LOCAL_STACK value. This expansion includes initializing DS,
	   SS, and SP when necessary. It also defines a start address
	   label and directs the END directive to use this start label.
	
	   This directive is designed only for stand-alone programs. It should
	   not be used for code that is mixed with higher-level languages such
	   as C, FORTRAN, etc., because it conflicts with their startup
	   code.
	
	   Likewise, this directive should be used for stand-alone DOS
	   programs. The load conditions for OS/2 are different.
	
	   6. /P1 switch Implies a One-Pass Assembly
	
	   Qasm supports a one-pass assembly run as well as the standard
	   two-pass assembly run.
	
	   A listing cannot be produced when the single-pass option is chosen,
	   i.e., /Fl and /a are not tolerated when the /P1 option is given).
	
	7. Screen-Oriented Listing File
	
	   /Se is a new option that instructs Qasm to generate a listing
	   file that is oriented to the screen rather than a disk file. Use of
	   this option implies the following:
	
	   a. No page headers or formfeeds will be inserted.
	
	   b. The first argument to the PAGE command will have no effect.
	
	   c. The default PAGE's second argument will be 255.
	
	   d. TITLE and SUBTTL directives will be ignored.
	
	8. /Sp Is the Counter Option to /Se
	
	   /Sp produces a printer-oriented listing file.
	
	9. Object Code Improvements
	
	   Near JMPs and CALLs to nonexternal labels used to have associated
	   FIXUPs generated. Qasm now calculates the relative displacement
	   internally, rather than having the linker do it. This process
	   saves 7 bytes per JMP/CALL in terms of .obj size.
	
	   Shorthand fixup forms are now used. If the frame is equal to the
	   target, a frame=target form of fixup is used, and the frame datum
	   is not needed. Similarly, if the frame is equal to the location,
	   the frame=location form is used.
	
	   Threads are now defined, and thread fixups are used where possible.
	
	All of these changes should decrease the size of the resultant object.
	Savings in size should range from 5 to 20 percent.
