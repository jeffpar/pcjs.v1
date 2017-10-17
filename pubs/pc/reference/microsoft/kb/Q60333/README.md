---
layout: page
title: "Q60333: _bios_serialcom() May Not Work at 9600 and 4800"
permalink: /pubs/pc/reference/microsoft/kb/Q60333/
---

## Q60333: _bios_serialcom() May Not Work at 9600 and 4800

	Article: Q60333
	Version(s): 5.10 6.00
	Operating System: MS-DOS
	Flags: ENDUSER | S_QUICKC
	Last Modified: 19-APR-1990
	
	The function _bios_serialcom() may not work correctly at 4800 or 9600
	baud. This problem is due to the function calling BIOS interrupt 14h.
	
	Sample Code
	-----------
	
	/* Transmitting Machine */
	#include <stdio.h>
	#include <conio.h>
	#include <bios.h>
	
	void main(void)
	{
	   unsigned config;
	
	   config = (_COM_CHR8|_COM_STOP1|_COM_NOPARITY|_COM_9600);
	   _bios_serialcom(_COM_INIT,0,config);
	
	   while(1)
	      _bios_serialcom(_COM_SEND,0,(unsigned)getch());
	}
	
	/* Receiving Machine */
	#include <stdio.h>
	#include <conio.h>
	#include <bios.h>
	
	void main(void)
	{
	   unsigned config;
	   unsigned data;
	   config = (_COM_CHR8|_COM_STOP1|_COM_NOPARITY|_COM_9600);
	   _bios_serialcom(_COM_INIT,0,config);
	
	   while(1)
	      {
	      data = 0x0000;
	      _bios_serialcom(_COM_RECEIVE,0,data);
	      if (data != 0x0000)
	         putch((int)data);
	      }
	}
	
	If the sample programs are run on two separate machines connected by a
	null modem (serial cable), 9600 baud communication is not possible. At
	4800 baud, the data is seriously corrupted on the receiving end. The
	results are the same when the roles of the machines in question are
	reversed. However, the function performs well at 300 to 2400 baud.
	
	Since _bios_serialcom() uses interrupt 14h to do the work, this is a
	limitation of the BIOS and not the function. If you want to establish
	reliable serial communications at a higher baud rate, an interrupt
	service routine (ISR) should be written to handle the I/O. More
	information on this can be found in Article 6, Pages 167-246 of the
	"MS-DOS Encyclopedia."
