# Expense Tracker

A simple expense tracker built with **HTML, CSS and vanilla JavaScript**. Add your income and expenses, see your balance at a glance, and find any transaction using search, filters and sorting. All data is saved in your browser, so it is still there after a refresh.

## Features

- Add income and expense transactions with a description, amount and category
- Live summary of total balance, income and expense (in ₹)
- Search transactions by description
- Filter by type (income or expense) and by category
- Sort by latest, highest amount or lowest amount
- Delete a single transaction or clear all of them
- Data is saved in the browser with `localStorage`
- Responsive layout for mobile and desktop

## Tech Stack

| Part | Technology |
| --- | --- |
| Structure | HTML5 |
| Styling | CSS3 (Grid, Flexbox, media queries) |
| Logic | JavaScript (ES5+, DOM, localStorage) |

## Project Structure

```
expense-tracker/
├── index.html   # page structure
├── style.css    # styling
├── script.js    # app logic
└── README.md
```

## How to Run

1. Download or clone this repository.
2. Keep `index.html`, `style.css` and `script.js` in the same folder.
3. Open `index.html` in any modern browser.

No installation or build step is needed.

## How It Works

- Transactions are stored in an array of objects:
  ```js
  { id, description, amount, type, category }
  ```
- `id` is created with `Date.now()`, and it is also used to show the date of the transaction.
- Every change (add, delete, clear) saves the array to `localStorage` and redraws the page with `updateUI()`.
- The summary always shows totals for all transactions. The filters and search only change the list.
- The delete buttons use event delegation, so one click listener on the list handles all of them.

## Possible Improvements

- Edit an existing transaction
- Choose the date manually
- Monthly budget with a warning when it is crossed
- Charts for spending by category (for example with Chart.js)
- Export transactions to CSV
- Backend with Node.js, Express and MongoDB

## Author

Made as a practice project to learn DOM manipulation and `localStorage` in JavaScript.
