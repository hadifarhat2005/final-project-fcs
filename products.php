<?php
require 'db.php';

try {
    $stmt = $pdo->query("SELECT id, name, description, price, stock, created_at FROM products ORDER BY id DESC");
    $products = $stmt->fetchAll();
    echo json_encode(['success' => true, 'data' => $products]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to fetch products', 'error' => $e->getMessage()]);
}