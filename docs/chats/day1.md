---
userAvatar: /avatars/sad.png
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
---

<!-- プロフィール紹介 -->
Bot(teacher): ![悲しみ猫](/avatars/sad.png)

Bot(teacher): この子は悲しみ猫。悲しむのが大好きな子です。猫の世界では、どんな感情も許されます。もちろん、悲しみもOKです。悲しみ猫になったつもりで、会話してみましょう!

<!-- セット1 -->
Bot(other): さっきの集合写真、君が写ってなかった…ごめん…

User:
- x: まぁどうせ写り悪い
- x: 気にしてない
- o: みんなと写りたかったから…悲しかった

Bot(other): そんな思いをさせてた…ごめん…

Bot(teacher): 悲しい気持ちを否定しないのはとても大事ですね。よく言えましたね。

<!-- セット2 -->
Bot(other): 大事にしてたおもちゃ…壊れちゃった…

User:
- x: そんなのいらない
- o: 壊れてショックだ…大事だったのに
- x: 新しいの買えばいい

Bot(other): 大切だったからこそ悲しいんだね…

Bot(teacher): 失った悲しみを大事に扱えるのは素晴らしいですね。もっと悲しんでもいいんですよ。


<!-- セット3 -->
Bot(other): 一緒に作ったケーキ、こっそり誰かが食べちゃったみたい…

User:
- o: 楽しみにしてたのに…悲しい
- x: どうせ美味しくなかった
- x: 誰でもいい

Bot(other): 楽しみにしてたんだね…本当にごめん…

Bot(teacher): 期待してた分だけ悲しむのは自然ですね。どんどん表現していいんです。


<!-- セット4 -->
Bot(other): メッセージ返そうと思って寝落ちしちゃった…返事できなくてごめん…

User:
- o: 返事がなくて寂しかった
- x: 気にしてない
- x: むしろ静かでよかった

Bot(other): 寂しい思いさせたね…ほんとにごめん…

Bot(teacher): 寂しさを認めるのは、とっても大切な心のケアですね。もっと悲しんでいいんです。

<!-- セット5 -->
Bot(other): 君の誕生日、みんな忘れてたみたいで…お祝いできなかった…

User:
- x: 別に誕生日なんてどうでもいい
- x: 自分で祝えるから大丈夫
- o: 覚えててほしかった…悲しい

Bot(other): 大事な日を忘れてた…本当にごめん…

Bot(teacher): 大切にされたい気持ちを表現できましたね。悲しみは悪いことじゃありません。もっともっと悲しんでいいんです。君は自分の気持ちを大切にできました。

Bot(teacher)[button]: 次へ進む | /stageup?nextStage=2
