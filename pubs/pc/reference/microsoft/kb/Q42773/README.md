---
layout: page
title: "Q42773: Opening a C File When Disk Is Write Protected"
permalink: /pubs/pc/reference/microsoft/kb/Q42773/
---

## Q42773: Opening a C File When Disk Is Write Protected

	Article: Q42773
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 17-MAY-1989
	
	With the run-time library in the Microsoft C Optimizing Compiler, a
	program can open an existing file for both read and write when the
	floppy disk is write protected. The following statement may be used to
	open the file:
	
	   handle = open ("a:test.dat", O_RDWR | O_TRUNC) ;
	
	No error condition is returned and no hard error occurs. However,
	later, when the program tries to write to the file handle or even to
	close the file without writing, a hard error will occur with the
	following message:
	
	   Writing protect error writing drive A:
	   Abort, Retry, Fail?
	
	This is not a problem with the open() function in the Microsoft C
	run-time library. The low-level DOS function call that is used to
	implement open() does not check for a write-protect error. When the
	file is to be closed by close(), the internal buffer has to be flushed
	to the disk. No low-level DOS function can close a file without
	flushing its associated buffer.
	
	Workaround
	
	There is no direct way to detect the write-protect condition. An
	indirect workaround is to open a file with the mode to be O_CREAT, as
	follows:
	
	    open ( "a:chk00000.xxx", O_CREAT, S_IWRITE | S_IREAD) ;
	
	A hard error will occur, which can be captured by a user-implemented
	and installed hard-error handler. This handler will override the
	printing of the hard-error message on the user screen. The open()
	function does return -1 when it regains the control from the
	hard-error handle. If the file was opened successfully, it may be
	removed at the end of the program.
	
	The following sample program demonstrates checking of a
	write-protected disk:
	
	/* sample program */
	#include <fcntl.h>
	#include <sys\types.h>
	#include <sys\stat.h>
	#include <io.h>
	#include <stdio.h>
	#include <dos.h>
	void far handler ( unsigned, unsigned, unsigned far * ) ;
	
	#define PROTECTED 1
	#define OTHER     2
	
	int Flag = 0 ;
	
	char * ChkName = "a:qwlbqwsi.ufp" ;     /* dummy file name */
	
	/* Note:
	** If the file happens to exist, the hard error will not occur.
	** The program will output "Disk is not write-protected."
	*/
	
	void main(void)
	{
	int FileHandle;
	
	_harderr ( handler ) ;              /* set up hard error handler */
	
	FileHandle = open ( ChkName, O_CREAT, S_IWRITE | S_IREAD ) ;
	
	if ( FileHandle == -1 )             /* check write-protect */
	     {
	     switch ( Flag ) {              /* may be set by the handler */
	        case PROTECTED :
	            puts ( "Disk in drive A: is write-protected." ) ;
	            break ;
	        case OTHER :
	            puts ( "A another hard error has occurred." ) ;
	            break ;
	        default :
	            puts ( "Error opening file (non hard error.)" ) ;
	        }
	     }
	else {
	     puts ( "Disk is not write-protected." ) ;
	     close ( FileHandle ) ;
	     remove ( ChkName ) ;           /* delete the file */
	     }
	}
	
	/*
	        Hard error routine should be as short as possible
	*/
	void far handler ( unsigned deverror, unsigned errcode,
	                   unsigned far *devhdr )
	{
	if ( errcode == 0 )
	    Flag = PROTECTED ;
	else
	    Flag = OTHER ;              /* like drive door is open */
	
	_hardretn ( 0 ) ;
	}
	/* end of sample */
	
	Note: The argument 0 to _hardretn() is not significant in this
	program. Please refer to Page 351 of the "Microsoft C for the MS-DOS
	Operating System: Run-Time Library Reference" for Version 5.10 for
	more specific information regarding the _hardretn() function.
