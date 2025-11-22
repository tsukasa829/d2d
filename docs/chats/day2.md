---
userAvatar: /avatars/angry.png
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

Bot(tsubaki): こんにちは。今日は「怒り」と向き合う日です。

Bot(tsubaki): 怒りは悪い感情ではありません。自分の大切なものを守るための、とても自然な反応です。

User [avatar=none]:
- o:次へ

Bot(tsubaki): 今日は怒り猫のアカネになりきって、会話してみましょう。

Bot(tsubaki)[image]: /avatars/angry.png

Bot(tsubaki): この子は怒り猫のアカネ。怒るのが得意な子です。猫の世界では、どんな感情も許されます。アカネになったつもりで、会話してみましょう！

<!-- セット1 -->
Bot(other): さっき約束してた遊びの時間、すっかり忘れてたよ…ごめん…

User:
- x: まぁいいよ、別に
- x: 忙しかったんでしょ
- o: 約束したのに！すごく腹が立った

Bot(other): 本当にごめん…待たせちゃったね…

Bot(teacher): 怒りの感情を認めることができましたね。怒ってもいいんですよ。

User [avatar=none]:
- o: 次へ

<!-- セット2 -->
Bot(other): あ、君が大事にしてた場所に、勝手に僕の物置いちゃった…

User:
- x: 別に気にしてないよ
- o: 勝手に使わないでほしい！ムカつく
- x: 使っていいよ

Bot(other): ごめん…気づかなかったよ…

Bot(teacher): 自分の境界線を守る怒りを表現できましたね。素晴らしいです。もっと怒ってもいいんですよ。

User [avatar=none]:
- o: 次へ

<!-- セット3 -->
Bot(other): 君が一生懸命作った作品、僕が間違えて捨てちゃったみたい…

User:
- x: まぁ、また作ればいいよ
- x: 仕方ないね
- o: 何日もかけて作ったのに！許せない

Bot(other): 本当にごめん…取り返しがつかないことをしてしまった…

Bot(teacher): 努力を無駄にされた怒りは正当です。どんどん表現していいんです。

User [avatar=none]:
- o: 次へ

<!-- セット4 -->
Bot(other): 君の話、途中で遮って自分の話ばっかりしちゃった…

User:
- x: 別に聞いてほしくなかったから
- o: 話を聞いてくれなくて、イライラした
- x: 大丈夫だよ

Bot(other): ごめん…君の話をちゃんと聞くべきだった…

Bot(teacher): 自分の時間を大切にする怒りを表現できましたね。その怒りは大切です。

User [avatar=none]:
- o: 次へ

<!-- セット5 -->
Bot(other): 君が頼んでたこと、すっかり忘れて他のことやっちゃった…

User:
- x: 自分でやればよかったね
- x: 別にいいよ
- o: 信じて頼んだのに！裏切られた気分

Bot(other): 本当にごめん…信頼を裏切ってしまったね…

Bot(teacher): 信頼を裏切られた怒りを表現できましたね。怒りは自分を守る大切な感情です。よく頑張りました。

User [avatar=none]:
- o: 次へ

Bot(teacher): 最後に、怒り猫アカネにお礼を言ってあげましょう

Bot(angry)[image]: /avatars/angry.png

User:
- o: 今日はありがとう
- x: 怒りなんてなくなればいいのに

Bot(angry): うん…終わっちゃうの悔しいけど
Bot(angry): きっとまた会えるよ
Bot(angry): これあげる
Bot(angry)[image]: /avatars/key.png

User:
- o: 受け取る

Bot(teacher): アカネからプレゼントをもらえました
Bot(teacher): これは特別な"ある猫"に会うための鍵です。あなたもいつか会える日が来るかもしれません。
Bot(teacher): 明日は不安猫をご紹介します。優しい子ですよ。きっと仲良くなれます。



Bot(tsubaki): お疲れ様でした。これでD2D体験プログラムは終了となります。猫の世界での体験はジワジワとあなたの現実を変えていきます。あなたの人生が素晴らしいものになることを祈っています。

User [avatar=none]:
- o: Day3を続ける
- x: ここでD2Dを終了する

Bot(tsubaki): 申し訳ありません。D2Dは医師、経営者向けに作られたシステムでして、個人向けには公開されておりません。

Bot(tsubaki): ただしDay3の希望者が多かったため、募集枠を絞って使っていただいております。３日目のにつきましてはサーバ代実費500円でご利用いただけます。

User [payment]:
- o: google
- o: apple
- o: credit
