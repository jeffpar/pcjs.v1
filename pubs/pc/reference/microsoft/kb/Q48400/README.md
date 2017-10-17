---
layout: page
title: "Q48400: Using BASIC to Perform Serial Communications in MS OS/2"
permalink: /pubs/pc/reference/microsoft/kb/Q48400/
---

## Q48400: Using BASIC to Perform Serial Communications in MS OS/2

	Article: Q48400
	Version(s): 6.00 6.00b 7.00 7.10
	Operating System: OS/2
	Flags: ENDUSER | SR# S890801-2
	Last Modified: 17-JAN-1991
	
	This article contains a sample BASIC module that calls API routines in
	MS OS/2 protected mode to perform serial communications through
	communications port COM1, COM2, COM3, or COM4.
	
	You must link NOCOM.OBJ (which requires BC /O) with this module before
	attempting to use this module's routines.
	
	This information applies to Microsoft BASIC Compiler versions 6.00 and
	6.00b for MS OS/2 (in protected mode only) and to Microsoft BASIC
	Professional Development System (PDS) versions 7.00 and 7.10 for MS
	OS/2 (in protected mode only).
	
	The following steps must be taken to use the COMPORT.BAS module
	(farther below):
	
	1. Create a program called COM.BAS that makes calls to the routines
	   found in COMPORT.BAS and compile the program.
	
	2. Compile COMPORT.BAS. Ensure that COMPORT.BI (shown below) and
	   BSEDOSFL.BI (included with BASIC compiler 6.00/6.00b and BASIC
	   PDS 7.00/7.10) are in a directory that is in the $INCLUDE
	   statement's explicit path.
	
	3. Link your program to COMPORT.OBJ in addition to NOCOM.OBJ.
	
	The following is a sample file that, when used as input for the MAKE
	utility, compiles and links a program called COM.BAS that uses the
	COMPORT module:
	
	#----------------------
	# MAKE file for COM.BAS
	#----------------------
	comport.obj : comport.bas comport.bi
	     BC /LP /Z /O /D COMPORT.BAS;
	com.obj : com.bas comport.bi
	     BC /LP /Z /O /D COM.BAS;
	com.exe : com.obj comport.obj
	     link /EX com comport nocom;
	
	COMPORT.BI
	----------
	
	' parameter buffer for DosDevIOCtrl Function 41H
	TYPE F41Info
	    BaudRate AS INTEGER
	END TYPE
	
	' parameter buffer for DosDevIOCtrl Function 42H
	TYPE F42Info
	    DataBits AS STRING * 1
	    Parity AS STRING * 1
	    StopBits AS STRING * 1
	END TYPE
	
	' data buffer for DosDevIOCtrl Function 68H
	TYPE F68Info
	    NumChars AS INTEGER   ' Number of characters waiting in
	                          '   device queue
	    QueueSize AS INTEGER  ' Size of queue
	END TYPE
	
	DECLARE FUNCTION InitComPort% (ComPort$, Baud%, Parity%,_
	                               DataBit%,StopBit%)
	DECLARE SUB WriteCom (Handle%, ToCom$, BytesWritten%)
	DECLARE SUB PrintCom (Handle%, ToCom$, BytesWritten%)
	DECLARE SUB ReadCom (Handle%, FromCom$, BytesToRead%,_
	                     BytesRead%)
	DECLARE SUB ComSize (Handle%, Size%)
	DECLARE SUB CloseCom (Handle%)
	
	COMPORT.BAS
	-----------
	
	' $INCLUDE: 'COMPORT.BI'
	' $INCLUDE: 'BSEDOSFL.BI'
	' Note:
	'       These routines call OS/2 system functions
	' that always return a value indicating whether or not an
	' error has occurred. In this module, ReturnErr% always
	' contains this value. A return value of 0 means no error
	' occurred. This module does no error checking. This would
	' have to be added using the values in ReturnErr%.
	'       For added flexibility in configuring the port, use
	' DosDevIOCtrl Function 53H.
	'       All of the routines in this module (except
	' InitComPort%) need a Handle% as one of the parameters.
	' This Handle% is obtained from InitComPort%
	
	'***********************************************************
	' InitComPort% returns a handle to the comport specified in
	' the parameter ComPort$ (must be in the form: "COMn" where
	' n is a number between 1 and 4.) Before the handle to the
	' port is returned, the port is configured to the correct
	' baud rate (110 to 19200), parity, data bit, and stop bit.
	'***********************************************************
	FUNCTION InitComPort% (ComPort$, Baud%, Parity%, DataBit%,_
	                       StopBit%)
	    DIM F42 AS F42Info
	    DIM F41 AS F41Info
	    DIM Temp AS STRING * 5 'Temp holds string of form "COMn"+null byte
	    Temp = ComPort$
	    F41.BaudRate = Baud%
	    F42.DataBits = CHR$(DataBit%)
	    F42.Parity = CHR$(Parity%)
	    F42.StopBits = CHR$(StopBit%)
	
	    ReturnErr% = DosOpen% (VARSEG(Temp), VARPTR(Temp),_
	                           Handle%,_
	                           Action%,_
	                           0,_
	                           0,_
	                           1,_
	                           &H12,_
	                           0)
	    IF (ReturnErr% = 0) THEN
	        ReturnErr% = DosDevIOCtl%(0, 0,_
	                                  VARSEG(F41), VARPTR(F41),_
	                                  &H41,_
	                                   1,_
	                                   Handle%)
	        ReturnErr% =  DosDevIOCtl%(0, 0,_
	                                   VARSEG(F42),VARPTR(F42),_
	                                   &H42,_
	                                   1,_
	                                   Handle%)
	    END IF
	    InitComPort% = Handle%
	END FUNCTION
	
	'***********************************************************
	' WriteCom writes a string (ToCom$) to the port associated
	' with Handle%. BytesWritten% will contain the actual
	' number of bytes written after the call to WriteCom.
	'***********************************************************
	SUB WriteCom (Handle%, ToCom$, BytesWritten%)
	    DIM Temp AS STRING * 512
	    Temp = ToCom$
	    Length = LEN(ToCom$)
	    ReturnErr% = DosWrite%(Handle%,_
	                           VARSEG(Temp), VARPTR(Temp),_
	                           Length,_
	                           BytesWritten%)
	END SUB
	
	'***********************************************************
	' PrintCom Prints a string (ToCom$) to the port associated
	' with Handle%. The string is written and an additional CR
	' and LF. BytesWritten% will contain the actual number of
	' bytes written after the call to PrintCom.
	'***********************************************************
	SUB PrintCom (Handle%, ToCom$, BytesWritten%)
	    ToCom$ = ToCom$ + CHR$(13) + CHR$(10)
	    DIM Temp AS STRING * 512
	    Temp = ToCom$
	    Length = LEN(ToCom$)
	    ReturnErr% = DosWrite%(Handle%,_
	                           VARSEG(Temp), VARPTR(Temp),_
	                           Length,_
	                           BytesWritten%)
	END SUB
	
	'***********************************************************
	' ReadCom reads BytesToRead% number of bytes from the port
	' associated with Handle%. The bytes read are placed in
	' FromCom$, and the number of bytes read will be placed in
	' BytesRead%.
	'***********************************************************
	SUB ReadCom (Handle%, FromCom$, BytesToRead%, BytesRead%)
	    DIM Temp AS STRING * 512
	    ReturnErr% = DosRead%(Handle%,_
	                          VARSEG(Temp), VARPTR(Temp),_
	                          BytesToRead%,_
	                          BytesRead%)
	    FromCom$ = MID$(Temp,1,BytesRead%)
	END SUB
	
	'***********************************************************
	' ComSize returns the number of bytes waiting to be read at
	' the port associated with Handle%. The number of bytes
	' waiting is placed in Size%.
	************************************************************
	SUB ComSize (Handle%, Size%)
	    DIM F68 AS F68Info
	    DIM FileInfo AS FILESTATUS
	    ReturnErr% = DosDevIOCtl%(VARSEG(F68), VARPTR(F68),_
	                              0, 0,_
	                              &H68,_
	                              1,_
	                              Handle%)
	    Size% = F68.NumChars
	END SUB
	
	'***********************************************************
	' CloseCom closes the port associated with Handle%. This
	' should be called before the end of the program.
	'***********************************************************
	SUB CloseCom (Handle%)
	    ReturnErr% = DosClose% (Handle%)
	END SUB
