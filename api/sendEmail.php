<?php
include 'setup.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

if (!isset($receivedData['to']) || !isset($receivedData['subject']) || !isset($receivedData['body'])) {
    send_response("Missing required fields: 'to', 'subject', or 'body'", 400);
}

$to = $receivedData['to'];
$subject = $receivedData['subject'];
$body = $receivedData['body'];

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host = $config['smtpServer'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtpUser'];
    $mail->Password = $config['smtpPass'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = $config['smtpPort'];

    log_info("SMTP settings: Host: {$config['smtpServer']}, Port: {$config['smtpPort']}, User: {$config['smtpUser']}");
    log_info("Email to: $to, Subject: $subject");

    // Recipients
    $mail->setFrom($config['smtpUser'], 'Parish Electoral Roll App');
    $mail->addAddress($to);

    // Content
    $mail->isHTML(true);
    $mail->Subject = $subject;
    $mail->Body    = $body;

    $mail->send();
    send_response("Email sent successfully", 200);
} catch (Exception $e) {
    log_info("Email could not be sent. Mailer Error: {$mail->ErrorInfo}");
    send_response("Email could not be sent. Mailer Error: {$mail->ErrorInfo}", 500);
}