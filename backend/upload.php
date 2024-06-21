<?php

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
    exit;
}

$target_dir = "uploads/";

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
    if (isset($_GET['download'])) {
        $id = $_GET['download'];
        $stmt = $pdo->prepare('SELECT name FROM upload WHERE id = ?');
        $stmt->execute([$id]);
        $file = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($file) {
            $file_path = $target_dir . $file['name'];
            if (file_exists($file_path)) {
                header('Content-Type: application/octet-stream');
                header('Content-Disposition: attachment; filename="' . $file['name'] . '"');
                readfile($file_path);
                exit;
            }
        }
        echo json_encode(['msg' => 'error', 'error' => 'ファイルが見つかりません']);
        exit;
    }

    // 全件取得
    try {
        $stmt = $pdo->query('SELECT * FROM upload ORDER BY id DESC;');
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['msg' => 'ok', 'data' => $rows]);
        exit;
    } catch (Exception $e) {
        echo json_encode(['msg' => 'error', 'error' => $e->getMessage()]);
        exit;
    }
}


// POSTリクエスト処理
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $file_name = basename($_FILES["fileToUpload"]["name"]);
    $target_file = $target_dir . $file_name;

    try {
        // ファイル名の重複チェック
        $stmt = $pdo->prepare('SELECT * FROM upload WHERE name = ?');
        $stmt->execute([$file_name]);
        $existing_file = $stmt->fetch();

        if ($existing_file) {
            echo json_encode(['msg' => 'error', 'error' => '同じ名前のファイルが既に存在します']);
            exit;
        } else {
            // ファイルのアップロード
            if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
                // アップロード成功時、データベースに登録
                $stmt = $pdo->prepare('INSERT INTO upload (name) VALUES (?)');
                $stmt->execute([$file_name]);
                echo json_encode(['msg' => 'ok']);
                exit;
            } else {
                throw new Exception('ファイルのアップロードに失敗しました');
            }
        }
    } catch (Exception $e) {
        echo json_encode(['msg' => 'error', 'error' => $e->getMessage()]);
        exit;
    }
}

// DELETEリクエスト処理
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        $postData = json_decode(file_get_contents('php://input'), true);
        $id = $postData['id'] ?? '';

        // ファイル名を取得
        $stmt = $pdo->prepare('SELECT name FROM upload WHERE id = ?');
        $stmt->execute([$id]);
        $file = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($file) {
            $file_path = $target_dir . $file['name'];

            // ファイルを削除
            if (file_exists($file_path)) {
                unlink($file_path);
            }

            // データベースから削除
            $stmt = $pdo->prepare('DELETE FROM upload WHERE id = ?');
            $stmt->execute([$id]);

            echo json_encode(['msg' => 'ok']);
        } else {
            throw new Exception('ファイルが見つかりません');
        }
    } catch (Exception $e) {
        echo json_encode(['msg' => 'error', 'error' => $e->getMessage()]);
    }
    exit;
}
