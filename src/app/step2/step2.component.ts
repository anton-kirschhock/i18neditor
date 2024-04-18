import { NgForOf, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { TranslationNode } from '../helpers';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgForOf,
    NgIf,
    MatTableModule,
  ],
})
export class Step2Component implements OnInit {
  @Input() nodes!: TranslationNode[];
  filteredNodes!: TranslationNode[];
  filterText = '';
  newNode: TranslationNode = { key: '', en: '', fr: '', nl: '' };

  ngOnInit() {
    this.onFilter();
  }

  onFilter() {
    this.filteredNodes = this.nodes.filter(
      (item) => item.key.indexOf(this.filterText) !== -1
    );
  }
  clearFilter() {
    this.filterText = '';
    this.onFilter();
  }
  addNode() {
    this.nodes.push(this.newNode);
    this.newNode = { key: '', en: '', fr: '', nl: '' };
    this.filterText = '';
    this.onFilter();
  }

  removeNode(key: string) {
    const indexToRemove = this.nodes.findIndex((node) => node.key === key);
    let nodes = [...this.nodes];
    nodes.splice(indexToRemove, 1);
    this.nodes = [...nodes];
    this.onFilter();
  }
}
