---
layout: page
title: "Q48793: exec() and spawn() with P_OVERLAY Ignore Maximum Allocation"
permalink: /pubs/pc/reference/microsoft/kb/Q48793/
---

	Article: Q48793
	Product: Microsoft C
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC S_QuickASM
	Last Modified: 16-JAN-1990
	
	Exec() and spawn() with P_OVERLAY ignore the maximum memory allocation
	information in the .EXE file header. If you exec or spawn with
	P_OVERLAY, a program whose maximum allocation is set equal to the
	minimum allocation (through EXEMOD or the LINK option /CP:1), the
	program is allocated the full 64K DGROUP.
	
	The effective maximum allocation for any exec'ed (or spawn'ed with
	P_OVERLAY) program is 0xffff (whatever DOS has available), regardless
	of the maximum allocation number in the program's .EXE header. When
	run from the DOS prompt, the maximum allocation information of the
	same program is honored.
	
	This behavior occurs because the exec() and spawn() with P_OVERLAY
	functions do not invoke COMMAND.COM, which looks at the minalloc and
	maxalloc fields in the exe header. This is expected behavior for
	exec() and spawn() with P_OVERLAY in C Versions 4.00, 5.00, and 5.10,
	and QuickC 1.00, 1.01, 2.00, and 2.01 (QuickAssembler), as documented
	in the C 5.10 README.DOC on Line 1275, in the run-time library notes
	section for the exec() functions.
	
	Alternatives
	------------
	
	Instead of calling a program with exec() or spawn() with P_OVERLAY,
	call COMMAND.COM with the desired child program as an argument using
	exec() or spawn() with P_OVERLAY, as follows:
	
	spawnl(P_OVERLAY,"c:\\command.com","command.com","/c child.exe",NULL);
	
	COMMAND.COM then loads your application as if it was from the DOS
	prompt. Note, however, that the COMMAND.COM shell itself requires
	approximately 4K. Also, consecutive exec() or spawn() with P_OVERLAY
	calls using this method run additional shells of COMMAND.COM,
	accumulating one 4K shell per generation, as illustrated below:
	
	          +------+    +------+    +------+    +------+
	          |  P1  |--> |__P2__|--> |__P3__|--> |__P4__|
	          +------+    | .COM |    |_.COM_|    |_.COM_|
	                      +------+    | .COM |    |_.COM_|
	                                  +------+    | .COM |
	                                              +------+
	
	Another option is to call your program with the system() function, but
	this does not overlay the child process.
	
	Additional reference words: execl execle execlp execlpe execcv execve
	execvp execvpe spawnl spawnle spawnlp spawnlpe spawnv spawnve spawnvp
	spawnvpe
