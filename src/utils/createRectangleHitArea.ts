type ObjectsType = Phaser.GameObjects.Sprite | Phaser.GameObjects.Text;

export const createRectangleHitArea = (object: ObjectsType, borderX = 0, borderY = 0) => {
  object.input.hitArea = new Phaser.Geom.Rectangle(
    borderX,
    borderY,
    object.width - borderX * 2,
    object.height - borderY * 2,
  );
  object.input.hitAreaCallback = Phaser.Geom.Rectangle.Contains;
  // object.scene.input.enableDebug(object);
};
