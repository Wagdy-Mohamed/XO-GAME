document.addEventListener('DOMContentLoaded', () => {
    const playWithFriendButton = document.getElementById('playWithFriend');
    const playAloneButton = document.getElementById('playAlone');
    const player1Input = document.getElementById('player1Name');
    const player2Input = document.getElementById('player2Name');

    playWithFriendButton.addEventListener('click', () => {
        const player1Name = player1Input.value.trim() || 'Player 1';
        const player2Name = player2Input.value.trim() || 'Player 2';
        window.location.href = `play.html?player1=${encodeURIComponent(player1Name)}&player2=${encodeURIComponent(player2Name)}`;
    });

    playAloneButton.addEventListener('click', () => {
        const playerName = player1Input.value.trim() || 'You';
        const aiName = 'wigoGPT';
        window.location.href = `play.html?player1=${encodeURIComponent(playerName)}&player2=${encodeURIComponent(aiName)}&ai=true`;
    });
});