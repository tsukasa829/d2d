---
userAvatar: /avatars/shame.png
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
Bot(tsubaki): Day5へようこそ。今日は「恥」について話してみましょう。

Bot(tsubaki): 恥ずかしさは、自分を良く見せたいという願いの裏返しです。隠さなくて大丈夫ですよ。

User [avatar=none]:
- o: わかった

Bot(tsubaki): それでは、恥猫を紹介します。

<!-- プロフィール紹介 -->
Bot(tsubaki)[image]: /avatars/shame.png

Bot(tsubaki): この子は恥猫。失敗や欠点を隠したくて、いつも顔を赤くしている子です。猫の世界では、どんな感情も許されます。もちろん、恥もOKです。恥猫になったつもりで、会話してみましょう!

User [avatar=none]:
- o: OK！

Bot(tsubaki): これから相手役の猫があなたの失敗や欠点について話しかけます。隠そうとせずに、恥ずかしい気持ちを素直に認めてみてください。

User [avatar=none]:
- o: はじめる

<!-- セット1 -->
Bot(other): さっき転んだところ、みんなに見られてたよ。

User:
- x: わざとだよ
- x: 誰も見てないよ
- o: うわぁ…見られてたなんて恥ずかしい…穴があったら入りたいよ

Bot(other): 恥ずかしいよね…でも大丈夫だよ。

Bot(teacher): 失敗を見られる恥ずかしさを素直に認められましたね。完璧じゃなくていいんです。

User [avatar=none]:
- o: 次へ

<!-- セット2 -->
Bot(other): 君、漢字も読めないの？これくらい常識だよ。

User:
- x: 読めるし！
- o: 知らなくて恥ずかしい…バカだと思われたかな…
- x: 難しい字だから仕方ないよ

Bot(other): 知らないことは恥ずかしいことじゃないよ…言い過ぎてごめん。

Bot(teacher): 無知を認める恥ずかしさを表現できましたね。知らないと言える勇気は、知性への第一歩です。

User [avatar=none]:
- o: 次へ

<!-- セット3 -->
Bot(other): 昔の君の写真見たよ。なんかダサかったね。

User:
- x: 今はオシャレだよ
- x: あれはあれでいいんだよ
- o: 変な格好で恥ずかしい…見ないでほしいよ

Bot(other): 恥ずかしかったんだね…勝手に見てごめん。

Bot(teacher): 過去の自分を恥じる気持ちを認められましたね。それはあなたが成長した証拠でもあります。

User [avatar=none]:
- o: 次へ

<!-- セット4 -->
Bot(other): 君、また同じミスしたの？何度目？

User:
- x: 次は気をつけるよ
- o: 何度も間違えて情けない…自分が嫌になるよ
- x: 教える方が悪いんだよ

Bot(other): 情けないなんてことないよ…誰でもミスはするよ。

Bot(teacher): 自分の至らなさを恥じる気持ちを言葉にできましたね。その痛みは、より良くなりたいという向上心の現れです。

User [avatar=none]:
- o: 次へ

<!-- セット5 -->
Bot(other): 君の秘密、知ってるよ。みんなには隠してるんでしょ？

User:
- x: 秘密なんてないよ
- x: バラしたら許さないよ
- o: 知られたくない…バレたらみんなに嫌われるかも…怖いし恥ずかしい

Bot(other): 隠したかったんだね…誰にも言わないから安心して。

Bot(teacher): 隠していた自分をさらけ出す恥ずかしさと恐怖を乗り越えましたね。素晴らしい勇気です。

Bot(tsubaki): 今日は隠しておきたかった「恥」を、日の光の下に出すことができましたね。
Bot(tsubaki): 恥ずかしい自分も、あなたの一部です。許してあげましょう。
Bot(tsubaki): また明日、お会いしましょう。

Bot(tsubaki)[button]: 次へ進む | /stageup?nextStage=6