---
layout: page
title: "Q58175: BASIC PDS 7.00 List of Stub Files for Linking Smaller .EXE's"
permalink: /pubs/pc/reference/microsoft/kb/Q58175/
---

## Q58175: BASIC PDS 7.00 List of Stub Files for Linking Smaller .EXE's

	Article: Q58175
	Version(s): 7.00   | 7.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | SR# S900112-169
	Last Modified: 26-FEB-1990
	
	Below is the list of linker stub files that come with Microsoft BASIC
	Professional Development System (PDS) Version 7.00 for MS-DOS and MS
	OS/2. Stub files are special object files that block the inclusion of
	certain pieces of the BASIC run-time routines in the final .EXE file
	at link time. Most stub files can reduce .EXE program size and memory
	usage.
	
	This list can also be found on Pages 540-541 and 610-611 of the
	"Microsoft BASIC 7.0: Programmer's Guide," and on Pages 10-12 of the
	"Microsoft BASIC 7.0: Getting Started" manual.
	
	BASIC 7.00 Stub Files
	---------------------
	
	Filename              Description
	--------              -----------
	
	OVLDOS21.OBJ          DOS 2.10 support to an overlaid program. Does
	                      not reduce .EXE size.
	
	NOCGA.OBJ             Removes support for CGA graphics (SCREEN modes 1
	                      and 2).
	
	NOCOM.OBJ             Removes communications ("COM1:", "COM2:") device
	                      support in two cases. LINK includes
	                      communications support overhead only if you use a
	                      string variable in place of the file or device
	                      name, as in OPEN A$ FOR OUTPUT AS #1, or if you
	                      use a string constant starting with COMn in an
	                      OPEN statement.
	
	NOEDIT.OBJ            Reduces functionality of the editor provided
	                      with the INPUT and LINE INPUT statements to
	                      support only ENTER and BACKSPACE keys (no HOME,
	                      END, etc.).
	
	NOEGA.OBJ             Removes support for EGA graphics (SCREEN modes
	                      7, 8, 9, 10, 11).
	
	NOEMS.OBJ             Prevents the overlay manager from using Expanded
	                      Memory Specification (EMS); instead, the BASIC
	                      .EXE program is forced to swap to disk.
	
	NOEVENT.OBJ           Removes support for EVENT trapping. This stub
	                      file is effective only if linked with the BASIC
	                      run-time module (BRT70xxx.EXE); it has no effect
	                      when linked into stand-alone executables.
	
	NOFLTIN.OBJ           Replaces the numeric parsing code with an
	                      integer-only version. If you link with
	                      NOFLTIN.OBJ, all numbers used by INPUT, READ,
	                      and VAL must be legal long integers.
	
	NOGRAPH.OBJ           Removes all support for graphics statements and
	                      nonzero SCREEN modes. NOGRAPH.OBJ is a superset
	                      of the following stub files: NOHERC.OBJ,
	                      NOOGA.OBJ, NOCGA.OBJ, NOEGA.OBJ, and NOVGA.OBJ.
	
	NOHERC.OBJ            Removes support for Hercules graphics SCREEN 3.
	
	NOISAM.OBJ            Removes ISAM support from the BASIC run-time
	                      module (BRT70xxx.EXE) and is not useful for
	                      stand-alone programs (compiled with BC /O).
	
	NOLPT.OBJ             Removes line printer support.
	
	NOOGA.OBJ             Removes support for Olivetti graphics (SCREEN
	                      mode 4).
	
	NOTRNEMR.LIB          Removes support for transcendental operations,
	and NOTRNEMP.LIB      including: SIN, COS, TAN, ATN, LOG, SQR, EXP,
	                      ^ (the exponential operator), a CIRCLE statement
	                      with a start or stop value, and the DRAW
	                      statement with the A or T commands.
	
	NOVGA.OBJ             Removes support for VGA (Video Graphics Array)
	                      graphics (SCREEN modes 11, 12, 13).
	
	SMALLERR.OBJ          Reduces size of error messages displayed.
	
	TSCNIOxx.OBJ          Removes certain features from BASIC programs to
	                      produce text-only screen I/O. There are four
	                      files, depending on string type and operating
	                      system mode, as follows:
	
	                         TSCNIONR.OBJ   Near string, real mode (DOS)
	
	                         TSCNIOFR.OBJ   Far string, real mode (DOS)
	
	                         TSCNIONP.OBJ   Near string, OS/2 protected mode
	
	                         TSCNIOFP.OBJ   Far string, OS/2 protected mode
	
	                      The TSCNIOxx stub files remove all support for
	                      BASIC graphics modes and graphics statements,
	                      except SCREEN 0. They also remove support for
	                      special treatment of control characters. The
	                      TSCNIOxx stub files cannot be used with any of
	                      the other graphics stub files.
