import {Injectable} from '@angular/core';
import {denodeify} from "q";

@Injectable()
export class IconGeneratorService {

    constructor() {
    }


    public generate(address: string) {

        return new Promise((resolve) => {

            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const context = canvas.getContext('2d');
            context.scale(8, 8);

            const hex_address = address.replace('x', '0').toLowerCase();
            if (hex_address.match(/[0-9a-f]{42}/g)) {
                const hex_list = hex_address.match(/(.{1,6})/g);
                let old_point_x = 0;
                let old_point_y = 0;
                hex_list.forEach(hex => {
                    context.strokeStyle = '#' + hex;
                    const point_list = hex.match(/(.{1,2})/g);
                    point_list.forEach(point => {
                        const char_list = point.split('');
                        const point_x = parseInt(char_list[0], 16);
                        const point_y = parseInt(char_list[1], 16);

                        for (let i = 0; i < 4; i++) {
                            context.beginPath();
                            context.lineWidth = 1;
                            context.moveTo(old_point_x + 0.5, old_point_y);
                            context.lineTo(old_point_x + 0.5, point_y);
                            context.moveTo(old_point_x, point_y + 0.5);
                            context.lineTo(point_x, point_y + 0.5);
                            context.stroke();

                            context.translate(8, 8);
                            context.rotate(90 * Math.PI / 180);
                            context.translate(-8, -8);
                        }

                        old_point_x = point_x;
                        old_point_y = point_y;
                    })
                });
                resolve(canvas.toDataURL('image/png'));
            }
        });
    }
}
