---
userAvatar: /avatars/despair.png
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

Bot(tsubaki): こんにちは。今日は「絶望」という深い感情について話してみましょう。
Bot(tsubaki): 絶望猫を紹介します。世界が暗闇に見える時がある、そんな感情を持つ子です。

Bot(tsubaki): 猫の世界では、どんな感情も許されます。もちろん、絶望もOKです。
Bot(tsubaki): 絶望猫になったつもりで、会話してみましょう。

<!-- セット1 -->
Bot(other): 君がずっと頑張ってた企画…全部ボツになったんだって…

User:
- x: まぁ次があるよ
- x: そんなこともあるよね
- o: もう何もかも無駄だった…何のために頑張ってたんだろう

User[avatar]: /avatars/despair.png

Bot(other): そんなに頑張ってたのに…本当に辛かったよね…

Bot(teacher): 絶望を感じることを認められましたね。その気持ちを否定しなくて大丈夫です。

User[avatar=none]:
- o: 次へ

<!-- セット2 -->
Bot(other): 周りのみんなは幸せそうなのに…君だけ取り残されてる気がするって…

User:
- x: みんなも辛いことあるよ
- o: もう私だけが不幸で…何をやってもうまくいかない
- x: 気にしすぎだよ

User[avatar]: /avatars/despair.png

Bot(other): そう感じてたんだね…一人で抱えてたんだ…

Bot(teacher): その深い絶望感を表現できましたね。もっと表現していいんですよ。

User[avatar=none]:
- o: 次へ

<!-- セット3 -->
Bot(other): 何度も何度も挑戦して…全部失敗したんだよね…

User:
- x: また挑戦すればいいよ
- o: もう疲れた…何をやっても意味がない気がする
- x: 失敗は成功のもとだよ

User[avatar]: /avatars/despair.png

Bot(other): ずっと頑張ってきたのに…本当に疲れたよね…

Bot(teacher): 疲れ果てた絶望を言葉にできましたね。その感情はとても自然なものです。もっと深く表現していいんです。

User[avatar=none]:
- o: 次へ

<!-- セット4 -->
Bot(other): 大切な人たちが…みんな離れていっちゃったんだって…

User:
- x: また新しい出会いがあるよ
- x: 仕方ないことだよ
- o: もう誰も私のそばにいない…このまま一人で消えていくのかな

User[avatar]: /avatars/despair.png

Bot(other): 孤独で…何も希望が見えないよね…

Bot(teacher): 最も深い絶望を表現できましたね。その闇を認めることが、光への第一歩です。どんどん表現していいんですよ。

User[avatar=none]:
- o: 次へ

<!-- セット5 -->
Bot(other): 明日が来るのが…怖いって言ってたね…

User:
- x: きっと明日は良い日だよ
- o: 未来に何の希望も見えない…このまま時間が止まればいいのに
- x: 寝れば気が楽になるよ

User[avatar]: /avatars/despair.png

Bot(other): そんなに深い絶望の中にいたんだね…一人で抱えてたんだ…

Bot(teacher): あなたは勇気を持って、最も深い絶望を表現しました。

Bot(tsubaki): 今日は深い絶望と向き合いましたね。
Bot(tsubaki): この闇を認めたことが、本当の自分に出会う旅の始まりです。
Bot(tsubaki): よく、ここまで来ましたね。また明日お会いしましょう。

Bot(tsubaki)[button]: 次へ進む | /stageup?nextStage=2
