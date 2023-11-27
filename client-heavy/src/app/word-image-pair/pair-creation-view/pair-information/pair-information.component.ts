import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { StrokeContainerService } from 'src/app/drawing/drawers/stroke-container/stroke-container.service';
import { ConstantsRepositoryService } from 'src/app/helpers/constants-repository.service';
import { PairCreatorService } from '../../pair-creator.service';

@Component({
    selector: 'app-pair-information',
    templateUrl: './pair-information.component.html',
    styleUrls: ['./pair-information.component.scss'],
})
export class PairInformationComponent implements OnInit {
    @Output() wantsGenerate: EventEmitter<void>;
    @Output() wantsEdit: EventEmitter<void>;
    @Output() wantsExit: EventEmitter<void>;
    @Output() wantsPreview: EventEmitter<void>;

    pairInfoForm: FormGroup;
    drawingModes: string[];

    constructor(
        public pairCreator: PairCreatorService,
        public constants: ConstantsRepositoryService,
        private strokeContainer: StrokeContainerService,
    ) {
        this.wantsGenerate = new EventEmitter();
        this.wantsEdit = new EventEmitter();
        this.wantsPreview = new EventEmitter();
        this.wantsExit = new EventEmitter();

        this.drawingModes = ['Classic', 'Random', 'Right', 'Down', 'Left', 'Up', 'Inside Out', 'Outside In'];
    }

    ngOnInit(): void {
        this.pairInfoForm = new FormGroup({
            word: new FormControl('', Validators.required),
            hints: new FormControl([], Validators.required),
        });
        this.pairCreator.hints.forEach((hint: string) => this.pairInfoForm.get('hints').value.push(hint));
    }

    addHint(event: MatChipInputEvent): void {
        const input: HTMLInputElement = event.input;
        const value: string = event.value;

        if (!this.pairCreator.hints.includes(value)) {
            if ((value || '').trim()) {
                this.pairCreator.hints.push(value.trim());
                this.pairInfoForm.get('hints').value.push(value);
                this.pairInfoForm.get('hints').updateValueAndValidity();
            }
        }

        if (input) {
            input.value = '';
        }
    }

    removeHint(hint: string): void {
        const index = this.pairCreator.hints.indexOf(hint);

        if (index >= 0) {
            this.pairCreator.hints.splice(index, 1);
            this.pairInfoForm.get('hints').value.splice(index, 1);
            this.pairInfoForm.get('hints').updateValueAndValidity();
        }
    }

    showGenerateView(): void {
        this.wantsGenerate.emit();
    }

    showEditView(): void {
        this.wantsEdit.emit();
    }

    showPreviewView(): void {
        this.wantsPreview.emit();
    }

    uploadPair(): void {
        this.pairCreator.buildPair();
        this.pairCreator.uploadPair();
    }

    backToMenu(): void {
        this.pairCreator.resetValues();
        this.strokeContainer.resetContainer();
        this.wantsExit.emit();
    }
}
