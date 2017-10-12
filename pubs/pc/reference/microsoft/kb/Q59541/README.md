---
layout: page
title: "Q59541: How to Determine the Operating System Mode and Version"
permalink: /pubs/pc/reference/microsoft/kb/Q59541/
---

	Article: Q59541
	Product: Microsoft C
	Version(s): 4.x 5.00 5.10 6.00 | 5.10 6.00
	Operating System: MS-DOS             | OS/2
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 18-APR-1990
	
	There are four variables defined by the start-up source code for the
	Microsoft C compilers that can be used to determine the version of the
	operating system the program is running on as well as whether the
	program is running in DOS or OS/2 mode. Those variables are _osmajor,
	_osminor, _osversion, and _osmode.
	
	The four variables are prototyped in the DOS.H and STDLIB.H header
	files, declared in the CRT0DAT.ASM start-up source file, and defined
	in both CRT0DAT.ASM and STDARGV.ASM files. They are defined as
	follows:
	
	   Variable     Definition
	   --------     ----------
	
	   _osmajor     Holds the major operating system version number.
	
	   _osminor     Holds the minor operating system version number.
	
	   _osversion   Holds the complete version number, as follows:
	                the high-order byte contains the minor version
	                number and the low-order byte holds the major
	                version number.
	
	   _osmode      Defined as DOS_MODE or OS2_MODE for DOS or OS/2
	                operating systems. The variable is set to
	                DOS_MODE if you are running OS/2, but in the DOS
	                compatibility box.
	
	The _osmajor is set to 10 for Versions 1.00, 1.10, and 1.20 of OS/2,
	and 20 for Version 2.00.
	
	Note that _osmode is not defined for DOS-only versions of the compiler
	(for example, QuickC, C 5.00, etc.).
	
	Sample Program
	--------------
	
	The following program prints the version and mode of the operating
	system:
	
	#include <stdlib.h>
	#include <dos.h>
	#include <stdio.h>
	
	void main ( void )
	{
	
	   printf ( "_osmajor = %d\n", (int)_osmajor ) ;
	   printf ( "_osminor = %d\n", (int)_osminor ) ;
	   printf ( "_osversion=%u\n", _osversion ) ;
	
	   if (_osmode == DOS_MODE)
	   {
	      if ( (int)_osmajor < 10 ) /* We're under DOS */
	         printf ("\nDOS version %d.%d\n",
	                 (int) _osmajor, (int) _osminor );
	
	      else  /* We're running OS/2 DOS compatibility box */
	         printf ("\nOS/2 version %d.%d running"
	                 " DOS compatibility \n", ( (int) _osmajor ) / 10,
	                 (int) _osminor  ) ;
	   }
	   else
	      printf ("\nOS/2 version %d.%d\n",
	                ((int)_osmajor)/10, (int)_osminor );
	}
