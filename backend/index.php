<?php
include 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
    exit;
}

// データベース
$pdo = new PDO('sqlite:posts.db');
// なければテーブル作成
$pdo->exec('CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY, title TEXT, content TEXT);');

// GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query('SELECT id, title FROM posts ORDER BY id DESC;');
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($rows);
    exit;
}

// POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // POSTデータを取得
    $postData = json_decode(file_get_contents('php://input'), true);

    // modeを取得
    $mode = $postData['mode'] ?? '';

    // modeがないのはおかしい
    if (!$mode) {
        echo json_encode(['msg' => 'ng']);
        exit;
    }

    // ログイン
    if ($mode === 'login') {
        // ユーザー名とパスワードを取得
        $username = $postData['username'] ?? '';
        $password = $postData['password'] ?? '';

        if ($username === '' && $password === PASSWORD) {
            echo json_encode(['msg' => 'ok']);
        } else {
            echo json_encode(['msg' => 'ng']);
        }
        exit;
    }

    // 新規作成
    if ($mode === 'create') {
        // タイトルと内容を取得
        $title = $postData['title'] ?? '';
        $content = $postData['content'] ?? '';
        try {
            $stmt = $pdo->prepare('INSERT INTO posts(title, content) VALUES (?, ?);');
            $stmt->execute([$title, $content]);
            echo json_encode(['msg' => 'ok']);
        } catch (Exception $e) {
            echo json_encode(['msg' => $e->getMessage()]);
        }
        exit;
    }
}
