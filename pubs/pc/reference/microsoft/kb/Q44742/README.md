---
layout: page
title: "Q44742: New Command-Line Options in Qasm"
permalink: /pubs/pc/reference/microsoft/kb/Q44742/
---

## Q44742: New Command-Line Options in Qasm

	Article: Q44742
	Version(s): 2.01
	Operating System: MS-DOS
	Flags: ENDUSER |
	Last Modified: 26-JUN-1989
	
	Quick Assembler recognizes the new ML-style options to be similar and
	consistent with CL options. Qasm does not recognize old-style options
	(MASM Version 5.10 and previous).
	
	Like CL, if the /c switch is not specified, the linker is invoked
	following a successful assembly. Unlike old-style Macro Assembler
	options, Qasm switches are case sensitive.
	
	The following are the switches which the Quick Assembler supports:
	
	/a        Alphabetical segment order (was /A)
	/c        Assemble only (new switch)
	/D        Define symbol (was /Dsym[=value])
	/Ez       Displays error lines on the screen (was /Z)
	/FPi      Generate emulator calls (was /E)
	/help     Print help listing (was /H)
	/I        Include path (was /I)
	/l        Generate a listing file with the default name (was /L)
	/L[cr]    Specifies flags for the linker (new switch)
	/Fefile   Names the output .EXE file (new switch)
	/Flfile   Generate a listing file with specified name (new switch)
	/Fofile   Name the output .OBJ file (new switch)
	/M[uxl]   Controls case sensitivity (was /M[uxl]
	/s        Sequential segment order (was /S)
	/Sa       List all lines (was /La..implies listing is on)
	/Sd       Create pass 1 listing (was /D) (implies listing is on)
	/Se       Listing is editor oriented (new switch) (implies listing is on)
	/Sn       Suppresses symbol table in list file (was /N)
	          (implies listing is on)
	/Sp       Listing is printer oriented (new switch)
	          (implies listing is on)
	/Sq       Generate line-number index in listing (new switch)
	          (implies listing is on)
	/Sx       Suppresses listing of false conditionals (was /X)
	          (implies listing is on)
	/t        Suppresses messages for successful assembly (was /T)
	/v        Verbose messages  (was /V)
	/W[012]   Warning level setting 0, 1, or 2 (was /W[012])
	/Z[di]    Generate debug information (was /Z[di])
