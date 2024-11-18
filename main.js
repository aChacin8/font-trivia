const form = document.querySelector("#form-triv");
const categoryTrv = document.querySelector("#select-cat");
const difficultyTrv = document.querySelector("#select-dif");
const typeTrv = document.querySelector("#select-type");
const questionsTrv = document.querySelector("#questions-div");
const apiCategory = "https://opentdb.com/api_category.php";
const apiGeneral = "https://opentdb.com/api.php";

let arrayTrivia = [];

document.addEventListener("DOMContentLoaded", () => {
    fetch(apiCategory)
        .then((response) => response.json())
        .then((data) => {
            data.trivia_categories.forEach((category) => {
                const option = document.createElement("option");
                option.value = category.id;
                option.textContent = category.name;
                categoryTrv.appendChild(option);
            });
        })
        .catch((error) => console.error(`Error: ${error}`));

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const category = categoryTrv.value;
        const difficulty = difficultyTrv.value;
        const type = typeTrv.value;

        fetchTrv(category, difficulty, type);
    });
});

const fetchTrv = (category, difficulty, type) => {
    const urlApi = `${apiGeneral}?amount=10&category=${category}&difficulty=${difficulty}&type=${type}&lang=es`;

    fetch(urlApi)
        .then((response) => response.json())
        .then((data) => {
            arrayTrivia = data.results;
            displayTrv();
        })
        .catch((error) => console.error(`Error al cargar la trivia: ${error}`));
};

const displayTrv = () => {
    questionsTrv.innerHTML = "";

    arrayTrivia.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        questionDiv.innerHTML = `
                    <p>${index + 1}. ${question.question}</p>
                `;

        const answers = [...question.incorrect_answers, question.correct_answer].sort(
            () => Math.random() - 0.5
        );

        const answerDiv = document.createElement('div');
        answerDiv.classList.add('answers');

        answers.forEach((answer) => {
            const answerOption = document.createElement('label');
            answerOption.innerHTML = `
                        <input type="radio" name="question-${index}" value="${answer}">
                        ${answer}
                    `;
            answerDiv.appendChild(answerOption);
        });

        questionDiv.appendChild(answerDiv);
        questionsTrv.appendChild(questionDiv);
    });

    triviaBtn();
};

const triviaBtn = () => {
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Enviar Respuestas";
    submitBtn.addEventListener("click", calculateScore);

    const returnBtn = document.createElement("button");
    returnBtn.textContent = "Nueva Trivia";
    returnBtn.addEventListener("click", () => location.reload());

    questionsTrv.appendChild(submitBtn);
    questionsTrv.appendChild(returnBtn);
};

const calculateScore = () => {
    let score = 0;

    arrayTrivia.forEach((question, index) => {
        const selectedAnswer = document.querySelector(
            `input[name="question-${index}"]:checked`
        );

        if (selectedAnswer && selectedAnswer.value === question.correct_answer) {
            score += 100;
        }
    });

    alert(`Tu puntaje final es: ${score}/ 1000`);
};
