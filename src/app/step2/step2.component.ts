import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgForOf, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { TranslationNode } from '../helpers';
import { Languages } from '../step1/step1.component';
import { AddModalComponent } from './add/add-modal.component';

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
    ScrollingModule,
  ],
})
export class Step2Component implements OnInit {
  @Input() nodes!: TranslationNode[];
  @Input() languages: Languages[] = [];
  filteredNodes!: TranslationNode[];
  filterText = '';
  constructor(private dialog: MatDialog) {}
  ngOnInit() {
    this.onFilter();
  }

  onFilter() {
    this.filteredNodes = this.nodes.filter(
      (item) =>
        item.key.toLowerCase().indexOf(this.filterText.toLowerCase()) !== -1
    );
  }
  clearFilter() {
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

  openAddDialog() {
    this.dialog
      .open(AddModalComponent, {
        width: '75vw',
        data: this.languages,
      })
      .afterClosed()
      .subscribe((res) => {
        if (res !== undefined) {
          this.nodes.push(res as TranslationNode);
          this.filterText = '';
          this.onFilter();
        }
      });
  }

  sort(languages: Languages[]) {
    return languages.sort((a, b) => {
      if (a < b) return -1;
      else if (a > b) return 1;
      else return 0;
    });
  }
}
