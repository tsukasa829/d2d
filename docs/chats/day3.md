---
userAvatar: /avatars/evil.png
defaultBot: other
requireCorrect: true
wrongMessage: "猫の気持ちになって、選んでみてください"
bots:
  other:
    displayName: 相手猫
    avatar: /avatars/otherCat.png
  teacher:
    displayName: ねこ先生
    avatar: /avatars/teacherCat.png
  tsubaki:
    displayName: Tsubaki
    avatar: /avatars/tsubaki.png
  evil:
    displayName: 嫉妬猫ミドリ
    avatar: /avatars/evil.png
---

<!-- 挨拶とルール説明 -->
Bot(tsubaki): Day3へようこそ。今日は「嫉妬」について話してみましょう。

Bot(tsubaki): 嫉妬は、醜い感情だと思われがちですが、実は「自分が本当に欲しいもの」を教えてくれる羅針盤なんです。

User [avatar=none]:
- o: そうなんだ

Bot(tsubaki): それでは、嫉妬猫を紹介します。

<!-- プロフィール紹介 -->
Bot(tsubaki)[image]: /avatars/evil.png

Bot(tsubaki): この子は嫉妬猫のミドリ。誰かを羨ましくて、悔しくて、モヤモヤしている子です。猫の世界では、どんな感情も許されます。もちろん、嫉妬もOKです。ミドリになったつもりで、会話してみましょう!

User [avatar=none]:
- o: OK！

Bot(tsubaki): これから相手役の猫が自慢話や幸せそうな話をします。いい子ぶらずに、黒い感情を吐き出してみてください。

User [avatar=none]:
- o: はじめる

<!-- セット1 -->
Bot(other): 見て見て！新しいおもちゃ買ってもらったんだ！いいでしょ？

User:
- x: よかったね、似合うよ
- x: 僕も持ってるし
- o: ずるい！いいなぁ…僕だって欲しいのに！悔しい！

Bot(other): ごめん…自慢するつもりじゃなかったんだ…

Bot(teacher): 欲しいものを欲しいと言う、素直な嫉妬を表現できましたね。それは自分の欲望に正直な証拠です。

User [avatar=none]:
- o: 次へ

<!-- セット2 -->
Bot(other): 僕、今度表彰されることになったんだ！すごくない？

User:
- x: おめでとう！すごいね！
- o: なんで君ばっかり…僕の方が頑張ってるのに！面白くない！
- x: ふーん、よかったね

Bot(other): そんなふうに思ってたんだ…ごめん…

Bot(teacher): 他人の成功を喜べない自分を認められましたね。それでいいんです。無理に祝う必要はありません。

User [avatar=none]:
- o: 次へ

<!-- セット3 -->
Bot(other): あいつ、僕のこと好きだって！モテモテで困っちゃうよ。

User:
- x: 応援するよ
- x: 興味ないね
- o: ムカつく！なんで君だけ愛されるの？僕はずっと一人なのに！

Bot(other): 傷つけるつもりはなかったんだ…ごめん…

Bot(teacher): 愛されたいという切実な願いを、嫉妬を通して表現できましたね。その怒りは、愛への渇望です。

User [avatar=none]:
- o: 次へ

<!-- セット4 -->
Bot(other): 僕は才能があるから、何でもすぐにできるんだよね。

User:
- x: 才能あって羨ましいよ
- o: 調子に乗らないでよ！才能がある奴には僕の苦しみなんてわからない！
- x: 努力も大事だよ

Bot(other): 調子に乗ってごめん…苦しんでたんだね…

Bot(teacher): 持たざる者の苦しみと怒りをぶつけられましたね。劣等感を感じることは、向上心の裏返しでもあります。

User [avatar=none]:
- o: 次へ

<!-- セット5 -->
Bot(other): 君の欲しかったもの、僕が手に入れちゃった。ごめんね？

User:
- x: 仕方ないよ、あげるよ
- x: 別に欲しくなかったし
- o: 返してよ！それは僕のものになるはずだったのに！許せない！

Bot(other): 本当にごめん…君にとって大事なものだったんだね…

Bot(teacher): 奪われた悔しさを爆発させることができましたね。嫉妬の裏には、あなたの「欲しい」が隠れています。自分の”本当の願い”を許してあげてください。

Bot(teacher): 最後に、嫉妬猫に挨拶しましょう

Bot(evil)[image]: /avatars/evil.png

User:
- x: 嫉妬なんかしたくない
- o: 自分の願いに気づけた。ありがとう

Bot(evil)[image]: /avatars/evilSmile.png

Bot(evil)[image]: /avatars/ilust.png

Bot(teacher): これは…猫の似顔絵ですね。どうやら嫉妬猫を檻に閉じ込めた犯人のようです。この世界にはあなたの願いを阻む猫もいます。とても危険ですが、悪い子ではありません。会いたいですか？

User [avatar=none]:
- o: 会いに行く
- x: ここでやめておく

Bot(teacher): わかりました。では明日はその猫の正体を暴きましょう。

User [avatar=none]:
- o: Day4へ進む
- x: ここでD2Dを終了する

Bot(tsubaki): ここからのセッションはあなたの人生が変わっていまう可能性があるため、きちんとサポートするために招待制となっております。メール頂くか、ご友人からの紹介でのみ参加となります。

Bot(tsubaki): お急ぎの方は３つほど簡単な質問に答えていただけると参加可能かわかります
User [avatar=none]:
- o: 質問に回答する
- x: ここでD2Dを終了する

Bot(tsubaki): あなたは現在、解決したい問題、変えたい性格はありますか？
User [avatar=none]:
- o: Yes
- x: No
Bot(tsubaki): 本当なこうなりたい！という未来がイメージできていますか？抽象的でもOKです
User [avatar=none]:
- o: Yes
- x: No
Bot(tsubaki): 新しい扉を開く、覚悟はありますか？
User [avatar=none]:
- o: Yes
- x: No

Bot(tsubaki): あなたの覚悟、理解できました。私から貴方を招待いたします。※応募が多数あり、枠が埋まっていた場合にはキャンセルとなります。ご了承ください
User [avatar=none]:
- o: 招待を受け、詳細を見る
- x: ここでやめる
