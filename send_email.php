<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);

    $to = "your-email@example.com"; // Replace with your email address
    $subject = "New Contact Form Submission";
    
    $body = "Nombre: $name\n";
    $body .= "Correo Electrónico: $email\n";
    $body .= "Mensaje:\n$message\n";

    // Set content-type header for sending HTML email
    $headers = "From: $email\r\n";
    
    if (mail($to, $subject, $body, $headers)) {
        echo "Mensaje enviado con éxito.";
        // Optionally redirect or display a success message
        header("Location: thank_you.html");
        exit();
    } else {
        echo "Error al enviar el mensaje.";
        // Optionally redirect or display an error message
        header("Location: error.html");
        exit();
    }
}
?>