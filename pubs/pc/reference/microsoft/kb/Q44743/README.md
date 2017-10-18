---
layout: page
title: "Q44743: Major Changes between QuickC 2.00 and Quick Assembler"
permalink: /pubs/pc/reference/microsoft/kb/Q44743/
---

## Q44743: Major Changes between QuickC 2.00 and Quick Assembler

	Article: Q44743
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 26-JUN-1989
	
	The following lists the major changes between QuickC 2.00 and Quick
	Assembler 2.01:
	
	 1. Quick Assembler 2.01 is bundled with a modified QuickC which has
	    version number 2.01 (this can be found by typing QCL at the DOS
	    command prompt).
	
	 2. Quick Assembler is a super-set of QuickC. It contains ALL of the
	    functionality and capabilities of QuickC, with the additional power
	    of a quick assembler.
	
	 3. Quick Assembler does not exist without a QuickC 2.01. It is a
	    bundled package. There will continue to be a stand alone QuickC
	    2.00 package, but no stand alone Quick Assembler.
	
	 4. No Floppy Disk Support: Quick Assembler requires a hard disk. It
	    does not support execution on a floppy disk system.
	
	 5. New Type Casts for debugging: BY, WO, DW are used by CodeView to
	    simulate MASM <type> PTR. These type casts are now acceptable to
	    the Watch expression evaluator in the Quick environment.
	
	    Note: BY <reg>      is the same as * (char *) <reg>
	          BY <addrexpr> is same as  * (char *) <addrexpr>
	          BY <var>      is the same as * (char *) &<var>
	
	    WO and DW behave analogously, with WO equivalent to * (int*) and
	    DW equivalent to * (long *).
	
	 6. Segmentation Support: The colon ':' operator is recognized
	    as indicating a full segmented address in Watch expressions. The
	    segment portion can be either a segment register or a numeric
	    value.
	
	 8. .COM File Production and Debugging: Quick Assembler allows for
	    both the production and debugging of .COM files. LINK.EXE has been
	    modified to check if /TINY and /CODEVIEW are both specified. If
	    so, the symbolic information will be emitted into a separate .DEB
	    file (instead of placing it in the .EXE file as per normal).
	
	    The debugger checks the extension of the file it is loading, and
	    if it is a .COM, the debugger will get CodeView information from
	    the .DEB file.
	
	    Note: This support of .COM files is currently restricted to the
	    Quick Assembler and does not extend to the QuickC portion of the
	    package. Microsoft is actively pursuing extending the .COM support
	    to a future release of QuickC.
	
	 9. Ten-Byte Real Support: In assembly, ten-byte reals may be defined
	    using the DT directive. Support has been added to allow Watches of
	    ten-byte reals, and to allow their values to be modified using
	    Debug.Modify Value. As in CodeView, they will not be allowed in
	    expressions.
	
	10. Screen Swapping: The debugger will force screen swapping when
	    tracing a file with a .ASM extension so that direct output is not
	    misplaced.
	
	11. First Trace into Assembly Programs: The first Trace into a pure
	    assembly program (i.e., no C startup code) will actually execute the
	    first statement. This differs from CodeView and the way the QuickC
	    debugger operates on .C files.
	
	12. Qasm will be called by QCL: The Quick Assembler will be directly
	    callable through QCL. This means that when a *.ASM file is
	    specified to QCL it will invoke Qasm with all arguments passed
	    through unchanged.
