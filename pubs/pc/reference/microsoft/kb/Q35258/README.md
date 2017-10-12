---
layout: page
title: "Q35258: Why Compiling after Editing in M Shows Old Errors"
permalink: /pubs/pc/reference/microsoft/kb/Q35258/
---

	Article: Q35258
	Product: Microsoft C
	Version(s): 1.00   | 1.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 20-OCT-1988
	
	When using the M editor (either M.EXE or MEP.EXE) to correct compiler
	or assembler errors, and then compiling/assembling from within M using
	the COMPILE function, it is possible to get the old set of errors
	returned. If the errors occur, check that the autosave switch is set
	correctly. If autosave is off, the corrections are not saved before
	compilation.
	
	When turned on, the autosave boolean initialization switch causes the
	current file to be saved whenever it is switched away from. The
	default value is on, i.e., the files are automatically saved. The
	setting can be changed from within the editor using Arg textarg Assign
	or else in TOOLS.INI.
	
	In either case, specify noautosave: to prevent automatic saving of
	files, or autosave: to restore automatic file saving.
