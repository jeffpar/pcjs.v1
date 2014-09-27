#
#	To load trace.com and trace.txt onto a virtual disk image that PCjs can access,
#	add an "automount" setting to your PCjs <fdc> configuration, like so:
#
#		<fdc id="fdcNEC" automount='{B:{name:"Trace Tests",path:"/tests/pc/trace/trace.com;trace.txt"}}'/>
#
#	Alternatively, if you want to run the tests in another virtual PC environment (eg, VMware Fusion),
#	you can create a .ISO image on OS X, like so:
#
#		hdiutil makehybrid -o ~/Sites/jsmachines/disks/pc/test/trace.iso ~/Sites/jsmachines/tests/pc/trace -iso -joliet
#

all: trace.com

trace.com: trace.asm
	nasm -f bin trace.asm -l trace.lst -o trace.com
