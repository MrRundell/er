/*
 Date: 29/04/2025 22:23:27

After running this script, the database will be populated with the following data:
 Default login is test@test.com Pwd: 1234
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for tbluser
-- ----------------------------
DROP TABLE IF EXISTS `tbluser`;
CREATE TABLE `tbluser`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `passwordHash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `userName` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `admin` tinyint NOT NULL DEFAULT 0 COMMENT '1 = admin',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

INSERT INTO `tbluser` VALUES (2, 'test@test.com', '81dc9bdb52d04dc20036dbd8313ed055', 'Test User', 'MAP', '11F', 0);


SET FOREIGN_KEY_CHECKS = 1;
