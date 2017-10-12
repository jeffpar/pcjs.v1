---
layout: page
title: "Q33348: Loading Tagged Sections in OS/2 Version 1.10"
permalink: /pubs/pc/reference/microsoft/kb/Q33348/
---

	Article: Q33348
	Product: Microsoft C
	Version(s): 1.00
	Operating System: OS/2
	Flags: ENDUSER | docerr
	Last Modified: 29-AUG-1988
	
	Problem:
	
	I have followed the instructions on Page 64 of the "Microsoft Editor
	User's Guide" for loading tagged sections in OS/2, but the editor
	never loads this section. My TOOLS.INI file has a tag titled [M MEP]
	containing assignments for both protected and real modes and a tag
	titled [M-10.0] for OS/2 protected-mode assignments. I am running
	Microsoft OS/2 Version 1.10.
	
	Response:
	
	Your [M-10.0] tag is not loaded in OS/2 Version 1.10 because [M-10.0]
	means OS/2 Version 1.00. The version number should be changed from
	10.0 to 10.10; your tag should be [M-10.10]. If you want the tag to
	work correctly for both OS/2 Versions 1.00 and 1.10, create a tag
	titled [M-10.0 M-10.10].
	
	This information is not contained in the "Microsoft Editor User's
	Guide."
