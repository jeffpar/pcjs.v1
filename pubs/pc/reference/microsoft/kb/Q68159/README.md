---
layout: page
title: "Q68159: How to Truncate a File Using DOS Interrupts from BASIC"
permalink: /pubs/pc/reference/microsoft/kb/Q68159/
---

## Q68159: How to Truncate a File Using DOS Interrupts from BASIC

	Article: Q68159
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901228-74  B_BASICCOM
	Last Modified: 15-JAN-1991
	
	The following BASIC code shows how to truncate a file using DOS
	functions. A more clumsy approach in BASIC would be to read a
	specified amount of records one at a time, writing these records to
	another file, deleting the first file, and then renaming the new file
	to the old file. The approach using DOS functions (below) is quicker
	and more efficient.
	
	This information applies to QuickBASIC versions 4.00, 4.00b, and 4.50
	for MS-DOS; to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS; and to Microsoft BASIC Professional System (PDS) versions 7.00
	and 7.10 for MS-DOS.
	
	You can invoke MS-DOS service functions using the CALL INTERRUPT
	statement in BASIC.
	
	You can set the size of any file to any arbitrary value by executing
	MS-DOS interrupt 21 hex with service 40 hex using CX = 00 hex. The
	usual technique is to call service 42 hex to set the file pointer
	location and then immediately call service 40 hex with CX = 00 hex to
	update the new file size.
	
	The program below is written so that the Truncate% FUNCTION is generic
	as possible and works with any file. ProcessFile() sets up the
	file-specific information, which in turn calls the Truncate% FUNCTION.
	Truncate% generates the specific interrupt calls to truncate the file
	at the specified record. The two SUB programs PrintFile() and
	CreateFile() are only needed as an example.
	
	Program Example
	---------------
	
	' You must run QB or QBX with the /L option to load the QB.QLB or
	' QBX.QLB Quick library which contains the INTERRUPT routine used in
	' this program. You must LINK with QB.LIB or QBX.LIB when making an
	' .EXE program which uses the CALL INTERRUPT statement.
	CONST NumRec = 10
	TYPE TheType
	     i AS INTEGER
	END TYPE
	DIM SHARED TheDim AS TheType
	' In the following line, use 'QBX.BI' for BASIC PDS, or use 'QB.BI'
	' for QuickBASIC 4.x:
	'$INCLUDE: 'QBX.BI'
	CALL CreateFile
	CALL PrintFile
	CALL ProcessFile(7)
	CALL PrintFile
	
	'################### File specific SUB #############################
	SUB ProcessFile (LastRec%)
	'Get the information about "TEST.DAT" and also the information
	'about the location of the LASTREC% where the file will be truncated.
	     OPEN "test.dat" FOR RANDOM AS #1 LEN = LEN(TheDim)
	     FilePointer% = LastRec% * LEN(TheDim)
	     IF FilePointer% <> Truncate%(FILEATTR(1, 2), FilePointer%) THEN
	          PRINT "error..."
	     END IF
	     CLOSE
	END SUB
	
	'################## Generic INT file truncator ####################
	FUNCTION Truncate% (handle%, FilePointer%)
	' Generic function that will truncate any file at specified offset.
	'
	' Receives:
	'       1) a DOS file handle;
	'       2) a file pointer offset in bytes, pointing where to truncate
	' Returns:
	'       1) If successful, position of file pointer; or
	'       2) If error, flags register
	'
	 DIM Regs AS RegType
	     Regs.ax = &H4200                     'int 21 hex, service 42 hex
	     Regs.bx = handle%                    'DOS Handle
	     Regs.dx = FilePointer%               'offset in bytes from start
	     CALL Interrupt(&H21, Regs, Regs)
	     IF Regs.ax <> FilePointer% THEN      'AX returns pointer position
	          Truncate% = Regs.flags            If error, return flag
	     END IF
	     Regs.ax = &H4000                     'INT 21 hex, service 40 hex
	     Regs.bx = handle%                    'DOS handle
	     Regs.cx = &H0
	     CALL Interrupt(&H21, Regs, Regs)
	     IF Regs.ax <> 0 THEN                 'Must be zero bytes written
	          Truncate% = Regs.flags            'If error, return flag
	     END IF
	     Truncate% = FilePointer%             'return offset location
	END FUNCTION
	
	'############ Create Sample File using RANDOM Access ################
	SUB CreateFile
	     KILL "test.dat"
	     OPEN "test.dat" FOR RANDOM AS #1 LEN = LEN(TheDim)
	     FOR j = 1 TO NumRec
	          TheDim.i = j
	          PUT #1, j, TheDim
	     NEXT j
	     CLOSE #1
	END SUB
	
	'########### Print contents of TEST.DAT ##################
	SUB PrintFile
	     OPEN "test.dat" FOR RANDOM AS #1 LEN = LEN(TheDim)
	     Max = LOF(1) / LEN(TheDim)
	     FOR j = 1 TO Max
	          GET #1, j, TheDim
	          PRINT TheDim.i
	     NEXT j
	     CLOSE
	END SUB
	
	References:
	
	The INTERRUPT routine is located in the files QB.LIB and QB.QLB for
	QuickBASIC 4.x and in QBX.LIB and QBX.QLB in BASIC PDS 7.00/7.10.
	Programs that execute a CALL INTERRUPT statement when compiled in the
	QB.EXE/QBX.EXE editor require the presence of the QB.QLB/QBX.QLB Quick
	library. This means that QB.EXE or QBX.EXE must be invoked with the /L
	option, which automatically loads the correct Quick library. Compiled
	programs that execute CALL INTERRUPT must be linked with the LINK
	library QB.LIB or QBX.LIB. More information on the use of CALL
	INTERRUPT can be found under the CALL statement in the language
	reference manual or online help. For more information on how to use
	CALL INTERRUPT, query on the following words:
	
	   CALL and INTERRUPT and application and note and QuickBASIC
