---
layout: page
title: "Q22331: &quot;Invalid Object Module&quot; Usually Caused by Old Version of LINK"
permalink: /pubs/pc/reference/microsoft/kb/Q22331/
---

## Q22331: &quot;Invalid Object Module&quot; Usually Caused by Old Version of LINK

	Article: Q22331
	Version(s): 3.00 4.00 5.00 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 4-DEC-1990
	
	In many cases, an "invalid object module" error message from the
	linker indicates that an incorrect version of LINK is being utilized.
	Most DOS systems contain a DOS directory listed near the beginning of
	the PATH. Because DOS ships with a version of LINK, this version is
	often picked up instead of the correct version.
	
	To indicate if the wrong linker is the source of an "invalid object
	module" error, perform the following steps:
	
	1. Change into the language product directory where the version of
	   LINK.EXE that came with the compiler you are currently using
	   resides.
	
	2. Type "link" at the DOS prompt.
	
	3. The copyright banner for LINK will appear. Note the version number
	   of LINK that is indicated. (This is the correct version of LINK
	   that you should be using.)
	
	4. Press CTRL+C to exit out of LINK.
	
	5. Switch to the work directory where you normally compile and link
	   your program.
	
	6. Perform steps 2 through 4 again.
	
	If the version of LINK that comes up in your work directory is
	different than the correct version you first noted in the language
	directory, then you have another version of LINK in a directory in
	your PATH that comes before the directory with the correct version.
	
	If you do find that you are picking up another LINK.EXE on your
	system, you will need to determine where it resides. Most likely, it
	is a DOS linker that came with the operating system because these are
	older versions of LINK that are not well-matched to the newer language
	products. Be aware, however, that it also could be the linker from
	another Microsoft language product. In either case, you should do one
	of the following to correct this problem:
	
	1. Locate the old linker and rename it to something resembling LINK.OLD.
	   It is rare that you would need the DOS linker for anything, but this
	   method assures that it will still be available.
	
	2. Change your path so that your PATH environment variable points
	   first to the directory containing the correct version of LINK.EXE.
	   This solution is less preferable than the one above because it does
	   nothing to ensure that the problem will not appear again if you make
	   some changes to your system.
	
	It is not uncommon to have a number of linkers in directories that are
	specified in the PATH. Therefore, it is highly recommended that you
	repeat the version number test from within your work directory once
	you have implemented one of these solutions.
