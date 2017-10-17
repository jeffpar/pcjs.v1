---
layout: page
title: "Q48744: int86x() and int86() Trap for Interrupts 25h, 26h"
permalink: /pubs/pc/reference/microsoft/kb/Q48744/
---

## Q48744: int86x() and int86() Trap for Interrupts 25h, 26h

	Article: Q48744
	Version(s): 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | S_QuickC S_QuickASM
	Last Modified: 16-JAN-1990
	
	Interrupts 25h (absolute disk read) and 26h (absolute disk write)
	require special handling when being used because they leave the CPU
	flags on the stack upon termination.
	
	Functions int86x() and int86() work reliably with these interrupts.
	The int86() functions trap for these two interrupts, and take care of
	the stack appropriately. Use one of the int86() functions to make
	these calls as you would any other DOS interrupt call. You need take no
	extra precautions with these interrupts.
	
	The following example demonstrates the straight-forwardness of the
	function call:
	
	#include <stdio.h>
	#include <dos.h>
	#include <malloc.h>
	
	/*****            WARNING!!!!!          ******/
	/* If you change the following line so that DRIVE_A is assigned a 2 or
	   above, you could destroy data on your hard drive. This test program
	   segment was written to read and write from the floppy disk A:        */
	#define DRIVE_A 0                    /* 0=A, 1=B, 2=C, etc. */
	#define ONE_SECTOR 1
	#define ABS_WRITE 38                 /* Decimal value of int call */
	#define ABS_READ 37                  /* Decimal value of int call */
	unsigned int far *out;               /* Pointer to Data to be output */
	unsigned int far *input;             /* Pointer to Data Transfer Area */
	unsigned int output;                 /* Data to be output */
	union REGS inregs, outregs;
	struct SREGS segregs;
	
	void main(void)  {
	   out = &output;
	   input = (unsigned int far *) malloc (1024 * sizeof(unsigned int));
	   *out = 11;
	   inregs.h.al = DRIVE_A;              /* Write to Drive A */
	   inregs.x.cx = ONE_SECTOR;           /* Write one sector only */
	   inregs.x.dx = 3;                    /* Logical sector 3 */
	   segregs.ds = FP_SEG(out);           /* Get Seg address of output */
	   inregs.x.bx = FP_OFF(out);          /* Get Offset of output */
	   outregs.x.ax = 0;                   /* No error */
	   int86x (ABS_WRITE, &inregs, &outregs, &segregs);
	
	   inregs.h.al = DRIVE_A;              /* Read to Drive A */
	   inregs.x.cx = ONE_SECTOR;           /* Read one sector only */
	   inregs.x.dx = 3;                    /* Logical sector 3 */
	   segregs.ds = FP_SEG(input);         /* Get Seg address of buffer */
	   inregs.x.bx = FP_OFF(input);        /* Get Offset of buffer */
	   outregs.x.ax = 0;                   /* No error */
	   int86x (ABS_READ, &inregs, &outregs, &segregs);
	   printf ("%u was read from drive A: \n", *input);
	}
