# DistRND.js
#### DistRND is a small PRNG (pseudorandom number generator) which also evenly distributes the random values over the given range.
## ■ Install
```html
<script type="text/javascript" src="DistRND.min.js"></script>
```
## ■ Use
```js
const rand = new DistRND(min, max);
rand.next();
```
## ■ Parameters
argument|data type|description|default|
---|---|---|---
`min`|`positive int`|Minimum value
`max`|`positive int`|Maximum value
`spread`|`positive int`|High `spread` will distribute numbers more randomly|`0`
>_**Note**: `next()` will behave more and more like `Math.random()` with increasing high `spread` value._
>
>_**Tip**: Start with `spread = 1` and increase slowly to see the effects._
## ■ Showcase
Let's assume we want to generate 10.000 random numbers between 1 and 10.
We will count the occurrence of each number for demonstrating purposes:
### Comparison:
```js
let data1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let data2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
for (let i = 0; i < 10000; i++) {
    data1[Math.floor(Math.random() * 10)]++;    //with Math.random()
    data2[rand.next()]++;                       //with DistRND.js
}
```
### Results:
##### data1 (sorted): `[934, 956, 957, 997, 1007, 1016, 1018, 1034, 1039, 1042]`
##### data2 (sorted): `[1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]`
As you can see the normal `Math.random()` function can vary quite a bit from the average due to the nature of randomness or at least pseudorandomness in JavaScript. In this case the deviation from `1000` was **~3%** on average and **~6.5%** maximum.
## ■ Speed
**DistRND.js can generate 1 Mio. random numbers between 1 and 1000 in less than 100 ms.**
## ■ Implementation
- Generate random number `x` from active scope
- Add 1 to occurrence of `x`
- If new occurrence of `x` is greater than the average: Drop `x` from active scope
- If average updates: Reevaluate active scope
## ■ FAQ
## • Is it still random?
>Yes. The numbers in the active scope are sill chosen at random with `Math.random()`.
## • Why manipulate randomness?
>Example 1: When you want to train a **Neural Network** you could use this to train it with random sample data but also ensure that it won't get overtrained.

>Example 2: When you have a **game** with **multiple players** you could use this to select random players but also ensure that every player gets the same amount of turns over the entire game.