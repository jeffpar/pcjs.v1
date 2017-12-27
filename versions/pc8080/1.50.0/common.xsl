<?xml version="1.0" encoding="UTF-8"?>
<!-- author="Jeff Parsons (@jeffpar)" website="http://www.pcjs.org/" created="2012-05-05" modified="2014-02-23" license="http://www.gnu.org/licenses/gpl.html" -->
<!DOCTYPE xsl:stylesheet [
	<!ENTITY nbsp "&#160;"> <!ENTITY ne "&#8800;"> <!ENTITY le "&#8804;"> <!ENTITY ge "&#8805;">
	<!ENTITY times "&#215;"> <!ENTITY sdot "&#8901;"> <!ENTITY divide "&#247;">
	<!ENTITY copy "&#169;"> <!ENTITY Sigma "&#931;"> <!ENTITY sigma "&#963;"> <!ENTITY sum "&#8721;"> <!ENTITY lbrace "&#123;">
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output method="html"/>

	<xsl:template name="commonStyles">
		<meta charset="utf-8"/>
		<link rel="apple-touch-icon" sizes="57x57" href="/versions/icons/current/pc-icon-57.png"/>
		<link rel="apple-touch-icon" sizes="72x72" href="/versions/icons/current/pc-icon-72.png"/>
		<link rel="apple-touch-icon" sizes="76x76" href="/versions/icons/current/pc-icon-76.png"/>
		<link rel="apple-touch-icon" sizes="114x114" href="/versions/icons/current/pc-icon-114.png"/>
		<link rel="apple-touch-icon" sizes="120x120" href="/versions/icons/current/pc-icon-120.png"/>
		<link rel="apple-touch-icon" sizes="144x144" href="/versions/icons/current/pc-icon-144.png"/>
		<link rel="apple-touch-icon" sizes="152x152" href="/versions/icons/current/pc-icon-152.png"/>
		<link rel="apple-touch-icon" sizes="180x180" href="/versions/icons/current/pc-icon-180.png"/>
		<link rel="apple-touch-icon" sizes="192x192" href="/versions/icons/current/pc-icon-192.png"/>
		<link rel="apple-touch-icon" href="/versions/icons/current/apple-touch-icon.png"/>
		<link rel="icon" type="image/png" sizes="192x192" href="/versions/icons/current/pc-icon-192.png"/>
		<link rel="shortcut icon" type="image/x-icon" href="/versions/icons/current/favicon.ico"/>
		<link rel="stylesheet" type="text/css" href="/versions/pc8080/1.50.0/common.css"/>
	</xsl:template>

	<xsl:template name="commonTop">
		<div class="common-top">
			<div class="common-top-left">
				<ul>
					<li><a href="/">PCjs</a></li>
					<li><a href="/blog/">Blog</a></li>
					<li><a href="/apps/">Apps</a></li>
					<li><a href="/devices/">Devices</a></li>
					<li><a href="/disks/">Disks</a></li>
					<li><a href="/pubs/docs/">Docs</a></li>
					<li><a href="/pubs/docs/about/">About</a></li>
				</ul>
			</div>
			<div class="common-top-right">
				<p>Powered by <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">JavaScript</a>, <a href="http://vanilla-js.com/" target="_blank">Vanilla JS</a>, and <a href="http://github.com/jeffpar/pcjs" target="_blank">GitHub</a></p>
			</div>
		</div>
	</xsl:template>

	<xsl:template name="commonBottom">
		<div class="common-bottom">
			<p class="common-reference"></p>
			<p class="common-copyright">
				<span class="common-copyright"><a href="http://www.pcjs.org/">pcjs.org</a> © 2012-2017 by <a href="http://twitter.com/jeffpar">@jeffpar</a></span><br/>
				<span class="common-copyright"><a href="http://github.com/jeffpar/pcjs">PCjs Project</a> released under <a href="http://gnu.org/licenses/gpl.html">GPLv3</a></span>
			</p>
		</div>
	</xsl:template>

</xsl:stylesheet>
