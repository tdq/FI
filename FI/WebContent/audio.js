var audioContext = new AudioContext();
var oscillator = audioContext.createOscillator('square');
oscillator.frequency.value = 440;
oscillator.connect(audioContext.destination);

function playSound() {
	oscillator.start(0);
	oscillator.stop(5);
}