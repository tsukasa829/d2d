---
userAvatar: /avatars/anxiety.png
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
Bot(tsubaki): Day6へようこそ。今日は「恐れ」と「不安」について話してみましょう。

Bot(tsubaki): 不安は、未来への警告アラームです。あなたを守ろうとする大切な機能なんですよ。

User [avatar=none]:
- o: そうなんだ

Bot(tsubaki): それでは、不安猫を紹介します。

<!-- プロフィール紹介 -->
Bot(tsubaki)[image]: /avatars/anxiety.png

Bot(tsubaki): この子は不安猫。いつも何かが心配でドキドキしている子です。猫の世界では、どんな感情も許されます。もちろん、不安もOKです。不安猫になったつもりで、会話してみましょう!

User [avatar=none]:
- o: OK！

Bot(tsubaki): これから相手役の猫が未来のことや心配事を言ってきます。強がらずに、不安な気持ちを素直に表現してみてください。

User [avatar=none]:
- o: はじめる

<!-- セット1 -->
Bot(other): 明日の発表会、失敗したらどうする？みんな見てるよ。

User:
- x: 失敗なんてしないよ
- x: なんとかなるでしょ
- o: 失敗したらどうしよう…笑われるのが怖いよ

Bot(other): 怖いよね…プレッシャーだよね…

Bot(teacher): 失敗への恐怖を認められましたね。怖がることは弱さではありません。準備をするためのエネルギーになります。

User [avatar=none]:
- o: 次へ

<!-- セット2 -->
Bot(other): もし病気になったらどうする？誰も看病してくれないかもよ。

User:
- x: 健康だから大丈夫
- o: もし動けなくなったら…一人で苦しむのは怖いよ
- x: 病院行けばいいだけだよ

Bot(other): 一人で苦しむのは怖いよね…

Bot(teacher): 健康への不安、孤独への恐怖を言葉にできましたね。その不安は、自分を大切にしたいという気持ちの裏返しです。

User [avatar=none]:
- o: 次へ

<!-- セット3 -->
Bot(other): このまま将来、お金がなくなったらどうやって生きていくの？

User:
- x: お金なんてなんとかなるよ
- x: 働けばいいじゃん
- o: 生活できなくなったらどうしよう…路頭に迷うのが怖いよ

Bot(other): 生活できなくなるのは怖いよね…心配だよね…

Bot(teacher): 生存に関わる根源的な恐怖を表現できましたね。とても勇気がいることです。もっと怖がってもいいんですよ。

User [avatar=none]:
- o: 次へ

<!-- セット4 -->
Bot(other): 君のこと、みんなが嫌ってるかもしれないよ。

User:
- x: みんな僕のこと好きだよ
- x: 嫌われても平気だよ
- o: 嫌われたらどうしよう…居場所がなくなるのが怖い

Bot(other): 居場所がなくなるのは怖いよね…

Bot(teacher): 拒絶される恐怖、居場所を失う不安を認められましたね。それは群れで生きる猫として、とても自然な感情です。

User [avatar=none]:
- o: 次へ

<!-- セット5 -->
Bot(other): 結局、君は何をしても無駄なんじゃない？

User:
- x: 無駄じゃないよ
- x: やってみなきゃわからないよ
- o: 努力が報われないのが怖い…意味がないならやりたくないよ

Bot(other): 意味がないのは怖いよね…

Bot(teacher): 無意味さへの恐怖を表現できましたね。不安の正体を知ることで、あなたは少しずつ強くなっています。

Bot(tsubaki): 今日はたくさんの「恐れ」の正体を見つめることができましたね。
Bot(tsubaki): 不安は消そうとしなくていいんです。「ああ、私は今怖がっているんだな」と気づくだけで、心は少し軽くなります。
Bot(tsubaki): また明日、お会いしましょう。

Bot(tsubaki)[button]: 次へ進む | /stageup?nextStage=7
