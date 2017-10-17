---
layout: page
title: "Q59410: What Windows SDK Does to the C Run-Time Libraries"
permalink: /pubs/pc/reference/microsoft/kb/Q59410/
---

## Q59410: What Windows SDK Does to the C Run-Time Libraries

	Article: Q59410
	Version(s): 5.00 5.10 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | w_winsdk
	Last Modified: 11-JUL-1990
	
	The Windows SDK does the following to the C run-time libraries:
	
	1. It looks for all the libraries with xLIBCy.LIB, where x = memory
	   model and y = e or a (emulator or alternate math).
	
	2. It copies xLIBCy.LIB to xLIBCyC.LIB to retain the original C
	   library.
	
	3. It builds the windows libraries using *.bld files from the Windows
	   SDK distribution disk. The result is xLIBCyW.LIB libraries.
	
	   The following functions are taken out (-) and added (+) with the
	   following libraries:
	
	   a. C 5.00 emulator math libraries:
	
	      -alloca   -amalloc -brk    -brkctl  -calloc   -cfpsig   -chkstk
	      -chksum   -crt0    -crt0fp -em3     -emoem    -expand   -fheapchk
	      -fheapwal -fmalloc -fmsize -freect  -halloc   -nheapchk -nheapwal
	      -nmalloc  -nmsghdr -nmsize -realloc -stdalloc -xheapchk
	
	      +__fpmath  +wfpsig
	
	   b. C 5.10 emulator math libraries:
	
	      -alloca   -amalloc -brkctl -brk     -calloc   -cfpsig   -chkstk
	      -chksum   -crt0    -crt0fp -em      -emoem    -expand   -fheapchk
	      -fheapwal -fmalloc -fmsize -freect  -halloc   -nheapchk -nheapwal
	      -nmalloc  -nmsghdr -nmsize -realloc -stdalloc -xheapchk
	
	      +__fpmath  +wfpsig
	
	   c. C 5.00 or 5.10 alternate math libraries:
	
	      -alloca -amalloc -brk      -brkctl   -calloc   -ccalle   -chkstk
	      -chksum -crt0    -crt0fp   -expand   -fheapchk -fheapwal -fmalloc
	      -fmsize -freect  -halloc   -nheapchk -nheapwal -nmalloc  -nmsghdr
	      -nmsize -realloc -stdalloc -xheapchk
	
	      +wfasig
	
	4. It copies either xLIBCyC.LIB or xLIBCyW.LIB to xLIBCy.LIB,
	   depending on which libraries you want to be used as the primary.
	   The resulting libraries are xLIBCy.LIB (primary to be used),
	   xLIBCyW.LIB (library for Windows SDK), and xLIBCyC.LIB (library for
	   C).
	
	If compiling with Microsoft C version 6.00 and using the Windows 2.1x
	SDK, use the /Gh switch and link with the libraries from C version
	5.10. In addition, use all the tools that shipped with the Windows
	2.1x SDK, including LINK4.EXE and RC.EXE.
