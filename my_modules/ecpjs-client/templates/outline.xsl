<?xml version="1.0" encoding="UTF-8"?>
<!-- author="Jeff Parsons" creator="http://www.pcjs.org/" created="2012-05-05T19:53:00" modified="2012-05-05T19:53:00" license="http://creativecommons.org/licenses/by-nc-sa/3.0/us/" -->
<!DOCTYPE xsl:stylesheet [
	<!-- XSLT understands these entities only: lt, gt, apos, quot, and amp.  Other useful entities are defined below (see entities.dtd). --> 
	<!ENTITY nbsp "&#160;"> <!ENTITY sect "&#167;"> <!ENTITY copy "&#169;"> <!ENTITY para "&#182;"> <!ENTITY ndash "&#8211;"> <!ENTITY mdash "&#8212;">
	<!ENTITY lsquo "&#8216;"> <!ENTITY rsquo "&#8217;"> <!ENTITY ldquo "&#8220;"> <!ENTITY rdquo "&#8221;"> <!ENTITY dagger "&#8224;"> <!ENTITY Dagger "&#8225;">
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:param name="rootDir" select="''"/>
	<xsl:param name="generator" select="'client'"/>
	<xsl:output doctype-system="about:legacy-compat"/>

    <xsl:include href="../../../my_modules/shared/templates/common.xsl"/>
					
	<xsl:template match="/outline">
		<html lang="en">
			<head>
				<title><xsl:value-of select="title"/><xsl:text> | jsmachines.net</xsl:text></title>
				<xsl:call-template name="commonStyles"/>
			</head>
			<body>
				<div class="page">
					<xsl:apply-templates/>
				</div>
			</body>
		</html>
	</xsl:template>
	
</xsl:stylesheet>
