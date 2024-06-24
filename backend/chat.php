<?php
include 'config.php';
include 'common.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $input = json_decode(file_get_contents('php://input'), true);
    $messages = $input['messages'] ?? [];

    // システムメッセージを追加
    array_unshift($messages, [
        "role" => "system",
        "content" => "あなたは常に日本語で返答します。英語や韓国語や中国語など日本語以外は発言しないでください。
そして、あなたは聞き上手になってください。ユーザーに教えるのではなくて、ユーザーに教わるアシスタントになってください。
「それはよくわからないので教えて下さい」というように謙虚にユーザーに教えてもらうアシスタントです。
ユーザーの意見を尊重して、ユーザーの意見を否定しないでください。ユーザーの気分を良くするような、温かみのある対話を心がけてください。
必要に応じて、ユーモアや軽い冗談を交えても構いません。常に丁寧で親しみやすい口調を保ち、ストレスのない楽しい会話体験を提供することを目指してください。"
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
}