const readline = require('readline');

//налаштування інтерфейсу для читання з консолі
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//функція для отримання вводу від користувача
function promptUser(query) {
    return new Promise(resolve => {
        rl.question(query, answer => {
            resolve(answer);
        });
    });
}


const words = [
    "яблуко",
    "машина",
    "кіт",
    "собака",
    "дерево",
    "будинок",
    "рука",
    "носа",
    "сонце",
    "море",
    "гора",
    "книга",
    "вікно",
    "місто",
    "друг",
    "школа",
    "стіл",
    "стілець",
    "річка",
];


function getRandomWord() {
    const index = Math.floor(Math.random() * words.length);
    return words[index];
}

function revealTwoLetters(word, displayed) {
    let uniqueIndices = [];
    while (uniqueIndices.length < 2 && uniqueIndices.length < word.length) {
        let randIndex = Math.floor(Math.random() * word.length);
        if (!uniqueIndices.includes(randIndex)) {
            uniqueIndices.push(randIndex);
            displayed[randIndex] = word[randIndex];
        }
    }
}


const selectedWord = getRandomWord();
let displayedWord = selectedWord.split('').map(() => '_');
revealTwoLetters(selectedWord, displayedWord);


async function playGame() {
    //запит про кількість спроб
    let livesInput = await promptUser("Введіть кількість життів (наприклад, 5): ");
    let lives = parseInt(livesInput);
    if (isNaN(lives) || lives <= 0) {
        console.log("Некоректне число життів. Встановлено за замовчуванням: 5");
        lives = 5;
    }

    let guessedLetters = [];

    while (lives > 0) {
        //поточний стан слова
        console.log(`\nСлово: ${displayedWord.join(' ')}\nЖиттів залишилось: ${lives}`);

        let guess = await promptUser("Введіть одну літеру для відгадування: ");
        guess = guess.toLowerCase();

        //перевірка літери
        if (!guess || guess.length !== 1) {
            console.log("- - - - - - - - - - - - - - - - - - - - -\nБудь ласка, введіть одну літеру.");
            continue;
        }

        if (guessedLetters.includes(guess)) {
            console.log("- - - - - - - - - - - - - - - - - - - - -\nВи вже відгадували цю літеру. Спробуйте іншу.");
            continue;
        }

        guessedLetters.push(guess);

        //чи є літера в слові
        if (selectedWord.includes(guess)) {
            for (let i = 0; i < selectedWord.length; i++) {
                if (selectedWord[i] === guess) {
                    displayedWord[i] = guess;
                }
            }

            //перевірка перемоги
            if (!displayedWord.includes('_')) {
                console.log(`\n- - - - - - - - - - - - - - - - - - - - -\nПеремога! Ви відгадали слово: ${selectedWord}`);
                await promptUser("Натисніть Enter, щоб завершити гру...");
                rl.close();
                return;
            } else {
                console.log(`\n- - - - - - - - - - - - - - - - - - - - -\nВітаю! Ви відгадали літеру "${guess}".`);
            }
        } else {
            lives--;
            console.log(`\n- - - - - - - - - - - - - - - - - - - - -\nНевірно! Літера "${guess}" відсутня в слові.`);
        }
    }

    console.log(`\n- - - - - - - - - - - - - - - - - - - - -\nВи програли! Слово було: ${selectedWord}`);
    await promptUser("Натисніть Enter, щоб завершити гру...");
    rl.close();
}

playGame();
