---
layout: page
title: "Q38191: P_NOWAIT Is Not Implemented in DOS Version 4.00"
permalink: /pubs/pc/reference/microsoft/kb/Q38191/
---

	Article: Q38191
	Product: Microsoft C
	Version(s): 5.00   | 5.10
	Operating System: MS-DOS | OS/2
	Flags: ENDUSER |
	Last Modified: 18-NOV-1988
	
	The include file process.h states that P_NOWAIT is enabled in DOS
	Version 4.00. This is incorrect. P_NOWAIT is NOT enabled in the
	current version of DOS Version 4.00. P_NOWAIT is a modeflag as used in
	SPAWNxx functions. P_NOWAIT is used to continue executing the parent
	process concurrently with the child process. P_NOWAIT is implemented in
	OS/2.
	
	Original DOS Version 4.00 was a multitasking, real-mode only MS-DOS.
	The limitations of the real-mode environment made DOS Version 4.00 a
	specialized product. Although MS-DOS Version 4.00 supports full preemtive
	multitasking, system memory is limited to the 640 kilobytes available
	in real mode. This means that all processes have to fit into the
	single 640-kilobyte memory area. Because of these restrictions, MS-DOS
	Version 4.00 was not intended for general release, but as a platform
	for specific OEMs to support extended architectures. Therefore, MS-DOS
	Version 4.00 was released as a special OEM product only.
