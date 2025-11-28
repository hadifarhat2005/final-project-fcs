<?php
require 'db.php';

$product_id = isset($_GET['product_id']) ? (int)$_GET['product_id'] : 0;
if ($product_id <= 0) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Missing or invalid product_id']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT id, product_id, quantity, customer_name, customer_address, total, created_at
        FROM orders
        WHERE product_id = :pid
        ORDER BY created_at DESC
        LIMIT 10
    ");
    $stmt->execute(['pid' => $product_id]);
    $orders = $stmt->fetchAll();

    echo json_encode(['success' => true, 'data' => $orders]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Query failed', 'error' => $e->getMessage()]);
}