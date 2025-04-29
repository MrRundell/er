<?php

include 'setup.php';

$query = "UPDATE tbluser SET email=?, 
                             passwordHash=?, 
                             userName=?,  
                             WHERE id=?
          ";

$stmt = $mysqli->prepare($query);

if (!$stmt) {
    log_info("User update prepare failed: " . $mysqli->error);
    send_response("User update prepare failed: " . $mysqli->error, 500);
} else {
    $stmt->bind_param("sssi", $receivedData['email'], 
                                 $receivedData['passwordHash'], 
                                 $receivedData['userName'],
                                 $receivedData['id']);
                                 
    if (!$stmt->execute()) {
        log_info("Execute failed: " . $stmt->error);
        send_response("User update failed: " . $stmt->error, 500);
    } else {
        send_response("User successfully updated", 200);
    }
}

$stmt->close();
?>
