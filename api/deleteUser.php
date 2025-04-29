<?php
include 'setup.php';

$query = "DELETE FROM tbluser  WHERE id = ?";
$stmt = $mysqli->prepare($query);

if (!$stmt) {
    log_info("Prepare failed: " . $mysqli->error);
    send_response("Prepare failed: " . $mysqli->error, 500);
}

 $stmt->bind_param("i", $receivedData['id']);

 if (!$stmt->execute()) {
    log_info("Execute failed: " . $stmt->error);
    send_response("Delete Failed: " . $stmt->error, 500);
} else {
    send_response("User has been permanently deleted", 200);
}


$stmt->close();