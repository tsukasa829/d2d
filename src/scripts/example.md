---
userAvatar: /avatars/user.svg
defaultBot: guide
bots:
  guide:
    displayName: ガイド
    avatar: /avatars/guide.svg
  sales:
    displayName: セールス
    avatar: /avatars/sales.svg
---

Bot(guide): こんにちは！あなたの名前は？

User:
- 太郎
- 花子

Bot(guide): {{answer}}さん、よろしくお願いします！

Bot(sales)[image]: /images/banner.svg

Bot(sales): こちらは商品画像です。詳細をご確認ください。

Bot(sales)[image]: /images/sample2.svg

User:
- 太郎
- 花子

Bot(guide)[button]: 詳細ページへ | /products/detail

Bot(sales): 他の商品もチェックしてみませんか？

User:
- 太郎
- 花子

Bot(sales)[buttons]:
- 商品A | /products/a
- 商品B | /products/b
- 商品C | /products/c

Bot: 以上です。またのご利用をお待ちしております！
