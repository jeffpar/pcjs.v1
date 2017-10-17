---
layout: page
title: "Q47484: Determining the Number of Valid Drives in DOS"
permalink: /pubs/pc/reference/microsoft/kb/Q47484/
---

## Q47484: Determining the Number of Valid Drives in DOS

	Article: Q47484
	Version(s): 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC S_QuickASM H_MASM O_MSDOS
	Last Modified: 9-AUG-1989
	
	Question:
	
	I have an application that needs to determine the number of logical
	drives installed on a given computer. I have tried using the DOS
	function "SelectDisk" (0x0E), but it seems to return the number 5 on
	all machines, no matter how many drives are installed. Is there a way
	to get this information from DOS?
	
	Response:
	
	There are no DOS calls for determining the number of logical drives
	installed on a computer. The DOS call SelectDisk returns only the
	value stored in the DOS variable LASTDRIVE. This variable normally
	contains 5 (maximum drive letter is "E") unless LASTDRIVE is
	specifically set in the CONFIG.SYS file.
	
	The LASTDRIVE value is useful, however, when determining which drives
	are valid and which are not. Since LASTDRIVE reflects the highest
	available drive letter, we can use DOS calls to determine which of the
	available drives are valid. The DOS calls SelectDisk (0x0E) and
	GetDisk (0x19) can be used to provide this information.
	
	Note: Any network drives to which you're attached are also considered
	valid. If you need to distinguish between network and non-network
	drives, modify the program below to use INT 21h function 44h (IOCTL),
	subfunction 09h ("Check if block device is remote"). For more
	information, see a good DOS reference such as "Advanced MS-DOS
	Programming" (by Duncan, published by Microsoft Press), or the "MS-DOS
	Encyclopedia" (also published by Microsoft Press).
	
	If you try, one at a time, to change the current drive to each of the
	available drive letters, you will see which ones are valid. Since
	SelectDisk does not return an error code in the event that it fails to
	select a new disk, call GetDisk afterwards to determine if it was
	successful.
	
	The following C source code illustrates this method:
	
	/*
	
	Will not run under OS/2.  For DOS only.
	
	The following program displays all of the logical drives installed on
	a DOS system. This program uses DOS function calls to obtain the
	current drive and change it to a new drive.
	
	*/
	
	#include <stdio.h>
	#include <dos.h>
	
	/* simple types */
	
	#define BYTE unsigned char
	#define BOOLEAN int
	
	/* function prototypes */
	
	BYTE DosGetDisk(void);
	int DosSelectDisk(BYTE);
	BOOLEAN ValidDrive(BYTE);
	
	void main(void)
	{
	BYTE CurDrive;
	int  NumDrives;
	int  x;
	
	CurDrive  = DosGetDisk();                // currently active drive
	NumDrives = DosSelectDisk(CurDrive);     // returns number set in
	                                         // LASTDRIVE
	
	for (x = 0; x < NumDrives; x++)   // go through all possible drives
	  if (ValidDrive((BYTE)x))        // print message if drive x valid
	    printf("Drive %c is valid\n",(char)x+'A');
	
	DosSelectDisk(CurDrive);          // set default drive back
	
	}  /* end of main */
	
	BOOLEAN ValidDrive(BYTE drive)  // returns true if drive valid,
	{                               // false otherwise
	  DosSelectDisk(drive);         // attempt to make drive current
	
	  return (DosGetDisk() == drive);  // did it succeed?
	}
	
	BYTE DosGetDisk(void)   // returns drive number of current drive
	{
	  union REGS reg;
	
	  reg.h.ah = 0x19;           // call DOS to find
	  int86(0x21,&reg,&reg);
	
	  return (reg.h.al);
	}
	
	int DosSelectDisk(BYTE drive)      // sets current drive
	{
	  union REGS reg;
	
	  reg.h.ah = 0x0e;                 // set by calling DOS
	  reg.h.dl = drive;
	  int86(0x21,&reg,&reg);
	
	  return ((int) reg.h.al);
	}
