-- Create syntax for TABLE 'User'
CREATE TABLE `User` (
	`UserId` int(11) unsigned NOT NULL AUTO_INCREMENT,
	`Username` varchar(52) DEFAULT NULL,
	`Hash` varchar(64) DEFAULT NULL,
	`Salt` varchar(32) DEFAULT NULL,
	`Email` varchar(255) DEFAULT NULL,
	`Image` text,
	`Bio` text,
	`RecStatus` char(1) NOT NULL DEFAULT 'A',
	`Remark` text,
	`EnterDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`LastUpdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`UserId`),
	UNIQUE KEY `UX_Email` (`Email`),
	KEY `UX_Username` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4;

-- Create syntax for TABLE 'Article'
CREATE TABLE `Article` (
	`ArticleId` int(11) unsigned NOT NULL AUTO_INCREMENT,
	`Slug` varchar(150) DEFAULT '',
	`Title` varchar(250) DEFAULT NULL,
	`Description` text,
	`Body` longtext,
	`UserId` int(11) unsigned NOT NULL,
	`RecStatus` char(1) NOT NULL DEFAULT 'A',
	`Remark` text,
	`EnterDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`LastUpdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`ArticleId`),
	UNIQUE KEY `UX_Slug` (`Slug`),
	KEY `FK_Article_UserId_User` (`UserId`),
	CONSTRAINT `FK_Article_UserId_User` FOREIGN KEY (`UserId`) REFERENCES `User` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create syntax for TABLE 'ArticleComment'
CREATE TABLE `ArticleComment` (
	`ArticleCommentId` int(11) unsigned NOT NULL AUTO_INCREMENT,
	`ArticleId` int(11) unsigned DEFAULT NULL,
	`Body` text,
	`UserId` int(11) unsigned DEFAULT NULL,
	`RecStatus` char(1) NOT NULL DEFAULT 'A',
	`EnterDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`LastUpdate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	PRIMARY KEY (`ArticleCommentId`),
	KEY `FK_ArticleComment_ArticleId_Article` (`ArticleId`),
	KEY `FK_ArticleComment_UserId_User` (`UserId`),
	CONSTRAINT `FK_ArticleComment_ArticleId_Article` FOREIGN KEY (`ArticleId`) REFERENCES `Article` (`ArticleId`),
	CONSTRAINT `FK_ArticleComment_UserId_User` FOREIGN KEY (`UserId`) REFERENCES `User` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create syntax for TABLE 'ArticleFavorite'
CREATE TABLE `ArticleFavorite` (
	`ArticleId` int(11) unsigned NOT NULL,
	`UserId` int(11) unsigned NOT NULL,
	`EnterDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`ArticleId`,`UserId`),
	KEY `FK_ArticleFavorite_UserId_User` (`UserId`),
	CONSTRAINT `FK_ArticleFavorite_ArticleId_Article` FOREIGN KEY (`ArticleId`) REFERENCES `Article` (`ArticleId`),
	CONSTRAINT `FK_ArticleFavorite_UserId_User` FOREIGN KEY (`UserId`) REFERENCES `User` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create syntax for TABLE 'ArticleTag'
CREATE TABLE `ArticleTag` (
	`ArticleId` int(11) unsigned NOT NULL,
	`Tag` varchar(50) NOT NULL,
	PRIMARY KEY (`ArticleId`,`Tag`),
	CONSTRAINT `FK_ArticleTag_ArticleId_Article` FOREIGN KEY (`ArticleId`) REFERENCES `Article` (`ArticleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create syntax for TABLE 'UserFollow'
CREATE TABLE `UserFollow` (
	`FollowUser` int(11) unsigned NOT NULL,
	`UserId` int(11) unsigned NOT NULL,
	`EnterDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (`FollowUser`,`UserId`),
	KEY `FK_UserId_User_UserId` (`UserId`),
	CONSTRAINT `FK_UserFollow_FollowUser_User_UserId` FOREIGN KEY (`FollowUser`) REFERENCES `User` (`UserId`),
	CONSTRAINT `FK_UserFollow_UserId_User` FOREIGN KEY (`UserId`) REFERENCES `User` (`UserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;