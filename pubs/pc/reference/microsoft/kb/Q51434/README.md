---
layout: page
title: "Q51434: How to Calculate Available File Handles at Run Time"
permalink: /pubs/pc/reference/microsoft/kb/Q51434/
---

## Q51434: How to Calculate Available File Handles at Run Time

	Article: Q51434
	Version(s): 5.10   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER | S_QUICKC
	Last Modified: 14-MAR-1990
	
	The following piece of code allows you to find out how many file
	handles are available at run time for a particular process. The
	function makes use of the predefined pointers _iob and _lastiob, which
	are set to point to the first and the last input/output information
	blocks, respectively. The I/O blocks are examined to determine whether
	they are in use, and a total number of available file handles is
	produced. There is no equivalent C library function currently
	available.
	
	Note: This is not necessarily an indication of the maximum number of
	physical files that can be opened. The system-wide limit is set in DOS
	by the FILES=?? in the CONFIG.SYS file. In OS/2, it is arbitrarily
	governed by system resources and is modified for each process by
	DosSetMaxFH().
	
	Code Example
	------------
	
	#define FILE struct _iobuf
	#ifndef NO_EXT_KEYS           /* extensions enabled */
	    #define _CDECL  cdecl
	    #define _NEAR   near
	#else                         /* extensions not enabled */
	    #define _CDECL
	    #define _NEAR
	#endif                        /* NO_EXT_KEYS */
	
	#define _IOREAD 0x01          /* Open for read bit */
	#define _IOWRT  0x02          /* Open for write bit */
	#define _IORW   0x80          /* Open for read/write bit */
	
	FILE                          /* File handle table entry */
	{
	    char *_ptr;
	    int   _cnt;
	    char *_base;
	    char  _flag;
	    char  _file;
	 }_NEAR _CDECL _iob[], /*Set to first I/O block at runtime*/
	               _lastiob[];   /* Set to last I/O block */
	
	/*
	   All of the above definitions were taken from the STDIO.H header
	   file except for _lastiob[], which is not defined. This information
	   was extracted to make the example more clear.
	*/
	
	/*
	   The following macro will check the availability of a file handle
	   by examining the _flag member of the I/O block
	*/
	
	#define inuse(s) ((s)->_flag & (_IOREAD|_IOWRT|_IORW))
	
	/*
	   The following routine loops through the total number of I/O blocks
	   and checks the flags to see if it is used or not. The number of
	   unused handles is returned, which can be 1 to the maximum number of
	   file handles as set by the operating system or the FILES=xx command
	   in the CONFIG.SYS file.
	*/
	
	int Number_Of_Handles(void)
	{
	   FILE *stream = _iob;
	   int count;
	
	   count = 0;
	   do
	      if (inuse(stream)) count++;
	   while(stream++ < _lastiob);
	
	   return(((_lastiob - _iob)+1)-count);
	}
	
	void main(void)
	{
	   int i;
	
	   i = Number_Of_Handles();
	/* i is now set to the number of available file handles */
	}
	
	The table of I/O blocks that is being checked here was allocated at
	run time according to the maximum number of file handles allowed per
	process.
