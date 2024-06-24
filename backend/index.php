<?php
include 'config.php';
include 'common.php';


// データベース接続
try {
    $pdo = new PDO('sqlite:posts.db');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // なければテーブル作成
    $pdo->exec('CREATE TABLE IF NOT EXISTS posts(id INTEGER PRIMARY KEY, title TEXT, content TEXT);');
    $pdo->exec('CREATE TABLE IF NOT EXISTS upload(id INTEGER PRIMARY KEY, name TEXT UNIQUE);');
} catch (Exception $e) {
    echo json_encode(['msg' => 'error', 'error' => 'データベース接続に失敗しました: ' . $e->getMessage()]);
    exit;
}

// GETリクエスト処理
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id'])) {
        // 個別取得
        try {
            $id = $_GET['id'];
            $stmt = $pdo->prepare('SELECT * FROM posts WHERE id = ?;');
            $stmt->execute([$id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            echo json_encode(['msg' => 'ok', 'data' => $row]);
        } catch (Exception $e) {
            echo json_encode(['msg' => 'error', 'error' => $e->getMessage()]);
        }
    } elseif (isset($_GET['q'])) {
        // 検索
        try {
            $q = $_GET['q'];
            $stmt = $pdo->prepare('SELECT * FROM posts WHERE title LIKE ? OR content LIKE ? ORDER BY id DESC;');
            $stmt->execute(["%{$q}%", "%{$q}%"]);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['msg' => 'ok', 'data' => $rows]);
        } catch (Exception $e) {
            echo json_encode(['msg' => 'error', 'error' => $e->getMessage()]);
        }
    } else {
        // 全件取得
        try {
            $stmt = $pdo->query('SELECT id, title FROM posts ORDER BY id DESC;');
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode(['msg' => 'ok', 'data' => $rows]);
        } catch (Exception $e) {
            echo json_encode(['msg' => 'error', 'error' => $e->getMessage()]);
        }
    }
    exit;
}

// POSTリクエスト処理
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);
    $mode = $postData['mode'] ?? '';

    if (!$mode) {
        echo json_encode(['msg' => 'error', 'error' => 'モードが指定されていません。']);
        exit;
    }

    if ($mode === 'login') {
        $username = $postData['username'] ?? '';
        $password = $postData['password'] ?? '';

        if ($password === PASSWORD) {
            echo json_encode(['msg' => 'ok']);
        } else {
            echo json_encode(['msg' => 'error', 'error' => '認証に失敗しました。']);
        }
        exit;
    }

    if ($mode === 'create') {
        $title = $postData['title'] ?? '';
        $content = $postData['content'] ?? '';
        try {
            $stmt = $pdo->prepare('INSERT INTO posts(title, content) VALUES (?, ?);');
            $stmt->execute([$title, $content]);
            echo json_encode(['msg' => 'ok']);
        } catch (Exception $e) {
            echo json_encode(['msg' => 'error', 'error' => $e->getMessage()]);
        }
        exit;
    }
}

// PUTリクエスト処理
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    try {
        $postData = json_decode(file_get_contents('php://input'), true);
        $id = $postData['id'] ?? '';
        $title = $postData['title'] ?? '';
        $content = $postData['content'] ?? '';
        $stmt = $pdo->prepare('UPDATE posts SET title = ?, content = ? WHERE id = ?;');
        $stmt->execute([$title, $content, $id]);
        echo json_encode(['msg' => 'ok']);
    } catch (Exception $e) {
        echo json_encode(['msg' => 'error', 'error' => $e->getMessage()]);
    }
    exit;
}

// DELETEリクエスト処理
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        $postData = json_decode(file_get_contents('php://input'), true);
        $id = $postData['id'] ?? '';
        $stmt = $pdo->prepare('DELETE FROM posts WHERE id = ?;');
        $stmt->execute([$id]);
        echo json_encode(['msg' => 'ok']);
    } catch (Exception $e) {
        echo json_encode(['msg' => 'error', 'error' => $e->getMessage()]);
    }
    exit;
}
