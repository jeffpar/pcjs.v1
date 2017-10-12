---
layout: page
title: "Q30826: How to Load a C Extension that Is Not in Current Directory"
permalink: /pubs/pc/reference/microsoft/kb/Q30826/
---

	Article: Q30826
	Product: Microsoft C
	Version(s): 1.00
	Operating System: OS/2
	Flags: ENDUSER | TAR75933 docerr
	Last Modified: 8-JUN-1988
	
	Page 84 of the "Microsoft Editor for OS/2 and MS-DOS User's Guide"
	incorrectly infers that the M.EXE editor will search for a C-extension
	module along the DOS PATH under MS-DOS or OS/2 real mode when you
	place the following statement in the TOOLS.INI file:
	
	   load:myext.exe
	
	   To search for a C-extension module along the DOS PATH, you must
	instead use the following load switch syntax in the TOOLS.INI file:
	
	   load:{$ENVAR: | dos path}filename.ext
	
	where you have the option of using $ENVAR: (a DOS environment
	variable) or an explicit directory path specification.
	   You can prefix your filename with $PATH: or $INIT:. For example,
	"$PATH:filename.ext" means the "filename.ext" is to be found in the
	directories in the DOS PATH. This format is valid in any filename
	context. The following example will go to the STDIO.H file that
	actually is being used by the compiler:
	
	   <arg> "$INCLUDE:stdio.h" <setfile>
	
	   Also, when operating under OS/2, $ENVAR:, the explicit DOS path,
	and the extension on the filename are ignored. Instead, filename.DLL
	is searched for in your LIBPATH. Please note that LIBPATH under OS/2
	is not an environment variable. LIBPATH is a directive in the
	CONFIG.OS2 file.
	   The following are examples of using the load switch in TOOLS.INI:
	
	   ; load 'my.ext' from the current directory.
	   ; Under OS/2, load my.dll from LIBPATH.
	   load:my.ext
	
	   ; load 'your.ext' from either the current directory or one
	   ; of the directories on path
	   ; Under OS/2, load 'your.dll' from LIBPATH
	   load:$PATH:your.ext
	
	   ; load 'c:\init\ourext'.
	   ; Under OS/2, load 'ourext.dll' from LIBPATH
	   load:c:\init\ourext
