---
layout: page
title: "Q68659: Patches Available for Running Utilities Under Novell NetWare"
permalink: /pubs/pc/reference/microsoft/kb/Q68659/
---

## Q68659: Patches Available for Running Utilities Under Novell NetWare

	Article: Q68659
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | appnote SC0381.ARC s_codeview s_pwb s_c
	Last Modified: 6-FEB-1991
	
	When LINK version 5.10 is run under a Novell network, LINK may fail
	with the following error:
	
	   L1085: cannot open temporary file
	
	In addition, the C version 6.00 Setup program (SETUP.EXE), the
	Programmer's WorkBench (PWB) for DOS versions 1.00 and 1.10, and
	real-mode CodeView (CV.EXE) versions 3.00, 3.10, and 3.11 may all hang
	when run under some Novell NetWare software.
	
	These problems are directly related to the network software, but may
	be corrected with a set of patch files available from Microsoft as an
	application note titled "Network Patches for Utilities" (SC0381).
	Application notes can be obtained by calling Microsoft Product Support
	Services at (206) 637-7096.
	
	The "Network Patches for Utilities" application note can also be found
	in the Software/Data Library by searching on the keyword SC0381, the Q
	number of this article, or S12898. SC0381 was archived using the
	PKware file-compression utility.
	
	The following is the complete text of the application note, which
	includes the details of the problems mentioned above:
	
	======================================================================
	                    Network Patches for Utilities
	======================================================================
	
	The enclosed Network Patches for Microsoft Utilities disk contains the
	following five files:
	
	   README.DOC
	   CVPATCH.EXE
	   PWBPATCH.EXE
	   SETUPFIX.EXE
	   LINK.EXE
	
	These files solve conflicts with certain network setups. Please be
	sure to make backup copies of the original files.
	
	Network Patch Files
	-------------------
	
	When run under certain network software, some Microsoft utilities may
	hang. The enclosed patch files are designed to correct these problems
	for CodeView versions 3.00, 3.10, and 3.11; the Programmer's WorkBench
	(PWB) versions 1.00 and 1.10; and the C 6.00 Setup program.
	
	To install the patches, first copy the patch files (PWBPATCH.EXE,
	CVPATCH.EXE, and SETUPFIX.EXE) to the directories where you have
	installed PWB, CodeView, and Setup, respectively. Each patch assumes
	that the utility file it is to patch is in the same directory.
	
	Run SETUPFIX.EXE to patch SETUP.EXE. The original file will be saved
	as SETUP.BAK. Run CVPATCH.EXE to patch CV.EXE. The original file will
	be saved as CV.BAK. Run PWBPATCH.EXE to patch PWBED.EXE. The original
	file will be saved as PWBED.BAK. The patched utilities should run free
	of network interference.
	
	Microsoft LINK Version 5.13
	---------------------------
	
	LINK version 5.13 includes code to work around another problem that
	sometimes occurs when running on a network. On large projects, the
	linker needs to open some temporary files to work around DOS memory
	limitations. LINK version 5.10 (supplied with C 6.00) will sometimes
	fail in its attempts to open a temporary file when run under certain
	network software.
	
	The problem actually lies in the network software, not the linker.
	When the network is loaded, the return value from an open call
	sometimes gets corrupted. When the call fails, it is because an "Out
	of handles" error (EMFILE) is returned as a "No such file or
	directory" error (ENOENT). If this occurs, LINK 5.10 halts with an
	"L1085: cannot open temporary file" error.
	
	LINK 5.13 includes a change to correct for the above situation (even
	though the problem is in the network software). When LINK version 5.13
	receives an ENOENT error on a failed open call, it will still try to
	free some file handles and reopen the temporary file, regardless of
	the error returned.
	
	To make the correction, locate LINK version 5.10 and replace it with
	LINK version 5.13 from the enclosed disk. Again, be sure to save a
	backup copy of the original file (LINK 5.10).
