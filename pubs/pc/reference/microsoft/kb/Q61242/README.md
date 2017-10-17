---
layout: page
title: "Q61242: C 6.00 README: Patching MOUCALLS.DLL (OS/2 1.10 Only)"
permalink: /pubs/pc/reference/microsoft/kb/Q61242/
---

## Q61242: C 6.00 README: Patching MOUCALLS.DLL (OS/2 1.10 Only)

	Article: Q61242
	Version(s): 6.00   | 6.00
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 25-APR-1990
	
	The following information is taken from the C Version 6.00 README.DOC
	file.
	
	Patching MOUCALLS.DLL (OS/2 1.10 Only)
	--------------------------------------
	
	The dynamic-link library, MOUCALLS.DLL, handles OS/2 API functions
	that process mouse messages. Some versions of MOUCALLS.DLL shipped
	with OS/2 1.10 cause a general protection fault when running such
	applications as the Programmer's WorkBench (PWB). This section
	describes how to patch MOUCALLS.DLL to correct the error.
	
	Identifying the Problem
	-----------------------
	
	When a general protection fault occurs under OS/2, the system displays
	the location of the fault. If the fault occurs with CS equal to 20F,
	follow the procedure outlined in the next section to patch
	MOUCALLS.DLL.
	
	Patching MOUCALLS.DLL
	---------------------
	
	Because OS/2 1.10 with the Presentation Manager uses MOUCALLS.DLL, you
	cannot directly alter the file. Instead you must modify a copy of the
	file as shown:
	
	 1. Create a directory on your boot disk called C:\NEWMOU.
	
	 2. Copy your C:\CONFIG.SYS file to C:\CONFIG.MOU.
	
	 3. Edit your C:\CONFIG.SYS file. There is a line in it that begins
	    with LIBPATH. Add the directory C:\NEWMOU as the first directory
	    in the line. So, if the LIBPATH line originally looks like
	
	      LIBPATH=C:\OS2;C:\LANMAN
	
	   change it to
	
	      LIBPATH=C:\NEWMOU;C:\OS2;C:\LANMAN
	
	 4. Locate the file MOUCALLS.DLL on your hard drive. It is probably in
	    the OS2 directory of your boot drive. If not, it is certainly in
	    one of the directories listed in the LIBPATH line you just edited.
	
	    Copy MOUCALLS.DLL to the C:\NEWMOU directory.
	
	 5. Reboot your computer.
	
	 6. After the system has come back up, change directories to the
	    C:\OS2 directory, or wherever the original MOUCALLS.DLL resides.
	
	 7. Run the following command:
	
	       PATCH MOUCALLS.DLL
	
	    The PATCH program prompts you for the offset location to be patched.
	    Type the following offset:
	
	       1432
	
	    Then change the hexadecimal value of the byte at that location from
	    1A to 1C.
	
	    Note that there should be a program called PATCH.EXE on your path.
	    It will make the appropriate change to the MOUCALLS.DLL file.
	
	 8. Copy C:\CONFIG.MOU back over C:\CONFIG.SYS and delete
	    C:\CONFIG.MOU.
	
	 9. Reboot your computer.
	
	10. After the system has come back up, delete the files in C:\NEWMOU
	    and remove the directory.
