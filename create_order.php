<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed. Use POST.']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$product_id = isset($input['product_id']) ? (int)$input['product_id'] : 0;
$quantity = isset($input['quantity']) ? (int)$input['quantity'] : 0;
$customer_name = isset($input['customer_name']) ? trim($input['customer_name']) : '';
$customer_address = isset($input['customer_address']) ? trim($input['customer_address']) : '';

if ($product_id <= 0 || $quantity <= 0 || $customer_name === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input. product_id, quantity (>0), and customer_name required.']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, price, stock FROM products WHERE id = :id LIMIT 1");
    $stmt->execute(['id' => $product_id]);
    $product = $stmt->fetch();

    if (!$product) {
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => 'Product not found']);
        exit;
    }

    if ($product['stock'] < $quantity) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Insufficient stock']);
        exit;
    }

    $total = bcmul((string)$product['price'], (string)$quantity, 2);

    $pdo->beginTransaction();

    $ins = $pdo->prepare("INSERT INTO orders (product_id, quantity, customer_name, customer_address, total) VALUES (:product_id, :quantity, :customer_name, :customer_address, :total)");
    $ins->execute([
        'product_id' => $product_id,
        'quantity' => $quantity,
        'customer_name' => $customer_name,
        'customer_address' => $customer_address,
        'total' => $total
    ]);

    $upd = $pdo->prepare("UPDATE products SET stock = stock - :qty WHERE id = :id");
    $upd->execute(['qty' => $quantity, 'id' => $product_id]);

    $orderId = $pdo->lastInsertId();
    $pdo->commit();

    http_response_code(201);
    echo json_encode(['success' => true, 'message' => 'Order created', 'order_id' => (int)$orderId, 'total' => $total]);
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to create order', 'error' => $e->getMessage()]);
}