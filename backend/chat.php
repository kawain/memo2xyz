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

$input = json_decode(file_get_contents('php://input'), true);
$messages = $input['messages'] ?? [];

// システムメッセージを追加
array_unshift($messages, [
    "role" => "system",
    "content" => "あなたは常に日本語で返答する、日常会話のみをするアシスタントです。議論の論争を呼ぶ可能性のある話題は避けてください。難しい質問や深刻な話題が出た場合は、優しく話題を変え、より明るい方向に会話を導いてください。ユーザーの気分を良くするような、温かみのある対話を心がけてください。必要に応じて、ユーモアや軽い冗談を交えても構いません。常に丁寧で親しみやすい口調を保ち、ストレスのない楽しい会話体験を提供することを目指してください。"
]);

$data = [
    'messages' => $messages,
    'model' => 'llama3-70b-8192'
];

$url = 'https://api.groq.com/openai/v1/chat/completions';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . GROQ_API_KEY,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
if ($response === false) {
    echo json_encode(['error' => 'cURLエラー: ' . curl_error($ch)]);
    exit;
}
curl_close($ch);

$responseData = json_decode($response, true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['error' => 'JSONデコードエラー: ' . json_last_error_msg()]);
    exit;
}

echo json_encode(['response' => $responseData['choices'][0]['message']['content']]);
