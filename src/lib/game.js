import { empty } from "./helpers";
import question from "./question";
import { score } from "./highscore";

// todo vísa í rétta hluti með import

// allar breytur hér eru aðeins sýnilegar innan þessa módúl

let startButton; // takki sem byrjar leik
let problemEl; // element sem heldur utan um verkefni, sjá index.html
let result; // element sem heldur utan um niðurstöðu, sjá index.html

let playTime; // hversu lengi á að spila? Sent inn gegnum init()
let total = 0; // fjöldi spurninga í núverandi leik
let correct = 0; // fjöldi réttra svara í núverandi leik
let currentProblem; // spurning sem er verið að sýna


/**
 * Klárar leik. Birtir result og felur problem. Reiknar stig og birtir í result.
 */
function finish() {
  const points = score(total, correct, playTime);
  const text = `Þú svaraðir ${correct} rétt af ${total} spurningum og fékkst ${points} stig fyrir. Skráðu þig á stigatöfluna!`;

  result.querySelector('.result__text').appendChild(document.createTextNode(text));
  problemEl.classList.add('problem--hidden');
  result.classList.remove('result--hidden');
}


/**
 * Keyrir áfram leikinn. Telur niður eftir því hve langur leikur er og þegar
 * tími er búinn kallar í finish().
 *
 * Í staðinn fyrir að nota setInterval köllum við í setTimeout á sekúndu fresti.
 * Þurfum þá ekki að halda utan um id á intervali og skilum falli sem lokar
 * yfir fjölda sekúnda sem eftir er.
 *
 * @param {number} current Sekúndur eftir
 */
function tick(current) {
  empty(problemEl.querySelector('.problem__timer'));
  problemEl.querySelector('.problem__timer').appendChild(document.createTextNode(current));
  if (current <= 0) {
    return finish();
  }
  return () => {
    setTimeout(tick(current - 1), 1000);
  };
}

/**
 * Býr til nýja spurningu og sýnir undir .problem__question
 */
function showQuestion() {
  currentProblem = question();

  empty(problemEl.querySelector('.problem__question'));
  const problemDiv = problemEl.querySelector('.problem__question');
  problemDiv.appendChild(document.createTextNode(currentProblem.problem));
}

/**
 * Byrjar leik
 *
 * - Felur startButton og sýnir problem
 * - Núllstillir total og correct
 * - Kallar í fyrsta sinn í tick()
 * - Sýnir fyrstu spurningu
 */
function start() {
  startButton.classList.add('button--hidden');
  total = 0;
  correct = 0;
  setTimeout(tick(playTime), 1000);
  problemEl.classList.remove('problem--hidden');
  problemEl.querySelector('.problem__input').focus();
  showQuestion();
}

/**
 * Event handler fyrir það þegar spurningu er svarað. Athugar hvort svar sé
 * rétt, hreinsar input og birtir nýja spurningu.
 *
 * @param {object} e Event þegar spurningu svarað
 */
function onSubmit(e) {
  e.preventDefault();

  const input = problemEl.querySelector('.problem__input').value;

  const intInput = parseInt(input, 10);

  if (intInput === currentProblem.answer) {
    correct += 1;
  }

  total += 1;

  problemEl.querySelector('.problem__input').value = '';
  problemEl.querySelector('.problem__input').focus();
  showQuestion();
}

/**
 * Event handler fyrir þegar stig eru skráð eftir leik.
 *
 * @param {*} e Event þegar stig eru skráð
 */
function onSubmitScore(e) {
  e.preventDefault();
  problemEl.querySelector('.problem__input').value = '';
  //save(result.querySelector('.result__input').value, score(total, correct, playTime));

  empty(result.querySelector('.result__text'));
  result.querySelector('.result__input').value = '';

  result.classList.add('result--hidden');
  problemEl.classList.add('problem--hidden');
  startButton.classList.remove('button--hidden');
}

/**
 * Finnur öll element DOM og setur upp event handlers.
 *
 * @param {number} _playTime Fjöldi sekúnda sem hver leikur er
 */
export default function init(_playTime) {
  playTime = _playTime;

  startButton = document.querySelector('.start');
  problemEl = document.querySelector('.problem');
  result = document.querySelector('.result');

  problemEl.querySelector('.problem__answer').addEventListener('submit', onSubmit);

  result.querySelector('.result__form').addEventListener('submit', onSubmitScore);

  startButton.addEventListener('click', start);

  // todo útfæra
}
