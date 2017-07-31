import {
    Directive,
    ElementRef,
    Input,
    OnInit,
    HostBinding
} from '@angular/core';

@Directive({
    selector: '[appElementScale]'
})
export class ScaleDirective implements OnInit {

    @Input() jackpot: number;
    @Input() total: number;

    /**
     *
     * @param {ElementRef} el
     */
    constructor(private el: ElementRef) {
    }

    // @HostListener('mouseenter')
    // onMouseEnter() {
    // }
    // @HostListener('mouseleave')
    // onMouseLeave() {
    // }


    calculateScale() {
        const size = this.total ? 1 / this.jackpot / this.total : 0;
        let sizeString = size.toString();
        sizeString = sizeString.replace('0.', '1.').replace('0', '');
        return 'scale(' + sizeString + ')';
    }

    ngOnInit() {
        this.scaleElement(this.calculateScale());
    }

    private scaleElement(scale: any) {
        this.el.nativeElement.style.transform = scale;
    }
}
