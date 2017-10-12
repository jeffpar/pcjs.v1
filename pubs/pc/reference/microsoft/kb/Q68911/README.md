---
layout: page
title: "Q68911: Sample Program SAMPLER.C Does Not Work Correctly"
permalink: /pubs/pc/reference/microsoft/kb/Q68911/
---

	Article: Q68911
	Product: Microsoft C
	Version(s): 2.50 2.51
	Operating System: MS-DOS
	Flags: ENDUSER | docerr s_c
	Last Modified: 1-FEB-1991
	
	The sample program SAMPLER.C, included in the Microsoft QuickC "C for
	Yourself" manual that shipped with QuickC version 2.50, is incorrect
	and will always exit with the following message:
	
	   Error:  can't set font
	
	The correction listed below is also documented in the README.DOC
	shipped with QuickC version 2.50.
	
	The problem is on line 58 of SAMPLER.C, where the return value for the
	_setfont() function is checked. The sample program uses the logical
	not operator "!" to determine if an error code was returned. The
	problem with this method is that _setfont() returns a negative number
	to signify an error, or the font index number, if successful. Previous
	implementations of _setfont() returned 0 (zero) if successful, or -1
	if unsuccessful. The online help for C version 6.00 still documents
	the old return values, as noted in the README.DOC shipped with C
	version 6.00:
	
	   The return values for _setfont as described in on-line help are
	   incorrect. The _setfont function returns the font index number if
	   successful, or a negative number if unsuccessful.
	
	The same error exists in the Microsoft Press book "Microsoft C
	Run-Time Library Reference" for C version 6.00. However, the return
	values for _setfont() are documented correctly in the online help for
	QuickC version 2.50.
	
	To correct the problem, change line 58 from
	
	   if(!_setfont( list ))
	
	to the following:
	
	   if( _setfont( list ) >= 0 )
	
	As stated above, this correction is noted in the README.DOC that
	shipped with QuickC version 2.50.
	
	Also note that the return value of _setfont() (as documented above) is
	valid only for C versions 6.00 and 6.00a and QuickC versions 2.50 and
	2.51. The _setfont() function in the libraries shipped with QuickC
	versions 2.00 and 2.01 (as well as C version 5.10) use the previous
	implementations' return codes; therefore, the program will run
	correctly when compiled using those versions.
	
	The program SAMPLER.C can be found on page 302 of the "C for Yourself"
	manual. It can also be found in the QuickC online help by selecting
	the Help menu, choosing Contents, choosing "C for Yourself Sample
	Programs", and finally, choosing SAMPLER.C.
	
	The correct version of SAMPLER.C can be found on page 242 of the
	"Microsoft C Advanced Programming Techniques" manual that shipped with
	C versions 6.00 and 6.00a.
