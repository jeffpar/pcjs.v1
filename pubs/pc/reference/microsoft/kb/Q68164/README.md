---
layout: page
title: "Q68164: CLOSE Doesn't Release Far Heap Used by First OPEN &quot;COM&quot; Buffer"
permalink: /pubs/pc/reference/microsoft/kb/Q68164/
---

## Q68164: CLOSE Doesn't Release Far Heap Used by First OPEN &quot;COM&quot; Buffer

	Article: Q68164
	Version(s): 4.00 4.00b 4.50
	Operating System: MS-DOS
	Flags: ENDUSER | SR# S901012-19 B_BasicCom
	Last Modified: 15-JAN-1991
	
	When you use the OPEN "COMn:" statement, the far heap memory allocated
	for the communications receive and transmit buffers is not deallocated
	when the file is closed. However, this communications memory area
	allocated in the far heap is reused if the COM port is reopened. [Far
	heap memory usage is indicated by the FRE(-1) function.]
	
	Note that the file's memory overhead portion consumed in DGROUP (the
	default data segment) is completely released by the CLOSE statement.
	[DGROUP memory is reported by the FRE("") function in QuickBASIC 4.x
	and in BASIC Compiler 6.00/6.00b, but reported by the STACK function
	in BASIC PDS 7.00/7.10.]
	
	This information applies to Microsoft QuickBASIC versions 4.00, 4.00b,
	and 4.50; to Microsoft BASIC Compiler versions 6.00 and 6.00b for
	MS-DOS; and to Microsoft BASIC Professional Development System (PDS)
	versions 7.00 and 7.10 for MS-DOS.
	
	By default, the communications transmit and receive buffers are set at
	512 bytes. The transmit and receive buffer sizes can be changed by
	parameters in the OPEN "COMn:" string. For example,
	
	   TB2048 = Increases the transmit buffer size to 2048 bytes.
	   RB2048 = Increases the receive buffer size to 2048 bytes.
	
	The following code example duplicates this far heap consumption
	behavior:
	
	PRINT "Far Heap before open:"; FRE(-1)
	OPEN "COM1:9600,N,8,1,RB4096" FOR RANDOM AS #1
	PRINT "Far Heap after open:"; FRE(-1)
	CLOSE #1
	PRINT "Far Heap after close:"; FRE(-1)
	
	The output from this program shows that after the OPEN statement, the
	far heap is correctly reduced by 4096 plus some additional memory
	needed to maintain a file. But after the CLOSE, only a few bytes
	(equal to the file overhead release in DGROUP memory) get reallocated
	to the far heap.
