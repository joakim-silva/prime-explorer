from flask import (
    Flask,
    render_template,
    request,
    jsonify,
    Response
)

import csv
import io
import time


app = Flask(__name__)


# ============================================================
# PRIME ALGORITHMS
# ============================================================


# ---------- Check Whether One Number Is Prime ----------

def is_prime(number):

    if number < 2:
        return False

    if number == 2:
        return True

    if number % 2 == 0:
        return False


    divisor = 3


    while divisor * divisor <= number:

        if number % divisor == 0:
            return False

        divisor += 2


    return True


# ---------- Generate Prime Numbers ----------

def generate_primes(limit):

    # Start by assuming every number is prime.

    sieve = [True] * (limit + 1)


    # 0 and 1 are not prime.

    sieve[0] = False
    sieve[1] = False


    number = 2


    # Only process numbers up to the
    # square root of the limit.

    while number * number <= limit:

        if sieve[number]:

            # Mark multiples of the current
            # prime number as non-prime.
            #
            # We begin at number² because
            # smaller multiples have already
            # been processed.

            for multiple in range(
                number * number,
                limit + 1,
                number
            ):

                sieve[multiple] = False


        number += 1


    # ---------- Collect Prime Numbers ----------

    primes = []


    for number in range(
        2,
        limit + 1
    ):

        if sieve[number]:

            primes.append(number)


    return primes


# ============================================================
# WEBSITE
# ============================================================


# ---------- Homepage ----------

@app.route("/")
def home():

    return render_template(
        "index.html"
    )


# ============================================================
# PRIME GENERATOR API
# ============================================================


@app.route(
    "/api/primes",
    methods=["POST"]
)
def prime_generator():

    data = request.get_json()


    # ---------- Validate Request ----------

    if not data:

        return jsonify({
            "error":
                "No data was provided."
        }), 400


    try:

        limit = int(
            data.get("limit")
        )

    except (TypeError, ValueError):

        return jsonify({
            "error":
                "Please enter a valid integer."
        }), 400


    if limit < 2:

        return jsonify({
            "error":
                "The limit must be at least 2."
        }), 400


    if limit > 10_000_000:

        return jsonify({
            "error": (
                "Please enter a limit of "
                "10,000,000 or less."
            )
        }), 400


    # ---------- Generate Prime Numbers ----------

    start_time = time.perf_counter()


    primes = generate_primes(
        limit
    )


    end_time = time.perf_counter()


    calculation_time = (
        end_time - start_time
    )


    # ---------- Return JSON Results ----------

    return jsonify({

        "limit":
            limit,

        "count":
            len(primes),

        "largest":
            primes[-1],

        "calculation_time":
            round(
                calculation_time,
                6
            ),

        "primes":
            primes

    })


# ============================================================
# PRIME CHECKER API
# ============================================================


@app.route(
    "/api/check-prime",
    methods=["POST"]
)
def check_prime():

    data = request.get_json()


    # ---------- Validate Request ----------

    if not data:

        return jsonify({
            "error":
                "No data was provided."
        }), 400


    try:

        number = int(
            data.get("number")
        )

    except (TypeError, ValueError):

        return jsonify({
            "error":
                "Please enter a valid integer."
        }), 400


    if number < 0:

        return jsonify({
            "error": (
                "Please enter a "
                "non-negative integer."
            )
        }), 400


    # ---------- Check Number ----------

    prime = is_prime(
        number
    )


    # ---------- Return JSON Result ----------

    return jsonify({

        "number":
            number,

        "is_prime":
            prime

    })


# ============================================================
# CSV DOWNLOAD
# ============================================================


@app.route(
    "/api/primes/csv",
    methods=["GET"]
)
def download_primes_csv():

    # ---------- Validate Limit ----------

    try:

        limit = int(
            request.args.get(
                "limit",
                0
            )
        )

    except (TypeError, ValueError):

        return (
            "Invalid limit.",
            400
        )


    if limit < 2:

        return (
            "The limit must be at least 2.",
            400
        )


    if limit > 10_000_000:

        return (
            "The maximum limit is "
            "10,000,000.",
            400
        )


    # ---------- Generate Prime Numbers ----------

    primes = generate_primes(
        limit
    )


    # ---------- Create CSV in Memory ----------

    output = io.StringIO()


    writer = csv.writer(
        output
    )


    # ---------- CSV Header ----------

    writer.writerow([
        "index",
        "prime"
    ])


    # ---------- CSV Rows ----------

    for index, prime in enumerate(
        primes,
        start=1
    ):

        writer.writerow([
            index,
            prime
        ])


    # ---------- Prepare CSV ----------

    csv_data = output.getvalue()


    output.close()


    # ---------- Return Download ----------

    return Response(
        csv_data,

        mimetype="text/csv",

        headers={
            "Content-Disposition":
                (
                    "attachment; "
                    f"filename="
                    f"primes_up_to_{limit}.csv"
                )
        }
    )


# ============================================================
# RUN APPLICATION
# ============================================================


if __name__ == "__main__":

    app.run(
        debug=True
    )