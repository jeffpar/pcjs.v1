---
layout: page
title: Microsoft OS/2 SDK v1.02
permalink: /disks/pc/tools/microsoft/os2/sdk/1.02/
---

Microsoft OS/2 SDK v1.02
---

This copy of the Microsoft OS/2 SDK (v1.02) was obtained from the [WinWorld](https://winworldpc.com/product/os-2-1x/10)
website.  Unfortunately, it's missing the **NETWORK** disk, so we've included an empty **NETWORK** disk
that allows the SDK installation script to finish.

This SDK was released around December 1987 and included a copy of Microsoft OS/2 1.0.  We do not have any of the
printed documentation that came with the SDK, such as the *Installation Guide*, but we do have the
[Microsoft® Operating System/2 Programmer’s Toolkit](/docs/os2/microsoft/ptk/1.0/) from March 1988, thanks to the
[OS/2 Museum](http://www.os2museum.com/).

### Installation

If you look at the **TOOLKIT1** disk, in the **OS2DOC** folder, you'll find **READ.ME!**, which includes some very
useful information about the SDK installation process:

	The installation guide is confusing, can you give me three easy steps to
	installing the SDK?
	
		Sure.  First, put the program diskette into your machine and reboot it.
		Follow the instructions.  If you have a new machine, first format the
		hard drive, then reboot with the program diskette.
	
		Second: copy the files \OS2DOC\INPUT.EXE and \OS2DOC\INSTSDK.CMD from the
		TOOLKIT diskette to the root of your hard drive.  Run the program INSTSDK
		and answer its questions.
	
		Thats, all. [sic]

One of the first questions that the INSTSDK.CMD script asks is:

	Are you installing MS OS/2 SDK on a PS/2 machine?

PCjs currently only simulates PC, XT and AT-class machines, not PS/2 machines, so you might be inclined to answer
**NO** to that question, but in fact, the correct answer is **YES**, because the SDK doesn't actually care what kind
of machine you're using.  It's asking that question simply to determine whether you're using 3.5-inch or 5.25-inch SDK
distribution diskettes.  These disks happen to be the 3.5-inch versions, so you must pretend you're using a PS/2.

This SDK must have only been tested with the copy of MS OS/2 1.0 included with the SDK, because if you install
it on IBM OS/2 1.0, the script will fail at the end, when it attempts to run LIBBUILD to build all the C runtime
libraries.  Apparently, this is because IBM OS/2 1.0 creates an OS2INIT.CMD with PATH set to:

	C:\;C:\OS2;C:\OS2\INSTALL;

so when INSTSDK.CMD updates the PATH, it appends its own directories with a leading semi-colon, resulting in:

	C:\;C:\OS2;C:\OS2\INSTALL;;C:\OS2SDK\TOOLS\BIN;C:\OS2SDK\TOOLS\PBIN

and the "double semi-colon" apparently causes PATH searches to terminate prematurely, so the LIBBUILD program will
not be found.

To complete SDK installation, fix the PATH in OS2INIT.CMD, then type the following command:

	for %i in (s m c l) do libbuild %i em %LIB%

and *now* your MS OS/2 SDK should be fully installed.  Well, not *quite* fully, because you won't have the files from
the missing **NETWORK** disk; specifically:

	IPCCALLS.DLL
	IPCCALLS.LIB
	IPCTEST.C
	LANMAN.INI
	MAILSLOT.H
	MAKEFILE
	NAMPIPE.SYS
	NMPIPE.H
	README.DOC

but you aren't likely to need them.
