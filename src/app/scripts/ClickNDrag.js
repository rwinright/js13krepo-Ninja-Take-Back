import { pointer, onPointerUp, pointerPressed, pointerOver } from 'kontra';
export const ClickNDrag = (object, currentPlayer) => {
    if (pointerOver(object) && (pointerPressed('left') && object.isMoveable)) {
        if (currentPlayer === object.placer) {
            object.x = pointer.x - object.width / 2
            object.y = pointer.y - object.height / 2
        }
        else {
            // objects[i].x = objects[i].x
            // objects[i].y = objects[i].y
        }
    }
}