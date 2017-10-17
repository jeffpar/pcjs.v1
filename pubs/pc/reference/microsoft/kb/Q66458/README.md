---
layout: page
title: "Q66458: Pascal 4.00 and C 6.00 Mixed Language Considerations"
permalink: /pubs/pc/reference/microsoft/kb/Q66458/
---

## Q66458: Pascal 4.00 and C 6.00 Mixed Language Considerations

	Article: Q66458
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | s_pascal
	Last Modified: 19-JAN-1991
	
	To link objects created with Microsoft Pascal version 4.00 and
	Microsoft C version 6.00 or 6.00a into the same executable, certain
	objects must be removed from the standard Pascal library. If these
	objects are not removed, the linker error "L2025: symbol defined more
	than once" will occur on several symbols. These symbols are listed
	below.
	
	The following LIB command will remove the proper objects from the
	Pascal library. LIB will create a backup of the original library
	called LIBPASE.BAK. You will want to keep this backup copy for
	straight Pascal linking.
	
	   lib libpase -crt0 -nmalloc -fmalloc -amalloc -pnmsize;
	
	When linking, the /NOD and /NOE switches must be used on the link
	command line, and the C libraries must be listed before the Pascal,
	for example:
	
	   link /NOD /NOE c.obj pascal.obj,test.exe,,mlibce libpase;
	
	Following is a list of errors that will occur if an attempt is made to
	link without removing the necessary objects from the Pascal library:
	
	   libpase.lib(nmalloc.asm) : error L2025: __nfree :
	       symbol defined more than once
	   libpase.lib(nmalloc.asm) : error L2025: __nmalloc :
	       symbol defined more than once
	   libpase.lib(amalloc.asm) : error L2025: __amblksiz :
	       symbol defined more than once
	   libpase.lib(os2\crt0.asm) : error L2025: __aexit_rtn :
	       symbol defined more than once
	   libpase.lib(os2\crt0.asm) : error L2025: __acmdln :
	       symbol defined more than once
	   libpase.lib(os2\crt0.asm) : error L2025: __asizds :
	       symbol defined more than once
	   libpase.lib(os2\crt0.asm) : error L2025: __astart :
	       symbol defined more than once
	   libpase.lib(os2\crt0.asm) : error L2025: __atopsp :
	       symbol defined more than once
	   libpase.lib(os2\crt0.asm) : error L2025: __acfinfo :
	       symbol defined more than once
	   libpase.lib(os2\crt0.asm) : error L2025: __aenvseg :
	        symbol defined more than once
	   libpase.lib(os2\crt0.asm) : error L2025: __cintDIV :
	       symbol defined more than once
	   libpase.lib(os2\crt0.asm) : error L2025: __amsg_exit :
	       symbol defined more than once
	
	This procedure described above is necessary because the newer
	libraries that shipped with C 6.00 use different start-up and memory
	handling routines. Because the routines in the Pascal libraries will
	not work correctly with the C 6.00 libraries, the objects must be
	removed. Remember when building your application to compile the C code
	with /AM, /AL, or /AH because the Pascal code will require far
	function calls.
