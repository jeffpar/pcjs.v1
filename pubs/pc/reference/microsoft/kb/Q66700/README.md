---
layout: page
title: "Q66700: Redirecting Standard Input Does Not Affect getch() Under OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q66700/
---

	Article: Q66700
	Product: Microsoft C
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER |
	Last Modified: 11-NOV-1990
	
	Redirecting STDIN (standard input) in the OS/2 environment does not
	change the behavior of the getch() function; it will continue to read
	from the keyboard. This is different from the DOS environment where
	redirecting STDIN also causes getch() to be redirected.
	
	The getchar() function could be used instead because it reads from
	standard input and will conform with redirection under OS/2. However,
	if standard input is not redirected, you will have to press ENTER
	after each character typed in. This can be nuisance when the program
	does not know if input will be redirected or not.
	
	A simple workaround is to use the FAPI function DosQHandType to
	determine if standard input has been redirected or not. The program
	can then call either getch() or getchar(), accordingly. The following
	sample code illustrates the workaround:
	
	Sample Code
	-----------
	
	#define INCL_VIO
	#include<os2.h>
	#include<conio.h>
	
	void main(void)
	{
	   USHORT fsType, usDeviceAttr;
	
	   DosQHandType(0, &fsType, &usDeviceAttr);
	
	   if(LOBYTE(fsType) == HANDTYPE_DEVICE)
	   {
	      /* Standard input is not redirected. */
	      /* Use getch() for input.            */
	   }
	   else if(LOBYTE(fsType) == HANDTYPE_FILE)
	   {
	      /* Standard input is redirected to a file. */
	      /* Use getchar() for input.                */
	   }
	}
