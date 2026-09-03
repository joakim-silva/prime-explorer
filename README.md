# Prime Explorer

Prime Explorer is a full-stack web application for generating, exploring, checking and exporting prime numbers.

The application uses Python and Flask for mathematical processing and API endpoints, with JavaScript providing an interactive browser interface.

Prime numbers are generated using the **Sieve of Eratosthenes**, while individual numbers can be tested using a separate primality-checking algorithm.

## Features

- Generate all prime numbers up to a specified limit
- Generate primes up to 10,000,000
- Display the number of primes found
- Display the largest prime found
- Measure calculation time
- Preview the first 1,000 generated primes in the browser
- Check whether an individual integer is prime
- Export the complete generated prime list as a CSV file
- Client-side and server-side input validation
- Loading states during calculations
- Responsive interface for desktop and mobile devices

## Technologies

- Python
- Flask
- JavaScript
- HTML5
- CSS3

## Prime Generation

Prime Explorer uses the **Sieve of Eratosthenes** to efficiently generate all prime numbers up to a specified limit.

Instead of checking every number individually, the algorithm begins by assuming that numbers are prime and progressively eliminates multiples of known primes.

For example, when processing the number `2`, multiples such as:

```text
4, 6, 8, 10, 12, ...
```

are marked as non-prime.

The process continues with the next remaining prime numbers until the required range has been processed.

The implementation begins eliminating multiples at:

```text
number²
```

because smaller multiples have already been handled by previous primes.

## Prime Checker

The individual prime checker uses a different algorithm.

After handling small numbers and eliminating even numbers, it tests only odd divisors while:

```text
divisor² <= number
```

This means it is only necessary to search for factors up to the square root of the number.

## API Endpoints

### Generate Primes

```http
POST /api/primes
```

Example request:

```json
{
    "limit": 1000
}
```

Example response:

```json
{
    "limit": 1000,
    "count": 168,
    "largest": 997,
    "calculation_time": 0.000447,
    "primes": [
        2,
        3,
        5,
        7,
        11
    ]
}
```

The `primes` array in the real response contains the complete generated prime list.

### Check a Number

```http
POST /api/check-prime
```

Example request:

```json
{
    "number": 97
}
```

Example response:

```json
{
    "number": 97,
    "is_prime": true
}
```

### Export CSV

```http
GET /api/primes/csv?limit=1000
```

The endpoint generates the complete prime list and returns it as a downloadable CSV file.

Example:

```csv
index,prime
1,2
2,3
3,5
4,7
5,11
```

## Project Structure

```text
prime-explorer/
├── app.py
├── README.md
├── requirements.txt
├── .gitignore
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

## Running Locally

Clone the repository:

```bash
git clone <repository-url>
cd prime-explorer
```

Create a virtual environment:

```bash
python3 -m venv venv
```

Activate it on macOS or Linux:

```bash
source venv/bin/activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

Run the application:

```bash
python app.py
```

Then open:

```text
http://127.0.0.1:5000
```

in your browser.

## CSV Export

CSV files are generated in memory using Python's `io.StringIO` and `csv` modules.

Prime Explorer therefore does not need to permanently create CSV files on the server before sending them to the browser.

The downloaded file contains two columns:

```text
index
prime
```

For example:

```csv
index,prime
1,2
2,3
3,5
4,7
5,11
```

## Input Validation

Prime Explorer validates input at multiple levels.

The HTML interface provides basic constraints such as minimum values, maximum values and integer steps.

JavaScript performs additional client-side validation to provide immediate feedback.

The Flask backend independently validates requests because API endpoints cannot rely on browser-side validation.

The current maximum generation limit is:

```text
10,000,000
```

## Browser Performance

For large calculations, the application displays only the first **1,000 prime numbers** in the browser.

The complete generated list remains available through CSV export.

This prevents extremely large result sets from unnecessarily filling the page while still allowing the complete data to be downloaded.

## What I Learned

Building Prime Explorer involved working with:

- Mathematical algorithms in Python
- The Sieve of Eratosthenes
- Algorithmic optimisation
- Flask routing
- JSON APIs
- HTTP GET and POST requests
- Asynchronous JavaScript using `fetch()`
- DOM manipulation
- Client-side and server-side validation
- Dynamic loading states
- In-memory CSV generation
- File downloads through HTTP responses
- Responsive interface design
- Separation of frontend and backend responsibilities

## Future Improvements

Possible future additions include:

- Prime-number calculation history
- SQLite database integration
- Additional prime-number statistics
- Prime gap analysis
- Prime factorisation
- Visualisation of prime-number distributions
- Improved handling of extremely large ranges
- More advanced algorithms for large prime calculations

## Author

**Joakim Silva**

Software development portfolio:

https://joakim-silva.github.io/

GitHub:

https://github.com/joakim-silva

## License

This project is intended as a software development and educational portfolio project.