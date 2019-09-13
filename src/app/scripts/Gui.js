import { Sprite } from 'kontra';
export const Gui = (canvas) => {
    let gui = [];
    const ItemBG = Sprite({
        y: 0,
        x: 0,
        color: 'rgba(255,255,255, .3)',
        height: 60,
        width: canvas.width
    })

    const ItemBoxBottom = Sprite({
        x: 0,
        y: 50,
        height: 10,
        width: canvas.width,
        color: 'black'
    })

    const ItemBoxTop = Sprite({
        x: 0,
        y: 0,
        width: canvas.width,
        height: 10,
        color: 'black'
    })

    const ItemBoxLeft = Sprite({
        x: 0,
        y: 0,
        height: 50,
        width: 15,
        color: 'black'
    })

    const ItemBoxRight = Sprite({
        height: 50,
        width: 15,
        x: canvas.width - 15,
        y: 0,
        color: 'black'
    })

    const Divider = Sprite({
        height: 50,
        width: 20,
        x: canvas.width / 2,
        y: 0,
        color: 'black'
    })

    const StartButton = Sprite({
        x: 375,
        y: 50,
        height: 30,
        width: 70,
        color: 'green'
    })



    gui.push(ItemBG, ItemBoxBottom, ItemBoxTop, ItemBoxLeft, ItemBoxRight, Divider, StartButton);
    return gui;
}
