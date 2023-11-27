import { Component } from '@angular/core';
import { TutorialService } from '../tutorial.service';

@Component({
    selector: 'app-prompt-tutorial',
    templateUrl: './prompt-tutorial.component.html',
    styleUrls: ['./prompt-tutorial.component.scss'],
})
export class PromptTutorialComponent {
    constructor(private tutorial: TutorialService) {}

    onYes(): void {
        this.tutorial.start();
    }
}
