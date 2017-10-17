---
layout: page
title: "Q61872: DosDevIOCtl() Category 5 Subfunction 66H Fails with C 6.00 API"
permalink: /pubs/pc/reference/microsoft/kb/Q61872/
---

## Q61872: DosDevIOCtl() Category 5 Subfunction 66H Fails with C 6.00 API

	Article: Q61872
	Version(s): 6.00 6.00a | 6.00 6.00a
	Operating System: MS-DOS     | OS/2
	Flags: ENDUSER | buglist6.00 buglist6.00a
	Last Modified: 19-JAN-1991
	
	The DOS version of DosDevIOCtl() Category 5 Subfunction 66H, found in
	the API.LIB shipped with Microsoft C version 6.00, fails in native
	DOS. The failure consists of returning an invalid printer status byte,
	regardless of the printer's current status.
	
	The DosDevIOCtl() function is used to determine printer status.
	Although the function seems to work correctly when used from either
	OS/2 or the DOS compatibility box of OS/2, it fails when run from
	native DOS. When called, this function sets the value pointed to by
	its first parameter to a status byte whose bits have the following
	significance.
	
	   Bit(s)  Significance (if set)
	   ------  ---------------------
	
	   0       Timed Out
	   1-2     Reserved
	   3       I/O error
	   4       Printer selected
	   5       Out of paper
	   6       Acknowledge
	   7       Printer not busy
	
	The failure of this function results in a status byte value of 2 being
	returned from the function regardless of the printer's status. This is
	particularly bad because 2 is not even a valid return value for this
	function. If the Microsoft C version 5.10 API.LIB is used, the
	function works correctly, returning a status of 144 if the printer is
	ready and 24 if the printer is off line. The only known workaround is
	to use the earlier version of the library for this function call.
	
	To reproduce the problem, create a bound version of the following
	program using the C 6.00 API.LIB and run it on a computer physically
	connected to a printer under native DOS:
	
	Sample Code
	-----------
	
	#define INCL_DOSDEVICES
	#define INCL_DOSFILEMGR
	#include<os2.h>
	#include<stdio.h>
	
	void main(void)
	{
	 int handle;
	 unsigned char pfstat,x=0;
	 unsigned short actiontaken;
	 unsigned short p;
	
	 p=DosOpen("lpt1",&handle,&actiontaken,0l,0,0x0001,0x0041,0l);
	 p=DosDevIOCtl(&pfstat,&x,0x0066,0x0005,handle);
	
	 printf("pfstat=%d \n",(int)pfstat);
	
	}
	
	Microsoft has confirmed this to be a problem with C versions 6.00 and
	6.00a. We are researching the problem and will post new information
	here as it becomes available.
