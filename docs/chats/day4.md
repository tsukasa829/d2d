---
userAvatar: /avatars/lonely.png
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
---

<!-- 挨拶とルール説明 -->
Bot(tsubaki): Day4へようこそ。今日は「孤独」について話してみましょう。

Bot(tsubaki): 孤独は、誰かと繋がりたいという心の叫びです。決して恥ずかしいことではありません。

User [avatar=none]:
- o: わかった

Bot(tsubaki): それでは、孤独猫を紹介します。

<!-- プロフィール紹介 -->
Bot(tsubaki)[image]: /avatars/lonely.png

Bot(tsubaki): この子は孤独猫。いつも一人ぼっちを感じている子です。猫の世界では、どんな感情も許されます。もちろん、孤独もOKです。孤独猫になったつもりで、会話してみましょう!

User [avatar=none]:
- o: OK！

Bot(tsubaki): これから相手役の猫が話しかけます。孤独猫になりきって、寂しい気持ちを素直に表現してみてください。

User [avatar=none]:
- o: はじめる

<!-- セット1 -->
Bot(other): みんなでパーティーしてるんだ。楽しそうでしょ？

User:
- x: 別に興味ないよ
- x: 楽しそうだね、よかったね
- o: いいなぁ…僕も混ぜてほしかったな…寂しいよ

Bot(other): ごめん…君も誘えばよかったね…

Bot(teacher): 仲間に入りたいという寂しさを素直に言えましたね。その気持ちを認めることが大切です。

User [avatar=none]:
- o: 次へ

<!-- セット2 -->
Bot(other): 休みの日はいつも何してるの？僕は友達と遊んでるけど。

User:
- x: 一人が好きなんだ
- o: 誰とも会わずに一人でいるよ…本当は誰かと話したいのに
- x: 忙しいから遊ぶ暇ないよ

Bot(other): そうだったんだ…話したいと思ってたんだね…

Bot(teacher): 誰かと繋がりたいという本音を表現できましたね。素晴らしいです。もっと寂しがってもいいんですよ。

User [avatar=none]:
- o: 次へ

<!-- セット3 -->
Bot(other): 君のこと、誰も気にしてないみたいだよ。

User:
- o: 誰も僕を見てくれない…透明人間になったみたいで悲しい
- x: 気にされなくて清々するよ
- x: そんなことないよ、人気者だよ

Bot(other): そんなふうに感じてたんだね…辛かったね…

Bot(teacher): 存在を認めてもらえない辛さを言葉にできましたね。その痛みは、あなたがここに存在している証拠です。

User [avatar=none]:
- o: 次へ

<!-- セット4 -->
Bot(other): 困ったことがあっても、助けてくれる人いないんでしょ？

User:
- x: 一人でなんとかできるよ
- x: 誰かに頼めばいいし
- o: うん…誰も助けてくれない…心細くて怖いよ

Bot(other): 心細かったんだね…気づかなくてごめん…

Bot(teacher): 助けを求められない心細さを表現できましたね。弱音を吐いてもいいんです。もっと甘えてもいいんですよ。

User [avatar=none]:
- o: 次へ

<!-- セット5 -->
Bot(other): ずっと一人で生きていくの？

User:
- x: 一人が気楽でいいよ
- x: そのうち誰か見つかるよ
- o: ずっと一人は嫌だ…誰かにそばにいてほしいよ

Bot(other): そばにいてほしいんだね…その気持ち、大事にしてね。

Bot(teacher): 誰かと共にありたいという願いを、勇気を持って言えましたね。孤独を感じる心は、愛を求めている美しい心です。

Bot(tsubaki): 今日は孤独という冷たい感情を、温かい言葉で抱きしめることができましたね。
Bot(tsubaki): あなたは一人じゃありません。自分の孤独を認めた時、世界との繋がりが始まります。
Bot(tsubaki): また明日、お会いしましょう。

Bot(tsubaki)[button]: 次へ進む | /stageup?nextStage=5
