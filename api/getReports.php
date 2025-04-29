<?php
include 'setup.php';

/* TOTAL REPORT */
$query = "SELECT COUNT(id) As result FROM tbler";
$stmt = $mysqli->prepare($query);

if (!$stmt) {
    log_info("Prepare failed: " . $mysqli->error);
    send_response("Prepare failed: " . $mysqli->error, 500);
}

if (!$stmt->execute()) {
    log_info("Execute failed: " . $stmt->error);
    send_response("Execute failed: " . $stmt->error, 500);
}

$result = $stmt->get_result();

if ($result) {

    $total = mysqli_fetch_assoc($result);

}

/* ER Report */
$query = "SELECT COUNT(id) As result  FROM tbler WHERE er = 1";
$stmt = $mysqli->prepare($query);

if (!$stmt) {
    log_info("Prepare failed: " . $mysqli->error);
    send_response("Prepare failed: " . $mysqli->error, 500);
}

if (!$stmt->execute()) {
    log_info("Execute failed: " . $stmt->error);
    send_response("Execute failed: " . $stmt->error, 500);
}

$result = $stmt->get_result();

if ($result) {

    $er = mysqli_fetch_assoc($result);

}

/* Resident Report */
$query = "SELECT COUNT(id) As result  FROM tbler WHERE resident = 1";
$stmt = $mysqli->prepare($query);

if (!$stmt) {
    log_info("Prepare failed: " . $mysqli->error);
    send_response("Prepare failed: " . $mysqli->error, 500);
}

if (!$stmt->execute()) {
    log_info("Execute failed: " . $stmt->error);
    send_response("Execute failed: " . $stmt->error, 500);
}

$result = $stmt->get_result();

if ($result) {

    $resident = mysqli_fetch_assoc($result);

}

/* ER AND RESIDENT REPORT */
$query = "SELECT COUNT(id) As result FROM tbler WHERE er = 1 AND resident = 1";
$stmt = $mysqli->prepare($query);

if (!$stmt) {
    log_info("Prepare failed: " . $mysqli->error);
    send_response("Prepare failed: " . $mysqli->error, 500);
}

if (!$stmt->execute()) {
    log_info("Execute failed: " . $stmt->error);
    send_response("Execute failed: " . $stmt->error, 500);
}

$result = $stmt->get_result();

if ($result) {

    $erresident = mysqli_fetch_assoc($result);

}

/* OVER 70 REPORT */
$query = "SELECT COUNT(id) As result FROM tbler WHERE over70 = 1";
$stmt = $mysqli->prepare($query);

if (!$stmt) {
    log_info("Prepare failed: " . $mysqli->error);
    send_response("Prepare failed: " . $mysqli->error, 500);
}

if (!$stmt->execute()) {
    log_info("Execute failed: " . $stmt->error);
    send_response("Execute failed: " . $stmt->error, 500);
}

$result = $stmt->get_result();

if ($result) {

    $over70 = mysqli_fetch_assoc($result);

}

/* OVER 70 ER REPORT */
$query = "SELECT COUNT(id) As result FROM tbler WHERE over70 = 1 AND er = 1";
$stmt = $mysqli->prepare($query);

if (!$stmt) {
    log_info("Prepare failed: " . $mysqli->error);
    send_response("Prepare failed: " . $mysqli->error, 500);
}

if (!$stmt->execute()) {
    log_info("Execute failed: " . $stmt->error);
    send_response("Execute failed: " . $stmt->error, 500);
}

$result = $stmt->get_result();

if ($result) {

    $over70ER = mysqli_fetch_assoc($result);

}

/* UNDER 18 REPORT */
$query = "SELECT COUNT(id) As result FROM tbler WHERE under18 = 1";
$stmt = $mysqli->prepare($query);

if (!$stmt) {
    log_info("Prepare failed: " . $mysqli->error);
    send_response("Prepare failed: " . $mysqli->error, 500);
}

if (!$stmt->execute()) {
    log_info("Execute failed: " . $stmt->error);
    send_response("Execute failed: " . $stmt->error, 500);
}

$result = $stmt->get_result();

if ($result) {

    $under18 = mysqli_fetch_assoc($result);

}

/* UNDER 18 ER REPORT */
$query = "SELECT COUNT(id) As result FROM tbler WHERE under18 = 1 AND er = 1";
$stmt = $mysqli->prepare($query);

if (!$stmt) {
    log_info("Prepare failed: " . $mysqli->error);
    send_response("Prepare failed: " . $mysqli->error, 500);
}

if (!$stmt->execute()) {
    log_info("Execute failed: " . $stmt->error);
    send_response("Execute failed: " . $stmt->error, 500);
}

$result = $stmt->get_result();

if ($result) {

    $under18ER = mysqli_fetch_assoc($result);

}

/* BUILD JSON RESPONSE */
$rows = array('total' => $total['result'],
              'er' => $er['result'],  
              'resident' => $resident['result'],
              'erresident' => $erresident['result'],
              'over70' => $over70['result'],
              'under18' => $under18['result'],
              'over70ER' => $over70ER['result'],
              'under18ER' => $under18ER['result']);

    $json = json_encode($rows);
    send_response($json, 200);


$stmt->close();