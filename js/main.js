$(document).ready(function() {
	var guess_game = new Game();
	$("#game_square").on("click", "a", function() {
		handleGuess();
	})


	$("#game_square").on("keypress", "input", function(e) {
		if(e.keyCode==13){
			handleGuess();
		}
	})

	$(".new_game").on("click", function() {
		guess_game.reset();
		$("#err").text("");
		$("#turns").text("You have 5 turns remaining.");
		$("#response").text("Try to guess the number between 1 and 100!");
		$("#warm_guesses").text("");
		$("#cold_guesses").text("");
		$("#endgame").fadeOut();
	})

	$("#right_btn").on("click", function() {
		$("#end_msg").text("The number is " + guess_game.getNum() + ".")
		$("#endgame").css("background-color", "red");
		$("#endgame").fadeIn();
	})

	//Runs every time player makes a guess
	function handleGuess() {
		var num = $("#guess_field").val();
		var guess_result = guess_game.checkGuess(num);
		if (guess_game.turnsLeft() === 0 ) {
			$("#turns").text("You have no turns remaining.");
		} else {
			$("#turns").text("You have " + guess_game.turnsLeft() + " turns remaining.");
		}

		//IF statement checks whether the previous guess was valid
		//Also checks a single character from string returned by checkGuess
		//Purpose is to determine whether the last guess was correct or whether the game is over
		//If previous guess was invalid, message returned by checkGuess will be displayed as an error
		if(guess_result[1][0]==="C") {
			$("#end_msg").text(guess_result[1])
			$("#endgame").css("background-color", "#35b")
			$("#endgame").fadeIn();
		}
		else if(guess_result[1][1]==="a") {
			$("#end_msg").text(guess_result[1])
			$("#endgame").css("background-color", "red")
			$("#endgame").fadeIn();
		}
		else if(guess_result[0]===true) {
			$("#response").text(guess_result[1]);
			$("#warm_guesses").text(guess_game.prevGuesses()[0]);
			$("#cold_guesses").text(guess_game.prevGuesses()[1]);
			$("#err").text("");
		} else {
			$("#err").text(guess_result[1]);
		}
		$("#guess_field").val("");
		$("#guess_field").focus();
	}
});

var Game = function Game() {
	var prev_guesses = [];
	var num = Math.floor(Math.random()*100) + 1;
	var turns_left = 5;
	var game_over = false;

	//Checks user's guess against num
	//returns an array containing a boolean value indicating whether the guess was valid, and a string containing either an error message or hot/cold response
	this.checkGuess = function checkGuess(guess_num) {
		var num_in=Number(guess_num);
		if((num_in>=1) && (num_in<=100) && (game_over === false) && (prev_guesses.indexOf(num_in) === -1)) {
			turns_left--;
			if (turns_left === 0) { game_over = true};
			if(num_in===num){
				game_over=== true;
				return [true, "Correct! The number was " + num + "!"];
			}
			else if (game_over===true) {
				return [true, "Game over! The number was " + num + "."];
			}
			else if (num_in > num) {
				prev_guesses.push(num_in);
				return [true, colderWarmer() + " Guess lower."];
			} else {
				prev_guesses.push(num_in);
				return [true, colderWarmer() + " Guess higher."];
			}
		} else if (game_over === true) {
			return [false, "This game has ended. Click 'New Game' to play again."];
		} else if (((num_in<1) || (num_in>100)) && (guess_num.length > 0)) {
			return [false, "You may only guess numbers between 1 and 100!"];
		} else if (prev_guesses.indexOf(num_in) !== -1) {
		 	return [false, "You have already guessed " + num_in + "!"];
		} else if (guess_num.length > 0) {
			return [false, "You may only use numerical characters!"];
		}
	};
	this.gameOver = function gameOver() { return game_over };
	this.getNum = function getNum() {return num};
	this.prevGuesses = function prevGuesses() {
		var warm = [];
		var cold = []; 
		var cold_str="";
		var warm_str="";
		for(var i=0; i<prev_guesses.length; i++) {
			if(Math.abs(prev_guesses[i]-num) < 20) {
				warm.push(prev_guesses[i]);
			} else {
				cold.push(prev_guesses[i]);
			}
		}
		if (warm.length > 0) { warm_str = "Warm Guesses: " + warm.join(", ") };
		if (cold.length > 0) { cold_str = "Cold Guesses: " + cold.join(", ") };
		return [warm_str, cold_str];
	};
	this.reset = function reset() {
		prev_guesses = [];
		turns_left = 5;
		game_over = false;
		num = Math.floor(Math.random()*100) + 1;
	};
	this.turnsLeft = function turnsLeft() { return turns_left};

	//Returns a string indicating whether the last guess was hot/cold, and whether it was hotter/colder than the previous guess
	function colderWarmer() {
		var i = prev_guesses.length - 1;
		var last_guess = prev_guesses[i];
		var diff = Math.abs(last_guess - num);
		var str = "";
		if (diff <= 5) {
			str += "You are very hot. ";
		} else if (diff <= 10) {
			str += "You are hot. ";
		}
		else if (diff <= 20) {
			str+= "You are warm. ";
		}
		else {
			str += "You are cold. ";
		}
		if (Math.abs(last_guess - num) < 20) { str}
		if (i===0) { 
			return str;
		}
		else if (Math.abs(prev_guesses[i]-num) > Math.abs(prev_guesses[i-1]-num)) {
			str += "Getting colder!";
		}
		else if (Math.abs(prev_guesses[i]-num) < Math.abs(prev_guesses[i-1]-num)) {
			str += "Getting warmer!";
		} else {
			str += "Just as far off as your last guess.";
		}
		return str;
	}
}