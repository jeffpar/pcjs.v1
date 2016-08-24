Unix v7 for the PDP-11
----------------------

Here's the result of following along with [How To Emulate Unix V7 Using Simh (2015)](http://www.jdpressman.com/2015/11/27/how-to-emulate-unix-v7-using-SIMH-(2015).html),
which also draws from an old [README](http://ftp.fibranet.cat/UnixArchive/PDP-11/Boot_Images/README).

	[~/Projects/GitHub/other/simh] cd kits
	[~/Projects/GitHub/other/simh/kits] ls
	1401_fortran_autocoder.tgz     decsys.zip                     iu7swre.zip                    s3scp.zip                      uv6swre.zip
	1401koans.zip                  dms8.zip                       lispswre.zip                   sim8swre.tar.Z                 uv7swre.tar.Z
	211bsd.dsk.gz                  dos11.zip                      os8swre.tar.Z                  sim8swre.zip                   uv7swre.zip
	BASIC_CAPS-11_distribution.zip dos15.zip                      psaltair.zip                   simh-imp-1973-sw-kit.zip       xvmdos.zip
	adss15.zip                     esixswre.tar.Z                 rdosswre.tar.Z                 swtp6800-swk.zip               xvmrsx_simh_kit.zip
	caps11_system.zip              focal15.zip                    rstsv7gen.tar.Z                tss8.zip                       zrdos75.zip
	caps8_all.zip                  foclswre.tar.Z                 rstsv7swre.tar.Z               utils.zip
	ceo1401.zip                    ibm1130software.zip            rt11swre.tar.Z                 uv5swre.tar.Z
	ceoaltair.zip                  ibsys_kit.zip                  rte6200.zip                    uv5swre.zip
	ddt1.zip                       iu6swre.zip                    rtv53swre.tar.Z                uv6swre.tar.Z
	[~/Projects/GitHub/other/simh/kits] mkdir unix
	[~/Projects/GitHub/other/simh/kits] cd unix
	[~/Projects/GitHub/other/simh/kits/unix] unzip -d uv7 ../uv7swre.zip
	Archive:  uv7swre.zip
	  inflating: uv7/AncientUnix.pdf     
	  inflating: uv7/unix_v7_rl.dsk      
	  inflating: uv7/README.txt          
	[~/Projects/GitHub/other/simh/kits/unix] more uv7/README.txt 
	THE ENCLOSED SOFTWARE IS PROVIDED UNDER LICENSE.
	
	DO NOT USE THIS SOFTWARE UNTIL YOU HAVE READ THE LICENSE AGREEMENT.
	BY USING THE SOFTWARE (OR AUTHORIZING ANY OTHER PERSON TO DO SO), YOU
	AGREE TO ACCEPT AND ABIDE BY ALL THE TERMS OF THIS LICENSE AGREEMENT.
	[~/Projects/GitHub/other/simh/kits/unix] cd uv7
	[~/Projects/GitHub/other/simh/kits/unix/uv7] ../../../BIN/pdp11 
	
	PDP-11 simulator V4.0-0 Beta        git commit id: 592deb8f
	sim> set cpu 11/45
	Disabling XQ
	sim> set tto 7b
	sim> att rl unix_v7_rl.dsk
	sim> boot rl
	@boot
	New Boot, known devices are hp ht rk rl rp tm vt 
	: rl(0,0)rl2unix
	mem = 177856
	# mkdir /tmp
	# chmod 777 /tmp
	# mkdir /usr/dmr
	# chown dmr /usr/dmr
	# chgrp 3 /usr/dmr
	# Restricted rights: Use, duplication, or disclosure
	is subject to restrictions stated in your contract with
	Western Electric Company, Inc.
	Thu Sep 22 05:48:50 EDT 1988
	
	login: dmr
	$ ls
	$ pwd
	/usr/dmr
	$ cd /
	$ ls -l
	total 643
	drwxrwxr-x 2 bin      2512 Sep 22 05:32 bin
	-rwxr-xr-x 1 bin      8986 Jun  8  1979 boot
	drwxrwxr-x 2 bin       160 Sep 22 05:47 dev
	drwxrwxr-x 2 bin       336 Sep 22 05:48 etc
	-rwxr-xr-x 1 sys     53302 Jun  8  1979 hphtunix
	-rwxr-xr-x 1 sys     52850 Jun  8  1979 hptmunix
	drwxrwxr-x 2 bin       320 Sep 22 05:33 lib
	drwxrwxr-x 2 root       96 Sep 22 05:46 mdec
	-rwxr-xr-x 1 root    50990 Jun  8  1979 rkunix
	-rwxr-xr-x 1 root    51982 Jun  8  1979 rl2unix
	-rwxr-xr-x 1 sys     51790 Jun  8  1979 rphtunix
	-rwxr-xr-x 1 sys     51274 Jun  8  1979 rptmunix
	drwxrwxrwx 2 root       32 Sep 22 05:48 tmp
	drwxrwxr-x12 root      192 Sep 22 05:48 usr

