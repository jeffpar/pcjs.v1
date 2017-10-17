---
layout: page
title: "Q66341: Problem with Switch List Usage Due to Problem in PMSHL.H"
permalink: /pubs/pc/reference/microsoft/kb/Q66341/
---

## Q66341: Problem with Switch List Usage Due to Problem in PMSHL.H

	Article: Q66341
	Version(s): 6.00
	Operating System: OS/2
	Flags: ENDUSER | buglist6.00 fixlist6.00a
	Last Modified: 24-OCT-1990
	
	You may encounter a problem when trying to build an application that
	makes use of various "PM Switch List" information. The symptoms may
	include "typedef not defined" errors at compile time or "unresolved
	external reference" errors at link time.
	
	This problem is most likely caused by a problem with the PMSHL.H file
	that shipped with the OS/2 Presentation Manager Toolkit version 1.20
	or Microsoft C version 6.00. Because of a problem in the #ifdef logic,
	certain sections of the include file may be undefined when they are
	actually needed.
	
	To correct these errors, the following modifications to PMSHL.H are
	required:
	
	On line 286, change
	
	   #endif  /* not INCL_NOCOMMON */
	
	to the following:
	
	   #ifdef  INCL_WINSWITCHLIST
	
	On line 319, change
	
	   #endif
	
	to the following:
	
	   #endif  /* INCL_WINSWITCHLIST */
	
	   #endif  /* INCL_WINSWITCHLIST or NOT INCL_NOCOMMON */
	
	Because another #ifdef is added, it must be resolved by adding a
	closing #endif.
	
	Microsoft has confirmed this to be a problem with C version 6.00. This
	problem has been corrected in the PMSHL.H include file included with
	the C 6.00a maintenance release.
