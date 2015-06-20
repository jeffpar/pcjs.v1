<?xml version="1.0" encoding="UTF-8"?>
<!-- author="Jeff Parsons (@jeffpar)" website="http://www.pcjs.org/" created="2012-05-05" modified="2014-02-23" license="http://www.gnu.org/licenses/gpl.html" -->
<!DOCTYPE xsl:stylesheet [
	<!ENTITY nbsp "&#160;"> <!ENTITY ne "&#8800;"> <!ENTITY le "&#8804;"> <!ENTITY ge "&#8805;">
	<!ENTITY times "&#215;"> <!ENTITY sdot "&#8901;"> <!ENTITY divide "&#247;">
	<!ENTITY copy "&#169;"> <!ENTITY Sigma "&#931;"> <!ENTITY sigma "&#963;"> <!ENTITY sum "&#8721;"> <!ENTITY lbrace "&#123;">
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:template name="commonStyles">
		<meta charset="utf-8"/>
		<link rel="shortcut icon" href="/versions/images/current/favicon.ico" type="image/x-icon"/>
		<link rel="stylesheet" type="text/css" href="/versions/pcjs/1.18.2/common.css"/>
	</xsl:template>

	<xsl:template name="commonTop">
		<div class="common-top">
			<div class="common-top-left">
				<ul>
					<li><a href="/">Home</a></li>
					<li><a href="/apps/pc/">Apps</a></li>
					<li><a href="/disks/pc/">Disks</a></li>
					<li><a href="/devices/pc/machine/">Machines</a></li>
					<li><a href="/docs/">Docs</a></li>
					<li><a href="/pubs/">Pubs</a></li>
					<li><a href="/blog/">Blog</a></li>
					<li><a href="/docs/about/">About</a></li>
				</ul>
			</div>
			<div class="common-top-right">
				<p>Powered by <a href="http://nodejs.org" target="_blank">Node.js</a> and <a href="http://aws.amazon.com/elasticbeanstalk/" target="_blank">AWS</a> | <a href="http://github.com/jeffpar/pcjs" target="_blank">GitHub</a></p>
			</div>
		</div>
	</xsl:template>

	<xsl:template name="commonBottom">
		<div class="common-bottom">
			<p class="common-reference"></p>
			<p class="common-copyright">
				<span class="common-copyright"><a href="http://www.pcjs.org/">pcjs.org</a> website © 2012-2015 by <a href="http://twitter.com/jeffpar">@jeffpar</a></span><br/>
				<span class="common-copyright">PCjs and C1Pjs released under <a href="http://gnu.org/licenses/gpl.html">GPL version 3 or later</a></span>
			</p>
		</div>
	</xsl:template>

</xsl:stylesheet>
