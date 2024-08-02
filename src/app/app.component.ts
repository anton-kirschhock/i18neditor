import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';
import { TranslationNode } from './helpers';
import { Languages, Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { Step3Component } from './step3/step3.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatButtonModule,
    MatCardModule,
    Step1Component,
    Step2Component,
    Step3Component,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  step = 1;
  nodes: TranslationNode[] = [];
  languages: Languages[] = [];

  next() {
    if (this.step === 1 && (!this.nodes || this.nodes.length === 0)) {
      return;
    }

    if (this.step < 3) {
      this.step++;
    }
  }

  prev() {
    if (this.step > 1) {
      this.step--;
    }
  }

  onUploaded($event: { nodes: TranslationNode[]; languages: Languages[] }) {
    this.nodes = $event.nodes;
    this.languages = $event.languages;
  }
}
