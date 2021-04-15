const init = (game: Phaser.Game) => {
  game.registry.set("bestScore", 0);
  game.registry.set("gradingLevel", 0);
  window.parent.postMessage({ eventName: "onReady", id: window.name }, "*");

  window.addEventListener("message", (e: MessageEvent) => {
    if (e.data.eventName === "setCurrentState") {
      game.registry.set("bestScore", e.data.score);
      game.registry.set("gradingLevel", e.data.gradingLevel);
    }

    if (e.data.eventName === "setBestScore") {
      game.registry.set("bestScore", e.data.score);
    }
  });
};

const onGameOver = (game: Phaser.Game, score: number) => {
  if (game.registry.get("bestScore") <= score) {
    game.registry.set("bestScore", score);
  }
  window.parent.postMessage({ eventName: "updateScore", id: window.name, score }, "*");
};

export default { init, onGameOver };
