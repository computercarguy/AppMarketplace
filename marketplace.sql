-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 19, 2024 at 10:28 PM
-- Server version: 10.1.28-MariaDB
-- PHP Version: 5.6.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `marketplace`
--

-- --------------------------------------------------------

--
-- Table structure for table `eventlog`
--

CREATE TABLE `eventlog` (
  `id` int(11) NOT NULL,
  `Message` text COLLATE utf8_bin NOT NULL,
  `DateLogged` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `Id` int(11) NOT NULL,
  `OAuthUserId` int(11) NOT NULL,
  `CreatedDate` datetime NOT NULL,
  `StatusId` int(11) NOT NULL,
  `PaymentMethodId` int(11) NOT NULL,
  `ModifiedDate` datetime NOT NULL,
  `PurchasedDate` datetime NOT NULL,
  `PaymentIdentifier` text COLLATE utf8_bin NOT NULL,
  `userAgreementConsent` tinyint(1) DEFAULT NULL,
  `paymentMethodConsent` tinyint(1) DEFAULT NULL,
  `total` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `invoiceitem`
--

CREATE TABLE `invoiceitem` (
  `Id` int(11) NOT NULL,
  `UtilitiesId` int(11) NOT NULL,
  `Qty` int(11) NOT NULL,
  `Price` float NOT NULL,
  `InvoiceId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `invoicestatus`
--

CREATE TABLE `invoicestatus` (
  `Id` int(11) NOT NULL,
  `Name` text COLLATE utf8_bin NOT NULL,
  `Description` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `invoicestatus`
--

INSERT INTO `invoicestatus` (`Id`, `Name`, `Description`) VALUES
(1, 'Cart', 'Still in cart, not purchased'),
(2, 'Purchased', 'Paid in full'),
(3, 'Refunded', 'Fully or partially refunded'),
(5, 'Pending', 'Submitted for payment, but waiting for something to complete purchase');

-- --------------------------------------------------------

--
-- Table structure for table `paymentmethod`
--

CREATE TABLE `paymentmethod` (
  `Id` int(11) NOT NULL,
  `Name` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `paymentmethod`
--

INSERT INTO `paymentmethod` (`Id`, `Name`) VALUES
(1, 'Stripe');

-- --------------------------------------------------------

--
-- Table structure for table `paymentoptions`
--

CREATE TABLE `paymentoptions` (
  `Id` int(11) NOT NULL,
  `OAuthUserId` int(11) NOT NULL,
  `StripeCustomer` text COLLATE utf8_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `utilities`
--

CREATE TABLE `utilities` (
  `Id` int(11) NOT NULL,
  `Name` text COLLATE utf8_bin NOT NULL,
  `Description` text COLLATE utf8_bin NOT NULL,
  `Url` text COLLATE utf8_bin NOT NULL,
  `UniqueId` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Triggers `utilities`
--
DELIMITER $$
CREATE TRIGGER `utilities.UniqueId` BEFORE INSERT ON `utilities` FOR EACH ROW BEGIN 
    IF ASCII(NEW.UniqueId) = 0 THEN 
        SET NEW.UniqueId = UNHEX(REPLACE(UUID(),'-','')); 
    END IF; 
    SET @last_uuid = NEW.UniqueId; 
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `utilitiescredits`
--

CREATE TABLE `utilitiescredits` (
  `Id` int(11) NOT NULL,
  `OAuthUserId` int(11) NOT NULL,
  `UtilitiesId` int(11) NOT NULL,
  `QuantityPurchased` int(11) NOT NULL,
  `QuantityUsed` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `utilitiescreditsused`
--

CREATE TABLE `utilitiescreditsused` (
  `Id` int(11) NOT NULL,
  `UtilitiesCreditsId` int(11) NOT NULL,
  `DateUsed` datetime NOT NULL,
  `QuantityUsed` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Table structure for table `utilitiesprice`
--

CREATE TABLE `utilitiesprice` (
  `Id` int(11) NOT NULL,
  `Price` float NOT NULL,
  `StartDate` datetime NOT NULL,
  `UtilitiesId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `eventlog`
--
ALTER TABLE `eventlog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Id` (`Id`),
  ADD KEY `fk_invoice_invoicestatus` (`StatusId`),
  ADD KEY `fk_invoice_paymentmethod` (`PaymentMethodId`);

--
-- Indexes for table `invoiceitem`
--
ALTER TABLE `invoiceitem`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Id` (`Id`),
  ADD KEY `fk_invoiceitem_invoice` (`InvoiceId`),
  ADD KEY `fk_invoiceitem_utilities` (`UtilitiesId`);

--
-- Indexes for table `invoicestatus`
--
ALTER TABLE `invoicestatus`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Id` (`Id`);

--
-- Indexes for table `paymentmethod`
--
ALTER TABLE `paymentmethod`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Id` (`Id`);

--
-- Indexes for table `paymentoptions`
--
ALTER TABLE `paymentoptions`
  ADD PRIMARY KEY (`Id`),
  ADD UNIQUE KEY `Id` (`Id`);

--
-- Indexes for table `utilities`
--
ALTER TABLE `utilities`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Id` (`Id`);

--
-- Indexes for table `utilitiescredits`
--
ALTER TABLE `utilitiescredits`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Id` (`Id`),
  ADD KEY `fk_utilitiescredits_utilities` (`UtilitiesId`);

--
-- Indexes for table `utilitiescreditsused`
--
ALTER TABLE `utilitiescreditsused`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Id` (`Id`),
  ADD KEY `fk_utilitiescreditsused_utilitiescredits` (`UtilitiesCreditsId`);

--
-- Indexes for table `utilitiesprice`
--
ALTER TABLE `utilitiesprice`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `Id` (`Id`),
  ADD KEY `fk_utilitiesprice_utilities` (`UtilitiesId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `eventlog`
--
ALTER TABLE `eventlog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=175;

--
-- AUTO_INCREMENT for table `invoiceitem`
--
ALTER TABLE `invoiceitem`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=203;

--
-- AUTO_INCREMENT for table `invoicestatus`
--
ALTER TABLE `invoicestatus`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `paymentmethod`
--
ALTER TABLE `paymentmethod`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `utilities`
--
ALTER TABLE `utilities`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `utilitiescredits`
--
ALTER TABLE `utilitiescredits`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `utilitiescreditsused`
--
ALTER TABLE `utilitiescreditsused`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `utilitiesprice`
--
ALTER TABLE `utilitiesprice`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `invoice`
--
ALTER TABLE `invoice`
  ADD CONSTRAINT `fk_invoice_invoicestatus` FOREIGN KEY (`StatusId`) REFERENCES `invoicestatus` (`Id`),
  ADD CONSTRAINT `fk_invoice_paymentmethod` FOREIGN KEY (`PaymentMethodId`) REFERENCES `paymentmethod` (`Id`);

--
-- Constraints for table `invoiceitem`
--
ALTER TABLE `invoiceitem`
  ADD CONSTRAINT `fk_invoiceitem_invoice` FOREIGN KEY (`InvoiceId`) REFERENCES `invoice` (`Id`),
  ADD CONSTRAINT `fk_invoiceitem_utilities` FOREIGN KEY (`UtilitiesId`) REFERENCES `utilities` (`Id`);

--
-- Constraints for table `utilitiescredits`
--
ALTER TABLE `utilitiescredits`
  ADD CONSTRAINT `fk_utilitiescredits_utilities` FOREIGN KEY (`UtilitiesId`) REFERENCES `utilities` (`Id`);

--
-- Constraints for table `utilitiescreditsused`
--
ALTER TABLE `utilitiescreditsused`
  ADD CONSTRAINT `fk_utilitiescreditsused_utilitiescredits` FOREIGN KEY (`UtilitiesCreditsId`) REFERENCES `utilitiescredits` (`Id`);

--
-- Constraints for table `utilitiesprice`
--
ALTER TABLE `utilitiesprice`
  ADD CONSTRAINT `fk_utilitiesprice_utilities` FOREIGN KEY (`UtilitiesId`) REFERENCES `utilities` (`Id`);

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`localhost` EVENT `Remove zeroed InvoiceItems` ON SCHEDULE EVERY 1 DAY STARTS '2023-11-02 01:00:00' ON COMPLETION NOT PRESERVE ENABLE DO DELETE FROM invoiceitem
WHERE Qty = 0$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
