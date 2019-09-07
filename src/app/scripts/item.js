import { Sprite } from 'kontra';
export class Item extends Sprite {
    constructor(x, y, height, width, color, pickup, effect) {
        super();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.effect = effect;
        this.active = true;
        this.pickup = pickup;
    }
}