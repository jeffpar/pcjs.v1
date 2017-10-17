---
layout: page
title: "Q32219: DosGetPid and DosGetInfoSeg Get Process Identification (PID)"
permalink: /pubs/pc/reference/microsoft/kb/Q32219/
---

## Q32219: DosGetPid and DosGetInfoSeg Get Process Identification (PID)

	Article: Q32219
	Version(s): 6.00 6.00b 7.00
	Operating System: OS/2
	Flags: ENDUSER |
	Last Modified: 1-FEB-1990
	
	Two MS OS/2 API calls return the process identification (PID) of the
	current process. The two calls are DosGetPid and DosGetInfoSeg, which
	are illustrated in a code example below.
	
	This information applies to Microsoft BASIC Compiler Versions 6.00 and
	6.00b for MS OS/2, and to Microsoft BASIC Professional Development
	System (PDS) Version 7.00 for MS OS/2.
	
	DosGetPid is the simplest and most direct way of retrieving the
	current PID. This function is passed the address of a structure
	containing three integers or words. The function declarations are as
	follows:
	
	      TYPE PidInfo
	           Pid as integer        'Process Pid
	           Tid as integer        'Thread Pid
	           pidParent as integer 'Parent Pid
	      END TYPE
	
	      DECLARE FUNCTION DosGetPid%(_
	                   SEG P1 AS PidInfo)
	
	The PID information is returned in the structure.
	
	The information returned by DosGetInfoSeg also helps find the PID, but
	the procedure is more difficult. This function returns the address of
	both the GDT and LDT. The LDT contains the process information. To
	locate the PID, you must set the segment to the LDT (DEF SEG=address
	of LDT), then look at the bytes that contain the desired information.
	The program below demonstrates this method. (This program also
	contains an example of DosGetPid.)
	
	       'Declarations used below can be found in BSDOSPC.BI
	       TYPE PidInfo
	            Pid as integer
	            Tid as integer
	            pidParent as integer
	       END TYPE
	       DECLARE FUNCTION DosGetInfoSeg%(_
	                    SEG P1 AS INTEGER,_
	                    SEG P2 AS INTEGER)
	       DECLARE FUNCTION DosGetPid%(_
	                    SEG P1 AS PidInfo)
	
	       DEFINT A-Z
	       CLS
	       DIM info AS PidInfo
	
	       x=DosGetInfoSeg%(global,localo)
	
	       IF (x) THEN
	         Print "Error, the number is : ";x
	       ELSE
	         Print "The Global Segment : ";Global
	         Print "The Local Segment : ";localo
	         def seg=localo            'Change Segment
	         pid1=peek(0)+(256*(peek(1))) 'First Word in segment
	         pid2=peek(2)+(256*(peek(3))) 'Second Word
	         pid3=peek(6)+(256*(peek(7))) 'Fourth Word
	         def seg
	         print "         Current Process ID : ";pid1
	         print "       Process ID of Parent : ";pid2
	         print "Thread ID of Current Thread : ";pid3
	       END IF
	
	       x=DosGetPid%(info)
	
	       IF (x) THEN
	         Print "Error, the number is : ";x
	       ELSE
	         print "         Current Process ID : ";info.pid
	         print "       Process ID of Parent : ";info.pidParent
	         print "Thread ID of Current Thread : ";info.tid
	       END IF
