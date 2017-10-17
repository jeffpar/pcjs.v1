---
layout: page
title: "Q59768: How to Find the Load Size Required for a Program"
permalink: /pubs/pc/reference/microsoft/kb/Q59768/
---

## Q59768: How to Find the Load Size Required for a Program

	Article: Q59768
	Version(s): 4.00 5.00 5.10
	Operating System: MS-DOS
	Flags: ENDUSER | s_quickc s_quickasm
	Last Modified: 9-APR-1990
	
	The final allocated segment within a program is stored in the second
	word of its Program Segment Prefix (PSP). To find the size of the
	program in paragraphs, subtract the actual segment of the PSP from
	this segment number. This is useful in a number of applications
	including finding the amount of memory neccessary to store a TSR
	(terminate and stay) program.
	
	In Microsoft C, the segment of the PSP is stored in the global
	variable _psp. This makes program load size easily accessible within C
	programs as demonstrated below. For more information on the PSP, see
	the "MS-DOS Encyclopedia," Pages 108-111.
	
	Sample Code
	-----------
	
	#include<dos.h>
	
	extern unsigned _psp;       /* segment of PSP                */
	unsigned size;              /* size of program in paragraphs */
	unsigned far *psp_pointer;  /* pointer to beginning of PSP   */
	
	         /* psp_pointer[1] will contain the final allocated  */
	         /* segment of the program stored in the second word */
	         /* of the Program Segment Prefix.                   */
	
	void main(void)
	{
	     FPSEG(psp_pointer)=_psp;
	     FPOFF(psp_pointer)=0;
	
	     size=_psp_pointer[1]-_psp;
	}
