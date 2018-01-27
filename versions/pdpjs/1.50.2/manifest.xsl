<?xml version="1.0" encoding="UTF-8"?>
<!-- author="Jeff Parsons (@jeffpar)" website="http://www.pcjs.org/" created="2014-04-10" modified="2014-04-10" license="http://www.gnu.org/licenses/gpl.html" -->
<!DOCTYPE xsl:stylesheet [
	<!ENTITY nbsp "&#160;"> <!ENTITY sect "&#167;"> <!ENTITY copy "&#169;"> <!ENTITY para "&#182;"> <!ENTITY ndash "&#8211;"> <!ENTITY mdash "&#8212;">
	<!ENTITY lsquo "&#8216;"> <!ENTITY rsquo "&#8217;"> <!ENTITY ldquo "&#8220;"> <!ENTITY rdquo "&#8221;"> <!ENTITY dagger "&#8224;"> <!ENTITY Dagger "&#8225;">
]>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

	<xsl:output doctype-system="about:legacy-compat" method="html"/>

	<xsl:include href="/versions/pdpjs/1.50.2/common.xsl"/>
	<xsl:include href="/versions/pdpjs/1.50.2/components.xsl"/>

	<xsl:template match="/manifest[@type = 'document']">
		<html lang="en">
			<head>
				<title><xsl:value-of select="$SITEHOST"/></title>
				<xsl:call-template name="commonStyles"/>
				<xsl:call-template name="componentStyles"/>
			</head>
			<body>
				<div class="common">
					<xsl:call-template name="commonTop"/>
					<div class="common-middle">
						<h4>Document Manifest</h4>
						<div class="common-sidebar">
							<ul class="common-list-data">
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'Title'"/>
									<xsl:with-param name="node" select="title"/>
									<xsl:with-param name="default">None</xsl:with-param>
								</xsl:call-template>
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'Version'"/>
									<xsl:with-param name="node" select="version"/>
									<xsl:with-param name="default" select="''"/>
								</xsl:call-template>
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'Source'"/>
									<xsl:with-param name="node" select="source"/>
									<xsl:with-param name="default" select="''"/>
								</xsl:call-template>
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'Documents'"/>
									<xsl:with-param name="node" select="document"/>
									<xsl:with-param name="default"><xsl:value-of select="title"/> <xsl:if test="version != ''"><xsl:text> </xsl:text><xsl:value-of select="version"/></xsl:if></xsl:with-param>
								</xsl:call-template>
							</ul>
						</div>
						<div class="common-main">
							<p><xsl:value-of select="desc"/></p>
							<xsl:call-template name="commonBottom"/>
						</div>
					</div>
				</div>
			</body>
		</html>
	</xsl:template>

	<xsl:template match="/manifest[@type = 'software' or not(@type)]">
		<xsl:variable name="machineClass">
			<xsl:choose>
				<xsl:when test="machine/@class"><xsl:value-of select="machine/@class"/></xsl:when>
				<xsl:otherwise><xsl:value-of select="$APPCLASS"/></xsl:otherwise>
			</xsl:choose>
		</xsl:variable>
		<html lang="en">
			<head>
				<title><xsl:value-of select="$SITEHOST"/></title>
				<xsl:call-template name="commonStyles"/>
				<xsl:call-template name="componentStyles"/>
			</head>
			<body>
				<div class="common">
					<xsl:call-template name="commonTop"/>
					<div class="common-middle">
						<h4>Software Manifest</h4>
						<div class="common-sidebar">
							<ul class="common-list-data">
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'Title'"/>
									<xsl:with-param name="node" select="title"/>
									<xsl:with-param name="default">None</xsl:with-param>
								</xsl:call-template>
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'Version'"/>
									<xsl:with-param name="node" select="version"/>
									<xsl:with-param name="default">Unknown</xsl:with-param>
								</xsl:call-template>
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'Type'"/>
									<xsl:with-param name="node" select="type"/>
									<xsl:with-param name="default">None</xsl:with-param>
								</xsl:call-template>
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'Category'"/>
									<xsl:with-param name="node" select="category"/>
									<xsl:with-param name="default">None</xsl:with-param>
								</xsl:call-template>
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'Created'"/>
									<xsl:with-param name="node" select="creationDate"/>
									<xsl:with-param name="default" select="''"/>
								</xsl:call-template>
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'Creators'"/>
									<xsl:with-param name="node" select="creator"/>
									<xsl:with-param name="default" select="''"/>
								</xsl:call-template>
								<xsl:call-template name="listItem">
									<xsl:with-param name="label"><xsl:if test="creationDate">Updated</xsl:if><xsl:if test="not(creationDate)">Released</xsl:if></xsl:with-param>
									<xsl:with-param name="node" select="releaseDate"/>
									<xsl:with-param name="default">Unknown</xsl:with-param>
								</xsl:call-template>
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'Company'"/>
									<xsl:with-param name="node" select="company"/>
									<xsl:with-param name="default" select="''"/>
								</xsl:call-template>
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'Authors'"/>
									<xsl:with-param name="node" select="author"/>
									<xsl:with-param name="default" select="''"/>
								</xsl:call-template>
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'Contributors'"/>
									<xsl:with-param name="node" select="contributor"/>
									<xsl:with-param name="default" select="''"/>
								</xsl:call-template>
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'Publisher'"/>
									<xsl:with-param name="node" select="publisher"/>
									<xsl:with-param name="default" select="''"/>
								</xsl:call-template>
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'License'"/>
									<xsl:with-param name="node" select="license"/>
									<xsl:with-param name="default" select="''"/>
								</xsl:call-template>
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'Source'"/>
									<xsl:with-param name="node" select="source"/>
									<xsl:with-param name="default" select="''"/>
								</xsl:call-template>
								<xsl:call-template name="listItem">
									<xsl:with-param name="label" select="'Disks'"/>
									<xsl:with-param name="node" select="disk"/>
									<xsl:with-param name="default"><xsl:value-of select="title"/> <xsl:if test="version != ''"><xsl:text> </xsl:text><xsl:value-of select="version"/></xsl:if></xsl:with-param>
								</xsl:call-template>
							</ul>
						</div>
						<div class="common-main">
							<xsl:for-each select="machine[not(@type) or @type = 'default']">
								<xsl:call-template name="machine">
									<xsl:with-param name="href" select="@href"/>
									<xsl:with-param name="state" select="@state"/>
								</xsl:call-template>
							</xsl:for-each>
							<xsl:if test="not(machine[not(@type) or @type = 'default'])">
								<p>No default machine specified for '<xsl:value-of select="title"/>' in manifest.xml</p>
							</xsl:if>
							<xsl:call-template name="commonBottom"/>
						</div>
					</div>
				</div>
				<xsl:call-template name="componentScripts">
					<xsl:with-param name="component">
						<xsl:choose>
							<xsl:when test="machine/@debugger"><xsl:value-of select="$machineClass"/>-dbg</xsl:when>
							<xsl:otherwise><xsl:value-of select="$machineClass"/></xsl:otherwise>
						</xsl:choose>
					</xsl:with-param>
				</xsl:call-template>
			</body>
		</html>
	</xsl:template>

	<xsl:template name="listItem">
		<xsl:param name="label"/>
		<xsl:param name="node"/>
		<xsl:param name="default">Unknown</xsl:param>
		<xsl:if test="$node != '' or $default != ''">
			<li><xsl:value-of select="$label"/>
				<ul class="common-list-data-items">
					<xsl:for-each select="$node">
						<xsl:variable name="desc">
							<xsl:choose>
								<xsl:when test="desc"><xsl:value-of select="desc"/></xsl:when>
								<xsl:when test="org"><xsl:value-of select="org"/></xsl:when>
								<xsl:otherwise/>
							</xsl:choose>
						</xsl:variable>
						<li title="{$desc}">
							<xsl:variable name="value">
								<xsl:choose>
									<xsl:when test="name">
										<xsl:value-of select="name"/>
									</xsl:when>
									<xsl:when test="normalize-space(./text()) != ''">
										<xsl:value-of select="normalize-space(./text())"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="$default"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:variable>
							<xsl:variable name="href">
								<xsl:if test="@href"><xsl:value-of select="@href"/></xsl:if>
							</xsl:variable>
							<xsl:choose>
								<xsl:when test="$href != ''">
									<a href="{$href}"><xsl:value-of select="$value"/></a>
								</xsl:when>
								<xsl:otherwise>
									<xsl:value-of select="$value"/>
								</xsl:otherwise>
							</xsl:choose>
							<xsl:if test="page">
								<ul class="common-list-data-subitems">
									<xsl:for-each select="page">
										<li>
											<xsl:if test="@href">
												<a href="{$href}{@href}"><xsl:value-of select="."/></a>
											</xsl:if>
											<xsl:if test="not(@href)">
												<xsl:value-of select="."/>
											</xsl:if>
										</li>
									</xsl:for-each>
								</ul>
							</xsl:if>
						</li>
					</xsl:for-each>
					<xsl:if test="not($node)">
						<xsl:if test="@href">
							<a href="{@href}"><xsl:value-of select="$default"/></a>
						</xsl:if>
						<xsl:if test="not(@href)">
							<xsl:value-of select="$default"/>
						</xsl:if>
					</xsl:if>
				</ul>
			</li>
		</xsl:if>
	</xsl:template>

</xsl:stylesheet>
