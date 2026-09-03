// ==========================================================
// ELEMENTS
// ==========================================================


// ---------- Prime Generator ----------

const primeForm =
    document.querySelector("#prime-form");

const primeLimit =
    document.querySelector("#prime-limit");

const resultsSummary =
    document.querySelector("#results-summary");

const primeResults =
    document.querySelector("#prime-results");

const primeList =
    document.querySelector("#prime-list");

const limitStat =
    document.querySelector("#limit-stat");

const countStat =
    document.querySelector("#count-stat");

const largestStat =
    document.querySelector("#largest-stat");

const timeStat =
    document.querySelector("#time-stat");

const downloadButton =
    document.querySelector("#download-csv");

const generatorMessage =
    document.querySelector("#generator-message");

const generateButton =
    primeForm.querySelector(
        'button[type="submit"]'
    );


// ---------- Prime Checker ----------

const checkerForm =
    document.querySelector("#checker-form");

const checkerNumber =
    document.querySelector("#checker-number");

const checkerResult =
    document.querySelector("#checker-result");

const checkerMessage =
    document.querySelector("#checker-message");

const checkButton =
    checkerForm.querySelector(
        'button[type="submit"]'
    );


// ==========================================================
// MESSAGE HELPERS
// ==========================================================


function showMessage(
    element,
    text,
    type
) {

    element.textContent =
        text;

    element.className =
        `form-message ${type}`;

    element.hidden =
        false;

}


function clearMessage(
    element
) {

    element.textContent =
        "";

    element.className =
        "form-message";

    element.hidden =
        true;

}


// ==========================================================
// GENERATE PRIME NUMBERS
// ==========================================================


primeForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        clearMessage(
            generatorMessage
        );


        const limit =
            Number(
                primeLimit.value
            );


        // ---------- Validation ----------

        if (
            !Number.isInteger(limit) ||
            limit < 2
        ) {

            showMessage(
                generatorMessage,
                "Please enter an integer of 2 or greater.",
                "error"
            );

            return;

        }


        if (
            limit >
            10000000
        ) {

            showMessage(
                generatorMessage,
                "Please enter a limit of 10,000,000 or less.",
                "error"
            );

            return;

        }


        // ---------- Loading State ----------

        generateButton.disabled =
            true;

        generateButton.textContent =
            "Generating...";


        try {

            // ---------- Request ----------

            const response =
                await fetch(
                    "/api/primes",
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                limit: limit
                            })
                    }
                );


            const data =
                await response.json();


            // ---------- Server Error ----------

            if (!response.ok) {

                showMessage(
                    generatorMessage,
                    data.error ||
                        "Something went wrong.",
                    "error"
                );

                return;

            }


            // ---------- Statistics ----------

            limitStat.textContent =
                data.limit.toLocaleString();

            countStat.textContent =
                data.count.toLocaleString();

            largestStat.textContent =
                data.largest.toLocaleString();

            timeStat.textContent =
                `${data.calculation_time} s`;


            // ---------- Clear Previous Results ----------

            primeList.innerHTML =
                "";


            // ---------- Preview Limit ----------

            const previewLimit =
                1000;


            const primesToDisplay =
                data.primes.slice(
                    0,
                    previewLimit
                );


            // ---------- Display Prime Numbers ----------

            primesToDisplay.forEach(
                (
                    prime,
                    index
                ) => {

                    const primeElement =
                        document.createElement(
                            "span"
                        );


                    primeElement.textContent =
                        prime.toString();


                    if (
                        index <
                        primesToDisplay.length - 1
                    ) {

                        primeElement.textContent +=
                            ",";

                    }


                    primeList.appendChild(
                        primeElement
                    );

                }
            );


            // ---------- Large Result Notice ----------

            if (
                data.primes.length >
                previewLimit
            ) {

                const notice =
                    document.createElement(
                        "p"
                    );


                notice.className =
                    "results-notice";


                notice.textContent =
                    (
                        `Showing the first ` +
                        `${previewLimit.toLocaleString()} ` +
                        `of ${data.count.toLocaleString()} primes. ` +
                        `Download the CSV for the complete list.`
                    );


                primeList.appendChild(
                    notice
                );

            }


            // ---------- Show Results ----------

            resultsSummary.hidden =
                false;

            primeResults.hidden =
                false;


            showMessage(
                generatorMessage,
                (
                    `${data.count.toLocaleString()} ` +
                    `prime numbers generated successfully.`
                ),
                "success"
            );

        }

        catch (error) {

            console.error(
                error
            );


            showMessage(
                generatorMessage,
                (
                    "Unable to generate prime numbers. " +
                    "Please try again."
                ),
                "error"
            );

        }

        finally {

            // ---------- Restore Button ----------

            generateButton.disabled =
                false;

            generateButton.textContent =
                "Generate";

        }

    }
);


// ==========================================================
// DOWNLOAD CSV
// ==========================================================


downloadButton.addEventListener(
    "click",
    () => {

        clearMessage(
            generatorMessage
        );


        const limit =
            Number(
                primeLimit.value
            );


        // ---------- Validation ----------

        if (
            !Number.isInteger(limit) ||
            limit < 2
        ) {

            showMessage(
                generatorMessage,
                "Please enter a valid limit first.",
                "error"
            );

            return;

        }


        if (
            limit >
            10000000
        ) {

            showMessage(
                generatorMessage,
                "The maximum limit is 10,000,000.",
                "error"
            );

            return;

        }


        // ---------- CSV Request ----------

        window.location.href =
            `/api/primes/csv?limit=${limit}`;

    }
);


// ==========================================================
// PRIME CHECKER
// ==========================================================


checkerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        clearMessage(
            checkerMessage
        );


        checkerResult.hidden =
            true;


        const number =
            Number(
                checkerNumber.value
            );


        // ---------- Validation ----------

        if (
            !Number.isInteger(number) ||
            number < 0
        ) {

            showMessage(
                checkerMessage,
                (
                    "Please enter a valid " +
                    "non-negative integer."
                ),
                "error"
            );

            return;

        }


        // ---------- Loading State ----------

        checkButton.disabled =
            true;

        checkButton.textContent =
            "Checking...";


        try {

            // ---------- Request ----------

            const response =
                await fetch(
                    "/api/check-prime",
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({
                                number: number
                            })
                    }
                );


            const data =
                await response.json();


            // ---------- Server Error ----------

            if (!response.ok) {

                showMessage(
                    checkerMessage,
                    data.error ||
                        "Something went wrong.",
                    "error"
                );

                return;

            }


            // ---------- Display Result ----------

            if (
                data.is_prime
            ) {

                checkerResult.textContent =
                    (
                        `${data.number.toLocaleString()} ` +
                        `is a prime number.`
                    );


                checkerResult.className =
                    "checker-result prime";

            }

            else {

                checkerResult.textContent =
                    (
                        `${data.number.toLocaleString()} ` +
                        `is not a prime number.`
                    );


                checkerResult.className =
                    "checker-result not-prime";

            }


            checkerResult.hidden =
                false;

        }

        catch (error) {

            console.error(
                error
            );


            showMessage(
                checkerMessage,
                (
                    "Unable to check the number. " +
                    "Please try again."
                ),
                "error"
            );

        }

        finally {

            // ---------- Restore Button ----------

            checkButton.disabled =
                false;

            checkButton.textContent =
                "Check";

        }

    }
);