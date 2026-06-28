Reckon — A Calculator Built with HTML, CSS & JavaScript

Reckon is a fully functional calculator web app built using vanilla **HTML**, **CSS**, and **JavaScript** — no frameworks, no libraries. It was built as part of an internship project to demonstrate core front-end development skills: DOM manipulation, event handling, and clean UI design.

Live Preview

Open `index.html` in any modern browser — no build step or server required.

Features

- **All core arithmetic operations** — addition (+), subtraction (−), multiplication (×), division (÷)
- **Real-time display** — see your expression and result update live as you type
- **Dual-line screen** — running expression on top, current result below (like a physical desk calculator)
- **Clear & backspace** — `AC` resets everything, `⌫` deletes the last digit
- **Percent key (%)** — quick percentage conversion
- **Chained calculations** — supports sequences like `5 + 3 + 2 =` computed left to right
- **Error handling** — divide-by-zero and invalid operations show a clear "Error" state instead of crashing
- **Floating-point correction** — fixes JavaScript's classic `0.1 + 0.2` rounding issue
- **Keyboard support** *(bonus)* — use number keys, `+ − * /`, `Enter`/`=`, `Backspace`, and `Esc` (clear) directly from your keyboard
- **Responsive design** — works smoothly on desktop and mobile screens
- **Accessible** — visible keyboard focus states and `aria-live` region for screen readers

Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (custom properties, Grid, Google Fonts) |
| Logic | Vanilla JavaScript (ES6) |

Project Structure

```
reckon-calculator/
├── index.html      # Markup and layout
├── style.css       # Styling, theme, and responsive design
├── script.js       # Calculator logic and event handling
└── README.md       # Project documentation
```

How It Works

1. Number and decimal buttons build up the current input.
2. Operator buttons (+, −, ×, ÷) store the pending operation and move the current input into the expression line.
3. Pressing `=` evaluates the full expression and displays the result.
4. `AC` resets the calculator to its initial state; `⌫` removes the last entered digit.
5. All button clicks and key presses run through the same internal logic, so behavior is consistent whether you use the mouse or the keyboard.

What I Learned

Building this project helped reinforce:
- Structuring an interactive UI with semantic HTML
- Managing application state in vanilla JavaScript without a framework
- Handling edge cases (divide by zero, floating-point precision, chained operations)
- Writing reusable functions for both click and keyboard input
- Designing a clean, intentional interface rather than a default-looking layout
