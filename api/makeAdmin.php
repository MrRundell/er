<?php
include 'setup.php';

$query = "UPDATE tbluser SET admin = 1 WHERE id = ?";
$stmt = $mysqli->prepare($query);

if (!$stmt) {
    log_info("Prepare failed: " . $mysqli->error);
    send_response("Prepare failed: " . $mysqli->error, 500);
}

 $stmt->bind_param("i", $receivedData['id']);

 if (!$stmt->execute()) {
    log_info("Execute failed: " . $stmt->error);
    send_response("Make Admin Failed: " . $stmt->error, 500);
} else {
    send_response("User has been promoted to admin", 200);
}


$stmt->close();