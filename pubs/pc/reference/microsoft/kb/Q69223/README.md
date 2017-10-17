---
layout: page
title: "Q69223: Retrieving a Disk's Volume Serial Number from C"
permalink: /pubs/pc/reference/microsoft/kb/Q69223/
---

## Q69223: Retrieving a Disk's Volume Serial Number from C

	Article: Q69223
	Version(s): 5.10 6.00 6.00a
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc
	Last Modified: 25-FEB-1991
	
	Beginning with MS-DOS 4.00, a semi-random 32-bit binary identification
	number (ID) is assigned to each disk that DOS formats. The volume
	serial number (or ID) is stored at offset 27H to 2AH in the boot
	sector of each disk. The following program illustrates how to retrieve
	this information:
	
	/***************************************************************/
	/*                                                             */
	/* This program reads the volume serial number (or ID) from    */
	/* the boot sector of a specified disk. The DOS interrupt 25   */
	/* Absolute Disk Read is used to read in the boot sector.      */
	/*                                                             */
	/* Note: The volume ID is only implemented from MS-DOS 4.00    */
	/*       and later.                                            */
	/*                                                             */
	/* The output consists of the OEM name and version of the      */
	/* disk-formatting program (stored at offset 03H to 0AH in the */
	/* boot sector), the disk volume label, and the disk-volume    */
	/* serial number.                                              */
	/*                                                             */
	/***************************************************************/
	
	#include <stdio.h>
	#include <stdlib.h>
	#include <string.h>
	#include <dos.h>
	#include <conio.h>
	
	char bootsector[1024];
	char volume[12];
	char ver[9];
	char block[10];
	
	void main(void)
	{
	   int ax, _far *p, drive;
	   struct find_t fileinfo;
	   char filename[13], _far *foo, _far *q;
	   union REGS inregs, outregs;
	   struct SREGS segregs;
	
	   printf("Enter drive number (0=A,1=B,2=C, ...): ");
	   drive=getche() - '0';
	
	   /**************************************/
	   /* Parameter block for int 25H        */
	   /* Bytes    Description               */
	   /* -------  -----------               */
	   /* 00H-03H  32-bit sector number      */
	   /* 04H-05H  Number of sectors to read */
	   /* 06H-07H  Offset of buffer          */
	   /* 08H-09H  Segment of buffer         */
	   /**************************************/
	
	   block[0]=block[1]=block[2]=block[3]=0;
	   block[4]=1;
	   block[5]=0;
	
	   foo=bootsector;
	
	   p=(int *)&block[6];
	   *p=FP_OFF(foo);
	
	   p=(int *)&block[8];
	   *p=FP_SEG(foo);
	
	   q=block;
	   inregs.h.al=(char) drive;
	   inregs.x.cx=-1;
	   inregs.x.bx=FP_OFF(q);
	   segregs.ds=FP_SEG(q);
	   ax=int86x(0x25, &inregs, &outregs, &segregs);
	
	   /*** Error routine ***/
	
	   if(outregs.x.cflag)
	   {
	      printf("\n\nerror on int 25\n");
	      printf("this is AX:%04X",ax);
	      exit(-1);
	   }
	
	   /*** Output ***/
	
	   printf("\n\nDrive %c\n-------\n\n", drive +'A');
	
	   strncpy(ver, &bootsector[3], 8);
	   printf("OEM name and version: %s\n", ver);
	
	   /* Use _dos_findfirst for the volume label */
	
	   filename[0]=(char) (drive + 'A');
	   filename[1]='\0';
	   strcat(filename, ":\\*.*");
	   if(!_dos_findfirst(filename, _A_VOLID, &fileinfo))
	   printf("Volume name         : %s\n",fileinfo.name);
	
	   /* Before printing serial number, check if version >= 4.x */
	
	   if((ver[6]=='.')&&(ver[5]>='4')&&(ver[5]<='9'))
	      printf("Serial number       : %02X%02X-%02X%02X\n\n",
	                              (unsigned char) bootsector[0x2a],
	                              (unsigned char) bootsector[0x29],
	                              (unsigned char) bootsector[0x28],
	                              (unsigned char) bootsector[0x27]);
	}
