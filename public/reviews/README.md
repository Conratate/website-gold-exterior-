# Review photos

Job photos that appear on the site live here. Drop a file in this folder, then
point a review at it from `lib/reviews.js`:

```js
{
  id: "sarah-m-2026-07-ab12",
  name: "Sarah M.",
  // …
  photos: {
    before: "/reviews/sarah-m-before.jpg",
    after:  "/reviews/sarah-m-after.jpg",
    alt:    "Concrete driveway, oil-stained then cleaned",
  },
}
```

Both halves are optional. A review with `before` **and** `after` shows up in
the Transformations strip on the reviews page; one on its own just appears on
that review's card.

Two rules worth keeping:

- **Only put photos here that you chose to publish.** A photo a customer
  attaches to their review is emailed to you and goes no further — publishing
  it is a deliberate step, same as publishing the words.
- **Resize before you commit.** Around 1600px on the long edge and under
  ~400KB keeps the page fast. Anything straight off a phone is far too big.
