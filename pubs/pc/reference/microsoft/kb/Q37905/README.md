---
layout: page
title: "Q37905: BASIC Sample Program for OS/2 Function Calls for DLL Modules"
permalink: /pubs/pc/reference/microsoft/kb/Q37905/
---

## Q37905: BASIC Sample Program for OS/2 Function Calls for DLL Modules

	Article: Q37905
	Version(s): 6.00 6.00b 7.00 | 6.00 6.00b 7.00
	Operating System: MS-DOS          | OS/2
	Flags: ENDUSER |
	Last Modified: 2-FEB-1990
	
	Below is a sample program that makes a call to the following MS OS/2
	functions:
	
	   DosLoadModule
	   DosFreeModule
	   DosGetProcAddr
	   DosGetModHandle
	   DosGetModName
	
	The program below can be compiled in Microsoft BASIC Compiler Versions
	6.00 and 6.00b for MS-DOS and MS OS/2 and Microsoft BASIC Professional
	Development System (PDS) Version 7.00 for MS-DOS and MS OS/2.
	
	The program below should be compiled with BASIC compiler Version 6.00
	or 6.00b, or BASIC PDS 7.00 and should use the default run-time module
	(BRUN60EP.DLL for BASIC compiler 6.00, BRUN61EP.DLL for BASIC compiler
	6.00b, and BRT70ENP.DLL for BASIC PDS 7.00). The run-time module is
	required because the call to DosGetModHandle is searching for the
	handle of the run-time module. The program can be modified to search
	for any given DLL (dynamic link library).
	
	The following is a code example:
	
	'The function declarations can be found in BSEDOSPE.BI
	
	DECLARE FUNCTION DosLoadModule%(_
	      BYVAL P1s AS INTEGER,_
	      BYVAL P1o AS INTEGER,_
	      BYVAL P2  AS INTEGER,_
	      BYVAL P3s AS INTEGER,_
	      BYVAL P3o AS INTEGER,_
	      SEG   P4  AS INTEGER)
	
	DECLARE FUNCTION DosFreeModule%(_
	      BYVAL P1  AS INTEGER)
	
	DECLARE FUNCTION DosGetProcAddr%(_
	      BYVAL P1  AS INTEGER,_
	      BYVAL P2s AS INTEGER,_
	      BYVAL P2o AS INTEGER,_
	      SEG   P3  AS LONG)
	
	DECLARE FUNCTION DosGetModHandle%(_
	      BYVAL P1s AS INTEGER,_
	      BYVAL P1o AS INTEGER,_
	      SEG   P2  AS INTEGER)
	
	DECLARE FUNCTION DosGetModName%(_
	      BYVAL P1  AS INTEGER,_
	      BYVAL P2  AS INTEGER,_
	      BYVAL P3s AS INTEGER,_
	      BYVAL P3o AS INTEGER)
	
	DEFINT a-z
	
	dllname$="BRUN60EP"+chr$(0)  'Change this "BRUN61EP" for 6.00B
	
	x=DosGetModHandle%(varseg(dllname$),sadd(dllname$),handle)
	
	IF (x) THEN
	   Print "An error occurred in DosGetModHandle.  The number is : ";x
	ELSE
	   Print "The handle for ";dllname$;" is : ";handle
	
	   'Using the handle returned, find the name
	   DIM buffer AS STRING*40
	   length=40
	   x=DosGetModName%(handle,length,varseg(buffer),varptr(buffer))
	   IF (x) THEN
	      Print "An error occurred in DosGetModName.  The number is : ";x
	   ELSE
	      Print "The module name for handle ";handle;" is ";buffer
	   END IF
	
	   'Load another DLL
	   DIM bad AS STRING*128
	   dllname$="DOSCALLS1"+chr$(0)
	   x=DosLoadModule%(varseg(bad),varptr(bad),128,varseg(dllname$),_
	             sadd(dllname$),handle)
	   IF (x) THEN
	      Print "An error occurred in DosLoadModule.  The number is : ";x
	   ELSE
	      Print "The handle for ";dllname$;" is : ";handle
	
	      '#150 is an routine that can be found in DOSCALLS1
	      routine$="#150"+chr$(0)
	      DIM address AS LONG
	      x=DosGetProcAddr%(handle,varseg(routine$),sadd(routine$),address)
	      IF (x) THEN
	       Print "An error occurred in DosGetProcAddr.  The number is : ";x
	      ELSE
	       Print "The address of ";routine$;" is ";address
	      END IF
	
	      'Unload module
	      x=DosFreeModule%(handle)
	      IF (x) THEN
	       print "An error occurred in DosFreeModule.  The number is : ";x
	      ELSE
	       Print "DLL was freed."
	      END IF
	   END IF
	END IF
	END
