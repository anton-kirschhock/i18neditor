import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslationNode } from '../../helpers';
import { Languages } from '../../step1/step1.component';
@Component({
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
  ],
  selector: 'app-add-modal',
  templateUrl: 'add-modal.component.html',
  styleUrl: 'add-modal.component.scss',
})
export class AddModalComponent implements OnInit {
  newNode: TranslationNode = { key: '' };

  constructor(
    private dialogRef: MatDialogRef<AddModalComponent>,
    @Inject(MAT_DIALOG_DATA) public languages: Languages[]
  ) {
    languages.forEach((lang) => {
      this.newNode[lang] = '';
    });
  }

  ngOnInit() {}

  addNode() {
    if ((this.newNode.key ?? '').length > 0) {
      this.dialogRef.close(this.newNode);
    }
  }
}
