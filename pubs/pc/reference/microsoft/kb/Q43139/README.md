---
layout: page
title: "Q43139: LINK: Renaming Overlayed Executables Will Cause Problems"
permalink: /pubs/pc/reference/microsoft/kb/Q43139/
---

	Article: Q43139
	Product: Microsoft C
	Version(s): 5.01.21
	Operating System: DOS
	Flags: ENDUSER | s_C s_Pascal h_FORTRAN
	Last Modified: 6-APR-1989
	
	When the Microsoft linker creates an executable file with overlays,
	the name of that EXE is hard coded into the file for use by the overlay
	manager. The Microsoft linker only creates internal overlays, i.e.,
	rather than producing FOO.EXE, FOO1.OVL, and FOO2.OVL, the two
	overlays are contained in FOO.EXE.
	
	If the executable is renamed at any point after linking, the overlay
	manager will still use the hard-coded name found in the EXE to locate
	the overlays, and will fail with the following prompt:
	
	   Cannot find <oldname>
	   Please enter new program spec:
	
	In order to change the name of the executable without receiving this
	error, it must be relinked and given the new name at that time.
