<?php

include 'setup.php';

$query = "INSERT INTO tbluser (email, passwordHash, userName, admin)
          VALUES (?, ?, ?, ?)";

$stmt = $mysqli->prepare($query);

if (!$stmt) {
    log_info("User create prepare failed: " . $mysqli->error);
    send_response("User create prepare failed: " . $mysqli->error, 500);
} else {
    $stmt->bind_param("sssi", $receivedData['email'], 
                             $receivedData['passwordHash'], 
                             $receivedData['userName'],
                             $receivedData['admin']);
    if (!$stmt->execute()) {
        log_info("User creation failed: " . $stmt->error);
        send_response("User creation failed: " . $stmt->error, 500);
    } else {
        send_response("User successfully created", 200);
    }
}

$stmt->close();
?>
