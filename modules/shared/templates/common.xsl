<?xml version="1.0" encoding="UTF-8"?>
<!-- author="Jeff Parsons (@jeffpar)" website="https://www.pcjs.org/" created="2012-05-05" modified="2018-03-13" license="http://www.gnu.org/licenses/gpl.html" -->
<!DOCTYPE xsl:stylesheet [
	<!-- XSLT understands these entities only: lt, gt, apos, quot, and amp.  Other required entities may be defined below (see entities.dtd). -->
	<!ENTITY nbsp "&#160;"> <!ENTITY ne "&#8800;"> <!ENTITY le "&#8804;"> <!ENTITY ge "&#8805;">
	<!ENTITY times "&#215;"> <!ENTITY sdot "&#8901;"> <!ENTITY divide "&#247;">
	<!ENTITY copy "&#169;"> <!ENTITY Sigma "&#931;"> <!ENTITY sigma "&#963;"> <!ENTITY sum "&#8721;"> <!ENTITY lbrace "&#123;">
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output method="html"/>

	<xsl:template name="commonStyles">
		<meta charset="utf-8"/>
		<link rel="apple-touch-icon" sizes="180x180" href="/versions/icons/2018/apple-touch-icon.png"/>
		<link rel="icon" type="image/png" sizes="32x32" href="/versions/icons/2018/favicon-32x32.png"/>
		<link rel="icon" type="image/png" sizes="16x16" href="/versions/icons/2018/favicon-16x16.png"/>
		<link rel="shortcut icon" href="/versions/icons/2018/favicon.ico"/>
		<link rel="mask-icon" href="/versions/icons/2018/safari-pinned-tab.svg" color="#5bbad5"/>
		<link rel="stylesheet" type="text/css" href="/modules/shared/templates/common.css"/>
		<link href="https://fonts.googleapis.com/css?family=Titillium+Web" rel="stylesheet"/>
	</xsl:template>

	<xsl:template name="commonTop">
		<div class="common-top">
			<div class="common-top-left">
				<h2><a href="/">PCjs Machines</a></h2>
			</div>
			<div class="common-top-right">
				<ul>
					<li><a href="/blog/">Blog</a></li>
					<li><a href="/apps/">Apps</a></li>
					<li><a href="/devices/">Devices</a></li>
					<li><a href="/disks/pcx86/">Disks</a></li>
					<li><a href="/docs/">Docs</a></li>
					<li><a href="/docs/about/">About</a></li>
				</ul>
			</div>
		</div>
	</xsl:template>

	<xsl:template name="commonBottom">
		<div class="common-bottom">
			<p class="common-reference"></p>
			<p class="common-copyright">
				<span class="common-copyright"><a href="https://www.pcjs.org/">pcjs.org</a> © 2012-2018 by <a href="https://jeffpar.com">@jeffpar</a></span><br/>
				<span class="common-copyright">The <a href="https://github.com/jeffpar/pcjs">PCjs Project</a> is released under <a href="https://gnu.org/licenses/gpl.html">GPLv3</a></span><br/>
				<span>Powered by <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">JavaScript</a>, <a href="http://vanilla-js.com/" target="_blank">Vanilla JS</a>, and <a href="https://github.com/jeffpar" target="_blank">GitHub</a></span>
			</p>
		</div>
	</xsl:template>

</xsl:stylesheet>
