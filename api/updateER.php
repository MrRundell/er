<?php

include 'setup.php';

$query = "INSERT INTO tbler (id, title, firstName, lastName, 
                             address1, address2, address3, address4, postcode, 
                             tel, mobile, email, pcc, resident, communicant, 
                             pccEnd, dateAdded, dateofBirth, er, over70, under18)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE 
              title=VALUES(title),
              firstName=VALUES(firstName),
              lastName=VALUES(lastName),
              address1=VALUES(address1),
              address2=VALUES(address2),
              address3=VALUES(address3),
              address4=VALUES(address4),
              postcode=VALUES(postcode),
              tel=VALUES(tel),
              mobile=VALUES(mobile),
              email=VALUES(email),
              pcc=VALUES(pcc),
              resident=VALUES(resident),
              communicant=VALUES(communicant),
              pccEnd=VALUES(pccEnd),
              dateAdded=VALUES(dateAdded),
              dateofBirth=VALUES(dateofBirth),
              over70=VALUES(over70),
              under18=VALUES(under18),
              er=VALUES(er)";

$stmt = $mysqli->prepare($query);

if (!$stmt) {
    log_info("Member insert/update prepare failed: " . $mysqli->error);
    send_response("Member insert/update prepare failed: " . $mysqli->error, 500);
} else {
    $stmt->bind_param("isssssssssssiiiissiii", $receivedData['id'], 
                                            $receivedData['title'], 
                                            $receivedData['firstName'], 
                                            $receivedData['lastName'],
                                            $receivedData['address1'],
                                            $receivedData['address2'],
                                            $receivedData['address3'],
                                            $receivedData['address4'],
                                            $receivedData['postcode'],
                                            $receivedData['tel'],
                                            $receivedData['mobile'],
                                            $receivedData['email'], // Ensure this is a string
                                            $receivedData['pcc'],
                                            $receivedData['resident'],
                                            $receivedData['communicant'],
                                            $receivedData['pccEnd'],
                                            $receivedData['dateAdded'],
                                            $receivedData['dateofBirth'],
                                            $receivedData['er'],
                                            $receivedData['over70'],
                                            $receivedData['under18']);
                                 
    if (!$stmt->execute()) {
        log_info("Execute failed: " . $stmt->error);
        send_response("Member insert/update failed: " . $stmt->error, 500);
    } else {
        send_response("Member successfully inserted/updated", 200);
    }
}

$stmt->close();
?>