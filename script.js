const getComputerChoice = () => {
  	const computerNumber = Math.floor(Math.random() * 3);

  	switch(computerNumber) {
    	case 0:
    	  	return 'rock';
    	  	break;
    	case 1:
    	  	return 'paper';
    	  	break;
    	default:
    	  	return 'scissors';
    	  	break;
  	};
};

const getPlayerChoice = (event) => {
  let userChoice = event.target.value;

  return userChoice;
};

const determineWinner = (player, computer) => {
  	if (player === computer) {
  	  	return 'draw';
  	} else if (player === 'rock') {
  	  	if (computer === 'paper') {
  	    	return 'computer';
  	  	} else if (computer === 'scissors') {
  	    	return 'player';
  	  	} else {
  	    	return 'draw';
  	  	}
  	} else if (player === 'paper') {
    	if (computer === 'scissors') {
      		return 'computer';
    	} else if (computer === 'rock') {
      		return 'player';
    	} else {
      		return 'draw';
    	}
  	} else if (player === 'scissors') {
    	if (computer === 'rock') {
      		return 'computer';
    	} else if (computer === 'paper') {
      		return 'player';
    	} else {
      		return 'draw';
    	}
  	}
};

const playerButtons = document.querySelectorAll('.game-button');

let playerPoints = 0;
let computerPoints = 0;

const disableButtons = () => {
  // For each button set new attribute - "disabled".
  playerButtons.forEach(element => element.setAttribute('disabled', ''));
};

const enableButtons = () => {
  	// For each button, if it has "disabled" attribute, remove the "disabled" attribute.
  	playerButtons.forEach(element => element.removeAttribute('disabled'));
};

playerButtons.forEach(element => {
	element.addEventListener('click', function(event) {
		const playerChoice = getPlayerChoice(event);
      	const computerChoice = getComputerChoice();
		const playerHandElement = document.getElementById('player-hand');
		const computerHandElement = document.getElementById('computer-hand');
		const winner = determineWinner(playerChoice, computerChoice);
		
		disableButtons();
		backToEmptyHands(playerHandElement, computerHandElement);
		runWiggleHandsAnimation(playerHandElement, computerHandElement);
		
		playerHandElement.addEventListener('animationend', afterFirstAnimation = () => {
			cleanAfterWiggleAnimation(playerHandElement, computerHandElement);
			addChoicesToGame(playerHandElement, computerHandElement, playerChoice, computerChoice);
			runChoisesAnimation(playerHandElement, computerHandElement, playerChoice, computerChoice);
			playerHandElement.removeEventListener('animationend', afterFirstAnimation);

			playerHandElement.addEventListener('animationend', afterSecondAnimation = () => {
				cleanAfterChoisesAnimation(playerHandElement, computerHandElement);
				addEndTransform(playerHandElement, computerHandElement, playerChoice, computerChoice);
				updateScore(winner);
				runWinnerAnimation(playerHandElement, computerHandElement, winner);
				playerHandElement.removeEventListener('animationend', afterSecondAnimation);
				enableButtons();
			});
		});
	});
});

// First step - wiggle hands.

const runWiggleHandsAnimation = (playerHand, computerHand) => {
	playerHand.classList.add('player-hand-wiggle-anim');
	computerHand.classList.add('computer-hand-wiggle-anim');
};

const cleanAfterWiggleAnimation = (playerHand, computerHand) => {
	playerHand.classList.remove('player-hand-wiggle-anim');
	computerHand.classList.remove('computer-hand-wiggle-anim');
	removeStartTransforms(playerHand, computerHand);
};

const removeStartTransforms = (playerHand, computerHand) => {
	playerHand.classList.remove('player-hand-transform');
	computerHand.classList.remove('computer-hand-transform');
};

// Second step - show choices/shapes.

const addChoicesToGame = (playerHand, computerHand, playerShape, computerShape) => {
	if (playerShape === 'rock') {
		playerHand.innerHTML = '&#x270A;';
	} else if (playerShape === 'paper') {
		playerHand.innerHTML = '&#x270B;';
	} else { // Scissors.
		playerHand.innerHTML = '&#x1F91E;';
	}

	if (computerShape === 'rock') {
		computerHand.innerHTML = '&#x270A;';
	} else if (computerShape === 'paper') {
		computerHand.innerHTML = '&#x270B;';
	} else { // Scissors.
		computerHand.innerHTML = '&#x1F91E;';
	}
};

const runChoisesAnimation = (playerHand, computerHand, playerShape, computerShape) => {
	if (playerShape === 'scissors') {
		playerHand.classList.add('player-shape-scissors-anim');
	} else {
		playerHand.classList.add('player-shape-anim');
	}

	if (computerShape === 'scissors') {
		computerHand.classList.add('computer-shape-scissors-anim');
	} else {
		computerHand.classList.add('computer-shape-anim');
	}
};

const cleanAfterChoisesAnimation = (playerHand, computerHand) => {
	playerHand.classList.remove('player-shape-anim', 'player-shape-scissors-anim');
    computerHand.classList.remove('computer-shape-anim', 'computer-shape-scissors-anim');
};

const addEndTransform = (playerHand, computerHand, playerShape, computerShape) => {
	if (playerShape === 'scissors') {
		playerHand.classList.add('player-hand-scissors-end-transform');
	} else {
		playerHand.classList.add('player-hand-end-transform');
	}

	if (computerShape === 'scissors') {
		computerHand.classList.add('computer-hand-scissors-end-transform');
	} else {
		computerHand.classList.add('computer-hand-end-transform');
	}
};

// Third step - Manage results.

const updateScore = (winnerStr) => {
	const playerScoreElement = document.getElementById('player-score');
	const computerScoreElement = document.getElementById('computer-score');
	const playerScore = playerScoreElement.firstElementChild;
	const computerScore = computerScoreElement.firstElementChild;

	if (winnerStr === 'player') {
		playerPoints++;
		playerScore.textContent = playerPoints;
	} else if (winnerStr === 'computer') {
		computerPoints++;
		computerScore.textContent = computerPoints;
	}
};

const runWinnerAnimation = (playerHand, computerHand, winnerStr) => {
	if (winnerStr === 'player') {
		playerHand.classList.add('winner-hand-anim', 'player-hand-shape-transform');
		computerHand.classList.add('lost-hand-anim', 'computer-hand-shape-transform');
	} else if (winnerStr === 'computer') {
		playerHand.classList.add('lost-hand-anim', 'player-hand-shape-transform');
		computerHand.classList.add('winner-hand-anim', 'computer-hand-shape-transform');
	} else { // Draw.
		playerHand.classList.add('draw-hand-anim', 'player-hand-shape-transform');
		computerHand.classList.add('draw-hand-anim', 'computer-hand-shape-transform');
	}
};

// Fourth step - Clear hands.

const backToEmptyHands = (playerHand, computerHand) => {
	if (playerHand.textContent !== String.fromCodePoint(0x1F44A)) {
		playerHand.innerHTML = '&#x1F44A;';
		computerHand.innerHTML = '&#x1F44A;';
		playerHand.className = '';
		computerHand.className = '';
		playerHand.classList.add('game-hand', 'player-hand-transform');
		computerHand.classList.add('game-hand', 'computer-hand-transform');
	}
};