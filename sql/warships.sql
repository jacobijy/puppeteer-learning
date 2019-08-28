/*
 Navicat MySQL Data Transfer

 Source Server         : blhx
 Source Server Type    : MySQL
 Source Server Version : 80017
 Source Host           : localhost:3306
 Source Schema         : blhx

 Target Server Type    : MySQL
 Target Server Version : 80017
 File Encoding         : 65001

 Date: 28/08/2019 14:18:25
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for warships
-- ----------------------------
DROP TABLE IF EXISTS `warships`;
CREATE TABLE `warships`  (
  `shipNo` smallint(1) NOT NULL,
  `shipname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `shipclass` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `aliasname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `englishname` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `rarity` smallint(1) NULL DEFAULT NULL,
  `region` smallint(1) NULL DEFAULT NULL,
  `iconsrc` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `type` smallint(6) NULL DEFAULT NULL,
  `normalsalvage` blob NULL COMMENT '普通关卡',
  `specialsalvage` blob NULL COMMENT '特别关卡',
  `buildtime` int(1) NULL DEFAULT NULL,
  `armorType` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `cannon` int(1) NULL DEFAULT NULL COMMENT '炮击',
  `torpedo` int(1) NULL DEFAULT NULL COMMENT '雷击',
  `reloadState` int(1) NULL DEFAULT NULL COMMENT '装填',
  `antiaircraft` int(1) NULL DEFAULT NULL COMMENT '防空',
  `oilwear` int(1) NULL DEFAULT NULL COMMENT '油耗',
  `antisubmarine` int(1) NULL DEFAULT NULL COMMENT '反潜',
  `stamina` int(1) NULL DEFAULT NULL COMMENT '耐久',
  `flexibility` int(1) NULL DEFAULT NULL COMMENT '机动',
  `luck` int(1) NULL DEFAULT NULL COMMENT '幸运',
  `speed` int(1) NULL DEFAULT NULL COMMENT '航速',
  `airpower` int(1) NULL DEFAULT NULL COMMENT '航空',
  `ability` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '技能'
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
