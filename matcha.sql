-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 22, 2018 at 05:14 PM
-- Server version: 10.1.31-MariaDB
-- PHP Version: 7.1.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `matcha`
--

-- --------------------------------------------------------

--
-- Table structure for table `blocks`
--

CREATE TABLE `blocks` (
  `id` int(11) NOT NULL,
  `owner` int(11) NOT NULL,
  `target` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `owner` int(11) NOT NULL,
  `target` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `owner` int(11) NOT NULL,
  `target` int(11) NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `seen` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifs`
--

CREATE TABLE `notifs` (
  `id` int(11) NOT NULL,
  `owner` int(11) NOT NULL,
  `type` int(11) NOT NULL,
  `datetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `target` int(11) NOT NULL,
  `seen` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` int(11) NOT NULL,
  `tag` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `tag`) VALUES
(1, 'Piano'),
(2, 'Tennis'),
(3, 'Badminton'),
(4, 'Flute'),
(5, 'Samba'),
(6, 'Tango'),
(7, 'Cinema'),
(8, 'Theatre'),
(9, 'Basket'),
(10, 'Football'),
(11, 'Dessin'),
(12, 'Peinture');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` int(11) DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` int(11) DEFAULT NULL,
  `interest` int(11) DEFAULT '2',
  `bio` varchar(4095) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo3` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo4` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo5` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pop` int(11) NOT NULL DEFAULT '0',
  `tags` varchar(4096) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  `valide` tinyint(1) NOT NULL DEFAULT '0',
  `tmp_hash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fake` varchar(4096) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]',
  `lastonline` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `firstname`, `username`, `email`, `age`, `location`, `hash`, `gender`, `interest`, `bio`, `photo1`, `photo2`, `photo3`, `photo4`, `photo5`, `pop`, `tags`, `valide`, `tmp_hash`, `fake`, `lastonline`) VALUES
(107, 'Lauzier', 'Iva', 'Piew1978', 'IvaLauzier@dayrep.com', 39, 'NEUILLY-SUR-SEINE', 'wohS4Ia2ooPh', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 0, '[\"Cinema\",\"Football\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(108, 'Chauvin', 'Estelle', 'Lipeove', 'EstelleChauvin@jourrapide.com', 38, 'MARIGNANE', 'Iek2ahj1aj', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 40, '[\"Tango\",\"Tennis\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(109, 'Melanson', 'Leal', 'Makeden', 'LealMelanson@fleckens.hu', 22, 'STRASBOURG', 'dohp6Ozi0', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 5, '[\"Basket\",\"Cinema\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(110, 'Roy', 'Émilie', 'Holifect', 'EmilieRoy@superrito.com', 21, 'ABBEVILLE', 'Ohb2aiDai', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 40, '[\"Football\",\"Piano\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(111, 'Bourgouin', 'Paulette', 'Obeguistake', 'PauletteBourgouin@dayrep.com', 19, 'CAVAILLON', 'laich6Ielae', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 95, '[\"Flute\",\"Piano\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(112, 'Barrientos', 'Fealty', 'Theasks78', 'FealtyBarrientos@dayrep.com', 39, 'MONTPELLIER', 'kaeng3MiJ', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 5, '[\"Tennis\",\"Tango\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(113, 'Duplanty', 'Azura', 'Peale1985', 'AzuraDuplanty@rhyta.com', 33, 'HYÈRES', 'Wut7thiyoh', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 20, '[\"Samba\",\"Basket\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(114, 'Laisné', 'Porter', 'Acephror', 'PorterLaisne@dayrep.com', 37, 'SANNOIS', 'EeNiepah0ai', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 15, '[\"Piano\",\"Basket\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(115, 'Gareau', 'Crescent', 'Porms1995', 'CrescentGareau@teleworm.us', 22, 'TOULON', 'oongohy8J', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 0, '[\"Badminton\",\"Theatre\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(116, 'Labrosse', 'Madelene', 'Theded', 'MadeleneLabrosse@teleworm.us', 29, 'MONTPELLIER', 'ge7BaLaet3', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 70, '[\"Tennis\",\"Cinema\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(117, 'Leblanc', 'Alita', 'Impass', 'AlitaLeblanc@rhyta.com', 19, 'ORVAULT', 'iCipur7Ee', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 70, '[\"Flute\",\"Tennis\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(118, 'Giroux', 'Verrill', 'Thiche98', 'VerrillGiroux@einrot.com', 19, 'TOURS', 'opeeb1iFie', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 55, '[\"Basket\",\"Football\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(119, 'Chaloux', 'Verney', 'Boll1980', 'VerneyChaloux@cuvox.de', 38, 'LE CHESNAY', 'Hiegh0Nie1', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 35, '[\"Tango\",\"Theatre\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(120, 'Riquier', 'Frédéric', 'Betunink', 'FredericRiquier@armyspy.com', 24, 'LYON', 'Ieg5ziequai', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 15, '[\"Football\",\"Badminton\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(121, 'Bazin', 'Karlotta', 'Plancionsing96', 'KarlottaBazin@gustr.com', 21, 'LE LAMENTIN', 'Zoh3ahpha', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 20, '[\"Tango\",\"Tango\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(122, 'Beaujolie', 'Archaimbau', 'Wainty', 'ArchaimbauBeaujolie@fleckens.hu', 34, 'LISIEUX', 'aiw3Eegae8', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 10, '[\"Basket\",\"Basket\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(123, 'Gadbois', 'Sumner', 'Anctinget', 'SumnerGadbois@einrot.com', 26, 'LE HAVRE', 'Aiphavi2koo', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 50, '[\"Cinema\",\"Flute\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(124, 'Bélanger', 'Germaine', 'Fortiong', 'GermaineBelanger@armyspy.com', 22, 'SAINT-ANDRÉ', 'iphaeng3E', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 30, '[\"Badminton\",\"Flute\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(125, 'Sarrazin', 'Latimer', 'Serow1986', 'LatimerSarrazin@armyspy.com', 31, 'MONTPELLIER', 'aung4eiW7ae', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 30, '[\"Flute\",\"Football\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(126, 'Bolduc', 'Tyson', 'Yeaboopple', 'TysonBolduc@superrito.com', 36, 'CERGY', 'ahv3mejiPh', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 70, '[\"Basket\",\"Tennis\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(127, 'Charrette', 'Martine', 'Haduchn', 'MartineCharrette@teleworm.us', 38, 'CERGY', 'shuu2eCei7', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 5, '[\"Tennis\",\"Tango\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(128, 'Chalifour', 'Sébastien', 'Otent1995', 'SebastienChalifour@fleckens.hu', 22, 'CHELLES', 'oatei7pieNie', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 70, '[\"Football\",\"Tennis\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(129, 'Barrette', 'Yolette', 'Exemys', 'YoletteBarrette@gustr.com', 32, 'SAINT-NAZAIRE', 'ie0eShoh3ei', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 0, '[\"Flute\",\"Flute\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(130, 'Dubé', 'Iven', 'Treared', 'IvenDube@gustr.com', 23, 'AUBERVILLIERS', 'Koh0Moo3', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 0, '[\"Basket\",\"Cinema\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(131, 'Aubé', 'Leal', 'Pirits', 'LealAube@dayrep.com', 24, 'TOULOUSE', 'iraeD7Ooch', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 60, '[\"Badminton\",\"Theatre\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(132, 'Margand', 'Cosette', 'Oldisher1996', 'CosetteMargand@armyspy.com', 21, 'LE CHESNAY', 'yi2ieKaif', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 90, '[\"Basket\",\"Tennis\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(133, 'Renaud', 'Bruce', 'Eself1981', 'BruceRenaud@armyspy.com', 37, 'GRADIGNAN', 'ao8Aehaeth', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 65, '[\"Badminton\",\"Flute\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(134, 'de Launay', 'Melisande', 'Awer1997', 'MelisandedeLaunay@fleckens.hu', 21, 'SAINT-MARTIN-D\'HÈRES', 'Quoochoh6', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 45, '[\"Samba\",\"Basket\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(135, 'Trépanier', 'Etoile', 'Tonlefor', 'EtoileTrepanier@teleworm.us', 37, 'HOUILLES', 'Ua4air7ei', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 95, '[\"Basket\",\"Tango\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(136, 'Proulx', 'Anaïs', 'Reen1981', 'AnaisProulx@dayrep.com', 36, 'NÎMES', 'Nei0aizei2P', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 65, '[\"Tennis\",\"Tennis\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(137, 'Hervieux', 'Auguste', 'Lovent', 'AugusteHervieux@cuvox.de', 39, 'OLIVET', 'El6Voh5Fa7sh', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 50, '[\"Flute\",\"Tennis\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(138, 'Langelier', 'Claude', 'Havelf1992', 'ClaudeLangelier@gustr.com', 25, 'SAINT-DENIS', 'eesohp6I', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 25, '[\"Flute\",\"Badminton\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(139, 'Chrétien', 'Zdenek', 'Purpectiod1999', 'ZdenekChretien@fleckens.hu', 19, 'MAMOUDZOU', 'kohgioNgi2', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 5, '[\"Basket\",\"Flute\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(140, 'Martin', 'Philippine', 'Fachur', 'PhilippineMartin@einrot.com', 18, 'SAINTES', 'aim3buu6Tei', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 50, '[\"Piano\",\"Football\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(141, 'Patry', 'Holly', 'Papid1999', 'HollyPatry@armyspy.com', 18, 'TAVERNY', 'Kei5phei6zae', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 70, '[\"Cinema\",\"Flute\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(142, 'Mazuret', 'Hugues', 'Witterlass', 'HuguesMazuret@dayrep.com', 39, 'LA ROCHE-SUR-YON', 'aiSeigie1E', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 0, '[\"Piano\",\"Tango\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(143, 'Jalbert', 'Zara', 'Mitcher', 'ZaraJalbert@jourrapide.com', 18, 'ORLÉANS', 'jietoh5L', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 95, '[\"Badminton\",\"Theatre\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(144, 'LaGrande', 'Anton', 'Prowen', 'AntonLaGrande@gustr.com', 38, 'TOULOUSE', 'soht1Faecae', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 25, '[\"Flute\",\"Samba\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(145, 'Ducharme', 'Capucine', 'Beased', 'CapucineDucharme@gustr.com', 40, 'VERTOU', 'ieL6xooz', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 50, '[\"Theatre\",\"Theatre\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(146, 'Louis', 'Byron', 'Whation1980', 'ByronLouis@superrito.com', 37, 'SALON-DE-PROVENCE', 'IiY8LeiWahng', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 70, '[\"Samba\",\"Football\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(147, 'Reault', 'Hugh', 'Thabod95', 'HughReault@cuvox.de', 22, 'BELFORT', 'aex3zahR', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 45, '[\"Tennis\",\"Basket\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(148, 'Pouliotte', 'Simone', 'Bedeencion', 'SimonePouliotte@fleckens.hu', 30, 'SAINTE-MARIE', 'bee8ahCuF0Joh', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 70, '[\"Cinema\",\"Cinema\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(149, 'Lacombe', 'Martin', 'Resem1996', 'MartinLacombe@cuvox.de', 21, 'RUEIL-MALMAISON', 'shoong9uChoo', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 85, '[\"Tennis\",\"Basket\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(150, 'Chassé', 'Raina', 'Gwasumeet', 'RainaChasse@cuvox.de', 18, 'LE MÉE-SUR-SEINE', 'weiseiz2M', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 70, '[\"Badminton\",\"Football\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(151, 'Duperré', 'Laure', 'Withed', 'LaureDuperre@superrito.com', 32, 'ANNECY', 'Iw8phoob4', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 95, '[\"Tennis\",\"Cinema\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(152, 'Bérard', 'Desire', 'Priond', 'DesireBerard@superrito.com', 40, 'NOISY-LE-SEC', 'Ucho2yie', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 25, '[\"Samba\",\"Flute\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(153, 'Senneville', 'Agate', 'Adminaraince', 'AgateSenneville@jourrapide.com', 33, 'DIJON', 'eez6Eiphaey', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 70, '[\"Piano\",\"Cinema\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(154, 'Leroy', 'Landers', 'Reaunged', 'LandersLeroy@rhyta.com', 28, 'SÈVRES', 'Uu5ieleel', 0, 2, NULL, '3b230cbab721c0f37a5f4c4f93bc77fb', NULL, NULL, NULL, NULL, 35, '[\"Piano\",\"Piano\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(155, 'Fontaine', 'Fealty', 'Fortiquen1978', 'FealtyFontaine@teleworm.us', 39, 'VOIRON', 'pahHoh6l', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 90, '[\"Football\",\"Football\"]', 0, NULL, '[]', '2018-03-22 17:13:07'),
(156, 'Chartier', 'Josette', 'Disently1985', 'JosetteChartier@fleckens.hu', 33, 'MONTPELLIER', 'ex7Eih0m', 1, 2, NULL, 'f07e74abf1945561bd11faec4666f108', NULL, NULL, NULL, NULL, 80, '[\"Badminton\",\"Cinema\"]', 0, NULL, '[]', '2018-03-22 17:13:07');
--
-- Indexes for dumped tables
--

--
-- Indexes for table `blocks`
--
ALTER TABLE `blocks`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifs`
--
ALTER TABLE `notifs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blocks`
--
ALTER TABLE `blocks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifs`
--
ALTER TABLE `notifs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=607;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
