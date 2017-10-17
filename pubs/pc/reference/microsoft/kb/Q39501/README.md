---
layout: page
title: "Q39501: Simple Example Using _bios_serialcom"
permalink: /pubs/pc/reference/microsoft/kb/Q39501/
---

## Q39501: Simple Example Using _bios_serialcom

	Article: Q39501
	Version(s): 5.00 5.10 | 5.10
	Operating System: MS-DOS    | OS/2
	Flags: ENDUSER |
	Last Modified: 29-DEC-1988
	
	Below is an example of using the C run-time library function
	_bios_serialcom to transmit and receive a single character over the
	serial-communications port COM1:.
	
	The _bios_serialcom routine simply calls the PC's ROM BIOS routines.
	On most PC's, these routines are not interrupt-driven nor buffered.
	As a result, characters may be lost when receiving very high-speed
	transmissions and/or if a significant amount of processing occurs
	between status checks and reads.  Although Microsoft does not provide
	interrupt-driven serial I/O routines with our C compilers, there are
	several third-parties which do.  A partial listing is available in
	the Language Support Directory which comes with the compiler.
	
	For additional information about ROM BIOS calls, please refer to "IBM
	ROM BIOS" by Ray Duncan, published by Microsoft Press. For examples of
	serial communication programs written in assembler, please refer to
	the MS-DOS Encyclopedia.
	
	The following program is a simple example which sends and receives one
	character to/from COM1:
	
	#include <stdio.h>
	#include <bios.h>
	
	void main(void)
	{
	    unsigned com1_status;
	    unsigned com1_send;
	    unsigned com1_rec;
	    unsigned com1_init;
	    int result, mask;
	
	    /* open serial port at 1200 baud, 8 data bits,
	    ** No parity, 1 stop bit */
	    com1_init = _bios_serialcom(_COM_INIT, 0,
	        _COM_CHR8 | _COM_NOPARITY | _COM_STOP1 | _COM_1200);
	    printf("Init status: 0x%4.4X\n", com1_init);
	
	    /* send an '*' to com1 */
	    com1_send = _bios_serialcom(_COM_SEND, 0, '*');
	    printf("Send status: 0x%4.4X\n", com1_send);
	
	    mask = 0x6100;
	    /* value used to mask:
	    *    bits 0-7 are related to modems,
	    *    bits 8-15 are for port status,
	    *      check to see that the following bits are set:
	    *         8 (data ready)
	    *        13 (Transmission-hold  register empty)
	    *        14 (Transmission-shift register empty)
	    */
	
	    /* check the status */
	    com1_status = _bios_serialcom(_COM_STATUS, 0, 0);
	    printf("COM1 status: 0x%4.4X\n", com1_status);
	
	    /* wait until a character is ready */
	    do {
	        /* check the status */
	        com1_status = _bios_serialcom(_COM_STATUS, 0, 0);
	
	        /* mask off the low order byte of com1_status */
	        com1_status = com1_status & 0xFF00;
	    } while( (mask & com1_status) == 0);
	
	    /* get a character */
	    com1_rec =  _bios_serialcom(_COM_RECEIVE, 0, 0);
	    printf("Read status: 0x%4.4X\n", com1_rec);
	
	    /* print the character we just received */
	    result = com1_rec & 0x00FF;
	    printf("Character: 0x%2.2X  =  %c\n", result, (char)result);
	}
